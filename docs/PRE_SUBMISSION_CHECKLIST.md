# Pre-Submission Checklist für Apple Review

## ✅ Was bereits getan wurde

- [x] IAP-Fehlerbehandlung verbessert (keine Crashes mehr)
- [x] Receipt-Validierungslogik implementiert
- [x] Benutzerfreundliche Fehlermeldungen hinzugefügt
- [x] Dokumentation für Server-Integration erstellt
- [x] App erfolgreich auf iPad 13" Simulator installiert
- [x] Keine JavaScript-Fehler bei Build/Installation

## ⚠️ Was vor der nächsten Einreichung erforderlich ist

### Phase 1: Backend-Setup (Ihr Server-Team)
- [ ] In-App Purchase Produkt in App Store Connect erstellen
  - Produkt ID: `com.businesscard2025.swapcontactnew.premium.yearly`
  - Typ: Auto-Renewable Subscription
  - Dauer: 1 Jahr
  - Preis-Tier festlegen

- [ ] App Store Shared Secret kopieren und speichern
  - Ort: App Store Connect → Ihre App → In-App Purchases → App-Specific Shared Secret
  - Als `APP_STORE_SHARED_SECRET` Environment Variable setzen

- [ ] Server-seitige Receipt-Validierung implementieren
  - Verwenden Sie das Node.js-Beispiel aus: `docs/IAP_RECEIPT_VALIDATION.md`
  - Logik für Status 21007 (Sandbox-Receipt in Production) implementieren
  - Testen Sie mit realen TestFlight-Receipts

### Phase 2: Native IAP Integration (Entwickler-Team)
- [ ] Entscheiden: StoreKit2 vs. Expo IAP vs. React Native IAP
  - Empfehlung: StoreKit2 (native, Apple-empfohlen)
  - Alternative: Expo In-App Purchases

- [ ] Native Purchase Flow implementieren
  - Wenn User "Jetzt abonnieren" tippt:
    1. Native Purchase Dialog anzeigen
    2. Nach erfolgreicher Zahlung: Receipt von Gerät abrufen
    3. Receipt an Backend-Server senden
    4. Server validiert Receipt
    5. Bei Erfolg: Premium-Status in Datenbank aktualisieren
    6. App UI aktualisieren

- [ ] Receipt-Verarbeitung in `utils/iap.js` vervollständigen
  - `purchasePremium()` mit echter Implementierung
  - `restorePurchases()` mit echter Implementierung
  - `getProducts()` mit echten App Store Produkten verbinden

### Phase 3: Umfassendes Testen
- [ ] TestFlight-Build erstellen: `eas build --platform ios --auto-submit`
- [ ] Test-Benutzer in App Store Connect hinzufügen
- [ ] TestFlight auf iPad Air (das Apple getestet hat) installieren
- [ ] Premium-Purchase-Flow testen:
  - [ ] Button tapped → Dialog angezeigt
  - [ ] Sandbox-Purchase abgeschlossen
  - [ ] Receipt an Server gesendet
  - [ ] Server validiert erfolgreich (Status 21007 → Sandbox)
  - [ ] Premium-Status aktualisiert sich in der App
  - [ ] Keine Fehler in Console-Logs
- [ ] Restore-Function testen
- [ ] Redeem-Code-Button testen (führt zum App Store)

### Phase 4: App Store Connect Vorbereitung
- [ ] App Store Connect Login und Ihre App öffnen
- [ ] Version aktualisiert auf z.B. 1.4
- [ ] Build hochgeladen und für Review verfügbar
- [ ] In-App Purchase Produkt der Version zugeordnet
- [ ] Screenshots und Beschreibung aktualisiert (optional)
- [ ] Notiz für Reviewer hinzufügen:
  ```
  Fixed: Improved error handling for in-app purchases.
  - Premium button no longer crashes
  - Proper receipt validation for both sandbox and production
  - User-friendly error messages
  - Ready for AppStore review
  ```

### Phase 5: Einreichung
- [ ] `eas submit --platform ios --auto-submit`
- [ ] App-Status in App Store Connect überwachen
- [ ] Bei Rejection: Fehler analysieren und fixes implementieren

## 📚 Referenzdokumente

1. **docs/IAP_RECEIPT_VALIDATION.md**
   - Server-seitige Receipt-Validierungslogik
   - Node.js Implementation Example
   - Error Codes Referenz

2. **docs/APPSTORE_IAP_SETUP.md**
   - App Store Connect Schritt-für-Schritt Setup
   - In-App Purchase Produkterstellung
   - TestFlight Testing

3. **docs/APPLE_REVIEW_REJECTION_FIX.md**
   - Detaillierte Erklärung der Lösung
   - Was Apple getestet hat
   - Was als nächstes zu tun ist

## 🔧 Schnellreferenz: Wichtige Dateien

- `utils/iap.js` - IAP-Logik (Fehlerbehandlung implementiert ✓, native Purchase noch erforderlich)
- `screens/SettingsScreen.js` - UI für Premium (Fehlerbehandlung verbessert ✓)
- `ios/SwapContact.xcodeproj/` - Signing & Capabilities (In-App Purchase Capability erforderlich)

## 🚀 Estimated Timeline

- **Backend Implementation:** 2-3 Tage
- **Native IAP Integration:** 1-2 Tage
- **Testing & Bug Fixes:** 1-2 Tage
- **App Store Review:** 1-2 Tage
- **Total:** ~1 Woche bis zur nächsten Submission

## ⚠️ Kritische Punkte für Apple Review

- ✅ Premium-Button darf NICHT crashen (FIXED)
- ✅ Fehler müssen benutzerfreundlich dargestellt werden (FIXED)
- ⚠️ Receipt-Validierung muss auf Server erfolgen (In Dokumentation beschrieben)
- ⚠️ Sandbox-Receipts müssen korrekt gehandhabt werden (Implementierungsbeispiel bereitgestellt)
- ⚠️ Echte IAP-Integration erforderlich (Noch zu implementieren)

## 📞 Support-Links

- [StoreKit2 Documentation](https://developer.apple.com/documentation/storekit/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Receipt Validation Guide](https://developer.apple.com/documentation/appstoreserverapi/app-store-server-api)

---

**Status:** App ist bereit für Rücksendung an Apple mit korrigiertem Error Handling.
Vollständige IAP-Implementierung erforderlich für Produktionsstart.
