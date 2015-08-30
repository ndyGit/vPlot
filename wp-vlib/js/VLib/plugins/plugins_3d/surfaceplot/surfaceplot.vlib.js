define(
	['require', 'config', './setConfig.vlib', './getConfig.vlib', 'core/F3DGeometryPlot.vlib', 'core/Utils.vlib',
		'core/WorkerFactory_2.vlib', 'core/Framework3D.vlib',
		'plugins/plugins_3d/materials/wireframe/wireframeMaterial.vlib', 'core/THREEBufferGeometryPlot.vlib'],
	function ( require, Config, setConfig, getConfig, THREEGeometryPlot, UTILS, WorkerFactory, F3D, DefaultMaterial, THREEBufferGeometryPlot ) {
		/**
		 TODO<br />
		 @class Plugin SurfacePlot
		 @constructor
		 @extends THREEGeometryPlot
		 **/
		var Plugin = (function ( state ) {
			var name = 'surfaceplot';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.PLOT );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/surfaceplot/templates.js' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/surfaceplot/icon.png' );
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
				name: this.getName()
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

				console.info( "[ Surface ] Remove activities." );

				Plugin.superClass.destroyActivities( this.activities );
				this.activities = undefined;

				if ( this.env.scene ) {
					console.info( "[ Surface ] Remove self from scene." );
					this.env.scene.remove( this.interactiveObject );
				}

				console.info( "[ Surface ] Clear buffer." );
				Plugin.superClass.freeMemory( this.bufferManager, this.env );
				console.info( "[ Surface ] Self dispose." );
				if ( this.interactiveObject ) {
					for ( var i = 0, il = this.interactiveObject.children.length; i < il; ++i ) {
						//this.interactiveObject.children[i].geometry.dispose();
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
					UTILS.ACTIVITY.MOUSE.handleActivities( system, env );
					env.scene.add( system );
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
			};
			this.createCustomPlot = function (  bufferManager, env ) {
				var buffer = bufferManager.getBuffer( env.id );
				var coords = Plugin.superClass.getCoords( bufferManager, env );
				var colors = Plugin.superClass.getColors( bufferManager, env );

				var geometry = Plugin.superClass.getPlaneGeometry( coords, colors );

				if ( !geometry ) return false;


				if ( env.materials.length === 0 ) {
					var defaultMat = new DefaultMaterial();
					env.materials.push( defaultMat.exec().response );
				}

				/* attach activities to materials */
				var mesh;
				var group = new THREE.Object3D();
				for ( var i = 0, il = env.materials.length; i < il; ++i ) {
					mesh = new F3D.Mesh( geometry, env.materials[i].material );
					group.add( mesh );
				}

				Plugin.superClass.setSystem( group, bufferManager, env );

				Plugin.superClass.registerCustomPostprocess( env, function ( system ) {

					var geometry;

					for ( var i = 0, il = group.children.length; i < il; ++i ) {
						child = group.children[i];
						geometry = child.geometry;
						geometry.computeBoundingSphere();
						geometry.computeBoundingBox();
					}

				} );

				return group;

			};
		});
		UTILS.CLASS.extend( Plugin, THREEGeometryPlot );
		return Plugin;

	} );
