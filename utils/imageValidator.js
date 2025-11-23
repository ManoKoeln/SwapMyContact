import * as FileSystem from 'expo-file-system';

// Simple magic-bytes check for PNG and JPG using base64 prefix
export async function isRealImage(uri) {
  try {
    const bytes = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
    // Check common base64 prefixes for PNG/JPG
    // PNG base64 starts with iVBORw0KG...
    // JPEG base64 starts with /9j/ (FF D8 FF)
    if (bytes.startsWith('iVBORw0KG') || bytes.startsWith('/9j/')) return true;
    return false;
  } catch (e) {
    console.log('image validate error', e);
    return false;
  }
}