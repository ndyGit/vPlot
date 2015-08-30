define( ['require', './getConfig.vlib', './setConfig.vlib', 'config', 'core/Data.vlib', 'core/Utils.vlib', 'jquery'],
	function ( require, getConfig, setConfig, Config, Data, UTILS, $ ) {

		/**
		 * @return object dataset object.data == dataset object.color ==
		 *         collorCallback(data)
		 *
		 */
		/**
		 TODO<br />
		 @class Plugin File
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {
			var name = 'file';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.DATA );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/file/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/file/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.PLOT],
				successors  : [Config.PLUGINTYPE.COLOR, Config.PLUGINTYPE.FUNCTION]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.defaults = {
				path      : '',
				mapping   : "x-y-z",
				format    : UTILS.FileReader.FORMAT.TSV,
				format_row: '',
				format_col: ''
			};
			this.defaultFile = 'default.dat';
			this.color = '000000';
			this.heatmap = undefined;
			this.config;
			this.env;

			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var buffer = false;

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
			 * @return config file format: { path:VALUE,data:VALUE}
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

			this.handleEnv = function ( env ) {
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
				env.sprite = '';
			};

			this.handleConfig = function ( config, env ) {
				env.config = config || {};
				if ( config.path === undefined ) {
					config.path = this.defaults.path;
				}
				if ( config.mapping === undefined ) {
					config.mapping = this.defaults.mapping;
				}
				if ( config.format === undefined ) {
					config.format = this.defaults.format;
				}
				if ( config.format_row === undefined ) {
					config.format_row = this.defaults.format_row;
				}
				if ( config.format_col === undefined ) {
					config.format_col = this.defaults.format_row;
				}
			};
			this.exec = function ( config, childs, bufferManager, communication ) {

				this.env = {};
				this.handleEnv( this.env );
				this.handleConfig( config, this.env );
				this.env.communication = communication;
				Plugin.superClass.preProcess(  childs, bufferManager, this.env );


				if ( !this.reader ) {
					this.reader = new UTILS.FileReader.TSVReader( this.env.config.path, this.env.config.mapping );
				}

				var context = this;
				return {
					pId     : this.env.id,
					pType   : this.type,
					response: {
						onDone     : function ( cb, ctx ) {
							"use strict";
							Plugin.superClass.onDone( cb, ctx, context.env );
						},
						start      : function () {
							"use strict";
							Plugin.superClass.preProcess( childs, bufferManager, context.env );
						},
						getData    : function () {
							"use strict";
							return Plugin.superClass.getRawData( bufferManager, context.env );
						},
						getHeatmaps: function () {
							"use strict";
							return context.env.raw_heatmap;
						},
						getColors  : function () {
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
