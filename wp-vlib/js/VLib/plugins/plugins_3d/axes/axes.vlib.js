define(
	['require', './getConfig.vlib', './setConfig.vlib', 'config', 'core/AbstractPlugin.vlib', './F3DAxes.vlib', 'core/Utils.vlib', 'three', 'jquery'],
	function ( require, getConfig, setConfig, Config, AbstractPlugin, F3D, UTILS, THREE, $ ) {
		/**
		 TODO<br />
		 @class Plugin Axes
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function ( state ) {
			var name = 'axes';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.AXES );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/axes/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/axes/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.PLOT],
				successors  : [Config.PLUGINTYPE.COLOR, Config.PLUGINTYPE.ACTIVITY]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var borders = {
				xMin: 'auto',
				yMin: 'auto',
				zMin: 'auto',
				xMax: 'auto',
				yMax: 'auto',
				zMax: 'auto',
				nice: true
			};
			var granularityX = 2;
			var granularityY = 2;
			var granularityZ = 2;

			var xRangeDefault = 'auto';
			var yRangeDefault = 'auto';
			var zRangeDefault = 'auto';


			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.carousel;
			this.activities = [];
			this.destroy = function(){
				"use strict";
				this.removeActivities();
			};
			this.defaults = {
				type           : 0,
				labels         : {x: 'x', y: 'y', z: 'z'},
				numUnits       : 2,
				nice           : true,
				range          : {
					x: xRangeDefault,
					y: yRangeDefault,
					z: zRangeDefault
				},
				mirrorTicklines: false,
				mantissa       : {x: 2, y: 2, z: 2},
				fontSize       : 25,
				decimalPlaces  : 2,
				raster         : {
					xy: {show: false, opacity: 0.2},
					xz: {show: false, opacity: 0.2},
					yx: {show: false, opacity: 0.2},
					yz: {show: false, opacity: 0.2},
					zx: {show: false, opacity: 0.2},
					zy: {show: false, opacity: 0.2}
				},
				rotationX       : {
					x: 0,
					y: 0,
					z: 0
				},
				rotationY       : {
					x: 0,
					y: 0,
					z: 0
				},
				rotationZ       : {
					x: 0,
					y: 0,
					z: 0
				},
				orientation : 'dynamic',
				offset      : {
					x: 0,
					y: 0,
					z : 0
				},
				tickData : {
					x : 'values',
					y : 'values',
					z : 'values'
				}
			};
			this.config = null;
			this.labelColor = 0x373530;

			if ( state !== undefined ) {
				xRange = state.xRange;
				yRange = state.yRange;
				zRange = state.zRange;
				this.config = state.config;
				this.labelColor = state.labelColor;

			}
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.deepCopy = function () {
				var privates = undefined;
				return new Plugin( /* privates */ );
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
			this.handleEnv = function ( env, config, bufferManager ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};

			this.handleConfig = function ( config, env ) {

				env.config = config || this.defaults;

				if ( env.config.type === null || env.config.type === undefined ) {
					env.config.type = this.defaults.type;
				}
				if ( env.config.numUnits === null || env.config.numUnits === undefined ) {
					env.config.numUnits = {
						x: this.defaults.numUnits,
						y: this.defaults.numUnits,
						z: this.defaults.numUnits
					};
				}
				if ( env.config.numUnits.x === undefined ) {
					env.config.numUnits.x = this.defaults.numUnits;
				}
				if ( env.config.numUnits.y === undefined ) {
					env.config.numUnits.y = this.defaults.numUnits;
				}
				if ( env.config.numUnits.z === undefined ) {
					env.config.numUnits.z = this.defaults.numUnits;
				}
				if ( env.config.numUnits.nice === undefined ) {
					env.config.numUnits.nice = this.defaults.nice;
				}

				if ( env.config.fontSize === undefined ) {
					env.config.fontSize = this.defaults.fontSize;
				}

				if ( env.config.mantissa === null || env.config.mantissa === undefined ) {
					env.config.mantissa = {x: 2, y: 2, z: 2};
				}
				if ( env.config.mantissa.x === undefined ) {
					env.config.mantissa.x = 2;
				}
				if ( env.config.mantissa.y === undefined ) {
					env.config.mantissa.y = 2;
				}
				if ( env.config.mantissa.z === undefined ) {
					env.config.mantissa.z = 2;
				}

				/* set labels */
				if ( env.config.labels !== undefined ) {
					if ( env.config.labels.x === undefined ) {
						env.config.labels.x = this.defaults.labels.x;
					}
					if ( env.config.labels.y === undefined ) {
						env.config.labels.y = this.defaults.labels.y;
					}
					if ( env.config.labels.z === undefined ) {
						env.config.labels.z = this.defaults.labels.z;
					}
				} else {
					env.config.labels = this.defaults.labels;
				}
				/* set rotation X*/
				if ( env.config.rotationX !== undefined ) {
					if ( env.config.rotationX.x === undefined ) {
						env.config.rotationX.x = this.defaults.rotationX.x;
					}
					if ( env.config.rotationX.y === undefined ) {
						env.config.rotationX.y = this.defaults.rotationX.y;
					}
					if ( env.config.rotationX.z === undefined ) {
						env.config.rotationX.z = this.defaults.rotationX.z;
					}
				} else {
					env.config.rotationX = this.defaults.rotationX;
				}
				/* set rotation Y*/
				if ( env.config.rotationY !== undefined ) {
					if ( env.config.rotationY.x === undefined ) {
						env.config.rotationY.x = this.defaults.rotationY.x;
					}
					if ( env.config.rotationY.y === undefined ) {
						env.config.rotationY.y = this.defaults.rotationY.y;
					}
					if ( env.config.rotationY.z === undefined ) {
						env.config.rotationY.z = this.defaults.rotationY.z;
					}
				} else {
					env.config.rotationY = this.defaults.rotationY;
				}
				/* set rotation Z*/
				if ( env.config.rotationZ !== undefined ) {
					if ( env.config.rotationZ.x === undefined ) {
						env.config.rotationZ.x = this.defaults.rotationZ.x;
					}
					if ( env.config.rotationZ.y === undefined ) {
						env.config.rotationZ.y = this.defaults.rotationZ.y;
					}
					if ( env.config.rotationZ.z === undefined ) {
						env.config.rotationZ.z = this.defaults.rotationZ.z;
					}
				} else {
					env.config.rotationZ = this.defaults.rotationZ;
				}


				/*set range*/
				if ( env.config.range !== undefined ) {

					/* min values */
					borders.xMin = env.config.range.xMin === undefined ? xRangeDefault
						: env.config.range.xMin;
					borders.yMin = env.config.range.yMin === undefined ? yRangeDefault
						: env.config.range.yMin;
					borders.zMin = env.config.range.zMin === undefined ? zRangeDefault
						: env.config.range.zMin;
					/* max values */
					borders.xMax = env.config.range.xMax === undefined ? xRangeDefault
						: env.config.range.xMax;
					borders.yMax = env.config.range.yMax === undefined ? yRangeDefault
						: env.config.range.yMax;
					borders.zMax = env.config.range.zMax === undefined ? zRangeDefault
						: env.config.range.zMax;

				}
				if ( env.config.numUnits !== undefined && env.config.numUnits.nice !== undefined ) {
					borders.nice = env.config.numUnits.nice;
				} else {
					borders.nice = true;
				}
				if ( env.config.mirrorTicklines === undefined ) {
					env.config.mirrorTicklines = this.defaults.mirrorTicklines;
				}

				/*set raster*/
				if ( env.config.raster === undefined ) {
					env.config.raster = {
						xy: {show: false},
						xz: {show: false},
						yx: {show: false},
						yz: {show: false},
						zx: {show: false},
						zy: {show: false}
					};
				}
				if(env.config.raster.xy === undefined){
					env.config.raster.xy = this.defaults.raster.xy;
				}
				if(env.config.raster.xz === undefined){
					env.config.raster.xz = this.defaults.raster.xz;
				}
				if(env.config.raster.yx === undefined){
					env.config.raster.yx = this.defaults.raster.yx;
				}
				if(env.config.raster.yz === undefined){
					env.config.raster.yz = this.defaults.raster.yz;
				}
				if(env.config.raster.zx === undefined){
					env.config.raster.zx = this.defaults.raster.zx;
				}
				if(env.config.raster.zy === undefined){
					env.config.raster.zy = this.defaults.raster.zy;
				}

				if ( env.config.orientation === undefined ) {
					env.config.orientation = this.defaults.orientation;
				}
				if ( env.config.heatmapRange === undefined ) {
					env.config.heatmapRange = false;
				}
				if ( !env.config.hasOwnProperty( 'offset' ) ) {
					env.config.offset = {
						x: this.defaults.offset.x,
						y: this.defaults.offset.y,
						z: this.defaults.offset.z
					};
				}
				/* set tickData */
				if ( env.config.tickData !== undefined ) {
					if ( env.config.tickData.x === undefined ) {
						env.config.tickData.x = this.defaults.tickData.x;
					}
					if ( env.config.tickData.y === undefined ) {
						env.config.tickData.y = this.defaults.tickData.y;
					}
					if ( env.config.tickData.z === undefined ) {
						env.config.tickData.z = this.defaults.tickData.z;
					}
				} else {
					env.config.tickData = this.defaults.tickData;
				}

			};
			this.exec = function ( config, childs, bufferManger ) {
				//console.log("[ plugin ][ axes ] \t\t EXECUTE "+JSON.stringify(config));

				this.env = {};
				this.handleEnv( this.env );
				this.handleConfig( config, this.env );
				this.config = this.env.config;
				this.buffer = bufferManger.getBuffer( this.env.id);
				this.bufferManager = bufferManger;

				Plugin.superClass.handleChilds( childs, this.env );
				if ( this.env.raw_color ){
					this.labelColor = '#' + this.env.raw_color;
				}


				return {
					pId     : this.getId(),
					pType   : this.type,
					response: {
						'callback': getAxes,
						'context' : this,
						'borders' : JSON.parse( JSON.stringify( borders ) ),
						'steps'   : JSON.parse( JSON.stringify( this.env.config.numUnits ) )
					}
				};

			};


			this.tickX;
			this.tickY;
			this.tickZ;
			this.tickLabelsX = [];
			this.tickLabelsY = [];
			this.tickLabelsZ = [];

			this.tickXisNice = function ( tickType ) {
				"use strict";
				if ( tickType ) {
					this.tickX = UTILS.nice().loose( true );

				} else {
					this.tickX = UTILS.interpolate();
				}
			};
			this.tickYisNice = function ( tickType ) {
				"use strict";
				if ( tickType ) {
					this.tickY = UTILS.nice().loose( true );

				} else {
					this.tickY = UTILS.interpolate();
				}
			};
			this.tickZisNice = function ( tickType ) {
				"use strict";
				if ( tickType ) {
					this.tickZ = UTILS.nice().loose( true );

				} else {
					this.tickZ = UTILS.interpolate();
				}
			};
			/** ********************************** */
			/** PRIVATE METHODS * */
			/** ********************************** */
			/*
			 * @param env
			 *	environment
			 */
			var getAxes = function ( bufferManager, env ) {

				var result = [];
				var borders = {};
				borders.xMin = env.borders.xMin === 'auto' ? 0 : env.borders.xMin;
				borders.yMin = env.borders.yMin === 'auto' ? 0 : env.borders.yMin;
				borders.zMin = env.borders.zMin === 'auto' ? 0 : env.borders.zMin;
				borders.xMax = env.borders.xMax === 'auto' ? 1 : env.borders.xMax;
				borders.yMax = env.borders.yMax === 'auto' ? 1 : env.borders.yMax;
				borders.zMax = env.borders.zMax === 'auto' ? 1 : env.borders.zMax;

				env.scale.x = parseFloat( env.scale.x );
				env.scale.y = parseFloat( env.scale.y );
				env.scale.z = parseFloat( env.scale.z );

				/* add axes geometry */
				var axesObejct3d = 0;

				switch ( this.config.type ) {
					case 0:
						axesObejct3d = new F3D.AxesXYZ( env, this.labelColor, 4 );
						break;
					case 1:
						axesObejct3d = new F3D.AxesXYZArrows( env, this.labelColor, 4 );
						break;
					case 2:
						axesObejct3d = new F3D.IndicatorsXYZ( env, this.labelColor, 4 );
						break;
					case 3:
						axesObejct3d = new F3D.AxesAndIndicatorsXYZ( env, this.labelColor, 4 );
						break;
					case 4:
						axesObejct3d = new F3D.AxesCubeXYZ( env, this.labelColor, 4 );
						break;
					default:
						axesObejct3d = new F3D.AxesXYZ( env, this.labelColor, 4 );
						break;
				}
				result.push( axesObejct3d );

				/* add tick labels */
				this.tickXisNice( this.config.numUnits.nice );
				this.tickYisNice( this.config.numUnits.nice );
				this.tickZisNice( this.config.numUnits.nice );
				this.config.color = this.labelColor;

				var xAxisLabels;
				var yAxisLabels;
				var zAxisLabels;

				var buffer = bufferManager.getBuffer( env.id );


				if( this.config.tickData.x === 'labels'){

					var raw_labels_x = buffer.getAttribute( Config.BUFFER.RAW_LABELS_X );
					xAxisLabels = raw_labels_x.array;
				}
				if( this.config.tickData.y === 'labels'){

					var raw_labels_y = buffer.getAttribute( Config.BUFFER.RAW_LABELS_Y );
					yAxisLabels = raw_labels_y.array;
				}
				if( this.config.tickData.z === 'labels'){
					var raw_labels_z = buffer.getAttribute( Config.BUFFER.RAW_LABELS_Z );
					zAxisLabels = raw_labels_z.array;
				}



				/* CREATE X LABELS*/
				this.tickLabelsX = F3D.createTickLabelsX( this.tickX, this.config, borders, env.scale, xAxisLabels );
				for ( var i = 0, len = this.tickLabelsX.length; i < len; ++i ) {
					result.push( this.tickLabelsX[i] );
				}
				/* CREATE Y LABELS*/
				this.tickLabelsY = F3D.createTickLabelsY( this.tickY, this.config, borders, env.scale, yAxisLabels );

				for ( var i = 0, len = this.tickLabelsY.length; i < len; ++i ) {
					result.push( this.tickLabelsY[i] );
				}
				/* CREATE Z LABELS*/
				this.tickLabelsZ = F3D.createTickLabelsZ( this.tickZ, this.config, borders, env.scale, zAxisLabels );
				for ( var i = 0, len = this.tickLabelsZ.length; i < len; ++i ) {
					result.push( this.tickLabelsZ[i] );
				}

				this.removeActivities( this.activities );
				this.attachActivities( this.tickLabelsX );
				this.attachActivities( this.tickLabelsY );
				this.attachActivities( this.tickLabelsZ );

				/* add custom labels */
				var customLabelsArray = F3D.createCustomLabels( this.config, env, this.labelColor );
				for ( var i = 0, len = customLabelsArray.length; i < len; ++i ) {
					result.push( customLabelsArray[i] );
				}

				/* show heatmap ? */
				if ( this.config.heatmapRange) {

					var heatmap, offset = 0, padding = 20;
					for ( var i = 0; i < env.heatmaps.length; ++i ) {
						heatmap = F3D.createHeatmap( this.config, env.scale, env.heatmaps[i] );
						if(!heatmap ){
							continue;
						}
						heatmap[0].position.x = parseInt( env.scale.y ) + offset + padding;

						switch(env.heatmaps[i].use){
							case 'x':
								heatmap[0].rotateZ(Math.PI/2);
								heatmap[0].position.x = parseInt( env.scale.y );
								break;
							case 'y': break;
							case 'z': heatmap[0].rotateX(Math.PI/2); break;
						}


						result.push( heatmap[0] );
						offset += heatmap[1];
					}
				}


				return result;
			};

			this.setTickLabelsX = function ( env, labels, positions ) {
				"use strict";

				if ( this.tickLabelsX.length !== 0 ) {
					F3D.sceneRemoveObjects( env.scene, this.tickLabelsX );
					this.tickLabelsX = [];
				}


				var xAxisLabels;
				if( labels ){
					xAxisLabels = labels;
				}else if( this.config.tickData.x === 'labels'){
					var buffer = this.bufferManager.getBuffer( env.id );
					var raw_labels_x = buffer.getAttribute( Config.BUFFER.RAW_LABELS_X );
					xAxisLabels = raw_labels_x.array;
				}

				this.tickLabelsX = F3D.createTickLabelsX( this.tickX, this.config, env.boundingBox, env.scale, xAxisLabels , positions );
				for ( var i = 0, len = this.tickLabelsX.length; i < len; ++i ) {
					env.scene.add( this.tickLabelsX[i] );
				}
				this.attachActivities( this.tickLabelsX );
			};

			this.setTickLabelsY = function ( env, labels, positions ) {
				console.log("SET Y TICKS");
				"use strict";
				if ( this.tickLabelsX.length !== 0 ) {
					F3D.sceneRemoveObjects( env.scene, this.tickLabelsY );
					this.tickLabelsY = [];
				}
				this.config.numUnits.y = positions.length;

				var yAxisLabels;
				if( labels ){
					yAxisLabels = labels;
				}else if( this.config.tickData.y === 'labels'){
					var buffer = this.bufferManager.getBuffer( env.id );
					var raw_labels_x = buffer.getAttribute( Config.BUFFER.RAW_LABELS_Y );
					yAxisLabels = raw_labels_x.array;
				}

				this.tickLabelsY = F3D.createTickLabelsY( this.tickY, this.config, env.boundingBox, env.scale, yAxisLabels, positions );

				for ( var i = 0, len = this.tickLabelsY.length; i < len; ++i ) {
					env.scene.add( this.tickLabelsY[i] );
				}
				this.attachActivities( this.tickLabelsY );
			};
			this.setTickLabelsZ = function ( env, labels, positions ) {
				"use strict";
				if ( this.tickLabelsZ.length !== 0 ) {
					F3D.sceneRemoveObjects( env.scene, this.tickLabelsZ );
					this.tickLabelsZ = [];
				}
				this.config.numUnits.z = positions.length;

				var zAxisLabels
				if( labels ){
					zAxisLabels = labels;
				}else if( this.config.tickData.y === 'labels'){
					var buffer = this.bufferManager.getBuffer( env.id );
					var raw_labels_z = buffer.getAttribute( Config.BUFFER.RAW_LABELS_Z );
					zAxisLabels = raw_labels_z.array;
				}
				this.tickLabelsZ = F3D.createTickLabelsZ( this.tickZ, this.config, env.boundingBox, env.scale, zAxisLabels, positions );
				for ( var i = 0, len = this.tickLabelsZ.length; i < len; ++i ) {
					env.scene.add( this.tickLabelsZ[i] );
				}
				this.attachActivities( this.tickLabelsZ );

			};
			this.removeActivities = function(){
				"use strict";
				Plugin.superClass.destroyActivities( this.activities );
				this.activities = [];
			};
			this.attachActivities = function( objects ){
				"use strict";
				var mouseActivity, rendererActivity;
				for(var i = 0, len = objects.length; i < len; ++i){

					mouseActivity = UTILS.ACTIVITY.MOUSE.handleActivities(objects[ i ] , this.env );
					/*
					rendererActivity = new UTILS.ACTIVITY.RENDERER.Activity(
						$( '#' + this.env.config.container ).find( '.plot-container' ).attr( "id" ),
						objects[ i ],
						function(e){
							e.object.lookAt( e.camera.position );
							e.object.up = e.camera.up;
						},
						this
					);
					 this.activities.push( rendererActivity );
					 rendererActivity.start();
					*/
					this.activities.push( mouseActivity );



				}
			}


		});
		UTILS.CLASS.extend( Plugin, AbstractPlugin );
		return Plugin;
	} );
