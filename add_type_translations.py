#!/usr/bin/env python3
"""
Add translations for contact type dropdowns (Work, Home, Cell) to all language files.
"""

import json
import os
from pathlib import Path

# Translation mappings for the three types
TRANSLATIONS = {
    'af': {'typeWork': 'Werk', 'typeHome': 'Tuis', 'typeCell': 'Mobiel'},
    'ar': {'typeWork': 'عمل', 'typeHome': 'منزل', 'typeCell': 'جوال'},
    'bg': {'typeWork': 'Работа', 'typeHome': 'Дом', 'typeCell': 'Мобилен'},
    'bn': {'typeWork': 'কাজ', 'typeHome': 'বাড়ি', 'typeCell': 'মোবাইল'},
    'ca': {'typeWork': 'Feina', 'typeHome': 'Casa', 'typeCell': 'Mòbil'},
    'cs': {'typeWork': 'Práce', 'typeHome': 'Domů', 'typeCell': 'Mobil'},
    'da': {'typeWork': 'Arbejde', 'typeHome': 'Hjem', 'typeCell': 'Mobil'},
    'de': {'typeWork': 'Arbeit', 'typeHome': 'Privat', 'typeCell': 'Mobil'},
    'el': {'typeWork': 'Εργασία', 'typeHome': 'Σπίτι', 'typeCell': 'Κινητό'},
    'en': {'typeWork': 'Work', 'typeHome': 'Home', 'typeCell': 'Mobile'},
    'es': {'typeWork': 'Trabajo', 'typeHome': 'Casa', 'typeCell': 'Móvil'},
    'et': {'typeWork': 'Töö', 'typeHome': 'Kodu', 'typeCell': 'Mobiil'},
    'eu': {'typeWork': 'Lana', 'typeHome': 'Etxea', 'typeCell': 'Mugikorra'},
    'fa': {'typeWork': 'کار', 'typeHome': 'خانه', 'typeCell': 'موبایل'},
    'fi': {'typeWork': 'Työ', 'typeHome': 'Koti', 'typeCell': 'Matkapuhelin'},
    'fr': {'typeWork': 'Travail', 'typeHome': 'Domicile', 'typeCell': 'Mobile'},
    'gl': {'typeWork': 'Traballo', 'typeHome': 'Casa', 'typeCell': 'Móbil'},
    'gu': {'typeWork': 'કામ', 'typeHome': 'ઘર', 'typeCell': 'મોબાઇલ'},
    'he': {'typeWork': 'עבודה', 'typeHome': 'בית', 'typeCell': 'נייד'},
    'hi': {'typeWork': 'कार्य', 'typeHome': 'घर', 'typeCell': 'मोबाइल'},
    'hr': {'typeWork': 'Posao', 'typeHome': 'Kuća', 'typeCell': 'Mobitel'},
    'hu': {'typeWork': 'Munka', 'typeHome': 'Otthon', 'typeCell': 'Mobil'},
    'id': {'typeWork': 'Kerja', 'typeHome': 'Rumah', 'typeCell': 'Seluler'},
    'it': {'typeWork': 'Lavoro', 'typeHome': 'Casa', 'typeCell': 'Cellulare'},
    'ja': {'typeWork': '仕事', 'typeHome': '自宅', 'typeCell': '携帯'},
    'kn': {'typeWork': 'ಕೆಲಸ', 'typeHome': 'ಮನೆ', 'typeCell': 'ಮೊಬೈಲ್'},
    'ko': {'typeWork': '직장', 'typeHome': '집', 'typeCell': '휴대전화'},
    'lt': {'typeWork': 'Darbas', 'typeHome': 'Namai', 'typeCell': 'Mobilusis'},
    'lv': {'typeWork': 'Darbs', 'typeHome': 'Mājās', 'typeCell': 'Mobilais'},
    'ml': {'typeWork': 'ജോലി', 'typeHome': 'വീട്', 'typeCell': 'മൊബൈൽ'},
    'mr': {'typeWork': 'काम', 'typeHome': 'घर', 'typeCell': 'मोबाइल'},
    'ms': {'typeWork': 'Kerja', 'typeHome': 'Rumah', 'typeCell': 'Mudah Alih'},
    'nl': {'typeWork': 'Werk', 'typeHome': 'Thuis', 'typeCell': 'Mobiel'},
    'no': {'typeWork': 'Arbeid', 'typeHome': 'Hjem', 'typeCell': 'Mobil'},
    'pa': {'typeWork': 'ਕੰਮ', 'typeHome': 'ਘਰ', 'typeCell': 'ਮੋਬਾਈਲ'},
    'pl': {'typeWork': 'Praca', 'typeHome': 'Dom', 'typeCell': 'Komórka'},
    'pt': {'typeWork': 'Trabalho', 'typeHome': 'Casa', 'typeCell': 'Celular'},
    'ro': {'typeWork': 'Muncă', 'typeHome': 'Acasă', 'typeCell': 'Mobil'},
    'ru': {'typeWork': 'Работа', 'typeHome': 'Дом', 'typeCell': 'Мобильный'},
    'sk': {'typeWork': 'Práca', 'typeHome': 'Domov', 'typeCell': 'Mobil'},
    'sl': {'typeWork': 'Delo', 'typeHome': 'Dom', 'typeCell': 'Mobilni'},
    'sr': {'typeWork': 'Посао', 'typeHome': 'Кућа', 'typeCell': 'Мобилни'},
    'sv': {'typeWork': 'Arbete', 'typeHome': 'Hem', 'typeCell': 'Mobil'},
    'sw': {'typeWork': 'Kazi', 'typeHome': 'Nyumbani', 'typeCell': 'Simu ya Mkononi'},
    'ta': {'typeWork': 'வேலை', 'typeHome': 'வீடு', 'typeCell': 'மொபைல்'},
    'te': {'typeWork': 'పని', 'typeHome': 'ఇల్లు', 'typeCell': 'మొబైల్'},
    'th': {'typeWork': 'งาน', 'typeHome': 'บ้าน', 'typeCell': 'มือถือ'},
    'tr': {'typeWork': 'İş', 'typeHome': 'Ev', 'typeCell': 'Mobil'},
    'uk': {'typeWork': 'Робота', 'typeHome': 'Дім', 'typeCell': 'Мобільний'},
    'ur': {'typeWork': 'کام', 'typeHome': 'گھر', 'typeCell': 'موبائل'},
    'vi': {'typeWork': 'Công việc', 'typeHome': 'Nhà', 'typeCell': 'Di động'},
    'zh': {'typeWork': '工作', 'typeHome': '家庭', 'typeCell': '手机'},
}

def add_translations():
    translations_dir = Path(__file__).parent / 'translations'
    
    for lang_code, type_translations in TRANSLATIONS.items():
        file_path = translations_dir / f'{lang_code}.json'
        
        if not file_path.exists():
            print(f'⚠️  Skipping {lang_code}: File not found')
            continue
        
        try:
            # Read existing translations
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Check if editProfile section exists
            if 'editProfile' not in data:
                print(f'⚠️  Skipping {lang_code}: No editProfile section')
                continue
            
            # Add type translations to editProfile section
            updated = False
            for key, value in type_translations.items():
                if key not in data['editProfile']:
                    data['editProfile'][key] = value
                    updated = True
            
            if updated:
                # Write back to file
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                print(f'✅ Updated {lang_code}.json')
            else:
                print(f'ℹ️  {lang_code}.json already up to date')
        
        except Exception as e:
            print(f'❌ Error processing {lang_code}: {e}')

if __name__ == '__main__':
    add_translations()
    print('\n✨ Translation update complete!')
