# SwapMyContact – Release Notes

Version: 0.1.6 (versionCode 26)
Release-Datum: 2025-12-23

## Highlights
- IAP: Verbesserte Stabilität und klarere Fehlermeldungen beim Kauf.
- Premium-Dialog: Darstellung Titel/Laufzeit/Preis pro Einheit weiter verfeinert.
- Diverse kleinere Bugfixes und Optimierungen.

## Abo-Informationen
- Titel: SwapMyContact Pro
- Länge: Laut Store-Konfiguration (z. B. 1 Jahr / 1 Monat)
- Preis: Wird im Play Store angezeigt (z. B. „€9,99 pro Jahr“)
- Auto-Renewal: Verlängert sich automatisch, sofern nicht mindestens 24 Stunden vor Ablauf gekündigt.
- Verwaltung: Im Google Play-Konto verwalten/kündigen.

## Änderungen
- IAP: `initConnection` vor Produktabruf, plattformspezifische Product IDs, klarere Fehler bei fehlender Produktkonfiguration.
- UI: PremiumDialog nutzt Store-Daten (Titel/Laufzeit/Preis-pro-Einheit) verlässlich.

## Artefakt
- Pfad: `android/app/build/outputs/bundle/playRelease/app-play-release.aab`

## Datenschutz & Nutzungsbedingungen
- Datenschutz: https://swapmycontact.de/datenschutz.html
- Google Play Bedingungen: https://play.google.com/about/play-terms/

## Hinweise
- Interne Testspur empfohlen, um IAP mit Testern zu verifizieren (Product ID Android: `Swap2025_11`).
