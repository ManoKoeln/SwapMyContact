#!/usr/bin/env python3
"""
Fix menu translations for all language files.
"""

import json
import os
from pathlib import Path

# Menu translations for all languages
MENU_TRANSLATIONS = {
    'af': {'impressum': 'Afdruk', 'datenschutz': 'Privaatheidsbeleid', 'termsOfUse': 'Gebruiksvoorwaardes', 'description': 'Beskrywing', 'buyPremium': '✨ Koop Premium'},
    'ar': {'impressum': 'بصمة', 'datenschutz': 'سياسة الخصوصية', 'termsOfUse': 'شروط الاستخدام', 'description': 'وصف', 'buyPremium': '✨ شراء بريميوم'},
    'bg': {'impressum': 'Импресум', 'datenschutz': 'Политика за поверителност', 'termsOfUse': 'Условия за ползване', 'description': 'Описание', 'buyPremium': '✨ Купи Премиум'},
    'bn': {'impressum': 'ছাপ', 'datenschutz': 'গোপনীয়তা নীতি', 'termsOfUse': 'ব্যবহারের শর্তাবলী', 'description': 'বর্ণনা', 'buyPremium': '✨ প্রিমিয়াম কিনুন'},
    'ca': {'impressum': 'Avís legal', 'datenschutz': 'Política de privadesa', 'termsOfUse': "Condicions d'ús", 'description': 'Descripció', 'buyPremium': '✨ Comprar Premium'},
    'cs': {'impressum': 'Tiráž', 'datenschutz': 'Zásady ochrany osobních údajů', 'termsOfUse': 'Podmínky použití', 'description': 'Popis', 'buyPremium': '✨ Koupit Premium'},
    'da': {'impressum': 'Kolofon', 'datenschutz': 'Fortrolighedspolitik', 'termsOfUse': 'Vilkår for brug', 'description': 'Beskrivelse', 'buyPremium': '✨ Køb Premium'},
    'de': {'impressum': 'Impressum', 'datenschutz': 'Datenschutz', 'termsOfUse': 'Nutzungsbedingungen', 'description': 'Beschreibung', 'buyPremium': '✨ Premium kaufen'},
    'el': {'impressum': 'Αποτύπωση', 'datenschutz': 'Πολιτική Απορρήτου', 'termsOfUse': 'Όροι Χρήσης', 'description': 'Περιγραφή', 'buyPremium': '✨ Αγορά Premium'},
    'en': {'impressum': 'Imprint', 'datenschutz': 'Privacy Policy', 'termsOfUse': 'Terms of Use', 'description': 'Description', 'buyPremium': '✨ Buy Premium'},
    'es': {'impressum': 'Aviso legal', 'datenschutz': 'Política de privacidad', 'termsOfUse': 'Condiciones de uso', 'description': 'Descripción', 'buyPremium': '✨ Comprar Premium'},
    'et': {'impressum': 'Kolofon', 'datenschutz': 'Privaatsuspoliitika', 'termsOfUse': 'Kasutustingimused', 'description': 'Kirjeldus', 'buyPremium': '✨ Osta Premium'},
    'eu': {'impressum': 'Inpresioa', 'datenschutz': 'Pribatutasun politika', 'termsOfUse': 'Erabilera baldintzak', 'description': 'Deskribapena', 'buyPremium': '✨ Erosi Premium'},
    'fa': {'impressum': 'نشان', 'datenschutz': 'سیاست حفظ حریم خصوصی', 'termsOfUse': 'شرایط استفاده', 'description': 'شرح', 'buyPremium': '✨ خرید پرمیوم'},
    'fi': {'impressum': 'Julkaisutiedot', 'datenschutz': 'Tietosuojakäytäntö', 'termsOfUse': 'Käyttöehdot', 'description': 'Kuvaus', 'buyPremium': '✨ Osta Premium'},
    'fr': {'impressum': 'Mentions légales', 'datenschutz': 'Politique de confidentialité', 'termsOfUse': "Conditions d'utilisation", 'description': 'Description', 'buyPremium': '✨ Acheter Premium'},
    'gl': {'impressum': 'Aviso legal', 'datenschutz': 'Política de privacidade', 'termsOfUse': 'Condicións de uso', 'description': 'Descrición', 'buyPremium': '✨ Comprar Premium'},
    'gu': {'impressum': 'છાપ', 'datenschutz': 'ગોપનીયતા નીતિ', 'termsOfUse': 'વપરાશની શરતો', 'description': 'વર્ણન', 'buyPremium': '✨ પ્રીમિયમ ખરીદો'},
    'he': {'impressum': 'תשקיף', 'datenschutz': 'מדיניות פרטיות', 'termsOfUse': 'תנאי שימוש', 'description': 'תיאור', 'buyPremium': '✨ קנה Premium'},
    'hi': {'impressum': 'छाप', 'datenschutz': 'गोपनीयता नीति', 'termsOfUse': 'उपयोग की शर्तें', 'description': 'विवरण', 'buyPremium': '✨ प्रीमियम खरीदें'},
    'hr': {'impressum': 'Impressum', 'datenschutz': 'Politika privatnosti', 'termsOfUse': 'Uvjeti korištenja', 'description': 'Opis', 'buyPremium': '✨ Kupi Premium'},
    'hu': {'impressum': 'Impresszum', 'datenschutz': 'Adatvédelmi irányelvek', 'termsOfUse': 'Felhasználási feltételek', 'description': 'Leírás', 'buyPremium': '✨ Premium vásárlása'},
    'id': {'impressum': 'Jejak', 'datenschutz': 'Kebijakan Privasi', 'termsOfUse': 'Ketentuan Penggunaan', 'description': 'Deskripsi', 'buyPremium': '✨ Beli Premium'},
    'it': {'impressum': 'Colophon', 'datenschutz': 'Informativa sulla privacy', 'termsOfUse': "Termini d'uso", 'description': 'Descrizione', 'buyPremium': '✨ Acquista Premium'},
    'ja': {'impressum': '奥付', 'datenschutz': 'プライバシーポリシー', 'termsOfUse': '利用規約', 'description': '説明', 'buyPremium': '✨ プレミアムを購入'},
    'kn': {'impressum': 'ಮುದ್ರಣ', 'datenschutz': 'ಗೌಪ್ಯತಾ ನೀತಿ', 'termsOfUse': 'ಬಳಕೆಯ ನಿಯಮಗಳು', 'description': 'ವಿವರಣೆ', 'buyPremium': '✨ ಪ್ರೀಮಿಯಂ ಖರೀದಿಸಿ'},
    'ko': {'impressum': '임프린트', 'datenschutz': '개인정보 보호정책', 'termsOfUse': '이용 약관', 'description': '설명', 'buyPremium': '✨ 프리미엄 구매'},
    'lt': {'impressum': 'Leidinio informacija', 'datenschutz': 'Privatumo politika', 'termsOfUse': 'Naudojimo sąlygos', 'description': 'Aprašymas', 'buyPremium': '✨ Pirkti Premium'},
    'lv': {'impressum': 'Impressums', 'datenschutz': 'Privātuma politika', 'termsOfUse': 'Lietošanas noteikumi', 'description': 'Apraksts', 'buyPremium': '✨ Pirkt Premium'},
    'ml': {'impressum': 'മുദ്ര', 'datenschutz': 'സ്വകാര്യതാ നയം', 'termsOfUse': 'ഉപയോഗ നിബന്ധനകൾ', 'description': 'വിവരണം', 'buyPremium': '✨ പ്രീമിയം വാങ്ങുക'},
    'mr': {'impressum': 'छाप', 'datenschutz': 'गोपनीयता धोरण', 'termsOfUse': 'वापर अटी', 'description': 'वर्णन', 'buyPremium': '✨ प्रीमियम खरेदी करा'},
    'ms': {'impressum': 'Cap Jari', 'datenschutz': 'Dasar Privasi', 'termsOfUse': 'Syarat Penggunaan', 'description': 'Penerangan', 'buyPremium': '✨ Beli Premium'},
    'nl': {'impressum': 'Impressum', 'datenschutz': 'Privacybeleid', 'termsOfUse': 'Gebruiksvoorwaarden', 'description': 'Beschrijving', 'buyPremium': '✨ Koop Premium'},
    'no': {'impressum': 'Kolofon', 'datenschutz': 'Personvernregler', 'termsOfUse': 'Bruksvilkår', 'description': 'Beskrivelse', 'buyPremium': '✨ Kjøp Premium'},
    'pa': {'impressum': 'ਛਾਪ', 'datenschutz': 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ', 'termsOfUse': 'ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ', 'description': 'ਵੇਰਵਾ', 'buyPremium': '✨ ਪ੍ਰੀਮੀਅਮ ਖਰੀਦੋ'},
    'pl': {'impressum': 'Impressum', 'datenschutz': 'Polityka prywatności', 'termsOfUse': 'Warunki użytkowania', 'description': 'Opis', 'buyPremium': '✨ Kup Premium'},
    'pt': {'impressum': 'Ficha técnica', 'datenschutz': 'Política de Privacidade', 'termsOfUse': 'Termos de Uso', 'description': 'Descrição', 'buyPremium': '✨ Comprar Premium'},
    'ro': {'impressum': 'Impressum', 'datenschutz': 'Politica de confidențialitate', 'termsOfUse': 'Termeni de utilizare', 'description': 'Descriere', 'buyPremium': '✨ Cumpără Premium'},
    'ru': {'impressum': 'Выходные данные', 'datenschutz': 'Политика конфиденциальности', 'termsOfUse': 'Условия использования', 'description': 'Описание', 'buyPremium': '✨ Купить Premium'},
    'sk': {'impressum': 'Impressum', 'datenschutz': 'Zásady ochrany osobných údajov', 'termsOfUse': 'Podmienky použitia', 'description': 'Popis', 'buyPremium': '✨ Kúpiť Premium'},
    'sl': {'impressum': 'Kolofon', 'datenschutz': 'Politika zasebnosti', 'termsOfUse': 'Pogoji uporabe', 'description': 'Opis', 'buyPremium': '✨ Kupi Premium'},
    'sr': {'impressum': 'Импресум', 'datenschutz': 'Политика приватности', 'termsOfUse': 'Услови коришћења', 'description': 'Опис', 'buyPremium': '✨ Купи Premium'},
    'sv': {'impressum': 'Impressum', 'datenschutz': 'Integritetspolicy', 'termsOfUse': 'Användarvillkor', 'description': 'Beskrivning', 'buyPremium': '✨ Köp Premium'},
    'sw': {'impressum': 'Chapa', 'datenschutz': 'Sera ya Faragha', 'termsOfUse': 'Masharti ya Matumizi', 'description': 'Maelezo', 'buyPremium': '✨ Nunua Premium'},
    'ta': {'impressum': 'முத்திரை', 'datenschutz': 'தனியுரிமைக் கொள்கை', 'termsOfUse': 'பயன்பாட்டு விதிமுறைகள்', 'description': 'விளக்கம்', 'buyPremium': '✨ பிரீமியம் வாங்கவும்'},
    'te': {'impressum': 'ముద్ర', 'datenschutz': 'గోప్యతా విధానం', 'termsOfUse': 'వినియోగ నిబంధనలు', 'description': 'వివరణ', 'buyPremium': '✨ ప్రీమియం కొనండి'},
    'th': {'impressum': 'ตราประทับ', 'datenschutz': 'นโยบายความเป็นส่วนตัว', 'termsOfUse': 'เงื่อนไขการใช้งาน', 'description': 'คำอธิบาย', 'buyPremium': '✨ ซื้อพรีเมียม'},
    'tr': {'impressum': 'Künye', 'datenschutz': 'Gizlilik Politikası', 'termsOfUse': 'Kullanım Koşulları', 'description': 'Açıklama', 'buyPremium': '✨ Premium Satın Al'},
    'uk': {'impressum': 'Імпресум', 'datenschutz': 'Політика конфіденційності', 'termsOfUse': 'Умови використання', 'description': 'Опис', 'buyPremium': '✨ Купити Premium'},
    'ur': {'impressum': 'نقش', 'datenschutz': 'رازداری کی پالیسی', 'termsOfUse': 'استعمال کی شرائط', 'description': 'تفصیل', 'buyPremium': '✨ پریمیم خریدیں'},
    'vi': {'impressum': 'Dấu ấn', 'datenschutz': 'Chính sách bảo mật', 'termsOfUse': 'Điều khoản sử dụng', 'description': 'Mô tả', 'buyPremium': '✨ Mua Premium'},
    'zh': {'impressum': '版本说明', 'datenschutz': '隐私政策', 'termsOfUse': '使用条款', 'description': '描述', 'buyPremium': '✨ 购买高级版'},
}

def fix_menu_translations():
    translations_dir = Path(__file__).parent / 'translations'
    
    for lang_code, menu_translations in MENU_TRANSLATIONS.items():
        file_path = translations_dir / f'{lang_code}.json'
        
        if not file_path.exists():
            print(f'⚠️  Skipping {lang_code}: File not found')
            continue
        
        try:
            # Read existing translations
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Update menu section
            if 'menu' not in data:
                data['menu'] = {}
            
            data['menu'] = menu_translations
            
            # Write back to file
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            print(f'✅ Updated {lang_code}.json')
        
        except Exception as e:
            print(f'❌ Error updating {lang_code}.json: {e}')

if __name__ == '__main__':
    fix_menu_translations()
    print('\n✨ Menu translations fixed!')
