

// ----------------------------------------------------
// Meteor-Ensure
//
// Service component for all functionality
//

meteorEnsure = {
	DEBUG: 0, ALERT: 1, INFO: 2,

	config : {
		logLevel: 0, //meteorEnsure.DEBUG,   // default to DEBUG for the moment
		installHooks: true                  // scan collections and add monitoring hooks
		ensureAtStartup: true,             // at startup ensure all indexes are created.
		monitor: true,                    // attempt to monitor collection finds for index suggestions
		autoSuggest: true,               // automatically create suggestions for new indexes
		autoIndex: true,                // ensure index when new find selectors are used
		adminRoute: '/admin/ensure'    // route to ensure admin interface
	},

	_createFindHooks : function(collection) {
		// special handeling for some collections
		var seedCollection = collection;
		var cs = collection.split('.');
		if( cs.length > 1 ) {
			if( cs[0] === 'cfs' ) {
				seedCollection = cs[1];
			}
		}
		else if( collection === 'users' ) {
			seedCollection = 'Meteor.users';
		}
		else if( collection === 'meteorEnsureIndex' ) {
			// not eating own dog food at the moment.
			return 'skipping meteorEnsureIndex collection for the moment.';
		}

		// assumes that the js object for the collection will be the collection
		// name as in mongo or the initial cap version of that.
		// this object is necessary to create the hook
		var checks = [
			seedCollection.substring(0,1).toUpperCase() +seedCollection.substring(1),
			seedCollection
			];

		for( var i=0; i<checks.length; i++ ) {
			var col = checks[i];

			var hookStmt = 
				col +".before.find(function (userId, selector, options) { \
				meteorEnsure.findHook('all', '" +col +"', userId, selector, options); }); "
				+col +".before.findOne(function (userId, selector, options) { \
				meteorEnsure.findHook('one', '" +col +"', userId, selector, options); }); ";

			try {
				hookResult = eval(hookStmt);
				return 'created';
			}
			catch(err) {
			}
		}

		return 'oops';
	},

	createHooks : function(collection) {
		meteorEnsure.debug('createHooks', 'collection:' +collection 
			+' ' +meteorEnsure._createFindHooks(collection));
	},

	findHook : function(findType, collection, userId, selector, options) {
		if( !meteorEnsure.config.autoSuggest ) {
			return;
		}

		if( meteorEnsure._ignoreDefaultSelectors(findType, collection, selector) ) {
			meteorEnsure.debug('findHook', 'collection:' +collection +' selector:' +JSON.stringify(selector) +' SKIPPING find selector');
			return;
		}

		// scan the selector keys to suggest an index
		meteorEnsure.debug('findHook', 'type:' +findType +' collection:' +collection +' selector:' +JSON.stringify(selector));

		var index = {};
		_.each(_.keys(selector), function(key) {
			_.extend(index, meteorEnsure._convertSelector(key, selector[key]));
		});

		if( _.keys(index).length ) {
			meteorEnsure._updateSuggestedIndex(collection, index);
		}
	},

	_ignoreDefaultSelectors: function(findType, collection, selector) {
		// meteorEnsure.debug('_ignoreDefaultSelectors', 'findType:' +findType +' collection:' +collection +' selector:' +JSON.stringify(selector));

		// skip empty/default selectors
		if( findType === 'one' && typeof selector === 'string' ) {
			// meteorEnsure.debug('_ignoreDefaultSelectors', 'collection:' +collection +' selector:' +JSON.stringify(selector) +' SKIPPING id findOne selector');
			return true;
		} 

		var l = _.keys(selector).length;
		if( l === 0 ) {
			// meteorEnsure.debug('_ignoreDefaultSelectors', 'collection:' +collection +' selector:' +JSON.stringify(selector) +' SKIPPING empty selector');
			return true;
		}
		if( l === 1 && (selector._id || selector._id === null) ) {
			// meteorEnsure.debug('_ignoreDefaultSelectors', 'collection:' +collection +' selector:' +JSON.stringify(selector) +' SKIPPING default find selector');
			return true;
		}

		return false;
	},

	_updateSuggestedIndex : function(collection, index) {
		meteorEnsure.debug('_updateSuggestedIndex', 'collection:' +collection +' index:' +JSON.stringify(index));

		// meteorEnsureIndex collection stores what has been created.
		// This collection is used at startup to recreate indexes and to modify default values
		var idx = meteorEnsureIndex.findOne({
			collection: collection,
			index: index	
		});

		if( idx ) {
			meteorEnsure.debug('_updateSuggestedIndex', 'existing index found idx:' +idx);
			// index is already know about so just increment counter and update lastUsedOn
			meteorEnsureIndex.update(
				{_id:idx._id}, 
				{$inc: {useCount:1}, $set: {lastUsedOn: new Date()}},
				function(err) {
					if( err ) {
						meteorEnsure.alert('_updateSuggestedIndex', 'Unable to update index for (collection:' +collection +' index:' +JSON.stringify(index) +') ' +err);
					} else {
						meteorEnsure.debug('_updateSuggestedIndex', 'updating index useCount and lastUsedOn for (collection:' +collection +' index:' +JSON.stringify(index) +')');
					}
				}
			);
		} else {
			// new index has been discovered.
			meteorEnsure.debug('_updateSuggestedIndex', 'new index suggested ' +JSON.stringify(index));

			var options = {
				name: "mensure_" +_.keys(index).join('_')
			}
			meteorEnsure.debug('_updateSuggestedIndex', 'index options' +JSON.stringify(options));

			meteorEnsureIndex.insert({
				collection: collection, 
				index: index,
				options: options,
				ignore: !meteorEnsure.config.autoIndex,
				useCount: 1,
				foundOn: new Date
			}, function(err) {
				if( err ) {
					meteorEnsure.alert('_updateSuggestedIndex', 'Unable to create index suggestion (collection:' +collection +' index:' +JSON.stringify(index) +') ' +err);
				} else {
					meteorEnsure.alert('_updateSuggestedIndex', 'foo - collection:' +collection +' index:' +JSON.stringify(this.index) +' options:' +JSON.stringify(this.options) +')' );
					meteorEnsure._ensureIndex(collection, index, options);
				}
			});
		}
	},

	_ensureIndex: function(collection, index, options) {
		meteorEnsure.debug('_ensureIndex', 'collection:' +collection +' index:' +JSON.stringify(index) +' options:' +JSON.stringify(options));

		if( meteorEnsure.config.autoIndex ) {
			var ei = collection+'._ensureIndex(' +JSON.stringify(index) +' ,' +JSON.stringify(options) +');';
			// eval(ei);
			meteorEnsure.debug('_ensureIndex', 'eval ' +ei);
		}
	},

	_convertSelector : function(key, selector) {
		meteorEnsure.debug('_convertSelector', 'key:' +JSON.stringify(key) +' selector:' +JSON.stringify(selector));

		var index = {};

		// scan for $and / $or and yank out their keys
		if( key === '$or' || key === '$and' ) {
			var op = key === '$or' ? '$or' : '$and';
			meteorEnsure.debug('_convertSelector', '   op:' +op);

			// selector is array of additional values so convert them to index too
			_.each(selector, function(sel) {
				meteorEnsure.debug('_convertSelector', '   sel:' +JSON.stringify(sel));
				var selKeys = _.keys(sel);
				_.each(selKeys, function(sKey) {
					meteorEnsure.debug('_convertSelector', '   sKey:' +JSON.stringify(sKey));
					_.extend(index, meteorEnsure._convertSelector(sKey,sel[sKey]));
				})
			});

		} else {
			index[key] = 1;
		}

		meteorEnsure.debug('_convertSelector', '   index:' +JSON.stringify(index));
		return index;
	},

	_log : function(logPoint, logType, logEntry, logLevel ) {
		lp = logPoint ? logPoint : '?';
		if( logLevel >= meteorEnsure.config.logLevel ) {
			console.log(logType, 'meteorEnsure', lp, logEntry);
		}
	},

	log : function(logEntry) {
		meteorEnsure.log('-', logEntry);
	},

	log : function(logPoint, logEntry) {
		meteorEnsure._log(logPoint, '[info]', logEntry, meteorEnsure.INFO);
	},

	debug : function(logPoint, logEntry) {
		meteorEnsure._log(logPoint, '[debug]', logEntry, meteorEnsure.DEBUG);
	},

	alert : function(logPoint, logEntry) {
		meteorEnsure._log(logPoint, '[alert]', logEntry, meteorEnsure.ALERT);
	}

};


Meteor.startup(function(){

	if( meteorEnsure.config.ensureAtStartup ) {
		var colList = meteorEnsureIndex.find({
			ignore:{$ne:true}
		});
		meteorEnsure.log('startup', 'existing indexes found:' +colList.count());

		_.each(colList.fetch(), function(col) {
			meteorEnsure.debug('startup', 'ensuring collection:' +col.collection +' selector:' +col.selector);
		});
	}

	if( meteorEnsure.config.installHooks ) {
		var curColList = Mongo.Collection.getAll();
		meteorEnsure.log('startup', 'existing collections found:' +curColList.length);
		
		// create hooks on col find calls
		_.each(curColList, function(col) {
			meteorEnsure.createHooks(col.name);
		})

		meteorEnsure.log('startup', 'complete');
	} else {
		meteorEnsure.log('startup', 'skipping ensure');
	}

});

