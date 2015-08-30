define(
	['require', 'jquery'],
	function ( require, $ ) {

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
		return function ( config, containerId ) {
			var $container = $( '#' + containerId );
			if(!config){
				config = {};
			}
			if( !config.time ){
				config.time = this.defaults.time;
			}
			if( !config.type ){
				config.type = this.defaults.type;
			}
			if( !config.msg ){
				config.msg = this.defaults.msg;
			}
			if( !config.remove ){
				config.remove = this.defaults.remove;
			}

			var $type = $container.find( '#msgType' );
			var $msgText = $container.find( '#msgText' );
			var $time = $container.find( '#time' );
			var $remove = $container.find( '#remove' );
			var $timeContainer = $container.find( '#time-container' );

			if ( config.type ) {
				$type.val( config.type ).attr( 'selected', 'selected' );
			}

			if ( config.msg ) {
				$msgText.val( config.msg );
			}

			if ( config.time ) {
				$time.val( config.time );
			}

			$remove.change( function () {
				"use strict";
				var isActive = $container.find( '#remove' ).is( ':checked' );
				if ( isActive ) {
					$timeContainer.fadeIn();
				} else {
					$timeContainer.fadeOut();
				}
			} );

			if ( config.remove ) {
				$remove.attr( 'checked', 'checked' );
				$timeContainer.fadeIn();
			}

			$container.find( ' #timeSlider' ).slider( {
				orientation: "horizontal",
				range      : "min",
				min        : 1,
				max        : 10,
				value      : config.time,
				step       : 1,
				slide      : function ( event, ui ) {
					$time.val( ui.value );
				}
			} );


		};
	} );
