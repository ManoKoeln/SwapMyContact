import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNIap from 'react-native-iap';
import { setPremium } from './premium';

// In-App Purchase helper using native iOS App Store and Android Play Store APIs
const STORAGE_KEY = 'iap_receipt';
const STORAGE_PREMIUM_KEY = 'iap_premium';
// Produkt-IDs pro Plattform (falls iOS/Android unterschiedlich sind, hier anpassen)
const PRODUCT_IDS_MAP = {
  ios: ['Swap2025_11'],
  android: ['2025_swapmycontact_18'],
};
const PRODUCT_IDS = Platform.OS === 'ios' ? PRODUCT_IDS_MAP.ios : PRODUCT_IDS_MAP.android;

const mapErrorToMessage = (error) => {
  // Keep user-facing message concise; log technical details separately
  if (!error) return 'Unbekannter Fehler beim Kauf.';
  if (error.code === 'E_USER_CANCELLED') return 'Kauf abgebrochen.';
  if (error.code === 'E_ITEM_UNAVAILABLE') return 'Produkt derzeit nicht verfügbar.';
  if (error.code === 'E_SERVICE_ERROR') return 'IAP-Dienst nicht erreichbar.';
  return error.message || 'IAP-Fehler';
};

const persistPremium = async (isActive, receipt) => {
  await AsyncStorage.setItem(STORAGE_PREMIUM_KEY, isActive ? 'true' : 'false');
  if (receipt) await AsyncStorage.setItem(STORAGE_KEY, receipt);
  setPremium(isActive);
};

export const initIAP = async () => {
  try {
    await RNIap.initConnection();
    if (Platform.OS === 'android') {
      await RNIap.flushFailedPurchasesCachedAsPendingAndroid();
    }
    
    // Set up purchase update listener to handle pending purchases
    const purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(async (purchase) => {
      console.log('IAP: Purchase updated:', purchase);
      const receipt = purchase.transactionReceipt || purchase.purchaseToken;
      
      if (receipt) {
        try {
          // For Android: Acknowledge the purchase
          if (Platform.OS === 'android' && purchase.purchaseToken && !purchase.isAcknowledgedAndroid) {
            await RNIap.acknowledgePurchaseAndroid({ 
              token: purchase.purchaseToken,
              developerPayload: purchase.developerPayloadAndroid 
            });
            console.log('IAP: Purchase acknowledged via listener');
          }
          
          // Finish the transaction
          await RNIap.finishTransaction({ purchase, isConsumable: false });
          
          // Update premium status
          await persistPremium(true, receipt);
          console.log('IAP: Purchase processed via listener');
        } catch (error) {
          console.error('IAP: Error processing purchase update:', error);
        }
      } else {
        // iOS: Finish transaction even without receipt to clear pending state
        if (Platform.OS === 'ios') {
          try {
            await RNIap.finishTransaction({ purchase, isConsumable: false });
            console.log('IAP: iOS transaction finished without receipt');
          } catch (error) {
            console.error('IAP: Error finishing iOS transaction:', error);
          }
        }
      }
    });
    
    const purchaseErrorSubscription = RNIap.purchaseErrorListener((error) => {
      console.log('IAP: Purchase error:', error);
    });
    
    // Clear pending transactions on iOS
    if (Platform.OS === 'ios') {
      try {
        await RNIap.clearTransactionIOS();
        console.log('IAP: Cleared pending iOS transactions');
      } catch (error) {
        console.log('IAP: No pending transactions to clear:', error);
      }
    }
    
    console.log('IAP: Initialized with listeners');
    return true;
  } catch (error) {
    // IAP is not available in simulator or development builds - this is expected
    if (error.code === 'E_IAP_NOT_AVAILABLE') {
      console.log('IAP: Not available (simulator/dev build)');
      return false;
    }
    console.error('IAP init failed:', error);
    return false;
  }
};

export const endIAP = async () => {
  try {
    await RNIap.endConnection();
  } catch (error) {
    console.log('IAP cleanup failed:', error);
  }
};

export const getProducts = async () => {
  try {
    // Verbindung initialisieren, bevor Store-Abfragen erfolgen
    await initIAP();
    // Ensure PRODUCT_IDS is valid before calling getSubscriptions
    if (!PRODUCT_IDS || PRODUCT_IDS.length === 0) {
      console.warn('No product IDs configured');
      return [];
    }
    
    const subs = await RNIap.getSubscriptions({ skus: PRODUCT_IDS });
    return subs || [];
  } catch (error) {
    console.error('Error loading products:', error);
    console.log('Attempted to load product IDs:', PRODUCT_IDS);
    return [];
  }
};

export const purchasePremium = async () => {
  try {
    await initIAP();
    const productId = PRODUCT_IDS[0];

    // Load subscription to retrieve Android offer token(s)
    const subs = await RNIap.getSubscriptions({ skus: [productId] });
    const sub = Array.isArray(subs) ? subs.find((s) => s.productId === productId || s.sku === productId) : null;
    if (!sub) {
      throw new Error(
        Platform.OS === 'ios'
          ? 'Abo nicht gefunden. Bitte prüfe die iOS Produkt-ID in App Store Connect und die Abo-Konfiguration.'
          : 'Abo nicht gefunden. Bitte prüfe die Android Produkt-ID in Google Play Console und die Abo-Konfiguration.'
      );
    }

    // Build subscriptionOffers for Android
    let subscriptionOffers = undefined;
    if (Platform.OS === 'android') {
      const offerToken = sub?.subscriptionOfferDetails?.[0]?.offerToken;
      if (!offerToken) {
        throw new Error('subscriptionOffers are required for Google Play subscriptions');
      }
      subscriptionOffers = [{ sku: productId, offerToken }];
    }

    const purchase = await RNIap.requestSubscription({ sku: productId, subscriptionOffers });
    if (!purchase) throw new Error('Kauf fehlgeschlagen.');

    // For Android: Acknowledge the purchase first
    if (Platform.OS === 'android' && purchase.purchaseToken) {
      try {
        await RNIap.acknowledgePurchaseAndroid({ 
          token: purchase.purchaseToken,
          developerPayload: purchase.developerPayloadAndroid 
        });
        console.log('IAP: Purchase acknowledged for Android');
      } catch (ackError) {
        console.error('IAP: Error acknowledging purchase:', ackError);
        // Continue anyway - finishTransaction might still work
      }
    }

    // Finish transaction for both platforms
    await RNIap.finishTransaction({
      purchase,
      isConsumable: false,
      developerPayloadAndroid: purchase.developerPayloadAndroid,
    });

    await persistPremium(true, purchase.transactionReceipt || purchase.purchaseToken);
    console.log('IAP: Purchase completed and persisted');
    return purchase;
  } catch (error) {
    console.error('Purchase failed:', error);
    throw new Error(mapErrorToMessage(error));
  }
};

export const restorePurchases = async () => {
  try {
    await initIAP();
    const purchases = await RNIap.getAvailablePurchases();
    const hasPremium = purchases.some((p) => PRODUCT_IDS.includes(p.productId));
    if (hasPremium) {
      const first = purchases.find((p) => PRODUCT_IDS.includes(p.productId));
      await persistPremium(true, first?.transactionReceipt || first?.purchaseToken);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Restore purchases failed:', error);
    return false;
  }
};

export const getSubscriptionStatus = async () => {
  try {
    const isPrem = await AsyncStorage.getItem(STORAGE_PREMIUM_KEY);
    return {
      isActive: isPrem === 'true',
      subscription: isPrem === 'true' ? { productId: PRODUCT_IDS[0] } : null,
    };
  } catch (error) {
    console.error('Error checking subscription status:', error);
    return { isActive: false, subscription: null };
  }
};

/**
 * Request a subscription (placeholder for native code)
 */
export const requestSubscription = async () => {
  try {
    console.log('IAP: Requesting subscription...');
    // This would trigger native purchase flow
    return null;
  } catch (error) {
    console.error('Subscribe error:', error);
    return null;
  }
};

/**
 * Check if subscription is currently active
 */
export const checkSubscriptionStatus = async () => {
  try {
    const status = await getSubscriptionStatus();
    return status.isActive;
  } catch (error) {
    console.error('Error checking subscription:', error);
    return false;
  }
};
