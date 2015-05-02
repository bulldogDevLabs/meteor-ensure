# meteor-ensure
Meteor package to monitor index and ensure that they are created in a semi-sane manner.

## Installation

### Use the package

1. Clone github
1. link to your meteor app package directory
1. run meteor install below.

### Meteor

```sh
meteor add bulldogDevLabs:meteor-ensure
```

## Use Case

## Description

If your like me you put off creating your indexes because you knew you had to but didn't get around to doing it.
Then you realize you have all of these publications that need to be examined to determeine the indexes that 
would be of most help.

Meteor-Ensure can help by capturing the find requests and performing appropriate mongo index operations to 
dymanically improve performance. Behind the scenes meteor-ensure records the index history and can also eaisly 
rebuild your indexing scheme. 

Meteor-Ensure will continually monitor the find requests to collections in your database. At startup, 
a hook is installed on the find operations. Meteor-ensure suggests indexes based on these selectors. 
A mongodb collection named MeteorEnsure is used to store the suggested indexes that it finds. 

You can ignore a suggestion by MeteorEnsure.update() {$set: {ignore:true}}. 

Removing the suggestedIndex will also remove the index from the mongodb. 

Use the config object to change how automatic you want it to run.

## Server

Default behavior

```sh
MeteorEnsure.config.installHooks = true;              // scan collections and add monitoring hooks
MeteorEnsure.config.ensureAtStartup = true;          // at startup ensure all indexes are created.
MeteorEnsure.config.autoSuggest = true;             // create suggestions when new indexes are found.
MeteorEnsure.config.autoIndex = true;              // create indexes for new selections.
MeteorEnsure.config.adminRoute = '/meteor-ensure' // route to ensure admin ui
```

## Admin

Open '/meteor-ensure' in your Meteor app. This interface allows you to inspect the status of meteor-ensure as well as
change options for the suggested indexes.

## Kudos

1. Meteor package allowing Mongo Collection instance lookup by collection name -  https://github.com/dburles/mongo-collection-instances
2. Meteor Collection Hooks - https://github.com/matb33/meteor-collection-hooks
3. Iron-Router - https://github.com/iron-meteor/iron-router
4. Meteor - http://meteor.com


