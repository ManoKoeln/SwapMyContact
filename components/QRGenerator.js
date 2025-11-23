import React from 'react';
import { View, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

function toVCard(profile) {
  // Build address string
  const addressParts = [
    '', // PO Box
    '', // Extended Address
    profile.street || '',
    profile.city || '',
    '', // Region/State
    profile.zipCode || '',
    profile.country || ''
  ];
  const address = addressParts.some(p => p) ? `ADR;TYPE=WORK:${addressParts.join(';')}` : '';
  
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${profile.lastName || ''};${profile.firstName || ''}`,
    `FN:${(profile.firstName || '') + ' ' + (profile.lastName || '')}`,
    profile.title ? `TITLE:${profile.title}` : '',
    profile.company ? `ORG:${profile.company}` : '',
    profile.email ? `EMAIL;TYPE=WORK:${profile.email}` : '',
    profile.phone ? `TEL;TYPE=WORK,VOICE:${profile.phone}` : '',
    profile.mobile ? `TEL;TYPE=CELL:${profile.mobile}` : '',
    profile.fax ? `TEL;TYPE=FAX:${profile.fax}` : '',
    profile.website ? `URL:${profile.website}` : '',
    profile.linkedin ? `X-SOCIALPROFILE;TYPE=linkedin:${profile.linkedin}` : '',
    profile.xing ? `X-SOCIALPROFILE;TYPE=xing:${profile.xing}` : '',
    profile.twitter ? `X-SOCIALPROFILE;TYPE=twitter:${profile.twitter}` : '',
    profile.instagram ? `X-SOCIALPROFILE;TYPE=instagram:${profile.instagram}` : '',
    profile.facebook ? `X-SOCIALPROFILE;TYPE=facebook:${profile.facebook}` : '',
    profile.whatsapp ? `X-SOCIALPROFILE;TYPE=whatsapp:${profile.whatsapp}` : '',
    address,
    profile.notes ? `NOTE:${profile.notes}` : '',
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
      <Text style={{marginTop:8}}>{profile.firstName} {profile.lastName}</Text>
    </View>
  );
}