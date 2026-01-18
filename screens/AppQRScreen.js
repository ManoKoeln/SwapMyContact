import React, { useLayoutEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, Image } from 'react-native';
import { t, addLanguageListener } from '../utils/i18n';

export default function AppQRScreen({ navigation }) {
  const [, forceUpdate] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('appQR.title')
    });
  }, [navigation]);

  React.useEffect(() => {
    const unsubscribe = addLanguageListener(() => {
      forceUpdate(n => n + 1);
      navigation.setOptions({
        title: t('appQR.title')
      });
    });
    return () => unsubscribe();
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../assets/swapmycontact_app_qr.png')}
          style={styles.qrCode}
          resizeMode="contain"
        />
        <Text style={styles.downloadText}>{t('appQR.downloadText')}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrCode: {
    width: 280,
    height: 280,
    marginBottom: 24,
  },
  downloadText: {
    fontSize: 16,
    color: '#1E90FF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
