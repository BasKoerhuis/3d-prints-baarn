# 🌐 Deployen naar Strato Hosting

Deze gids helpt je om de 3D Print Baarn website op Strato hosting te plaatsen.

## 📋 Wat Je Nodig Hebt

- Strato hosting account met Node.js support
- FTP/SFTP toegang tot je Strato server
- Een domein (bijv. 3dprintsbaarn.nl)
- Email account bij Strato voor bestellingen

## 🚀 Stap 1: Voorbereiding Lokaal

1. **Zorg dat alles lokaal werkt**
   ```bash
   npm install
   npm run dev
   ```

2. **Test de productie build**
   ```bash
   npm run build
   npm start
   ```

3. **Check dat alles werkt op http://localhost:3000**

## 📦 Stap 2: Build voor Productie

1. **Maak een productie build**
   ```bash
   npm run build
   ```

2. **Maak een zip van de belangrijkste bestanden**
   ```bash
   # Linux/Mac:
   zip -r website.zip .next public node_modules package.json package-lock.json .env

   # Windows: Gebruik 7-Zip of WinRAR om deze bestanden te zippen:
   # - .next folder
   # - public folder
   # - node_modules folder (of installeer later op server)
   # - package.json
   # - package-lock.json
   # - .env
   ```

## 🔑 Stap 3: Strato Email Configureren

1. **Log in op je Strato account**

2. **Ga naar Email & Office**

3. **Maak een email account** (als je deze nog niet hebt):
   - Bijv: info@3dprintsbaarn.nl
   - Of gebruik: jelte@3dprintbaarn.nl

4. **Noteer je SMTP gegevens**:
   - Host: `smtp.strato.com`
   - Port: `465`
   - Username: Je volledige emailadres
   - Password: Je email wachtwoord

5. **Update je `.env` bestand** met deze gegevens:
   ```env
   SMTP_HOST=smtp.strato.com
   SMTP_PORT=465
   SMTP_USER=info@3dprintsbaarn.nl
   SMTP_PASS=jouw-email-wachtwoord
   ORDER_EMAIL=jelte@3dprintbaarn.nl
   ```

## 📁 Stap 4: Upload naar Strato

### Via FTP/SFTP (FileZilla aanbevolen)

1. **Download FileZilla** van https://filezilla-project.org

2. **Verbind met Strato**:
   - Host: Krijg je van Strato (bijv. `ftp.3dprintsbaarn.nl`)
   - Username: Je Strato FTP gebruikersnaam
   - Password: Je Strato FTP wachtwoord
   - Port: 21 (FTP) of 22 (SFTP)

3. **Upload de website**:
   - Navigeer naar je webroot (meestal `/` of `/html` of `/public_html`)
   - Upload ALLE bestanden:
     - `.next` folder
     - `public` folder
     - `node_modules` folder (kan groot zijn, alternatieven hieronder)
     - `package.json`
     - `package-lock.json`
     - `.env`
     - alle andere Node.js bestanden

### Snellere Upload (zonder node_modules)

Als `node_modules` te groot is:

1. **Upload alles BEHALVE node_modules**

2. **SSH naar je Strato server** (als beschikbaar)

3. **Installeer dependencies op de server**:
   ```bash
   npm install --production
   ```

## 🔧 Stap 5: Node.js Configureren op Strato

Dit hangt af van je Strato pakket. Meestal:

### Als Strato Node.js support heeft:

1. **Ga naar Strato Admin Panel**
2. **Navigeer naar 'Website & Domains' > 'Node.js'**
3. **Configureer Node.js**:
   - Node.js versie: 18.x of hoger
   - Application Root: Je website directory
   - Application Startup File: `node_modules/next/dist/bin/next`
   - Arguments: `start -p 3000`

### Als Strato geen ingebouwde Node.js heeft:

Je hebt dan een VPS nodig of moet een andere oplossing gebruiken zoals:

1. **PM2 (Process Manager)**:
   ```bash
   npm install -g pm2
   pm2 start npm --name "3dprints" -- start
   pm2 save
   pm2 startup
   ```

2. **Of gebruik een reverse proxy via Apache/Nginx**

## 🌐 Stap 6: Domein Koppelen

1. **In Strato Admin Panel**:
   - Ga naar je domein instellingen
   - Stel je domein in om te wijzen naar je Node.js applicatie
   - Port: meestal 3000 of wat je hebt ingesteld

2. **SSL Certificaat installeren** (HTTPS):
   - Strato biedt meestal gratis Let's Encrypt certificaten
   - Activeer SSL voor je domein in het admin panel

## ✅ Stap 7: Testen

1. **Bezoek je website**: https://jouwdomein.nl

2. **Test alle functionaliteit**:
   - [ ] Homepage laadt
   - [ ] Winkel toont producten
   - [ ] Product detail pagina's werken
   - [ ] Bestelformulier werkt en stuurt emails
   - [ ] Contact formulier werkt
   - [ ] Admin login werkt
   - [ ] Product toevoegen/bewerken werkt
   - [ ] Galerij upload werkt

3. **Test email**:
   - Plaats een test bestelling
   - Check of de email aankomt op jelte@3dprintbaarn.nl

## 🔒 Stap 8: Beveiliging

1. **Verander wachtwoorden**:
   - Genereer een nieuw admin wachtwoord
   - Update `.env` op de server

2. **Verander JWT_SECRET**:
   ```bash
   openssl rand -base64 32
   ```
   Update in `.env`

3. **Stel HTTPS in** (als nog niet gedaan)

4. **Verberg .env**:
   Zorg dat `.env` niet publiek toegankelijk is via de browser

## 📊 Stap 9: Monitoring

### Check of de website draait:

```bash
# Via SSH:
pm2 status
pm2 logs

# Of check de Strato Node.js logs in het admin panel
```

### Als de site crasht:

```bash
pm2 restart 3dprints
# Of:
npm start
```

## 🔄 Updates Deployen

Als je later wijzigingen maakt:

1. **Maak wijzigingen lokaal**
2. **Test lokaal**: `npm run dev`
3. **Build**: `npm run build`
4. **Upload de nieuwe `.next` folder** (vervangt de oude)
5. **Herstart de applicatie**:
   ```bash
   pm2 restart 3dprints
   ```

## 🆘 Problemen Oplossen

### Website laadt niet
- Check of Node.js draait op de server
- Check de logs: `pm2 logs` of in Strato admin panel
- Check of port 3000 open is

### Emails worden niet verzonden
- Verifieer SMTP credentials in `.env`
- Test email account bij Strato
- Check of port 465 open is
- Bekijk server logs voor error messages

### Upload/Files werken niet
- Check permissions van `public/uploads/` folder
- Moet schrijfbaar zijn: `chmod 755 public/uploads`

### Database/JSON bestanden werken niet
- Check permissions van `data/` folder
- Moet schrijfbaar zijn: `chmod 755 data`

## 📞 Strato Support

Als je hulp nodig hebt:
- **Strato Helpdesk**: Kijk op strato.nl/support
- **Telefoon**: Check je Strato account voor supportnummer
- **Email**: support@strato.nl

## 💡 Alternatieve Deployment (Eenvoudiger)

Als Strato hosting te complex is, overweeg:

### Vercel (Gratis, Heel Eenvoudig!)

1. **Push code naar GitHub**
2. **Koppel GitHub aan Vercel.com**
3. **Deploy in 1 klik**
4. **Gratis HTTPS en CDN**

**Let op**: Bij Vercel moet je wel een externe database gebruiken of serverless functions configureren.

## ✅ Checklist voor Go-Live

- [ ] Website werkt op productie URL
- [ ] HTTPS/SSL is ingeschakeld
- [ ] Admin login werkt
- [ ] Email bestellingen komen aan
- [ ] Contact formulier werkt
- [ ] Alle productafbeeldingen laden
- [ ] Mobile responsive werkt
- [ ] Admin wachtwoord is sterk en veilig
- [ ] `.env` is niet publiek toegankelijk
- [ ] Backup gemaakt van data files

**Succes met je deployment! 🚀**

Voor vragen: check README.md of SETUP.md
