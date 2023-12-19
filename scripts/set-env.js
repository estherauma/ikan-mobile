const fs = require('fs');
require('dotenv').config()


module.exports.generateEnvironmentFiles = ()=>{
  const environmentFile = `export const env = {
    production: false,
    type: 'development',
    apiUrl: '${process.env.API_URL}',
    baseUrl: '${process.env.BASE_URL}',
    environment: '${process.env.ENVIRONMENT}',
    pushNotificationApi: '${process.env.DEV_PUSH_NOTIFICATION_URL}',
    sentryDSN: '${process.env.SENTRY_DSN}'
  };
  `;

  const environmentStagingFile = `export const env = {
    production: false,
    type: 'staging',
    apiUrl: '${process.env.API_URL}',
    baseUrl: '${process.env.BASE_URL}',
    environment: '${process.env.ENVIRONMENT}',
    pushNotificationApi: '${process.env.STAGING_PUSH_NOTIFICATION_URL}',
    sentryDSN: '${process.env.SENTRY_DSN}'
  };
  `;

  const environmentProdFile = `export const env = {
    production: true,
    type: 'production',
    apiUrl: '${process.env.API_URL}',
    baseUrl: '${process.env.BASE_URL}',
    environment: '${process.env.ENVIRONMENT}',
    pushNotificationApi: '${process.env.PROD_PUSH_NOTIFICATION_URL}',
    sentryDSN: '${process.env.SENTRY_DSN}'
  };
  `;

  const envDir = './src/environments';
  if (!fs.existsSync(envDir)){
    fs.mkdirSync(envDir);
  }

  // Generate environment.ts file
  fs.writeFile(`${envDir}/environment.ts`, environmentFile, function (err) {
    if (err) {
      throw console.error(err);
    } else {
      console.log(`Angular environment.ts file generated`);
    }
  });

  // Generate environment.staging.ts file
  fs.writeFile(`${envDir}/environment.staging.ts`, environmentStagingFile, function (err) {
    if (err) {
      throw console.error(err);
    } else {
      console.log(`Angular environment.staging.ts file generated`);
    }
  });

  // Generate environment.prod.ts file
  fs.writeFile(`${envDir}/environment.prod.ts`, environmentProdFile, function (err) {
    if (err) {
      throw console.error(err);
    } else {
      console.log(`Angular environment.prod.ts file generated`);
    }
  });
}
