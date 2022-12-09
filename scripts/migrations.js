
console.log('Creating migration file...');
const { argv } = require('process');


const now = Date.now();
// create empty file
const fs = require('fs');
fs.writeFileSync(`./src/app/shared/services/database/migrations/${now + '_' + argv[2]}.sql`, '');
 console.log('Migration file created at src/app/shared/services/database/migrations/' + now + '_' + argv[2] +'.sql');
