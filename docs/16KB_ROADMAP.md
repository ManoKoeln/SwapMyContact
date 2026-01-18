# 16KB Page Size Support - Aktionsplan bis 31. Mai 2026

## ✅ Status Quo (7. Januar 2026)

### Erfolgreich ✅
- **Upload zu Google Play erfolgreich!** 
- Verlängerung bis **31. Mai 2026** gewährt
- `android:testOnly` Problem gelöst
- Build-Prozess funktioniert
- Version 0.2.3 (Build 53) ist live

### Aktuelles Problem ⚠️
- React Native 0.76.9 Libraries haben 4KB Page Alignment
- Google Play warnt über fehlenden 16KB Support
- 12 native Libraries betroffen (libreactnative.so, libhermes.so, etc.)

## 📅 Zeitplan & Meilensteine

### Phase 1: Januar 2026 - Monitoring ✅
**Status:** Abgeschlossen
- ✅ Upload-Problem gelöst (testOnly entfernt)
- ✅ Verlängerung beantragt und genehmigt
- ✅ React Native 0.77 getestet (inkompatibel mit Expo SDK 52)

### Phase 2: Februar-März 2026 - Expo SDK 53 Warten
**Ziel:** Upgrade auf Expo SDK 53 + React Native 0.77+

**Aufgaben:**
1. **Beobachte Expo Release-Zyklus**
   - Expo SDK 53 Beta voraussichtlich: Februar 2026
   - Expo SDK 53 Stable voraussichtlich: März 2026
   - Link: https://github.com/expo/expo/releases

2. **Prüfe React Native 0.77+ 16KB Support**
   - Issue verfolgen: https://github.com/facebook/react-native/issues/43444
   - Community Updates beobachten
   - Release Notes checken

3. **Testplan erstellen**
   - Neue Branch für SDK 53 Testing
   - Backup der aktuellen Version
   - Test-Builds durchführen

**Zeitaufwand:** 1-2 Tage pro Woche (Monitoring)

### Phase 3: April 2026 - Upgrade & Testing
**Ziel:** Migration auf Expo SDK 53

**Upgrade-Schritte:**
```bash
# 1. Backup erstellen
git checkout -b upgrade-expo-sdk-53
git commit -am "Backup before SDK 53 upgrade"

# 2. Expo SDK upgraden
npx expo install expo@latest
npx expo install --fix

# 3. Dependencies updaten
npm install react-native@latest
npx expo install --fix

# 4. Android Build testen
cd android
./gradlew clean bundlePlayRelease

# 5. 16KB Support verifizieren
bundletool dump manifest --bundle=app/build/outputs/bundle/playRelease/app-play-release.aab
~/Library/Android/sdk/ndk/27.0.12077973/toolchains/llvm/prebuilt/darwin-x86_64/bin/llvm-readelf -l \
  app/build/intermediates/merged_native_libs/playRelease/mergePlayReleaseNativeLibs/out/lib/arm64-v8a/libreactnative.so | grep Align

# 6. Test auf Gerät
./gradlew installPlayRelease
adb shell am start -n com.businesscard2025.swapcontactnew/.MainActivity
```

**Testing Checkliste:**
- [ ] App startet ohne Crash
- [ ] Alle Features funktionieren (Profile, QR-Code, Premium)
- [ ] Notes-Feld funktioniert
- [ ] Type-Dropdowns funktionieren
- [ ] In-App Purchase funktioniert
- [ ] Translations korrekt
- [ ] Performance akzeptabel
- [ ] 16KB Libraries vorhanden

**Zeitaufwand:** 3-5 Tage

### Phase 4: Mai 2026 - Deployment & Verifizierung
**Ziel:** Upload neue Version mit 16KB Support

**Deployment-Schritte:**
```bash
# 1. Version erhöhen
# In app.json:
# "version": "0.3.0"
# "buildNumber": "60"  (iOS)
# "versionCode": 60    (Android)

# 2. Production Build
cd android
./gradlew clean bundlePlayRelease

# 3. AAB kopieren
cp app/build/outputs/bundle/playRelease/app-play-release.aab ../../BUILD-60-16KB.aab

# 4. 16KB Support final prüfen
bundletool dump manifest --bundle=BUILD-60-16KB.aab | grep testOnly  # sollte leer sein
llvm-readelf -l app/build/.../libreactnative.so | grep "Align"       # sollte 0x4000 sein

# 5. Upload zu Google Play
# Via Console: Production Track
# Release Notes: "16KB page size support implemented"
```

**Verifizierung:**
- [ ] Google Play Console zeigt KEINE 16KB Warnung mehr
- [ ] Upload erfolgreich
- [ ] Review bestanden
- [ ] App läuft auf Android 15+ ohne Warnung

**Deadline:** Spätestens **25. Mai 2026** (Puffer für Review)

## 🔄 Alternative Strategien

### Plan B: Manuelle Library Re-Compilation (Falls SDK 53 nicht kommt)

**Wenn Expo SDK 53 bis 15. April nicht verfügbar:**

1. **Native React Native Modules selbst kompilieren**
   ```bash
   # Hermes Engine mit 16KB Flags bauen
   cd node_modules/hermes-engine/android
   # Build-Flags anpassen
   
   # React Native Core neu bauen
   cd node_modules/react-native/ReactAndroid
   # CMakeLists.txt anpassen
   ```

2. **Prebuilt Libraries patchen**
   ```bash
   # Verwende objcopy oder alternative Tools
   # Siehe: docs/16KB_MANUAL_PATCH.md
   ```

**Zeitaufwand:** 5-10 Tage (komplex)

### Plan C: EAS Build nutzen

**Vorteil:** Expo könnte automatisch 16KB Libraries bauen

```bash
# 1. EAS CLI installieren
npm install -g eas-cli
eas login

# 2. EAS Build konfigurieren
eas build:configure

# 3. Production Build in Cloud
eas build --platform android --profile production

# 4. AAB herunterladen und verifizieren
```

**Zeitaufwand:** 1-2 Tage
**Kosten:** Free tier (5 Builds/Monat) oder $29/Monat

## 📊 Risiko-Management

### Hohes Risiko ⚠️
- **Expo SDK 53 kommt zu spät** (nach 15. April)
  - **Mitigation:** Starte Plan B (manuelle Kompilierung)
  - **Alternative:** EAS Build testen

- **React Native 0.77+ inkompatibel mit Expo SDK 53**
  - **Mitigation:** Community Patches nutzen
  - **Alternative:** Warte auf SDK 53.1 Bugfix

### Mittleres Risiko 📋
- **Upgrade bricht bestehende Features**
  - **Mitigation:** Ausführliches Testing vor Release
  - **Backup:** Aktuelle Version bleibt verfügbar

- **Google verschärft Deadline**
  - **Mitigation:** Früher upgraden (März statt April)
  - **Kommunikation:** Proaktiv mit Google kommunizieren

### Niedriges Risiko ✅
- **Build-Prozess funktioniert nicht**
  - **Mitigation:** Dokumentation vorhanden, Erfahrung da
  - **Support:** Expo/React Native Community

## 🎯 Erfolgskriterien

### Must-Have (bis 31. Mai 2026)
- ✅ **16KB Page Size Support implementiert**
- ✅ Google Play Console zeigt KEINE Warnung
- ✅ App läuft stabil auf allen Android-Versionen
- ✅ Alle Features funktionieren

### Nice-to-Have
- ⭐ Performance-Verbesserung durch native 16KB Support
- ⭐ Aktuellste Expo SDK & React Native Version
- ⭐ Moderne Dependencies

## 📝 Nächste Schritte

### Januar 2026 (Diese Woche)
- [x] Upload erfolgreich abschließen
- [x] Verlängerung erhalten
- [x] Aktionsplan erstellen
- [ ] Monitoring Setup für Expo SDK 53 Release

### Februar 2026
- [ ] Expo SDK 53 Beta testen (wenn verfügbar)
- [ ] React Native 0.77 Release Notes prüfen
- [ ] Test-Branch erstellen
- [ ] Upgrade-Dokumentation schreiben

### März 2026
- [ ] Expo SDK 53 Stable testen
- [ ] Vollständiges Upgrade durchführen
- [ ] Testing auf Testgeräten
- [ ] Performance-Tests

### April 2026
- [ ] Production Build erstellen
- [ ] Final Testing
- [ ] Release Notes schreiben
- [ ] Upload vorbereiten

### Mai 2026
- [ ] Upload zu Google Play
- [ ] Review abwarten
- [ ] Verifizierung der 16KB Compliance
- [ ] **Deadline: 31. Mai 2026**

## 🔗 Wichtige Links

- **Expo Releases:** https://github.com/expo/expo/releases
- **React Native Releases:** https://github.com/facebook/react-native/releases
- **16KB Support Issue:** https://github.com/facebook/react-native/issues/43444
- **Android Docs:** https://developer.android.com/guide/practices/page-sizes
- **Google Play Policy:** https://support.google.com/googleplay/android-developer/answer/11926878

## 📞 Support

### Bei Problemen kontaktieren:
- **Expo Discord:** https://chat.expo.dev/
- **React Native Community:** https://reactnative.dev/community/overview
- **Stack Overflow:** Tag [expo] oder [react-native]

---

**Status:** 🟢 ON TRACK
**Nächster Review:** 1. Februar 2026
**Verantwortlich:** Entwickler
**Deadline:** 31. Mai 2026
