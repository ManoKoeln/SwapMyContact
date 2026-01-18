import React, { useState, useEffect } from 'react';
import { View, Text, Switch, SafeAreaView, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Linking, Platform } from 'react-native';
import { isPremium, setPremium, loadPremiumStatus } from '../utils/premium';
import { getProducts, purchasePremium, restorePurchases, checkSubscriptionStatus } from '../utils/iap';
import { getDB } from '../utils/sqlite';

export default function SettingsScreen() {
  const [premium, setPremiumState] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const product = products[0];
  const productPrice = product?.localizedPrice || product?.price || '';
  const productDescription = product?.description || 'Unbegrenzte Profile und alle zukünftigen Premium-Funktionen';

  useEffect(() => {
    loadPremiumStatus((status) => {
      setPremiumState(status);
    });
    
    // Lade verfügbare Subscriptions
    loadProducts();
    
    // Prüfe aktuellen Subscription-Status
    checkStatus();
  }, []);

  const loadProducts = async () => {
    try {
      const availableProducts = await getProducts();
      setProducts(availableProducts);
    } catch (error) {
      console.warn('Error loading products:', error);
    }
  };

  const checkStatus = async () => {
    try {
      const isActive = await checkSubscriptionStatus();
      setPremiumState(isActive);
    } catch (error) {
      console.warn('Error checking status:', error);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await purchasePremium();
      // Purchase listener in iap.js wird Premium aktivieren
      setTimeout(() => checkStatus(), 2000); // Status nach Kauf prüfen
    } catch (error) {
      console.error('Purchase error:', error);
      
      // Provide user-friendly error message
      let userMessage = 'Abonnement konnte nicht abgeschlossen werden.';
      
      if (error.message.includes('not yet configured')) {
        userMessage = 'In-App Purchases werden derzeit vorbereitet. Bitte versuche es später erneut.';
      } else if (error.message.includes('cancelled')) {
        userMessage = 'Kauf abgebrochen.';
      } else if (error.message.includes('receipt')) {
        userMessage = 'Zahlungsbestätigung konnte nicht überprüft werden. Bitte kontaktiere den Support.';
      }
      
      Alert.alert('Info', userMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    setLoading(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        setPremiumState(true);
        Alert.alert('Erfolg', 'Premium-Abonnement wurde wiederhergestellt!');
      } else {
        Alert.alert('Info', 'Kein aktives Abonnement gefunden.');
      }
    } catch (error) {
      Alert.alert('Fehler', 'Wiederherstellung fehlgeschlagen: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeemCode = async () => {
    // Öffne App Store Redeem Dialog für iOS
    if (Platform.OS === 'ios') {
      try {
        // App Store Redeem Sheet URL für iOS
        const canOpen = await Linking.canOpenURL('itms-services://?action=purchaseIntent&bundleId=de.businesscard.SwapContact');
        if (canOpen) {
          await Linking.openURL('itms-services://?action=purchaseIntent&bundleId=de.businesscard.SwapContact');
        } else {
          Alert.alert('Fehler', 'Kann App Store nicht öffnen');
        }
      } catch (error) {
        console.error('Error opening App Store:', error);
        Alert.alert('Fehler', 'App Store konnte nicht geöffnet werden');
      }
    } else {
      Alert.alert('Info', 'Redeem Code ist derzeit nur auf iOS verfügbar');
    }
  };

  const handleTogglePremium = (value) => {
    // Nur für Entwicklungszwecke - in Production deaktivieren
    if (__DEV__) {
      // Im Dev-Mode: Aktiviere als Test-Premium (kann deaktiviert werden)
      const expiryDate = value ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null; // 1 Jahr
      setPremium(value, expiryDate, true); // isTestMode = true
      setPremiumState(value);
    } else {
      Alert.alert('Info', 'Bitte abonniere Premium über den Button unten.');
    }
  };

  const handleResetPremiumCache = () => {
    if (__DEV__) {
      try {
        const db = getDB();
        db.execSync('DELETE FROM settings WHERE key IN (?, ?, ?)', ['isPremium', 'premiumIsTest', 'premiumExpiry']);
        setPremiumState(false);
        Alert.alert('Erfolg', 'Premium-Cache wurde zurückgesetzt');
      } catch (error) {
        console.error('Error resetting premium cache:', error);
        Alert.alert('Fehler', 'Cache konnte nicht zurückgesetzt werden');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Einstellungen</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Premium-Funktionen</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              Premium kann über das Abonnement unten aktiviert werden.
            </Text>
            {__DEV__ && (
              <Text style={[styles.infoText, { marginTop: 6, color: '#555' }]}>
                Dev-Hinweis: Premium-Testschalter findest du jetzt im Impressum-Screen.
              </Text>
            )}
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {premium 
              ? '✅ Premium aktiv - Unbegrenzte Profile verfügbar'
              : '⚠️ Basis-Version - Nur 1 Profil verfügbar'}
          </Text>
        </View>

        {__DEV__ && (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.resetCacheButton}
              onPress={handleResetPremiumCache}
            >
              <Text style={styles.resetCacheButtonText}>🔄 Premium-Cache zurücksetzen (Dev)</Text>
            </TouchableOpacity>
          </View>
        )}

        {!premium && (
          <View style={styles.purchaseSection}>
            <Text style={styles.purchaseTitle}>Premium-Abonnement</Text>
            <Text style={styles.purchaseDescription}>
              Erhalte Zugriff auf unbegrenzte Profile und alle zukünftigen Premium-Funktionen
            </Text>
            
            {products.length > 0 && (
              <View style={styles.productBox}>
                <Text style={styles.productName}>Jährliches Abo</Text>
                <Text style={styles.productDescription}>{productDescription}</Text>
                {productPrice ? (
                  <Text style={styles.productPrice}>{productPrice}/Jahr</Text>
                ) : null}
                <Text style={styles.productNote}>
                  Preis variiert je nach Land. Jederzeit kündbar.
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={[styles.purchaseButton, loading && styles.purchaseButtonDisabled]}
              onPress={handlePurchase}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.purchaseButtonText}>Jetzt abonnieren</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.restoreButton}
              onPress={handleRestore}
              disabled={loading}
            >
              <Text style={styles.restoreButtonText}>Abonnement wiederherstellen</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.redeemButton}
              onPress={handleRedeemCode}
              disabled={loading}
            >
              <Text style={styles.redeemButtonText}>🎟️ Voucher Code einlösen</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
  },
  labelContainer: {
    flex: 1,
    marginRight: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#666',
  },
  infoBox: {
    padding: 16,
    backgroundColor: '#e8f4ff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  purchaseSection: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
  },
  purchaseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  purchaseDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  productBox: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  productDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  productNote: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  purchaseButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  purchaseButtonDisabled: {
    opacity: 0.6,
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  restoreButton: {
    padding: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    color: '#007AFF',
    fontSize: 14,
  },
  redeemButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  redeemButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  resetCacheButton: {
    padding: 12,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  resetCacheButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});
