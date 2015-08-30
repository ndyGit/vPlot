define(
	['require', 'config', 'core/Plot.vlib', 'core/Utils.vlib', 'jquery', 'core/Framework3D.vlib'],
	function ( require, Config, Plot, UTILS, $, F3D ) {

		var F3DGeometryPlot = function ( name ) {
			F3DGeometryPlot.superClass.constuctor.call( this, name );
		};
		/* Extend Plot */
		UTILS.CLASS.extend( F3DGeometryPlot, Plot );

		F3DGeometryPlot.prototype.assignColorToVertices = function ( geometry, color ) {
			"use strict";
			var coords = geometry.vertices;
			for ( var i = 0, len = coords.length; i < len; ++i ) {
				geometry.colors[i] = color.clone();
			}

		};

		F3DGeometryPlot.prototype.faceColors2GeometryColors = function( geometry ){
			"use strict";
			var face, colors = geometry.colors;
			for( var i = 0, len = geometry.faces.length; i < len; ++i ){
				face = geometry.faces[ i ];
				colors[ face.a ] = face.vertexColors[ 0 ];
				colors[ face.b ] = face.vertexColors[ 1 ];
				colors[ face.c ] = face.vertexColors[ 2 ];
			}
			this.assignVertexColorsToFaceColors( geometry );
		};

		F3DGeometryPlot.prototype.assignVertexColorsToFaceColors = function ( geometry ) {
			"use strict";
			/* set geometry face colors */
			var faceIndices = ['a', 'b', 'c', 'd'];
			/* face indices as chars */
			var vertexIndex, numberOfSides, face;
			for ( var i = 0, len = geometry.faces.length; i < len; ++i ) {
				face = geometry.faces[i];
				numberOfSides = (face instanceof F3D.Face3) ? 3 : 4;
				for ( var j = 0; j < numberOfSides; j++ ) {
					vertexIndex = face[faceIndices[j]];
					face.vertexColors[j] = geometry.colors[vertexIndex];
				}
			}
		};

		F3DGeometryPlot.prototype.getGeometry = function ( coords, colors ) {
			if ( !coords || !colors ) return false;
			var geometry = new F3D.Geometry();
			geometry.vertices = coords;
			geometry.colors = colors;
			return geometry;
		};

		F3DGeometryPlot.prototype.getPlaneGeometry = function ( coords, colors ) {

			if ( !coords || !colors ) return false;
			var dim = UTILS.C3D.getDimensions( coords );
			//PlaneGeometry(width, height, widthSegments, heightSegments);

			var geometry = new F3D.PlaneGeometry( dim.d2, dim.d1, dim.d2 - 1, dim.d1 - 1 );

			/* set positions and colors*/
			var last = coords.length - 1;
			for ( var i = 0, len = geometry.vertices.length; i < len; ++i ) {
				if ( coords[i] !== undefined ) {
					geometry.vertices[i].set( coords[i].x, coords[i].y, coords[i].z );
					geometry.colors[i] = colors[i];
					//console.log("> "+coords[ i ].x+" "+coords[ i ].y+" "+coords[ i ].z+" ");
				} else {
					/* handle odd number of nodes*/
					geometry.vertices[i].set( coords[last].x, coords[last].y, coords[last].z );
					geometry.colors[i] = colors[last];
					//console.log("> "+coords[ i ].x+" "+coords[ i ].y+" "+coords[ i ].z+" ");
				}
			}
			/* set geometry face colors */
			var faceIndices = ['a', 'b', 'c', 'd'];
			/* face indices as chars */
			var vertexIndex, numberOfSides;
			for ( var i = 0, len = geometry.faces.length; i < len; ++i ) {
				face = geometry.faces[i];
				numberOfSides = (face instanceof F3D.Face3) ? 3 : 4;
				for ( var j = 0; j < numberOfSides; j++ ) {
					vertexIndex = face[faceIndices[j]];
					face.vertexColors[j] = geometry.colors[vertexIndex];
				}
			}
			geometry.dynamic = true;
			geometry.verticesNeedUpdate = true;
			geometry.colorsNeedUpdate = true;
			geometry.buffersNeedUpdate = true;
			return geometry;
		};
		/**
		 *
		 * @param bufferManager
		 * @param env
		 * @param tick
		 * @returns { false | Buffer-Object }
		 */
		F3DGeometryPlot.prototype.getCoordBuffer = function( bufferManager, env, tick ){
			"use strict";

			var buffer = F3DGeometryPlot.superClass.getBuffer( bufferManager, env );

			if( !buffer ){
				return false;
			}

			if( tick ){
				return buffer.getAttribute( tick+'_'+Config.BUFFER.COORDS );
			}else{
				return buffer.getAttribute( Config.BUFFER.COORDS );
			}

		};

		/**
		 *
		 * @param bufferManager
		 * @param env
		 * @param tick
		 * @returns { false | Buffer-Object }
		 */
		F3DGeometryPlot.prototype.getColorBuffer = function( bufferManager, env, tick ){
			"use strict";
			var buffer = F3DGeometryPlot.superClass.getBuffer( bufferManager, env );

			if( !buffer ){
				return false;
			}

			if( tick ){
				return buffer.getAttribute( tick+'_'+Config.BUFFER.COLORS );
			}else{
				return buffer.getAttribute( Config.BUFFER.COLORS );
			}
		};

		/**
		 *
		 * @param bufferManager
		 * @param env
		 * @param tick
		 * @returns cloned array of coords
		 */
		F3DGeometryPlot.prototype.getCoords = function ( bufferManager, env, tick ) {
			"use strict";

			var t = tick;

			if ( !t ) {
				t = 0;
			}

			var buffer = bufferManager.getBuffer( env.id );

			if( !buffer ){
				return false;
			}

			var coordBuffer = buffer.getAttribute( Config.BUFFER.COORDS );

			if ( !coordBuffer || ( coordBuffer && !coordBuffer.array[t]) ) {
				return false;
			}

			return buffer.clone( t + '_' + Config.BUFFER.COORDS, function ( e ) {
				return e.clone();
			} );
		};

		/**
		 *
		 * @param bufferManager
		 * @param env
		 * @param tick
		 * @returns cloned array of colors
		 */
		F3DGeometryPlot.prototype.getColors = function ( bufferManager, env, tick ) {
			var t = tick;
			if ( !t ) {
				t = 0;
			}
			var buffer = bufferManager.getBuffer( env.id );
			if ( !buffer.isAttribute( Config.BUFFER.COLORS ) ) return false;

			return buffer.clone( t + '_' + Config.BUFFER.COLORS, function ( e ) {
				return e.clone();
			} );
		};

		F3DGeometryPlot.prototype.RAW2Coords = function ( doneCB, bufferManager, env ) {

			var buffer = bufferManager.getBuffer( env.id );
			var rawData = buffer.getAttribute( Config.BUFFER.RAW_DATA );
			var rawDataTickBuffer = buffer.getAttribute( Config.BUFFER.RAW_DATA_TICK );
			var len = rawData.array.length;

			//var dataBuffer = buffer.setAttribute( Config.BUFFER.COORDS, Array, len, 1 );
			//var colorBuffer = buffer.setAttribute( Config.BUFFER.COLORS, Array, len, 1 );

			var coordBuffer = buffer.setAttribute( Config.BUFFER.COORDS, Object );
			var colorBuffer = buffer.setAttribute( Config.BUFFER.COLORS, Object );

			var tmpCoord, tmpColor, tickCoords, tickColors, tick, offset = 0;
			var tickIndices = [];
			var safeLoop = UTILS.safeloop();



			var done = false;
			safeLoop.done( function () {
				colorBuffer.dirty = true;
				coordBuffer.dirty = true;
				rawData.dirty = false;
				if( !done ){
					done = true;
					doneCB();
				}
			} )
				.iterations( len )
				.loop( function ( i ) {
					tmpCoord = rawData.array[i];
					tick = tmpCoord.tick;

					if ( coordBuffer.array[tick] === undefined ) {

						tickCoords = buffer.setAttribute( tmpCoord.tick + '_' + Config.BUFFER.COORDS, Array, rawDataTickBuffer[tick], 1 );
						coordBuffer.array[tick] = tickCoords.array;
						tickIndices[tick] = 0;
					}
					if ( colorBuffer.array[tick] === undefined ) {
						tickColors = buffer.setAttribute( tmpCoord.tick + '_' + Config.BUFFER.COLORS, Array, rawDataTickBuffer[tick], 1 );
						colorBuffer.array[tick] = tickColors.array;
					}
					offset = tickIndices[tick];


					colorBuffer.array[tick][offset] = new F3D.Color( '#' + rawData.array[i].color );
					coordBuffer.array[tick][offset] = new F3D.Vector3(
						tmpCoord.x,
						tmpCoord.y,
						tmpCoord.z );


					tickIndices[tick] += 1;
				} );


		};

		F3DGeometryPlot.prototype.getScaledCoords = function ( bufferManager, env, tick ) {
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

		F3DGeometryPlot.prototype.cloneToScalledCoords = function ( vertices, tick, bufferManager, env ) {
			var buffer = bufferManager.getBuffer( env.id );
			var scc;

			if ( !buffer.isAttribute( Config.BUFFER.SCALED_COORDS ) ) {
				scc = buffer.setAttribute( Config.BUFFER.SCALED_COORDS, Object );
			} else {
				scc = buffer.getAttribute( Config.BUFFER.SCALED_COORDS );
			}

			var scb = buffer.setAttribute( tick + '_' + Config.BUFFER.SCALED_COORDS, Array, vertices.length, 1 );
			for ( var i = 0, len = vertices.length; i < len; ++i ) {
				scb.array[i] = new F3D.Vector3( vertices[i].x, vertices[i].y, vertices[i].z );
			}
			scc.array[ tick ] = scb.array;

		};

		F3DGeometryPlot.prototype.initBuffers = function ( bufferManager, env ) {
			// var buffer = bufferManager.getBuffer( env.id );
			// /* Add coords attribute */
			// if(!buffer.isAttribute(Config.BUFFER.COORDS)){
			// 	buffer.setAttribute(Config.BUFFER.COORDS,Array);
			// 	buffer.getAttribute( Config.BUFFER.COORDS).dirty = true;
			// }
			// /* Add coords attribute */
			// if(!buffer.isAttribute(Config.BUFFER.COLORS)){
			// 	buffer.setAttribute(Config.BUFFER.COLORS,Array);
			// 	buffer.getAttribute( Config.BUFFER.COLORS).dirty = true;
			// }
			// /* Add scaled coords attribute */
			// if(!buffer.isAttribute(Config.BUFFER.SCALED_COORDS)){
			// 	buffer.setAttribute(Config.BUFFER.SCALED_COORDS,Array);
			// }
		};

		F3DGeometryPlot.prototype.preProcess = function ( doneCB, childs, bufferManager, env ) {
			var context = this;
			F3DGeometryPlot.superClass.preProcess( function () {
				"use strict";

				//this.initBuffers( bufferManager, env );
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

		F3DGeometryPlot.prototype.postProcess = function ( bufferManager, env ) {
			F3DGeometryPlot.superClass.postProcess( bufferManager, env );

			console.log("super post done");
			var buffer = bufferManager.getBuffer( env.id );
			var system = env.context.getSystem( bufferManager, env );


			if ( !env.scale || !env.borders || !system ) {
				F3DGeometryPlot.superClass.done( env );
				return;
			}

			system.id = env.id;
			env.currentTick = 0;

			/* check if borders have changed */
			var bordersDirty = buffer.isDirty( Config.BUFFER.BORDERS, env.borders );
			/* check if scaling factor has changed */
			var scaleDirty = buffer.isDirty( Config.BUFFER.SCALING, env.config.scale );
			/* check if coords have changed */
			var coords = buffer.getAttribute( Config.BUFFER.COORDS );

			if ( !coords.array[env.currentTick] ) {
				F3DGeometryPlot.superClass.done( env );
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

			console.log(system);
			var meshes = [];
			if ( system.hasOwnProperty( "geometry" ) ) {
				meshes.push( system );
			} else if ( system.children.length > 0 ) {

				for ( var i = 0, il = system.children.length; i < il; ++i ) {
					if ( system.children[i].hasOwnProperty( 'geometry' ) ) {
						meshes.push( system.children[i] );
						break;
					}
				}

			} else {
				console.info( "[ F3DGeometryPlot.postProcess ] No geometry within given object found." );
				return;
			}


			var scaledCoords = this.getScaledCoords( bufferManager, env );

			if ( scaledCoords && !bufferDirty ) {
				this.coordsToGeometry( function () {
					"use strict";
					com.removeMsg( msgId );
					context.finalize( system, bufferManager, env );
				}, system.geometry, scaledCoords );

			} else {
				var context = this;
				var com = env.communication.messageController;
				var msg = '[ Plot ][ rescale ]';
				var msgId = env.communication.messageController.addMsg( 'info', msg, true );
				var mergedGeometries = meshes[0].geometry;//this.mergeGeometries( meshes );
				var dataLen = mergedGeometries.vertices.length;
				var dataDone = 0;

				this.rescale( mergedGeometries.vertices, function ( e ) {
					"use strict";

					var data = e.data;
					var len = data.length;
					var start = e.start;
					var end = e.end;
					var offset = e.offset;

					for ( var i = 0; i < len; ++i ) {
						//console.log("update index[ "+(offset + start + i)+" ] = "+data[ i ].x+', '+data[ i ].y+', '+data[ i ].z);
						mergedGeometries.vertices[offset + start + i].x = data[i].x;
						mergedGeometries.vertices[offset + start + i].y = data[i].y;
						mergedGeometries.vertices[offset + start + i].z = data[i].z;
						mergedGeometries.verticesNeedUpdate = true;
					}
					dataDone += end - start;
					com.updateMsg( msgId, msg + '[ ' + dataDone + ' / ' + dataLen + ' ]' );

				}, function ( e ) {
					"use strict";
					if ( meshes.length > 1 ) {
						context.mergedGeometryToGeometry( mergedGeometries, meshes, e.offset, e.end );
					}

					com.updateMsg( msgId, msg + '[ ' + dataDone + ' / ' + dataLen + ' ][ DONE ]' );
					context.cloneToScalledCoords( mergedGeometries.vertices, 0, bufferManager, env );
					context.finalize( system, bufferManager, env );
					com.removeMsg( msgId );
				}, 0, bufferManager, env );
			}

		};

		F3DGeometryPlot.prototype.rescale = function ( array, update, done, tick, bufferManager, env ) {


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
				console.log( "m: " + e.message + " f: " + e.filename + " l:" + e.lineno );
				F3DGeometryPlot.superClass.done( env );
			};

			var info = function ( e ) {
				console.log( "[ Worker info ] " + e );
			};

			this.createAndRunScaleWorkers( array, bordersAndScale, tick, update, done, error, info );

		};

		F3DGeometryPlot.prototype.createAndRunScaleWorkers = function ( data, borders, tick, update, done, error, info ) {
			var len = data.length;
			var MAX_TASK_SIZE = 200000;
			var RESPONSE_PACKAGE_SIZE = 60000;
			var worker, worker_data, msg;

			/* GET NUMBER OF WORKERS */
			var number_of_workers = Math.ceil( len / MAX_TASK_SIZE );
			if ( number_of_workers === 0 ) number_of_workers = 1;

			var task_size = ( Math.ceil( len / number_of_workers ) );
			var start = 0;
			var end = task_size;
			var id;
			var WorkerFactory = require( 'core/WorkerFactory_2.vlib' );
			var wf = new WorkerFactory();

			for ( var i = 0; i < number_of_workers; ++i ) {
				id = Math.ceil( Math.random() * 1000 );
				//console.log("############################");
				//console.log("start worker [ "+(i+1)+" ][ "+id+" ] start= "+start+" end= "+end);
				/* GET SCALE - WORKER */
				worker = wf.create( 'scale-objects-lin', update, done, error, info );
				/* create subarray */
				worker_data = data.slice( start, end );
				/* create argument object */
				msg = {
					id         : id,
					packageSize: RESPONSE_PACKAGE_SIZE,
					borders    : borders,
					offset     : start,
					data       : worker_data,
					tick       : tick
				};
				/* worker.run */
				worker.postMessage( msg );
				/*  update start and end */
				start += task_size;
				end += task_size;
				if ( end > data.length ) end = data.length;
			}

		};
		F3DGeometryPlot.prototype.coordsToGeometry = function ( geometry, coords ) {
			"use strict";

			if ( !geometry || !coords ) {

				console.warn( '[ F3DGeometryPlot.coordsToGeometry( geometry, coords) ] Invalid input' );
				return;
			}

			var vertices = geometry.vertices;
			var geometryLen = vertices.length;
			var coordsLen = coords.length;
			if ( coordsLen > geometryLen ) {
				console.warn( '[ F3DGeometryPlot.coordsToGeometry( geometry, coords) ] coords.length > geometry.vertices.length' );
			}
			if ( coordsLen < geometryLen ) {
				console.warn( '[ F3DGeometryPlot.coordsToGeometry( geometry, coords) ] coords.length < geometry.vertices.length' );
			}
			UTILS.safeloop()
				.iterations( coordsLen )
				.loop( function ( i ) {
					if ( i < geometryLen && i < coordsLen ) {
						vertices[i] = coords[i].clone();
						geometry.verticesNeedUpdate = true;
					}
				} );

		};

		F3DGeometryPlot.prototype.finalize = function ( system, bufferManager, env ) {
			"use strict";
			var context = this;

			F3D.getBoundingBox( system );
			var forceDone = true;

			F3DGeometryPlot.superClass.createBackup( system );
			F3DGeometryPlot.superClass.customPostProcess( system, env );

			F3DGeometryPlot.superClass.handlePreActivities( bufferManager, env, function () {
				"use strict";
				F3DGeometryPlot.superClass.handleReadyActivities( bufferManager, env, function () {

					F3DGeometryPlot.superClass.done( env );
					forceDone = false;
					F3DGeometryPlot.superClass.updateCurrentTickBuffer( bufferManager, env );
					F3DGeometryPlot.superClass.removeUnusedTicks( bufferManager, env );
					/* RESCALE OTHER TICKS */
					context.rescaleTicks( bufferManager, env );
				}, this );
			}, this );
			return;

		};

		F3DGeometryPlot.prototype.rescaleTicks = function ( bufferManager, env ) {
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

					scaledData[tick] = buffer.setAttribute( 'tmp_' + tick, Array, dataLenArray[tick], 1 );
					dataDoneArray[tick] = 0;
					msgIdArray[tick] = com.addMsg( 'info', '[ Plot.rescaleTick( ' + tick + ') ]', true );

					this.rescale( coordBuffer.array[tick], function ( e ) {
						"use strict";

						var data_ = e.data;
						var len_ = data_.length;
						var start_ = e.start;
						var end_ = e.end;
						var offset_ = e.offset;
						var tick_ = parseInt( e.tick );
						dataDoneArray[tick_] += end_ - start_;
						com.updateMsg( msgIdArray[tick_], '[ Plot.rescaleTick( ' + tick_ + ' ) ][ ' + Math.ceil( (dataDoneArray[tick_] / dataLenArray[tick_]) * 100 ) + '% ]' );

						for ( var i = 0; i < len_; ++i ) {
							//console.log("scaledData["+tick_+"][ "+(offset_ + start_ + i)+" ] = "+ data_[ i].x+' '+data_[ i].y+' '+data_[ i].z);
							scaledData[tick_].array[offset_ + start_ + i] = new F3D.Vector3( data_[i].x, data_[i].y, data_[i].z );
						}
					}, function ( e ) {
						"use strict";
						console.log( "RESCALE TICK %s DONE", e.tick );
						context.cloneToScalledCoords( scaledData[e.tick].array, e.tick, bufferManager, env );
						buffer.deleteAttribute( scaledData[e.tick].name );
						com.removeMsg( msgIdArray[e.tick] );
					}, tick, bufferManager, env );
				}
			}
		};

		F3DGeometryPlot.prototype.mergeGeometries = function ( meshes ) {
			"use strict";
			return meshes;
			if ( meshes.length === 0 ) {
				return false;
			}
			if ( meshes.length === 1 ) {
				return meshes[0].geometry;
			}

			var geometry = meshes[0].geometry.clone(), tmp;
			for ( var i = 1, il = meshes.length; i < il; ++i ) {
				tmp = meshes[i];
				tmp.updateMatrix();
				geometry.merge( tmp.geometry, tmp.matrix );
			}
			return geometry;
		};
		F3DGeometryPlot.prototype.mergedGeometryToGeometry = function ( merged, meshes, start, end ) {
			"use strict";
			//console.log("mergedGeometryToGeometry %s to %s",start,end);

			var vMerged = merged.vertices;
			var gCurrent = 0, gOffset, accumulatedLength = 0;
			var lengthIndices = [];
			for ( var i = 0, il = meshes.length; i < il; ++i ) {

				lengthIndices[i] = meshes[i].geometry.vertices.length;
				accumulatedLength += lengthIndices[i];

				if ( start > accumulatedLength ) {
					//console.log("%s > %s ! update gCurrent",start,accumulatedLength);
					gCurrent = i;
				}
			}
			//console.log("START with geometry nbr "+gCurrent);
			var geometry = meshes[gCurrent].geometry;
			var gIndex = 0;
			for ( var i = start; i < end; ++i, ++gIndex ) {
				/* end of array reached? next geometry && reset index */
				if ( gIndex === lengthIndices[gCurrent] ) {
					gCurrent++;
					gIndex = 0;
					geometry = meshes[gCurrent].geometry;
				}
				//console.log("write geometry[ %s ][ %s ] << merged[ %s ]( %s, %s, %s )",gCurrent,gIndex, i, vMerged[ i ].x, vMerged[ i ].y,vMerged[ i ].z );
				geometry.vertices[gIndex].x = vMerged[i].x;
				geometry.vertices[gIndex].y = vMerged[i].y;
				geometry.vertices[gIndex].z = vMerged[i].z;
				geometry.verticesNeedUpdate = true;

			}

		};
		return F3DGeometryPlot;
	}
)
;
