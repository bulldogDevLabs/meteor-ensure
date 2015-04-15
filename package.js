

// ----------------------------------------------------
// description
Package.describe({

  name: 'elosoman:meteor-ensure',
  summary: "Mongo index management",
  version: "0.0.1",
  git: "https://github.com/elosoman/meteor-ensure.git"

});

// ----------------------------------------------------
// use
Package.onUse(function(api) {

  // ----------------------------------------------------
  // meteor api
  api.versionsFrom('1.1.0.2');

  // ----------------------------------------------------
  // server
  api.addFiles([
  ], ['server']);
  
  api.use([
    'matb33:collection-hooks@0.7.11',
    'dburles:mongo-collection-instances@0.3.3',
    'underscore'
  ], ['server']);

  // ----------------------------------------------------
  // client
  api.addFiles([
  ], ['client']);
  
  api.use([
    'matb33:collection-hooks@0.7.11',
    'dburles:mongo-collection-instances@0.3.3',
    'iron:router@1.0.7'
    'templating',
    'underscore'
  ], ['client']);
  
});

// ----------------------------------------------------
// tests
Package.onTest(function(api) {
  // TBD
});
