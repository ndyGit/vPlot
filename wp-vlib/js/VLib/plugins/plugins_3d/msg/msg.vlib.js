define( ['require', './getConfig.vlib', './setConfig.vlib', 'config', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'jquery'],
	function ( require, getConfig, setConfig, Config, AbstractPlugin, UTILS, $ ) {
		/**
		 @class Plugin Link
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {
			var name = 'msg';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.STANDALONE );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/msg/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/msg/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.CONTEXT_3D],
				successors  : []
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var MessageController;

			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */

			this.env;
			this.childs;
			this.msgId;

			this.defaults = {
				type : 'info',
				msg : '',
				remove : false,
				time : 2
			};

			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.destroy = function () {
				if(MessageController){
					MessageController = false;
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
				if(!env.config.msg){
					env.config.msg = this.defaults.msg;
				}
				if(!env.config.type){
					env.config.type = this.defaults.type;
				}
				if(!env.config.time){
					env.config.time = this.defaults.time;
				}
				if(!env.config.remove){
					env.config.remove = this.defaults.remove;
				}

			};
			this.handleEnv = function ( env ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};



			this.exec = function ( config, childs, bufferManager, communication ) {

				var context = this;
				this.env = {};
				this.handleConfig( config, this.env );

				MessageController = communication.messageController;

				if( this.env.config.msg !== '' ){
					this.msgId = MessageController.addMsg( this.env.config.type, this.env.config.msg, true );
					if( this.env.config.remove ){
						var tId = setTimeout(function(){
							"use strict";
							MessageController.removeMsg( context.msgId );
							tId = false;
						}, this.env.config.time * 1000);
					}
				}


			};
			/** ********************************** */
			/** PRIVATE METHODS * */
			/** ********************************** */

		});

		UTILS.CLASS.extend( Plugin, AbstractPlugin );
		return Plugin;
	} );
