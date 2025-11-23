import * as SQLite from 'expo-sqlite';

let db;

function openDatabase() {
  if (!db) {
    db = SQLite.openDatabase('business_card_qr.db');
  }
  return db;
}

export function initDB() {
  try {
    const database = openDatabase();
    
    database.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS profiles (
          id TEXT PRIMARY KEY NOT NULL,
          description TEXT,
          name TEXT,
          firstName TEXT,
          lastName TEXT,
          company TEXT,
          title TEXT,
          email TEXT,
          phone TEXT,
          mobile TEXT,
          fax TEXT,
          street TEXT,
          zipCode TEXT,
          city TEXT,
          country TEXT,
          website TEXT,
          address TEXT,
          notes TEXT,
          logoPath TEXT,
          photoPath TEXT,
          isActive INTEGER DEFAULT 0,
          createdAt TEXT,
          updatedAt TEXT
        );`,
        [],
        () => {
          console.log('Profiles table created');
          // Migrations for new columns
          tx.executeSql(
            `SELECT sql FROM sqlite_master WHERE type='table' AND name='profiles'`,
            [],
            (_, result) => {
              if (result.rows.length > 0) {
                const tableSchema = result.rows.item(0).sql;
                
                // Add isActive column
                if (!tableSchema.includes('isActive')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN isActive INTEGER DEFAULT 0',
                    [],
                    () => console.log('Added isActive column'),
                    (_, error) => console.log('isActive column exists or error:', error)
                  );
                }
                
                // Add description column
                if (!tableSchema.includes('description')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN description TEXT',
                    [],
                    () => console.log('Added description column'),
                    (_, error) => console.log('description column exists or error:', error)
                  );
                }
                
                // Add colorBorder column
                if (!tableSchema.includes('colorBorder')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN colorBorder TEXT',
                    [],
                    () => console.log('Added colorBorder column'),
                    (_, error) => console.log('colorBorder column exists or error:', error)
                  );
                }
                
                // Add mobile column
                if (!tableSchema.includes('mobile')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN mobile TEXT',
                    [],
                    () => console.log('Added mobile column'),
                    (_, error) => console.log('mobile column exists or error:', error)
                  );
                }
                
                // Add fax column
                if (!tableSchema.includes('fax')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN fax TEXT',
                    [],
                    () => console.log('Added fax column'),
                    (_, error) => console.log('fax column exists or error:', error)
                  );
                }
                
                // Add street column
                if (!tableSchema.includes('street')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN street TEXT',
                    [],
                    () => console.log('Added street column'),
                    (_, error) => console.log('street column exists or error:', error)
                  );
                }
                
                // Add zipCode column
                if (!tableSchema.includes('zipCode')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN zipCode TEXT',
                    [],
                    () => console.log('Added zipCode column'),
                    (_, error) => console.log('zipCode column exists or error:', error)
                  );
                }
                
                // Add city column
                if (!tableSchema.includes('city')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN city TEXT',
                    [],
                    () => console.log('Added city column'),
                    (_, error) => console.log('city column exists or error:', error)
                  );
                }
                
                // Add country column
                if (!tableSchema.includes('country')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN country TEXT',
                    [],
                    () => console.log('Added country column'),
                    (_, error) => console.log('country column exists or error:', error)
                  );
                }
                
                // Add notes column
                if (!tableSchema.includes('notes')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN notes TEXT',
                    [],
                    () => console.log('Added notes column'),
                    (_, error) => console.log('notes column exists or error:', error)
                  );
                }
                
                // Add linkedin column
                if (!tableSchema.includes('linkedin')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN linkedin TEXT',
                    [],
                    () => console.log('Added linkedin column'),
                    (_, error) => console.log('linkedin column exists or error:', error)
                  );
                }
                
                // Add xing column
                if (!tableSchema.includes('xing')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN xing TEXT',
                    [],
                    () => console.log('Added xing column'),
                    (_, error) => console.log('xing column exists or error:', error)
                  );
                }
                
                // Add twitter column
                if (!tableSchema.includes('twitter')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN twitter TEXT',
                    [],
                    () => console.log('Added twitter column'),
                    (_, error) => console.log('twitter column exists or error:', error)
                  );
                }
                
                // Add instagram column
                if (!tableSchema.includes('instagram')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN instagram TEXT',
                    [],
                    () => console.log('Added instagram column'),
                    (_, error) => console.log('instagram column exists or error:', error)
                  );
                }
                
                // Add facebook column
                if (!tableSchema.includes('facebook')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN facebook TEXT',
                    [],
                    () => console.log('Added facebook column'),
                    (_, error) => console.log('facebook column exists or error:', error)
                  );
                }
                
                // Add whatsapp column
                if (!tableSchema.includes('whatsapp')) {
                  tx.executeSql(
                    'ALTER TABLE profiles ADD COLUMN whatsapp TEXT',
                    [],
                    () => console.log('Added whatsapp column'),
                    (_, error) => console.log('whatsapp column exists or error:', error)
                  );
                }
              }
            }
          );
        },
        (_, error) => console.log('Error creating profiles table', error)
      );
      
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS scans (
          id TEXT PRIMARY KEY NOT NULL,
          data TEXT,
          sourceType TEXT,
          notes TEXT,
          createdAt TEXT
        );`,
        [],
        () => {
          console.log('Scans table created');
          // Add notes column to existing tables (migration)
          tx.executeSql(
            `SELECT sql FROM sqlite_master WHERE type='table' AND name='scans'`,
            [],
            (_, result) => {
              if (result.rows.length > 0) {
                const tableSchema = result.rows.item(0).sql;
                if (!tableSchema.includes('notes')) {
                  tx.executeSql(
                    'ALTER TABLE scans ADD COLUMN notes TEXT',
                    [],
                    () => console.log('Added notes column to scans'),
                    (_, error) => console.log('notes column may already exist or error:', error)
                  );
                }
              }
            }
          );
        },
        (_, error) => console.log('Error creating scans table', error)
      );
    });
  } catch (error) {
    console.log('initDB error:', error);
  }
}

export function getDB() {
  return openDatabase();
}

export default { initDB, getDB };