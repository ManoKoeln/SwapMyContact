import { getDB } from './sqlite';
import { Platform, NativeModules } from 'react-native';

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
  da: require('../translations/da.json'),
  fi: require('../translations/fi.json'),
  no: require('../translations/no.json'),
  cs: require('../translations/cs.json'),
  el: require('../translations/el.json'),
  he: require('../translations/he.json'),
  id: require('../translations/id.json'),
  ms: require('../translations/ms.json'),
  th: require('../translations/th.json'),
  vi: require('../translations/vi.json'),
  uk: require('../translations/uk.json'),
  ro: require('../translations/ro.json'),
  hu: require('../translations/hu.json'),
  sk: require('../translations/sk.json'),
  bg: require('../translations/bg.json'),
  hr: require('../translations/hr.json'),
  sr: require('../translations/sr.json'),
  sl: require('../translations/sl.json'),
  et: require('../translations/et.json'),
  lv: require('../translations/lv.json'),
  lt: require('../translations/lt.json'),
  fa: require('../translations/fa.json'),
  bn: require('../translations/bn.json'),
  ta: require('../translations/ta.json'),
  te: require('../translations/te.json'),
  mr: require('../translations/mr.json'),
  ur: require('../translations/ur.json'),
  kn: require('../translations/kn.json'),
  ml: require('../translations/ml.json'),
  gu: require('../translations/gu.json'),
  pa: require('../translations/pa.json'),
  af: require('../translations/af.json'),
  sw: require('../translations/sw.json'),
  ca: require('../translations/ca.json'),
  eu: require('../translations/eu.json'),
  gl: require('../translations/gl.json'),
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
  da: 'Dansk',
  fi: 'Suomi',
  no: 'Norsk',
  cs: 'Čeština',
  el: 'Ελληνικά',
  he: 'עברית',
  id: 'Bahasa Indonesia',
  ms: 'Bahasa Melayu',
  th: 'ไทย',
  vi: 'Tiếng Việt',
  uk: 'Українська',
  ro: 'Română',
  hu: 'Magyar',
  sk: 'Slovenčina',
  bg: 'Български',
  hr: 'Hrvatski',
  sr: 'Српски',
  sl: 'Slovenščina',
  et: 'Eesti',
  lv: 'Latviešu',
  lt: 'Lietuvių',
  fa: 'فارسی',
  bn: 'বাংলা',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  mr: 'मराठी',
  ur: 'اردو',
  kn: 'ಕನ್ನಡ',
  ml: 'മലയാളം',
  gu: 'ગુજરાતી',
  pa: 'ਪੰਜਾਬੀ',
  af: 'Afrikaans',
  sw: 'Kiswahili',
  ca: 'Català',
  eu: 'Euskara',
  gl: 'Galego',
};

let currentLanguage = 'de';
let listeners = [];

export const getLanguages = () => {
  return Object.keys(translations)
    .map(code => ({
      code,
      name: languageNames[code] || code.toUpperCase(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
};

export const getCurrentLanguage = () => currentLanguage;

export const setLanguage = (langCode) => {
  if (translations[langCode]) {
    currentLanguage = langCode;
    
    // Save to database
    try {
      const db = getDB();
      db.execSync('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)');
      db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['language', langCode]);
    } catch (error) {
      console.log('Error saving language:', error);
    }
    
    // Notify listeners
    listeners.forEach(listener => listener(langCode));
  }
};

export const loadLanguage = (callback) => {
  try {
    const db = getDB();
    db.execSync('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)');
    const result = db.getFirstSync('SELECT value FROM settings WHERE key = ?', ['language']);
    
    if (result && result.value) {
      // User has already selected a language - use it
      currentLanguage = result.value;
    } else {
      // No saved preference - detect device language
      try {
        let deviceLocale = 'de'; // Default fallback
        
        if (Platform.OS === 'ios') {
          const localeString = NativeModules.SettingsManager?.settings?.AppleLocale || 
                               NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
          if (localeString) {
            // Extract language code (e.g., "de_DE" -> "de", "en-US" -> "en")
            deviceLocale = localeString.split(/[-_]/)[0];
          }
        } else if (Platform.OS === 'android') {
          const localeString = NativeModules.I18nManager?.localeIdentifier;
          if (localeString) {
            deviceLocale = localeString.split(/[-_]/)[0];
          }
        }
        
        // Check if this language is available in our translations
        if (translations[deviceLocale]) {
          currentLanguage = deviceLocale;
          // Save it so we don't auto-detect again
          db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['language', deviceLocale]);
        }
      } catch (localeError) {
        console.log('Could not detect device locale:', localeError);
      }
    }
    
    if (callback) callback(currentLanguage);
  } catch (error) {
    console.log('Error loading language:', error);
    if (callback) callback(currentLanguage);
  }
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
