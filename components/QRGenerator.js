import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

function toVCard(profile) {
  // Build address string with type
  const addressParts = [
    '', // PO Box
    '', // Extended Address
    profile.street || '',
    profile.city || '',
    '', // Region/State
    profile.zipCode || '',
    profile.country || ''
  ];
  const addressType = profile.addressType || 'WORK';
  const address = addressParts.some(p => p) ? `ADR;TYPE=${addressType}:${addressParts.join(';')}` : '';
  
  // Format social media URLs for better compatibility
  const formatUrl = (url) => {
    if (!url) return '';
    // If already a full URL, return as is
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    // Otherwise assume it's a username/handle and add https://
    return url;
  };
  
  // Escape special characters in vCard fields
  const escapeVCard = (text) => {
    if (!text) return '';
    return text
      .replace(/\\/g, '\\\\')  // Escape backslashes first
      .replace(/\n/g, '\\n')    // Escape newlines
      .replace(/,/g, '\\,')     // Escape commas
      .replace(/;/g, '\\;');    // Escape semicolons
  };
  
  // Get types for each field
  const emailType = profile.emailType || 'WORK';
  const phoneType = profile.phoneType || 'WORK';
  const mobileType = profile.mobileType || 'CELL';
  const faxType = profile.faxType || 'WORK';
  const websiteType = profile.websiteType || 'WORK';
  
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapeVCard(profile.lastName || '')};${escapeVCard(profile.firstName || '')}`,
    `FN:${escapeVCard((profile.firstName || '') + ' ' + (profile.lastName || ''))}`,
    profile.title ? `TITLE:${escapeVCard(profile.title)}` : '',
    profile.company ? `ORG:${escapeVCard(profile.company)}` : '',
    profile.email ? `EMAIL;TYPE=${emailType}:${profile.email}` : '',
    profile.phone ? `TEL;TYPE=${phoneType},VOICE:${profile.phone}` : '',
    profile.mobile ? `TEL;TYPE=${mobileType}:${profile.mobile}` : '',
    profile.fax ? `TEL;TYPE=${faxType},FAX:${profile.fax}` : '',
    profile.website ? `URL;TYPE=${websiteType}:${formatUrl(profile.website)}` : '',
    profile.linkedin ? `URL;type=LinkedIn:${formatUrl(profile.linkedin)}` : '',
    profile.xing ? `URL;type=XING:${formatUrl(profile.xing)}` : '',
    profile.twitter ? `URL;type=Twitter:${formatUrl(profile.twitter)}` : '',
    profile.instagram ? `URL;type=Instagram:${formatUrl(profile.instagram)}` : '',
    profile.facebook ? `URL;type=Facebook:${formatUrl(profile.facebook)}` : '',
    profile.whatsapp ? `URL;type=WhatsApp:${formatUrl(profile.whatsapp)}` : '',
    address,
    profile.notes ? `NOTE:${escapeVCard(profile.notes)}` : '',
    'END:VCARD'
  ].filter(Boolean).join('\n');
}

export default function QRGenerator({ profile }) {
  const vcard = toVCard(profile);
  const borderColor = profile.colorBorder || '#000000';
  
  return (
    <View style={{alignItems:'center', padding:8}}>
      <View style={{
        borderWidth: 4,
        borderColor: borderColor,
        borderRadius: 8,
        padding: 8,
      }}>
        <QRCode 
          value={vcard} 
          size={240}
        />
      </View>
      <Text style={{marginTop:8, textAlign:'center', paddingHorizontal:16}}>{profile.description || `${profile.firstName || ''} ${profile.lastName || ''}`}</Text>
    </View>
  );
}