const fs = require('fs');
require('dotenv').config()


const environmentFile = `export const env = {
  apiUrl: '${process.env.API_URL}',
  baseUrl: '${process.env.BASE_URL}',
  environment: '${process.env.ENVIRONMENT}',
  production: '${process.env.PRODUCTION}',
  testEmails: '${process.env.TEST_EMAILS}'
};
`;


fs.writeFile('./src/environments/environment.ts', environmentFile, function(err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated`);
  }
});
