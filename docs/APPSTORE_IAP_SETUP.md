# App Store Connect In-App Purchase Setup

## Issue
Apple rejected the app because in-app purchases were not properly configured and threw errors when users tapped the Premium button.

## Fix Steps

### 1. Create In-App Purchase Product

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your app "SwapMyContact"
3. Go to **In-App Purchases**
4. Click the **+** button to create a new in-app purchase

**Product Details:**
- **Type:** Auto-Renewable Subscription
- **Reference Name:** Premium Yearly Subscription
- **Product ID:** `com.businesscard2025.swapcontactnew.premium.yearly`
- **Pricing and Availability:**
  - Select a tier (e.g., Tier 1 @ €0.99 or higher)
  - Duration: 1 Year
  - Renewal frequency: Once per year
  - Free trial period: (optional) 3-7 days

4. Fill in **Localization:**
   - Display Name: "Premium Yearly"
   - Description: "Unbegrenzte Profile und alle Premium-Funktionen"

5. **App Store Shared Secret:**
   - This is critical for receipt validation
   - Location: App Store Connect → Your App → In-App Purchases → App-Specific Shared Secret
   - Copy and save this secret
   - Use it in your server's `APP_STORE_SHARED_SECRET` environment variable

### 2. Configure Signing & Capabilities

In Xcode:

1. Open `ios/SwapContact.xcworkspace`
2. Select the **SwapContact** target
3. Go to **Signing & Capabilities**
4. Click **+ Capability** and add **In-App Purchase**

### 3. Request In-App Purchase Capability

In your app, you need to:

1. ✅ Request the proper entitlements (already in Xcode project)
2. ✅ Handle receipt validation server-side (see `IAP_RECEIPT_VALIDATION.md`)
3. ✅ Provide proper error messages to users

### 4. Testing with TestFlight

**Before submitting:**

1. Add test users in App Store Connect:
   - Users and Access → Testers → TestFlight Internal Testers
   - Or create a specific test email account

2. Build and upload a TestFlight build:
   ```bash
   eas build --platform ios --auto-submit
   ```

3. Install via TestFlight and test the purchase flow:
   - Tap Premium button
   - Complete fake purchase (no real charge)
   - Verify your server receives and validates the sandbox receipt

4. Check server logs for status code 21007 (sandbox receipt in production attempt)

### 5. What Apple Tests

Apple's reviewers will:
- ✅ Tap the Premium button
- ✅ Start the purchase flow
- ✅ Verify proper error messages are shown (not crashes)
- ✅ Check that the app doesn't break on errors

**Current Status:**
- ❌ IAP is configured to show "not yet configured" message (intentional)
- ✅ Error handling is in place
- ✅ No crashes when tapping Premium button
- ⚠️ Needs: Actual StoreKit2 integration and server validation

### 6. Complete Implementation Checklist

- [ ] Create Premium subscription product in App Store Connect
- [ ] Copy App-Specific Shared Secret
- [ ] Set up server-side receipt validation (Node.js example provided in `IAP_RECEIPT_VALIDATION.md`)
- [ ] Implement native iOS StoreKit2 integration (or use Expo modules)
- [ ] Test with TestFlight build
- [ ] Verify sandbox receipt validation works
- [ ] Submit to App Review

### 7. Error Handling

The app now properly handles IAP errors:

- **Not yet configured:** Shows friendly message instead of crash
- **Network errors:** Proper error messages for server issues
- **Receipt validation:** Server validates both production and sandbox receipts
- **Expired receipts:** Server returns appropriate status codes

### Important Notes

1. **Bundle ID must match:** `com.businesscard2025.swapcontactnew`
2. **Sandbox receipts:** Status code 21007 means "sandbox receipt sent to production" - this is expected in TestFlight
3. **Production receipts:** Status code 0 means valid
4. **Shared Secret:** Required for both production and sandbox validation

## Reference

- [Apple StoreKit Documentation](https://developer.apple.com/storekit/)
- [App Store Connect Help - In-App Purchases](https://help.apple.com/app-store-connect/#/dev3a2159146)
- [Receipt Validation Guide](https://developer.apple.com/documentation/appstoreserverapi/app-store-server-api)
