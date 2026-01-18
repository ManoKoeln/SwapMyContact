import * as SQLite from 'expo-sqlite';

let db;

function openDatabase() {
  if (!db) {
    db = SQLite.openDatabaseSync('business_card_qr.db');
  }
  return db;
}

export function initDB() {
  try {
    const database = openDatabase();
    
    // Create profiles table
    database.execSync(
      `CREATE TABLE IF NOT EXISTS profiles (
        id TEXT PRIMARY KEY NOT NULL,
        description TEXT,
        name TEXT,
        firstName TEXT,
        lastName TEXT,
        company TEXT,
        title TEXT,
        email TEXT,
        emailType TEXT DEFAULT 'WORK',
        phone TEXT,
        phoneType TEXT DEFAULT 'WORK',
        mobile TEXT,
        mobileType TEXT DEFAULT 'CELL',
        fax TEXT,
        faxType TEXT DEFAULT 'WORK',
        street TEXT,
        zipCode TEXT,
        city TEXT,
        country TEXT,
        addressType TEXT DEFAULT 'WORK',
        website TEXT,
        websiteType TEXT DEFAULT 'WORK',
        address TEXT,
        notes TEXT,
        logoPath TEXT,
        photoPath TEXT,
        isActive INTEGER DEFAULT 0,
        createdAt TEXT,
        updatedAt TEXT,
        colorBorder TEXT,
        linkedin TEXT,
        xing TEXT,
        twitter TEXT,
        instagram TEXT,
        facebook TEXT,
        whatsapp TEXT
      );`
    );
    
    // Add type columns if they don't exist (migration for existing databases)
    try {
      database.execSync(`ALTER TABLE profiles ADD COLUMN emailType TEXT DEFAULT 'WORK';`);
    } catch (e) { /* Column already exists */ }
    try {
      database.execSync(`ALTER TABLE profiles ADD COLUMN phoneType TEXT DEFAULT 'WORK';`);
    } catch (e) { /* Column already exists */ }
    try {
      database.execSync(`ALTER TABLE profiles ADD COLUMN mobileType TEXT DEFAULT 'CELL';`);
    } catch (e) { /* Column already exists */ }
    try {
      database.execSync(`ALTER TABLE profiles ADD COLUMN faxType TEXT DEFAULT 'WORK';`);
    } catch (e) { /* Column already exists */ }
    try {
      database.execSync(`ALTER TABLE profiles ADD COLUMN addressType TEXT DEFAULT 'WORK';`);
    } catch (e) { /* Column already exists */ }
    try {
      database.execSync(`ALTER TABLE profiles ADD COLUMN websiteType TEXT DEFAULT 'WORK';`);
    } catch (e) { /* Column already exists */ }
    
    console.log('Profiles table created');
    
    // Check and add missing columns if needed
    try {
      const result = database.getFirstSync(
        `SELECT sql FROM sqlite_master WHERE type='table' AND name='profiles'`
      );
      
      if (result && result.sql) {
        const tableSchema = result.sql;
        
        // Helper function to add column if not exists
        const addColumnIfNotExists = (columnName, columnDef) => {
          if (!tableSchema.includes(columnName)) {
            try {
              database.execSync(`ALTER TABLE profiles ADD COLUMN ${columnName} ${columnDef}`);
              console.log(`Added ${columnName} column`);
            } catch (error) {
              console.log(`${columnName} column exists or error:`, error);
            }
          }
        };
        
        // Add any missing columns from old schema
        addColumnIfNotExists('isActive', 'INTEGER DEFAULT 0');
        addColumnIfNotExists('description', 'TEXT');
        addColumnIfNotExists('colorBorder', 'TEXT');
        addColumnIfNotExists('mobile', 'TEXT');
        addColumnIfNotExists('fax', 'TEXT');
        addColumnIfNotExists('street', 'TEXT');
        addColumnIfNotExists('zipCode', 'TEXT');
        addColumnIfNotExists('city', 'TEXT');
        addColumnIfNotExists('country', 'TEXT');
        addColumnIfNotExists('notes', 'TEXT');
        addColumnIfNotExists('linkedin', 'TEXT');
        addColumnIfNotExists('xing', 'TEXT');
        addColumnIfNotExists('twitter', 'TEXT');
        addColumnIfNotExists('instagram', 'TEXT');
        addColumnIfNotExists('facebook', 'TEXT');
        addColumnIfNotExists('whatsapp', 'TEXT');
      }
    } catch (error) {
      console.log('Migration check error:', error);
    }
  } catch (error) {
    console.log('initDB error:', error);
  }
}

export function getDB() {
  return openDatabase();
}

export default { initDB, getDB };