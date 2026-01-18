#!/usr/bin/env python3
import json
import os

# Premium Dialog translations for all languages
premium_translations = {
    'af': {
        'title': 'SwapMyContact Pro – Jaarlikse Intekening',
        'description': 'Die basisweergawe laat slegs een profiel toe.\\nMet SwapMyContact Pro kan jy onbeperkte profiele skep.',
        'subscription': 'Intekening:',
        'priceLoading': 'Sal in winkel gewys word',
        'day': 'Dag', 'days': 'Dae',
        'week': 'Week', 'weeks': 'Weke',
        'month': 'Maand', 'months': 'Maande',
        'year': 'Jaar', 'years': 'Jare',
        'autoRenew': 'Die intekening hernuwe outomaties tensy dit ten minste 24 uur voor die einde gekanselleer word.',
        'billingIOS': 'Fakturering geskied deur jou Apple-ID-rekening. Intekeninge kan in jou Apple-ID-instellings bestuur en gekanselleer word.',
        'billingAndroid': 'Fakturering geskied deur jou Google Play-rekening. Intekeninge kan in jou Google Play-rekeninginstellings bestuur en gekanselleer word.',
        'cancel': 'Kanselleer',
        'unlock': 'Ontsluit Nou',
        'privacyPolicy': 'Privaatheidsbeleid',
        'termsOfService': 'Diensbepalings',
        'playTerms': 'Google Play Voorwaardes',
        'successTitle': 'Sukses',
        'successMessage': 'Premium geaktiveer! Jy kan nou onbeperkte profiele skep.',
        'errorTitle': 'Fout',
        'errorMessage': 'Aankoop het misluk. Probeer asseblief later weer.',
        'linkError': 'Kon nie skakel oopmaak nie.'
    },
    'ar': {
        'title': 'SwapMyContact Pro – اشتراك سنوي',
        'description': 'النسخة الأساسية تسمح بملف واحد فقط.\\nمع SwapMyContact Pro يمكنك إنشاء ملفات غير محدودة.',
        'subscription': 'الاشتراك:',
        'priceLoading': 'سيظهر في المتجر',
        'day': 'يوم', 'days': 'أيام',
        'week': 'أسبوع', 'weeks': 'أسابيع',
        'month': 'شهر', 'months': 'أشهر',
        'year': 'سنة', 'years': 'سنوات',
        'autoRenew': 'يتجدد الاشتراك تلقائيًا ما لم يتم إلغاؤه قبل 24 ساعة على الأقل من نهاية الفترة.',
        'billingIOS': 'تتم الفوترة من خلال حساب Apple ID الخاص بك. يمكن إدارة الاشتراكات وإلغاؤها في إعدادات Apple ID.',
        'billingAndroid': 'تتم الفوترة من خلال حساب Google Play الخاص بك. يمكن إدارة الاشتراكات وإلغاؤها في إعدادات حساب Google Play.',
        'cancel': 'إلغاء',
        'unlock': 'فتح الآن',
        'privacyPolicy': 'سياسة الخصوصية',
        'termsOfService': 'شروط الخدمة',
        'playTerms': 'شروط Google Play',
        'successTitle': 'نجح',
        'successMessage': 'تم تفعيل Premium! يمكنك الآن إنشاء ملفات غير محدودة.',
        'errorTitle': 'خطأ',
        'errorMessage': 'فشل الشراء. يرجى المحاولة مرة أخرى لاحقًا.',
        'linkError': 'تعذر فتح الرابط.'
    },
    'bg': {
        'title': 'SwapMyContact Pro – Годишен абонамент',
        'description': 'Базовата версия позволява само един профил.\\nСъс SwapMyContact Pro можете да създавате неограничен брой профили.',
        'subscription': 'Абонамент:',
        'priceLoading': 'Ще се покаже в магазина',
        'day': 'Ден', 'days': 'Дни',
        'week': 'Седмица', 'weeks': 'Седмици',
        'month': 'Месец', 'months': 'Месеца',
        'year': 'Година', 'years': 'Години',
        'autoRenew': 'Абонаментът се подновява автоматично, освен ако не бъде анулиран поне 24 часа преди края на периода.',
        'billingIOS': 'Таксуването се извършва чрез вашия Apple ID акаунт. Абонаментите могат да се управляват и анулират в настройките на Apple ID.',
        'billingAndroid': 'Таксуването се извършва чрез вашия Google Play акаунт. Абонаментите могат да се управляват и анулират в настройките на Google Play акаунта.',
        'cancel': 'Отказ',
        'unlock': 'Отключи сега',
        'privacyPolicy': 'Политика за поверителност',
        'termsOfService': 'Условия за ползване',
        'playTerms': 'Условия на Google Play',
        'successTitle': 'Успех',
        'successMessage': 'Premium активиран! Сега можете да създавате неограничен брой профили.',
        'errorTitle': 'Грешка',
        'errorMessage': 'Покупката не бе успешна. Моля, опитайте отново по-късно.',
        'linkError': 'Неуспешно отваряне на връзката.'
    },
}

# Add translations for all other languages with English as fallback
all_languages = ['bn', 'ca', 'cs', 'da', 'el', 'es', 'et', 'eu', 'fa', 'fi', 'fr', 'gl', 'gu', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'kn', 'ko', 'lt', 'lv', 'ml', 'mr', 'ms', 'nl', 'no', 'pa', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'sw', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'vi', 'zh']

for lang in all_languages:
    if lang not in premium_translations:
        # Use English translations as fallback
        premium_translations[lang] = {
            'title': 'SwapMyContact Pro – Annual Subscription',
            'description': 'The basic version allows only one profile.\\nWith SwapMyContact Pro you can create unlimited profiles.',
            'subscription': 'Subscription:',
            'priceLoading': 'Will be shown in store',
            'day': 'Day', 'days': 'Days',
            'week': 'Week', 'weeks': 'Weeks',
            'month': 'Month', 'months': 'Months',
            'year': 'Year', 'years': 'Years',
            'autoRenew': 'The subscription automatically renews unless canceled at least 24 hours before the end of the period.',
            'billingIOS': 'Billing is done through your Apple ID account. Subscriptions can be managed and canceled in your Apple ID settings.',
            'billingAndroid': 'Billing is done through your Google Play account. Subscriptions can be managed and canceled in your Google Play account settings.',
            'cancel': 'Cancel',
            'unlock': 'Unlock Now',
            'privacyPolicy': 'Privacy Policy',
            'termsOfService': 'Terms of Service',
            'playTerms': 'Google Play Terms',
            'successTitle': 'Success',
            'successMessage': 'Premium activated! You can now create unlimited profiles.',
            'errorTitle': 'Error',
            'errorMessage': 'Purchase failed. Please try again later.',
            'linkError': 'Could not open link.'
        }

translations_dir = 'translations'

# Process each language file
for lang_code, premium_items in premium_translations.items():
    file_path = os.path.join(translations_dir, f'{lang_code}.json')
    
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            if 'premiumDialog' not in data:
                data['premiumDialog'] = premium_items
                
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                
                print(f'Updated {lang_code}.json')
            else:
                print(f'Skipped {lang_code}.json (premiumDialog already exists)')
        except Exception as e:
            print(f'Error processing {lang_code}.json: {e}')
    else:
        print(f'File not found: {file_path}')

print('\nDone!')
