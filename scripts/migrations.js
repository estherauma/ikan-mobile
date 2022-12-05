
console.log('Creating migration file...');
const now = Date.now();
// create empty file
const fs = require('fs');
fs.writeFileSync(`./src/app/shared/services/database/migrations/${now}.sql`, '');
 console.log('Migration file created at src/app/shared/services/database/migrations/' + now + '.sql');
