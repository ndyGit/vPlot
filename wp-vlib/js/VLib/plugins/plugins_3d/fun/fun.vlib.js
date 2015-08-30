define( ['require', 'config', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'jquery', 'libs/parser'],
	function ( require, Config, AbstractPlugin, UTILS, $ ) {
		/**
		 TODO<br />
		 @class Plugin Function
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {
			var name = 'function';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.FUNCTION );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/fun/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/fun/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.DATA],
				successors  : []
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */

			this.color = '000000';
			this.xFun = false;
			this.yFun = false;
			this.zFun = false;
			this.sizeFun = false;
			this.labelFun = false;
			this.tickFun = false;
			this.defaultLabel = "'Label ( <b>'+x+'</b>, <b>'+y+'</b>, <b>'+z+'</b> )'";
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
			 *         { path:VALUE,data:VALUE}
			 */
			this.getConfigCallback = function ( containerId ) {
				var $container = $( '#' + containerId );
				var xFun = $container.find( '#xFun' ).val();
				var yFun = $container.find( '#yFun' ).val();
				var zFun = $container.find( '#zFun' ).val();
				var sizeFun = $container.find( '#sizeFun' ).val();
				var labelFun = $container.find( '#labelFun' ).val();
				var tickFun = $container.find( '#tickFun' ).val();

				var result = {
					'xFun'    : xFun,
					'yFun'    : yFun,
					'zFun'    : zFun,
					'sizeFun' : sizeFun,
					'labelFun': labelFun,
					'tickFun' : tickFun
				};

				return result;
			};
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
			this.setConfigCallback = function ( config, containerId ) {
				var $container = $( '#' + containerId );
				if ( config === undefined || config === '' ) {
					config = {xFun: '', yFun: '', zFun: '', labelFun : this.defaultLabel};
				}
				if ( config.xFun === undefined ) {
					config.xFun = '';
				}
				if ( config.yFun === undefined ) {
					config.yFun = '';
				}
				if ( config.zFun === undefined ) {
					config.zFun = '';
				}
				if ( config.sizeFun === undefined ) {
					config.sizeFun = '';
				}
				if ( config.labelFun === undefined ) {
					config.labelFun = this.defaultLabel;
				}
				if ( config.tickFun === undefined ) {
					config.tickFun = '';
				}


				$container.find( '#xFun' ).val( config.xFun );
				$container.find( '#yFun' ).val( config.yFun );
				$container.find( '#zFun' ).val( config.zFun );
				$container.find( '#sizeFun' ).val( config.sizeFun );
				$container.find( '#labelFun' ).val( config.labelFun );
				$container.find( '#tickFun' ).val( config.tickFun );

				$container.find( '.nav-tabs a' ).click( function ( e ) {
					e.preventDefault();
					$( this ).tab( 'show' );
					var targetId = $( this ).attr( 'href' );
					$container.find( '.tab-pane' ).removeClass( 'active' );
					$container.find( targetId ).addClass( 'active' );
				} );
				$container.find('.collapse').collapse({
					toggle: false,
					parent : '#accordion'
				});
				$container.find('#accordion' ).find('.panel-title a').on('click',function(e){
					"use strict";

					$container.find('#accordion' ).find('.panel-collapse').collapse('hide');
					$(this).closest('.collapse-container' ).find('.panel-collapse').collapse('toggle');
				});
			};

			var execFunctions = function ( done, data ) {
				var len = data.length;
				var labelFun = this.labelFun;
				var tickFun = this.tickFun;
				var sizeFun = this.sizeFun;
				var zFun = this.zFun;
				var yFun = this.yFun;
				var xFun = this.xFun;

				var tmp_x, tmp_y, tmp_z, tick;
				UTILS.safeloop()
					.iterations( len )
					.done( function () {
						"use strict";
						done();
					} )
					.loop( function ( i ) {
						"use strict";
						try {
							tmp_x = data[i].x;
							tmp_y = data[i].y;
							tmp_z = data[i].z;

							if ( tickFun ) {
								data[i].tick = parseFloat( tickFun( tmp_x, tmp_y, tmp_z, i ) );
							}
							if ( sizeFun ) {
								data[i].size = parseFloat( sizeFun( tmp_x, tmp_y, tmp_z, data[i].tick, i ) );
							}

							if ( xFun ) {
								data[i].x = parseFloat( xFun( tmp_x, tmp_y, tmp_z, data[i].size, data[i].tick, i ) );
							}
							if ( yFun ) {
								data[i].y = parseFloat( yFun( tmp_x, tmp_y, tmp_z, data[i].size, data[i].tick, i ) );
							}
							if ( zFun ) {
								data[i].z = parseFloat( zFun( tmp_x, tmp_y, tmp_z, data[i].size, data[i].tick, i ) );
							}
							if ( labelFun ) {
								data[i].label = labelFun( data[i].x, data[i].y, data[i].z, data[i].size, data[i].tick, i ).toString();
							}


						} catch ( e ) {
							console.warn( '[ function.exec() ]' + e );
						}
					} );


			};

			/*Parser:
			 * https://github.com/silentmatt/js-expression-eval/tree/master
			 */
			this.exec = function ( config ) {
				//console.log("[ color ] \t\t EXEC");
				this.xFun = false;
				this.yFun = false;
				this.zFun = false;
				if ( config == null || config === undefined || config == '' )
					return;
				try {
					if ( config.tickFun !== undefined && config.tickFun !== '' ) {
						this.tickFun = Parser.parse( config.tickFun ).toJSFunction( ['x', 'y', 'z','index'] );
					}
					if ( config.sizeFun !== undefined && config.sizeFun !== '' ) {
						this.sizeFun = Parser.parse( config.sizeFun ).toJSFunction( ['x', 'y', 'z', 'tick','index'] );
					}

					if ( config.xFun !== undefined && config.xFun !== '' ) {
						this.xFun = Parser.parse( config.xFun ).toJSFunction( ['x', 'y', 'z', 'size', 'tick','index'] );
					}
					if ( config.yFun !== undefined && config.yFun !== '' ) {
						this.yFun = Parser.parse( config.yFun ).toJSFunction( ['x', 'y', 'z', 'size', 'tick','index'] );
					}
					if ( config.zFun !== undefined && config.zFun !== '' ) {
						this.zFun = Parser.parse( config.zFun ).toJSFunction( ['x', 'y', 'z', 'size', 'tick','index'] );
					}


					if ( config.labelFun !== undefined && config.labelFun !== '' ) {
						this.labelFun = Parser.parse( config.labelFun ).toJSFunction( ['x', 'y', 'z', 'size', 'tick','index'] );
					}
				} catch ( e ) {
					console.warn( '[ function.exec() ]' + e );
					//alert( e );

				}

				return {
					pId     : this.getId(),
					pType   : this.type,
					response: {
						callback: execFunctions,
						context : this
					}
				};
			}


		});
		UTILS.CLASS.extend( Plugin, AbstractPlugin );
		return Plugin;

	} );
