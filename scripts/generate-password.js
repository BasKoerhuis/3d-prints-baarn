// Script to generate password hash for admin login
// Usage: node scripts/generate-password.js your-password

const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('❌ Geef een wachtwoord op als argument');
  console.log('Gebruik: node scripts/generate-password.js jouw-wachtwoord');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);

console.log('\n✅ Wachtwoord hash gegenereerd!');
console.log('\nVoeg deze toe aan je .env bestand:');
console.log('─────────────────────────────────────────');
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log('─────────────────────────────────────────\n');
