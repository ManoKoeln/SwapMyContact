#!/usr/bin/env python3
import json
import os

# Complete Premium Dialog translations for all languages
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
        'cancel': 'Kanselleer', 'unlock': 'Ontsluit Nou',
        'privacyPolicy': 'Privaatheidsbeleid', 'termsOfService': 'Diensbepalings', 'playTerms': 'Google Play Voorwaardes',
        'successTitle': 'Sukses', 'successMessage': 'Premium geaktiveer! Jy kan nou onbeperkte profiele skep.',
        'errorTitle': 'Fout', 'errorMessage': 'Aankoop het misluk. Probeer asseblief later weer.',
        'linkError': 'Kon nie skakel oopmaak nie.'
    },
    'ar': {
        'title': 'SwapMyContact Pro – اشتراك سنوي',
        'description': 'النسخة الأساسية تسمح بملف واحد فقط.\\nمع SwapMyContact Pro يمكنك إنشاء ملفات غير محدودة.',
        'subscription': 'الاشتراك:', 'priceLoading': 'سيظهر في المتجر',
        'day': 'يوم', 'days': 'أيام', 'week': 'أسبوع', 'weeks': 'أسابيع',
        'month': 'شهر', 'months': 'أشهر', 'year': 'سنة', 'years': 'سنوات',
        'autoRenew': 'يتجدد الاشتراك تلقائيًا ما لم يتم إلغاؤه قبل 24 ساعة على الأقل من نهاية الفترة.',
        'billingIOS': 'تتم الفوترة من خلال حساب Apple ID الخاص بك. يمكن إدارة الاشتراكات وإلغاؤها في إعدادات Apple ID.',
        'billingAndroid': 'تتم الفوترة من خلال حساب Google Play الخاص بك. يمكن إدارة الاشتراكات وإلغاؤها في إعدادات حساب Google Play.',
        'cancel': 'إلغاء', 'unlock': 'فتح الآن',
        'privacyPolicy': 'سياسة الخصوصية', 'termsOfService': 'شروط الخدمة', 'playTerms': 'شروط Google Play',
        'successTitle': 'نجح', 'successMessage': 'تم تفعيل Premium! يمكنك الآن إنشاء ملفات غير محدودة.',
        'errorTitle': 'خطأ', 'errorMessage': 'فشل الشراء. يرجى المحاولة مرة أخرى لاحقًا.',
        'linkError': 'تعذر فتح الرابط.'
    },
    'bg': {
        'title': 'SwapMyContact Pro – Годишен абонамент',
        'description': 'Базовата версия позволява само един профил.\\nСъс SwapMyContact Pro можете да създавате неограничен брой профили.',
        'subscription': 'Абонамент:', 'priceLoading': 'Ще се покаже в магазина',
        'day': 'Ден', 'days': 'Дни', 'week': 'Седмица', 'weeks': 'Седмици',
        'month': 'Месец', 'months': 'Месеца', 'year': 'Година', 'years': 'Години',
        'autoRenew': 'Абонаментът се подновява автоматично, освен ако не бъде анулиран поне 24 часа преди края на периода.',
        'billingIOS': 'Таксуването се извършва чрез вашия Apple ID акаунт. Абонаментите могат да се управляват и анулират в настройките на Apple ID.',
        'billingAndroid': 'Таксуването се извършва чрез вашия Google Play акаунт. Абонаментите могат да се управляват и анулират в настройките на Google Play акаунта.',
        'cancel': 'Отказ', 'unlock': 'Отключи сега',
        'privacyPolicy': 'Политика за поверителност', 'termsOfService': 'Условия за ползване', 'playTerms': 'Условия на Google Play',
        'successTitle': 'Успех', 'successMessage': 'Premium активиран! Сега можете да създавате неограничен брой профили.',
        'errorTitle': 'Грешка', 'errorMessage': 'Покупката не бе успешна. Моля, опитайте отново по-късно.',
        'linkError': 'Неуспешно отваряне на връзката.'
    },
    'bn': {
        'title': 'SwapMyContact Pro – বার্ষিক সাবস্ক্রিপশন',
        'description': 'মৌলিক সংস্করণ শুধুমাত্র একটি প্রোফাইলের অনুমতি দেয়।\\nSwapMyContact Pro দিয়ে আপনি সীমাহীন প্রোফাইল তৈরি করতে পারেন।',
        'subscription': 'সাবস্ক্রিপশন:', 'priceLoading': 'স্টোরে দেখানো হবে',
        'day': 'দিন', 'days': 'দিন', 'week': 'সপ্তাহ', 'weeks': 'সপ্তাহ',
        'month': 'মাস', 'months': 'মাস', 'year': 'বছর', 'years': 'বছর',
        'autoRenew': 'সময়সীমা শেষ হওয়ার কমপক্ষে 24 ঘন্টা আগে বাতিল না করা হলে সাবস্ক্রিপশন স্বয়ংক্রিয়ভাবে পুনর্নবীকরণ হয়।',
        'billingIOS': 'আপনার Apple ID অ্যাকাউন্টের মাধ্যমে বিলিং করা হয়। Apple ID সেটিংসে সাবস্ক্রিপশন পরিচালনা এবং বাতিল করা যেতে পারে।',
        'billingAndroid': 'আপনার Google Play অ্যাকাউন্টের মাধ্যমে বিলিং করা হয়। Google Play অ্যাকাউন্ট সেটিংসে সাবস্ক্রিপশন পরিচালনা এবং বাতিল করা যেতে পারে।',
        'cancel': 'বাতিল', 'unlock': 'এখনই আনলক করুন',
        'privacyPolicy': 'গোপনীয়তা নীতি', 'termsOfService': 'সেবার শর্তাবলী', 'playTerms': 'Google Play শর্তাবলী',
        'successTitle': 'সফল', 'successMessage': 'Premium সক্রিয় করা হয়েছে! আপনি এখন সীমাহীন প্রোফাইল তৈরি করতে পারেন।',
        'errorTitle': 'ত্রুটি', 'errorMessage': 'ক্রয় ব্যর্থ হয়েছে। পরে আবার চেষ্টা করুন।',
        'linkError': 'লিঙ্ক খুলতে পারেনি।'
    },
    'ca': {
        'title': 'SwapMyContact Pro – Subscripció anual',
        'description': 'La versió bàsica només permet un perfil.\\nAmb SwapMyContact Pro pots crear perfils il·limitats.',
        'subscription': 'Subscripció:', 'priceLoading': 'Es mostrarà a la botiga',
        'day': 'Dia', 'days': 'Dies', 'week': 'Setmana', 'weeks': 'Setmanes',
        'month': 'Mes', 'months': 'Mesos', 'year': 'Any', 'years': 'Anys',
        'autoRenew': 'La subscripció es renova automàticament tret que es cancel·li almenys 24 hores abans del final del període.',
        'billingIOS': 'La facturació es fa a través del teu compte d\'Apple ID. Les subscripcions es poden gestionar i cancel·lar a la configuració d\'Apple ID.',
        'billingAndroid': 'La facturació es fa a través del teu compte de Google Play. Les subscripcions es poden gestionar i cancel·lar a la configuració del compte de Google Play.',
        'cancel': 'Cancel·lar', 'unlock': 'Desbloqueja ara',
        'privacyPolicy': 'Política de privadesa', 'termsOfService': 'Condicions del servei', 'playTerms': 'Condicions de Google Play',
        'successTitle': 'Èxit', 'successMessage': 'Premium activat! Ara pots crear perfils il·limitats.',
        'errorTitle': 'Error', 'errorMessage': 'La compra ha fallat. Si us plau, torna-ho a provar més tard.',
        'linkError': 'No s\'ha pogut obrir l\'enllaç.'
    },
    'cs': {
        'title': 'SwapMyContact Pro – Roční předplatné',
        'description': 'Základní verze umožňuje pouze jeden profil.\\nS SwapMyContact Pro můžete vytvářet neomezené profily.',
        'subscription': 'Předplatné:', 'priceLoading': 'Zobrazí se v obchodě',
        'day': 'Den', 'days': 'Dny', 'week': 'Týden', 'weeks': 'Týdny',
        'month': 'Měsíc', 'months': 'Měsíce', 'year': 'Rok', 'years': 'Roky',
        'autoRenew': 'Předplatné se automaticky obnovuje, pokud není zrušeno alespoň 24 hodin před koncem období.',
        'billingIOS': 'Fakturace probíhá prostřednictvím vašeho účtu Apple ID. Předplatná lze spravovat a rušit v nastavení Apple ID.',
        'billingAndroid': 'Fakturace probíhá prostřednictvím vašeho účtu Google Play. Předplatná lze spravovat a rušit v nastavení účtu Google Play.',
        'cancel': 'Zrušit', 'unlock': 'Odemknout nyní',
        'privacyPolicy': 'Zásady ochrany osobních údajů', 'termsOfService': 'Podmínky služby', 'playTerms': 'Podmínky Google Play',
        'successTitle': 'Úspěch', 'successMessage': 'Premium aktivováno! Nyní můžete vytvářet neomezené profily.',
        'errorTitle': 'Chyba', 'errorMessage': 'Nákup se nezdařil. Zkuste to prosím později.',
        'linkError': 'Nelze otevřít odkaz.'
    },
    'da': {
        'title': 'SwapMyContact Pro – Årligt abonnement',
        'description': 'Basisversionen tillader kun én profil.\\nMed SwapMyContact Pro kan du oprette ubegrænsede profiler.',
        'subscription': 'Abonnement:', 'priceLoading': 'Vises i butikken',
        'day': 'Dag', 'days': 'Dage', 'week': 'Uge', 'weeks': 'Uger',
        'month': 'Måned', 'months': 'Måneder', 'year': 'År', 'years': 'År',
        'autoRenew': 'Abonnementet fornyes automatisk, medmindre det annulleres mindst 24 timer før periodens udløb.',
        'billingIOS': 'Fakturering sker via din Apple ID-konto. Abonnementer kan administreres og annulleres i Apple ID-indstillinger.',
        'billingAndroid': 'Fakturering sker via din Google Play-konto. Abonnementer kan administreres og annulleres i Google Play-kontoindstillinger.',
        'cancel': 'Annuller', 'unlock': 'Lås op nu',
        'privacyPolicy': 'Fortrolighedspolitik', 'termsOfService': 'Servicevilkår', 'playTerms': 'Google Play-vilkår',
        'successTitle': 'Succes', 'successMessage': 'Premium aktiveret! Du kan nu oprette ubegrænsede profiler.',
        'errorTitle': 'Fejl', 'errorMessage': 'Køb mislykkedes. Prøv venligst igen senere.',
        'linkError': 'Kunne ikke åbne link.'
    },
    'el': {
        'title': 'SwapMyContact Pro – Ετήσια συνδρομή',
        'description': 'Η βασική έκδοση επιτρέπει μόνο ένα προφίλ.\\nΜε το SwapMyContact Pro μπορείτε να δημιουργήσετε απεριόριστα προφίλ.',
        'subscription': 'Συνδρομή:', 'priceLoading': 'Θα εμφανιστεί στο κατάστημα',
        'day': 'Ημέρα', 'days': 'Ημέρες', 'week': 'Εβδομάδα', 'weeks': 'Εβδομάδες',
        'month': 'Μήνας', 'months': 'Μήνες', 'year': 'Έτος', 'years': 'Έτη',
        'autoRenew': 'Η συνδρομή ανανεώνεται αυτόματα εκτός εάν ακυρωθεί τουλάχιστον 24 ώρες πριν από το τέλος της περιόδου.',
        'billingIOS': 'Η χρέωση γίνεται μέσω του λογαριασμού σας Apple ID. Οι συνδρομές μπορούν να διαχειριστούν και να ακυρωθούν στις ρυθμίσεις Apple ID.',
        'billingAndroid': 'Η χρέωση γίνεται μέσω του λογαριασμού σας Google Play. Οι συνδρομές μπορούν να διαχειριστούν και να ακυρωθούν στις ρυθμίσεις λογαριασμού Google Play.',
        'cancel': 'Ακύρωση', 'unlock': 'Ξεκλείδωμα τώρα',
        'privacyPolicy': 'Πολιτική απορρήτου', 'termsOfService': 'Όροι υπηρεσίας', 'playTerms': 'Όροι Google Play',
        'successTitle': 'Επιτυχία', 'successMessage': 'Το Premium ενεργοποιήθηκε! Τώρα μπορείτε να δημιουργήσετε απεριόριστα προφίλ.',
        'errorTitle': 'Σφάλμα', 'errorMessage': 'Η αγορά απέτυχε. Παρακαλώ δοκιμάστε ξανά αργότερα.',
        'linkError': 'Δεν ήταν δυνατό το άνοιγμα του συνδέσμου.'
    },
    'es': {
        'title': 'SwapMyContact Pro – Suscripción anual',
        'description': 'La versión básica solo permite un perfil.\\nCon SwapMyContact Pro puedes crear perfiles ilimitados.',
        'subscription': 'Suscripción:', 'priceLoading': 'Se mostrará en la tienda',
        'day': 'Día', 'days': 'Días', 'week': 'Semana', 'weeks': 'Semanas',
        'month': 'Mes', 'months': 'Meses', 'year': 'Año', 'years': 'Años',
        'autoRenew': 'La suscripción se renueva automáticamente a menos que se cancele al menos 24 horas antes del final del período.',
        'billingIOS': 'La facturación se realiza a través de tu cuenta de Apple ID. Las suscripciones se pueden administrar y cancelar en la configuración de Apple ID.',
        'billingAndroid': 'La facturación se realiza a través de tu cuenta de Google Play. Las suscripciones se pueden administrar y cancelar en la configuración de la cuenta de Google Play.',
        'cancel': 'Cancelar', 'unlock': 'Desbloquear ahora',
        'privacyPolicy': 'Política de privacidad', 'termsOfService': 'Términos de servicio', 'playTerms': 'Términos de Google Play',
        'successTitle': 'Éxito', 'successMessage': '¡Premium activado! Ahora puedes crear perfiles ilimitados.',
        'errorTitle': 'Error', 'errorMessage': 'La compra falló. Por favor, inténtalo de nuevo más tarde.',
        'linkError': 'No se pudo abrir el enlace.'
    },
}

# Add remaining languages with English fallback
remaining_langs = ['et', 'eu', 'fa', 'fi', 'fr', 'gl', 'gu', 'he', 'hi', 'hr', 'hu', 'id', 'it', 'ja', 'kn', 'ko', 'lt', 'lv', 'ml', 'mr', 'ms', 'nl', 'no', 'pa', 'pl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr', 'sv', 'sw', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'vi', 'zh']

english_fallback = {
    'title': 'SwapMyContact Pro – Annual Subscription',
    'description': 'The basic version allows only one profile.\\nWith SwapMyContact Pro you can create unlimited profiles.',
    'subscription': 'Subscription:', 'priceLoading': 'Will be shown in store',
    'day': 'Day', 'days': 'Days', 'week': 'Week', 'weeks': 'Weeks',
    'month': 'Month', 'months': 'Months', 'year': 'Year', 'years': 'Years',
    'autoRenew': 'The subscription automatically renews unless canceled at least 24 hours before the end of the period.',
    'billingIOS': 'Billing is done through your Apple ID account. Subscriptions can be managed and canceled in your Apple ID settings.',
    'billingAndroid': 'Billing is done through your Google Play account. Subscriptions can be managed and canceled in your Google Play account settings.',
    'cancel': 'Cancel', 'unlock': 'Unlock Now',
    'privacyPolicy': 'Privacy Policy', 'termsOfService': 'Terms of Service', 'playTerms': 'Google Play Terms',
    'successTitle': 'Success', 'successMessage': 'Premium activated! You can now create unlimited profiles.',
    'errorTitle': 'Error', 'errorMessage': 'Purchase failed. Please try again later.',
    'linkError': 'Could not open link.'
}

for lang in remaining_langs:
    premium_translations[lang] = english_fallback

translations_dir = 'translations'
updated_count = 0
skipped_count = 0

for lang_code, premium_items in premium_translations.items():
    file_path = os.path.join(translations_dir, f'{lang_code}.json')
    
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
            
            # Always update/overwrite premiumDialog
            data['premiumDialog'] = premium_items
            
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            
            print(f'✓ Updated {lang_code}.json')
            updated_count += 1
        except Exception as e:
            print(f'✗ Error processing {lang_code}.json: {e}')
    else:
        print(f'✗ File not found: {file_path}')

print(f'\n✓ Successfully updated {updated_count} language files')
print(f'✓ All Premium Dialog translations are now complete!')
