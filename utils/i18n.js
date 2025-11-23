import { getDB } from './sqlite';

// Import all translations
const translations = {
  de: require('../translations/de.json'),
  en: require('../translations/en.json'),
  es: require('../translations/es.json'),
  fr: require('../translations/fr.json'),
  it: require('../translations/it.json'),
  pt: require('../translations/pt.json'),
  ru: require('../translations/ru.json'),
  zh: require('../translations/zh.json'),
  ja: require('../translations/ja.json'),
  ko: require('../translations/ko.json'),
  ar: require('../translations/ar.json'),
  hi: require('../translations/hi.json'),
  tr: require('../translations/tr.json'),
  pl: require('../translations/pl.json'),
  nl: require('../translations/nl.json'),
  sv: require('../translations/sv.json'),
};

const languageNames = {
  de: 'Deutsch',
  en: 'English',
  es: 'Español',
  fr: 'Français',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  ar: 'العربية',
  hi: 'हिन्दी',
  tr: 'Türkçe',
  pl: 'Polski',
  nl: 'Nederlands',
  sv: 'Svenska',
};

let currentLanguage = 'de';
let listeners = [];

export const getLanguages = () => {
  return Object.keys(translations).map(code => ({
    code,
    name: languageNames[code] || code.toUpperCase(),
  }));
};

export const getCurrentLanguage = () => currentLanguage;

export const setLanguage = (langCode) => {
  if (translations[langCode]) {
    currentLanguage = langCode;
    
    // Save to database
    const db = getDB();
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)',
        []
      );
      tx.executeSql(
        'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
        ['language', langCode]
      );
    });
    
    // Notify listeners
    listeners.forEach(listener => listener(langCode));
  }
};

export const loadLanguage = (callback) => {
  const db = getDB();
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)',
      []
    );
    tx.executeSql(
      'SELECT value FROM settings WHERE key = ?',
      ['language'],
      (_, { rows }) => {
        if (rows.length > 0) {
          currentLanguage = rows.item(0).value;
        }
        if (callback) callback(currentLanguage);
      }
    );
  });
};

export const addLanguageListener = (listener) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};

export const t = (key) => {
  const keys = key.split('.');
  let value = translations[currentLanguage];
  
  // Try current language
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      value = undefined;
      break;
    }
  }
  
  // Fallback to English if not found
  if (!value && currentLanguage !== 'en') {
    value = translations['en'];
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = undefined;
        break;
      }
    }
  }
  
  return value || key;
};

// Helper for formatted strings
export const tf = (key, replacements = {}) => {
  let text = t(key);
  Object.keys(replacements).forEach(k => {
    text = text.replace(`{${k}}`, replacements[k]);
  });
  return text;
};
