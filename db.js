// Persistenz über das zentrale ToolsUebersicht-Login-Gateway.
// Adaptiert aus E:\materialbedarf\db.js (gleiches Gateway-Muster).
const GATEWAY_URL = "https://landingpage.michel-brunner.workers.dev";
const TOKEN_STORAGE_KEY = "tu_session_token";
const GATEWAY_APP_ID = "raumnutzung";

class NotLoggedInError extends Error {
  constructor(message) {
    super(message || "Nicht angemeldet");
    this.name = "NotLoggedInError";
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message || "Daten wurden zwischenzeitlich von einem anderen Gerät geändert");
    this.name = "ConflictError";
  }
}

// ETag des zuletzt geladenen/geschriebenen Stands. Wird bei dav-save mitgeschickt,
// damit der Worker Konflikte (anderes Gerät hat inzwischen gespeichert) erkennt.
let gatewayRev = null;

function getSessionToken() {
  try { return localStorage.getItem(TOKEN_STORAGE_KEY); } catch (_) { return null; }
}

async function gatewayRequest(payload) {
  const token = getSessionToken();
  if (!token) { if (typeof raeumeBeiSitzungsverlust === "function") raeumeBeiSitzungsverlust(); throw new NotLoggedInError(); }
  const resp = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
    body: JSON.stringify(payload)
  });
  if (resp.status === 401) { if (typeof raeumeBeiSitzungsverlust === "function") raeumeBeiSitzungsverlust(); throw new NotLoggedInError("Sitzung abgelaufen"); }
  if (resp.status === 403) throw new Error("Kein Zugriff auf dieses Tool.");
  if (resp.status === 409) throw new ConflictError();
  if (!resp.ok) throw new Error(`Gateway-Fehler (HTTP ${resp.status})`);
  return resp.json();
}

// Das "me" aus der letzten dav-load-Antwort. Der Worker legt es bei, weil er
// nutzer.json und die Rechte-Datei fuer diesen Request ohnehin gelesen hat --
// der erste fetchMe() nach dem Laden kommt damit ohne eigenen Roundtrip aus.
let gatewayMe = null;

async function gatewayLoad() {
  const body = await gatewayRequest({ action: "dav-load", app: GATEWAY_APP_ID });
  gatewayRev = typeof body.rev === "string" ? body.rev : null;
  gatewayMe = (body.me && typeof body.me === "object") ? body.me : null;
  return body.data; // Objekt oder null (Datei noch nicht vorhanden)
}

async function gatewaySave(dataObj) {
  const payload = { action: "dav-save", app: GATEWAY_APP_ID, data: dataObj };
  if (gatewayRev) payload.rev = gatewayRev;
  const body = await gatewayRequest(payload);
  gatewayRev = typeof body.rev === "string" ? body.rev : null;
}

// Letzter Rettungsversuch beim Verlassen der Seite. Ein normaler fetch wird beim
// Entladen abgebrochen -- mit keepalive ueberlebt der Request das Schliessen des
// Tabs. Betrifft zwei Faelle: einen noch nicht abgelaufenen Debounce-Timer und
// einen gerade laufenden Schreibvorgang.
// Bewusst MIT gatewayRev: ein unbedingter Schreibvorgang wuerde hier zwar immer
// durchgehen, koennte aber die Aenderung eines anderen Geraets ueberschreiben,
// ohne dass es jemand merkt. Lieber ein wirkungsloser 409 als stiller fremder
// Datenverlust.
//
// Grenze: Browser erlauben fuer keepalive-Requests nur 64 KB Body. Groessere
// Datenbestaende gehen auf diesem Weg gar nicht raus -- deshalb meldet die
// Funktion zurueck, ob sie abschicken konnte; der Aufrufer (beforeunload in
// app.js) fragt dann stattdessen nach. Hier besonders wahrscheinlich, solange
// eine Unterschrift noch inline im Antrag steckt: lagereUnterschriftenAus()
// laeuft auf diesem Weg nicht mehr.
//
// ⚠️ GETEILTER FLOTTEN-BAUSTEIN. Wortgleich in spielstatistik/db.js,
// Materialliste/db.js und zwoelf weiteren Apps -- es gibt keinen Build-Step,
// also wird kopiert. Wer eine Fassung aendert, zieht die anderen mit.
const KEEPALIVE_MAX_BYTES = 64 * 1024;

function gatewaySaveBeacon(dataObj) {
  const token = getSessionToken();
  if (!token) return false;
  const payload = { action: "dav-save", app: GATEWAY_APP_ID, data: dataObj };
  if (gatewayRev) payload.rev = gatewayRev;
  const body = JSON.stringify(payload);
  if (new Blob([body]).size > KEEPALIVE_MAX_BYTES) return false;
  try {
    fetch(GATEWAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body,
      keepalive: true
    });
    return true;
  } catch (_) {
    return false; // z.B. wenn der Browser den keepalive-Request doch ablehnt
  }
}

// Liefert {username, isAdmin, groupIds, vorname, nachname, mannschaften, canEdit} der eingeloggten Person.
async function fetchMe() {
  // Genau EINMAL aus dem letzten dav-load bedienen, danach wieder echt fragen:
  // ein spaeterer Aufruf will den aktuellen Stand (etwa nach einem Rechte-
  // wechsel), nicht eine beliebig alte Kopie. Faellt von selbst auf den Request
  // zurueck, wenn der Worker das Feld noch nicht mitschickt.
  if (gatewayMe) { const me = gatewayMe; gatewayMe = null; return me; }
  return gatewayRequest({ action: "me", app: GATEWAY_APP_ID });
}

// Liefert {users:[{username,displayName}]} — alle mit Bearbeiten- ODER
// Administrieren-Recht für dieses Tool. Auswahlquelle für die Verteilerliste in
// den Einstellungen: der Worker lässt die Meldung nur an Berechtigte durch, eine
// allgemeine Nutzerliste böte hier also Haken an, die nichts bewirken.
async function fetchToolEditors() {
  return gatewayRequest({ action: "list-tool-editors", app: GATEWAY_APP_ID });
}

// Meldet einen Vorgang beim Gateway. Der EMPFÄNGER wird dort serverseitig aus
// dem Datensatz bzw. den Rechten bestimmt — diese App schickt bewusst keinen
// Nutzernamen mit, sonst könnte ein Bearbeiter beliebige Leute benachrichtigen
// lassen und ein Tippfehler liefe unbemerkt ins Leere.
async function gatewayVorgangPush(art, id) {
  return gatewayRequest({ action: "vorgang-push", app: GATEWAY_APP_ID, art, id });
}

// Unterschriften liegen als eigene PNG-Dateien im dateien/-Ordner der App statt
// als base64-DataURL inline in der JSON. Sonst wüchse die Gesamtdatei mit jedem
// Antrag um mehrere Zehn-KB und jedes Speichern übertrüge alle Unterschriften
// erneut (gleiches Muster wie TrainerCheckliste und Trainerdaten).
async function gatewayFilePut(id, name, dataBase64) {
  return gatewayRequest({
    action: "dav-file-put", app: GATEWAY_APP_ID, id, name,
    contentType: "image/png", dataBase64
  });
}

async function gatewayFileDelete(id) {
  return gatewayRequest({ action: "dav-file-delete", app: GATEWAY_APP_ID, id });
}

// Holt eine ausgelagerte Unterschrift und liefert sie als PNG-DataURL ("" bei 404/Fehler).
async function gatewayFileGetDataUrl(id) {
  const token = getSessionToken();
  if (!token) { if (typeof raeumeBeiSitzungsverlust === "function") raeumeBeiSitzungsverlust(); throw new NotLoggedInError(); }
  let resp;
  try {
    resp = await fetch(GATEWAY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
      body: JSON.stringify({ action: "dav-file-get", app: GATEWAY_APP_ID, id })
    });
  } catch (_) { return ""; }
  if (!resp.ok) return "";
  const blob = await resp.blob();
  if (!blob.size) return "";
  return new Promise((resolve) => {
    const fr = new FileReader();
    fr.onload = () => resolve(String(fr.result || ""));
    fr.onerror = () => resolve("");
    fr.readAsDataURL(blob);
  });
}
