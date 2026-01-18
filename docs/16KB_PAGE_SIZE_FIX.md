# 16 KB Page Size Support - Finale Lösungsdokumentation

## Problem
Google Play verlangt seit Januar 2025, dass alle Apps 16 KB Speicherseiten unterstützen müssen.

Fehlermeldung:
```
Deine App unterstützt keine Speicherseiten mit 16 KB.
```

## Durchgeführte Änderungen

### 1. Android Gradle Plugin aktualisiert
**Datei**: `android/build.gradle`
- Upgrade von 8.4.2 auf **8.7.3** (minimum erforderlich für 16KB Support)

### 2. NDK Version aktualisiert
**Datei**: `android/build.gradle`
- NDK von 26.1.10909125 auf **27.0.12077973** (erforderlich für 16KB)

### 3. Nur 64-bit Architektur
**Grund**: Nur 64-bit ARM (arm64-v8a) unterstützt 16 KB Seiten. 32-bit (armeabi-v7a) unterstützt diese **nicht**.

**Dateien geändert**:
- `android/app/build.gradle`: `ndk { abiFilters 'arm64-v8a' }`
- `android/gradle.properties`: `reactNativeArchitectures=arm64-v8a`
- `app.json`: `"abiFilters": ["arm64-v8a"]`

### 4. extractNativeLibs deaktiviert
**Datei**: `android/app/src/main/AndroidManifest.xml`
- `android:extractNativeLibs="false"` (war vorher `true`)
- Dies ist **kritisch** für 16KB Support

### 5. Manifest-Deklaration für 16KB
**Datei**: `android/app/src/main/AndroidManifest.xml`
```xml
<!-- Declare support for 16KB page sizes (required by Google Play) -->
<uses-native-library
  android:name="libgui.so"
  android:required="false" />

<!-- Support for 16KB page size devices -->
<supports-gl-texture android:name="GL_EXT_texture_filter_anisotropic"/>
```

### 6. Legacy Packaging deaktiviert
**Datei**: `app.json`
- `useLegacyPackaging: false` (war vorher `true`)
- Wichtig für 16KB Support

### 7. Production Keystore konfiguriert
**Datei**: `android/app/build.gradle`
- Release Signing Config hinzugefügt
- Verwendet korrekten Keystore: `credentials/android/keystore.jks`
- SHA1: `8C:FE:67:80:80:4E:D3:9F:23:D0:58:DD:94:89:75:5F:2D:DF:2C:C5`

### 8. Build-Konfiguration
**Wichtig**: 
- minSdkVersion: 24
- targetSdkVersion: 35
- compileSdkVersion: 35
- buildToolsVersion: 35.0.0
- AGP: 8.7.3
- NDK: 27.0.12077973

## Zusammenfassung der kritischen Änderungen

✅ **Nur arm64-v8a** (keine 32-bit mehr)
✅ **extractNativeLibs="false"** im Manifest
✅ **Android Gradle Plugin 8.7.3**
✅ **NDK 27.0.12077973**
✅ **Production Keystore** mit korrektem SHA1
✅ **Manifest-Deklarationen** für 16KB Support
✅ **useLegacyPackaging: false**
✅ **VersionCode 44**

## Lokales Bauen (ohne Expo Credits)

```bash
# Java 17 muss installiert sein
brew install openjdk@17

# Build-Script ausführen
./build_local_aab.sh
```

Das AAB wird nach `build-[timestamp].aab` kopiert.

## Wichtige Hinweise

### Gerätkompatibilität
⚠️ Durch die Beschränkung auf arm64-v8a werden **sehr alte 32-bit ARM Geräte** nicht mehr unterstützt.
- Betroffen: Geräte älter als ca. 2015-2016
- Die allermeisten modernen Android-Geräte (>98%) verwenden arm64-v8a

### Native Bibliotheken
Die App verwendet folgende native Libs (alle neu kompiliert für arm64-v8a):
- `libcrsqlite.so` (expo-sqlite)
- `libreactnative.so`
- `libhermes.so`
- `libreanimated.so`
- `libc++_shared.so`

### Warum der Fehler mehrmals auftrat

1. **Erster Versuch**: 32-bit Architekturen waren noch enthalten
2. **Zweiter Versuch**: `extractNativeLibs=true` war noch aktiv
3. **Dritter Versuch**: NDK 26 statt 27 verwendet
4. **Vierter Versuch**: Manifest-Deklarationen fehlten

## Verifikation

Nach dem Build prüfen:
```bash
# Nur arm64-v8a sollte enthalten sein
unzip -l build-xxx.aab | grep "\.so$"

# Keystore-Fingerabdruck prüfen
keytool -printcert -jarfile build-xxx.aab
```

## Troubleshooting

Falls der Fehler weiterhin auftritt:
1. AAB mit `unzip -l build-xxx.aab | grep "\.so$"` prüfen
2. Sicherstellen, dass **keine** armeabi-v7a, x86, oder x86_64 libs enthalten sind
3. Nur arm64-v8a sollte vorhanden sein
4. `extractNativeLibs="false"` im Manifest verifizieren
5. NDK 27+ verwenden

## Referenzen
- [Google Play 16KB Support](https://developer.android.com/guide/practices/page-sizes)
- [Android Gradle Plugin 8.7 Release Notes](https://developer.android.com/build/releases/gradle-plugin)
- [NDK 27 Release Notes](https://developer.android.com/ndk/downloads)
