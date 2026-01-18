# App-Dokumentation - Überblick

Diese Ordner enthält wichtige Dokumentation zur App-Verwaltung, Submission und Integration.

## 📋 Dokumente nach Thema

### 🔴 Apple Rejection Fix (PRIORITÄT)
**Datei:** `APPLE_REVIEW_REJECTION_FIX.md`
- Problem: Premium-Button zeigte Fehler auf iPad Air
- Lösung: Verbesserte Fehlerbehandlung und Receipt-Validierung
- Status: ✅ Implementiert, ready to resubmit

### 📤 Resubmission (NÄCHSTER SCHRITT)
**Datei:** `RESUBMISSION_GUIDE.md`
- Wie man die korrigierte Build zu Apple sendet
- Schritt-für-Schritt Anleitung
- Was Apple überprüft

### ✅ Pre-Submission Checklist
**Datei:** `PRE_SUBMISSION_CHECKLIST.md`
- Vollständige Todo-Liste für nächste Submission
- Backend-Setup
- Testen & QA
- Timeline & kritische Punkte

### 💳 In-App Purchase (IAP) Setup
**Datei:** `APPSTORE_IAP_SETUP.md`
- App Store Connect Konfiguration
- In-App Purchase Produkt erstellen
- Shared Secret Handling
- TestFlight Testing

### 🔐 Receipt Validation (Backend)
**Datei:** `IAP_RECEIPT_VALIDATION.md`
- Server-seitige Receipt Validierung
- Production vs. Sandbox handling
- Node.js/Express Implementation
- Error Code Referenz

### 📱 iOS Testing
**Datei:** `IPHONE_USB_TESTING.md`
- Simulator Testing
- TestFlight Setup
- Promotional Codes
- Debug vs. Release Builds

## 🎯 Nächste Schritte (nach Priorität)

1. **Sofort:**
   ```bash
   eas build --platform ios --auto-submit
   ```
   (Mit dem neuen Fix der Fehlerbehandlung)

2. **Diese Woche:**
   - Backend-Team: `docs/IAP_RECEIPT_VALIDATION.md` lesen
   - App Store Connect: In-App Purchase Produkt erstellen
   - Server: Receipt Validation implementieren

3. **Nächste Woche:**
   - Entwickler: Native IAP Integration (StoreKit2)
   - Testen mit TestFlight
   - Alles validieren

## 📊 Status Dashboard

| Komponente | Status | Nächste Aktion |
|-----------|--------|---|
| **Error Handling** | ✅ Implementiert | Resubmit |
| **Receipt Validation Docs** | ✅ Dokumentiert | Backend implementiert |
| **App Store Setup** | ⚠️ Dokumentiert | In-App Purchase erstellen |
| **Native IAP** | ❌ Noch nicht implementiert | Entwickler-Team |
| **Server Integration** | ⚠️ Plan dokumentiert | Backend-Team |
| **TestFlight** | ✅ Verfügbar | Testing durchführen |

## 🔗 Wichtige Links

- [App Store Connect](https://appstoreconnect.apple.com)
- [Apple StoreKit2 Docs](https://developer.apple.com/storekit/)
- [Expo Build Docs](https://docs.expo.dev/build/setup/)
- [Expo Submit Docs](https://docs.expo.dev/build/submit/)

## 💡 Tipps

- **Lokal testen:** Nutze den iPad 13" Simulator
  ```bash
  npx expo run:ios --device 6E487418-8E8F-4388-A416-81706801CCEC
  ```

- **Build Status prüfen:**
  ```bash
  eas build:list --platform ios --limit 10
  ```

- **Receipt in Sandbox validieren:**
  - Nutze das Beispiel aus `IAP_RECEIPT_VALIDATION.md`
  - Erwarteter Status bei TestFlight: `21007` (Sandbox in Production)
  - Dann gegen `https://sandbox.itunes.apple.com/verifyReceipt` validieren

## 📞 Team Handoff

### Für Frontend/Mobile Entwickler
- `APPLE_REVIEW_REJECTION_FIX.md` - Was wurde gefixt
- `IPHONE_USB_TESTING.md` - Wie man lokal testet
- `RESUBMISSION_GUIDE.md` - Wie man submitted

### Für Backend Entwickler
- `IAP_RECEIPT_VALIDATION.md` - Server-Integration
- `APPSTORE_IAP_SETUP.md` - App Store Setup

### Für DevOps/Release Manager
- `RESUBMISSION_GUIDE.md` - Build & Submit
- `PRE_SUBMISSION_CHECKLIST.md` - Release Checklist

---

**Letzte Aktualisierung:** 13. Dezember 2025  
**App Version:** 1.3 (mit Rejection Fix)  
**Nächstes Target:** 1.4 (mit vollständiger IAP Integration)
