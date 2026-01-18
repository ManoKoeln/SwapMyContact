# In-App-Subscription Setup Guide

## Play Billing Library v7+ mit Jährlichem Abo implementiert ✅

### Was wurde implementiert:
- ✅ `react-native-iap` installiert (nutzt Play Billing Library v7+)
- ✅ IAP Service erstellt (`utils/iap.js`) mit Subscription-Support
- ✅ `hasActiveSubscription()` Funktion für Ablaufprüfung
- ✅ Automatische Status-Prüfung alle 24 Stunden
- ✅ App.js: IAP Initialisierung hinzugefügt
- ✅ SettingsScreen: Abo-UI mit Abonnieren & Wiederherstellen Buttons

---

## Google Play Console Setup

### 1. Abonnement erstellen
1. Gehe zu **Google Play Console** → Deine App
2. **Monetarisierung** → **Abonnements**
3. Klicke auf **Abonnement erstellen**
4. **Abonnement-ID**: `com.businesscard2025.swapcontactnew.premium.yearly`
5. **Name**: Premium Jahres-Abo
6. **Beschreibung**: Unbegrenzte Profile und alle Premium-Funktionen für 1 Jahr
7. **Abrechnungszeitraum**: Jährlich (1 Jahr)
8. **Preis**: 
   - Deutschland: 0,99€
   - USA: 0,99$
   - UK: 0,99£
   - (Weitere Länder: Jeweils entsprechend 0,99 in lokaler Währung)
9. **Kostenlose Testphase** (Optional): 7 Tage
10. **Verlängerung**: Automatisch (Auto-Renewable)
11. **Status**: Aktiv
12. Speichern

### 2. Testlizenzen einrichten
1. **Lizenztests** → **Lizenztesters**
2. Füge deine Gmail-Adresse hinzu
3. Jetzt kannst du kostenlos testen

---

## App Store Connect Setup (iOS)

### 1. Auto-Renewable Subscription erstellen
1. Gehe zu **App Store Connect** → Deine App
2. **Features** → **Abonnements**
3. Falls noch keine Abo-Gruppe: **Abo-Gruppe erstellen**
   - Name: "Premium Features"
   - Referenzname: "premium_features"
4. **+ Abonnement hinzufügen**
5. **Produktkennung**: `com.businesscard2025.swapcontactnew.premium.yearly`
6. **Referenzname**: Premium Jahres-Abo
7. **Dauer**: 1 Jahr
8. **Abonnementpreis**:
   - Basisland: Deutschland
   - Preis: 0,99€
   - "Preserve Pricing" für andere Länder aktivieren → Apple setzt automatisch äquivalente Preise
9. **Lokalisierung** (Deutsch):
   - **Anzeigename**: Premium Jahres-Abo
   - **Beschreibung**: Unbegrenzte Profile und alle Premium-Funktionen
10. **Prüfungsinformationen**: Screenshot hochladen
11. **App Store-Werbegrafik**: Optional (mind. 640x920px)
12. Speichern & einreichen zur Prüfung

### 2. Sandbox-Tester erstellen
1. **App Store Connect** → **Benutzer und Zugriff**
2. **Sandbox-Tester** → **+** Tester hinzufügen
3. Erstelle eine Test-Apple-ID
4. Melde dich auf deinem Testgerät mit dieser ID an

---

## Testing

### Android Testing:
1. Stelle sicher, dass du als Lizenztester in Google Play Console eingetragen bist
2. Lade die App über Internal Testing oder Open Testing hoch
3. Installiere die App auf deinem Gerät
4. Gehe zu **Einstellungen** → Tippe auf "Jetzt abonnieren"
5. Testlizenz wird kostenlos bereitgestellt (Abo läuft in 5 Minuten ab für Tests)

### iOS Testing:
1. Baue die App mit TestFlight
2. Melde dich auf dem Testgerät mit dem Sandbox-Tester Account an
3. Öffne die App → Einstellungen → "Jetzt abonnieren"
4. Sandbox-Abo wird simuliert (läuft schneller ab für Tests - z.B. 1 Jahr = 1 Stunde)

---

## Wichtige Hinweise

### Development vs. Production:
- Im Dev-Modus (`__DEV__`) kann der Toggle noch manuell gesetzt werden
- In Production ist nur noch das echte Abo möglich

### Subscription IDs:
Die Subscription ID **muss exakt übereinstimmen**:
- Code: `com.businesscard2025.swapcontactnew.premium.yearly`
- Google Play Console: Gleiche ID
- App Store Connect: Gleiche ID

### Play Billing Library v7:
✅ Die Library ist bereits in `react-native-iap` integriert
✅ Erfüllt die Anforderungen für Updates ab 31.08.2025
✅ Verwendet `acknowledgePurchaseAndroid()` für Android

### Subscription-Validierung:
✅ `hasActiveSubscription()` prüft Ablaufdatum (iOS & Android)
✅ Automatische Status-Prüfung alle 24 Stunden
✅ Bei abgelaufenem Abo wird Premium automatisch deaktiviert
✅ Auto-Renewal Status wird auf Android geprüft

### Abo-Verwaltung:
- **Android**: Nutzer können Abo in Google Play Store verwalten/kündigen
- **iOS**: Nutzer können Abo in iOS Einstellungen verwalten/kündigen
- Nach Kündigung: Abo läuft bis Ablaufdatum, dann wird Premium deaktiviert

### Receipt Validation:
Aktuell wird das Abo clientseitig validiert. Für maximale Sicherheit solltest du später:
- Server-seitige Receipt Validation implementieren
- Google Play Developer API für Android verwenden
- App Store Server Notifications für iOS nutzen
- Verhindert Manipulation und gekrackte Versionen

---

## Nächste Schritte

1. ✅ Code ist bereit (Jährliches Abo)
2. ⏳ Erstelle Abonnement in Google Play Console (0,99€/Jahr)
3. ⏳ Erstelle Auto-Renewable Subscription in App Store Connect (0,99€/Jahr)
4. ⏳ Teste mit Sandbox-Accounts
5. ⏳ Baue neue Version und lade hoch
6. ⏳ Warte auf Freigabe von Google/Apple

---

## Preisgestaltung

**Jährliches Abo: 0,99€/Jahr**

Vorteile:
- ✅ Sehr niedriger Preis = hohe Conversion-Rate
- ✅ Wiederkehrende Einnahmen
- ✅ Nutzer können jederzeit kündigen
- ✅ Faire Alternative zu einmaligem Kauf

Alternative Preismodelle:
- Monatlich: 0,49€/Monat (5,88€/Jahr)
- Einmaliger Kauf: 9,99€ (für immer)

**Empfehlung bleibt: 0,99€/Jahr** = Beste Balance zwischen Conversion und Umsatz
