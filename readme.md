# Tuna Mobile

## Requirements
> node v18.12.1^

## How to set up

## Live Reload
There are three ways to run and test the application. 
### Web
To see the application in the browswer run `npm run start `   
This will start the application in the browser

### Database
The database service has been modified using mocks [to allow SQLite browser compabibility](https://www.techiediaries.com/mocking-native-sqlite-plugin/)
Otherwise testing becomes tidious as you have to always run stuff in an emulator or a physical device.

Now, before you publish to production, make sure that the mocks aren't being used.


These are in `src/app/shared/services/sqlite.mock.ts`    
The two files you have to change this are the `app.module.ts in src/app` and `the dbservice`

For the `dbservice` make sure `SQLiteObject` is imported from `@awesome-cordova-plugins/sqlite/ngx`

For `app.module.ts` make sure to the `SQLite` provider to use the one from the plugin as opposed to the one in the moc. Essentially change `{provide: SQLite, useClass: SQLiteMock},` to `SQLite`

#### Migrations (Developers)
If you need to change the status of the DB schema, you need to create a migration. [See the migrations documentation for details](/notes/migrations)
### iOS
To build with live reload on ios, run `npm run ios-livereload`
### Android
To build with live reload on Android, run `npm run android-livereload`
## ENV Variables
Read solution two of [this article](https://medium.com/swlh/environment-variables-in-angular-ionic-8aa1698f2cc5) to figure out how we are managing enviroment variables

## Testing

## Continuous Deployment
