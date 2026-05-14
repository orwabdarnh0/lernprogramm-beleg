# Lernprogramm – Beleg Webprogrammierung

## Übersicht
Dieses Projekt ist ein webbasiertes Lernprogramm als Progressive Web App (PWA).

Die Anwendung wurde für Desktop- und Smartphone-Ansichten optimiert.
Die Anwendung kann als PWA installiert und offline genutzt werden.

---

## Erfüllte Funktionen
- HTML5, CSS und JavaScript
- Strikter Modus in JavaScript
- DOM-Manipulation
- Lokale Fragen aus `data/questions.json`
- Kategorien:
  - Webtechnologien
  - Mathematik
  - Noten lernen
  - Allgemein
  - REST-API
- Zufällige Auswahl der Fragen
- Zufällige Reihenfolge der Antworten
- Progressbar
- Statistik während des Durchlaufs
- Endauswertung
- Responsive Design
- PWA mit `manifest.json`
- Service Worker für Offline-Nutzung
- REST-API-Anbindung per `fetch()`
- KaTeX für Mathematikfragen

---

## Projektstruktur

index.html  
manifest.json  
service-worker.js  
README.md  
DevLog.md  

css/  
  style.css  

js/  
  app.js  

data/  
  questions.json  

---

## REST-API

Die REST-API wird in `js/app.js` über folgende Konstante gesetzt:

const REST_URL = 'https://idefix.informatik.htw-dresden.de:8888/api/quizzes/';

---

## Start lokal

Projektordner öffnen und mit Live Server starten.

Alternative mit Python:

python -m http.server 8000

Dann im Browser öffnen:

http://localhost:8000

---

## Offline-Test

1. App einmal online laden.  
2. Chrome DevTools öffnen.  
3. Application → Service Workers.  
4. Offline aktivieren.  
5. Seite neu laden.  

---

## Genutzter Browser

Getestet mit Google Chrome / Chromium / Microsoft Edge.

---

## KI-Nutzung

Bei der Erstellung wurde ChatGPT zur Unterstützung bei Strukturierung, Codeerstellung und Fehleranalyse verwendet.

Der erzeugte Code wurde geprüft, angepasst und verstanden.