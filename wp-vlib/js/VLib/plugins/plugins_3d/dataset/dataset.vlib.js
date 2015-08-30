define( ['require', './getConfig.vlib', './setConfig.vlib', 'config', 'core/Data.vlib', 'core/Utils.vlib', 'jquery'],
	function ( require, getConfig, setConfig, Config, Data, UTILS, $ ) {


		/**
		 @class Plugin Dataset
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {

			var name = 'dataset';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.DATA );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/dataset/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/dataset/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.PLOT],
				successors  : [Config.PLUGINTYPE.COLOR, Config.PLUGINTYPE.FUNCTION, Config.PLUGINTYPE.GEOMETRY]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */


			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */

			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */

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
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
				env.sprite = '';
			};
			this.handleConfig = function ( config, env ) {
				env.config = config || {};
			};
			this.exec = function ( config, childs, bufferManager,communication ) {
				//console.log("[ dataset ] \t\t EXEC");

				this.env = {};
				this.handleEnv( this.env );
				this.handleConfig( config, this.env );
				this.env.communication = communication;
				var context = this;



				return {
					pId     : this.env.id,
					pType   : this.type,
					response: {
						onDone : function ( cb, ctx ) {
							"use strict";
							Plugin.superClass.onDone( cb, ctx, context.env );
						},
						start : function(){
							"use strict";
							Plugin.superClass.preProcess( childs, bufferManager, context.env  );
						},
						getData : function(){
							"use strict";
							return Plugin.superClass.getRawData( bufferManager, context.env );
						},
						getHeatmaps : function(){
							"use strict";
							return context.env.raw_heatmap;
						},
						getColors : function(){
							"use strict";
							return context.env.raw_color;
						}
					}
				};

			};

			/** ********************************** */
			/** PRIVATE METHODS * */
			/** ********************************** */


		});
		UTILS.CLASS.extend( Plugin, Data );
		return Plugin;

	} );
