import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { t, addLanguageListener } from '../utils/i18n';

export default function ProfileForm({ initial, onSave, onProfileChange }) {
  const [profile, setProfile] = useState(initial || {});
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [, forceUpdate] = useState(0);
  
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#808080',
    '#C0C0C0', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E2', '#F8B739', '#52B788', '#E63946', '#457B9D'
  ];
  
  const updateProfile = (updates) => {
    setProfile(updates);
    if (onProfileChange) {
      onProfileChange();
    }
  };
  
  useEffect(() => {
    const unsubscribe = addLanguageListener(() => {
      forceUpdate(n => n + 1);
    });
    return unsubscribe;
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
      <View style={styles.formGroup}>
        <TouchableOpacity onLongPress={() => setShowColorPicker(true)}>
          <Text style={styles.label}>{t('editProfile.description')}</Text>
        </TouchableOpacity>
        <TextInput 
          value={profile.description} 
          onChangeText={(text)=>updateProfile({...profile, description:text})} 
          style={[styles.input, profile.colorBorder && { borderColor: profile.colorBorder, borderWidth: 2 }]}
          placeholder={t('editProfile.descriptionPlaceholder')}
          placeholderTextColor="#999"
        />
      </View>
      
      <Modal
        visible={showColorPicker}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowColorPicker(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowColorPicker(false)}
        >
          <View style={styles.colorPickerContainer}>
            <Text style={styles.colorPickerTitle}>{t('editProfile.selectColor') || 'Farbe wählen'}</Text>
            <View style={styles.colorGrid}>
              {colors.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[styles.colorButton, { backgroundColor: color }]}
                  onPress={() => {
                    updateProfile({...profile, colorBorder: color});
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </View>
            <TouchableOpacity
              style={styles.removeColorButton}
              onPress={() => {
                updateProfile({...profile, colorBorder: null});
                setShowColorPicker(false);
              }}
            >
              <Text style={styles.removeColorText}>{t('editProfile.removeColor') || 'Farbe entfernen'}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.firstName')}</Text>
        <TextInput 
          value={profile.firstName} 
          onChangeText={(text)=>updateProfile({...profile, firstName:text})} 
          style={styles.input}
          placeholder="Max"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.lastName')}</Text>
        <TextInput 
          value={profile.lastName} 
          onChangeText={(text)=>updateProfile({...profile, lastName:text})} 
          style={styles.input}
          placeholder="Mustermann"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.company')}</Text>
        <TextInput 
          value={profile.company} 
          onChangeText={(text)=>updateProfile({...profile, company:text})} 
          style={styles.input}
          placeholder="Firma GmbH"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.jobTitle')}</Text>
        <TextInput 
          value={profile.title} 
          onChangeText={(text)=>updateProfile({...profile, title:text})} 
          style={styles.input}
          placeholder="Geschäftsführer"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.email')}</Text>
        <TextInput 
          value={profile.email} 
          onChangeText={(text)=>updateProfile({...profile, email:text})} 
          style={styles.input}
          placeholder="max@firma.de"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.phone')}</Text>
        <TextInput 
          value={profile.phone} 
          onChangeText={(text)=>updateProfile({...profile, phone:text})} 
          style={styles.input}
          placeholder="+49 123 456789"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.mobile')}</Text>
        <TextInput 
          value={profile.mobile} 
          onChangeText={(text)=>updateProfile({...profile, mobile:text})} 
          style={styles.input}
          placeholder="+49 160 1234567"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.fax')}</Text>
        <TextInput 
          value={profile.fax} 
          onChangeText={(text)=>updateProfile({...profile, fax:text})} 
          style={styles.input}
          placeholder="+49 123 456780"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.street')}</Text>
        <TextInput 
          value={profile.street} 
          onChangeText={(text)=>updateProfile({...profile, street:text})} 
          style={styles.input}
          placeholder="Musterstraße 123"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.zipCode')}</Text>
        <TextInput 
          value={profile.zipCode} 
          onChangeText={(text)=>updateProfile({...profile, zipCode:text})} 
          style={styles.input}
          placeholder="12345"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.city')}</Text>
        <TextInput 
          value={profile.city} 
          onChangeText={(text)=>updateProfile({...profile, city:text})} 
          style={styles.input}
          placeholder="Berlin"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.country')}</Text>
        <TextInput 
          value={profile.country} 
          onChangeText={(text)=>updateProfile({...profile, country:text})} 
          style={styles.input}
          placeholder="Deutschland"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.website')}</Text>
        <TextInput 
          value={profile.website} 
          onChangeText={(text)=>updateProfile({...profile, website:text})} 
          style={styles.input}
          placeholder="https://firma.de"
          placeholderTextColor="#999"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.linkedin')}</Text>
        <TextInput 
          value={profile.linkedin} 
          onChangeText={(text)=>updateProfile({...profile, linkedin:text})} 
          style={styles.input}
          placeholder="https://linkedin.com/in/username"
          placeholderTextColor="#999"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.xing')}</Text>
        <TextInput 
          value={profile.xing} 
          onChangeText={(text)=>updateProfile({...profile, xing:text})} 
          style={styles.input}
          placeholder="https://xing.com/profile/username"
          placeholderTextColor="#999"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.twitter')}</Text>
        <TextInput 
          value={profile.twitter} 
          onChangeText={(text)=>updateProfile({...profile, twitter:text})} 
          style={styles.input}
          placeholder="https://twitter.com/username"
          placeholderTextColor="#999"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.instagram')}</Text>
        <TextInput 
          value={profile.instagram} 
          onChangeText={(text)=>updateProfile({...profile, instagram:text})} 
          style={styles.input}
          placeholder="https://instagram.com/username"
          placeholderTextColor="#999"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.facebook')}</Text>
        <TextInput 
          value={profile.facebook} 
          onChangeText={(text)=>updateProfile({...profile, facebook:text})} 
          style={styles.input}
          placeholder="https://facebook.com/username"
          placeholderTextColor="#999"
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.whatsapp')}</Text>
        <TextInput 
          value={profile.whatsapp} 
          onChangeText={(text)=>updateProfile({...profile, whatsapp:text})} 
          style={styles.input}
          placeholder="+49 160 1234567"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />
      </View>

      <TouchableOpacity onPress={()=>onSave(profile)} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>{t('editProfile.save')}</Text>
      </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
    minHeight: 100,
    maxHeight: 200,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorPickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 350,
  },
  colorPickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  colorButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#DDD',
  },
  removeColorButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FF3B30',
    borderRadius: 8,
    alignItems: 'center',
  },
  removeColorText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});