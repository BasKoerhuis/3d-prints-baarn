const bcrypt = require('bcryptjs');

const password = process.argv[2];

if (!password) {
  console.error('Geef een wachtwoord op');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const base64Hash = Buffer.from(hash).toString('base64');

console.log('ADMIN_PASSWORD_HASH_BASE64=' + base64Hash);
