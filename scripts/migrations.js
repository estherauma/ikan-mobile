
console.log('Creating migration file...');
const { argv } = require('process');


const now = Date.now();
// create empty file
const fs = require('fs');
const fileName = now + '_' + `${argv[2]}.sql`;
fs.writeFileSync(`./src/assets/migrations/${fileName}`, '');
console.log('Migration file created at src/assets/migrations/' + fileName);

// write to list of migrations
fs.appendFileSync(`./src/assets/migrations/migrations-list.txt`, fileName);
// Add a new line
fs.appendFileSync(`./src/assets/migrations/migrations-list.txt`, '\n');
