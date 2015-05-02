

// ----------------------------------------------------
// description
// ----------------------------------------------------

Package.describe({

  name: 'bulldogDevLabs:meteor-ensure',
  summary: "Mongo index management for Meteor",
  version: "0.0.1",
  git: "https://github.com/bulldogDevLabs/meteor-ensure.git"

});


// ----------------------------------------------------
// use
// ----------------------------------------------------

Package.onUse(function(api) {

    // ----------------------------------------------------
    // meteor api
    api.versionsFrom('1.1.0.2');


    // ----------------------------------------------------
    // common files
    // ----------------------------------------------------

    api.addFiles([
        ], 
        ['server', 'client']);
  
    api.export([
        'MeteorEnsure'], 
        ['server', 'client']);
  
  
    // ----------------------------------------------------
    // server
    // ----------------------------------------------------

    api.addFiles([
        'server/ensureModel.js',
        'server/ensureServer.js'
        ], 
        ['server']);

    api.use([
        'matb33:collection-hooks@0.7.11',
        'dburles:mongo-collection-instances@0.3.3',
        'aldeed:collection2@2.3.3',
        'underscore'
        ], ['server']);


    // ----------------------------------------------------
    // client
    // ----------------------------------------------------

    // api.addFiles([
    // ], ['client']);

    // api.use([
    //   'matb33:collection-hooks@0.7.11',
    //   'dburles:mongo-collection-instances@0.3.3',
    //   'iron:router@1.0.7'
    //   'templating',
    //   'underscore'
    // ], ['client']);

});


// ----------------------------------------------------
// tests
Package.onTest(function(api) {
    // TBD
});


