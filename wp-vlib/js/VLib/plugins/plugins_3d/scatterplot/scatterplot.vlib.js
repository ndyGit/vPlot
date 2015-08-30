define(
	['require',
		'./getConfig.vlib',
		'./setConfig.vlib',
		'config',
		'core/THREEBufferGeometryPlot.vlib',
		'core/Utils.vlib',
		'jquery',
		'three',
		'text!./fragment.shader',
		'text!./vertex.shader'],
	function ( require, getConfig, setConfig, Config, THREEBufferGeometryPlot, UTILS, $, THREE, FRAGMENTSHADER, VERTEXSHADER ) {
		'use strict';
		/**
		 @class Plugin ScatterPlot
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function ( state ) {
			var name = 'scatterplot';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.PLOT );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/scatterplot/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/scatterplot/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.CONTEXT_3D],
				successors  : [
					Config.PLUGINTYPE.DATA,
					Config.PLUGINTYPE.AXES,
					Config.PLUGINTYPE.ACTIVITY,
					Config.PLUGINTYPE.STATE
				]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			if ( state !== undefined ) {
				/* DeepCopy data*/
			}
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */


			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.defaults = {
				name           : this.getName(),
				type           : 'normal',
				size           : 10,
				opacity        : 1,
				blending       : false,
				colors         : true,
				transparent    : false,
				sizeAttenuation: false,
				xScale         : 400,
				yScale         : 400,
				zScale         : 400
			}
			this.env;
			this.scene;
			this.bufferManager;
			this.interactiveObject;

			this.updateSizeActivity;
			this.activities = [];
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.destroy = function () {
				console.info( "[ Scatter ] Remove activities." );
				this.activities = [];
				if ( this.updateSizeActivity )
					this.updateSizeActivity.destroy();

				if ( this.env.scene ) {
					console.info( "[ Scatter ] Remove self from scene." );
					this.env.scene.remove( this.interactiveObject );
				}
				console.info( "[ Scatter ] Clear buffer." );
				Plugin.superClass.freeMemory( this.bufferManager, this.env );
				console.info( "[ Scatter ] Self dispose." );
				if ( this.interactiveObject ) {
					this.interactiveObject.geometry.dispose();
					this.interactiveObject.material.dispose();
				}

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
				return "ScatterPlot";
			};
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
			this.childs;
			this.bufferManager;

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


			this.handleEnv = function ( env, config, bufferManager ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getShortName();
				env.icon = this.getIcon();
			};


			/** ********************************** */
			/** CUSTOM                         * */
			/** ********************************** */
			this.handleConfig = function ( config, env ) {
				env.config = config || {};
				if ( env.config.name === undefined ) {
					env.config.name = this.getName();
				}
				if ( env.config.material === undefined ) {
					env.config.material = {};
				}
				if ( env.config.material.type === undefined ) {
					env.config.material.type = this.defaults.type;
				}
				if ( env.config.material.particleSize === undefined ) {
					env.config.material.particleSize = this.defaults.size;
				}
				if ( env.config.material.opacity === undefined ) {
					env.config.material.opacity = this.defaults.opacity;
				}
				if ( env.config.material.colors === undefined ) {
					env.config.material.colors = this.defaults.colors;
				}
				if ( env.config.material.sizeAttenuation === undefined ) {
					env.config.material.sizeAttenuation = this.defaults.sizeAttenuation;
				}
				if ( env.config.material.transparent === undefined ) {
					env.config.material.transparent = this.defaults.transparent;
				}
				if ( env.config.scale === undefined ) {
					env.config.scale = {};
				}
				if ( env.config.scale.x === undefined ) {
					env.config.scale.x = this.defaults.xScale;
				}
				if ( env.config.scale.y === undefined ) {
					env.config.scale.y = this.defaults.yScale;
				}
				if ( env.config.scale.z === undefined ) {
					env.config.scale.z = this.defaults.zScale;
				}
			};

			this.createCustomPlot = function ( bufferManager, env ) {
				var coords = Plugin.superClass.getCoords( bufferManager, env );
				var colors = Plugin.superClass.getColors( bufferManager, env );
				if(!coords || !colors){
					return false;
				}
				var geometry = Plugin.superClass.getGeometry( coords, colors );


				/** *********************************** */
				/** handle config && plot * */
				var materialConfig = {};
				materialConfig.color = 0xffffff;
				materialConfig.vertexColors = env.config.material.colors;
				materialConfig.opacity = env.config.material.opacity;
				materialConfig.size = env.config.material.particleSize;
				materialConfig.transparent = env.config.material.transparent;
				materialConfig.sizeAttenuation = env.config.material.sizeAttenuation;
				materialConfig.depthWrite = true;
				materialConfig.depthTest = true;
				materialConfig.fog = false;
				materialConfig.alphaTest = 0.5;

				if ( env.config.material.blending !== undefined && env.config.material.blending === true ) {
					materialConfig.blending = THREE.AdditiveBlending;
				} else {
					materialConfig.blending = THREE.NormalBlending;
				}

				env.sprite = "";
				if ( env.config.material.image !== undefined && env.config.material.image.length > 0 ) {
					env.sprite = Config.getDataPath() + '/' + env.config.material.image;

					materialConfig.map = THREE.ImageUtils.loadTexture( env.sprite );
				}

				var material;
				if ( env.config.material.type === 'shader' ) {
					material = getShader( geometry, materialConfig, env, bufferManager );

				} else {
					material = new THREE.PointCloudMaterial( materialConfig );
				}

				if ( !geometry ) return false;
				var particleSystem = new THREE.PointCloud( geometry, material );


				particleSystem.needsUpdate = true;
				particleSystem.userData.size = materialConfig.size;

				var plotContainer = $('#'+env.config.container ).find(Config.PLOT_CONTAINER ).attr('id');
				UTILS.ACTIVITY.MOUSE.setPointThreshold( plotContainer, particleSystem, env.config.material.particleSize /2 );

				// USER INTERFACE LIVE SIZE UPDATE
				this.updateSizeActivity = new UTILS.ACTIVITY.RENDERER.Activity( $('#'+this.env.config.container).find( Config.PLOT_CONTAINER ), particleSystem, function () {
					var coords_size = this.interactiveObject.geometry.attributes.size.array;
					for ( var i = 0, len = coords_size.length; i < len; ++i ) {
						coords_size[i] = this.interactiveObject.userData.size;
						particleSystem.geometry.attributes.size.needsUpdate = true;
					}
				}, this );

				Plugin.superClass.setSystem( particleSystem, bufferManager, env );

				Plugin.superClass.registerCustomPostprocess( env, function ( system ) {
					var geometry = system.geometry;
					geometry.verticesNeedUpdate = true;
					geometry.colorsNeedUpdate = true;
					geometry.attributes.position.needsUpdate = true;
					//geometry.attributes.customColor.needsUpdate = true;
				} );
				return particleSystem;
			};

			var getShader = function ( geometry, materialConfig, env, bufferManager ) {
				var raw_data = env.raw_data;
				var raw_data_len = raw_data.length;
				var raw_data_size = [];
				var coords_size = geometry.attributes.size.array;
				var coords_opacity = geometry.attributes.opacity.array;

				// init point size array
				for( var i = 0; i < raw_data_len; ++i){
					if(raw_data[ i ].hasOwnProperty('size')){
						raw_data_size[ i ] = materialConfig.size * raw_data[ i ].size;
					}else{
						raw_data_size[ i ] = materialConfig.size;
					}

				}
				// copy size-array to shader-attribute
				for ( var v = 0, vl = coords_size.length; v < vl; ++v ) {
					if( v < raw_data_len ){
						coords_size[v] = raw_data_size[ v ];
					}else{
						coords_size[v] = materialConfig.size;
					}

				}
				for ( var v = 0, vl = coords_opacity.length; v < vl; ++v ) {
					coords_opacity[v] = materialConfig.opacity;
				}
				var texture = THREE.ImageUtils.loadTexture( env.sprite );

				var attributes = {
					opacity    : {type: 'f', value: null},
					size       : {type: 'f', value: null},
					customColor: {type: 'c', value: null}
				};

				var uniforms = {
					color  : {type: "c", value: new THREE.Color( 0xffffff )},
					texture: {type: "t", value: texture }
				};

				return new THREE.ShaderMaterial( {
					name          : 'shader',
					uniforms      : uniforms,
					attributes    : attributes,
					vertexShader  : VERTEXSHADER,
					fragmentShader: FRAGMENTSHADER,
					blending      : materialConfig.blending,
					depthTest     : true,
					depthWrite    : true,
					alphaTest     : 0.2,
					transparent   : materialConfig.transparent
				} );
			}

		});
		UTILS.CLASS.extend( Plugin, THREEBufferGeometryPlot );
		return Plugin;

	} );
