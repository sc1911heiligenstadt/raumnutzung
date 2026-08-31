# 🏛️ Raumnutzung

Das Formular „Raumnutzung für Veranstaltungen" des **Landkreises Eichsfeld**
(Liegenschaftsamt) — ausgefüllt in der App, herausgekommen als fertiges
Original-PDF für die Einreichung. Kein Abtippen mehr, kein handschriftlich
verunglückter Antrag, und alle bisherigen Anträge bleiben nachlesbar.

**➡️ [Raumnutzung öffnen](https://sc1911heiligenstadt.github.io/raumnutzung/)**

## Was drin ist

| Reiter | Wofür |
|---|---|
| **Anträge** | Die laufenden Anträge auf Raumnutzung mit ihrem Stand |
| **Archiv** | Erledigte Anträge, nachlesbar |
| **Antrag** | Das Formular selbst |
| **Einstellungen** | Verwaltung |

## Das Formular

Es folgt Punkt für Punkt dem Original des Landkreises: Veranstaltung (1.–3.),
**Ablaufplan** (4.), **erwartete Teilnehmer** (5.), **Unterstützung durch
technisches Personal** (6.), **Beheizung / Heizzeitverlängerung** (7.),
**Verkauf/Ausgabe von Speisen und Getränken** (8.) sowie **Szenen-, Bühnen- und
Besucherflächen** (9.). Dazu Veranstaltungsleiter/in samt Vertretung, private
Anschrift und die Unterschrift der Veranstaltungsleitung.

Aus den Eingaben entsteht das ausgefüllte Original-PDF — nicht ein Nachbau,
sondern das Formular des Landkreises selbst.

## Wichtig: nicht die Platzbelegung

Hier geht es um den **Antrag beim Landkreis** für eine Veranstaltung. Der eigene
Wochenplan der Trainingsplätze und Hallenzeiten steht in der
[Platzbelegung](https://sc1911heiligenstadt.github.io/platzbelegung/).

## Zugang

Die Anmeldung läuft über die [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) — dort einmal anmelden, danach ist dieses Werkzeug offen.

Die Rechte gelten in drei Stufen: **Sehen** (Anträge ansehen), **Bearbeiten**
(Anträge stellen und pflegen) und **Administrieren** (Reiter *Einstellungen*).
Wer welche Stufe hat, legt die Tools-Übersicht fest.

## Lokal starten

Über den Eintrag `raumnutzung` in `E:\.claude\launch.json` — der Server läuft dann auf `http://localhost:8802/`.

## Technik

Vanilla JavaScript ohne Build-Schritt — die Dateien werden so ausgeliefert, wie sie im Repo liegen. Veröffentlicht über GitHub Pages. Die Daten liegen in der Vereins-Nextcloud; der Zugriff läuft ausschließlich über den Login-Worker der Tools-Übersicht, nie mit Zugangsdaten im Browser.

Das PDF wird **lokal im Browser** befüllt. Die dafür nötige PDF-Bibliothek wird
erst geladen, wenn wirklich ein Antrag erzeugt wird — beim Aufrufen der Seite
kostet sie nichts.

---

Ein Werkzeug des 1. SC 1911 Heiligenstadt. Alle Werkzeuge auf einen Blick: [Tools-Übersicht](https://sc1911heiligenstadt.github.io/ToolsUebersicht/) · Erklärungen im [Toolbox Wiki](https://sc1911heiligenstadt.github.io/Vereinswiki/).
