import json
from pathlib import Path

translations_dir = Path('translations')

# Neue Übersetzungen (Englisch als Fallback)
new_keys = {
    'importFromContacts': 'Import from Contacts',
    'importFromContactsDescription': 'Imports your data from device contacts and automatically extracts LinkedIn, XING, and WhatsApp Business URLs.',
    'contactPermissionMessage': 'Please allow access to your contacts to import your data.',
    'noBusinessDataMessage': 'No matching contact data was found. Please make sure you have saved yourself in your contacts.',
    'businessImportSuccessMessage': 'Your contact data has been successfully imported.'
}

# Keys die entfernt werden sollen
remove_keys = ['importFromBusinessApp', 'selectBusinessApp', 'importFromLinkedIn', 'importFromXing', 'importFromWhatsAppBusiness']

for lang_file in translations_dir.glob('*.json'):
    if 'Impressum' in lang_file.stem:
        continue
    
    if lang_file.stem in ['de', 'en']:
        continue  # Diese haben wir schon manuell aktualisiert
    
    with open(lang_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    if 'profileList' in data:
        updated = False
        
        # Neue Keys hinzufügen
        for key, value in new_keys.items():
            if key not in data['profileList']:
                data['profileList'][key] = value
                updated = True
        
        # Alte Keys entfernen
        for key in remove_keys:
            if key in data['profileList']:
                del data['profileList'][key]
                updated = True
        
        if updated:
            with open(lang_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                f.write('\n')
            print(f'Updated {lang_file.name}')

print('Done!')
