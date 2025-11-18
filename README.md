# 3D Print Baarn - Website

Een moderne, Apple-geïnspireerde website voor het verkopen van 3D prints, gemaakt met Next.js 14, TypeScript en Tailwind CSS.

## 🚀 Features

- **Moderne UI**: Apple-achtig design met minimalistisch en clean interface
- **Volledige Product Management**: Admin interface voor producten beheren (CRUD)
- **Fotogalerij**: Upload en beheer galerij afbeeldingen
- **Bestelformulier**: Volledig werkend bestelformulier dat emails stuurt
- **Contact Formulier**: Geïntegreerd contactformulier
- **Responsive**: Volledig responsive design voor mobiel, tablet en desktop
- **Admin Systeem**: Secure admin panel met authenticatie
- **SEO Optimized**: Meta tags, semantic HTML, alt texts

## 📋 Vereisten

- Node.js 18+ 
- npm of yarn

## 🛠️ Installatie

1. **Clone de repository**
   ```bash
   git clone <repository-url>
   cd 3d-prints-baarn
   ```

2. **Installeer dependencies**
   ```bash
   npm install
   ```

3. **Configureer environment variabelen**
   
   Kopieer `.env.example` naar `.env` en vul de waarden in:
   ```bash
   cp .env.example .env
   ```

   **Belangrijke variabelen:**
   
   - `ORDER_EMAIL`: E-mailadres waar bestellingen naartoe gaan (jelte@3dprintbaarn.nl)
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`: SMTP instellingen voor Strato email
   - `ADMIN_USERNAME`: Admin gebruikersnaam (default: admin)
   - `ADMIN_PASSWORD_HASH`: Gehashte wachtwoord voor admin
   - `JWT_SECRET`: Secret key voor JWT tokens (min 32 karakters)

4. **Genereer admin wachtwoord hash**
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('jouw-wachtwoord', 10))"
   ```
   
   Kopieer de output naar `ADMIN_PASSWORD_HASH` in `.env`

5. **Genereer JWT secret**
   ```bash
   openssl rand -base64 32
   ```
   
   Kopieer de output naar `JWT_SECRET` in `.env`

## 🏃 Development

Start de development server:
```bash
npm run dev
```

De website is nu beschikbaar op [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Toegang

- **Login URL**: `/admin/login`
- **Gebruikersnaam**: Ingesteld via `ADMIN_USERNAME` (default: admin)
- **Wachtwoord**: Ingesteld via `ADMIN_PASSWORD_HASH`

### Admin Functies:
- **Product Management** (`/admin/products`): Producten aanmaken, bewerken, verwijderen
- **Galerij Management** (`/admin/gallery`): Afbeeldingen uploaden, bewerken, verwijderen

## 📧 Email Configuratie (Strato)

Voor Strato hosting, gebruik deze SMTP instellingen:

```env
SMTP_HOST=smtp.strato.com
SMTP_PORT=465
SMTP_USER=jouw-email@jouwdomein.com
SMTP_PASS=jouw-email-wachtwoord
```

**Let op**: Je moet een bestaand email account bij Strato hebben.

## 🚀 Deployment naar Strato

### Optie 1: Static Export (Aanbevolen voor Strato)

1. **Build de applicatie**
   ```bash
   npm run build
   ```

2. **Test de build lokaal**
   ```bash
   npm start
   ```

3. **Upload naar Strato**
   - Upload de `.next`, `public`, `node_modules`, `package.json`, en andere benodigde bestanden naar je Strato server via FTP/SFTP
   - Zorg dat Node.js beschikbaar is op de server (versie 18+)
   - Start de applicatie: `npm start` of configureer via PM2

### Optie 2: Vercel Deployment (Eenvoudigst)

1. **Push code naar GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Deploy via Vercel**
   - Ga naar [vercel.com](https://vercel.com)
   - Importeer je GitHub repository
   - Configureer environment variabelen
   - Deploy!

### Environment Variabelen op Production

Vergeet niet om alle environment variabelen in te stellen in je productie omgeving!

## 📁 Project Structuur

```
3d-prints-baarn/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # Authenticatie endpoints
│   │   ├── products/        # Product CRUD endpoints
│   │   ├── gallery/         # Galerij endpoints
│   │   ├── orders/          # Bestelling endpoint
│   │   └── contact/         # Contact endpoint
│   ├── admin/               # Admin interface
│   │   ├── products/        # Product management
│   │   ├── gallery/         # Galerij management
│   │   └── login/           # Admin login
│   ├── winkel/              # Shop pages
│   ├── over/                # About page
│   ├── galerij/             # Gallery page
│   ├── faq/                 # FAQ page
│   ├── contact/             # Contact page
│   ├── bestellen/           # Order page
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ProductCard.tsx
├── config/                  # Configuration files
│   └── site.ts             # Site config, FAQ, About content
├── data/                    # JSON data storage
│   ├── products.json        # Products database
│   └── gallery.json         # Gallery database
├── lib/                     # Utility functions
│   ├── data.ts             # Data management (CRUD)
│   ├── auth.ts             # Authentication helpers
│   ├── auth-middleware.ts  # Auth middleware
│   └── email.ts            # Email sending
├── public/                  # Static files
│   ├── uploads/            # Uploaded files
│   │   ├── products/       # Product images
│   │   └── gallery/        # Gallery images
│   └── logo.svg            # Site logo
├── types/                   # TypeScript types
│   └── index.ts
└── README.md               # This file
```

## 📝 Data Beheer

### Producten
Producten worden opgeslagen in `data/products.json`. Je kunt deze:
- Beheren via het admin panel (`/admin/products`)
- Handmatig bewerken (niet aanbevolen)

### Afbeeldingen
Afbeeldingen worden opgeslagen in:
- Product afbeeldingen: `public/uploads/products/`
- Galerij afbeeldingen: `public/uploads/gallery/`
- Metadata: `data/gallery.json`

### Content
Content zoals FAQ en About text kan aangepast worden in `config/site.ts`

## 🎨 Design Aanpassen

### Accentkleur wijzigen
Bewerk in `config/site.ts`:
```typescript
accentColor: '#007AFF'  // Verander naar jouw kleur
```

Of in `app/globals.css`:
```css
:root {
  --accent-color: #007AFF;
}
```

### Drop-off locaties
Bewerk in `config/site.ts`:
```typescript
dropoffLocations: [
  'Thuis in Baarn',
  'Schoolplein',
  // Voeg meer locaties toe
]
```

## 🔧 Onderhoud

### Producten toevoegen
1. Ga naar `/admin/login`
2. Log in met admin credentials
3. Ga naar "Producten"
4. Klik "+ Nieuw Product"
5. Vul alle velden in
6. Klik "Product Aanmaken"

### Afbeeldingen uploaden
1. Ga naar "Galerij" in admin
2. Klik "Nieuwe Afbeelding Uploaden"
3. Selecteer afbeelding
4. Vul alt tekst en tags in
5. Klik "Upload Afbeelding"

### Email adres wijzigen
Optie 1: Via environment variabele in `.env`:
```env
ORDER_EMAIL=nieuw-email@voorbeeld.nl
```

Optie 2: In `config/site.ts`:
```typescript
orderEmail: 'nieuw-email@voorbeeld.nl'
```

## 🐛 Troubleshooting

### Emails worden niet verzonden
- Check SMTP credentials in `.env`
- Controleer of je email account actief is bij Strato
- Check spam folder
- Bekijk server logs voor error messages

### Admin login werkt niet
- Controleer of `ADMIN_PASSWORD_HASH` correct is
- Genereer opnieuw met bcrypt
- Check `JWT_SECRET` (min 32 karakters)

### Afbeeldingen worden niet getoond
- Check of `public/uploads/` directory bestaat
- Controleer file permissions op server
- Check of paths correct zijn in database

## 📱 Mobiele Optimalisatie

De site is volledig responsive en geoptimaliseerd voor:
- **Mobiel**: < 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: > 1024px

Het admin panel is ook volledig mobiel-vriendelijk!

## 🔒 Beveiliging

- Admin authenticatie via JWT tokens
- Password hashing met bcryptjs (10 rounds)
- HTTPS only cookies in productie
- Input validatie op alle forms
- XSS protection via React

## 📞 Support

Voor vragen of problemen:
- Email: jelte@3dprintbaarn.nl

## 📄 Licentie

© 2024 3D Print Baarn. Alle rechten voorbehouden.

---

**Gemaakt met ❤️ door Claude voor Jelte van Veen**
