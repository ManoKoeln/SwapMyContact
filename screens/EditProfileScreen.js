import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { SafeAreaView, Alert, Text, BackHandler, Platform, TouchableOpacity } from 'react-native';
import ProfileForm from '../components/ProfileForm';
import { getDB } from '../utils/sqlite';
import { addLanguageListener, t } from '../utils/i18n';

// Simple UUID v4 generator
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export default function EditProfileScreen({ route, navigation }) {
  const { profile } = route.params || {};
  const [hasChanges, setHasChanges] = useState(false);
  const [savedProfileId, setSavedProfileId] = useState(profile?.id || null);
  const isSaving = useRef(false);
  const [, forceUpdate] = useState(0);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('editProfile.title'),
      gestureEnabled: false,
      headerLeft: () => (
        <TouchableOpacity
          style={{ paddingHorizontal: 12, paddingVertical: 4 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => {
            if (hasChanges && !isSaving.current) {
              Alert.alert(
                t('editProfile.unsavedChanges') || 'Ungespeicherte Änderungen',
                t('editProfile.unsavedChangesMessage') || 'Möchten Sie die Änderungen verwerfen?',
                [
                  { text: t('common.cancel') || 'Abbrechen', style: 'cancel' },
                  { text: t('editProfile.discard') || 'Verwerfen', style: 'destructive', onPress: () => navigation.goBack() }
                ]
              );
            } else {
              navigation.goBack();
            }
          }}
        >
          <Text style={{ color: '#007AFF', fontSize: 17, fontWeight: '500' }}>‹</Text>
        </TouchableOpacity>
      )
    });
  }, [navigation, hasChanges]);
  
  useEffect(() => {
    const unsubscribeLang = addLanguageListener(() => {
      forceUpdate(n => n + 1);
      navigation.setOptions({ title: t('editProfile.title') });
    });
    let backHandlerSub;
    if (Platform.OS === 'android') {
      backHandlerSub = BackHandler.addEventListener('hardwareBackPress', () => {
        if (hasChanges && !isSaving.current) {
          Alert.alert(
            t('editProfile.unsavedChanges') || 'Ungespeicherte Änderungen',
            t('editProfile.unsavedChangesMessage') || 'Möchten Sie die Änderungen verwerfen?',
            [
              { text: t('common.cancel') || 'Abbrechen', style: 'cancel' },
              { text: t('editProfile.discard') || 'Verwerfen', style: 'destructive', onPress: () => navigation.goBack() }
            ]
          );
          return true; // Event verbraucht
        }
        return false; // Standard Back
      });
    }
    return () => {
      unsubscribeLang();
      backHandlerSub && backHandlerSub.remove();
    };
  }, [navigation, hasChanges]);
  
  const handleDelete = () => {
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
              db.runSync('DELETE FROM profiles WHERE id = ?', [savedProfileId]);
              navigation.goBack();
            } catch (error) {
              console.log('Error deleting profile:', error);
              Alert.alert(t('common.error'), 'Error deleting profile: ' + error.message);
            }
          }
        }
      ]
    );
  };

  const handleSave = (p) => {
    // Speichervorgang beginnt
    isSaving.current = true;
    setHasChanges(false);
    try {
      const db = getDB();
      const id = savedProfileId || generateUUID();
      const now = new Date().toISOString();
      if (savedProfileId) {
        db.runSync(
          'UPDATE profiles SET description = ?, colorBorder = ?, firstName = ?, lastName = ?, company = ?, title = ?, email = ?, emailType = ?, phone = ?, phoneType = ?, mobile = ?, mobileType = ?, fax = ?, faxType = ?, street = ?, zipCode = ?, city = ?, country = ?, addressType = ?, website = ?, websiteType = ?, linkedin = ?, xing = ?, twitter = ?, instagram = ?, facebook = ?, whatsapp = ?, notes = ? WHERE id = ?',
          [p.description, p.colorBorder, p.firstName, p.lastName, p.company, p.title, p.email, p.emailType || 'WORK', p.phone, p.phoneType || 'WORK', p.mobile, p.mobileType || 'CELL', p.fax, p.faxType || 'WORK', p.street, p.zipCode, p.city, p.country, p.addressType || 'WORK', p.website, p.websiteType || 'WORK', p.linkedin, p.xing, p.twitter, p.instagram, p.facebook, p.whatsapp, p.notes, savedProfileId]
        );
      } else {
        // Check if this is the first profile
        const profileCount = db.getFirstSync('SELECT COUNT(*) as count FROM profiles');
        const isFirstProfile = profileCount.count === 0;
        
        db.runSync(
          'INSERT INTO profiles (id, description, colorBorder, firstName, lastName, company, title, email, emailType, phone, phoneType, mobile, mobileType, fax, faxType, street, zipCode, city, country, addressType, website, websiteType, linkedin, xing, twitter, instagram, facebook, whatsapp, notes, createdAt, isActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [id, p.description, p.colorBorder, p.firstName, p.lastName, p.company, p.title, p.email, p.emailType || 'WORK', p.phone, p.phoneType || 'WORK', p.mobile, p.mobileType || 'CELL', p.fax, p.faxType || 'WORK', p.street, p.zipCode, p.city, p.country, p.addressType || 'WORK', p.website, p.websiteType || 'WORK', p.linkedin, p.xing, p.twitter, p.instagram, p.facebook, p.whatsapp, p.notes, now, isFirstProfile ? 1 : 0]
        );
        setSavedProfileId(id);
      }
      setTimeout(() => navigation.goBack(), 0);
    } catch (error) {
      console.log('Error saving profile:', error);
      isSaving.current = false;
      setHasChanges(true);
      Alert.alert(t('common.error'), 'Error saving profile: ' + error.message);
    }
  };
  
  return (
    <SafeAreaView style={{flex:1, padding:12}}>
      <ProfileForm 
        initial={profile} 
        onSave={handleSave}
        onDelete={savedProfileId ? handleDelete : null}
        onProfileChange={() => setHasChanges(true)}
        suppressChanges={isSaving.current}
      />
    </SafeAreaView>
  );
}