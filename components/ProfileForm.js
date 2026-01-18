import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { t, addLanguageListener } from '../utils/i18n';
import { FontAwesome, Ionicons } from '@expo/vector-icons';

export default function ProfileForm({ initial, onSave, onDelete, onProfileChange, suppressChanges }) {
  const initialProfile = {
    emailType: 'WORK',
    phoneType: 'WORK',
    mobileType: 'CELL',
    faxType: 'WORK',
    addressType: 'WORK',
    websiteType: 'WORK',
    ...initial
  };
  
  const getTypeText = (type, fieldType) => {
    if (fieldType === 'mobile' && type === 'CELL') return t('editProfile.typeCell');
    if (type === 'HOME') return t('editProfile.typeHome');
    if (type === 'WORK') return t('editProfile.typeWork');
    return t('editProfile.typeWork');
  };
  
  const [profile, setProfile] = useState(initialProfile);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(null);
  const [, forceUpdate] = useState(0);
  
  const colors = [
    '#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#800000', '#008000', '#000080', '#808000', '#800080', '#008080', '#808080',
    '#C0C0C0', '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F',
    '#BB8FCE', '#85C1E2', '#F8B739', '#52B788', '#E63946', '#457B9D'
  ];
  
  const updateProfile = (updates) => {
    setProfile(updates);
    if (!suppressChanges && onProfileChange) {
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
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.description} 
            onChangeText={(text)=>updateProfile({...profile, description:text})} 
            style={[styles.input, profile.colorBorder && { borderColor: profile.colorBorder, borderWidth: 2 }]}
            placeholder={t('editProfile.descriptionPlaceholder')}
            placeholderTextColor="#999"
          />
          {profile.description && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, description: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
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
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.firstName} 
            onChangeText={(text)=>updateProfile({...profile, firstName:text})} 
            style={styles.input}
            placeholder="Max"
            placeholderTextColor="#999"
          />
          {profile.firstName && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, firstName: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.lastName')}</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.lastName} 
            onChangeText={(text)=>updateProfile({...profile, lastName:text})} 
            style={styles.input}
            placeholder="Mustermann"
            placeholderTextColor="#999"
          />
          {profile.lastName && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, lastName: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.company')}</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.company} 
            onChangeText={(text)=>updateProfile({...profile, company:text})} 
            style={styles.input}
            placeholder="Firma GmbH"
            placeholderTextColor="#999"
          />
          {profile.company && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, company: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.jobTitle')}</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.title} 
            onChangeText={(text)=>updateProfile({...profile, title:text})} 
            style={styles.input}
            placeholder="Geschäftsführer"
            placeholderTextColor="#999"
          />
          {profile.title && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, title: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{t('editProfile.email')}</Text>
          <TouchableOpacity onPress={() => setShowTypePicker('email')} style={styles.typeSelector}>
            <Text style={styles.typeSelectorText}>
              {getTypeText(profile.emailType, 'email')}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.email} 
            onChangeText={(text)=>updateProfile({...profile, email:text})} 
            style={styles.input}
            placeholder="max@firma.de"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {profile.email && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, email: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{t('editProfile.phone')}</Text>
          <TouchableOpacity onPress={() => setShowTypePicker('phone')} style={styles.typeSelector}>
            <Text style={styles.typeSelectorText}>
              {getTypeText(profile.phoneType, 'phone')}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.phone} 
            onChangeText={(text)=>updateProfile({...profile, phone:text})} 
            style={styles.input}
            placeholder="+49 123 456789"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
          {profile.phone && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, phone: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{t('editProfile.mobile')}</Text>
          <TouchableOpacity onPress={() => setShowTypePicker('mobile')} style={styles.typeSelector}>
            <Text style={styles.typeSelectorText}>
              {getTypeText(profile.mobileType, 'mobile')}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.mobile} 
            onChangeText={(text)=>updateProfile({...profile, mobile:text})} 
            style={styles.input}
            placeholder="+49 160 1234567"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
          {profile.mobile && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, mobile: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{t('editProfile.fax')}</Text>
          <TouchableOpacity onPress={() => setShowTypePicker('fax')} style={styles.typeSelector}>
            <Text style={styles.typeSelectorText}>
              {getTypeText(profile.faxType, 'fax')}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.fax} 
            onChangeText={(text)=>updateProfile({...profile, fax:text})} 
            style={styles.input}
            placeholder="+49 123 456780"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
          {profile.fax && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, fax: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{t('editProfile.street')}</Text>
          <TouchableOpacity onPress={() => setShowTypePicker('address')} style={styles.typeSelector}>
            <Text style={styles.typeSelectorText}>
              {getTypeText(profile.addressType, 'address')}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.street} 
            onChangeText={(text)=>updateProfile({...profile, street:text})} 
            style={styles.input}
            placeholder="Musterstraße 123"
            placeholderTextColor="#999"
          />
          {profile.street && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, street: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.zipCode')}</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.zipCode} 
            onChangeText={(text)=>updateProfile({...profile, zipCode:text})} 
            style={styles.input}
            placeholder="12345"
            placeholderTextColor="#999"
            keyboardType="numeric"
          />
          {profile.zipCode && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, zipCode: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.city')}</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.city} 
            onChangeText={(text)=>updateProfile({...profile, city:text})} 
            style={styles.input}
            placeholder="Berlin"
            placeholderTextColor="#999"
          />
          {profile.city && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, city: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>{t('editProfile.country')}</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.country} 
            onChangeText={(text)=>updateProfile({...profile, country:text})} 
            style={styles.input}
            placeholder="Deutschland"
            placeholderTextColor="#999"
          />
          {profile.country && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, country: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>{t('editProfile.website')}</Text>
          <TouchableOpacity onPress={() => setShowTypePicker('website')} style={styles.typeSelector}>
            <Text style={styles.typeSelectorText}>
              {getTypeText(profile.websiteType, 'website')}
            </Text>
            <Ionicons name="chevron-down" size={14} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.website} 
            onChangeText={(text)=>updateProfile({...profile, website:text})} 
            style={styles.input}
                placeholder="https://firma.de"
              placeholderTextColor="#999"
              keyboardType="url"
              autoCapitalize="none"
            />
            {profile.website && (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={() => updateProfile({...profile, website: ''})}
              >
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelWithIcon}>
          <FontAwesome name="linkedin" size={16} color="#0077B5" style={styles.icon} />
          <Text style={styles.label}>{t('editProfile.linkedin')}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.linkedin} 
            onChangeText={(text)=>updateProfile({...profile, linkedin:text})} 
            style={styles.input}
            placeholder="https://linkedin.com/in/username"
            placeholderTextColor="#999"
            keyboardType="url"
            autoCapitalize="none"
          />
          {profile.linkedin && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, linkedin: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelWithIcon}>
          <FontAwesome name="xing" size={16} color="#026466" style={styles.icon} />
          <Text style={styles.label}>{t('editProfile.xing')}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.xing} 
            onChangeText={(text)=>updateProfile({...profile, xing:text})} 
            style={styles.input}
            placeholder="https://xing.com/profile/username"
            placeholderTextColor="#999"
            keyboardType="url"
            autoCapitalize="none"
          />
          {profile.xing && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, xing: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelWithIcon}>
          <FontAwesome name="twitter" size={16} color="#1DA1F2" style={styles.icon} />
          <Text style={styles.label}>{t('editProfile.twitter')}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.twitter} 
            onChangeText={(text)=>updateProfile({...profile, twitter:text})} 
            style={styles.input}
            placeholder="https://twitter.com/username"
            placeholderTextColor="#999"
            keyboardType="url"
            autoCapitalize="none"
          />
          {profile.twitter && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, twitter: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelWithIcon}>
          <FontAwesome name="instagram" size={16} color="#E4405F" style={styles.icon} />
          <Text style={styles.label}>{t('editProfile.instagram')}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.instagram} 
            onChangeText={(text)=>updateProfile({...profile, instagram:text})} 
            style={styles.input}
            placeholder="https://instagram.com/username"
            placeholderTextColor="#999"
            keyboardType="url"
            autoCapitalize="none"
          />
          {profile.instagram && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, instagram: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelWithIcon}>
          <FontAwesome name="facebook" size={16} color="#1877F2" style={styles.icon} />
          <Text style={styles.label}>{t('editProfile.facebook')}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.facebook} 
            onChangeText={(text)=>updateProfile({...profile, facebook:text})} 
            style={styles.input}
            placeholder="https://facebook.com/username"
            placeholderTextColor="#999"
            keyboardType="url"
            autoCapitalize="none"
          />
          {profile.facebook && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, facebook: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelWithIcon}>
          <FontAwesome name="whatsapp" size={16} color="#25D366" style={styles.icon} />
          <Text style={styles.label}>{t('editProfile.whatsapp')}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.whatsapp} 
            onChangeText={(text)=>updateProfile({...profile, whatsapp:text})} 
            style={styles.input}
            placeholder="+49 160 1234567"
            placeholderTextColor="#999"
            keyboardType="phone-pad"
          />
          {profile.whatsapp && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={() => updateProfile({...profile, whatsapp: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.formGroup}>
        <View style={styles.labelWithIcon}>
          <Ionicons name="document-text-outline" size={16} color="#666" style={styles.icon} />
          <Text style={styles.label}>{t('editProfile.notes') || 'Notizen'}</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput 
            value={profile.notes} 
            onChangeText={(text)=>updateProfile({...profile, notes:text})} 
            style={[styles.input, styles.multilineInput]}
            placeholder="Notizen..."
            placeholderTextColor="#999"
            multiline={true}
            numberOfLines={1}
            textAlignVertical="top"
          />
          {profile.notes && (
            <TouchableOpacity 
              style={[styles.clearButton, styles.clearButtonMultiline]}
              onPress={() => updateProfile({...profile, notes: ''})}
            >
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <TouchableOpacity onPress={()=>onSave(profile)} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>{t('editProfile.save')}</Text>
      </TouchableOpacity>

      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>{t('common.delete')}</Text>
        </TouchableOpacity>
      )}
      </ScrollView>

      <Modal
        visible={showTypePicker !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowTypePicker(null)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setShowTypePicker(null)}
        >
          <View style={styles.typePickerContainer}>
            <Text style={styles.typePickerTitle}>Typ auswählen</Text>
            <TouchableOpacity
              style={styles.typeOption}
              onPress={() => {
                if (showTypePicker === 'email') updateProfile({...profile, emailType: 'WORK'});
                else if (showTypePicker === 'phone') updateProfile({...profile, phoneType: 'WORK'});
                else if (showTypePicker === 'mobile') updateProfile({...profile, mobileType: 'CELL'});
                else if (showTypePicker === 'fax') updateProfile({...profile, faxType: 'WORK'});
                else if (showTypePicker === 'address') updateProfile({...profile, addressType: 'WORK'});
                else if (showTypePicker === 'website') updateProfile({...profile, websiteType: 'WORK'});
                setShowTypePicker(null);
              }}
            >
              <Text style={styles.typeOptionText}>{showTypePicker === 'mobile' ? t('editProfile.typeCell') : t('editProfile.typeWork')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.typeOption}
              onPress={() => {
                if (showTypePicker === 'email') updateProfile({...profile, emailType: 'HOME'});
                else if (showTypePicker === 'phone') updateProfile({...profile, phoneType: 'HOME'});
                else if (showTypePicker === 'mobile') updateProfile({...profile, mobileType: 'HOME'});
                else if (showTypePicker === 'fax') updateProfile({...profile, faxType: 'HOME'});
                else if (showTypePicker === 'address') updateProfile({...profile, addressType: 'HOME'});
                else if (showTypePicker === 'website') updateProfile({...profile, websiteType: 'HOME'});
                setShowTypePicker(null);
              }}
            >
              <Text style={styles.typeOptionText}>{t('editProfile.typeHome')}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    paddingBottom: 120,
  },
  formGroup: {
    marginBottom: 20,
  },
  labelWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typeSelectorText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  icon: {
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  multilineInput: {
    minHeight: 44,
    maxHeight: 150,
    paddingTop: 12,
  },
  clearButton: {
    position: 'absolute',
    right: 10,
    top: 12,
    padding: 4,
  },
  clearButtonMultiline: {
    top: 8,
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
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
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
  typePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 300,
  },
  typePickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  typeOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  typeOptionText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#007AFF',
  },
});