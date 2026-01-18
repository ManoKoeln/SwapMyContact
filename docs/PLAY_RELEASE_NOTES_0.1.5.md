# SwapMyContact – Release Notes

Version: 0.1.5 (versionCode 25)
Release-Datum: 2025-12-23

## Highlights
- Premium-Abo-Dialog zeigt Titel, Laufzeit und Preis pro Einheit (Store-Lokalisierung).
- Stabilitätsverbesserungen und kleinere Bugfixes.

## Abo-Informationen
- Titel: SwapMyContact Pro
- Länge: 1 Jahr (je nach Store-Konfiguration kann auch „Monat“ angezeigt werden)
- Preis: Wird im Play Store angezeigt (z. B. „€9,99 pro Jahr“)
- Auto-Renewal: Verlängert sich automatisch, sofern nicht mindestens 24 Stunden vor Ablauf gekündigt.
- Verwaltung: Im Google Play-Konto verwalten/kündigen.

## Änderungen
- UI: PremiumDialog nutzt Store-Daten für Produkt-Titel, Laufzeit und Preis-pro-Einheit.
- IAP: Initialisierung vor Produktabruf; bessere Fehlermeldungen bei fehlender Produktkonfiguration.
- Build: Android Play-Flavor Release-Bundle erstellt (`:app:bundlePlayRelease`).

## Artefakt
- Pfad: `android/app/build/outputs/bundle/playRelease/app-play-release.aab`

## Datenschutz & Nutzungsbedingungen
- Datenschutz: https://swapmycontact.de/datenschutz.html
- Google Play Bedingungen: https://play.google.com/about/play-terms/

## Bekannte Themen
- Interne Testspur empfohlen, um IAPs mit Testern zu verifizieren.
- Bei Zahlungsfehlern (Play Billing) Tester/Bezahlmethode/Produkt-Setup prüfen.
