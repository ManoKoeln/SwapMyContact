import React, { useEffect, useState, useLayoutEffect } from 'react';
import { View, Text, Button, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import QRGenerator from '../components/QRGenerator';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { initDB, getDB } from '../utils/sqlite';
import { v4 as uuidv4 } from 'uuid';
import { t, addLanguageListener } from '../utils/i18n';

export default function HomeScreen({ navigation }) {
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
    const db = getDB();
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM profiles WHERE isActive = 1 LIMIT 1',
        [],
        (_, { rows }) => {
          if (rows.length > 0) {
            setProfile(rows.item(0));
          }
        },
        (_, error) => console.log('Error loading active profile:', error)
      );
    });
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
      {profile && profile.firstName ? (
        <QRGenerator profile={profile} />
      ) : (
        <>
          <Text style={{margin:24, color:'red', fontWeight:'bold'}}>
            Kein aktives Profil gefunden. Bitte erst ein Profil anlegen!
          </Text>
          {console.log('DEBUG: Kein aktives Profil gefunden. Bitte erst ein Profil anlegen!')}
        </>
      )}
      <View style={{marginTop:12, width:'100%'}}>
        <TouchableOpacity onPress={()=>navigation.navigate('ProfileList')} style={{backgroundColor:'#111', padding:12, borderRadius:8, alignItems:'center'}}>
          <Text style={{color:'#fff'}}>{t('homeScreen.editProfile')}</Text>
        </TouchableOpacity>
        <View style={{height:12}} />
        <Button title={t('homeScreen.scanQR')} onPress={()=>navigation.navigate('Scanner')} />
        <View style={{height:12}} />
        <Button title={t('homeScreen.scannedCards')} onPress={()=>navigation.navigate('Scans')} />
        <View style={{height:20}} />
        <LanguageSwitcher />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});