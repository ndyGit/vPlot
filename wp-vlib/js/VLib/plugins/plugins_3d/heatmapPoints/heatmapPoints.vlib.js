define(
	['require', 'config','jquery', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'libs/rainbow'],
	function ( require, Config, $, AbstractPlugin, UTILS ) {
		/**
		 TODO<br />
		 @class Plugin Heatmap
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function ( state ) {
			var name = 'heatmapPoints';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.COLOR );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/heatmapPoints/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/heatmapPoints/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.DATA],
				successors  : []
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var numberRangeFromDefault = 0;
			var numberRangeToDefault = 1;
			var spectrumFromDefault = '008000';
			var spectrumToDefault = 'ff0000';
			if ( state !== undefined ) {
				numberRangeFromDefault = state.numberRangeFromDefault;
				numberRangeToDefault = state.numberRangeToDefault;
				spectrumFromDefault = state.spectrumFromDefault;
				spectrumToDefault = state.spectrumToDefault;
			}
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.config;
			this.env;
			this.defaultConfig = {
				use : 'z',
				spectrum   : {
					from: spectrumFromDefault,
					to  : spectrumToDefault
				},
				numberRange: {
					from: numberRangeFromDefault,
					to  : numberRangeToDefault
				}
			};


			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			/**
			 * Returns a minimal description of this plugin.
			 * This method is used by the sceneGraph module.
			 * @returns {string}
			 *
			 */
			this.getShortName = function () {
				"use strict";
				//this.color
				var shortName = 'Heatmap';
				if ( this.env && this.env.config &&
					this.env.config.spectrum &&
					this.env.config.spectrum.from &&
					this.env.config.spectrum.to ) {
					shortName += '<br /><span class="glyphicon glyphicon-tint" style="color:#' + this.env.config.spectrum.from + ';" ></span>';
					shortName += '<span class="glyphicon glyphicon-tint" style="color:#' + this.env.config.spectrum.to + ';" ></span>';
				}
				return shortName;

			};
			this.deepCopy = function () {
				var privates = {
					numberRangeFromDefault: numberRangeFromDefault,
					numberRangeToDefault  : numberRangeToDefault,
					spectrumFromDefault   : spectrumFromDefault,
					spectrumToDefault     : spectrumToDefault
				};
				return new Plugin( privates );
			};
			/**
			 * Takes inserted configuration from the plugin-template and
			 * returns the parameters as JSON-config-file
			 *
			 * @param containerId
			 *            parent container where the plugin-template got
			 *            added
			 *
			 * @return config file format: { spectrum : {from: spectrumFrom,
				 *         to : spectrumTo }, numberRange : { from : numberFrom,
				 *         to : numberTo } }
			 */
			this.getConfigCallback = function ( containerId ) {
				var $container = $('#' + containerId);
				var spectrumFrom = $container.find(' #colorFrom' )
					.val();
				var spectrumTo = $container.find(' #colorTo' )
					.val();
				var numberFrom = parseFloat($container.find( ' #numberFrom' )
					.val());
				var numberTo = parseFloat($container.find(' #numberTo' )
					.val());

				if(isNaN(numberFrom) || isNaN(numberTo)){
					alert('[ Heatmap.numberRange ] Invalid input. ');
					numberFrom = 0;
					numberTo = 1;
				}
				if(numberFrom >= numberTo){
					alert('[ Heatmap.numberRange ] Range.from has to be greater than Range.to ');
					numberFrom = 0;
					numberTo = 1;
				}

				var use = $container.find( 'input[name=optionDataUse]:checked' ).val();

				var result = {
					spectrum   : {
						from: spectrumFrom,
						to  : spectrumTo
					},
					numberRange: {
						from: numberFrom,
						to  : numberTo
					},
					use : use

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
				var $container = $('#' + containerId);
				if ( config === undefined || config === "" ) {

					config = {
						spectrum   : {
							from: spectrumFromDefault,
							to  : spectrumToDefault
						},
						numberRange: {
							from: numberRangeFromDefault,
							to  : numberRangeToDefault
						},
						use : this.defaultConfig.use
					};
				}
				if( config.use === undefined ){
					config.use = this.defaultConfig.use;
				}

				if ( config.spectrum === undefined ) {
					config.spectrum = {
						from: spectrumFromDefault,
						to  : spectrumToDefault
					};
				}

				if ( config.numberRange === undefined ) {
					config.numberRange = {
						from: numberRangeFromDefault,
						to  : numberRangeToDefault
					};
				}
				$container.find( 'input[type=radio][name=optionDataUse][value=' + config.use + ']' ).attr( 'checked', 'checked' );

				$container.find(' #colorFrom' )
					.val( config.spectrum.from );
				$container.find( ' #colorTo' ).val(
					config.spectrum.to );
				$container.find(' #numberFrom' )
					.val( config.numberRange.from );
				$container.find( ' #numberTo' )
					.val( config.numberRange.to );

				var hexFromRGB = function ( r, g, b ) {
					var hex = [
						r.toString( 16 ),
						g.toString( 16 ),
						b.toString( 16 )
					];
					$.each( hex, function ( nr, val ) {
						if ( val.length === 1 ) {
							hex[nr] = "0" + val;
						}
					} );
					return hex.join( "" ).toUpperCase();
				};
				var hexToRgb = function ( value ) {
					var hex = '#' + value;
					var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
					hex = hex.replace( shorthandRegex, function ( m, r, g, b ) {
						return r + r + g + g + b + b;
					} );

					var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec( hex );
					return result ? {
						r: parseInt( result[1], 16 ),
						g: parseInt( result[2], 16 ),
						b: parseInt( result[3], 16 )
					} : null;
				};


				var refreshSwatchFrom = function () {
					var red = $container.find( "#fromRed" ).slider( "value" ),
						green = $container.find( "#fromGreen" ).slider( "value" ),
						blue = $container.find( "#fromBlue" ).slider( "value" ),
						hex = hexFromRGB( red, green, blue );
					$container.find( "#fromSwatch" ).css( "background-color", "#" + hex );
					$container.find( '#colorFrom' ).val( hex );
				};
				var refreshSwatchTo = function () {
					var red = $container.find( "#toRed" ).slider( "value" ),
						green = $container.find( "#toGreen" ).slider( "value" ),
						blue = $container.find( "#toBlue" ).slider( "value" ),
						hex = hexFromRGB( red, green, blue );
					$container.find( "#toSwatch" ).css( "background-color", "#" + hex );
					$container.find( '#colorTo' ).val( hex );
				};

				var fromRed = 255;
				var fromGreen = 140;
				var fromBlue = 60;
				var fromRGB = hexToRgb( config.spectrum.from );
				fromRed = fromRGB.r;
				fromGreen = fromRGB.g;
				fromBlue = fromRGB.b;
				var toRed = 255;
				var toGreen = 140;
				var toBlue = 60;
				var toRGB = hexToRgb( config.spectrum.to );
				toRed = toRGB.r;
				toGreen = toRGB.g;
				toBlue = toRGB.b;

				$container.find( "#fromRed, #fromGreen, #fromBlue" ).slider( {
					orientation: "horizontal",
					range      : "min",
					max        : 255,
					value      : 127,
					slide      : refreshSwatchFrom,
					change     : refreshSwatchFrom
				} );
				$container.find( "#toRed, #toGreen, #toBlue" ).slider( {
					orientation: "horizontal",
					range      : "min",
					max        : 255,
					value      : 127,
					slide      : refreshSwatchTo,
					change     : refreshSwatchTo
				} );

				$container.find( "#fromRed" ).slider( "value", fromRed );
				$container.find( "#fromGreen" ).slider( "value", fromGreen );
				$container.find( "#fromBlue" ).slider( "value", fromBlue );

				$container.find( "#toRed" ).slider( "value", toRed );
				$container.find( "#toGreen" ).slider( "value", toGreen );
				$container.find( "#toBlue" ).slider( "value", toBlue );

			};

			this.handleEnv = function ( env ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};
			this.handleConfig = function ( config, env ) {
				env.config = config || {};
				if ( env.config.spectrum === undefined ) {
					env.config.spectrum = this.defaultConfig.spectrum;
				} else {
					if ( env.config.spectrum.from === undefined ) {
						env.config.spectrum.from = this.defaultConfig.spectrum.from;
					}
					if ( env.config.spectrum.to === undefined ) {
						env.config.spectrum.to = this.defaultConfig.spectrum.to;
					}
				}
				if ( env.config.numberRange === undefined ) {
					env.config.numberRange = this.defaultConfig.numberRange;
				} else {
					if ( env.config.numberRange.from === undefined ) {
						env.config.numberRange.from = this.defaultConfig.numberRange.from;
					}
					if ( env.config.numberRange.to === undefined ) {
						env.config.numberRange.to = this.defaultConfig.numberRange.to;
					}
				}
				if(env.config.use === undefined){
					env.config.use = this.defaultConfig.use;
				}
			};
			this.exec = function ( config, childs ) {
				this.env = {};
				this.config = config;
				this.env.config = config;
				this.handleEnv( this.env );
				this.handleConfig( config, this.env );

				//console.log("[ heatmap ] \t\t EXEC");

				//console.log("[ heatmap ][ config ] "+JSON.stringify(config));
				return {
					pId     : this.getId(),
					pType   : this.type,
					response: {
						callback: this.colorCallback,
						context : this,
						heatmap : this.config
					}
				};

			};
			/**
			 * config = object config.data = data array config.numberRange =
			 * {from:<MINVALUE>,to:<MAXVALUE>} config.spectrum = {from:<COLOR>,to:<COLOR>}
			 * (optional. default: from:blue to:red)
			 */
			this.colorCallback = function ( data ) {
				//console.log("[ heatmap ] colorCallback");

				var minValue = this.config.numberRange.from === undefined ? this.numberRangeFromDefault
					: this.config.numberRange.from;
				var maxValue = this.config.numberRange.to === undefined ? this.numberRangeToDefault
					: this.config.numberRange.to;
				var fromColor = this.config.spectrum.from === undefined ? this.spectrumFromDefault
					: this.config.spectrum.from;
				var toColor = this.config.spectrum.to === undefined ? this.spectrumToDefault
					: this.config.spectrum.to;
				var colorArray = [];

				if ( data === undefined ) {
					return;
				}

				var rainbow = new Rainbow();
				rainbow.setNumberRange( parseFloat( minValue ), parseFloat( maxValue ) );
				rainbow.setSpectrum( fromColor, toColor );


				var processZ = function () {
					for ( var i = 0, len = data.length; i < len; ++i ) {
						colorArray[i] = rainbow.colourAt( data[i].z );

					}
				};
				var processY = function () {
					for ( var i = 0, len = data.length; i < len; ++i ) {
						colorArray[i] = rainbow.colourAt( data[i].y );

					}
				};
				var processX = function () {
					for ( var i = 0, len = data.length; i < len; ++i ) {
						colorArray[i] = rainbow.colourAt( data[i].x );

					}
				};
				switch(this.env.config.use){
					case 'x': processX(); break;
					case 'y': processY(); break;
					case 'z': processZ(); break;
					default: processZ(); break;
				}



				return colorArray;
			}


		});
		UTILS.CLASS.extend( Plugin, AbstractPlugin );
		return Plugin;

	} );
