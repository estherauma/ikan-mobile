# Migrations

The purpose of migration is to keep the DB in sync with the code

## Creating migrations

Run `npm run create-migration <nameOfChangeInMigration>`

## Running migrations

The migrations are automatically run everytime the DB service is instantiated. So all you need to do is run the create the migration and run the app.

## Reverting migrations

I haven't thought that far yet but we'll get there eventually

## How the migrations work

# Migration notes

Initially wanted to store migrations and sql files for migrations inside `src/app/shared/services/database/migrations` but it turns out I can't read that file at run time with the [filesystem plugin](https://capacitorjs.com/docs/apis/filesystem) at run time to be able to run the migrations and update the database.

Changing approach to store the files inside the assets folder. This we can access using http. The only limitation is that we need to know which files are there. So we need to make sure when we create new migration files, we also update `src/assets/migrations/migrations-list.txt`. From there, we can run one by one.
We'll also be able to check the migrations table and run only the ones that we haven't run/
I think this will be a better approach as oppposed to running migrations inside the services file as they are likely to grow over time.
