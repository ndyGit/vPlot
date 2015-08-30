define( ['require', 'config', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'jquery', 'three', '../dataset/dataset.vlib'],
	function ( require, Config, AbstractPlugin, UTILS, $, THREE, Dataset ) {

		/**
		 * @return object dataset object.data == dataset object.color ==
		 *         collorCallback(data)
		 *
		 */
		/**
		 TODO<br />
		 @class Plugin Plane
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {
			var name = 'line';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.GEOMETRY );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/geometry/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/geometry/plane.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.DATA],
				successors  : []
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */

				// default color
			this.color = '000000';
			this.env;

			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */

			var customContainer = 'planeContainer';
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.getShortName = function () {

				if ( this.env && this.env.config && this.env.config.segmentsX ) {
					return 'Line ( ' + this.env.config.segmentsX + ' x 1 )';
				}
				return "Line";
			};
			this.defaults = {
				segmentsX: 2,
				xMin     : 0,
				xMax     : 10
			};
			/**
			 * Takes inserted configuration from the plugin-template and returns the
			 * parameters as JSON-config-file
			 *
			 * @param containerId
			 *            parent container where the plugin-template got added
			 *
			 * @return config file format: { data:VALUE}
			 */
			this.getConfigCallback = function ( containerId ) {
				var $container = $( '#' + containerId );
				var xSegments = $container.find( ' #segmentsX' ).val();

				var xMin = $container.find( ' #xMin' ).val();
				var xMax = $container.find( ' #xMax' ).val();

				xMin = parseFloat( xMin );
				xMax = parseFloat( xMax );
				xSegments = parseInt( xSegments );

				if( isNaN( xMin )){
					xMin = this.defaults.xMin;
					alert("xMin is not a number");
				}
				if( isNaN( xMax )){
					xMax = this.defaults.xMax;
					alert("xMax is not a number");
				}
				if( isNaN( xSegments )){
					xSegments = this.defaults.segmentsX;
					alert("xSegments is not a number");
				}
				return {
					segmentsX: xSegments,
					xMin     : xMin,
					xMax     : xMax
				};
			};
			/**
			 * Takes arguments from config and inserts them to the plugin-template
			 *
			 * @param config
			 *            plugin config file
			 * @param containerId
			 *            parent container where the plugin-template got added
			 */
			this.setConfigCallback = function ( config, containerId ) {
				if ( config === "" || config === undefined ) {
					config = {
						segmentsX: this.defaults.segmentsX,
						xMin     : this.defaults.xMin,
						xMax     : this.defaults.xMax
					};
				}

				if ( config.segmentsX !== undefined ) {
					$( '#' + containerId + ' #segmentsX' ).val( config.segmentsX );
				}

				if ( config.xMin !== undefined ) {
					$( '#' + containerId + ' #xMin' ).val( config.xMin );
				}

				if ( config.xMax !== undefined ) {
					$( '#' + containerId + ' #xMax' ).val( config.xMax );
				}

			};
			this.handleConfig = function( config ){
				"use strict";

				if (  config === undefined ) {

					config = {};
					config.xMin = this.defaults.xMin;
					config.xMax = this.defaults.xMax;
					config.segmentsX = this.defaults.segmentsX;

				}
				if(!config.hasOwnProperty('xMin')){

					config.xMin = this.defaults.xMin;
				}
				if(!config.hasOwnProperty('xMax')){
					config.xMax = this.defaults.xMax;
				}
				if(!config.hasOwnProperty('segmentsX')){
					config.segmentsX = this.defaults.segmentsX;
				}
				return config;
			};

			this.exec = function ( config, childs, bufferManager, communication ) {
				//console.log(this.id+"[ line ] \t\t EXEC" + JSON.stringify(config));
				var com = communication.messageController;

				this.env = {};
				this.config = this.handleConfig( config );

				this.env.config = this.config;


				var segmentsX, x_MIN, x_MAX;


				segmentsX = isNaN( parseInt( this.config.segmentsX ) ) ? this.defaults.segmentsX : parseInt( this.config.segmentsX );
				x_MIN = isNaN( parseFloat( this.config.xMin ) ) ? this.defaults.xMin : parseFloat( this.config.xMin );
				x_MAX = isNaN( parseFloat( this.config.xMax ) ) ? this.defaults.xMax : parseFloat( this.config.xMax );

				var msg = com.addMsg( 'info', 'Create Line geometry' );
				var data = [];
				var xRange = x_MAX - x_MIN;
				var u, v;
				for ( var i = 0; i < segmentsX + 1; i++ ) {
					u = i / segmentsX;
					data.push( {
						x   : xRange * u + x_MIN,
						y   : 0,
						z   : 0,
						size: 1
					} );
				}

				com.removeMsg( msg );
				var borders = {
					xMax: x_MAX,
					yMax: 1,
					zMax: 1,
					xMin: x_MIN,
					yMin: 0,
					zMin: 0
				};
				/*
				 var dataset = new Dataset();
				 var datasetConfig = {
				 data: data
				 };
				 dataset.setId( this.id );
				 var datasetResponseObject = dataset.exec( datasetConfig, childs, bufferManager );
				 */
				var callback, context, id = this.id;
				return {
					pId     : this.id,
					pType   : this.type,
					response: {
						onDone     : function ( cb, ctx ) {
							"use strict";
							callback = cb;
							context = ctx;
						},
						start      : function () {
							"use strict";
							if(!callback || !context){
								console.warn('[ Line-geometry ] onDone( callback, context ) NOT set!');
								return;
							}
							callback.call( context, { id : id} );
						},
						getData    : function () {
							"use strict";
							return data
						},
						getHeatmaps: function () {
							"use strict";
							return [];
						},
						getColors  : function () {
							"use strict";
							return [];
						}
					}
				};
			};
			/** ********************************** */
			/** PRIVATE METHODS * */
			/** ********************************** */

		} );
		UTILS.CLASS.extend( Plugin, AbstractPlugin );
		return Plugin;

	} )
;
