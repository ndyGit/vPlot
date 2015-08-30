define( ['require', './getConfig.vlib', './setConfig.vlib', 'config', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'jquery'],
	function ( require, getConfig, setConfig, Config, AbstractPlugin, UTILS, $ ) {
		/**
		 TODO<br />
		 @class Plugin BasicMaterial
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {
			var name = 'mouse';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.ACTIVITY );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/mouse/templates.js' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/mouse/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.PLOT, Config.PLUGINTYPE.AXES, Config.PLUGINTYPE.ANIMATION],
				successors  : [Config.PLUGINTYPE.ANIMATION]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			isActive = false;
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.env;
			this.childs;
			this.bufferManager;
			this.activity;
			this.defaultActivity = UTILS.ACTIVITY.MOUSE.EVENT.CLICK;
			this.defaultLockFinish = false;
			this.defaultLockActive = false;
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.destroy = function () {
				if ( this.activity ) {
					this.activity.destroy();
				}
				this.env = undefined;
				this.childs = undefined;
			};
			/**
			 * Returns a minimal description of this plugin.
			 * This method is used by the sceneGraph module.
			 * @returns {string}
			 *
			 */
			this.getShortName = function () {
				"use strict";
				if ( this.env && this.env.config && this.env.config.activity ) {
					var shortName = this.env.config.activity.toUpperCase();
					shortName = this.env.config.lockActive ? shortName+'<br /><span class="glyphicon glyphicon-lock" >' : shortName;
					return shortName;
				}
				return "Mouse";
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
				if ( !env.config.hasOwnProperty( 'activity' ) )
					env.config.activity = this.defaultActivity;
				if ( !env.config.hasOwnProperty( 'lockActive' ) )
					env.config.lockActive = this.defaultLockActive;
			};
			this.handleEnv = function ( env ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};

			this.getActivity = function ( object ) {

				var container = this.env.config.container;
				var Activity = undefined;
				switch ( this.env.config.activity ) {
					case UTILS.ACTIVITY.MOUSE.EVENT.CLICK:
						Activity = UTILS.ACTIVITY.MOUSE.Click;
						break;
					case UTILS.ACTIVITY.MOUSE.EVENT.DBLCLICK:
						Activity = UTILS.ACTIVITY.MOUSE.DBLClick;
						break;
					case UTILS.ACTIVITY.MOUSE.EVENT.OVER:
						Activity = UTILS.ACTIVITY.MOUSE.Over;
						break;
					case UTILS.ACTIVITY.MOUSE.EVENT.OUT:
						Activity = UTILS.ACTIVITY.MOUSE.Out;
						break;
					default :
						Activity = UTILS.ACTIVITY.MOUSE.Click;
						console.warn( "[ Mouse.getActivity() ] Activity type not set. Use default" );
						break;
				}


				var activityHandle = new UTILS.ACTIVITY.MouseActivityHandler( this.env.animations, this.env );
				Plugin.superClass.createBackup( object );

				this.activity = new Activity( container, object, activityHandle );

				return this.activity;
			};
			this.exec = function ( config, childs, bufferManager ) {


				this.env = {};
				this.childs = childs;
				this.handleConfig( config, this.env );
				this.handleEnv( this.env );

				Plugin.superClass.handleChilds( childs, this.env );
				this.bufferManager = bufferManager;
				var subActivities = [];
				for ( var i = 0, len = this.env.animations.length; i < len; ++i ) {
					subActivities = subActivities.concat( this.env.animations[i].activities );
				}
				// console.log("mouse "+this.env.config.activity);
				// console.dir(subActivities);
				var result = {
					aType        : this.env.config.activity,
					context      : this,
					callback     : this.getActivity,
					subActivities: subActivities
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
