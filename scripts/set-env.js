const fs = require('fs');
require('dotenv').config()


const environmentFile = `export const env = {
  apiUrl: '${process.env.API_URL}',
  baseUrl: '${process.env.BASE_URL}',
  environment: '${process.env.ENVIRONMENT}',
  production: '${process.env.PRODUCTION}',
  pushNotificationApi: '${process.env.PUSH_NOTIFICATION_API}',
};
`;

//  TODO: refactor pushNotificationApi to pull from dev, staging, prod
//  DEV_PUSH_NOTIFICATION_URL=
//  STAGING_PUSH_NOTIFICATION_URL=
//  PROD_PUSH_NOTIFICATION_URL=

fs.writeFile('./src/environments/environment.ts', environmentFile, function(err) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Angular environment.ts file generated`);
  }
});
