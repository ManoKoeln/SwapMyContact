# Play Console Upload-Checkliste

Diese Checkliste führt dich durch den Upload des AAB, die IAP-Prüfung und die interne Testspur.

## Artefakt
- AAB (Play-Flavor): `android/app/build/outputs/bundle/playRelease/app-play-release.aab`
- Generisches Release-AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- Aktueller `versionCode` (Gradle): 25 (`android/app/build.gradle`)

Hinweis: Für reine Gradle-Builds entscheidet der `versionCode` in `android/app/build.gradle`. `app.json` (`android.versionCode`) ist relevant, wenn EAS/Expo den Build steuert.

## Vorab-Prüfungen
- Bundle-ID stimmt: `com.businesscard2025.swapcontactnew`
- Play-Abonnement Product ID (Android): `Swap2025_11` in der Google Play Console vorhanden und aktiv.
- Base-Plan + Preis festgelegt, ggf. Intro-/Promo-Angebote korrekt konfiguriert.
- Tester (Lizenzierte Tester) sind hinterlegt.
- Gerät mit Google-Konto eingeloggt, Play Store aktuell.

## Upload in die Play Console
1. Öffne „Releases“ → Interne Testspur (empfohlen) oder Produktion.
2. „Neuen Release erstellen“.
3. AAB hochladen: `android/app/build/outputs/bundle/playRelease/app-play-release.aab`.
4. Release-Notes aus der Vorlage ausfüllen (`docs/PLAY_RELEASE_NOTES_TEMPLATE.md`).
5. Überprüfen: VersionCode 25, Versionsname `0.1.5` (falls angezeigt), Signatur OK.
6. Inhalt prüfen: Datenschutz, Sicherheit, Zielgruppe.
7. Veröffentlichung starten (Interne Testspur zuerst, dann Staged Rollout in Produktion).

## Interne Testspur – IAP Validierung
- Gerät vorbereiten:
  - Google-Konto angemeldet, Play Store aktuell, WLAN stabil.
  - Cache/Storage des Play Store ggf. leeren (Einstellungen → Apps → Google Play Store → Speicher → Cache löschen).
- App installieren (über Testspur oder internen Verteilungskanal).
- Kaufdialog öffnen und Kauf durchführen.
- Falls Fehler: „Google is indicating that we have some issue connecting to payment“
  - Ursachen & Fixes:
    - Tester nicht freigeschaltet: In der Play Console unter Testers hinzufügen.
    - Region/Bezahlmethode: Testkonto ohne gültige Zahlungsoption.
    - Produktkonfiguration unvollständig (Base-Plan, Preis, Status).
    - Play Billing Library/Store veraltet: Play Store aktualisieren, Gerät neu starten.
    - Offer-Token fehlt: Stelle sicher, dass dein Base-Plan ein aktives Offer hat (wir holen `offerToken` zur Laufzeit).

## Nützliche Kommandos
```zsh
# Artefakte listen
cd android
ls -la app/build/outputs/bundle/playRelease/
ls -la app/build/outputs/bundle/release/

# (optional) AAB erneut bauen
./gradlew :app:bundlePlayRelease
```

## Lokale AAB-Verifikation (optional, mit bundletool)
> Hinweis: Erfordert Java & bundletool. Ersetze die Keystore-Parameter durch deine Werte.
```zsh
# Beispiel mit Platzhaltern – bitte anpassen
java -jar bundletool-all.jar build-apks \
  --bundle app/build/outputs/bundle/playRelease/app-play-release.aab \
  --output app-play-release.apks \
  --mode universal \
  --ks credentials/android/keystore.jks \
  --ks-key-alias <KEY_ALIAS> \
  --ks-pass pass:<KEYSTORE_PASSWORD> \
  --key-pass pass:<KEY_PASSWORD>

# Installation auf verbundenem Gerät
java -jar bundletool-all.jar install-apks --apks app-play-release.apks
```

## Debugger-Frontend (dev-only) Fehlerbehebung
- ENOENT `@react-native/debugger-frontend ... de.json` (dev):
  - Abhängigkeiten neu installieren:
    ```zsh
    rm -rf node_modules
    npm ci
    ```
  - Release-Builds sind von dev-Abhängigkeiten entkoppelt; der AAB-Build war erfolgreich.
