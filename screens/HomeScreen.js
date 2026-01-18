import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Button, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import QRGenerator from '../components/QRGenerator';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { initDB, getDB } from '../utils/sqlite';
import { t, addLanguageListener } from '../utils/i18n';

export default function HomeScreen({ navigation }) {
  const DISABLE_QR_FOR_DEBUG = false; // set to false after validation
  const [profile, setProfile] = useState({
    firstName: 'Max',
    lastName: 'Mustermann',
    company: 'Firma GmbH',
    title: 'Senior Engineer',
    email: 'max@firma.de',
    phone: '+49 123 4567',
    website: 'https://firma.de',
    address: 'Musterstrasse 1, 12345 Stadt'
  });
  const [, forceUpdate] = useState(0);

  const loadActiveProfile = () => {
    try {
      const db = getDB();
      const result = db.getFirstSync('SELECT * FROM profiles WHERE isActive = 1 LIMIT 1');
      if (result) {
        setProfile(result);
      }
    } catch (error) {
      console.log('Error loading active profile:', error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: t('homeScreen.title')
    });
  }, [navigation]);

  useEffect(()=> {
    initDB();
    loadActiveProfile();
    
    const unsubscribe = addLanguageListener(() => {
      forceUpdate(n => n + 1);
      navigation.setOptions({
        title: t('homeScreen.title')
      });
    });
    
    // Reload active profile when screen comes into focus
    const focusUnsubscribe = navigation.addListener('focus', () => {
      loadActiveProfile();
    });
    
    return () => {
      unsubscribe();
      focusUnsubscribe();
    };
  }, [navigation]);

  return (
    <SafeAreaView style={{flex:1, alignItems:'center', padding:16}}>
      {DISABLE_QR_FOR_DEBUG ? (
        <>
          <Text style={{marginTop:24}}>Debug-Modus aktiv: QR-Code Rendering vorübergehend deaktiviert.</Text>
          <Text style={{marginTop:8}}>{profile.firstName} {profile.lastName}</Text>
        </>
      ) : (
        profile && profile.firstName ? (
          <QRGenerator profile={profile} />
        ) : (
          <>
            <Text style={{margin:24, color:'red', fontWeight:'bold'}}>
              Kein aktives Profil gefunden. Bitte erst ein Profil anlegen!
            </Text>
            {console.log('DEBUG: Kein aktives Profil gefunden. Bitte erst ein Profil anlegen!')}
          </>
        )
      )}
      <View style={{marginTop:12, width:'100%'}}>
        <TouchableOpacity onPress={()=>navigation.navigate('ProfileList')} style={{backgroundColor:'#111', padding:12, borderRadius:8, alignItems:'center'}}>
          <Text style={{color:'#fff'}}>{t('homeScreen.editProfile')}</Text>
        </TouchableOpacity>
        <View style={{height:12}} />
          {/* QR-Scan und Scans-Liste entfernt */}
        <View style={{height:20}} />
        <LanguageSwitcher />
        <View style={{height:12}} />
        <TouchableOpacity onPress={()=>navigation.navigate('AppQR')} style={{backgroundColor:'transparent', padding:8, borderRadius:0, alignItems:'center'}}>
          <Text style={{color:'#1E90FF', fontWeight:'bold'}}>{t('homeScreen.appQR')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});