# Google Play Upload Checklist - v0.2.2 (Build 27)

## Upload-Datei
**Datei:** `SwapMyContact-v0.2.2-build27-16kb.aab` (23 MB)  
**Pfad:** `/Users/matthias/Projekte/SwapMyContact/`  
**Datum:** 6. Januar 2026

## Version Info
- **Version Name:** 0.2.2
- **Version Code:** 27
- **Build Number:** 24 (iOS)
- **16 KB Support:** Teilweise (6 von 17 Bibliotheken)

## Upload-Schritte

### 1. Google Play Console öffnen
- URL: https://play.google.com/console
- App: SwapMyContact auswählen
- Navigation: Release → Production (oder Internal/Closed Testing)

### 2. Neues Release erstellen
1. "Create new release" klicken
2. AAB hochladen: `SwapMyContact-v0.2.2-build27-16kb.aab`
3. Warten bis Upload & Verarbeitung abgeschlossen

### 3. Release Notes (Deutsch)
```
Version 0.2.2
- Verbesserte 16 KB Page Size Unterstützung
- Performance-Optimierungen
- Fehlerbehebungen
```

### 4. Vor dem Review

**Wichtig prüfen:**
- [ ] Version Code 27 ist höher als vorherige Version
- [ ] Signature stimmt überein (SHA1: siehe credentials/android/)
- [ ] APK/AAB hat keine kritischen Warnings
- [ ] Alle Permissions sind unverändert

### 5. Was Google Play prüfen wird

**16 KB Libraries Status:**
```
✅ Mit 16 KB (6):
  - libandroidx.graphics.path.so
  - libexpo-modules-core.so
  - libexpo-sqlite.so
  - libreanimated.so
  - librnscreens.so
  - libworklets.so

⚠️ Noch 4 KB (11):
  - libc++_shared.so
  - libcrsqlite.so
  - libfbjni.so
  - libgifimage.so
  - libhermes.so
  - libhermestooling.so
  - libimagepipeline.so
  - libjsi.so
  - libnative-filters.so
  - libnative-imagetranscoder.so
  - libreactnative.so
  - libstatic-webp.so
```

## Mögliche Ergebnisse

### Szenario 1: ✅ Akzeptiert
**Wahrscheinlichkeit:** 40-60%

Google könnte akzeptieren weil:
- Alle selbst-kompilierten Module sind 16 KB
- React Native Core ist bekannt und weit verbreitet
- Teilweise Kompatibilität ist besser als keine

**Nächste Schritte:**
- Normal weiter releasen
- Auf Expo SDK 53 für vollständigen Support warten

### Szenario 2: ⚠️ Warning aber Akzeptiert
**Wahrscheinlichkeit:** 20-30%

Google akzeptiert mit Warning:
- "Teilweise 16 KB Unterstützung"
- Funktioniert aber auf allen Geräten
- Update empfohlen für Q2 2026

**Nächste Schritte:**
- App läuft normal
- Expo SDK 53 Update planen

### Szenario 3: ❌ Abgelehnt
**Wahrscheinlichkeit:** 20-30%

Google lehnt ab mit Begründung:
- "Diese Bibliotheken unterstützen 16 KB nicht" (selbe Liste)
- Verlangt vollständige Compliance

**Nächste Schritte dann:**
- Option A: Auf Expo SDK 53 warten (Q1/Q2 2026)
- Option B: React Native von Source kompilieren (10-20h Aufwand)
- Option C: Temporär alte Version (0.2.1) belassen

## Nach Upload - Monitoring

### In Google Play Console prüfen:
1. **Pre-launch Report** (nach 1-2 Stunden):
   - Crashes checken
   - Device compatibility prüfen
   - 16 KB warnings ansehen

2. **Release Status** (nach 6-24 Stunden):
   - Review Status checken
   - Warnings/Errors lesen
   - Approval abwarten

### Falls abgelehnt:
1. Rejection Reason Screenshot machen
2. Prüfen welche exakten Libraries genannt werden
3. Decision: Warten vs Custom Build

## Backup Plan

Falls abgelehnt, haben wir:
- ✅ Vollständige 16 KB Dokumentation
- ✅ Alle notwendigen Patches vorbereitet
- ✅ Build-Scripts getestet
- ✅ 35% der Libraries bereits fixed

**Einfachster Weg:** Auf Expo SDK 53 warten (1-3 Monate)

## Support-Kontakt

Falls Google fragt:
```
Wir haben 16 KB Page Size Support für alle selbst-kompilierten
Module implementiert (NDK 27, CMake Patches). Die verbleibenden
Bibliotheken sind vorkompilierte React Native Core-Komponenten,
die erst mit React Native 0.77+ (geplant Q2 2026) vollständigen
16 KB Support haben werden. Wir werden sofort nach Verfügbarkeit
von Expo SDK 53 updaten.
```

## Technische Details (für Google Support)

**NDK Version:** 27.0.12077973  
**Min SDK:** 26 (Android 8.0)  
**Target SDK:** 35 (Android 15)  
**Expo SDK:** 52.0.0  
**React Native:** 0.76.3  

**Gesetzte Flags:**
- `-Wl,-z,max-page-size=16384`
- `-DANDROID_SUPPORT_FLEXIBLE_PAGE_SIZES=ON`
- CMake Toolchain mit 16 KB Linker Flags

**Dokumentation:** Siehe `16KB_STATUS.md`

## Nächste Version Planung

**v0.3.0 (geplant Q2 2026):**
- Expo SDK 53 Upgrade
- React Native 0.77+ mit vollständigem 16 KB Support
- Alle 17 Bibliotheken werden dann 16 KB sein

---

**Upload bereit am:** 6. Januar 2026  
**Uploaded von:** [Ihr Name]  
**Status:** ⏳ Bereit zum Upload
