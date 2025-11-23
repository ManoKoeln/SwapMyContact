import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { getDB } from '../utils/sqlite';
import { isPremium, setPremium, loadPremiumStatus } from '../utils/premium';
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
    });
    
    return () => {
      unsubscribe();
      focusUnsubscribe();
    };
  }, [navigation]);

  const loadProfiles = () => {
    const db = getDB();
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM profiles ORDER BY createdAt DESC', [], (_, { rows }) => {
        setProfiles(rows._array || []);
      });
    });
  };

  const handleAddProfile = () => {
    if (!premium && profiles.length >= 1) {
      Alert.alert(
        t('profileList.premiumFeature'),
        t('profileList.premiumMessage'),
        [{ text: t('common.ok') }]
      );
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
            const db = getDB();
            db.transaction(tx => {
              tx.executeSql('DELETE FROM profiles WHERE id = ?', [id], () => {
                loadProfiles();
              });
            });
          }
        }
      ]
    );
  };

  const handleActivateProfile = (id) => {
    const db = getDB();
    db.transaction(tx => {
      // Deactivate all profiles first
      tx.executeSql('UPDATE profiles SET isActive = 0', []);
      // Activate selected profile
      tx.executeSql('UPDATE profiles SET isActive = 1 WHERE id = ?', [id], () => {
        loadProfiles();
      });
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('profileList.title')}</Text>
        {__DEV__ && (
          <TouchableOpacity
            style={styles.premiumButton}
            onPress={() => {
              setPremiumState((prev) => {
                setPremium(!prev);
                return !prev;
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
        <View style={{ 
          backgroundColor: '#FFF3CD', 
          padding: 12, 
          borderRadius: 8, 
          marginBottom: 16,
          borderWidth: 1,
          borderColor: '#FFE69C'
        }}>
          <Text style={{ color: '#856404', fontSize: 14 }}>
            {t('profileList.premiumHint')}
          </Text>
        </View>
      )}
      {profiles.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>
            {t('profileList.noProfiles')}{'\n'}{t('profileList.createFirst')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.profileItem}>
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
                {item.isActive !== 1 && (
                  <TouchableOpacity
                    onPress={() => handleActivateProfile(item.id)}
                    style={[styles.profileButton, styles.activateButton]}
                  >
                    <Text style={styles.profileButtonText}>{t('profileList.activate')}</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleEditProfile(item)}
                  style={[styles.profileButton, styles.editButton]}
                >
                  <Text style={styles.profileButtonText}>{t('common.edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteProfile(item.id)}
                  style={[styles.profileButton, styles.deleteButton]}
                >
                  <Text style={styles.profileButtonText}>{t('common.delete')}</Text>
                </TouchableOpacity>
              </View>
            </View>
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
    backgroundColor: '#007AFF',
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
