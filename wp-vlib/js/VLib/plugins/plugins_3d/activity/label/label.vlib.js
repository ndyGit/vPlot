define( ['require', './getConfig.vlib', './setConfig.vlib', 'config',
		'core/Animation.vlib', 'core/Utils.vlib',
		'jquery', './LabelController.vlib'],
	function ( require, getConfig, setConfig, Config, Animation, UTILS, $, LabelController ) {
		/**
		 @class Plugin Link
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {
			var name = 'label';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.ANIMATION );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/activity/label/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/activity/label/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.ACTIVITY, Config.PLUGINTYPE.ANIMATION],
				successors  : [Config.PLUGINTYPE.ACTIVITY, Config.PLUGINTYPE.ANIMATION]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */

			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */

			this.defaults = {
				position : 'mouse',
				animation : 'slide',
				useDataLabel: true,
				customText  : '',
				offset      : {
					x: 0,
					y: 0
				}
			};

			this.config;
			this.env;
			this.childs;
			this.bufferManager;
			this.labelController;
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.destroy = function () {

				if ( this.labelController ) {
					this.labelController.destroy();
					this.labelController.rendererActivity = null;
					this.labelController.removeLabel();
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

			this.handleConfig = function ( config, env ) {
				env.config = config || {};
				if ( !env.config.hasOwnProperty( 'offset' ) ) {
					env.config.offset = {
						x: this.defaults.offset.x,
						y: this.defaults.offset.y
					};
				}
				if ( !env.config.hasOwnProperty( 'position' ) ) {
					env.config.position = this.defaults.position;
				}
				if ( !env.config.hasOwnProperty( 'animation' ) ) {
					env.config.animation = this.defaults.animation;
				}
				if ( !env.config.hasOwnProperty( 'useDataLabel' ) ) {
					env.config.useDataLabel = this.defaults.useDataLabel;
				}
				if ( !env.config.hasOwnProperty( 'customText' ) ) {
					env.config.customText = this.defaults.customText;
				}

			};
			this.handleEnv = function ( env ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};


			this.labelCallback = function ( e ) {
				if ( this.labelController ) {
					this.labelController.setIntersectionArgs( e );
				}

				return Plugin.superClass.getAnimationChain( [this.labelController], e, this.env );
			};

			this.exec = function ( config, childs, bufferManager, communication ) {

				this.bufferManager = bufferManager;
				this.config = config;
				this.env = {};
				this.env.communication = communication;
				this.handleConfig( this.config, this.env );
				this.handleEnv( this.env );

				this.childs = childs;

				this.labelController = new LabelController( this.env, bufferManager );

				Plugin.superClass.handleChilds( this.childs, this.env );

				var subactivities = [];
				for ( var i = 0, il = this.env.animations.length; i < il; ++i ) {
					subactivities = subactivities.concat( this.env.animations[i].activities );
				}
				this.env.activities = this.env.activities.concat( subactivities );

				/* Response file of label */
				var result = {
					aType     : Config.ACTION.LABEL,
					context   : this,
					callback  : this.labelCallback,
					activities: this.env.activities
				};
				var labelResponse = {
					pId     : this.getId(),
					pType   : this.type,
					response: result
				};

				return labelResponse;
			};
			/** ********************************** */
			/** PRIVATE METHODS * */
			/** ********************************** */



		});

		UTILS.CLASS.extend( Plugin, Animation );
		return Plugin;
	} );
