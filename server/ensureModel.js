

// ----------------------------------------------------
// Meteor-Ensure
//
// Mongo collection and associated schema defination for 
// the suggested mongo indexes for collections.
//

meteorEnsureSchema = new SimpleSchema({
    collection: {
        type: String,
        label: "collection",
    	optional: false,
        max: 200
    },
    index: {
    	type: Object,
        label: "index",
    	optional: false
	},
	options: {
		type: Object,
		label: "indexOptions",
		optional: false
	},
    ignore: {
    	type: Boolean,
        label: "ignore",
    	optional: false
    },
    notes: {
    	type: String,
    	label: "notes",
    	optional: true
    },
    useCount: {
    	type: Number,
        label: "useCount",
    	optional: true
    },
    createdOn: {
    	type: Date,
    	optional: true
    },
    foundOn: {
    	type: Date,
    	optional: true
    },
    lastUsedOn: {
    	type: Date,
    	optional: true
    }
});


// mongo collection
meteorEnsureIndex = new Mongo.Collection('meteorEnsureIndex');

// attach schema to collection
meteorEnsureIndex.attachSchema(meteorEnsureSchema);


// security restrictions for insert, update, and remove
// all true to simulate insecure package.
// update this section and remove insecure

meteorEnsureIndex.allow({
    insert: function (userId, doc) {
        meteorEnsureIndex.log('allow.insert',
        	'DENIED userId:' +userId +' doc:' +doc._id, MeteorEnsure.WARN);
        throw new Meteor.Error(403, "Not authorized to create a new index suggestion.");
    },

    update: function (userId, doc, fields, modifier) {
        MeteorEnsure.log('allow.update', 
        	'DENIED userId:' +userId +' doc:' +doc._id +' fields:' +fields +' modifier:' +modifier, MeteorEnsure.WARN);
        throw new Meteor.Error(403, "Not authorized to update this index suggestion.");
    },

    remove: function (userId, doc) {
        MeteorEnsure.log('allow.remove', 
        	'DENIED userId:' +userId +' doc:' +doc._id, MeteorEnsure.WARN);
        throw new Meteor.Error(403, "Not authorized to remove this index suggestion.");
    }

});



