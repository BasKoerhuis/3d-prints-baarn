# 🚀 Snelstart Gids voor Jelte

Welkom bij je nieuwe 3D Prints Baarn website! Deze gids helpt je om snel aan de slag te gaan.

## ⚡ Stap 1: Eerste Keer Opstarten

1. **Open terminal in de project map**
   ```bash
   cd 3d-prints-baarn
   ```

2. **Installeer alle benodigde packages**
   ```bash
   npm install
   ```

3. **Maak een admin wachtwoord**
   ```bash
   node scripts/generate-password.js jouw-wachtwoord
   ```
   
   Kopieer de hash die verschijnt en plak deze in het `.env` bestand bij `ADMIN_PASSWORD_HASH=`

4. **Start de website**
   ```bash
   npm run dev
   ```

5. **Open in je browser**
   Ga naar: http://localhost:3000

## 🔐 Inloggen als Admin

1. Ga naar: http://localhost:3000/admin/login
2. Gebruikersnaam: `admin`
3. Wachtwoord: Het wachtwoord dat je in stap 3 hebt gekozen

## 📦 Producten Toevoegen

1. Log in als admin
2. Klik op "Producten" in het menu
3. Klik op "+ Nieuw Product"
4. Vul alle velden in:
   - **Productnaam**: Bijv. "Fidget Spinner"
   - **Korte beschrijving**: Eén zin over het product
   - **Lange beschrijving**: Uitgebreide beschrijving
   - **Afmetingen**: Bijv. "7.5 x 7.5 x 1.2 cm"
   - **Kenmerken**: Elke regel is een kenmerk
   - **Kinderprijs**: Prijs voor kinderen (t/m 15 jaar)
   - **Volwassen prijs**: Prijs voor volwassenen
   - **Op voorraad**: Vink aan als beschikbaar
5. Klik "Product Aanmaken"

💡 **Tip**: Je kunt nu nog geen foto's toevoegen aan producten - dit komt later!

## 📸 Foto's Toevoegen aan Galerij

1. Ga naar "Galerij" in het admin menu
2. Klik "Nieuwe Afbeelding Uploaden"
3. Kies een foto van je computer
4. Vul een beschrijving in (Alt tekst)
5. Optioneel: Voeg tags toe (gescheiden door komma's)
6. Klik "Upload Afbeelding"

## ✏️ Content Aanpassen

### FAQ Vragen Aanpassen
Open `config/site.ts` en zoek naar `faqData`. Hier kun je:
- Bestaande vragen aanpassen
- Nieuwe vragen toevoegen
- Vragen verwijderen

### Over Mij Tekst Aanpassen
In hetzelfde bestand (`config/site.ts`), zoek naar `aboutContent`:
```typescript
content: `
  Hoi! Ik ben Jelte, 12 jaar oud...
  [Pas deze tekst aan naar jouw verhaal]
`
```

### Drop-off Locaties Aanpassen
Zoek in `config/site.ts` naar `dropoffLocations` en pas aan:
```typescript
dropoffLocations: [
  'Thuis in Baarn',
  'Jouw locatie 1',
  'Jouw locatie 2',
]
```

## 📧 Testen of Bestellingen Werken

1. Ga naar je website (niet admin)
2. Ga naar een product
3. Klik "Bestellen"
4. Vul het formulier in
5. Klik "Bestelling Plaatsen"
6. Check je email inbox (jeltevveen@gmail.com)

⚠️ **Let op**: Voor echte emails moet je later SMTP configureren!

## 🎨 Kleuren Aanpassen

Wil je een andere hoofdkleur dan blauw?

Open `config/site.ts` en verander:
```typescript
accentColor: '#007AFF'  // Verander naar jouw kleurcode
```

Populaire kleuren:
- Blauw: `#007AFF` (Apple blue - huidige kleur)
- Oranje: `#FF9500`
- Groen: `#34C759`
- Rood: `#FF3B30`
- Paars: `#AF52DE`

## 🚫 Website Stoppen

In de terminal waar `npm run dev` draait:
- Druk op `Ctrl + C` (of `Cmd + C` op Mac)

## 🔄 Website Opnieuw Starten

```bash
npm run dev
```

## 💡 Handige Tips

1. **Browser refresh**: Als je wijzigingen maakt, refresh de browser (F5 of Cmd+R)
2. **Producten bewerken**: Klik op "Bewerken" naast een product in admin
3. **Backup maken**: Kopieer `data/products.json` en `data/gallery.json` voor een backup
4. **Fotos opslaan**: Al je uploads staan in `public/uploads/`

## ❓ Problemen?

### Website start niet
- Check of je in de juiste map zit
- Probeer: `npm install` opnieuw
- Check of een andere app niet al op poort 3000 draait

### Admin login werkt niet
- Check of je wachtwoord hash goed is in `.env`
- Genereer opnieuw met het script

### Producten verschijnen niet
- Check of je bent ingelogd als admin
- Refresh de pagina

## 📞 Hulp Nodig?

Bij vragen kun je altijd de volledige README.md lezen of contact opnemen!

**Succes met je website! 🎉**
