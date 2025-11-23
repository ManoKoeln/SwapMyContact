import React, { useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { SafeAreaView, Alert } from 'react-native';
import ProfileForm from '../components/ProfileForm';
import { getDB } from '../utils/sqlite';
import { v4 as uuidv4 } from 'uuid';
import { addLanguageListener, t } from '../utils/i18n';

export default function EditProfileScreen({ route, navigation }) {
  const { profile } = route.params || {};
  const [hasChanges, setHasChanges] = useState(false);
  const [, forceUpdate] = useState(0);
  
  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('editProfile.title')
    });
  }, [navigation]);
  
  useEffect(() => {
    const unsubscribe = addLanguageListener(() => {
      forceUpdate(n => n + 1);
      navigation.setOptions({
        title: t('editProfile.title')
      });
    });
    
    const unsubscribeBeforeRemove = navigation.addListener('beforeRemove', (e) => {
      if (!hasChanges) {
        return;
      }
      
      e.preventDefault();
      
      Alert.alert(
        t('editProfile.unsavedChanges') || 'Ungespeicherte Änderungen',
        t('editProfile.unsavedChangesMessage') || 'Möchten Sie die Änderungen verwerfen?',
        [
          { text: t('common.cancel') || 'Abbrechen', style: 'cancel' },
          {
            text: t('editProfile.discard') || 'Verwerfen',
            style: 'destructive',
            onPress: () => navigation.dispatch(e.data.action)
          }
        ]
      );
    });
    
    return () => {
      unsubscribe();
      unsubscribeBeforeRemove();
    };
  }, [navigation, hasChanges]);
  
  const handleSave = (p) => {
    const db = getDB();
    const id = profile?.id || uuidv4();
    const now = new Date().toISOString();
    
    setHasChanges(false);
    
    db.transaction(tx => {
      if (profile?.id) {
        // Update existing profile
        tx.executeSql(
          'UPDATE profiles SET description = ?, colorBorder = ?, firstName = ?, lastName = ?, company = ?, title = ?, email = ?, phone = ?, mobile = ?, fax = ?, street = ?, zipCode = ?, city = ?, country = ?, website = ?, linkedin = ?, xing = ?, twitter = ?, instagram = ?, facebook = ?, whatsapp = ?, notes = ? WHERE id = ?',
          [p.description, p.colorBorder, p.firstName, p.lastName, p.company, p.title, p.email, p.phone, p.mobile, p.fax, p.street, p.zipCode, p.city, p.country, p.website, p.linkedin, p.xing, p.twitter, p.instagram, p.facebook, p.whatsapp, p.notes, profile.id],
          () => {
            navigation.goBack();
          }
        );
      } else {
        // Insert new profile
        tx.executeSql(
          'INSERT INTO profiles (id, description, colorBorder, firstName, lastName, company, title, email, phone, mobile, fax, street, zipCode, city, country, website, linkedin, xing, twitter, instagram, facebook, whatsapp, notes, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [id, p.description, p.colorBorder, p.firstName, p.lastName, p.company, p.title, p.email, p.phone, p.mobile, p.fax, p.street, p.zipCode, p.city, p.country, p.website, p.linkedin, p.xing, p.twitter, p.instagram, p.facebook, p.whatsapp, p.notes, now],
          () => {
            navigation.goBack();
          }
        );
      }
    });
  };
  
  return (
    <SafeAreaView style={{flex:1, padding:12}}>
      <ProfileForm 
        initial={profile} 
        onSave={handleSave}
        onProfileChange={() => setHasChanges(true)}
      />
    </SafeAreaView>
  );
}