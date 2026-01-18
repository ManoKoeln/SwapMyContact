import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { getCurrentLanguage } from '../utils/i18n';

// Separate Übersetzungen für Datenschutz/Impressum
const translations = {
  de: require('../translations/de_Impressum.json'),
  en: require('../translations/en_Impressum.json'),
};

function lt(key) {
  const lang = getCurrentLanguage();
  const src = translations[lang] || translations.en;
  return src[key] || key;
}

function Section({ titleKey, textKey }) {
  return (
    <View style={{ marginTop: 14 }}>
      <Text style={{ fontSize: 18, fontWeight: '600' }}>{lt(titleKey)}</Text>
      <Text style={{ marginTop: 6, lineHeight: 20 }}>{lt(textKey)}</Text>
    </View>
  );
}

export default function DatenschutzScreen() {
  return (
    <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 22, fontWeight: '600' }}>{lt('privacy.title')}</Text>
        <Text style={{ marginTop: 4, color: '#666' }}>{lt('privacy.intro')}</Text>
      </View>

      <Section titleKey={'privacy.controller'} textKey={'privacy.controller.text'} />
      <Section titleKey={'privacy.data'} textKey={'privacy.data.text'} />
      <Section titleKey={'privacy.purpose'} textKey={'privacy.purpose.text'} />
      <Section titleKey={'privacy.transfer'} textKey={'privacy.transfer.text'} />
      <Section titleKey={'privacy.retention'} textKey={'privacy.retention.text'} />
      <Section titleKey={'privacy.qrcode'} textKey={'privacy.qrcode.text'} />
      <Section titleKey={'privacy.rights'} textKey={'privacy.rights.text'} />
      <Section titleKey={'privacy.obligation'} textKey={'privacy.obligation.text'} />
      <Section titleKey={'privacy.automated'} textKey={'privacy.automated.text'} />
      <Section titleKey={'privacy.local'} textKey={'privacy.local.text'} />
    </ScrollView>
  );
}
