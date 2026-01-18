# android:testOnly="true" Problem - Lösungsansätze

## Problem
Lokale Gradle Builds (`./gradlew bundlePlayRelease`) setzen automatisch `android:testOnly="true"` im merged AndroidManifest, was den Upload zu Google Play blockiert mit dem Fehler:
"Du kannst keine APKs oder Android App Bundles hochladen, die ausschließlich zu Testzwecken dienen."

## Bestätigte Fakten
✅ Source AndroidManifest.xml hat KEIN `android:testOnly` Attribut
✅ build.gradle Release Config hat `debuggable = false`
✅ Build verwendet `bundlePlayRelease` (nicht debug)
✅ `tools:remove="android:testOnly"` im Manifest funktioniert NICHT
✅ `manifestPlaceholders = [testOnly:"false"]` funktioniert NICHT
✅ bundletool Inspektion zeigt: `android:testOnly="true"` im finalen AAB

## Root Cause
Das `testOnly` Attribut wird vom React Native/Expo Build-Plugin automatisch gesetzt bei lokalem Gradle Build. Dies ist ein bekanntes Verhalten.

## Lösungen

### Lösung 1: EAS Build verwenden (EMPFOHLEN)
```bash
# Build mit EAS Build (Cloud Service)
npx eas-cli build --platform android --profile production

# Vorteile:
# - Kein testOnly Attribut im AAB
# - Konsistente Build-Umgebung
# - Automatisches Signing
# - Upload-fähig zu Google Play
```

Konfiguration in `eas.json`:
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle",
        "gradleCommand": ":app:bundlePlayRelease"
      }
    }
  }
}
```

### Lösung 2: Build.gradle Plugin Hook (EXPERIMENTELL)
Füge in `android/app/build.gradle` nach `android {` Block ein:

```gradle
afterEvaluate {
    tasks.named("processPlayReleaseMainManifest").configure {
        doLast {
            def manifestFile = new File(
                "$buildDir/intermediates/merged_manifest/playRelease/processPlayReleaseMainManifest/AndroidManifest.xml"
            )
            if (manifestFile.exists()) {
                def text = manifestFile.text
                text = text.replaceAll('android:testOnly="true"', '')
                manifestFile.write(text)
            }
        }
    }
}
```

⚠️ **Hinweis**: Diese Lösung ist nicht garantiert und kann bei Gradle Updates brechen.

### Lösung 3: Custom Gradle Task
Erstelle Task zum Post-Processing des AAB:

```gradle
task removeTestOnlyFromBundle {
    doLast {
        def bundleFile = file("$buildDir/outputs/bundle/playRelease/app-play-release.aab")
        // Extrahiere AAB, entferne testOnly, re-package
        // Komplexer Prozess - siehe bundletool Dokumentation
    }
}

tasks.named("bundlePlayRelease").finalizedBy(removeTestOnlyFromBundle)
```

## Empfehlung
**Verwende EAS Build** für Production Builds:
1. Kostenlos für Open Source / kleine Projekte
2. Zuverlässige, reproduzierbare Builds
3. Keine testOnly Probleme
4. Direkter Upload zu Google Play möglich

## Weiteres Vorgehen
1. Google Support kontaktieren (siehe google_support_request.txt)
2. EAS Build Account erstellen: https://expo.dev/
3. EAS CLI installieren: `npm install -g eas-cli`
4. Login: `eas login`
5. Build konfigurieren: `eas build:configure`
6. Production Build: `eas build --platform android --profile production`

## Dokumentation
- EAS Build: https://docs.expo.dev/build/introduction/
- bundletool: https://developer.android.com/tools/bundletool
- Android testOnly: https://developer.android.com/guide/topics/manifest/application-element#testOnly
