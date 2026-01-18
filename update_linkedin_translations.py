#!/usr/bin/env python3
import json
import os
from pathlib import Path

# Basis-Übersetzungen (Deutsch und Englisch sind Referenz)
translations = {
    "de": {
        "importFromLinkedIn": "Daten von LinkedIn",
        "permissionRequired": "Berechtigung erforderlich",
        "contactPermissionMessage": "Bitte erlauben Sie den Zugriff auf Ihre Kontakte, um LinkedIn-Daten zu importieren.",
        "noLinkedInData": "Keine Daten gefunden",
        "noLinkedInDataMessage": "Es wurden keine Kontaktdaten gefunden. Bitte stellen Sie sicher, dass LinkedIn auf Ihrem Gerät installiert ist und Kontakte synchronisiert sind.",
        "linkedInImportSuccess": "Import erfolgreich",
        "linkedInImportSuccessMessage": "LinkedIn-Daten wurden erfolgreich importiert.",
        "importError": "Importfehler",
        "importErrorMessage": "Beim Importieren der LinkedIn-Daten ist ein Fehler aufgetreten."
    },
    "en": {
        "importFromLinkedIn": "Import from LinkedIn",
        "permissionRequired": "Permission Required",
        "contactPermissionMessage": "Please allow access to your contacts to import LinkedIn data.",
        "noLinkedInData": "No Data Found",
        "noLinkedInDataMessage": "No contact data was found. Please make sure LinkedIn is installed on your device and contacts are synchronized.",
        "linkedInImportSuccess": "Import Successful",
        "linkedInImportSuccessMessage": "LinkedIn data has been successfully imported.",
        "importError": "Import Error",
        "importErrorMessage": "An error occurred while importing LinkedIn data."
    }
}

# Hole alle Sprachdateien
translations_dir = Path(__file__).parent.parent / "translations"

for lang_file in translations_dir.glob("*.json"):
    lang_code = lang_file.stem
    
    # Überspringe Dateien, die wir manuell bearbeitet haben
    if lang_code in ["de", "en", "de_Impressum", "en_Impressum"]:
        continue
    
    try:
        with open(lang_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        # Füge neue Schlüssel hinzu, falls nicht vorhanden
        if "profileList" in data:
            # Verwende englische Übersetzungen als Fallback
            for key, value in translations["en"].items():
                if key not in data["profileList"]:
                    data["profileList"][key] = value
                    print(f"Added '{key}' to {lang_code}.json")
        
        # Schreibe zurück
        with open(lang_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
            f.write('\n')
        
        print(f"✓ Updated {lang_code}.json")
    
    except Exception as e:
        print(f"✗ Error updating {lang_code}.json: {e}")

print("\n✅ All translation files updated!")
