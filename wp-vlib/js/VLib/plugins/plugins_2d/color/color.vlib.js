define(['require','config'],function(require,Config) {

	var plugin = (function() {
		/** ********************************** */
		/** PUBLIC VARIABLES * */
		/** ********************************** */
		this.context = Config.PLUGINTYPE.CONTEXT_2D;
		this.type = Config.PLUGINTYPE.COLOR;
		this.name = 'color2d';
		this.color = '000000';
		/** path to plugin-template file * */
		this.templates = Config.absPlugins+ '/plugins_2d/color/templates.js';
		this.accepts = {
			predecessors : [ Config.PLUGINTYPE.DATA,Config.PLUGINTYPE.MATERIAL ],
			successors : [  ]
		};
		this.icon = Config.absPlugins + '/plugins_2d/color/icon.png';
		this.description = 'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]';
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
		 this.getConfigCallback = function(containerId) {
		 	var color = $('#' + containerId + ' > form input[id=color]')
		 	.val();
		 	var result = {
		 		'color' : color
		 	};
		 	console.log("[ color ][getConfig] "+JSON.stringify(result));
		 	return result;
		 }
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
		 this.setConfigCallback = function(config, containerId) {
		 	console.log("cId:" +containerId+"[ color ][setConfig] "+JSON.stringify(config));
		 	if (config == "" || config === undefined)
		 		config = {};

		 	var hexFromRGB = function(r, g, b) {
		 		var hex = [
		 		r.toString( 16 ),
		 		g.toString( 16 ),
		 		b.toString( 16 )
		 		];
		 		$.each( hex, function( nr, val ) {
		 			if ( val.length === 1 ) {
		 				hex[ nr ] = "0" + val;
		 			}
		 		});
		 		return hex.join( "" ).toUpperCase();
		 	}
		 	/*
			* http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
			*/
			var hexToRgb = function(value) {
				var hex = '#'+value;
				var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
				hex = hex.replace(shorthandRegex, function(m, r, g, b) {
					return r + r + g + g + b + b;
				});

				var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			}
			var refreshSwatch = function() {
				var red = $( "#red" ).slider( "value" ),
				green = $( "#green" ).slider( "value" ),
				blue = $( "#blue" ).slider( "value" ),
				hex = hexFromRGB( red, green, blue );
				$( "#swatch" ).css( "background-color", "#" + hex );
				$('#' + containerId + ' > form input[id=color]').val(hex);
			}
			var red = 255;
			var green = 140;
			var blue = 60;
			if (config.color != undefined) {
				$('#' + containerId + ' > form input[id=color]').val(
					config.color);
				var rgb = hexToRgb(config.color);
				red = rgb.r;
				green = rgb.g;
				blue = rgb.b;
			}
			$( "#red, #green, #blue" ).slider({
				orientation: "horizontal",
				range: "min",
				max: 255,
				value: 127,
				slide: refreshSwatch,
				change: refreshSwatch
			});
			$( "#red" ).slider( "value", red );
			$( "#green" ).slider( "value", green );
			$( "#blue" ).slider( "value", blue );


		}
		this.collorCallback = function( data ){
			alert("color callback "+this.color);
			var colors = this.color;
			return UTILS.initArray( data.length, this.color);
		}
		this.exec = function(config) {
			console.log("[ color ] \t\t EXEC");
			this.color = config.color || '000000';

			return {
				pType : this.type,
				response : {
					color : '#'+config.color,
					callback : this.collorCallback,
					context : this
				}
			};
		}


	});

return plugin;

});
