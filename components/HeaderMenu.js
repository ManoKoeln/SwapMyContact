import React, { useState, useEffect, useRef } from 'react';
import { View, Image, TouchableOpacity, Text, StyleSheet, Modal, Linking, Animated } from 'react-native';
import { isPremium as isPremiumActive, loadPremiumStatus } from '../utils/premium';
import { t } from '../utils/i18n';
import SparkleStar from './SparkleStar';

export default function HeaderMenu({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const sparkleOpacity = useRef(new Animated.Value(0)).current;
  const sparkleScale = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    checkPremium();
    startSparkleAnimation();
  }, []);

  const startSparkleAnimation = () => {
    const animate = () => {
      // Random delay between 2-8 seconds
      const randomDelay = Math.random() * 6000 + 2000;
      
      setTimeout(() => {
        // Fade in and scale up (0.5s)
        Animated.parallel([
          Animated.timing(sparkleOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(sparkleScale, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start(() => {
          // Fade out and scale down (0.5s)
          setTimeout(() => {
            Animated.parallel([
              Animated.timing(sparkleOpacity, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
              }),
              Animated.timing(sparkleScale, {
                toValue: 0.3,
                duration: 500,
                useNativeDriver: true,
              }),
            ]).start(() => {
              // Repeat animation
              animate();
            });
          }, 100); // Short pause at full visibility
        });
      }, randomDelay);
    };
    
    animate();
  };

  const checkPremium = async () => {
    // Load premium status from database
    loadPremiumStatus((premium) => {
      setIsPremium(premium);
    });
  };

  const toggleMenu = () => {
    // Refresh premium status when opening menu
    if (!menuVisible) {
      checkPremium();
    }
    setMenuVisible(!menuVisible);
    setIsPressed(!menuVisible);
  };

  const closeMenu = () => {
    setMenuVisible(false);
    setIsPressed(false);
  };

  const handleMenuPress = (action) => {
    closeMenu();
    setTimeout(() => action(), 100);
  };

  const openWebsite = () => {
    Linking.openURL('https://www.swapmycontact.de').catch(() => {});
  };

  const openTerms = () => {
    Linking.openURL('https://www.apple.com/legal/internet-services/itunes/dev/stdeula/').catch(() => {});
  };

  return (
    <View>
      <TouchableOpacity
        onPress={toggleMenu}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel="Menu"
      >
        <View>
          <Image
            source={
              isPressed
                ? require('../assets/button_pressed_clean_noshadow.png')
                : require('../assets/button_normal_clean_noshadow.png')
            }
            style={styles.buttonImage}
            resizeMode="contain"
          />
          <Animated.View 
            style={[
              styles.sparkleContainer,
              {
                opacity: sparkleOpacity,
                transform: [{ scale: sparkleScale }]
              }
            ]}
          >
            <SparkleStar size={16} color="#FFD56A" />
          </Animated.View>
        </View>
      </TouchableOpacity>

      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeMenu}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={closeMenu}
        >
          <View style={styles.menuContainer}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress(() => navigation.navigate('Impressum'))}
            >
              <Text style={styles.menuText}>{t('menu.impressum')}</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress(() => navigation.navigate('Datenschutz'))}
            >
              <Text style={styles.menuText}>{t('menu.datenschutz')}</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress(openTerms)}
            >
              <Text style={styles.menuText}>{t('menu.termsOfUse')}</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => handleMenuPress(openWebsite)}
            >
              <Text style={styles.menuText}>{t('menu.description')}</Text>
            </TouchableOpacity>

            {!isPremium && (
              <>
                <View style={styles.separator} />
                <TouchableOpacity
                  style={[styles.menuItem, styles.premiumItem]}
                  onPress={() => handleMenuPress(() => navigation.navigate('PremiumDialog'))}
                >
                  <Text style={[styles.menuText, styles.premiumText]}>{t('menu.buyPremium')}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 8,
  },
  buttonImage: {
    width: 38,
    height: 38,
  },
  sparkleContainer: {
    position: 'absolute',
    top: -2,
    right: -2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 60,
    paddingRight: 10,
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  premiumItem: {
    backgroundColor: '#F0F8FF',
  },
  premiumText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
