define(
	['require', './getConfig.vlib', './setConfig.vlib', 'config', 'core/F3DGeometryPlot.vlib', 'core/Utils.vlib', 'core/WorkerFactory_2.vlib', 'core/Framework3D.vlib'],
	function ( require, getConfig, setConfig, Config, THREEGeometryPlot, UTILS, WorkerFactory, F3D ) {
		/**
		 TODO<br />
		 @class Plugin LinePlot
		 @constructor
		 @extends BufferedGeometry
		 **/
		var Plugin = (function ( state ) {
			var name = 'lineplot';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.PLOT );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/lineplot/templates.js' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/lineplot/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.CONTEXT_3D],
				successors  : [Config.PLUGINTYPE.DATA,
					Config.PLUGINTYPE.AXES,
					Config.PLUGINTYPE.ACTIVITY,
					Config.PLUGINTYPE.STATE]
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
			var ambientDefault = '#ff0000';


			if ( state !== undefined ) {
				/* DeepCopy data*/
			}
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.defaults = {
				name: this.getName()
			};

			this.env;
			this.interactiveObject;
			this.childs;
			this.bufferManager;
			this.activities = [];
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.destroy = function () {
				console.info( "[ Line ] Remove activities. " + this.activities.length );
				for ( var i = 0, il = this.activities.length; i < il; ++i ) {
					this.activities[i].destroy();
				}
				if ( this.env.scene ) {
					console.info( "[ Line ] Remove self from scene." );
					this.env.scene.remove( this.interactiveObject );
				}
				console.info( "[ Line ] Clear buffer." );
				Plugin.superClass.freeMemory( this.bufferManager, this.env );

				console.info( "[ Line ] Self dispose." );
				if ( this.interactiveObject ) {
					this.interactiveObject.geometry.dispose();
					this.interactiveObject.material.dispose();
					this.interactiveObject = null;
				}



			};
			this.run = function ( scene, camera ) {
				this.env.scene = scene;
				this.env.camera = camera;

				Plugin.superClass.preProcess( this.preProcessDone, this.childs, this.bufferManager, this.env );

			};
			this.preProcessDone = function (  bufferManager, env ) {
				var system = env.context.createCustomPlot( bufferManager, env );

				if ( system ) {
					Plugin.superClass.setSystem( system, bufferManager, env );
					env.context.interactiveObject = system;
					this.activities = UTILS.ACTIVITY.MOUSE.handleActivities( system, env );
					env.scene.add( system );
				}
				Plugin.superClass.postProcess( bufferManager, env );

			};
			Plugin.prototype.exec = function ( config, childs, bufferManager, communication ) {


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
						run     : this.run,
						context : this,
						onDone : Plugin.superClass.onDone,
						onPostprocess : function( callback, context, plotContext ){
							"use strict";
							Plugin.superClass.handlePostActivities( bufferManager, plotContext.env, callback, context )
						}
					}
				};
			};

			this.deepCopy = function () {
				var privates = {
					/* DeepCopy data */
				};
				return new Plugin( privates );
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

			/** ********************************** */
			/** PRIVATE METHODS * */
			/** ********************************** */

			/** ********************************** */
			/** CUSTOM                 * */
			/** ********************************** */


			this.handleConfig = function ( config, env ) {
				env.config = config || {};
				if ( env.config.name === undefined ) {
					env.config.name = this.defaults.name;
				}
				if ( !env.config.hasOwnProperty( 'lineType' ) )
					env.config.lineType = 'solid';
				if ( !env.config.hasOwnProperty( 'lineWidth' ) )
					env.config.lineWidth = 3;
			};

			this.createCustomPlot = function ( bufferManager, env ) {
				var buffer = bufferManager.getBuffer( env.id );
				var coords = Plugin.superClass.getCoords( bufferManager, env );
				var colors = Plugin.superClass.getColors( bufferManager, env );
				var geometry = Plugin.superClass.getGeometry( coords, colors );

				if ( !geometry ) return false;
				/* Create  line object */
				var line_properties = {
					color       : 0xffffff,
					transparent : true,
					opacity     : env.config.opacity,
					linewidth   : env.config.lineWidth,
					vertexColors: THREE.VertexColors
				};

				var line = F3D.createLine( geometry, env.config.lineType, line_properties );
				UTILS.ACTIVITY.MOUSE.setLineThreshold( env.config.container, line, env.config.lineWidth / 2 );

				Plugin.superClass.registerCustomPostprocess( env, function ( line ) {
					var geometry = line.geometry;
					geometry.computeLineDistances();
					/* Needed by Dotted or Dashed line mat  */
					geometry.computeBoundingSphere();
					/* Needed by ray intersection */
					/* Needed by Activities */
					geometry.lineDistancesNeedUpdate = true;
					geometry.dynamic = true;
					geometry.verticesNeedUpdate = true;
					geometry.colorsNeedUpdate = true;


				} );

				return line;
			};

		});
		UTILS.CLASS.extend( Plugin, THREEGeometryPlot );
		return Plugin;

	} );
