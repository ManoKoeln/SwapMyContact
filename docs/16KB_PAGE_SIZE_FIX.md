# 16 KB Page Size Support – Aktuelle Lösungsdokumentation

> Stand: Oktober 2026 · Gelöst durch Upgrade auf **Expo SDK 54**

## Problem

Google Play verlangt, dass Apps mit `targetSdk` 35+ **16-KB-Speicherseiten** unterstützen. Alle nativen `.so`-Bibliotheken müssen dafür mit einem 16-KB-ausgerichteten LOAD-Segment (`align = 2**14`) ausgeliefert werden.

Typische Fehlermeldung in der Play Console:
```
Deine App unterstützt keine Speicherseiten mit 16 KB.
```

## Warum die früheren Versuche (SDK 52) nicht ausreichten

Unter **Expo SDK 52 / React Native 0.76.9** wurden zwar die selbst kompilierten Module (Expo-Module, Reanimated, RNScreens) über `cFlags`/`ldFlags` mit `max-page-size=16384` korrekt 16-KB-aligned, aber die **vorkompilierten Prebuilt-Libraries** blieben bei 4 KB:

| ❌ Blieb 4 KB (2\*\*12) | Herkunft |
|---|---|
| `libhermes.so`, `libhermestooling.so` | Hermes (RN 0.76) |
| `libreactnative.so`, `libjsi.so` | React Native Core |
| `libfbjni.so`, `libc++_shared.so` | RN/NDK Runtime |
| Fresco-Libs (`libimagepipeline.so`, `libgifimage.so`, …) | Bild-Bibliotheken |

Diese Binaries werden fertig geliefert und lassen sich mit eigenen Build-Flags **nicht** neu ausrichten. 16-KB-aligned sind sie erst in neueren RN-Versionen.

## Die Lösung: Upgrade auf Expo SDK 54

Ab **React Native 0.81 (Expo SDK 54)** sind alle Prebuilt-Libraries (Hermes, reactnative, jsi, fbjni, c++_shared, Fresco) bereits 16-KB-aligned.

### Durchgeführte Kern-Änderungen

1. **Expo SDK 52 → 54**, React Native 0.76.9 → **0.81.5**, React 18.3 → **19.1**
2. **New Architecture aktiviert** (`newArchEnabled=true`) – ab RN 0.81 Standard
3. **Reanimated 3 → 4** (+ `react-native-worklets`)
4. **Natives Projekt neu generiert** mit `npx expo prebuild --clean`
5. **targetSdk / compileSdk 36**, buildToolsVersion 36.0.0, NDK 27
6. Konfiguration über `expo-build-properties` in `app.json`

### Architektur-Hinweis

Es werden weiterhin **arm64-v8a und armeabi-v7a** gebaut. 16-KB-Seiten betreffen nur 64-Bit-Geräte; 32-Bit bleibt für ältere Geräte erhalten, ohne die 16-KB-Konformität auf 64-Bit zu beeinträchtigen.

## Verifikation

Alle 22 nativen Libraries im Release-AAB sind **16-KB-aligned** (`align = 2**14`), inkl. der zuvor problematischen `libhermes.so`, `libreactnative.so`, `libjsi.so`, `libfbjni.so`, `libc++_shared.so`.

### Prüf-Skript (arm64-v8a)

```bash
AAB=android/app/build/outputs/bundle/release/app-release.aab
mkdir -p /tmp/so16 && cd /tmp/so16
unzip -o -q "$OLDPWD/$AAB" 'base/lib/arm64-v8a/*.so'

NDK=$(ls -d ~/Library/Android/sdk/ndk/* | tail -1)
OBJDUMP=$(find "$NDK" -name 'llvm-objdump' | head -1)

bad=0
for f in base/lib/arm64-v8a/*.so; do
  a=$("$OBJDUMP" -p "$f" | awk '/LOAD/{print $NF; exit}')
  printf '%-45s align=%s\n' "$(basename "$f")" "$a"
  [ "$a" != "2**14" ] && bad=$((bad+1))
done
echo "Nicht-16KB: $bad"   # erwartet: 0
```

## Verwandte Build-Themen (im selben Upgrade gelöst)

- **Google Play Billing 8.0.0**: `playBillingSdkVersion = "8.0.0"` in `android/build.gradle`; `react-native-iap` 13.0.4 via `patch-package` an Billing 8 und RN 0.81 angepasst (siehe `patches/react-native-iap+13.0.4.patch`).
- **Automatischer versionCode**: `android/version.properties` + `resolveVersionCode()` in `android/app/build.gradle` zählen bei jedem Release-Build (`bundleRelease`/`assembleRelease`) automatisch hoch.
- **Signierung**: Release wird mit dem Upload-Key `credentials/android/keystore.jks` signiert.

## Release bauen

```bash
# AAB für den Play-Upload (versionCode wird automatisch inkrementiert)
android/gradlew -p android bundleRelease

# Ergebnis:
# android/app/build/outputs/bundle/release/app-release.aab
```

## Referenzen

- [Google Play 16 KB Support](https://developer.android.com/guide/practices/page-sizes)
- [Expo SDK 54 Changelog](https://expo.dev/changelog)
- [React Native 0.81 Release Notes](https://reactnative.dev/blog)
