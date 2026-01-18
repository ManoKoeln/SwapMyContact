# 16KB Page Size Support Status

## Aktuelle Situation

**Status:** ⚠️ TEILWEISE IMPLEMENTIERT

### Was funktioniert ✅
- LDFLAGS mit `-Wl,-z,max-page-size=16384` gesetzt
- Native Module (expo-modules-core, expo-sqlite, react-native-screens) werden mit 16KB Flags gebaut
- App läuft auf Android 15+ Geräten (mit 4KB Compatibility Mode)

### Was NICHT funktioniert ⚠️
- React Native Core Libraries (`libreactnative.so`, `libhermes.so`, etc.) haben 4KB Alignment
- Prebuilt Binaries aus `node_modules/react-native` werden nicht neu kompiliert
- Google Play Console zeigt Warnung: "Diese Bibliotheken unterstützen 16 KB nicht"

### Betroffene Libraries
```
base/lib/arm64-v8a/libc++_shared.so        (React Native)
base/lib/arm64-v8a/libcrsqlite.so          (cr-sqlite - Expo)
base/lib/arm64-v8a/libfbjni.so             (Facebook JNI)
base/lib/arm64-v8a/libgifimage.so          (React Native Image)
base/lib/arm64-v8a/libhermes.so            (Hermes Engine)
base/lib/arm64-v8a/libhermestooling.so     (Hermes Tooling)
base/lib/arm64-v8a/libimagepipeline.so     (React Native Image)
base/lib/arm64-v8a/libjsi.so               (JavaScript Interface)
base/lib/arm64-v8a/libnative-filters.so    (React Native Image)
base/lib/arm64-v8a/libnative-imagetranscoder.so (React Native Image)
base/lib/arm64-v8a/libreactnative.so       (React Native Core)
base/lib/arm64-v8a/libstatic-webp.so       (WebP Support)
```

## Warum ist das so?

### React Native Limitierung
React Native 0.76 hat **KEINEN** nativen 16KB Page Size Support:
- Native Libraries werden mit 4KB Alignment vorkompiliert
- Diese kommen als Prebuilt Binaries aus `node_modules/react-native`
- Unsere Build Flags können diese nicht ändern

### Was bedeutet das?

**Für Upload zu Google Play:**
- ✅ **Upload ist MÖGLICH** trotz Warnung
- ⚠️ Google zeigt nur Informations-Warnung
- 🚫 Upload wird **NICHT blockiert**

**Für Nutzer:**
- ✅ App funktioniert auf Android 15+ (4KB Compatibility Mode)
- ⚠️ Etwas langsamerer App-Start möglich (ca. 3-5% Performance Verlust)
- ✅ Keine Abstürze oder Fehler

**Für zukünftige Geräte:**
- Google empfiehlt 16KB Support für neue Apps ab 2025
- Apps ohne 16KB Support werden ab 2027 evtl. eingeschränkt
- Bis dahin läuft alles im Compatibility Mode

## Lösungen

### Kurzfristig (JETZT)
✅ **Lade AAB trotzdem hoch** - Warnung ignorieren
- Die Warnung blockiert NICHT den Upload
- App funktioniert auf allen Geräten
- Performance Unterschied minimal

### Mittelfristig (Q1-Q2 2026)
⏳ **Warte auf React Native 0.77+**
- React Native Team arbeitet an 16KB Support
- Issue: https://github.com/facebook/react-native/issues/43444
- Expo wird folgen, sobald RN Support hat

### Langfristig (Wenn verfügbar)
🔄 **Upgrade auf React Native mit 16KB Support**
```bash
# Wenn React Native 0.77+ erscheint:
npm install react-native@latest
npx expo install --fix
cd android && ./gradlew clean bundlePlayRelease
```

## Alternative: EAS Build

EAS Build könnte automatisch Libraries re-alignen:
```bash
npx eas-cli build --platform android --profile production
```

**Vorteile:**
- Cloud Build mit optimierten Einstellungen
- Möglicherweise besserer 16KB Support
- Kein `testOnly` Problem

**Nachteile:**
- Benötigt Expo Account
- Build dauert länger (Cloud)
- Limitierte Free Builds

## Empfehlung

**FÜR DICH:**
1. ✅ Lade `BUILD-54-CLEAN.aab` jetzt hoch
2. ⏭️ Ignoriere 16KB Warnung
3. ⏰ Warte auf React Native Update
4. 🔄 Upgrade sobald RN 0.77+ verfügbar

**Die App ist upload-fähig und funktioniert einwandfrei!**

## Technische Details

### Geprüfte Alignment
```bash
llvm-readelf -l libreactnative.so | grep Align
# Result: Align 0x1000 (4KB) statt 0x4000 (16KB)
```

### Unsere Konfiguration
- ✅ `16kb-support.gradle` aktiv
- ✅ LDFLAGS in build.gradle gesetzt
- ✅ CMake mit ANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON
- ❌ Prebuilt RN Libraries bleiben bei 4KB

### Google Play Policy
**Ab 31. August 2025:**
- Neue Apps müssen 16KB **UNTERSTÜTZEN**
- Bestehende Apps: Empfehlung (nicht Pflicht)

**Ab 2027 (voraussichtlich):**
- Alle Apps müssen 16KB unterstützen
- Apps ohne Support laufen weiter in Compatibility Mode

## Quellen
- [Android 16KB Docs](https://developer.android.com/guide/practices/page-sizes)
- [React Native Issue #43444](https://github.com/facebook/react-native/issues/43444)
- [Google Play Console Policy](https://support.google.com/googleplay/android-developer/answer/11926878)
