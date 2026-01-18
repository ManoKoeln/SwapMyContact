import { getDB } from './sqlite';

// Premium status management
let premiumStatus = false;

export const isPremium = () => {
  return premiumStatus;
};

export const setPremium = (status, expiryDate = null, isTestMode = false) => {
  // In production: save to SQLite or AsyncStorage
  try {
    const db = getDB();
    db.execSync('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)');
    
    // Verhindere Deaktivierung von echten Abos (nur in Production)
    if (!status && !__DEV__) {
      const isTestResult = db.getFirstSync('SELECT value FROM settings WHERE key = ?', ['premiumIsTest']);
      const isPremiumResult = db.getFirstSync('SELECT value FROM settings WHERE key = ?', ['isPremium']);
      
      // Wenn echtes Abo aktiv ist (Premium ohne Test-Flag), verhindere Deaktivierung
      if (isPremiumResult && isPremiumResult.value === '1' && (!isTestResult || isTestResult.value !== '1')) {
        console.log('Echtes Abo kann nicht deaktiviert werden');
        return;
      }
    }
      
    // Deaktivierung
    if (!status) {
      db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['isPremium', '0']);
      db.runSync('DELETE FROM settings WHERE key = ?', ['premiumExpiry']);
      db.runSync('DELETE FROM settings WHERE key = ?', ['premiumIsTest']);
      premiumStatus = false;
      return;
    }
    
    // Aktivierung
    premiumStatus = true;
    db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['isPremium', '1']);
    
    // Speichere ob dies ein Test-Premium ist
    if (isTestMode) {
      db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['premiumIsTest', '1']);
    }
    
    // Speichere Ablaufdatum wenn vorhanden
    if (expiryDate) {
      db.runSync('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['premiumExpiry', expiryDate.toISOString()]);
    }
  } catch (error) {
    console.log('Error saving premium status:', error);
  }
};

export const loadPremiumStatus = (callback) => {
  try {
    const db = getDB();
    db.execSync('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)');
    const result = db.getFirstSync('SELECT value FROM settings WHERE key = ?', ['isPremium']);
    
    // Prüfe Ablaufdatum (nur für Test-Premium)
    const isTestResult = db.getFirstSync('SELECT value FROM settings WHERE key = ?', ['premiumIsTest']);
    const expiryResult = db.getFirstSync('SELECT value FROM settings WHERE key = ?', ['premiumExpiry']);
    
    if (isTestResult && isTestResult.value === '1' && expiryResult && expiryResult.value) {
      const expiryDate = new Date(expiryResult.value);
      if (new Date() > expiryDate) {
        // Test-Premium ist abgelaufen
        setPremium(false);
        premiumStatus = false;
        if (callback) callback(false);
        return;
      }
    }
    
    if (result && result.value) {
      premiumStatus = result.value === '1';
    }
    if (callback) callback(premiumStatus);
  } catch (error) {
    console.log('Error loading premium status:', error);
    if (callback) callback(premiumStatus);
  }
};

export const hasRealSubscription = () => {
  try {
    const db = getDB();
    db.execSync('CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)');
    const isTestResult = db.getFirstSync('SELECT value FROM settings WHERE key = ?', ['premiumIsTest']);
    const isPremiumResult = db.getFirstSync('SELECT value FROM settings WHERE key = ?', ['isPremium']);
    
    // Echtes Abo = Premium aktiv ABER NICHT im Test-Modus
    return isPremiumResult && isPremiumResult.value === '1' && (!isTestResult || isTestResult.value !== '1');
  } catch (error) {
    console.log('Error checking subscription:', error);
    return false;
  }
};
