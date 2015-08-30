define(
	['require', 'config', 'core/Plot.vlib', 'core/Utils.vlib', 'jquery', 'three', 'core/Framework3D.vlib'],
	function ( require, Config, Plot, UTILS, $, THREE, F3D ) {

		var THREEBufferGeometryPlot = function ( name ) {
			Plot.superClass.constuctor.call( this, name );
		};
		/* Plot extends AbstractPlugin */
		UTILS.CLASS.extend( THREEBufferGeometryPlot, Plot );

		THREEBufferGeometryPlot.prototype.getGeometry = function ( coords, colors ) {
			if ( !coords || !colors ) return false;
			var len = coords.length;
			var geometry = new F3D.BufferGeometry();
			geometry.addAttribute( 'position', new F3D.BufferAttribute( new Float32Array( len ), 3 ) );
			geometry.addAttribute( 'color', new F3D.BufferAttribute( new Float32Array( len ), 3 ) );
			geometry.addAttribute( 'customColor', new F3D.BufferAttribute( new Float32Array( len ), 3 ) );
			geometry.addAttribute( 'size', new F3D.BufferAttribute( new Float32Array( len / 3 ), 1 ) );
			geometry.addAttribute( 'opacity', new F3D.BufferAttribute( new Float32Array( len / 3 ), 1 ) );
			/* set colors and coords*/
			var colorAttribute = geometry.getAttribute( "color" );
			var customColorAttribute = geometry.getAttribute( "customColor" );
			var coordAttribute = geometry.getAttribute( "position" );
			var opacityAttribute = geometry.getAttribute( "opacity" );

			colorAttribute.set( colors );
			customColorAttribute.set( colors );
			coordAttribute.set( coords );

			colorAttribute.needsUpdate = true;
			customColorAttribute.needsUpdate = true;
			coordAttribute.needsUpdate = true;
			opacityAttribute.needsUpdate = true;

			return geometry;
		};
		/**
		 *
		 * @param bufferManager
		 * @param env
		 * @param tick
		 *  Optional. Default is 0
		 * @returns Clone of COORD BUFFER (@tick)
		 */
		THREEBufferGeometryPlot.prototype.getCoords = function ( bufferManager, env, tick ) {
			var t = tick;
			if ( !t ) {
				t = 0;
			}
			var buffer = bufferManager.getBuffer( env.id );
			var coordBuffer = buffer.getAttribute( Config.BUFFER.COORDS );
			if ( !coordBuffer || ( coordBuffer && !coordBuffer.array[t]) ) {
				return false;
			}
			return buffer.clone( t + '_' + Config.BUFFER.COORDS, function ( e ) {
				return e;
			} );
		};
		/**
		 *
		 * @param bufferManager
		 * @param env
		 * @param tick
		 *  Optional. Default is 0
		 * @returns Clone of COORD BUFFER (@tick)
		 */
		THREEBufferGeometryPlot.prototype.getColors = function ( bufferManager, env, tick ) {
			var t = tick;
			if ( !t ) {
				t = 0;
			}
			var buffer = bufferManager.getBuffer( env.id );
			if ( !buffer.isAttribute( Config.BUFFER.COLORS ) ) return false;
			return buffer.getAttribute( t + '_' + Config.BUFFER.COLORS ).array;
		};

		THREEBufferGeometryPlot.prototype.RAW2Coords = function ( doneCB, bufferManager, env ) {

			var buffer = bufferManager.getBuffer( env.id );
			var rawData = buffer.getAttribute( Config.BUFFER.RAW_DATA );
			var rawDataTickBuffer = buffer.getAttribute( Config.BUFFER.RAW_DATA_TICK );


			//var coordBuffer = buffer.setAttribute( Config.BUFFER.COORDS, Float32Array, len, 3 );
			//var colorBuffer = buffer.setAttribute( Config.BUFFER.COLORS, Float32Array, len, 3 );
			var coordBuffer = buffer.setAttribute( Config.BUFFER.COORDS, Object );
			var colorBuffer = buffer.setAttribute( Config.BUFFER.COLORS, Object );

			var tmpCoord, tmpColor, tickCoords, tickColors, tick, offset = 0;
			var tickIndices = [];
			var threeColor = new F3D.Color();
			var safeLoop = UTILS.safeloop();


			safeLoop.done( function () {
				colorBuffer.dirty = true;
				coordBuffer.dirty = true;
				rawData.dirty = false;
				doneCB();
			} )
				.iterations( rawData.array.length )
				.loop( function ( i ) {
					tmpCoord = rawData.array[i];
					tick = tmpCoord.tick;
					if ( coordBuffer.array[tick] === undefined ) {
						tickCoords = buffer.setAttribute( tmpCoord.tick + '_' + Config.BUFFER.COORDS, Float32Array, rawDataTickBuffer.array[tick], 3 );
						coordBuffer.array[tick] = tickCoords.array;
						tickIndices[tick] = 0;
					}
					if ( colorBuffer.array[tick] === undefined ) {
						tickColors = buffer.setAttribute( tmpCoord.tick + '_' + Config.BUFFER.COLORS, Float32Array, rawDataTickBuffer.array[tick], 3 );
						colorBuffer.array[tick] = tickColors.array;
					}
					offset = tickIndices[tick];

					threeColor.setStyle( '#' + tmpCoord.color );

					colorBuffer.array[tick][offset] = threeColor.r;
					colorBuffer.array[tick][offset + 1] = threeColor.g;
					colorBuffer.array[tick][offset + 2] = threeColor.b;

					coordBuffer.array[tick][offset] = tmpCoord.x;
					coordBuffer.array[tick][offset + 1] = tmpCoord.y;
					coordBuffer.array[tick][offset + 2] = tmpCoord.z;
					tickIndices[tick] += 3;
				} );

		};

		THREEBufferGeometryPlot.prototype.getScaledCoords = function ( bufferManager, env, tick ) {
			var t = tick;
			if ( !t ) {
				t = 0;
			}
			var buffer = bufferManager.getBuffer( env.id );
			if ( !buffer.isAttribute( t + '_' + Config.BUFFER.SCALED_COORDS ) ) {
				return false;
			}
			return buffer.getAttribute( t + '_' + Config.BUFFER.SCALED_COORDS ).array;
		};

		THREEBufferGeometryPlot.prototype.cloneToScalledCoords = function ( vertices, tick, bufferManager, env ) {
			var buffer = bufferManager.getBuffer( env.id );
			var scc;
			if(!buffer.isAttribute( Config.BUFFER.SCALED_COORDS)){
				scc = buffer.setAttribute( Config.BUFFER.SCALED_COORDS, Object );
			}else{
				scc = buffer.getAttribute( Config.BUFFER.SCALED_COORDS );
			}
			var scb = buffer.setAttribute( tick + '_' + Config.BUFFER.SCALED_COORDS, Float32Array, vertices.array.length / 3, 3 );
			scb.array.set( vertices.array );
			scc.array[ tick ] = scb.array;

		};

		THREEBufferGeometryPlot.prototype.initBuffers = function ( bufferManager, env ) {

			// var buffer = bufferManager.getBuffer( env.id );
			// var len = buffer.getAttribute( Config.BUFFER.RAW_DATA ).array.length;
			// /* Add coords attribute */
			// if(!buffer.isAttribute(Config.BUFFER.COORDS)
			// 	|| buffer.getAttribute(Config.BUFFER.COORDS).array.length !== len){
			// 	buffer.setAttribute(Config.BUFFER.COORDS, Float32Array, len, 3);
			// 	buffer.getAttribute( Config.BUFFER.COORDS).dirty = true;
			// 	console.log("initBuffers new COORDS len="+len);
			// }
			// /* Add coords attribute */
			// if(!buffer.isAttribute(Config.BUFFER.COLORS)
			// 	|| buffer.getAttribute(Config.BUFFER.COLORS).array.length !== len){
			// 	buffer.setAttribute(Config.BUFFER.COLORS,Float32Array, len, 3);
			// 	buffer.getAttribute( Config.BUFFER.COLORS).dirty = true;
			// }

		};

		THREEBufferGeometryPlot.prototype.preProcess = function ( doneCB, childs, bufferManager, env ) {
			var context = this;
			THREEBufferGeometryPlot.superClass.preProcess( function () {
				"use strict";
				/* fill COORDS AND COLORS if RAW_DATA.dirty */
				var buffer = bufferManager.getBuffer( env.id );
				var rawData = buffer.getAttribute( Config.BUFFER.RAW_DATA );

				if ( rawData.dirty ) {
					context.RAW2Coords( function () {
						doneCB( bufferManager, env );
					}, bufferManager, env );
				} else {
					doneCB( bufferManager, env );
				}
			}, childs, bufferManager, env );

		};

		THREEBufferGeometryPlot.prototype.postProcess = function ( bufferManager, env ) {
			THREEBufferGeometryPlot.superClass.postProcess( bufferManager, env );

			var buffer = bufferManager.getBuffer( env.id );
			var system = env.context.getSystem( bufferManager, env );

			if ( !env.scale || !env.borders || !system ) {
				THREEBufferGeometryPlot.superClass.done( env );
				return;
			}

			system.id = env.id;
			/* check if borders have changed */
			var bordersDirty = buffer.isDirty( Config.BUFFER.BORDERS, env.borders );
			/* check if scaling factor has changed */
			var scaleDirty = buffer.isDirty( Config.BUFFER.SCALING, env.config.scale );
			/* check if coords have changed */
			var coords = buffer.getAttribute( Config.BUFFER.COORDS );

			env.currentTick = 0;
			if ( !coords.array[env.currentTick] ) {
				THREEBufferGeometryPlot.superClass.done( env );
				return;
			}

			//console.log(env.borders);
			//alert( bordersDirty + " " + scaleDirty + " " + coords.dirty );
			var bufferDirty = bordersDirty || scaleDirty || coords.dirty;

			if ( bufferDirty ) {
				coords.dirty = false;
				buffer.setHash( Config.BUFFER.BORDERS, env.borders );
				buffer.setHash( Config.BUFFER.SCALING, env.config.scale );
			}


			var scaledCoords = this.getScaledCoords( bufferManager, env, env.currentTick );
			if ( scaledCoords && !bufferDirty ) {
				console.log( "Nothing has changed. USE BACKUP" );
				this.coordsToGeometry( function () {
					"use strict";
					com.removeMsg( msgId );
					context.finalize( system, bufferManager, env );
				}, system.geometry, scaledCoords );
			} else {

				var gPositions = system.geometry.getAttribute( "position" );
				var dataLen = gPositions.length;
				var dataDone = 0;

				var context = this;
				var msg = '[ Plot.rescale() ]';
				var msgId = env.communication.messageController.addMsg( 'info', msg, true );
				var com = env.communication.messageController;

				this.rescale( gPositions.array, function ( e ) {
					"use strict";
					var data = e.data;
					var len = data.length;
					var start = e.start;
					var end = e.end;
					var offset = e.offset;
					dataDone += end - start;
					com.updateMsg( msgId, msg + '[ ' + Math.ceil( (dataDone / dataLen) * 100 ) + '% ]' );
					for ( var i = 0; i < len; ++i ) {
						//console.log("data[ "+i+" ] = "+ data[ i ]);
						gPositions.array[offset + start + i] = data[i];
					}
					THREEBufferGeometryPlot.superClass.customPostProcess( system, env );
				}, function ( e ) {
					"use strict";
					context.cloneToScalledCoords( gPositions, 0, bufferManager, env );
					com.removeMsg( msgId );
					context.finalize( system, bufferManager, env );
				}, 0, bufferManager, env );
			}
		};

		THREEBufferGeometryPlot.prototype.rescale = function ( f32Array, update, done, tick, bufferManager, env ) {

			var context = this;

			var bordersAndScale = {
				"x_MAX"      : env.boundingBox.xMax,
				"y_MAX"      : env.boundingBox.yMax,
				"z_MAX"      : env.boundingBox.zMax,
				"x_MIN"      : env.boundingBox.xMin,
				"y_MIN"      : env.boundingBox.yMin,
				"z_MIN"      : env.boundingBox.zMin,
				"x_SCALE_MIN": 0,
				"y_SCALE_MIN": 0,
				"z_SCALE_MIN": 0,
				"x_SCALE_MAX": env.config.scale.x,
				"y_SCALE_MAX": env.config.scale.y,
				"z_SCALE_MAX": env.config.scale.z
			};

			var error = function ( e ) {
				console.error( "m: " + e.message + " f: " + e.filename + " l:" + e.lineno );
			};

			var info = function ( e ) {
				//console.log("[ Worker info ] "+e);
			};


			this.createAndRunScaleWorkers( f32Array, bordersAndScale, tick, update, done, error, info );
		};

		THREEBufferGeometryPlot.prototype.createAndRunScaleWorkers = function ( data, borders, tick, update, done, error, info ) {

			var len = data.length / 3;
			var MAX_TASK_SIZE = 300000;
			var RESPONSE_PACKAGE_SIZE = 60000;
			var worker, worker_data, msg;

			/* GET NUMBER OF WORKERS */
			var number_of_workers = Math.ceil( len / MAX_TASK_SIZE );
			if ( number_of_workers === 0 ) number_of_workers = 1;

			var task_size = ( Math.ceil( len / number_of_workers ) ) * 3;
			var start = 0;
			var end = task_size;
			var WorkerFactory = require( 'core/WorkerFactory_2.vlib' );
			var wf = new WorkerFactory();
			for ( var i = 0; i < number_of_workers; ++i ) {
				//console.log( "start= " + start + " end= " + end );
				/* GET SCALE - WORKER */
				worker = wf.create( 'scale-float32array-lin', update, done, error, info );
				/* create subarray */
				worker_data = data.subarray( start, end );
				/* create argument object */
				msg = {
					packageSize: RESPONSE_PACKAGE_SIZE,
					borders    : borders,
					offset     : start,
					data       : worker_data,
					tick       : tick
				};
				/* worker.run */
				worker.postMessage( msg, [msg.data.buffer] );
				/*  update start and end */
				start += task_size;
				end += task_size;
				if ( end > data.length ) end = data.length;
			}
		};

		THREEBufferGeometryPlot.prototype.finalize = function ( system, bufferManager, env ) {
			"use strict";
			var context = this;

			F3D.getBoundingBox( system );
			var forceDone = true;

			THREEBufferGeometryPlot.superClass.createBackup( system );
			THREEBufferGeometryPlot.superClass.customPostProcess( system, env );

			THREEBufferGeometryPlot.superClass.handlePreActivities( bufferManager, env, function () {
				"use strict";
				THREEBufferGeometryPlot.superClass.handleReadyActivities( bufferManager, env, function () {
					THREEBufferGeometryPlot.superClass.done( env );
					forceDone = false;
					THREEBufferGeometryPlot.superClass.updateCurrentTickBuffer( bufferManager, env );
					THREEBufferGeometryPlot.superClass.removeUnusedTicks( bufferManager, env );
					/* RESCALE OTHER TICKS */
					context.rescaleTicks( bufferManager, env );
				}, this );
			}, this );
			return;

		};

		THREEBufferGeometryPlot.prototype.rescaleTicks = function ( bufferManager, env ) {
			"use strict";
			var buffer = bufferManager.getBuffer( env.id );
			var coordBuffer = buffer.getAttribute( Config.BUFFER.COORDS );

			var context = this;
			var scaledData = [];
			var dataLenArray = [];
			var dataDoneArray = [];
			var msgIdArray = [];
			var com = env.communication.messageController;

			for ( var tick in coordBuffer.array ) {

				if ( parseInt( tick ) !== parseInt( env.currentTick ) ) {
					dataLenArray[tick] = coordBuffer.array[tick].length;

					scaledData[ tick ] = buffer.setAttribute('tmp_'+tick,Float32Array, dataLenArray[tick], 1);
					dataDoneArray[tick] = 0;
					msgIdArray[tick] = com.addMsg( 'info', '[ Plot.rescaleTick( ' + tick + ') ]', true );

					this.rescale( coordBuffer.array[tick], function ( e ) {
						"use strict";

						var data_ = e.data;
						var len_ = data_.length;
						var start_ = e.start;
						var end_ = e.end;
						var offset_ = e.offset;
						var tick_ = parseInt(e.tick);
						dataDoneArray[ tick_ ] += end_ - start_;
						com.updateMsg( msgIdArray[tick_], '[ Plot.rescaleTick( ' + tick_ + ' ) ][ ' + Math.ceil( (dataDoneArray[tick_] / dataLenArray[tick_]) * 100 ) + '% ]' );

						for ( var i = 0; i < len_; ++i ) {
							//console.log("scaledData["+tick_+"][ "+(offset_ + start_ + i)+" ] = "+ data_[ i ]);
							scaledData[tick_].array[offset_ + start_ + i] = data_[i];
						}
					}, function ( e ) {
						"use strict";
						//console.log("RESCALE TICK %s DONE", e.tick);
						context.cloneToScalledCoords( scaledData[e.tick ], e.tick, bufferManager, env );
						buffer.deleteAttribute( scaledData[e.tick].name );

						com.removeMsg( msgIdArray[ e.tick ] );
					}, tick, bufferManager, env );
				}
			}
		};

		THREEBufferGeometryPlot.prototype.coordsToGeometry = function ( done, geometry, coords ) {
			"use strict";

			if ( !geometry || !coords ) {
				console.warn( '[ THREEBufferGeometryPlot.coordsToGeometry( geometry, coords) ] Invalid input' );
				return;
			}

			var coordsLen = coords.length;
			var posArray = geometry.getAttribute( 'position' ).array;
			var geometryLen = posArray.length;

			if ( geometryLen !== coordsLen ) {
				console.error( "[ THREEBufferGeometryPlot.postProcess ] scaledCoords.length != geometry.vertices.length (" + coords.length + " != " + posArray.length + " )" );
			}

			UTILS.safeloop()
				.iterations( coordsLen )
				.done( function () {
					done();
				} )
				.loop( function ( i ) {
					if ( i < geometryLen && i < coordsLen ) {
						posArray[i] = coords[i];
						geometry.verticesNeedUpdate = true;
					}
				} );


		};

		return THREEBufferGeometryPlot;
	} );
