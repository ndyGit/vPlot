define( ['require', 'config', './setConfig.vlib', './getConfig.vlib', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'three', 'jquery', 'threeShaderLib'],
	function ( require, Config, setConfig, getConfig, AbstractPlugin, UTILS, THREE, $ ) {
		/**
		 TODO<br />
		 @class Plugin BasicMaterial
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {
			var name = 'cubemapMaterial';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.MATERIAL );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/materials/cubemap/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/materials/cubemap/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.PLOT],
				successors  : [Config.PLUGINTYPE.COLOR, Config.PLUGINTYPE.ACTIVITY]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */


			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.interactiveObject;
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			/**
			 * Takes inserted configuration from the plugin-template and returns the
			 * parameters as JSON-config-file
			 *
			 * @param containerId
			 *            parent container where the plugin-template got added
			 *
			 * @return config file format: {camera:{x:VALUE,y:VALUE,z:VALUE}}
			 */
			this.getConfigCallback = getConfig;

			this.handleColor = function () {
				"use strict";
				if ( this.env.raw_color !== undefined ) {
					this.interactiveObject.color = new THREE.Color( "#" + this.env.raw_color );
				} else {
					this.interactiveObject.vertexColors = THREE.VertexColors;
				}
			};

			/**
			 * Takes arguments from config and inserts them to the plugin-template
			 *
			 * @param config
			 *            plugin config file
			 * @param containerId
			 *            parent container where the plugin-template got added
			 */
			this.setConfigCallback = setConfig;

			this.defaults = {
				reflectivity: 0.3,
				opacity     : 0.9,
				transparent : true,
				envmap : 'SkyBox'
			};

			this.handleConfig = function ( config, env ) {
				env.config = config || {};
				if ( env.config.opacity === undefined ) {
					env.config.opacity = this.defaults.opacity;
				}
				if ( env.config.transparent === undefined ) {
					env.config.transparent = this.defaults.transparent;
				}
				if ( env.config.reflectivity === undefined ) {
					env.config.reflectivity = this.defaults.reflectivity;
				}
				if ( !config.hasOwnProperty( 'envmap' ) ) {
					config.envmap = this.defaults.envmap;
				}

			};
			this.handleEnv = function ( env ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};
			this.exec = function ( config, childs, bufferManager ) {

				this.env = {};
				this.childs = childs || [];
				this.handleConfig( config, this.env );
				this.handleEnv( this.env );

				Plugin.superClass.handleChilds( this.childs, this.env );

				//this.interactiveObject = new THREE.MeshLambertMaterial( {  envMap: reflectionCube, combine: THREE.MixOperation, reflectivity: 0.3,side : THREE.DoubleSide } );
				//this.interactiveObject = new THREE.MeshLambertMaterial( {  envMap: refractionCube, refractionRatio: 0.95,side : THREE.DoubleSide } );

				var path = Config.getDataPath() + '/textures/cube/'+this.env.config.envmap+'/';
				var format = '.jpg';
				var urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];
				var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
				reflectionCube.format = THREE.RGBFormat;

				this.interactiveObject = new THREE.MeshPhongMaterial( {
					envMap      : reflectionCube,
					vertexColors: THREE.VertexColors,
					side        : THREE.DoubleSide,
					transparent : this.env.config.transparent,
					combine     : THREE.MixOperation,
					opacity     : this.env.config.opacity,
					reflectivity: this.env.config.reflectivity,
					shading     : THREE.FlatShading
				} );
				this.handleColor();

				return {
					pId     : this.getId(),
					pType   : this.type,
					response: {
						type      : 'basicMaterial',
						material  : this.interactiveObject,
						activities: this.env.activities
					}
				};

			}

		});
		UTILS.CLASS.extend( Plugin, AbstractPlugin );
		return Plugin;
	} );
