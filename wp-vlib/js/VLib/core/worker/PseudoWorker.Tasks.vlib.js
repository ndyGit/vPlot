define( ['require', 'config'], function ( require, Config ) {
	'use strict';
	var Tasks = {
		ECHO_TASK                  : {
			worker : function () {
				var context = this;
				self.onmessage = function ( e ) {

					var _RESPONSE_PACKAGE_SIZE_ = 1000;
					var isRunning = true,
						id = e.data.id,
						STATUS = {
							OK   : 'ok',
							ERROR: 'error',
							INFO : 'info',
							DONE : 'done'
						};

					var sendMessage = function ( response, status ) {
						var msg = {status: status || STATUS.OK, response: response};
						context.postMessage( msg );
					};
					sendMessage( e.data, STATUS.OK );
				};
				self.onmessage( arguments[0] );
			},
			deps   : [],
			require: []
		},
		TASK_SCALE_OBJECTS_LIN     : {

			worker  : function () {
				var context = this;
				var _RESPONSE_PACKAGE_SIZE_ = 1000;
				self.onmessage = function ( e ) {
					console.log( e );
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
						context.postMessage( msg );
					};
					/* check args */
					if ( !e.data.hasOwnProperty( "args" ) ) {
						sendMessage( "[ PseudoWorker ] Arguments not set.", STATUS.ERROR );
						isRunning = false;
					}
					if ( !e.data.args.hasOwnProperty( "borders" ) || !e.data.args.hasOwnProperty( "data" ) ) {
						sendMessage( "[ PseudoWorker ] Argument <border> or <data> not set.", STATUS.ERROR );
						isRunning = false;
					}
					if ( isRunning ) {
						/* parameters */
						var deps = e.data.deps;
						var requires = e.data.requires;
						var args = e.data.args;
						var borders = e.data.args.borders;
						var data = e.data.args.data;
						var offset = e.data.args.offset;
						var packageSize = e.data.args.packageSize;
						_RESPONSE_PACKAGE_SIZE_ = packageSize || _RESPONSE_PACKAGE_SIZE_;


						var VLIB_SCALE = requires[0];
						var VLIB_SAFE_LOOP = requires[1];

						require( [VLIB_SCALE, VLIB_SAFE_LOOP], function ( Scale, SafeLoop ) {
							var xScaler = Scale()
								.range( [borders.x_SCALE_MIN, borders.x_SCALE_MAX] ).
								domain( [borders.x_MIN, borders.x_MAX] );
							var yScaler = Scale()
								.range( [borders.y_SCALE_MIN, borders.y_SCALE_MAX] )
								.domain( [borders.y_MIN, borders.y_MAX] );
							var zScaler = Scale()
								.range( [borders.z_SCALE_MIN, borders.z_SCALE_MAX] )
								.domain( [borders.z_MIN, borders.z_MAX] );


							var result = [], start = 0, end = 0, dataLen = data.length;
							/* calc start, end */
							start = end;
							end = start + _RESPONSE_PACKAGE_SIZE_;
							if ( end > dataLen ) {
								end = dataLen;
							}

							SafeLoop()
								.iterations( dataLen )
								.done( function () {
									if ( dataLen % _RESPONSE_PACKAGE_SIZE_ !== 0 ) {
										sendMessage( {
											data  : result,
											start : start,
											end   : end,
											offset: offset
										}, STATUS.OK );
									}
									/* WORK DONE */
									sendMessage( "[ PseudoWorker ] DONE ", STATUS.DONE );
									self.close();
								} )
								.loop( function ( i ) {

									/* check if response packege size reached */
									if ( i > 0 && (i % _RESPONSE_PACKAGE_SIZE_ === 0) ) {
										//sendMessage( "id=" + id + "  packageSize=" + _RESPONSE_PACKAGE_SIZE_ + " dataLen=" + dataLen + " start=" + start + " end=" + end + " offset=" + offset, STATUS.INFO );
										/* post */
										sendMessage( {
											id    : id,
											data  : result,
											start : start,
											end   : end,
											offset: offset
										}, STATUS.OK );
										result = [];
										start = i;
										end = ( start + _RESPONSE_PACKAGE_SIZE_);
										end = end > dataLen ? dataLen : end;
									}
									/* scale */
									result.push( {
										x: xScaler.linear( data[i].x ),
										y: yScaler.linear( data[i].y ),
										z: zScaler.linear( data[i].z )
									} );
								} );
						} );
					}
					/* WORK DONE */
					sendMessage( "[ Worker ] DONE ", STATUS.DONE );
				};

				self.onmessage( arguments[0] );
			},
			/* worker */
			/**
			 deps:
			 External scripts, which will be included by the WebWorker.
			 e.g.: includeScripts( e.data.deps[0] );
			 */
			deps    : [
				Config.basePath + Config.appPath + 'libs/require/require.min.js'
			],
			/**
			 Path to module
			 e.g.: require( [ e.data.require[ 0 ]. e.data.require[ 1 ] ], function( Module1, Module2 ){ ... } )
			 */
			requires: [
				'core/utils/Utils.Scale.vlib',
				'core/utils/Utils.SafeLoop.vlib'
			]
		},
		TASK_SCALE_FLOAT32ARRAY_LIN: {

			worker  : function () {
				var context = this;
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
						context.postMessage( msg );
					};
					/* check args */
					if ( !e.data.hasOwnProperty( "args" ) ) {
						sendMessage( "[ PseudoWorker ] Arguments not set.", STATUS.ERROR );
						isRunning = false;
					}
					if ( !e.data.args.hasOwnProperty( "borders" ) || !e.data.args.hasOwnProperty( "data" ) ) {
						sendMessage( "[ PseudoWorker ] Argument <border> or <data> not set.", STATUS.ERROR );
						isRunning = false;
					}
					if ( isRunning ) {
						/* parameters */
						var deps = e.data.deps;
						var requires = e.data.requires;
						var args = e.data.args;
						var borders = e.data.args.borders;
						var data = e.data.args.data;
						var offset = e.data.args.offset;
						var packageSize = e.data.args.packageSize;
						var dataf32 = new Float32Array( data );
						_RESPONSE_PACKAGE_SIZE_ = packageSize || _RESPONSE_PACKAGE_SIZE_;


						var VLIB_SCALE = requires[0];
						var VLIB_SAFE_LOOP = requires[1];

						require( [VLIB_SCALE, VLIB_SAFE_LOOP], function ( Scale, SafeLoop ) {
							var xScaler = Scale()
								.range( [borders.x_SCALE_MIN, borders.x_SCALE_MAX] ).
								domain( [borders.x_MIN, borders.x_MAX] );
							var yScaler = Scale()
								.range( [borders.y_SCALE_MIN, borders.y_SCALE_MAX] )
								.domain( [borders.y_MIN, borders.y_MAX] );
							var zScaler = Scale()
								.range( [borders.z_SCALE_MIN, borders.z_SCALE_MAX] )
								.domain( [borders.z_MIN, borders.z_MAX] );


							var resultf32, index = 0, start = 0, end = 0, dataLen = dataf32.length;
							/* calc start, end */
							start = end;
							end = start + _RESPONSE_PACKAGE_SIZE_;
							if ( end > dataLen ) {
								end = dataLen;
							}
							resultf32 = dataf32.subarray( start, end );
							SafeLoop()
								.iterations( dataLen )
								.done( function () {
									if ( dataLen % _RESPONSE_PACKAGE_SIZE_ !== 0 ) {
										sendMessage( {
											data  : resultf32,
											start : start,
											end   : end,
											offset: offset
										}, STATUS.OK );
									}
									/* WORK DONE */
									sendMessage( "[ PseudoWorker ] DONE ", STATUS.DONE );
									self.close();
								} )
								.loop( function ( i ) {
									if ( i % 3 === 0 ) {
										/* check if response packege size reached */
										if ( index > 0 && ((index+3) >= _RESPONSE_PACKAGE_SIZE_) ) {
											//console.log("SEND RESPONSE AND RESET INDEX [ "+_RESPONSE_PACKAGE_SIZE_+" ] "+i+" "+index);
											//sendMessage( "id=" + id + "  packageSize=" + _RESPONSE_PACKAGE_SIZE_ + " dataLen=" + dataLen + " start=" + start + " end=" + end + " offset=" + offset, STATUS.INFO );
											/* post */
											sendMessage( {
												id    : id,
												data  : resultf32,
												start : start,
												end   : end,
												offset: offset
											}, STATUS.OK );

											start = i;
											end = ( start + _RESPONSE_PACKAGE_SIZE_);
											end = end > dataLen ? dataLen : end;
											resultf32 = dataf32.subarray( start, end );
											index = 0;
										}
										/* scale */
										//console.log("[ "+_RESPONSE_PACKAGE_SIZE_+" ] "+i+" "+index);
										resultf32[index] = xScaler.linear( dataf32[i] );
										resultf32[index +1] = yScaler.linear( dataf32[i +1] );
										resultf32[index +2] = zScaler.linear( dataf32[i +2] );
										index += 3;
									}
								} );
						} );
					}
					/* WORK DONE */
					sendMessage( "[ Worker ] DONE ", STATUS.DONE );
				};

				self.onmessage( arguments[0] );
			},
			/* worker */
			/**
			 deps:
			 External scripts, which will be included by the WebWorker.
			 e.g.: includeScripts( e.data.deps[0] );
			 */
			deps    : [
				Config.basePath + Config.appPath + 'libs/require/require.min.js'
			],
			/**
			 Path to module
			 e.g.: require( [ e.data.require[ 0 ]. e.data.require[ 1 ] ], function( Module1, Module2 ){ ... } )
			 */
			requires: [
				'core/utils/Utils.Scale.vlib',
				'core/utils/Utils.SafeLoop.vlib'
			]
		}

	};
	return Tasks;
} );
