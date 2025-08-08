# TrackRed

**TrackRed** ist eine moderne Webanwendung zur digitalen Verwaltung persönlicher Blutwerte.  
Nutzer:innen können Blutabnahmen erfassen, Werte in verschiedenen Einheiten speichern, automatisch vergleichen und den Verlauf übersichtlich darstellen.

## Funktionen
- Erfassung von Blutabnahmen mit Datum, Arzt, Ort und Notizen
- Eingabe mehrerer Blutwerte inkl. Umrechnung in alternative Einheiten
- Übersicht aller bisherigen Untersuchungen
- Detaillierte Werteseite mit Referenzbereichen und Verlaufsgrafik
- Sicheres Login-System mit Token-Authentifizierung 

## Technologien
- **Frontend**: React, TypeScript, Vite, Sass
- **Backend**: Laravel, PHP
- **API-Kommunikation**: RESTful JSON API
- **Datenbank**: MySQL über XAMPP
- **Testing**: Vitest, Playwright 

## Projektstruktur
TrackRed/
├── trackred-frontend/   
└── trackred-backend/

## Lokale Installation
1. Repository klonen  
   git clone https://github.com/GinaBilinski/TrackRed.git

2. **Frontend installieren**
   cd trackred-frontend
   npm install
   npm run dev

3. Backend installieren
  cd trackred-backend
  composer install
  cp .env.example .env
  php artisan key:generate
  php artisan migrate --seed
  php artisan serve

Stelle sicher, dass MySQL (z. B. über XAMPP) läuft und die Datenbank trackred vorher erstellt wurde.
Die Zugangsdaten zur Datenbank in .env anpassen.

