import { getDB } from './sqlite';

// Premium status management
let premiumStatus = false;

export const isPremium = () => {
  return premiumStatus;
};

export const setPremium = (status) => {
  premiumStatus = status;
  // In production: save to SQLite or AsyncStorage
  const db = getDB();
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)',
      []
    );
    tx.executeSql(
      'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
      ['isPremium', status ? '1' : '0']
    );
  });
};

export const loadPremiumStatus = (callback) => {
  const db = getDB();
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT)',
      []
    );
    tx.executeSql(
      'SELECT value FROM settings WHERE key = ?',
      ['isPremium'],
      (_, { rows }) => {
        if (rows.length > 0) {
          premiumStatus = rows.item(0).value === '1';
        }
        if (callback) callback(premiumStatus);
      }
    );
  });
};
