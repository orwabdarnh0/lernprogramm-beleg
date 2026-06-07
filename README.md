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

Die Aufgaben werden per fetch() von der bereitgestellten WebQuiz-REST-API geladen.

Die Auswertung der REST-Aufgaben erfolgt über den Endpoint `/solve`.
Die ausgewählte Antwort wird an den Server gesendet und dort überprüft.

---

## Weblink

Die Anwendung wurde auf dem HTW-Webserver veröffentlicht und ist über folgenden Link erreichbar:

https://www2.htw-dresden.de/~s88439/Lernprogramm/

## Lokaler Start

Für die lokale Entwicklung kann das Projekt mit Visual Studio Code (Live Server) oder alternativ mit einem lokalen Webserver gestartet werden.

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



## Repository

GitHub Repository:
https://github.com/orwabdarnh0/lernprogramm-beleg


## Autor

Name: Arwa Bdarneh

S-Nummer: s88439

Studiengang: informatik-2024


