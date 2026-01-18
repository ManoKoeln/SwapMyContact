import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { getLanguages, getCurrentLanguage, setLanguage, t } from '../utils/i18n';

// Flag emojis for each language
const FLAGS = {
  de: '🇩🇪',
  en: '🇬🇧',
  es: '🇪🇸',
  fr: '🇫🇷',
  it: '🇮🇹',
  pt: '🇵🇹',
  ru: '🇷🇺',
  zh: '🇨🇳',
  ja: '🇯🇵',
  ko: '🇰🇷',
  ar: '🇸🇦',
  hi: '🇮🇳',
  tr: '🇹🇷',
  pl: '🇵🇱',
  nl: '🇳🇱',
  sv: '🇸🇪',
  da: '🇩🇰',
  fi: '🇫🇮',
  no: '🇳🇴',
  cs: '🇨🇿',
  el: '🇬🇷',
  he: '🇮🇱',
  id: '🇮🇩',
  ms: '🇲🇾',
  th: '🇹🇭',
  vi: '🇻🇳',
  uk: '🇺🇦',
  ro: '🇷🇴',
  hu: '🇭🇺',
  sk: '🇸🇰',
  bg: '🇧🇬',
  hr: '🇭🇷',
  sr: '🇷🇸',
  sl: '🇸🇮',
  et: '🇪🇪',
  lv: '🇱🇻',
  lt: '🇱🇹',
  fa: '🇮🇷',
  bn: '🇧🇩',
  ta: '🇱🇰',
  te: '🇮🇳',
  mr: '🇮🇳',
  ur: '🇵🇰',
  kn: '🇮🇳',
  ml: '🇮🇳',
  gu: '🇮🇳',
  pa: '🇮🇳',
  af: '🇿🇦',
  sw: '🇰🇪',
  ca: '🇪🇸',
  eu: '🇪🇸',
  gl: '🇪🇸',
};

export default function LanguageSwitcher() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentLang, setCurrentLang] = useState(getCurrentLanguage());
  const languages = getLanguages();

  const handleLanguageSelect = (langCode) => {
    setLanguage(langCode);
    setCurrentLang(langCode);
    setModalVisible(false);
  };

  const currentLanguageName = languages.find(l => l.code === currentLang)?.name || 'Deutsch';
  const currentFlag = FLAGS[currentLang] || '🌐';

  return (
    <>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        <Text style={styles.flag}>{currentFlag}</Text>
        <Text style={styles.buttonText}>{currentLanguageName}</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('language.selectLanguage')}</Text>
            
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleLanguageSelect(item.code)}
                  style={[
                    styles.languageItem,
                    item.code === currentLang && styles.languageItemActive
                  ]}
                >
                  <View style={styles.languageItemContent}>
                    <Text style={styles.languageFlag}>{FLAGS[item.code] || '🌐'}</Text>
                    <Text style={[
                      styles.languageText,
                      item.code === currentLang && styles.languageTextActive
                    ]}>
                      {item.name}
                    </Text>
                  </View>
                  {item.code === currentLang && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>{t('common.close')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F0F0F0',
    gap: 8,
  },
  flag: {
    fontSize: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '70%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  languageItemActive: {
    backgroundColor: '#E3F2FD',
  },
  languageItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  languageFlag: {
    fontSize: 24,
  },
  languageText: {
    fontSize: 16,
    color: '#333',
  },
  languageTextActive: {
    fontWeight: '600',
    color: '#007AFF',
  },
  checkmark: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginTop: 8,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});
