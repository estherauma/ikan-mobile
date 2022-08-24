import * as fs from 'fs';
import * as path from 'path';


const environmentFile = `export const environment = {
  apiUrl: ${process.env.API_URI},
  baseUrl: ${process.env.BASE_URI},
  environment: '${process.env.ENVIRONMENT}'
};
`;


// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
fs.writeFile('./src/environments/environment.ts', environmentFile, function(err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated`);
  }
});
