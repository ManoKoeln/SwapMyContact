Versionsverwaltung

VERSION 0.2.4 BUILD 54
LinkedIn Button eingebaut um Profildaten von LinedIn zu holen
Wie es funktioniert:

App startet → Prüft LinkedIn-Installation
Wenn installiert → Button "Daten von LinkedIn" wird angezeigt
User klickt Button → Kontakt-Berechtigung wird angefragt
Kontakte werden gelesen → LinkedIn-Daten gesucht
Neues Profil wird erstellt mit allen Daten
EditProfile-Screen öffnet sich automatisch

---------------------------------------------------------------
BUILD 55

Was wurde umgesetzt:

✅ Nicht-Premium-Nutzer können ihr bestehendes Profil überschreiben (nach Bestätigung)
✅ Bestätigungsdialog: "Profil überschreiben?" mit Warnung vor Datenverlust
✅ UPDATE SQL für bestehende Profile vs. INSERT für neue Profile
✅ Premium-Nutzer erstellen weiterhin neue Profile ("LinkedIn Daten 1", "LinkedIn Daten 2", etc.)
✅ Übersetzungen in allen 52 Sprachen aktualisiert
---------------------------------------------------------------
BUILD 56

Was wurde umgesetzt:
Drei Plattformen werden erkannt:

LinkedIn (blauer Button - #0077B5)
XING (petrol Button - #006567)
WhatsApp Business (grüner Button - #25D366)
Intelligente App-Erkennung:

iOS: URL-Schemes (linkedin://, xing://, whatsapp-business://)
Android: Gleiche URL-Schemes
Buttons erscheinen nur, wenn die jeweilige App installiert ist
Plattform-spezifische Datensuche:

LinkedIn: Sucht nach LinkedIn-URLs oder Namen/Firma mit "LinkedIn"
XING: Sucht nach XING-URLs oder Namen/Firma mit "XING"
WhatsApp Business: Sucht nach Kontakten mit Firma (Business-Kontakte)
Erweiterte URL-Extraktion:

LinkedIn-URLs werden im linkedin-Feld gespeichert
XING-URLs werden im neuen xing-Feld gespeichert
Andere URLs werden als website gespeichert
Dynamische Profilnamen:

"LinkedIn Daten", "LinkedIn Daten 1", "LinkedIn Daten 2"
"XING Daten", "XING Daten 1", "XING Daten 2"
"WhatsApp Business Daten", "WhatsApp Business Daten 1"
Übersetzungen in 52 Sprachen:

importFromXing
importFromWhatsAppBusiness
Platzhalter {source} in Meldungen ersetzt durch jeweilige Plattform

