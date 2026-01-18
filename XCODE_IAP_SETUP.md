# Xcode Setup für In-App-Subscription Testen auf iPhone

## Schritt 1: StoreKit Configuration Datei erstellen

### 1.1 In Xcode
1. Öffne das Projekt in Xcode: `open ios/SwapContact.xcworkspace`
2. Wähle **SwapContact** Projekt (links in der Sidebar)
3. Wähle **SwapContact** Target
4. Gehe zu **Build Phases** Tab
5. Scrolle zu **Copy Bundle Resources**
6. Klick auf **+** → **Add Files**
7. Erstelle neue Datei: **File** → **New** → **File**

### 1.2 StoreKit Configuration Datei
1. Wähle **iOS** → **Configuration File**
2. Name: `Products.storekit`
3. Target: **SwapContact** auswählen
4. **Create** klicken

---

## Schritt 2: Products.storekit konfigurieren

Die Datei sollte sich jetzt im Xcode-Editor öffnen. Falls nicht:
1. Navigiere zu **ios/SwapContact** Folder (Finder)
2. Öffne **Products.storekit** mit Xcode

### 2.1 Subscription hinzufügen
In der Datei (oder in der Xcode UI):

```json
{
  "version": 2,
  "app": {
    "bundleId": "com.businesscard2025.swapcontactnew",
    "name": "SwapContact"
  },
  "inAppPurchases": [
    {
      "displayName": "Premium Jahres-Abo",
      "familyId": "premium_features",
      "internalName": "premium_yearly",
      "productId": "com.businesscard2025.swapcontactnew.premium.yearly",
      "referenceName": "Premium Yearly",
      "type": "AutoRenewableSubscription",
      "subscription": {
        "numberOfPeriods": 1,
        "billingPeriod": "1y",
        "billingCycles": 0,
        "introductoryOffer": null
      },
      "displayPrice": "0.99"
    }
  ],
  "subscriptionGroups": [
    {
      "id": "premium_features",
      "localizations": [
        {
          "locale": "de_DE",
          "name": "Premium Features"
        }
      ],
      "subscriptions": [
        "com.businesscard2025.swapcontactnew.premium.yearly"
      ]
    }
  ]
}
```

---

## Schritt 3: Signing & Capabilities

### 3.1 App ID mit StoreKit vorbereiten
1. Xcode: **SwapContact** Target
2. **Signing & Capabilities** Tab
3. Stelle sicher: **Bundle Identifier** = `com.businesscard2025.swapcontactnew`
4. **Team** ist ausgewählt (dein Apple Developer Account)

### 3.2 In-App Purchase Capability hinzufügen
1. Klick **+ Capability**
2. Suche nach **In-App Purchase**
3. Doppelklick um hinzuzufügen
4. Capacity sollte nun unter "Signing & Capabilities" erscheinen

---

## Schritt 4: App Store Connect vorbereiten

### 4.1 Sandbox Tester erstellen
1. Gehe zu **App Store Connect** (appstoreconnect.apple.com)
2. **Users and Access** → **Sandbox** (nicht "Tester"!)
3. **+** Klick
4. Fülle aus:
   - **First Name**: Test
   - **Last Name**: User
   - **Email**: deine-email+iaptest@gmail.com (oder neue Gmail)
   - **Password**: Starkes Passwort (merken!)
   - **Date of Birth**: Beliebig
5. **Save** klicken
6. Bestätigungsmail wird gesendet

### 4.2 In-App Subscription in App Store Connect
1. **Your App** → **Features** → **Subscriptions**
2. **+** Klick (falls noch nicht erstellt)
3. **Subscription Group erstellen**:
   - **Name**: Premium Features
   - **Reference Name**: premium_features
4. **Subscription erstellen**:
   - **Product ID**: `com.businesscard2025.swapcontactnew.premium.yearly`
   - **Reference Name**: Premium Yearly
   - **Subscription Duration**: 1 Year
   - **Price Tier**: Tier 1 (0,99€)
   - **Auto-Renewal**: ON
   - **Localizations**: Deutsch hinzufügen
5. **Save** klicken

---

## Schritt 5: Auf dem iPhone testen

### 5.1 iPhone einrichten
1. Plug iPhone in Mac
2. Xcode: **Window** → **Devices and Simulators**
3. Dein iPhone sollte auftauchen
4. **Trust** Computer wenn gefragt

### 5.2 Simulator Sandbox Einstellungen (WICHTIG!)
**Option A: Physisches iPhone**
1. iPhone: **Settings** → **App Store**
2. Scrolle zu **Sandbox Account**
3. Tippe auf **Tap to Sign Out**
4. Dann tippe auf **Sign In**
5. Melde dich mit deinem **Sandbox Tester Account** an
6. **NICHT** mit deinem normalen Apple ID anmelden!

**Option B: Simulator (einfacher)**
1. Öffne iPhone Simulator in Xcode
2. **Simulator** → **Settings** → **App Store**
3. Scrolle zu **Sandbox Account**
4. Tippe auf **Tap to Sign Out**
5. Melde dich mit deinem **Sandbox Tester Account** an

### 5.3 App auf dem iPhone bauen & testen
1. Xcode: **Select a device** Dropdown oben
2. Wähle dein iPhone (oder Simulator)
3. **Product** → **Run** (oder Cmd+R)
4. App wird gebaut und installiert

---

## Schritt 6: In der App testen

1. App öffnet sich auf dem iPhone
2. Gehe zu **Einstellungen** (Settings)
3. Tippe auf **"Jetzt abonnieren"** Button
4. **Bestätigungsseite** für Sandbox-Kauf sollte erscheinen
5. **Kostenlos** (weil Sandbox!)
6. Kauf wird sofort bestätigt
7. Premium sollte **aktiviert** sein

---

## Häufige Probleme & Lösungen

### ❌ "Unable to purchase" Fehler
**Grund**: Nicht als Sandbox Tester angemeldet
**Lösung**: 
1. iPhone: **Settings** → **App Store**
2. Scroll down → **Sandbox Account**
3. **Sign Out**
4. **Sign In** mit Sandbox Tester Email

### ❌ StoreKit Configuration wird nicht erkannt
**Grund**: Datei nicht im richtigen Target
**Lösung**:
1. Xcode: **Products.storekit** auswählen
2. **File Inspector** (rechts)
3. **Target Membership**: **SwapContact** ✅ ankreuzen

### ❌ App Store Connect zeigt Subscription nicht
**Grund**: Subscription muss in gleicher Region sein wie dein Team
**Lösung**:
1. App Store Connect: **Settings** → **App Information**
2. Prüfe **Default Language** = Deutsch
3. Subscription muss mit deutschen Preisen erstellt sein

### ❌ Bundle ID stimmt nicht überein
**Grund**: Local Config != App Store Connect
**Lösung**:
1. Xcode: **Build Settings**
2. Suche nach **Bundle Identifier**
3. Muss **exakt** sein: `com.businesscard2025.swapcontactnew`
4. App Store Connect: Gleiche ID verwenden

---

## Debugging Tipps

### Logs ansehen
1. Xcode: **View** → **Debug Area** → **Show Console**
2. Starten die App neu
3. Filter nach "IAP" oder "Purchase"

### Receipt testen
1. Nach erfolgreichem Kauf öffnet sich App
2. In SettingsScreen prüfen: **Premium aktiv** ✅
3. Wenn nicht, überprüfe `checkSubscriptionStatus()` Logs

### Sandbox Reset (bei Problemen)
1. iPhone: **Settings** → **[Dein Name]** → **iTunes & App Store**
2. Scrolle zu **Sandbox Account**
3. **Sign Out**
4. Warte 30 Sekunden
5. **Sign In** mit neuem Sandbox Tester Account

---

## Zusammenfassung der Schritte

1. ✅ Xcode: **Products.storekit** Datei erstellen
2. ✅ Subscription konfigurieren: `com.businesscard2025.swapcontactnew.premium.yearly`
3. ✅ **In-App Purchase** Capability hinzufügen
4. ✅ App Store Connect: Sandbox Tester erstellen
5. ✅ App Store Connect: Subscription mit gleicher ID erstellen
6. ✅ iPhone: Als Sandbox Tester anmelden
7. ✅ App bauen & installieren (Cmd+R)
8. ✅ In Settings testen → "Jetzt abonnieren" klicken

---

## Nach erfolgreichem Test

Wenn alles funktioniert:
1. ✅ Build Version hochfahren (0.1.3)
2. ✅ `eas build --platform ios --profile production`
3. ✅ In TestFlight uploaden
4. ✅ Mit echtem Apple ID testen
5. ✅ In App Store Connect freigeben

