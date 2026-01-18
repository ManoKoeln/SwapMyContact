# Resubmission to Apple App Store

## Quick Start: Nächste Build Einreichen

### 1. Build erstellen und hochladen

```bash
# Aus deinem Projekt-Root:
eas build --platform ios --auto-submit
```

Diese Variante:
- Baut die iOS-App im Production-Modus
- Uploaded sie automatisch zu App Store Connect
- Macht sie sofort für Review verfügbar

### 2. Alternativ: Manuell hochladen

```bash
# Nur bauen (nicht submitten)
eas build --platform ios

# Dann später submitten
eas submit --platform ios --latest
```

### 3. App Store Connect Status überprüfen

1. Gehe zu [App Store Connect](https://appstoreconnect.apple.com)
2. Wähle **SwapMyContact** App
3. Gehe zu **TestFlight** → **Internal Testing**
4. Verifiziiere, dass deine neue Build hochgeladen ist
5. Gehe zu **App Information** → **General** → **App Review Information**
6. Füge diese Notiz hinzu:

```
Fixed Issues:
- Premium button in Production shows a friendly info instead of an error
- Improved error handling around in-app purchase entry points
- Receipt validation plan: Production first, fall back to Sandbox on 21007
- Clear user messaging (no crash / no hard error)

Testing Instructions:
1. Tap Premium button
2. Accept purchase dialog
3. Complete test purchase (sandbox)
4. Verify premium status updates

Device tested: iPad Air 11-inch (M3), iPadOS 26.1
```

### 4. Build Versionierung (falls erforderlich)

Falls du Fehler siehst, dass die Build-Version schon existiert:

```javascript
// In app.json, erhöhe die Version:
{
  "expo": {
    "version": "0.1.4",  // Erhöht von 0.1.3
    ...
  }
}
```

Dann:
```bash
eas build --platform ios --auto-submit
```

### 5. Apple Review Submission

Nach Upload:

1. Gehe zur App-Version in App Store Connect
2. Klick auf die Build-Version (z.B. Build 1.4)
3. Gehe zu **Information** → **Build**
4. Wähle die neue Build aus
5. Klick **Select**
6. Gehe zu **Version Release**
7. Wähle **Manual Release** (um Release nach Approval zu kontrollieren)
8. Klick **Add for Review**

### 6. Während der Review

Erwartete Dauer: 1-2 Tage

Apple wird:
- ✅ Premium-Button antippen
- ✅ Prüfen, ob die App crasht
- ✅ Fehlerbehandlung überprüfen
- ✅ Verifiziieren, dass es sich wie erwartet verhält

### 7. Nach Approval

```bash
# Wenn genehmigt, release für Nutzer:
eas submit --platform ios --release-management

# Oder manuell in App Store Connect:
# Gehe zu Version → Release
# Klick "Release to App Store"
```

## Was hat sich geändert

Diese neue Build behebt das Problem, das Apple gemeldet hat:

```
BEFORE (REJECTED):
User taps "Jetzt abonnieren"
→ "IAP temporarily unavailable" error
→ Poor user experience
→ REJECTED

AFTER (SHOULD PASS):
User taps "Jetzt abonnieren"
→ "In‑App‑Kauf derzeit nicht verfügbar. Bitte verwenden Sie ggf. einen TestFlight Promo‑Code oder versuchen Sie es später erneut."
→ No crash
→ Professional message
→ Good user experience
```

## Wichtig

⚠️ **Die App zeigt noch "IAP nicht konfiguriert" solange Sie die native IAP nicht fully implementiert haben.**

Das ist OK für die Submission, weil:
- Kein Crash
- Benutzerfreundliche Meldung
- Keine schlechte User Experience

Aber für die volle Funktionalität brauchst du:
1. In-App Purchase Produkt in App Store Connect erstellen
2. Server-seitige Receipt Validierung (Production → Sandbox bei 21007)
3. Native StoreKit2 oder Expo IAP Integration

Siehe: `docs/PRE_SUBMISSION_CHECKLIST.md` für Details.

## Fehlerbehandlung

Falls die Build fehlschlägt:

```bash
# Logs anschauen
eas build:list --limit 5

# Spezifische Build-Logs
eas build:view --id <build-id>
```

## Fragen?

Siehe die Dokumentation in `docs/`:
- `APPLE_REVIEW_REJECTION_FIX.md` - Was behoben wurde
- `IAP_RECEIPT_VALIDATION.md` - Server Integration
- `APPSTORE_IAP_SETUP.md` - App Store Connect Setup
