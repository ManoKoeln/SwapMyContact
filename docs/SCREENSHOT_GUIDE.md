# iPad 13" Screenshots Guide (Apple Guideline 2.3.3)

Erzeuge echte iPad‑Screenshots (kein gestrecktes iPhone) direkt aus dem iPad Pro 13" (M4) Simulator.

## Schritte
1. Simulator starten (iPad Pro 13" (M4)) und App öffnen

```zsh
xcrun simctl boot 6E487418-8E8F-4388-A416-81706801CCEC
xcrun simctl launch 6E487418-8E8F-4388-A416-81706801CCEC com.businesscard2025.swapcontactnew
```

2. Relevante Views öffnen und jeweils Screenshot erstellen

```zsh
mkdir -p ./screenshots
xcrun simctl io 6E487418-8E8F-4388-A416-81706801CCEC screenshot ./screenshots/ipad13-home.png
xcrun simctl io 6E487418-8E8F-4388-A416-81706801CCEC screenshot ./screenshots/ipad13-profile-list.png
xcrun simctl io 6E487418-8E8F-4388-A416-81706801CCEC screenshot ./screenshots/ipad13-edit-profile.png
xcrun simctl io 6E487418-8E8F-4388-A416-81706801CCEC screenshot ./screenshots/ipad13-settings.png
xcrun simctl io 6E487418-8E8F-4388-A416-81706801CCEC screenshot ./screenshots/ipad13-qr.png
```

Empfohlene Motive:
- Profil‑Liste (mit Premium‑Hinweis im Basic‑Modus)
- Profil bearbeiten
- QR/Sharing Funktion
- Sprache wechseln / Einstellungen
- Start-/Screens mit aktiven Features

3. Upload in App Store Connect
- Previews and Screenshots → „View All Sizes in Media Manager“ → iPad 13" auswählen → neue PNGs hochladen.

## Hinweise
- Keine Marketingmotive oder Splash/Login‑Screens als alleinige Screenshots.
- Zeige die App wirklich „in Benutzung“ (UI, Bedienelemente sichtbar).
- Achte auf Sprache/Übereinstimmung in allen unterstützten Lokalisierungen.
