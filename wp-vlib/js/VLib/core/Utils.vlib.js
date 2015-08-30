define( ['require',
		'core/utils/Utils.Math.vlib',
		'core/utils/Utils.Scale.vlib',
		'core/utils/Utils.Nice.vlib',
		'core/utils/Utils.Interpolate.vlib',
		'core/utils/Utils.Activity.vlib',
		'core/utils/Utils.SafeLoop.vlib',
		'core/utils/Utils.FileReader.vlib',
		'core/utils/Utils.TreeHandler.vlib',
		'underscore'],
	function ( require,
	           MATH,
	           SCALE,
	           NICE,
	           INTERPOLATE,
	           ACTIVITY,
	           SAFELOOP,
	           FILEREADER,
	           TREEHANDLER,
	           _ ) {
		'use strict';
		/**
		 Base class of the framework.<br />
		 On the one hand vLib is an interface to the "outside world".
		 On the other it provides information to modules.<br />
		 VLib registers it self as pseudo module and acts as a service provider.<br/>
		 It holds an instance of VMediator.<br />
		 @class UTILS
		 @module VLib
		 **/
		var UTILS = {

			/**
			 Creates an unique 16 digit identification number.
			 @method getUUID
			 @return {String}
			 **/
			getUUID  : function () {
				return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
					var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
					return v.toString( 16 );
				} );
			},
			struct   : {
				/**
				 Plugin flyweight, which represents a plugin.
				 @method struct.treeNode
				 @param name
				 Unique plugin name.
				 @return {Object}
				 Object.id = Unique plugin id.
				 Object.name = Unique plugin name.
				 Object.config = Plugin configuration object.
				 Object.childs = Array for attached child plugins.
				 **/
				treeNode: function ( name ) {
					this.id = name + '_' + UTILS.getUUID();
					this.name = name;
					this.config = '';
					this.childs = [];
				}
			},

			/*
			 * @param key: x | y | z
			 * @param data: array of objects
			 * {x:value,y:value,z:value}
			 *
			 * Chrome (the V8 engine) uses in-place QuickSort internally
			 * (for arrays of size ≥ 22, else insertion sort) which is fast but not stable
			 */
			/**
			 Sort data objects by key.
			 @method sortBy
			 @param data {Array}
			 Array of data objects {x:VALUE,y:VALUE,z:VALUE}.
			 @param key {String}
			 Possible values are (x,y,z)
			 @default x
			 @return {Array}
			 Array of sorted data objects.
			 Sorted by key.
			 **/
			sortBy   : function ( data, key ) {
				var cX = function ( a, b ) {
					return parseFloat( a.x ) - parseFloat( b.x );
				};
				var cY = function ( a, b ) {
					return parseFloat( a.y ) - parseFloat( b.y );
				};
				var cZ = function ( a, b ) {
					return parseFloat( a.z ) - parseFloat( b.z );
				};
				var sortedData;
				switch ( key ) {
					case 'x':
						sortedData = data.sort( cX );
						break;
					case 'y':
						sortedData = data.sort( cY );
						break;
					case 'z':
						sortedData = data.sort( cZ );
						break;
					default:
						sortedData = data.sort( cX );
						break;
				}
				return sortedData;
			},
			initArray: function ( length, value ) {
				var arr = [], i = 0;
				arr.length = length;
				var process = function () {
					for ( ; i < length; ++i ) {
						arr[i] = value;
						if ( i + 1 < length && i % 100 == 0 ) {
							setTimeout( process, 1 );
						}
					}
				}
				process();
				return arr;
			}
		};
		/* CLASS */
		UTILS.CLASS = {
			/**
			 Recommendation from Harmes and Diaz
			 "Javascript - Objektorientierung und Entwurfsmuster"
			 ISBN: 987-3-7723-6488-4
			 @method CLASS.extend
			 @param subClass
			 @param superClass
			 **/
			extend: function ( subClass, superClass ) {
				var F = function () {
				};
				F.prototype = superClass.prototype;
				subClass.prototype = new F();
				//prototype chaining
				subClass.prototype.constuctor = subClass;
				//add varible superClass to subClass
				subClass.superClass = superClass.prototype;
				//superClass is Object-Class itself
				if ( superClass.prototype.constuctor == Object.prototype.constuctor ) {
					superClass.prototype.constuctor = superClass;
				}
			}
		};
		UTILS.C3D = {
			/**
			 Calculates the unit vector (Einheitsvektor) of the given data objects
			 @method C3D.normalize
			 @param data {Array}
			 Array of data objects {x:VALUE,y:VALUE,z:VALUE}.
			 @return {Array}
			 Array of normalized data objects {x:VALUE,y:VALUE,z:VALUE}
			 */
			normalize    : function ( data ) {

				var normalized_data = [];
				for ( var index = 0; index < data.length; ++index ) {
					var ax = parseFloat( data[index].x );
					var ay = parseFloat( data[index].y );
					var az = parseFloat( data[index].z );

					var length = Math.sqrt( (ax * ax) + (ay * ay) + (az * az) );
					normalized_data.push( {
						x: ax / length,
						y: ay / length,
						z: az / length
					} );
				}
				return normalized_data;

			},
			/**
			 Finds limit values of the given data.
			 @method C3D.getMinMax
			 @param data {Array}
			 Array of data objects {x:VALUE,y:VALUE,z:VALUE}.
			 @return {Object}
			 Object = {
						xMin : VALUE,
						yMin : VALUE,
						zMin : VALUE,
						xMax : VALUE,
						yMax : VALUE,
						zMax : VALUE,
					}
			 */
			getMinMax    : function ( data ) {

				var result = {};
				result.xMax = Number.NEGATIVE_INFINITY;
				result.yMax = Number.NEGATIVE_INFINITY;
				result.zMax = Number.NEGATIVE_INFINITY;
				result.xMin = Number.POSITIVE_INFINITY;
				result.yMin = Number.POSITIVE_INFINITY;
				result.zMin = Number.POSITIVE_INFINITY;


				for ( var index = 0; index < data.length; ++index ) {

					var x = parseFloat( data[index].x );
					var y = parseFloat( data[index].y );
					var z = parseFloat( data[index].z );

					if ( x >= result.xMax ) {
						result.xMax = x;
					}
					if ( x < result.xMin ) {
						result.xMin = x;
					}

					if ( y >= result.yMax ) {
						result.yMax = y;
					}
					if ( y < result.yMin ) {
						result.yMin = y;
					}

					if ( z >= result.zMax ) {
						result.zMax = z;
					}
					if ( z < result.zMin ) {
						result.zMin = z;
					}
				}
				// if(result.zMax === Number.NEGATIVE_INFINITY){
				// 	result.zMax = Number.MIN_VALUE;
				// }else if(result.zMax === Number.POSITIVE_INFINITY){
				// 	result.zMax = Number.MAX_VALUE;
				// }
				// if(result.zMin === Number.NEGATIVE_INFINITY){
				// 	result.zMin = Number.MIN_VALUE;
				// 	alert(result.zMin);
				// }else if(result.zMin === Number.POSITIVE_INFINITY){
				// 	result.zMin = Number.MAX_VALUE;
				// }

				return result;
			},
			safeMinMax   : function ( doneCB, data ) {
				var result = {};
				result.xMax = Number.NEGATIVE_INFINITY;
				result.yMax = Number.NEGATIVE_INFINITY;
				result.zMax = Number.NEGATIVE_INFINITY;
				result.xMin = Number.POSITIVE_INFINITY;
				result.yMin = Number.POSITIVE_INFINITY;
				result.zMin = Number.POSITIVE_INFINITY;
				var safeLoop = SAFELOOP();

				safeLoop.done( function () {
					doneCB( result );
				} )
					.iterations( data.length )
					.loop( function ( index ) {
						var x = parseFloat( data[index].x );
						var y = parseFloat( data[index].y );
						var z = parseFloat( data[index].z );

						if ( x >= result.xMax ) {
							result.xMax = x;
						}
						if ( x < result.xMin ) {
							result.xMin = x;
						}

						if ( y >= result.yMax ) {
							result.yMax = y;
						}
						if ( y < result.yMin ) {
							result.yMin = y;
						}

						if ( z >= result.zMax ) {
							result.zMax = z;
						}
						if ( z < result.zMin ) {
							result.zMin = z;
						}
					} );
			},
			getUniqe : function( data, key){
				return _.uniq( _.collect( data, function ( d ) {
					return d[ key ];
				} ) );
			},
			/**
			 Finds data dimension x-y.<br />
			 @method C3D.getDimensions
			 @param data {Array}
			 Array of data objects {x:VALUE,y:VALUE,z:VALUE}.
			 @return {Object}
			 Object = {
						d1 : VALUE,
						d2 : VALUE
					}
			 **/
			getDimensions: function ( data ) {
				var data_len = data.length;
				var x1 = _.uniq( _.collect( data, function ( d ) {
					return d.x;
				} ) ).length;
				var y1 = _.uniq( _.collect( data, function ( d ) {
					return d.y;
				} ) ).length;
				//console.log("x1: "+x1+" y1: "+y1);
				var x2 = Math.ceil( data_len / x1 );
				var y2 = Math.ceil( data_len / y1 );
				//console.log("x2: "+x2+" y2: "+y2);
				var result = {d1: 0, d2: 0};
				if ( ( x1 * x2 ) === data_len ) {
					result.d1 = x1;
					result.d2 = x2;
				} else if ( ( y1 * y2 ) === data_len ) {
					result.d1 = y1;
					result.d2 = y2;
				} else {
					result.d1 = x1;
					result.d2 = y1;
				}

				return result;
			},
			getNumUniqueXYZ : function( data ){
				var data_len = data.length;
				var uniqueX = _.uniq( _.collect( data, function( d ){
					return d.x;
				})).length;
				var uniqueY = _.uniq( _.collect( data, function( d ){
					return d.y;
				})).length;
				var uniqueZ = _.uniq( _.collect( data, function( d ){
					return d.z;
				})).length;

				return {x:uniqueX,y:uniqueY,z:uniqueZ};

			}
		};
		UTILS.download = function ( filename, text, mimeType ) {
			var mime = 'data:text/plain;charset=utf-8,';
			if ( mimeType !== undefined ) {
				mime = mimeType
			}
			var clickEvent = new MouseEvent( "click", {
				"view"      : window,
				"bubbles"   : true,
				"cancelable": false
			} );
			var pom = document.createElement( 'a' );
			pom.setAttribute( 'href', mime + encodeURIComponent( text ) );
			pom.setAttribute( 'download', filename );
			pom.dispatchEvent( clickEvent );
		};
		UTILS.math = MATH;
		UTILS.scale = SCALE;
		UTILS.nice = NICE;
		UTILS.interpolate = INTERPOLATE;
		UTILS.ACTIVITY = ACTIVITY;
		UTILS.safeloop = SAFELOOP;
		UTILS.FileReader = FILEREADER;
		UTILS.TreeHandler = TREEHANDLER;
		return UTILS;
	} );
