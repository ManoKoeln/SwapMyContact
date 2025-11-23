import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { getDB } from '../utils/sqlite';
import { isPremium } from '../utils/premium';
import { t, addLanguageListener } from '../utils/i18n';

// Parse vCard data
const parseVCard = (vCardString) => {
  const lines = vCardString.split('\n');
  const parsed = {};
  
  lines.forEach(line => {
    if (line.startsWith('FN:')) {
      parsed.fullName = line.substring(3).trim();
    } else if (line.startsWith('N:')) {
      const parts = line.substring(2).split(';');
      parsed.lastName = parts[0]?.trim() || '';
      parsed.firstName = parts[1]?.trim() || '';
    } else if (line.startsWith('ORG:')) {
      parsed.company = line.substring(4).trim();
    } else if (line.startsWith('TITLE:')) {
      parsed.title = line.substring(6).trim();
    } else if (line.startsWith('EMAIL')) {
      parsed.email = line.split(':')[1]?.trim() || '';
    } else if (line.startsWith('TEL')) {
      const telValue = line.split(':')[1]?.trim() || '';
      if (line.includes('CELL')) {
        parsed.mobile = telValue;
      } else if (line.includes('FAX')) {
        parsed.fax = telValue;
      } else {
        parsed.phone = telValue;
      }
    } else if (line.startsWith('URL:')) {
      parsed.website = line.substring(4).trim();
    } else if (line.startsWith('X-SOCIALPROFILE')) {
      // Parse X-SOCIALPROFILE;TYPE=platform:url
      const typeMatch = line.match(/TYPE=([^:;]+)/i);
      const urlPart = line.split(':').slice(1).join(':').trim();
      
      if (typeMatch && urlPart) {
        const platform = typeMatch[1].toLowerCase();
        if (platform === 'linkedin') parsed.linkedin = urlPart;
        else if (platform === 'xing') parsed.xing = urlPart;
        else if (platform === 'twitter') parsed.twitter = urlPart;
        else if (platform === 'instagram') parsed.instagram = urlPart;
        else if (platform === 'facebook') parsed.facebook = urlPart;
        else if (platform === 'whatsapp') parsed.whatsapp = urlPart;
      }
    } else if (line.startsWith('ADR')) {
      // ADR format: ;;street;city;region;zipCode;country
      const parts = line.split(':')[1]?.split(';') || [];
      parsed.street = parts[2]?.trim() || '';
      parsed.city = parts[3]?.trim() || '';
      parsed.zipCode = parts[5]?.trim() || '';
      parsed.country = parts[6]?.trim() || '';
      // Also keep combined address for display
      parsed.address = [parts[2], parts[3], parts[5], parts[6]].filter(p => p).join(', ').trim();
    } else if (line.startsWith('NOTE:')) {
      parsed.notes = line.substring(5).trim();
    }
  });
  
  return parsed;
};

export default function ScannerScreen({ navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [, forceUpdate] = useState(0);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('scanner.title')
    });
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
    
    const unsubscribe = addLanguageListener(() => {
      forceUpdate(n => n + 1);
    });
    return unsubscribe;
  }, []);
  
  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>{t('scanner.permissionRequest')}</Text>
      </SafeAreaView>
    );
  }
  
  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.message}>{t('scanner.noPermission')}{'\n'}{t('scanner.noPermissionDetail')}</Text>
      </SafeAreaView>
    );
  }

  const handleScan = ({ type, data }) => {
    if (scanned) return; // Prevent multiple scans
    
    console.log('=== QR CODE GESCANNT ===');
    console.log('Type:', type);
    console.log('Raw Data:', data);
    console.log('Data Length:', data.length);
    console.log('========================');
    
    setScanned(true);
    const db = getDB();
    
    // Check scan limit for non-premium users
    db.transaction(tx => {
      tx.executeSql(
        'SELECT COUNT(*) as count FROM scans',
        [],
        (_, { rows }) => {
          const scanCount = rows.item(0).count;
          const premium = isPremium();
          
          if (!premium && scanCount >= 3) {
            Alert.alert(
              t('scanner.limitReached'),
              t('scanner.limitReachedMsg'),
              [
                { 
                  text: t('common.ok'),
                  onPress: () => {
                    setScanned(false);
                    navigation.goBack();
                  }
                }
              ]
            );
            return;
          }
          
          // Proceed with saving
          const id = uuidv4();
          const createdAt = new Date().toISOString();
          
          // Try to parse vCard
          let parsedData = null;
          let displayName = 'Gescannte Karte';
          
          if (data.includes('BEGIN:VCARD')) {
            parsedData = parseVCard(data);
            console.log('=== PARSED VCARD DATA ===');
            console.log(JSON.stringify(parsedData, null, 2));
            console.log('=========================');
            displayName = parsedData.fullName || 
                          `${parsedData.firstName || ''} ${parsedData.lastName || ''}`.trim() || 
                          parsedData.email || 
                          'Gescannte Karte';
          }
          
          db.transaction(
            tx => {
              tx.executeSql(
                'INSERT INTO scans (id, data, sourceType, createdAt) VALUES (?, ?, ?, ?)', 
                [id, data, 'vCard', createdAt],
                () => {
                  console.log('Scan saved successfully');
                },
                (_, error) => {
                  console.error('Error saving scan:', error);
                  return false;
                }
              );
            },
            (error) => {
              console.error('Transaction error:', error);
              Alert.alert(t('common.error'), t('scanner.error'));
              setScanned(false);
            },
            () => {
              // Navigate to Scans screen and open detail modal for this scan
              navigation.navigate('Scans', { scanId: id });
            }
          );
        }
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scannerContainer}>
        <BarCodeScanner 
          onBarCodeScanned={scanned ? undefined : handleScan} 
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>
      </View>
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          {t('scanner.instruction')}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#fff',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  instructions: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  message: {
    flex: 1,
    textAlign: 'center',
    margin: 20,
    fontSize: 16,
    color: '#fff',
  },
});