const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.log('Uso: node hash.js "g£+I1829v$"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log(hash);
