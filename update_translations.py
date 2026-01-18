#!/usr/bin/env python3
import json
import os

# Translation mapping for menu items in different languages
menu_translations = {
    'af': {'impressum': 'Indruk', 'datenschutz': 'Privaatheidsbeleid', 'termsOfUse': 'Gebruiksvoorwaardes', 'description': 'Beskrywing', 'buyPremium': 'Koop Premium'},
    'ar': {'impressum': 'البيانات', 'datenschutz': 'سياسة الخصوصية', 'termsOfUse': 'شروط الاستخدام', 'description': 'الوصف', 'buyPremium': 'شراء بريميوم'},
    'bg': {'impressum': 'Импресум', 'datenschutz': 'Поверителност', 'termsOfUse': 'Условия за ползване', 'description': 'Описание', 'buyPremium': 'Купи Premium'},
    'bn': {'impressum': 'ইমপ্রিন্ট', 'datenschutz': 'গোপনীয়তা নীতি', 'termsOfUse': 'ব্যবহারের শর্তাবলী', 'description': 'বর্ণনা', 'buyPremium': 'প্রিমিয়াম কিনুন'},
    'ca': {'impressum': 'Empremta', 'datenschutz': 'Privadesa', 'termsOfUse': 'Condicions d\'ús', 'description': 'Descripció', 'buyPremium': 'Comprar Premium'},
    'cs': {'impressum': 'Otisk', 'datenschutz': 'Ochrana osobních údajů', 'termsOfUse': 'Podmínky použití', 'description': 'Popis', 'buyPremium': 'Koupit Premium'},
    'da': {'impressum': 'Kolofon', 'datenschutz': 'Fortrolighedspolitik', 'termsOfUse': 'Vilkår for brug', 'description': 'Beskrivelse', 'buyPremium': 'Køb Premium'},
    'el': {'impressum': 'Στοιχεία', 'datenschutz': 'Πολιτική απορρήτου', 'termsOfUse': 'Όροι χρήσης', 'description': 'Περιγραφή', 'buyPremium': 'Αγορά Premium'},
    'es': {'impressum': 'Aviso legal', 'datenschutz': 'Privacidad', 'termsOfUse': 'Términos de uso', 'description': 'Descripción', 'buyPremium': 'Comprar Premium'},
    'et': {'impressum': 'Tiitellehekülg', 'datenschutz': 'Privaatsuspoliitika', 'termsOfUse': 'Kasutustingimused', 'description': 'Kirjeldus', 'buyPremium': 'Osta Premium'},
    'eu': {'impressum': 'Inprimakia', 'datenschutz': 'Pribatutasuna', 'termsOfUse': 'Erabilera baldintzak', 'description': 'Deskribapena', 'buyPremium': 'Erosi Premium'},
    'fa': {'impressum': 'اطلاعات', 'datenschutz': 'حریم خصوصی', 'termsOfUse': 'شرایط استفاده', 'description': 'توضیحات', 'buyPremium': 'خرید پریمیوم'},
    'fi': {'impressum': 'Tekijätiedot', 'datenschutz': 'Tietosuoja', 'termsOfUse': 'Käyttöehdot', 'description': 'Kuvaus', 'buyPremium': 'Osta Premium'},
    'fr': {'impressum': 'Mentions légales', 'datenschutz': 'Confidentialité', 'termsOfUse': 'Conditions d\'utilisation', 'description': 'Description', 'buyPremium': 'Acheter Premium'},
    'gl': {'impressum': 'Imprenta', 'datenschutz': 'Privacidade', 'termsOfUse': 'Condicións de uso', 'description': 'Descrición', 'buyPremium': 'Comprar Premium'},
    'gu': {'impressum': 'છાપ', 'datenschutz': 'ગોપનીયતા નીતિ', 'termsOfUse': 'ઉપયોગની શરતો', 'description': 'વર્ણન', 'buyPremium': 'પ્રીમિયમ ખરીદો'},
    'he': {'impressum': 'פרטים', 'datenschutz': 'מדיניות פרטיות', 'termsOfUse': 'תנאי שימוש', 'description': 'תיאור', 'buyPremium': 'קנה פרימיום'},
    'hi': {'impressum': 'छाप', 'datenschutz': 'गोपनीयता नीति', 'termsOfUse': 'उपयोग की शर्तें', 'description': 'विवरण', 'buyPremium': 'प्रीमियम खरीदें'},
    'hr': {'impressum': 'Otisak', 'datenschutz': 'Privatnost', 'termsOfUse': 'Uvjeti korištenja', 'description': 'Opis', 'buyPremium': 'Kupi Premium'},
    'hu': {'impressum': 'Impresszum', 'datenschutz': 'Adatvédelem', 'termsOfUse': 'Felhasználási feltételek', 'description': 'Leírás', 'buyPremium': 'Premium vásárlás'},
    'id': {'impressum': 'Jejak', 'datenschutz': 'Kebijakan Privasi', 'termsOfUse': 'Ketentuan Penggunaan', 'description': 'Deskripsi', 'buyPremium': 'Beli Premium'},
    'it': {'impressum': 'Colophon', 'datenschutz': 'Privacy', 'termsOfUse': 'Termini d\'uso', 'description': 'Descrizione', 'buyPremium': 'Acquista Premium'},
    'ja': {'impressum': 'インプリント', 'datenschutz': 'プライバシーポリシー', 'termsOfUse': '利用規約', 'description': '説明', 'buyPremium': 'プレミアムを購入'},
    'kn': {'impressum': 'ಮುದ್ರೆ', 'datenschutz': 'ಗೌಪ್ಯತಾ ನೀತಿ', 'termsOfUse': 'ಬಳಕೆಯ ನಿಯಮಗಳು', 'description': 'ವಿವರಣೆ', 'buyPremium': 'ಪ್ರೀಮಿಯಂ ಖರೀದಿಸಿ'},
    'ko': {'impressum': '각인', 'datenschutz': '개인정보 보호정책', 'termsOfUse': '이용약관', 'description': '설명', 'buyPremium': '프리미엄 구매'},
    'lt': {'impressum': 'Spauda', 'datenschutz': 'Privatumo politika', 'termsOfUse': 'Naudojimo sąlygos', 'description': 'Aprašymas', 'buyPremium': 'Pirkti Premium'},
    'lv': {'impressum': 'Nospiedums', 'datenschutz': 'Privātuma politika', 'termsOfUse': 'Lietošanas noteikumi', 'description': 'Apraksts', 'buyPremium': 'Pirkt Premium'},
    'ml': {'impressum': 'മുദ്ര', 'datenschutz': 'സ്വകാര്യതാ നയം', 'termsOfUse': 'ഉപയോഗ നിബന്ധനകൾ', 'description': 'വിവരണം', 'buyPremium': 'പ്രീമിയം വാങ്ങുക'},
    'mr': {'impressum': 'छाप', 'datenschutz': 'गोपनीयता धोरण', 'termsOfUse': 'वापर अटी', 'description': 'वर्णन', 'buyPremium': 'प्रीमियम खरेदी करा'},
    'ms': {'impressum': 'Jejak', 'datenschutz': 'Dasar Privasi', 'termsOfUse': 'Syarat Penggunaan', 'description': 'Penerangan', 'buyPremium': 'Beli Premium'},
    'nl': {'impressum': 'Impressum', 'datenschutz': 'Privacybeleid', 'termsOfUse': 'Gebruiksvoorwaarden', 'description': 'Beschrijving', 'buyPremium': 'Koop Premium'},
    'no': {'impressum': 'Kolofon', 'datenschutz': 'Personvern', 'termsOfUse': 'Bruksvilkår', 'description': 'Beskrivelse', 'buyPremium': 'Kjøp Premium'},
    'pa': {'impressum': 'ਛਾਪ', 'datenschutz': 'ਗੋਪਨੀਯਤਾ ਨੀਤੀ', 'termsOfUse': 'ਵਰਤੋਂ ਦੀਆਂ ਸ਼ਰਤਾਂ', 'description': 'ਵੇਰਵਾ', 'buyPremium': 'ਪ੍ਰੀਮੀਅਮ ਖਰੀਦੋ'},
    'pl': {'impressum': 'Stopka', 'datenschutz': 'Prywatność', 'termsOfUse': 'Warunki użytkowania', 'description': 'Opis', 'buyPremium': 'Kup Premium'},
    'pt': {'impressum': 'Impressão', 'datenschutz': 'Privacidade', 'termsOfUse': 'Termos de uso', 'description': 'Descrição', 'buyPremium': 'Comprar Premium'},
    'ro': {'impressum': 'Amprentă', 'datenschutz': 'Confidențialitate', 'termsOfUse': 'Termeni de utilizare', 'description': 'Descriere', 'buyPremium': 'Cumpără Premium'},
    'ru': {'impressum': 'Выходные данные', 'datenschutz': 'Конфиденциальность', 'termsOfUse': 'Условия использования', 'description': 'Описание', 'buyPremium': 'Купить Premium'},
    'sk': {'impressum': 'Otlačok', 'datenschutz': 'Ochrana osobných údajov', 'termsOfUse': 'Podmienky používania', 'description': 'Popis', 'buyPremium': 'Kúpiť Premium'},
    'sl': {'impressum': 'Odtis', 'datenschutz': 'Zasebnost', 'termsOfUse': 'Pogoji uporabe', 'description': 'Opis', 'buyPremium': 'Kupi Premium'},
    'sr': {'impressum': 'Отисак', 'datenschutz': 'Приватност', 'termsOfUse': 'Услови коришћења', 'description': 'Опис', 'buyPremium': 'Купи Premium'},
    'sv': {'impressum': 'Kolofon', 'datenschutz': 'Integritetspolicy', 'termsOfUse': 'Användarvillkor', 'description': 'Beskrivning', 'buyPremium': 'Köp Premium'},
    'sw': {'impressum': 'Alama', 'datenschutz': 'Sera ya Faragha', 'termsOfUse': 'Masharti ya Matumizi', 'description': 'Maelezo', 'buyPremium': 'Nunua Premium'},
    'ta': {'impressum': 'முத்திரை', 'datenschutz': 'தனியுரிமைக் கொள்கை', 'termsOfUse': 'பயன்பாட்டு விதிமுறைகள்', 'description': 'விளக்கம்', 'buyPremium': 'பிரீமியம் வாங்கவும்'},
    'te': {'impressum': 'ముద్ర', 'datenschutz': 'గోప్యతా విధానం', 'termsOfUse': 'వినియోగ నిబంధనలు', 'description': 'వివరణ', 'buyPremium': 'ప్రీమియం కొనండి'},
    'th': {'impressum': 'ประทับตรา', 'datenschutz': 'นโยบายความเป็นส่วนตัว', 'termsOfUse': 'เงื่อนไขการใช้งาน', 'description': 'คำอธิบาย', 'buyPremium': 'ซื้อพรีเมียม'},
    'tr': {'impressum': 'Künye', 'datenschutz': 'Gizlilik', 'termsOfUse': 'Kullanım Koşulları', 'description': 'Açıklama', 'buyPremium': 'Premium Satın Al'},
    'uk': {'impressum': 'Імпресум', 'datenschutz': 'Конфіденційність', 'termsOfUse': 'Умови використання', 'description': 'Опис', 'buyPremium': 'Купити Premium'},
    'ur': {'impressum': 'نقش', 'datenschutz': 'رازداری کی پالیسی', 'termsOfUse': 'استعمال کی شرائط', 'description': 'تفصیل', 'buyPremium': 'پریمیم خریدیں'},
    'vi': {'impressum': 'Dấu ấn', 'datenschutz': 'Chính sách bảo mật', 'termsOfUse': 'Điều khoản sử dụng', 'description': 'Mô tả', 'buyPremium': 'Mua Premium'},
    'zh': {'impressum': '版本说明', 'datenschutz': '隐私政策', 'termsOfUse': '使用条款', 'description': '描述', 'buyPremium': '购买高级版'},
}

translations_dir = 'translations'

# Process each language file
for lang_code, menu_items in menu_translations.items():
    file_path = os.path.join(translations_dir, f'{lang_code}.json')
    
    if os.path.exists(file_path):
        try:
            # Read existing translation file
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Add menu section if it doesn't exist
            if 'menu' not in data:
                data['menu'] = menu_items
                
                # Write back to file
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                print(f'Updated {lang_code}.json')
            else:
                print(f'Skipped {lang_code}.json (menu already exists)')
        except Exception as e:
            print(f'Error processing {lang_code}.json: {e}')
    else:
        print(f'File not found: {file_path}')

print('\nDone!')
