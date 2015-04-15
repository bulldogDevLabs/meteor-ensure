# meteor-ensure
Meteor package to monitor index and ensure that they are created in a semi-sane manner.

## Installation

### Use the package

1. Clone github
1. link to your meteor app package directory
1. run meteor install below.

### Meteor

```sh
meteor add elosoman:meteor-ensure
```
## Use Case

So you just created your nifty Meteor app and went from prototype to production and find your self preparing to load 2GB of mongo data and trying to support the next viral site. Your Meteor app comes to its knees as you realize you have put off creating any indexes aginst your db. Meteor-Ensure can help by capturing the find requests and performing appropriate mongo index operations to dymanically improve performance. Behind the scenes it records the index history and can eaisly rebuild your indexing scheme.

## Description

Meteor-Ensure will continually monitor the find requests to collections in your database. 

At startup or when collections are created, a hook is installed on the find operation. Meteor-Ensure suggests indexs based on these selectors. Meteor-Ensure uses a mongodb collection named MeteorEnsure to store the suggested indexes for the collections that it finds in use. You can ignore a suggestion by MeteorEnsure.update({_id:indexSuggestionId}, {$set: {ignore:true}}) During Meteor startup this colleciton is used to ensure that all known indexes are in use by Mongo. Removing the suggestedIndex will also remove the index from the mongodb. 

Use the config object to change how automatic you want it to run.

## Server

Default behavior

```sh
MeteorEnsure.config.ensureAtStartup = true; // scan install and ensure all known indexes
MeteorEnsure.config.autoSuggest = true;     // create suggestions for new indexes
MeteorEnsure.config.autoIndex = true;       // ensure index when new find selectors are used
MeteorEnsure.config.adminRoute = '/meteor-ensure'
```

## Admin

Meteor-Ensure 

## Kudos

1. Meteor package allowing Mongo Collection instance lookup by collection name -  https://github.com/dburles/mongo-collection-instances
2. Meteor Collection Hooks - https://github.com/matb33/meteor-collection-hooks
3. Iron-Router - https://github.com/iron-meteor/iron-router
