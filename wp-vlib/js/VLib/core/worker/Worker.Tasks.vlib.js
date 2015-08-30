define( ['require', 'config'], function ( require, Config ) {
	'use strict';

	var Tasks = {

		ECHO_TASK: {
			worker : function () {
				self.onmessage = function ( e ) {
					var _RESPONSE_PACKAGE_SIZE_ = 1000;
					var isRunning = true,
						id = e.data.id,
						STATUS = {
							OK   : 'ok',
							ERROR: 'error',
							INFO : 'info',
							DONE : 'done'
						},
						deps = e.data.deps;
					var sendMessage = function ( response, status ) {
						var msg = {status: status || STATUS.OK, response: response};
						postMessage( msg );
					};
					//sendMessage( e.data, STATUS.OK );
					sendMessage( "[ Worker " + id + " ] importScripts " + deps.join( ',' ), STATUS.INFO );
					for ( var i = 0; i < 10; ++i ) {
						importScripts( deps.join( ',' ) );
						if ( typeof require === 'function' ) {
							break;
						}
					}
					sendMessage( "[ Worker " + id + " ] require.js " + typeof require, STATUS.INFO );
					self.close();
				};
			},
			deps   : ['http://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.15/require.min.js'],
			require: []
		},

		TASK_SCALE_OBJECTS_LIN     : {

			worker  : function () {

				var _RESPONSE_PACKAGE_SIZE_ = 1000;

				self.onmessage = function ( e ) {

					var isRunning = true,
						id = e.data.args.id,
						STATUS = {
							OK   : 'ok',
							ERROR: 'error',
							INFO : 'info',
							DONE : 'done'
						};

					var sendMessage = function ( response, status ) {
						var msg = {status: status || STATUS.OK, response: response};
						postMessage( msg );
					};
					/* check args */
					if ( !e.data.hasOwnProperty( "args" ) ) {
						sendMessage( "[ Worker ] Arguments not set.", STATUS.ERROR );
						isRunning = false;
					}
					if ( !e.data.args.hasOwnProperty( "borders" ) || !e.data.args.hasOwnProperty( "data" ) ) {
						sendMessage( "[ Worker ] Argument <border> or <data> not set.", STATUS.ERROR );
						isRunning = false;
					}
					if ( isRunning ) {
						/* parameters */
						var deps = e.data.deps;
						var requires = e.data.requires;
						var args = e.data.args;
						var borders = e.data.args.borders;
						var data = e.data.args.data;
						var tick = e.data.args.tick;
						var offset = e.data.args.offset;
						var packageSize = e.data.args.packageSize;
						_RESPONSE_PACKAGE_SIZE_ = packageSize || _RESPONSE_PACKAGE_SIZE_;
						var dataArray = data.slice( 0 );

						/* include external scripts */
						for ( var i = 0; i < 10; ++i ) {
							try {
								importScripts( deps.join( ',' ) );
							} catch ( e ) {
								sendMessage( "[ Worker " + id + " ] importScripts failed" + e.message, STATUS.INFO );
							}
							if ( typeof Scale === 'function' ) {
								break;
							}
						}

						if ( typeof Scale !== 'function' ) {
							sendMessage( "[ Worker " + id + " ] Unable to import scale.js ", STATUS.ERROR );
						}

						var xScaler = new Scale()
							.range( [borders.x_SCALE_MIN, borders.x_SCALE_MAX] ).
							domain( [borders.x_MIN, borders.x_MAX] );
						var yScaler = new Scale()
							.range( [borders.y_SCALE_MIN, borders.y_SCALE_MAX] )
							.domain( [borders.y_MIN, borders.y_MAX] );
						var zScaler = new Scale()
							.range( [borders.z_SCALE_MIN, borders.z_SCALE_MAX] )
							.domain( [borders.z_MIN, borders.z_MAX] );


						var result, start = 0, end = 0, dataLen = dataArray.length;


						do {
							/* calc start, end */
							start = end;
							end = start + _RESPONSE_PACKAGE_SIZE_;
							if ( end > dataLen ) {
								end = dataLen;
							}


							sendMessage( "id=" + id + " packageSize=" + _RESPONSE_PACKAGE_SIZE_ + " dataLen=" + dataLen + " start=" + start + " end=" + end + " offset=" + offset, STATUS.INFO );
							/* scale */
							result = [];

							for ( var i = start; i < end; ++i ) {

								/* scale */
								result.push( {
									x: xScaler.linear( data[i].x ),
									y: yScaler.linear( data[i].y ),
									z: zScaler.linear( data[i].z )
								} );
							}
							/* post */
							sendMessage( {id: id, tick : tick,  data: result, start: start, end: end, offset: offset}, STATUS.OK );


						} while ( end < dataLen );

						/* WORK DONE */
						sendMessage( {id: id, tick : tick, data: result, start: start, end: end, offset: offset}, STATUS.DONE );
						self.close();

					}
				}
			}, /* fun */
			/**
			 deps:
			 External scripts, which will be included by the WebWorker.
			 e.g.: includeScripts( e.data.deps[0] );
			 */
			deps    : [
				Config.appPath + 'core/worker/scale.js'
			],
			/**
			 Path to module
			 e.g.: require( [ e.data.require[ 0 ]. e.data.require[ 1 ] ], function( Module1, Module2 ){ ... } )
			 */
			requires: [
				Config.appPath + 'core/utils/Utils.Scale.vlib.js'
			]
		},
		TASK_SCALE_FLOAT32ARRAY_LIN: {

			worker  : function () {

				var _RESPONSE_PACKAGE_SIZE_ = 3000;
				self.onmessage = function ( e ) {
					var isRunning = true;
					var STATUS = {
						OK   : 'ok',
						ERROR: 'error',
						INFO : 'info',
						DONE : 'done'
					};

					var sendMessage = function ( response, status ) {
						var msg = {status: status || STATUS.OK, response: response};
						postMessage( msg );
					};
					var getMessageObj = function ( response, status ) {
						return {status: status || STATUS.OK, response: response};
					};
					/* check args */
					if ( !e.data.hasOwnProperty( "args" ) ) {
						sendMessage( "[ Worker ] Arguments not set.", STATUS.ERROR );
						isRunning = false;
					}
					if ( !e.data.args.hasOwnProperty( "borders" ) || !e.data.args.hasOwnProperty( "data" ) ) {
						sendMessage( "[ Worker ] Argument <border> or <data> not set.", STATUS.ERROR );
						isRunning = false;
					}
					sendMessage( e.data, STATUS.INFO );

					/* parameters */
					var deps = e.data.deps;
					var requires = e.data.requires;
					var args = e.data.args;
					var borders = e.data.args.borders;
					var data = e.data.args.data;
					var tick = e.data.args.tick;
					var offset = e.data.args.offset;
					var packageSize = e.data.args.packageSize;
					_RESPONSE_PACKAGE_SIZE_ = packageSize || _RESPONSE_PACKAGE_SIZE_;
					var dataf32 = new Float32Array( data );
					var VLIB_SCALE = requires[0];


					/* include external scripts */
					//sendMessage( "[ Worker " + id + " ] importScripts " + deps.join( ',' ), STATUS.INFO );
					for ( var i = 0; i < 10; ++i ) {
						importScripts( deps.join( ',' ) );
						if ( typeof Scale === 'function' ) {
							break;
						}
					}
					if ( typeof Scale !== 'function' ) {
						sendMessage( "[ Worker " + id + " ] Unable to import require.js ", STATUS.ERROR );
					}
					sendMessage( "[ Worker ] require " + VLIB_SCALE, STATUS.INFO );
					var xScaler = new Scale()
						.range( [borders.x_SCALE_MIN, borders.x_SCALE_MAX] ).
						domain( [borders.x_MIN, borders.x_MAX] );
					var yScaler = new Scale()
						.range( [borders.y_SCALE_MIN, borders.y_SCALE_MAX] )
						.domain( [borders.y_MIN, borders.y_MAX] );
					var zScaler = new Scale()
						.range( [borders.z_SCALE_MIN, borders.z_SCALE_MAX] )
						.domain( [borders.z_MIN, borders.z_MAX] );


					var resultf32, start = 0, end = 0, dataLen = dataf32.length;
					var tmp;
					var id = Math.ceil( Math.random() * 1000 );

					do {
						/* calc start, end */
						start = end;
						end = start + _RESPONSE_PACKAGE_SIZE_;
						if ( end > dataLen ) {
							end = dataLen;
						}
						tmp = new Float32Array( dataf32 );
						resultf32 = tmp.subarray( start, end );
						sendMessage( "id=" + id +" tick=" + tick + "  packageSize=" + _RESPONSE_PACKAGE_SIZE_ + " dataLen=" + dataLen + " start=" + start + " end=" + end + " offset=" + offset, STATUS.INFO );
						/* scale */
						for ( var i = 0, len = resultf32.length; i < len; i += 3 ) {
							resultf32[i] = xScaler.linear( resultf32[i] );
							resultf32[i + 1] = yScaler.linear( resultf32[i + 1] );
							resultf32[i + 2] = zScaler.linear( resultf32[i + 2] );
						}
						/* post */
						var msg = getMessageObj( {id: id, tick : tick, data: resultf32, start: start, end: end, offset: offset} );
						postMessage( msg, [msg.response.data.buffer] );


					} while ( end < dataLen );


					/* WORK DONE */
					sendMessage( { tick : tick}, STATUS.DONE );
					self.close();

				}
			}, /* fun */
			/**
			 deps:
			 External scripts, which will be included by the WebWorker.
			 e.g.: includeScripts( e.data.deps[0] );
			 */
			deps    : [
				Config.appPath + 'core/worker/scale.js'
			],
			/**
			 Path to module
			 e.g.: require( [ e.data.require[ 0 ]. e.data.require[ 1 ] ], function( Module1, Module2 ){ ... } )
			 */
			requires: [
				Config.basePath + Config.appPath + 'core/utils/Utils.Scale.vlib.js'
			]
		}

	};
	return Tasks;
} );
