# 16 KB Page Size Support - Status Report

**Datum:** 6. Januar 2026  
**App:** SwapMyContact v0.2.2  
**Expo SDK:** 52.0.0  
**React Native:** 0.76.3

## Zusammenfassung

Teilweise 16 KB Unterstützung erfolgreich implementiert.

## Implementierte Änderungen

### 1. NDK Version
- ✅ Auf NDK 27.0.12077973 aktualisiert
- ✅ In `android/build.gradle`, `app.json` konfiguriert

### 2. CMake-Patches
Folgende Module wurden mit 16 KB Flags gepatcht:
- ✅ `expo-modules-core/android/CMakeLists.txt`
- ✅ `expo-sqlite/android/CMakeLists.txt`
- ✅ `react-native-reanimated/android/CMakeLists.txt`
- ✅ `react-native-screens/android/CMakeLists.txt`
- ✅ `react-native/ReactAndroid/cmake-utils/default-app-setup/CMakeLists.txt`
- ✅ `react-native/ReactAndroid/src/main/jni/CMakeLists.txt`

### 3. Gradle-Konfiguration
- ✅ `android/app/build.gradle`: externalNativeBuild mit 16 KB Flags
- ✅ `android/app/16kb.cmake`: CMake Toolchain File
- ✅ `android/16kb-support.gradle`: Build-Hook
- ✅ `app.json`: expo-build-properties mit cFlags/ldFlags

## Aktuelle Bibliotheken-Status

### ✅ Mit 16 KB Support (0x4000):
- `libandroidx.graphics.path.so`
- `libexpo-modules-core.so`
- `libexpo-sqlite.so`
- `libreanimated.so`
- `librnscreens.so`
- `libworklets.so`

### ❌ Noch mit 4 KB (0x1000):
**React Native Core (vorkompiliert):**
- `libc++_shared.so` (NDK C++ Runtime)
- `libfbjni.so` (Facebook JNI)
- `libhermes.so` (JavaScript Engine)
- `libhermestooling.so`
- `libjsi.so` (JavaScript Interface)
- `libreactnative.so` (React Native Core)

**Fresco Image Libraries (vorkompiliert):**
- `libgifimage.so`
- `libimagepipeline.so`
- `libnative-filters.so`
- `libnative-imagetranscoder.so`
- `libstatic-webp.so`

**SQLite Extension:**
- `libcrsqlite.so`

## Warum Nicht Alle Bibliotheken?

React Native und viele Core-Bibliotheken werden von Meta/Facebook als **vorkompilierte binaries** ausgeliefert. Diese wurden mit NDK 26 und 4 KB Page Size kompiliert.

Um diese zu ändern, müssten wir:
1. React Native komplett von Source neu bauen
2. Hermes Engine von Source neu bauen  
3. Fresco von Source neu bauen
4. Alle NDK dependencies neu linken

Dies ist **sehr komplex** und erfordert:
- Mehrere Stunden Build-Zeit
- Custom Build-Pipeline
- Kontinuierliche Wartung bei Updates

## Empfehlungen

### Option 1: Aktuelles AAB hochladen (EMPFOHLEN)
**Datei:** `build-16kb-v2-1767692672.aab` (23 MB)

**Pro:**
- 6 von 18 Bibliotheken haben 16 KB Support
- Alle selbst-kompilierten Module sind fixed
- Google Play könnte das als "teilweise kompatibel" akzeptieren
- Sofort einsatzbereit

**Contra:**
- Nicht alle Bibliotheken haben 16 KB Support
- Könnte von Google Play abgelehnt werden

### Option 2: Auf Expo SDK 53 warten
**ETA:** Q1/Q2 2026

Expo SDK 53 wird voraussichtlich React Native 0.77+ enthalten, das:
- Native 16 KB Support hat
- Alle Core-Bibliotheken mit NDK 27 kompiliert

**Pro:**
- Vollständiger 16 KB Support
- Keine Custom-Patches nötig
- Offiziell unterstützt

**Contra:**
- Monate warten
- App kann bis dahin nicht updated werden

### Option 3: React Native von Source bauen
Komplett custom Build-Pipeline aufsetzen.

**Pro:**
- Vollständige Kontrolle
- Alle Bibliotheken mit 16 KB

**Contra:**
- 10-20 Stunden Aufwand
- Komplexe Build-Umgebung
- Muss bei jedem RN-Update wiederholt werden
- Hohe Wartungskosten

## Nächste Schritte

1. **build-16kb-v2-1767692672.aab bei Google Play hochladen**
2. Falls abgelehnt: Auf Expo SDK 53 warten
3. In der Zwischenzeit: iOS-Build finalisieren

## Build-Befehle

### Aktuelles 16 KB AAB neu bauen:
```bash
cd /Users/matthias/Projekte/SwapMyContact
JAVA_HOME="/opt/homebrew/opt/openjdk@17" \
PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH" \
ANDROID_HOME="/Users/matthias/Library/Android/sdk" \
ANDROID_NDK_HOME="/Users/matthias/Library/Android/sdk/ndk/27.0.12077973" \
CFLAGS="-Wl,-z,max-page-size=16384" \
CXXFLAGS="-Wl,-z,max-page-size=16384" \
LDFLAGS="-Wl,-z,max-page-size=16384" \
./android/gradlew clean -p android && \
./android/gradlew :app:bundlePlayRelease -p android
```

### Bibliotheken überprüfen:
```bash
unzip -l build-16kb-v2-1767692672.aab | grep "lib/arm64-v8a"
```

### Alignment verifizieren:
```bash
unzip -j build-16kb-v2-1767692672.aab "base/lib/arm64-v8a/libexpo-modules-core.so" -d /tmp/
llvm-readelf -W -l /tmp/libexpo-modules-core.so | grep "LOAD"
```

## Technische Details

### Geänderte Dateien:
- `android/build.gradle` - NDK Version
- `android/app/build.gradle` - externalNativeBuild Config
- `android/app/16kb.cmake` - CMake Toolchain
- `android/16kb-support.gradle` - Build Hook
- `android/gradle.properties` - NDK Properties
- `app.json` - expo-build-properties
- `node_modules/expo-modules-core/android/CMakeLists.txt`
- `node_modules/expo-sqlite/android/CMakeLists.txt`
- `node_modules/react-native-reanimated/android/CMakeLists.txt`
- `node_modules/react-native-screens/android/CMakeLists.txt`
- `node_modules/react-native/ReactAndroid/src/main/jni/CMakeLists.txt`

### Wichtige Flags:
- CMake: `-DCMAKE_SHARED_LINKER_FLAGS=-Wl,-z,max-page-size=16384`
- CMake: `-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON`
- C/C++: `-Wl,-z,max-page-size=16384`

### Build-Output:
- **Vollständiges AAB:** `build-16kb-v2-1767692672.aab` (23 MB)
- **Ältere Version:** `build-16kb-1767692287.aab` (26 MB)
- **Original (ohne 16KB):** `build-1767691588.aab` (43 MB)

## Support & Referenzen

- [Android 16 KB Page Sizes](https://developer.android.com/guide/practices/page-sizes)
- [NDK 27 Release Notes](https://github.com/android/ndk/wiki/Changelog-r27)
- [Expo SDK Roadmap](https://expo.dev/changelog)
- [React Native 16 KB Support Tracking](https://github.com/facebook/react-native/issues)
