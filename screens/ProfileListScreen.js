import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, StyleSheet, Linking, Platform } from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDB } from '../utils/sqlite';
import { isPremium, setPremium, loadPremiumStatus } from '../utils/premium';
import { purchasePremium } from '../utils/iap';
import { t, addLanguageListener } from '../utils/i18n';

export default function ProfileListScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [premium, setPremiumState] = useState(false);
  const [, forceUpdate] = useState(0);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('profileList.title')
    });
  }, [navigation]);

  useEffect(() => {
    loadProfiles();
    loadPremiumStatus((status) => {
      setPremiumState(status);
    });
    
    const unsubscribe = addLanguageListener(() => {
      forceUpdate(n => n + 1);
      navigation.setOptions({
        title: t('profileList.title')
      });
    });
    
    // Reload profiles when screen comes into focus
    const focusUnsubscribe = navigation.addListener('focus', () => {
      loadProfiles();
      // Reload premium status on focus
      loadPremiumStatus((status) => {
        setPremiumState(status);
      });
    });
    
    return () => {
      unsubscribe();
      focusUnsubscribe();
    };
  }, [navigation]);

  const loadProfiles = async () => {
    try {
      const db = getDB();
      const result = db.getAllSync('SELECT * FROM profiles ORDER BY createdAt DESC');
      
      // Load saved order from AsyncStorage
      const savedOrder = await AsyncStorage.getItem('profileOrder');
      if (savedOrder) {
        const orderMap = JSON.parse(savedOrder);
        const orderedProfiles = [...(result || [])].sort((a, b) => {
          const indexA = orderMap[a.id] ?? 9999;
          const indexB = orderMap[b.id] ?? 9999;
          return indexA - indexB;
        });
        setProfiles(orderedProfiles);
      } else {
        setProfiles(result || []);
      }
    } catch (error) {
      console.log('Error loading profiles:', error);
    }
  };

  const handleAddProfile = () => {
    if (!premium && profiles.length >= 1) {
      startPremiumPurchase();
      return;
    }
    navigation.navigate('EditProfile', { profile: null });
  };

  const handleEditProfile = (profile) => {
    navigation.navigate('EditProfile', { profile });
  };

  const handleDeleteProfile = (id) => {
    Alert.alert(
      t('profileList.deleteTitle'),
      t('profileList.deleteMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            try {
              const db = getDB();
              db.runSync('DELETE FROM profiles WHERE id = ?', [id]);
              loadProfiles();
            } catch (error) {
              console.log('Error deleting profile:', error);
            }
          }
        }
      ]
    );
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const handleCopyProfile = (profile) => {
    if (!premium && profiles.length >= 1) {
      startPremiumPurchase();
      return;
    }

    try {
      const db = getDB();
      
      // Find next available "neues Profil" number
      const existingProfiles = db.getAllSync('SELECT description FROM profiles');
      let newDescription = 'neues Profil';
      let counter = 2;
      
      const descriptionExists = (desc) => {
        return existingProfiles.some(p => p.description === desc);
      };
      
      if (descriptionExists(newDescription)) {
        while (descriptionExists(`neues Profil ${counter}`)) {
          counter++;
        }
        newDescription = `neues Profil ${counter}`;
      }
      
      // Create new profile with copied data
      const newId = generateUUID();
      const now = new Date().toISOString();
      
      db.runSync(
        'INSERT INTO profiles (id, description, colorBorder, firstName, lastName, company, title, email, emailType, phone, phoneType, mobile, mobileType, fax, faxType, street, zipCode, city, country, addressType, website, websiteType, linkedin, xing, twitter, instagram, facebook, whatsapp, notes, createdAt, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [
          newId,
          newDescription,
          profile.colorBorder,
          profile.firstName,
          profile.lastName,
          profile.company,
          profile.title,
          profile.email,
          profile.emailType || 'WORK',
          profile.phone,
          profile.phoneType || 'WORK',
          profile.mobile,
          profile.mobileType || 'CELL',
          profile.fax,
          profile.faxType || 'WORK',
          profile.street,
          profile.zipCode,
          profile.city,
          profile.country,
          profile.addressType || 'WORK',
          profile.website,
          profile.websiteType || 'WORK',
          profile.linkedin,
          profile.xing,
          profile.twitter,
          profile.instagram,
          profile.facebook,
          profile.whatsapp,
          profile.notes,
          now,
          0 // not active by default
        ]
      );
      
      // Create the new profile object to pass to EditProfile
      const newProfile = {
        id: newId,
        description: newDescription,
        colorBorder: profile.colorBorder,
        firstName: profile.firstName,
        lastName: profile.lastName,
        company: profile.company,
        title: profile.title,
        email: profile.email,
        emailType: profile.emailType || 'WORK',
        phone: profile.phone,
        phoneType: profile.phoneType || 'WORK',
        mobile: profile.mobile,
        mobileType: profile.mobileType || 'CELL',
        fax: profile.fax,
        faxType: profile.faxType || 'WORK',
        street: profile.street,
        zipCode: profile.zipCode,
        city: profile.city,
        country: profile.country,
        addressType: profile.addressType || 'WORK',
        website: profile.website,
        websiteType: profile.websiteType || 'WORK',
        linkedin: profile.linkedin,
        xing: profile.xing,
        twitter: profile.twitter,
        instagram: profile.instagram,
        facebook: profile.facebook,
        whatsapp: profile.whatsapp,
        notes: profile.notes,
        createdAt: now,
        isActive: 0
      };
      
      // Navigate to EditProfile with the new profile
      navigation.navigate('EditProfile', { profile: newProfile });
    } catch (error) {
      console.log('Error copying profile:', error);
      Alert.alert(t('common.error'), 'Fehler beim Kopieren: ' + error.message);
    }
  };

  const startPremiumPurchase = () => {
    navigation.navigate('PremiumDialog');
  };

  const handleActivateProfile = (id) => {
    if (!premium) {
      return; // Im Basic-Modus kein Umschalten erlauben
    }
    try {
      const db = getDB();
      // Deactivate all profiles first
      db.runSync('UPDATE profiles SET isActive = 0');
      // Activate selected profile
      db.runSync('UPDATE profiles SET isActive = 1 WHERE id = ?', [id]);
      loadProfiles();
    } catch (error) {
      console.log('Error activating profile:', error);
    }
  };

  const enforceSingleActiveOnBasic = () => {
    try {
      const db = getDB();
      const rows = db.getAllSync('SELECT id, isActive, createdAt FROM profiles ORDER BY isActive DESC, datetime(createdAt) DESC');
      if (!rows || rows.length === 0) return;
      const chosenId = (rows.find(r => r.isActive === 1) || rows[0]).id;
      db.runSync('UPDATE profiles SET isActive = 0');
      db.runSync('UPDATE profiles SET isActive = 1 WHERE id = ?', [chosenId]);
    } catch (error) {
      console.log('Error enforcing single active profile:', error);
    }
  };

  const handleDragEnd = async ({ data }) => {
    setProfiles(data);
    // Save order to AsyncStorage
    const orderMap = {};
    data.forEach((profile, index) => {
      orderMap[profile.id] = index;
    });
    await AsyncStorage.setItem('profileOrder', JSON.stringify(orderMap));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {__DEV__ && (
          <TouchableOpacity
            style={styles.premiumButton}
            onPress={async () => {
              setPremiumState((prev) => {
                const newStatus = !prev;
                setPremium(newStatus);
                if (!newStatus) {
                  enforceSingleActiveOnBasic();
                  loadProfiles();
                }
                return newStatus;
              });
            }}
          >
            <Text style={styles.premiumButtonText}>
              {premium ? 'Premium deaktivieren' : 'Premium aktivieren'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        onPress={handleAddProfile}
        style={[
          styles.addButton,
          { backgroundColor: premium ? '#007AFF' : '#34C759' }
        ]}
      >
        <Text style={styles.addButtonText}>
          {premium ? t('profileList.addProfilePremium') : t('profileList.addProfile')}
        </Text>
      </TouchableOpacity>
      {!premium && profiles.length >= 1 && (
        <TouchableOpacity
          onPress={startPremiumPurchase}
          style={{ 
            backgroundColor: '#FFF3CD', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 16,
            borderWidth: 1,
            borderColor: '#FFE69C'
          }}
        >
          <Text style={{ color: '#856404', fontSize: 14 }}>
            {t('profileList.premiumHint')}
          </Text>
        </TouchableOpacity>
      )}
      {profiles.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {t('profileList.noProfiles')}{'\n'}{t('profileList.createFirst')}
          </Text>
        </View>
      ) : (
        <DraggableFlatList
          data={profiles}
          keyExtractor={(item) => item.id.toString()}
          onDragEnd={handleDragEnd}
          contentContainerStyle={{ paddingBottom: 80 }}
          renderItem={({ item, drag, isActive }) => (
            <TouchableOpacity
              onLongPress={drag}
              disabled={isActive}
              style={[
                styles.profileItem,
                isActive && { opacity: 0.5, backgroundColor: '#E8F4FF' }
              ]}
            >
              {item.description && (
                <View style={styles.descriptionContainer}>
                  {item.colorBorder && (
                    <View style={[styles.colorIndicator, { backgroundColor: item.colorBorder }]} />
                  )}
                  <Text style={styles.profileDescription}>
                    {item.description}
                  </Text>
                </View>
              )}
              <View style={styles.profileHeader}>
                <Text style={styles.profileName}>
                  {item.firstName} {item.lastName}
                </Text>
                {item.isActive === 1 && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>{t('profileList.active')}</Text>
                  </View>
                )}
              </View>
              {item.company && (
                <Text style={styles.profileDetail}>
                  {item.company}
                </Text>
              )}
              {item.email && (
                <Text style={styles.profileDetail}>
                  {item.email}
                </Text>
              )}
              <View style={styles.profileButtons}>
                {premium && item.isActive !== 1 && (
                  <TouchableOpacity
                    onPress={() => handleActivateProfile(item.id)}
                    style={[styles.profileButton, styles.activateButton]}
                  >
                    <Text style={styles.profileButtonText}>{t('profileList.activate')}</Text>
                  </TouchableOpacity>
                )}
                {premium && (
                  <TouchableOpacity
                    onPress={() => handleCopyProfile(item)}
                    style={[styles.profileButton, styles.copyButton]}
                  >
                    <Text style={styles.profileButtonText}>{t('profileList.copy') || 'Kopieren'}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleEditProfile(item)}
                  style={[styles.profileButton, styles.editButton]}
                >
                  <Text style={styles.profileButtonText}>{t('common.edit')}</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  premiumButton: {
    //backgroundColor: '#007AFF',
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  premiumButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
  profileItem: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  profileDescription: {
    fontSize: 14,
    color: '#666',
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  activeBadge: {
    backgroundColor: '#D1E7DD',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  activeBadgeText: {
    color: '#0F5132',
    fontSize: 12,
    fontWeight: '500',
  },
  profileDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  profileButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  profileButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginLeft: 8,
  },
  activateButton: {
    backgroundColor: '#34C759',
  },
  copyButton: {
    backgroundColor: '#FF9500',
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
  profileButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
});
