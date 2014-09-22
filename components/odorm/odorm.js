var odorm  = require( './schema.js' );
var schema = odorm.orm;
var crypto = require('crypto');

// 'schema' should be a hash that includes one hash-per-key (so, it is a hash of hashes)
// 'callback' will get called with your fancy on-disk "orm" (see docs)
// methods:
//   * object_types - will return a list of bare strings referring to the
//     types of objects you have access to inside your orm.
//   * new_object - will return a new object that you specify, providing it's
//     a key in the hash provided by object_types.
//   * write_data - provide (filename, vars, callback) and it will poop it
//     out onto disk in json, in a way that can be read back in later.
//     callback will be passed the return from fs.writeFile.
//
module.exports = {
	new_object : function (varname) { // {{{
		if (schema.hasOwnProperty( varname )) {
			// Well, if we have one of those, let's clone it and send the clone back
			// to the user.
			//
			var map   = schema[ varname ];
			var clone = { };

			for (var property in map) {
				if ( map.hasOwnProperty( property ) && (property != 'hasone') && (property != 'hasmany') ) {
					// Need to create a hash with key property and get a serial for it because
					// this is a new object. XXX: this implies the schema exists somewhere
					// and doesn't need to be created.
					//

					// A "serial" (this should be sufficient for a primary key)
					//
					var nonce = crypto.randomBytes( Math.ceil(32) ).toString('hex');

					// Create the actual hash, casting it to string or integer based on 
					// this gross hack.
					//
					clone[property] = map[property].isa == 'string' ? '' : 0 ;

					clone.serial    = nonce;

					// And here we would need to set methods for gettrs/settrs that would
					// push stuff into the database. XXX: does this mean re-casting clone
					// as a function instead of a hash? How does scoping work on module.exports?
					//
					// clone.gettr_method = 
					// clone.settr_method = 
					//
				} // if it's a key and the right key
			} // walk the hash

			return clone;
		}
		else {
			// We should throw an exception here? Or?
			//
		} // if has property etc
	}, // }}} new_object()

	object_types : function () { // {{{
		var keys = [ ];
		for (var key in schema) {
			if (schema.hasOwnProperty( key )) {
				keys.push( key )
			} // if
		} // for
		return keys;
	}, // }}} object_types()

	write_data : function ( filename, vars, callback ) { // {{{
		// It would be nice for the objects passed back in new_object were stored
		// in this.stuff (or something) but for now we can just write this and
		// use it as a placeholder
		//
		var fs = require( 'fs' );
		var pass = JSON.stringify( vars );

		// Basically if callback never gets called, you can assume fs did its job.
		//
		fs.writeFile( filename, pass, callback );
	} // }}} write_data()
}; // exports