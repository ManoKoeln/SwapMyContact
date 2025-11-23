import React, { useEffect, useState } from 'react';
import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import ProfileListScreen from './screens/ProfileListScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import ScannerScreen from './screens/ScannerScreen';
import ScansListScreen from './screens/ScansListScreen';
import { initDB } from './utils/sqlite';
import { loadLanguage, addLanguageListener, t } from './utils/i18n';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Constants.platform.ios.model has been deprecated',
]);

const Stack = createNativeStackNavigator();

export default function App() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    initDB();
    loadLanguage();
    
    // Listen for language changes
    const unsubscribe = addLanguageListener(() => {
      forceUpdate(n => n + 1);
    });
    
    return unsubscribe;
  }, []);

  return (
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
          options={{
            title: t('homeScreen.title')
          }} 
        />
        <Stack.Screen 
          name='ProfileList' 
          component={ProfileListScreen} 
          options={{
            title: t('profileList.title')
          }} 
        />
        <Stack.Screen 
          name='EditProfile' 
          component={EditProfileScreen} 
          options={{
            title: t('editProfile.title')
          }} 
        />
        <Stack.Screen 
          name='Scanner' 
          component={ScannerScreen} 
          options={{
            title: t('scanner.title')
          }} 
        />
        <Stack.Screen 
          name='Scans' 
          component={ScansListScreen} 
          options={{
            title: t('scansList.title')
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}