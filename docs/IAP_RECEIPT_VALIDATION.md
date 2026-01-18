# In-App Purchase (IAP) Receipt Validation

## Problem

Apple rejected the app because in-app purchase validation was not properly handling Sandbox receipts from TestFlight vs Production receipts from the App Store.

## Solution

The app now implements proper receipt validation that handles both environments:

### Client-Side (`utils/iap.js`)

The client collects receipts from the device and sends them to your backend server for validation.

### Server-Side Receipt Validation

When your server receives a receipt, it must:

1. **First validate against Production Server**
   - Endpoint: `https://buy.itunes.apple.com/verifyReceipt`
   - If valid (status = 0), accept the receipt
   - If invalid with status = 21007 (Sandbox receipt), proceed to step 2

2. **If Production fails with error 21007, validate against Sandbox**
   - Endpoint: `https://sandbox.itunes.apple.com/verifyReceipt`
   - This indicates the user is testing via TestFlight
   - If valid (status = 0), accept as a sandbox purchase
   - Update user's premium status accordingly

3. **Handle other error codes**
   - 21002: The data in the receipt-data property was malformed
   - 21003: The receipt could not be authenticated
   - 21004: The shared secret you provided does not match
   - 21005: The receipt server is temporarily unavailable
   - 21007: **This receipt is a sandbox receipt, but it was sent to the production service**
   - 21010: The subscription has expired

## Implementation Example (Node.js/Express)

```javascript
const axios = require('axios');

const APPLE_PRODUCTION_URL = 'https://buy.itunes.apple.com/verifyReceipt';
const APPLE_SANDBOX_URL = 'https://sandbox.itunes.apple.com/verifyReceipt';

async function validateAppleReceipt(receipt, sharedSecret) {
  const payload = {
    'receipt-data': receipt,
    'password': sharedSecret,
  };

  try {
    // Try production first
    const productionResponse = await axios.post(APPLE_PRODUCTION_URL, payload);
    const { status } = productionResponse.data;

    if (status === 0) {
      // Valid production receipt
      return {
        valid: true,
        environment: 'production',
        data: productionResponse.data,
      };
    }

    if (status === 21007) {
      // Sandbox receipt - validate against sandbox server
      const sandboxResponse = await axios.post(APPLE_SANDBOX_URL, payload);
      const sandboxStatus = sandboxResponse.data.status;

      if (sandboxStatus === 0) {
        // Valid sandbox receipt (TestFlight)
        return {
          valid: true,
          environment: 'sandbox',
          data: sandboxResponse.data,
        };
      }

      return {
        valid: false,
        error: `Sandbox validation failed: ${sandboxStatus}`,
      };
    }

    // Other errors
    return {
      valid: false,
      error: `Receipt validation failed with status ${status}`,
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message,
    };
  }
}

// Express endpoint
app.post('/api/validate-receipt', async (req, res) => {
  const { receipt } = req.body;
  const appStoreSharedSecret = process.env.APP_STORE_SHARED_SECRET;

  const validation = await validateAppleReceipt(receipt, appStoreSharedSecret);

  if (validation.valid) {
    // Extract subscription info from validation.data.latest_receipt_info
    // Update user's premium status in database
    res.json({ success: true, environment: validation.environment });
  } else {
    res.status(400).json({ success: false, error: validation.error });
  }
});
```

## Configuration Required

1. **App Store Shared Secret**
   - Get from App Store Connect → Your App → In-App Purchases
   - Set as environment variable: `APP_STORE_SHARED_SECRET`

2. **Bundle ID**
   - Must match app configuration: `com.businesscard2025.swapcontactnew`

3. **In-App Purchase Product ID**
   - Production: `com.businesscard2025.swapcontactnew.premium.yearly`
   - Must be created in App Store Connect

## Testing

### TestFlight (Sandbox)
- Receipt will have status 21007 when validated against production
- Server should validate against sandbox URL instead
- No real payment is charged

### Production (App Store)
- Receipt validates directly against production URL
- Real payment is charged

## Receipt Response Structure

```json
{
  "receipt": {
    "bundle_id": "com.businesscard2025.swapcontactnew",
    "application_version": "1.3",
    "in_app": [
      {
        "product_id": "com.businesscard2025.swapcontactnew.premium.yearly",
        "transaction_id": "...",
        "original_transaction_id": "...",
        "purchase_date": "2024-12-13 10:00:00 Etc/GMT",
        "original_purchase_date": "2024-12-13 10:00:00 Etc/GMT",
        "expires_date": "2025-12-13 10:00:00 Etc/GMT",
        "is_trial_period": "false"
      }
    ]
  },
  "status": 0
}
```

## Next Steps

1. Implement server-side receipt validation with the logic above
2. Set `APP_STORE_SHARED_SECRET` environment variable
3. Create the Premium subscription product in App Store Connect
4. Implement native iOS StoreKit2 for actual purchase flow
5. Test with TestFlight before submission
