# 🏛️ Raumnutzung

Das Formular „Raumnutzung für Veranstaltungen" des **Landkreises Eichsfeld**
(Liegenschaftsamt) — ausgefüllt in der App, herausgekommen als fertiges
Original-PDF für die Einreichung. Kein Abtippen mehr, kein handschriftlich
verunglückter Antrag, und alle bisherigen Anträge bleiben nachlesbar.

**➡️ [Raumnutzung öffnen](https://sc1911heiligenstadt.github.io/raumnutzung/)**

## Was drin ist

| Reiter | Wofür |
|---|---|
| **Anträge** | Die laufenden Anträge auf Raumnutzung mit ihrem Stand — Entwürfe, fertig gemeldete und eingereichte, mit Status-Filter und dem Sammelexport „Alle als PDF-ZIP“ |
| **Archiv** | Was der Landkreis genehmigt oder abgelehnt hat — nachlesbar, weiter als PDF ausgebbar, mit eigenem Filter und eigenem Sammelexport |
| **Antrag** | Das Formular selbst, inklusive Unterschriftsfläche |
| **Einstellungen** | Der Verteiler: wer über fertig gemeldete Anträge eine Nachricht aufs Handy bekommt |
| **Info** | Was die App kann, die Änderungen und der Datenschutzhinweis — für alle sichtbar |

## Der Weg eines Antrags

1. Ein Trainer legt den Antrag an und füllt ihn aus. Ein neuer Antrag ist bereits so
   vorbelegt wie das zuletzt eingereichte Formular; Eingaben werden laufend gesichert.
2. Die Veranstaltungsleitung **unterschreibt direkt in der App** — mit Maus, Finger oder
   Stift. Der Unterschriftsblock der Schulleitung bleibt leer, den zeichnet die Schule
   auf dem Ausdruck.
3. Der Knopf **„Fertig zum Einreichen“** ist der Übergabepunkt. Er setzt den gleichnamigen
   Status und meldet den Einreichenden eine Nachricht aufs Handy.
4. Die **Geschäftsstelle** erzeugt das Original-PDF, schickt es per E-Mail ans
   Schulverwaltungsamt und setzt den Status. Den Status bewegt nur sie — sonst könnte ein
   Antrag auf „Eingereicht“ stehen, ohne dass ihn je jemand eingereicht hat.

Ein bestehender Antrag lässt sich als Vorlage kopieren; die Unterschrift wird dabei
bewusst nicht mitkopiert.

## Das Formular

Es folgt Punkt für Punkt dem Original des Landkreises: Veranstaltung (1.–3.),
**Ablaufplan** (4.), **erwartete Teilnehmer** (5.), **Unterstützung durch
technisches Personal** (6.), **Beheizung / Heizzeitverlängerung** (7.),
**Verkauf/Ausgabe von Speisen und Getränken** (8.) sowie **Szenen-, Bühnen- und
Besucherflächen** (9.). Dazu Veranstaltungsleiter/in samt Vertretung, private
Anschrift und die Unterschrift der Veranstaltungsleitung.

Aus den Eingaben entsteht das ausgefüllte Original-PDF — nicht ein Nachbau,
sondern das Formular des Landkreises selbst. Es bleibt ausfüllbar, falls das Amt
Rückfragen hat. Mit **„Per E-Mail senden“** geht dasselbe PDF direkt ans
Schulverwaltungsamt des Landkreises, Kopie an die Geschäftsstelle; Betreff und
Anschreiben sind fest hinterlegt.

## Wichtig: nicht die Platzbelegung

Hier geht es um den **Antrag beim Landkreis** für eine Veranstaltung. Der eigene
Wochenplan der Trainingsplätze und Hallenzeiten steht in der
[Platzbelegung](https://sc1911heiligenstadt.github.io/platzbelegung/).

## Zugang

Die Anmeldung läuft über die [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) — dort einmal anmelden, danach ist dieses Werkzeug offen.

Das Werkzeug ist auf einen begrenzten Kreis beschränkt, weil das Formular private
Anschriften und Telefonnummern enthält.

Die Rechte gelten in drei Stufen: **Sehen** (Anträge und Archiv ansehen,
schreibgeschützt), **Bearbeiten** (Anträge anlegen, ausfüllen, kopieren und
unterschreiben) und **Administrieren** (die drei Ausgabewege — das amtliche PDF
erzeugen, per E-Mail einreichen und der Sammelexport —, dazu der Status eines Antrags
und der Reiter *Einstellungen*). Wer welche Stufe hat, legt die Tools-Übersicht fest.

Die Arbeitsteilung dahinter: ausfüllen darf jeder Bearbeiter, das fertige Formular ans
Amt herausgeben ist Sache der Geschäftsstelle. Beim Mailversand steht diese Schranke
auch auf dem Server, nicht nur am ausgeblendeten Knopf.

## Lokal starten

Über den Eintrag `raumnutzung` in `E:\.claude\launch.json` — der Server läuft dann auf `http://localhost:8802/`.

## Technik

Vanilla JavaScript ohne Build-Schritt — die Dateien werden so ausgeliefert, wie sie im Repo liegen. Veröffentlicht über GitHub Pages. Die Daten liegen in der Vereins-Nextcloud; der Zugriff läuft ausschließlich über den Login-Worker der Tools-Übersicht, nie mit Zugangsdaten im Browser.

Das PDF wird **lokal im Browser** befüllt. Die dafür nötige PDF-Bibliothek wird
erst geladen, wenn wirklich ein Antrag erzeugt wird — beim Aufrufen der Seite
kostet sie nichts.

---

Ein Werkzeug des 1. SC 1911 Heiligenstadt. Alle Werkzeuge auf einen Blick: [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) · Erklärungen im [Toolbox Wiki](https://sc1911heiligenstadt.github.io/Vereinswiki/).
