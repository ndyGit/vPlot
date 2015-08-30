define( ['require', 'config', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'jquery'], function ( require, Config, AbstractPlugin, UTILS, $ ) {
	/**
	 TODO<br />
	 @class Plugin Color
	 @constructor
	 @extends AbstractPlugin
	 **/
	var Plugin = (function () {
		var name = 'color';
		Plugin.superClass.constuctor.call( this, name );
		Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
		Plugin.superClass.setType.call( this, Config.PLUGINTYPE.COLOR );
		/** path to plugin-template file * */
		Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/color/templates.js' );
		Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/color/icon.png' );
		Plugin.superClass.setAccepts.call( this, {
			predecessors: [Config.PLUGINTYPE.DATA, Config.PLUGINTYPE.AXES, Config.PLUGINTYPE.CONTEXT_3D,Config.PLUGINTYPE.MATERIAL],
			successors  : []
		} );
		Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
		this.env;
		/** ********************************** */
		/** PUBLIC VARIABLES * */
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
		 *         { path:VALUE,data:VALUE}
		 */
		this.getConfigCallback = function ( containerId ) {
			var color = $( '#' + containerId ).find( 'input[id=color]' )
				.val();
			var result = {
				'color': color
			};

			return result;
		};
		/**
		 * Returns a minimal description of this plugin.
		 * This method is used by the sceneGraph module.
		 * @returns {string}
		 *
		 */
		this.getShortName = function(){
			"use strict";
			//this.color
			return 'Color'+'<br /><span class="glyphicon glyphicon-tint" style="color:#'+this.color+';" ></span>';
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

			if ( config == "" || config === undefined )
				config = {};
			var $container = $( '#' + containerId );
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
			/*
			 * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
			 */
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
			var refreshSwatch = function () {
				var red = $container.find( "#red" ).slider( "value" ),
					green = $container.find( "#green" ).slider( "value" ),
					blue = $container.find( "#blue" ).slider( "value" ),
					hex = hexFromRGB( red, green, blue );
				$container.find( "#swatch" ).css( "background-color", "#" + hex );
				$container.find( 'input[id=color]' ).val( hex );
			};
			var red = 0;
			var green = 0;
			var blue = 0;
			if ( config.color !== undefined ) {
				$container.find( 'input[id=color]' ).val(
					config.color );
				var rgb = hexToRgb( config.color );
				red = rgb.r;
				green = rgb.g;
				blue = rgb.b;
			}
			$container.find( "#red, #green, #blue" ).slider( {
				orientation: "horizontal",
				range      : "min",
				max        : 255,
				value      : 0,
				slide      : refreshSwatch,
				change     : refreshSwatch
			} );
			$container.find( "#red" ).slider( "value", red );
			$container.find( "#green" ).slider( "value", green );
			$container.find( "#blue" ).slider( "value", blue );

			$container.find( '.nav-tabs a' ).click( function ( e ) {
				e.preventDefault();
				$( this ).tab( 'show' );
				var targetId = $( this ).attr( 'href' );
				$container.find( '.tab-pane' ).removeClass( 'active' );
				$container.find( targetId ).addClass( 'active' );
			} );

		};
		this.collorCallback = function ( data ) {
			return UTILS.initArray( data.length, this.color );
		};
		this.exec = function ( config ) {
			//console.log("[ color ] \t\t EXEC");
			this.color = config.color || '000000';

			return {
				pType   : this.type,
				response: {
					color   : this.color,
					callback: this.collorCallback,
					context : this
				}
			};
		}


	});
	UTILS.CLASS.extend( Plugin, AbstractPlugin );
	return Plugin;

} );
