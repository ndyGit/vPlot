define( ['require', 'core/Utils.vlib', 'libs/md5'], function ( require, UTILS, md5 ) {
	'use strict';
	var Buffer = function ( id ) {
		var _id = id;
		var _attributes = {};
		return {
			attributes     : _attributes,
			getId          : function () {
				return _id;
			},
			getAttribute   : function ( name ) {
				if ( !_attributes[name] ) {
					return false;
				}
				return _attributes[name];
			},
			clone          : function ( attribute, cloneFunction ) {
				var result = false;
				if ( this.isAttribute( attribute ) ) {
					var tmp = this.getAttribute( attribute );
					var result = tmp.size === false ? new tmp.type() : new tmp.type( tmp.size );
					for ( var i = 0, len = tmp.array.length; i < len; ++i ) {
						result[i] = cloneFunction( tmp.array[i] );
					}
				} else {
					console.log( "[ Error ][ Buffer.clone() ] " + attribute + " is not an attribute of this buffer." );
				}
				return result;
			},
			filter : function( attribute, filterFunction ){
				var result = false;
				if ( this.isAttribute( attribute ) ) {
					var tmp = this.getAttribute( attribute );
					var result = tmp.size === false ? new tmp.type() : new tmp.type( tmp.size );
					for ( var i = 0, len = tmp.array.length; i < len; ++i ) {
						if( filterFunction( tmp.array[i] ) ){
							result.push( tmp.array[i] );
						}
					}
				} else {
					console.log( "[ Error ][ Buffer.filter() ] " + attribute + " is not an attribute of this buffer." );
				}
				return result;
			},
			setAttribute   : function ( name, type, numItems, itemSize ) {
				var size = false;
				if ( arguments.length < 2 ) {
					return false;
				}
				if ( numItems !== undefined ) {
					size = numItems;
				}
				if ( itemSize !== undefined ) {
					size *= itemSize;
				}
				_attributes[name] = {
					name    : name,
					dirty   : false,
					itemSize: itemSize === undefined ? -1 : itemSize,
					array   : size !== false ? new type( size ) : new type(),
					type    : type,
					size    : size
				};
				return _attributes[name];
			},
			isAttribute    : function ( name ) {
				return _attributes[name] === undefined ? false : true;
			},
			deleteAttribute: function ( name ) {
				_attributes[name] = undefined;
				delete _attributes[name];
				return true;
			},
			empty          : function () {
				_attributes = null;
				_attributes = {};
				return true;
			},
			getAttributes  : function () {
				var result = [];
				for ( var key in _attributes ) {
					if ( _attributes.hasOwnProperty( key ) ) {
						result.push( key );
					}
				}
				return result;
			},
			log            : function () {
				console.log( "####################" );
				console.log( "Buffer[ " + _id + " ]" );
				console.dir( _attributes );
			},
			/**
			 TRUE if <element> equals buffer attribute value
			 @method Dirty
			 @public
			 @param attribute {String}
			 Name of buffer attribute which could be dirty.
			 @param element {String}
			 element to compare
			 **/
			isDirty        : function ( attribute, element ) {

				var result = false;
				if ( this.isAttribute( 'HASH_' + attribute ) ) {
					var hashedElement = JSON.stringify( element );//md5( JSON.stringify( element ) );
					var target = this.getAttribute( 'HASH_' + attribute );
					if ( target.array.hash !== hashedElement ) {
						target.dirty = true;
						result = true;
					} else {
						//console.log( attribute + " SAME: " + target.array.hash );
						target.dirty = false;
					}
				} else {
					result = true;
				}

				return result;
			},
			isDirtyCB      : function ( attribute, element, callback ) {
				callback( true );
				return;

				if ( !this.isAttribute( 'HASH_' + attribute ) ) {
					callback( true );
					return;
				}

				var hashedElement = JSON.stringify( element );//md5( JSON.stringify( element ) );
				var bufferedElement = this.getAttribute( 'HASH_' + attribute ).array.hash;

				var hashedElementLen = hashedElement.length;

				if ( hashedElementLen !== bufferedElement.length ) {

					callback( true );
					return;
				}

				var isDirty = false;
				var sl = UTILS.safeloop();
				sl.iterations( hashedElementLen )
					.done( function () {
						callback( isDirty );
					} )
					.loop( function ( i ) {
						if ( bufferedElement[i] !== hashedElement[i] ) {
							isDirty = true;
							sl.break();
						}
					} );

			},
			/**
			 * Hashes <element> and stores it to buffer attribute 'HASH_'+attribute
			 * @param attribute
			 * Buffer attribute
			 * @param element
			 * Element to hash
			 */
			setHash        : function ( attribute, element ) {
				"use strict";
				return;
				if ( this.hasOwnProperty( 'getAttribute' ) ) {
					//alert("set HASH "+attribute);
					var b = this.setAttribute( 'HASH_' + attribute, Object );
					//b.array.hash = md5( JSON.stringify( element ) );
					b.array.hash = JSON.stringify( element );
					//console.log( attribute + " CREATE: %s = %s", 'HASH_' + attribute, b.array.hash );
				} else {
					console.log( "[ Error ][ setHash ] invalid buffer!" );
				}
			}
		};
	};

	return Buffer;
} );
