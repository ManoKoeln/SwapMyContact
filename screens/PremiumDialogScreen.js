import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  SafeAreaView,
  Platform,
} from 'react-native';
import { getProducts, purchasePremium } from '../utils/iap';
import { t } from '../utils/i18n';

const PremiumDialogScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const isAndroid = Platform.OS === 'android';

  useEffect(() => {
    loadProduct();
  }, []);

  const getPeriodInfo = (p) => {
    if (!p) return { label: '—', unitLabel: '' };
    // iOS fields
    const numIOS = p.subscriptionPeriodNumberIOS;
    const unitIOS = p.subscriptionPeriodUnitIOS; // DAY | WEEK | MONTH | YEAR
    // Android field (ISO8601 like P1W, P1M, P1Y)
    const periodAndroid = p.subscriptionPeriodAndroid;

    let count = numIOS;
    let unit = unitIOS;

    if (!unit && periodAndroid) {
      // Parse simple ISO8601 durations PnD/PnW/PnM/PnY
      const m = /P(\d+)(D|W|M|Y)/.exec(periodAndroid);
      if (m) {
        count = parseInt(m[1], 10);
        const map = { D: 'DAY', W: 'WEEK', M: 'MONTH', Y: 'YEAR' };
        unit = map[m[2]];
      }
    }

    // Default to 1 YEAR if missing
    if (!unit) {
      count = 1;
      unit = 'YEAR';
    }

    const unitTranslated = {
      DAY: count === 1 ? t('premiumDialog.day') : t('premiumDialog.days'),
      WEEK: count === 1 ? t('premiumDialog.week') : t('premiumDialog.weeks'),
      MONTH: count === 1 ? t('premiumDialog.month') : t('premiumDialog.months'),
      YEAR: count === 1 ? t('premiumDialog.year') : t('premiumDialog.years'),
    }[unit] || t('premiumDialog.year');

    return {
      label: `${count} ${unitTranslated}`,
      unitLabel: unit === 'DAY' ? t('premiumDialog.day') : unit === 'WEEK' ? t('premiumDialog.week') : unit === 'MONTH' ? t('premiumDialog.month') : t('premiumDialog.year'),
    };
  };

  const formatPrice = (p) => {
    if (!p) {
      // Fallback for dev mode / when store is unavailable
      return '0,99 € / 1 Jahr';
    }
    
    // Android: check multiple price fields
    const price = p.localizedPrice || p.price || p.oneTimePurchaseOfferDetails?.formattedPrice;
    
    if (!price) {
      console.log('Premium product data:', JSON.stringify(p, null, 2));
      // Fallback when product exists but price is missing
      return '0,99 € / 1 Jahr';
    }
    
    const { label } = getPeriodInfo(p);
    return `${price} / ${label}`;
  };

  const loadProduct = async () => {
    try {
      const products = await getProducts();
      if (products.length > 0) {
        setProduct(products[0]);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const purchase = await purchasePremium();
      console.log('Purchase successful:', purchase);
      
      Alert.alert(
        t('premiumDialog.successTitle'),
        t('premiumDialog.successMessage'),
        [
          {
            text: t('common.ok'),
            onPress: () => {
              // Navigate to ProfileList (home) and refresh
              navigation.navigate('ProfileList', { refresh: true });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Purchase error:', error);
      Alert.alert(t('premiumDialog.errorTitle'), error.message || t('premiumDialog.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  const openLink = (url) => {
    Linking.openURL(url).catch(() => {
      Alert.alert(t('premiumDialog.errorTitle'), t('premiumDialog.linkError'));
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        {/* Close Button */}
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={handleCancel}
        >
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {(product?.title || t('premiumDialog.title')).replace('(annual)', '(jährlich)').replace('(Annual)', '(jährlich)')}
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={styles.mainText}>
            {t('premiumDialog.description')}
          </Text>

          {/* Product Details */}
          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('premiumDialog.subscription')}</Text>
              <Text style={styles.detailValue}>{formatPrice(product)}</Text>
            </View>
          </View>

          {/* Terms Text */}
          <View style={styles.termsBox}>
            <Text style={styles.termsText}>
              {t('premiumDialog.autoRenew')}
            </Text>
            <Text style={styles.termsText}>
              {Platform.OS === 'ios' 
                ? t('premiumDialog.billingIOS')
                : t('premiumDialog.billingAndroid')}
            </Text>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancel}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>{t('premiumDialog.cancel')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.purchaseButton, loading && styles.purchaseButtonDisabled]}
            onPress={handlePurchase}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={styles.purchaseButtonText}>{t('premiumDialog.unlock')}</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Links */}
        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => openLink('https://swapmycontact.de/datenschutz.html')}>
            <Text style={styles.linkText}>{t('premiumDialog.privacyPolicy')}</Text>
          </TouchableOpacity>

          <View style={styles.linkSeparator} />

          {Platform.OS === 'ios' ? (
            <TouchableOpacity onPress={() => openLink('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/')}>
              <Text style={styles.linkText}>{t('premiumDialog.termsOfService')}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => openLink('https://play.google.com/about/play-terms/')}>
              <Text style={styles.linkText}>{t('premiumDialog.playTerms')}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 40,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#999',
    fontWeight: '300',
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  content: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  mainText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
    marginBottom: 20,
    textAlign: 'left',
  },
  detailsBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '600',
  },
  termsBox: {
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  termsText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#333',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#E8E8E8',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  purchaseButton: {
    flex: 1,
    paddingVertical: 14,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  purchaseButtonDisabled: {
    opacity: 0.7,
  },
  purchaseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  linksContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  linkText: {
    fontSize: 13,
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
  linkSeparator: {
    height: 8,
  },
});

export default PremiumDialogScreen;
