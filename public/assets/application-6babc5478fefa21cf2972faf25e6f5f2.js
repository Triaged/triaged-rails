/*!
 * jQuery JavaScript Library v1.10.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03T13:48Z
 */

(function( window, undefined ) {

// Can't do this because several apps including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
// Support: Firefox 18+
//"use strict";
var
	// The deferred used on DOM ready
	readyList,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// Support: IE<10
	// For `typeof xmlNode.method` instead of `xmlNode.method !== undefined`
	core_strundefined = typeof undefined,

	// Use the correct document accordingly with window argument (sandbox)
	location = window.location,
	document = window.document,
	docElem = document.documentElement,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// [[Class]] -> type pairs
	class2type = {},

	// List of deleted data cache ids, so we can reuse them
	core_deletedIds = [],

	core_version = "1.10.2",

	// Save a reference to some core methods
	core_concat = core_deletedIds.concat,
	core_push = core_deletedIds.push,
	core_slice = core_deletedIds.slice,
	core_indexOf = core_deletedIds.indexOf,
	core_toString = class2type.toString,
	core_hasOwn = class2type.hasOwnProperty,
	core_trim = core_version.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,

	// Used for splitting on whitespace
	core_rnotwhite = /\S+/g,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	},

	// The ready event handler
	completed = function( event ) {

		// readyState === "complete" is good enough for us to call the dom ready in oldIE
		if ( document.addEventListener || event.type === "load" || document.readyState === "complete" ) {
			detach();
			jQuery.ready();
		}
	},
	// Clean-up method for dom ready events
	detach = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", completed, false );
			window.removeEventListener( "load", completed, false );

		} else {
			document.detachEvent( "onreadystatechange", completed );
			window.detachEvent( "onload", completed );
		}
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: core_version,

	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// scripts is true for back-compat
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( core_version + Math.random() ).replace( /\D/g, "" ),

	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		/* jshint eqeqeq: false */
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		if ( obj == null ) {
			return String( obj );
		}
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ core_toString.call(obj) ] || "object" :
			typeof obj;
	},

	isPlainObject: function( obj ) {
		var key;

		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Support: IE<9
		// Handle iteration over inherited properties before own properties.
		if ( jQuery.support.ownLast ) {
			for ( key in obj ) {
				return core_hasOwn.call( obj, key );
			}
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// keepScripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, keepScripts ) {
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			keepScripts = context;
			context = false;
		}
		context = context || document;

		var parsed = rsingleTag.exec( data ),
			scripts = !keepScripts && [];

		// Single tag
		if ( parsed ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts );
		if ( scripts ) {
			jQuery( scripts ).remove();
		}
		return jQuery.merge( [], parsed.childNodes );
	},

	parseJSON: function( data ) {
		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		if ( data === null ) {
			return data;
		}

		if ( typeof data === "string" ) {

			// Make sure leading/trailing whitespace is removed (IE can't handle it)
			data = jQuery.trim( data );

			if ( data ) {
				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if ( rvalidchars.test( data.replace( rvalidescape, "@" )
					.replace( rvalidtokens, "]" )
					.replace( rvalidbraces, "")) ) {

					return ( new Function( "return " + data ) )();
				}
			}
		}

		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && jQuery.trim( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				core_push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return core_concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var args, proxy, tmp;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, raw ) {
		var i = 0,
			length = elems.length,
			bulk = key == null;

		// Sets many values
		if ( jQuery.type( key ) === "object" ) {
			chainable = true;
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
			}

		// Sets one value
		} else if ( value !== undefined ) {
			chainable = true;

			if ( !jQuery.isFunction( value ) ) {
				raw = true;
			}

			if ( bulk ) {
				// Bulk operations run against the entire set
				if ( raw ) {
					fn.call( elems, value );
					fn = null;

				// ...except when executing function values
				} else {
					bulk = fn;
					fn = function( elem, key, value ) {
						return bulk.call( jQuery( elem ), value );
					};
				}
			}

			if ( fn ) {
				for ( ; i < length; i++ ) {
					fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
				}
			}
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations.
	// Note: this method belongs to the css module but it's needed here for the support module.
	// If support gets modularized, this method should be moved back to the css module.
	swap: function( elem, options, callback, args ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.apply( elem, args || [] );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", completed );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", completed );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// detach all dom ready events
						detach();

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || type !== "function" &&
		( length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj );
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
/*!
 * Sizzle CSS Selector Engine v1.10.2
 * http://sizzlejs.com/
 *
 * Copyright 2013 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2013-07-03
 */
(function( window, undefined ) {

var i,
	support,
	cachedruns,
	Expr,
	getText,
	isXML,
	compile,
	outermostContext,
	sortInput,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + -(new Date()),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	hasDuplicate = false,
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}
		return 0;
	},

	// General-purpose constants
	strundefined = typeof undefined,
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf if we can't use a native one
	indexOf = arr.indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:([*^$|!~]?=)" + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments quoted,
	//   then not containing pseudos/brackets,
	//   then attribute selectors/non-parenthetical expressions,
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + attributes.replace( 3, 8 ) + ")*)|.*)\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rsibling = new RegExp( whitespace + "*[+~]" ),
	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			// BMP codepoint
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( (nodeType = context.nodeType) !== 1 && nodeType !== 9 ) {
		return [];
	}

	if ( documentIsHTML && !seed ) {

		// Shortcuts
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName && context.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType === 9 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && context.parentNode || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key += " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Detect xml
 * @param {Element|Object} elem An element or a document
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var doc = node ? node.ownerDocument || node : preferredDoc,
		parent = doc.defaultView;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;

	// Support tests
	documentIsHTML = !isXML( doc );

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent.attachEvent && parent !== parent.top ) {
		parent.attachEvent( "onbeforeunload", function() {
			setDocument();
		});
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Check if getElementsByClassName can be trusted
	support.getElementsByClassName = assert(function( div ) {
		div.innerHTML = "<div class='a'></div><div class='a i'></div>";

		// Support: Safari<4
		// Catch class over-caching
		div.firstChild.className = "i";
		// Support: Opera<10
		// Catch gEBCN failure to find non-leading classes
		return div.getElementsByClassName("i").length === 2;
	});

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== strundefined && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [m] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== strundefined ) {
				return context.getElementsByTagName( tag );
			}
		} :
		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== strundefined && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Support: Opera 10-12/IE8
			// ^= $= *= and empty values
			// Should not select anything
			// Support: Windows 8 Native Apps
			// The type attribute is restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "t", "" );

			if ( div.querySelectorAll("[t^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = rnative.test( docElem.contains ) || docElem.compareDocumentPosition ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var compare = b.compareDocumentPosition && a.compareDocumentPosition && a.compareDocumentPosition( b );

		if ( compare ) {
			// Disconnected nodes
			if ( compare & 1 ||
				(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

				// Choose the first element that is related to our preferred document
				if ( a === doc || contains(preferredDoc, a) ) {
					return -1;
				}
				if ( b === doc || contains(preferredDoc, b) ) {
					return 1;
				}

				// Maintain original order
				return sortInput ?
					( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
					0;
			}

			return compare & 4 ? -1 : 1;
		}

		// Not directly comparable, sort on existence of method
		return a.compareDocumentPosition ? -1 : 1;
	} :
	function( a, b ) {
		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Parentless nodes are either documents or disconnected
		} else if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf.call( sortInput, a ) - indexOf.call( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch(e) {}
	}

	return Sizzle( expr, document, null, [elem] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val === undefined ?
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null :
		val;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (see #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[5] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] && match[4] !== undefined ) {
				match[2] = match[4];

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeName > "@" || elem.nodeType === 3 || elem.nodeType === 4 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === elem.type );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var data, cache, outerCache,
				dirkey = dirruns + " " + doneName;

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (cache = outerCache[ dir ]) && cache[0] === dirkey ) {
							if ( (data = cache[1]) === true || data === cachedruns ) {
								return data === true;
							}
						} else {
							cache = outerCache[ dir ] = [ dirkey ];
							cache[1] = matcher( elem, context, xml ) || cachedruns;
							if ( cache[1] === true ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf.call( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	// A counter to specify which element is currently being matched
	var matcherCachedRuns = 0,
		bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = matcherCachedRuns;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++matcherCachedRuns;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function select( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		match = tokenize( selector );

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					support.getById && context.nodeType === 9 && documentIsHTML &&
					Expr.relative[ tokens[1].type ] ) {

				context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
				if ( !context ) {
					return results;
				}
				selector = selector.slice( tokens.shift().value.length );
			}

			// Fetch a seed set for right-to-left matching
			i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
			while ( i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( runescape, funescape ),
						rsibling.test( tokens[0].type ) && context.parentNode || context
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && toSelector( tokens );
						if ( !selector ) {
							push.apply( results, seed );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector )
	);
	return results;
}

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome<14
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return (val = elem.getAttributeNode( name )) && val.specified ?
				val.value :
				elem[ name ] === true ? name.toLowerCase() : null;
		}
	});
}

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( core_rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ action + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function( support ) {

	var all, a, input, select, fragment, opt, eventName, isSupported, i,
		div = document.createElement("div");

	// Setup
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	// Finish early in limited (non-browser) environments
	all = div.getElementsByTagName("*") || [];
	a = div.getElementsByTagName("a")[ 0 ];
	if ( !a || !a.style || !all.length ) {
		return support;
	}

	// First batch of tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
	support.getSetAttribute = div.className !== "t";

	// IE strips leading whitespace when .innerHTML is used
	support.leadingWhitespace = div.firstChild.nodeType === 3;

	// Make sure that tbody elements aren't automatically inserted
	// IE will insert them into empty tables
	support.tbody = !div.getElementsByTagName("tbody").length;

	// Make sure that link elements get serialized correctly by innerHTML
	// This requires a wrapper element in IE
	support.htmlSerialize = !!div.getElementsByTagName("link").length;

	// Get the style information from getAttribute
	// (IE uses .cssText instead)
	support.style = /top/.test( a.getAttribute("style") );

	// Make sure that URLs aren't manipulated
	// (IE normalizes it by default)
	support.hrefNormalized = a.getAttribute("href") === "/a";

	// Make sure that element opacity exists
	// (IE uses filter instead)
	// Use a regex to work around a WebKit issue. See #5145
	support.opacity = /^0.5/.test( a.style.opacity );

	// Verify style float existence
	// (IE uses styleFloat instead of cssFloat)
	support.cssFloat = !!a.style.cssFloat;

	// Check the default checkbox/radio value ("" on WebKit; "on" elsewhere)
	support.checkOn = !!input.value;

	// Make sure that a selected-by-default option has a working selected property.
	// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
	support.optSelected = opt.selected;

	// Tests for enctype support on a form (#6743)
	support.enctype = !!document.createElement("form").enctype;

	// Makes sure cloning an html5 element does not cause problems
	// Where outerHTML is undefined, this still works
	support.html5Clone = document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>";

	// Will be defined later
	support.inlineBlockNeedsLayout = false;
	support.shrinkWrapBlocks = false;
	support.pixelPosition = false;
	support.deleteExpando = true;
	support.noCloneEvent = true;
	support.reliableMarginRight = true;
	support.boxSizingReliable = true;

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<9
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	// Check if we can trust getAttribute("value")
	input = document.createElement("input");
	input.setAttribute( "value", "" );
	support.input = input.getAttribute( "value" ) === "";

	// Check if an input maintains its value after becoming a radio
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "checked", "t" );
	input.setAttribute( "name", "t" );

	fragment = document.createDocumentFragment();
	fragment.appendChild( input );

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<9
	// Opera does not clone events (and typeof div.attachEvent === undefined).
	// IE9-10 clones events bound via attachEvent, but they don't trigger with .click()
	if ( div.attachEvent ) {
		div.attachEvent( "onclick", function() {
			support.noCloneEvent = false;
		});

		div.cloneNode( true ).click();
	}

	// Support: IE<9 (lack submit/change bubble), Firefox 17+ (lack focusin event)
	// Beware of CSP restrictions (https://developer.mozilla.org/en/Security/CSP)
	for ( i in { submit: true, change: true, focusin: true }) {
		div.setAttribute( eventName = "on" + i, "t" );

		support[ i + "Bubbles" ] = eventName in window || div.attributes[ eventName ].expando === false;
	}

	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	// Support: IE<9
	// Iteration over object's inherited properties before its own.
	for ( i in jQuery( support ) ) {
		break;
	}
	support.ownLast = i !== "0";

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, marginDiv, tds,
			divReset = "padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px";

		body.appendChild( container ).appendChild( div );

		// Support: IE8
		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Support: IE8
		// Check if empty table cells still have offsetWidth/Height
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior.
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";

		// Workaround failing boxSizing test due to offsetWidth returning wrong value
		// with some non-1 values of body zoom, ticket #13543
		jQuery.swap( body, body.style.zoom != null ? { zoom: 1 } : {}, function() {
			support.boxSizing = div.offsetWidth === 4;
		});

		// Use window.getComputedStyle because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = div.appendChild( document.createElement("div") );
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";

			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== core_strundefined ) {
			// Support: IE<8
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Support: IE6
			// Check if elements with layout shrink-wrap their children
			div.style.display = "block";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			if ( support.inlineBlockNeedsLayout ) {
				// Prevent IE 6 from affecting layout for positioned elements #11048
				// Prevent IE from shrinking the body in IE 7 mode #12869
				// Support: IE<8
				body.style.zoom = 1;
			}
		}

		body.removeChild( container );

		// Null elements to avoid leaks in IE
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	all = select = fragment = opt = a = input = null;

	return support;
})({});

var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

function internalData( elem, name, data, pvt /* Internal Use Only */ ){
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var ret, thisCache,
		internalKey = jQuery.expando,

		// We have to handle DOM nodes and JS objects differently because IE6-7
		// can't GC object references properly across the DOM-JS boundary
		isNode = elem.nodeType,

		// Only DOM nodes need the global jQuery cache; JS object data is
		// attached directly to the object so GC can occur automatically
		cache = isNode ? jQuery.cache : elem,

		// Only defining an ID for JS objects if its cache already exists allows
		// the code to shortcut on the same path as a DOM node with no cache
		id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

	// Avoid doing any more work than we need to when trying to get data on an
	// object that has no data at all
	if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && data === undefined && typeof name === "string" ) {
		return;
	}

	if ( !id ) {
		// Only DOM nodes need a new unique ID for each element since their data
		// ends up in the global cache
		if ( isNode ) {
			id = elem[ internalKey ] = core_deletedIds.pop() || jQuery.guid++;
		} else {
			id = internalKey;
		}
	}

	if ( !cache[ id ] ) {
		// Avoid exposing jQuery metadata on plain JS objects when the object
		// is serialized using JSON.stringify
		cache[ id ] = isNode ? {} : { toJSON: jQuery.noop };
	}

	// An object can be passed to jQuery.data instead of a key/value pair; this gets
	// shallow copied over onto the existing cache
	if ( typeof name === "object" || typeof name === "function" ) {
		if ( pvt ) {
			cache[ id ] = jQuery.extend( cache[ id ], name );
		} else {
			cache[ id ].data = jQuery.extend( cache[ id ].data, name );
		}
	}

	thisCache = cache[ id ];

	// jQuery data() is stored in a separate object inside the object's internal data
	// cache in order to avoid key collisions between internal data and user-defined
	// data.
	if ( !pvt ) {
		if ( !thisCache.data ) {
			thisCache.data = {};
		}

		thisCache = thisCache.data;
	}

	if ( data !== undefined ) {
		thisCache[ jQuery.camelCase( name ) ] = data;
	}

	// Check for both converted-to-camel and non-converted data property names
	// If a data property was specified
	if ( typeof name === "string" ) {

		// First Try to find as-is property data
		ret = thisCache[ name ];

		// Test for null|undefined property data
		if ( ret == null ) {

			// Try to find the camelCased property
			ret = thisCache[ jQuery.camelCase( name ) ];
		}
	} else {
		ret = thisCache;
	}

	return ret;
}

function internalRemoveData( elem, name, pvt ) {
	if ( !jQuery.acceptData( elem ) ) {
		return;
	}

	var thisCache, i,
		isNode = elem.nodeType,

		// See jQuery.data for more information
		cache = isNode ? jQuery.cache : elem,
		id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

	// If there is already no cache entry for this object, there is no
	// purpose in continuing
	if ( !cache[ id ] ) {
		return;
	}

	if ( name ) {

		thisCache = pvt ? cache[ id ] : cache[ id ].data;

		if ( thisCache ) {

			// Support array or space separated string names for data keys
			if ( !jQuery.isArray( name ) ) {

				// try the string as a key before any manipulation
				if ( name in thisCache ) {
					name = [ name ];
				} else {

					// split the camel cased version by spaces unless a key with the spaces exists
					name = jQuery.camelCase( name );
					if ( name in thisCache ) {
						name = [ name ];
					} else {
						name = name.split(" ");
					}
				}
			} else {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = name.concat( jQuery.map( name, jQuery.camelCase ) );
			}

			i = name.length;
			while ( i-- ) {
				delete thisCache[ name[i] ];
			}

			// If there is no data left in the cache, we want to continue
			// and let the cache object itself get destroyed
			if ( pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache) ) {
				return;
			}
		}
	}

	// See jQuery.data for more information
	if ( !pvt ) {
		delete cache[ id ].data;

		// Don't destroy the parent cache unless the internal data object
		// had been the only thing left in it
		if ( !isEmptyDataObject( cache[ id ] ) ) {
			return;
		}
	}

	// Destroy the cache
	if ( isNode ) {
		jQuery.cleanData( [ elem ], true );

	// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
	/* jshint eqeqeq: false */
	} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
		/* jshint eqeqeq: true */
		delete cache[ id ];

	// When all else fails, null
	} else {
		cache[ id ] = null;
	}
}

jQuery.extend({
	cache: {},

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"applet": true,
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data ) {
		return internalData( elem, name, data );
	},

	removeData: function( elem, name ) {
		return internalRemoveData( elem, name );
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return internalData( elem, name, data, true );
	},

	_removeData: function( elem, name ) {
		return internalRemoveData( elem, name, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		// Do not set data on non-element because it will not be cleared (#8335).
		if ( elem.nodeType && elem.nodeType !== 1 && elem.nodeType !== 9 ) {
			return false;
		}

		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var attrs, name,
			data = null,
			i = 0,
			elem = this[0];

		// Special expections of .data basically thwart jQuery.access,
		// so implement the relevant behavior ourselves

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attrs = elem.attributes;
					for ( ; i < attrs.length; i++ ) {
						name = attrs[i].name;

						if ( name.indexOf("data-") === 0 ) {
							name = jQuery.camelCase( name.slice(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		return arguments.length > 1 ?

			// Sets one value
			this.each(function() {
				jQuery.data( this, key, value );
			}) :

			// Gets one value
			// Try to fetch any internally stored data first
			elem ? dataAttr( elem, key, jQuery.data( elem, key ) ) : null;
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
						data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery._removeData( elem, type + "queue" );
				jQuery._removeData( elem, key );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook,
	rclass = /[\t\r\n\f]/g,
	rreturn = /\r/g,
	rfocusable = /^(?:input|select|textarea|button|object)$/i,
	rclickable = /^(?:a|area)$/i,
	ruseDefault = /^(?:checked|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute,
	getSetInput = jQuery.support.input;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}
					elem.className = jQuery.trim( cur );

				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j,
			i = 0,
			len = this.length,
			proceed = arguments.length === 0 || typeof value === "string" && value;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( core_rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}
					elem.className = value ? jQuery.trim( cur ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( core_rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === core_strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed "false",
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var ret, hooks, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// Use proper attribute retrieval(#6932, #12072)
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// oldIE doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( jQuery(option).val(), values ) >= 0) ) {
						optionSet = true;
					}
				}

				// force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === core_strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( core_rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
						elem[ propName ] = false;
					// Support: IE<9
					// Also clear defaultChecked/defaultSelected (if appropriate)
					} else {
						elem[ jQuery.camelCase( "default-" + name ) ] =
							elem[ propName ] = false;
					}

				// See #9699 for explanation of this approach (setting first, then removal)
				} else {
					jQuery.attr( elem, name, "" );
				}

				elem.removeAttribute( getSetAttribute ? name : propName );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to default in case type is set after value during creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						-1;
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else if ( getSetInput && getSetAttribute || !ruseDefault.test( name ) ) {
			// IE<8 needs the *property* name
			elem.setAttribute( !getSetAttribute && jQuery.propFix[ name ] || name, name );

		// Use defaultChecked and defaultSelected for oldIE
		} else {
			elem[ jQuery.camelCase( "default-" + name ) ] = elem[ name ] = true;
		}

		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = jQuery.expr.attrHandle[ name ] || jQuery.find.attr;

	jQuery.expr.attrHandle[ name ] = getSetInput && getSetAttribute || !ruseDefault.test( name ) ?
		function( elem, name, isXML ) {
			var fn = jQuery.expr.attrHandle[ name ],
				ret = isXML ?
					undefined :
					/* jshint eqeqeq: false */
					(jQuery.expr.attrHandle[ name ] = undefined) !=
						getter( elem, name, isXML ) ?

						name.toLowerCase() :
						null;
			jQuery.expr.attrHandle[ name ] = fn;
			return ret;
		} :
		function( elem, name, isXML ) {
			return isXML ?
				undefined :
				elem[ jQuery.camelCase( "default-" + name ) ] ?
					name.toLowerCase() :
					null;
		};
});

// fix oldIE attroperties
if ( !getSetInput || !getSetAttribute ) {
	jQuery.attrHooks.value = {
		set: function( elem, value, name ) {
			if ( jQuery.nodeName( elem, "input" ) ) {
				// Does not return so that setAttribute is also used
				elem.defaultValue = value;
			} else {
				// Use nodeHook if defined (#1954); otherwise setAttribute is fine
				return nodeHook && nodeHook.set( elem, value, name );
			}
		}
	};
}

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = {
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				elem.setAttributeNode(
					(ret = elem.ownerDocument.createAttribute( name ))
				);
			}

			ret.value = value += "";

			// Break association with cloned elements by also using setAttribute (#9646)
			return name === "value" || value === elem.getAttribute( name ) ?
				value :
				undefined;
		}
	};
	jQuery.expr.attrHandle.id = jQuery.expr.attrHandle.name = jQuery.expr.attrHandle.coords =
		// Some attributes are constructed with empty-string values when not defined
		function( elem, name, isXML ) {
			var ret;
			return isXML ?
				undefined :
				(ret = elem.getAttributeNode( name )) && ret.value !== "" ?
					ret.value :
					null;
		};
	jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret = elem.getAttributeNode( name );
			return ret && ret.specified ?
				ret.value :
				undefined;
		},
		set: nodeHook.set
	};

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		set: function( elem, value, name ) {
			nodeHook.set( elem, value === "" ? false : value, name );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		};
	});
}


// Some attributes require a special call on IE
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !jQuery.support.hrefNormalized ) {
	// href/src property should get the full normalized URL (#10299/#12915)
	jQuery.each([ "href", "src" ], function( i, name ) {
		jQuery.propHooks[ name ] = {
			get: function( elem ) {
				return elem.getAttribute( name, 4 );
			}
		};
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Note: IE uppercases css property names, but if we were to .toLowerCase()
			// .cssText, that would destroy case senstitivity in URL's, like in "background"
			return elem.style.cssText || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !jQuery.support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			// Support: Webkit
			// "" is returned instead of "on" if a value isn't specified
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});
var rformElems = /^(?:input|select|textarea)$/i,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {
		var tmp, events, t, handleObjIn,
			special, eventHandle, handleObj,
			handlers, type, namespaces, origType,
			elemData = jQuery._data( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== core_strundefined && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {
		var j, handleObj, tmp,
			origCount, t, events,
			special, handlers, type,
			namespaces, origType,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( core_rnotwhite ) || [""];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery._removeData( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		var handle, ontype, cur,
			bubbleType, special, tmp, i,
			eventPath = [ elem || document ],
			type = core_hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = core_hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && elem[ type ] && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					try {
						elem[ type ]();
					} catch ( e ) {
						// IE<9 dies on focus/blur to hidden element (#1486,#12518)
						// only reproducible on winXP IE8 native, not IE9 in IE8 mode
					}
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, ret, handleObj, matched, j,
			handlerQueue = [],
			args = core_slice.call( arguments ),
			handlers = ( jQuery._data( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var sel, handleObj, matches, i,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			/* jshint eqeqeq: false */
			for ( ; cur != this; cur = cur.parentNode || this ) {
				/* jshint eqeqeq: true */

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click") ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: IE<9
		// Fix target property (#1925)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Support: Chrome 23+, Safari?
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Support: IE<9
		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328)
		event.metaKey = !!event.metaKey;

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var body, eventDoc, doc,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					try {
						this.focus();
						return false;
					} catch ( e ) {
						// Support: IE<9
						// If we error on focus to hidden element (#1486, #12518),
						// let .trigger() run the handlers
					}
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( jQuery.nodeName( this, "input" ) && this.type === "checkbox" && this.click ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Even when returnValue equals to undefined Firefox will still show alert
				if ( event.result !== undefined ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === core_strundefined ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;
		if ( !e ) {
			return;
		}

		// If preventDefault exists, run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// Support: IE
		// Otherwise set the returnValue property of the original event to false
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;
		if ( !e ) {
			return;
		}
		// If stopPropagation exists, run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}

		// Support: IE
		// Set the cancelBubble property of the original event to true
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "submitBubbles" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "submitBubbles", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "changeBubbles" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "changeBubbles", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var type, origFn;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});
var isSimple = /^.[^:#\[\.,]*$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},

	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					cur = ret.push( cur );
					break;
				}
			}
		}

		return this.pushStack( ret.length > 1 ? jQuery.unique( ret ) : ret );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.first().prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( jQuery.unique(all) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				ret = jQuery.unique( ret );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				ret = ret.reverse();
			}
		}

		return this.pushStack( ret );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		var elem = elems[ 0 ];

		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 && elem.nodeType === 1 ?
			jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
			jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
				return elem.nodeType === 1;
			}));
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) !== not;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
		safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	manipulation_rcheckableType = /^(?:checkbox|radio)$/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		area: [ 1, "<map>", "</map>" ],
		param: [ 1, "<object>", "</object>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
		// unless wrapped in a div with non-breaking characters in front of it.
		_default: jQuery.support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>"  ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem, false ) );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}

			// If this is a select, ensure that it displays empty (#12336)
			// Support: IE<9
			if ( elem.options && jQuery.nodeName( elem, "select" ) ) {
				elem.options.length = 0;
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var
			// Snapshot the DOM in case .domManip sweeps something relevant into its fragment
			args = jQuery.map( this, function( elem ) {
				return [ elem.nextSibling, elem.parentNode ];
			}),
			i = 0;

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			var next = args[ i++ ],
				parent = args[ i++ ];

			if ( parent ) {
				// Don't use the snapshot next if it has moved (#13810)
				if ( next && next.parentNode !== parent ) {
					next = this.nextSibling;
				}
				jQuery( this ).remove();
				parent.insertBefore( elem, next );
			}
		// Allow new content to include elements from the context set
		}, true );

		// Force removal if there was no new content (e.g., from empty arguments)
		return i ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback, allowIntersection ) {

		// Flatten any nested arrays
		args = core_concat.apply( [], args );

		var first, node, hasScripts,
			scripts, doc, fragment,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[0],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction || !( l <= 1 || typeof value !== "string" || jQuery.support.checkClone || !rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[0] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback, allowIntersection );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, !allowIntersection && this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[i], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!jQuery._data( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Hope ajax is available...
								jQuery._evalUrl( node.src );
							} else {
								jQuery.globalEval( ( node.text || node.textContent || node.innerHTML || "" ).replace( rcleanScript, "" ) );
							}
						}
					}
				}

				// Fix #11809: Avoid leaking memory
				fragment = first = null;
			}
		}

		return this;
	}
});

// Support: IE<8
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType === 1 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (jQuery.find.attr( elem, "type" ) !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );
	if ( match ) {
		elem.type = match[1];
	} else {
		elem.removeAttribute("type");
	}
	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var elem,
		i = 0;
	for ( ; (elem = elems[i]) != null; i++ ) {
		jQuery._data( elem, "globalEval", !refElements || jQuery._data( refElements[i], "globalEval" ) );
	}
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function fixCloneNodeIssues( src, dest ) {
	var nodeName, e, data;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	nodeName = dest.nodeName.toLowerCase();

	// IE6-8 copies events bound via attachEvent when using cloneNode.
	if ( !jQuery.support.noCloneEvent && dest[ jQuery.expando ] ) {
		data = jQuery._data( dest );

		for ( e in data.events ) {
			jQuery.removeEvent( dest, e, data.handle );
		}

		// Event data gets referenced instead of copied if the expando gets copied too
		dest.removeAttribute( jQuery.expando );
	}

	// IE blanks contents when cloning scripts, and tries to evaluate newly-set text
	if ( nodeName === "script" && dest.text !== src.text ) {
		disableScript( dest ).text = src.text;
		restoreScript( dest );

	// IE6-10 improperly clones children of object elements using classid.
	// IE10 throws NoModificationAllowedError if parent is null, #12132.
	} else if ( nodeName === "object" ) {
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && ( src.innerHTML && !jQuery.trim(dest.innerHTML) ) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && manipulation_rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.defaultSelected = dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone(true);
			jQuery( insert[i] )[ original ]( elems );

			// Modern browsers can apply jQuery collections as arrays, but oldIE needs a .get()
			core_push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});

function getAll( context, tag ) {
	var elems, elem,
		i = 0,
		found = typeof context.getElementsByTagName !== core_strundefined ? context.getElementsByTagName( tag || "*" ) :
			typeof context.querySelectorAll !== core_strundefined ? context.querySelectorAll( tag || "*" ) :
			undefined;

	if ( !found ) {
		for ( found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++ ) {
			if ( !tag || jQuery.nodeName( elem, tag ) ) {
				found.push( elem );
			} else {
				jQuery.merge( found, getAll( elem, tag ) );
			}
		}
	}

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], found ) :
		found;
}

// Used in buildFragment, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( manipulation_rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var destElements, node, clone, i, srcElements,
			inPage = jQuery.contains( elem.ownerDocument, elem );

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			// Fix all IE cloning issues
			for ( i = 0; (node = srcElements[i]) != null; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					fixCloneNodeIssues( node, destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0; (node = srcElements[i]) != null; i++ ) {
					cloneCopyEvent( node, destElements[i] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		destElements = srcElements = node = null;

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var j, elem, contains,
			tmp, tag, tbody, wrap,
			l = elems.length,

			// Ensure a safe fragment
			safe = createSafeFragment( context ),

			nodes = [],
			i = 0;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || safe.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;

					tmp.innerHTML = wrap[1] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[2];

					// Descend through wrappers to the right content
					j = wrap[0];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Manually add leading whitespace removed by IE
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						nodes.push( context.createTextNode( rleadingWhitespace.exec( elem )[0] ) );
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						elem = tag === "table" && !rtbody.test( elem ) ?
							tmp.firstChild :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !rtbody.test( elem ) ?
								tmp :
								0;

						j = elem && elem.childNodes.length;
						while ( j-- ) {
							if ( jQuery.nodeName( (tbody = elem.childNodes[j]), "tbody" ) && !tbody.childNodes.length ) {
								elem.removeChild( tbody );
							}
						}
					}

					jQuery.merge( nodes, tmp.childNodes );

					// Fix #12392 for WebKit and IE > 9
					tmp.textContent = "";

					// Fix #12392 for oldIE
					while ( tmp.firstChild ) {
						tmp.removeChild( tmp.firstChild );
					}

					// Remember the top-level container for proper cleanup
					tmp = safe.lastChild;
				}
			}
		}

		// Fix #11356: Clear elements from fragment
		if ( tmp ) {
			safe.removeChild( tmp );
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			jQuery.grep( getAll( nodes, "input" ), fixDefaultChecked );
		}

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( safe.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		tmp = null;

		return safe;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var elem, type, id, data,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( typeof elem.removeAttribute !== core_strundefined ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						core_deletedIds.push( id );
					}
				}
			}
		}
	},

	_evalUrl: function( url ) {
		return jQuery.ajax({
			url: url,
			type: "GET",
			dataType: "script",
			async: false,
			global: false,
			"throws": true
		});
	}
});
jQuery.fn.extend({
	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});
var iframe, getStyles, curCSS,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity\s*=\s*([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + core_pnum + ")", "i" ),
	elemdisplay = { BODY: "block" },

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	// isHidden might be called from jQuery#filter function;
	// in that case, element will be second argument
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = jQuery._data( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {

			if ( !values[ index ] ) {
				hidden = isHidden( elem );

				if ( display && display !== "none" || !hidden ) {
					jQuery._data( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			var len, styles,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Fixes #8908, it can be done more correctly by specifing setters in cssHooks,
			// but it would mean to define eight (for every problematic property) identical functions
			if ( !jQuery.support.clearCloneStyle && value === "" && name.indexOf("background") === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {

				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var num, val, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

// NOTE: we've included the "window" in window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	getStyles = function( elem ) {
		return window.getComputedStyle( elem, null );
	};

	curCSS = function( elem, name, _computed ) {
		var width, minWidth, maxWidth,
			computed = _computed || getStyles( elem ),

			// getPropertyValue is only needed for .css('filter') in IE9, see #12537
			ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undefined,
			style = elem.style;

		if ( computed ) {

			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

				// Remember the original values
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				// Put in the new values to get a computed value out
				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				// Revert the changed values
				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	getStyles = function( elem ) {
		return elem.currentStyle;
	};

	curCSS = function( elem, name, _computed ) {
		var left, rs, rsLeft,
			computed = _computed || getStyles( elem ),
			ret = computed ? computed[ name ] : undefined,
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rs = elem.runtimeStyle;
			rsLeft = rs && rs.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				rs.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				rs.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {
			// Use the already-created iframe if possible
			iframe = ( iframe ||
				jQuery("<iframe frameborder='0' width='0' height='0'/>")
				.css( "cssText", "display:block !important" )
			).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = ( iframe[0].contentWindow || iframe[0].contentDocument ).document;
			doc.write("<!doctype html><html><body>");
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}

// Called ONLY from within css_defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),
		display = jQuery.css( elem[0], "display" );
	elem.remove();
	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				return elem.offsetWidth === 0 && rdisplayswap.test( jQuery.css( elem, "display" ) ) ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			// if value === "", then remove inline opacity #12685
			if ( ( value >= 1 || value === "" ) &&
					jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
					style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there is no filter style applied in a css rule or unset inline opacity, we are done
				if ( value === "" || currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				if ( computed ) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					return jQuery.swap( elem, { "display": "inline-block" },
						curCSS, [ elem, "marginRight" ] );
				}
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						computed = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( computed ) ?
							jQuery( elem ).position()[ prop ] + "px" :
							computed;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		// Support: Opera <= 12.12
		// Opera reports offsetWidths and offsetHeights less than zero on some elements
		return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 ||
			(!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function(){
			var type = this.type;
			// Use .is(":disabled") so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !manipulation_rcheckableType.test( type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});
var
	// Document location
	ajaxLocParts,
	ajaxLocation,
	ajax_nonce = jQuery.now(),

	ajax_rquery = /\?/,
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat("*");

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( core_rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var deep, key,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, response, type,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ){
	jQuery.fn[ type ] = function( fn ){
		return this.on( type, fn );
	};
});

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // Cross-domain detection vars
			parts,
			// Loop variable
			i,
			// URL without anti-cache param
			cacheURL,
			// Response headers as string
			responseHeadersString,
			// timeout handle
			timeoutTimer,

			// To know if global events are to be dispatched
			fireGlobals,

			transport,
			// Response headers
			responseHeaders,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( core_rnotwhite ) || [""];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + ajax_nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( ajax_rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ajax_nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {
	var firstDataType, ct, finalDataType, type,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || jQuery("head")[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement("script");

				script.async = true;

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( script.parentNode ) {
							script.parentNode.removeChild( script );
						}

						// Dereference the script
						script = null;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};

				// Circumvent IE6 bugs with base elements (#2709 and #4378) by prepending
				// Use native DOM manipulation to avoid our domManip AJAX trickery
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( undefined, true );
				}
			}
		};
	}
});
var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( ajax_nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( ajax_rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
var xhrCallbacks, xhrSupported,
	xhrId = 0,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject && function() {
		// Abort all pending requests
		var key;
		for ( key in xhrCallbacks ) {
			xhrCallbacks[ key ]( undefined, true );
		}
	};

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject("Microsoft.XMLHTTP");
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
xhrSupported = jQuery.ajaxSettings.xhr();
jQuery.support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
xhrSupported = jQuery.support.ajax = !!xhrSupported;

// Create transport if the browser can provide an xhr
if ( xhrSupported ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers["X-Requested-With"] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( err ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {
						var status, responseHeaders, statusText, responses;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									responses = {};
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									if ( typeof xhr.responseText === "string" ) {
										responses.text = xhr.responseText;
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback( undefined, true );
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*
					// Use a string for doubling factor so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// we're done with this property
			return tween;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// archaic crash bug won't allow us to use 1 - ( 0.5 || 0 ) (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = jQuery._data( elem, "fxshow" );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.always(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = jQuery._data( elem, "fxshow", {} );
		}

		// store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery._removeData( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9
// Panic based approach to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || jQuery._data( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = jQuery._data( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// enable finishing flag on private data
			data.finish = true;

			// empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// turn off finishing flag
			delete data.finish;
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) ) {
		jQuery.fx.start();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, win,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== core_strundefined ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	return {
		top: box.top  + ( win.pageYOffset || docElem.scrollTop )  - ( docElem.clientTop  || 0 ),
		left: box.left + ( win.pageXOffset || docElem.scrollLeft ) - ( docElem.clientLeft || 0 )
	};
};

jQuery.offset = {

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			parentOffset = { top: 0, left: 0 },
			elem = this[ 0 ];

		// fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// we assume that getBoundingClientRect is available when computed position is fixed
			offset = elem.getBoundingClientRect();
		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top  += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		return {
			top:  offset.top  - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true)
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;
			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position") === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || docElem;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Limit scope pollution from any deprecated API
// (function() {

// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;

// })();
if ( typeof module === "object" && module && typeof module.exports === "object" ) {
	// Expose jQuery as module.exports in loaders that implement the Node
	// module pattern (including browserify). Do not create the global, since
	// the user will be storing it themselves locally, and globals are frowned
	// upon in the Node module world.
	module.exports = jQuery;
} else {
	// Otherwise expose jQuery to the global object as usual
	window.jQuery = window.$ = jQuery;

	// Register as a named AMD module, since jQuery can be concatenated with other
	// files that may use define, but not via a proper concatenation script that
	// understands anonymous AMD modules. A named AMD is safest and most robust
	// way to register. Lowercase jquery is used because AMD module names are
	// derived from file names, and jQuery is normally delivered in a lowercase
	// file name. Do this after creating the global so that if an AMD module wants
	// to call noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd ) {
		define( "jquery", [], function () { return jQuery; } );
	}
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 * https://github.com/rails/jquery-ujs
 *
 * Requires jQuery 1.7.0 or later.
 *
 * Released under the MIT license
 *
 */

  // Cut down on the number of issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  if ( $.rails !== undefined ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;
  var $document = $(document);

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Button elements boud jquery-ujs
    buttonClickSelector: 'button[data-remote]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input[type=file]',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else if (element.is(rails.buttonClickSelector)) {
          method = element.data('method') || 'get';
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          crossDomain: crossDomain
        };

        // There is no withCredentials for IE6-8 when
        // "Enable native XMLHTTP support" is disabled
        if (withCredentials) {
          options.xhrFields = {
            withCredentials: withCredentials
          };
        }

        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is('input[type=checkbox],input[type=radio]') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is('input[type=radio]') && allInputs.filter('input[type=radio]:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        element.removeData('ujs:enable-with'); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($document, 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $document.delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $document.delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $document.delegate(rails.buttonClickSelector, 'click.rails', function(e) {
      var button = $(this);
      if (!rails.allowAction(button)) return rails.stopEverything(e);

      rails.handleRemote(button);
      return false;
    });

    $document.delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $document.delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $document.delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $document.delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      var csrf_token = $('meta[name=csrf-token]').attr('content');
      var csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
!function(r,t){"use strict";var d=t.support.touch=!!("ontouchstart"in window||window.DocumentTouch&&r instanceof DocumentTouch),e="._tap",i="tap",f=40,l=400,a="clientX clientY screenX screenY pageX pageY".split(" "),s=function(n,e){var c;return c=Array.prototype.indexOf?n.indexOf(e):t.inArray(e,n)},n={$el:null,x:0,y:0,count:0,cancel:!1,start:0},u=function(o,i){var n=i.originalEvent,c=t.Event(n),r=n.changedTouches?n.changedTouches[0]:n;c.type=o;for(var e=0,u=a.length;u>e;e++)c[a[e]]=r[a[e]];return c},g=function(t){var o=t.originalEvent,e=t.changedTouches?t.changedTouches[0]:o.changedTouches[0],i=Math.abs(e.pageX-n.x),a=Math.abs(e.pageY-n.y),r=Math.max(i,a);return Date.now()-n.start<l&&f>r&&!n.cancel&&1===n.count&&c.isTracking},c={isEnabled:!1,isTracking:!1,enable:function(){return this.isEnabled?this:(this.isEnabled=!0,t(r.body).on("touchstart"+e,this.onTouchStart).on("touchend"+e,this.onTouchEnd).on("touchcancel"+e,this.onTouchCancel),this)},disable:function(){return this.isEnabled?(this.isEnabled=!1,t(r.body).off("touchstart"+e,this.onTouchStart).off("touchend"+e,this.onTouchEnd).off("touchcancel"+e,this.onTouchCancel),this):this},onTouchStart:function(e){var o=e.originalEvent.touches;if(n.count=o.length,!c.isTracking){c.isTracking=!0;var i=o[0];n.cancel=!1,n.start=Date.now(),n.$el=t(e.target),n.x=i.pageX,n.y=i.pageY}},onTouchEnd:function(t){g(t)&&n.$el.trigger(u(i,t)),c.onTouchCancel(t)},onTouchCancel:function(){c.isTracking=!1,n.cancel=!0}};if(t.event.special[i]={setup:function(){c.enable()}},!d){var o=[],h=function(n){var e=n.originalEvent;if(!(n.isTrigger||s(o,e)>=0)){o.length>3&&o.splice(0,o.length-3),o.push(e);var c=u(i,n);t(n.target).trigger(c)}};t.event.special[i]={setup:function(){t(this).on("click"+e,h)},teardown:function(){t(this).off("click"+e,h)}}}}(document,jQuery);
/* ========================================================================
 * Bootstrap: transition.js v3.0.3
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      'WebkitTransition' : 'webkitTransitionEnd'
    , 'MozTransition'    : 'transitionend'
    , 'OTransition'      : 'oTransitionEnd otransitionend'
    , 'transition'       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false, $el = this
    $(this).one($.support.transition.end, function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: alert.js v3.0.3
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.hasClass('alert') ? $this : $this.parent()
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent.trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one($.support.transition.end, removeElement)
        .emulateTransitionEnd(150) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  var old = $.fn.alert

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);
/* ========================================================================
 * Bootstrap: button.js v3.0.3
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element = $(element)
    this.options  = $.extend({}, Button.DEFAULTS, options)
  }

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (!data.resetText) $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d);
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.closest('[data-toggle="buttons"]')
    var changed = true

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') === 'radio') {
        // see if clicking on current one
        if ($input.prop('checked') && this.$element.hasClass('active'))
          changed = false
        else
          $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  var old = $.fn.button

  $.fn.button = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document).on('click.bs.button.data-api', '[data-toggle^=button]', function (e) {
    var $btn = $(e.target)
    if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
    $btn.button('toggle')
    e.preventDefault()
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: carousel.js v3.0.3
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.DEFAULTS = {
    interval: 5000
  , pause: 'hover'
  , wrap: true
  }

  Carousel.prototype.cycle =  function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getActiveIndex = function () {
    this.$active = this.$element.find('.item.active')
    this.$items  = this.$active.parent().children()

    return this.$items.index(this.$active)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getActiveIndex()

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) })
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', $(this.$items[pos]))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition.end) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || $active[type]()
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var fallback  = type == 'next' ? 'first' : 'last'
    var that      = this

    if (!$next.length) {
      if (!this.options.wrap) return
      $next = this.$element.find('.item')[fallback]()
    }

    this.sliding = true

    isCycling && this.pause()

    var e = $.Event('slide.bs.carousel', { relatedTarget: $next[0], direction: direction })

    if ($next.hasClass('active')) return

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      this.$element.one('slid.bs.carousel', function () {
        var $nextIndicator = $(that.$indicators.children()[that.getActiveIndex()])
        $nextIndicator && $nextIndicator.addClass('active')
      })
    }

    if ($.support.transition && this.$element.hasClass('slide')) {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid.bs.carousel') }, 0)
        })
        .emulateTransitionEnd(600)
    } else {
      this.$element.trigger(e)
      if (e.isDefaultPrevented()) return
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger('slid.bs.carousel')
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  var old = $.fn.carousel

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  $(document).on('click.bs.carousel.data-api', '[data-slide], [data-slide-to]', function (e) {
    var $this   = $(this), href
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    $target.carousel(options)

    if (slideIndex = $this.attr('data-slide-to')) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  })

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      $carousel.carousel($carousel.data())
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: collapse.js v3.0.3
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.transitioning = null

    if (this.options.parent) this.$parent = $(this.options.parent)
    if (this.options.toggle) this.toggle()
  }

  Collapse.DEFAULTS = {
    toggle: true
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var actives = this.$parent && this.$parent.find('> .panel > .in')

    if (actives && actives.length) {
      var hasData = actives.data('bs.collapse')
      if (hasData && hasData.transitioning) return
      actives.collapse('hide')
      hasData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')
      [dimension](0)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('in')
        [dimension]('auto')
      this.transitioning = 0
      this.$element.trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
      [dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element
      [dimension](this.$element[dimension]())
      [0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse')
      .removeClass('in')

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .trigger('hidden.bs.collapse')
        .removeClass('collapsing')
        .addClass('collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one($.support.transition.end, $.proxy(complete, this))
      .emulateTransitionEnd(350)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  var old = $.fn.collapse

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle=collapse]', function (e) {
    var $this   = $(this), href
    var target  = $this.attr('data-target')
        || e.preventDefault()
        || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
    var $target = $(target)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $this.data()
    var parent  = $this.attr('data-parent')
    var $parent = parent && $(parent)

    if (!data || !data.transitioning) {
      if ($parent) $parent.find('[data-toggle=collapse][data-parent="' + parent + '"]').not($this).addClass('collapsed')
      $this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
    }

    $target.collapse(option)
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: dropdown.js v3.0.3
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle=dropdown]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      $parent.trigger(e = $.Event('show.bs.dropdown'))

      if (e.isDefaultPrevented()) return

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown')

      $this.focus()
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27)/.test(e.keyCode)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if (!isActive || (isActive && e.keyCode == 27)) {
      if (e.which == 27) $parent.find(toggle).focus()
      return $this.click()
    }

    var $items = $('[role=menu] li:not(.divider):visible a', $parent)

    if (!$items.length) return

    var index = $items.index($items.filter(':focus'))

    if (e.keyCode == 38 && index > 0)                 index--                        // up
    if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index=0

    $items.eq(index).focus()
  }

  function clearMenus() {
    $(backdrop).remove()
    $(toggle).each(function (e) {
      var $parent = getParent($(this))
      if (!$parent.hasClass('open')) return
      $parent.trigger(e = $.Event('hide.bs.dropdown'))
      if (e.isDefaultPrevented()) return
      $parent.removeClass('open').trigger('hidden.bs.dropdown')
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  var old = $.fn.dropdown

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)

}(jQuery);
/* ========================================================================
 * Bootstrap: modal.js v3.0.3
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options   = options
    this.$element  = $(element)
    this.$backdrop =
    this.isShown   = null

    if (this.options.remote) this.$element.load(this.options.remote)
  }

  Modal.DEFAULTS = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this[!this.isShown ? 'show' : 'hide'](_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.escape()

    this.$element.on('click.dismiss.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(document.body) // don't move modals dom position
      }

      that.$element.show()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one($.support.transition.end, function () {
            that.$element.focus().trigger(e)
          })
          .emulateTransitionEnd(300) :
        that.$element.focus().trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one($.support.transition.end, $.proxy(this.hideModal, this))
        .emulateTransitionEnd(300) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.focus()
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keyup.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keyup.dismiss.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.removeBackdrop()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that    = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .appendTo(document.body)

      this.$element.on('click.dismiss.modal', $.proxy(function (e) {
        if (e.target !== e.currentTarget) return
        this.options.backdrop == 'static'
          ? this.$element[0].focus.call(this.$element[0])
          : this.hide.call(this)
      }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      $.support.transition && this.$element.hasClass('fade')?
        this.$backdrop
          .one($.support.transition.end, callback)
          .emulateTransitionEnd(150) :
        callback()

    } else if (callback) {
      callback()
    }
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  var old = $.fn.modal

  $.fn.modal = function (option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
    var option  = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    e.preventDefault()

    $target
      .modal(option, this)
      .one('hide', function () {
        $this.is(':visible') && $this.focus()
      })
  })

  $(document)
    .on('show.bs.modal',  '.modal', function () { $(document.body).addClass('modal-open') })
    .on('hidden.bs.modal', '.modal', function () { $(document.body).removeClass('modal-open') })

}(jQuery);
/* ========================================================================
 * Bootstrap: tooltip.js v3.0.3
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.DEFAULTS = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover focus'
  , title: ''
  , delay: 0
  , html: false
  , container: false
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled  = true
    this.type     = type
    this.$element = $(element)
    this.options  = this.getOptions(options)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focus'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'blur'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay
      , hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.'+ this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      var $tip = this.tip()

      this.setContent()

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var $parent = this.$element.parent()

        var orgPlacement = placement
        var docScroll    = document.documentElement.scrollTop || document.body.scrollTop
        var parentWidth  = this.options.container == 'body' ? window.innerWidth  : $parent.outerWidth()
        var parentHeight = this.options.container == 'body' ? window.innerHeight : $parent.outerHeight()
        var parentLeft   = this.options.container == 'body' ? 0 : $parent.offset().left

        placement = placement == 'bottom' && pos.top   + pos.height  + actualHeight - docScroll > parentHeight  ? 'top'    :
                    placement == 'top'    && pos.top   - docScroll   - actualHeight < 0                         ? 'bottom' :
                    placement == 'right'  && pos.right + actualWidth > parentWidth                              ? 'left'   :
                    placement == 'left'   && pos.left  - actualWidth < parentLeft                               ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)
      this.$element.trigger('shown.bs.' + this.type)
    }
  }

  Tooltip.prototype.applyPlacement = function(offset, placement) {
    var replace
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    $tip
      .offset(offset)
      .addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      replace = true
      offset.top = offset.top + height - actualHeight
    }

    if (/bottom|top/.test(placement)) {
      var delta = 0

      if (offset.left < 0) {
        delta       = offset.left * -2
        offset.left = 0

        $tip.offset(offset)

        actualWidth  = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight
      }

      this.replaceArrow(delta - width + actualWidth, actualWidth, 'left')
    } else {
      this.replaceArrow(actualHeight - height, actualHeight, 'top')
    }

    if (replace) $tip.offset(offset)
  }

  Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
    this.arrow().css(position, delta ? (50 * (1 - delta / dimension) + "%") : '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function () {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one($.support.transition.end, complete)
        .emulateTransitionEnd(150) :
      complete()

    this.$element.trigger('hidden.bs.' + this.type)

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function () {
    var el = this.$element[0]
    return $.extend({}, (typeof el.getBoundingClientRect == 'function') ? el.getBoundingClientRect() : {
      width: el.offsetWidth
    , height: el.offsetHeight
    }, this.$element.offset())
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2  } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width   }
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.tip = function () {
    return this.$tip = this.$tip || $(this.options.template)
  }

  Tooltip.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow')
  }

  Tooltip.prototype.validate = function () {
    if (!this.$element[0].parentNode) {
      this.hide()
      this.$element = null
      this.options  = null
    }
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = e ? $(e.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type) : this
    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    this.hide().$element.off('.' + this.type).removeData('bs.' + this.type)
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  var old = $.fn.tooltip

  $.fn.tooltip = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);
/* ========================================================================
 * Bootstrap: popover.js v3.0.3
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.DEFAULTS = $.extend({} , $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content')[this.options.html ? 'html' : 'text'](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return this.$arrow = this.$arrow || this.tip().find('.arrow')
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  var old = $.fn.popover

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);
/* ========================================================================
 * Bootstrap: scrollspy.js v3.0.3
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var href
    var process  = $.proxy(this.process, this)

    this.$element       = $(element).is('body') ? $(window) : $(element)
    this.$body          = $('body')
    this.$scrollElement = this.$element.on('scroll.bs.scroll-spy.data-api', process)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.offsets        = $([])
    this.targets        = $([])
    this.activeTarget   = null

    this.refresh()
    this.process()
  }

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = this.$element[0] == window ? 'offset' : 'position'

    this.offsets = $([])
    this.targets = $([])

    var self     = this
    var $targets = this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#\w/.test(href) && $(href)

        return ($href
          && $href.length
          && [[ $href[offsetMethod]().top + (!$.isWindow(self.$scrollElement.get(0)) && self.$scrollElement.scrollTop()), href ]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
    var maxScroll    = scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets.last()[0]) && this.activate(i)
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate( targets[i] )
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    $(this.selector)
      .parents('.active')
      .removeClass('active')

    var selector = this.selector
      + '[data-target="' + target + '"],'
      + this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length)  {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  var old = $.fn.scrollspy

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: tab.js v3.0.3
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var previous = $ul.find('.active:last a')[0]
    var e        = $.Event('show.bs.tab', {
      relatedTarget: previous
    })

    $this.trigger(e)

    if (e.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.parent('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $this.trigger({
        type: 'shown.bs.tab'
      , relatedTarget: previous
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && $active.hasClass('fade')

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
        .removeClass('active')

      element.addClass('active')

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element.closest('li.dropdown').addClass('active')
      }

      callback && callback()
    }

    transition ?
      $active
        .one($.support.transition.end, next)
        .emulateTransitionEnd(150) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  var old = $.fn.tab

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  $(document).on('click.bs.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: affix.js v3.0.3
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2013 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================================== */



+function ($) { "use strict";

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)
    this.$window = $(window)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element = $(element)
    this.affixed  =
    this.unpin    = null

    this.checkPosition()
  }

  Affix.RESET = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
    var scrollTop    = this.$window.scrollTop()
    var position     = this.$element.offset()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    var affix = this.unpin   != null && (scrollTop + this.unpin <= position.top) ? false :
                offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
                offsetTop    != null && (scrollTop <= offsetTop) ? 'top' : false

    if (this.affixed === affix) return
    if (this.unpin) this.$element.css('top', '')

    this.affixed = affix
    this.unpin   = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(Affix.RESET).addClass('affix' + (affix ? '-' + affix : ''))

    if (affix == 'bottom') {
      this.$element.offset({ top: document.body.offsetHeight - offsetBottom - this.$element.height() })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  var old = $.fn.affix

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom) data.offset.bottom = data.offsetBottom
      if (data.offsetTop)    data.offset.top    = data.offsetTop

      $spy.affix(data)
    })
  })

}(jQuery);












/*

Compiled Tuesday November 19, 2013 at 12:18pm America/New_York

Version: libphonenumber r622

------------------------------------------------------------------------


 Copyright (C) Alan Beebe (alan.beebe@gmail.com).

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 


Usage...

This is the same type of code used by cell phones when you enter
a phone number into your dialer app.  Your phone already knows
what country you are a subscriber in, so it assumes you are entering
a local number, unless of course you prefix the number with a +, or
in the USA you could also prefix the number with 011 to indicate you
wish to dial internationally.  This code functions the same way.

Lets assume your in the United States and you enter the following
phone number: 8646978257

formatE164("US", "8646978257");
 Returns: +18646978257

countryForE164Number("US", "+18646978257");
 Returns: US

formatInternational("US", "8646978257");
 Returns: (864) 697-8257
 Info: This is the format you use if you are displaying this number to users outside the US
 
formatLocal("US", "8646978257");
 Returns: (864) 697-8257
 Info: This is the format you use if you are displaying this number to users inside the US
       (In certain countries, this format will be different then the international format)
 
countryCodeToName("US");
 Returns: United States
        
        

*/


// -------------------------------------------------------------------------
function countryForE164Number(phone) {
        /*
        
        Return the country code for an e164 formatted number
        
        phone (String) phone number in e164 format to return the country code for
        
        */
        try {
                var phone = cleanPhone(phone);
                var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance();
                var number = phoneUtil.parseAndKeepRawInput(phone);
            var output = new goog.string.StringBuffer();
            output = phoneUtil.getRegionCodeForNumber(number);
            return output.toString();
    } catch (e) {
            return "";
    }
}

// -------------------------------------------------------------------------
function formatNumberForMobileDialing(country, phone) {
        /*
        
        Returns a number formatted in such a way that it can be dialed from a mobile
        phone in a specific region. If the number cannot be reached from the region
        (e.g. some countries block toll-free numbers from being called outside of the
        country), the method returns an empty string.
        
        */
        
        try {
                var phone = cleanPhone(phone);
                var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance();
                var number = phoneUtil.parseAndKeepRawInput(phone, country);
            var output = new goog.string.StringBuffer();
            output = phoneUtil.formatNumberForMobileDialing(number, country, true);
            return output.toString();
    } catch (e) {
            return "";
    }
}

// -------------------------------------------------------------------------
function isValidNumber(phone, country) {
        /*
        
        Tests whether a phone number matches a valid pattern. Note this doesn't
        verify the number is actually in use, which is impossible to tell by just
        looking at a number itself.
        
        */
        
        try {
                var phone = cleanPhone(phone);
                var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance();
                var number = phoneUtil.parseAndKeepRawInput(phone, country);
            return phoneUtil.isValidNumber(number);
    } catch (e) {
            return false;
    }
}

// -------------------------------------------------------------------------
function formatE164(country, phone) {
        /*
        
        Return the phone number in e164 format
        
        country (String) 2 digit country code
        phone (String) phone number to format
        
        */
        
        try {
                var phone = cleanPhone(phone);
                var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance();
                var number = phoneUtil.parseAndKeepRawInput(phone, country);
                var PNF = i18n.phonenumbers.PhoneNumberFormat;
            var output = new goog.string.StringBuffer();
            output = phoneUtil.format(number, PNF.E164);
            return output.toString();
    } catch (e) {
            return phone
    }
}


// -------------------------------------------------------------------------  
function formatInternational(country, phone) {
        /*
        
        Return the phone number in international format
        
        country (String) 2 digit country code
        phone (String) phone number to format
        
        */
        
        try {
                var phone = cleanPhone(phone);
            var formatter = new i18n.phonenumbers.AsYouTypeFormatter(country);
            var output = new goog.string.StringBuffer();
            for (var i = 0; i < phone.length; ++i) {
                        var inputChar = phone.charAt(i);
                        output = (formatter.inputDigit(inputChar));
                }
            return output.toString();
    } catch (e) {
            return phone;
    }
}

// -------------------------------------------------------------------------
function formatLocal(country, phone) {
        /*
        
        Return the phone number in the format local to the user
        
        country (String) 2 digit country code
        phone (String) phone number to format
        
        */
        
        try {
                var phone = cleanPhone(phone);
                var phoneUtil = i18n.phonenumbers.PhoneNumberUtil.getInstance();
                var number = phoneUtil.parseAndKeepRawInput(phone, country);
                if (phoneUtil.isValidNumberForRegion(number, country)) {
                        var PNF = i18n.phonenumbers.PhoneNumberFormat;
                    var output = new goog.string.StringBuffer();
                    output = phoneUtil.format(number, PNF.NATIONAL);
                    return output.toString();
                } else {
                        return formatInternational(country, phone);
                }
        } catch (e) {
                return formatInternational(country, phone);
        }
}
        
// -------------------------------------------------------------------------
function cleanPhone(phone) {
        /*
        
        Remove any non numeric characters from the phone number but leave any plus sign at the beginning
        
        phone (String) phone number to clean
        
        */
        
        phone = phone.replace(/[^\d\+]/g,'');
        if (phone.substr(0, 1) == "+") {
                phone = "+" + phone.replace(/[^\d]/g,'');
        } else {
                phone = phone.replace(/[^\d]/g,'');
        }
        return phone;
}

// -------------------------------------------------------------------------
function countryCodeToName(countryCode) {
        /*
        
        Convert the country code to a name
        
        country (String) 2 digit country code
        
        */
        
        var arrCountry = new Array();
        arrCountry['AF'] = "Afghanistan";
        arrCountry['AL'] = "Albania";
        arrCountry['DZ'] = "Algeria";
        arrCountry['AS'] = "American Samoa";
        arrCountry['AD'] = "Andorra";
        arrCountry['AO'] = "Angola";
        arrCountry['AI'] = "Anguilla";
        arrCountry['AQ'] = "Antarctica";
        arrCountry['AG'] = "Antigua And Barbuda";
        arrCountry['AR'] = "Argentina";
        arrCountry['AM'] = "Armenia";
        arrCountry['AW'] = "Aruba";
        arrCountry['AC'] = "Ascension Island";
        arrCountry['AU'] = "Australia";
        arrCountry['AT'] = "Austria";
        arrCountry['AZ'] = "Azerbaijan";
        arrCountry['BS'] = "Bahamas";
        arrCountry['BH'] = "Bahrain";
        arrCountry['BD'] = "Bangladesh";
        arrCountry['BB'] = "Barbados";
        arrCountry['BY'] = "Belarus";
        arrCountry['BE'] = "Belgium";
        arrCountry['BZ'] = "Belize";
        arrCountry['BJ'] = "Benin";
        arrCountry['BM'] = "Bermuda";
        arrCountry['BT'] = "Bhutan";
        arrCountry['BO'] = "Bolivia";
        arrCountry['BA'] = "Bosnia And Herzegovina";
        arrCountry['BW'] = "Botswana";
        arrCountry['BV'] = "Bouvet Island";
        arrCountry['BR'] = "Brazil";
        arrCountry['IO'] = "British Indian Ocean Territory";
        arrCountry['BN'] = "Brunei";
        arrCountry['BG'] = "Bulgaria";
        arrCountry['BF'] = "Burkina Faso";
        arrCountry['BI'] = "Burundi";
        arrCountry['KH'] = "Cambodia";
        arrCountry['CM'] = "Cameroon";
        arrCountry['CA'] = "Canada";
        arrCountry['CV'] = "Cape Verde";
        arrCountry['KY'] = "Cayman Islands";
        arrCountry['CF'] = "Central African Republic";
        arrCountry['TD'] = "Chad";
        arrCountry['CL'] = "Chile";
        arrCountry['CN'] = "China";
        arrCountry['CX'] = "Christmas Island";
        arrCountry['CC'] = "Cocos (Keeling) Islands";
        arrCountry['CO'] = "Columbia";
        arrCountry['KM'] = "Comoros";
        arrCountry['CG'] = "Congo";
        arrCountry['CK'] = "Cook Islands";
        arrCountry['CR'] = "Costa Rica";
        arrCountry['CI'] = "Cote D'Ivorie (Ivory Coast)";
        arrCountry['HR'] = "Croatia (Hrvatska)";
        arrCountry['CU'] = "Cuba";
        arrCountry['CY'] = "Cyprus";
        arrCountry['CZ'] = "Czech Republic";
        arrCountry['CD'] = "Democratic Republic Of Congo (Zaire)";
        arrCountry['DK'] = "Denmark";
        arrCountry['DJ'] = "Djibouti";
        arrCountry['DM'] = "Dominica";
        arrCountry['DO'] = "Dominican Republic";
        arrCountry['TL'] = "East Timor";
        arrCountry['EC'] = "Ecuador";
        arrCountry['EG'] = "Egypt";
        arrCountry['SV'] = "El Salvador";
        arrCountry['GQ'] = "Equatorial Guinea";
        arrCountry['ER'] = "Eritrea";
        arrCountry['EE'] = "Estonia";
        arrCountry['ET'] = "Ethiopia";
        arrCountry['FK'] = "Falkland Islands (Malvinas)";
        arrCountry['FO'] = "Faroe Islands";
        arrCountry['FJ'] = "Fiji";
        arrCountry['FI'] = "Finland";
        arrCountry['FR'] = "France";
        arrCountry['FX'] = "France, Metropolitan";
        arrCountry['GF'] = "French Guinea";
        arrCountry['PF'] = "French Polynesia";
        arrCountry['TF'] = "French Southern Territories";
        arrCountry['GA'] = "Gabon";
        arrCountry['GM'] = "Gambia";
        arrCountry['GE'] = "Georgia";
        arrCountry['DE'] = "Germany";
        arrCountry['GH'] = "Ghana";
        arrCountry['GI'] = "Gibraltar";
        arrCountry['GR'] = "Greece";
        arrCountry['GL'] = "Greenland";
        arrCountry['GD'] = "Grenada";
        arrCountry['GP'] = "Guadeloupe";
        arrCountry['GU'] = "Guam";
        arrCountry['GT'] = "Guatemala";
        arrCountry['GN'] = "Guinea";
        arrCountry['GW'] = "Guinea-Bissau";
        arrCountry['GY'] = "Guyana";
        arrCountry['HT'] = "Haiti";
        arrCountry['HM'] = "Heard And McDonald Islands";
        arrCountry['HN'] = "Honduras";
        arrCountry['HK'] = "Hong Kong";
        arrCountry['HU'] = "Hungary";
        arrCountry['IS'] = "Iceland";
        arrCountry['IN'] = "India";
        arrCountry['ID'] = "Indonesia";
        arrCountry['IR'] = "Iran";
        arrCountry['IQ'] = "Iraq";
        arrCountry['IE'] = "Ireland";
        arrCountry['IM'] = "Isle of Man";
        arrCountry['IL'] = "Israel";
        arrCountry['IT'] = "Italy";
        arrCountry['JM'] = "Jamaica";
        arrCountry['JP'] = "Japan";
        arrCountry['JO'] = "Jordan";
        arrCountry['KZ'] = "Kazakhstan";
        arrCountry['KE'] = "Kenya";
        arrCountry['KI'] = "Kiribati";
        arrCountry['KW'] = "Kuwait";
        arrCountry['KG'] = "Kyrgyzstan";
        arrCountry['LA'] = "Laos";
        arrCountry['LV'] = "Latvia";
        arrCountry['LB'] = "Lebanon";
        arrCountry['LS'] = "Lesotho";
        arrCountry['LR'] = "Liberia";
        arrCountry['LY'] = "Libya";
        arrCountry['LI'] = "Liechtenstein";
        arrCountry['LT'] = "Lithuania";
        arrCountry['LU'] = "Luxembourg";
        arrCountry['MO'] = "Macau";
        arrCountry['MK'] = "Macedonia";
        arrCountry['MG'] = "Madagascar";
        arrCountry['MW'] = "Malawi";
        arrCountry['MY'] = "Malaysia";
        arrCountry['MV'] = "Maldives";
        arrCountry['ML'] = "Mali";
        arrCountry['MT'] = "Malta";
        arrCountry['MH'] = "Marshall Islands";
        arrCountry['MQ'] = "Martinique";
        arrCountry['MR'] = "Mauritania";
        arrCountry['MU'] = "Mauritius";
        arrCountry['YT'] = "Mayotte";
        arrCountry['MX'] = "Mexico";
        arrCountry['FM'] = "Micronesia";
        arrCountry['MD'] = "Moldova";
        arrCountry['MC'] = "Monaco";
        arrCountry['MN'] = "Mongolia";
        arrCountry['ME'] = "Montenegro";
        arrCountry['MS'] = "Montserrat";
        arrCountry['MA'] = "Morocco";
        arrCountry['MZ'] = "Mozambique";
        arrCountry['MM'] = "Myanmar (Burma)";
        arrCountry['NA'] = "Namibia";
        arrCountry['NR'] = "Nauru";
        arrCountry['NP'] = "Nepal";
        arrCountry['NL'] = "Netherlands";
        arrCountry['AN'] = "Netherlands Antilles";
        arrCountry['NC'] = "New Caledonia";
        arrCountry['NZ'] = "New Zealand";
        arrCountry['NI'] = "Nicaragua";
        arrCountry['NE'] = "Niger";
        arrCountry['NG'] = "Nigeria";
        arrCountry['NU'] = "Niue";
        arrCountry['NF'] = "Norfolk Island";
        arrCountry['KP'] = "North Korea";
        arrCountry['MP'] = "Northern Mariana Islands";
        arrCountry['NO'] = "Norway";
        arrCountry['OM'] = "Oman";
        arrCountry['PK'] = "Pakistan";
        arrCountry['PW'] = "Palau";
        arrCountry['PS'] = "Palestine";
        arrCountry['PA'] = "Panama";
        arrCountry['PG'] = "Papua New Guinea";
        arrCountry['PY'] = "Paraguay";
        arrCountry['PE'] = "Peru";
        arrCountry['PH'] = "Philippines";
        arrCountry['PN'] = "Pitcairn";
        arrCountry['PL'] = "Poland";
        arrCountry['PT'] = "Portugal";
        arrCountry['PR'] = "Puerto Rico";
        arrCountry['QA'] = "Qatar";
        arrCountry['RE'] = "Reunion";
        arrCountry['RO'] = "Romania";
        arrCountry['RU'] = "Russia";
        arrCountry['RW'] = "Rwanda";
        arrCountry['SH'] = "Saint Helena";
        arrCountry['KN'] = "Saint Kitts And Nevis";
        arrCountry['LC'] = "Saint Lucia";
        arrCountry['PM'] = "Saint Pierre And Miquelon";
        arrCountry['VC'] = "Saint Vincent And The Grenadines";
        arrCountry['SM'] = "San Marino";
        arrCountry['ST'] = "Sao Tome And Principe";
        arrCountry['SA'] = "Saudi Arabia";
        arrCountry['SN'] = "Senegal";
        arrCountry['RS'] = "Serbia";
        arrCountry['SC'] = "Seychelles";
        arrCountry['SL'] = "Sierra Leone";
        arrCountry['SG'] = "Singapore";
        arrCountry['SK'] = "Slovak Republic";
        arrCountry['SI'] = "Slovenia";
        arrCountry['SB'] = "Solomon Islands";
        arrCountry['SO'] = "Somalia";
        arrCountry['ZA'] = "South Africa";
        arrCountry['GS'] = "South Georgia And South Sandwich Islands";
        arrCountry['KR'] = "South Korea";
        arrCountry['ES'] = "Spain";
        arrCountry['LK'] = "Sri Lanka";
        arrCountry['SD'] = "Sudan";
        arrCountry['SR'] = "Suriname";
        arrCountry['SJ'] = "Svalbard And Jan Mayen";
        arrCountry['SZ'] = "Swaziland";
        arrCountry['SE'] = "Sweden";
        arrCountry['CH'] = "Switzerland";
        arrCountry['SY'] = "Syria";
        arrCountry['TW'] = "Taiwan";
        arrCountry['TJ'] = "Tajikistan";
        arrCountry['TZ'] = "Tanzania";
        arrCountry['TH'] = "Thailand";
        arrCountry['TG'] = "Togo";
        arrCountry['TK'] = "Tokelau";
        arrCountry['TO'] = "Tonga";
        arrCountry['TT'] = "Trinidad And Tobago";
        arrCountry['TN'] = "Tunisia";
        arrCountry['TR'] = "Turkey";
        arrCountry['TM'] = "Turkmenistan";
        arrCountry['TC'] = "Turks And Caicos Islands";
        arrCountry['TV'] = "Tuvalu";
        arrCountry['UG'] = "Uganda";
        arrCountry['UA'] = "Ukraine";
        arrCountry['AE'] = "United Arab Emirates";
        arrCountry['GB'] = "United Kingdom";
        arrCountry['US'] = "United States";
        arrCountry['UM'] = "United States Minor Outlying Islands";
        arrCountry['UY'] = "Uruguay";
        arrCountry['UZ'] = "Uzbekistan";
        arrCountry['VU'] = "Vanuatu";
        arrCountry['VA'] = "Vatican City (Holy See)";
        arrCountry['VE'] = "Venezuela";
        arrCountry['VN'] = "Vietnam";
        arrCountry['VG'] = "Virgin Islands (British)";
        arrCountry['VI'] = "Virgin Islands (US)";
        arrCountry['WF'] = "Wallis And Futuna Islands";
        arrCountry['EH'] = "Western Sahara";
        arrCountry['WS'] = "Western Samoa";
        arrCountry['YE'] = "Yemen";
        arrCountry['YU'] = "Yugoslavia";
        arrCountry['ZM'] = "Zambia";
        arrCountry['ZW'] = "Zimbabwe";
        
        var name = arrCountry[countryCode.toUpperCase()];
        if (name === undefined) {
                return "";
        } else {
                return name;
        }
}


var COMPILED=!0,goog=goog||{};goog.global=this;goog.exportPath_=function(a,b,c){a=a.split(".");c=c||goog.global;a[0]in c||!c.execScript||c.execScript("var "+a[0]);for(var d;a.length&&(d=a.shift());)a.length||void 0===b?c=c[d]?c[d]:c[d]={}:c[d]=b};goog.define=function(a,b){var c=b;COMPILED||goog.global.CLOSURE_DEFINES&&Object.prototype.hasOwnProperty.call(goog.global.CLOSURE_DEFINES,a)&&(c=goog.global.CLOSURE_DEFINES[a]);goog.exportPath_(a,c)};goog.DEBUG=!0;goog.LOCALE="en";goog.TRUSTED_SITE=!0;
goog.provide=function(a){if(!COMPILED){if(goog.isProvided_(a))throw Error('Namespace "'+a+'" already declared.');delete goog.implicitNamespaces_[a];for(var b=a;(b=b.substring(0,b.lastIndexOf(".")))&&!goog.getObjectByName(b);)goog.implicitNamespaces_[b]=!0}goog.exportPath_(a)};goog.setTestOnly=function(a){if(COMPILED&&!goog.DEBUG)throw a=a||"",Error("Importing test-only code into non-debug environment"+a?": "+a:".");};
COMPILED||(goog.isProvided_=function(a){return!goog.implicitNamespaces_[a]&&!!goog.getObjectByName(a)},goog.implicitNamespaces_={});goog.getObjectByName=function(a,b){for(var c=a.split("."),d=b||goog.global,e;e=c.shift();)if(goog.isDefAndNotNull(d[e]))d=d[e];else return null;return d};goog.globalize=function(a,b){var c=b||goog.global,d;for(d in a)c[d]=a[d]};
goog.addDependency=function(a,b,c){if(goog.DEPENDENCIES_ENABLED){var d;a=a.replace(/\\/g,"/");for(var e=goog.dependencies_,f=0;d=b[f];f++)e.nameToPath[d]=a,a in e.pathToNames||(e.pathToNames[a]={}),e.pathToNames[a][d]=!0;for(d=0;b=c[d];d++)a in e.requires||(e.requires[a]={}),e.requires[a][b]=!0}};goog.ENABLE_DEBUG_LOADER=!0;
goog.require=function(a){if(!COMPILED&&!goog.isProvided_(a)){if(goog.ENABLE_DEBUG_LOADER){var b=goog.getPathFromDeps_(a);if(b){goog.included_[b]=!0;goog.writeScripts_();return}}a="goog.require could not find: "+a;goog.global.console&&goog.global.console.error(a);throw Error(a);}};goog.basePath="";goog.nullFunction=function(){};goog.identityFunction=function(a,b){return a};goog.abstractMethod=function(){throw Error("unimplemented abstract method");};
goog.addSingletonGetter=function(a){a.getInstance=function(){if(a.instance_)return a.instance_;goog.DEBUG&&(goog.instantiatedSingletons_[goog.instantiatedSingletons_.length]=a);return a.instance_=new a}};goog.instantiatedSingletons_=[];goog.DEPENDENCIES_ENABLED=!COMPILED&&goog.ENABLE_DEBUG_LOADER;
goog.DEPENDENCIES_ENABLED&&(goog.included_={},goog.dependencies_={pathToNames:{},nameToPath:{},requires:{},visited:{},written:{}},goog.inHtmlDocument_=function(){var a=goog.global.document;return"undefined"!=typeof a&&"write"in a},goog.findBasePath_=function(){if(goog.global.CLOSURE_BASE_PATH)goog.basePath=goog.global.CLOSURE_BASE_PATH;else if(goog.inHtmlDocument_())for(var a=goog.global.document.getElementsByTagName("script"),b=a.length-1;0<=b;--b){var c=a[b].src,d=c.lastIndexOf("?"),d=-1==d?c.length:
d;if("base.js"==c.substr(d-7,7)){goog.basePath=c.substr(0,d-7);break}}},goog.importScript_=function(a){var b=goog.global.CLOSURE_IMPORT_SCRIPT||goog.writeScriptTag_;!goog.dependencies_.written[a]&&b(a)&&(goog.dependencies_.written[a]=!0)},goog.writeScriptTag_=function(a){if(goog.inHtmlDocument_()){var b=goog.global.document;if("complete"==b.readyState){if(/\bdeps.js$/.test(a))return!1;throw Error('Cannot write "'+a+'" after document load');}b.write('<script type="text/javascript" src="'+a+'">\x3c/script>');
return!0}return!1},goog.writeScripts_=function(){function a(e){if(!(e in d.written)){if(!(e in d.visited)&&(d.visited[e]=!0,e in d.requires))for(var g in d.requires[e])if(!goog.isProvided_(g))if(g in d.nameToPath)a(d.nameToPath[g]);else throw Error("Undefined nameToPath for "+g);e in c||(c[e]=!0,b.push(e))}}var b=[],c={},d=goog.dependencies_,e;for(e in goog.included_)d.written[e]||a(e);for(e=0;e<b.length;e++)if(b[e])goog.importScript_(goog.basePath+b[e]);else throw Error("Undefined script input");
},goog.getPathFromDeps_=function(a){return a in goog.dependencies_.nameToPath?goog.dependencies_.nameToPath[a]:null},goog.findBasePath_(),goog.global.CLOSURE_NO_DEPS||goog.importScript_(goog.basePath+"deps.js"));
goog.typeOf=function(a){var b=typeof a;if("object"==b)if(a){if(a instanceof Array)return"array";if(a instanceof Object)return b;var c=Object.prototype.toString.call(a);if("[object Window]"==c)return"object";if("[object Array]"==c||"number"==typeof a.length&&"undefined"!=typeof a.splice&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("splice"))return"array";if("[object Function]"==c||"undefined"!=typeof a.call&&"undefined"!=typeof a.propertyIsEnumerable&&!a.propertyIsEnumerable("call"))return"function"}else return"null";
else if("function"==b&&"undefined"==typeof a.call)return"object";return b};goog.isDef=function(a){return void 0!==a};goog.isNull=function(a){return null===a};goog.isDefAndNotNull=function(a){return null!=a};goog.isArray=function(a){return"array"==goog.typeOf(a)};goog.isArrayLike=function(a){var b=goog.typeOf(a);return"array"==b||"object"==b&&"number"==typeof a.length};goog.isDateLike=function(a){return goog.isObject(a)&&"function"==typeof a.getFullYear};goog.isString=function(a){return"string"==typeof a};
goog.isBoolean=function(a){return"boolean"==typeof a};goog.isNumber=function(a){return"number"==typeof a};goog.isFunction=function(a){return"function"==goog.typeOf(a)};goog.isObject=function(a){var b=typeof a;return"object"==b&&null!=a||"function"==b};goog.getUid=function(a){return a[goog.UID_PROPERTY_]||(a[goog.UID_PROPERTY_]=++goog.uidCounter_)};goog.hasUid=function(a){return!!a[goog.UID_PROPERTY_]};goog.removeUid=function(a){"removeAttribute"in a&&a.removeAttribute(goog.UID_PROPERTY_);try{delete a[goog.UID_PROPERTY_]}catch(b){}};
goog.UID_PROPERTY_="closure_uid_"+(1E9*Math.random()>>>0);goog.uidCounter_=0;goog.getHashCode=goog.getUid;goog.removeHashCode=goog.removeUid;goog.cloneObject=function(a){var b=goog.typeOf(a);if("object"==b||"array"==b){if(a.clone)return a.clone();var b="array"==b?[]:{},c;for(c in a)b[c]=goog.cloneObject(a[c]);return b}return a};goog.bindNative_=function(a,b,c){return a.call.apply(a.bind,arguments)};
goog.bindJs_=function(a,b,c){if(!a)throw Error();if(2<arguments.length){var d=Array.prototype.slice.call(arguments,2);return function(){var c=Array.prototype.slice.call(arguments);Array.prototype.unshift.apply(c,d);return a.apply(b,c)}}return function(){return a.apply(b,arguments)}};goog.bind=function(a,b,c){Function.prototype.bind&&-1!=Function.prototype.bind.toString().indexOf("native code")?goog.bind=goog.bindNative_:goog.bind=goog.bindJs_;return goog.bind.apply(null,arguments)};
goog.partial=function(a,b){var c=Array.prototype.slice.call(arguments,1);return function(){var b=c.slice();b.push.apply(b,arguments);return a.apply(this,b)}};goog.mixin=function(a,b){for(var c in b)a[c]=b[c]};goog.now=goog.TRUSTED_SITE&&Date.now||function(){return+new Date};
goog.globalEval=function(a){if(goog.global.execScript)goog.global.execScript(a,"JavaScript");else if(goog.global.eval)if(null==goog.evalWorksForGlobals_&&(goog.global.eval("var _et_ = 1;"),"undefined"!=typeof goog.global._et_?(delete goog.global._et_,goog.evalWorksForGlobals_=!0):goog.evalWorksForGlobals_=!1),goog.evalWorksForGlobals_)goog.global.eval(a);else{var b=goog.global.document,c=b.createElement("script");c.type="text/javascript";c.defer=!1;c.appendChild(b.createTextNode(a));b.body.appendChild(c);
b.body.removeChild(c)}else throw Error("goog.globalEval not available");};goog.evalWorksForGlobals_=null;goog.getCssName=function(a,b){var c=function(a){return goog.cssNameMapping_[a]||a},d=function(a){a=a.split("-");for(var b=[],d=0;d<a.length;d++)b.push(c(a[d]));return b.join("-")},d=goog.cssNameMapping_?"BY_WHOLE"==goog.cssNameMappingStyle_?c:d:function(a){return a};return b?a+"-"+d(b):d(a)};goog.setCssNameMapping=function(a,b){goog.cssNameMapping_=a;goog.cssNameMappingStyle_=b};
!COMPILED&&goog.global.CLOSURE_CSS_NAME_MAPPING&&(goog.cssNameMapping_=goog.global.CLOSURE_CSS_NAME_MAPPING);goog.getMsg=function(a,b){var c=b||{},d;for(d in c){var e=(""+c[d]).replace(/\$/g,"$$$$");a=a.replace(RegExp("\\{\\$"+d+"\\}","gi"),e)}return a};goog.getMsgWithFallback=function(a,b){return a};goog.exportSymbol=function(a,b,c){goog.exportPath_(a,b,c)};goog.exportProperty=function(a,b,c){a[b]=c};
goog.inherits=function(a,b){function c(){}c.prototype=b.prototype;a.superClass_=b.prototype;a.prototype=new c;a.prototype.constructor=a};
goog.base=function(a,b,c){var d=arguments.callee.caller;if(goog.DEBUG&&!d)throw Error("arguments.caller not defined.  goog.base() expects not to be running in strict mode. See http://www.ecma-international.org/ecma-262/5.1/#sec-C");if(d.superClass_)return d.superClass_.constructor.apply(a,Array.prototype.slice.call(arguments,1));for(var e=Array.prototype.slice.call(arguments,2),f=!1,g=a.constructor;g;g=g.superClass_&&g.superClass_.constructor)if(g.prototype[b]===d)f=!0;else if(f)return g.prototype[b].apply(a,
e);if(a[b]===d)return a.constructor.prototype[b].apply(a,e);throw Error("goog.base called from a method of one name to a method of a different name");};goog.scope=function(a){a.call(goog.global)};goog.string={};goog.string.StringBuffer=function(a,b){null!=a&&this.append.apply(this,arguments)};goog.string.StringBuffer.prototype.buffer_="";goog.string.StringBuffer.prototype.set=function(a){this.buffer_=""+a};goog.string.StringBuffer.prototype.append=function(a,b,c){this.buffer_+=a;if(null!=b)for(var d=1;d<arguments.length;d++)this.buffer_+=arguments[d];return this};goog.string.StringBuffer.prototype.clear=function(){this.buffer_=""};goog.string.StringBuffer.prototype.getLength=function(){return this.buffer_.length};
goog.string.StringBuffer.prototype.toString=function(){return this.buffer_};goog.debug={};goog.debug.Error=function(a){Error.captureStackTrace?Error.captureStackTrace(this,goog.debug.Error):this.stack=Error().stack||"";a&&(this.message=String(a))};goog.inherits(goog.debug.Error,Error);goog.debug.Error.prototype.name="CustomError";goog.string.Unicode={NBSP:"\u00a0"};goog.string.startsWith=function(a,b){return 0==a.lastIndexOf(b,0)};goog.string.endsWith=function(a,b){var c=a.length-b.length;return 0<=c&&a.indexOf(b,c)==c};goog.string.caseInsensitiveStartsWith=function(a,b){return 0==goog.string.caseInsensitiveCompare(b,a.substr(0,b.length))};goog.string.caseInsensitiveEndsWith=function(a,b){return 0==goog.string.caseInsensitiveCompare(b,a.substr(a.length-b.length,b.length))};
goog.string.caseInsensitiveEquals=function(a,b){return a.toLowerCase()==b.toLowerCase()};goog.string.subs=function(a,b){for(var c=a.split("%s"),d="",e=Array.prototype.slice.call(arguments,1);e.length&&1<c.length;)d+=c.shift()+e.shift();return d+c.join("%s")};goog.string.collapseWhitespace=function(a){return a.replace(/[\s\xa0]+/g," ").replace(/^\s+|\s+$/g,"")};goog.string.isEmpty=function(a){return/^[\s\xa0]*$/.test(a)};goog.string.isEmptySafe=function(a){return goog.string.isEmpty(goog.string.makeSafe(a))};
goog.string.isBreakingWhitespace=function(a){return!/[^\t\n\r ]/.test(a)};goog.string.isAlpha=function(a){return!/[^a-zA-Z]/.test(a)};goog.string.isNumeric=function(a){return!/[^0-9]/.test(a)};goog.string.isAlphaNumeric=function(a){return!/[^a-zA-Z0-9]/.test(a)};goog.string.isSpace=function(a){return" "==a};goog.string.isUnicodeChar=function(a){return 1==a.length&&" "<=a&&"~">=a||"\u0080"<=a&&"\ufffd">=a};goog.string.stripNewlines=function(a){return a.replace(/(\r\n|\r|\n)+/g," ")};
goog.string.canonicalizeNewlines=function(a){return a.replace(/(\r\n|\r|\n)/g,"\n")};goog.string.normalizeWhitespace=function(a){return a.replace(/\xa0|\s/g," ")};goog.string.normalizeSpaces=function(a){return a.replace(/\xa0|[ \t]+/g," ")};goog.string.collapseBreakingSpaces=function(a){return a.replace(/[\t\r\n ]+/g," ").replace(/^[\t\r\n ]+|[\t\r\n ]+$/g,"")};goog.string.trim=function(a){return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")};
goog.string.trimLeft=function(a){return a.replace(/^[\s\xa0]+/,"")};goog.string.trimRight=function(a){return a.replace(/[\s\xa0]+$/,"")};goog.string.caseInsensitiveCompare=function(a,b){var c=String(a).toLowerCase(),d=String(b).toLowerCase();return c<d?-1:c==d?0:1};goog.string.numerateCompareRegExp_=/(\.\d+)|(\d+)|(\D+)/g;
goog.string.numerateCompare=function(a,b){if(a==b)return 0;if(!a)return-1;if(!b)return 1;for(var c=a.toLowerCase().match(goog.string.numerateCompareRegExp_),d=b.toLowerCase().match(goog.string.numerateCompareRegExp_),e=Math.min(c.length,d.length),f=0;f<e;f++){var g=c[f],h=d[f];if(g!=h)return c=parseInt(g,10),!isNaN(c)&&(d=parseInt(h,10),!isNaN(d)&&c-d)?c-d:g<h?-1:1}return c.length!=d.length?c.length-d.length:a<b?-1:1};goog.string.urlEncode=function(a){return encodeURIComponent(String(a))};
goog.string.urlDecode=function(a){return decodeURIComponent(a.replace(/\+/g," "))};goog.string.newLineToBr=function(a,b){return a.replace(/(\r\n|\r|\n)/g,b?"<br />":"<br>")};
goog.string.htmlEscape=function(a,b){if(b)return a.replace(goog.string.amperRe_,"&amp;").replace(goog.string.ltRe_,"&lt;").replace(goog.string.gtRe_,"&gt;").replace(goog.string.quotRe_,"&quot;");if(!goog.string.allRe_.test(a))return a;-1!=a.indexOf("&")&&(a=a.replace(goog.string.amperRe_,"&amp;"));-1!=a.indexOf("<")&&(a=a.replace(goog.string.ltRe_,"&lt;"));-1!=a.indexOf(">")&&(a=a.replace(goog.string.gtRe_,"&gt;"));-1!=a.indexOf('"')&&(a=a.replace(goog.string.quotRe_,"&quot;"));return a};
goog.string.amperRe_=/&/g;goog.string.ltRe_=/</g;goog.string.gtRe_=/>/g;goog.string.quotRe_=/\"/g;goog.string.allRe_=/[&<>\"]/;goog.string.unescapeEntities=function(a){return goog.string.contains(a,"&")?"document"in goog.global?goog.string.unescapeEntitiesUsingDom_(a):goog.string.unescapePureXmlEntities_(a):a};
goog.string.unescapeEntitiesUsingDom_=function(a){var b={"&amp;":"&","&lt;":"<","&gt;":">","&quot;":'"'},c=document.createElement("div");return a.replace(goog.string.HTML_ENTITY_PATTERN_,function(a,e){var f=b[a];if(f)return f;if("#"==e.charAt(0)){var g=Number("0"+e.substr(1));isNaN(g)||(f=String.fromCharCode(g))}f||(c.innerHTML=a+" ",f=c.firstChild.nodeValue.slice(0,-1));return b[a]=f})};
goog.string.unescapePureXmlEntities_=function(a){return a.replace(/&([^;]+);/g,function(a,c){switch(c){case "amp":return"&";case "lt":return"<";case "gt":return">";case "quot":return'"';default:if("#"==c.charAt(0)){var d=Number("0"+c.substr(1));if(!isNaN(d))return String.fromCharCode(d)}return a}})};goog.string.HTML_ENTITY_PATTERN_=/&([^;\s<&]+);?/g;goog.string.whitespaceEscape=function(a,b){return goog.string.newLineToBr(a.replace(/  /g," &#160;"),b)};
goog.string.stripQuotes=function(a,b){for(var c=b.length,d=0;d<c;d++){var e=1==c?b:b.charAt(d);if(a.charAt(0)==e&&a.charAt(a.length-1)==e)return a.substring(1,a.length-1)}return a};goog.string.truncate=function(a,b,c){c&&(a=goog.string.unescapeEntities(a));a.length>b&&(a=a.substring(0,b-3)+"...");c&&(a=goog.string.htmlEscape(a));return a};
goog.string.truncateMiddle=function(a,b,c,d){c&&(a=goog.string.unescapeEntities(a));if(d&&a.length>b){d>b&&(d=b);var e=a.length-d;a=a.substring(0,b-d)+"..."+a.substring(e)}else a.length>b&&(d=Math.floor(b/2),e=a.length-d,a=a.substring(0,d+b%2)+"..."+a.substring(e));c&&(a=goog.string.htmlEscape(a));return a};goog.string.specialEscapeChars_={"\x00":"\\0","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\x0B",'"':'\\"',"\\":"\\\\"};goog.string.jsEscapeCache_={"'":"\\'"};
goog.string.quote=function(a){a=String(a);if(a.quote)return a.quote();for(var b=['"'],c=0;c<a.length;c++){var d=a.charAt(c),e=d.charCodeAt(0);b[c+1]=goog.string.specialEscapeChars_[d]||(31<e&&127>e?d:goog.string.escapeChar(d))}b.push('"');return b.join("")};goog.string.escapeString=function(a){for(var b=[],c=0;c<a.length;c++)b[c]=goog.string.escapeChar(a.charAt(c));return b.join("")};
goog.string.escapeChar=function(a){if(a in goog.string.jsEscapeCache_)return goog.string.jsEscapeCache_[a];if(a in goog.string.specialEscapeChars_)return goog.string.jsEscapeCache_[a]=goog.string.specialEscapeChars_[a];var b=a,c=a.charCodeAt(0);if(31<c&&127>c)b=a;else{if(256>c){if(b="\\x",16>c||256<c)b+="0"}else b="\\u",4096>c&&(b+="0");b+=c.toString(16).toUpperCase()}return goog.string.jsEscapeCache_[a]=b};goog.string.toMap=function(a){for(var b={},c=0;c<a.length;c++)b[a.charAt(c)]=!0;return b};
goog.string.contains=function(a,b){return-1!=a.indexOf(b)};goog.string.countOf=function(a,b){return a&&b?a.split(b).length-1:0};goog.string.removeAt=function(a,b,c){var d=a;0<=b&&b<a.length&&0<c&&(d=a.substr(0,b)+a.substr(b+c,a.length-b-c));return d};goog.string.remove=function(a,b){var c=RegExp(goog.string.regExpEscape(b),"");return a.replace(c,"")};goog.string.removeAll=function(a,b){var c=RegExp(goog.string.regExpEscape(b),"g");return a.replace(c,"")};
goog.string.regExpEscape=function(a){return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")};goog.string.repeat=function(a,b){return Array(b+1).join(a)};goog.string.padNumber=function(a,b,c){a=goog.isDef(c)?a.toFixed(c):String(a);c=a.indexOf(".");-1==c&&(c=a.length);return goog.string.repeat("0",Math.max(0,b-c))+a};goog.string.makeSafe=function(a){return null==a?"":String(a)};goog.string.buildString=function(a){return Array.prototype.join.call(arguments,"")};
goog.string.getRandomString=function(){return Math.floor(2147483648*Math.random()).toString(36)+Math.abs(Math.floor(2147483648*Math.random())^goog.now()).toString(36)};
goog.string.compareVersions=function(a,b){for(var c=0,d=goog.string.trim(String(a)).split("."),e=goog.string.trim(String(b)).split("."),f=Math.max(d.length,e.length),g=0;0==c&&g<f;g++){var h=d[g]||"",k=e[g]||"",l=RegExp("(\\d*)(\\D*)","g"),p=RegExp("(\\d*)(\\D*)","g");do{var m=l.exec(h)||["","",""],n=p.exec(k)||["","",""];if(0==m[0].length&&0==n[0].length)break;var c=0==m[1].length?0:parseInt(m[1],10),q=0==n[1].length?0:parseInt(n[1],10),c=goog.string.compareElements_(c,q)||goog.string.compareElements_(0==
m[2].length,0==n[2].length)||goog.string.compareElements_(m[2],n[2])}while(0==c)}return c};goog.string.compareElements_=function(a,b){return a<b?-1:a>b?1:0};goog.string.HASHCODE_MAX_=4294967296;goog.string.hashCode=function(a){for(var b=0,c=0;c<a.length;++c)b=31*b+a.charCodeAt(c),b%=goog.string.HASHCODE_MAX_;return b};goog.string.uniqueStringCounter_=2147483648*Math.random()|0;goog.string.createUniqueString=function(){return"goog_"+goog.string.uniqueStringCounter_++};
goog.string.toNumber=function(a){var b=Number(a);return 0==b&&goog.string.isEmpty(a)?NaN:b};goog.string.isLowerCamelCase=function(a){return/^[a-z]+([A-Z][a-z]*)*$/.test(a)};goog.string.isUpperCamelCase=function(a){return/^([A-Z][a-z]*)+$/.test(a)};goog.string.toCamelCase=function(a){return String(a).replace(/\-([a-z])/g,function(a,c){return c.toUpperCase()})};goog.string.toSelectorCase=function(a){return String(a).replace(/([A-Z])/g,"-$1").toLowerCase()};
goog.string.toTitleCase=function(a,b){var c=goog.isString(b)?goog.string.regExpEscape(b):"\\s";return a.replace(RegExp("(^"+(c?"|["+c+"]+":"")+")([a-z])","g"),function(a,b,c){return b+c.toUpperCase()})};goog.string.parseInt=function(a){isFinite(a)&&(a=String(a));return goog.isString(a)?/^\s*-?0x/i.test(a)?parseInt(a,16):parseInt(a,10):NaN};goog.string.splitLimit=function(a,b,c){a=a.split(b);for(var d=[];0<c&&a.length;)d.push(a.shift()),c--;a.length&&d.push(a.join(b));return d};goog.asserts={};goog.asserts.ENABLE_ASSERTS=goog.DEBUG;goog.asserts.AssertionError=function(a,b){b.unshift(a);goog.debug.Error.call(this,goog.string.subs.apply(null,b));b.shift();this.messagePattern=a};goog.inherits(goog.asserts.AssertionError,goog.debug.Error);goog.asserts.AssertionError.prototype.name="AssertionError";goog.asserts.doAssertFailure_=function(a,b,c,d){var e="Assertion failed";if(c)var e=e+(": "+c),f=d;else a&&(e+=": "+a,f=b);throw new goog.asserts.AssertionError(""+e,f||[]);};
goog.asserts.assert=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!a&&goog.asserts.doAssertFailure_("",null,b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.fail=function(a,b){if(goog.asserts.ENABLE_ASSERTS)throw new goog.asserts.AssertionError("Failure"+(a?": "+a:""),Array.prototype.slice.call(arguments,1));};
goog.asserts.assertNumber=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isNumber(a)&&goog.asserts.doAssertFailure_("Expected number but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertString=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isString(a)&&goog.asserts.doAssertFailure_("Expected string but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.assertFunction=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isFunction(a)&&goog.asserts.doAssertFailure_("Expected function but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertObject=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isObject(a)&&goog.asserts.doAssertFailure_("Expected object but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.assertArray=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isArray(a)&&goog.asserts.doAssertFailure_("Expected array but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};goog.asserts.assertBoolean=function(a,b,c){goog.asserts.ENABLE_ASSERTS&&!goog.isBoolean(a)&&goog.asserts.doAssertFailure_("Expected boolean but got %s: %s.",[goog.typeOf(a),a],b,Array.prototype.slice.call(arguments,2));return a};
goog.asserts.assertInstanceof=function(a,b,c,d){!goog.asserts.ENABLE_ASSERTS||a instanceof b||goog.asserts.doAssertFailure_("instanceof check failed.",null,c,Array.prototype.slice.call(arguments,3));return a};goog.asserts.assertObjectPrototypeIsIntact=function(){for(var a in Object.prototype)goog.asserts.fail(a+" should not be enumerable in Object.prototype.")};goog.array={};goog.NATIVE_ARRAY_PROTOTYPES=goog.TRUSTED_SITE;goog.array.peek=function(a){return a[a.length-1]};goog.array.ARRAY_PROTOTYPE_=Array.prototype;
goog.array.indexOf=goog.NATIVE_ARRAY_PROTOTYPES&&goog.array.ARRAY_PROTOTYPE_.indexOf?function(a,b,c){goog.asserts.assert(null!=a.length);return goog.array.ARRAY_PROTOTYPE_.indexOf.call(a,b,c)}:function(a,b,c){c=null==c?0:0>c?Math.max(0,a.length+c):c;if(goog.isString(a))return goog.isString(b)&&1==b.length?a.indexOf(b,c):-1;for(;c<a.length;c++)if(c in a&&a[c]===b)return c;return-1};
goog.array.lastIndexOf=goog.NATIVE_ARRAY_PROTOTYPES&&goog.array.ARRAY_PROTOTYPE_.lastIndexOf?function(a,b,c){goog.asserts.assert(null!=a.length);return goog.array.ARRAY_PROTOTYPE_.lastIndexOf.call(a,b,null==c?a.length-1:c)}:function(a,b,c){c=null==c?a.length-1:c;0>c&&(c=Math.max(0,a.length+c));if(goog.isString(a))return goog.isString(b)&&1==b.length?a.lastIndexOf(b,c):-1;for(;0<=c;c--)if(c in a&&a[c]===b)return c;return-1};
goog.array.forEach=goog.NATIVE_ARRAY_PROTOTYPES&&goog.array.ARRAY_PROTOTYPE_.forEach?function(a,b,c){goog.asserts.assert(null!=a.length);goog.array.ARRAY_PROTOTYPE_.forEach.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)f in e&&b.call(c,e[f],f,a)};goog.array.forEachRight=function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,d=d-1;0<=d;--d)d in e&&b.call(c,e[d],d,a)};
goog.array.filter=goog.NATIVE_ARRAY_PROTOTYPES&&goog.array.ARRAY_PROTOTYPE_.filter?function(a,b,c){goog.asserts.assert(null!=a.length);return goog.array.ARRAY_PROTOTYPE_.filter.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=[],f=0,g=goog.isString(a)?a.split(""):a,h=0;h<d;h++)if(h in g){var k=g[h];b.call(c,k,h,a)&&(e[f++]=k)}return e};
goog.array.map=goog.NATIVE_ARRAY_PROTOTYPES&&goog.array.ARRAY_PROTOTYPE_.map?function(a,b,c){goog.asserts.assert(null!=a.length);return goog.array.ARRAY_PROTOTYPE_.map.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=Array(d),f=goog.isString(a)?a.split(""):a,g=0;g<d;g++)g in f&&(e[g]=b.call(c,f[g],g,a));return e};
goog.array.reduce=goog.NATIVE_ARRAY_PROTOTYPES&&goog.array.ARRAY_PROTOTYPE_.reduce?function(a,b,c,d){goog.asserts.assert(null!=a.length);d&&(b=goog.bind(b,d));return goog.array.ARRAY_PROTOTYPE_.reduce.call(a,b,c)}:function(a,b,c,d){var e=c;goog.array.forEach(a,function(c,g){e=b.call(d,e,c,g,a)});return e};
goog.array.reduceRight=goog.NATIVE_ARRAY_PROTOTYPES&&goog.array.ARRAY_PROTOTYPE_.reduceRight?function(a,b,c,d){goog.asserts.assert(null!=a.length);d&&(b=goog.bind(b,d));return goog.array.ARRAY_PROTOTYPE_.reduceRight.call(a,b,c)}:function(a,b,c,d){var e=c;goog.array.forEachRight(a,function(c,g){e=b.call(d,e,c,g,a)});return e};
goog.array.some=goog.NATIVE_ARRAY_PROTOTYPES&&goog.array.ARRAY_PROTOTYPE_.some?function(a,b,c){goog.asserts.assert(null!=a.length);return goog.array.ARRAY_PROTOTYPE_.some.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return!0;return!1};
goog.array.every=goog.NATIVE_ARRAY_PROTOTYPES&&goog.array.ARRAY_PROTOTYPE_.every?function(a,b,c){goog.asserts.assert(null!=a.length);return goog.array.ARRAY_PROTOTYPE_.every.call(a,b,c)}:function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&!b.call(c,e[f],f,a))return!1;return!0};goog.array.count=function(a,b,c){var d=0;goog.array.forEach(a,function(a,f,g){b.call(c,a,f,g)&&++d},c);return d};
goog.array.find=function(a,b,c){b=goog.array.findIndex(a,b,c);return 0>b?null:goog.isString(a)?a.charAt(b):a[b]};goog.array.findIndex=function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,f=0;f<d;f++)if(f in e&&b.call(c,e[f],f,a))return f;return-1};goog.array.findRight=function(a,b,c){b=goog.array.findIndexRight(a,b,c);return 0>b?null:goog.isString(a)?a.charAt(b):a[b]};
goog.array.findIndexRight=function(a,b,c){for(var d=a.length,e=goog.isString(a)?a.split(""):a,d=d-1;0<=d;d--)if(d in e&&b.call(c,e[d],d,a))return d;return-1};goog.array.contains=function(a,b){return 0<=goog.array.indexOf(a,b)};goog.array.isEmpty=function(a){return 0==a.length};goog.array.clear=function(a){if(!goog.isArray(a))for(var b=a.length-1;0<=b;b--)delete a[b];a.length=0};goog.array.insert=function(a,b){goog.array.contains(a,b)||a.push(b)};
goog.array.insertAt=function(a,b,c){goog.array.splice(a,c,0,b)};goog.array.insertArrayAt=function(a,b,c){goog.partial(goog.array.splice,a,c,0).apply(null,b)};goog.array.insertBefore=function(a,b,c){var d;2==arguments.length||0>(d=goog.array.indexOf(a,c))?a.push(b):goog.array.insertAt(a,b,d)};goog.array.remove=function(a,b){var c=goog.array.indexOf(a,b),d;(d=0<=c)&&goog.array.removeAt(a,c);return d};
goog.array.removeAt=function(a,b){goog.asserts.assert(null!=a.length);return 1==goog.array.ARRAY_PROTOTYPE_.splice.call(a,b,1).length};goog.array.removeIf=function(a,b,c){b=goog.array.findIndex(a,b,c);return 0<=b?(goog.array.removeAt(a,b),!0):!1};goog.array.concat=function(a){return goog.array.ARRAY_PROTOTYPE_.concat.apply(goog.array.ARRAY_PROTOTYPE_,arguments)};goog.array.toArray=function(a){var b=a.length;if(0<b){for(var c=Array(b),d=0;d<b;d++)c[d]=a[d];return c}return[]};goog.array.clone=goog.array.toArray;
goog.array.extend=function(a,b){for(var c=1;c<arguments.length;c++){var d=arguments[c],e;if(goog.isArray(d)||(e=goog.isArrayLike(d))&&Object.prototype.hasOwnProperty.call(d,"callee"))a.push.apply(a,d);else if(e)for(var f=a.length,g=d.length,h=0;h<g;h++)a[f+h]=d[h];else a.push(d)}};goog.array.splice=function(a,b,c,d){goog.asserts.assert(null!=a.length);return goog.array.ARRAY_PROTOTYPE_.splice.apply(a,goog.array.slice(arguments,1))};
goog.array.slice=function(a,b,c){goog.asserts.assert(null!=a.length);return 2>=arguments.length?goog.array.ARRAY_PROTOTYPE_.slice.call(a,b):goog.array.ARRAY_PROTOTYPE_.slice.call(a,b,c)};goog.array.removeDuplicates=function(a,b){for(var c=b||a,d={},e=0,f=0;f<a.length;){var g=a[f++],h=goog.isObject(g)?"o"+goog.getUid(g):(typeof g).charAt(0)+g;Object.prototype.hasOwnProperty.call(d,h)||(d[h]=!0,c[e++]=g)}c.length=e};
goog.array.binarySearch=function(a,b,c){return goog.array.binarySearch_(a,c||goog.array.defaultCompare,!1,b)};goog.array.binarySelect=function(a,b,c){return goog.array.binarySearch_(a,b,!0,void 0,c)};goog.array.binarySearch_=function(a,b,c,d,e){for(var f=0,g=a.length,h;f<g;){var k=f+g>>1,l;l=c?b.call(e,a[k],k,a):b(d,a[k]);0<l?f=k+1:(g=k,h=!l)}return h?f:~f};goog.array.sort=function(a,b){goog.asserts.assert(null!=a.length);goog.array.ARRAY_PROTOTYPE_.sort.call(a,b||goog.array.defaultCompare)};
goog.array.stableSort=function(a,b){for(var c=0;c<a.length;c++)a[c]={index:c,value:a[c]};var d=b||goog.array.defaultCompare;goog.array.sort(a,function(a,b){return d(a.value,b.value)||a.index-b.index});for(c=0;c<a.length;c++)a[c]=a[c].value};goog.array.sortObjectsByKey=function(a,b,c){var d=c||goog.array.defaultCompare;goog.array.sort(a,function(a,c){return d(a[b],c[b])})};
goog.array.isSorted=function(a,b,c){b=b||goog.array.defaultCompare;for(var d=1;d<a.length;d++){var e=b(a[d-1],a[d]);if(0<e||0==e&&c)return!1}return!0};goog.array.equals=function(a,b,c){if(!goog.isArrayLike(a)||!goog.isArrayLike(b)||a.length!=b.length)return!1;var d=a.length;c=c||goog.array.defaultCompareEquality;for(var e=0;e<d;e++)if(!c(a[e],b[e]))return!1;return!0};goog.array.compare=function(a,b,c){return goog.array.equals(a,b,c)};
goog.array.compare3=function(a,b,c){c=c||goog.array.defaultCompare;for(var d=Math.min(a.length,b.length),e=0;e<d;e++){var f=c(a[e],b[e]);if(0!=f)return f}return goog.array.defaultCompare(a.length,b.length)};goog.array.defaultCompare=function(a,b){return a>b?1:a<b?-1:0};goog.array.defaultCompareEquality=function(a,b){return a===b};goog.array.binaryInsert=function(a,b,c){c=goog.array.binarySearch(a,b,c);return 0>c?(goog.array.insertAt(a,b,-(c+1)),!0):!1};
goog.array.binaryRemove=function(a,b,c){b=goog.array.binarySearch(a,b,c);return 0<=b?goog.array.removeAt(a,b):!1};goog.array.bucket=function(a,b,c){for(var d={},e=0;e<a.length;e++){var f=a[e],g=b.call(c,f,e,a);goog.isDef(g)&&(d[g]||(d[g]=[])).push(f)}return d};goog.array.toObject=function(a,b,c){var d={};goog.array.forEach(a,function(e,f){d[b.call(c,e,f,a)]=e});return d};
goog.array.range=function(a,b,c){var d=[],e=0,f=a;c=c||1;void 0!==b&&(e=a,f=b);if(0>c*(f-e))return[];if(0<c)for(a=e;a<f;a+=c)d.push(a);else for(a=e;a>f;a+=c)d.push(a);return d};goog.array.repeat=function(a,b){for(var c=[],d=0;d<b;d++)c[d]=a;return c};goog.array.flatten=function(a){for(var b=[],c=0;c<arguments.length;c++){var d=arguments[c];goog.isArray(d)?b.push.apply(b,goog.array.flatten.apply(null,d)):b.push(d)}return b};
goog.array.rotate=function(a,b){goog.asserts.assert(null!=a.length);a.length&&(b%=a.length,0<b?goog.array.ARRAY_PROTOTYPE_.unshift.apply(a,a.splice(-b,b)):0>b&&goog.array.ARRAY_PROTOTYPE_.push.apply(a,a.splice(0,-b)));return a};goog.array.moveItem=function(a,b,c){goog.asserts.assert(0<=b&&b<a.length);goog.asserts.assert(0<=c&&c<a.length);b=goog.array.ARRAY_PROTOTYPE_.splice.call(a,b,1);goog.array.ARRAY_PROTOTYPE_.splice.call(a,c,0,b[0])};
goog.array.zip=function(a){if(!arguments.length)return[];for(var b=[],c=0;;c++){for(var d=[],e=0;e<arguments.length;e++){var f=arguments[e];if(c>=f.length)return b;d.push(f[c])}b.push(d)}};goog.array.shuffle=function(a,b){for(var c=b||Math.random,d=a.length-1;0<d;d--){var e=Math.floor(c()*(d+1)),f=a[d];a[d]=a[e];a[e]=f}};goog.object={};goog.object.forEach=function(a,b,c){for(var d in a)b.call(c,a[d],d,a)};goog.object.filter=function(a,b,c){var d={},e;for(e in a)b.call(c,a[e],e,a)&&(d[e]=a[e]);return d};goog.object.map=function(a,b,c){var d={},e;for(e in a)d[e]=b.call(c,a[e],e,a);return d};goog.object.some=function(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return!0;return!1};goog.object.every=function(a,b,c){for(var d in a)if(!b.call(c,a[d],d,a))return!1;return!0};
goog.object.getCount=function(a){var b=0,c;for(c in a)b++;return b};goog.object.getAnyKey=function(a){for(var b in a)return b};goog.object.getAnyValue=function(a){for(var b in a)return a[b]};goog.object.contains=function(a,b){return goog.object.containsValue(a,b)};goog.object.getValues=function(a){var b=[],c=0,d;for(d in a)b[c++]=a[d];return b};goog.object.getKeys=function(a){var b=[],c=0,d;for(d in a)b[c++]=d;return b};
goog.object.getValueByKeys=function(a,b){for(var c=goog.isArrayLike(b),d=c?b:arguments,c=c?0:1;c<d.length&&(a=a[d[c]],goog.isDef(a));c++);return a};goog.object.containsKey=function(a,b){return b in a};goog.object.containsValue=function(a,b){for(var c in a)if(a[c]==b)return!0;return!1};goog.object.findKey=function(a,b,c){for(var d in a)if(b.call(c,a[d],d,a))return d};goog.object.findValue=function(a,b,c){return(b=goog.object.findKey(a,b,c))&&a[b]};
goog.object.isEmpty=function(a){for(var b in a)return!1;return!0};goog.object.clear=function(a){for(var b in a)delete a[b]};goog.object.remove=function(a,b){var c;(c=b in a)&&delete a[b];return c};goog.object.add=function(a,b,c){if(b in a)throw Error('The object already contains the key "'+b+'"');goog.object.set(a,b,c)};goog.object.get=function(a,b,c){return b in a?a[b]:c};goog.object.set=function(a,b,c){a[b]=c};goog.object.setIfUndefined=function(a,b,c){return b in a?a[b]:a[b]=c};
goog.object.clone=function(a){var b={},c;for(c in a)b[c]=a[c];return b};goog.object.unsafeClone=function(a){var b=goog.typeOf(a);if("object"==b||"array"==b){if(a.clone)return a.clone();var b="array"==b?[]:{},c;for(c in a)b[c]=goog.object.unsafeClone(a[c]);return b}return a};goog.object.transpose=function(a){var b={},c;for(c in a)b[a[c]]=c;return b};goog.object.PROTOTYPE_FIELDS_="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
goog.object.extend=function(a,b){for(var c,d,e=1;e<arguments.length;e++){d=arguments[e];for(c in d)a[c]=d[c];for(var f=0;f<goog.object.PROTOTYPE_FIELDS_.length;f++)c=goog.object.PROTOTYPE_FIELDS_[f],Object.prototype.hasOwnProperty.call(d,c)&&(a[c]=d[c])}};
goog.object.create=function(a){var b=arguments.length;if(1==b&&goog.isArray(arguments[0]))return goog.object.create.apply(null,arguments[0]);if(b%2)throw Error("Uneven number of arguments");for(var c={},d=0;d<b;d+=2)c[arguments[d]]=arguments[d+1];return c};goog.object.createSet=function(a){var b=arguments.length;if(1==b&&goog.isArray(arguments[0]))return goog.object.createSet.apply(null,arguments[0]);for(var c={},d=0;d<b;d++)c[arguments[d]]=!0;return c};
goog.object.createImmutableView=function(a){var b=a;Object.isFrozen&&!Object.isFrozen(a)&&(b=Object.create(a),Object.freeze(b));return b};goog.object.isImmutableView=function(a){return!!Object.isFrozen&&Object.isFrozen(a)};goog.proto2={};goog.proto2.Util={};goog.proto2.Util.PBCHECK=!COMPILED;goog.proto2.Util.assert=function(a,b){goog.proto2.Util.PBCHECK&&goog.asserts.assert(a,b)};goog.proto2.Util.conductChecks=function(){return goog.proto2.Util.PBCHECK};goog.proto2.Descriptor=function(a,b,c){this.messageType_=a;this.name_=b.name||null;this.fullName_=b.fullName||null;this.containingType_=b.containingType;this.fields_={};for(a=0;a<c.length;a++)b=c[a],this.fields_[b.getTag()]=b};goog.proto2.Descriptor.prototype.getName=function(){return this.name_};goog.proto2.Descriptor.prototype.getFullName=function(){return this.fullName_};
goog.proto2.Descriptor.prototype.getContainingType=function(){return this.containingType_?this.containingType_.getDescriptor():null};goog.proto2.Descriptor.prototype.getFields=function(){var a=goog.object.getValues(this.fields_);goog.array.sort(a,function(a,c){return a.getTag()-c.getTag()});return a};goog.proto2.Descriptor.prototype.getFieldsMap=function(){return this.fields_};
goog.proto2.Descriptor.prototype.findFieldByName=function(a){return goog.object.findValue(this.fields_,function(b,c,d){return b.getName()==a})||null};goog.proto2.Descriptor.prototype.findFieldByTag=function(a){goog.proto2.Util.assert(goog.string.isNumeric(a));return this.fields_[parseInt(a,10)]||null};goog.proto2.Descriptor.prototype.createMessageInstance=function(){return new this.messageType_};goog.proto2.FieldDescriptor=function(a,b,c){this.parent_=a;goog.proto2.Util.assert(goog.string.isNumeric(b));this.tag_=b;this.name_=c.name;this.isRepeated_=!!c.repeated;this.isRequired_=!!c.required;this.fieldType_=c.fieldType;this.nativeType_=c.type;this.deserializationConversionPermitted_=!1;switch(this.fieldType_){case goog.proto2.FieldDescriptor.FieldType.INT64:case goog.proto2.FieldDescriptor.FieldType.UINT64:case goog.proto2.FieldDescriptor.FieldType.FIXED64:case goog.proto2.FieldDescriptor.FieldType.SFIXED64:case goog.proto2.FieldDescriptor.FieldType.SINT64:this.deserializationConversionPermitted_=
!0}this.defaultValue_=c.defaultValue};goog.proto2.FieldDescriptor.FieldType={DOUBLE:1,FLOAT:2,INT64:3,UINT64:4,INT32:5,FIXED64:6,FIXED32:7,BOOL:8,STRING:9,GROUP:10,MESSAGE:11,BYTES:12,UINT32:13,ENUM:14,SFIXED32:15,SFIXED64:16,SINT32:17,SINT64:18};goog.proto2.FieldDescriptor.prototype.getTag=function(){return this.tag_};goog.proto2.FieldDescriptor.prototype.getContainingType=function(){return this.parent_.getDescriptor()};goog.proto2.FieldDescriptor.prototype.getName=function(){return this.name_};
goog.proto2.FieldDescriptor.prototype.getDefaultValue=function(){if(void 0===this.defaultValue_){var a=this.nativeType_;this.defaultValue_=a===Boolean?!1:a===Number?0:a===String?"":new a}return this.defaultValue_};goog.proto2.FieldDescriptor.prototype.getFieldType=function(){return this.fieldType_};goog.proto2.FieldDescriptor.prototype.getNativeType=function(){return this.nativeType_};goog.proto2.FieldDescriptor.prototype.deserializationConversionPermitted=function(){return this.deserializationConversionPermitted_};
goog.proto2.FieldDescriptor.prototype.getFieldMessageType=function(){goog.proto2.Util.assert(this.isCompositeType(),"Expected message or group");return this.nativeType_.getDescriptor()};goog.proto2.FieldDescriptor.prototype.isCompositeType=function(){return this.fieldType_==goog.proto2.FieldDescriptor.FieldType.MESSAGE||this.fieldType_==goog.proto2.FieldDescriptor.FieldType.GROUP};goog.proto2.FieldDescriptor.prototype.isRepeated=function(){return this.isRepeated_};
goog.proto2.FieldDescriptor.prototype.isRequired=function(){return this.isRequired_};goog.proto2.FieldDescriptor.prototype.isOptional=function(){return!this.isRepeated_&&!this.isRequired_};goog.proto2.Message=function(){this.values_={};this.fields_=this.getDescriptor().getFieldsMap();this.deserializedFields_=this.lazyDeserializer_=null};goog.proto2.Message.FieldType={DOUBLE:1,FLOAT:2,INT64:3,UINT64:4,INT32:5,FIXED64:6,FIXED32:7,BOOL:8,STRING:9,GROUP:10,MESSAGE:11,BYTES:12,UINT32:13,ENUM:14,SFIXED32:15,SFIXED64:16,SINT32:17,SINT64:18};goog.proto2.Message.prototype.initializeForLazyDeserializer=function(a,b){this.lazyDeserializer_=a;this.values_=b;this.deserializedFields_={}};
goog.proto2.Message.prototype.setUnknown=function(a,b){goog.proto2.Util.assert(!this.fields_[a],"Field is not unknown in this message");goog.proto2.Util.assert(1<=a,"Tag is not valid");goog.proto2.Util.assert(null!==b,"Value cannot be null");this.values_[a]=b;this.deserializedFields_&&delete this.deserializedFields_[a]};goog.proto2.Message.prototype.forEachUnknown=function(a,b){var c=b||this,d;for(d in this.values_){var e=Number(d);this.fields_[e]||a.call(c,e,this.values_[d])}};
goog.proto2.Message.prototype.getDescriptor=function(){var a=this.constructor;return a.descriptor_||(a.descriptor_=goog.proto2.Message.create$Descriptor(a,a.descriptorObj_))};goog.proto2.Message.prototype.has=function(a){goog.proto2.Util.assert(a.getContainingType()==this.getDescriptor(),"The current message does not contain the given field");return this.has$Value(a.getTag())};
goog.proto2.Message.prototype.arrayOf=function(a){goog.proto2.Util.assert(a.getContainingType()==this.getDescriptor(),"The current message does not contain the given field");return this.array$Values(a.getTag())};goog.proto2.Message.prototype.countOf=function(a){goog.proto2.Util.assert(a.getContainingType()==this.getDescriptor(),"The current message does not contain the given field");return this.count$Values(a.getTag())};
goog.proto2.Message.prototype.get=function(a,b){goog.proto2.Util.assert(a.getContainingType()==this.getDescriptor(),"The current message does not contain the given field");return this.get$Value(a.getTag(),b)};goog.proto2.Message.prototype.getOrDefault=function(a,b){goog.proto2.Util.assert(a.getContainingType()==this.getDescriptor(),"The current message does not contain the given field");return this.get$ValueOrDefault(a.getTag(),b)};
goog.proto2.Message.prototype.set=function(a,b){goog.proto2.Util.assert(a.getContainingType()==this.getDescriptor(),"The current message does not contain the given field");this.set$Value(a.getTag(),b)};goog.proto2.Message.prototype.add=function(a,b){goog.proto2.Util.assert(a.getContainingType()==this.getDescriptor(),"The current message does not contain the given field");this.add$Value(a.getTag(),b)};
goog.proto2.Message.prototype.clear=function(a){goog.proto2.Util.assert(a.getContainingType()==this.getDescriptor(),"The current message does not contain the given field");this.clear$Field(a.getTag())};
goog.proto2.Message.prototype.equals=function(a){if(!a||this.constructor!=a.constructor)return!1;for(var b=this.getDescriptor().getFields(),c=0;c<b.length;c++){var d=b[c];if(this.has(d)!=a.has(d))return!1;if(this.has(d)){var e=d.isCompositeType(),f=this.getValueForField_(d),g=a.getValueForField_(d);if(d.isRepeated()){if(f.length!=g.length)return!1;for(d=0;d<f.length;d++)if(e?!f[d].equals(g[d]):f[d]!=g[d])return!1}else if(e?!f.equals(g):f!=g)return!1}}return!0};
goog.proto2.Message.prototype.copyFrom=function(a){goog.proto2.Util.assert(this.constructor==a.constructor,"The source message must have the same type.");this!=a&&(this.values_={},this.deserializedFields_&&(this.deserializedFields_={}),this.mergeFrom(a))};
goog.proto2.Message.prototype.mergeFrom=function(a){goog.proto2.Util.assert(this.constructor==a.constructor,"The source message must have the same type.");for(var b=this.getDescriptor().getFields(),c=0;c<b.length;c++){var d=b[c];if(a.has(d)){this.deserializedFields_&&delete this.deserializedFields_[d.getTag()];var e=d.isCompositeType();if(d.isRepeated())for(var f=a.arrayOf(d),g=0;g<f.length;g++)this.add(d,e?f[g].clone():f[g]);else f=a.getValueForField_(d),e?(e=this.getValueForField_(d))?e.mergeFrom(f):
this.set(d,f.clone()):this.set(d,f)}}};goog.proto2.Message.prototype.clone=function(){var a=new this.constructor;a.copyFrom(this);return a};
goog.proto2.Message.prototype.initDefaults=function(a){for(var b=this.getDescriptor().getFields(),c=0;c<b.length;c++){var d=b[c],e=d.getTag(),f=d.isCompositeType();this.has(d)||d.isRepeated()||(f?this.values_[e]=new (d.getNativeType()):a&&(this.values_[e]=d.getDefaultValue()));if(f)if(d.isRepeated())for(d=this.array$Values(e),e=0;e<d.length;e++)d[e].initDefaults(a);else this.get$Value(e).initDefaults(a)}};
goog.proto2.Message.prototype.getFieldByTag_=function(a){goog.proto2.Util.assert(this.fields_[a],"No field found for the given tag");return this.fields_[a]};goog.proto2.Message.prototype.has$Value=function(a){goog.proto2.Util.assert(this.fields_[a],"No field found for the given tag");return goog.isDefAndNotNull(this.values_[a])};
goog.proto2.Message.prototype.getValueForField_=function(a){var b=a.getTag(),c=this.values_[b];return goog.isDefAndNotNull(c)?this.lazyDeserializer_?b in this.deserializedFields_?this.deserializedFields_[b]:(a=this.lazyDeserializer_.deserializeField(this,a,c),this.deserializedFields_[b]=a):c:null};
goog.proto2.Message.prototype.get$Value=function(a,b){var c=this.getFieldByTag_(a),d=this.getValueForField_(c);if(c.isRepeated())return goog.proto2.Util.assert(goog.isArray(d)),c=b||0,goog.proto2.Util.assert(0<=c&&c<d.length,"Given index is out of bounds"),d[c];goog.proto2.Util.assert(!goog.isArray(d));return d};goog.proto2.Message.prototype.get$ValueOrDefault=function(a,b){return this.has$Value(a)?this.get$Value(a,b):this.getFieldByTag_(a).getDefaultValue()};
goog.proto2.Message.prototype.array$Values=function(a){goog.proto2.Util.assert(this.getFieldByTag_(a).isRepeated(),"Cannot call fieldArray on a non-repeated field");a=this.getFieldByTag_(a);a=this.getValueForField_(a);goog.proto2.Util.assert(null==a||goog.isArray(a));return a||[]};
goog.proto2.Message.prototype.count$Values=function(a){return this.getFieldByTag_(a).isRepeated()?(this.has$Value(a)&&goog.proto2.Util.assert(goog.isArray(this.values_[a])),this.has$Value(a)?this.values_[a].length:0):this.has$Value(a)?1:0};
goog.proto2.Message.prototype.set$Value=function(a,b){if(goog.proto2.Util.conductChecks()){var c=this.getFieldByTag_(a);goog.proto2.Util.assert(!c.isRepeated(),"Cannot call set on a repeated field");this.checkFieldType_(c,b)}this.values_[a]=b;this.deserializedFields_&&(this.deserializedFields_[a]=b)};
goog.proto2.Message.prototype.add$Value=function(a,b){if(goog.proto2.Util.conductChecks()){var c=this.getFieldByTag_(a);goog.proto2.Util.assert(c.isRepeated(),"Cannot call add on a non-repeated field");this.checkFieldType_(c,b)}this.values_[a]||(this.values_[a]=[]);this.values_[a].push(b);this.deserializedFields_&&delete this.deserializedFields_[a]};
goog.proto2.Message.prototype.checkFieldType_=function(a,b){goog.proto2.Util.assert(null!==b);var c=a.getNativeType();c===String?goog.proto2.Util.assert("string"===typeof b,"Expected value of type string"):c===Boolean?goog.proto2.Util.assert("boolean"===typeof b,"Expected value of type boolean"):c===Number?goog.proto2.Util.assert("number"===typeof b,"Expected value of type number"):a.getFieldType()==goog.proto2.FieldDescriptor.FieldType.ENUM?goog.proto2.Util.assert("number"===typeof b,"Expected an enum value, which is a number"):
goog.proto2.Util.assert(b instanceof c,"Expected a matching message type")};goog.proto2.Message.prototype.clear$Field=function(a){goog.proto2.Util.assert(this.getFieldByTag_(a),"Unknown field");delete this.values_[a];this.deserializedFields_&&delete this.deserializedFields_[a]};
goog.proto2.Message.create$Descriptor=function(a,b){var c=[],d,e;for(e in b)b.hasOwnProperty(e)&&(goog.proto2.Util.assert(goog.string.isNumeric(e),"Keys must be numeric"),0==e?d=b[0]:c.push(new goog.proto2.FieldDescriptor(a,e,b[e])));goog.proto2.Util.assert(d);return new goog.proto2.Descriptor(a,d,c)};goog.proto2.Message.set$Metadata=function(a,b){a.descriptorObj_=b;a.getDescriptor=function(){return a.descriptor_||(new a).getDescriptor()}};goog.proto2.Serializer=function(){};goog.proto2.Serializer.DECODE_SYMBOLIC_ENUMS=!1;goog.proto2.Serializer.prototype.getSerializedValue=function(a,b){return a.isCompositeType()?this.serialize(b):b};goog.proto2.Serializer.prototype.deserialize=function(a,b){var c=a.createMessageInstance();this.deserializeTo(c,b);goog.proto2.Util.assert(c instanceof goog.proto2.Message);return c};
goog.proto2.Serializer.prototype.getDeserializedValue=function(a,b){if(a.isCompositeType())return b instanceof goog.proto2.Message?b:this.deserialize(a.getFieldMessageType(),b);if(a.getFieldType()==goog.proto2.FieldDescriptor.FieldType.ENUM){if(goog.proto2.Serializer.DECODE_SYMBOLIC_ENUMS&&goog.isString(b)){var c=a.getNativeType();if(c.hasOwnProperty(b))return c[b]}return b}if(!a.deserializationConversionPermitted())return b;c=a.getNativeType();if(c===String){if(goog.isNumber(b))return String(b)}else if(c===
Number&&goog.isString(b)&&/^-?[0-9]+$/.test(b))return Number(b);return b};goog.proto2.LazyDeserializer=function(){};goog.inherits(goog.proto2.LazyDeserializer,goog.proto2.Serializer);goog.proto2.LazyDeserializer.prototype.deserialize=function(a,b){var c=a.createMessageInstance();c.initializeForLazyDeserializer(this,b);goog.proto2.Util.assert(c instanceof goog.proto2.Message);return c};goog.proto2.LazyDeserializer.prototype.deserializeTo=function(a,b){throw Error("Unimplemented");};goog.proto2.PbLiteSerializer=function(){};goog.inherits(goog.proto2.PbLiteSerializer,goog.proto2.LazyDeserializer);goog.proto2.PbLiteSerializer.prototype.zeroIndexing_=!1;goog.proto2.PbLiteSerializer.prototype.setZeroIndexed=function(a){this.zeroIndexing_=a};
goog.proto2.PbLiteSerializer.prototype.serialize=function(a){for(var b=a.getDescriptor().getFields(),c=[],d=this.zeroIndexing_,e=0;e<b.length;e++){var f=b[e];if(a.has(f)){var g=f.getTag(),g=d?g-1:g;if(f.isRepeated()){c[g]=[];for(var h=0;h<a.countOf(f);h++)c[g][h]=this.getSerializedValue(f,a.get(f,h))}else c[g]=this.getSerializedValue(f,a.get(f))}}a.forEachUnknown(function(a,b){c[d?a-1:a]=b});return c};
goog.proto2.PbLiteSerializer.prototype.deserializeField=function(a,b,c){if(null==c)return c;if(b.isRepeated()){a=[];goog.proto2.Util.assert(goog.isArray(c));for(var d=0;d<c.length;d++)a[d]=this.getDeserializedValue(b,c[d]);return a}return this.getDeserializedValue(b,c)};goog.proto2.PbLiteSerializer.prototype.getSerializedValue=function(a,b){return a.getFieldType()==goog.proto2.FieldDescriptor.FieldType.BOOL?b?1:0:goog.proto2.Serializer.prototype.getSerializedValue.apply(this,arguments)};
goog.proto2.PbLiteSerializer.prototype.getDeserializedValue=function(a,b){return a.getFieldType()==goog.proto2.FieldDescriptor.FieldType.BOOL?1===b:goog.proto2.Serializer.prototype.getDeserializedValue.apply(this,arguments)};goog.proto2.PbLiteSerializer.prototype.deserialize=function(a,b){var c=b;if(this.zeroIndexing_){var c=[],d;for(d in b)c[parseInt(d,10)+1]=b[d]}return goog.proto2.PbLiteSerializer.superClass_.deserialize.call(this,a,c)};goog.userAgent={};goog.userAgent.ASSUME_IE=!1;goog.userAgent.ASSUME_GECKO=!1;goog.userAgent.ASSUME_WEBKIT=!1;goog.userAgent.ASSUME_MOBILE_WEBKIT=!1;goog.userAgent.ASSUME_OPERA=!1;goog.userAgent.ASSUME_ANY_VERSION=!1;goog.userAgent.BROWSER_KNOWN_=goog.userAgent.ASSUME_IE||goog.userAgent.ASSUME_GECKO||goog.userAgent.ASSUME_MOBILE_WEBKIT||goog.userAgent.ASSUME_WEBKIT||goog.userAgent.ASSUME_OPERA;
goog.userAgent.getUserAgentString=function(){return goog.global.navigator?goog.global.navigator.userAgent:null};goog.userAgent.getNavigator=function(){return goog.global.navigator};
goog.userAgent.init_=function(){goog.userAgent.detectedOpera_=!1;goog.userAgent.detectedIe_=!1;goog.userAgent.detectedWebkit_=!1;goog.userAgent.detectedMobile_=!1;goog.userAgent.detectedGecko_=!1;var a;if(!goog.userAgent.BROWSER_KNOWN_&&(a=goog.userAgent.getUserAgentString())){var b=goog.userAgent.getNavigator();goog.userAgent.detectedOpera_=goog.string.startsWith(a,"Opera");goog.userAgent.detectedIe_=!goog.userAgent.detectedOpera_&&(goog.string.contains(a,"MSIE")||goog.string.contains(a,"Trident"));
goog.userAgent.detectedWebkit_=!goog.userAgent.detectedOpera_&&goog.string.contains(a,"WebKit");goog.userAgent.detectedMobile_=goog.userAgent.detectedWebkit_&&goog.string.contains(a,"Mobile");goog.userAgent.detectedGecko_=!goog.userAgent.detectedOpera_&&!goog.userAgent.detectedWebkit_&&!goog.userAgent.detectedIe_&&"Gecko"==b.product}};goog.userAgent.BROWSER_KNOWN_||goog.userAgent.init_();goog.userAgent.OPERA=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_OPERA:goog.userAgent.detectedOpera_;
goog.userAgent.IE=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_IE:goog.userAgent.detectedIe_;goog.userAgent.GECKO=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_GECKO:goog.userAgent.detectedGecko_;goog.userAgent.WEBKIT=goog.userAgent.BROWSER_KNOWN_?goog.userAgent.ASSUME_WEBKIT||goog.userAgent.ASSUME_MOBILE_WEBKIT:goog.userAgent.detectedWebkit_;goog.userAgent.MOBILE=goog.userAgent.ASSUME_MOBILE_WEBKIT||goog.userAgent.detectedMobile_;goog.userAgent.SAFARI=goog.userAgent.WEBKIT;
goog.userAgent.determinePlatform_=function(){var a=goog.userAgent.getNavigator();return a&&a.platform||""};goog.userAgent.PLATFORM=goog.userAgent.determinePlatform_();goog.userAgent.ASSUME_MAC=!1;goog.userAgent.ASSUME_WINDOWS=!1;goog.userAgent.ASSUME_LINUX=!1;goog.userAgent.ASSUME_X11=!1;goog.userAgent.ASSUME_ANDROID=!1;goog.userAgent.ASSUME_IPHONE=!1;goog.userAgent.ASSUME_IPAD=!1;
goog.userAgent.PLATFORM_KNOWN_=goog.userAgent.ASSUME_MAC||goog.userAgent.ASSUME_WINDOWS||goog.userAgent.ASSUME_LINUX||goog.userAgent.ASSUME_X11||goog.userAgent.ASSUME_ANDROID||goog.userAgent.ASSUME_IPHONE||goog.userAgent.ASSUME_IPAD;
goog.userAgent.initPlatform_=function(){goog.userAgent.detectedMac_=goog.string.contains(goog.userAgent.PLATFORM,"Mac");goog.userAgent.detectedWindows_=goog.string.contains(goog.userAgent.PLATFORM,"Win");goog.userAgent.detectedLinux_=goog.string.contains(goog.userAgent.PLATFORM,"Linux");goog.userAgent.detectedX11_=!!goog.userAgent.getNavigator()&&goog.string.contains(goog.userAgent.getNavigator().appVersion||"","X11");var a=goog.userAgent.getUserAgentString();goog.userAgent.detectedAndroid_=!!a&&
goog.string.contains(a,"Android");goog.userAgent.detectedIPhone_=!!a&&goog.string.contains(a,"iPhone");goog.userAgent.detectedIPad_=!!a&&goog.string.contains(a,"iPad")};goog.userAgent.PLATFORM_KNOWN_||goog.userAgent.initPlatform_();goog.userAgent.MAC=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_MAC:goog.userAgent.detectedMac_;goog.userAgent.WINDOWS=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_WINDOWS:goog.userAgent.detectedWindows_;
goog.userAgent.LINUX=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_LINUX:goog.userAgent.detectedLinux_;goog.userAgent.X11=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_X11:goog.userAgent.detectedX11_;goog.userAgent.ANDROID=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_ANDROID:goog.userAgent.detectedAndroid_;goog.userAgent.IPHONE=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_IPHONE:goog.userAgent.detectedIPhone_;
goog.userAgent.IPAD=goog.userAgent.PLATFORM_KNOWN_?goog.userAgent.ASSUME_IPAD:goog.userAgent.detectedIPad_;
goog.userAgent.determineVersion_=function(){var a="",b;goog.userAgent.OPERA&&goog.global.opera?(a=goog.global.opera.version,a="function"==typeof a?a():a):(goog.userAgent.GECKO?b=/rv\:([^\);]+)(\)|;)/:goog.userAgent.IE?b=/\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/:goog.userAgent.WEBKIT&&(b=/WebKit\/(\S+)/),b&&(a=(a=b.exec(goog.userAgent.getUserAgentString()))?a[1]:""));return goog.userAgent.IE&&(b=goog.userAgent.getDocumentMode_(),b>parseFloat(a))?String(b):a};
goog.userAgent.getDocumentMode_=function(){var a=goog.global.document;return a?a.documentMode:void 0};goog.userAgent.VERSION=goog.userAgent.determineVersion_();goog.userAgent.compare=function(a,b){return goog.string.compareVersions(a,b)};goog.userAgent.isVersionOrHigherCache_={};
goog.userAgent.isVersionOrHigher=function(a){return goog.userAgent.ASSUME_ANY_VERSION||goog.userAgent.isVersionOrHigherCache_[a]||(goog.userAgent.isVersionOrHigherCache_[a]=0<=goog.string.compareVersions(goog.userAgent.VERSION,a))};goog.userAgent.isVersion=goog.userAgent.isVersionOrHigher;goog.userAgent.isDocumentModeOrHigher=function(a){return goog.userAgent.IE&&goog.userAgent.DOCUMENT_MODE>=a};goog.userAgent.isDocumentMode=goog.userAgent.isDocumentModeOrHigher;
goog.userAgent.DOCUMENT_MODE=function(){var a=goog.global.document;return a&&goog.userAgent.IE?goog.userAgent.getDocumentMode_()||("CSS1Compat"==a.compatMode?parseInt(goog.userAgent.VERSION,10):5):void 0}();goog.dom={};goog.dom.BrowserFeature={CAN_ADD_NAME_OR_TYPE_ATTRIBUTES:!goog.userAgent.IE||goog.userAgent.isDocumentModeOrHigher(9),CAN_USE_CHILDREN_ATTRIBUTE:!goog.userAgent.GECKO&&!goog.userAgent.IE||goog.userAgent.IE&&goog.userAgent.isDocumentModeOrHigher(9)||goog.userAgent.GECKO&&goog.userAgent.isVersionOrHigher("1.9.1"),CAN_USE_INNER_TEXT:goog.userAgent.IE&&!goog.userAgent.isVersionOrHigher("9"),CAN_USE_PARENT_ELEMENT_PROPERTY:goog.userAgent.IE||goog.userAgent.OPERA||goog.userAgent.WEBKIT,INNER_HTML_NEEDS_SCOPED_ELEMENT:goog.userAgent.IE};goog.dom.NodeType={ELEMENT:1,ATTRIBUTE:2,TEXT:3,CDATA_SECTION:4,ENTITY_REFERENCE:5,ENTITY:6,PROCESSING_INSTRUCTION:7,COMMENT:8,DOCUMENT:9,DOCUMENT_TYPE:10,DOCUMENT_FRAGMENT:11,NOTATION:12};goog.dom.TagName={A:"A",ABBR:"ABBR",ACRONYM:"ACRONYM",ADDRESS:"ADDRESS",APPLET:"APPLET",AREA:"AREA",ARTICLE:"ARTICLE",ASIDE:"ASIDE",AUDIO:"AUDIO",B:"B",BASE:"BASE",BASEFONT:"BASEFONT",BDI:"BDI",BDO:"BDO",BIG:"BIG",BLOCKQUOTE:"BLOCKQUOTE",BODY:"BODY",BR:"BR",BUTTON:"BUTTON",CANVAS:"CANVAS",CAPTION:"CAPTION",CENTER:"CENTER",CITE:"CITE",CODE:"CODE",COL:"COL",COLGROUP:"COLGROUP",COMMAND:"COMMAND",DATA:"DATA",DATALIST:"DATALIST",DD:"DD",DEL:"DEL",DETAILS:"DETAILS",DFN:"DFN",DIALOG:"DIALOG",DIR:"DIR",DIV:"DIV",
DL:"DL",DT:"DT",EM:"EM",EMBED:"EMBED",FIELDSET:"FIELDSET",FIGCAPTION:"FIGCAPTION",FIGURE:"FIGURE",FONT:"FONT",FOOTER:"FOOTER",FORM:"FORM",FRAME:"FRAME",FRAMESET:"FRAMESET",H1:"H1",H2:"H2",H3:"H3",H4:"H4",H5:"H5",H6:"H6",HEAD:"HEAD",HEADER:"HEADER",HGROUP:"HGROUP",HR:"HR",HTML:"HTML",I:"I",IFRAME:"IFRAME",IMG:"IMG",INPUT:"INPUT",INS:"INS",ISINDEX:"ISINDEX",KBD:"KBD",KEYGEN:"KEYGEN",LABEL:"LABEL",LEGEND:"LEGEND",LI:"LI",LINK:"LINK",MAP:"MAP",MARK:"MARK",MATH:"MATH",MENU:"MENU",META:"META",METER:"METER",
NAV:"NAV",NOFRAMES:"NOFRAMES",NOSCRIPT:"NOSCRIPT",OBJECT:"OBJECT",OL:"OL",OPTGROUP:"OPTGROUP",OPTION:"OPTION",OUTPUT:"OUTPUT",P:"P",PARAM:"PARAM",PRE:"PRE",PROGRESS:"PROGRESS",Q:"Q",RP:"RP",RT:"RT",RUBY:"RUBY",S:"S",SAMP:"SAMP",SCRIPT:"SCRIPT",SECTION:"SECTION",SELECT:"SELECT",SMALL:"SMALL",SOURCE:"SOURCE",SPAN:"SPAN",STRIKE:"STRIKE",STRONG:"STRONG",STYLE:"STYLE",SUB:"SUB",SUMMARY:"SUMMARY",SUP:"SUP",SVG:"SVG",TABLE:"TABLE",TBODY:"TBODY",TD:"TD",TEXTAREA:"TEXTAREA",TFOOT:"TFOOT",TH:"TH",THEAD:"THEAD",
TIME:"TIME",TITLE:"TITLE",TR:"TR",TRACK:"TRACK",TT:"TT",U:"U",UL:"UL",VAR:"VAR",VIDEO:"VIDEO",WBR:"WBR"};goog.dom.classes={};goog.dom.classes.set=function(a,b){a.className=b};goog.dom.classes.get=function(a){a=a.className;return goog.isString(a)&&a.match(/\S+/g)||[]};goog.dom.classes.add=function(a,b){var c=goog.dom.classes.get(a),d=goog.array.slice(arguments,1),e=c.length+d.length;goog.dom.classes.add_(c,d);goog.dom.classes.set(a,c.join(" "));return c.length==e};
goog.dom.classes.remove=function(a,b){var c=goog.dom.classes.get(a),d=goog.array.slice(arguments,1),e=goog.dom.classes.getDifference_(c,d);goog.dom.classes.set(a,e.join(" "));return e.length==c.length-d.length};goog.dom.classes.add_=function(a,b){for(var c=0;c<b.length;c++)goog.array.contains(a,b[c])||a.push(b[c])};goog.dom.classes.getDifference_=function(a,b){return goog.array.filter(a,function(a){return!goog.array.contains(b,a)})};
goog.dom.classes.swap=function(a,b,c){for(var d=goog.dom.classes.get(a),e=!1,f=0;f<d.length;f++)d[f]==b&&(goog.array.splice(d,f--,1),e=!0);e&&(d.push(c),goog.dom.classes.set(a,d.join(" ")));return e};goog.dom.classes.addRemove=function(a,b,c){var d=goog.dom.classes.get(a);goog.isString(b)?goog.array.remove(d,b):goog.isArray(b)&&(d=goog.dom.classes.getDifference_(d,b));goog.isString(c)&&!goog.array.contains(d,c)?d.push(c):goog.isArray(c)&&goog.dom.classes.add_(d,c);goog.dom.classes.set(a,d.join(" "))};
goog.dom.classes.has=function(a,b){return goog.array.contains(goog.dom.classes.get(a),b)};goog.dom.classes.enable=function(a,b,c){c?goog.dom.classes.add(a,b):goog.dom.classes.remove(a,b)};goog.dom.classes.toggle=function(a,b){var c=!goog.dom.classes.has(a,b);goog.dom.classes.enable(a,b,c);return c};goog.functions={};goog.functions.constant=function(a){return function(){return a}};goog.functions.FALSE=goog.functions.constant(!1);goog.functions.TRUE=goog.functions.constant(!0);goog.functions.NULL=goog.functions.constant(null);goog.functions.identity=function(a,b){return a};goog.functions.error=function(a){return function(){throw Error(a);}};goog.functions.fail=function(a){return function(){throw a;}};
goog.functions.lock=function(a,b){b=b||0;return function(){return a.apply(this,Array.prototype.slice.call(arguments,0,b))}};goog.functions.nth=function(a){return function(){return arguments[a]}};goog.functions.withReturnValue=function(a,b){return goog.functions.sequence(a,goog.functions.constant(b))};goog.functions.compose=function(a,b){var c=arguments,d=c.length;return function(){var a;d&&(a=c[d-1].apply(this,arguments));for(var b=d-2;0<=b;b--)a=c[b].call(this,a);return a}};
goog.functions.sequence=function(a){var b=arguments,c=b.length;return function(){for(var a,e=0;e<c;e++)a=b[e].apply(this,arguments);return a}};goog.functions.and=function(a){var b=arguments,c=b.length;return function(){for(var a=0;a<c;a++)if(!b[a].apply(this,arguments))return!1;return!0}};goog.functions.or=function(a){var b=arguments,c=b.length;return function(){for(var a=0;a<c;a++)if(b[a].apply(this,arguments))return!0;return!1}};
goog.functions.not=function(a){return function(){return!a.apply(this,arguments)}};goog.functions.create=function(a,b){var c=function(){};c.prototype=a.prototype;c=new c;a.apply(c,Array.prototype.slice.call(arguments,1));return c};goog.functions.CACHE_RETURN_VALUE=!0;goog.functions.cacheReturnValue=function(a){var b=!1,c;return function(){if(!goog.functions.CACHE_RETURN_VALUE)return a();b||(c=a(),b=!0);return c}};goog.math={};goog.math.randomInt=function(a){return Math.floor(Math.random()*a)};goog.math.uniformRandom=function(a,b){return a+Math.random()*(b-a)};goog.math.clamp=function(a,b,c){return Math.min(Math.max(a,b),c)};goog.math.modulo=function(a,b){var c=a%b;return 0>c*b?c+b:c};goog.math.lerp=function(a,b,c){return a+c*(b-a)};goog.math.nearlyEquals=function(a,b,c){return Math.abs(a-b)<=(c||1E-6)};goog.math.standardAngle=function(a){return goog.math.modulo(a,360)};
goog.math.toRadians=function(a){return a*Math.PI/180};goog.math.toDegrees=function(a){return 180*a/Math.PI};goog.math.angleDx=function(a,b){return b*Math.cos(goog.math.toRadians(a))};goog.math.angleDy=function(a,b){return b*Math.sin(goog.math.toRadians(a))};goog.math.angle=function(a,b,c,d){return goog.math.standardAngle(goog.math.toDegrees(Math.atan2(d-b,c-a)))};goog.math.angleDifference=function(a,b){var c=goog.math.standardAngle(b)-goog.math.standardAngle(a);180<c?c-=360:-180>=c&&(c=360+c);return c};
goog.math.sign=function(a){return 0==a?0:0>a?-1:1};goog.math.longestCommonSubsequence=function(a,b,c,d){c=c||function(a,b){return a==b};d=d||function(b,c){return a[b]};for(var e=a.length,f=b.length,g=[],h=0;h<e+1;h++)g[h]=[],g[h][0]=0;for(var k=0;k<f+1;k++)g[0][k]=0;for(h=1;h<=e;h++)for(k=1;k<=f;k++)c(a[h-1],b[k-1])?g[h][k]=g[h-1][k-1]+1:g[h][k]=Math.max(g[h-1][k],g[h][k-1]);for(var l=[],h=e,k=f;0<h&&0<k;)c(a[h-1],b[k-1])?(l.unshift(d(h-1,k-1)),h--,k--):g[h-1][k]>g[h][k-1]?h--:k--;return l};
goog.math.sum=function(a){return goog.array.reduce(arguments,function(a,c){return a+c},0)};goog.math.average=function(a){return goog.math.sum.apply(null,arguments)/arguments.length};goog.math.standardDeviation=function(a){var b=arguments.length;if(2>b)return 0;var c=goog.math.average.apply(null,arguments),b=goog.math.sum.apply(null,goog.array.map(arguments,function(a){return Math.pow(a-c,2)}))/(b-1);return Math.sqrt(b)};goog.math.isInt=function(a){return isFinite(a)&&0==a%1};
goog.math.isFiniteNumber=function(a){return isFinite(a)&&!isNaN(a)};goog.math.safeFloor=function(a,b){goog.asserts.assert(!goog.isDef(b)||0<b);return Math.floor(a+(b||2E-15))};goog.math.safeCeil=function(a,b){goog.asserts.assert(!goog.isDef(b)||0<b);return Math.ceil(a-(b||2E-15))};goog.math.Coordinate=function(a,b){this.x=goog.isDef(a)?a:0;this.y=goog.isDef(b)?b:0};goog.math.Coordinate.prototype.clone=function(){return new goog.math.Coordinate(this.x,this.y)};goog.DEBUG&&(goog.math.Coordinate.prototype.toString=function(){return"("+this.x+", "+this.y+")"});goog.math.Coordinate.equals=function(a,b){return a==b?!0:a&&b?a.x==b.x&&a.y==b.y:!1};goog.math.Coordinate.distance=function(a,b){var c=a.x-b.x,d=a.y-b.y;return Math.sqrt(c*c+d*d)};
goog.math.Coordinate.magnitude=function(a){return Math.sqrt(a.x*a.x+a.y*a.y)};goog.math.Coordinate.azimuth=function(a){return goog.math.angle(0,0,a.x,a.y)};goog.math.Coordinate.squaredDistance=function(a,b){var c=a.x-b.x,d=a.y-b.y;return c*c+d*d};goog.math.Coordinate.difference=function(a,b){return new goog.math.Coordinate(a.x-b.x,a.y-b.y)};goog.math.Coordinate.sum=function(a,b){return new goog.math.Coordinate(a.x+b.x,a.y+b.y)};
goog.math.Coordinate.prototype.ceil=function(){this.x=Math.ceil(this.x);this.y=Math.ceil(this.y);return this};goog.math.Coordinate.prototype.floor=function(){this.x=Math.floor(this.x);this.y=Math.floor(this.y);return this};goog.math.Coordinate.prototype.round=function(){this.x=Math.round(this.x);this.y=Math.round(this.y);return this};goog.math.Coordinate.prototype.translate=function(a,b){a instanceof goog.math.Coordinate?(this.x+=a.x,this.y+=a.y):(this.x+=a,goog.isNumber(b)&&(this.y+=b));return this};
goog.math.Coordinate.prototype.scale=function(a,b){var c=goog.isNumber(b)?b:a;this.x*=a;this.y*=c;return this};goog.math.Size=function(a,b){this.width=a;this.height=b};goog.math.Size.equals=function(a,b){return a==b?!0:a&&b?a.width==b.width&&a.height==b.height:!1};goog.math.Size.prototype.clone=function(){return new goog.math.Size(this.width,this.height)};goog.DEBUG&&(goog.math.Size.prototype.toString=function(){return"("+this.width+" x "+this.height+")"});goog.math.Size.prototype.getLongest=function(){return Math.max(this.width,this.height)};
goog.math.Size.prototype.getShortest=function(){return Math.min(this.width,this.height)};goog.math.Size.prototype.area=function(){return this.width*this.height};goog.math.Size.prototype.perimeter=function(){return 2*(this.width+this.height)};goog.math.Size.prototype.aspectRatio=function(){return this.width/this.height};goog.math.Size.prototype.isEmpty=function(){return!this.area()};goog.math.Size.prototype.ceil=function(){this.width=Math.ceil(this.width);this.height=Math.ceil(this.height);return this};
goog.math.Size.prototype.fitsInside=function(a){return this.width<=a.width&&this.height<=a.height};goog.math.Size.prototype.floor=function(){this.width=Math.floor(this.width);this.height=Math.floor(this.height);return this};goog.math.Size.prototype.round=function(){this.width=Math.round(this.width);this.height=Math.round(this.height);return this};goog.math.Size.prototype.scale=function(a,b){var c=goog.isNumber(b)?b:a;this.width*=a;this.height*=c;return this};
goog.math.Size.prototype.scaleToFit=function(a){a=this.aspectRatio()>a.aspectRatio()?a.width/this.width:a.height/this.height;return this.scale(a)};goog.dom.ASSUME_QUIRKS_MODE=!1;goog.dom.ASSUME_STANDARDS_MODE=!1;goog.dom.COMPAT_MODE_KNOWN_=goog.dom.ASSUME_QUIRKS_MODE||goog.dom.ASSUME_STANDARDS_MODE;goog.dom.getDomHelper=function(a){return a?new goog.dom.DomHelper(goog.dom.getOwnerDocument(a)):goog.dom.defaultDomHelper_||(goog.dom.defaultDomHelper_=new goog.dom.DomHelper)};goog.dom.getDocument=function(){return document};goog.dom.getElement=function(a){return goog.dom.getElementHelper_(document,a)};
goog.dom.getElementHelper_=function(a,b){return goog.isString(b)?a.getElementById(b):b};goog.dom.getRequiredElement=function(a){return goog.dom.getRequiredElementHelper_(document,a)};goog.dom.getRequiredElementHelper_=function(a,b){goog.asserts.assertString(b);var c=goog.dom.getElement(b);goog.asserts.assert(c,"No element found with id: "+b);return c};goog.dom.$=goog.dom.getElement;goog.dom.getElementsByTagNameAndClass=function(a,b,c){return goog.dom.getElementsByTagNameAndClass_(document,a,b,c)};
goog.dom.getElementsByClass=function(a,b){var c=b||document;return goog.dom.canUseQuerySelector_(c)?c.querySelectorAll("."+a):c.getElementsByClassName?c.getElementsByClassName(a):goog.dom.getElementsByTagNameAndClass_(document,"*",a,b)};goog.dom.getElementByClass=function(a,b){var c=b||document,d=null;return(d=goog.dom.canUseQuerySelector_(c)?c.querySelector("."+a):goog.dom.getElementsByClass(a,b)[0])||null};goog.dom.canUseQuerySelector_=function(a){return!(!a.querySelectorAll||!a.querySelector)};
goog.dom.getElementsByTagNameAndClass_=function(a,b,c,d){a=d||a;b=b&&"*"!=b?b.toUpperCase():"";if(goog.dom.canUseQuerySelector_(a)&&(b||c))return a.querySelectorAll(b+(c?"."+c:""));if(c&&a.getElementsByClassName){a=a.getElementsByClassName(c);if(b){d={};for(var e=0,f=0,g;g=a[f];f++)b==g.nodeName&&(d[e++]=g);d.length=e;return d}return a}a=a.getElementsByTagName(b||"*");if(c){d={};for(f=e=0;g=a[f];f++)b=g.className,"function"==typeof b.split&&goog.array.contains(b.split(/\s+/),c)&&(d[e++]=g);d.length=
e;return d}return a};goog.dom.$$=goog.dom.getElementsByTagNameAndClass;goog.dom.setProperties=function(a,b){goog.object.forEach(b,function(b,d){"style"==d?a.style.cssText=b:"class"==d?a.className=b:"for"==d?a.htmlFor=b:d in goog.dom.DIRECT_ATTRIBUTE_MAP_?a.setAttribute(goog.dom.DIRECT_ATTRIBUTE_MAP_[d],b):goog.string.startsWith(d,"aria-")||goog.string.startsWith(d,"data-")?a.setAttribute(d,b):a[d]=b})};
goog.dom.DIRECT_ATTRIBUTE_MAP_={cellpadding:"cellPadding",cellspacing:"cellSpacing",colspan:"colSpan",frameborder:"frameBorder",height:"height",maxlength:"maxLength",role:"role",rowspan:"rowSpan",type:"type",usemap:"useMap",valign:"vAlign",width:"width"};goog.dom.getViewportSize=function(a){return goog.dom.getViewportSize_(a||window)};goog.dom.getViewportSize_=function(a){a=a.document;a=goog.dom.isCss1CompatMode_(a)?a.documentElement:a.body;return new goog.math.Size(a.clientWidth,a.clientHeight)};
goog.dom.getDocumentHeight=function(){return goog.dom.getDocumentHeight_(window)};goog.dom.getDocumentHeight_=function(a){var b=a.document,c=0;if(b){a=goog.dom.getViewportSize_(a).height;var c=b.body,d=b.documentElement;if(goog.dom.isCss1CompatMode_(b)&&d.scrollHeight)c=d.scrollHeight!=a?d.scrollHeight:d.offsetHeight;else{var b=d.scrollHeight,e=d.offsetHeight;d.clientHeight!=e&&(b=c.scrollHeight,e=c.offsetHeight);c=b>a?b>e?b:e:b<e?b:e}}return c};
goog.dom.getPageScroll=function(a){return goog.dom.getDomHelper((a||goog.global||window).document).getDocumentScroll()};goog.dom.getDocumentScroll=function(){return goog.dom.getDocumentScroll_(document)};
goog.dom.getDocumentScroll_=function(a){var b=goog.dom.getDocumentScrollElement_(a);a=goog.dom.getWindow_(a);return goog.userAgent.IE&&goog.userAgent.isVersionOrHigher("10")&&a.pageYOffset!=b.scrollTop?new goog.math.Coordinate(b.scrollLeft,b.scrollTop):new goog.math.Coordinate(a.pageXOffset||b.scrollLeft,a.pageYOffset||b.scrollTop)};goog.dom.getDocumentScrollElement=function(){return goog.dom.getDocumentScrollElement_(document)};
goog.dom.getDocumentScrollElement_=function(a){return!goog.userAgent.WEBKIT&&goog.dom.isCss1CompatMode_(a)?a.documentElement:a.body};goog.dom.getWindow=function(a){return a?goog.dom.getWindow_(a):window};goog.dom.getWindow_=function(a){return a.parentWindow||a.defaultView};goog.dom.createDom=function(a,b,c){return goog.dom.createDom_(document,arguments)};
goog.dom.createDom_=function(a,b){var c=b[0],d=b[1];if(!goog.dom.BrowserFeature.CAN_ADD_NAME_OR_TYPE_ATTRIBUTES&&d&&(d.name||d.type)){c=["<",c];d.name&&c.push(' name="',goog.string.htmlEscape(d.name),'"');if(d.type){c.push(' type="',goog.string.htmlEscape(d.type),'"');var e={};goog.object.extend(e,d);delete e.type;d=e}c.push(">");c=c.join("")}c=a.createElement(c);d&&(goog.isString(d)?c.className=d:goog.isArray(d)?goog.dom.classes.add.apply(null,[c].concat(d)):goog.dom.setProperties(c,d));2<b.length&&
goog.dom.append_(a,c,b,2);return c};goog.dom.append_=function(a,b,c,d){function e(c){c&&b.appendChild(goog.isString(c)?a.createTextNode(c):c)}for(;d<c.length;d++){var f=c[d];goog.isArrayLike(f)&&!goog.dom.isNodeLike(f)?goog.array.forEach(goog.dom.isNodeList(f)?goog.array.toArray(f):f,e):e(f)}};goog.dom.$dom=goog.dom.createDom;goog.dom.createElement=function(a){return document.createElement(a)};goog.dom.createTextNode=function(a){return document.createTextNode(String(a))};
goog.dom.createTable=function(a,b,c){return goog.dom.createTable_(document,a,b,!!c)};goog.dom.createTable_=function(a,b,c,d){for(var e=["<tr>"],f=0;f<c;f++)e.push(d?"<td>&nbsp;</td>":"<td></td>");e.push("</tr>");e=e.join("");c=["<table>"];for(f=0;f<b;f++)c.push(e);c.push("</table>");a=a.createElement(goog.dom.TagName.DIV);a.innerHTML=c.join("");return a.removeChild(a.firstChild)};goog.dom.htmlToDocumentFragment=function(a){return goog.dom.htmlToDocumentFragment_(document,a)};
goog.dom.htmlToDocumentFragment_=function(a,b){var c=a.createElement("div");goog.dom.BrowserFeature.INNER_HTML_NEEDS_SCOPED_ELEMENT?(c.innerHTML="<br>"+b,c.removeChild(c.firstChild)):c.innerHTML=b;if(1==c.childNodes.length)return c.removeChild(c.firstChild);for(var d=a.createDocumentFragment();c.firstChild;)d.appendChild(c.firstChild);return d};goog.dom.getCompatMode=function(){return goog.dom.isCss1CompatMode()?"CSS1Compat":"BackCompat"};goog.dom.isCss1CompatMode=function(){return goog.dom.isCss1CompatMode_(document)};
goog.dom.isCss1CompatMode_=function(a){return goog.dom.COMPAT_MODE_KNOWN_?goog.dom.ASSUME_STANDARDS_MODE:"CSS1Compat"==a.compatMode};goog.dom.canHaveChildren=function(a){if(a.nodeType!=goog.dom.NodeType.ELEMENT)return!1;switch(a.tagName){case goog.dom.TagName.APPLET:case goog.dom.TagName.AREA:case goog.dom.TagName.BASE:case goog.dom.TagName.BR:case goog.dom.TagName.COL:case goog.dom.TagName.COMMAND:case goog.dom.TagName.EMBED:case goog.dom.TagName.FRAME:case goog.dom.TagName.HR:case goog.dom.TagName.IMG:case goog.dom.TagName.INPUT:case goog.dom.TagName.IFRAME:case goog.dom.TagName.ISINDEX:case goog.dom.TagName.KEYGEN:case goog.dom.TagName.LINK:case goog.dom.TagName.NOFRAMES:case goog.dom.TagName.NOSCRIPT:case goog.dom.TagName.META:case goog.dom.TagName.OBJECT:case goog.dom.TagName.PARAM:case goog.dom.TagName.SCRIPT:case goog.dom.TagName.SOURCE:case goog.dom.TagName.STYLE:case goog.dom.TagName.TRACK:case goog.dom.TagName.WBR:return!1}return!0};
goog.dom.appendChild=function(a,b){a.appendChild(b)};goog.dom.append=function(a,b){goog.dom.append_(goog.dom.getOwnerDocument(a),a,arguments,1)};goog.dom.removeChildren=function(a){for(var b;b=a.firstChild;)a.removeChild(b)};goog.dom.insertSiblingBefore=function(a,b){b.parentNode&&b.parentNode.insertBefore(a,b)};goog.dom.insertSiblingAfter=function(a,b){b.parentNode&&b.parentNode.insertBefore(a,b.nextSibling)};goog.dom.insertChildAt=function(a,b,c){a.insertBefore(b,a.childNodes[c]||null)};
goog.dom.removeNode=function(a){return a&&a.parentNode?a.parentNode.removeChild(a):null};goog.dom.replaceNode=function(a,b){var c=b.parentNode;c&&c.replaceChild(a,b)};goog.dom.flattenElement=function(a){var b,c=a.parentNode;if(c&&c.nodeType!=goog.dom.NodeType.DOCUMENT_FRAGMENT){if(a.removeNode)return a.removeNode(!1);for(;b=a.firstChild;)c.insertBefore(b,a);return goog.dom.removeNode(a)}};
goog.dom.getChildren=function(a){return goog.dom.BrowserFeature.CAN_USE_CHILDREN_ATTRIBUTE&&void 0!=a.children?a.children:goog.array.filter(a.childNodes,function(a){return a.nodeType==goog.dom.NodeType.ELEMENT})};goog.dom.getFirstElementChild=function(a){return void 0!=a.firstElementChild?a.firstElementChild:goog.dom.getNextElementNode_(a.firstChild,!0)};goog.dom.getLastElementChild=function(a){return void 0!=a.lastElementChild?a.lastElementChild:goog.dom.getNextElementNode_(a.lastChild,!1)};
goog.dom.getNextElementSibling=function(a){return void 0!=a.nextElementSibling?a.nextElementSibling:goog.dom.getNextElementNode_(a.nextSibling,!0)};goog.dom.getPreviousElementSibling=function(a){return void 0!=a.previousElementSibling?a.previousElementSibling:goog.dom.getNextElementNode_(a.previousSibling,!1)};goog.dom.getNextElementNode_=function(a,b){for(;a&&a.nodeType!=goog.dom.NodeType.ELEMENT;)a=b?a.nextSibling:a.previousSibling;return a};
goog.dom.getNextNode=function(a){if(!a)return null;if(a.firstChild)return a.firstChild;for(;a&&!a.nextSibling;)a=a.parentNode;return a?a.nextSibling:null};goog.dom.getPreviousNode=function(a){if(!a)return null;if(!a.previousSibling)return a.parentNode;for(a=a.previousSibling;a&&a.lastChild;)a=a.lastChild;return a};goog.dom.isNodeLike=function(a){return goog.isObject(a)&&0<a.nodeType};goog.dom.isElement=function(a){return goog.isObject(a)&&a.nodeType==goog.dom.NodeType.ELEMENT};
goog.dom.isWindow=function(a){return goog.isObject(a)&&a.window==a};goog.dom.getParentElement=function(a){if(goog.dom.BrowserFeature.CAN_USE_PARENT_ELEMENT_PROPERTY&&!(goog.userAgent.IE&&goog.userAgent.isVersionOrHigher("9")&&!goog.userAgent.isVersionOrHigher("10")&&goog.global.SVGElement&&a instanceof goog.global.SVGElement))return a.parentElement;a=a.parentNode;return goog.dom.isElement(a)?a:null};
goog.dom.contains=function(a,b){if(a.contains&&b.nodeType==goog.dom.NodeType.ELEMENT)return a==b||a.contains(b);if("undefined"!=typeof a.compareDocumentPosition)return a==b||Boolean(a.compareDocumentPosition(b)&16);for(;b&&a!=b;)b=b.parentNode;return b==a};
goog.dom.compareNodeOrder=function(a,b){if(a==b)return 0;if(a.compareDocumentPosition)return a.compareDocumentPosition(b)&2?1:-1;if(goog.userAgent.IE&&!goog.userAgent.isDocumentModeOrHigher(9)){if(a.nodeType==goog.dom.NodeType.DOCUMENT)return-1;if(b.nodeType==goog.dom.NodeType.DOCUMENT)return 1}if("sourceIndex"in a||a.parentNode&&"sourceIndex"in a.parentNode){var c=a.nodeType==goog.dom.NodeType.ELEMENT,d=b.nodeType==goog.dom.NodeType.ELEMENT;if(c&&d)return a.sourceIndex-b.sourceIndex;var e=a.parentNode,
f=b.parentNode;return e==f?goog.dom.compareSiblingOrder_(a,b):!c&&goog.dom.contains(e,b)?-1*goog.dom.compareParentsDescendantNodeIe_(a,b):!d&&goog.dom.contains(f,a)?goog.dom.compareParentsDescendantNodeIe_(b,a):(c?a.sourceIndex:e.sourceIndex)-(d?b.sourceIndex:f.sourceIndex)}d=goog.dom.getOwnerDocument(a);c=d.createRange();c.selectNode(a);c.collapse(!0);d=d.createRange();d.selectNode(b);d.collapse(!0);return c.compareBoundaryPoints(goog.global.Range.START_TO_END,d)};
goog.dom.compareParentsDescendantNodeIe_=function(a,b){var c=a.parentNode;if(c==b)return-1;for(var d=b;d.parentNode!=c;)d=d.parentNode;return goog.dom.compareSiblingOrder_(d,a)};goog.dom.compareSiblingOrder_=function(a,b){for(var c=b;c=c.previousSibling;)if(c==a)return-1;return 1};
goog.dom.findCommonAncestor=function(a){var b,c=arguments.length;if(!c)return null;if(1==c)return arguments[0];var d=[],e=Infinity;for(b=0;b<c;b++){for(var f=[],g=arguments[b];g;)f.unshift(g),g=g.parentNode;d.push(f);e=Math.min(e,f.length)}f=null;for(b=0;b<e;b++){for(var g=d[0][b],h=1;h<c;h++)if(g!=d[h][b])return f;f=g}return f};goog.dom.getOwnerDocument=function(a){return a.nodeType==goog.dom.NodeType.DOCUMENT?a:a.ownerDocument||a.document};
goog.dom.getFrameContentDocument=function(a){return a.contentDocument||a.contentWindow.document};goog.dom.getFrameContentWindow=function(a){return a.contentWindow||goog.dom.getWindow(goog.dom.getFrameContentDocument(a))};
goog.dom.setTextContent=function(a,b){if("textContent"in a)a.textContent=b;else if(a.firstChild&&a.firstChild.nodeType==goog.dom.NodeType.TEXT){for(;a.lastChild!=a.firstChild;)a.removeChild(a.lastChild);a.firstChild.data=b}else{goog.dom.removeChildren(a);var c=goog.dom.getOwnerDocument(a);a.appendChild(c.createTextNode(String(b)))}};goog.dom.getOuterHtml=function(a){if("outerHTML"in a)return a.outerHTML;var b=goog.dom.getOwnerDocument(a).createElement("div");b.appendChild(a.cloneNode(!0));return b.innerHTML};
goog.dom.findNode=function(a,b){var c=[];return goog.dom.findNodes_(a,b,c,!0)?c[0]:void 0};goog.dom.findNodes=function(a,b){var c=[];goog.dom.findNodes_(a,b,c,!1);return c};goog.dom.findNodes_=function(a,b,c,d){if(null!=a)for(a=a.firstChild;a;){if(b(a)&&(c.push(a),d)||goog.dom.findNodes_(a,b,c,d))return!0;a=a.nextSibling}return!1};goog.dom.TAGS_TO_IGNORE_={SCRIPT:1,STYLE:1,HEAD:1,IFRAME:1,OBJECT:1};goog.dom.PREDEFINED_TAG_VALUES_={IMG:" ",BR:"\n"};
goog.dom.isFocusableTabIndex=function(a){return goog.dom.hasSpecifiedTabIndex_(a)&&goog.dom.isTabIndexFocusable_(a)};goog.dom.setFocusableTabIndex=function(a,b){b?a.tabIndex=0:(a.tabIndex=-1,a.removeAttribute("tabIndex"))};goog.dom.isFocusable=function(a){var b;return(b=goog.dom.isFormElement_(a)?!a.disabled&&(!goog.dom.hasSpecifiedTabIndex_(a)||goog.dom.isTabIndexFocusable_(a)):goog.dom.isFocusableTabIndex(a))&&goog.userAgent.IE?goog.dom.hasNonZeroBoundingRect_(a):b};
goog.dom.hasSpecifiedTabIndex_=function(a){a=a.getAttributeNode("tabindex");return goog.isDefAndNotNull(a)&&a.specified};goog.dom.isTabIndexFocusable_=function(a){a=a.tabIndex;return goog.isNumber(a)&&0<=a&&32768>a};goog.dom.isFormElement_=function(a){return a.tagName==goog.dom.TagName.INPUT||a.tagName==goog.dom.TagName.TEXTAREA||a.tagName==goog.dom.TagName.SELECT||a.tagName==goog.dom.TagName.BUTTON};
goog.dom.hasNonZeroBoundingRect_=function(a){a=goog.isFunction(a.getBoundingClientRect)?a.getBoundingClientRect():{height:a.offsetHeight,width:a.offsetWidth};return goog.isDefAndNotNull(a)&&0<a.height&&0<a.width};
goog.dom.getTextContent=function(a){if(goog.dom.BrowserFeature.CAN_USE_INNER_TEXT&&"innerText"in a)a=goog.string.canonicalizeNewlines(a.innerText);else{var b=[];goog.dom.getTextContent_(a,b,!0);a=b.join("")}a=a.replace(/ \xAD /g," ").replace(/\xAD/g,"");a=a.replace(/\u200B/g,"");goog.dom.BrowserFeature.CAN_USE_INNER_TEXT||(a=a.replace(/ +/g," "));" "!=a&&(a=a.replace(/^\s*/,""));return a};goog.dom.getRawTextContent=function(a){var b=[];goog.dom.getTextContent_(a,b,!1);return b.join("")};
goog.dom.getTextContent_=function(a,b,c){if(!(a.nodeName in goog.dom.TAGS_TO_IGNORE_))if(a.nodeType==goog.dom.NodeType.TEXT)c?b.push(String(a.nodeValue).replace(/(\r\n|\r|\n)/g,"")):b.push(a.nodeValue);else if(a.nodeName in goog.dom.PREDEFINED_TAG_VALUES_)b.push(goog.dom.PREDEFINED_TAG_VALUES_[a.nodeName]);else for(a=a.firstChild;a;)goog.dom.getTextContent_(a,b,c),a=a.nextSibling};goog.dom.getNodeTextLength=function(a){return goog.dom.getTextContent(a).length};
goog.dom.getNodeTextOffset=function(a,b){for(var c=b||goog.dom.getOwnerDocument(a).body,d=[];a&&a!=c;){for(var e=a;e=e.previousSibling;)d.unshift(goog.dom.getTextContent(e));a=a.parentNode}return goog.string.trimLeft(d.join("")).replace(/ +/g," ").length};
goog.dom.getNodeAtOffset=function(a,b,c){a=[a];for(var d=0,e=null;0<a.length&&d<b;)if(e=a.pop(),!(e.nodeName in goog.dom.TAGS_TO_IGNORE_))if(e.nodeType==goog.dom.NodeType.TEXT)var f=e.nodeValue.replace(/(\r\n|\r|\n)/g,"").replace(/ +/g," "),d=d+f.length;else if(e.nodeName in goog.dom.PREDEFINED_TAG_VALUES_)d+=goog.dom.PREDEFINED_TAG_VALUES_[e.nodeName].length;else for(f=e.childNodes.length-1;0<=f;f--)a.push(e.childNodes[f]);goog.isObject(c)&&(c.remainder=e?e.nodeValue.length+b-d-1:0,c.node=e);return e};
goog.dom.isNodeList=function(a){if(a&&"number"==typeof a.length){if(goog.isObject(a))return"function"==typeof a.item||"string"==typeof a.item;if(goog.isFunction(a))return"function"==typeof a.item}return!1};goog.dom.getAncestorByTagNameAndClass=function(a,b,c){if(!b&&!c)return null;var d=b?b.toUpperCase():null;return goog.dom.getAncestor(a,function(a){return(!d||a.nodeName==d)&&(!c||goog.dom.classes.has(a,c))},!0)};
goog.dom.getAncestorByClass=function(a,b){return goog.dom.getAncestorByTagNameAndClass(a,null,b)};goog.dom.getAncestor=function(a,b,c,d){c||(a=a.parentNode);c=null==d;for(var e=0;a&&(c||e<=d);){if(b(a))return a;a=a.parentNode;e++}return null};goog.dom.getActiveElement=function(a){try{return a&&a.activeElement}catch(b){}return null};
goog.dom.getPixelRatio=goog.functions.cacheReturnValue(function(){var a=goog.dom.getWindow(),b=goog.userAgent.GECKO&&goog.userAgent.MOBILE;return goog.isDef(a.devicePixelRatio)&&!b?a.devicePixelRatio:a.matchMedia?goog.dom.matchesPixelRatio_(0.75)||goog.dom.matchesPixelRatio_(1.5)||goog.dom.matchesPixelRatio_(2)||goog.dom.matchesPixelRatio_(3)||1:1});
goog.dom.matchesPixelRatio_=function(a){return goog.dom.getWindow().matchMedia("(-webkit-min-device-pixel-ratio: "+a+"),(min--moz-device-pixel-ratio: "+a+"),(min-resolution: "+a+"dppx)").matches?a:0};goog.dom.DomHelper=function(a){this.document_=a||goog.global.document||document};goog.dom.DomHelper.prototype.getDomHelper=goog.dom.getDomHelper;goog.dom.DomHelper.prototype.setDocument=function(a){this.document_=a};goog.dom.DomHelper.prototype.getDocument=function(){return this.document_};
goog.dom.DomHelper.prototype.getElement=function(a){return goog.dom.getElementHelper_(this.document_,a)};goog.dom.DomHelper.prototype.getRequiredElement=function(a){return goog.dom.getRequiredElementHelper_(this.document_,a)};goog.dom.DomHelper.prototype.$=goog.dom.DomHelper.prototype.getElement;goog.dom.DomHelper.prototype.getElementsByTagNameAndClass=function(a,b,c){return goog.dom.getElementsByTagNameAndClass_(this.document_,a,b,c)};
goog.dom.DomHelper.prototype.getElementsByClass=function(a,b){return goog.dom.getElementsByClass(a,b||this.document_)};goog.dom.DomHelper.prototype.getElementByClass=function(a,b){return goog.dom.getElementByClass(a,b||this.document_)};goog.dom.DomHelper.prototype.$$=goog.dom.DomHelper.prototype.getElementsByTagNameAndClass;goog.dom.DomHelper.prototype.setProperties=goog.dom.setProperties;goog.dom.DomHelper.prototype.getViewportSize=function(a){return goog.dom.getViewportSize(a||this.getWindow())};
goog.dom.DomHelper.prototype.getDocumentHeight=function(){return goog.dom.getDocumentHeight_(this.getWindow())};goog.dom.DomHelper.prototype.createDom=function(a,b,c){return goog.dom.createDom_(this.document_,arguments)};goog.dom.DomHelper.prototype.$dom=goog.dom.DomHelper.prototype.createDom;goog.dom.DomHelper.prototype.createElement=function(a){return this.document_.createElement(a)};goog.dom.DomHelper.prototype.createTextNode=function(a){return this.document_.createTextNode(String(a))};
goog.dom.DomHelper.prototype.createTable=function(a,b,c){return goog.dom.createTable_(this.document_,a,b,!!c)};goog.dom.DomHelper.prototype.htmlToDocumentFragment=function(a){return goog.dom.htmlToDocumentFragment_(this.document_,a)};goog.dom.DomHelper.prototype.getCompatMode=function(){return this.isCss1CompatMode()?"CSS1Compat":"BackCompat"};goog.dom.DomHelper.prototype.isCss1CompatMode=function(){return goog.dom.isCss1CompatMode_(this.document_)};goog.dom.DomHelper.prototype.getWindow=function(){return goog.dom.getWindow_(this.document_)};
goog.dom.DomHelper.prototype.getDocumentScrollElement=function(){return goog.dom.getDocumentScrollElement_(this.document_)};goog.dom.DomHelper.prototype.getDocumentScroll=function(){return goog.dom.getDocumentScroll_(this.document_)};goog.dom.DomHelper.prototype.getActiveElement=function(a){return goog.dom.getActiveElement(a||this.document_)};goog.dom.DomHelper.prototype.appendChild=goog.dom.appendChild;goog.dom.DomHelper.prototype.append=goog.dom.append;
goog.dom.DomHelper.prototype.canHaveChildren=goog.dom.canHaveChildren;goog.dom.DomHelper.prototype.removeChildren=goog.dom.removeChildren;goog.dom.DomHelper.prototype.insertSiblingBefore=goog.dom.insertSiblingBefore;goog.dom.DomHelper.prototype.insertSiblingAfter=goog.dom.insertSiblingAfter;goog.dom.DomHelper.prototype.insertChildAt=goog.dom.insertChildAt;goog.dom.DomHelper.prototype.removeNode=goog.dom.removeNode;goog.dom.DomHelper.prototype.replaceNode=goog.dom.replaceNode;
goog.dom.DomHelper.prototype.flattenElement=goog.dom.flattenElement;goog.dom.DomHelper.prototype.getChildren=goog.dom.getChildren;goog.dom.DomHelper.prototype.getFirstElementChild=goog.dom.getFirstElementChild;goog.dom.DomHelper.prototype.getLastElementChild=goog.dom.getLastElementChild;goog.dom.DomHelper.prototype.getNextElementSibling=goog.dom.getNextElementSibling;goog.dom.DomHelper.prototype.getPreviousElementSibling=goog.dom.getPreviousElementSibling;
goog.dom.DomHelper.prototype.getNextNode=goog.dom.getNextNode;goog.dom.DomHelper.prototype.getPreviousNode=goog.dom.getPreviousNode;goog.dom.DomHelper.prototype.isNodeLike=goog.dom.isNodeLike;goog.dom.DomHelper.prototype.isElement=goog.dom.isElement;goog.dom.DomHelper.prototype.isWindow=goog.dom.isWindow;goog.dom.DomHelper.prototype.getParentElement=goog.dom.getParentElement;goog.dom.DomHelper.prototype.contains=goog.dom.contains;goog.dom.DomHelper.prototype.compareNodeOrder=goog.dom.compareNodeOrder;
goog.dom.DomHelper.prototype.findCommonAncestor=goog.dom.findCommonAncestor;goog.dom.DomHelper.prototype.getOwnerDocument=goog.dom.getOwnerDocument;goog.dom.DomHelper.prototype.getFrameContentDocument=goog.dom.getFrameContentDocument;goog.dom.DomHelper.prototype.getFrameContentWindow=goog.dom.getFrameContentWindow;goog.dom.DomHelper.prototype.setTextContent=goog.dom.setTextContent;goog.dom.DomHelper.prototype.getOuterHtml=goog.dom.getOuterHtml;goog.dom.DomHelper.prototype.findNode=goog.dom.findNode;
goog.dom.DomHelper.prototype.findNodes=goog.dom.findNodes;goog.dom.DomHelper.prototype.isFocusableTabIndex=goog.dom.isFocusableTabIndex;goog.dom.DomHelper.prototype.setFocusableTabIndex=goog.dom.setFocusableTabIndex;goog.dom.DomHelper.prototype.isFocusable=goog.dom.isFocusable;goog.dom.DomHelper.prototype.getTextContent=goog.dom.getTextContent;goog.dom.DomHelper.prototype.getNodeTextLength=goog.dom.getNodeTextLength;goog.dom.DomHelper.prototype.getNodeTextOffset=goog.dom.getNodeTextOffset;
goog.dom.DomHelper.prototype.getNodeAtOffset=goog.dom.getNodeAtOffset;goog.dom.DomHelper.prototype.isNodeList=goog.dom.isNodeList;goog.dom.DomHelper.prototype.getAncestorByTagNameAndClass=goog.dom.getAncestorByTagNameAndClass;goog.dom.DomHelper.prototype.getAncestorByClass=goog.dom.getAncestorByClass;goog.dom.DomHelper.prototype.getAncestor=goog.dom.getAncestor;goog.json={};goog.json.isValid_=function(a){return/^\s*$/.test(a)?!1:/^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g,"@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g,""))};goog.json.parse=function(a){a=String(a);if(goog.json.isValid_(a))try{return eval("("+a+")")}catch(b){}throw Error("Invalid JSON string: "+a);};goog.json.unsafeParse=function(a){return eval("("+a+")")};
goog.json.serialize=function(a,b){return(new goog.json.Serializer(b)).serialize(a)};goog.json.Serializer=function(a){this.replacer_=a};goog.json.Serializer.prototype.serialize=function(a){var b=[];this.serialize_(a,b);return b.join("")};
goog.json.Serializer.prototype.serialize_=function(a,b){switch(typeof a){case "string":this.serializeString_(a,b);break;case "number":this.serializeNumber_(a,b);break;case "boolean":b.push(a);break;case "undefined":b.push("null");break;case "object":if(null==a){b.push("null");break}if(goog.isArray(a)){this.serializeArray(a,b);break}this.serializeObject_(a,b);break;case "function":break;default:throw Error("Unknown type: "+typeof a);}};
goog.json.Serializer.charToJsonCharCache_={'"':'\\"',"\\":"\\\\","/":"\\/","\b":"\\b","\f":"\\f","\n":"\\n","\r":"\\r","\t":"\\t","\x0B":"\\u000b"};goog.json.Serializer.charsToReplace_=/\uffff/.test("\uffff")?/[\\\"\x00-\x1f\x7f-\uffff]/g:/[\\\"\x00-\x1f\x7f-\xff]/g;
goog.json.Serializer.prototype.serializeString_=function(a,b){b.push('"',a.replace(goog.json.Serializer.charsToReplace_,function(a){if(a in goog.json.Serializer.charToJsonCharCache_)return goog.json.Serializer.charToJsonCharCache_[a];var b=a.charCodeAt(0),e="\\u";16>b?e+="000":256>b?e+="00":4096>b&&(e+="0");return goog.json.Serializer.charToJsonCharCache_[a]=e+b.toString(16)}),'"')};goog.json.Serializer.prototype.serializeNumber_=function(a,b){b.push(isFinite(a)&&!isNaN(a)?a:"null")};
goog.json.Serializer.prototype.serializeArray=function(a,b){var c=a.length;b.push("[");for(var d="",e=0;e<c;e++)b.push(d),d=a[e],this.serialize_(this.replacer_?this.replacer_.call(a,String(e),d):d,b),d=",";b.push("]")};
goog.json.Serializer.prototype.serializeObject_=function(a,b){b.push("{");var c="",d;for(d in a)if(Object.prototype.hasOwnProperty.call(a,d)){var e=a[d];"function"!=typeof e&&(b.push(c),this.serializeString_(d,b),b.push(":"),this.serialize_(this.replacer_?this.replacer_.call(a,d,e):e,b),c=",")}b.push("}")};goog.proto2.ObjectSerializer=function(a){this.keyOption_=a};goog.inherits(goog.proto2.ObjectSerializer,goog.proto2.Serializer);goog.proto2.ObjectSerializer.KeyOption={TAG:0,NAME:1};
goog.proto2.ObjectSerializer.prototype.serialize=function(a){for(var b=a.getDescriptor().getFields(),c={},d=0;d<b.length;d++){var e=b[d],f=this.keyOption_==goog.proto2.ObjectSerializer.KeyOption.NAME?e.getName():e.getTag();if(a.has(e))if(e.isRepeated()){var g=[];c[f]=g;for(f=0;f<a.countOf(e);f++)g.push(this.getSerializedValue(e,a.get(e,f)))}else c[f]=this.getSerializedValue(e,a.get(e))}a.forEachUnknown(function(a,b){c[a]=b});return c};
goog.proto2.ObjectSerializer.prototype.deserializeTo=function(a,b){var c=a.getDescriptor(),d;for(d in b){var e,f=b[d],g=goog.string.isNumeric(d);g?e=c.findFieldByTag(d):(goog.proto2.Util.assert(this.keyOption_==goog.proto2.ObjectSerializer.KeyOption.NAME),e=c.findFieldByName(d));if(e)if(e.isRepeated())for(goog.proto2.Util.assert(goog.isArray(f)),g=0;g<f.length;g++)a.add(e,this.getDeserializedValue(e,f[g]));else goog.proto2.Util.assert(!goog.isArray(f)),a.set(e,this.getDeserializedValue(e,f));else g?
a.setUnknown(Number(d),f):goog.proto2.Util.assert(e)}};/*

 Copyright (C) 2011 The Libphonenumber Authors.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
var i18n={phonenumbers:{}};i18n.phonenumbers.RegionCode={UN001:"001",AD:"AD",AE:"AE",AO:"AO",AQ:"AQ",AR:"AR",AU:"AU",BB:"BB",BR:"BR",BS:"BS",BY:"BY",CA:"CA",CH:"CH",CN:"CN",CS:"CS",CX:"CX",DE:"DE",GB:"GB",HU:"HU",IT:"IT",JP:"JP",KR:"KR",MX:"MX",NZ:"NZ",PL:"PL",RE:"RE",SE:"SE",SG:"SG",US:"US",YT:"YT",ZW:"ZW",ZZ:"ZZ"};/*

 Protocol Buffer 2 Copyright 2008 Google Inc.
 All other code copyright its respective owners.
 Copyright (C) 2010 The Libphonenumber Authors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
i18n.phonenumbers.NumberFormat=function(){goog.proto2.Message.apply(this)};goog.inherits(i18n.phonenumbers.NumberFormat,goog.proto2.Message);i18n.phonenumbers.NumberFormat.prototype.getPattern=function(){return this.get$Value(1)};i18n.phonenumbers.NumberFormat.prototype.getPatternOrDefault=function(){return this.get$ValueOrDefault(1)};i18n.phonenumbers.NumberFormat.prototype.setPattern=function(a){this.set$Value(1,a)};i18n.phonenumbers.NumberFormat.prototype.hasPattern=function(){return this.has$Value(1)};
i18n.phonenumbers.NumberFormat.prototype.patternCount=function(){return this.count$Values(1)};i18n.phonenumbers.NumberFormat.prototype.clearPattern=function(){this.clear$Field(1)};i18n.phonenumbers.NumberFormat.prototype.getFormat=function(){return this.get$Value(2)};i18n.phonenumbers.NumberFormat.prototype.getFormatOrDefault=function(){return this.get$ValueOrDefault(2)};i18n.phonenumbers.NumberFormat.prototype.setFormat=function(a){this.set$Value(2,a)};
i18n.phonenumbers.NumberFormat.prototype.hasFormat=function(){return this.has$Value(2)};i18n.phonenumbers.NumberFormat.prototype.formatCount=function(){return this.count$Values(2)};i18n.phonenumbers.NumberFormat.prototype.clearFormat=function(){this.clear$Field(2)};i18n.phonenumbers.NumberFormat.prototype.getLeadingDigitsPattern=function(a){return this.get$Value(3,a)};i18n.phonenumbers.NumberFormat.prototype.getLeadingDigitsPatternOrDefault=function(a){return this.get$ValueOrDefault(3,a)};
i18n.phonenumbers.NumberFormat.prototype.addLeadingDigitsPattern=function(a){this.add$Value(3,a)};i18n.phonenumbers.NumberFormat.prototype.leadingDigitsPatternArray=function(){return this.array$Values(3)};i18n.phonenumbers.NumberFormat.prototype.hasLeadingDigitsPattern=function(){return this.has$Value(3)};i18n.phonenumbers.NumberFormat.prototype.leadingDigitsPatternCount=function(){return this.count$Values(3)};i18n.phonenumbers.NumberFormat.prototype.clearLeadingDigitsPattern=function(){this.clear$Field(3)};
i18n.phonenumbers.NumberFormat.prototype.getNationalPrefixFormattingRule=function(){return this.get$Value(4)};i18n.phonenumbers.NumberFormat.prototype.getNationalPrefixFormattingRuleOrDefault=function(){return this.get$ValueOrDefault(4)};i18n.phonenumbers.NumberFormat.prototype.setNationalPrefixFormattingRule=function(a){this.set$Value(4,a)};i18n.phonenumbers.NumberFormat.prototype.hasNationalPrefixFormattingRule=function(){return this.has$Value(4)};
i18n.phonenumbers.NumberFormat.prototype.nationalPrefixFormattingRuleCount=function(){return this.count$Values(4)};i18n.phonenumbers.NumberFormat.prototype.clearNationalPrefixFormattingRule=function(){this.clear$Field(4)};i18n.phonenumbers.NumberFormat.prototype.getNationalPrefixOptionalWhenFormatting=function(){return this.get$Value(6)};i18n.phonenumbers.NumberFormat.prototype.getNationalPrefixOptionalWhenFormattingOrDefault=function(){return this.get$ValueOrDefault(6)};
i18n.phonenumbers.NumberFormat.prototype.setNationalPrefixOptionalWhenFormatting=function(a){this.set$Value(6,a)};i18n.phonenumbers.NumberFormat.prototype.hasNationalPrefixOptionalWhenFormatting=function(){return this.has$Value(6)};i18n.phonenumbers.NumberFormat.prototype.nationalPrefixOptionalWhenFormattingCount=function(){return this.count$Values(6)};i18n.phonenumbers.NumberFormat.prototype.clearNationalPrefixOptionalWhenFormatting=function(){this.clear$Field(6)};
i18n.phonenumbers.NumberFormat.prototype.getDomesticCarrierCodeFormattingRule=function(){return this.get$Value(5)};i18n.phonenumbers.NumberFormat.prototype.getDomesticCarrierCodeFormattingRuleOrDefault=function(){return this.get$ValueOrDefault(5)};i18n.phonenumbers.NumberFormat.prototype.setDomesticCarrierCodeFormattingRule=function(a){this.set$Value(5,a)};i18n.phonenumbers.NumberFormat.prototype.hasDomesticCarrierCodeFormattingRule=function(){return this.has$Value(5)};
i18n.phonenumbers.NumberFormat.prototype.domesticCarrierCodeFormattingRuleCount=function(){return this.count$Values(5)};i18n.phonenumbers.NumberFormat.prototype.clearDomesticCarrierCodeFormattingRule=function(){this.clear$Field(5)};i18n.phonenumbers.PhoneNumberDesc=function(){goog.proto2.Message.apply(this)};goog.inherits(i18n.phonenumbers.PhoneNumberDesc,goog.proto2.Message);i18n.phonenumbers.PhoneNumberDesc.prototype.getNationalNumberPattern=function(){return this.get$Value(2)};
i18n.phonenumbers.PhoneNumberDesc.prototype.getNationalNumberPatternOrDefault=function(){return this.get$ValueOrDefault(2)};i18n.phonenumbers.PhoneNumberDesc.prototype.setNationalNumberPattern=function(a){this.set$Value(2,a)};i18n.phonenumbers.PhoneNumberDesc.prototype.hasNationalNumberPattern=function(){return this.has$Value(2)};i18n.phonenumbers.PhoneNumberDesc.prototype.nationalNumberPatternCount=function(){return this.count$Values(2)};
i18n.phonenumbers.PhoneNumberDesc.prototype.clearNationalNumberPattern=function(){this.clear$Field(2)};i18n.phonenumbers.PhoneNumberDesc.prototype.getPossibleNumberPattern=function(){return this.get$Value(3)};i18n.phonenumbers.PhoneNumberDesc.prototype.getPossibleNumberPatternOrDefault=function(){return this.get$ValueOrDefault(3)};i18n.phonenumbers.PhoneNumberDesc.prototype.setPossibleNumberPattern=function(a){this.set$Value(3,a)};
i18n.phonenumbers.PhoneNumberDesc.prototype.hasPossibleNumberPattern=function(){return this.has$Value(3)};i18n.phonenumbers.PhoneNumberDesc.prototype.possibleNumberPatternCount=function(){return this.count$Values(3)};i18n.phonenumbers.PhoneNumberDesc.prototype.clearPossibleNumberPattern=function(){this.clear$Field(3)};i18n.phonenumbers.PhoneNumberDesc.prototype.getExampleNumber=function(){return this.get$Value(6)};i18n.phonenumbers.PhoneNumberDesc.prototype.getExampleNumberOrDefault=function(){return this.get$ValueOrDefault(6)};
i18n.phonenumbers.PhoneNumberDesc.prototype.setExampleNumber=function(a){this.set$Value(6,a)};i18n.phonenumbers.PhoneNumberDesc.prototype.hasExampleNumber=function(){return this.has$Value(6)};i18n.phonenumbers.PhoneNumberDesc.prototype.exampleNumberCount=function(){return this.count$Values(6)};i18n.phonenumbers.PhoneNumberDesc.prototype.clearExampleNumber=function(){this.clear$Field(6)};i18n.phonenumbers.PhoneMetadata=function(){goog.proto2.Message.apply(this)};
goog.inherits(i18n.phonenumbers.PhoneMetadata,goog.proto2.Message);i18n.phonenumbers.PhoneMetadata.prototype.getGeneralDesc=function(){return this.get$Value(1)};i18n.phonenumbers.PhoneMetadata.prototype.getGeneralDescOrDefault=function(){return this.get$ValueOrDefault(1)};i18n.phonenumbers.PhoneMetadata.prototype.setGeneralDesc=function(a){this.set$Value(1,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasGeneralDesc=function(){return this.has$Value(1)};
i18n.phonenumbers.PhoneMetadata.prototype.generalDescCount=function(){return this.count$Values(1)};i18n.phonenumbers.PhoneMetadata.prototype.clearGeneralDesc=function(){this.clear$Field(1)};i18n.phonenumbers.PhoneMetadata.prototype.getFixedLine=function(){return this.get$Value(2)};i18n.phonenumbers.PhoneMetadata.prototype.getFixedLineOrDefault=function(){return this.get$ValueOrDefault(2)};i18n.phonenumbers.PhoneMetadata.prototype.setFixedLine=function(a){this.set$Value(2,a)};
i18n.phonenumbers.PhoneMetadata.prototype.hasFixedLine=function(){return this.has$Value(2)};i18n.phonenumbers.PhoneMetadata.prototype.fixedLineCount=function(){return this.count$Values(2)};i18n.phonenumbers.PhoneMetadata.prototype.clearFixedLine=function(){this.clear$Field(2)};i18n.phonenumbers.PhoneMetadata.prototype.getMobile=function(){return this.get$Value(3)};i18n.phonenumbers.PhoneMetadata.prototype.getMobileOrDefault=function(){return this.get$ValueOrDefault(3)};
i18n.phonenumbers.PhoneMetadata.prototype.setMobile=function(a){this.set$Value(3,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasMobile=function(){return this.has$Value(3)};i18n.phonenumbers.PhoneMetadata.prototype.mobileCount=function(){return this.count$Values(3)};i18n.phonenumbers.PhoneMetadata.prototype.clearMobile=function(){this.clear$Field(3)};i18n.phonenumbers.PhoneMetadata.prototype.getTollFree=function(){return this.get$Value(4)};
i18n.phonenumbers.PhoneMetadata.prototype.getTollFreeOrDefault=function(){return this.get$ValueOrDefault(4)};i18n.phonenumbers.PhoneMetadata.prototype.setTollFree=function(a){this.set$Value(4,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasTollFree=function(){return this.has$Value(4)};i18n.phonenumbers.PhoneMetadata.prototype.tollFreeCount=function(){return this.count$Values(4)};i18n.phonenumbers.PhoneMetadata.prototype.clearTollFree=function(){this.clear$Field(4)};
i18n.phonenumbers.PhoneMetadata.prototype.getPremiumRate=function(){return this.get$Value(5)};i18n.phonenumbers.PhoneMetadata.prototype.getPremiumRateOrDefault=function(){return this.get$ValueOrDefault(5)};i18n.phonenumbers.PhoneMetadata.prototype.setPremiumRate=function(a){this.set$Value(5,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasPremiumRate=function(){return this.has$Value(5)};i18n.phonenumbers.PhoneMetadata.prototype.premiumRateCount=function(){return this.count$Values(5)};
i18n.phonenumbers.PhoneMetadata.prototype.clearPremiumRate=function(){this.clear$Field(5)};i18n.phonenumbers.PhoneMetadata.prototype.getSharedCost=function(){return this.get$Value(6)};i18n.phonenumbers.PhoneMetadata.prototype.getSharedCostOrDefault=function(){return this.get$ValueOrDefault(6)};i18n.phonenumbers.PhoneMetadata.prototype.setSharedCost=function(a){this.set$Value(6,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasSharedCost=function(){return this.has$Value(6)};
i18n.phonenumbers.PhoneMetadata.prototype.sharedCostCount=function(){return this.count$Values(6)};i18n.phonenumbers.PhoneMetadata.prototype.clearSharedCost=function(){this.clear$Field(6)};i18n.phonenumbers.PhoneMetadata.prototype.getPersonalNumber=function(){return this.get$Value(7)};i18n.phonenumbers.PhoneMetadata.prototype.getPersonalNumberOrDefault=function(){return this.get$ValueOrDefault(7)};i18n.phonenumbers.PhoneMetadata.prototype.setPersonalNumber=function(a){this.set$Value(7,a)};
i18n.phonenumbers.PhoneMetadata.prototype.hasPersonalNumber=function(){return this.has$Value(7)};i18n.phonenumbers.PhoneMetadata.prototype.personalNumberCount=function(){return this.count$Values(7)};i18n.phonenumbers.PhoneMetadata.prototype.clearPersonalNumber=function(){this.clear$Field(7)};i18n.phonenumbers.PhoneMetadata.prototype.getVoip=function(){return this.get$Value(8)};i18n.phonenumbers.PhoneMetadata.prototype.getVoipOrDefault=function(){return this.get$ValueOrDefault(8)};
i18n.phonenumbers.PhoneMetadata.prototype.setVoip=function(a){this.set$Value(8,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasVoip=function(){return this.has$Value(8)};i18n.phonenumbers.PhoneMetadata.prototype.voipCount=function(){return this.count$Values(8)};i18n.phonenumbers.PhoneMetadata.prototype.clearVoip=function(){this.clear$Field(8)};i18n.phonenumbers.PhoneMetadata.prototype.getPager=function(){return this.get$Value(21)};i18n.phonenumbers.PhoneMetadata.prototype.getPagerOrDefault=function(){return this.get$ValueOrDefault(21)};
i18n.phonenumbers.PhoneMetadata.prototype.setPager=function(a){this.set$Value(21,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasPager=function(){return this.has$Value(21)};i18n.phonenumbers.PhoneMetadata.prototype.pagerCount=function(){return this.count$Values(21)};i18n.phonenumbers.PhoneMetadata.prototype.clearPager=function(){this.clear$Field(21)};i18n.phonenumbers.PhoneMetadata.prototype.getUan=function(){return this.get$Value(25)};i18n.phonenumbers.PhoneMetadata.prototype.getUanOrDefault=function(){return this.get$ValueOrDefault(25)};
i18n.phonenumbers.PhoneMetadata.prototype.setUan=function(a){this.set$Value(25,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasUan=function(){return this.has$Value(25)};i18n.phonenumbers.PhoneMetadata.prototype.uanCount=function(){return this.count$Values(25)};i18n.phonenumbers.PhoneMetadata.prototype.clearUan=function(){this.clear$Field(25)};i18n.phonenumbers.PhoneMetadata.prototype.getEmergency=function(){return this.get$Value(27)};
i18n.phonenumbers.PhoneMetadata.prototype.getEmergencyOrDefault=function(){return this.get$ValueOrDefault(27)};i18n.phonenumbers.PhoneMetadata.prototype.setEmergency=function(a){this.set$Value(27,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasEmergency=function(){return this.has$Value(27)};i18n.phonenumbers.PhoneMetadata.prototype.emergencyCount=function(){return this.count$Values(27)};i18n.phonenumbers.PhoneMetadata.prototype.clearEmergency=function(){this.clear$Field(27)};
i18n.phonenumbers.PhoneMetadata.prototype.getVoicemail=function(){return this.get$Value(28)};i18n.phonenumbers.PhoneMetadata.prototype.getVoicemailOrDefault=function(){return this.get$ValueOrDefault(28)};i18n.phonenumbers.PhoneMetadata.prototype.setVoicemail=function(a){this.set$Value(28,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasVoicemail=function(){return this.has$Value(28)};i18n.phonenumbers.PhoneMetadata.prototype.voicemailCount=function(){return this.count$Values(28)};
i18n.phonenumbers.PhoneMetadata.prototype.clearVoicemail=function(){this.clear$Field(28)};i18n.phonenumbers.PhoneMetadata.prototype.getNoInternationalDialling=function(){return this.get$Value(24)};i18n.phonenumbers.PhoneMetadata.prototype.getNoInternationalDiallingOrDefault=function(){return this.get$ValueOrDefault(24)};i18n.phonenumbers.PhoneMetadata.prototype.setNoInternationalDialling=function(a){this.set$Value(24,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasNoInternationalDialling=function(){return this.has$Value(24)};
i18n.phonenumbers.PhoneMetadata.prototype.noInternationalDiallingCount=function(){return this.count$Values(24)};i18n.phonenumbers.PhoneMetadata.prototype.clearNoInternationalDialling=function(){this.clear$Field(24)};i18n.phonenumbers.PhoneMetadata.prototype.getId=function(){return this.get$Value(9)};i18n.phonenumbers.PhoneMetadata.prototype.getIdOrDefault=function(){return this.get$ValueOrDefault(9)};i18n.phonenumbers.PhoneMetadata.prototype.setId=function(a){this.set$Value(9,a)};
i18n.phonenumbers.PhoneMetadata.prototype.hasId=function(){return this.has$Value(9)};i18n.phonenumbers.PhoneMetadata.prototype.idCount=function(){return this.count$Values(9)};i18n.phonenumbers.PhoneMetadata.prototype.clearId=function(){this.clear$Field(9)};i18n.phonenumbers.PhoneMetadata.prototype.getCountryCode=function(){return this.get$Value(10)};i18n.phonenumbers.PhoneMetadata.prototype.getCountryCodeOrDefault=function(){return this.get$ValueOrDefault(10)};
i18n.phonenumbers.PhoneMetadata.prototype.setCountryCode=function(a){this.set$Value(10,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasCountryCode=function(){return this.has$Value(10)};i18n.phonenumbers.PhoneMetadata.prototype.countryCodeCount=function(){return this.count$Values(10)};i18n.phonenumbers.PhoneMetadata.prototype.clearCountryCode=function(){this.clear$Field(10)};i18n.phonenumbers.PhoneMetadata.prototype.getInternationalPrefix=function(){return this.get$Value(11)};
i18n.phonenumbers.PhoneMetadata.prototype.getInternationalPrefixOrDefault=function(){return this.get$ValueOrDefault(11)};i18n.phonenumbers.PhoneMetadata.prototype.setInternationalPrefix=function(a){this.set$Value(11,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasInternationalPrefix=function(){return this.has$Value(11)};i18n.phonenumbers.PhoneMetadata.prototype.internationalPrefixCount=function(){return this.count$Values(11)};i18n.phonenumbers.PhoneMetadata.prototype.clearInternationalPrefix=function(){this.clear$Field(11)};
i18n.phonenumbers.PhoneMetadata.prototype.getPreferredInternationalPrefix=function(){return this.get$Value(17)};i18n.phonenumbers.PhoneMetadata.prototype.getPreferredInternationalPrefixOrDefault=function(){return this.get$ValueOrDefault(17)};i18n.phonenumbers.PhoneMetadata.prototype.setPreferredInternationalPrefix=function(a){this.set$Value(17,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasPreferredInternationalPrefix=function(){return this.has$Value(17)};
i18n.phonenumbers.PhoneMetadata.prototype.preferredInternationalPrefixCount=function(){return this.count$Values(17)};i18n.phonenumbers.PhoneMetadata.prototype.clearPreferredInternationalPrefix=function(){this.clear$Field(17)};i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefix=function(){return this.get$Value(12)};i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefixOrDefault=function(){return this.get$ValueOrDefault(12)};
i18n.phonenumbers.PhoneMetadata.prototype.setNationalPrefix=function(a){this.set$Value(12,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasNationalPrefix=function(){return this.has$Value(12)};i18n.phonenumbers.PhoneMetadata.prototype.nationalPrefixCount=function(){return this.count$Values(12)};i18n.phonenumbers.PhoneMetadata.prototype.clearNationalPrefix=function(){this.clear$Field(12)};i18n.phonenumbers.PhoneMetadata.prototype.getPreferredExtnPrefix=function(){return this.get$Value(13)};
i18n.phonenumbers.PhoneMetadata.prototype.getPreferredExtnPrefixOrDefault=function(){return this.get$ValueOrDefault(13)};i18n.phonenumbers.PhoneMetadata.prototype.setPreferredExtnPrefix=function(a){this.set$Value(13,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasPreferredExtnPrefix=function(){return this.has$Value(13)};i18n.phonenumbers.PhoneMetadata.prototype.preferredExtnPrefixCount=function(){return this.count$Values(13)};i18n.phonenumbers.PhoneMetadata.prototype.clearPreferredExtnPrefix=function(){this.clear$Field(13)};
i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefixForParsing=function(){return this.get$Value(15)};i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefixForParsingOrDefault=function(){return this.get$ValueOrDefault(15)};i18n.phonenumbers.PhoneMetadata.prototype.setNationalPrefixForParsing=function(a){this.set$Value(15,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasNationalPrefixForParsing=function(){return this.has$Value(15)};
i18n.phonenumbers.PhoneMetadata.prototype.nationalPrefixForParsingCount=function(){return this.count$Values(15)};i18n.phonenumbers.PhoneMetadata.prototype.clearNationalPrefixForParsing=function(){this.clear$Field(15)};i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefixTransformRule=function(){return this.get$Value(16)};i18n.phonenumbers.PhoneMetadata.prototype.getNationalPrefixTransformRuleOrDefault=function(){return this.get$ValueOrDefault(16)};
i18n.phonenumbers.PhoneMetadata.prototype.setNationalPrefixTransformRule=function(a){this.set$Value(16,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasNationalPrefixTransformRule=function(){return this.has$Value(16)};i18n.phonenumbers.PhoneMetadata.prototype.nationalPrefixTransformRuleCount=function(){return this.count$Values(16)};i18n.phonenumbers.PhoneMetadata.prototype.clearNationalPrefixTransformRule=function(){this.clear$Field(16)};
i18n.phonenumbers.PhoneMetadata.prototype.getSameMobileAndFixedLinePattern=function(){return this.get$Value(18)};i18n.phonenumbers.PhoneMetadata.prototype.getSameMobileAndFixedLinePatternOrDefault=function(){return this.get$ValueOrDefault(18)};i18n.phonenumbers.PhoneMetadata.prototype.setSameMobileAndFixedLinePattern=function(a){this.set$Value(18,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasSameMobileAndFixedLinePattern=function(){return this.has$Value(18)};
i18n.phonenumbers.PhoneMetadata.prototype.sameMobileAndFixedLinePatternCount=function(){return this.count$Values(18)};i18n.phonenumbers.PhoneMetadata.prototype.clearSameMobileAndFixedLinePattern=function(){this.clear$Field(18)};i18n.phonenumbers.PhoneMetadata.prototype.getNumberFormat=function(a){return this.get$Value(19,a)};i18n.phonenumbers.PhoneMetadata.prototype.getNumberFormatOrDefault=function(a){return this.get$ValueOrDefault(19,a)};
i18n.phonenumbers.PhoneMetadata.prototype.addNumberFormat=function(a){this.add$Value(19,a)};i18n.phonenumbers.PhoneMetadata.prototype.numberFormatArray=function(){return this.array$Values(19)};i18n.phonenumbers.PhoneMetadata.prototype.hasNumberFormat=function(){return this.has$Value(19)};i18n.phonenumbers.PhoneMetadata.prototype.numberFormatCount=function(){return this.count$Values(19)};i18n.phonenumbers.PhoneMetadata.prototype.clearNumberFormat=function(){this.clear$Field(19)};
i18n.phonenumbers.PhoneMetadata.prototype.getIntlNumberFormat=function(a){return this.get$Value(20,a)};i18n.phonenumbers.PhoneMetadata.prototype.getIntlNumberFormatOrDefault=function(a){return this.get$ValueOrDefault(20,a)};i18n.phonenumbers.PhoneMetadata.prototype.addIntlNumberFormat=function(a){this.add$Value(20,a)};i18n.phonenumbers.PhoneMetadata.prototype.intlNumberFormatArray=function(){return this.array$Values(20)};i18n.phonenumbers.PhoneMetadata.prototype.hasIntlNumberFormat=function(){return this.has$Value(20)};
i18n.phonenumbers.PhoneMetadata.prototype.intlNumberFormatCount=function(){return this.count$Values(20)};i18n.phonenumbers.PhoneMetadata.prototype.clearIntlNumberFormat=function(){this.clear$Field(20)};i18n.phonenumbers.PhoneMetadata.prototype.getMainCountryForCode=function(){return this.get$Value(22)};i18n.phonenumbers.PhoneMetadata.prototype.getMainCountryForCodeOrDefault=function(){return this.get$ValueOrDefault(22)};
i18n.phonenumbers.PhoneMetadata.prototype.setMainCountryForCode=function(a){this.set$Value(22,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasMainCountryForCode=function(){return this.has$Value(22)};i18n.phonenumbers.PhoneMetadata.prototype.mainCountryForCodeCount=function(){return this.count$Values(22)};i18n.phonenumbers.PhoneMetadata.prototype.clearMainCountryForCode=function(){this.clear$Field(22)};i18n.phonenumbers.PhoneMetadata.prototype.getLeadingDigits=function(){return this.get$Value(23)};
i18n.phonenumbers.PhoneMetadata.prototype.getLeadingDigitsOrDefault=function(){return this.get$ValueOrDefault(23)};i18n.phonenumbers.PhoneMetadata.prototype.setLeadingDigits=function(a){this.set$Value(23,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasLeadingDigits=function(){return this.has$Value(23)};i18n.phonenumbers.PhoneMetadata.prototype.leadingDigitsCount=function(){return this.count$Values(23)};i18n.phonenumbers.PhoneMetadata.prototype.clearLeadingDigits=function(){this.clear$Field(23)};
i18n.phonenumbers.PhoneMetadata.prototype.getLeadingZeroPossible=function(){return this.get$Value(26)};i18n.phonenumbers.PhoneMetadata.prototype.getLeadingZeroPossibleOrDefault=function(){return this.get$ValueOrDefault(26)};i18n.phonenumbers.PhoneMetadata.prototype.setLeadingZeroPossible=function(a){this.set$Value(26,a)};i18n.phonenumbers.PhoneMetadata.prototype.hasLeadingZeroPossible=function(){return this.has$Value(26)};i18n.phonenumbers.PhoneMetadata.prototype.leadingZeroPossibleCount=function(){return this.count$Values(26)};
i18n.phonenumbers.PhoneMetadata.prototype.clearLeadingZeroPossible=function(){this.clear$Field(26)};i18n.phonenumbers.PhoneMetadataCollection=function(){goog.proto2.Message.apply(this)};goog.inherits(i18n.phonenumbers.PhoneMetadataCollection,goog.proto2.Message);i18n.phonenumbers.PhoneMetadataCollection.prototype.getMetadata=function(a){return this.get$Value(1,a)};i18n.phonenumbers.PhoneMetadataCollection.prototype.getMetadataOrDefault=function(a){return this.get$ValueOrDefault(1,a)};
i18n.phonenumbers.PhoneMetadataCollection.prototype.addMetadata=function(a){this.add$Value(1,a)};i18n.phonenumbers.PhoneMetadataCollection.prototype.metadataArray=function(){return this.array$Values(1)};i18n.phonenumbers.PhoneMetadataCollection.prototype.hasMetadata=function(){return this.has$Value(1)};i18n.phonenumbers.PhoneMetadataCollection.prototype.metadataCount=function(){return this.count$Values(1)};i18n.phonenumbers.PhoneMetadataCollection.prototype.clearMetadata=function(){this.clear$Field(1)};
goog.proto2.Message.set$Metadata(i18n.phonenumbers.NumberFormat,{0:{name:"NumberFormat",fullName:"i18n.phonenumbers.NumberFormat"},1:{name:"pattern",required:!0,fieldType:goog.proto2.Message.FieldType.STRING,type:String},2:{name:"format",required:!0,fieldType:goog.proto2.Message.FieldType.STRING,type:String},3:{name:"leading_digits_pattern",repeated:!0,fieldType:goog.proto2.Message.FieldType.STRING,type:String},4:{name:"national_prefix_formatting_rule",fieldType:goog.proto2.Message.FieldType.STRING,
type:String},6:{name:"national_prefix_optional_when_formatting",fieldType:goog.proto2.Message.FieldType.BOOL,type:Boolean},5:{name:"domestic_carrier_code_formatting_rule",fieldType:goog.proto2.Message.FieldType.STRING,type:String}});
goog.proto2.Message.set$Metadata(i18n.phonenumbers.PhoneNumberDesc,{0:{name:"PhoneNumberDesc",fullName:"i18n.phonenumbers.PhoneNumberDesc"},2:{name:"national_number_pattern",fieldType:goog.proto2.Message.FieldType.STRING,type:String},3:{name:"possible_number_pattern",fieldType:goog.proto2.Message.FieldType.STRING,type:String},6:{name:"example_number",fieldType:goog.proto2.Message.FieldType.STRING,type:String}});
goog.proto2.Message.set$Metadata(i18n.phonenumbers.PhoneMetadata,{0:{name:"PhoneMetadata",fullName:"i18n.phonenumbers.PhoneMetadata"},1:{name:"general_desc",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},2:{name:"fixed_line",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},3:{name:"mobile",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},4:{name:"toll_free",
required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},5:{name:"premium_rate",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},6:{name:"shared_cost",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},7:{name:"personal_number",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},8:{name:"voip",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,
type:i18n.phonenumbers.PhoneNumberDesc},21:{name:"pager",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},25:{name:"uan",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},27:{name:"emergency",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},28:{name:"voicemail",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},
24:{name:"no_international_dialling",required:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneNumberDesc},9:{name:"id",required:!0,fieldType:goog.proto2.Message.FieldType.STRING,type:String},10:{name:"country_code",required:!0,fieldType:goog.proto2.Message.FieldType.INT32,type:Number},11:{name:"international_prefix",required:!0,fieldType:goog.proto2.Message.FieldType.STRING,type:String},17:{name:"preferred_international_prefix",fieldType:goog.proto2.Message.FieldType.STRING,
type:String},12:{name:"national_prefix",fieldType:goog.proto2.Message.FieldType.STRING,type:String},13:{name:"preferred_extn_prefix",fieldType:goog.proto2.Message.FieldType.STRING,type:String},15:{name:"national_prefix_for_parsing",fieldType:goog.proto2.Message.FieldType.STRING,type:String},16:{name:"national_prefix_transform_rule",fieldType:goog.proto2.Message.FieldType.STRING,type:String},18:{name:"same_mobile_and_fixed_line_pattern",fieldType:goog.proto2.Message.FieldType.BOOL,defaultValue:!1,
type:Boolean},19:{name:"number_format",repeated:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.NumberFormat},20:{name:"intl_number_format",repeated:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.NumberFormat},22:{name:"main_country_for_code",fieldType:goog.proto2.Message.FieldType.BOOL,defaultValue:!1,type:Boolean},23:{name:"leading_digits",fieldType:goog.proto2.Message.FieldType.STRING,type:String},26:{name:"leading_zero_possible",fieldType:goog.proto2.Message.FieldType.BOOL,
defaultValue:!1,type:Boolean}});goog.proto2.Message.set$Metadata(i18n.phonenumbers.PhoneMetadataCollection,{0:{name:"PhoneMetadataCollection",fullName:"i18n.phonenumbers.PhoneMetadataCollection"},1:{name:"metadata",repeated:!0,fieldType:goog.proto2.Message.FieldType.MESSAGE,type:i18n.phonenumbers.PhoneMetadata}});/*

 Copyright (C) 2010 The Libphonenumber Authors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
i18n.phonenumbers.metadata={};
i18n.phonenumbers.metadata.countryCodeToRegionCodeMap={1:"US AG AI AS BB BM BS CA DM DO GD GU JM KN KY LC MP MS PR SX TC TT VC VG VI".split(" "),7:["RU","KZ"],20:["EG"],27:["ZA"],30:["GR"],31:["NL"],32:["BE"],33:["FR"],34:["ES"],36:["HU"],39:["IT"],40:["RO"],41:["CH"],43:["AT"],44:["GB","GG","IM","JE"],45:["DK"],46:["SE"],47:["NO","SJ"],48:["PL"],49:["DE"],51:["PE"],52:["MX"],53:["CU"],54:["AR"],55:["BR"],56:["CL"],57:["CO"],58:["VE"],60:["MY"],61:["AU","CC","CX"],62:["ID"],63:["PH"],64:["NZ"],65:["SG"],
66:["TH"],81:["JP"],82:["KR"],84:["VN"],86:["CN"],90:["TR"],91:["IN"],92:["PK"],93:["AF"],94:["LK"],95:["MM"],98:["IR"],211:["SS"],212:["MA","EH"],213:["DZ"],216:["TN"],218:["LY"],220:["GM"],221:["SN"],222:["MR"],223:["ML"],224:["GN"],225:["CI"],226:["BF"],227:["NE"],228:["TG"],229:["BJ"],230:["MU"],231:["LR"],232:["SL"],233:["GH"],234:["NG"],235:["TD"],236:["CF"],237:["CM"],238:["CV"],239:["ST"],240:["GQ"],241:["GA"],242:["CG"],243:["CD"],244:["AO"],245:["GW"],246:["IO"],247:["AC"],248:["SC"],249:["SD"],
250:["RW"],251:["ET"],252:["SO"],253:["DJ"],254:["KE"],255:["TZ"],256:["UG"],257:["BI"],258:["MZ"],260:["ZM"],261:["MG"],262:["RE","YT"],263:["ZW"],264:["NA"],265:["MW"],266:["LS"],267:["BW"],268:["SZ"],269:["KM"],290:["SH","TA"],291:["ER"],297:["AW"],298:["FO"],299:["GL"],350:["GI"],351:["PT"],352:["LU"],353:["IE"],354:["IS"],355:["AL"],356:["MT"],357:["CY"],358:["FI","AX"],359:["BG"],370:["LT"],371:["LV"],372:["EE"],373:["MD"],374:["AM"],375:["BY"],376:["AD"],377:["MC"],378:["SM"],379:["VA"],380:["UA"],
381:["RS"],382:["ME"],385:["HR"],386:["SI"],387:["BA"],389:["MK"],420:["CZ"],421:["SK"],423:["LI"],500:["FK"],501:["BZ"],502:["GT"],503:["SV"],504:["HN"],505:["NI"],506:["CR"],507:["PA"],508:["PM"],509:["HT"],590:["GP","BL","MF"],591:["BO"],592:["GY"],593:["EC"],594:["GF"],595:["PY"],596:["MQ"],597:["SR"],598:["UY"],599:["CW","BQ"],670:["TL"],672:["NF"],673:["BN"],674:["NR"],675:["PG"],676:["TO"],677:["SB"],678:["VU"],679:["FJ"],680:["PW"],681:["WF"],682:["CK"],683:["NU"],685:["WS"],686:["KI"],687:["NC"],
688:["TV"],689:["PF"],690:["TK"],691:["FM"],692:["MH"],800:["001"],808:["001"],850:["KP"],852:["HK"],853:["MO"],855:["KH"],856:["LA"],870:["001"],878:["001"],880:["BD"],881:["001"],882:["001"],883:["001"],886:["TW"],888:["001"],960:["MV"],961:["LB"],962:["JO"],963:["SY"],964:["IQ"],965:["KW"],966:["SA"],967:["YE"],968:["OM"],970:["PS"],971:["AE"],972:["IL"],973:["BH"],974:["QA"],975:["BT"],976:["MN"],977:["NP"],979:["001"],992:["TJ"],993:["TM"],994:["AZ"],995:["GE"],996:["KG"],998:["UZ"]};
i18n.phonenumbers.metadata.countryToMetadata={AC:[,[,,"[2-467]\\d{3}","\\d{4}"],[,,"(?:[267]\\d|3[0-5]|4[4-69])\\d{2}","\\d{4}",,,"6889"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"AC",247,"00",,,,,,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],AD:[,[,,"(?:[346-9]|180)\\d{5}","\\d{6,8}"],[,,"[78]\\d{5}","\\d{6}",,,"712345"],[,,"[346]\\d{5}","\\d{6}",,,"312345"],[,,"180[02]\\d{4}","\\d{8}",,,"18001234"],[,,"9\\d{5}","\\d{6}",,,"912345"],
[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"AD",376,"00",,,,,,,,[[,"(\\d{3})(\\d{3})","$1 $2",["[346-9]"],"","",0],[,"(180[02])(\\d{4})","$1 $2",["1"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],AE:[,[,,"[2-79]\\d{7,8}|800\\d{2,9}","\\d{5,12}"],[,,"[2-4679][2-8]\\d{6}","\\d{7,8}",,,"22345678"],[,,"5[0256]\\d{7}","\\d{9}",,,"501234567"],[,,"400\\d{6}|800\\d{2,9}","\\d{5,12}",,,"800123456"],[,,"900[02]\\d{5}","\\d{9}",,,"900234567"],[,,"700[05]\\d{5}","\\d{9}",,,"700012345"],
[,,"NA","NA"],[,,"NA","NA"],"AE",971,"00","0",,,"0",,,,[[,"([2-4679])(\\d{3})(\\d{4})","$1 $2 $3",["[2-4679][2-8]"],"0$1","",0],[,"(5[0256])(\\d{3})(\\d{4})","$1 $2 $3",["5"],"0$1","",0],[,"([479]00)(\\d)(\\d{5})","$1 $2 $3",["[479]0"],"$1","",0],[,"([68]00)(\\d{2,9})","$1 $2",["60|8"],"$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"600[25]\\d{5}","\\d{9}",,,"600212345"],,,[,,"NA","NA"]],AF:[,[,,"[2-7]\\d{8}","\\d{7,9}"],[,,"(?:[25][0-8]|[34][0-4]|6[0-5])[2-9]\\d{6}","\\d{7,9}",,,"234567890"],[,,"7[057-9]\\d{7}",
"\\d{9}",,,"701234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"AF",93,"00","0",,,"0",,,,[[,"([2-7]\\d)(\\d{3})(\\d{4})","$1 $2 $3",,"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],AG:[,[,,"[2589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"268(?:4(?:6[0-38]|84)|56[0-2])\\d{4}","\\d{7}(?:\\d{3})?",,,"2684601234"],[,,"268(?:464|7(?:2[0-9]|64|7[0-689]|8[02-68]))\\d{4}","\\d{10}",,,"2684641234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],
[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"26848[01]\\d{4}","\\d{10}",,,"2684801234"],"AG",1,"011","1",,,"1",,,,,,[,,"26840[69]\\d{4}","\\d{10}",,,"2684061234"],,"268",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],AI:[,[,,"[2589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"2644(?:6[12]|9[78])\\d{4}","\\d{7}(?:\\d{3})?",,,"2644612345"],[,,"264(?:235|476|5(?:3[6-9]|8[1-4])|7(?:29|72))\\d{4}","\\d{10}",,,"2642351234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}",
"\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"AI",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"264",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],AL:[,[,,"[2-57]\\d{7}|6\\d{8}|8\\d{5,7}|9\\d{5}","\\d{5,9}"],[,,"(?:2(?:[168][1-9]|[247]\\d|9[1-7])|3(?:1[1-3]|[2-6]\\d|[79][1-8]|8[1-9])|4\\d{2}|5(?:1[1-4]|[2-578]\\d|6[1-5]|9[1-7])|8(?:[19][1-5]|[2-6]\\d|[78][1-7]))\\d{5}","\\d{5,8}",,,"22345678"],[,
,"6[6-9]\\d{7}","\\d{9}",,,"661234567"],[,,"800\\d{4}","\\d{7}",,,"8001234"],[,,"900\\d{3}","\\d{6}",,,"900123"],[,,"808\\d{3}","\\d{6}",,,"808123"],[,,"700\\d{5}","\\d{8}",,,"70012345"],[,,"NA","NA"],"AL",355,"00","0",,,"0",,,,[[,"(4)(\\d{3})(\\d{4})","$1 $2 $3",["4[0-6]"],"0$1","",0],[,"(6[6-9])(\\d{3})(\\d{4})","$1 $2 $3",["6"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[2358][2-5]|4[7-9]"],"0$1","",0],[,"(\\d{3})(\\d{3,5})","$1 $2",["[235][16-9]|8[016-9]|[79]"],"0$1","",0]],,[,,"NA",
"NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],AM:[,[,,"[1-9]\\d{7}","\\d{5,8}"],[,,"(?:1[01]\\d|2(?:2[2-46]|3[1-8]|4[2-69]|5[2-7]|6[1-9]|8[1-7])|3[12]2|47\\d)\\d{5}","\\d{5,8}",,,"10123456"],[,,"(?:55|77|9[1-9])\\d{6}","\\d{8}",,,"77123456"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"90[016]\\d{5}","\\d{8}",,,"90012345"],[,,"80[1-4]\\d{5}","\\d{8}",,,"80112345"],[,,"NA","NA"],[,,"60[2-6]\\d{5}","\\d{8}",,,"60271234"],"AM",374,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{6})","$1 $2",["1|47"],"(0$1)",
"",0],[,"(\\d{2})(\\d{6})","$1 $2",["[5-7]|9[1-9]"],"0$1","",0],[,"(\\d{3})(\\d{5})","$1 $2",["[23]"],"(0$1)","",0],[,"(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3",["8|90"],"0 $1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],AO:[,[,,"[29]\\d{8}","\\d{9}"],[,,"2\\d(?:[26-9]\\d|\\d[26-9])\\d{5}","\\d{9}",,,"222123456"],[,,"9[1-49]\\d{7}","\\d{9}",,,"923123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"AO",244,"00",,,,,,,,[[,"(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",
,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],AR:[,[,,"[1-368]\\d{9}|9\\d{10}","\\d{6,11}"],[,,"11\\d{8}|(?:2(?:2(?:[013]\\d|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[067]\\d)|4(?:7[3-8]|9\\d)|6(?:[01346]\\d|2[24-6]|5[15-8])|80\\d|9(?:[0124789]\\d|3[1-6]|5[234]|6[2-46]))|3(?:3(?:2[79]|6\\d|8[2578])|4(?:[78]\\d|0[0124-9]|[1-35]\\d|4[24-7]|6[02-9]|9[123678])|5(?:[138]\\d|2[1245]|4[1-9]|6[2-4]|7[1-6])|6[24]\\d|7(?:[0469]\\d|1[1568]|2[013-9]|3[145]|5[14-8]|7[2-57]|8[0-24-9])|8(?:[013578]\\d|2[15-7]|4[13-6]|6[1-357-9]|9[124]))|670\\d)\\d{6}",
"\\d{6,10}",,,"1123456789"],[,,"675\\d{7}|9(?:11[2-9]\\d{7}|(?:2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[12358]|5[138]|6[24]|7[069]|8[013578]))[2-9]\\d{6}|\\d{4}[2-9]\\d{5})","\\d{6,11}",,,"91123456789"],[,,"800\\d{7}","\\d{10}",,,"8001234567"],[,,"60[04579]\\d{7}","\\d{10}",,,"6001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"AR",54,"00","0",,,"0?(?:(11|2(?:2(?:02?|[13]|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:02?|1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[67])|4(?:7[3-578]|9)|6(?:[0136]|2[24-6]|4[6-8]?|5[15-8])|80|9(?:0[1-3]|[19]|2\\d|3[1-6]|4[02568]?|5[2-4]|6[2-46]|72?|8[23]?))|3(?:3(?:2[79]|6|8[2578])|4(?:0[124-9]|[12]|3[5-8]?|4[24-7]|5[4-68]?|6[02-9]|7[126]|8[2379]?|9[1-36-8])|5(?:1|2[1245]|3[237]?|4[1-46-9]|6[2-4]|7[1-6]|8[2-5]?)|6[24]|7(?:1[1568]|2[15]|3[145]|4[13]|5[14-8]|[069]|7[2-57]|8[126])|8(?:[01]|2[15-7]|3[2578]?|4[13-6]|5[4-8]?|6[1-357-9]|7[36-8]?|8[5-8]?|9[124])))15)?",
"9$1",,,[[,"([68]\\d{2})(\\d{3})(\\d{4})","$1-$2-$3",["[68]"],"0$1","",0],[,"(9)(11)(\\d{4})(\\d{4})","$2 15-$3-$4",["911"],"0$1","",0],[,"(9)(\\d{3})(\\d{3})(\\d{4})","$2 15-$3-$4",["9(?:2[234689]|3[3-8])","9(?:2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[12358]|5[138]|6[24]|7[069]|8[013578]))","9(?:2(?:2[013]|3[067]|49|6[01346]|80|9(?:[17-9]|4[13479]))|3(?:36|4[12358]|5(?:[18]|3[014-689])|6[24]|7[069]|8(?:[01]|3[013469]|5[0-39]|7[0-2459]|8[0-49])))"],"0$1","",0],[,"(9)(\\d{4})(\\d{3})(\\d{3})",
"$2 15-$3-$4",["93[58]","9(?:3(?:53|8[78]))","9(?:3(?:537|8(?:73|88)))"],"0$1","",0],[,"(9)(\\d{4})(\\d{2})(\\d{4})","$2 15-$3-$4",["9[23]"],"0$1","",0],[,"(11)(\\d{4})(\\d{4})","$1 $2-$3",["1"],"0$1","",1],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2-$3",["2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[12358]|5[138]|6[24]|7[069]|8[013578])","2(?:2[013]|3[067]|49|6[01346]|80|9(?:[17-9]|4[13479]))|3(?:36|4[12358]|5(?:[18]|3[0-689])|6[24]|7[069]|8(?:[01]|3[013469]|5[0-39]|7[0-2459]|8[0-49]))"],"0$1","",
1],[,"(\\d{4})(\\d{3})(\\d{3})","$1 $2-$3",["3(?:53|8[78])","3(?:537|8(?:73|88))"],"0$1","",1],[,"(\\d{4})(\\d{2})(\\d{4})","$1 $2-$3",["[23]"],"0$1","",1],[,"(\\d{3})","$1",["1[012]|911"],"$1","",0]],[[,"([68]\\d{2})(\\d{3})(\\d{4})","$1-$2-$3",["[68]","[68]"],"0$1","",0],[,"(9)(11)(\\d{4})(\\d{4})","$1 $2 $3-$4",["911"]],[,"(9)(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3-$4",["9(?:2[234689]|3[3-8])","9(?:2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[12358]|5[138]|6[24]|7[069]|8[013578]))","9(?:2(?:2[013]|3[067]|49|6[01346]|80|9(?:[17-9]|4[13479]))|3(?:36|4[12358]|5(?:[18]|3[014-689])|6[24]|7[069]|8(?:[01]|3[013469]|5[0-39]|7[0-2459]|8[0-49])))"]],
[,"(9)(\\d{4})(\\d{3})(\\d{3})","$1 $2 $3-$4",["93[58]","9(?:3(?:53|8[78]))","9(?:3(?:537|8(?:73|88)))"]],[,"(9)(\\d{4})(\\d{2})(\\d{4})","$1 $2 $3-$4",["9[23]"]],[,"(11)(\\d{4})(\\d{4})","$1 $2-$3",["1","1"],"0$1","",1],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2-$3",["2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[12358]|5[138]|6[24]|7[069]|8[013578])","2(?:2[013]|3[067]|49|6[01346]|80|9(?:[17-9]|4[13479]))|3(?:36|4[12358]|5(?:[18]|3[0-689])|6[24]|7[069]|8(?:[01]|3[013469]|5[0-39]|7[0-2459]|8[0-49]))",
"2(?:2[013]|3[067]|49|6[01346]|80|9[147-9])|3(?:36|4[12358]|5[138]|6[24]|7[069]|8[013578])","2(?:2[013]|3[067]|49|6[01346]|80|9(?:[17-9]|4[13479]))|3(?:36|4[12358]|5(?:[18]|3[0-689])|6[24]|7[069]|8(?:[01]|3[013469]|5[0-39]|7[0-2459]|8[0-49]))"],"0$1","",1],[,"(\\d{4})(\\d{3})(\\d{3})","$1 $2-$3",["3(?:53|8[78])","3(?:537|8(?:73|88))","3(?:53|8[78])","3(?:537|8(?:73|88))"],"0$1","",1],[,"(\\d{4})(\\d{2})(\\d{4})","$1 $2-$3",["[23]","[23]"],"0$1","",1]],[,,"NA","NA"],,,[,,"810\\d{7}","\\d{10}",,,"8101234567"],
[,,"810\\d{7}","\\d{10}",,,"8101234567"],,,[,,"NA","NA"]],AS:[,[,,"[5689]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"6846(?:22|33|44|55|77|88|9[19])\\d{4}","\\d{7}(?:\\d{3})?",,,"6846221234"],[,,"684(?:733|25[2468])\\d{4}","\\d{10}",,,"6847331234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"AS",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"684",[,,"NA","NA"],[,,"NA",
"NA"],,,[,,"NA","NA"]],AT:[,[,,"[1-9]\\d{3,12}","\\d{3,13}"],[,,"1\\d{3,12}|(?:2(?:1[467]|2[13-8]|5[2357]|6[1-46-8]|7[1-8]|8[124-7]|9[1458])|3(?:1[1-8]|3[23568]|4[5-7]|5[1378]|6[1-38]|8[3-68])|4(?:2[1-8]|35|63|7[1368]|8[2457])|5(?:12|2[1-8]|3[357]|4[147]|5[12578]|6[37])|6(?:13|2[1-47]|4[1-35-8]|5[468]|62)|7(?:2[1-8]|3[25]|4[13478]|5[68]|6[16-8]|7[1-6]|9[45]))\\d{3,10}","\\d{3,13}",,,"1234567890"],[,,"6(?:44|5[0-3579]|6[013-9]|[7-9]\\d)\\d{4,10}","\\d{7,13}",,,"644123456"],[,,"80[02]\\d{6,10}","\\d{9,13}",
,,"800123456"],[,,"(?:711|9(?:0[01]|3[019]))\\d{6,10}","\\d{9,13}",,,"900123456"],[,,"8(?:10|2[018])\\d{6,10}","\\d{9,13}",,,"810123456"],[,,"NA","NA"],[,,"780\\d{6,10}","\\d{9,13}",,,"780123456"],"AT",43,"00","0",,,"0",,,,[[,"(1)(\\d{3,12})","$1 $2",["1"],"0$1","",0],[,"(5\\d)(\\d{3,5})","$1 $2",["5[079]"],"0$1","",0],[,"(5\\d)(\\d{3})(\\d{3,4})","$1 $2 $3",["5[079]"],"0$1","",0],[,"(5\\d)(\\d{4})(\\d{4,7})","$1 $2 $3",["5[079]"],"0$1","",0],[,"(\\d{3})(\\d{3,10})","$1 $2",["316|46|51|732|6(?:44|5[0-3579]|[6-9])|7(?:1|[28]0)|[89]"],
"0$1","",0],[,"(\\d{4})(\\d{3,9})","$1 $2",["2|3(?:1[1-578]|[3-8])|4[2378]|5[2-6]|6(?:[12]|4[1-35-9]|5[468])|7(?:2[1-8]|35|4[1-8]|[5-79])"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"5(?:(?:0[1-9]|17)\\d{2,10}|[79]\\d{3,11})|720\\d{6,10}","\\d{5,13}",,,"50123"],,,[,,"NA","NA"]],AU:[,[,,"[1-578]\\d{5,9}","\\d{6,10}"],[,,"[237]\\d{8}|8(?:[68]\\d{3}|7[0-69]\\d{2}|9(?:[02-9]\\d{2}|1(?:[0-57-9]\\d|6[0135-9])))\\d{4}","\\d{8,9}",,,"212345678"],[,,"14(?:5\\d|71)\\d{5}|4(?:[0-2]\\d|3[0-57-9]|4[47-9]|5[0-25-9]|6[6-9]|7[0457-9]|8[17-9]|9[07-9])\\d{6}",
"\\d{9}",,,"412345678"],[,,"180(?:0\\d{3}|2)\\d{3}","\\d{7,10}",,,"1800123456"],[,,"190[0126]\\d{6}","\\d{10}",,,"1900123456"],[,,"13(?:00\\d{2})?\\d{4}","\\d{6,10}",,,"1300123456"],[,,"500\\d{6}","\\d{9}",,,"500123456"],[,,"550\\d{6}","\\d{9}",,,"550123456"],"AU",61,"(?:14(?:1[14]|34|4[17]|[56]6|7[47]|88))?001[14-689]","0",,,"0",,"0011",,[[,"([2378])(\\d{4})(\\d{4})","$1 $2 $3",["[2378]"],"(0$1)","",0],[,"(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[45]|14"],"0$1","",0],[,"(16)(\\d{3})(\\d{2,4})","$1 $2 $3",
["16"],"0$1","",0],[,"(1[389]\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["1(?:[38]0|90)","1(?:[38]00|90)"],"$1","",0],[,"(180)(2\\d{3})","$1 $2",["180","1802"],"$1","",0],[,"(19\\d)(\\d{3})","$1 $2",["19[13]"],"$1","",0],[,"(19\\d{2})(\\d{4})","$1 $2",["19[67]"],"$1","",0],[,"(13)(\\d{2})(\\d{2})","$1 $2 $3",["13[1-9]"],"$1","",0]],,[,,"16\\d{3,7}","\\d{5,9}",,,"1612345"],1,,[,,"1(?:3(?:\\d{4}|00\\d{6})|80(?:0\\d{6}|2\\d{3}))","\\d{6,10}",,,"1300123456"],[,,"NA","NA"],,,[,,"NA","NA"]],AW:[,[,,"[25-9]\\d{6}",
"\\d{7}"],[,,"5(?:2\\d|8[1-9])\\d{4}","\\d{7}",,,"5212345"],[,,"(?:5(?:6\\d|9[2-478])|6(?:[039]0|22|4[01]|6[0-2])|7[34]\\d|9(?:6[45]|9[4-8]))\\d{4}","\\d{7}",,,"5601234"],[,,"800\\d{4}","\\d{7}",,,"8001234"],[,,"900\\d{4}","\\d{7}",,,"9001234"],[,,"NA","NA"],[,,"NA","NA"],[,,"28\\d{5}|501\\d{4}","\\d{7}",,,"5011234"],"AW",297,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],AX:[,[,,"[135]\\d{5,9}|[27]\\d{4,9}|4\\d{5,10}|6\\d{7,8}|8\\d{6,9}",
"\\d{5,12}"],[,,"18[1-8]\\d{3,9}","\\d{6,12}",,,"1812345678"],[,,"4\\d{5,10}|50\\d{4,8}","\\d{6,11}",,,"412345678"],[,,"800\\d{4,7}","\\d{7,10}",,,"8001234567"],[,,"[67]00\\d{5,6}","\\d{8,9}",,,"600123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"AX",358,"00|99[049]","0",,,"0",,,,,,[,,"NA","NA"],,,[,,"[13]00\\d{3,7}|2(?:0(?:0\\d{3,7}|2[023]\\d{1,6}|9[89]\\d{1,6}))|60(?:[12]\\d{5,6}|6\\d{7})|7(?:1\\d{7}|3\\d{8}|5[03-9]\\d{2,7})","\\d{5,10}",,,"100123"],[,,"[13]0\\d{4,8}|2(?:0(?:[016-8]\\d{3,7}|[2-59]\\d{2,7})|9\\d{4,8})|60(?:[12]\\d{5,6}|6\\d{7})|7(?:1\\d{7}|3\\d{8}|5[03-9]\\d{2,7})",
"\\d{5,10}",,,"10112345"],,,[,,"NA","NA"]],AZ:[,[,,"[1-9]\\d{8}","\\d{7,9}"],[,,"(?:1[28]\\d|2(?:02|1[24]|2[2-4]|33|[45]2|6[23])|365)\\d{6}","\\d{7,9}",,,"123123456"],[,,"(?:4[04]|5[015]|60|7[07])\\d{7}","\\d{9}",,,"401234567"],[,,"88\\d{7}","\\d{9}",,,"881234567"],[,,"900200\\d{3}","\\d{9}",,,"900200123"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"AZ",994,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["(?:1[28]|2(?:[45]2|[0-36])|365)"],"(0$1)","",0],[,"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
"$1 $2 $3 $4",["[4-8]"],"0$1","",0],[,"(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["9"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BA:[,[,,"[3-9]\\d{7,8}","\\d{6,9}"],[,,"(?:[35]\\d|49)\\d{6}","\\d{6,8}",,,"30123456"],[,,"6(?:03|44|71|[1-356])\\d{6}","\\d{8,9}",,,"61123456"],[,,"8[08]\\d{6}","\\d{8}",,,"80123456"],[,,"9[0246]\\d{6}","\\d{8}",,,"90123456"],[,,"8[12]\\d{6}","\\d{8}",,,"82123456"],[,,"NA","NA"],[,,"NA","NA"],"BA",387,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{3})(\\d{3})",
"$1 $2-$3",["[3-5]"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["6[1-356]|[7-9]"],"0$1","",0],[,"(\\d{2})(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3 $4",["6[047]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"70[23]\\d{5}","\\d{8}",,,"70223456"],,,[,,"NA","NA"]],BB:[,[,,"[2589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"246[2-9]\\d{6}","\\d{7}(?:\\d{3})?",,,"2462345678"],[,,"246(?:(?:2[346]|45|82)\\d|25[0-4])\\d{4}","\\d{10}",,,"2462501234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],
[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"BB",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"246",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BD:[,[,,"[2-79]\\d{5,9}|1\\d{9}|8[0-7]\\d{4,8}","\\d{6,10}"],[,,"2(?:7(?:1[0-267]|2[0-289]|3[0-29]|[46][01]|5[1-3]|7[017]|91)|8(?:0[125]|[139][1-6]|2[0157-9]|6[1-35]|7[1-5]|8[1-8])|9(?:0[0-2]|1[1-4]|2[568]|3[3-6]|5[5-7]|6[0167]|7[15]|8[016-8]))\\d{4}|3(?:12?[5-7]\\d{2}|0(?:2(?:[025-79]\\d|[348]\\d{1,2})|3(?:[2-4]\\d|[56]\\d?))|2(?:1\\d{2}|2(?:[12]\\d|[35]\\d{1,2}|4\\d?))|3(?:1\\d{2}|2(?:[2356]\\d|4\\d{1,2}))|4(?:1\\d{2}|2(?:2\\d{1,2}|[47]|5\\d{2}))|5(?:1\\d{2}|29)|[67]1\\d{2}|8(?:1\\d{2}|2(?:2\\d{2}|3|4\\d)))\\d{3}|4(?:0(?:2(?:[09]\\d|7)|33\\d{2})|1\\d{3}|2(?:1\\d{2}|2(?:[25]\\d?|[348]\\d|[67]\\d{1,2}))|3(?:1\\d{2}(?:\\d{2})?|2(?:[045]\\d|[236-9]\\d{1,2})|32\\d{2})|4(?:[18]\\d{2}|2(?:[2-46]\\d{2}|3)|5[25]\\d{2})|5(?:1\\d{2}|2(?:3\\d|5))|6(?:[18]\\d{2}|2(?:3(?:\\d{2})?|[46]\\d{1,2}|5\\d{2}|7\\d)|5(?:3\\d?|4\\d|[57]\\d{1,2}|6\\d{2}|8))|71\\d{2}|8(?:[18]\\d{2}|23\\d{2}|54\\d{2})|9(?:[18]\\d{2}|2[2-5]\\d{2}|53\\d{1,2}))\\d{3}|5(?:02[03489]\\d{2}|1\\d{2}|2(?:1\\d{2}|2(?:2(?:\\d{2})?|[457]\\d{2}))|3(?:1\\d{2}|2(?:[37](?:\\d{2})?|[569]\\d{2}))|4(?:1\\d{2}|2[46]\\d{2})|5(?:1\\d{2}|26\\d{1,2})|6(?:[18]\\d{2}|2|53\\d{2})|7(?:1|24)\\d{2}|8(?:1|26)\\d{2}|91\\d{2})\\d{3}|6(?:0(?:1\\d{2}|2(?:3\\d{2}|4\\d{1,2}))|2(?:2[2-5]\\d{2}|5(?:[3-5]\\d{2}|7)|8\\d{2})|3(?:1|2[3478])\\d{2}|4(?:1|2[34])\\d{2}|5(?:1|2[47])\\d{2}|6(?:[18]\\d{2}|6(?:2(?:2\\d|[34]\\d{2})|5(?:[24]\\d{2}|3\\d|5\\d{1,2})))|72[2-5]\\d{2}|8(?:1\\d{2}|2[2-5]\\d{2})|9(?:1\\d{2}|2[2-6]\\d{2}))\\d{3}|7(?:(?:02|[3-589]1|6[12]|72[24])\\d{2}|21\\d{3}|32)\\d{3}|8(?:(?:4[12]|[5-7]2|1\\d?)|(?:0|3[12]|[5-7]1|217)\\d)\\d{4}|9(?:[35]1|(?:[024]2|81)\\d|(?:1|[24]1)\\d{2})\\d{3}",
"\\d{6,9}",,,"27111234"],[,,"(?:1[13-9]\\d|(?:3[78]|44)[02-9]|6(?:44|6[02-9]))\\d{7}","\\d{10}",,,"1812345678"],[,,"80[03]\\d{7}","\\d{10}",,,"8001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"96(?:0[49]|1[0-4]|6[69])\\d{6}","\\d{10}",,,"9604123456"],"BD",880,"00[12]?","0",,,"0",,"00",,[[,"(2)(\\d{7})","$1-$2",["2"],"0$1","",0],[,"(\\d{2})(\\d{4,6})","$1-$2",["[3-79]1"],"0$1","",0],[,"(\\d{4})(\\d{3,6})","$1-$2",["1|3(?:0|[2-58]2)|4(?:0|[25]2|3[23]|[4689][25])|5(?:[02-578]2|6[25])|6(?:[0347-9]2|[26][25])|7[02-9]2|8(?:[023][23]|[4-7]2)|9(?:[02][23]|[458]2|6[016])"],
"0$1","",0],[,"(\\d{3})(\\d{3,7})","$1-$2",["[3-79][2-9]|8"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BE:[,[,,"[1-9]\\d{7,8}","\\d{8,9}"],[,,"(?:1[0-69]|[49][23]|5\\d|6[013-57-9]|71|8[0-79])[1-9]\\d{5}|[23][2-8]\\d{6}","\\d{8}",,,"12345678"],[,,"4(?:[679]\\d|8[03-9])\\d{6}","\\d{9}",,,"470123456"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"(?:70[2-7]|90\\d)\\d{5}","\\d{8}",,,"90123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"BE",32,"00","0",,,"0",,,,[[,"(4[6-9]\\d)(\\d{2})(\\d{2})(\\d{2})",
"$1 $2 $3 $4",["4[6-9]"],"0$1","",0],[,"([2-49])(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[23]|[49][23]"],"0$1","",0],[,"([15-8]\\d)(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[156]|7[018]|8(?:0[1-9]|[1-79])"],"0$1","",0],[,"([89]\\d{2})(\\d{2})(\\d{3})","$1 $2 $3",["(?:80|9)0"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"78\\d{6}","\\d{8}",,,"78123456"],,,[,,"NA","NA"]],BF:[,[,,"[24-7]\\d{7}","\\d{8}"],[,,"(?:20(?:49|5[23]|9[016-9])|40(?:4[56]|5[4-6]|7[0179])|50[34]\\d)\\d{4}","\\d{8}",,,"20491234"],
[,,"6(?:[0-24-6]\\d|8[0-8]|3[0-3])\\d{5}|7\\d{7}","\\d{8}",,,"70123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"BF",226,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BG:[,[,,"[23567]\\d{5,7}|[489]\\d{6,8}","\\d{5,9}"],[,,"2(?:[0-8]\\d{5,6}|9\\d{4,6})|(?:[36]\\d|5[1-9]|8[1-6]|9[1-7])\\d{5,6}|(?:4(?:[124-7]\\d|3[1-6])|7(?:0[1-9]|[1-9]\\d))\\d{4,5}","\\d{5,8}",,,"2123456"],[,,"(?:8[7-9]|98)\\d{7}|4(?:3[0789]|8\\d)\\d{5}",
"\\d{8,9}",,,"48123456"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"90\\d{6}","\\d{8}",,,"90123456"],[,,"NA","NA"],[,,"700\\d{5}","\\d{5,9}",,,"70012345"],[,,"NA","NA"],"BG",359,"00","0",,,"0",,,,[[,"(2)(\\d{5})","$1 $2",["29"],"0$1","",0],[,"(2)(\\d{3})(\\d{3,4})","$1 $2 $3",["2"],"0$1","",0],[,"(\\d{3})(\\d{4})","$1 $2",["43[124-7]|70[1-9]"],"0$1","",0],[,"(\\d{3})(\\d{3})(\\d{2})","$1 $2 $3",["43[124-7]|70[1-9]"],"0$1","",0],[,"(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3",["[78]00"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{2,3})",
"$1 $2 $3",["[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["48|8[7-9]|9[08]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BH:[,[,,"[136-9]\\d{7}","\\d{8}"],[,,"(?:1(?:3[13-6]|6[0156]|7\\d)\\d|6(?:1[16]\\d|6(?:0\\d|3[12]|44|88)|9(?:6[69]|9[6-9]))|7(?:7\\d{2}|178))\\d{4}","\\d{8}",,,"17001234"],[,,"(?:3(?:[1-4679]\\d|5[0135]|8[348])\\d|6(?:1[16]\\d|3(?:00|33|6[16])|500|6(?:[069]\\d|3[03-9]|44|88)|9(?:6[69]|9[6-9]))|77\\d{2})\\d{4}",
"\\d{8}",,,"36001234"],[,,"80\\d{6}","\\d{8}",,,"80123456"],[,,"(?:87|9[014578])\\d{6}","\\d{8}",,,"90123456"],[,,"84\\d{6}","\\d{8}",,,"84123456"],[,,"NA","NA"],[,,"NA","NA"],"BH",973,"00",,,,,,,,[[,"(\\d{4})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BI:[,[,,"[27]\\d{7}","\\d{8}"],[,,"22(?:2[0-7]|[3-5]0)\\d{4}","\\d{8}",,,"22201234"],[,,"(?:29|7[14-9])\\d{6}","\\d{8}",,,"79561234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],
"BI",257,"00",,,,,,,,[[,"([27]\\d)(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BJ:[,[,,"[2689]\\d{7}|7\\d{3}","\\d{4,8}"],[,,"2(?:02|1[037]|2[45]|3[68])\\d{5}","\\d{8}",,,"20211234"],[,,"(?:6[46-8]|9[03-9])\\d{6}","\\d{8}",,,"90011234"],[,,"7[3-5]\\d{2}","\\d{4}",,,"7312"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"857[58]\\d{4}","\\d{8}",,,"85751234"],"BJ",229,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"",
"",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"81\\d{6}","\\d{8}",,,"81123456"],,,[,,"NA","NA"]],BL:[,[,,"[56]\\d{8}","\\d{9}"],[,,"590(?:2[7-9]|5[12]|87)\\d{4}","\\d{9}",,,"590271234"],[,,"690(?:0[0-7]|[1-9]\\d)\\d{4}","\\d{9}",,,"690301234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"BL",590,"00","0",,,"0",,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BM:[,[,,"[4589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"441(?:2(?:02|23|61|[3479]\\d)|[46]\\d{2}|5(?:4\\d|60|89)|824)\\d{4}",
"\\d{7}(?:\\d{3})?",,,"4412345678"],[,,"441(?:[37]\\d|5[0-39])\\d{5}","\\d{10}",,,"4413701234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"BM",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"441",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BN:[,[,,"[2-578]\\d{6}","\\d{7}"],[,,"[2-5]\\d{6}","\\d{7}",,,"2345678"],[,,"[78]\\d{6}","\\d{7}",,,"7123456"],[,,"NA",
"NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"BN",673,"00",,,,,,,,[[,"([2-578]\\d{2})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BO:[,[,,"[23467]\\d{7}","\\d{7,8}"],[,,"(?:2(?:2\\d{2}|5(?:11|[258]\\d|9[67])|6(?:12|2\\d|9[34])|8(?:2[34]|39|62))|3(?:3\\d{2}|4(?:6\\d|8[24])|8(?:25|42|5[257]|86|9[25])|9(?:2\\d|3[234]|4[248]|5[24]|6[2-6]|7\\d))|4(?:4\\d{2}|6(?:11|[24689]\\d|72)))\\d{4}","\\d{7,8}",,,"22123456"],[,,"[67]\\d{7}","\\d{8}",,,
"71234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"BO",591,"00(1\\d)?","0",,,"0(1\\d)?",,,,[[,"([234])(\\d{7})","$1 $2",["[234]"],"","0$CC $1",0],[,"([67]\\d{7})","$1",["[67]"],"","0$CC $1",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BQ:[,[,,"[347]\\d{6}","\\d{7}"],[,,"(?:318[023]|416[023]|7(?:1[578]|50)\\d)\\d{3}","\\d{7}",,,"7151234"],[,,"(?:318[14-68]|416[15-9]|7(?:0[01]|7[07]|[89]\\d)\\d)\\d{3}","\\d{7}",,,"3181234"],[,,"NA","NA"],[,,"NA",
"NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"BQ",599,"00",,,,,,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BR:[,[,,"[1-46-9]\\d{7,10}|5\\d{8,9}","\\d{8,11}"],[,,"1[1-9][2-5]\\d{7}|(?:[4689][1-9]|2[12478]|3[1-578]|5[13-5]|7[13-579])[2-5]\\d{7}","\\d{8,11}",,,"1123456789"],[,,"1(?:1(?:5[347]|[6-9]\\d)|[2-9][6-9]\\d)\\d{6}|(?:2[12478]|3[1-578]|[4689][1-9]|5[13-5]|7[13-579])[6-9]\\d{7}|(?:1(?:19\\d|[2-9]9[6-9])|2[12478]9[6-9])\\d{7}","\\d{10,11}",,,"1161234567"],[,,"800\\d{6,7}",
"\\d{8,11}",,,"800123456"],[,,"[359]00\\d{6,7}","\\d{8,11}",,,"300123456"],[,,"[34]00\\d{5}","\\d{8}",,,"40041234"],[,,"NA","NA"],[,,"NA","NA"],"BR",55,"00(?:1[45]|2[135]|[34]1|43)","0",,,"0(?:(1[245]|2[135]|[34]1)(\\d{10,11}))?","$2",,,[[,"(\\d{4})(\\d{4})","$1-$2",["[2-9](?:[1-9]|0[1-9])"],"$1","",0],[,"(\\d{5})(\\d{4})","$1-$2",["9(?:[1-9]|0[1-9])"],"$1","",0],[,"(\\d{3,5})","$1",["1[125689]"],"$1","",0],[,"(\\d{2})(\\d{5})(\\d{4})","$1 $2-$3",["(?:1[1-9]|2[12478])9"],"($1)","0 $CC ($1)",0],[,
"(\\d{2})(\\d{4})(\\d{4})","$1 $2-$3",["[1-9][1-9]"],"($1)","0 $CC ($1)",0],[,"([34]00\\d)(\\d{4})","$1-$2",["[34]00"],"","",0],[,"([3589]00)(\\d{2,3})(\\d{4})","$1 $2 $3",["[3589]00"],"0$1","",0]],[[,"(\\d{2})(\\d{5})(\\d{4})","$1 $2-$3",["(?:1[1-9]|2[12478])9","(?:1[1-9]|2[12478])9"],"($1)","0 $CC ($1)",0],[,"(\\d{2})(\\d{4})(\\d{4})","$1 $2-$3",["[1-9][1-9]","[1-9][1-9]"],"($1)","0 $CC ($1)",0],[,"([34]00\\d)(\\d{4})","$1-$2",["[34]00","[34]00"],"","",0],[,"([3589]00)(\\d{2,3})(\\d{4})","$1 $2 $3",
["[3589]00","[3589]00"],"0$1","",0]],[,,"NA","NA"],,,[,,"[34]00\\d{5}","\\d{8}",,,"40041234"],[,,"NA","NA"],,,[,,"NA","NA"]],BS:[,[,,"[2589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"242(?:3(?:02|[236][1-9]|4[0-24-9]|5[0-68]|7[3467]|8[0-4]|9[2-467])|461|502|6(?:12|7[67]|8[78]|9[89])|702)\\d{4}","\\d{7}(?:\\d{3})?",,,"2423456789"],[,,"242(?:3(?:5[79]|[79]5)|4(?:[2-4][1-9]|5[1-8]|6[2-8]|7\\d|81)|5(?:2[45]|3[35]|44|5[1-9]|65|77)|6[34]6|727)\\d{4}","\\d{10}",,,"2423591234"],[,,"242300\\d{4}|8(?:00|55|66|77|88)[2-9]\\d{6}",
"\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"BS",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"242",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BT:[,[,,"[1-8]\\d{6,7}","\\d{6,8}"],[,,"(?:2[3-6]|[34][5-7]|5[236]|6[2-46]|7[246]|8[2-4])\\d{5}","\\d{6,7}",,,"2345678"],[,,"[17]7\\d{6}","\\d{8}",,,"17123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"BT",975,"00",,,,,,,
,[[,"([17]7)(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["1|77"],"","",0],[,"([2-8])(\\d{3})(\\d{3})","$1 $2 $3",["[2-68]|7[246]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BW:[,[,,"[2-79]\\d{6,7}","\\d{7,8}"],[,,"(?:2(?:4[0-48]|6[0-24]|9[0578])|3(?:1[0235-9]|55|6\\d|7[01]|9[0-57])|4(?:6[03]|7[1267]|9[0-5])|5(?:3[0389]|4[0489]|7[1-47]|88|9[0-49])|6(?:2[1-35]|5[149]|8[067]))\\d{4}","\\d{7}",,,"2401234"],[,,"7(?:[1-35]\\d{6}|[46][0-7]\\d{5}|7[0146]\\d{5})","\\d{8}",,,"71123456"],
[,,"NA","NA"],[,,"90\\d{5}","\\d{7}",,,"9012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"79[12][01]\\d{4}","\\d{8}",,,"79101234"],"BW",267,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",["[2-6]"],"","",0],[,"(7\\d)(\\d{3})(\\d{3})","$1 $2 $3",["7"],"","",0],[,"(90)(\\d{5})","$1 $2",["9"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],BY:[,[,,"[1-4]\\d{8}|[89]\\d{9,10}","\\d{7,11}"],[,,"(?:1(?:5(?:1[1-5]|[24]\\d|6[2-4]|9[1-7])|6(?:[235]\\d|4[1-7])|7\\d{2})|2(?:1(?:[246]\\d|3[0-35-9]|5[1-9])|2(?:[235]\\d|4[0-8])|3(?:[26]\\d|3[02-79]|4[024-7]|5[03-7])))\\d{5}",
"\\d{7,9}",,,"152450911"],[,,"(?:2(?:5[5679]|9[1-9])|33\\d|44\\d)\\d{6}","\\d{9}",,,"294911911"],[,,"8(?:0[13]|20\\d)\\d{7}","\\d{10,11}",,,"8011234567"],[,,"(?:810|902)\\d{7}","\\d{10}",,,"9021234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"BY",375,"810","8",,,"8?0?",,"8~10",,[[,"(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2-$3-$4",["17[0-3589]|2[4-9]|[34]","17(?:[02358]|1[0-2]|9[0189])|2[4-9]|[34]"],"8 0$1","",0],[,"(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2-$3-$4",["1(?:5[24]|6[235]|7[467])|2(?:1[246]|2[25]|3[26])",
"1(?:5[24]|6(?:2|3[04-9]|5[0346-9])|7(?:[46]|7[37-9]))|2(?:1[246]|2[25]|3[26])"],"8 0$1","",0],[,"(\\d{4})(\\d{2})(\\d{3})","$1 $2-$3",["1(?:5[169]|6[3-5]|7[179])|2(?:1[35]|2[34]|3[3-5])","1(?:5[169]|6(?:3[1-3]|4|5[125])|7(?:1[3-9]|7[0-24-6]|9[2-7]))|2(?:1[35]|2[34]|3[3-5])"],"8 0$1","",0],[,"([89]\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["8[01]|9"],"8 $1","",0],[,"(8\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["82"],"8 $1","",0]],,[,,"NA","NA"],,,[,,"8(?:[013]|[12]0)\\d{8}|902\\d{7}","\\d{10,11}",,,"82012345678"],
[,,"NA","NA"],,,[,,"NA","NA"]],BZ:[,[,,"[2-8]\\d{6}|0\\d{10}","\\d{7}(?:\\d{4})?"],[,,"[234578][02]\\d{5}","\\d{7}",,,"2221234"],[,,"6[0-367]\\d{5}","\\d{7}",,,"6221234"],[,,"0800\\d{7}","\\d{11}",,,"08001234123"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"BZ",501,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1-$2",["[2-8]"],"","",0],[,"(0)(800)(\\d{4})(\\d{3})","$1-$2-$3-$4",["0"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],CA:[,[,,"[2-9]\\d{9}|3\\d{6}","\\d{7}(?:\\d{3})?"],
[,,"(?:2(?:04|[23]6|[48]9|50)|3(?:06|43|65)|4(?:03|1[68]|3[178]|50)|5(?:06|1[49]|79|8[17])|6(?:0[04]|13|39|47)|7(?:0[59]|78|80)|8(?:[06]7|19|73)|90[25])[2-9]\\d{6}|310\\d{4}","\\d{7}(?:\\d{3})?",,,"2042345678"],[,,"(?:2(?:04|[23]6|[48]9|50)|3(?:06|43|65)|4(?:03|1[68]|3[178]|50)|5(?:06|1[49]|79|8[17])|6(?:0[04]|13|39|47)|7(?:0[59]|78|80)|8(?:[06]7|19|73)|90[25])[2-9]\\d{6}","\\d{7}(?:\\d{3})?",,,"2042345678"],[,,"8(?:00|66|77|88)[2-9]\\d{6}|310\\d{4}","\\d{7}(?:\\d{3})?",,,"8002123456"],[,,"900[2-9]\\d{6}",
"\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"CA",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CC:[,[,,"[1458]\\d{5,9}","\\d{6,10}"],[,,"89162\\d{4}","\\d{8,9}",,,"891621234"],[,,"4(?:[0-2]\\d|3[0-57-9]|4[47-9]|5[0-37-9]|6[6-9]|7[07-9]|8[7-9])\\d{6}","\\d{9}",,,"412345678"],[,,"1(?:80(?:0\\d{2})?|3(?:00\\d{2})?)\\d{4}","\\d{6,10}",,,"1800123456"],[,,"190[0126]\\d{6}","\\d{10}",,,"1900123456"],[,
,"NA","NA"],[,,"500\\d{6}","\\d{9}",,,"500123456"],[,,"550\\d{6}","\\d{9}",,,"550123456"],"CC",61,"(?:14(?:1[14]|34|4[17]|[56]6|7[47]|88))?001[14-689]","0",,,"0",,"0011",,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CD:[,[,,"[2-6]\\d{6}|[18]\\d{6,8}|9\\d{8}","\\d{7,9}"],[,,"1(?:2\\d{7}|\\d{6})|[2-6]\\d{6}","\\d{7,9}",,,"1234567"],[,,"8(?:[0-2459]\\d{2}|8)\\d{5}|9[7-9]\\d{7}","\\d{7,9}",,,"991234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"CD",243,
"00","0",,,"0",,,,[[,"(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["12"],"0$1","",0],[,"([89]\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["8[0-2459]|9"],"0$1","",0],[,"(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3",["88"],"0$1","",0],[,"(\\d{2})(\\d{5})","$1 $2",["[1-6]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CF:[,[,,"[278]\\d{7}","\\d{8}"],[,,"2[12]\\d{6}","\\d{8}",,,"21612345"],[,,"7[0257]\\d{6}","\\d{8}",,,"70012345"],[,,"NA","NA"],[,,"8776\\d{4}","\\d{8}",,,"87761234"],[,,"NA","NA"],
[,,"NA","NA"],[,,"NA","NA"],"CF",236,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CG:[,[,,"[028]\\d{8}","\\d{9}"],[,,"222[1-589]\\d{5}","\\d{9}",,,"222123456"],[,,"0[14-6]\\d{7}","\\d{9}",,,"061234567"],[,,"800\\d{6}","\\d{9}",,,"800123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"CG",242,"00",,,,,,,,[[,"(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[02]"],"","",0],[,"(\\d)(\\d{4})(\\d{4})","$1 $2 $3",
["8"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],CH:[,[,,"[2-9]\\d{8}|860\\d{9}","\\d{9}(?:\\d{3})?"],[,,"(?:2[12467]|3[1-4]|4[134]|5[256]|6[12]|[7-9]1)\\d{7}","\\d{9}",,,"212345678"],[,,"7[5-9]\\d{7}","\\d{9}",,,"781234567"],[,,"800\\d{6}","\\d{9}",,,"800123456"],[,,"90[016]\\d{6}","\\d{9}",,,"900123456"],[,,"84[0248]\\d{6}","\\d{9}",,,"840123456"],[,,"878\\d{6}","\\d{9}",,,"878123456"],[,,"NA","NA"],"CH",41,"00","0",,,"0",,,,[[,"([2-9]\\d)(\\d{3})(\\d{2})(\\d{2})",
"$1 $2 $3 $4",["[2-7]|[89]1"],"0$1","",0],[,"([89]\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["8[047]|90"],"0$1","",0],[,"(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4 $5",["860"],"0$1","",0]],,[,,"74[0248]\\d{6}","\\d{9}",,,"740123456"],,,[,,"NA","NA"],[,,"5[18]\\d{7}","\\d{9}",,,"581234567"],,,[,,"860\\d{9}","\\d{12}",,,"860123456789"]],CI:[,[,,"[02-7]\\d{7}","\\d{8}"],[,,"(?:2(?:0[023]|1[02357]|[23][045]|4[03-5])|3(?:0[06]|1[069]|[2-4][07]|5[09]|6[08]))\\d{5}","\\d{8}",,,"21234567"],[,,"(?:0[1-9]|4[0-24-9]|5[5-9]|6[015-79]|77)\\d{6}",
"\\d{8}",,,"01234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"CI",225,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],CK:[,[,,"[2-57]\\d{4}","\\d{5}"],[,,"(?:2\\d|3[13-7]|4[1-5])\\d{3}","\\d{5}",,,"21234"],[,,"(?:5[0-68]|7\\d)\\d{3}","\\d{5}",,,"71234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"CK",682,"00",,,,,,,,[[,"(\\d{2})(\\d{3})","$1 $2",,"",
"",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CL:[,[,,"(?:[2-9]|600|123)\\d{7,8}","\\d{6,11}"],[,,"(?:[23]2|41|58)\\d{7}|(?:3[3-5]|4[235]|5[1-357]|6[13-57]|7[1-35])\\d{6,7}","\\d{6,9}",,,"221234567"],[,,"9[5-9]\\d{7}","\\d{8,9}",,,"961234567"],[,,"800\\d{6}|1230\\d{7}","\\d{9,11}",,,"800123456"],[,,"NA","NA"],[,,"600\\d{7,8}","\\d{10,11}",,,"6001234567"],[,,"NA","NA"],[,,"44\\d{7}","\\d{9}",,,"441234567"],"CL",56,"(?:0|1(?:1[0-69]|2[0-57]|5[13-58]|69|7[0167]|8[018]))0","0",
,,"0|(1(?:1[0-69]|2[0-57]|5[13-58]|69|7[0167]|8[018]))",,,,[[,"(2)(\\d{3,4})(\\d{4})","$1 $2 $3",["2"],"($1)","$CC ($1)",0],[,"(\\d{2})(\\d{2,3})(\\d{4})","$1 $2 $3",["[357]|4[1-35]|6[13-57]"],"($1)","$CC ($1)",0],[,"(9)([5-9]\\d{3})(\\d{4})","$1 $2 $3",["9"],"0$1","",0],[,"(44)(\\d{3})(\\d{4})","$1 $2 $3",["44"],"0$1","",0],[,"([68]00)(\\d{3})(\\d{3,4})","$1 $2 $3",["60|8"],"$1","",0],[,"(600)(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3 $4",["60"],"$1","",0],[,"(1230)(\\d{3})(\\d{4})","$1 $2 $3",["1"],"$1",
"",0],[,"(\\d{4,5})","$1",["[1-9]"],"$1","",0]],[[,"(2)(\\d{3,4})(\\d{4})","$1 $2 $3",["2","2"],"($1)","$CC ($1)",0],[,"(\\d{2})(\\d{2,3})(\\d{4})","$1 $2 $3",["[357]|4[1-35]|6[13-57]","[357]|4[1-35]|6[13-57]"],"($1)","$CC ($1)",0],[,"(9)([5-9]\\d{3})(\\d{4})","$1 $2 $3",["9","9"],"0$1","",0],[,"(44)(\\d{3})(\\d{4})","$1 $2 $3",["44","44"],"0$1","",0],[,"([68]00)(\\d{3})(\\d{3,4})","$1 $2 $3",["60|8","60|8"],"$1","",0],[,"(600)(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3 $4",["60","60"],"$1","",0],[,"(1230)(\\d{3})(\\d{4})",
"$1 $2 $3",["1","1"],"$1","",0]],[,,"NA","NA"],,,[,,"600\\d{7,8}","\\d{10,11}",,,"6001234567"],[,,"NA","NA"],,,[,,"NA","NA"]],CM:[,[,,"[2357-9]\\d{7}","\\d{8}"],[,,"(?:22|33)\\d{6}","\\d{8}",,,"22123456"],[,,"[579]\\d{7}","\\d{8}",,,"71234567"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"88\\d{6}","\\d{8}",,,"88012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"CM",237,"00",,,,,,,,[[,"([2357-9]\\d)(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[23579]|88"],"","",0],[,"(800)(\\d{2})(\\d{3})","$1 $2 $3",
["80"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CN:[,[,,"1(?:00\\d{2}|\\d{6,11})|[2-7]\\d{6,11}|8[0-357-9]\\d{6,9}|9(?:5\\d{3,4}|\\d{9})","\\d{4,12}"],[,,"21(?:100\\d{2}|95\\d{3,4}|\\d{8,10})|(?:10|2[02-57-9]|3(?:11|7[179])|4(?:[15]1|3[12])|5(?:1\\d|2[37]|3[12]|51|7[13-79]|9[15])|7(?:31|5[457]|6[09]|91)|8(?:71|98))(?:100\\d{2}|95\\d{3,4}|\\d{8})|(?:3(?:1[02-9]|35|49|5\\d|7[02-68]|9[1-68])|4(?:1[02-9]|2[179]|3[3-9]|5[2-9]|6[4789]|7\\d|8[23])|5(?:3[03-9]|4[36]|5[02-9]|6[1-46]|7[028]|80|9[2-46-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[17]\\d|2[248]|3[04-9]|4[3-6]|5[0-3689]|6[2368]|9[02-9])|8(?:1[236-8]|2[5-7]|3\\d|5[1-9]|7[02-9]|8[3678]|9[1-7])|9(?:0[1-3689]|1[1-79]|[379]\\d|4[13]|5[1-5]))(?:100\\d{2}|95\\d{3,4}|\\d{7})|80(?:29|6[03578]|7[018]|81)\\d{4}",
"\\d{4,12}",,,"1012345678"],[,,"1(?:3\\d|4[57]|[58][0-35-9])\\d{8}","\\d{11}",,,"13123456789"],[,,"(?:10)?800\\d{7}","\\d{10,12}",,,"8001234567"],[,,"16[08]\\d{5}","\\d{8}",,,"16812345"],[,,"400\\d{7}|95\\d{3,4}","\\d{5,10}",,,"4001234567"],[,,"NA","NA"],[,,"NA","NA"],"CN",86,"(1[1279]\\d{3})?00","0",,,"(1[1279]\\d{3})|0",,"00",,[[,"(80\\d{2})(\\d{4})","$1 $2",["80[2678]"],"0$1","$CC $1",1],[,"([48]00)(\\d{3})(\\d{4})","$1 $2 $3",["[48]00"],"","",0],[,"(\\d{5,6})","$1",["100|95"],"","",0],[,"(\\d{2})(\\d{5,6})",
"$1 $2",["(?:10|2\\d)[19]","(?:10|2\\d)(?:10|95)","(?:10|2\\d)(?:100|95)"],"0$1","$CC $1",0],[,"(\\d{3})(\\d{5,6})","$1 $2",["[3-9]","[3-9]\\d{2}[19]","[3-9]\\d{2}(?:10|95)"],"0$1","$CC $1",0],[,"(\\d{3,4})(\\d{4})","$1 $2",["[2-9]"],"","",0],[,"(21)(\\d{4})(\\d{4,6})","$1 $2 $3",["21"],"0$1","$CC $1",1],[,"([12]\\d)(\\d{4})(\\d{4})","$1 $2 $3",["10[1-9]|2[02-9]","10[1-9]|2[02-9]","10(?:[1-79]|8(?:[1-9]|0[1-9]))|2[02-9]"],"0$1","$CC $1",1],[,"(\\d{3})(\\d{4})(\\d{4})","$1 $2 $3",["3(?:11|7[179])|4(?:[15]1|3[12])|5(?:1|2[37]|3[12]|51|7[13-79]|9[15])|7(?:31|5[457]|6[09]|91)|8(?:71|98)"],
"0$1","$CC $1",1],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["3(?:1[02-9]|35|49|5|7[02-68]|9[1-68])|4(?:1[02-9]|2[179]|[35][2-9]|6[4789]|7\\d|8[23])|5(?:3[03-9]|4[36]|5[02-9]|6[1-46]|7[028]|80|9[2-46-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[04-9]|4[3-6]|6[2368])|8(?:1[236-8]|2[5-7]|3|5[1-9]|7[02-9]|8[3678]|9[1-7])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])"],"0$1","$CC $1",1],[,"(1[3-58]\\d)(\\d{4})(\\d{4})","$1 $2 $3",["1[3-58]"],"","$CC $1",0],[,"(10800)(\\d{3})(\\d{4})","$1 $2 $3",["108",
"1080","10800"],"","",0]],[[,"(80\\d{2})(\\d{4})","$1 $2",["80[2678]","80[2678]"],"0$1","$CC $1",1],[,"([48]00)(\\d{3})(\\d{4})","$1 $2 $3",["[48]00","[48]00"],"","",0],[,"(\\d{2})(\\d{5,6})","$1 $2","(?:10|2\\d)[19] (?:10|2\\d)(?:10|95) (?:10|2\\d)(?:100|95) (?:10|2\\d)[19] (?:10|2\\d)(?:10|95) (?:10|2\\d)(?:100|95)".split(" "),"0$1","$CC $1",0],[,"(\\d{3})(\\d{5,6})","$1 $2","[3-9] [3-9]\\d{2}[19] [3-9]\\d{2}(?:10|95) [3-9] [3-9]\\d{2}[19] [3-9]\\d{2}(?:10|95)".split(" "),"0$1","$CC $1",0],[,"(21)(\\d{4})(\\d{4,6})",
"$1 $2 $3",["21","21"],"0$1","$CC $1",1],[,"([12]\\d)(\\d{4})(\\d{4})","$1 $2 $3","10[1-9]|2[02-9] 10[1-9]|2[02-9] 10(?:[1-79]|8(?:[1-9]|0[1-9]))|2[02-9] 10[1-9]|2[02-9] 10[1-9]|2[02-9] 10(?:[1-79]|8(?:[1-9]|0[1-9]))|2[02-9]".split(" "),"0$1","$CC $1",1],[,"(\\d{3})(\\d{4})(\\d{4})","$1 $2 $3",["3(?:11|7[179])|4(?:[15]1|3[12])|5(?:1|2[37]|3[12]|51|7[13-79]|9[15])|7(?:31|5[457]|6[09]|91)|8(?:71|98)","3(?:11|7[179])|4(?:[15]1|3[12])|5(?:1|2[37]|3[12]|51|7[13-79]|9[15])|7(?:31|5[457]|6[09]|91)|8(?:71|98)"],
"0$1","$CC $1",1],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["3(?:1[02-9]|35|49|5|7[02-68]|9[1-68])|4(?:1[02-9]|2[179]|[35][2-9]|6[4789]|7\\d|8[23])|5(?:3[03-9]|4[36]|5[02-9]|6[1-46]|7[028]|80|9[2-46-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[04-9]|4[3-6]|6[2368])|8(?:1[236-8]|2[5-7]|3|5[1-9]|7[02-9]|8[3678]|9[1-7])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])","3(?:1[02-9]|35|49|5|7[02-68]|9[1-68])|4(?:1[02-9]|2[179]|[35][2-9]|6[4789]|7\\d|8[23])|5(?:3[03-9]|4[36]|5[02-9]|6[1-46]|7[028]|80|9[2-46-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[04-9]|4[3-6]|6[2368])|8(?:1[236-8]|2[5-7]|3|5[1-9]|7[02-9]|8[3678]|9[1-7])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])"],
"0$1","$CC $1",1],[,"(1[3-58]\\d)(\\d{4})(\\d{4})","$1 $2 $3",["1[3-58]","1[3-58]"],"","$CC $1",0],[,"(10800)(\\d{3})(\\d{4})","$1 $2 $3","108 1080 10800 108 1080 10800".split(" "),"","",0]],[,,"NA","NA"],,,[,,"100\\d{2}|(?:4|(?:10)?8)00\\d{7}|95\\d{3,4}","\\d{5,12}",,,"4001234567"],[,,"100\\d{2}","\\d{5}",,,"10000"],,,[,,"NA","NA"]],CO:[,[,,"(?:[13]\\d{0,3}|[24-8])\\d{7}","\\d{7,11}"],[,,"[124-8][2-9]\\d{6}","\\d{8}",,,"12345678"],[,,"3(?:0[0-5]|1\\d|[25][01])\\d{7}","\\d{10}",,,"3211234567"],[,
,"1800\\d{7}","\\d{11}",,,"18001234567"],[,,"19(?:0[01]|4[78])\\d{7}","\\d{11}",,,"19001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"CO",57,"00(?:4(?:[14]4|56)|[579])","0",,,"0([3579]|4(?:44|56))?",,,,[[,"(\\d)(\\d{7})","$1 $2",["1(?:8[2-9]|9[0-3]|[2-7])|[24-8]","1(?:8[2-9]|9(?:09|[1-3])|[2-7])|[24-8]"],"($1)","0$CC $1",0],[,"(\\d{3})(\\d{7})","$1 $2",["3"],"","0$CC $1",0],[,"(1)(\\d{3})(\\d{7})","$1-$2-$3",["1(?:80|9[04])","1(?:800|9(?:0[01]|4[78]))"],"0$1","",0]],[[,"(\\d)(\\d{7})","$1 $2",
["1(?:8[2-9]|9[0-3]|[2-7])|[24-8]","1(?:8[2-9]|9(?:09|[1-3])|[2-7])|[24-8]","1(?:8[2-9]|9[0-3]|[2-7])|[24-8]","1(?:8[2-9]|9(?:09|[1-3])|[2-7])|[24-8]"],"($1)","0$CC $1",0],[,"(\\d{3})(\\d{7})","$1 $2",["3","3"],"","0$CC $1",0],[,"(1)(\\d{3})(\\d{7})","$1 $2 $3",["1(?:80|9[04])","1(?:800|9(?:0[01]|4[78]))"]]],[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CR:[,[,,"[24-9]\\d{7,9}","\\d{8,10}"],[,,"2[24-7]\\d{6}","\\d{8}",,,"22123456"],[,,"5(?:0[0-4]|7[01])\\d{5}|[67][0-2]\\d{6}|8[3-9]\\d{6}",
"\\d{8}",,,"83123456"],[,,"800\\d{7}","\\d{10}",,,"8001234567"],[,,"90[059]\\d{7}","\\d{10}",,,"9001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"210[0-6]\\d{4}|4(?:0(?:[04]0\\d{4}|10[0-3]\\d{3}|2900\\d{2}|3[01]\\d{4}|5\\d{5}|70[01]\\d{3}|8[0-2]\\d{4})|1[01]\\d{5}|20[0-3]\\d{4}|400\\d{4}|70[0-2]\\d{4})|5100\\d{4}","\\d{8}",,,"40001234"],"CR",506,"00",,,,"(19(?:0[01468]|19|20|66|77))",,,,[[,"(\\d{4})(\\d{4})","$1 $2",["[24-7]|8[3-9]"],"","$CC $1",0],[,"(\\d{3})(\\d{3})(\\d{4})","$1-$2-$3",["[89]0"],"",
"$CC $1",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CU:[,[,,"[2-57]\\d{5,7}","\\d{4,8}"],[,,"2[1-4]\\d{5,6}|3(?:1\\d{6}|[23]\\d{4,6})|4(?:[125]\\d{5,6}|[36]\\d{6}|[78]\\d{4,6})|7\\d{6,7}","\\d{4,8}",,,"71234567"],[,,"5\\d{7}","\\d{8}",,,"51234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"CU",53,"119","0",,,"0",,,,[[,"(\\d)(\\d{6,7})","$1 $2",["7"],"(0$1)","",0],[,"(\\d{2})(\\d{4,6})","$1 $2",["[2-4]"],"(0$1)","",0],[,"(\\d)(\\d{7})","$1 $2",["5"],
"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CV:[,[,,"[259]\\d{6}","\\d{7}"],[,,"2(?:2[1-7]|3[0-8]|4[12]|5[1256]|6\\d|7[1-3]|8[1-5])\\d{4}","\\d{7}",,,"2211234"],[,,"(?:9\\d|59)\\d{5}","\\d{7}",,,"9911234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"CV",238,"0",,,,,,,,[[,"(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CW:[,[,,"[169]\\d{6,7}","\\d{7,8}"],[,,"9(?:[48]\\d{2}|50\\d|7(?:2[0-24]|[34]\\d|6[35-7]|77|8[7-9]))\\d{4}",
"\\d{7,8}",,,"94151234"],[,,"9(?:5(?:[1246]\\d|3[01])|6(?:[16-9]\\d|3[01]))\\d{4}","\\d{7,8}",,,"95181234"],[,,"NA","NA"],[,,"NA","NA"],[,,"(?:10|69)\\d{5}","\\d{7}",,,"1011234"],[,,"NA","NA"],[,,"NA","NA"],"CW",599,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",["[13-7]"],"","",0],[,"(9)(\\d{3})(\\d{4})","$1 $2 $3",["9"],"","",0]],,[,,"955\\d{5}","\\d{7,8}",,,"95581234"],1,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CX:[,[,,"[1458]\\d{5,9}","\\d{6,10}"],[,,"89164\\d{4}","\\d{8,9}",,,"891641234"],[,
,"4(?:[0-2]\\d|3[0-57-9]|4[47-9]|5[0-37-9]|6[6-9]|7[07-9]|8[7-9])\\d{6}","\\d{9}",,,"412345678"],[,,"1(?:80(?:0\\d{2})?|3(?:00\\d{2})?)\\d{4}","\\d{6,10}",,,"1800123456"],[,,"190[0126]\\d{6}","\\d{10}",,,"1900123456"],[,,"NA","NA"],[,,"500\\d{6}","\\d{9}",,,"500123456"],[,,"550\\d{6}","\\d{9}",,,"550123456"],"CX",61,"(?:14(?:1[14]|34|4[17]|[56]6|7[47]|88))?001[14-689]","0",,,"0",,"0011",,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],CY:[,[,,"[257-9]\\d{7}","\\d{8}"],[,,"2[2-6]\\d{6}",
"\\d{8}",,,"22345678"],[,,"9[5-79]\\d{6}","\\d{8}",,,"96123456"],[,,"800\\d{5}","\\d{8}",,,"80001234"],[,,"90[09]\\d{5}","\\d{8}",,,"90012345"],[,,"80[1-9]\\d{5}","\\d{8}",,,"80112345"],[,,"700\\d{5}","\\d{8}",,,"70012345"],[,,"NA","NA"],"CY",357,"00",,,,,,,,[[,"(\\d{2})(\\d{6})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"(?:50|77)\\d{6}","\\d{8}",,,"77123456"],,,[,,"NA","NA"]],CZ:[,[,,"[2-8]\\d{8}|9\\d{8,11}","\\d{9,12}"],[,,"2\\d{8}|(?:3[1257-9]|4[16-9]|5[13-9])\\d{7}","\\d{9,12}",,,
"212345678"],[,,"(?:60[1-8]|7(?:0[2-5]|[2379]\\d))\\d{6}","\\d{9,12}",,,"601123456"],[,,"800\\d{6}","\\d{9,12}",,,"800123456"],[,,"9(?:0[05689]|76)\\d{6}","\\d{9,12}",,,"900123456"],[,,"8[134]\\d{7}","\\d{9,12}",,,"811234567"],[,,"70[01]\\d{6}","\\d{9,12}",,,"700123456"],[,,"9[17]0\\d{6}","\\d{9,12}",,,"910123456"],"CZ",420,"00",,,,,,,,[[,"([2-9]\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[2-8]|9[015-7]"],"","",0],[,"(96\\d)(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3 $4",["96"],"","",0],[,"(9\\d)(\\d{3})(\\d{3})(\\d{3})",
"$1 $2 $3 $4",["9[36]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"9(?:5\\d|7[234])\\d{6}","\\d{9,12}",,,"972123456"],,,[,,"9(?:3\\d{9}|6\\d{7,10})","\\d{9,12}",,,"93123456789"]],DE:[,[,,"[1-35-9]\\d{3,14}|4(?:[0-8]\\d{4,12}|9(?:[0-37]\\d|4(?:[1-35-8]|4\\d?)|5\\d{1,2}|6[1-8]\\d?)\\d{2,7})","\\d{2,15}"],[,,"[246]\\d{5,13}|3(?:0\\d{3,13}|2\\d{9}|[3-9]\\d{4,13})|5(?:0[2-8]|[1256]\\d|[38][0-8]|4\\d{0,2}|[79][0-7])\\d{3,11}|7(?:0[2-8]|[1-9]\\d)\\d{3,10}|8(?:0[2-9]|[1-9]\\d)\\d{3,10}|9(?:0[6-9]\\d{3,10}|1\\d{4,12}|[2-9]\\d{4,11})",
"\\d{2,15}",,,"30123456"],[,,"1(?:5[0-2579]\\d{8}|6[023]\\d{7,8}|7(?:[0-57-9]\\d?|6\\d)\\d{7})","\\d{10,11}",,,"15123456789"],[,,"800\\d{7,12}","\\d{10,15}",,,"8001234567890"],[,,"900(?:[135]\\d{6}|9\\d{7})","\\d{10,11}",,,"9001234567"],[,,"180\\d{5,11}","\\d{8,14}",,,"18012345"],[,,"700\\d{8}","\\d{11}",,,"70012345678"],[,,"NA","NA"],"DE",49,"00","0",,,"0",,,,[[,"(1\\d{2})(\\d{7,8})","$1 $2",["1[67]"],"0$1","",0],[,"(1\\d{3})(\\d{7})","$1 $2",["15"],"0$1","",0],[,"(\\d{2})(\\d{3,11})","$1 $2",["3[02]|40|[68]9"],
"0$1","",0],[,"(\\d{3})(\\d{3,11})","$1 $2",["2(?:\\d1|0[2389]|1[24]|28|34)|3(?:[3-9][15]|40)|[4-8][1-9]1|9(?:06|[1-9]1)"],"0$1","",0],[,"(\\d{4})(\\d{2,11})","$1 $2",["[24-6]|[7-9](?:\\d[1-9]|[1-9]\\d)|3(?:[3569][02-46-9]|4[2-4679]|7[2-467]|8[2-46-8])","[24-6]|[7-9](?:\\d[1-9]|[1-9]\\d)|3(?:3(?:0[1-467]|2[127-9]|3[124578]|[46][1246]|7[1257-9]|8[1256]|9[145])|4(?:2[135]|3[1357]|4[13578]|6[1246]|7[1356]|9[1346])|5(?:0[14]|2[1-3589]|3[1357]|4[1246]|6[1-4]|7[1346]|8[13568]|9[1246])|6(?:0[356]|2[1-489]|3[124-6]|4[1347]|6[13]|7[12579]|8[1-356]|9[135])|7(?:2[1-7]|3[1357]|4[145]|6[1-5]|7[1-4])|8(?:21|3[1468]|4[1347]|6[0135-9]|7[1467]|8[136])|9(?:0[12479]|2[1358]|3[1357]|4[134679]|6[1-9]|7[136]|8[147]|9[1468]))"],
"0$1","",0],[,"(3\\d{4})(\\d{1,10})","$1 $2",["3"],"0$1","",0],[,"(800)(\\d{7,12})","$1 $2",["800"],"0$1","",0],[,"(177)(99)(\\d{7,8})","$1 $2 $3",["177","1779","17799"],"0$1","",0],[,"(\\d{3})(\\d)(\\d{4,10})","$1 $2 $3",["(?:18|90)0","180|900[1359]"],"0$1","",0],[,"(1\\d{2})(\\d{5,11})","$1 $2",["181"],"0$1","",0],[,"(18\\d{3})(\\d{6})","$1 $2",["185","1850","18500"],"0$1","",0],[,"(18\\d{2})(\\d{7})","$1 $2",["18[68]"],"0$1","",0],[,"(18\\d)(\\d{8})","$1 $2",["18[2-579]"],"0$1","",0],[,"(700)(\\d{4})(\\d{4})",
"$1 $2 $3",["700"],"0$1","",0]],,[,,"16(?:4\\d{1,10}|[89]\\d{1,11})","\\d{4,14}",,,"16412345"],,,[,,"NA","NA"],[,,"18(?:1\\d{5,11}|[2-9]\\d{8})","\\d{8,14}",,,"18500123456"],,,[,,"17799\\d{7,8}","\\d{12,13}",,,"177991234567"]],DJ:[,[,,"[27]\\d{7}","\\d{8}"],[,,"2(?:1[2-5]|7[45])\\d{5}","\\d{8}",,,"21360003"],[,,"77[6-8]\\d{5}","\\d{8}",,,"77831001"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"DJ",253,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"","",
0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],DK:[,[,,"[2-9]\\d{7}","\\d{8}"],[,,"(?:[2-7]\\d|8[126-9]|9[126-9])\\d{6}","\\d{8}",,,"32123456"],[,,"(?:[2-7]\\d|8[126-9]|9[126-9])\\d{6}","\\d{8}",,,"20123456"],[,,"80\\d{6}","\\d{8}",,,"80123456"],[,,"90\\d{6}","\\d{8}",,,"90123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"DK",45,"00",,,,,,,1,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],DM:[,[,,"[57-9]\\d{9}",
"\\d{7}(?:\\d{3})?"],[,,"767(?:2(?:55|66)|4(?:2[01]|4[0-25-9])|50[0-4])\\d{4}","\\d{7}(?:\\d{3})?",,,"7674201234"],[,,"767(?:2(?:[234689]5|7[5-7])|31[5-7]|61[2-7])\\d{4}","\\d{10}",,,"7672251234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"DM",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"767",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],DO:[,[,,"[589]\\d{9}",
"\\d{7}(?:\\d{3})?"],[,,"8(?:[04]9[2-9]\\d{6}|29(?:2(?:[0-59]\\d|6[04-9]|7[0-27]|8[0237-9])|3(?:[0-35-9]\\d|4[7-9])|[45]\\d{2}|6(?:[0-27-9]\\d|[3-5][1-9]|6[0135-8])|7(?:0[013-9]|[1-37]\\d|4[1-35689]|5[1-4689]|6[1-57-9]|8[1-79]|9[1-8])|8(?:0[146-9]|1[0-48]|[248]\\d|3[1-79]|5[01589]|6[013-68]|7[124-8]|9[0-8])|9(?:[0-24]\\d|3[02-46-9]|5[0-79]|60|7[0169]|8[57-9]|9[02-9]))\\d{4})","\\d{7}(?:\\d{3})?",,,"8092345678"],[,,"8[024]9[2-9]\\d{6}","\\d{7}(?:\\d{3})?",,,"8092345678"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}",
"\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"DO",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"8[024]9",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],DZ:[,[,,"(?:[1-4]|[5-9]\\d)\\d{7}","\\d{8,9}"],[,,"(?:1\\d|2[014-79]|3[0-8]|4[0135689])\\d{6}|9619\\d{5}","\\d{8,9}",,,"12345678"],[,,"(?:5[4-6]|7[7-9])\\d{7}|6(?:[569]\\d|70)\\d{6}","\\d{9}",,,"551234567"],[,,"800\\d{6}","\\d{9}",,,"800123456"],[,
,"80[3-689]1\\d{5}","\\d{9}",,,"808123456"],[,,"80[12]1\\d{5}","\\d{9}",,,"801123456"],[,,"NA","NA"],[,,"98[23]\\d{6}","\\d{9}",,,"983123456"],"DZ",213,"00","0",,,"0",,,,[[,"([1-4]\\d)(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[1-4]"],"0$1","",0],[,"([5-8]\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[5-8]"],"0$1","",0],[,"(9\\d)(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["9"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],EC:[,[,,"1\\d{9,10}|[2-8]\\d{7}|9\\d{8}","\\d{7,11}"],
[,,"[2-7][2-7]\\d{6}","\\d{7,8}",,,"22123456"],[,,"9(?:39|[4-6][89]|7[7-9]|[89]\\d)\\d{6}","\\d{9}",,,"991234567"],[,,"1800\\d{6,7}","\\d{10,11}",,,"18001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"[2-7]890\\d{4}","\\d{8}",,,"28901234"],"EC",593,"00","0",,,"0",,,,[[,"(\\d)(\\d{3})(\\d{4})","$1 $2-$3",["[247]|[356][2-8]"],"(0$1)","",0],[,"(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["9"],"0$1","",0],[,"(1800)(\\d{3})(\\d{3,4})","$1 $2 $3",["1"],"$1","",0]],[[,"(\\d)(\\d{3})(\\d{4})","$1-$2-$3",
["[247]|[356][2-8]"]],[,"(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["9","9"],"0$1","",0],[,"(1800)(\\d{3})(\\d{3,4})","$1 $2 $3",["1","1"],"$1","",0]],[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],EE:[,[,,"1\\d{3,4}|[3-9]\\d{6,7}|800\\d{6,7}","\\d{4,10}"],[,,"(?:3[23589]|4(?:0\\d|[3-8])|6\\d|7[1-9]|88)\\d{5}","\\d{7,8}",,,"3212345"],[,,"(?:5\\d|8[1-5])\\d{6}|5(?:[02]\\d{2}|1(?:[0-8]\\d|95)|5[0-478]\\d|64[0-4]|65[1-589])\\d{3}","\\d{7,8}",,,"51234567"],[,,"800(?:0\\d{3}|1\\d|[2-9])\\d{3}",
"\\d{7,10}",,,"80012345"],[,,"900\\d{4}","\\d{7}",,,"9001234"],[,,"NA","NA"],[,,"70[0-2]\\d{5}","\\d{8}",,,"70012345"],[,,"NA","NA"],"EE",372,"00",,,,,,,,[[,"([3-79]\\d{2})(\\d{4})","$1 $2",["[369]|4[3-8]|5(?:[0-2]|5[0-478]|6[45])|7[1-9]","[369]|4[3-8]|5(?:[02]|1(?:[0-8]|95)|5[0-478]|6(?:4[0-4]|5[1-589]))|7[1-9]"],"","",0],[,"(70)(\\d{2})(\\d{4})","$1 $2 $3",["70"],"","",0],[,"(8000)(\\d{3})(\\d{3})","$1 $2 $3",["800","8000"],"","",0],[,"([458]\\d{3})(\\d{3,4})","$1 $2",["40|5|8(?:00|[1-5])","40|5|8(?:00[1-9]|[1-5])"],
"","",0]],,[,,"NA","NA"],,,[,,"1\\d{3,4}|800[2-9]\\d{3}","\\d{4,7}",,,"8002123"],[,,"1(?:2[01245]|3[0-6]|4[1-489]|5[0-59]|6[1-46-9]|7[0-27-9]|8[189]|9[012])\\d{1,2}","\\d{4,5}",,,"12123"],,,[,,"NA","NA"]],EG:[,[,,"1\\d{4,9}|[2456]\\d{8}|3\\d{7}|[89]\\d{8,9}","\\d{5,10}"],[,,"(?:1(3[23]\\d|5[23])|2[2-4]\\d{2}|3\\d{2}|4(?:0[2-5]|[578][23]|64)\\d|5(?:0[2-7]|[57][23])\\d|6[24-689]3\\d|8(?:2[2-57]|4[26]|6[237]|8[2-4])\\d|9(?:2[27]|3[24]|52|6[2356]|7[2-4])\\d)\\d{5}|1[69]\\d{3}","\\d{5,9}",,,"234567890"],
[,,"1(?:0[0-269]|1[0-245]|2[0-278])\\d{7}","\\d{10}",,,"1001234567"],[,,"800\\d{7}","\\d{10}",,,"8001234567"],[,,"900\\d{7}","\\d{10}",,,"9001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"EG",20,"00","0",,,"0",,,,[[,"(\\d)(\\d{7,8})","$1 $2",["[23]"],"0$1","",0],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["1[012]|[89]00"],"0$1","",0],[,"(\\d{2})(\\d{6,7})","$1 $2",["1(?:3|5[23])|[4-6]|[89][2-9]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],EH:[,[,,"[5689]\\d{8}",
"\\d{9}"],[,,"528[89]\\d{5}","\\d{9}",,,"528812345"],[,,"6(?:0[0-8]|[124-7]\\d|3[03-8]|8[01]|99)\\d{6}","\\d{9}",,,"650123456"],[,,"80\\d{7}","\\d{9}",,,"801234567"],[,,"89\\d{7}","\\d{9}",,,"891234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"EH",212,"00","0",,,"0",,,,,,[,,"NA","NA"],,"528[89]",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],ER:[,[,,"[178]\\d{6}","\\d{6,7}"],[,,"1(?:1[12568]|20|40|55|6[146])\\d{4}|8\\d{6}","\\d{6,7}",,,"8370362"],[,,"17[1-3]\\d{4}|7\\d{6}","\\d{7}",,,"7123456"],
[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"ER",291,"00","0",,,"0",,,,[[,"(\\d)(\\d{3})(\\d{3})","$1 $2 $3",,"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],ES:[,[,,"[5-9]\\d{8}","\\d{9}"],[,,"8(?:[13]0|[28][0-8]|[47][1-9]|5[01346-9]|6[0457-9])\\d{6}|9(?:[1238][0-8]\\d{6}|4[1-9]\\d{6}|5\\d{7}|6(?:[0-8]\\d{6}|9(?:0(?:[0-57-9]\\d{4}|6(?:0[0-8]|1[1-9]|[2-9]\\d)\\d{2})|[1-9]\\d{5}))|7(?:[124-9]\\d{2}|3(?:[0-8]\\d|9[1-9]))\\d{4})","\\d{9}",,,"810123456"],
[,,"(?:6\\d{6}|7[1-4]\\d{5}|9(?:6906(?:09|10)|7390\\d{2}))\\d{2}","\\d{9}",,,"612345678"],[,,"[89]00\\d{6}","\\d{9}",,,"800123456"],[,,"80[367]\\d{6}","\\d{9}",,,"803123456"],[,,"90[12]\\d{6}","\\d{9}",,,"901123456"],[,,"70\\d{7}","\\d{9}",,,"701234567"],[,,"NA","NA"],"ES",34,"00",,,,,,,,[[,"([5-9]\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[568]|[79][0-8]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"51\\d{7}","\\d{9}",,,"511234567"],,,[,,"NA","NA"]],ET:[,[,,"[1-59]\\d{8}","\\d{7,9}"],[,,"(?:11(?:1(?:1[124]|2[2-57]|3[1-5]|5[5-8]|8[6-8])|2(?:13|3[6-8]|5[89]|7[05-9]|8[2-6])|3(?:2[01]|3[0-289]|4[1289]|7[1-4]|87)|4(?:1[69]|3[2-49]|4[0-3]|6[5-8])|5(?:1[57]|44|5[0-4])|6(?:18|2[69]|4[5-7]|5[1-5]|6[0-59]|8[015-8]))|2(?:2(?:11[1-9]|22[0-7]|33\\d|44[1467]|66[1-68])|5(?:11[124-6]|33[2-8]|44[1467]|55[14]|66[1-3679]|77[124-79]|880))|3(?:3(?:11[0-46-8]|22[0-6]|33[0134689]|44[04]|55[0-6]|66[01467])|4(?:44[0-8]|55[0-69]|66[0-3]|77[1-5]))|4(?:6(?:22[0-24-7]|33[1-5]|44[13-69]|55[14-689]|660|88[1-4])|7(?:11[1-9]|22[1-9]|33[13-7]|44[13-6]|55[1-689]))|5(?:7(?:227|55[05]|(?:66|77)[14-8])|8(?:11[149]|22[013-79]|33[0-68]|44[013-8]|550|66[1-5]|77\\d)))\\d{4}",
"\\d{7,9}",,,"111112345"],[,,"9(?:[1-3]\\d|5[89])\\d{6}","\\d{9}",,,"911234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"ET",251,"00","0",,,"0",,,,[[,"([1-59]\\d)(\\d{3})(\\d{4})","$1 $2 $3",,"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],FI:[,[,,"1\\d{4,11}|[2-9]\\d{4,10}","\\d{5,12}"],[,,"1(?:[3569][1-8]\\d{3,9}|[47]\\d{5,10})|2[1-8]\\d{3,9}|3(?:[1-8]\\d{3,9}|9\\d{4,8})|[5689][1-8]\\d{3,9}","\\d{5,12}",,,"1312345678"],[,,"4\\d{5,10}|50\\d{4,8}",
"\\d{6,11}",,,"412345678"],[,,"800\\d{4,7}","\\d{7,10}",,,"8001234567"],[,,"[67]00\\d{5,6}","\\d{8,9}",,,"600123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"FI",358,"00|99[049]","0",,,"0",,,,[[,"(\\d{3})(\\d{3,7})","$1 $2",["(?:[1-3]00|[6-8]0)"],"0$1","",0],[,"(\\d{2})(\\d{4,10})","$1 $2",["[14]|2[09]|50|7[135]"],"0$1","",0],[,"(\\d)(\\d{4,11})","$1 $2",["[25689][1-8]|3"],"0$1","",0]],,[,,"NA","NA"],1,,[,,"[13]00\\d{3,7}|2(?:0(?:0\\d{3,7}|2[023]\\d{1,6}|9[89]\\d{1,6}))|60(?:[12]\\d{5,6}|6\\d{7})|7(?:1\\d{7}|3\\d{8}|5[03-9]\\d{2,7})",
"\\d{5,10}",,,"100123"],[,,"[13]0\\d{4,8}|2(?:0(?:[016-8]\\d{3,7}|[2-59]\\d{2,7})|9\\d{4,8})|60(?:[12]\\d{5,6}|6\\d{7})|7(?:1\\d{7}|3\\d{8}|5[03-9]\\d{2,7})","\\d{5,10}",,,"10112345"],,,[,,"NA","NA"]],FJ:[,[,,"[36-9]\\d{6}|0\\d{10}","\\d{7}(?:\\d{4})?"],[,,"(?:3[0-5]|6[25-7]|8[58])\\d{5}","\\d{7}",,,"3212345"],[,,"(?:7[0-467]|8[3467]|9\\d)\\d{5}","\\d{7}",,,"7012345"],[,,"0800\\d{7}","\\d{11}",,,"08001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"FJ",679,"0(?:0|52)",,,,,,"00",
,[[,"(\\d{3})(\\d{4})","$1 $2",["[36-9]"],"","",0],[,"(\\d{4})(\\d{3})(\\d{4})","$1 $2 $3",["0"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],FK:[,[,,"[2-7]\\d{4}","\\d{5}"],[,,"[2-47]\\d{4}","\\d{5}",,,"31234"],[,,"[56]\\d{4}","\\d{5}",,,"51234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"FK",500,"00",,,,,,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],FM:[,[,,"[39]\\d{6}","\\d{7}"],[,,"3[2357]0[1-9]\\d{3}|9[2-6]\\d{5}","\\d{7}",
,,"3201234"],[,,"3[2357]0[1-9]\\d{3}|9[2-7]\\d{5}","\\d{7}",,,"3501234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"FM",691,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],FO:[,[,,"[2-9]\\d{5}","\\d{6}"],[,,"(?:20|[3-4]\\d|8[19])\\d{4}","\\d{6}",,,"201234"],[,,"(?:2[1-9]|5\\d|7[1-79])\\d{4}","\\d{6}",,,"211234"],[,,"80[257-9]\\d{3}","\\d{6}",,,"802123"],[,,"90(?:[1345][15-7]|2[125-7]|99)\\d{2}","\\d{6}",
,,"901123"],[,,"NA","NA"],[,,"NA","NA"],[,,"(?:6[0-36]|88)\\d{4}","\\d{6}",,,"601234"],"FO",298,"00",,,,"(10(?:01|[12]0|88))",,,,[[,"(\\d{6})","$1",,"","$CC $1",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],FR:[,[,,"[1-9]\\d{8}","\\d{9}"],[,,"[1-5]\\d{8}","\\d{9}",,,"123456789"],[,,"6\\d{8}|7[5-9]\\d{7}","\\d{9}",,,"612345678"],[,,"80\\d{7}","\\d{9}",,,"801234567"],[,,"89[1-37-9]\\d{6}","\\d{9}",,,"891123456"],[,,"8(?:1[019]|2[0156]|84|90)\\d{6}","\\d{9}",,,"810123456"],[,,"NA",
"NA"],[,,"9\\d{8}","\\d{9}",,,"912345678"],"FR",33,"00","0",,,"0",,,,[[,"([1-79])(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4 $5",["[1-79]"],"0$1","",0],[,"(1\\d{2})(\\d{3})","$1 $2",["11"],"$1","",0],[,"(8\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["8"],"0 $1","",0]],[[,"([1-79])(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4 $5",["[1-79]","[1-79]"],"0$1","",0],[,"(8\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["8","8"],"0 $1","",0]],[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],
GA:[,[,,"0\\d{7}","\\d{8}"],[,,"01\\d{6}","\\d{8}",,,"01441234"],[,,"0[2-7]\\d{6}","\\d{8}",,,"06031234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"GA",241,"00",,,,,,,,[[,"(0\\d)(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],GB:[,[,,"\\d{7,10}","\\d{4,10}"],[,,"2(?:0[01378]|3[0189]|4[017]|8[0-46-9]|9[012])\\d{7}|1(?:(?:1(?:3[0-48]|[46][0-4]|5[012789]|7[0-49]|8[01349])|21[0-7]|31[0-8]|[459]1\\d|61[0-46-9]))\\d{6}|1(?:2(?:0[024-9]|2[3-9]|3[3-79]|4[1-689]|[58][02-9]|6[0-4789]|7[013-9]|9\\d)|3(?:0\\d|[25][02-9]|3[02-579]|[468][0-46-9]|7[1235679]|9[24578])|4(?:0[03-9]|[28][02-5789]|[37]\\d|4[02-69]|5[0-8]|[69][0-79])|5(?:0[1235-9]|2[024-9]|3[015689]|4[02-9]|5[03-9]|6\\d|7[0-35-9]|8[0-468]|9[0-5789])|6(?:0[034689]|2[0-35689]|[38][013-9]|4[1-467]|5[0-69]|6[13-9]|7[0-8]|9[0124578])|7(?:0[0246-9]|2\\d|3[023678]|4[03-9]|5[0-46-9]|6[013-9]|7[0-35-9]|8[024-9]|9[02-9])|8(?:0[35-9]|2[1-5789]|3[02-578]|4[0-578]|5[124-9]|6[2-69]|7\\d|8[02-9]|9[02569])|9(?:0[02-589]|2[02-689]|3[1-5789]|4[2-9]|5[0-579]|6[234789]|7[0124578]|8\\d|9[2-57]))\\d{6}|1(?:2(?:0(?:46[1-4]|87[2-9])|545[1-79]|76(?:2\\d|3[1-8]|6[1-6])|9(?:7(?:2[0-4]|3[2-5])|8(?:2[2-8]|7[0-4789]|8[345])))|3(?:638[2-5]|647[23]|8(?:47[04-9]|64[015789]))|4(?:044[1-7]|20(?:2[23]|8\\d)|6(?:0(?:30|5[2-57]|6[1-8]|7[2-8])|140)|8(?:052|87[123]))|5(?:24(?:3[2-79]|6\\d)|276\\d|6(?:26[06-9]|686))|6(?:06(?:4\\d|7[4-79])|295[567]|35[34]\\d|47(?:24|61)|59(?:5[08]|6[67]|74)|955[0-4])|7(?:26(?:6[13-9]|7[0-7])|442\\d|50(?:2[0-3]|[3-68]2|76))|8(?:27[56]\\d|37(?:5[2-5]|8[239])|84(?:3[2-58]))|9(?:0(?:0(?:6[1-8]|85)|52\\d)|3583|4(?:66[1-8]|9(?:2[01]|81))|63(?:23|3[1-4])|9561))\\d{3}|176888[234678]\\d{2}|16977[23]\\d{3}",
"\\d{4,10}",,,"1212345678"],[,,"7(?:[1-4]\\d\\d|5(?:0[0-8]|[13-9]\\d|2[0-35-9])|7(?:0[1-9]|[1-7]\\d|8[02-9]|9[0-689])|8(?:[014-9]\\d|[23][0-8])|9(?:[04-9]\\d|1[02-9]|2[0-35-9]|3[0-689]))\\d{6}","\\d{10}",,,"7400123456"],[,,"80(?:0(?:1111|\\d{6,7})|8\\d{7})|500\\d{6}","\\d{7}(?:\\d{2,3})?",,,"8001234567"],[,,"(?:87[123]|9(?:[01]\\d|8[2349]))\\d{7}","\\d{10}",,,"9012345678"],[,,"8(?:4(?:5464\\d|[2-5]\\d{7})|70\\d{7})","\\d{7}(?:\\d{3})?",,,"8431234567"],[,,"70\\d{8}","\\d{10}",,,"7012345678"],[,,"56\\d{8}",
"\\d{10}",,,"5612345678"],"GB",44,"00","0"," x",,"0",,,,[[,"(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["2|5[56]|7(?:0|6[013-9])","2|5[56]|7(?:0|6(?:[013-9]|2[0-35-9]))"],"0$1","",0],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["1(?:1|\\d1)|3|9[018]"],"0$1","",0],[,"(\\d{5})(\\d{4,5})","$1 $2",["1(?:38|5[23]|69|76|94)","1(?:387|5(?:24|39)|697|768|946)","1(?:3873|5(?:242|39[456])|697[347]|768[347]|9467)"],"0$1","",0],[,"(1\\d{3})(\\d{5,6})","$1 $2",["1"],"0$1","",0],[,"(7\\d{3})(\\d{6})","$1 $2",["7(?:[1-5789]|62)",
"7(?:[1-5789]|624)"],"0$1","",0],[,"(800)(\\d{4})","$1 $2",["800","8001","80011","800111","8001111"],"0$1","",0],[,"(845)(46)(4\\d)","$1 $2 $3",["845","8454","84546","845464"],"0$1","",0],[,"(8\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["8(?:4[2-5]|7[0-3])"],"0$1","",0],[,"(80\\d)(\\d{3})(\\d{4})","$1 $2 $3",["80"],"0$1","",0],[,"([58]00)(\\d{6})","$1 $2",["[58]00"],"0$1","",0]],,[,,"76(?:0[012]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}","\\d{10}",,,"7640123456"],1,,[,,"NA","NA"],[,,"(?:3[0347]|55)\\d{8}",
"\\d{10}",,,"5512345678"],,,[,,"NA","NA"]],GD:[,[,,"[4589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"473(?:2(?:3[0-2]|69)|3(?:2[89]|86)|4(?:[06]8|3[5-9]|4[0-49]|5[5-79]|68|73|90)|63[68]|7(?:58|84)|938)\\d{4}","\\d{7}(?:\\d{3})?",,,"4732691234"],[,,"473(?:4(?:0[3-79]|1[04-9]|20|58)|53[3-8])\\d{4}","\\d{10}",,,"4734031234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],
"GD",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"473",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],GE:[,[,,"[34578]\\d{8}","\\d{6,9}"],[,,"(?:3(?:[256]\\d|4[124-9]|7[0-4])|4(?:1\\d|2[2-7]|3[1-79]|4[2-8]|7[239]|9[1-7]))\\d{6}","\\d{6,9}",,,"322123456"],[,,"5(?:14|5[01578]|68|7[0147-9]|9[0-35-9])\\d{6}","\\d{9}",,,"555123456"],[,,"800\\d{6}","\\d{9}",,,"800123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"706\\d{6}","\\d{9}",,,"706123456"],"GE",995,"00","0",,,"0",,,,[[,"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
"$1 $2 $3 $4",["[348]"],"0$1","",0],[,"(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["7"],"0$1","",0],[,"(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["5"],"$1","",0]],,[,,"NA","NA"],,,[,,"706\\d{6}","\\d{9}",,,"706123456"],[,,"NA","NA"],,,[,,"NA","NA"]],GF:[,[,,"[56]\\d{8}","\\d{9}"],[,,"594(?:10|2[012457-9]|3[0-57-9]|4[3-9]|5[7-9]|6[0-3]|9[014])\\d{4}","\\d{9}",,,"594101234"],[,,"694(?:[04][0-7]|1[0-5]|3[018]|[29]\\d)\\d{4}","\\d{9}",,,"694201234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],
[,,"NA","NA"],"GF",594,"00","0",,,"0",,,,[[,"(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],GG:[,[,,"[135789]\\d{6,9}","\\d{6,10}"],[,,"1481\\d{6}","\\d{6,10}",,,"1481456789"],[,,"7(?:781|839|911)\\d{6}","\\d{10}",,,"7781123456"],[,,"80(?:0(?:1111|\\d{6,7})|8\\d{7})|500\\d{6}","\\d{7}(?:\\d{2,3})?",,,"8001234567"],[,,"(?:87[123]|9(?:[01]\\d|8[0-3]))\\d{7}","\\d{10}",,,"9012345678"],[,,"8(?:4(?:5464\\d|[2-5]\\d{7})|70\\d{7})",
"\\d{7}(?:\\d{3})?",,,"8431234567"],[,,"70\\d{8}","\\d{10}",,,"7012345678"],[,,"56\\d{8}","\\d{10}",,,"5612345678"],"GG",44,"00","0"," x",,"0",,,,,,[,,"76(?:0[012]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}","\\d{10}",,,"7640123456"],,,[,,"NA","NA"],[,,"(?:3[0347]|55)\\d{8}","\\d{10}",,,"5512345678"],,,[,,"NA","NA"]],GH:[,[,,"[235]\\d{8}|8\\d{7}","\\d{7,9}"],[,,"3(?:0[237]\\d|[167](?:2[0-6]|7\\d)|2(?:2[0-5]|7\\d)|3(?:2[0-3]|7\\d)|4(?:2[013-9]|3[01]|7\\d)|5(?:2[0-7]|7\\d)|8(?:2[0-2]|7\\d)|9(?:20|7\\d))\\d{5}",
"\\d{7,9}",,,"302345678"],[,,"(?:2[034678]|5[047])\\d{7}","\\d{9}",,,"231234567"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"GH",233,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[235]"],"0$1","",0],[,"(\\d{3})(\\d{5})","$1 $2",["8"],"0$1","",0]],,[,,"NA","NA"],,,[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"NA","NA"],,,[,,"NA","NA"]],GI:[,[,,"[2568]\\d{7}","\\d{8}"],[,,"2(?:00\\d|1(?:6[24-7]|9\\d)|2(?:00|2[2457]))\\d{4}","\\d{8}",,,"20012345"],
[,,"(?:5[46-8]|62)\\d{6}","\\d{8}",,,"57123456"],[,,"80\\d{6}","\\d{8}",,,"80123456"],[,,"8[1-689]\\d{6}","\\d{8}",,,"88123456"],[,,"87\\d{6}","\\d{8}",,,"87123456"],[,,"NA","NA"],[,,"NA","NA"],"GI",350,"00",,,,,,,,[[,"(\\d{3})(\\d{5})","$1 $2",["2"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],GL:[,[,,"[1-689]\\d{5}","\\d{6}"],[,,"(?:19|3[1-6]|6[14689]|8[14-79]|9\\d)\\d{4}","\\d{6}",,,"321000"],[,,"[245][2-9]\\d{4}","\\d{6}",,,"221234"],[,,"80\\d{4}","\\d{6}",,,"801234"],
[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"3[89]\\d{4}","\\d{6}",,,"381234"],"GL",299,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],GM:[,[,,"[2-9]\\d{6}","\\d{7}"],[,,"(?:4(?:[23]\\d{2}|4(?:1[024679]|[6-9]\\d))|5(?:54[0-7]|6(?:[67]\\d)|7(?:1[04]|2[035]|3[58]|48))|8\\d{3})\\d{3}","\\d{7}",,,"5661234"],[,,"(?:2[0-6]|[3679]\\d)\\d{5}","\\d{7}",,,"3012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA",
"NA"],"GM",220,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],GN:[,[,,"[367]\\d{7,8}","\\d{8,9}"],[,,"30(?:24|3[12]|4[1-35-7]|5[13]|6[189]|[78]1|9[1478])\\d{4}","\\d{8}",,,"30241234"],[,,"6[02356]\\d{7}","\\d{9}",,,"601123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"722\\d{6}","\\d{9}",,,"722123456"],"GN",224,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["3"],"","",0],[,"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
"$1 $2 $3 $4",["[67]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],GP:[,[,,"[56]\\d{8}","\\d{9}"],[,,"590(?:0[13468]|1[012]|2[0-68]|3[28]|4[0-8]|5[579]|6[0189]|70|8[0-689]|9\\d)\\d{4}","\\d{9}",,,"590201234"],[,,"690(?:0[0-7]|[1-9]\\d)\\d{4}","\\d{9}",,,"690301234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"GP",590,"00","0",,,"0",,,,[[,"([56]90)(\\d{2})(\\d{4})","$1 $2-$3",,"0$1","",0]],,[,,"NA","NA"],1,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA",
"NA"]],GQ:[,[,,"[23589]\\d{8}","\\d{9}"],[,,"3(?:3(?:3\\d[7-9]|[0-24-9]\\d[46])|5\\d{2}[7-9])\\d{4}","\\d{9}",,,"333091234"],[,,"(?:222|551)\\d{6}","\\d{9}",,,"222123456"],[,,"80\\d[1-9]\\d{5}","\\d{9}",,,"800123456"],[,,"90\\d[1-9]\\d{5}","\\d{9}",,,"900123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"GQ",240,"00",,,,,,,,[[,"(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[235]"],"","",0],[,"(\\d{3})(\\d{6})","$1 $2",["[89]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],GR:[,
[,,"[26-9]\\d{9}","\\d{10}"],[,,"2(?:1\\d{2}|2(?:3[1-8]|4[1-7]|5[1-4]|6[1-8]|7[1-5]|[289][1-9])|3(?:1\\d|2[1-57]|3[1-4]|[45][1-3]|7[1-7]|8[1-6]|9[1-79])|4(?:1\\d|2[1-8]|3[1-4]|4[13-5]|6[1-578]|9[1-5])|5(?:1\\d|[239][1-4]|4[124]|5[1-6])|6(?:1\\d|3[124]|4[1-7]|5[13-9]|[269][1-6]|7[14]|8[1-5])|7(?:1\\d|2[1-5]|3[1-6]|4[1-7]|5[1-57]|6[134]|9[15-7])|8(?:1\\d|2[1-5]|[34][1-4]|9[1-7]))\\d{6}","\\d{10}",,,"2123456789"],[,,"69\\d{8}","\\d{10}",,,"6912345678"],[,,"800\\d{7}","\\d{10}",,,"8001234567"],[,,"90[19]\\d{7}",
"\\d{10}",,,"9091234567"],[,,"8(?:0[16]|12|25)\\d{7}","\\d{10}",,,"8011234567"],[,,"70\\d{8}","\\d{10}",,,"7012345678"],[,,"NA","NA"],"GR",30,"00",,,,,,,,[[,"([27]\\d)(\\d{4})(\\d{4})","$1 $2 $3",["21|7"],"","",0],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["2[2-9]1|[689]"],"","",0],[,"(2\\d{3})(\\d{6})","$1 $2",["2[2-9][02-9]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],GT:[,[,,"[2-7]\\d{7}|1[89]\\d{9}","\\d{8}(?:\\d{3})?"],[,,"[267][2-9]\\d{6}","\\d{8}",,,"22456789"],[,
,"[345]\\d{7}","\\d{8}",,,"51234567"],[,,"18[01]\\d{8}","\\d{11}",,,"18001112222"],[,,"19\\d{9}","\\d{11}",,,"19001112222"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"GT",502,"00",,,,,,,,[[,"(\\d{4})(\\d{4})","$1 $2",["[2-7]"],"","",0],[,"(\\d{4})(\\d{3})(\\d{4})","$1 $2 $3",["1"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],GU:[,[,,"[5689]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"671(?:3(?:00|3[39]|4[349]|55|6[26])|4(?:56|7[1-9]|8[236-9])|5(?:55|6[2-5]|88)|6(?:3[2-578]|4[24-9]|5[34]|78|8[5-9])|7(?:[079]7|2[0167]|3[45]|8[789])|8(?:[2-5789]8|6[48])|9(?:2[29]|6[79]|7[179]|8[789]|9[78]))\\d{4}",
"\\d{7}(?:\\d{3})?",,,"6713001234"],[,,"671(?:3(?:00|3[39]|4[349]|55|6[26])|4(?:56|7[1-9]|8[236-9])|5(?:55|6[2-5]|88)|6(?:3[2-578]|4[24-9]|5[34]|78|8[5-9])|7(?:[079]7|2[0167]|3[45]|8[789])|8(?:[2-5789]8|6[48])|9(?:2[29]|6[79]|7[179]|8[789]|9[78]))\\d{4}","\\d{7}(?:\\d{3})?",,,"6713001234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"GU",1,"011","1",,
,"1",,,1,,,[,,"NA","NA"],,"671",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],GW:[,[,,"[3-79]\\d{6}","\\d{7}"],[,,"3(?:2[0125]|3[1245]|4[12]|5[1-4]|70|9[1-467])\\d{4}","\\d{7}",,,"3201234"],[,,"(?:[5-7]\\d|9[012])\\d{5}","\\d{7}",,,"5012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"40\\d{5}","\\d{7}",,,"4012345"],"GW",245,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],GY:[,[,,"[2-4679]\\d{6}","\\d{7}"],[,,"(?:2(?:1[6-9]|2[0-35-9]|3[1-4]|5[3-9]|6\\d|7[0-24-79])|3(?:2[25-9]|3\\d)|4(?:4[0-24]|5[56])|77[1-57])\\d{4}",
"\\d{7}",,,"2201234"],[,,"6\\d{6}","\\d{7}",,,"6091234"],[,,"(?:289|862)\\d{4}","\\d{7}",,,"2891234"],[,,"9008\\d{3}","\\d{7}",,,"9008123"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"GY",592,"001",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],HK:[,[,,"[235-7]\\d{7}|8\\d{7,8}|9\\d{4,10}","\\d{5,11}"],[,,"(?:[23]\\d|5[78])\\d{6}","\\d{8}",,,"21234567"],[,,"(?:5[1-69]\\d|6\\d{2}|9(?:0[1-9]|[1-8]\\d))\\d{5}","\\d{8}",,,"51234567"],[,,"800\\d{6}",
"\\d{9}",,,"800123456"],[,,"900(?:[0-24-9]\\d{7}|3\\d{1,4})","\\d{5,11}",,,"90012345678"],[,,"NA","NA"],[,,"8[1-3]\\d{6}","\\d{8}",,,"81123456"],[,,"NA","NA"],"HK",852,"00",,,,,,,,[[,"(\\d{4})(\\d{4})","$1 $2",["[235-7]|[89](?:0[1-9]|[1-9])"],"","",0],[,"(800)(\\d{3})(\\d{3})","$1 $2 $3",["800"],"","",0],[,"(900)(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3 $4",["900"],"","",0],[,"(900)(\\d{2,5})","$1 $2",["900"],"","",0]],,[,,"7\\d{7}","\\d{8}",,,"71234567"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],
HN:[,[,,"[237-9]\\d{7}","\\d{8}"],[,,"2(?:2(?:0[019]|1[1-36]|[23]\\d|4[056]|5[57]|7[01389]|8[0146-9]|9[012])|4(?:2[3-59]|3[13-689]|4[0-68]|5[1-35])|5(?:4[3-5]|5\\d|6[56]|74)|6(?:[056]\\d|4[0-378]|[78][0-8]|9[01])|7(?:6[46-9]|7[02-9]|8[34])|8(?:79|8[0-35789]|9[1-57-9]))\\d{4}","\\d{8}",,,"22123456"],[,,"[37-9]\\d{7}","\\d{8}",,,"91234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"HN",504,"00",,,,,,,,[[,"(\\d{4})(\\d{4})","$1-$2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],
[,,"NA","NA"],,,[,,"NA","NA"]],HR:[,[,,"[1-7]\\d{5,8}|[89]\\d{6,11}","\\d{6,12}"],[,,"1\\d{7}|(?:2[0-3]|3[1-5]|4[02-47-9]|5[1-3])\\d{6}","\\d{6,8}",,,"12345678"],[,,"9[1257-9]\\d{6,10}","\\d{8,12}",,,"912345678"],[,,"80[01]\\d{4,7}","\\d{7,10}",,,"8001234567"],[,,"6(?:[09]\\d{7}|[145]\\d{4,7})","\\d{6,9}",,,"611234"],[,,"NA","NA"],[,,"7[45]\\d{4,7}","\\d{6,9}",,,"741234567"],[,,"NA","NA"],"HR",385,"00","0",,,"0",,,,[[,"(1)(\\d{4})(\\d{3})","$1 $2 $3",["1"],"0$1","",0],[,"(6[09])(\\d{4})(\\d{3})",
"$1 $2 $3",["6[09]"],"0$1","",0],[,"(62)(\\d{3})(\\d{3,4})","$1 $2 $3",["62"],"0$1","",0],[,"([2-5]\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[2-5]"],"0$1","",0],[,"(9\\d)(\\d{3})(\\d{3,4})","$1 $2 $3",["9"],"0$1","",0],[,"(9\\d)(\\d{4})(\\d{4})","$1 $2 $3",["9"],"0$1","",0],[,"(9\\d)(\\d{3,4})(\\d{3})(\\d{3})","$1 $2 $3 $4",["9"],"0$1","",0],[,"(\\d{2})(\\d{2})(\\d{2,3})","$1 $2 $3",["6[145]|7"],"0$1","",0],[,"(\\d{2})(\\d{3,4})(\\d{3})","$1 $2 $3",["6[145]|7"],"0$1","",0],[,"(80[01])(\\d{2})(\\d{2,3})",
"$1 $2 $3",["8"],"0$1","",0],[,"(80[01])(\\d{3,4})(\\d{3})","$1 $2 $3",["8"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"62\\d{6,7}","\\d{8,9}",,,"62123456"],,,[,,"NA","NA"]],HT:[,[,,"[2-489]\\d{7}","\\d{8}"],[,,"2(?:[24]\\d|5[1-5]|94)\\d{5}","\\d{8}",,,"22453300"],[,,"(?:3[1-9]|4\\d)\\d{6}","\\d{8}",,,"34101234"],[,,"8\\d{7}","\\d{8}",,,"80012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"98[89]\\d{5}","\\d{8}",,,"98901234"],"HT",509,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{4})","$1 $2 $3",
,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],HU:[,[,,"[1-9]\\d{7,8}","\\d{6,9}"],[,,"(?:1\\d|2(?:1\\d|[2-9])|3[2-7]|4[24-9]|5[2-79]|6[23689]|7(?:1\\d|[2-9])|8[2-57-9]|9[2-69])\\d{6}","\\d{6,9}",,,"12345678"],[,,"(?:[27]0|3[01])\\d{7}","\\d{9}",,,"201234567"],[,,"80\\d{6}","\\d{8}",,,"80123456"],[,,"9[01]\\d{6}","\\d{8}",,,"90123456"],[,,"40\\d{6}","\\d{8}",,,"40123456"],[,,"NA","NA"],[,,"NA","NA"],"HU",36,"00","06",,,"06",,,,[[,"(1)(\\d{3})(\\d{4})","$1 $2 $3",["1"],"($1)",
"",0],[,"(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[2-9]"],"($1)","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],ID:[,[,,"[1-9]\\d{6,10}","\\d{5,11}"],[,,"2(?:1(?:[0-8]\\d{6,7}|9\\d{6})|[24]\\d{7,8})|(?:2(?:[35][1-4]|6[0-8]|7[1-6]|8\\d|9[1-8])|3(?:1|2[1-578]|3[1-68]|4[1-3]|5[1-8]|6[1-3568]|7[0-46]|8\\d)|4(?:0[1-589]|1[01347-9]|2[0-36-8]|3[0-24-68]|5[1-378]|6[1-5]|7[134]|8[1245])|5(?:1[1-35-9]|2[25-8]|3[1246-9]|4[1-3589]|5[1-46]|6[1-8])|6(?:19?|[25]\\d|3[1-469]|4[1-6])|7(?:1[1-46-9]|2[14-9]|[36]\\d|4[1-8]|5[1-9]|7[0-36-9])|9(?:0[12]|1[013-8]|2[0-479]|5[125-8]|6[23679]|7[159]|8[01346]))\\d{5,8}",
"\\d{5,10}",,,"612345678"],[,,"(?:2(?:1(?:3[145]|4[01]|5[1-469]|60|8[0359]|9\\d)|2(?:88|9[1256])|3[1-4]9|4(?:36|91)|5(?:1[349]|[2-4]9)|6[0-7]9|7(?:[1-36]9|4[39])|8[1-5]9|9[1-48]9)|3(?:19[1-3]|2[12]9|3[13]9|4(?:1[69]|39)|5[14]9|6(?:1[69]|2[89])|709)|4[13]19|5(?:1(?:19|8[39])|4[129]9|6[12]9)|6(?:19[12]|2(?:[23]9|77))|7(?:1[13]9|2[15]9|419|5(?:1[89]|29)|6[15]9|7[178]9))\\d{5,6}|8[1-35-9]\\d{7,9}","\\d{9,11}",,,"812345678"],[,,"177\\d{6,8}|800\\d{5,7}","\\d{8,11}",,,"8001234567"],[,,"809\\d{7}","\\d{10}",
,,"8091234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"ID",62,"0(?:0[1789]|10(?:00|1[67]))","0",,,"0",,,,[[,"(\\d{2})(\\d{7,8})","$1 $2",["2[124]|[36]1"],"(0$1)","",0],[,"(\\d{3})(\\d{5,7})","$1 $2",["[4579]|2[035-9]|[36][02-9]"],"(0$1)","",0],[,"(8\\d{2})(\\d{3,4})(\\d{3,4})","$1-$2-$3",["8[1-35-9]"],"0$1","",0],[,"(177)(\\d{6,8})","$1 $2",["1"],"0$1","",0],[,"(800)(\\d{5,7})","$1 $2",["800"],"0$1","",0],[,"(809)(\\d)(\\d{3})(\\d{3})","$1 $2 $3 $4",["809"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA",
"NA"],[,,"NA","NA"],,,[,,"NA","NA"]],IE:[,[,,"[124-9]\\d{6,9}","\\d{5,10}"],[,,"1\\d{7,8}|2(?:1\\d{6,7}|3\\d{7}|[24-9]\\d{5})|4(?:0[24]\\d{5}|[1-469]\\d{7}|5\\d{6}|7\\d{5}|8[0-46-9]\\d{7})|5(?:0[45]\\d{5}|1\\d{6}|[23679]\\d{7}|8\\d{5})|6(?:1\\d{6}|[237-9]\\d{5}|[4-6]\\d{7})|7[14]\\d{7}|9(?:1\\d{6}|[04]\\d{7}|[35-9]\\d{5})","\\d{5,10}",,,"2212345"],[,,"8(?:22\\d{6}|[35-9]\\d{7})","\\d{9}",,,"850123456"],[,,"1800\\d{6}","\\d{10}",,,"1800123456"],[,,"15(?:1[2-8]|[2-8]0|9[089])\\d{6}","\\d{10}",,,"1520123456"],
[,,"18[59]0\\d{6}","\\d{10}",,,"1850123456"],[,,"700\\d{6}","\\d{9}",,,"700123456"],[,,"76\\d{7}","\\d{9}",,,"761234567"],"IE",353,"00","0",,,"0",,,,[[,"(1)(\\d{3,4})(\\d{4})","$1 $2 $3",["1"],"(0$1)","",0],[,"(\\d{2})(\\d{5})","$1 $2",["2[24-9]|47|58|6[237-9]|9[35-9]"],"(0$1)","",0],[,"(\\d{3})(\\d{5})","$1 $2",["40[24]|50[45]"],"(0$1)","",0],[,"(48)(\\d{4})(\\d{4})","$1 $2 $3",["48"],"(0$1)","",0],[,"(818)(\\d{3})(\\d{3})","$1 $2 $3",["81"],"(0$1)","",0],[,"(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",
["[24-69]|7[14]"],"(0$1)","",0],[,"([78]\\d)(\\d{3,4})(\\d{4})","$1 $2 $3",["76|8[35-9]"],"0$1","",0],[,"(700)(\\d{3})(\\d{3})","$1 $2 $3",["70"],"0$1","",0],[,"(\\d{4})(\\d{3})(\\d{3})","$1 $2 $3",["1(?:8[059]|5)","1(?:8[059]0|5)"],"$1","",0]],,[,,"NA","NA"],,,[,,"18[59]0\\d{6}","\\d{10}",,,"1850123456"],[,,"818\\d{6}","\\d{9}",,,"818123456"],,,[,,"8[35-9]\\d{8}","\\d{10}",,,"8501234567"]],IL:[,[,,"[17]\\d{6,9}|[2-589]\\d{3}(?:\\d{3,6})?|6\\d{3}","\\d{4,10}"],[,,"[2-489]\\d{7}","\\d{7,8}",,,"21234567"],
[,,"5(?:[02347-9]\\d{2}|5(?:2[23]|3[34]|4[45]|5[5689]|6[67]|7[78]|8[89])|6[2-9]\\d)\\d{5}","\\d{9}",,,"501234567"],[,,"1(?:80[019]\\d{3}|255)\\d{3}","\\d{7,10}",,,"1800123456"],[,,"1(?:212|(?:9(?:0[01]|19)|200)\\d{2})\\d{4}","\\d{8,10}",,,"1919123456"],[,,"1700\\d{6}","\\d{10}",,,"1700123456"],[,,"NA","NA"],[,,"7(?:2[23]\\d|3[237]\\d|47\\d|6(?:5\\d|8[08])|7\\d{2}|8(?:33|55|77|81))\\d{5}","\\d{9}",,,"771234567"],"IL",972,"0(?:0|1[2-9])","0",,,"0",,,,[[,"([2-489])(\\d{3})(\\d{4})","$1-$2-$3",["[2-489]"],
"0$1","",0],[,"([57]\\d)(\\d{3})(\\d{4})","$1-$2-$3",["[57]"],"0$1","",0],[,"(1)([7-9]\\d{2})(\\d{3})(\\d{3})","$1-$2-$3-$4",["1[7-9]"],"$1","",0],[,"(1255)(\\d{3})","$1-$2",["125"],"$1","",0],[,"(1200)(\\d{3})(\\d{3})","$1-$2-$3",["120"],"$1","",0],[,"(1212)(\\d{2})(\\d{2})","$1-$2-$3",["121"],"$1","",0],[,"(1599)(\\d{6})","$1-$2",["15"],"$1","",0],[,"(\\d{4})","*$1",["[2-689]"],"$1","",0]],,[,,"NA","NA"],,,[,,"1700\\d{6}|[2-689]\\d{3}","\\d{4,10}",,,"1700123456"],[,,"[2-689]\\d{3}|1599\\d{6}","\\d{4}(?:\\d{6})?",
,,"1599123456"],,,[,,"NA","NA"]],IM:[,[,,"[135789]\\d{6,9}","\\d{6,10}"],[,,"1624\\d{6}","\\d{6,10}",,,"1624456789"],[,,"7[569]24\\d{6}","\\d{10}",,,"7924123456"],[,,"808162\\d{4}","\\d{10}",,,"8081624567"],[,,"(?:872299|90[0167]624)\\d{4}","\\d{10}",,,"9016247890"],[,,"8(?:4(?:40[49]06|5624\\d)|70624\\d)\\d{3}","\\d{10}",,,"8456247890"],[,,"70\\d{8}","\\d{10}",,,"7012345678"],[,,"56\\d{8}","\\d{10}",,,"5612345678"],"IM",44,"00","0"," x",,"0",,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"3(?:08162\\d|3\\d{5}|4(?:40[49]06|5624\\d)|7(?:0624\\d|2299\\d))\\d{3}|55\\d{8}",
"\\d{10}",,,"5512345678"],,,[,,"NA","NA"]],IN:[,[,,"1\\d{7,12}|[2-9]\\d{9,10}","\\d{6,13}"],[,,"(?:11|2[02]|33|4[04]|79)[2-7]\\d{7}|80[2-467]\\d{7}|(?:1(?:2[0-249]|3[0-25]|4[145]|[59][14]|6[014]|7[1257]|8[01346])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[126-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:[136][25]|22|4[28]|5[12]|[78]1|9[15])|6(?:12|[2345]1|57|6[13]|7[14]|80)|7(?:12|2[14]|3[134]|4[47]|5[15]|[67]1|88)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91))[2-7]\\d{6}|(?:(?:1(?:2[35-8]|3[346-9]|4[236-9]|[59][0235-9]|6[235-9]|7[34689]|8[257-9])|2(?:1[134689]|3[24-8]|4[2-8]|5[25689]|6[2-4679]|7[13-79]|8[2-479]|9[235-9])|3(?:01|1[79]|2[1-5]|4[25-8]|5[125689]|6[235-7]|7[157-9]|8[2-467])|4(?:1[14578]|2[5689]|3[2-467]|5[4-7]|6[35]|73|8[2689]|9[2389])|5(?:[16][146-9]|2[14-8]|3[1346]|4[14-69]|5[46]|7[2-4]|8[2-8]|9[246])|6(?:1[1358]|2[2457]|3[2-4]|4[235-7]|[57][2-689]|6[24-58]|8[1-6])|8(?:1[1357-9]|2[235-8]|3[03-57-9]|4[0-24-9]|5\\d|6[2457-9]|7[1-6]|8[1256]|9[2-4]))\\d|7(?:(?:1[013-9]|2[0235-9]|3[2679]|4[1-35689]|5[2-46-9]|[67][02-9]|9\\d)\\d|8(?:2[0-6]|[013-8]\\d)))[2-7]\\d{5}",
"\\d{6,10}",,,"1123456789"],[,,"(?:7(?:2(?:0[04-9]|5[09]|7[5-8]|9[389])|3(?:0[1-9]|[58]\\d|7[3679]|9[689])|4(?:0[1-9]|1[15-9]|[29][89]|39|8[389])|5(?:[034678]\\d|2[03-9]|5[017-9]|9[7-9])|6(?:0[027]|1[0-257-9]|2[0-4]|3[19]|5[4589]|[67]\\d|8[0-489]|9[0-46-9])|7(?:0[2-9]|[1-79]\\d|8[1-9])|8(?:[0-7]\\d|9[013-9]))|8(?:0(?:[01589]\\d|6[67])|1(?:[02-589]\\d|1[0135-9]|7[0-79])|2(?:[236-9]\\d|5[1-9])|3(?:[0357-9]\\d|4[1-9])|[45]\\d{2}|6[02457-9]\\d|7[1-69]\\d|8(?:[0-26-9]\\d|44|5[2-9])|9(?:[035-9]\\d|2[2-9]|4[0-8]))|9\\d{3})\\d{6}",
"\\d{10}",,,"9123456789"],[,,"1(?:600\\d{6}|80(?:0\\d{4,8}|3\\d{9}))","\\d{8,13}",,,"1800123456"],[,,"186[12]\\d{9}","\\d{13}",,,"1861123456789"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"IN",91,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{2})(\\d{6})","$1 $2 $3",["7(?:2[0579]|3[057-9]|4[0-389]|6[0-35-9]|[57]|8[0-79])|8(?:0[015689]|1[0-57-9]|2[2356-9]|3[0-57-9]|[45]|6[02457-9]|7[1-69]|8[0124-9]|9[02-9])|9","7(?:2(?:0[04-9]|5[09]|7[5-8]|9[389])|3(?:0[1-9]|[58]|7[3679]|9[689])|4(?:0[1-9]|1[15-9]|[29][89]|39|8[389])|5(?:[034678]|2[03-9]|5[017-9]|9[7-9])|6(?:0[027]|1[0-257-9]|2[0-4]|3[19]|5[4589]|[67]|8[0-489]|9[0-46-9])|7(?:0[2-9]|[1-79]|8[1-9])|8(?:[0-7]|9[013-9]))|8(?:0(?:[01589]|6[67])|1(?:[02-589]|1[0135-9]|7[0-79])|2(?:[236-9]|5[1-9])|3(?:[0357-9]|4[1-9])|[45]|6[02457-9]|7[1-69]|8(?:[0-26-9]|44|5[2-9])|9(?:[035-9]|2[2-9]|4[0-8]))|9"],
"0$1","",1],[,"(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["11|2[02]|33|4[04]|79|80[2-46]"],"0$1","",1],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["1(?:2[0-249]|3[0-25]|4[145]|[569][14]|7[1257]|8[1346]|[68][1-9])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[126-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:[136][25]|22|4[28]|5[12]|[78]1|9[15])|6(?:12|[2345]1|57|6[13]|7[14]|80)"],"0$1","",1],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",
["7(?:12|2[14]|3[134]|4[47]|5[15]|[67]1|88)","7(?:12|2[14]|3[134]|4[47]|5(?:1|5[2-6])|[67]1|88)"],"0$1","",1],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)"],"0$1","",1],[,"(\\d{4})(\\d{3})(\\d{3})","$1 $2 $3",["1(?:[2-579]|[68][1-9])|[2-8]"],"0$1","",1],[,"(1600)(\\d{2})(\\d{4})","$1 $2 $3",["160","1600"],"$1","",1],[,"(1800)(\\d{4,5})","$1 $2",["180","1800"],"$1","",1],[,"(18[06]0)(\\d{2,4})(\\d{4})","$1 $2 $3",["18[06]","18[06]0"],"$1","",1],[,"(\\d{4})(\\d{3})(\\d{4})(\\d{2})",
"$1 $2 $3 $4",["18[06]","18(?:03|6[12])"],"$1","",1]],,[,,"NA","NA"],,,[,,"1(?:600\\d{6}|8(?:0(?:0\\d{4,8}|3\\d{9})|6(?:0\\d{7}|[12]\\d{9})))","\\d{8,13}",,,"1800123456"],[,,"1860\\d{7}","\\d{11}",,,"18603451234"],,,[,,"NA","NA"]],IO:[,[,,"3\\d{6}","\\d{7}"],[,,"37\\d{5}","\\d{7}",,,"3709100"],[,,"38\\d{5}","\\d{7}",,,"3801234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"IO",246,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA",
"NA"],,,[,,"NA","NA"]],IQ:[,[,,"[1-7]\\d{7,9}","\\d{6,10}"],[,,"1\\d{7}|(?:2[13-5]|3[02367]|4[023]|5[03]|6[026])\\d{6,7}","\\d{6,9}",,,"12345678"],[,,"7[3-9]\\d{8}","\\d{10}",,,"7912345678"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"IQ",964,"00","0",,,"0",,,,[[,"(1)(\\d{3})(\\d{4})","$1 $2 $3",["1"],"0$1","",0],[,"([2-6]\\d)(\\d{3})(\\d{3,4})","$1 $2 $3",["[2-6]"],"0$1","",0],[,"(7\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["7"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,
,"NA","NA"],,,[,,"NA","NA"]],IR:[,[,,"[14-8]\\d{6,9}|[23]\\d{4,9}|9(?:[1-4]\\d{8}|9\\d{2,8})","\\d{4,10}"],[,,"1(?:[13-589][12]|[27][1-4])\\d{7}|2(?:1\\d{3,8}|3[12]\\d{7}|4(?:1\\d{4,7}|2\\d{7})|5(?:1\\d{3,7}|[2356]\\d{7})|6\\d{8}|7[34]\\d{7}|[89][12]\\d{7})|3(?:1(?:1\\d{4,7}|2\\d{7})|2[1-4]\\d{7}|3(?:[125]\\d{7}|4\\d{6,7})|4(?:1\\d{6,7}[24-9]\\d{7})|5(?:1\\d{4,7}|[23]\\d{7})|[6-9][12]\\d{7})|4(?:[135-9][12]\\d{7}|2[1-467]\\d{7}|4(?:1\\d{4,7}|[2-4]\\d{7}))|5(?:1(?:1\\d{4,7}|2\\d{7})|2[89]\\d{7}|3[1-5]\\d{7}|4(?:1\\d{4,7}|[2-8]\\d{7})|[5-7][12]\\d{7}|8[1245]\\d{7})|6(?:1(?:1\\d{6,7}|2\\d{7})|[347-9][12]\\d{7}|5(?:1\\d{7}|2\\d{6,7})|6[1-6]\\d{7})|7(?:[13589][12]|2[1289]|4[1-4]|6[1-6]|7[1-3])\\d{7}|8(?:[145][12]|3[124578]|6[1256]|7[1245])\\d{7}",
"\\d{5,10}",,,"2123456789"],[,,"9[1-3]\\d{8}","\\d{10}",,,"9123456789"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"(?:[2-6]0\\d|993)\\d{7}","\\d{10}",,,"9932123456"],"IR",98,"00","0",,,"0",,,,[[,"(2[15])(\\d{3,5})","$1 $2",["2(?:1|5[0-47-9])"],"0$1","",0],[,"(2[15])(\\d{3})(\\d{3,4})","$1 $2 $3",["2(?:1|5[0-47-9])"],"0$1","",0],[,"(2\\d)(\\d{4})(\\d{4})","$1 $2 $3",["2(?:[16]|5[0-47-9])"],"0$1","",0],[,"(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["[13-9]|2[02-57-9]"],"0$1","",0],[,"(\\d{3})(\\d{2})(\\d{2,3})",
"$1 $2 $3",["[13-9]|2[02-57-9]"],"0$1","",0],[,"(\\d{3})(\\d{3})","$1 $2",["[13-9]|2[02-57-9]"],"0$1","",0]],,[,,"943\\d{7}","\\d{10}",,,"9432123456"],,,[,,"NA","NA"],[,,"9990\\d{0,6}","\\d{4,10}",,,"9990123456"],,,[,,"NA","NA"]],IS:[,[,,"[4-9]\\d{6}|38\\d{7}","\\d{7,9}"],[,,"(?:4(?:[14][0-245]|2[0-7]|[37][0-8]|5[0-3568]|6\\d|8[0-36-8])|5(?:05|[156]\\d|2[02578]|3[013-7]|4[03-7]|7[0-2578]|8[0-35-9]|9[013-689])|87[23])\\d{4}","\\d{7}",,,"4101234"],[,,"38[589]\\d{6}|(?:6(?:1[0-8]|3[0-27-9]|4[0-27]|5[0-29]|[67][0-69]|9\\d)|7(?:5[057]|7\\d|8[0-3])|8(?:2[0-5]|[469]\\d|5[1-9]))\\d{4}",
"\\d{7,9}",,,"6101234"],[,,"800\\d{4}","\\d{7}",,,"8001234"],[,,"90\\d{5}","\\d{7}",,,"9011234"],[,,"NA","NA"],[,,"NA","NA"],[,,"49[0-24-79]\\d{4}","\\d{7}",,,"4921234"],"IS",354,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",["[4-9]"],"","",0],[,"(3\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["3"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"(?:6(?:2[0-8]|49|8\\d)|8(?:2[6-9]|[38]\\d|50|7[014-9])|95[48])\\d{4}","\\d{7}",,,"6201234"]],IT:[,[,,"[01589]\\d{5,10}|3(?:[12457-9]\\d{8}|[36]\\d{7,9})",
"\\d{6,11}"],[,,"0(?:[26]\\d{4,9}|(?:1(?:[0159]\\d|[27][1-5]|31|4[1-4]|6[1356]|8[2-57])|3(?:[0159]\\d|2[1-4]|3[12]|[48][1-6]|6[2-59]|7[1-7])|4(?:[0159]\\d|[23][1-9]|4[245]|6[1-5]|7[1-4]|81)|5(?:[0159]\\d|2[1-5]|3[2-6]|4[1-79]|6[4-6]|7[1-578]|8[3-8])|7(?:[0159]\\d|2[12]|3[1-7]|4[2346]|6[13569]|7[13-6]|8[1-59])|8(?:[0159]\\d|2[34578]|3[1-356]|[6-8][1-5])|9(?:[0159]\\d|[238][1-5]|4[12]|6[1-8]|7[1-6]))\\d{2,7})","\\d{6,11}",,,"0212345678"],[,,"3(?:[12457-9]\\d{8}|6\\d{7,8}|3\\d{7,9})","\\d{9,11}",,,"3123456789"],
[,,"80(?:0\\d{6}|3\\d{3})","\\d{6,9}",,,"800123456"],[,,"0878\\d{5}|1(?:44|6[346])\\d{6}|89(?:2\\d{3}|4(?:[0-4]\\d{2}|[5-9]\\d{4})|5(?:[0-4]\\d{2}|[5-9]\\d{6})|9\\d{6})","\\d{6,10}",,,"899123456"],[,,"84(?:[08]\\d{6}|[17]\\d{3})","\\d{6,9}",,,"848123456"],[,,"1(?:78\\d|99)\\d{6}","\\d{9,10}",,,"1781234567"],[,,"55\\d{8}","\\d{10}",,,"5512345678"],"IT",39,"00",,,,,,,,[[,"(\\d{2})(\\d{3,4})(\\d{4})","$1 $2 $3",["0[26]|55"],"","",0],[,"(0[26])(\\d{4})(\\d{5})","$1 $2 $3",["0[26]"],"","",0],[,"(0[26])(\\d{4,6})",
"$1 $2",["0[26]"],"","",0],[,"(0\\d{2})(\\d{3,4})(\\d{4})","$1 $2 $3",["0[13-57-9][0159]"],"","",0],[,"(\\d{3})(\\d{3,6})","$1 $2",["0[13-57-9][0159]|8(?:03|4[17]|9[245])","0[13-57-9][0159]|8(?:03|4[17]|9(?:2|[45][0-4]))"],"","",0],[,"(0\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["0[13-57-9][2-46-8]"],"","",0],[,"(0\\d{3})(\\d{2,6})","$1 $2",["0[13-57-9][2-46-8]"],"","",0],[,"(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["[13]|8(?:00|4[08]|9[59])","[13]|8(?:00|4[08]|9(?:5[5-9]|9))"],"","",0],[,"(\\d{4})(\\d{4})",
"$1 $2",["894","894[5-9]"],"","",0],[,"(\\d{3})(\\d{4})(\\d{4})","$1 $2 $3",["3"],"","",0]],,[,,"NA","NA"],,,[,,"848\\d{6}","\\d{9}",,,"848123456"],[,,"NA","NA"],1,,[,,"NA","NA"]],JE:[,[,,"[135789]\\d{6,9}","\\d{6,10}"],[,,"1534\\d{6}","\\d{6,10}",,,"1534456789"],[,,"7(?:509|7(?:00|97)|829|937)\\d{6}","\\d{10}",,,"7797123456"],[,,"80(?:07(?:35|81)|8901)\\d{4}","\\d{10}",,,"8007354567"],[,,"(?:871206|90(?:066[59]|1810|71(?:07|55)))\\d{4}","\\d{10}",,,"9018105678"],[,,"8(?:4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|70002)\\d{4}",
"\\d{10}",,,"8447034567"],[,,"701511\\d{4}","\\d{10}",,,"7015115678"],[,,"56\\d{8}","\\d{10}",,,"5612345678"],"JE",44,"00","0"," x",,"0",,,,,,[,,"76(?:0[012]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}","\\d{10}",,,"7640123456"],,,[,,"NA","NA"],[,,"3(?:0(?:07(?:35|81)|8901)|3\\d{4}|4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))\\d{4}|55\\d{8}","\\d{10}",,,"5512345678"],,,[,,"NA","NA"]],JM:[,[,,"[589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"876(?:5(?:0[12]|1[0-468]|2[35]|63)|6(?:0[1-3579]|1[027-9]|[23]\\d|40|5[06]|6[2-589]|7[05]|8[04]|9[4-9])|7(?:0[2-689]|[1-6]\\d|8[056]|9[45])|9(?:0[1-8]|1[02378]|[2-8]\\d|9[2-468]))\\d{4}",
"\\d{7}(?:\\d{3})?",,,"8765123456"],[,,"876(?:2[1789]\\d|[348]\\d{2}|5(?:08|27|6[0-24-9]|[3-578]\\d)|7(?:0[07]|7\\d|8[1-47-9]|9[0-36-9])|9(?:[01]9|9[0579]))\\d{4}","\\d{10}",,,"8762101234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"JM",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"876",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],JO:[,[,,"[235-9]\\d{7,8}",
"\\d{7,9}"],[,,"(?:2(?:6(?:2[0-35-9]|3[0-57-8]|4[24-7]|5[0-24-8]|[6-8][02]|9[0-2])|7(?:0[1-79]|10|2[014-7]|3[0-689]|4[019]|5[0-3578]))|32(?:0[1-69]|1[1-35-7]|2[024-7]|3\\d|4[0-2]|[57][02]|60)|53(?:0[0-2]|[13][02]|2[0-59]|49|5[0-35-9]|6[15]|7[45]|8[1-6]|9[0-36-9])|6(?:2[50]0|300|4(?:0[0125]|1[2-7]|2[0569]|[38][07-9]|4[025689]|6[0-589]|7\\d|9[0-2])|5(?:[01][056]|2[034]|3[0-57-9]|4[17-8]|5[0-69]|6[0-35-9]|7[1-379]|8[0-68]|9[02-39]))|87(?:[02]0|7[08]|9[09]))\\d{4}","\\d{7,8}",,,"62001234"],[,,"7(?:55|7[25-9]|8[05-9]|9[015-9])\\d{6}",
"\\d{9}",,,"790123456"],[,,"80\\d{6}","\\d{8}",,,"80012345"],[,,"900\\d{5}","\\d{8}",,,"90012345"],[,,"85\\d{6}","\\d{8}",,,"85012345"],[,,"70\\d{7}","\\d{9}",,,"700123456"],[,,"NA","NA"],"JO",962,"00","0",,,"0",,,,[[,"(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["[2356]|87"],"(0$1)","",0],[,"(7)(\\d{4})(\\d{4})","$1 $2 $3",["7[457-9]"],"0$1","",0],[,"(\\d{3})(\\d{5,6})","$1 $2",["70|8[0158]|9"],"0$1","",0]],,[,,"74(?:66|77)\\d{5}","\\d{9}",,,"746612345"],,,[,,"NA","NA"],[,,"8(?:10|8\\d)\\d{5}","\\d{8}",,,
"88101234"],,,[,,"NA","NA"]],JP:[,[,,"[1-9]\\d{8,9}|0(?:[36]\\d{7,14}|7\\d{5,7}|8\\d{7})","\\d{7,16}"],[,,"(?:1(?:1[235-8]|2[3-6]|3[3-9]|4[2-6]|[58][2-8]|6[2-7]|7[2-9]|9[1-9])|2[2-9]\\d|[36][1-9]\\d|4(?:6[02-8]|[2-578]\\d|9[2-59])|5(?:6[1-9]|7[2-8]|[2-589]\\d)|7(?:3[4-9]|4[02-9]|[25-9]\\d)|8(?:3[2-9]|4[5-9]|5[1-9]|8[03-9]|[2679]\\d)|9(?:[679][1-9]|[2-58]\\d))\\d{6}","\\d{9}",,,"312345678"],[,,"(?:[79]0\\d|80[1-9])\\d{7}","\\d{10}",,,"7012345678"],[,,"120\\d{6}|800\\d{7}|0(?:37\\d{6,13}|66\\d{6,13}|777(?:[01]\\d{2}|5\\d{3}|8\\d{4})|882[1245]\\d{4})",
"\\d{7,16}",,,"120123456"],[,,"990\\d{6}","\\d{9}",,,"990123456"],[,,"NA","NA"],[,,"60\\d{7}","\\d{9}",,,"601234567"],[,,"50[1-9]\\d{7}","\\d{10}",,,"5012345678"],"JP",81,"010","0",,,"0",,,,[[,"(\\d{3})(\\d{3})(\\d{3})","$1-$2-$3",["(?:12|57|99)0"],"0$1","",0],[,"(\\d{3})(\\d{3})(\\d{4})","$1-$2-$3",["800"],"0$1","",0],[,"(\\d{3})(\\d{4})","$1-$2",["077"],"0$1","",0],[,"(\\d{3})(\\d{2})(\\d{3,4})","$1-$2-$3",["077"],"0$1","",0],[,"(\\d{3})(\\d{2})(\\d{4})","$1-$2-$3",["088"],"0$1","",0],[,"(\\d{3})(\\d{3})(\\d{3,4})",
"$1-$2-$3",["0(?:37|66)"],"0$1","",0],[,"(\\d{3})(\\d{4})(\\d{4,5})","$1-$2-$3",["0(?:37|66)"],"0$1","",0],[,"(\\d{3})(\\d{5})(\\d{5,6})","$1-$2-$3",["0(?:37|66)"],"0$1","",0],[,"(\\d{3})(\\d{6})(\\d{6,7})","$1-$2-$3",["0(?:37|66)"],"0$1","",0],[,"(\\d{2})(\\d{4})(\\d{4})","$1-$2-$3",["[2579]0|80[1-9]"],"0$1","",0],[,"(\\d{4})(\\d)(\\d{4})","$1-$2-$3",["1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|5(?:76|97)|499|746|8(?:3[89]|63|47|51)|9(?:49|80|9[16])","1(?:267|3(?:7[247]|9[278])|4(?:5[67]|66)|5(?:47|58|64|8[67])|6(?:3[245]|48|5[4-68]))|5(?:76|97)9|499[2468]|7468|8(?:3(?:8[78]|96)|636|477|51[24])|9(?:496|802|9(?:1[23]|69))",
"1(?:267|3(?:7[247]|9[278])|4(?:5[67]|66)|5(?:47|58|64|8[67])|6(?:3[245]|48|5[4-68]))|5(?:769|979[2-69])|499[2468]|7468|8(?:3(?:8[78]|96[2457-9])|636[2-57-9]|477|51[24])|9(?:496|802|9(?:1[23]|69))"],"0$1","",0],[,"(\\d{3})(\\d{2})(\\d{4})","$1-$2-$3",["1(?:2[3-6]|3[3-9]|4[2-6]|5[2-8]|[68][2-7]|7[2-689]|9[1-578])|2(?:2[03-689]|3[3-58]|4[0-468]|5[04-8]|6[013-8]|7[06-9]|8[02-57-9]|9[13])|4(?:2[28]|3[689]|6[035-7]|7[05689]|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9[4-9])|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9[014-9])|8(?:2[49]|3[3-8]|4[5-8]|5[2-9]|6[35-9]|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9[3-7])",
"1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9[2-8])|3(?:7[2-6]|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5[4-7]|6[2-9]|8[2-8]|9[236-9])|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3[34]|[4-7]))",
"1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9(?:[3578]|20|4[04-9]|6[56]))|3(?:7(?:[2-5]|6[0-59])|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5(?:[467]|5[014-9])|6(?:[2-8]|9[02-69])|8[2-8]|9(?:[236-8]|9[23]))|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3(?:3[02-9]|4[0-24689])|4[2-69]|[5-7]))",
"1(?:2[3-6]|3[3-9]|4[2-6]|5(?:[236-8]|[45][2-69])|[68][2-7]|7[2-689]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:5[78]|7[2-4]|[0468][2-9])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|6[1-9]|7[2-8]|8[14-7]|9(?:[89][2-8]|[4-7]))|7(?:2[15]|3[5-9]|4[02-9]|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9(?:[3578]|20|4[04-9]|6(?:5[25]|60)))|3(?:7(?:[2-5]|6[0-59])|[3-6][2-9]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5(?:[467]|5[014-9])|6(?:[2-8]|9[02-69])|8[2-8]|9(?:[236-8]|9[23]))|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3(?:3[02-9]|4[0-24689])|4[2-69]|[5-7]))"],
"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{4})","$1-$2-$3",["1|2(?:2[37]|5[5-9]|64|78|8[39]|91)|4(?:2[2689]|64|7[347])|5(?:[2-589]|39)|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93)","1|2(?:2[37]|5(?:[57]|[68]0|9[19])|64|78|8[39]|917)|4(?:2(?:[68]|20|9[178])|64|7[347])|5(?:[2-589]|39[67])|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93[34])","1|2(?:2[37]|5(?:[57]|[68]0|9(?:17|99))|64|78|8[39]|917)|4(?:2(?:[68]|20|9[178])|64|7[347])|5(?:[2-589]|39[67])|60|8(?:[46-9]|3[279]|2[124589])|9(?:[235-8]|93(?:31|4))"],
"0$1","",0],[,"(\\d{3})(\\d{2})(\\d{4})","$1-$2-$3",["2(?:9[14-79]|74|[34]7|[56]9)|82|993"],"0$1","",0],[,"(\\d)(\\d{4})(\\d{4})","$1-$2-$3",["3|4(?:2[09]|7[01])|6[1-9]"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{4})","$1-$2-$3",["[2479][1-9]"],"0$1","",0]],,[,,"20\\d{8}","\\d{10}",,,"2012345678"],,,[,,"0(?:37\\d{6,13}|66\\d{6,13}|777(?:[01]\\d{2}|5\\d{3}|8\\d{4})|882[1245]\\d{4})","\\d{7,16}",,,"0777012"],[,,"570\\d{6}","\\d{9}",,,"570123456"],1,,[,,"NA","NA"]],KE:[,[,,"20\\d{6,7}|[4-9]\\d{6,9}","\\d{5,10}"],
[,,"20\\d{6,7}|4(?:[013]\\d{7}|[24-6]\\d{5,7})|5(?:[0-36-8]\\d{5,7}|[459]\\d{5})|6(?:[08]\\d{5}|[14-79]\\d{5,7}|2\\d{7})","\\d{5,9}",,,"202012345"],[,,"7(?:0[0-8]|[123]\\d|5[0-6]|7[0-5]|8[5-9])\\d{6}","\\d{9}",,,"712123456"],[,,"800[24-8]\\d{5,6}","\\d{9,10}",,,"800223456"],[,,"900[02-578]\\d{5}","\\d{9}",,,"900223456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"KE",254,"000","0",,,"0",,,,[[,"(\\d{2})(\\d{4,7})","$1 $2",["[24-6]"],"0$1","",0],[,"(\\d{3})(\\d{6,7})","$1 $2",["7"],"0$1","",0],[,"(\\d{3})(\\d{3})(\\d{3,4})",
"$1 $2 $3",["[89]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],KG:[,[,,"[35-8]\\d{8,9}","\\d{5,10}"],[,,"(?:3(?:1(?:2\\d|3[1-9]|47|5[02]|6[1-8])|2(?:22|3[0-479]|6[0-7])|4(?:22|5[6-9]|6[0-4])|5(?:22|3[4-7]|59|6[0-5])|6(?:22|5[35-7]|6[0-3])|7(?:22|3[468]|4[1-9]|59|6\\d|7[5-7])|9(?:22|4[1-8]|6[0-8]))|6(?:09|12|2[2-4])\\d)\\d{5}","\\d{5,10}",,,"312123456"],[,,"5[124-7]\\d{7}|7(?:0[0-357-9]|7\\d)\\d{6}","\\d{9}",,,"700123456"],[,,"800\\d{6,7}","\\d{9,10}",,,"800123456"],
[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"KG",996,"00","0",,,"0",,,,[[,"(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["31[25]|[5-7]"],"0$1","",0],[,"(\\d{4})(\\d{5})","$1 $2",["3(?:1[36]|[2-9])"],"0$1","",0],[,"(\\d{3})(\\d{3})(\\d)(\\d{3})","$1 $2 $3 $4",["8"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],KH:[,[,,"[1-9]\\d{7,9}","\\d{6,10}"],[,,"(?:2[3-6]|3[2-6]|4[2-4]|[5-7][2-5])(?:[237-9]|4[56]|5\\d|6\\d?)\\d{5}|238\\d{6}","\\d{6,9}",,,"23756789"],[,,"(?:1(?:[013-9]|2\\d?)|31\\d|6[016-9]|7(?:[07-9]|6\\d)|8(?:[013-79]|8\\d)|9(?:6\\d|7\\d?|[0-589]))\\d{6}",
"\\d{8,9}",,,"91234567"],[,,"1800(?:1\\d|2[019])\\d{4}","\\d{10}",,,"1800123456"],[,,"1900(?:1\\d|2[09])\\d{4}","\\d{10}",,,"1900123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"KH",855,"00[14-9]","0",,,"0",,,,[[,"(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["1\\d[1-9]|[2-9]"],"0$1","",0],[,"(1[89]00)(\\d{3})(\\d{3})","$1 $2 $3",["1[89]0"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],KI:[,[,,"[2-689]\\d{4}|7\\d{7}","\\d{5,8}"],[,,"(?:[234]\\d|50|8[1-5])\\d{3}","\\d{5}",,,
"31234"],[,,"6\\d{4}|7\\d{7}|9(?:[0-8]\\d|9[015-8])\\d{2}","\\d{5,8}",,,"61234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"KI",686,"00",,,,"0",,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],KM:[,[,,"[379]\\d{6}","\\d{7}"],[,,"7(?:6[0-37-9]|7[0-57-9])\\d{4}","\\d{7}",,,"7712345"],[,,"3[234]\\d{5}","\\d{7}",,,"3212345"],[,,"NA","NA"],[,,"(?:39[01]|9[01]0)\\d{4}","\\d{7}",,,"9001234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"KM",269,"00",,,,,,,,[[,"(\\d{3})(\\d{2})(\\d{2})",
"$1 $2 $3",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],KN:[,[,,"[589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"869(?:2(?:29|36)|302|4(?:6[5-9]|70))\\d{4}","\\d{7}(?:\\d{3})?",,,"8692361234"],[,,"869(?:5(?:5[6-8]|6[5-7])|66\\d|76[02-6])\\d{4}","\\d{10}",,,"8695561234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"KN",1,"011","1",,,"1",
,,,,,[,,"NA","NA"],,"869",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],KP:[,[,,"1\\d{9}|[28]\\d{7}","\\d{6,8}|\\d{10}"],[,,"2\\d{7}|85\\d{6}","\\d{6,8}",,,"21234567"],[,,"19[123]\\d{7}","\\d{10}",,,"1921234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"KP",850,"00|99","0",,,"0",,,,[[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["1"],"0$1","",0],[,"(\\d)(\\d{3})(\\d{4})","$1 $2 $3",["2"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["8"],"0$1","",0]],,[,,"NA","NA"],,
,[,,"2(?:[0-24-9]\\d{2}|3(?:[0-79]\\d|8[02-9]))\\d{4}","\\d{8}",,,"23821234"],[,,"NA","NA"],,,[,,"NA","NA"]],KR:[,[,,"[1-7]\\d{3,9}|8\\d{8}","\\d{4,10}"],[,,"(?:2|3[1-3]|[46][1-4]|5[1-5])(?:1\\d{2,3}|[1-9]\\d{6,7})","\\d{4,10}",,,"22123456"],[,,"1[0-26-9]\\d{7,8}","\\d{9,10}",,,"1023456789"],[,,"80\\d{7}","\\d{9}",,,"801234567"],[,,"60[2-9]\\d{6}","\\d{9}",,,"602345678"],[,,"NA","NA"],[,,"50\\d{8}","\\d{10}",,,"5012345678"],[,,"70\\d{8}","\\d{10}",,,"7012345678"],"KR",82,"00(?:[124-68]|[37]\\d{2})",
"0",,,"0(8[1-46-8]|85\\d{2})?",,,,[[,"(\\d{2})(\\d{4})(\\d{4})","$1-$2-$3",["1(?:0|1[19]|[69]9|5[458])|[57]0","1(?:0|1[19]|[69]9|5(?:44|59|8))|[57]0"],"0$1","0$CC-$1",0],[,"(\\d{2})(\\d{3,4})(\\d{4})","$1-$2-$3",["1(?:[169][2-8]|[78]|5[1-4])|[68]0|[3-6][1-9][1-9]","1(?:[169][2-8]|[78]|5(?:[1-3]|4[56]))|[68]0|[3-6][1-9][1-9]"],"0$1","0$CC-$1",0],[,"(\\d{3})(\\d)(\\d{4})","$1-$2-$3",["131","1312"],"0$1","0$CC-$1",0],[,"(\\d{3})(\\d{2})(\\d{4})","$1-$2-$3",["131","131[13-9]"],"0$1","0$CC-$1",0],[,"(\\d{3})(\\d{3})(\\d{4})",
"$1-$2-$3",["13[2-9]"],"0$1","0$CC-$1",0],[,"(\\d{2})(\\d{2})(\\d{3})(\\d{4})","$1-$2-$3-$4",["30"],"0$1","0$CC-$1",0],[,"(\\d)(\\d{3,4})(\\d{4})","$1-$2-$3",["2[1-9]"],"0$1","0$CC-$1",0],[,"(\\d)(\\d{3,4})","$1-$2",["21[0-46-9]"],"0$1","0$CC-$1",0],[,"(\\d{2})(\\d{3,4})","$1-$2",["[3-6][1-9]1","[3-6][1-9]1(?:[0-46-9])"],"0$1","0$CC-$1",0],[,"(\\d{4})(\\d{4})","$1-$2",["1(?:5[46-9]|6[04678])","1(?:5(?:44|66|77|88|99)|6(?:00|44|6[16]|70|88))"],"$1","0$CC-$1",0]],,[,,"15\\d{7,8}","\\d{9,10}",,,"1523456789"],
,,[,,"NA","NA"],[,,"1(?:5(?:44|66|77|88|99)|6(?:00|44|6[16]|70|88))\\d{4}","\\d{8}",,,"15441234"],,,[,,"NA","NA"]],KW:[,[,,"[12569]\\d{6,7}","\\d{7,8}"],[,,"(?:18\\d|2(?:[23]\\d{2}|4(?:[1-35-9]\\d|44)|5(?:0[034]|[2-46]\\d|5[1-3]|7[1-7])))\\d{4}","\\d{7,8}",,,"22345678"],[,,"(?:5(?:1[0-5]|[05]\\d)|6(?:0[034679]|5[015-9]|6\\d|7[067]|9[0369])|9(?:0[09]|4[049]|6[069]|[79]\\d|8[08]))\\d{5}","\\d{8}",,,"50012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"KW",965,"00",,,,,,
,,[[,"(\\d{4})(\\d{3,4})","$1 $2",["[1269]"],"","",0],[,"(5[015]\\d)(\\d{5})","$1 $2",["5"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],KY:[,[,,"[3589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"345(?:2(?:22|44)|444|6(?:23|38|40)|7(?:4[35-79]|6[6-9]|77)|8(?:00|1[45]|25|[48]8)|9(?:14|4[035-9]))\\d{4}","\\d{7}(?:\\d{3})?",,,"3452221234"],[,,"345(?:32[1-9]|5(?:1[67]|2[5-7]|4[6-8]|76)|9(?:1[67]|2[3-9]|3[689]))\\d{4}","\\d{10}",,,"3453231234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",
,,"8002345678"],[,,"900[2-9]\\d{6}|345976\\d{4}","\\d{10}",,,"9002345678"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"KY",1,"011","1",,,"1",,,,,,[,,"345849\\d{4}","\\d{10}",,,"3458491234"],,"345",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],KZ:[,[,,"(?:33\\d|7\\d{2}|80[09])\\d{7}","\\d{10}"],[,,"33622\\d{5}|7(?:1(?:0(?:[23]\\d|4[023]|59|63)|1(?:[23]\\d|4[0-79]|59)|2(?:[23]\\d|59)|3(?:2\\d|3[1-79]|4[0-35-9]|59)|4(?:2\\d|3[013-79]|4[0-8]|5[1-79])|5(?:2\\d|3[1-8]|4[1-7]|59)|6(?:[234]\\d|5[19]|61)|72\\d|8(?:[27]\\d|3[1-46-9]|4[0-5]))|2(?:1(?:[23]\\d|4[46-9]|5[3469])|2(?:2\\d|3[0679]|46|5[12679])|3(?:[234]\\d|5[139])|4(?:2\\d|3[1235-9]|59)|5(?:[23]\\d|4[01246-8]|59|61)|6(?:2\\d|3[1-9]|4[0-4]|59)|7(?:[237]\\d|40|5[279])|8(?:[23]\\d|4[0-3]|59)|9(?:2\\d|3[124578]|59)))\\d{5}",
"\\d{10}",,,"7123456789"],[,,"7(?:0[01257]|47|6[02-4]|7[15-8]|85)\\d{7}","\\d{10}",,,"7710009998"],[,,"800\\d{7}","\\d{10}",,,"8001234567"],[,,"809\\d{7}","\\d{10}",,,"8091234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"751\\d{7}","\\d{10}",,,"7511234567"],"KZ",7,"810","8",,,"8",,"8~10",,,,[,,"NA","NA"],,,[,,"751\\d{7}","\\d{10}",,,"7511234567"],[,,"NA","NA"],,,[,,"NA","NA"]],LA:[,[,,"[2-8]\\d{7,9}","\\d{6,10}"],[,,"(?:2[13]|[35-7][14]|41|8[1468])\\d{6}","\\d{6,8}",,,"21212862"],[,,"20(?:2[2389]|5[4-689]|7[6-8]|9[57-9])\\d{6}",
"\\d{10}",,,"2023123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"LA",856,"00","0",,,"0",,,,[[,"(20)(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3 $4",["20"],"0$1","",0],[,"([2-8]\\d)(\\d{3})(\\d{3})","$1 $2 $3",["2[13]|[3-8]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],LB:[,[,,"[13-9]\\d{6,7}","\\d{7,8}"],[,,"(?:[14-6]\\d{2}|7(?:[2-579]\\d|62|8[0-7])|[89][2-9]\\d)\\d{4}","\\d{7}",,,"1123456"],[,,"(?:3\\d|7(?:[01]\\d|6[013-9]|8[89]|91))\\d{5}","\\d{7,8}",
,,"71123456"],[,,"NA","NA"],[,,"9[01]\\d{6}","\\d{8}",,,"90123456"],[,,"8[01]\\d{6}","\\d{8}",,,"80123456"],[,,"NA","NA"],[,,"NA","NA"],"LB",961,"00","0",,,"0",,,,[[,"(\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[13-6]|7(?:[2-579]|62|8[0-7])|[89][2-9]"],"0$1","",0],[,"([7-9]\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[89][01]|7(?:[01]|6[013-9]|8[89]|91)"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],LC:[,[,,"[5789]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"758(?:234|4(?:30|5[0-9]|6[2-9]|8[0-2])|572|638|758)\\d{4}",
"\\d{7}(?:\\d{3})?",,,"7582345678"],[,,"758(?:28[4-7]|384|4(?:6[01]|8[4-9])|5(?:1[89]|20|84)|7(?:1[2-9]|2[0-6]))\\d{4}","\\d{10}",,,"7582845678"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"LC",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"758",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],LI:[,[,,"6\\d{8}|[23789]\\d{6}","\\d{7,9}"],[,,"(?:2(?:01|1[27]|3\\d|6[02-578]|96)|3(?:7[0135-7]|8[048]|9[0269]))\\d{4}",
"\\d{7}",,,"2345678"],[,,"6(?:51[01]|6(?:[01][0-4]|2[016-9]|88)|710)\\d{5}|7(?:36|4[25]|56|[7-9]\\d)\\d{4}","\\d{7,9}",,,"661234567"],[,,"80(?:0(?:2[238]|79)|9\\d{2})\\d{2}","\\d{7}",,,"8002222"],[,,"90(?:0(?:2[278]|79)|1(?:23|3[012])|6(?:4\\d|6[0126]))\\d{2}","\\d{7}",,,"9002222"],[,,"NA","NA"],[,,"701\\d{4}","\\d{7}",,,"7011234"],[,,"NA","NA"],"LI",423,"00","0",,,"0",,,,[[,"(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3",["[23]|7[3-57-9]|87"],"","",0],[,"(6\\d)(\\d{3})(\\d{3})","$1 $2 $3",["6"],"","",0],[,
"(6[567]\\d)(\\d{3})(\\d{3})","$1 $2 $3",["6[567]"],"","",0],[,"(69)(7\\d{2})(\\d{4})","$1 $2 $3",["697"],"","",0],[,"([7-9]0\\d)(\\d{2})(\\d{2})","$1 $2 $3",["[7-9]0"],"","",0],[,"([89]0\\d)(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[89]0"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"87(?:0[128]|7[0-4])\\d{3}","\\d{7}",,,"8770123"],,,[,,"697(?:[35]6|4[25]|[7-9]\\d)\\d{4}","\\d{9}",,,"697361234"]],LK:[,[,,"[1-9]\\d{8}","\\d{7,9}"],[,,"(?:[189]1|2[13-7]|3[1-8]|4[157]|5[12457]|6[35-7])[2-57]\\d{6}",
"\\d{7,9}",,,"112345678"],[,,"7[125-8]\\d{7}","\\d{9}",,,"712345678"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"LK",94,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{1})(\\d{6})","$1 $2 $3",["[1-689]"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["7"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],LR:[,[,,"(?:[29]\\d|[4-6]|7\\d{1,2}|[38]\\d{2})\\d{6}","\\d{7,9}"],[,,"2\\d{7}","\\d{8}",,,"21234567"],[,,"(?:4[67]|5\\d|6[4-8]|77?\\d{2}|88\\d{2})\\d{5}",
"\\d{7,9}",,,"4612345"],[,,"NA","NA"],[,,"90\\d{6}","\\d{8}",,,"90123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"33200\\d{4}","\\d{9}",,,"332001234"],"LR",231,"00","0",,,"0",,,,[[,"([279]\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[279]"],"0$1","",0],[,"(7\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["7"],"0$1","",0],[,"([4-6])(\\d{3})(\\d{3})","$1 $2 $3",["[4-6]"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[38]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],LS:[,[,,"[2568]\\d{7}",
"\\d{8}"],[,,"2\\d{7}","\\d{8}",,,"22123456"],[,,"[56]\\d{7}","\\d{8}",,,"50123456"],[,,"800[256]\\d{4}","\\d{8}",,,"80021234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"LS",266,"00",,,,,,,,[[,"(\\d{4})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],LT:[,[,,"[3-9]\\d{7}","\\d{8}"],[,,"(?:3[1478]|4[124-6]|52)\\d{6}","\\d{8}",,,"31234567"],[,,"6\\d{7}","\\d{8}",,,"61234567"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"9(?:0[0239]|10)\\d{5}","\\d{8}",
,,"90012345"],[,,"808\\d{5}","\\d{8}",,,"80812345"],[,,"700\\d{5}","\\d{8}",,,"70012345"],[,,"NA","NA"],"LT",370,"00","8",,,"[08]",,,,[[,"([34]\\d)(\\d{6})","$1 $2",["37|4(?:1|5[45]|6[2-4])"],"(8-$1)","",1],[,"([3-6]\\d{2})(\\d{5})","$1 $2",["3[148]|4(?:[24]|6[09])|528|6"],"(8-$1)","",1],[,"([7-9]\\d{2})(\\d{2})(\\d{3})","$1 $2 $3",["[7-9]"],"8 $1","",1],[,"(5)(2\\d{2})(\\d{4})","$1 $2 $3",["52[0-79]"],"(8-$1)","",1]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"70[67]\\d{5}","\\d{8}",,,"70712345"],,,[,,"NA",
"NA"]],LU:[,[,,"[24-9]\\d{3,10}|3(?:[0-46-9]\\d{2,9}|5[013-9]\\d{1,8})","\\d{4,11}"],[,,"(?:2(?:2\\d{1,2}|3[2-9]|[67]\\d|4[1-8]\\d?|5[1-5]\\d?|9[0-24-9]\\d?)|3(?:[059][05-9]|[13]\\d|[26][015-9]|4[0-26-9]|7[0-389]|8[08])\\d?|4\\d{2,3}|5(?:[01458]\\d|[27][0-69]|3[0-3]|[69][0-7])\\d?|7(?:1[019]|2[05-9]|3[05]|[45][07-9]|[679][089]|8[06-9])\\d?|8(?:0[2-9]|1[0-36-9]|3[3-9]|[469]9|[58][7-9]|7[89])\\d?|9(?:0[89]|2[0-49]|37|49|5[0-27-9]|7[7-9]|9[0-478])\\d?)\\d{1,7}","\\d{4,11}",,,"27123456"],[,,"6[269][18]\\d{6}",
"\\d{9}",,,"628123456"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"90[01]\\d{5}","\\d{8}",,,"90012345"],[,,"801\\d{5}","\\d{8}",,,"80112345"],[,,"70\\d{6}","\\d{8}",,,"70123456"],[,,"20(?:1\\d{5}|[2-689]\\d{1,7})","\\d{4,10}",,,"20201234"],"LU",352,"00",,,,"(15(?:0[06]|1[12]|35|4[04]|55|6[26]|77|88|99)\\d)",,,,[[,"(\\d{2})(\\d{3})","$1 $2",["[2-5]|7[1-9]|[89](?:[1-9]|0[2-9])"],"","$CC $1",0],[,"(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3",["[2-5]|7[1-9]|[89](?:[1-9]|0[2-9])"],"","$CC $1",0],[,"(\\d{2})(\\d{2})(\\d{3})",
"$1 $2 $3",["20"],"","$CC $1",0],[,"(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})","$1 $2 $3 $4",["2(?:[0367]|4[3-8])"],"","$CC $1",0],[,"(\\d{2})(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3 $4",["20"],"","$CC $1",0],[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})","$1 $2 $3 $4 $5",["2(?:[0367]|4[3-8])"],"","$CC $1",0],[,"(\\d{2})(\\d{2})(\\d{2})(\\d{1,4})","$1 $2 $3 $4",["2(?:[12589]|4[12])|[3-5]|7[1-9]|[89](?:[1-9]|0[2-9])"],"","$CC $1",0],[,"(\\d{3})(\\d{2})(\\d{3})","$1 $2 $3",["[89]0[01]|70"],"","$CC $1",0],[,"(\\d{3})(\\d{3})(\\d{3})",
"$1 $2 $3",["6"],"","$CC $1",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],LV:[,[,,"[2689]\\d{7}","\\d{8}"],[,,"6[3-8]\\d{6}","\\d{8}",,,"63123456"],[,,"2\\d{7}","\\d{8}",,,"21234567"],[,,"80\\d{6}","\\d{8}",,,"80123456"],[,,"90\\d{6}","\\d{8}",,,"90123456"],[,,"81\\d{6}","\\d{8}",,,"81123456"],[,,"NA","NA"],[,,"NA","NA"],"LV",371,"00",,,,,,,,[[,"([2689]\\d)(\\d{3})(\\d{3})","$1 $2 $3",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],LY:[,[,,"[25679]\\d{8}",
"\\d{7,9}"],[,,"(?:2[1345]|5[1347]|6[123479]|71)\\d{7}","\\d{7,9}",,,"212345678"],[,,"9[1-6]\\d{7}","\\d{9}",,,"912345678"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"LY",218,"00","0",,,"0",,,,[[,"([25679]\\d)(\\d{7})","$1-$2",,"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MA:[,[,,"[5689]\\d{8}","\\d{9}"],[,,"5(?:2(?:(?:[015-7]\\d|2[2-9]|3[2-57]|4[2-8]|8[235-7])\\d|9(?:0\\d|[89]0))|3(?:(?:[0-4]\\d|[57][2-9]|6[235-8]|9[3-9])\\d|8(?:0\\d|[89]0)))\\d{4}",
"\\d{9}",,,"520123456"],[,,"6(?:0[0-8]|[124-7]\\d|3[013-8]|8[01]|9[89])\\d{6}","\\d{9}",,,"650123456"],[,,"80\\d{7}","\\d{9}",,,"801234567"],[,,"89\\d{7}","\\d{9}",,,"891234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"MA",212,"00","0",,,"0",,,,[[,"([56]\\d{2})(\\d{6})","$1-$2",["5(?:2[015-7]|3[0-4])|6"],"0$1","",0],[,"([58]\\d{3})(\\d{5})","$1-$2",["5(?:2[2-489]|3[5-9])|892","5(?:2(?:[2-48]|90)|3(?:[5-79]|80))|892"],"0$1","",0],[,"(5\\d{4})(\\d{4})","$1-$2",["5(?:29|38)","5(?:29|38)[89]"],"0$1",
"",0],[,"(8[09])(\\d{7})","$1-$2",["8(?:0|9[013-9])"],"0$1","",0]],,[,,"NA","NA"],1,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MC:[,[,,"[4689]\\d{7,8}","\\d{8,9}"],[,,"9[2-47-9]\\d{6}","\\d{8}",,,"99123456"],[,,"6\\d{8}|4\\d{7}","\\d{8,9}",,,"612345678"],[,,"(?:8\\d|90)\\d{6}","\\d{8}",,,"90123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"MC",377,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[89]"],"$1","",0],[,"(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["4"],
"0$1","",0],[,"(6)(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4 $5",["6"],"0$1","",0]],,[,,"NA","NA"],,,[,,"8\\d{7}","\\d{8}"],[,,"NA","NA"],,,[,,"NA","NA"]],MD:[,[,,"[235-9]\\d{7}","\\d{8}"],[,,"(?:2(?:1[0569]|2\\d|3[015-7]|4[1-46-9]|5[0-24689]|6[2-589]|7[1-37]|9[1347-9])|5(?:33|5[257]))\\d{5}","\\d{8}",,,"22212345"],[,,"(?:562|6(?:50|7[1-6]|[089]\\d)|7(?:67|7[47-9]|[89]\\d))\\d{5}","\\d{8}",,,"65012345"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"90[056]\\d{5}","\\d{8}",,,"90012345"],[,,"808\\d{5}",
"\\d{8}",,,"80812345"],[,,"NA","NA"],[,,"3[08]\\d{6}","\\d{8}",,,"30123456"],"MD",373,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["22|3"],"0$1","",0],[,"([25-7]\\d{2})(\\d{2})(\\d{3})","$1 $2 $3",["2[13-79]|[5-7]"],"0$1","",0],[,"([89]\\d{2})(\\d{5})","$1 $2",["[89]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"8(?:03|14)\\d{5}","\\d{8}",,,"80312345"],,,[,,"NA","NA"]],ME:[,[,,"[2-9]\\d{7,8}","\\d{6,9}"],[,,"(?:20[2-8]|3(?:0[2-7]|1[35-7]|2[3567]|3[4-7])|4(?:0[237]|1[27])|5(?:0[47]|1[27]|2[378]))\\d{5}",
"\\d{6,8}",,,"30234567"],[,,"6(?:32\\d|[89]\\d{2}|7(?:[0-8]\\d|9(?:[3-9]|[0-2]\\d)))\\d{4}","\\d{8,9}",,,"67622901"],[,,"800[28]\\d{4}","\\d{8}",,,"80080002"],[,,"(?:88\\d|9(?:4[13-8]|5[16-8]))\\d{5}","\\d{8}",,,"94515151"],[,,"NA","NA"],[,,"NA","NA"],[,,"78[1-9]\\d{5}","\\d{8}",,,"78108780"],"ME",382,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[2-57-9]|6[3789]","[2-57-9]|6(?:[389]|7(?:[0-8]|9[3-9]))"],"0$1","",0],[,"(67)(9)(\\d{3})(\\d{3})","$1 $2 $3 $4",["679","679[0-2]"],"0$1",
"",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"77\\d{6}","\\d{8}",,,"77273012"],,,[,,"NA","NA"]],MF:[,[,,"[56]\\d{8}","\\d{9}"],[,,"590(?:[02][79]|13|5[0-268]|[78]7)\\d{4}","\\d{9}",,,"590271234"],[,,"690(?:0[0-7]|[1-9]\\d)\\d{4}","\\d{9}",,,"690301234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"MF",590,"00","0",,,"0",,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MG:[,[,,"[23]\\d{8}","\\d{7,9}"],[,,"20(?:2\\d{2}|4[47]\\d|5[3467]\\d|6[279]\\d|7(?:2[29]|[35]\\d)|8[268]\\d|9[245]\\d)\\d{4}",
"\\d{7,9}",,,"202123456"],[,,"3[2-49]\\d{7}","\\d{9}",,,"321234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"22\\d{7}","\\d{9}",,,"221234567"],"MG",261,"00","0",,,"0",,,,[[,"([23]\\d)(\\d{2})(\\d{3})(\\d{2})","$1 $2 $3 $4",,"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MH:[,[,,"[2-6]\\d{6}","\\d{7}"],[,,"(?:247|528|625)\\d{4}","\\d{7}",,,"2471234"],[,,"(?:235|329|45[56]|545)\\d{4}","\\d{7}",,,"2351234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,
"NA","NA"],[,,"635\\d{4}","\\d{7}",,,"6351234"],"MH",692,"011","1",,,"1",,,,[[,"(\\d{3})(\\d{4})","$1-$2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MK:[,[,,"[2-578]\\d{7}","\\d{8}"],[,,"(?:2(?:[23]\\d|5[124578]|6[01])|3(?:1[3-6]|[23][2-6]|4[2356])|4(?:[23][2-6]|4[3-6]|5[256]|6[25-8]|7[24-6]|8[4-6]))\\d{5}","\\d{6,8}",,,"22212345"],[,,"7(?:[0-25-8]\\d{2}|32\\d|421)\\d{4}","\\d{8}",,,"72345678"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"5[02-9]\\d{6}","\\d{8}",,,"50012345"],
[,,"8(?:0[1-9]|[1-9]\\d)\\d{5}","\\d{8}",,,"80123456"],[,,"NA","NA"],[,,"NA","NA"],"MK",389,"00","0",,,"0",,,,[[,"(2)(\\d{3})(\\d{4})","$1 $2 $3",["2"],"0$1","",0],[,"([347]\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[347]"],"0$1","",0],[,"([58]\\d{2})(\\d)(\\d{2})(\\d{2})","$1 $2 $3 $4",["[58]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],ML:[,[,,"[246-9]\\d{7}","\\d{8}"],[,,"(?:2(?:0(?:2[0-589]|7\\d)|1(?:2[5-7]|[3-689]\\d|7[2-4689]))|44[239]\\d)\\d{4}","\\d{8}",,,"20212345"],
[,,"[67]\\d{7}|9[0-25-9]\\d{6}","\\d{8}",,,"65012345"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"ML",223,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[246-9]"],"","",0],[,"(\\d{4})","$1",["67|74"],"","",0]],[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[246-9]","[246-9]"],"","",0]],[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MM:[,[,,"[14578]\\d{5,7}|[26]\\d{5,8}|9(?:2\\d{0,2}|[58]|3\\d|4\\d{1,2}|[679]\\d?)\\d{6}",
"\\d{5,10}"],[,,"1(?:2\\d{1,2}|[3-5]\\d|6\\d?|[89][0-6]\\d)\\d{4}|2(?:[236-9]\\d{4}|4(?:0\\d{5}|\\d{4})|5(?:1\\d{3,6}|[02-9]\\d{3,5}))|4(?:2[245-8]|[346][2-6]|5[3-5])\\d{4}|5(?:2(?:20?|[3-8])|3[2-68]|4(?:21?|[4-8])|5[23]|6[2-4]|7[2-8]|8[24-7]|9[2-7])\\d{4}|6(?:0[23]|1[2356]|[24][2-6]|3[24-6]|5[2-4]|6[2-8]|7(?:[2367]|4\\d|5\\d?|8[145]\\d)|8[245]|9[24])\\d{4}|7(?:[04][24-8]|[15][2-7]|22|3[2-4])\\d{4}|8(?:1(?:2\\d?|[3-689])|2[2-8]|3[24]|4[24-7]|5[245]|6[23])\\d{4}","\\d{5,9}",,,"1234567"],[,,"17[01]\\d{4}|9(?:2(?:[0-4]|5\\d{2})|3[136]\\d|4(?:0[0-4]\\d|[1379]\\d|[24][0-589]\\d|5\\d{2}|88)|5[0-6]|61?\\d|73\\d|8\\d|9(?:1\\d|[089]))\\d{5}",
"\\d{7,10}",,,"92123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"1333\\d{4}","\\d{8}",,,"13331234"],"MM",95,"00","0",,,"0",,,,[[,"(\\d)(\\d{3})(\\d{3,4})","$1 $2 $3",["1|2[45]"],"0$1","",0],[,"(2)(\\d{4})(\\d{4})","$1 $2 $3",["251"],"0$1","",0],[,"(\\d)(\\d{2})(\\d{3})","$1 $2 $3",["16|2"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["67|81"],"0$1","",0],[,"(\\d{2})(\\d{2})(\\d{3,4})","$1 $2 $3",["[4-8]"],"0$1","",0],[,"(9)(\\d{3})(\\d{4,5})","$1 $2 $3",["9(?:2[0-4]|[35-9]|4[13789])"],
"0$1","",0],[,"(9)(4\\d{4})(\\d{4})","$1 $2 $3",["94[0245]"],"0$1","",0],[,"(9)(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3 $4",["925"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MN:[,[,,"[12]\\d{7,9}|[57-9]\\d{7}","\\d{6,10}"],[,,"[12](?:1\\d|2(?:[1-3]\\d?|7\\d)|3[2-8]\\d{1,2}|4[2-68]\\d{1,2}|5[1-4689]\\d{1,2})\\d{5}|5[0568]\\d{6}","\\d{6,10}",,,"50123456"],[,,"(?:8[89]|9[013-9])\\d{6}","\\d{8}",,,"88123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"7[05-8]\\d{6}",
"\\d{8}",,,"75123456"],"MN",976,"001","0",,,"0",,,,[[,"([12]\\d)(\\d{2})(\\d{4})","$1 $2 $3",["[12]1"],"0$1","",0],[,"([12]2\\d)(\\d{5,6})","$1 $2",["[12]2[1-3]"],"0$1","",0],[,"([12]\\d{3})(\\d{5})","$1 $2",["[12](?:27|[3-5])","[12](?:27|[3-5]\\d)2"],"0$1","",0],[,"(\\d{4})(\\d{4})","$1 $2",["[57-9]"],"$1","",0],[,"([12]\\d{4})(\\d{4,5})","$1 $2",["[12](?:27|[3-5])","[12](?:27|[3-5]\\d)[4-9]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MO:[,[,,"[268]\\d{7}","\\d{8}"],
[,,"(?:28[2-57-9]|8[2-57-9]\\d)\\d{5}","\\d{8}",,,"28212345"],[,,"6[236]\\d{6}","\\d{8}",,,"66123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"MO",853,"00",,,,,,,,[[,"([268]\\d{3})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MP:[,[,,"[5689]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"670(?:2(?:3[3-7]|56|8[5-8])|32[1238]|4(?:33|8[348])|5(?:32|55|88)|6(?:64|70|82)|78[589]|8[3-9]8|989)\\d{4}","\\d{7}(?:\\d{3})?",,,"6702345678"],[,,"670(?:2(?:3[3-7]|56|8[5-8])|32[1238]|4(?:33|8[348])|5(?:32|55|88)|6(?:64|70|82)|78[589]|8[3-9]8|989)\\d{4}",
"\\d{7}(?:\\d{3})?",,,"6702345678"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"MP",1,"011","1",,,"1",,,1,,,[,,"NA","NA"],,"670",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MQ:[,[,,"[56]\\d{8}","\\d{9}"],[,,"596(?:0[2-5]|[12]0|3[05-9]|4[024-8]|[5-7]\\d|89|9[4-8])\\d{4}","\\d{9}",,,"596301234"],[,,"696(?:[0-479]\\d|5[01]|8[0-689])\\d{4}","\\d{9}",,,"696201234"],
[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"MQ",596,"00","0",,,"0",,,,[[,"(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MR:[,[,,"[2-48]\\d{7}","\\d{8}"],[,,"25[08]\\d{5}|35\\d{6}|45[1-7]\\d{5}","\\d{8}",,,"35123456"],[,,"(?:2(?:2\\d|70)|3(?:3\\d|6[1-36]|7[1-3])|4(?:4\\d|6[0457-9]|7[4-9]|8[01346-8]))\\d{5}","\\d{8}",,,"22123456"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"NA","NA"],[,,"NA","NA"],
[,,"NA","NA"],[,,"NA","NA"],"MR",222,"00",,,,,,,,[[,"([2-48]\\d)(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MS:[,[,,"[5689]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"664491\\d{4}","\\d{7}(?:\\d{3})?",,,"6644912345"],[,,"66449[2-6]\\d{4}","\\d{10}",,,"6644923456"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],
[,,"NA","NA"],"MS",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"664",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MT:[,[,,"[2357-9]\\d{7}","\\d{8}"],[,,"2(?:0(?:1[0-6]|[69]\\d)|[1-357]\\d{2})\\d{4}","\\d{8}",,,"21001234"],[,,"(?:7(?:210|[79]\\d{2})|9(?:2(?:1[01]|31)|696|8(?:1[1-3]|89|97)|9\\d{2}))\\d{4}","\\d{8}",,,"96961234"],[,,"800[3467]\\d{4}","\\d{8}",,,"80071234"],[,,"5(?:0(?:0(?:37|43)|6\\d{2}|70\\d|9[0168])|[12]\\d0[1-5])\\d{3}","\\d{8}",,,"50037123"],[,,"NA","NA"],[,,"NA","NA"],[,,"3550\\d{4}",
"\\d{8}",,,"35501234"],"MT",356,"00",,,,,,,,[[,"(\\d{4})(\\d{4})","$1 $2",,"","",0]],,[,,"7117\\d{4}","\\d{8}",,,"71171234"],,,[,,"NA","NA"],[,,"501\\d{5}","\\d{8}",,,"50112345"],,,[,,"NA","NA"]],MU:[,[,,"[2-9]\\d{6,7}","\\d{7,8}"],[,,"(?:2(?:[03478]\\d|1[0-7]|6[1-69])|4(?:[013568]\\d|2[4-7])|5(44\\d|471)|6\\d{2}|8(?:14|3[129]))\\d{4}","\\d{7,8}",,,"2012345"],[,,"5(?:2[59]\\d|4(?:2[1-389]|4\\d|7[1-9]|9\\d)|7\\d{2}|8(?:[256]\\d|7[15-8])|9[0-8]\\d)\\d{4}","\\d{8}",,,"52512345"],[,,"80[012]\\d{4}","\\d{7}",
,,"8001234"],[,,"30\\d{5}","\\d{7}",,,"3012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"3(?:20|9\\d)\\d{4}","\\d{7}",,,"3201234"],"MU",230,"0(?:0|[2-7]0|33)",,,,,,"020",,[[,"([2-46-9]\\d{2})(\\d{4})","$1 $2",["[2-46-9]"],"","",0],[,"(5\\d{3})(\\d{4})","$1 $2",["5"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MV:[,[,,"[3467]\\d{6}|9(?:00\\d{7}|\\d{6})","\\d{7,10}"],[,,"(?:3(?:0[01]|3[0-59])|6(?:[567][02468]|8[024689]|90))\\d{4}","\\d{7}",,,"6701234"],[,,"(?:46[46]|7[3-9]\\d|9[16-9]\\d)\\d{4}",
"\\d{7}",,,"7712345"],[,,"NA","NA"],[,,"900\\d{7}","\\d{10}",,,"9001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"MV",960,"0(?:0|19)",,,,,,"00",,[[,"(\\d{3})(\\d{4})","$1-$2",["[3467]|9(?:[1-9]|0[1-9])"],"","",0],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["900"],"","",0]],,[,,"781\\d{4}","\\d{7}",,,"7812345"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MW:[,[,,"(?:1(?:\\d{2})?|[2789]\\d{2})\\d{6}","\\d{7,9}"],[,,"(?:1[2-9]|21\\d{2})\\d{5}","\\d{7,9}",,,"1234567"],[,,"(?:111|77\\d|88\\d|99\\d)\\d{6}",
"\\d{9}",,,"991234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"MW",265,"00","0",,,"0",,,,[[,"(\\d)(\\d{3})(\\d{3})","$1 $2 $3",["1"],"0$1","",0],[,"(2\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["2"],"0$1","",0],[,"(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[1789]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MX:[,[,,"[1-9]\\d{9,10}","\\d{7,11}"],[,,"(?:33|55|81)\\d{8}|(?:2(?:2[2-9]|3[1-35-8]|4[13-9]|7[1-689]|8[1-578]|9[467])|3(?:1[1-79]|[2458][1-9]|7[1-8]|9[1-5])|4(?:1[1-57-9]|[24-6][1-9]|[37][1-8]|8[1-35-9]|9[2-689])|5(?:88|9[1-79])|6(?:1[2-68]|[234][1-9]|5[1-3689]|6[12457-9]|7[1-7]|8[67]|9[4-8])|7(?:[13467][1-9]|2[1-8]|5[13-9]|8[1-69]|9[17])|8(?:2[13-689]|3[1-6]|4[124-6]|6[1246-9]|7[1-378]|9[12479])|9(?:1[346-9]|2[1-4]|3[2-46-8]|5[1348]|[69][1-9]|7[12]|8[1-8]))\\d{7}",
"\\d{7,10}",,,"2221234567"],[,,"1(?:(?:33|55|81)\\d{8}|(?:2(?:2[2-9]|3[1-35-8]|4[13-9]|7[1-689]|8[1-578]|9[467])|3(?:1[1-79]|[2458][1-9]|7[1-8]|9[1-5])|4(?:1[1-57-9]|[24-6][1-9]|[37][1-8]|8[1-35-9]|9[2-689])|5(?:88|9[1-79])|6(?:1[2-68]|[2-4][1-9]|5[1-3689]|6[12457-9]|7[1-7]|8[67]|9[4-8])|7(?:[13467][1-9]|2[1-8]|5[13-9]|8[1-69]|9[17])|8(?:2[13-689]|3[1-6]|4[124-6]|6[1246-9]|7[1-378]|9[12479])|9(?:1[346-9]|2[1-4]|3[2-46-8]|5[1348]|[69][1-9]|7[12]|8[1-8]))\\d{7})","\\d{11}",,,"12221234567"],[,,"800\\d{7}",
"\\d{10}",,,"8001234567"],[,,"900\\d{7}","\\d{10}",,,"9001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"MX",52,"0[09]","01",,,"0[12]|04[45](\\d{10})","1$1",,,[[,"([358]\\d)(\\d{4})(\\d{4})","$1 $2 $3",["33|55|81"],"01 $1","",1],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["[2467]|3[12457-9]|5[89]|8[02-9]|9[0-35-9]"],"01 $1","",1],[,"(1)([358]\\d)(\\d{4})(\\d{4})","044 $2 $3 $4",["1(?:33|55|81)"],"$1","",1],[,"(1)(\\d{3})(\\d{3})(\\d{4})","044 $2 $3 $4",["1(?:[2467]|3[12457-9]|5[89]|8[2-9]|9[1-35-9])"],
"$1","",1]],[[,"([358]\\d)(\\d{4})(\\d{4})","$1 $2 $3",["33|55|81","33|55|81"],"01 $1","",1],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["[2467]|3[12457-9]|5[89]|8[02-9]|9[0-35-9]","[2467]|3[12457-9]|5[89]|8[02-9]|9[0-35-9]"],"01 $1","",1],[,"(1)([358]\\d)(\\d{4})(\\d{4})","$1 $2 $3 $4",["1(?:33|55|81)"]],[,"(1)(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3 $4",["1(?:[2467]|3[12457-9]|5[89]|8[2-9]|9[1-35-9])"]]],[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],MY:[,[,,"[13-9]\\d{7,9}","\\d{6,10}"],
[,,"(?:3[2-9]\\d|[4-9][2-9])\\d{6}","\\d{6,9}",,,"323456789"],[,,"1(?:1[1-3]\\d{2}|[02-4679][2-9]\\d|59\\d{2}|8(?:1[23]|[2-9]\\d))\\d{5}","\\d{9,10}",,,"123456789"],[,,"1[38]00\\d{6}","\\d{10}",,,"1300123456"],[,,"1600\\d{6}","\\d{10}",,,"1600123456"],[,,"NA","NA"],[,,"1700\\d{6}","\\d{10}",,,"1700123456"],[,,"154\\d{7}","\\d{10}",,,"1541234567"],"MY",60,"00","0",,,"0",,,,[[,"([4-79])(\\d{3})(\\d{4})","$1-$2 $3",["[4-79]"],"0$1","",0],[,"(3)(\\d{4})(\\d{4})","$1-$2 $3",["3"],"0$1","",0],[,"([18]\\d)(\\d{3})(\\d{3,4})",
"$1-$2 $3",["1[02-46-9][1-9]|8"],"0$1","",0],[,"(1)([36-8]00)(\\d{2})(\\d{4})","$1-$2-$3-$4",["1[36-8]0"],"","",0],[,"(11)(\\d{4})(\\d{4})","$1-$2 $3",["11"],"0$1","",0],[,"(15[49])(\\d{3})(\\d{4})","$1-$2 $3",["15"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],MZ:[,[,,"[28]\\d{7,8}","\\d{8,9}"],[,,"2(?:[1346]\\d|5[0-2]|[78][12]|93)\\d{5}","\\d{8}",,,"21123456"],[,,"8[246]\\d{7}","\\d{9}",,,"821234567"],[,,"800\\d{6}","\\d{9}",,,"800123456"],[,,"NA","NA"],[,,"NA","NA"],
[,,"NA","NA"],[,,"NA","NA"],"MZ",258,"00",,,,,,,,[[,"([28]\\d)(\\d{3})(\\d{3,4})","$1 $2 $3",["2|8[246]"],"","",0],[,"(80\\d)(\\d{3})(\\d{3})","$1 $2 $3",["80"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],NA:[,[,,"[68]\\d{7,8}","\\d{8,9}"],[,,"6(?:1(?:17|2(?:[0189]\\d|[2-6]|7\\d?)|3(?:[01378]|2\\d)|4[01]|69|7[014])|2(?:17|5(?:[0-36-8]|4\\d?)|69|70)|3(?:17|2(?:[0237]\\d?|[14-689])|34|6[29]|7[01]|81)|4(?:17|2(?:[012]|7?)|4(?:[06]|1\\d)|5(?:[01357]|[25]\\d?)|69|7[01])|5(?:17|2(?:[0459]|[23678]\\d?)|69|7[01])|6(?:17|2(?:5|6\\d?)|38|42|69|7[01])|7(?:17|2(?:[569]|[234]\\d?)|3(?:0\\d?|[13])|69|7[01]))\\d{4}",
"\\d{8,9}",,,"61221234"],[,,"(?:60|8[125])\\d{7}","\\d{9}",,,"811234567"],[,,"NA","NA"],[,,"8701\\d{5}","\\d{9}",,,"870123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"8(3\\d{2}|86)\\d{5}","\\d{8,9}",,,"88612345"],"NA",264,"00","0",,,"0",,,,[[,"(8\\d)(\\d{3})(\\d{4})","$1 $2 $3",["8[1235]"],"0$1","",0],[,"(6\\d)(\\d{2,3})(\\d{4})","$1 $2 $3",["6"],"0$1","",0],[,"(88)(\\d{3})(\\d{3})","$1 $2 $3",["88"],"0$1","",0],[,"(870)(\\d{3})(\\d{3})","$1 $2 $3",["870"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,
"NA","NA"],,,[,,"NA","NA"]],NC:[,[,,"[2-57-9]\\d{5}","\\d{6}"],[,,"(?:2[03-9]|3[0-5]|4[1-7]|88)\\d{4}","\\d{6}",,,"201234"],[,,"(?:5[0-4]|[79]\\d|8[0-79])\\d{4}","\\d{6}",,,"751234"],[,,"NA","NA"],[,,"36\\d{4}","\\d{6}",,,"366711"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"NC",687,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})","$1.$2.$3",["[2-46-9]|5[0-4]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],NE:[,[,,"[0289]\\d{7}","\\d{8}"],[,,"2(?:0(?:20|3[1-7]|4[134]|5[14]|6[14578]|7[1-578])|1(?:4[145]|5[14]|6[14-68]|7[169]|88))\\d{4}",
"\\d{8}",,,"20201234"],[,,"(?:89|9[0-46-9])\\d{6}","\\d{8}",,,"93123456"],[,,"08\\d{6}","\\d{8}",,,"08123456"],[,,"09\\d{6}","\\d{8}",,,"09123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"NE",227,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[289]|09"],"","",0],[,"(08)(\\d{3})(\\d{3})","$1 $2 $3",["08"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],NF:[,[,,"[13]\\d{5}","\\d{5,6}"],[,,"(?:1(?:06|17|28|39)|3[012]\\d)\\d{3}","\\d{5,6}",,,"106609"],[,
,"38\\d{4}","\\d{5,6}",,,"381234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"NF",672,"00",,,,,,,,[[,"(\\d{2})(\\d{4})","$1 $2",["1"],"","",0],[,"(\\d)(\\d{5})","$1 $2",["3"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],NG:[,[,,"[1-69]\\d{5,8}|[78]\\d{5,13}","\\d{5,14}"],[,,"[12]\\d{6,7}|9\\d{7}|(?:3\\d|4[023568]|5[02368]|6[02-469]|7[4-69]|8[2-9])\\d{6}|(?:4[47]|5[14579]|6[1578]|7[0-357])\\d{5,6}|(?:78|41)\\d{5}","\\d{5,9}",,,"12345678"],[,,"(?:1(?:7[34]\\d|8(?:04|[124579]\\d|8[0-3])|95\\d)|287[0-7]|3(?:18[1-8]|88[0-7]|9(?:8[5-9]|6[1-5]))|4(?:28[0-2]|6(?:7[1-9]|8[02-47])|88[0-2])|5(?:2(?:7[7-9]|8\\d)|38[1-79]|48[0-7]|68[4-7])|6(?:2(?:7[7-9]|8\\d)|4(?:3[7-9]|[68][129]|7[04-69]|9[1-8])|58[0-2]|98[7-9])|7(?:38[0-7]|69[1-8]|78[2-4])|8(?:28[3-9]|38[0-2]|4(?:2[12]|3[147-9]|5[346]|7[4-9]|8[014-689]|90)|58[1-8]|78[2-9]|88[5-7])|98[07]\\d)\\d{4}|(?:70(?:[13-9]\\d|2[1-9])|8(?:0[2-9]|1\\d)\\d)\\d{6}",
"\\d{8,10}",,,"8021234567"],[,,"800\\d{7,11}","\\d{10,14}",,,"80017591759"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"NG",234,"009","0",,,"0",,,,[[,"([129])(\\d{3})(\\d{3,4})","$1 $2 $3",["[129]"],"0$1","",0],[,"([3-8]\\d)(\\d{3})(\\d{2,3})","$1 $2 $3",["[3-6]|7(?:[1-79]|0[1-9])|8[2-9]"],"0$1","",0],[,"([78]\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["70|8[01]"],"0$1","",0],[,"([78]00)(\\d{4})(\\d{4,5})","$1 $2 $3",["[78]00"],"0$1","",0],[,"([78]00)(\\d{5})(\\d{5,6})","$1 $2 $3",["[78]00"],
"0$1","",0],[,"(78)(\\d{2})(\\d{3})","$1 $2 $3",["78"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"700\\d{7,11}","\\d{10,14}",,,"7001234567"],,,[,,"NA","NA"]],NI:[,[,,"[1258]\\d{7}","\\d{8}"],[,,"2\\d{7}","\\d{8}",,,"21234567"],[,,"5500\\d{4}|8\\d{7}","\\d{8}",,,"81234567"],[,,"1800\\d{4}","\\d{8}",,,"18001234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"NI",505,"00",,,,,,,,[[,"(\\d{4})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],NL:[,
[,,"1\\d{4,8}|[2-7]\\d{8}|[89]\\d{6,9}","\\d{5,10}"],[,,"(?:1[0135-8]|2[02-69]|3[0-68]|4[0135-9]|[57]\\d|8[478])\\d{7}","\\d{9}",,,"101234567"],[,,"6[1-58]\\d{7}","\\d{9}",,,"612345678"],[,,"800\\d{4,7}","\\d{7,10}",,,"8001234"],[,,"90[069]\\d{4,7}","\\d{7,10}",,,"9061234"],[,,"NA","NA"],[,,"NA","NA"],[,,"85\\d{7}","\\d{9}",,,"851234567"],"NL",31,"00","0",,,"0",,,,[[,"([1-578]\\d)(\\d{3})(\\d{4})","$1 $2 $3",["1[035]|2[0346]|3[03568]|4[0356]|5[0358]|7|8[4578]"],"0$1","",0],[,"([1-5]\\d{2})(\\d{3})(\\d{3})",
"$1 $2 $3",["1[16-8]|2[259]|3[124]|4[17-9]|5[124679]"],"0$1","",0],[,"(6)(\\d{8})","$1 $2",["6[0-57-9]"],"0$1","",0],[,"(66)(\\d{7})","$1 $2",["66"],"0$1","",0],[,"(14)(\\d{3,4})","$1 $2",["14"],"$1","",0],[,"([89]0\\d)(\\d{4,7})","$1 $2",["80|9"],"0$1","",0]],,[,,"66\\d{7}","\\d{9}",,,"662345678"],,,[,,"14\\d{3,4}","\\d{5,6}"],[,,"140(?:1(?:[035]|[16-8]\\d)|2(?:[0346]|[259]\\d)|3(?:[03568]|[124]\\d)|4(?:[0356]|[17-9]\\d)|5(?:[0358]|[124679]\\d)|7\\d|8[458])","\\d{5,6}",,,"14020"],,,[,,"NA","NA"]],
NO:[,[,,"0\\d{4}|[2-9]\\d{7}","\\d{5}(?:\\d{3})?"],[,,"(?:2[1-4]|3[1-3578]|5[1-35-7]|6[1-4679]|7[0-8])\\d{6}","\\d{8}",,,"21234567"],[,,"(?:4[015-8]|5[89]|9\\d)\\d{6}","\\d{8}",,,"41234567"],[,,"80[01]\\d{5}","\\d{8}",,,"80012345"],[,,"82[09]\\d{5}","\\d{8}",,,"82012345"],[,,"810(?:0[0-6]|[2-8]\\d)\\d{3}","\\d{8}",,,"81021234"],[,,"880\\d{5}","\\d{8}",,,"88012345"],[,,"85[0-5]\\d{5}","\\d{8}",,,"85012345"],"NO",47,"00",,,,,,,,[[,"([489]\\d{2})(\\d{2})(\\d{3})","$1 $2 $3",["[489]"],"","",0],[,"([235-7]\\d)(\\d{2})(\\d{2})(\\d{2})",
"$1 $2 $3 $4",["[235-7]"],"","",0]],,[,,"NA","NA"],1,,[,,"NA","NA"],[,,"0\\d{4}|81(?:0(?:0[7-9]|1\\d)|5\\d{2})\\d{3}","\\d{5}(?:\\d{3})?",,,"01234"],1,,[,,"81[23]\\d{5}","\\d{8}",,,"81212345"]],NP:[,[,,"[1-8]\\d{7}|9(?:[1-69]\\d{6}|7[2-6]\\d{5,7}|8\\d{8})","\\d{6,10}"],[,,"(?:1[0124-6]|2[13-79]|3[135-8]|4[146-9]|5[135-7]|6[13-9]|7[15-9]|8[1-46-9]|9[1-79])\\d{6}","\\d{6,8}",,,"14567890"],[,,"9(?:7[45]|8[01456])\\d{7}","\\d{10}",,,"9841234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],
[,,"NA","NA"],"NP",977,"00","0",,,"0",,,,[[,"(1)(\\d{7})","$1-$2",["1[2-6]"],"0$1","",0],[,"(\\d{2})(\\d{6})","$1-$2",["1[01]|[2-8]|9(?:[1-69]|7[15-9])"],"0$1","",0],[,"(9\\d{2})(\\d{7})","$1-$2",["9(?:7[45]|8)"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],NR:[,[,,"[458]\\d{6}","\\d{7}"],[,,"(?:444|888)\\d{4}","\\d{7}",,,"4441234"],[,,"55[5-9]\\d{4}","\\d{7}",,,"5551234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"NR",674,"00",,,,,,,,[[,"(\\d{3})(\\d{4})",
"$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],NU:[,[,,"[1-5]\\d{3}","\\d{4}"],[,,"[34]\\d{3}","\\d{4}",,,"4002"],[,,"[125]\\d{3}","\\d{4}",,,"1234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"NU",683,"00",,,,,,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],NZ:[,[,,"6[235-9]\\d{6}|[2-57-9]\\d{7,10}","\\d{7,11}"],[,,"(?:3[2-79]|[49][2-689]|6[235-9]|7[2-5789])\\d{6}|24099\\d{3}","\\d{7,8}",,,"32345678"],[,,"2(?:[028]\\d{7,8}|1(?:0\\d{5,7}|[12]\\d{5,6}|[3-9]\\d{5})|[79]\\d{7})",
"\\d{8,10}",,,"211234567"],[,,"508\\d{6,7}|80\\d{6,8}","\\d{8,10}",,,"800123456"],[,,"90\\d{7,9}","\\d{9,11}",,,"900123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"NZ",64,"0(?:0|161)","0",,,"0",,"00",,[[,"([34679])(\\d{3})(\\d{4})","$1-$2 $3",["[3467]|9[1-9]"],"0$1","",0],[,"(24099)(\\d{3})","$1 $2",["240","2409","24099"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["21"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["2(?:1[1-9]|[69]|7[0-35-9])|86"],"0$1","",0],[,"(2\\d)(\\d{3,4})(\\d{4})",
"$1 $2 $3",["2[028]"],"0$1","",0],[,"(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["2(?:10|74)|5|[89]0"],"0$1","",0]],,[,,"[28]6\\d{6,7}","\\d{8,9}",,,"26123456"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],OM:[,[,,"(?:2[2-6]|5|9[1-9])\\d{6}|800\\d{5,6}","\\d{7,9}"],[,,"2[2-6]\\d{6}","\\d{8}",,,"23123456"],[,,"9[1-9]\\d{6}","\\d{8}",,,"92123456"],[,,"8007\\d{4,5}|500\\d{4}","\\d{7,9}",,,"80071234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"OM",968,"00",,,,,,,,[[,"(2\\d)(\\d{6})","$1 $2",
["2"],"","",0],[,"(9\\d{3})(\\d{4})","$1 $2",["9"],"","",0],[,"([58]00)(\\d{4,6})","$1 $2",["[58]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],PA:[,[,,"[1-9]\\d{6,7}","\\d{7,8}"],[,,"(?:1(?:0[02-579]|19|2[37]|3[03]|4[479]|57|65|7[016-8]|8[58]|9[134])|2(?:[0235679]\\d|1[0-7]|4[04-9]|8[028])|3(?:0[0-7]|1[14-7]|2[0-3]|3[03]|4[0457]|5[56]|6[068]|7[078]|80|9\\d)|4(?:3[013-59]|4\\d|7[0-689])|5(?:[01]\\d|2[0-7]|[56]0|79)|7(?:0[09]|2[0-267]|[349]0|5[6-9]|7[0-24-7]|8[89])|8(?:[34]\\d|5[0-4]|8[02])|9(?:0[78]|1[0178]|2[0378]|3[379]|40|5[0489]|6[06-9]|7[046-9]|8[36-8]|9[1-9]))\\d{4}",
"\\d{7}",,,"2001234"],[,,"(?:1[16]1|21[89]|8(?:1[01]|7[23]))\\d{4}|6(?:[04-9]\\d|1[0-5]|2[0-7]|3[5-9])\\d{5}","\\d{7,8}",,,"60012345"],[,,"80[09]\\d{4}","\\d{7}",,,"8001234"],[,,"(?:779|8(?:2[235]|55|60|7[578]|86|95)|9(?:0[0-2]|81))\\d{4}","\\d{7}",,,"8601234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"PA",507,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1-$2",["[1-57-9]"],"","",0],[,"(\\d{4})(\\d{4})","$1-$2",["6"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],PE:[,[,,"[14-9]\\d{7,8}",
"\\d{6,9}"],[,,"(?:1\\d|4[1-4]|5[1-46]|6[1-7]|7[2-46]|8[2-4])\\d{6}","\\d{6,8}",,,"11234567"],[,,"9\\d{8}","\\d{9}",,,"912345678"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"805\\d{5}","\\d{8}",,,"80512345"],[,,"801\\d{5}","\\d{8}",,,"80112345"],[,,"80[24]\\d{5}","\\d{8}",,,"80212345"],[,,"NA","NA"],"PE",51,"19(?:1[124]|77|90)00","0"," Anexo ",,"0",,,,[[,"(1)(\\d{7})","$1 $2",["1"],"(0$1)","",0],[,"([4-8]\\d)(\\d{6})","$1 $2",["[4-7]|8[2-4]"],"(0$1)","",0],[,"(\\d{3})(\\d{5})","$1 $2",["80"],"(0$1)",
"",0],[,"(9\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["9"],"$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],PF:[,[,,"[2-79]\\d{5}|8\\d{5,7}","\\d{6}(?:\\d{2})?"],[,,"(?:4(?:[02-9]\\d|1[02-9])|[5689]\\d{2})\\d{3}","\\d{6}",,,"401234"],[,,"(?:[27]\\d{2}|3[0-79]\\d|411|89\\d{3})\\d{3}","\\d{6}(?:\\d{2})?",,,"212345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"PF",689,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["89"],"","",0],[,"(\\d{2})(\\d{2})(\\d{2})",
"$1 $2 $3",,"","",0]],,[,,"NA","NA"],,,[,,"44\\d{4}","\\d{6}",,,"441234"],[,,"NA","NA"],,,[,,"NA","NA"]],PG:[,[,,"[1-9]\\d{6,7}","\\d{7,8}"],[,,"(?:3[0-2]\\d|4[25]\\d|5[34]\\d|64[1-9]|77(?:[0-24]\\d|30)|85[02-46-9]|9[78]\\d)\\d{4}","\\d{7}",,,"3123456"],[,,"(?:68|7(?:[0-369]\\d|75))\\d{5}","\\d{7,8}",,,"6812345"],[,,"180\\d{4}","\\d{7}",,,"1801234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"275\\d{4}","\\d{7}",,,"2751234"],"PG",675,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",["[1-689]"],"","",0],
[,"(7\\d{3})(\\d{4})","$1 $2",["7"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],PH:[,[,,"2\\d{5,7}|[3-9]\\d{7,9}|1800\\d{7,9}","\\d{5,13}"],[,,"2\\d{5}(?:\\d{2})?|(?:3[2-68]|4[2-9]|5[2-6]|6[2-58]|7[24578]|8[2-8])\\d{7}|88(?:22\\d{6}|42\\d{4})","\\d{5,10}",,,"21234567"],[,,"(?:81[37]|9(?:0[5-9]|1[025-9]|2[0-35-9]|3[02-9]|4[236-9]|7[3479]|89|9[46-9]))\\d{7}","\\d{10}",,,"9051234567"],[,,"1800\\d{7,9}","\\d{11,13}",,,"180012345678"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],
[,,"NA","NA"],"PH",63,"00","0",,,"0",,,,[[,"(2)(\\d{3})(\\d{4})","$1 $2 $3",["2"],"(0$1)","",0],[,"(2)(\\d{5})","$1 $2",["2"],"(0$1)","",0],[,"(\\d{4})(\\d{4,6})","$1 $2",["3(?:23|39|46)|4(?:2[3-6]|[35]9|4[26]|76)|5(?:22|44)|642|8(?:62|8[245])","3(?:230|397|461)|4(?:2(?:35|[46]4|51)|396|4(?:22|63)|59[347]|76[15])|5(?:221|446)|642[23]|8(?:622|8(?:[24]2|5[13]))"],"(0$1)","",0],[,"(\\d{5})(\\d{4})","$1 $2",["346|4(?:27|9[35])|883","3469|4(?:279|9(?:30|56))|8834"],"(0$1)","",0],[,"([3-8]\\d)(\\d{3})(\\d{4})",
"$1 $2 $3",["[3-8]"],"(0$1)","",0],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["81|9"],"0$1","",0],[,"(1800)(\\d{3})(\\d{4})","$1 $2 $3",["1"],"","",0],[,"(1800)(\\d{1,2})(\\d{3})(\\d{4})","$1 $2 $3 $4",["1"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],PK:[,[,,"1\\d{8}|[2-8]\\d{5,11}|9(?:[013-9]\\d{4,9}|2\\d(?:111\\d{6}|\\d{3,7}))","\\d{6,12}"],[,,"(?:21|42)[2-9]\\d{7}|(?:2[25]|4[0146-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]\\d{6}|(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:1|2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8]))[2-9]\\d{5,6}|58[126]\\d{7}",
"\\d{6,10}",,,"2123456789"],[,,"3(?:0\\d|1[1-5]|2[0-5]|[34][1-7]|55|64)\\d{7}","\\d{10}",,,"3012345678"],[,,"800\\d{5}","\\d{8}",,,"80012345"],[,,"900\\d{5}","\\d{8}",,,"90012345"],[,,"NA","NA"],[,,"122\\d{6}","\\d{9}",,,"122044444"],[,,"NA","NA"],"PK",92,"00","0",,,"0",,,,[[,"(\\d{2})(111)(\\d{3})(\\d{3})","$1 $2 $3 $4",["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)1","(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)11","(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)111"],"(0$1)",
"",0],[,"(\\d{3})(111)(\\d{3})(\\d{3})","$1 $2 $3 $4",["2[349]|45|54|60|72|8[2-5]|9[2-9]","(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d1","(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d11","(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d111"],"(0$1)","",0],[,"(\\d{2})(\\d{7,8})","$1 $2",["(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]"],"(0$1)","",0],[,"(\\d{3})(\\d{6,7})","$1 $2",["2[349]|45|54|60|72|8[2-5]|9[2-9]","(?:2[349]|45|54|60|72|8[2-5]|9[2-9])\\d[2-9]"],"(0$1)","",0],[,"(3\\d{2})(\\d{7})","$1 $2",
["3"],"0$1","",0],[,"([15]\\d{3})(\\d{5,6})","$1 $2",["58[12]|1"],"(0$1)","",0],[,"(586\\d{2})(\\d{5})","$1 $2",["586"],"(0$1)","",0],[,"([89]00)(\\d{3})(\\d{2})","$1 $2 $3",["[89]00"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"(?:2(?:[125]|3[2358]|4[2-4]|9[2-8])|4(?:[0-246-9]|5[3479])|5(?:[1-35-7]|4[2-467])|6(?:[1-8]|0[468])|7(?:[14]|2[236])|8(?:[16]|2[2-689]|3[23578]|4[3478]|5[2356])|9(?:1|22|3[27-9]|4[2-6]|6[3569]|9[2-7]))111\\d{6}","\\d{11,12}",,,"21111825888"],,,[,,"NA","NA"]],PL:[,[,,"[1-58]\\d{6,8}|9\\d{8}|[67]\\d{5,8}",
"\\d{6,9}"],[,,"(?:1[2-8]|2[2-59]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-6]|8[1-7])\\d{5,7}|77\\d{4,7}|(?:89|9[145])\\d{7}","\\d{6,9}",,,"123456789"],[,,"(?:5[013]|6[069]|7[2389]|88)\\d{7}","\\d{9}",,,"512345678"],[,,"800\\d{6}","\\d{9}",,,"800123456"],[,,"70\\d{7}","\\d{9}",,,"701234567"],[,,"801\\d{6}","\\d{9}",,,"801234567"],[,,"NA","NA"],[,,"39\\d{7}","\\d{9}",,,"391234567"],"PL",48,"00",,,,,,,,[[,"(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[124]|3[2-4]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145]"],
"","",0],[,"(\\d{2})(\\d{4,6})","$1 $2",["[124]|3[2-4]|5[24-689]|6[1-3578]|7[14-7]|8[1-7]"],"","",0],[,"(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["39|5[013]|6[0469]|7[02389]|8[08]"],"","",0],[,"(\\d{3})(\\d{2})(\\d{2,3})","$1 $2 $3",["64"],"","",0],[,"(\\d{3})(\\d{3})","$1 $2",["64"],"","",0]],,[,,"642\\d{3,6}","\\d{6,9}",,,"642123456"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],PM:[,[,,"[45]\\d{5}","\\d{6}"],[,,"41\\d{4}","\\d{6}",,,"411234"],[,,"55\\d{4}","\\d{6}",,,"551234"],[,,"NA","NA"],[,,"NA",
"NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"PM",508,"00","0",,,"0",,,,[[,"([45]\\d)(\\d{2})(\\d{2})","$1 $2 $3",,"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],PR:[,[,,"[5789]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"(?:787|939)[2-9]\\d{6}","\\d{7}(?:\\d{3})?",,,"7872345678"],[,,"(?:787|939)[2-9]\\d{6}","\\d{7}(?:\\d{3})?",,,"7872345678"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002345678"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002345678"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}",
"\\d{10}",,,"5002345678"],[,,"NA","NA"],"PR",1,"011","1",,,"1",,,1,,,[,,"NA","NA"],,"787|939",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],PS:[,[,,"[24589]\\d{7,8}|1(?:[78]\\d{8}|[49]\\d{2,3})","\\d{4,10}"],[,,"(?:22[234789]|42[45]|82[01458]|92[369])\\d{5}","\\d{7,8}",,,"22234567"],[,,"5[69]\\d{7}","\\d{9}",,,"599123456"],[,,"1800\\d{6}","\\d{10}",,,"1800123456"],[,,"1(?:4|9\\d)\\d{2}","\\d{4,5}",,,"19123"],[,,"1700\\d{6}","\\d{10}",,,"1700123456"],[,,"NA","NA"],[,,"NA","NA"],"PS",970,"00","0",,,
"0",,,,[[,"([2489])(2\\d{2})(\\d{4})","$1 $2 $3",["[2489]"],"0$1","",0],[,"(5[69]\\d)(\\d{3})(\\d{3})","$1 $2 $3",["5"],"0$1","",0],[,"(1[78]00)(\\d{3})(\\d{3})","$1 $2 $3",["1[78]"],"$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],PT:[,[,,"[2-46-9]\\d{8}","\\d{9}"],[,,"2(?:[12]\\d|[35][1-689]|4[1-59]|6[1-35689]|7[1-9]|8[1-69]|9[1256])\\d{6}","\\d{9}",,,"212345678"],[,,"9(?:[136]\\d{2}|2[0-79]\\d|480)\\d{5}","\\d{9}",,,"912345678"],[,,"80[02]\\d{6}","\\d{9}",,,"800123456"],
[,,"76(?:0[1-57]|1[2-47]|2[237])\\d{5}","\\d{9}",,,"760123456"],[,,"80(?:8\\d|9[1579])\\d{5}","\\d{9}",,,"808123456"],[,,"884[128]\\d{5}","\\d{9}",,,"884123456"],[,,"30\\d{7}","\\d{9}",,,"301234567"],"PT",351,"00",,,,,,,,[[,"(2\\d)(\\d{3})(\\d{4})","$1 $2 $3",["2[12]"],"","",0],[,"([2-46-9]\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["2[3-9]|[346-9]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"70(?:7\\d|8[17])\\d{5}","\\d{9}",,,"707123456"],,,[,,"NA","NA"]],PW:[,[,,"[2-8]\\d{6}","\\d{7}"],[,,"2552255|(?:277|345|488|5(?:35|44|87)|6(?:22|54|79)|7(?:33|47)|8(?:24|55|76))\\d{4}",
"\\d{7}",,,"2771234"],[,,"(?:6[234689]0|77[45789])\\d{4}","\\d{7}",,,"6201234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"PW",680,"01[12]",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],PY:[,[,,"5[0-5]\\d{4,7}|[2-46-9]\\d{5,8}","\\d{5,9}"],[,,"(?:[26]1|3[289]|4[124678]|7[123]|8[1236])\\d{5,7}|(?:2(?:2[4568]|7[15]|9[1-5])|3(?:18|3[167]|4[2357]|51)|4(?:18|2[45]|3[12]|5[13]|64|71|9[1-47])|5(?:[1-4]\\d|5[0234])|6(?:3[1-3]|44|7[1-4678])|7(?:17|4[0-4]|6[1-578]|75|8[0-8])|858)\\d{5,6}",
"\\d{5,9}",,,"212345678"],[,,"9(?:6[12]|[78][1-6]|9[1-5])\\d{6}","\\d{9}",,,"961456789"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"8700[0-4]\\d{4}","\\d{9}",,,"870012345"],"PY",595,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{5,7})","$1 $2",["(?:[26]1|3[289]|4[124678]|7[123]|8[1236])"],"($1)","",0],[,"(\\d{3})(\\d{3,6})","$1 $2",["[2-9]0"],"0$1","",0],[,"(\\d{3})(\\d{6})","$1 $2",["9[1-9]"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["8700"],"","",0],[,"(\\d{3})(\\d{4,6})","$1 $2",
["[2-8][1-9]"],"($1)","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"[2-9]0\\d{4,7}","\\d{6,9}",,,"201234567"],,,[,,"NA","NA"]],QA:[,[,,"[2-8]\\d{6,7}","\\d{7,8}"],[,,"4[04]\\d{6}","\\d{7,8}",,,"44123456"],[,,"[3567]\\d{7}","\\d{7,8}",,,"33123456"],[,,"800\\d{4}","\\d{7,8}",,,"8001234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"QA",974,"00",,,,,,,,[[,"([28]\\d{2})(\\d{4})","$1 $2",["[28]"],"","",0],[,"([3-7]\\d{3})(\\d{4})","$1 $2",["[3-7]"],"","",0]],,[,,"2(?:[12]\\d|61)\\d{4}","\\d{7}",
,,"2123456"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],RE:[,[,,"[268]\\d{8}","\\d{9}"],[,,"262\\d{6}","\\d{9}",,,"262161234"],[,,"6(?:9[23]|47)\\d{6}","\\d{9}",,,"692123456"],[,,"80\\d{7}","\\d{9}",,,"801234567"],[,,"89[1-37-9]\\d{6}","\\d{9}",,,"891123456"],[,,"8(?:1[019]|2[0156]|84|90)\\d{6}","\\d{9}",,,"810123456"],[,,"NA","NA"],[,,"NA","NA"],"RE",262,"00","0",,,"0",,,,[[,"([268]\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"0$1","",0]],,[,,"NA","NA"],1,"262|6[49]|8",[,,"NA","NA"],[,,"NA",
"NA"],,,[,,"NA","NA"]],RO:[,[,,"2\\d{5,8}|[37-9]\\d{8}","\\d{6,9}"],[,,"2(?:1(?:\\d{7}|9\\d{3})|[3-6](?:\\d{7}|\\d9\\d{2}))|3[13-6]\\d{7}","\\d{6,9}",,,"211234567"],[,,"7(?:000|[1-8]\\d{2}|99\\d)\\d{5}","\\d{9}",,,"712345678"],[,,"800\\d{6}","\\d{9}",,,"800123456"],[,,"90[036]\\d{6}","\\d{9}",,,"900123456"],[,,"801\\d{6}","\\d{9}",,,"801123456"],[,,"802\\d{6}","\\d{9}",,,"802123456"],[,,"NA","NA"],"RO",40,"00","0"," int ",,"0",,,,[[,"([237]\\d)(\\d{3})(\\d{4})","$1 $2 $3",["[23]1"],"0$1","",0],[,
"(21)(\\d{4})","$1 $2",["21"],"0$1","",0],[,"(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["[23][3-7]|[7-9]"],"0$1","",0],[,"(2\\d{2})(\\d{3})","$1 $2",["2[3-6]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"37\\d{7}","\\d{9}",,,"372123456"],,,[,,"NA","NA"]],RS:[,[,,"[126-9]\\d{4,11}|3(?:[0-79]\\d{3,10}|8[2-9]\\d{2,9})","\\d{5,12}"],[,,"(?:1(?:[02-9][2-9]|1[1-9])\\d|2(?:[0-24-7][2-9]\\d|[389](?:0[2-9]|[2-9]\\d))|3(?:[0-8][2-9]\\d|9(?:[2-9]\\d|0[2-9])))\\d{3,8}","\\d{5,12}",,,"10234567"],[,,"6(?:[0-689]|7\\d)\\d{6,7}",
"\\d{8,10}",,,"601234567"],[,,"800\\d{3,9}","\\d{6,12}",,,"80012345"],[,,"(?:90[0169]|78\\d)\\d{3,7}","\\d{6,12}",,,"90012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"RS",381,"00","0",,,"0",,,,[[,"([23]\\d{2})(\\d{4,9})","$1 $2",["(?:2[389]|39)0"],"0$1","",0],[,"([1-3]\\d)(\\d{5,10})","$1 $2",["1|2(?:[0-24-7]|[389][1-9])|3(?:[0-8]|9[1-9])"],"0$1","",0],[,"(6\\d)(\\d{6,8})","$1 $2",["6"],"0$1","",0],[,"([89]\\d{2})(\\d{3,9})","$1 $2",["[89]"],"0$1","",0],[,"(7[26])(\\d{4,9})","$1 $2",["7[26]"],
"0$1","",0],[,"(7[08]\\d)(\\d{4,9})","$1 $2",["7[08]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"7[06]\\d{4,10}","\\d{6,12}",,,"700123456"],,,[,,"NA","NA"]],RU:[,[,,"[3489]\\d{9}","\\d{10}"],[,,"(?:3(?:0[12]|4[1-35-79]|5[1-3]|8[1-58]|9[0145])|4(?:01|1[1356]|2[13467]|7[1-5]|8[1-7]|9[1-689])|8(?:1[1-8]|2[01]|3[13-6]|4[0-8]|5[15]|6[1-35-7]|7[1-37-9]))\\d{7}","\\d{10}",,,"3011234567"],[,,"9\\d{9}","\\d{10}",,,"9123456789"],[,,"80[04]\\d{7}","\\d{10}",,,"8001234567"],[,,"80[39]\\d{7}","\\d{10}",
,,"8091234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"RU",7,"810","8",,,"8",,"8~10",,[[,"(\\d{3})(\\d{2})(\\d{2})","$1-$2-$3",["[1-79]"],"$1","",1],[,"([3489]\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2-$3-$4",["[34689]"],"8 ($1)","",1],[,"(7\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["7"],"8 ($1)","",1]],[[,"([3489]\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2-$3-$4",["[34689]","[34689]"],"8 ($1)","",1],[,"(7\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["7","7"],"8 ($1)","",1]],[,,"NA","NA"],1,,[,,"NA","NA"],[,,"NA",
"NA"],,,[,,"NA","NA"]],RW:[,[,,"[027-9]\\d{7,8}","\\d{8,9}"],[,,"2[258]\\d{7}|06\\d{6}","\\d{8,9}",,,"250123456"],[,,"7[238]\\d{7}","\\d{9}",,,"720123456"],[,,"800\\d{6}","\\d{9}",,,"800123456"],[,,"900\\d{6}","\\d{9}",,,"900123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"RW",250,"00","0",,,"0",,,,[[,"(2\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["2"],"$1","",0],[,"([7-9]\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[7-9]"],"0$1","",0],[,"(0\\d)(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["0"],"","",0]],,[,,"NA",
"NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],SA:[,[,,"1\\d{7,8}|(?:[2-467]|92)\\d{7}|5\\d{8}|8\\d{9}","\\d{7,10}"],[,,"11\\d{7}|1?(?:2[24-8]|3[35-8]|4[3-68]|6[2-5]|7[235-7])\\d{6}","\\d{7,9}",,,"112345678"],[,,"(?:5[013-689]|811)\\d{7}","\\d{9,10}",,,"512345678"],[,,"800\\d{7}","\\d{10}",,,"8001234567"],[,,"NA","NA"],[,,"92[05]\\d{6}","\\d{9}",,,"920012345"],[,,"NA","NA"],[,,"NA","NA"],"SA",966,"00","0",,,"0",,,,[[,"([1-467])(\\d{3})(\\d{4})","$1 $2 $3",["[1-467]"],"0$1","",0],[,"(1\\d)(\\d{3})(\\d{4})",
"$1 $2 $3",["1[1-467]"],"0$1","",0],[,"(5\\d)(\\d{3})(\\d{4})","$1 $2 $3",["5"],"0$1","",0],[,"(92\\d{2})(\\d{5})","$1 $2",["92"],"$1","",0],[,"(800)(\\d{3})(\\d{4})","$1 $2 $3",["80"],"$1","",0],[,"(811)(\\d{3})(\\d{3,4})","$1 $2 $3",["81"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SB:[,[,,"[1-9]\\d{4,6}","\\d{5,7}"],[,,"(?:1[4-79]|[23]\\d|4[01]|5[03]|6[0-37])\\d{3}","\\d{5}",,,"40123"],[,,"48\\d{3}|7(?:[46-8]\\d|5[025-9]|90)\\d{4}|8[4-8]\\d{5}|9(?:[46]\\d|5[0-46-9]|7[0-689]|8[0-79]|9[0-8])\\d{4}",
"\\d{5,7}",,,"7421234"],[,,"1[38]\\d{3}","\\d{5}",,,"18123"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"5[12]\\d{3}","\\d{5}",,,"51123"],"SB",677,"0[01]",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",["[7-9]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SC:[,[,,"[24689]\\d{5,6}","\\d{6,7}"],[,,"4[2-46]\\d{5}","\\d{7}",,,"4217123"],[,,"2[5-8]\\d{5}","\\d{7}",,,"2510123"],[,,"8000\\d{2}","\\d{6}",,,"800000"],[,,"98\\d{4}","\\d{6}",,,"981234"],[,,"NA","NA"],[,,"NA","NA"],[,,"64\\d{5}",
"\\d{7}",,,"6412345"],"SC",248,"0[0-2]",,,,,,"00",,[[,"(\\d{3})(\\d{3})","$1 $2",["[89]"],"","",0],[,"(\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[246]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SD:[,[,,"[19]\\d{8}","\\d{9}"],[,,"1(?:[125]\\d|8[3567])\\d{6}","\\d{9}",,,"121231234"],[,,"9[012569]\\d{7}","\\d{9}",,,"911231234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"SD",249,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",,"0$1","",0]],
,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SE:[,[,,"[1-9]\\d{5,9}","\\d{5,10}"],[,,"1(?:0[1-8]\\d{6}|[136]\\d{5,7}|(?:2[0-35]|4[0-4]|5[0-25-9]|7[13-6]|[89]\\d)\\d{5,6})|2(?:[136]\\d{5,7}|(?:2[0-7]|4[0136-8]|5[0138]|7[018]|8[01]|9[0-57])\\d{5,6})|3(?:[356]\\d{5,7}|(?:0[0-4]|1\\d|2[0-25]|4[056]|7[0-2]|8[0-3]|9[023])\\d{5,6})|4(?:0[1-9]\\d{4,6}|[246]\\d{5,7}|(?:1[013-8]|3[0135]|5[14-79]|7[0-246-9]|8[0156]|9[0-689])\\d{5,6})|5(?:0[0-6]|[15][0-5]|2[0-68]|3[0-4]|4\\d|6[03-5]|7[013]|8[0-79]|9[01])\\d{5,6}|6(?:0[1-9]\\d{4,6}|3\\d{5,7}|(?:1[1-3]|2[0-4]|4[02-57]|5[0-37]|6[0-3]|7[0-2]|8[0247]|9[0-356])\\d{5,6})|8[1-9]\\d{5,7}|9(?:0[1-9]\\d{4,6}|(?:1[0-68]|2\\d|3[02-5]|4[0-3]|5[0-4]|[68][01]|7[0135-8])\\d{5,6})",
"\\d{5,9}",,,"8123456"],[,,"7[0236]\\d{7}","\\d{9}",,,"701234567"],[,,"20(?:0(?:0\\d{2}|[1-9](?:0\\d{1,4}|[1-9]\\d{4}))|1(?:0\\d{4}|[1-9]\\d{4,5})|[2-9]\\d{5})","\\d{6,9}",,,"20123456"],[,,"9(?:00|39|44)(?:1(?:[0-26]\\d{5}|[3-57-9]\\d{2})|2(?:[0-2]\\d{5}|[3-9]\\d{2})|3(?:[0139]\\d{5}|[24-8]\\d{2})|4(?:[045]\\d{5}|[1-36-9]\\d{2})|5(?:5\\d{5}|[0-46-9]\\d{2})|6(?:[679]\\d{5}|[0-58]\\d{2})|7(?:[078]\\d{5}|[1-69]\\d{2})|8(?:[578]\\d{5}|[0-469]\\d{2}))","\\d{7}(?:\\d{3})?",,,"9001234567"],[,,"77(?:0(?:0\\d{2}|[1-9](?:0\\d|[1-9]\\d{4}))|[1-6][1-9]\\d{5})",
"\\d{6}(?:\\d{3})?",,,"771234567"],[,,"75[1-8]\\d{6}","\\d{9}",,,"751234567"],[,,"NA","NA"],"SE",46,"00","0",,,"0",,,,[[,"(8)(\\d{2,3})(\\d{2,3})(\\d{2})","$1-$2 $3 $4",["8"],"0$1","",0],[,"([1-69]\\d)(\\d{2,3})(\\d{2})(\\d{2})","$1-$2 $3 $4",["1[013689]|2[0136]|3[1356]|4[0246]|54|6[03]|90"],"0$1","",0],[,"([1-69]\\d)(\\d{3})(\\d{2})","$1-$2 $3",["1[13689]|2[136]|3[1356]|4[0246]|54|6[03]|90"],"0$1","",0],[,"(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1-$2 $3 $4",["1[2457]|2[2457-9]|3[0247-9]|4[1357-9]|5[0-35-9]|6[124-9]|9(?:[125-8]|3[0-5]|4[0-3])"],
"0$1","",0],[,"(\\d{3})(\\d{2,3})(\\d{2})","$1-$2 $3",["1[2457]|2[2457-9]|3[0247-9]|4[1357-9]|5[0-35-9]|6[124-9]|9(?:[125-8]|3[0-5]|4[0-3])"],"0$1","",0],[,"(7\\d)(\\d{3})(\\d{2})(\\d{2})","$1-$2 $3 $4",["7"],"0$1","",0],[,"(77)(\\d{2})(\\d{2})","$1-$2$3",["7"],"0$1","",0],[,"(20)(\\d{2,3})(\\d{2})","$1-$2 $3",["20"],"0$1","",0],[,"(9[034]\\d)(\\d{2})(\\d{2})(\\d{3})","$1-$2 $3 $4",["9[034]"],"0$1","",0],[,"(9[034]\\d)(\\d{4})","$1-$2",["9[034]"],"0$1","",0]],[[,"(8)(\\d{2,3})(\\d{2,3})(\\d{2})",
"$1 $2 $3 $4",["8"]],[,"([1-69]\\d)(\\d{2,3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["1[013689]|2[0136]|3[1356]|4[0246]|54|6[03]|90"]],[,"([1-69]\\d)(\\d{3})(\\d{2})","$1 $2 $3",["1[13689]|2[136]|3[1356]|4[0246]|54|6[03]|90"]],[,"(\\d{3})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["1[2457]|2[2457-9]|3[0247-9]|4[1357-9]|5[0-35-9]|6[124-9]|9(?:[125-8]|3[0-5]|4[0-3])"]],[,"(\\d{3})(\\d{2,3})(\\d{2})","$1 $2 $3",["1[2457]|2[2457-9]|3[0247-9]|4[1357-9]|5[0-35-9]|6[124-9]|9(?:[125-8]|3[0-5]|4[0-3])"]],[,"(7\\d)(\\d{3})(\\d{2})(\\d{2})",
"$1 $2 $3 $4",["7"]],[,"(77)(\\d{2})(\\d{2})","$1 $2 $3",["7"]],[,"(20)(\\d{2,3})(\\d{2})","$1 $2 $3",["20"]],[,"(9[034]\\d)(\\d{2})(\\d{2})(\\d{3})","$1 $2 $3 $4",["9[034]"]],[,"(9[034]\\d)(\\d{4})","$1 $2",["9[034]"]]],[,,"74[02-9]\\d{6}","\\d{9}",,,"740123456"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SG:[,[,,"[36]\\d{7}|[17-9]\\d{7,10}","\\d{8,11}"],[,,"6[1-9]\\d{6}","\\d{8}",,,"61234567"],[,,"(?:8[1-7]|9[0-8])\\d{6}","\\d{8}",,,"81234567"],[,,"1?800\\d{7}","\\d{10,11}",,,"18001234567"],
[,,"1900\\d{7}","\\d{11}",,,"19001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"3[12]\\d{6}","\\d{8}",,,"31234567"],"SG",65,"0[0-3]\\d",,,,,,,,[[,"([3689]\\d{3})(\\d{4})","$1 $2",["[369]|8[1-9]"],"","",0],[,"(1[89]00)(\\d{3})(\\d{4})","$1 $2 $3",["1[89]"],"","",0],[,"(7000)(\\d{4})(\\d{3})","$1 $2 $3",["70"],"","",0],[,"(800)(\\d{3})(\\d{4})","$1 $2 $3",["80"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"7000\\d{7}","\\d{11}",,,"70001234567"],,,[,,"NA","NA"]],SH:[,[,,"[2-79]\\d{3,4}","\\d{4,5}"],[,,"2(?:[0-57-9]\\d|6[4-9])\\d{2}|(?:[2-46]\\d|7[01])\\d{2}",
"\\d{4,5}",,,"2158"],[,,"NA","NA"],[,,"NA","NA"],[,,"(?:[59]\\d|7[2-9])\\d{2}","\\d{4,5}",,,"5012"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"SH",290,"00",,,,,,,,,,[,,"NA","NA"],1,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SI:[,[,,"[1-7]\\d{6,7}|[89]\\d{4,7}","\\d{5,8}"],[,,"(?:1\\d|[25][2-8]|3[4-8]|4[24-8]|7[3-8])\\d{6}","\\d{7,8}",,,"11234567"],[,,"(?:[37][01]|4[019]|51|6[48])\\d{6}","\\d{8}",,,"31234567"],[,,"80\\d{4,6}","\\d{6,8}",,,"80123456"],[,,"90\\d{4,6}|89[1-3]\\d{2,5}","\\d{5,8}",,
,"90123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"(?:59|8[1-3])\\d{6}","\\d{8}",,,"59012345"],"SI",386,"00","0",,,"0",,,,[[,"(\\d)(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[12]|3[4-8]|4[24-8]|5[2-8]|7[3-8]"],"(0$1)","",0],[,"([3-7]\\d)(\\d{3})(\\d{3})","$1 $2 $3",["[37][01]|4[019]|51|6"],"0$1","",0],[,"([89][09])(\\d{3,6})","$1 $2",["[89][09]"],"0$1","",0],[,"([58]\\d{2})(\\d{5})","$1 $2",["59|8[1-3]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SJ:[,[,,"0\\d{4}|[4789]\\d{7}",
"\\d{5}(?:\\d{3})?"],[,,"79\\d{6}","\\d{8}",,,"79123456"],[,,"(?:4[015-8]|5[89]|9\\d)\\d{6}","\\d{8}",,,"41234567"],[,,"80[01]\\d{5}","\\d{8}",,,"80012345"],[,,"82[09]\\d{5}","\\d{8}",,,"82012345"],[,,"810(?:0[0-6]|[2-8]\\d)\\d{3}","\\d{8}",,,"81021234"],[,,"880\\d{5}","\\d{8}",,,"88012345"],[,,"85[0-5]\\d{5}","\\d{8}",,,"85012345"],"SJ",47,"00",,,,,,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"0\\d{4}|81(?:0(?:0[7-9]|1\\d)|5\\d{2})\\d{3}","\\d{5}(?:\\d{3})?",,,"01234"],1,,[,,"81[23]\\d{5}","\\d{8}",,,"81212345"]],
SK:[,[,,"[2-689]\\d{8}","\\d{9}"],[,,"[2-5]\\d{8}","\\d{9}",,,"212345678"],[,,"9(?:0[1-8]|1[0-24-9]|4[0489])\\d{6}","\\d{9}",,,"912123456"],[,,"800\\d{6}","\\d{9}",,,"800123456"],[,,"9(?:[78]\\d{7}|00\\d{6})","\\d{9}",,,"900123456"],[,,"8[5-9]\\d{7}","\\d{9}",,,"850123456"],[,,"NA","NA"],[,,"6(?:5[0-4]|9[0-6])\\d{6}","\\d{9}",,,"690123456"],"SK",421,"00","0",,,"0",,,,[[,"(2)(\\d{3})(\\d{3})(\\d{2})","$1/$2 $3 $4",["2"],"0$1","",0],[,"([3-5]\\d)(\\d{3})(\\d{2})(\\d{2})","$1/$2 $3 $4",["[3-5]"],"0$1",
"",0],[,"([689]\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[689]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"(?:8(?:00|[5-9]\\d)|9(?:00|[78]\\d))\\d{6}","\\d{9}",,,"800123456"],[,,"96\\d{7}","\\d{9}",,,"961234567"],,,[,,"NA","NA"]],SL:[,[,,"[2-578]\\d{7}","\\d{6,8}"],[,,"[235]2[2-4][2-9]\\d{4}","\\d{6,8}",,,"22221234"],[,,"(?:2[15]|3[034]|4[04]|5[05]|7[6-9]|88)\\d{6}","\\d{6,8}",,,"25123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"SL",232,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{6})",
"$1 $2",,"(0$1)","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SM:[,[,,"[05-7]\\d{7,9}","\\d{6,10}"],[,,"0549(?:8[0157-9]|9\\d)\\d{4}","\\d{6,10}",,,"0549886377"],[,,"6[16]\\d{6}","\\d{8}",,,"66661212"],[,,"NA","NA"],[,,"7[178]\\d{6}","\\d{8}",,,"71123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"5[158]\\d{6}","\\d{8}",,,"58001110"],"SM",378,"00",,,,"(?:0549)?([89]\\d{5})","0549$1",,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[5-7]"],"","",0],[,"(0549)(\\d{6})","$1 $2",["0"],
"","",0],[,"(\\d{6})","0549 $1",["[89]"],"","",0]],[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",["[5-7]","[5-7]"],"","",0],[,"(0549)(\\d{6})","($1) $2",["0"]],[,"(\\d{6})","(0549) $1",["[89]"]]],[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],SN:[,[,,"[37]\\d{8}","\\d{9}"],[,,"3(?:0(?:1[01]|80)|3(?:8[1-9]|9[2-9]))\\d{5}","\\d{9}",,,"301012345"],[,,"7(?:0(?:[01279]0|3[03]|4[05]|5[06]|6[03-5]|8[029])|6(?:1[23]|2[89]|3[3489]|4[6-9]|5\\d|6[3-9]|7[45]|8[3-8])|7\\d{2}|8(?:01|1[01]))\\d{5}",
"\\d{9}",,,"701012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"33301\\d{4}","\\d{9}",,,"333011234"],"SN",221,"00",,,,,,,,[[,"(\\d{2})(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SO:[,[,,"[1-79]\\d{6,8}","\\d{7,9}"],[,,"(?:[134]\\d|2[0-79]|5[57-9])\\d{5}","\\d{7}",,,"5522010"],[,,"(?:15\\d|2(?:4\\d|8)|6[137-9]?\\d{2}|7\\d{2}|9(?:07|[19])\\d)\\d{5}","\\d{7,9}",,,"907792024"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA",
"NA"],[,,"NA","NA"],[,,"NA","NA"],"SO",252,"00","0",,,"0",,,,[[,"(\\d)(\\d{6})","$1 $2",["2[0-79]|[13-5]"],"","",0],[,"(\\d)(\\d{7})","$1 $2",["24|[67]"],"","",0],[,"(\\d{2})(\\d{5,7})","$1 $2",["15|28|6[1378]|9"],"","",0],[,"(69\\d)(\\d{6})","$1 $2",["69"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SR:[,[,,"[2-8]\\d{5,6}","\\d{6,7}"],[,,"(?:2[1-3]|3[0-7]|4\\d|5[2-58]|68\\d)\\d{4}","\\d{6,7}",,,"211234"],[,,"(?:7[1-57]|8[1-9])\\d{5}","\\d{7}",,,"7412345"],[,,"NA","NA"],
[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"56\\d{4}","\\d{6}",,,"561234"],"SR",597,"00",,,,,,,,[[,"(\\d{3})(\\d{3})","$1-$2",["[2-4]|5[2-58]"],"","",0],[,"(\\d{2})(\\d{2})(\\d{2})","$1-$2-$3",["56"],"","",0],[,"(\\d{3})(\\d{4})","$1-$2",["[6-8]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SS:[,[,,"[19]\\d{8}","\\d{9}"],[,,"18\\d{7}","\\d{9}",,,"181234567"],[,,"(?:12|9[1257])\\d{7}","\\d{9}",,,"977123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA",
"NA"],"SS",211,"00","0",,,"0",,,,[[,"(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",,"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],ST:[,[,,"[29]\\d{6}","\\d{7}"],[,,"22\\d{5}","\\d{7}",,,"2221234"],[,,"9[89]\\d{5}","\\d{7}",,,"9812345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"ST",239,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SV:[,[,,"[267]\\d{7}|[89]\\d{6}(?:\\d{4})?","\\d{7,8}|\\d{11}"],
[,,"2[1-6]\\d{6}","\\d{8}",,,"21234567"],[,,"[67]\\d{7}","\\d{8}",,,"70123456"],[,,"800\\d{4}(?:\\d{4})?","\\d{7}(?:\\d{4})?",,,"8001234"],[,,"900\\d{4}(?:\\d{4})?","\\d{7}(?:\\d{4})?",,,"9001234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"SV",503,"00",,,,,,,,[[,"(\\d{4})(\\d{4})","$1 $2",["[267]"],"","",0],[,"(\\d{3})(\\d{4})","$1 $2",["[89]"],"","",0],[,"(\\d{3})(\\d{4})(\\d{4})","$1 $2 $3",["[89]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SX:[,[,,"[5789]\\d{9}",
"\\d{7}(?:\\d{3})?"],[,,"7215(?:4[2-8]|8[239]|9[056])\\d{4}","\\d{7}(?:\\d{3})?",,,"7215425678"],[,,"7215(?:1[02]|2\\d|5[034679]|8[014-8])\\d{4}","\\d{10}",,,"7215205678"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002123456"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002123456"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"SX",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"721",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SY:[,[,,"[1-59]\\d{7,8}","\\d{6,9}"],[,,"(?:1(?:1\\d?|4\\d|[2356])|2[1-35]|3(?:[13]\\d|4)|4[13]|5[1-3])\\d{6}",
"\\d{6,9}",,,"112345678"],[,,"9(?:22|[35][0-8]|4\\d|6[024-9]|88|9[0-489])\\d{6}","\\d{9}",,,"944567890"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"SY",963,"00","0",,,"0",,,,[[,"(\\d{2})(\\d{3})(\\d{3,4})","$1 $2 $3",["[1-5]"],"0$1","",1],[,"(9\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["9"],"0$1","",1]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],SZ:[,[,,"[027]\\d{7}","\\d{8}"],[,,"2(?:2(?:0[07]|[13]7|2[57])|3(?:0[34]|[1278]3|3[23]|[46][34])|(?:40[4-69]|67)|5(?:0[5-7]|1[6-9]|[23][78]|48|5[01]))\\d{4}",
"\\d{8}",,,"22171234"],[,,"7[6-8]\\d{6}","\\d{8}",,,"76123456"],[,,"0800\\d{4}","\\d{8}",,,"08001234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"SZ",268,"00",,,,,,,,[[,"(\\d{4})(\\d{4})","$1 $2",["[027]"],"","",0]],,[,,"NA","NA"],,,[,,"0800\\d{4}","\\d{8}",,,"08001234"],[,,"NA","NA"],1,,[,,"NA","NA"]],TA:[,[,,"8\\d{3}","\\d{4}"],[,,"8\\d{3}","\\d{4}",,,"8999"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"TA",290,"00",,,,,,,,,,[,,"NA","NA"],,,
[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TC:[,[,,"[5689]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"649(?:712|9(?:4\\d|50))\\d{4}","\\d{7}(?:\\d{3})?",,,"6497121234"],[,,"649(?:2(?:3[129]|4[1-7])|3(?:3[1-389]|4[1-7])|4[34][1-3])\\d{4}","\\d{10}",,,"6492311234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002345678"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002345678"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"64971[01]\\d{4}","\\d{10}",,,"6497101234"],"TC",1,"011","1",,,"1",
,,,,,[,,"NA","NA"],,"649",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TD:[,[,,"[2679]\\d{7}","\\d{8}"],[,,"22(?:[3789]0|5[0-5]|6[89])\\d{4}","\\d{8}",,,"22501234"],[,,"(?:6[02368]\\d|77\\d|9(?:5[0-4]|9\\d))\\d{5}","\\d{8}",,,"63012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"TD",235,"00|16",,,,,,"00",,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TG:[,[,,"[29]\\d{7}","\\d{8}"],[,,"2(?:2[2-7]|3[23]|44|55|66|77)\\d{5}",
"\\d{8}",,,"22212345"],[,,"9[0-289]\\d{6}","\\d{8}",,,"90112345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"TG",228,"00",,,,,,,,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TH:[,[,,"[2-9]\\d{7,8}|1\\d{3}(?:\\d{6})?","\\d{4}|\\d{8,10}"],[,,"(?:2[1-9]|3[2-9]|4[2-5]|5[2-6]|7[3-7])\\d{6}","\\d{8}",,,"21234567"],[,,"[89]\\d{8}","\\d{9}",,,"812345678"],[,,"1800\\d{6}","\\d{10}",,,"1800123456"],[,
,"1900\\d{6}","\\d{10}",,,"1900123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"60\\d{7}","\\d{9}",,,"601234567"],"TH",66,"00","0",,,"0",,,,[[,"(2)(\\d{3})(\\d{4})","$1 $2 $3",["2"],"0$1","",0],[,"([3-9]\\d)(\\d{3})(\\d{3,4})","$1 $2 $3",["[3-9]"],"0$1","",0],[,"(1[89]00)(\\d{3})(\\d{3})","$1 $2 $3",["1"],"$1","",0]],,[,,"NA","NA"],,,[,,"1\\d{3}","\\d{4}",,,"1100"],[,,"1\\d{3}","\\d{4}",,,"1100"],,,[,,"NA","NA"]],TJ:[,[,,"[3-59]\\d{8}","\\d{3,9}"],[,,"(?:3(?:1[3-5]|2[245]|3[12]|4[24-7]|5[25]|72)|4(?:46|74|87))\\d{6}",
"\\d{3,9}",,,"372123456"],[,,"(?:50[15]|9[0-35-9]\\d)\\d{6}","\\d{9}",,,"917123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"TJ",992,"810","8",,,"8",,"8~10",,[[,"([349]\\d{2})(\\d{2})(\\d{4})","$1 $2 $3",["[34]7|91[78]"],"(8) $1","",1],[,"([459]\\d)(\\d{3})(\\d{4})","$1 $2 $3",["4[48]|5|9(?:1[59]|[0235-9])"],"(8) $1","",1],[,"(331700)(\\d)(\\d{2})","$1 $2 $3",["331","3317","33170","331700"],"(8) $1","",1],[,"(\\d{4})(\\d)(\\d{4})","$1 $2 $3",["3[1-5]","3(?:[1245]|3(?:[02-9]|1[0-589]))"],
"(8) $1","",1]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TK:[,[,,"[2-9]\\d{3}","\\d{4}"],[,,"[2-4]\\d{3}","\\d{4}",,,"3010"],[,,"[5-9]\\d{3}","\\d{4}",,,"5190"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"TK",690,"00",,,,,,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TL:[,[,,"[2-489]\\d{6}|7\\d{6,7}","\\d{7,8}"],[,,"(?:2[1-5]|3[1-9]|4[1-4])\\d{5}","\\d{7}",,,"2112345"],[,,"7[3-8]\\d{6}","\\d{8}",,,"77212345"],[,,"80\\d{5}","\\d{7}",
,,"8012345"],[,,"90\\d{5}","\\d{7}",,,"9012345"],[,,"NA","NA"],[,,"70\\d{5}","\\d{7}",,,"7012345"],[,,"NA","NA"],"TL",670,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",["[2-489]"],"","",0],[,"(\\d{4})(\\d{4})","$1 $2",["7"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TM:[,[,,"[1-6]\\d{7}","\\d{8}"],[,,"(?:1(?:2\\d|3[1-9])|2(?:22|4[0-35-8])|3(?:22|4[03-9])|4(?:22|3[128]|4\\d|6[15])|5(?:22|5[7-9]|6[014-689]))\\d{5}","\\d{8}",,,"12345678"],[,,"6[2-8]\\d{6}","\\d{8}",,,"66123456"],
[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"TM",993,"810","8",,,"8",,"8~10",,[[,"(\\d{2})(\\d{2})(\\d{2})(\\d{2})","$1 $2-$3-$4",["12"],"(8 $1)","",0],[,"(\\d{2})(\\d{6})","$1 $2",["6"],"8 $1","",0],[,"(\\d{3})(\\d)(\\d{2})(\\d{2})","$1 $2-$3-$4",["13|[2-5]"],"(8 $1)","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TN:[,[,,"[2-57-9]\\d{7}","\\d{8}"],[,,"(?:3[012]|7\\d|81)\\d{6}","\\d{8}",,,"71234567"],[,,"(?:[259]\\d|4[0-2])\\d{6}","\\d{8}",,,"20123456"],
[,,"NA","NA"],[,,"8[028]\\d{6}","\\d{8}",,,"80123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"TN",216,"00",,,,,,,,[[,"(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TO:[,[,,"[02-8]\\d{4,6}","\\d{5,7}"],[,,"(?:2\\d|3[1-8]|4[1-4]|[56]0|7[0149]|8[05])\\d{3}","\\d{5}",,,"20123"],[,,"(?:7[578]|8[7-9])\\d{5}","\\d{7}",,,"7715123"],[,,"0800\\d{3}","\\d{7}",,,"0800222"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"TO",676,"00",
,,,,,,,[[,"(\\d{2})(\\d{3})","$1-$2",["[1-6]|7[0-4]|8[05]"],"","",0],[,"(\\d{3})(\\d{4})","$1 $2",["7[5-9]|8[7-9]"],"","",0],[,"(\\d{4})(\\d{3})","$1 $2",["0"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],TR:[,[,,"[2-589]\\d{9}|444\\d{4}","\\d{7,10}"],[,,"(?:2(?:[13][26]|[28][2468]|[45][268]|[67][246])|3(?:[13][28]|[24-6][2468]|[78][02468]|92)|4(?:[16][246]|[23578][2468]|4[26]))\\d{7}","\\d{10}",,,"2123456789"],[,,"5(?:0[1-7]|22|[34]\\d|5[1-59]|9[246])\\d{7}","\\d{10}",
,,"5012345678"],[,,"800\\d{7}","\\d{10}",,,"8001234567"],[,,"900\\d{7}","\\d{10}",,,"9001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"TR",90,"00","0",,,"0",,,,[[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["[23]|4(?:[0-35-9]|4[0-35-9])"],"(0$1)","",1],[,"(\\d{3})(\\d{3})(\\d{4})","$1 $2 $3",["[589]"],"0$1","",1],[,"(444)(\\d{1})(\\d{3})","$1 $2 $3",["444"],"","",0]],,[,,"512\\d{7}","\\d{10}",,,"5123456789"],,,[,,"444\\d{4}","\\d{7}",,,"4441444"],[,,"444\\d{4}|850\\d{7}","\\d{7,10}",,,"4441444"],
,,[,,"NA","NA"]],TT:[,[,,"[589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"868(?:2(?:01|2[1-5])|6(?:07|1[4-6]|2[1-9]|[3-6]\\d|7[0-79]|9[0-8])|82[12])\\d{4}","\\d{7}(?:\\d{3})?",,,"8682211234"],[,,"868(?:2(?:8[59]|9\\d)|3(?:0[1-9]|1[02-9]|[2-9]\\d)|4[6-9]\\d|6(?:20|78|8\\d)|7(?:1[02-9]|[02-9]\\d))\\d{4}","\\d{10}",,,"8682911234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002345678"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002345678"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,
"NA","NA"],"TT",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"868",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TV:[,[,,"[29]\\d{4,5}","\\d{5,6}"],[,,"2[02-9]\\d{3}","\\d{5}",,,"20123"],[,,"90\\d{4}","\\d{6}",,,"901234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"TV",688,"00",,,,,,,,,,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TW:[,[,,"[2-9]\\d{7,8}","\\d{8,9}"],[,,"[2-8]\\d{7,8}","\\d{8,9}",,,"21234567"],[,,"9\\d{8}","\\d{9}",,,"912345678"],[,,"800\\d{6}","\\d{9}",
,,"800123456"],[,,"900\\d{6}","\\d{9}",,,"900123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"TW",886,"0(?:0[25679]|19)","0","#",,"0",,,,[[,"([2-8])(\\d{3,4})(\\d{4})","$1 $2 $3",["[2-7]|8[1-9]"],"0$1","",0],[,"([89]\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["80|9"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],TZ:[,[,,"\\d{9}","\\d{7,9}"],[,,"2[2-8]\\d{7}","\\d{7,9}",,,"222345678"],[,,"(?:6[158]|7[1-9])\\d{7}","\\d{9}",,,"612345678"],[,,"80[08]\\d{6}","\\d{9}",,,"800123456"],
[,,"90\\d{7}","\\d{9}",,,"900123456"],[,,"8(?:40|6[01])\\d{6}","\\d{9}",,,"840123456"],[,,"NA","NA"],[,,"41\\d{7}","\\d{9}",,,"412345678"],"TZ",255,"00[056]","0",,,"0",,,,[[,"([24]\\d)(\\d{3})(\\d{4})","$1 $2 $3",["[24]"],"0$1","",0],[,"([67]\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["[67]"],"0$1","",0],[,"([89]\\d{2})(\\d{2})(\\d{4})","$1 $2 $3",["[89]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],UA:[,[,,"[3-689]\\d{8}","\\d{5,9}"],[,,"(?:3[1-8]|4[13-8]|5[1-7]|6[12459])\\d{7}",
"\\d{5,9}",,,"311234567"],[,,"(?:39|50|6[36-8]|9[1-9])\\d{7}","\\d{9}",,,"391234567"],[,,"800\\d{6}","\\d{9}",,,"800123456"],[,,"900\\d{6}","\\d{9}",,,"900123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"89\\d{7}","\\d{9}",,,"891234567"],"UA",380,"00","0",,,"0",,"0~0",,[[,"([3-689]\\d)(\\d{3})(\\d{4})","$1 $2 $3",["[38]9|4(?:[45][0-5]|87)|5(?:0|6[37]|7[37])|6[36-8]|9[1-9]","[38]9|4(?:[45][0-5]|87)|5(?:0|6(?:3[14-7]|7)|7[37])|6[36-8]|9[1-9]"],"0$1","",0],[,"([3-689]\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["3[1-8]2|4[13678]2|5(?:[12457]2|6[24])|6(?:[49]2|[12][29]|5[24])|8[0-8]|90",
"3(?:[1-46-8]2[013-9]|52)|4(?:[1378]2|62[013-9])|5(?:[12457]2|6[24])|6(?:[49]2|[12][29]|5[24])|8[0-8]|90"],"0$1","",0],[,"([3-6]\\d{3})(\\d{5})","$1 $2",["3(?:5[013-9]|[1-46-8])|4(?:[137][013-9]|6|[45][6-9]|8[4-6])|5(?:[1245][013-9]|6[0135-9]|3|7[4-6])|6(?:[49][013-9]|5[0135-9]|[12][13-8])","3(?:5[013-9]|[1-46-8](?:22|[013-9]))|4(?:[137][013-9]|6(?:[013-9]|22)|[45][6-9]|8[4-6])|5(?:[1245][013-9]|6(?:3[02389]|[015689])|3|7[4-6])|6(?:[49][013-9]|5[0135-9]|[12][13-8])"],"0$1","",0]],,[,,"NA","NA"],,
,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],UG:[,[,,"\\d{9}","\\d{5,9}"],[,,"20(?:[0147]\\d{2}|2(?:40|[5-9]\\d)|3[23]\\d|5[0-4]\\d|6[03]\\d|8[0-2]\\d)\\d{4}|[34]\\d{8}","\\d{5,9}",,,"312345678"],[,,"7(?:0[0-7]|[15789]\\d|[23]0|[46][0-4])\\d{6}","\\d{9}",,,"712345678"],[,,"800[123]\\d{5}","\\d{9}",,,"800123456"],[,,"90[123]\\d{6}","\\d{9}",,,"901123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"UG",256,"00[057]","0",,,"0",,,,[[,"(\\d{3})(\\d{6})","$1 $2",["[7-9]|20(?:[013-8]|2[5-9])|4(?:6[45]|[7-9])"],
"0$1","",0],[,"(\\d{2})(\\d{7})","$1 $2",["3|4(?:[1-5]|6[0-36-9])"],"0$1","",0],[,"(2024)(\\d{5})","$1 $2",["2024"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],US:[,[,,"[2-9]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"(?:2(?:0[1-35-9]|1[02-9]|2[4589]|3[149]|4[08]|5[1-46]|6[0279]|7[026]|8[13])|3(?:0[1-57-9]|1[02-9]|2[0135]|3[014679]|47|5[12]|6[01]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[0235]|58|69|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-37]|7[013-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[036]|3[016]|4[16]|5[017]|6[0-279]|78|8[12])|7(?:0[1-46-8]|1[02-9]|2[047]|3[1247]|4[07]|5[47]|6[02359]|7[02-59]|8[156])|8(?:0[1-68]|1[02-8]|28|3[0-25]|4[3578]|5[06-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[1678]|4[0179]|5[1246]|7[0-3589]|8[0459]))[2-9]\\d{6}",
"\\d{7}(?:\\d{3})?",,,"2015555555"],[,,"(?:2(?:0[1-35-9]|1[02-9]|2[4589]|3[149]|4[08]|5[1-46]|6[0279]|7[026]|8[13])|3(?:0[1-57-9]|1[02-9]|2[0135]|3[014679]|47|5[12]|6[01]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[0235]|58|69|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-37]|7[013-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[036]|3[016]|4[16]|5[017]|6[0-279]|78|8[12])|7(?:0[1-46-8]|1[02-9]|2[047]|3[1247]|4[07]|5[47]|6[02359]|7[02-59]|8[156])|8(?:0[1-68]|1[02-8]|28|3[0-25]|4[3578]|5[06-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[1678]|4[0179]|5[1246]|7[0-3589]|8[0459]))[2-9]\\d{6}",
"\\d{7}(?:\\d{3})?",,,"2015555555"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002345678"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002345678"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"US",1,"011","1",,,"1",,,1,[[,"(\\d{3})(\\d{4})","$1-$2",,"","",1],[,"(\\d{3})(\\d{3})(\\d{4})","($1) $2-$3",,"","",1]],[[,"(\\d{3})(\\d{3})(\\d{4})","$1-$2-$3"]],[,,"NA","NA"],1,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],UY:[,[,,"[2489]\\d{6,7}","\\d{7,8}"],[,,"2\\d{7}|4[2-7]\\d{6}",
"\\d{7,8}",,,"21231234"],[,,"9[13-9]\\d{6}","\\d{8}",,,"94231234"],[,,"80[05]\\d{4}","\\d{7}",,,"8001234"],[,,"90[0-8]\\d{4}","\\d{7}",,,"9001234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"UY",598,"0(?:1[3-9]\\d|0)","0"," int. ",,"0",,"00",,[[,"(\\d{4})(\\d{4})","$1 $2",["[24]"],"","",0],[,"(\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["9[1-9]"],"0$1","",0],[,"(\\d{3})(\\d{4})","$1 $2",["[89]0"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],UZ:[,[,,"[679]\\d{8}","\\d{7,9}"],
[,,"(?:6(?:1(?:22|3[124]|4[1-4]|5[123578]|64)|2(?:22|3[0-57-9]|41)|5(?:22|3[3-7]|5[024-8])|6\\d{2}|7(?:[23]\\d|7[69])|9(?:22|4[1-8]|6[135]))|7(?:0(?:5[4-9]|6[0146]|7[12456]|9[135-8])|1[12]\\d|2(?:22|3[1345789]|4[123579]|5[14])|3(?:2\\d|3[1578]|4[1-35-7]|5[1-57]|61)|4(?:2\\d|3[1-579]|7[1-79])|5(?:22|5[1-9]|6[1457])|6(?:22|3[12457]|4[13-8])|9(?:22|5[1-9])))\\d{5}","\\d{7,9}",,,"662345678"],[,,"6(?:1(?:2(?:98|2[01])|35[0-4]|50\\d|61[23]|7(?:[01][017]|4\\d|55|9[5-9]))|2(?:11\\d|2(?:[12]1|9[01379])|5(?:[126]\\d|3[0-4])|7\\d{2})|5(?:19[01]|2(?:27|9[26])|30\\d|59\\d|7\\d{2})|6(?:2(?:1[5-9]|2[0367]|38|41|52|60)|3[79]\\d|4(?:56|83)|7(?:[07]\\d|1[017]|3[07]|4[047]|5[057]|67|8[0178]|9[79])|9[0-3]\\d)|7(?:2(?:24|3[237]|4[5-9]|7[15-8])|5(?:7[12]|8[0589])|7(?:0\\d|[39][07])|9(?:0\\d|7[079]))|9(2(?:1[1267]|5\\d|3[01]|7[0-4])|5[67]\\d|6(?:2[0-26]|8\\d)|7\\d{2}))\\d{4}|7(?:0\\d{3}|1(?:13[01]|6(?:0[47]|1[67]|66)|71[3-69]|98\\d)|2(?:2(?:2[79]|95)|3(?:2[5-9]|6[0-6])|57\\d|7(?:0\\d|1[17]|2[27]|3[37]|44|5[057]|66|88))|3(?:2(?:1[0-6]|21|3[469]|7[159])|33\\d|5(?:0[0-4]|5[579]|9\\d)|7(?:[0-3579]\\d|4[0467]|6[67]|8[078])|9[4-6]\\d)|4(?:2(?:29|5[0257]|6[0-7]|7[1-57])|5(?:1[0-4]|8\\d|9[5-9])|7(?:0\\d|1[024589]|2[0127]|3[0137]|[46][07]|5[01]|7[5-9]|9[079])|9(?:7[015-9]|[89]\\d))|5(?:112|2(?:0\\d|2[29]|[49]4)|3[1568]\\d|52[6-9]|7(?:0[01578]|1[017]|[23]7|4[047]|[5-7]\\d|8[78]|9[079]))|6(?:2(?:2[1245]|4[2-4])|39\\d|41[179]|5(?:[349]\\d|5[0-2])|7(?:0[017]|[13]\\d|22|44|55|67|88))|9(?:22[128]|3(?:2[0-4]|7\\d)|57[05629]|7(?:2[05-9]|3[37]|4\\d|60|7[2579]|87|9[07])))\\d{4}|9[0-57-9]\\d{7}",
"\\d{7,9}",,,"912345678"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"UZ",998,"810","8",,,"8",,"8~10",,[[,"([679]\\d)(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",,"8 $1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],VA:[,[,,"06\\d{8}","\\d{10}"],[,,"06698\\d{5}","\\d{10}",,,"0669812345"],[,,"N/A","N/A"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"VA",379,"00",,,,,,,,[[,"(06)(\\d{4})(\\d{4})","$1 $2 $3",,"","",0]],,[,,"NA","NA"],
,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],VC:[,[,,"[5789]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"784(?:266|3(?:6[6-9]|7\\d|8[0-24-6])|4(?:38|5[0-36-8]|8\\d|9[01])|555|638|784)\\d{4}","\\d{7}(?:\\d{3})?",,,"7842661234"],[,,"784(?:4(?:3[0-4]|5[45]|9[2-5])|5(?:2[6-9]|3[0-4]|93))\\d{4}","\\d{10}",,,"7844301234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002345678"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002345678"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],
"VC",1,"011","1",,,"1",,,,,,[,,"NA","NA"],,"784",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],VE:[,[,,"[24589]\\d{9}","\\d{7,10}"],[,,"(?:2(?:12|3[457-9]|[58][1-9]|[467]\\d|9[1-6])|50[01])\\d{7}","\\d{7,10}",,,"2121234567"],[,,"4(?:1[24-8]|2[46])\\d{7}","\\d{10}",,,"4121234567"],[,,"800\\d{7}","\\d{10}",,,"8001234567"],[,,"900\\d{7}","\\d{10}",,,"9001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"VE",58,"00","0",,,"0",,,,[[,"(\\d{3})(\\d{7})","$1-$2",,"0$1","$CC $1",0]],,[,,"NA","NA"],,,[,,"NA",
"NA"],[,,"NA","NA"],,,[,,"NA","NA"]],VG:[,[,,"[2589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"284(?:(?:229|4(?:22|9[45])|774|8(?:52|6[459]))\\d{4}|496[0-5]\\d{3})","\\d{7}(?:\\d{3})?",,,"2842291234"],[,,"284(?:(?:3(?:0[0-3]|4[0-367])|4(?:4[0-6]|68|99)|54[0-57])\\d{4}|496[6-9]\\d{3})","\\d{10}",,,"2843001234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}","\\d{10}",,,"8002345678"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002345678"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"VG",1,
"011","1",,,"1",,,,,,[,,"NA","NA"],,"284",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],VI:[,[,,"[3589]\\d{9}","\\d{7}(?:\\d{3})?"],[,,"340(?:2(?:01|2[067]|36|44|77)|3(?:32|44)|4(?:4[38]|7[34])|5(?:1[34]|55)|6(?:26|4[23]|77|9[023])|7(?:[17]\\d|27)|884|998)\\d{4}","\\d{7}(?:\\d{3})?",,,"3406421234"],[,,"340(?:2(?:01|2[067]|36|44|77)|3(?:32|44)|4(?:4[38]|7[34])|5(?:1[34]|55)|6(?:26|4[23]|77|9[023])|7(?:[17]\\d|27)|884|998)\\d{4}","\\d{7}(?:\\d{3})?",,,"3406421234"],[,,"8(?:00|55|66|77|88)[2-9]\\d{6}",
"\\d{10}",,,"8002345678"],[,,"900[2-9]\\d{6}","\\d{10}",,,"9002345678"],[,,"NA","NA"],[,,"5(?:00|33|44)[2-9]\\d{6}","\\d{10}",,,"5002345678"],[,,"NA","NA"],"VI",1,"011","1",,,"1",,,1,,,[,,"NA","NA"],,"340",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],VN:[,[,,"[17]\\d{6,9}|[2-69]\\d{7,9}|8\\d{6,8}","\\d{7,10}"],[,,"(?:2(?:[025-79]|1[0189]|[348][01])|3(?:[0136-9]|[25][01])|4\\d|5(?:[01][01]|[2-9])|6(?:[0-46-8]|5[01])|7(?:[02-79]|[18][01])|8[1-9])\\d{7}","\\d{9,10}",,,"2101234567"],[,,"(?:9\\d|1(?:2\\d|6[2-9]|8[68]|99))\\d{7}",
"\\d{9,10}",,,"912345678"],[,,"1800\\d{4,6}","\\d{8,10}",,,"1800123456"],[,,"1900\\d{4,6}","\\d{8,10}",,,"1900123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"VN",84,"00","0",,,"0",,,,[[,"([17]99)(\\d{4})","$1 $2",["[17]99"],"0$1","",1],[,"([48])(\\d{4})(\\d{4})","$1 $2 $3",["[48]"],"0$1","",1],[,"([235-7]\\d)(\\d{4})(\\d{3})","$1 $2 $3",["2[025-79]|3[0136-9]|5[2-9]|6[0-46-8]|7[02-79]"],"0$1","",1],[,"(80)(\\d{5})","$1 $2",["80"],"0$1","",1],[,"(69\\d)(\\d{4,5})","$1 $2",["69"],"0$1","",1],[,"([235-7]\\d{2})(\\d{4})(\\d{3})",
"$1 $2 $3",["2[1348]|3[25]|5[01]|65|7[18]"],"0$1","",1],[,"(9\\d)(\\d{3})(\\d{2})(\\d{2})","$1 $2 $3 $4",["9"],"0$1","",1],[,"(1[2689]\\d)(\\d{3})(\\d{4})","$1 $2 $3",["1(?:[26]|8[68]|99)"],"0$1","",1],[,"(1[89]00)(\\d{4,6})","$1 $2",["1[89]0"],"$1","",1]],,[,,"NA","NA"],,,[,,"[17]99\\d{4}|69\\d{5,6}","\\d{7,8}",,,"1992000"],[,,"[17]99\\d{4}|69\\d{5,6}|80\\d{5}","\\d{7,8}",,,"1992000"],,,[,,"NA","NA"]],VU:[,[,,"[2-57-9]\\d{4,6}","\\d{5,7}"],[,,"(?:2[2-9]\\d|3(?:[5-7]\\d|8[0-8])|48[4-9]|88\\d)\\d{2}",
"\\d{5}",,,"22123"],[,,"(?:5(?:7[2-5]|[3-69]\\d)|7[013-7]\\d)\\d{4}","\\d{7}",,,"5912345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"VU",678,"00",,,,,,,,[[,"(\\d{3})(\\d{4})","$1 $2",["[579]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"3[03]\\d{3}|900\\d{4}","\\d{5,7}",,,"30123"],,,[,,"NA","NA"]],WF:[,[,,"[5-7]\\d{5}","\\d{6}"],[,,"(?:50|68|72)\\d{4}","\\d{6}",,,"501234"],[,,"(?:50|68|72)\\d{4}","\\d{6}",,,"501234"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA",
"NA"],[,,"NA","NA"],"WF",681,"00",,,,,,,1,[[,"(\\d{2})(\\d{2})(\\d{2})","$1 $2 $3",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],WS:[,[,,"[2-8]\\d{4,6}","\\d{5,7}"],[,,"(?:[2-5]\\d|6[1-9]|84\\d{2})\\d{3}","\\d{5,7}",,,"22123"],[,,"(?:60|7[25-7]\\d)\\d{4}","\\d{6,7}",,,"601234"],[,,"800\\d{3}","\\d{6}",,,"800123"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"WS",685,"0",,,,,,,,[[,"(8\\d{2})(\\d{3,4})","$1 $2",["8"],"","",0],[,"(7\\d)(\\d{5})","$1 $2",["7"],"",
"",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],YE:[,[,,"[1-7]\\d{6,8}","\\d{6,9}"],[,,"(?:1(?:7\\d|[2-68])|2[2-68]|3[2358]|4[2-58]|5[2-6]|6[3-58]|7[24-68])\\d{5}","\\d{6,8}",,,"1234567"],[,,"7[0137]\\d{7}","\\d{9}",,,"712345678"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"YE",967,"00","0",,,"0",,,,[[,"([1-7])(\\d{3})(\\d{3,4})","$1 $2 $3",["[1-6]|7[24-68]"],"0$1","",0],[,"(7\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["7[0137]"],"0$1","",0]],,[,,"NA","NA"],
,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],YT:[,[,,"[268]\\d{8}","\\d{9}"],[,,"2696[0-4]\\d{4}","\\d{9}",,,"269601234"],[,,"639\\d{6}","\\d{9}",,,"639123456"],[,,"80\\d{7}","\\d{9}",,,"801234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"YT",262,"00","0",,,"0",,,,,,[,,"NA","NA"],,"269|63",[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],ZA:[,[,,"[1-79]\\d{8}|8(?:[067]\\d{7}|[1-4]\\d{3,7})","\\d{5,9}"],[,,"(?:1[0-8]|2[0-378]|3[1-69]|4\\d|5[1346-8])\\d{7}","\\d{9}",,,"101234567"],[,
,"(?:6[0-5]|7[0-46-9])\\d{7}|8[1-4]\\d{3,7}","\\d{5,9}",,,"711234567"],[,,"80\\d{7}","\\d{9}",,,"801234567"],[,,"86[2-9]\\d{6}|90\\d{7}","\\d{9}",,,"862345678"],[,,"860\\d{6}","\\d{9}",,,"860123456"],[,,"NA","NA"],[,,"87\\d{7}","\\d{9}",,,"871234567"],"ZA",27,"00","0",,,"0",,,,[[,"(860)(\\d{3})(\\d{3})","$1 $2 $3",["860"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{4})","$1 $2 $3",["[1-79]|8(?:[0-47]|6[1-9])"],"0$1","",0],[,"(\\d{2})(\\d{3,4})","$1 $2",["8[1-4]"],"0$1","",0],[,"(\\d{2})(\\d{3})(\\d{2,3})",
"$1 $2 $3",["8[1-4]"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"861\\d{6}","\\d{9}",,,"861123456"],,,[,,"NA","NA"]],ZM:[,[,,"[289]\\d{8}","\\d{9}"],[,,"21[1-8]\\d{6}","\\d{9}",,,"211234567"],[,,"9(?:5[05]|6\\d|7[13-9])\\d{6}","\\d{9}",,,"955123456"],[,,"800\\d{6}","\\d{9}",,,"800123456"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"ZM",260,"00","0",,,"0",,,,[[,"([29]\\d)(\\d{7})","$1 $2",["[29]"],"0$1","",0],[,"(800)(\\d{3})(\\d{3})","$1 $2 $3",["8"],"0$1","",0]],,[,,"NA","NA"],
,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],ZW:[,[,,"2(?:[012457-9]\\d{3,8}|6\\d{3,6})|[13-79]\\d{4,8}|8[06]\\d{8}","\\d{3,10}"],[,,"(?:1[3-9]|2(?:0[45]|[16]|2[28]|[49]8?|58[23]|7[246]|8[1346-9])|3(?:08?|17?|3[78]|[2456]|7[1569]|8[379])|5(?:[07-9]|1[78]|483|5(?:7?|8))|6(?:0|28|37?|[45][68][78]|98?)|848)\\d{3,6}|(?:2(?:27|5|7[135789]|8[25])|3[39]|5[1-46]|6[126-8])\\d{4,6}|2(?:(?:0|70)\\d{5,6}|2[05]\\d{7})|(?:4\\d|9[2-8])\\d{4,7}","\\d{3,10}",,,"1312345"],[,,"7[1378]\\d{7}|86(?:22|44)\\d{6}","\\d{9,10}",
,,"711234567"],[,,"800\\d{7}","\\d{10}",,,"8001234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"86(?:1[12]|30|55|77|8[367]|99)\\d{6}","\\d{10}",,,"8686123456"],"ZW",263,"00","0",,,"0",,,,[[,"([49])(\\d{3})(\\d{2,5})","$1 $2 $3",["4|9[2-9]"],"0$1","",0],[,"([179]\\d)(\\d{3})(\\d{3,4})","$1 $2 $3",["[19]1|7"],"0$1","",0],[,"(86\\d{2})(\\d{3})(\\d{3})","$1 $2 $3",["86[24]"],"0$1","",0],[,"([2356]\\d{2})(\\d{3,5})","$1 $2",["2(?:[278]|0[45]|[49]8)|3(?:08|17|3[78]|[78])|5[15][78]|6(?:[29]8|37|[68][78])"],
"0$1","",0],[,"(\\d{3})(\\d{3})(\\d{3,4})","$1 $2 $3",["2(?:[278]|0[45]|48)|3(?:08|17|3[78]|[78])|5[15][78]|6(?:[29]8|37|[68][78])|80"],"0$1","",0],[,"([1-356]\\d)(\\d{3,5})","$1 $2",["1[3-9]|2(?:[1-469]|0[0-35-9]|[45][0-79])|3(?:0[0-79]|1[0-689]|[24-69]|3[0-69])|5(?:[02-46-9]|[15][0-69])|6(?:[0145]|[29][0-79]|3[0-689]|[68][0-69])"],"0$1","",0],[,"([1-356]\\d)(\\d{3})(\\d{3})","$1 $2 $3",["1[3-9]|2(?:[1-469]|0[0-35-9]|[45][0-79])|3(?:0[0-79]|1[0-689]|[24-69]|3[0-69])|5(?:[02-46-9]|[15][0-69])|6(?:[0145]|[29][0-79]|3[0-689]|[68][0-69])"],
"0$1","",0],[,"([25]\\d{3})(\\d{3,5})","$1 $2",["(?:25|54)8","258[23]|5483"],"0$1","",0],[,"([25]\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",["(?:25|54)8","258[23]|5483"],"0$1","",0],[,"(8\\d{3})(\\d{6})","$1 $2",["86"],"0$1","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],800:[,[,,"\\d{8}","\\d{8}",,,"12345678"],[,,"NA","NA",,,"12345678"],[,,"NA","NA",,,"12345678"],[,,"\\d{8}","\\d{8}",,,"12345678"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"001",800,"",,,,,,,1,[[,"(\\d{4})(\\d{4})",
"$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],808:[,[,,"\\d{8}","\\d{8}",,,"12345678"],[,,"NA","NA",,,"12345678"],[,,"NA","NA",,,"12345678"],[,,"NA","NA"],[,,"NA","NA"],[,,"\\d{8}","\\d{8}",,,"12345678"],[,,"NA","NA"],[,,"NA","NA"],"001",808,"",,,,,,,1,[[,"(\\d{4})(\\d{4})","$1 $2",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]],870:[,[,,"[35-7]\\d{8}","\\d{9}",,,"301234567"],[,,"NA","NA",,,"301234567"],[,,"(?:[356]\\d|7[6-8])\\d{7}","\\d{9}",
,,"301234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"001",870,"",,,,,,,,[[,"(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],878:[,[,,"1\\d{11}","\\d{12}",,,"101234567890"],[,,"NA","NA",,,"101234567890"],[,,"NA","NA",,,"101234567890"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"10\\d{10}","\\d{12}",,,"101234567890"],"001",878,"",,,,,,,1,[[,"(\\d{2})(\\d{5})(\\d{5})","$1 $2 $3",,"","",0]],
,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],881:[,[,,"[67]\\d{8}","\\d{9}",,,"612345678"],[,,"NA","NA",,,"612345678"],[,,"[67]\\d{8}","\\d{9}",,,"612345678"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"001",881,"",,,,,,,,[[,"(\\d)(\\d{3})(\\d{5})","$1 $2 $3",["[67]"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],882:[,[,,"[13]\\d{6,11}","\\d{7,12}",,,"3451234567"],[,,"NA","NA",,,"3451234567"],[,,"3(?:2\\d{3}|37\\d{2}|4(?:2|7\\d{3}))\\d{4}",
"\\d{7,10}",,,"3451234567"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"1(?:3(?:0[0347]|[13][0139]|2[035]|4[013568]|6[0459]|7[06]|8[15678]|9[0689])\\d{4}|6\\d{5,10})|345\\d{7}","\\d{7,12}",,,"3451234567"],"001",882,"",,,,,,,,[[,"(\\d{2})(\\d{4})(\\d{3})","$1 $2 $3",["3[23]"],"","",0],[,"(\\d{2})(\\d{5})","$1 $2",["16|342"],"","",0],[,"(\\d{2})(\\d{4})(\\d{4})","$1 $2 $3",["34[57]"],"","",0],[,"(\\d{3})(\\d{4})(\\d{4})","$1 $2 $3",["348"],"","",0],[,"(\\d{2})(\\d{2})(\\d{4})","$1 $2 $3",
["1"],"","",0],[,"(\\d{2})(\\d{3,4})(\\d{4})","$1 $2 $3",["16"],"","",0],[,"(\\d{2})(\\d{4,5})(\\d{5})","$1 $2 $3",["16"],"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"348[57]\\d{7}","\\d{11}",,,"3451234567"]],883:[,[,,"51\\d{7}(?:\\d{3})?","\\d{9}(?:\\d{3})?",,,"510012345"],[,,"NA","NA",,,"510012345"],[,,"NA","NA",,,"510012345"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"51(?:00\\d{5}(?:\\d{3})?|10\\d{8})","\\d{9}(?:\\d{3})?",,,"510012345"],"001",883,"",,,,,,,1,[[,
"(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3",,"","",0],[,"(\\d{3})(\\d{3})(\\d{3})(\\d{3})","$1 $2 $3 $4",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],,,[,,"NA","NA"]],888:[,[,,"\\d{11}","\\d{11}",,,"12345678901"],[,,"NA","NA",,,"12345678901"],[,,"NA","NA",,,"12345678901"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"001",888,"",,,,,,,1,[[,"(\\d{3})(\\d{3})(\\d{5})","$1 $2 $3",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"\\d{11}","\\d{11}",,,"12345678901"],1,,[,,"NA",
"NA"]],979:[,[,,"\\d{9}","\\d{9}",,,"123456789"],[,,"NA","NA",,,"123456789"],[,,"NA","NA",,,"123456789"],[,,"NA","NA"],[,,"\\d{9}","\\d{9}",,,"123456789"],[,,"NA","NA"],[,,"NA","NA"],[,,"NA","NA"],"001",979,"",,,,,,,1,[[,"(\\d)(\\d{4})(\\d{4})","$1 $2 $3",,"","",0]],,[,,"NA","NA"],,,[,,"NA","NA"],[,,"NA","NA"],1,,[,,"NA","NA"]]};/*

 Protocol Buffer 2 Copyright 2008 Google Inc.
 All other code copyright its respective owners.
 Copyright (C) 2010 The Libphonenumber Authors

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
i18n.phonenumbers.PhoneNumber=function(){goog.proto2.Message.apply(this)};goog.inherits(i18n.phonenumbers.PhoneNumber,goog.proto2.Message);i18n.phonenumbers.PhoneNumber.prototype.getCountryCode=function(){return this.get$Value(1)};i18n.phonenumbers.PhoneNumber.prototype.getCountryCodeOrDefault=function(){return this.get$ValueOrDefault(1)};i18n.phonenumbers.PhoneNumber.prototype.setCountryCode=function(a){this.set$Value(1,a)};i18n.phonenumbers.PhoneNumber.prototype.hasCountryCode=function(){return this.has$Value(1)};
i18n.phonenumbers.PhoneNumber.prototype.countryCodeCount=function(){return this.count$Values(1)};i18n.phonenumbers.PhoneNumber.prototype.clearCountryCode=function(){this.clear$Field(1)};i18n.phonenumbers.PhoneNumber.prototype.getNationalNumber=function(){return this.get$Value(2)};i18n.phonenumbers.PhoneNumber.prototype.getNationalNumberOrDefault=function(){return this.get$ValueOrDefault(2)};i18n.phonenumbers.PhoneNumber.prototype.setNationalNumber=function(a){this.set$Value(2,a)};
i18n.phonenumbers.PhoneNumber.prototype.hasNationalNumber=function(){return this.has$Value(2)};i18n.phonenumbers.PhoneNumber.prototype.nationalNumberCount=function(){return this.count$Values(2)};i18n.phonenumbers.PhoneNumber.prototype.clearNationalNumber=function(){this.clear$Field(2)};i18n.phonenumbers.PhoneNumber.prototype.getExtension=function(){return this.get$Value(3)};i18n.phonenumbers.PhoneNumber.prototype.getExtensionOrDefault=function(){return this.get$ValueOrDefault(3)};
i18n.phonenumbers.PhoneNumber.prototype.setExtension=function(a){this.set$Value(3,a)};i18n.phonenumbers.PhoneNumber.prototype.hasExtension=function(){return this.has$Value(3)};i18n.phonenumbers.PhoneNumber.prototype.extensionCount=function(){return this.count$Values(3)};i18n.phonenumbers.PhoneNumber.prototype.clearExtension=function(){this.clear$Field(3)};i18n.phonenumbers.PhoneNumber.prototype.getItalianLeadingZero=function(){return this.get$Value(4)};
i18n.phonenumbers.PhoneNumber.prototype.getItalianLeadingZeroOrDefault=function(){return this.get$ValueOrDefault(4)};i18n.phonenumbers.PhoneNumber.prototype.setItalianLeadingZero=function(a){this.set$Value(4,a)};i18n.phonenumbers.PhoneNumber.prototype.hasItalianLeadingZero=function(){return this.has$Value(4)};i18n.phonenumbers.PhoneNumber.prototype.italianLeadingZeroCount=function(){return this.count$Values(4)};i18n.phonenumbers.PhoneNumber.prototype.clearItalianLeadingZero=function(){this.clear$Field(4)};
i18n.phonenumbers.PhoneNumber.prototype.getNumberOfLeadingZeros=function(){return this.get$Value(8)};i18n.phonenumbers.PhoneNumber.prototype.getNumberOfLeadingZerosOrDefault=function(){return this.get$ValueOrDefault(8)};i18n.phonenumbers.PhoneNumber.prototype.setNumberOfLeadingZeros=function(a){this.set$Value(8,a)};i18n.phonenumbers.PhoneNumber.prototype.hasNumberOfLeadingZeros=function(){return this.has$Value(8)};i18n.phonenumbers.PhoneNumber.prototype.numberOfLeadingZerosCount=function(){return this.count$Values(8)};
i18n.phonenumbers.PhoneNumber.prototype.clearNumberOfLeadingZeros=function(){this.clear$Field(8)};i18n.phonenumbers.PhoneNumber.prototype.getRawInput=function(){return this.get$Value(5)};i18n.phonenumbers.PhoneNumber.prototype.getRawInputOrDefault=function(){return this.get$ValueOrDefault(5)};i18n.phonenumbers.PhoneNumber.prototype.setRawInput=function(a){this.set$Value(5,a)};i18n.phonenumbers.PhoneNumber.prototype.hasRawInput=function(){return this.has$Value(5)};
i18n.phonenumbers.PhoneNumber.prototype.rawInputCount=function(){return this.count$Values(5)};i18n.phonenumbers.PhoneNumber.prototype.clearRawInput=function(){this.clear$Field(5)};i18n.phonenumbers.PhoneNumber.prototype.getCountryCodeSource=function(){return this.get$Value(6)};i18n.phonenumbers.PhoneNumber.prototype.getCountryCodeSourceOrDefault=function(){return this.get$ValueOrDefault(6)};i18n.phonenumbers.PhoneNumber.prototype.setCountryCodeSource=function(a){this.set$Value(6,a)};
i18n.phonenumbers.PhoneNumber.prototype.hasCountryCodeSource=function(){return this.has$Value(6)};i18n.phonenumbers.PhoneNumber.prototype.countryCodeSourceCount=function(){return this.count$Values(6)};i18n.phonenumbers.PhoneNumber.prototype.clearCountryCodeSource=function(){this.clear$Field(6)};i18n.phonenumbers.PhoneNumber.prototype.getPreferredDomesticCarrierCode=function(){return this.get$Value(7)};i18n.phonenumbers.PhoneNumber.prototype.getPreferredDomesticCarrierCodeOrDefault=function(){return this.get$ValueOrDefault(7)};
i18n.phonenumbers.PhoneNumber.prototype.setPreferredDomesticCarrierCode=function(a){this.set$Value(7,a)};i18n.phonenumbers.PhoneNumber.prototype.hasPreferredDomesticCarrierCode=function(){return this.has$Value(7)};i18n.phonenumbers.PhoneNumber.prototype.preferredDomesticCarrierCodeCount=function(){return this.count$Values(7)};i18n.phonenumbers.PhoneNumber.prototype.clearPreferredDomesticCarrierCode=function(){this.clear$Field(7)};
i18n.phonenumbers.PhoneNumber.CountryCodeSource={FROM_NUMBER_WITH_PLUS_SIGN:1,FROM_NUMBER_WITH_IDD:5,FROM_NUMBER_WITHOUT_PLUS_SIGN:10,FROM_DEFAULT_COUNTRY:20};
goog.proto2.Message.set$Metadata(i18n.phonenumbers.PhoneNumber,{0:{name:"PhoneNumber",fullName:"i18n.phonenumbers.PhoneNumber"},1:{name:"country_code",required:!0,fieldType:goog.proto2.Message.FieldType.INT32,type:Number},2:{name:"national_number",required:!0,fieldType:goog.proto2.Message.FieldType.UINT64,type:Number},3:{name:"extension",fieldType:goog.proto2.Message.FieldType.STRING,type:String},4:{name:"italian_leading_zero",fieldType:goog.proto2.Message.FieldType.BOOL,type:Boolean},8:{name:"number_of_leading_zeros",
fieldType:goog.proto2.Message.FieldType.INT32,defaultValue:1,type:Number},5:{name:"raw_input",fieldType:goog.proto2.Message.FieldType.STRING,type:String},6:{name:"country_code_source",fieldType:goog.proto2.Message.FieldType.ENUM,defaultValue:i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN,type:i18n.phonenumbers.PhoneNumber.CountryCodeSource},7:{name:"preferred_domestic_carrier_code",fieldType:goog.proto2.Message.FieldType.STRING,type:String}});/*

 Copyright (C) 2010 The Libphonenumber Authors.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
i18n.phonenumbers.PhoneNumberUtil=function(){this.regionToMetadataMap={}};goog.addSingletonGetter(i18n.phonenumbers.PhoneNumberUtil);i18n.phonenumbers.Error={INVALID_COUNTRY_CODE:"Invalid country calling code",NOT_A_NUMBER:"The string supplied did not seem to be a phone number",TOO_SHORT_AFTER_IDD:"Phone number too short after IDD",TOO_SHORT_NSN:"The string supplied is too short to be a phone number",TOO_LONG:"The string supplied is too long to be a phone number"};
i18n.phonenumbers.PhoneNumberUtil.NANPA_COUNTRY_CODE_=1;i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_=2;i18n.phonenumbers.PhoneNumberUtil.MAX_LENGTH_FOR_NSN_=16;i18n.phonenumbers.PhoneNumberUtil.MAX_LENGTH_COUNTRY_CODE_=3;i18n.phonenumbers.PhoneNumberUtil.MAX_INPUT_STRING_LENGTH_=250;i18n.phonenumbers.PhoneNumberUtil.UNKNOWN_REGION_="ZZ";i18n.phonenumbers.PhoneNumberUtil.COLOMBIA_MOBILE_TO_FIXED_LINE_PREFIX_="3";i18n.phonenumbers.PhoneNumberUtil.MOBILE_TOKEN_MAPPINGS_={52:"1",54:"9"};
i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN="+";i18n.phonenumbers.PhoneNumberUtil.STAR_SIGN_="*";i18n.phonenumbers.PhoneNumberUtil.RFC3966_EXTN_PREFIX_=";ext=";i18n.phonenumbers.PhoneNumberUtil.RFC3966_PREFIX_="tel:";i18n.phonenumbers.PhoneNumberUtil.RFC3966_PHONE_CONTEXT_=";phone-context=";i18n.phonenumbers.PhoneNumberUtil.RFC3966_ISDN_SUBADDRESS_=";isub=";
i18n.phonenumbers.PhoneNumberUtil.DIGIT_MAPPINGS={0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9","\uff10":"0","\uff11":"1","\uff12":"2","\uff13":"3","\uff14":"4","\uff15":"5","\uff16":"6","\uff17":"7","\uff18":"8","\uff19":"9","\u0660":"0","\u0661":"1","\u0662":"2","\u0663":"3","\u0664":"4","\u0665":"5","\u0666":"6","\u0667":"7","\u0668":"8","\u0669":"9","\u06f0":"0","\u06f1":"1","\u06f2":"2","\u06f3":"3","\u06f4":"4","\u06f5":"5","\u06f6":"6","\u06f7":"7","\u06f8":"8","\u06f9":"9"};
i18n.phonenumbers.PhoneNumberUtil.DIALLABLE_CHAR_MAPPINGS_={0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9","+":i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN,"*":"*"};i18n.phonenumbers.PhoneNumberUtil.ALPHA_MAPPINGS_={A:"2",B:"2",C:"2",D:"3",E:"3",F:"3",G:"4",H:"4",I:"4",J:"5",K:"5",L:"5",M:"6",N:"6",O:"6",P:"7",Q:"7",R:"7",S:"7",T:"8",U:"8",V:"8",W:"9",X:"9",Y:"9",Z:"9"};
i18n.phonenumbers.PhoneNumberUtil.ALL_NORMALIZATION_MAPPINGS_={0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9","\uff10":"0","\uff11":"1","\uff12":"2","\uff13":"3","\uff14":"4","\uff15":"5","\uff16":"6","\uff17":"7","\uff18":"8","\uff19":"9","\u0660":"0","\u0661":"1","\u0662":"2","\u0663":"3","\u0664":"4","\u0665":"5","\u0666":"6","\u0667":"7","\u0668":"8","\u0669":"9","\u06f0":"0","\u06f1":"1","\u06f2":"2","\u06f3":"3","\u06f4":"4","\u06f5":"5","\u06f6":"6","\u06f7":"7","\u06f8":"8","\u06f9":"9",
A:"2",B:"2",C:"2",D:"3",E:"3",F:"3",G:"4",H:"4",I:"4",J:"5",K:"5",L:"5",M:"6",N:"6",O:"6",P:"7",Q:"7",R:"7",S:"7",T:"8",U:"8",V:"8",W:"9",X:"9",Y:"9",Z:"9"};
i18n.phonenumbers.PhoneNumberUtil.ALL_PLUS_NUMBER_GROUPING_SYMBOLS_={0:"0",1:"1",2:"2",3:"3",4:"4",5:"5",6:"6",7:"7",8:"8",9:"9",A:"A",B:"B",C:"C",D:"D",E:"E",F:"F",G:"G",H:"H",I:"I",J:"J",K:"K",L:"L",M:"M",N:"N",O:"O",P:"P",Q:"Q",R:"R",S:"S",T:"T",U:"U",V:"V",W:"W",X:"X",Y:"Y",Z:"Z",a:"A",b:"B",c:"C",d:"D",e:"E",f:"F",g:"G",h:"H",i:"I",j:"J",k:"K",l:"L",m:"M",n:"N",o:"O",p:"P",q:"Q",r:"R",s:"S",t:"T",u:"U",v:"V",w:"W",x:"X",y:"Y",z:"Z","-":"-","\uff0d":"-","\u2010":"-","\u2011":"-","\u2012":"-",
"\u2013":"-","\u2014":"-","\u2015":"-","\u2212":"-","/":"/","\uff0f":"/"," ":" ","\u3000":" ","\u2060":" ",".":".","\uff0e":"."};i18n.phonenumbers.PhoneNumberUtil.UNIQUE_INTERNATIONAL_PREFIX_=/[\d]+(?:[~\u2053\u223C\uFF5E][\d]+)?/;i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION="-x\u2010-\u2015\u2212\u30fc\uff0d-\uff0f \u00a0\u00ad\u200b\u2060\u3000()\uff08\uff09\uff3b\uff3d.\\[\\]/~\u2053\u223c\uff5e";i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_="0-9\uff10-\uff19\u0660-\u0669\u06f0-\u06f9";
i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_="A-Za-z";i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_="+\uff0b";i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_PATTERN=RegExp("["+i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_+"]+");i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_=RegExp("^["+i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_+"]+");i18n.phonenumbers.PhoneNumberUtil.SEPARATOR_PATTERN_="["+i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION+"]+";
i18n.phonenumbers.PhoneNumberUtil.CAPTURING_DIGIT_PATTERN=RegExp("(["+i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_+"])");i18n.phonenumbers.PhoneNumberUtil.VALID_START_CHAR_PATTERN_=RegExp("["+i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_+i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_+"]");i18n.phonenumbers.PhoneNumberUtil.SECOND_NUMBER_START_PATTERN_=/[\\\/] *x/;
i18n.phonenumbers.PhoneNumberUtil.UNWANTED_END_CHAR_PATTERN_=RegExp("[^"+i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_+i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_+"#]+$");i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_PHONE_PATTERN_=/(?:.*?[A-Za-z]){3}.*/;i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_PHONE_NUMBER_PATTERN_="["+i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_+"]{"+i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_+"}";
i18n.phonenumbers.PhoneNumberUtil.VALID_PHONE_NUMBER_="["+i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_+"]*(?:["+i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION+i18n.phonenumbers.PhoneNumberUtil.STAR_SIGN_+"]*["+i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_+"]){3,}["+i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION+i18n.phonenumbers.PhoneNumberUtil.STAR_SIGN_+i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_+i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_+"]*";
i18n.phonenumbers.PhoneNumberUtil.DEFAULT_EXTN_PREFIX_=" ext. ";i18n.phonenumbers.PhoneNumberUtil.CAPTURING_EXTN_DIGITS_="(["+i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_+"]{1,7})";
i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERNS_FOR_PARSING_=i18n.phonenumbers.PhoneNumberUtil.RFC3966_EXTN_PREFIX_+i18n.phonenumbers.PhoneNumberUtil.CAPTURING_EXTN_DIGITS_+"|[ \u00a0\\t,]*(?:e?xt(?:ensi(?:o\u0301?|\u00f3))?n?|\uff45?\uff58\uff54\uff4e?|[,x\uff58#\uff03~\uff5e]|int|anexo|\uff49\uff4e\uff54)[:\\.\uff0e]?[ \u00a0\\t,-]*"+i18n.phonenumbers.PhoneNumberUtil.CAPTURING_EXTN_DIGITS_+"#?|[- ]+(["+i18n.phonenumbers.PhoneNumberUtil.VALID_DIGITS_+"]{1,5})#";
i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERN_=RegExp("(?:"+i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERNS_FOR_PARSING_+")$","i");i18n.phonenumbers.PhoneNumberUtil.VALID_PHONE_NUMBER_PATTERN_=RegExp("^"+i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_PHONE_NUMBER_PATTERN_+"$|^"+i18n.phonenumbers.PhoneNumberUtil.VALID_PHONE_NUMBER_+"(?:"+i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERNS_FOR_PARSING_+")?$","i");i18n.phonenumbers.PhoneNumberUtil.NON_DIGITS_PATTERN_=/\D+/;
i18n.phonenumbers.PhoneNumberUtil.FIRST_GROUP_PATTERN_=/(\$\d)/;i18n.phonenumbers.PhoneNumberUtil.NP_PATTERN_=/\$NP/;i18n.phonenumbers.PhoneNumberUtil.FG_PATTERN_=/\$FG/;i18n.phonenumbers.PhoneNumberUtil.CC_PATTERN_=/\$CC/;i18n.phonenumbers.PhoneNumberUtil.FIRST_GROUP_ONLY_PREFIX_PATTERN_=/^\(?\$1\)?$/;i18n.phonenumbers.PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY="001";i18n.phonenumbers.PhoneNumberFormat={E164:0,INTERNATIONAL:1,NATIONAL:2,RFC3966:3};
i18n.phonenumbers.PhoneNumberType={FIXED_LINE:0,MOBILE:1,FIXED_LINE_OR_MOBILE:2,TOLL_FREE:3,PREMIUM_RATE:4,SHARED_COST:5,VOIP:6,PERSONAL_NUMBER:7,PAGER:8,UAN:9,VOICEMAIL:10,UNKNOWN:-1};i18n.phonenumbers.PhoneNumberUtil.MatchType={NOT_A_NUMBER:0,NO_MATCH:1,SHORT_NSN_MATCH:2,NSN_MATCH:3,EXACT_MATCH:4};i18n.phonenumbers.PhoneNumberUtil.ValidationResult={IS_POSSIBLE:0,INVALID_COUNTRY_CODE:1,TOO_SHORT:2,TOO_LONG:3};
i18n.phonenumbers.PhoneNumberUtil.extractPossibleNumber=function(a){var b=a.search(i18n.phonenumbers.PhoneNumberUtil.VALID_START_CHAR_PATTERN_);0<=b?(a=a.substring(b),a=a.replace(i18n.phonenumbers.PhoneNumberUtil.UNWANTED_END_CHAR_PATTERN_,""),b=a.search(i18n.phonenumbers.PhoneNumberUtil.SECOND_NUMBER_START_PATTERN_),0<=b&&(a=a.substring(0,b))):a="";return a};
i18n.phonenumbers.PhoneNumberUtil.isViablePhoneNumber=function(a){return a.length<i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_?!1:i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(i18n.phonenumbers.PhoneNumberUtil.VALID_PHONE_NUMBER_PATTERN_,a)};
i18n.phonenumbers.PhoneNumberUtil.normalize=function(a){return i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_PHONE_PATTERN_,a)?i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(a,i18n.phonenumbers.PhoneNumberUtil.ALL_NORMALIZATION_MAPPINGS_,!0):i18n.phonenumbers.PhoneNumberUtil.normalizeDigitsOnly(a)};i18n.phonenumbers.PhoneNumberUtil.normalizeSB_=function(a){var b=i18n.phonenumbers.PhoneNumberUtil.normalize(a.toString());a.clear();a.append(b)};
i18n.phonenumbers.PhoneNumberUtil.normalizeDigitsOnly=function(a){return i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(a,i18n.phonenumbers.PhoneNumberUtil.DIGIT_MAPPINGS,!0)};i18n.phonenumbers.PhoneNumberUtil.convertAlphaCharactersInNumber=function(a){return i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(a,i18n.phonenumbers.PhoneNumberUtil.ALL_NORMALIZATION_MAPPINGS_,!1)};
i18n.phonenumbers.PhoneNumberUtil.prototype.getLengthOfGeographicalAreaCode=function(a){var b=this.getMetadataForRegion(this.getRegionCodeForNumber(a));return null!=b&&(b.hasNationalPrefix()||a.hasItalianLeadingZero())&&this.isNumberGeographical(a)?this.getLengthOfNationalDestinationCode(a):0};
i18n.phonenumbers.PhoneNumberUtil.prototype.getLengthOfNationalDestinationCode=function(a){var b;a.hasExtension()?(b=a.clone(),b.clearExtension()):b=a;b=this.format(b,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL).split(i18n.phonenumbers.PhoneNumberUtil.NON_DIGITS_PATTERN_);0==b[0].length&&b.shift();return 2>=b.length?0:this.getNumberType(a)==i18n.phonenumbers.PhoneNumberType.MOBILE&&(a=i18n.phonenumbers.PhoneNumberUtil.getCountryMobileToken(a.getCountryCodeOrDefault()),""!=a)?b[2].length+a.length:
b[1].length};i18n.phonenumbers.PhoneNumberUtil.getCountryMobileToken=function(a){return i18n.phonenumbers.PhoneNumberUtil.MOBILE_TOKEN_MAPPINGS_[a]||""};i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_=function(a,b,c){for(var d=new goog.string.StringBuffer,e,f,g=a.length,h=0;h<g;++h)e=a.charAt(h),f=b[e.toUpperCase()],null!=f?d.append(f):c||d.append(e);return d.toString()};i18n.phonenumbers.PhoneNumberUtil.prototype.formattingRuleHasFirstGroupOnly=function(a){return 0==a.length||i18n.phonenumbers.PhoneNumberUtil.FIRST_GROUP_ONLY_PREFIX_PATTERN_.test(a)};
i18n.phonenumbers.PhoneNumberUtil.prototype.isNumberGeographical=function(a){a=this.getNumberType(a);return a==i18n.phonenumbers.PhoneNumberType.FIXED_LINE||a==i18n.phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE};i18n.phonenumbers.PhoneNumberUtil.prototype.isValidRegionCode_=function(a){return null!=a&&isNaN(a)&&a.toUpperCase()in i18n.phonenumbers.metadata.countryToMetadata};i18n.phonenumbers.PhoneNumberUtil.prototype.hasValidCountryCallingCode_=function(a){return a in i18n.phonenumbers.metadata.countryCodeToRegionCodeMap};
i18n.phonenumbers.PhoneNumberUtil.prototype.format=function(a,b){if(0==a.getNationalNumber()&&a.hasRawInput()){var c=a.getRawInputOrDefault();if(0<c.length)return c}var c=a.getCountryCodeOrDefault(),d=this.getNationalSignificantNumber(a);if(b==i18n.phonenumbers.PhoneNumberFormat.E164)return this.prefixNumberWithCountryCallingCode_(c,i18n.phonenumbers.PhoneNumberFormat.E164,d,"");if(!this.hasValidCountryCallingCode_(c))return d;var e=this.getRegionCodeForCountryCode(c),f=this.getMetadataForRegionOrCallingCode_(c,
e),e=this.maybeGetFormattedExtension_(a,f,b),d=this.formatNsn_(d,f,b);return this.prefixNumberWithCountryCallingCode_(c,b,d,e)};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatByPattern=function(a,b,c){var d=a.getCountryCodeOrDefault(),e=this.getNationalSignificantNumber(a);if(!this.hasValidCountryCallingCode_(d))return e;var f=this.getRegionCodeForCountryCode(d),f=this.getMetadataForRegionOrCallingCode_(d,f),g="",g=this.chooseFormattingPatternForNumber_(c,e);if(null==g)g=e;else{c=g.clone();g=g.getNationalPrefixFormattingRuleOrDefault();if(0<g.length){var h=f.getNationalPrefixOrDefault();0<h.length?(g=g.replace(i18n.phonenumbers.PhoneNumberUtil.NP_PATTERN_,
h).replace(i18n.phonenumbers.PhoneNumberUtil.FG_PATTERN_,"$1"),c.setNationalPrefixFormattingRule(g)):c.clearNationalPrefixFormattingRule()}g=this.formatNsnUsingPattern_(e,c,b)}a=this.maybeGetFormattedExtension_(a,f,b);return this.prefixNumberWithCountryCallingCode_(d,b,g,a)};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatNationalNumberWithCarrierCode=function(a,b){var c=a.getCountryCodeOrDefault(),d=this.getNationalSignificantNumber(a);if(!this.hasValidCountryCallingCode_(c))return d;var e=this.getRegionCodeForCountryCode(c),f=this.getMetadataForRegionOrCallingCode_(c,e),e=this.maybeGetFormattedExtension_(a,f,i18n.phonenumbers.PhoneNumberFormat.NATIONAL),d=this.formatNsn_(d,f,i18n.phonenumbers.PhoneNumberFormat.NATIONAL,b);return this.prefixNumberWithCountryCallingCode_(c,
i18n.phonenumbers.PhoneNumberFormat.NATIONAL,d,e)};i18n.phonenumbers.PhoneNumberUtil.prototype.getMetadataForRegionOrCallingCode_=function(a,b){return i18n.phonenumbers.PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY==b?this.getMetadataForNonGeographicalRegion(a):this.getMetadataForRegion(b)};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatNationalNumberWithPreferredCarrierCode=function(a,b){return this.formatNationalNumberWithCarrierCode(a,a.hasPreferredDomesticCarrierCode()?a.getPreferredDomesticCarrierCodeOrDefault():b)};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatNumberForMobileDialing=function(a,b,c){var d=a.getCountryCodeOrDefault();if(!this.hasValidCountryCallingCode_(d))return a.hasRawInput()?a.getRawInputOrDefault():"";var e="";a=a.clone();a.clearExtension();var f=this.getRegionCodeForCountryCode(d),g=this.getNumberType(a),h=g!=i18n.phonenumbers.PhoneNumberType.UNKNOWN;if(b==f)e=g==i18n.phonenumbers.PhoneNumberType.FIXED_LINE||g==i18n.phonenumbers.PhoneNumberType.MOBILE||g==i18n.phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE,
"CO"==f&&g==i18n.phonenumbers.PhoneNumberType.FIXED_LINE?e=this.formatNationalNumberWithCarrierCode(a,i18n.phonenumbers.PhoneNumberUtil.COLOMBIA_MOBILE_TO_FIXED_LINE_PREFIX_):"BR"==f&&e?e=a.hasPreferredDomesticCarrierCode()?this.formatNationalNumberWithPreferredCarrierCode(a,""):"":h&&"HU"==f?e=this.getNddPrefixForRegion(f,!0)+" "+this.format(a,i18n.phonenumbers.PhoneNumberFormat.NATIONAL):d==i18n.phonenumbers.PhoneNumberUtil.NANPA_COUNTRY_CODE_?(b=this.getMetadataForRegion(b),e=this.canBeInternationallyDialled(a)&&
!this.isShorterThanPossibleNormalNumber_(b,this.getNationalSignificantNumber(a))?this.format(a,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL):this.format(a,i18n.phonenumbers.PhoneNumberFormat.NATIONAL)):e=(f==i18n.phonenumbers.PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY||("MX"==f||"CL"==f)&&e)&&this.canBeInternationallyDialled(a)?this.format(a,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL):this.format(a,i18n.phonenumbers.PhoneNumberFormat.NATIONAL);else if(h&&this.canBeInternationallyDialled(a))return c?
this.format(a,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL):this.format(a,i18n.phonenumbers.PhoneNumberFormat.E164);return c?e:i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(e,i18n.phonenumbers.PhoneNumberUtil.DIALLABLE_CHAR_MAPPINGS_,!0)};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatOutOfCountryCallingNumber=function(a,b){if(!this.isValidRegionCode_(b))return this.format(a,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);var c=a.getCountryCodeOrDefault(),d=this.getNationalSignificantNumber(a);if(!this.hasValidCountryCallingCode_(c))return d;if(c==i18n.phonenumbers.PhoneNumberUtil.NANPA_COUNTRY_CODE_){if(this.isNANPACountry(b))return c+" "+this.format(a,i18n.phonenumbers.PhoneNumberFormat.NATIONAL)}else if(c==this.getCountryCodeForValidRegion_(b))return this.format(a,
i18n.phonenumbers.PhoneNumberFormat.NATIONAL);var e=this.getMetadataForRegion(b),f=e.getInternationalPrefixOrDefault(),g="";i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(i18n.phonenumbers.PhoneNumberUtil.UNIQUE_INTERNATIONAL_PREFIX_,f)?g=f:e.hasPreferredInternationalPrefix()&&(g=e.getPreferredInternationalPrefixOrDefault());e=this.getRegionCodeForCountryCode(c);e=this.getMetadataForRegionOrCallingCode_(c,e);d=this.formatNsn_(d,e,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);e=this.maybeGetFormattedExtension_(a,
e,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);return 0<g.length?g+" "+c+" "+d+e:this.prefixNumberWithCountryCallingCode_(c,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL,d,e)};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatInOriginalFormat=function(a,b){if(a.hasRawInput()&&(this.hasUnexpectedItalianLeadingZero_(a)||!this.hasFormattingPatternForNumber_(a)))return a.getRawInputOrDefault();if(!a.hasCountryCodeSource())return this.format(a,i18n.phonenumbers.PhoneNumberFormat.NATIONAL);var c;switch(a.getCountryCodeSource()){case i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN:c=this.format(a,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);break;
case i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_IDD:c=this.formatOutOfCountryCallingNumber(a,b);break;case i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITHOUT_PLUS_SIGN:c=this.format(a,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL).substring(1);break;default:var d=this.getRegionCodeForCountryCode(a.getCountryCodeOrDefault()),e=this.getNddPrefixForRegion(d,!0);c=this.format(a,i18n.phonenumbers.PhoneNumberFormat.NATIONAL);if(null==e||0==e.length)break;if(this.rawInputContainsNationalPrefix_(a.getRawInputOrDefault(),
e,d))break;d=this.getMetadataForRegion(d);e=this.getNationalSignificantNumber(a);d=this.chooseFormattingPatternForNumber_(d.numberFormatArray(),e);if(null==d)break;var e=d.getNationalPrefixFormattingRuleOrDefault(),f=e.indexOf("$1");if(0>=f)break;e=e.substring(0,f);e=i18n.phonenumbers.PhoneNumberUtil.normalizeDigitsOnly(e);if(0==e.length)break;c=d.clone();c.clearNationalPrefixFormattingRule();c=this.formatByPattern(a,i18n.phonenumbers.PhoneNumberFormat.NATIONAL,[c])}d=a.getRawInputOrDefault();null!=
c&&0<d.length&&(e=i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(c,i18n.phonenumbers.PhoneNumberUtil.DIALLABLE_CHAR_MAPPINGS_,!0),f=i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(d,i18n.phonenumbers.PhoneNumberUtil.DIALLABLE_CHAR_MAPPINGS_,!0),e!=f&&(c=d));return c};
i18n.phonenumbers.PhoneNumberUtil.prototype.rawInputContainsNationalPrefix_=function(a,b,c){a=i18n.phonenumbers.PhoneNumberUtil.normalizeDigitsOnly(a);if(goog.string.startsWith(a,b))try{return this.isValidNumber(this.parse(a.substring(b.length),c))}catch(d){}return!1};i18n.phonenumbers.PhoneNumberUtil.prototype.hasUnexpectedItalianLeadingZero_=function(a){return a.hasItalianLeadingZero()&&!this.isLeadingZeroPossible(a.getCountryCodeOrDefault())};
i18n.phonenumbers.PhoneNumberUtil.prototype.hasFormattingPatternForNumber_=function(a){var b=a.getCountryCodeOrDefault(),c=this.getRegionCodeForCountryCode(b),b=this.getMetadataForRegionOrCallingCode_(b,c);if(null==b)return!1;a=this.getNationalSignificantNumber(a);return null!=this.chooseFormattingPatternForNumber_(b.numberFormatArray(),a)};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatOutOfCountryKeepingAlphaChars=function(a,b){var c=a.getRawInputOrDefault();if(0==c.length)return this.formatOutOfCountryCallingNumber(a,b);var d=a.getCountryCodeOrDefault();if(!this.hasValidCountryCallingCode_(d))return c;var c=i18n.phonenumbers.PhoneNumberUtil.normalizeHelper_(c,i18n.phonenumbers.PhoneNumberUtil.ALL_PLUS_NUMBER_GROUPING_SYMBOLS_,!0),e=this.getNationalSignificantNumber(a);if(3<e.length){var f=c.indexOf(e.substring(0,3));-1!=f&&(c=
c.substring(f))}f=this.getMetadataForRegion(b);if(d==i18n.phonenumbers.PhoneNumberUtil.NANPA_COUNTRY_CODE_){if(this.isNANPACountry(b))return d+" "+c}else if(null!=f&&d==this.getCountryCodeForValidRegion_(b)){d=this.chooseFormattingPatternForNumber_(f.numberFormatArray(),e);if(null==d)return c;d=d.clone();d.setPattern("(\\d+)(.*)");d.setFormat("$1$2");return this.formatNsnUsingPattern_(c,d,i18n.phonenumbers.PhoneNumberFormat.NATIONAL)}e="";null!=f&&(e=f.getInternationalPrefixOrDefault(),e=i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(i18n.phonenumbers.PhoneNumberUtil.UNIQUE_INTERNATIONAL_PREFIX_,
e)?e:f.getPreferredInternationalPrefixOrDefault());f=this.getRegionCodeForCountryCode(d);f=this.getMetadataForRegionOrCallingCode_(d,f);f=this.maybeGetFormattedExtension_(a,f,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL);return 0<e.length?e+" "+d+" "+c+f:this.prefixNumberWithCountryCallingCode_(d,i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL,c,f)};
i18n.phonenumbers.PhoneNumberUtil.prototype.getNationalSignificantNumber=function(a){var b=""+a.getNationalNumber();return a.hasItalianLeadingZero()&&a.getItalianLeadingZero()?Array(a.getNumberOfLeadingZerosOrDefault()+1).join("0")+b:b};
i18n.phonenumbers.PhoneNumberUtil.prototype.prefixNumberWithCountryCallingCode_=function(a,b,c,d){switch(b){case i18n.phonenumbers.PhoneNumberFormat.E164:return i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN+a+c+d;case i18n.phonenumbers.PhoneNumberFormat.INTERNATIONAL:return i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN+a+" "+c+d;case i18n.phonenumbers.PhoneNumberFormat.RFC3966:return i18n.phonenumbers.PhoneNumberUtil.RFC3966_PREFIX_+i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN+a+"-"+c+d;default:return c+
d}};i18n.phonenumbers.PhoneNumberUtil.prototype.formatNsn_=function(a,b,c,d){b=0==b.intlNumberFormatArray().length||c==i18n.phonenumbers.PhoneNumberFormat.NATIONAL?b.numberFormatArray():b.intlNumberFormatArray();b=this.chooseFormattingPatternForNumber_(b,a);return null==b?a:this.formatNsnUsingPattern_(a,b,c,d)};
i18n.phonenumbers.PhoneNumberUtil.prototype.chooseFormattingPatternForNumber_=function(a,b){for(var c,d=a.length,e=0;e<d;++e){c=a[e];var f=c.leadingDigitsPatternCount();if(0==f||0==b.search(c.getLeadingDigitsPattern(f-1)))if(f=RegExp(c.getPattern()),i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(f,b))return c}return null};
i18n.phonenumbers.PhoneNumberUtil.prototype.formatNsnUsingPattern_=function(a,b,c,d){var e=b.getFormatOrDefault(),f=RegExp(b.getPattern()),g=b.getDomesticCarrierCodeFormattingRuleOrDefault(),h="";c==i18n.phonenumbers.PhoneNumberFormat.NATIONAL&&null!=d&&0<d.length&&0<g.length?(b=g.replace(i18n.phonenumbers.PhoneNumberUtil.CC_PATTERN_,d),e=e.replace(i18n.phonenumbers.PhoneNumberUtil.FIRST_GROUP_PATTERN_,b),h=a.replace(f,e)):(b=b.getNationalPrefixFormattingRuleOrDefault(),h=c==i18n.phonenumbers.PhoneNumberFormat.NATIONAL&&
null!=b&&0<b.length?a.replace(f,e.replace(i18n.phonenumbers.PhoneNumberUtil.FIRST_GROUP_PATTERN_,b)):a.replace(f,e));c==i18n.phonenumbers.PhoneNumberFormat.RFC3966&&(h=h.replace(RegExp("^"+i18n.phonenumbers.PhoneNumberUtil.SEPARATOR_PATTERN_),""),h=h.replace(RegExp(i18n.phonenumbers.PhoneNumberUtil.SEPARATOR_PATTERN_,"g"),"-"));return h};i18n.phonenumbers.PhoneNumberUtil.prototype.getExampleNumber=function(a){return this.getExampleNumberForType(a,i18n.phonenumbers.PhoneNumberType.FIXED_LINE)};
i18n.phonenumbers.PhoneNumberUtil.prototype.getExampleNumberForType=function(a,b){if(!this.isValidRegionCode_(a))return null;var c=this.getNumberDescByType_(this.getMetadataForRegion(a),b);try{if(c.hasExampleNumber())return this.parse(c.getExampleNumberOrDefault(),a)}catch(d){}return null};
i18n.phonenumbers.PhoneNumberUtil.prototype.getExampleNumberForNonGeoEntity=function(a){var b=this.getMetadataForNonGeographicalRegion(a);if(null!=b){b=b.getGeneralDesc();try{if(b.hasExampleNumber())return this.parse("+"+a+b.getExampleNumber(),"ZZ")}catch(c){}}return null};
i18n.phonenumbers.PhoneNumberUtil.prototype.maybeGetFormattedExtension_=function(a,b,c){return a.hasExtension()&&0!=a.getExtension().length?c==i18n.phonenumbers.PhoneNumberFormat.RFC3966?i18n.phonenumbers.PhoneNumberUtil.RFC3966_EXTN_PREFIX_+a.getExtension():b.hasPreferredExtnPrefix()?b.getPreferredExtnPrefix()+a.getExtensionOrDefault():i18n.phonenumbers.PhoneNumberUtil.DEFAULT_EXTN_PREFIX_+a.getExtensionOrDefault():""};
i18n.phonenumbers.PhoneNumberUtil.prototype.getNumberDescByType_=function(a,b){switch(b){case i18n.phonenumbers.PhoneNumberType.PREMIUM_RATE:return a.getPremiumRate();case i18n.phonenumbers.PhoneNumberType.TOLL_FREE:return a.getTollFree();case i18n.phonenumbers.PhoneNumberType.MOBILE:return a.getMobile();case i18n.phonenumbers.PhoneNumberType.FIXED_LINE:case i18n.phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE:return a.getFixedLine();case i18n.phonenumbers.PhoneNumberType.SHARED_COST:return a.getSharedCost();
case i18n.phonenumbers.PhoneNumberType.VOIP:return a.getVoip();case i18n.phonenumbers.PhoneNumberType.PERSONAL_NUMBER:return a.getPersonalNumber();case i18n.phonenumbers.PhoneNumberType.PAGER:return a.getPager();case i18n.phonenumbers.PhoneNumberType.UAN:return a.getUan();case i18n.phonenumbers.PhoneNumberType.VOICEMAIL:return a.getVoicemail();default:return a.getGeneralDesc()}};
i18n.phonenumbers.PhoneNumberUtil.prototype.getNumberType=function(a){var b=this.getRegionCodeForNumber(a),b=this.getMetadataForRegionOrCallingCode_(a.getCountryCodeOrDefault(),b);if(null==b)return i18n.phonenumbers.PhoneNumberType.UNKNOWN;a=this.getNationalSignificantNumber(a);return this.getNumberTypeHelper_(a,b)};
i18n.phonenumbers.PhoneNumberUtil.prototype.getNumberTypeHelper_=function(a,b){var c=b.getGeneralDesc();return c.hasNationalNumberPattern()&&this.isNumberMatchingDesc_(a,c)?this.isNumberMatchingDesc_(a,b.getPremiumRate())?i18n.phonenumbers.PhoneNumberType.PREMIUM_RATE:this.isNumberMatchingDesc_(a,b.getTollFree())?i18n.phonenumbers.PhoneNumberType.TOLL_FREE:this.isNumberMatchingDesc_(a,b.getSharedCost())?i18n.phonenumbers.PhoneNumberType.SHARED_COST:this.isNumberMatchingDesc_(a,b.getVoip())?i18n.phonenumbers.PhoneNumberType.VOIP:
this.isNumberMatchingDesc_(a,b.getPersonalNumber())?i18n.phonenumbers.PhoneNumberType.PERSONAL_NUMBER:this.isNumberMatchingDesc_(a,b.getPager())?i18n.phonenumbers.PhoneNumberType.PAGER:this.isNumberMatchingDesc_(a,b.getUan())?i18n.phonenumbers.PhoneNumberType.UAN:this.isNumberMatchingDesc_(a,b.getVoicemail())?i18n.phonenumbers.PhoneNumberType.VOICEMAIL:this.isNumberMatchingDesc_(a,b.getFixedLine())?b.getSameMobileAndFixedLinePattern()||this.isNumberMatchingDesc_(a,b.getMobile())?i18n.phonenumbers.PhoneNumberType.FIXED_LINE_OR_MOBILE:
i18n.phonenumbers.PhoneNumberType.FIXED_LINE:!b.getSameMobileAndFixedLinePattern()&&this.isNumberMatchingDesc_(a,b.getMobile())?i18n.phonenumbers.PhoneNumberType.MOBILE:i18n.phonenumbers.PhoneNumberType.UNKNOWN:i18n.phonenumbers.PhoneNumberType.UNKNOWN};
i18n.phonenumbers.PhoneNumberUtil.prototype.getMetadataForRegion=function(a){if(null==a)return null;a=a.toUpperCase();var b=this.regionToMetadataMap[a];if(null==b){var b=new goog.proto2.PbLiteSerializer,c=i18n.phonenumbers.metadata.countryToMetadata[a];if(null==c)return null;b=b.deserialize(i18n.phonenumbers.PhoneMetadata.getDescriptor(),c);this.regionToMetadataMap[a]=b}return b};
i18n.phonenumbers.PhoneNumberUtil.prototype.getMetadataForNonGeographicalRegion=function(a){return this.getMetadataForRegion(""+a)};i18n.phonenumbers.PhoneNumberUtil.prototype.isNumberMatchingDesc_=function(a,b){return i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(b.getPossibleNumberPatternOrDefault(),a)&&i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(b.getNationalNumberPatternOrDefault(),a)};
i18n.phonenumbers.PhoneNumberUtil.prototype.isValidNumber=function(a){var b=this.getRegionCodeForNumber(a);return this.isValidNumberForRegion(a,b)};
i18n.phonenumbers.PhoneNumberUtil.prototype.isValidNumberForRegion=function(a,b){var c=a.getCountryCodeOrDefault(),d=this.getMetadataForRegionOrCallingCode_(c,b);if(null==d||i18n.phonenumbers.PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY!=b&&c!=this.getCountryCodeForValidRegion_(b))return!1;var c=d.getGeneralDesc(),e=this.getNationalSignificantNumber(a);return c.hasNationalNumberPattern()?this.getNumberTypeHelper_(e,d)!=i18n.phonenumbers.PhoneNumberType.UNKNOWN:(d=e.length,d>i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_&&
d<=i18n.phonenumbers.PhoneNumberUtil.MAX_LENGTH_FOR_NSN_)};i18n.phonenumbers.PhoneNumberUtil.prototype.getRegionCodeForNumber=function(a){if(null==a)return null;var b=a.getCountryCodeOrDefault(),b=i18n.phonenumbers.metadata.countryCodeToRegionCodeMap[b];return null==b?null:1==b.length?b[0]:this.getRegionCodeForNumberFromRegionList_(a,b)};
i18n.phonenumbers.PhoneNumberUtil.prototype.getRegionCodeForNumberFromRegionList_=function(a,b){for(var c=this.getNationalSignificantNumber(a),d,e=b.length,f=0;f<e;f++){d=b[f];var g=this.getMetadataForRegion(d);if(g.hasLeadingDigits()){if(0==c.search(g.getLeadingDigits()))return d}else if(this.getNumberTypeHelper_(c,g)!=i18n.phonenumbers.PhoneNumberType.UNKNOWN)return d}return null};
i18n.phonenumbers.PhoneNumberUtil.prototype.getRegionCodeForCountryCode=function(a){a=i18n.phonenumbers.metadata.countryCodeToRegionCodeMap[a];return null==a?i18n.phonenumbers.PhoneNumberUtil.UNKNOWN_REGION_:a[0]};i18n.phonenumbers.PhoneNumberUtil.prototype.getRegionCodesForCountryCode=function(a){a=i18n.phonenumbers.metadata.countryCodeToRegionCodeMap[a];return null==a?[]:a};
i18n.phonenumbers.PhoneNumberUtil.prototype.getCountryCodeForRegion=function(a){return this.isValidRegionCode_(a)?this.getCountryCodeForValidRegion_(a):0};i18n.phonenumbers.PhoneNumberUtil.prototype.getCountryCodeForValidRegion_=function(a){var b=this.getMetadataForRegion(a);if(null==b)throw"Invalid region code: "+a;return b.getCountryCodeOrDefault()};
i18n.phonenumbers.PhoneNumberUtil.prototype.getNddPrefixForRegion=function(a,b){var c=this.getMetadataForRegion(a);if(null==c)return null;c=c.getNationalPrefixOrDefault();if(0==c.length)return null;b&&(c=c.replace("~",""));return c};i18n.phonenumbers.PhoneNumberUtil.prototype.isNANPACountry=function(a){return null!=a&&goog.array.contains(i18n.phonenumbers.metadata.countryCodeToRegionCodeMap[i18n.phonenumbers.PhoneNumberUtil.NANPA_COUNTRY_CODE_],a.toUpperCase())};
i18n.phonenumbers.PhoneNumberUtil.prototype.isLeadingZeroPossible=function(a){a=this.getMetadataForRegionOrCallingCode_(a,this.getRegionCodeForCountryCode(a));return null!=a&&a.getLeadingZeroPossibleOrDefault()};
i18n.phonenumbers.PhoneNumberUtil.prototype.isAlphaNumber=function(a){if(!i18n.phonenumbers.PhoneNumberUtil.isViablePhoneNumber(a))return!1;a=new goog.string.StringBuffer(a);this.maybeStripExtension(a);return i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(i18n.phonenumbers.PhoneNumberUtil.VALID_ALPHA_PHONE_PATTERN_,a.toString())};i18n.phonenumbers.PhoneNumberUtil.prototype.isPossibleNumber=function(a){return this.isPossibleNumberWithReason(a)==i18n.phonenumbers.PhoneNumberUtil.ValidationResult.IS_POSSIBLE};
i18n.phonenumbers.PhoneNumberUtil.prototype.testNumberLengthAgainstPattern_=function(a,b){return i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(a,b)?i18n.phonenumbers.PhoneNumberUtil.ValidationResult.IS_POSSIBLE:0==b.search(a)?i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_LONG:i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_SHORT};
i18n.phonenumbers.PhoneNumberUtil.prototype.isShorterThanPossibleNormalNumber_=function(a,b){var c=a.getGeneralDesc().getPossibleNumberPatternOrDefault();return this.testNumberLengthAgainstPattern_(c,b)==i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_SHORT};
i18n.phonenumbers.PhoneNumberUtil.prototype.isPossibleNumberWithReason=function(a){var b=this.getNationalSignificantNumber(a);a=a.getCountryCodeOrDefault();if(!this.hasValidCountryCallingCode_(a))return i18n.phonenumbers.PhoneNumberUtil.ValidationResult.INVALID_COUNTRY_CODE;var c=this.getRegionCodeForCountryCode(a);a=this.getMetadataForRegionOrCallingCode_(a,c).getGeneralDesc();if(!a.hasNationalNumberPattern())return b=b.length,b<i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_?i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_SHORT:
b>i18n.phonenumbers.PhoneNumberUtil.MAX_LENGTH_FOR_NSN_?i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_LONG:i18n.phonenumbers.PhoneNumberUtil.ValidationResult.IS_POSSIBLE;a=a.getPossibleNumberPatternOrDefault();return this.testNumberLengthAgainstPattern_(a,b)};i18n.phonenumbers.PhoneNumberUtil.prototype.isPossibleNumberString=function(a,b){try{return this.isPossibleNumber(this.parse(a,b))}catch(c){return!1}};
i18n.phonenumbers.PhoneNumberUtil.prototype.truncateTooLongNumber=function(a){if(this.isValidNumber(a))return!0;var b=a.clone(),c=a.getNationalNumberOrDefault();do if(c=Math.floor(c/10),b.setNationalNumber(c),0==c||this.isPossibleNumberWithReason(b)==i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_SHORT)return!1;while(!this.isValidNumber(b));a.setNationalNumber(c);return!0};
i18n.phonenumbers.PhoneNumberUtil.prototype.extractCountryCode=function(a,b){var c=a.toString();if(0==c.length||"0"==c.charAt(0))return 0;for(var d,e=c.length,f=1;f<=i18n.phonenumbers.PhoneNumberUtil.MAX_LENGTH_COUNTRY_CODE_&&f<=e;++f)if(d=parseInt(c.substring(0,f),10),d in i18n.phonenumbers.metadata.countryCodeToRegionCodeMap)return b.append(c.substring(f)),d;return 0};
i18n.phonenumbers.PhoneNumberUtil.prototype.maybeExtractCountryCode=function(a,b,c,d,e){if(0==a.length)return 0;a=new goog.string.StringBuffer(a);var f;null!=b&&(f=b.getInternationalPrefix());null==f&&(f="NonMatch");f=this.maybeStripInternationalPrefixAndNormalize(a,f);d&&e.setCountryCodeSource(f);if(f!=i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_DEFAULT_COUNTRY){if(a.getLength()<=i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_)throw i18n.phonenumbers.Error.TOO_SHORT_AFTER_IDD;c=this.extractCountryCode(a,
c);if(0!=c)return e.setCountryCode(c),c;throw i18n.phonenumbers.Error.INVALID_COUNTRY_CODE;}if(null!=b){f=b.getCountryCodeOrDefault();var g=""+f,h=a.toString();if(goog.string.startsWith(h,g)){var k=new goog.string.StringBuffer(h.substring(g.length)),h=b.getGeneralDesc(),g=RegExp(h.getNationalNumberPatternOrDefault());this.maybeStripNationalPrefixAndCarrierCode(k,b,null);b=k.toString();h=h.getPossibleNumberPatternOrDefault();if(!i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(g,a.toString())&&i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(g,
b)||this.testNumberLengthAgainstPattern_(h,a.toString())==i18n.phonenumbers.PhoneNumberUtil.ValidationResult.TOO_LONG)return c.append(b),d&&e.setCountryCodeSource(i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITHOUT_PLUS_SIGN),e.setCountryCode(f),f}}e.setCountryCode(0);return 0};
i18n.phonenumbers.PhoneNumberUtil.prototype.parsePrefixAsIdd_=function(a,b){var c=b.toString();if(0==c.search(a)){var d=c.match(a)[0].length,e=c.substring(d).match(i18n.phonenumbers.PhoneNumberUtil.CAPTURING_DIGIT_PATTERN);if(e&&null!=e[1]&&0<e[1].length&&"0"==i18n.phonenumbers.PhoneNumberUtil.normalizeDigitsOnly(e[1]))return!1;b.clear();b.append(c.substring(d));return!0}return!1};
i18n.phonenumbers.PhoneNumberUtil.prototype.maybeStripInternationalPrefixAndNormalize=function(a,b){var c=a.toString();if(0==c.length)return i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_DEFAULT_COUNTRY;if(i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_.test(c))return c=c.replace(i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_,""),a.clear(),a.append(i18n.phonenumbers.PhoneNumberUtil.normalize(c)),i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN;
c=RegExp(b);i18n.phonenumbers.PhoneNumberUtil.normalizeSB_(a);return this.parsePrefixAsIdd_(c,a)?i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_NUMBER_WITH_IDD:i18n.phonenumbers.PhoneNumber.CountryCodeSource.FROM_DEFAULT_COUNTRY};
i18n.phonenumbers.PhoneNumberUtil.prototype.maybeStripNationalPrefixAndCarrierCode=function(a,b,c){var d=a.toString(),e=d.length,f=b.getNationalPrefixForParsing();if(0==e||null==f||0==f.length)return!1;var g=RegExp("^(?:"+f+")");if(e=g.exec(d)){var f=RegExp(b.getGeneralDesc().getNationalNumberPatternOrDefault()),h=i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(f,d),k=e.length-1;b=b.getNationalPrefixTransformRule();if(null==b||0==b.length||null==e[k]||0==e[k].length){if(h&&!i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(f,
d.substring(e[0].length)))return!1;null!=c&&0<k&&null!=e[k]&&c.append(e[1]);a.set(d.substring(e[0].length))}else{d=d.replace(g,b);if(h&&!i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_(f,d))return!1;null!=c&&0<k&&c.append(e[1]);a.set(d)}return!0}return!1};
i18n.phonenumbers.PhoneNumberUtil.prototype.maybeStripExtension=function(a){var b=a.toString(),c=b.search(i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERN_);if(0<=c&&i18n.phonenumbers.PhoneNumberUtil.isViablePhoneNumber(b.substring(0,c)))for(var d=b.match(i18n.phonenumbers.PhoneNumberUtil.EXTN_PATTERN_),e=d.length,f=1;f<e;++f)if(null!=d[f]&&0<d[f].length)return a.clear(),a.append(b.substring(0,c)),d[f];return""};
i18n.phonenumbers.PhoneNumberUtil.prototype.checkRegionForParsing_=function(a,b){return this.isValidRegionCode_(b)||null!=a&&0<a.length&&i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_.test(a)};i18n.phonenumbers.PhoneNumberUtil.prototype.parse=function(a,b){return this.parseHelper_(a,b,!1,!0)};
i18n.phonenumbers.PhoneNumberUtil.prototype.parseAndKeepRawInput=function(a,b){if(!this.isValidRegionCode_(b)&&0<a.length&&a.charAt(0)!=i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN)throw i18n.phonenumbers.Error.INVALID_COUNTRY_CODE;return this.parseHelper_(a,b,!0,!0)};i18n.phonenumbers.PhoneNumberUtil.prototype.setItalianLeadingZerosForPhoneNumber_=function(a,b){if(1<a.length&&"0"==a.charAt(0)){b.setItalianLeadingZero(!0);for(var c=1;c<a.length-1&&"0"==a.charAt(c);)c++;1!=c&&b.setNumberOfLeadingZeros(c)}};
i18n.phonenumbers.PhoneNumberUtil.prototype.parseHelper_=function(a,b,c,d){if(null==a)throw i18n.phonenumbers.Error.NOT_A_NUMBER;if(a.length>i18n.phonenumbers.PhoneNumberUtil.MAX_INPUT_STRING_LENGTH_)throw i18n.phonenumbers.Error.TOO_LONG;var e=new goog.string.StringBuffer;this.buildNationalNumberForParsing_(a,e);if(!i18n.phonenumbers.PhoneNumberUtil.isViablePhoneNumber(e.toString()))throw i18n.phonenumbers.Error.NOT_A_NUMBER;if(d&&!this.checkRegionForParsing_(e.toString(),b))throw i18n.phonenumbers.Error.INVALID_COUNTRY_CODE;
d=new i18n.phonenumbers.PhoneNumber;c&&d.setRawInput(a);a=this.maybeStripExtension(e);0<a.length&&d.setExtension(a);a=this.getMetadataForRegion(b);var f=new goog.string.StringBuffer,g=0,h=e.toString();try{g=this.maybeExtractCountryCode(h,a,f,c,d)}catch(k){if(k==i18n.phonenumbers.Error.INVALID_COUNTRY_CODE&&i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_.test(h)){if(h=h.replace(i18n.phonenumbers.PhoneNumberUtil.LEADING_PLUS_CHARS_PATTERN_,""),g=this.maybeExtractCountryCode(h,a,f,c,d),
0==g)throw k;}else throw k;}0!=g?(e=this.getRegionCodeForCountryCode(g),e!=b&&(a=this.getMetadataForRegionOrCallingCode_(g,e))):(i18n.phonenumbers.PhoneNumberUtil.normalizeSB_(e),f.append(e.toString()),null!=b?(g=a.getCountryCodeOrDefault(),d.setCountryCode(g)):c&&d.clearCountryCodeSource());if(f.getLength()<i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_)throw i18n.phonenumbers.Error.TOO_SHORT_NSN;null!=a&&(b=new goog.string.StringBuffer,e=new goog.string.StringBuffer(f.toString()),this.maybeStripNationalPrefixAndCarrierCode(e,
a,b),this.isShorterThanPossibleNormalNumber_(a,e.toString())||(f=e,c&&d.setPreferredDomesticCarrierCode(b.toString())));c=f.toString();b=c.length;if(b<i18n.phonenumbers.PhoneNumberUtil.MIN_LENGTH_FOR_NSN_)throw i18n.phonenumbers.Error.TOO_SHORT_NSN;if(b>i18n.phonenumbers.PhoneNumberUtil.MAX_LENGTH_FOR_NSN_)throw i18n.phonenumbers.Error.TOO_LONG;this.setItalianLeadingZerosForPhoneNumber_(c,d);d.setNationalNumber(parseInt(c,10));return d};
i18n.phonenumbers.PhoneNumberUtil.prototype.buildNationalNumberForParsing_=function(a,b){var c=a.indexOf(i18n.phonenumbers.PhoneNumberUtil.RFC3966_PHONE_CONTEXT_);if(0<c){var d=c+i18n.phonenumbers.PhoneNumberUtil.RFC3966_PHONE_CONTEXT_.length;if(a.charAt(d)==i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN){var e=a.indexOf(";",d);0<e?b.append(a.substring(d,e)):b.append(a.substring(d))}b.append(a.substring(a.indexOf(i18n.phonenumbers.PhoneNumberUtil.RFC3966_PREFIX_)+i18n.phonenumbers.PhoneNumberUtil.RFC3966_PREFIX_.length,
c))}else b.append(i18n.phonenumbers.PhoneNumberUtil.extractPossibleNumber(a));c=b.toString();d=c.indexOf(i18n.phonenumbers.PhoneNumberUtil.RFC3966_ISDN_SUBADDRESS_);0<d&&(b.clear(),b.append(c.substring(0,d)))};
i18n.phonenumbers.PhoneNumberUtil.prototype.isNumberMatch=function(a,b){var c,d;if("string"==typeof a)try{c=this.parse(a,i18n.phonenumbers.PhoneNumberUtil.UNKNOWN_REGION_)}catch(e){if(e!=i18n.phonenumbers.Error.INVALID_COUNTRY_CODE)return i18n.phonenumbers.PhoneNumberUtil.MatchType.NOT_A_NUMBER;if("string"!=typeof b){var f=this.getRegionCodeForCountryCode(b.getCountryCodeOrDefault());if(f!=i18n.phonenumbers.PhoneNumberUtil.UNKNOWN_REGION_){try{c=this.parse(a,f)}catch(g){return i18n.phonenumbers.PhoneNumberUtil.MatchType.NOT_A_NUMBER}c=
this.isNumberMatch(c,b);return c==i18n.phonenumbers.PhoneNumberUtil.MatchType.EXACT_MATCH?i18n.phonenumbers.PhoneNumberUtil.MatchType.NSN_MATCH:c}}try{c=this.parseHelper_(a,null,!1,!1)}catch(h){return i18n.phonenumbers.PhoneNumberUtil.MatchType.NOT_A_NUMBER}}else c=a.clone();if("string"==typeof b)try{return d=this.parse(b,i18n.phonenumbers.PhoneNumberUtil.UNKNOWN_REGION_),this.isNumberMatch(a,d)}catch(k){return k!=i18n.phonenumbers.Error.INVALID_COUNTRY_CODE?i18n.phonenumbers.PhoneNumberUtil.MatchType.NOT_A_NUMBER:
this.isNumberMatch(b,c)}else d=b.clone();c.clearRawInput();c.clearCountryCodeSource();c.clearPreferredDomesticCarrierCode();d.clearRawInput();d.clearCountryCodeSource();d.clearPreferredDomesticCarrierCode();c.hasExtension()&&0==c.getExtension().length&&c.clearExtension();d.hasExtension()&&0==d.getExtension().length&&d.clearExtension();if(c.hasExtension()&&d.hasExtension()&&c.getExtension()!=d.getExtension())return i18n.phonenumbers.PhoneNumberUtil.MatchType.NO_MATCH;var f=c.getCountryCodeOrDefault(),
l=d.getCountryCodeOrDefault();if(0!=f&&0!=l)return c.equals(d)?i18n.phonenumbers.PhoneNumberUtil.MatchType.EXACT_MATCH:f==l&&this.isNationalNumberSuffixOfTheOther_(c,d)?i18n.phonenumbers.PhoneNumberUtil.MatchType.SHORT_NSN_MATCH:i18n.phonenumbers.PhoneNumberUtil.MatchType.NO_MATCH;c.setCountryCode(0);d.setCountryCode(0);return c.equals(d)?i18n.phonenumbers.PhoneNumberUtil.MatchType.NSN_MATCH:this.isNationalNumberSuffixOfTheOther_(c,d)?i18n.phonenumbers.PhoneNumberUtil.MatchType.SHORT_NSN_MATCH:i18n.phonenumbers.PhoneNumberUtil.MatchType.NO_MATCH};
i18n.phonenumbers.PhoneNumberUtil.prototype.isNationalNumberSuffixOfTheOther_=function(a,b){var c=""+a.getNationalNumber(),d=""+b.getNationalNumber();return goog.string.endsWith(c,d)||goog.string.endsWith(d,c)};i18n.phonenumbers.PhoneNumberUtil.prototype.canBeInternationallyDialled=function(a){var b=this.getMetadataForRegion(this.getRegionCodeForNumber(a));if(null==b)return!0;a=this.getNationalSignificantNumber(a);return!this.isNumberMatchingDesc_(a,b.getNoInternationalDialling())};
i18n.phonenumbers.PhoneNumberUtil.matchesEntirely_=function(a,b){var c="string"==typeof a?b.match("^(?:"+a+")$"):b.match(a);return c&&c[0].length==b.length?!0:!1};/*

 Copyright (C) 2010 The Libphonenumber Authors.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
i18n.phonenumbers.AsYouTypeFormatter=function(a){this.DIGIT_PLACEHOLDER_="\u2008";this.DIGIT_PATTERN_=RegExp(this.DIGIT_PLACEHOLDER_);this.currentOutput_="";this.formattingTemplate_=new goog.string.StringBuffer;this.currentFormattingPattern_="";this.accruedInput_=new goog.string.StringBuffer;this.accruedInputWithoutFormatting_=new goog.string.StringBuffer;this.ableToFormat_=!0;this.isExpectingCountryCallingCode_=this.isCompleteNumber_=this.inputHasFormatting_=!1;this.phoneUtil_=i18n.phonenumbers.PhoneNumberUtil.getInstance();
this.positionToRemember_=this.originalPosition_=this.lastMatchPosition_=0;this.prefixBeforeNationalNumber_=new goog.string.StringBuffer;this.shouldAddSpaceAfterNationalPrefix_=!1;this.nationalPrefixExtracted_="";this.nationalNumber_=new goog.string.StringBuffer;this.possibleFormats_=[];this.defaultCountry_=a;this.defaultMetadata_=this.currentMetadata_=this.getMetadataForRegion_(this.defaultCountry_)};i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_=" ";
i18n.phonenumbers.AsYouTypeFormatter.EMPTY_METADATA_=new i18n.phonenumbers.PhoneMetadata;i18n.phonenumbers.AsYouTypeFormatter.EMPTY_METADATA_.setInternationalPrefix("NA");i18n.phonenumbers.AsYouTypeFormatter.CHARACTER_CLASS_PATTERN_=/\[([^\[\]])*\]/g;i18n.phonenumbers.AsYouTypeFormatter.STANDALONE_DIGIT_PATTERN_=/\d(?=[^,}][^,}])/g;
i18n.phonenumbers.AsYouTypeFormatter.ELIGIBLE_FORMAT_PATTERN_=RegExp("^["+i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION+"]*(\\$\\d["+i18n.phonenumbers.PhoneNumberUtil.VALID_PUNCTUATION+"]*)+$");i18n.phonenumbers.AsYouTypeFormatter.NATIONAL_PREFIX_SEPARATORS_PATTERN_=/[- ]/;i18n.phonenumbers.AsYouTypeFormatter.MIN_LEADING_DIGITS_LENGTH_=3;
i18n.phonenumbers.AsYouTypeFormatter.prototype.getMetadataForRegion_=function(a){a=this.phoneUtil_.getCountryCodeForRegion(a);a=this.phoneUtil_.getRegionCodeForCountryCode(a);a=this.phoneUtil_.getMetadataForRegion(a);return null!=a?a:i18n.phonenumbers.AsYouTypeFormatter.EMPTY_METADATA_};
i18n.phonenumbers.AsYouTypeFormatter.prototype.maybeCreateNewTemplate_=function(){for(var a=this.possibleFormats_.length,b=0;b<a;++b){var c=this.possibleFormats_[b],d=c.getPatternOrDefault();if(this.currentFormattingPattern_==d)return!1;if(this.createFormattingTemplate_(c))return this.currentFormattingPattern_=d,this.shouldAddSpaceAfterNationalPrefix_=i18n.phonenumbers.AsYouTypeFormatter.NATIONAL_PREFIX_SEPARATORS_PATTERN_.test(c.getNationalPrefixFormattingRule()),this.lastMatchPosition_=0,!0}return this.ableToFormat_=
!1};
i18n.phonenumbers.AsYouTypeFormatter.prototype.getAvailableFormats_=function(a){for(var b=this.isCompleteNumber_&&0<this.currentMetadata_.intlNumberFormatCount()?this.currentMetadata_.intlNumberFormatArray():this.currentMetadata_.numberFormatArray(),c=b.length,d=0;d<c;++d){var e=b[d];(!this.currentMetadata_.hasNationalPrefix()||this.isCompleteNumber_||e.getNationalPrefixOptionalWhenFormatting()||this.phoneUtil_.formattingRuleHasFirstGroupOnly(e.getNationalPrefixFormattingRuleOrDefault()))&&this.isFormatEligible_(e.getFormatOrDefault())&&this.possibleFormats_.push(e)}this.narrowDownPossibleFormats_(a)};
i18n.phonenumbers.AsYouTypeFormatter.prototype.isFormatEligible_=function(a){return i18n.phonenumbers.AsYouTypeFormatter.ELIGIBLE_FORMAT_PATTERN_.test(a)};
i18n.phonenumbers.AsYouTypeFormatter.prototype.narrowDownPossibleFormats_=function(a){for(var b=[],c=a.length-i18n.phonenumbers.AsYouTypeFormatter.MIN_LEADING_DIGITS_LENGTH_,d=this.possibleFormats_.length,e=0;e<d;++e){var f=this.possibleFormats_[e];f.leadingDigitsPatternCount()>c?(f=f.getLeadingDigitsPatternOrDefault(c),0==a.search(f)&&b.push(this.possibleFormats_[e])):b.push(this.possibleFormats_[e])}this.possibleFormats_=b};
i18n.phonenumbers.AsYouTypeFormatter.prototype.createFormattingTemplate_=function(a){var b=a.getPatternOrDefault();if(-1!=b.indexOf("|"))return!1;b=b.replace(i18n.phonenumbers.AsYouTypeFormatter.CHARACTER_CLASS_PATTERN_,"\\d");b=b.replace(i18n.phonenumbers.AsYouTypeFormatter.STANDALONE_DIGIT_PATTERN_,"\\d");this.formattingTemplate_.clear();a=this.getFormattingTemplate_(b,a.getFormatOrDefault());return 0<a.length?(this.formattingTemplate_.append(a),!0):!1};
i18n.phonenumbers.AsYouTypeFormatter.prototype.getFormattingTemplate_=function(a,b){var c="999999999999999".match(a)[0];if(c.length<this.nationalNumber_.getLength())return"";c=c.replace(RegExp(a,"g"),b);return c=c.replace(RegExp("9","g"),this.DIGIT_PLACEHOLDER_)};
i18n.phonenumbers.AsYouTypeFormatter.prototype.clear=function(){this.currentOutput_="";this.accruedInput_.clear();this.accruedInputWithoutFormatting_.clear();this.formattingTemplate_.clear();this.lastMatchPosition_=0;this.currentFormattingPattern_="";this.prefixBeforeNationalNumber_.clear();this.nationalPrefixExtracted_="";this.nationalNumber_.clear();this.ableToFormat_=!0;this.inputHasFormatting_=!1;this.originalPosition_=this.positionToRemember_=0;this.isExpectingCountryCallingCode_=this.isCompleteNumber_=
!1;this.possibleFormats_=[];this.shouldAddSpaceAfterNationalPrefix_=!1;this.currentMetadata_!=this.defaultMetadata_&&(this.currentMetadata_=this.getMetadataForRegion_(this.defaultCountry_))};i18n.phonenumbers.AsYouTypeFormatter.prototype.inputDigit=function(a){return this.currentOutput_=this.inputDigitWithOptionToRememberPosition_(a,!1)};
i18n.phonenumbers.AsYouTypeFormatter.prototype.inputDigitAndRememberPosition=function(a){return this.currentOutput_=this.inputDigitWithOptionToRememberPosition_(a,!0)};
i18n.phonenumbers.AsYouTypeFormatter.prototype.inputDigitWithOptionToRememberPosition_=function(a,b){this.accruedInput_.append(a);b&&(this.originalPosition_=this.accruedInput_.getLength());this.isDigitOrLeadingPlusSign_(a)?a=this.normalizeAndAccrueDigitsAndPlusSign_(a,b):(this.ableToFormat_=!1,this.inputHasFormatting_=!0);if(!this.ableToFormat_){if(!this.inputHasFormatting_)if(this.attemptToExtractIdd_()){if(this.attemptToExtractCountryCallingCode_())return this.attemptToChoosePatternWithPrefixExtracted_()}else if(this.ableToExtractLongerNdd_())return this.prefixBeforeNationalNumber_.append(i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_),this.attemptToChoosePatternWithPrefixExtracted_();
return this.accruedInput_.toString()}switch(this.accruedInputWithoutFormatting_.getLength()){case 0:case 1:case 2:return this.accruedInput_.toString();case 3:if(this.attemptToExtractIdd_())this.isExpectingCountryCallingCode_=!0;else return this.nationalPrefixExtracted_=this.removeNationalPrefixFromNationalNumber_(),this.attemptToChooseFormattingPattern_();default:if(this.isExpectingCountryCallingCode_)return this.attemptToExtractCountryCallingCode_()&&(this.isExpectingCountryCallingCode_=!1),this.prefixBeforeNationalNumber_.toString()+
this.nationalNumber_.toString();if(0<this.possibleFormats_.length){var c=this.inputDigitHelper_(a),d=this.attemptToFormatAccruedDigits_();if(0<d.length)return d;this.narrowDownPossibleFormats_(this.nationalNumber_.toString());return this.maybeCreateNewTemplate_()?this.inputAccruedNationalNumber_():this.ableToFormat_?this.appendNationalNumber_(c):this.accruedInput_.toString()}return this.attemptToChooseFormattingPattern_()}};
i18n.phonenumbers.AsYouTypeFormatter.prototype.attemptToChoosePatternWithPrefixExtracted_=function(){this.ableToFormat_=!0;this.isExpectingCountryCallingCode_=!1;this.possibleFormats_=[];return this.attemptToChooseFormattingPattern_()};
i18n.phonenumbers.AsYouTypeFormatter.prototype.ableToExtractLongerNdd_=function(){if(0<this.nationalPrefixExtracted_.length){var a=this.nationalNumber_.toString();this.nationalNumber_.clear();this.nationalNumber_.append(this.nationalPrefixExtracted_);this.nationalNumber_.append(a);var a=this.prefixBeforeNationalNumber_.toString(),b=a.lastIndexOf(this.nationalPrefixExtracted_);this.prefixBeforeNationalNumber_.clear();this.prefixBeforeNationalNumber_.append(a.substring(0,b))}return this.nationalPrefixExtracted_!=
this.removeNationalPrefixFromNationalNumber_()};i18n.phonenumbers.AsYouTypeFormatter.prototype.isDigitOrLeadingPlusSign_=function(a){return i18n.phonenumbers.PhoneNumberUtil.CAPTURING_DIGIT_PATTERN.test(a)||1==this.accruedInput_.getLength()&&i18n.phonenumbers.PhoneNumberUtil.PLUS_CHARS_PATTERN.test(a)};
i18n.phonenumbers.AsYouTypeFormatter.prototype.attemptToFormatAccruedDigits_=function(){for(var a=this.nationalNumber_.toString(),b=this.possibleFormats_.length,c=0;c<b;++c){var d=this.possibleFormats_[c],e=d.getPatternOrDefault();if(RegExp("^(?:"+e+")$").test(a))return this.shouldAddSpaceAfterNationalPrefix_=i18n.phonenumbers.AsYouTypeFormatter.NATIONAL_PREFIX_SEPARATORS_PATTERN_.test(d.getNationalPrefixFormattingRule()),a=a.replace(RegExp(e,"g"),d.getFormat()),this.appendNationalNumber_(a)}return""};
i18n.phonenumbers.AsYouTypeFormatter.prototype.appendNationalNumber_=function(a){var b=this.prefixBeforeNationalNumber_.getLength();return this.shouldAddSpaceAfterNationalPrefix_&&0<b&&this.prefixBeforeNationalNumber_.toString().charAt(b-1)!=i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_?this.prefixBeforeNationalNumber_+i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_+a:this.prefixBeforeNationalNumber_+a};
i18n.phonenumbers.AsYouTypeFormatter.prototype.getRememberedPosition=function(){if(!this.ableToFormat_)return this.originalPosition_;for(var a=0,b=0,c=this.accruedInputWithoutFormatting_.toString(),d=this.currentOutput_.toString();a<this.positionToRemember_&&b<d.length;)c.charAt(a)==d.charAt(b)&&a++,b++;return b};
i18n.phonenumbers.AsYouTypeFormatter.prototype.attemptToChooseFormattingPattern_=function(){var a=this.nationalNumber_.toString();return a.length>=i18n.phonenumbers.AsYouTypeFormatter.MIN_LEADING_DIGITS_LENGTH_?(this.getAvailableFormats_(a.substring(0,i18n.phonenumbers.AsYouTypeFormatter.MIN_LEADING_DIGITS_LENGTH_)),a=this.attemptToFormatAccruedDigits_(),0<a.length?a:this.maybeCreateNewTemplate_()?this.inputAccruedNationalNumber_():this.accruedInput_.toString()):this.appendNationalNumber_(a)};
i18n.phonenumbers.AsYouTypeFormatter.prototype.inputAccruedNationalNumber_=function(){var a=this.nationalNumber_.toString(),b=a.length;if(0<b){for(var c="",d=0;d<b;d++)c=this.inputDigitHelper_(a.charAt(d));return this.ableToFormat_?this.appendNationalNumber_(c):this.accruedInput_.toString()}return this.prefixBeforeNationalNumber_.toString()};
i18n.phonenumbers.AsYouTypeFormatter.prototype.isNanpaNumberWithNationalPrefix_=function(){if(1!=this.currentMetadata_.getCountryCode())return!1;var a=this.nationalNumber_.toString();return"1"==a.charAt(0)&&"0"!=a.charAt(1)&&"1"!=a.charAt(1)};
i18n.phonenumbers.AsYouTypeFormatter.prototype.removeNationalPrefixFromNationalNumber_=function(){var a=this.nationalNumber_.toString(),b=0;if(this.isNanpaNumberWithNationalPrefix_())b=1,this.prefixBeforeNationalNumber_.append("1").append(i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_),this.isCompleteNumber_=!0;else if(this.currentMetadata_.hasNationalPrefixForParsing()){var c=RegExp("^(?:"+this.currentMetadata_.getNationalPrefixForParsing()+")"),c=a.match(c);null!=c&&null!=
c[0]&&0<c[0].length&&(this.isCompleteNumber_=!0,b=c[0].length,this.prefixBeforeNationalNumber_.append(a.substring(0,b)))}this.nationalNumber_.clear();this.nationalNumber_.append(a.substring(b));return a.substring(0,b)};
i18n.phonenumbers.AsYouTypeFormatter.prototype.attemptToExtractIdd_=function(){var a=this.accruedInputWithoutFormatting_.toString(),b=RegExp("^(?:\\"+i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN+"|"+this.currentMetadata_.getInternationalPrefix()+")"),b=a.match(b);return null!=b&&null!=b[0]&&0<b[0].length?(this.isCompleteNumber_=!0,b=b[0].length,this.nationalNumber_.clear(),this.nationalNumber_.append(a.substring(b)),this.prefixBeforeNationalNumber_.clear(),this.prefixBeforeNationalNumber_.append(a.substring(0,
b)),a.charAt(0)!=i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN&&this.prefixBeforeNationalNumber_.append(i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_),!0):!1};
i18n.phonenumbers.AsYouTypeFormatter.prototype.attemptToExtractCountryCallingCode_=function(){if(0==this.nationalNumber_.getLength())return!1;var a=new goog.string.StringBuffer,b=this.phoneUtil_.extractCountryCode(this.nationalNumber_,a);if(0==b)return!1;this.nationalNumber_.clear();this.nationalNumber_.append(a.toString());a=this.phoneUtil_.getRegionCodeForCountryCode(b);i18n.phonenumbers.PhoneNumberUtil.REGION_CODE_FOR_NON_GEO_ENTITY==a?this.currentMetadata_=this.phoneUtil_.getMetadataForNonGeographicalRegion(b):
a!=this.defaultCountry_&&(this.currentMetadata_=this.getMetadataForRegion_(a));this.prefixBeforeNationalNumber_.append(""+b).append(i18n.phonenumbers.AsYouTypeFormatter.SEPARATOR_BEFORE_NATIONAL_NUMBER_);return!0};
i18n.phonenumbers.AsYouTypeFormatter.prototype.normalizeAndAccrueDigitsAndPlusSign_=function(a,b){var c;a==i18n.phonenumbers.PhoneNumberUtil.PLUS_SIGN?(c=a,this.accruedInputWithoutFormatting_.append(a)):(c=i18n.phonenumbers.PhoneNumberUtil.DIGIT_MAPPINGS[a],this.accruedInputWithoutFormatting_.append(c),this.nationalNumber_.append(c));b&&(this.positionToRemember_=this.accruedInputWithoutFormatting_.getLength());return c};
i18n.phonenumbers.AsYouTypeFormatter.prototype.inputDigitHelper_=function(a){var b=this.formattingTemplate_.toString();if(0<=b.substring(this.lastMatchPosition_).search(this.DIGIT_PATTERN_)){var c=b.search(this.DIGIT_PATTERN_);a=b.replace(this.DIGIT_PATTERN_,a);this.formattingTemplate_.clear();this.formattingTemplate_.append(a);this.lastMatchPosition_=c;return a.substring(0,this.lastMatchPosition_+1)}1==this.possibleFormats_.length&&(this.ableToFormat_=!1);this.currentFormattingPattern_="";return this.accruedInput_.toString()};
/*
 *  Project: jQuery.phoneNumber
 *  Description: Uses PhoneFormat.js to format input field as user inputs a phone number.
 *  Author: @vesauimonen
 *  License: MIT License
 *
 *  PhoneFormat.js Copyright (C) Alan Beebe (alan.beebe@gmail.com).
 *  http://www.phoneformat.com/
 *  PhoneFormat.js is licensed under the Apache License, Version 2.0.
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Plugin boilerplate by Zeno Rocha and Addy Osmani.
 *  http://jqueryboilerplate.com/
 */


;(function($, window, document, undefined) {

  var pluginName = 'phoneNumber';
  var defaults = {
    maxLength: 20
  };

  function Plugin(element, options) {
    this.element = element;
    this.$element = $(element);
    this.options = $.extend({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Plugin.prototype = {
    init: function() {
      // Associated PhoneFormat.js methods
      this.FORMATS = {
        'local': formatLocal,
        'international': formatInternational,
        'e164': formatE164
      };
      var self = this;
      this.$element.keypress(function(event) {
        self.processKeyPress(event);
      });
    },
    processKeyPress: function(event) {
      var newNumber, oldNumber;
      if (this.isValidInput(event)) {
        if (this.hasFocusAtEnd()) {
          event.preventDefault();
          oldNumber = this.$element.val();
          if (event.which == 8) {
            oldNumber = oldNumber.slice(0,-1);
          } else {
            oldNumber = oldNumber + String.fromCharCode(event.which);
          }
          newNumber = this.FORMATS[this.options.format.toLowerCase()](
            this.options.country.toUpperCase(),
            oldNumber
          );
          this.$element.val(newNumber);
        }
      } else {
        event.preventDefault();
      }
    },
    hasFocusAtEnd: function() {
      if (this.$element.prop('selectionStart') === null ||
          this.$element.prop(
            'selectionStart'
            ) === this.$element.val().length) {
        return true;
      }
      return false;
    },
    isValidInput: function(event) {
      var SPACE = 32,
        SPECIAL_CHAR_WEBKIT = 0,
        SPECIAL_CHAR_FIREFOX = 33;
      if (this.$element.val().length >= this.options.maxLength &&
        !this.hasSelectedText(event)) {
        // Maximum length of phone number exceeded and no text is selected
        return false;
      } else if (event.metaKey || event.ctrlKey) {
        return true;
      } else if (event.which === SPACE) {
        return false;
      } else if (event.which === SPECIAL_CHAR_WEBKIT) {
        return true;
      } else if (event.which < SPECIAL_CHAR_FIREFOX) {
        return true;
      } else {
        var re = /^\d$/;
        return re.test(String.fromCharCode(event.which)) ||
          String.fromCharCode(event.which) === '+' ||
          String.fromCharCode(event.which) === '-';
      }
    },
    hasSelectedText: function() {
      if (this.$element.prop('selectionStart') !== null &&
        this.$element.prop('selectionStart') !==
        this.$element.prop('selectionEnd')) {
        return true;
      }
      return false;
    }
  };

  // Plugin wrapper
  $.fn[pluginName] = function(options) {
    if (typeof formatLocal === 'undefined') {
      // PhoneFormat.js not loaded
      $.error( 'jQuery.' + pluginName + ' depency PhoneFormat.js not loaded' );
      return;
    }
    return this.each(function() {
      if (!$.data(this, 'plugin_' + pluginName)) {
        $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
      }
    });
  };

})(jQuery, window, document);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
(function() {


}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//

;
(function() {
  $(function() {
    return $(".provider-account").on("tap", function() {
      console.log("tap");
      console.log(this.id);
      $(".provider-account").removeClass("active");
      $(this).addClass("active");
      $(".hidden").val(this.id);
      return $(".btn-custom").prop('disabled', false);
    });
  });

}).call(this);
(function() {


}).call(this);
(function() {
  $(function() {
    var hide_overlay;
    $("#phone_number").phoneNumber({
      format: "local",
      country: "US"
    });
    $("#phone_number").focus();
    $("#download-cta").click(function() {
      if ($("#footer").hasClass("mobile")) {
        return window.location.href = "https://itunes.apple.com/us/app/triage-everything-thats-happening/id744662903?ls=1&mt=8";
      } else {
        $("html, body").css({
          overflow: "hidden",
          height: "100%"
        });
        $("body").addClass("make-way");
        $("#loaded-content").addClass("loaded");
        return $("#downloading").fadeIn(800);
      }
    });
    hide_overlay = function() {
      $("html, body").css({
        overflow: "auto",
        height: "auto"
      });
      $("body").removeClass("make-way");
      $("#loaded-content").removeClass("loaded");
      return $("#downloading").hide();
    };
    return $(document).mouseup(function(e) {
      var container;
      container = $(".download-region");
      console.log("click");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        return hide_overlay();
      }
    });
  });

}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//







;
