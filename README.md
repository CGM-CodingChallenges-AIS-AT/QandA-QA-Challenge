# Fragen und Antworten – QA-Coding-Challenge

Unser Team hat eine kleine Kundenanwendung entwickelt. Ein Entwickler vermutet, dass sich Teile der Anwendung nicht wie ursprünglich gewünscht verhalten. Du übernimmst die Rolle im QA-Team und prüfst ihre Qualität. Die bestehende Lösung besteht aus einem C#-/ASP.NET-Core-Backend und einem React-Frontend. Die automatisierten Tests verwenden TypeScript und Playwright.

## Ursprüngliche Kundenanforderung

Die Anwendung soll es ermöglichen, eine Frage mit einer oder mehreren Antworten zu hinterlegen und gespeicherte Fragen zu stellen:

- Eine Frage und jede einzelne Antwort dürfen jeweils höchstens 255 Zeichen lang sein.
- Zu jeder Frage gehört mindestens eine Antwort; die Anzahl der Antworten ist nicht begrenzt.
- Eine gestellte Frage muss **exakt** mit einer gespeicherten Frage übereinstimmen – keine unscharfe Suche.
- Bei einer gespeicherten Frage werden alle Antworten in der eingegebenen Reihenfolge angezeigt, jeweils in einer eigenen Zeile.
- Bei einer unbekannten Frage erscheint genau: `Die Antwort auf die Frage nach dem Leben, dem Universum und dem ganzen Rest ist 42.`
- Über die Browseroberfläche können Fragen sowohl hinzugefügt als auch gestellt werden.

## Deine Aufgabe

1. Erstelle für deine Änderungen einen Branch oder Fork dieses Starters.
2. Vergleiche die bestehende Implementierung und die vorhandenen Tests mit der Kundenanforderung.
3. Erweitere die TypeScript-/Playwright-Tests um aussagekräftige Szenarien auf UI- und/oder API-Ebene. Fehlgeschlagene Tests sollen reproduzierbar sein und zeigen, welche Anforderung verletzt wird.
4. Dokumentiere gefundene Fehler mit Schritten zur Reproduktion sowie erwartetem und tatsächlichem Verhalten. Fehler zu beheben ist optional; aussagekräftige Tests und eine klare Fehlerbeschreibung stehen im Vordergrund.
5. Stelle deine Änderungen in einem Git-Repository bereit und beschreibe kurz deine Teststrategie sowie die Befehle zum Ausführen der Tests.

Du kannst die Werkzeuge verwenden, mit denen du üblicherweise arbeitest. Konzentriere dich auf die QA-Aufgabe; du musst keine neue Anwendung entwickeln.

## Lokal starten

Voraussetzungen: .NET SDK 10, Node.js ab Version 22 und npm.

```text
cd backend\QandA.Api
dotnet run --urls http://127.0.0.1:5180
```

In einem zweiten Terminal:

```text
cd frontend
npm ci
npm run dev
```

Öffne http://127.0.0.1:5173. Vite leitet Anfragen an `/api` an das Backend weiter. Die Daten werden nur im Arbeitsspeicher gehalten und gehen bei einem Neustart des Backends verloren.

So startest du die vorhandenen Tests (die Playwright-Konfiguration startet beide Server automatisch):

```text
cd frontend
npm ci
npx playwright install chromium
npm run test:e2e
```

Hinweis: Scheitert `npx playwright install chromium` in einem Firmennetz mit `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`, hilft es, vorher die Zertifikate des Betriebssystems zu aktivieren:

```text
$env:NODE_OPTIONS='--use-system-ca'   # PowerShell
export NODE_OPTIONS=--use-system-ca   # bash
```

Die API akzeptiert `POST /api/questions` mit JSON `{ "question": "...", "answers": ["..."] }`; `GET /api/questions?question=...` gibt JSON `{ "answers": ["..."] }` zurück. Bereits gespeicherte Fragen können nicht erneut hinzugefügt werden (`409`); unvollständige Anfragen liefern `400`. Die Browseroberfläche verwendet dieselben Endpunkte. Die vorhandenen Tests bilden nur einen Einstieg und decken die Anforderungen nicht vollständig ab.
