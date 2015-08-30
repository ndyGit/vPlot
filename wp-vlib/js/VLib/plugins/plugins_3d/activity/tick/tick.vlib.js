define( ['require', './getConfig.vlib', './setConfig.vlib', 'config', 'core/Animation.vlib', 'core/Utils.vlib', 'jquery', './TickController.vlib'],
	function ( require, getConfig, setConfig, Config, Animation, UTILS, $, TickController ) {
		/**
		 @class Plugin Link
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {
			var name = 'tick';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.ANIMATION );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/activity/tick/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/activity/tick/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.ACTIVITY, Config.PLUGINTYPE.ANIMATION],
				successors  : [Config.PLUGINTYPE.ACTIVITY, Config.PLUGINTYPE.ANIMATION]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var isActive = false;
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */



			this.env;
			this.childs;
			this.bufferManager;
			this.tickController;
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.destroy = function () {
				if ( this.activity ){
					this.activity.destroy();
				}
				if( this.tickController ){
					this.tickController.destroy();
				}
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

			this.defaults = {
				easing : 'None',
				duration : 2
			};

			this.handleConfig = function ( config, env ) {
				env.config = config || this.defaults;

				if(!env.config.hasOwnProperty('easing')){
					env.config.easing = this.defaults.easing;
				}

				if(!env.config.hasOwnProperty('duration')){
					env.config.duration = this.defaults.duration;
				}

			};

			this.handleEnv = function ( env ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};

			this.tick = function ( e ) {
				if ( this.tickController ) {
					this.tickController.setIntersectionArgs( e );
				}
				return Plugin.superClass.getAnimationChain( [ this.tickController ], e, this.env );
			};

			this.exec = function ( config, childs, bufferManager, communication ) {


				this.bufferManager = bufferManager;
				this.env = {};
				this.env.communication = communication;
				this.handleConfig( config, this.env );
				this.handleEnv( this.env );
				Plugin.superClass.handleChilds( childs, this.env );
				this.childs = childs;

				this.tickController = new TickController( config, this.env, bufferManager);

				var subactivities = [];
				for ( var i = 0, il = this.env.animations.length; i < il; ++i ) {
					subactivities = subactivities.concat( this.env.animations[i].activities );
				}
				this.env.activities = this.env.activities.concat( subactivities );


				var result = {
					aType     : Config.ACTION.TICK,
					context   : this,
					callback  : this.tick,
					activities: this.env.activities
				};
				return {
					pId     : this.getId(),
					pType   : this.type,
					response: result
				};
			};
			/** ********************************** */
			/** PRIVATE METHODS * */
			/** ********************************** */

		});

		UTILS.CLASS.extend( Plugin, Animation );
		return Plugin;
	} );
