

Package.describe({

  name: 'elosoman:meteor-ensure',
  summary: "Mongo index management",
  version: "0.0.1",
  git: "https://github.com/elosoman/meteor-ensure.git"

});

Package.onUse(function(api) {

  api.versionsFrom('1.0.3.2');

  api.use([
    'matb33:collection-hooks@0.7.11',
    'dburles:mongo-collection-instances@0.3.3',
    'iron:router@1.0.7'
    'underscore'
  ]);
  
});

Package.onTest(function(api) {
	// TBD
});
