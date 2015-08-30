define(
	['require', 'config', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'jquery', 'core/Framework3D.vlib'],
	function ( require, Config, AbstractPlugin, UTILS, $, F3D ) {

		var Plot = function ( name ) {
			Plot.superClass.constuctor.call( this, name );
			this.onDoneList = [];
		};

		/* Plot extends AbstractPlugin */
		UTILS.CLASS.extend( Plot, AbstractPlugin );

		/**
		 *
		 * @returns {{
		 *  xMax: (Config.defaults.borders.xMax),
		 *  yMax: (Config.defaults.borders.yMax),
		 *  zMax: (Config.defaults.borders.zMax),
		 *  xMin: (Config.defaults.borders.xMin),
		 *  yMin: (Config.defaults.borders.yMin),
		 *  zMin: (Config.defaults.borders.zMin),
		 *  nice: (Config.defaults.borders.nice)
		 * }}
		 */
		Plot.prototype.getDefaultBorders = function () {
			return {
				xMax: Config.defaults.borders.xMax,
				yMax: Config.defaults.borders.yMax,
				zMax: Config.defaults.borders.zMax,
				xMin: Config.defaults.borders.xMin,
				yMin: Config.defaults.borders.yMin,
				zMin: Config.defaults.borders.zMin,
				nice: Config.defaults.borders.nice
			};
		};

		/**
		 *
		 * @returns {{
		 *  x: (Config.defaults.scale.x),
		 *  y: (Config.defaults.scale.y),
		 *  z: (Config.defaults.scale.z)
		 * }}
		 */
		Plot.prototype.getDefaultScaling = function () {

			return {
				x: Config.defaults.scale.x,
				y: Config.defaults.scale.y,
				z: Config.defaults.scale.z
			};

		};

		/**
		 *
		 * @param bufferManager
		 * @param env
		 * @returns { false | Buffer-Object-Array}
		 */
		Plot.prototype.getRAWData = function ( bufferManager, env, tick ) {
			var buffer = bufferManager.getBuffer( env.id );

			if( !buffer ){
				return false;
			}

			if( tick === undefined ){
				return buffer.getAttribute( Config.BUFFER.RAW_DATA ).array;
			}else{
				return buffer.filter( Config.BUFFER.RAW_DATA, function( o ){
					"use strict";
					return o.tick === tick;
				} );
			}


		};

		/**
		 *
		 * @param bufferManager
		 * @param env
		 * @returns { false | Buffer-Object-Array}
		 */
		Plot.prototype.getTicks = function ( bufferManager, env ) {

			var buffer = bufferManager.getBuffer( env.id );

			if( !buffer ){
				return false;
			}

			return buffer.getAttribute( Config.BUFFER.RAW_DATA_TICK ).array;
		};

		/**
		 *
		 * @param done
		 * Callback
		 * @param bufferManager
		 * @param env
		 */
		Plot.prototype.setRAWData = function ( done, bufferManager, env ) {

			var buffer = bufferManager.getBuffer( env.id );
			var rawDataBuffer = buffer.getAttribute( Config.BUFFER.RAW_DATA );
			var rawDataTickBuffer = buffer.getAttribute( Config.BUFFER.RAW_DATA_TICK );
			var raw_labels_x = buffer.getAttribute( Config.BUFFER.RAW_LABELS_X );
			var raw_labels_y = buffer.getAttribute( Config.BUFFER.RAW_LABELS_Y );
			var raw_labels_z = buffer.getAttribute( Config.BUFFER.RAW_LABELS_Z );

			raw_labels_x.array = [];
			raw_labels_y.array = [];
			raw_labels_z.array = [];

			var oldLen = rawDataBuffer.array.length;
			var dsb, dsd, dsl;
			var offset = 0;


			/* RAW DATA */
			rawDataBuffer.dirty = false;


			for ( var index = 0; index < env.datasets.length; index++ ) {
				dsb = bufferManager.getBuffer( env.datasets[index].pId );
				/* RAW DATA */
				if ( dsb.isAttribute( Config.BUFFER.RAW_DATA ) ) {
					dsd = dsb.getAttribute( Config.BUFFER.RAW_DATA );


					if ( dsd.dirty ) {

						/* update */
						for ( var k = 0, l = dsd.array.length; k < l; ++k ) {
							rawDataBuffer.array[offset + k] = dsd.array[k];
							if ( rawDataTickBuffer.array[rawDataBuffer.array[offset + k].tick] === undefined ) {
								rawDataTickBuffer.array[rawDataBuffer.array[offset + k].tick] = 0;
							}
							rawDataTickBuffer.array[rawDataBuffer.array[offset + k].tick] += 1;
						}
						rawDataBuffer.dirty = true;
					}
					offset += dsd.array.length;

				} else {
					console.error( "[ Plot.setRAWData() ] No data!" );
				}


				/* RAW LABELS X */
				if ( dsb.isAttribute( Config.BUFFER.RAW_LABELS_X ) ) {
					dsl = dsb.getAttribute( Config.BUFFER.RAW_LABELS_X );
					for ( var k = 0, l = dsl.array.length; k < l; ++k ) {
						raw_labels_x.array.push( dsl.array[k] );
					}
				}
				/* RAW LABELS Y */
				if ( dsb.isAttribute( Config.BUFFER.RAW_LABELS_Y ) ) {
					dsl = dsb.getAttribute( Config.BUFFER.RAW_LABELS_Y );
					for ( var k = 0, l = dsl.array.length; k < l; ++k ) {
						raw_labels_y.array.push( dsl.array[k] );
					}
				}
				/* RAW LABELS Z */
				if ( dsb.isAttribute( Config.BUFFER.RAW_LABELS_Z ) ) {
					dsl = dsb.getAttribute( Config.BUFFER.RAW_LABELS_Z );
					for ( var k = 0, l = dsl.array.length; k < l; ++k ) {
						raw_labels_z.array.push( dsl.array[k] );
					}
				}

			}


			if ( oldLen > offset ) {
				rawDataBuffer.dirty = true;
				rawDataBuffer.array.splice( offset, oldLen );
			}


			done( rawDataBuffer.dirty );
		};

		/**
		 * Removes RAW_DATA attributes from "Data" subplugins.
		 * @param bufferManager
		 * @param env
		 */
		Plot.prototype.freeMemory = function ( bufferManager, env ) {
			"use strict";

			var buffer;
			/* remove child-data-buffers */
			for ( var i = 0, len = env.datasets.length; i < len; ++i ) {
				buffer = bufferManager.getBuffer( env.datasets[i].pId );
				buffer.deleteAttribute( Config.BUFFER.RAW_DATA );
			}
		};
		/**
		 * Removes TICK attributes from buffer.
		 * @param bufferManager
		 * @param env
		 */
		Plot.prototype.removeUnusedTicks = function( bufferManager, env ){
			"use strict";
			var buffer = bufferManager.getBuffer( env.id );
			var tickBuffer = buffer.getAttribute( Config.BUFFER.RAW_DATA_TICK );
			var scaledCoordsBuffer = buffer.getAttribute( Config.BUFFER.SCALED_COORDS );
			var usedTicks = Object.keys(tickBuffer.array);

			var tickInUse = false;
			for(var tick in scaledCoordsBuffer.array){
				tickInUse = false;
				for( var i = 0, len = usedTicks.length; i < len; ++i){
					if( tick === usedTicks[ i ]){
						tickInUse = true;
					}
				}
				var scaledCoords = buffer.getAttribute( Config.BUFFER.SCALED_COORDS);
				if( !tickInUse ){
					delete scaledCoords.array[ tick ];
					buffer.deleteAttribute(tick+'_'+Config.BUFFER.COORDS);
					buffer.deleteAttribute(tick+'_'+Config.BUFFER.COLORS);
					buffer.deleteAttribute(tick+'_'+Config.BUFFER.SCALED_COORDS);
				}
			}
		};

		/*
		 * Checks if a dirty-flag of a dataset is set.
		 * This is an indicator for rescaling!
		 * Sets buffer-attributes "scaled_data", "borders", "scaling", "geometry"
		 */
		Plot.prototype.initBuffers = function ( bufferManager, env ) {
			var buffer = bufferManager.getBuffer( env.id );

			/* Add config attribute */
			if ( !buffer.isAttribute( Config.BUFFER.CONFIG ) ) {
				buffer.setAttribute( Config.BUFFER.CONFIG, Object );
			}
			/* Add system attribute */
			if ( !buffer.isAttribute( Config.BUFFER.SYSTEM ) ) {
				buffer.setAttribute( Config.BUFFER.SYSTEM, Object );
			}
			/* Add legend attribute */
			if ( !buffer.isAttribute( Config.BUFFER.METADATA ) ) {
				buffer.setAttribute( Config.BUFFER.METADATA, Object );
			}
			/* Add border attribute */
			if ( !buffer.isAttribute( Config.BUFFER.BORDERS ) ) {
				buffer.setAttribute( Config.BUFFER.BORDERS, Object );
			}
			/* Add scaling attribute */
			if ( !buffer.isAttribute( Config.BUFFER.SCALING ) ) {
				buffer.setAttribute( Config.BUFFER.SCALING, Object );
			}
			/* Add raw_data attribute */
			if ( !buffer.isAttribute( Config.BUFFER.RAW_DATA ) ) {
				buffer.setAttribute( Config.BUFFER.RAW_DATA, Array );
			}
			/* Add tick attribute */
			buffer.setAttribute( Config.BUFFER.RAW_DATA_TICK, Object );
			/* Add current-tick attribute */
			buffer.setAttribute( Config.BUFFER.CURRENT_TICK, Object );

			if ( !buffer.isAttribute( Config.BUFFER.RAW_LABELS_X ) ) {
				buffer.setAttribute( Config.BUFFER.RAW_LABELS_X, Array );
			}
			if ( !buffer.isAttribute( Config.BUFFER.RAW_LABELS_Y ) ) {
				buffer.setAttribute( Config.BUFFER.RAW_LABELS_Y, Array );
			}
			if ( !buffer.isAttribute( Config.BUFFER.RAW_LABELS_Z ) ) {
				buffer.setAttribute( Config.BUFFER.RAW_LABELS_Z, Array );
			}
		};

		/**
		 * Processes attached plugins.
		 * e.g.: axes
		 *
		 * @param bufferManager
		 * @param env
		 */
		Plot.prototype.processSubplugins = function ( bufferManager, env ) {

			/** *********************************** */
			/** handle axes * */
			var scaledData = [];
			if ( env.axesSet ) {
				var axes = env.axesCallback.apply( env.axesContext, [bufferManager, env] );
				for ( var index = 0; index < axes.length; ++index ) {
					/* add axes to scene*/
					env.scene.add( axes[index] );
				}
			}
		};

		/**
		 *
		 * @param done
		 * callback
		 * @param childs
		 * @param bufferManager
		 * @param env
		 */
		Plot.prototype.preProcess = function ( done, childs, bufferManager, env ) {

			var context = this;
			var buffer = bufferManager.getBuffer( env.id );
			var com = env.communication.messageController;
			var msg = com.addMsg( 'info', '[ Plot ][ ' + env.name + ' ][ preprocess ]' );
			env.msg = msg;

			/** *********************************** * */
			/** HANDLE SUCCESSOR PLUGINGS * */
			/** *********************************** * */
			com.updateMsg( env.msg, '[ Plot ][ ' + env.name + ' ][ preprocess ][ handle child plugins ]' );
			Plot.superClass.handleChilds( childs, env, function () {
				"use strict";

				/** *********************************** * */
				/** INIT PLOT BUFFERS AND FILL * */
				/** *********************************** * */
				this.initBuffers( bufferManager, env );

				com.updateMsg( env.msg, '[ Plot ][ ' + env.name + ' ][ preprocess ][ set data ]' );
				this.setRAWData( function ( dirty ) {

					/* update env */
					com.updateMsg( env.msg, '[ Plot ][ ' + env.name + ' ][ preprocess ][ scale to env ]' );
					context.scaleToENV( bufferManager, env, true );
					com.updateMsg( env.msg, '[ Plot ][ ' + env.name + ' ][ preprocess ][ find maxima and minima ]' );
					context.dataBordersToEnv( bufferManager, env, true );

					done();
				}, bufferManager, env );


			}, this );

		};

		Plot.prototype.setInfoMsgs = function ( env ) {
			if ( !env || !env.activities || !env.communication ) return;

			for ( var i = 0, len = env.activities.length; i < len; ++i ) {
				env.communication.messageController.addMsg( 'info', unescape( env.config.name ) + ' has activity ' + env.activities[i].aType );
			}
		};

		Plot.prototype.registerCustomPostprocess = function ( env, cb, context ) {
			if ( env.postProcessList === undefined ) {
				env.postProcessList = [];
			}
			env.postProcessList.push( {cb: cb, ctx: context} );
		};

		Plot.prototype.customPostProcess = function ( system, env ) {
			var com = env.communication.messageController;
			com.updateMsg( env.msg, '[ Plot ][ ' + env.name + ' ][ cumstom postprocess ]' );
			if ( env.postProcessList === undefined ) return;
			var cb, ctx;
			for ( var i = 0, len = env.postProcessList.length; i < len; ++i ) {

				if ( typeof env.postProcessList[i] === 'object' ) {
					cb = env.postProcessList[i].cb;
					ctx = env.postProcessList[i].ctx || this;
					if ( typeof cb === 'function' ) {
						cb.apply( ctx, [system] );
					}
				}

			}
		};

		Plot.prototype.postProcess = function ( bufferManager, env ) {
			var com = env.communication.messageController;
			com.updateMsg( env.msg, '[ Plot ][ ' + env.name + ' ][ postprocess ]' );
			//this.createBackup( bufferManager, env );
			/* update ENV */
			this.boundingBoxToEnv( bufferManager, env );
			this.processSubplugins( bufferManager, env );
			this.updateConfigBuffer( bufferManager, env );
			this.updateBorderBuffer( bufferManager, env );
			this.updateScaleBuffer( bufferManager, env );
			this.updateMetadataBuffer( bufferManager, env );
			this.setInfoMsgs( env );
			this.freeMemory( bufferManager, env );
			com.removeMsg( env.msg );
			delete env.msg;
		};

		Plot.prototype.setSystem = function ( system, bufferManager, env ) {
			system.userData.id = env.id;
			system.userData.name = unescape( env.config.name );
			var buffer = bufferManager.getBuffer( env.id );
			var sysBuffer = buffer.setAttribute( Config.BUFFER.SYSTEM, Object );
			/* set indicator for object group */
			if ( system.hasOwnProperty( "children" ) && system.children.length !== 0 ) {
				system.multiMaterialObject = system;
				system.multiMaterialObject.userData.id = env.id;
			}
			sysBuffer.array[Config.BUFFER.SYSTEM] = system;

		};

		Plot.prototype.getSystem = function ( bufferManager, env ) {
			var buffer = bufferManager.getBuffer( env.id );
			if ( !buffer.isAttribute( Config.BUFFER.SYSTEM ) ) return false;

			var sysBuffer = buffer.getAttribute( Config.BUFFER.SYSTEM );
			var sys = sysBuffer.array[Config.BUFFER.SYSTEM];
			return sys;

		};

		Plot.prototype.updateConfigBuffer = function ( bufferManager, env ) {
			var buffer = bufferManager.getBuffer( env.id );
			var borderBuffer = buffer.getAttribute( Config.BUFFER.CONFIG );
			borderBuffer.array = JSON.parse( JSON.stringify( env.config ) );
		};

		Plot.prototype.getScaling = function ( bufferManager, env ) {
			"use strict";
			var buffer = bufferManager.getBuffer( env.id );
			return buffer.getAttribute( Config.BUFFER.SCALING ).array;
		};

		Plot.prototype.getBorders = function ( bufferManager, env ) {
			"use strict";
			var buffer = bufferManager.getBuffer( env.id );
			return buffer.getAttribute( Config.BUFFER.BORDERS ).array;
		};

		Plot.prototype.updateBorderBuffer = function ( bufferManager, env ) {
			if ( !env.borders ) {
				return false;
			}
			var buffer = bufferManager.getBuffer( env.id );
			var borderBuffer = buffer.getAttribute( Config.BUFFER.BORDERS );
			borderBuffer.array = JSON.parse( JSON.stringify( env.borders ) );
			return true;
		};

		Plot.prototype.updateScaleBuffer = function ( bufferManager, env ) {
			if ( !env.config.scale ) {
				return false;
			}
			var buffer = bufferManager.getBuffer( env.id );
			var scaleBuffer = buffer.getAttribute( Config.BUFFER.SCALING );
			scaleBuffer.array = JSON.parse( JSON.stringify( env.config.scale ) );
			return true;
		};

		Plot.prototype.updateSystemBuffer = function ( system, bufferManager, env ) {
			var buffer = bufferManager.getBuffer( env.id );
			var sb = buffer.getAttribute( Config.BUFFER.SYSTEM ).array;
			var s = system.clone();
			s.material = system.material.clone();
			s.geometry = system.geometry.clone();
			Plot.superClass.createBackup( s );
			sb[Config.BUFFER.SYSTEM] = s;
		};

		Plot.prototype.updateMetadataBuffer = function ( bufferManager, env ) {
			var buffer = bufferManager.getBuffer( env.id );
			var lb = buffer.getAttribute( Config.BUFFER.METADATA ).array;
			lb.pId = env.id;
			lb.name = unescape( env.config.name );
			lb.icon = env.icon;
			lb.sprite = env.sprite;
			lb.borders = JSON.parse( JSON.stringify( env.borders ) );
			lb.datasets = 0;
			lb.colors = [];
			lb.heatmaps = [];

			for ( var i = 0, len = env.datasets.length; i < len; ++i ) {

				lb.colors.push( env.datasets[i].response.getColors() );
				lb.heatmaps.push( env.datasets[i].response.getHeatmaps() );
				lb.datasets += env.datasets[i].response.getData().length;
			}

		};

		Plot.prototype.updateCurrentTickBuffer = function ( bufferManager, env ) {
			var buffer = bufferManager.getBuffer( env.id );
			var tba = buffer.getAttribute( Config.BUFFER.CURRENT_TICK );
			tba.array.currentTick = env.currentTick;
		};


		Plot.prototype.hide = function ( system ) {

			system.visible = false;
			return;
			if ( !system.backup ) {
				console.warn( "[ Plot.hide() ] Use Plot.createBackup() first!" );
			}
			if ( system.material ) {
				system.material.opacity = 0;
			} else if ( system.children.length > 0 ) {

				for ( var i = 0, len = system.children.length; i < len; ++i ) {
					if ( system.children[i].material ) {
						system.children[i].material.opacity = 0;
					} else {
						console.warn( "[ Plot.hide() ] material not found." );
					}
				}
			}

		};

		Plot.prototype.done = function ( env ) {
			"use strict";

			if ( !env.context.onDoneList ) {
				return;
			}
			for ( var i = 0, len = env.context.onDoneList.length; i < len; ++i ) {
				env.context.onDoneList[i].callback.call( env.context.onDoneList[i].context, env.id );
			}
		};

		Plot.prototype.onDone = function ( cb, ctx ) {
			"use strict";

			if ( !this.onDoneList ) {
				this.onDoneList = [];
			}
			this.onDoneList.push( {callback: cb, context: ctx} );
		};

		Plot.prototype.show = function ( system ) {

			system.visible = true;
			return;
			if ( system.material ) {
				if ( system.backup ) {
					system.material.opacity = system.backup.material.opacity;
					system.material.needsUpdate = true;
				} else {
					console.warn( "[ Plot.show() ] Unable to restore original opacity." );
					console.warn( "[ Plot.show() ] Use Plot.createBackup() first!" );
				}

			} else {

				for ( var i = 0, len = system.children.length; i < len; ++i ) {

					if ( system.children[i].material ) {
						if ( system.children[i].backup ) {
							system.children[i].material.opacity = system.children[i].backup.material.opacity;
							system.children[i].material.needsUpdate = true;
						} else {
							console.warn( "[ Plot.show() ] Unable to restore original opacity." );
							console.warn( "[ Plot.show() ] Use Plot.createBackup() first!" );
						}

					}
				}
			}
		};

		Plot.prototype.handlePreActivities = function ( bufferManager, env, callback, context ) {

			if ( env.stateActivities.length === 0 ) {
				callback.call( context );
				return;
			}
			var that = this;
			var system = this.getSystem( bufferManager, env );
			this.hide( system );
			var STATE = Config.STATE;

			var activities = Plot.superClass.filterActivities( env.stateActivities, STATE.PRE );
			var activitiesLen = activities.length;

			if(activitiesLen === 0){
				callback.call( context );
				return;
			}
			var plotmoduleBuffer = bufferManager.getBuffer( env.config.container );
			var handler = plotmoduleBuffer.getAttribute(Config.BUFFER.PLOT_HANDLER ).array;


			doneCounter = 0;
			var preDone = function () {
				"use strict";
				doneCounter++;
				if ( doneCounter === activitiesLen ) {
					that.show( system );
					handler.previewController.hide();
					callback.call( context );
				}
			};


			var activity;
			for ( var i = 0; i < activitiesLen; ++i ) {

				activity = activities[i];
				activity.callback.apply( activity.context, [system, preDone, env] );

			}



		};

		Plot.prototype.handleReadyActivities = function ( bufferManager, env, callback, context ) {
			var system = this.getSystem( bufferManager, env );
			this.show( system );

			if ( env.stateActivities.length === 0 ) {
				callback();
				return;
			}

			var STATE = Config.STATE;
			var activity;
			var activities = Plot.superClass.filterActivities( env.stateActivities, STATE.READY );
			var activitiesLen = activities.length;

			if(activitiesLen === 0){
				callback.call( context );
				return;
			}

			var doneCounter = 0;
			var readyDone = function () {

				doneCounter++;
				if ( doneCounter === activitiesLen ) {
					callback.call( context );
				}
			};

			for ( var i = 0; i < activitiesLen; ++i ) {
				activity = activities[i];
				activity.callback.apply( activity.context, [system, readyDone, env] );
			}

			if(activitiesLen === 0){
				readyDone();
			}

		};

		Plot.prototype.handlePostActivities = function ( bufferManager, env, callback, context ) {

			if ( env.stateActivities.length === 0 ) {
				callback.call( context );
				return;
			}
			var that = this;
			var system = this.getSystem( bufferManager, env );
			var STATE = Config.STATE;
			var activities = Plot.superClass.filterActivities( env.stateActivities, STATE.POST );
			var activitiesLen = activities.length;

			if(activitiesLen === 0){
				callback.call( context );
				return;
			}

			var doneCounter = 0;
			var done = false;
			var iId = setInterval( function () {
				"use strict";
				if ( done ) {
					clearInterval( iId );
					callback.call( context );
				}
			}, 500 );

			var postDone = function () {
				doneCounter++;

				if ( doneCounter === activitiesLen ) {

					that.hide( system );
					var backup = system.backup;
					system.position.set( backup.position.x, backup.position.y, backup.position.z );
					system.scale.set( backup.scale.x, backup.scale.y, backup.scale.z );
					done = true;
				}
			};

			var activity;
			for ( var i = 0; i < activitiesLen; ++i ) {
				activity = activities[i];
				activity.callback.apply( activity.context, [system, postDone, env] );
			}

		};
		/*
		 Plot.prototype.updateENV = function ( bufferManager, env ) {

		 this.scaleToENV( env );
		 this.boundingBoxToEnv( bufferManager, env );
		 };
		 */
		Plot.prototype.scaleToENV = function ( bufferManager, env, dirty ) {
			if ( !env ) {
				console.warn( '[ Plot.scaleToENV() ] No ENV given.' );
				return;
			}

			if ( !dirty ) {
				env.scale = this.getScaling( bufferManager, env );
				return;
			}

			env.scale = this.getDefaultScaling();
			if ( env.config.hasOwnProperty( 'scale' ) ) {
				env.scale.x = env.config.scale.x;
				env.scale.y = env.config.scale.y;
				env.scale.z = env.config.scale.z;
			} else {
				env.config.scale = {
					x: env.scale.x,
					y: env.scale.y,
					z: env.scale.z
				};
			}
		};
		Plot.prototype.dataBordersToEnv = function ( bufferManager, env, dirty ) {

			if ( !dirty ) {
				env.borders = this.getBorders( bufferManager, env );
				return;
			}

			if ( env.borders === undefined ) {
				env.borders = this.getDefaultBorders();
			}
			var raw_data = this.getRAWData( bufferManager, env, 0 );


			if ( raw_data === undefined || raw_data.length === 0 ) {
				env.data = [];
				return;
			}

			/** *********************************** */
			/** GET MAX VALUES * */
			/** CHECK RANGE - auto * */
			var minMax = UTILS.C3D.getMinMax( env.raw_data );

			env.borders.xMax = env.borders.xMax !== 'auto' ? parseFloat( env.borders.xMax ) : parseFloat( minMax.xMax );
			env.borders.yMax = env.borders.yMax !== 'auto' ? parseFloat( env.borders.yMax ) : parseFloat( minMax.yMax );
			env.borders.zMax = env.borders.zMax !== 'auto' ? parseFloat( env.borders.zMax ) : parseFloat( minMax.zMax );
			env.borders.xMin = env.borders.xMin !== 'auto' ? parseFloat( env.borders.xMin ) : parseFloat( minMax.xMin );
			env.borders.yMin = env.borders.yMin !== 'auto' ? parseFloat( env.borders.yMin ) : parseFloat( minMax.yMin );
			env.borders.zMin = env.borders.zMin !== 'auto' ? parseFloat( env.borders.zMin ) : parseFloat( minMax.zMin );


			/* nice borders */
			if ( true === env.borders.nice ) {


				var steps = 10;

				var xRange = UTILS.nice().loose( true ).search( env.borders.xMin, env.borders.xMax, steps ).toArray();

				var yRange = UTILS.nice().loose( true ).search( env.borders.yMin, env.borders.yMax, steps ).toArray();

				var zRange = UTILS.nice().loose( true ).search( env.borders.zMin, env.borders.zMax, steps ).toArray();

				env.borders.xMin = parseFloat( xRange[0] );
				env.borders.xMax = parseFloat( xRange[xRange.length - 1] );
				env.borders.yMin = parseFloat( yRange[0] );
				env.borders.yMax = parseFloat( yRange[yRange.length - 1] );
				env.borders.zMin = parseFloat( zRange[0] );
				env.borders.zMax = parseFloat( zRange[zRange.length - 1] );

			}
			return true;
		};

		Plot.prototype.boundingBoxToEnv = function ( bufferManager, env ) {

			if ( env.boundingBox === undefined ) {
				env.boundingBox = this.getDefaultBorders();
			}

			var buffer = bufferManager.getBuffer( env.id );

			/** *********************************** */
			/** GET MAX VALUES * */
			var system = this.getSystem( bufferManager, env );
			var box = F3D.getBoundingBox( system );

			/** CHECK RANGE - auto * */
			env.boundingBox.xMax = box.max.x > env.borders.xMax ? box.max.x : env.borders.xMax;
			env.boundingBox.yMax = box.max.y > env.borders.yMax ? box.max.y : env.borders.yMax;
			env.boundingBox.zMax = box.max.z > env.borders.zMax ? box.max.z : env.borders.zMax;
			env.boundingBox.xMin = box.min.x < env.borders.xMin ? box.min.x : env.borders.xMin;
			env.boundingBox.yMin = box.min.y < env.borders.yMin ? box.min.y : env.borders.yMin;
			env.boundingBox.zMin = box.min.z < env.borders.zMin ? box.min.z : env.borders.zMin;

			/* nice borders */
			if ( true === env.boundingBox.nice ) {

				var steps = 2;
				var xRange = UTILS.nice().loose( true ).search( env.boundingBox.xMin, env.boundingBox.xMax, steps ).toArray();

				var yRange = UTILS.nice().loose( true ).search( env.boundingBox.yMin, env.boundingBox.yMax, steps ).toArray();

				var zRange = UTILS.nice().loose( true ).search( env.boundingBox.zMin, env.boundingBox.zMax, steps ).toArray();


				env.boundingBox.xMin = parseFloat( xRange[0] );
				env.boundingBox.xMax = parseFloat( xRange[xRange.length - 1] );
				env.boundingBox.yMin = parseFloat( yRange[0] );
				env.boundingBox.yMax = parseFloat( yRange[yRange.length - 1] );
				env.boundingBox.zMin = parseFloat( zRange[0] );
				env.boundingBox.zMax = parseFloat( zRange[zRange.length - 1] );

			}


		};


		return Plot;

	} );
