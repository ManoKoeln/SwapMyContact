import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, Image, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { getCurrentLanguage } from '../utils/i18n';
import appConfig from '../app.json';
import { isPremium, setPremium, loadPremiumStatus } from '../utils/premium';

// QR-Code Asset direkt importieren
const qrCodeImage = require('../assets/qr_impressum.png');

// Lokale Übersetzungen für das Impressum (separate Dateien)
const impressumTranslations = {
  de: require('../translations/de_Impressum.json'),
  en: require('../translations/en_Impressum.json'),
};

function lt(key) {
  const lang = getCurrentLanguage();
  const source = impressumTranslations[lang] || impressumTranslations.en;
  return source[key] || key;
}

function renderMultiline(text, style) {
  return text.split('\n').map((line, idx) => (
    <Text key={idx} style={style}>{line.trim()}</Text>
  ));
}

export default function ImpressumScreen({ navigation }) {
  const [premium, setPremiumState] = useState(false);

  useEffect(() => {
    loadPremiumStatus((status) => {
      setPremiumState(status);
    });
  }, []);

  const responsibleLines = lt('imprint.responsible.text');
  const disclaimerText = lt('imprint.disclaimer.text');

  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <View style={{ alignItems: 'center', marginBottom: 12 }}>
        <Image
          source={qrCodeImage}
          style={{ width: 180, height: 180 }}
          resizeMode='contain'
          accessibilityRole='image'
          accessibilityLabel={lt('imprint.title') + ' QR'}
        />
        <View style={styles.impressum}>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.swapmycontact.de')}>
            <Text style={[styles.impressumText, { color: '#007AFF', textDecorationLine: 'underline' }]}>
              www.swapmycontact.de
            </Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>
            Version {appConfig.expo.version} (Build {appConfig.expo.ios.buildNumber})
          </Text>
        </View>
      </View>
      <View style={{ marginBottom: 16, alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '600' }}>{lt('imprint.title')}</Text>
        <Text style={{ marginTop: 8, fontSize: 22, fontWeight: '600' }}>{lt('imprint.intro')}</Text>
      </View>
      <View style={{ gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '600' }}>{lt('imprint.responsible')}</Text>
        {renderMultiline(responsibleLines, { lineHeight: 20 })}

        <Text style={{ fontSize: 18, fontWeight: '600', marginTop: 8 }}>{lt('imprint.disclaimer')}</Text>
        <Text>{disclaimerText}</Text>

        {__DEV__ && (
          <View style={{ marginTop: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: '#eee' }}>
            <TouchableOpacity
              onPress={() => {
                setPremiumState((prev) => {
                  const newStatus = !prev;
                  setPremium(newStatus);
                  return newStatus;
                });
              }}
              style={{
                backgroundColor: premium ? '#FF3B30' : '#34C759',
                paddingVertical: 12,
                paddingHorizontal: 20,
                borderRadius: 8,
                alignItems: 'center',
                marginBottom: 12
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                {premium ? '🔓 Premium deaktivieren' : '🔒 Premium aktivieren'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ marginTop: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: '#eee' }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Datenschutz')}
            style={{
              backgroundColor: '#007AFF',
              paddingVertical: 12,
              paddingHorizontal: 20,
              borderRadius: 8,
              alignItems: 'center'
            }}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{lt('footer.links.privacy')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  impressum: {
    marginTop: 16,
    alignItems: 'center',
  },
  impressumText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    color: '#999',
  }
});
