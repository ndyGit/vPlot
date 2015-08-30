define(
	['require', 'jquery', 'config', './setConfig.vlib', './getConfig.vlib', 'core/F3DGeometryPlot.vlib', 'core/Utils.vlib', 'core/Framework3D.vlib',
		'plugins/plugins_3d/materials/basic/basicMaterial.vlib'],
	function ( require, $, Config, setConfig, getConfig, THREEGeometryPlot, UTILS, F3D, DefaultMaterial ) {
		/**
		 TODO<br />
		 @class Plugin SurfacePlot
		 @constructor
		 @extends THREEGeometryPlot
		 **/
		var Plugin = (function ( state ) {
			var name = 'barchartplot';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.PLOT );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/barchartPlot/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/barchartPlot/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [
					Config.PLUGINTYPE.CONTEXT_3D
				],
				successors  : [
					Config.PLUGINTYPE.DATA,
					Config.PLUGINTYPE.AXES,
					Config.PLUGINTYPE.MATERIAL,
					Config.PLUGINTYPE.ACTIVITY,
					Config.PLUGINTYPE.STATE
				]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */

			var particleSizeDefault = 10;
			var opacityDefault = 1;
			var blendingDefault = false;
			var colorsDefault = true;
			var transparentDefault = false;
			var ambientDefault = '#FFFFFF';

			var dimX = 'auto';
			var dimY = 'auto';

			var bordersDefault = {
				xMax: 'auto',
				yMax: 'auto',
				zMax: 'auto',
				xMin: 'auto',
				yMin: 'auto',
				zMin: 'auto',
				nice: true
			};
			var scaling = {
				x_SCALE: 400,
				y_SCALE: 400,
				z_SCALE: 400
			};


			if ( state !== undefined ) {
				/* DeepCopy data*/
			}
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.defaults = {
				name              : this.getName(),
				dataInterpretation: 'x-y-value',
				offset            : {
					x: 0,
					y: 0
				}
			};

			this.activities = [];
			this.interactiveObject;
			this.childs;
			this.env;
			this.bufferManager;



			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.destroy = function () {
				console.info( "[ BarchartPlot ] Remove activities." );
				for ( var i = 0, il = this.activities.length; i < il; ++i ) {
					this.activities[i].destroy();
				}
				//this.updateActivity.destroy();
				if ( this.env.scene ) {
					console.info( "[ BarchartPlot ] Remove self from scene." );
					this.env.scene.remove( this.interactiveObject );
				}
				console.info( "[ BarchartPlot ] Clear buffer." );
				var buffer = this.bufferManager.getBuffer( this.env.id );
				buffer.empty();
				console.info( "[ BarchartPlot ] Self dispose." );
				if ( this.interactiveObject ) {
					for ( var i = 0, il = this.interactiveObject.children.length; i < il; ++i ) {
						this.interactiveObject.children[i].geometry.dispose();
						this.interactiveObject.children[i].material.dispose();
					}
				}
			};
			/*
			 @return returns copy of this object
			 state of public and private variables will be set properly
			 */
			this.deepCopy = function () {
				var privates = {
					/* DeepCopy data */
				};
				return new Plugin( privates );
			};
			/**
			 * Returns a minimal description of this plugin.
			 * This method is used by the sceneGraph module.
			 * @returns {string}
			 *
			 */
			this.getShortName = function () {
				"use strict";
				return "BarChart";
			};
			/**
			 * Takes inserted configuration from the plugin-template and
			 * returns the parameters as JSON-config-file
			 *
			 * @param containerId
			 *            parent container where the plugin-template got
			 *            added
			 *
			 * @return config file format:
			 *         {camera:{x:VALUE,y:VALUE,z:VALUE}}
			 */
			this.getConfigCallback = getConfig;
			/**
			 * Takes arguments from config and inserts them to the
			 * plugin-template
			 *
			 * @param config
			 *            plugin config file
			 * @param containerId
			 *            parent container where the plugin-template got
			 *            added
			 */
			this.setConfigCallback = setConfig;

			this.handleEnv = function ( env ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};

			this.run = function ( scene, camera ) {
				this.env.scene = scene;
				this.env.camera = camera;
				Plugin.superClass.preProcess( this.preProcessDone, this.childs, this.bufferManager, this.env );
			};

			this.preProcessDone = function ( bufferManager, env ) {

				env.context.createCustomPlot( bufferManager, env );

				var system = Plugin.superClass.getSystem( bufferManager, env );

				if ( system ) {
					env.context.interactiveObject = system;
					env.scene.add( system );
					this.activities = UTILS.ACTIVITY.MOUSE.handleActivities( system, env );
				}
				Plugin.superClass.postProcess( bufferManager, env );
			};

			Plugin.prototype.exec = function ( config, childs, bufferManager, communication ) {

				var result = [];
				var env = {};
				this.handleEnv( env );
				env.communication = communication;
				this.handleConfig( config, env );
				this.env = env;
				this.childs = childs;
				this.bufferManager = bufferManager;

				return {
					pId     : this.getId(),
					pType   : this.type,
					response: {
						run          : this.run,
						context      : this,
						onDone       : Plugin.superClass.onDone,
						onPostprocess: function ( callback, context, plotContext ) {
							"use strict";
							Plugin.superClass.handlePostActivities( bufferManager, plotContext.env, callback, context )
						}
					}
				};
			};

			/** ********************************** */
			/** PRIVATE METHODS * */
			/** ********************************** */

			/** ********************************** */
			/** CUSTOM                         * */
			/** ********************************** */
			this.handleConfig = function ( config, env ) {
				env.config = config || {};
				if ( env.config.name === undefined ) {
					env.config.name = this.getName();
				}
				if ( !env.config.hasOwnProperty( 'offset' ) ) {
					env.config.offset = {
						x: this.defaults.offset.x,
						y: this.defaults.offset.y
					};
				}
				if ( !env.config.hasOwnProperty( 'dataInterpretation' ) ) {
					env.config.dataInterpretation = this.defaults.dataInterpretation;
				}
			};

			var getCoordToPositionMapping = function ( coords, dimension, offset ) {
				"use strict";


				var borders = UTILS.C3D.getMinMax( coords );

				var xScaler = UTILS.scale().range( [0, offset.x + dimension.x - 1] ).domain( [borders.xMin, borders.xMax] );
				var yScaler = UTILS.scale().range( [0, offset.y + dimension.y - 1] ).domain( [borders.yMin, borders.yMax] );
				var zScaler = UTILS.scale().range( [0, dimension.z - 1] ).domain( [borders.zMin, borders.zMax] );
				var mapping = {x: {}, y: {}, z: {}};

				for ( var i = 0, il = coords.length; i < il; ++i ) {
					if ( !mapping.x.hasOwnProperty( coords[i].x ) ) {
						mapping.x[coords[i].x] = xScaler.linear( coords[i].x ) * dimension.x;
					}
					if ( !mapping.y.hasOwnProperty( coords[i].y ) ) {
						mapping.y[coords[i].y] = yScaler.linear( coords[i].y ) * dimension.y;
					}
					if ( !mapping.z.hasOwnProperty( coords[i].z ) ) {
						mapping.z[coords[i].z] = zScaler.linear( coords[i].z ) * dimension.z;
					}
				}

				return mapping;
			};

			var createBox3D = function ( coords, colors, env ) {
				"use strict";
				var coord, mesh;
				var dim = UTILS.C3D.getNumUniqueXYZ( coords );
				var positions = getCoordToPositionMapping( coords, dim, env.config.offset );
				var mergedGeometry = new F3D.Geometry();
				var positionArray = [];
				var valueArray = [];
				for ( var i = 0, il = coords.length; i < il; ++i ) {
					coord = coords[i];

					mesh = new F3D.Mesh( new F3D.BoxGeometry( dim.x, dim.y, coord.z, 1, 1, 1 ) );
					mesh.translateX( positions.x[coord.x] );
					mesh.translateY( positions.y[coord.y] );
					mesh.translateZ( coord.z / 2 );
					positionArray.push( mesh.position );
					valueArray.push( coord.z );

					Plugin.superClass.assignColorToVertices( mesh.geometry, colors[i] );
					Plugin.superClass.assignVertexColorsToFaceColors( mesh.geometry );

					mesh.updateMatrix();
					mergedGeometry.merge( mesh.geometry, mesh.matrix );

				}

				Plugin.superClass.faceColors2GeometryColors( mergedGeometry );

				return {
					geometry     : mergedGeometry,
					valueArray   : valueArray,
					positionArray: positionArray
				};
			};

			var createBox2D = function ( coords, colors, env ) {
				"use strict";

				var coord, mesh;
				var dim = UTILS.C3D.getNumUniqueXYZ( coords );
				var positions = getCoordToPositionMapping( coords, dim, env.config.offset );

				var mergedGeometry = new F3D.Geometry();
				var positionArray = [];
				var valueArray = [];
				for ( var i = 0, il = coords.length; i < il; ++i ) {
					coord = coords[i];

					mesh = new F3D.Mesh( new F3D.BoxGeometry( dim.x, coord.y, 0, 1, 1, 1 ) );
					mesh.translateX( positions.x[coord.x] );
					mesh.translateY( coord.y / 2 );
					//mesh.translateZ( coord.z / 2 );
					positionArray.push( mesh.position );
					valueArray.push( coord.y );

					Plugin.superClass.assignColorToVertices( mesh.geometry, colors[i] );
					Plugin.superClass.assignVertexColorsToFaceColors( mesh.geometry );

					mesh.updateMatrix();
					mergedGeometry.merge( mesh.geometry, mesh.matrix );

				}

				Plugin.superClass.faceColors2GeometryColors( mergedGeometry );

				return {
					geometry     : mergedGeometry,
					valueArray   : valueArray,
					positionArray: positionArray
				};
			};

			this.handleTicks = function( bufferManager, env ){
				"use strict";
				var ticks = Plugin.superClass.getTicks( bufferManager, env );
				var coords = Plugin.superClass.getCoordBuffer( bufferManager, env);
				var colors = Plugin.superClass.getColorBuffer( bufferManager, env);
				var coordBuffer, colorBuffer, box;

				for( var tick in ticks ){


						coordBuffer = Plugin.superClass.getCoordBuffer( bufferManager, env, tick );
						colorBuffer = Plugin.superClass.getColorBuffer( bufferManager, env, tick );

						if( !coordBuffer || !colorBuffer ){
							console.warn( '[ BarChart.handleTicks() ] coordBuffer OR colorBuffer not found.' );
							continue;
						}

						box = this.getBox( tick, bufferManager, env );

						coordBuffer.array = [];

						for( var i = 0, len = box.geometry.vertices.length; i < len; ++i ){
							coordBuffer.array[ i ] = box.geometry.vertices[ i ].clone();
							colorBuffer.array[ i ] = box.geometry.colors[ i ].clone();
						}
						coords.array[ tick ] = coordBuffer.array;
						colors.array[ tick ] = colorBuffer.array;
				}
			};

			this.getBox = function( tick, bufferManager, env ){
				"use strict";

				var coords = Plugin.superClass.getCoords( bufferManager, env, tick );
				var colors = Plugin.superClass.getColors( bufferManager, env, tick );

				if( !coords || !colors ){
					return false;
				}

				var box;

				if ( env.config.dataInterpretation === 'x-value' ) {
					box = createBox2D( coords, colors, env );

				} else {
					box = createBox3D( coords, colors, env );
				}

				return box;
			};

			this.createCustomPlot = function ( bufferManager, env ) {

				var buffer = Plugin.superClass.getBuffer( bufferManager, env );

				if ( !buffer ) {
					console.log("no buffer");
					return false;
				}

				if ( env.materials.length === 0 ) {
					var defaultMat = new DefaultMaterial();
					env.materials.push( defaultMat.exec().response );
				}

				var box = this.getBox( 0, bufferManager, env );

				if( !box ){
					console.log("no box");
					return false;
				}

				var coords = Plugin.superClass.getCoords( bufferManager, env );
				var metadata = buffer.getAttribute( Config.BUFFER.METADATA );
				metadata.array.numGeometries = coords.length;



				var mesh;
				var mergedGroup = new THREE.Object3D();

				for ( var i = 0, il = env.materials.length; i < il; ++i ) {
					mesh = new F3D.Mesh( box.geometry, env.materials[i].material );
					mergedGroup.add( mesh );
				}



				Plugin.superClass.setSystem( mergedGroup, bufferManager, env );

				this.handleTicks( bufferManager, env );

				Plugin.superClass.registerCustomPostprocess( env, function ( group ) {
					var xPositions = UTILS.C3D.getUniqe( box.positionArray, 'x' );
					var yPositions = UTILS.C3D.getUniqe( box.positionArray, 'y' );
					//var zPositions = UTILS.C3D.getUniqe( box.positionArray, 'z' );

					if ( env.axesSet ) {

						if ( env.config.dataInterpretation === 'x-y-value' ) {

							var valueArray = _.uniq( box.valueArray );
							env.axesContext.removeActivities.call( env.axesContext );
							env.axesContext.tickZisNice.call( env.axesContext, false );

							env.axesContext.setTickLabelsX.call( env.axesContext, env, false, xPositions );
							env.axesContext.setTickLabelsY.call( env.axesContext, env, false, yPositions );
							env.axesContext.setTickLabelsZ.call( env.axesContext, env, box.valueArray, box.valueArray );
						}else{
							var valueArray = _.uniq( box.valueArray );
							env.axesContext.removeActivities.call( env.axesContext );

							env.axesContext.setTickLabelsX.call( env.axesContext, env, false, xPositions );
							env.axesContext.setTickLabelsY.call( env.axesContext, env, box.valueArray, box.valueArray );
						}

					}

				}, this );

				return mergedGroup;

			};
		});
		UTILS.CLASS.extend( Plugin, THREEGeometryPlot );
		return Plugin;

	} );
