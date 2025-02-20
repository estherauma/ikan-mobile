const fs = require('fs');
require('dotenv').config();

module.exports.generateEnvironmentFiles = (buildType) => {
    console.info(`Building for ${buildType}`);

    let environmentFile;

    switch (buildType) {
        case 'staging':
            environmentFile = `export const env = {
                production: false,
                type: 'staging',
                apiUrl: '${process.env.STAGING_API_URL}',
                baseUrl: '${process.env.STAGING_BASE_URL}',
                environment: 'staging',
                pushNotificationApi: '${process.env.STAGING_PUSH_NOTIFICATION_URL}',
                sentryDSN: '${process.env.SENTRY_DSN}'
            };
            `;
            break;
        case 'production':
            environmentFile = `export const env = {
                production: true,
                type: 'production',
                apiUrl: '${process.env.PRODUCTION_API_URL}',
                baseUrl: '${process.env.PRODUCTION_BASE_URL}',
                environment: 'production',
                pushNotificationApi: '${process.env.PROD_PUSH_NOTIFICATION_URL}',
                sentryDSN: '${process.env.SENTRY_DSN}'
            };
            `;
            break;
        case 'test':
            environmentFile = `export const env = {
                production: false,
                type: 'test',
                apiUrl: '${process.env.TEST_API_URL}',
                baseUrl: '${process.env.TEST_BASE_URL}',
                environment: 'test',
                pushNotificationApi: '${process.env.DEV_PUSH_NOTIFICATION_URL}',
                sentryDSN: '${process.env.SENTRY_DSN}'
            };
            `;
            break;
        default:
            environmentFile = `export const env = {
            production: false,
            type: 'debug',
            apiUrl: '${process.env.DEV_API_URL}',
            baseUrl: '${process.env.DEV_BASE_URL}',
            environment: 'development',
            pushNotificationApi: '${process.env.DEV_PUSH_NOTIFICATION_URL}',
            sentryDSN: '${process.env.SENTRY_DSN}'
        };
        `;
            break;
    }

    const envDir = './src/environments';
    if (!fs.existsSync(envDir)) {
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
};
