import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import HomeScreen from './screens/HomeScreen';
import ProfileListScreen from './screens/ProfileListScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import AppQRScreen from './screens/AppQRScreen';
import PremiumDialogScreen from './screens/PremiumDialogScreen';
import ImpressumScreen from './screens/ImpressumScreen';
import DatenschutzScreen from './screens/DatenschutzScreen';
import SettingsScreen from './screens/SettingsScreen';
import HeaderMenu from './components/HeaderMenu';
import { initDB } from './utils/sqlite';
import { loadLanguage, addLanguageListener, t } from './utils/i18n';
import { initIAP, endIAP, checkSubscriptionStatus } from './utils/iap';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Constants.platform.ios.model has been deprecated',
]);

const Stack = createNativeStackNavigator();

function ErrorBoundary({ children }) {
  const [error, setError] = useState(null);
  useEffect(() => {
    const subscription = (error) => setError(error);
    const originalHandler = global.ErrorUtils?.getGlobalHandler?.();
    if (global.ErrorUtils?.setGlobalHandler) {
      global.ErrorUtils.setGlobalHandler((e, isFatal) => {
        setError(e);
        if (originalHandler) originalHandler(e, isFatal);
      });
    }
    return () => {
      if (global.ErrorUtils?.setGlobalHandler && originalHandler) {
        global.ErrorUtils.setGlobalHandler(originalHandler);
      }
    };
  }, []);
  if (error) {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center', padding:24}}>
        <Text style={{fontWeight:'bold', marginBottom:8}}>Es ist ein Fehler aufgetreten.</Text>
        <Text selectable style={{textAlign:'center'}}>{String(error?.message || error)}</Text>
      </View>
    );
  }
  return children;
}

export default function App() {
  const [, forceUpdate] = useState(0);

  const openTerms = () => {
    const url = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
    Linking.openURL(url).catch(() => {});
  };

  useEffect(() => {
    initDB();
    loadLanguage();
    initIAP();
    
    // Prüfe Subscription-Status alle 24 Stunden
    const subscriptionCheckInterval = setInterval(() => {
      checkSubscriptionStatus();
    }, 24 * 60 * 60 * 1000); // 24 Stunden
    
    // Listen for language changes
    const unsubscribe = addLanguageListener(() => {
      forceUpdate(n => n + 1);
    });
    
    return () => {
      unsubscribe();
      endIAP();
      clearInterval(subscriptionCheckInterval);
    };
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
        <Stack.Navigator 
          initialRouteName='Home'
          screenOptions={{
            headerShown: true,
            headerTitleAlign: 'center',
            headerBackTitle: ''
          }}
        >
          <Stack.Screen 
            name='Home' 
            component={HomeScreen} 
            options={({ navigation }) => ({
              title: t('homeScreen.title'),
              headerRight: () => <HeaderMenu navigation={navigation} />
            })}
          />
          <Stack.Screen 
            name='ProfileList' 
            component={ProfileListScreen} 
            options={({ navigation }) => ({
              title: t('profileList.title'),
              headerRight: () => <HeaderMenu navigation={navigation} />
            })}
          />
          <Stack.Screen 
            name='EditProfile' 
            component={EditProfileScreen} 
            options={({ navigation }) => ({
              title: t('editProfile.title'),
              headerRight: () => <HeaderMenu navigation={navigation} />
            })}
          />
          <Stack.Screen 
            name='AppQR' 
            component={AppQRScreen} 
            options={{
              title: t('appQR.title')
            }} 
          />
          <Stack.Screen 
            name='PremiumDialog' 
            component={PremiumDialogScreen} 
            options={{
              title: 'Premium',
              headerShown: false
            }} 
          />
          <Stack.Screen 
            name='Impressum' 
            component={ImpressumScreen} 
            options={{
              title: 'Impressum'
            }} 
          />
          <Stack.Screen 
            name='Datenschutz' 
            component={DatenschutzScreen} 
            options={{
              title: 'Datenschutz'
            }} 
          />
          <Stack.Screen 
            name='Settings' 
            component={SettingsScreen} 
            options={{
              title: 'Einstellungen'
            }} 
          />
        </Stack.Navigator>
        </NavigationContainer>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}