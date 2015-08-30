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
			var name = 'plane';
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

				if ( this.env && this.env.config && this.env.config.segmentsX && this.env.config.segmentsY ) {
					return 'Plane ( '+this.env.config.segmentsX+' x '+this.env.config.segmentsY+' )';
				}
				return "Plane";
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
				var $container = $('#'+containerId);
				var xSegments = $container.find(' #segmentsX' ).val();
				var ySegments = $container.find( '#segmentsY' ).val();

				var xMin = $container.find( '#xMin' ).val();
				var yMin = $container.find( '#yMin' ).val();
				var zMin = $container.find( '#zMin' ).val();

				var xMax = $container.find( '#xMax' ).val();
				var yMax = $container.find( '#yMax' ).val();
				var zMax = $container.find( '#zMax' ).val();
				return {
					segmentsX: xSegments,
					segmentsY: ySegments,
					xMin     : xMin,
					yMin     : yMin,
					zMin     : zMin,
					xMax     : xMax,
					yMax     : yMax,
					zMax     : zMax
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
						segmentsX: 20,
						segmentsY: 20,
						xMin     : 0,
						yMin     : 0,
						zMin     : 0,
						xMax     : 10,
						yMax     : 10,
						zMax     : 10
					};
				}
				if ( config.segmentsX !== undefined ) {
					$( '#' + containerId + ' #segmentsX' ).val( config.segmentsX );
				}
				if ( config.segmentsY !== undefined ) {
					$( '#' + containerId + ' #segmentsY' ).val( config.segmentsY );
				}
				if ( config.xMin !== undefined ) {
					$( '#' + containerId + ' #xMin' ).val( config.xMin );
				}
				if ( config.yMin !== undefined ) {
					$( '#' + containerId + ' #yMin' ).val( config.yMin );
				}
				if ( config.zMin !== undefined ) {
					$( '#' + containerId + ' #zMin' ).val( config.zMin );
				}
				if ( config.xMax !== undefined ) {
					$( '#' + containerId + ' #xMax' ).val( config.xMax );
				}
				if ( config.yMax !== undefined ) {
					$( '#' + containerId + ' #yMax' ).val( config.yMax );
				}
				if ( config.zMax !== undefined ) {
					$( '#' + containerId + ' #zMax' ).val( config.zMax );
				}
			};
			var initialized = false;
			this.exec = function ( config, childs, bufferManager, communication ) {
				//console.log(this.id+"[ plane ] \t\t EXEC" + JSON.stringify(config));
				var noopCommunication = {
					messageController : {
						addMsg : function(){},
						updateMsg : function(){},
						removeMsg : function(){}
					}
				};

				this.env = {};
				this.env.config = config;
				this.env.communication = noopCommunication;

				var segments = 20, segmentsX = 20, segmentsY = 20,
					x_MIN = 0, x_MAX = 10,
					y_MIN = 0, y_MAX = 10,
					z_MIN = 0, z_MAX = 10;

				if ( config !== "" && config !== undefined ) {

					if ( config.segmentsX !== undefined ) {
						segmentsX = isNaN( parseInt( config.segmentsX ) ) ? segments : parseInt( config.segmentsX );
					}
					if ( config.segmentsY !== undefined ) {
						segmentsY = isNaN( parseInt( config.segmentsY ) ) ? segments : parseInt( config.segmentsY );
					}
					if ( config.xMin !== undefined ) {
						x_MIN = isNaN( parseFloat( config.xMin ) ) ? x_MIN : parseFloat( config.xMin );
					}
					if ( config.yMin !== undefined ) {
						y_MIN = isNaN( parseFloat( config.yMin ) ) ? y_MIN : parseFloat( config.yMin );
					}
					if ( config.zMin !== undefined ) {
						z_MIN = isNaN( parseFloat( config.zMin ) ) ? z_MIN : parseFloat( config.zMin );
					}
					if ( config.xMax !== undefined ) {
						x_MAX = isNaN( parseFloat( config.xMax ) ) ? x_MAX : parseFloat( config.xMax );
					}
					if ( config.yMax !== undefined ) {
						y_MAX = isNaN( parseFloat( config.yMax ) ) ? y_MAX : parseFloat( config.yMax );
					}
					if ( config.xMax !== undefined ) {
						z_MAX = isNaN( parseFloat( config.zMax ) ) ? z_MAX : parseFloat( config.zMax );
					}
				}

				var com = communication.messageController;
				var msg = com.addMsg('info','Create Plane geometry');
				var data = [];
				var xRange = x_MAX - x_MIN;
				var yRange = y_MAX - y_MIN;
				var zRange = z_MAX - z_MIN;

				var u, v;
				var process = function () {
					for ( var i = 0; i < segmentsX + 1; i++ ) {
						v = i / segmentsX;
						for ( var j = 0; j < segmentsY + 1; j++ ) {
							u = j / segmentsY;
							data.push( {
								x: xRange * v + x_MIN,
								y: yRange * u + y_MIN,
								z: 0,
								size : 1
							} );
						}

					}

				};
				process();
				com.removeMsg( msg );


				var borders = {
					xMax: x_MAX,
					yMax: y_MAX,
					zMax: z_MAX,
					xMin: x_MIN,
					yMin: y_MIN,
					zMin: z_MIN
				};

				/*
				var datasetConfig = {
					data: data
				};


				var dataset = new Dataset();
				dataset.setId( this.id );
				var datasetResponse = dataset.exec( datasetConfig, childs, bufferManager, this.env.communication ).response;
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

		});
		UTILS.CLASS.extend( Plugin, AbstractPlugin );
		return Plugin;

	} );
