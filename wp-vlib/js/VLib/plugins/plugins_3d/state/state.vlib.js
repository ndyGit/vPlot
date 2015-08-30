define( ['require', './getConfig.vlib', './setConfig.vlib', 'config', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'jquery'],
	function ( require, getConfig, setConfig, Config, AbstractPlugin, UTILS, $ ) {
		/**
		 TODO<br />
		 @class Plugin BasicMaterial
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {
			var name = 'state';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.STATE );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/state/templates.js' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/state/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.PLOT],
				successors  : [Config.PLUGINTYPE.ANIMATION]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */

			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.env;
			this.childs;
			this.bufferManager;
			this.activity;
			this.defaultState = Config.STATE.PRE;

			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.destroy = function () {
				this.env = undefined;
				if ( this.activity )
					this.activity.destroy();
			};
			/**
			 * Returns a minimal description of this plugin.
			 * This method is used by the sceneGraph module.
			 * @returns {string}
			 *
			 */
			this.getShortName = function () {
				"use strict";
				if(this.env && this.env.config && this.env.config.state){
					return this.env.config.state.toUpperCase();
				}
				return "State";
			};
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
			/**
			 * Takes arguments from config and inserts them to the plugin-template
			 *
			 * @param config
			 *            plugin config file
			 * @param containerId
			 *            parent container where the plugin-template got added
			 */
			this.setConfigCallback = setConfig;
			this.handleConfig = function ( config, env ) {
				env.config = config || {};
				if ( !env.config.hasOwnProperty( 'state' ) )
					env.config.state = this.defaultState;

			};
			this.handleEnv = function ( env ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};

			this.runActivity = function ( system, done, env ) {

				if(!system || !env || !this.env){
					return false;
				}
				var container = this.env.config.container;
				var animationHandle = new UTILS.ACTIVITY.AnimationHandler( this.env.animations, done, env );
				var pseudoIntersection = {
					index : null,
					face  : -1,
					object: null
				};
				var e = {
					intersection: JSON.parse( JSON.stringify( pseudoIntersection ) )
				};
				e.intersection.object = system;
				animationHandle.exec( e );

			};
			this.exec = function ( config, childs, bufferManager ) {

				this.env = {};
				this.childs = childs;
				this.handleConfig( config, this.env );
				this.handleEnv( this.env );

				Plugin.superClass.handleChilds( childs, this.env );
				this.bufferManager = bufferManager;


				var result = {
					aType     : this.env.config.state,
					context   : this,
					callback  : this.runActivity,
					animations: this.env.animations
				};
				return {
					pId     : this.getId(),
					pType   : this.type,
					response: result
				};
			}

		});
		UTILS.CLASS.extend( Plugin, AbstractPlugin );
		return Plugin;
	} );
