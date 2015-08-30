define(
	['require', 'config', 'jquery'],
	function ( require, Config, $ ) {

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

			var material = this.interactiveObject;
			var $container = $( '#' + containerId );
			if ( config === "" ) {
				config = {
					reflectivity: this.defaults.reflectivity,
					opacity     : this.defaults.opacity,
					transparent : this.defaults.transparent,
					envmap      : this.defaults.envmap
				};
			}
			if ( config.opacity !== undefined ) {
				$container.find( '#opacity' ).val( config.opacity );
			} else {
				$container.find( '#opacity' ).val( this.defaults.opacity );
				config.opacity = this.defaults.opacity;
			}
			if ( config.transparent !== undefined ) {
				if ( config.transparent === true ) {
					$container.find( '#transparent' ).attr( 'checked', 'checked' );
				}
			} else {
				config.transparent = this.defaults.transparent;
			}
			if ( config.reflectivity !== undefined ) {
				$container.find( '#reflectivity' ).val( config.reflectivity );
			} else {
				$container.find( ' #reflectivity' ).val( this.defaults.reflectivity );
				config.reflectivity = this.defaults.reflectivity;
			}
			if ( config.envmap === undefined ) {
				config.envmap = this.defaults.envmap;
			}

			$container.find( 'select[id=envmapSelect] option[value=' + config.envmap + ']' ).attr( 'selected', 'selected' );

			// opacitySlider
			$container.find( '#opacitySlider' ).slider( {
				orientation: "horizontal",
				range      : "min",
				min        : 0,
				max        : 100,
				value      : config.opacity * 100,
				slide      : function ( event, ui ) {
					$container.find( '#opacity' ).val( ui.value / 100 );
					if ( material !== undefined ) {
						material.opacity = ui.value / 100;
					}
				}
			} );
			// lineWidth slider
			$container.find( '#reflectivitySlider' ).slider( {
				orientation: "horizontal",
				range      : "min",
				min        : 0,
				max        : 1,
				step       : 0.01,
				value      : config.reflectivity,
				slide      : function ( event, ui ) {
					$container.find( '#reflectivity' ).val( ui.value );
					if ( material !== undefined ) {
						material.reflectivity = ui.value;
					}
				}
			} );
		};
	} );
