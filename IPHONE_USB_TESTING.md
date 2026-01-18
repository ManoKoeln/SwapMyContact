# App über USB auf iPhone übertragen & testen

## Schritt 1: iPhone vorbereiten

### 1.1 iPhone mit Mac verbinden
1. Verbinde dein iPhone mit USB-Kabel mit dem Mac
2. iPhone Bildschirm entsperren
3. Tippe auf **"Trust"** wenn gefragt wird
4. Eingabe-Code eingeben wenn nötig

### 1.2 Sandbox Tester Account auf iPhone
1. iPhone: **Settings** → **App Store**
2. Scrolle nach unten zu **Sandbox Account**
3. Tippe auf **"Tap to Sign Out"** (falls bereits angemeldet)
4. Tippe **"Sign In"**
5. Gib deine **Sandbox Tester Email** ein (aus App Store Connect)
6. Gib dein **Sandbox Tester Passwort** ein
7. **Sign In** tippen

---

## Schritt 2: Xcode Setup

### 2.1 Xcode öffnen
```bash
cd /Users/matthiasnowack/Projekte/SwapMyContact
open ios/SwapContact.xcworkspace
```

**WICHTIG**: `xcworkspace` öffnen, nicht `.xcodeproj`!

### 2.2 iPhone in Xcode auswählen
1. Oben in Xcode: Dropdown **"Select a device or simulator"**
2. Wähle dein iPhone aus der Liste
   - Sollte mit ✓ markiert sein wenn verbunden
3. Team einstellen:
   - **SwapContact** Target auswählen
   - **Signing & Capabilities** Tab
   - **Team**: Dein Apple Developer Account

---

## Schritt 3: App bauen & installieren

### Option A: Über Xcode (einfach)

```bash
# Im Terminal in Xcode oder:
cd /Users/matthiasnowack/Projekte/SwapMyContact/ios
xcodebuild -workspace SwapContact.xcworkspace -scheme SwapContact -configuration Release -derivedDataPath build -destination generic/platform=iOS -allowProvisioningUpdates
```

**Oder einfacher**: 
1. Xcode oben: **Product** → **Run** (oder Cmd+R)
2. App wird automatisch gebaut und installiert
3. Warten bis Installation fertig ist (~2 Minuten)

### Option B: Über Expo CLI (noch einfacher)

```bash
cd /Users/matthiasnowack/Projekte/SwapMyContact
npx expo run:ios --device
```

**Das macht**:
- Erkennt dein iPhone automatisch
- Baut die App
- Installed auf dem Gerät
- Startet die App

---

## Schritt 4: In der App testen

### 4.1 App öffnet sich auf iPhone
1. App sollte automatisch starten
2. Gehe zu **"Einstellungen"** Screen
   - Home → (Menü Icon oder Settings Button)

### 4.2 Subscription testen
1. Scrolle zu **"Premium-Abonnement"** Sektion
2. Tippe **"Jetzt abonnieren"** Button
3. Folgendes sollte passieren:
   - **App Store Purchase Screen** öffnet sich
   - Zeigt **"0,99€/Jahr"** an
   - **"Subscribe" Button** ist sichtbar
4. Tippe **"Subscribe"**
5. Bestätigung: **"Sandbox Purchase"** sollte erscheinen (kostenlos!)
6. Nach Bestätigung:
   - Screen sollte zurück zur App gehen
   - **"✅ Premium aktiv"** Meldung oben
   - "Unbegrenzte Profile verfügbar"

---

## Häufige Fehler & Lösungen

### ❌ "Cannot Find Package 'react-native-iap'"
**Lösung**:
```bash
cd /Users/matthiasnowack/Projekte/SwapMyContact
npx expo prebuild --clean
open ios/SwapContact.xcworkspace
```

### ❌ "iPhone nicht sichtbar in Xcode"
**Lösung**:
1. iPhone neustarten (Power Button)
2. Mac neustarten
3. USB Kabel wechseln
4. Xcode → **Window** → **Devices and Simulators** → iPhone rechts anklicken

### ❌ "Team provisioning Fehler"
**Lösung**:
1. Xcode: **SwapContact** Target
2. **Signing & Capabilities**
3. Prüfe: **Team** = dein Apple Developer Account
4. Prüfe: **Bundle ID** = `com.businesscard2025.swapcontactnew`
5. Klick **"Try Again"** Button
6. Xcode sollte automatisch provisioning certificate erstellen

### ❌ "Sandbox Account nicht erkannt"
**Lösung**:
1. Prüfe: Sandbox Tester existiert in App Store Connect
   - **Users & Access** → **Sandbox**
   - Sollte deine Email zeigen
2. Prüfe: Passwort ist korrekt
3. iPhone neustarten: **Settings** → **Sign Out** → **Sign In** wieder

### ❌ "Cannot connect to IAP" Fehler in App
**Lösung**:
1. Prüfe: **In-App Purchase Capability** ist in Xcode hinzugefügt
2. Prüfe: App Store Connect hat Subscription mit gleicher ID
   - ID: `com.businesscard2025.swapcontactnew.premium.yearly`
3. Prüfe: Subscription ist **"Ready to Submit"** Status

### ❌ "App crashed sofort nach Start"
**Lösung**:
1. Xcode: **View** → **Debug Area** → **Show Console**
2. Logs ansehen (filter nach "error")
3. Häufig: Pod Abhängigkeiten nicht installiert
```bash
cd /Users/matthiasnowack/Projekte/SwapMyContact/ios
pod install
```

---

## Debugging & Logs

### Logs in Xcode ansehen
1. iPhone ist noch mit Mac verbunden
2. Xcode: **View** → **Debug Area** → **Show Console** (Cmd+Shift+C)
3. App auf dem iPhone öffnen
4. Logs sollten in Xcode Console erscheinen
5. Suche nach:
   - `"IAP initialized"` = IAP funktioniert
   - `"Available purchases"` = Purchases gefunden
   - `"Premium activated"` = Erfolgreich!
   - `"Error"` = Problem gefunden

### App Daten löschen & neu testen
Wenn etwas schiefgeht:
1. iPhone: **Settings** → **General** → **iPhone Storage**
2. Suche **SwapContact**
3. **Delete App** → **Delete**
4. Xcode: **Product** → **Run** (Cmd+R)
   - App wird neu installiert + alles sauber

---

## Schritt-für-Schritt Befehl-Zusammenfassung

```bash
# 1. Repository navigieren
cd /Users/matthiasnowack/Projekte/SwapMyContact

# 2. iOS Workspace öffnen
open ios/SwapContact.xcworkspace

# ODER: Mit Expo bauen
npx expo run:ios --device

# ODER: Mit xcodebuild bauen & installieren
cd ios
xcodebuild -workspace SwapContact.xcworkspace \
  -scheme SwapContact \
  -configuration Release \
  -destination 'generic/platform=iOS' \
  -allowProvisioningUpdates
```

---

## Nach erfolgreichem Test auf iPhone

Wenn alles funktioniert hat:

1. ✅ App lädt sich auf iPhone
2. ✅ IAP wird erkannt
3. ✅ Sandbox Kauf funktioniert
4. ✅ Premium wird aktiviert

**Nächste Schritte:**
1. Version auf 0.1.3 erhöhen (`app.json`)
2. `eas build --platform ios --profile production`
3. In TestFlight hochladen
4. Mit echtem Apple ID testen
5. In App Store einreichen

---

## Tipps für schnelleres Entwickeln

### Hot Reload (Änderungen sofort testen)
```bash
npx expo run:ios --device
```
Während die App läuft:
- Speichere Dateiänderungen
- Drücke **"r"** im Terminal → App lädt Änderungen

### Nur das Build updaten
```bash
# App bleibt installiert, nur neuer Code
npx expo run:ios --device --no-build
```

---

## TestFlight: Premium für Tester freigeben (Promotional Codes)

### Schritt 1: App Store Connect öffnen
1. Gehe zu [App Store Connect](https://appstoreconnect.apple.com)
2. **My Apps** → **SwapContact**
3. Linke Sidebar: **In-App Purchases**

### Schritt 2: Premium IAP finden
1. Suche das IAP **"premium"** (sollte bereits erstellt sein)
2. Klicke drauf
3. Scrolle nach unten zu **"Promotional Codes"**

### Schritt 3: Promotional Codes generieren
1. Klicke auf **"Generate Codes"**
2. Wähle:
   - **Number of Codes**: z.B. 10-50 (für deine Tester)
   - **Expiration Date**: z.B. 3-6 Monate
3. Klicke **"Generate"**
4. Die Codes werden als CSV heruntergeladen (speichern!)

### Schritt 4: Codes an Tester verteilen
1. Tester erhalten einen Code (z.B. per Mail oder Slack)
2. Tester öffnet die App im TestFlight
3. Geht zu: **Settings** (oder Premium-Screen) → **Redeem Code**
4. Gibt den Code ein → **Premium freigeschaltet!**

### Schritt 5: Code im TestFlight testen
1. Du kannst auf deinem iPhone auch einen Code selbst testen:
   - App öffnen
   - Premium-Dialog → **"Redeem Code"**
   - Code eingeben
   - ✅ Premium aktiviert (ohne echte Zahlung)

---

**Vorteil dieser Methode:**
- Tester zahlen nicht (Apple zahlt nicht real)
- Codes können beliebig oft verteilt werden
- Jeder Tester kann unabhängig Premium aktivieren
- Keine Code-Änderungen notwendig

