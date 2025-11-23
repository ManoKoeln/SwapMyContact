import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, Alert, StyleSheet, Modal, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { getDB } from '../utils/sqlite';
import * as Contacts from 'expo-contacts';
import { isPremium, loadPremiumStatus } from '../utils/premium';
import { t, tf, addLanguageListener } from '../utils/i18n';

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
    }
  });
  
  return parsed;
};

export default function ScansListScreen({ navigation }) {
  const [scans, setScans] = useState([]);
  const [premium, setPremiumState] = useState(false);
  const [, forceUpdate] = useState(0);
  const [selectedScan, setSelectedScan] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [notesText, setNotesText] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('scansList.title'),
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          style={{ marginLeft: 10, padding: 5 }}
        >
          <Text style={{ fontSize: 28, color: '#007AFF', fontWeight: '300' }}>‹</Text>
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  useEffect(() => {
    loadScans();
    loadPremiumStatus((status) => {
      setPremiumState(status);
    });
    
    const langUnsubscribe = addLanguageListener(() => {
      forceUpdate(n => n + 1);
      navigation.setOptions({
        title: t('scansList.title')
      });
    });
    
    // Reload when screen comes into focus
    const focusUnsubscribe = navigation.addListener('focus', () => {
      loadScans();
      loadPremiumStatus((status) => {
        setPremiumState(status);
      });
    });
    
    // Check if we should open a specific scan's detail
    const openScanDetail = () => {
      const scanId = navigation.getState()?.routes?.find(r => r.name === 'Scans')?.params?.scanId;
      if (scanId) {
        // Wait for scans to load, then show detail
        const checkScans = setInterval(() => {
          const db = getDB();
          db.transaction(tx => {
            tx.executeSql(
              'SELECT * FROM scans WHERE id = ?',
              [scanId],
              (_, { rows: { _array } }) => {
                if (_array.length > 0) {
                  clearInterval(checkScans);
                  showDetails(_array[0]);
                  // Clear the parameter to avoid reopening on next focus
                  navigation.setParams({ scanId: undefined });
                }
              }
            );
          });
        }, 100);
        
        // Stop checking after 3 seconds
        setTimeout(() => clearInterval(checkScans), 3000);
      }
    };
    
    openScanDetail();
    
    return () => {
      langUnsubscribe();
      focusUnsubscribe();
    };
  }, [navigation]);

  const loadScans = () => {
    const db = getDB();
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM scans ORDER BY createdAt DESC', [], (_, { rows }) => {
        setScans(rows._array || []);
      });
    });
  };

  const exportToContacts = async (scan) => {
    try {
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          t('scansList.permissionRequired'), 
          t('scansList.contactsPermission'),
          [{ text: t('common.ok') }]
        );
        return;
      }
      
      let contact = {
        firstName: t('scansList.scannedCard'),
        lastName: '',
        note: scan.notes || ''
      };
      // Parse vCard if available
      if (scan.data.includes('BEGIN:VCARD')) {
        const parsed = parseVCard(scan.data);
        // Build phone numbers array
        const phoneNumbers = [];
        if (parsed.phone) phoneNumbers.push({ number: parsed.phone, label: 'work' });
        if (parsed.mobile) phoneNumbers.push({ number: parsed.mobile, label: 'mobile' });
        if (parsed.fax) phoneNumbers.push({ number: parsed.fax, label: 'fax' });

        // Social profiles Array
        const socialProfiles = [
          parsed.linkedin ? { label: 'LinkedIn', service: 'LinkedIn', url: parsed.linkedin } : null,
          parsed.xing ? { label: 'XING', service: 'XING', url: parsed.xing } : null,
          parsed.twitter ? { label: 'Twitter', service: 'Twitter', url: parsed.twitter } : null,
          parsed.instagram ? { label: 'Instagram', service: 'Instagram', url: parsed.instagram } : null,
          parsed.facebook ? { label: 'Facebook', service: 'Facebook', url: parsed.facebook } : null,
          parsed.whatsapp ? { label: 'WhatsApp', service: 'WhatsApp', url: parsed.whatsapp } : null,
        ].filter(Boolean);

        contact = {
          firstName: parsed.firstName || t('scansList.scannedCard'),
          lastName: parsed.lastName || '',
          company: parsed.company,
          jobTitle: parsed.title,
          emails: parsed.email ? [{ email: parsed.email, label: 'work' }] : [],
          phoneNumbers: phoneNumbers,
          urlAddresses: parsed.website ? [{ url: parsed.website, label: 'work' }] : [],
          addresses: (parsed.street || parsed.city || parsed.zipCode || parsed.country) ? [{
            street: parsed.street || '',
            city: parsed.city || '',
            postalCode: parsed.zipCode || '',
            country: parsed.country || '',
            label: 'work'
          }] : [],
          note: scan.notes || '',
          socialProfiles: socialProfiles
        };
      }

      const contactId = await Contacts.addContactAsync(contact);
      if (contactId) {
        Alert.alert(t('common.success'), t('scansList.contactCreated'));
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      Alert.alert(t('common.error'), t('scansList.contactError') + '\n' + error.message);
    }
  };

  const deleteScan = (id, displayName) => {
    setDetailModalVisible(false);
    Alert.alert(
      t('scansList.deleteTitle'),
      tf('scansList.deleteMessage', { name: displayName }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            const db = getDB();
            db.transaction(tx => {
              tx.executeSql('DELETE FROM scans WHERE id = ?', [id], () => {
                setScans(s => s.filter(x => x.id !== id));
                setSelectedScan(null);
              });
            });
          }
        }
      ]
    );
  };

  const showDetails = (scan) => {
    setSelectedScan(scan);
    setNotesText(scan.notes || '');
    setDetailModalVisible(true);
  };

  const saveNotes = () => {
    if (!selectedScan) return;
    
    const db = getDB();
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE scans SET notes = ? WHERE id = ?',
        [notesText, selectedScan.id],
        () => {
          // Update local state
          setScans(prevScans => 
            prevScans.map(s => 
              s.id === selectedScan.id ? { ...s, notes: notesText } : s
            )
          );
          setSelectedScan({ ...selectedScan, notes: notesText });
          Alert.alert(t('common.success'), t('scansList.saveNotes'));
        },
        (_, error) => {
          console.error('Error saving notes:', error);
          Alert.alert(t('common.error'), 'Fehler beim Speichern');
        }
      );
    });
  };

  const renderScan = ({ item }) => {
    let displayData = { fullName: t('scansList.unknownContact'), details: [] };
    
    if (item.data.includes('BEGIN:VCARD')) {
      const parsed = parseVCard(item.data);
      displayData.fullName = parsed.fullName || 
                            `${parsed.firstName || ''} ${parsed.lastName || ''}`.trim() || 
                            t('scansList.unknownContact');
      
      if (parsed.company) displayData.details.push(parsed.company);
      if (parsed.title) displayData.details.push(parsed.title);
      if (parsed.email) displayData.details.push(parsed.email);
      if (parsed.phone) displayData.details.push(parsed.phone);
    } else {
      displayData.details.push(item.data.substring(0, 100));
    }

    return (
      <TouchableOpacity 
        style={styles.scanItem}
        onPress={() => showDetails(item)}
        activeOpacity={0.7}
      >
        <View style={styles.scanInfo}>
          <Text style={styles.scanName}>{displayData.fullName}</Text>
          {displayData.details.map((detail, idx) => (
            <Text key={idx} style={styles.scanDetail} numberOfLines={1}>
              {detail}
            </Text>
          ))}
          <Text style={styles.scanDate}>
            {new Date(item.createdAt).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailModal = () => {
    if (!selectedScan) return null;

    let parsedData = {};
    let displayName = t('scansList.unknownContact');

    if (selectedScan.data.includes('BEGIN:VCARD')) {
      parsedData = parseVCard(selectedScan.data);
      displayName = parsedData.fullName || 
                    `${parsedData.firstName || ''} ${parsedData.lastName || ''}`.trim() || 
                    t('scansList.unknownContact');
    }

    return (
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('scansList.contactDetails')}</Text>
              <TouchableOpacity onPress={() => setDetailModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.modalBody} 
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
              <View style={styles.detailSection}>
                <Text style={styles.detailName}>{displayName}</Text>
                
                {parsedData.company && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.company')}:</Text>
                    <Text style={styles.detailValue}>{parsedData.company}</Text>
                  </View>
                )}
                
                {parsedData.title && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.jobTitle')}:</Text>
                    <Text style={styles.detailValue}>{parsedData.title}</Text>
                  </View>
                )}
                
                {parsedData.email && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.email')}:</Text>
                    <Text style={styles.detailValue}>{parsedData.email}</Text>
                  </View>
                )}
                
                {parsedData.phone && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.phone')}:</Text>
                    <Text style={styles.detailValue}>{parsedData.phone}</Text>
                  </View>
                )}
                
                {parsedData.website && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.website')}:</Text>
                    <Text style={styles.detailValue}>{parsedData.website}</Text>
                  </View>
                )}
                
                {parsedData.address && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.address')}:</Text>
                    <Text style={styles.detailValue}>{parsedData.address}</Text>
                  </View>
                )}

                {parsedData.linkedin && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.linkedin')}:</Text>
                    <Text style={[styles.detailValue, styles.linkText]}>{parsedData.linkedin}</Text>
                  </View>
                )}

                {parsedData.xing && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.xing')}:</Text>
                    <Text style={[styles.detailValue, styles.linkText]}>{parsedData.xing}</Text>
                  </View>
                )}

                {parsedData.twitter && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.twitter')}:</Text>
                    <Text style={[styles.detailValue, styles.linkText]}>{parsedData.twitter}</Text>
                  </View>
                )}

                {parsedData.instagram && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.instagram')}:</Text>
                    <Text style={[styles.detailValue, styles.linkText]}>{parsedData.instagram}</Text>
                  </View>
                )}

                {parsedData.facebook && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.facebook')}:</Text>
                    <Text style={[styles.detailValue, styles.linkText]}>{parsedData.facebook}</Text>
                  </View>
                )}

                {parsedData.whatsapp && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{t('scansList.whatsapp')}:</Text>
                    <Text style={[styles.detailValue, styles.linkText]}>{parsedData.whatsapp}</Text>
                  </View>
                )}
              </View>

              <View style={styles.notesSection}>
                <Text style={styles.notesLabel}>{t('scansList.notes')}:</Text>
                <TextInput
                  style={styles.notesInput}
                  value={notesText}
                  onChangeText={setNotesText}
                  placeholder={t('scansList.notesPlaceholder')}
                  placeholderTextColor="#999"
                  multiline
                  textAlignVertical="top"
                />
                <TouchableOpacity 
                  onPress={saveNotes}
                  style={styles.saveNotesButton}
                >
                  <Text style={styles.saveNotesButtonText}>{t('scansList.saveNotes')}</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  onPress={() => {
                    setDetailModalVisible(false);
                    exportToContacts(selectedScan);
                  }} 
                  style={[styles.modalButton, styles.exportModalButton]}
                >
                  <Text style={styles.modalButtonText}>{t('scansList.toContacts')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => deleteScan(selectedScan.id, displayName)} 
                  style={[styles.modalButton, styles.deleteModalButton]}
                >
                  <Text style={styles.modalButtonText}>{t('scansList.delete')}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{t('scansList.title')}</Text>
      
      {!premium && scans.length >= 3 && (
        <View style={styles.limitWarning}>
          <Text style={styles.limitWarningText}>
            {tf('scansList.limitWarning', { count: scans.length })}
          </Text>
          <Text style={styles.limitWarningSubtext}>
            {t('scansList.limitWarningHint')}
          </Text>
        </View>
      )}
      
      {!premium && scans.length > 0 && scans.length < 3 && (
        <View style={styles.scanCounter}>
          <Text style={styles.scanCounterText}>
            {tf('scansList.counter', { count: scans.length })}
          </Text>
        </View>
      )}
      
      {scans.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {t('scansList.noScans')}{'\n'}
            {t('scansList.scanFirst')}
            {!premium && `\n\n${t('scansList.basicLimit')}`}
          </Text>
        </View>
      ) : (
        <FlatList 
          data={scans} 
          keyExtractor={(item) => item.id} 
          renderItem={renderScan}
          contentContainerStyle={styles.listContent}
        />
      )}
      
      {renderDetailModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  limitWarning: {
    backgroundColor: '#FFE5E5',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFB3B3',
  },
  limitWarningText: {
    color: '#D32F2F',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  limitWarningSubtext: {
    color: '#D32F2F',
    fontSize: 12,
  },
  scanCounter: {
    backgroundColor: '#E3F2FD',
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  scanCounterText: {
    color: '#1976D2',
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    paddingBottom: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  scanItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  scanInfo: {
    flex: 1,
  },
  scanName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  scanDetail: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 2,
  },
  scanDate: {
    fontSize: 12,
    color: '#ADB5BD',
    marginTop: 4,
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
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 28,
    color: '#666',
    fontWeight: '300',
  },
  modalBody: {
    padding: 20,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  detailSection: {
    marginBottom: 20,
  },
  detailName: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#000',
  },
  detailRow: {
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: '#000',
  },
  linkText: {
    color: '#007AFF',
  },
  notesSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E9ECEF',
  },
  notesLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  saveNotesButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  saveNotesButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  modalButtons: {
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportModalButton: {
    backgroundColor: '#007AFF',
  },
  deleteModalButton: {
    backgroundColor: '#FF3B30',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 24,
  },
});