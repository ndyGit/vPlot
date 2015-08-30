define(
	['require', 'jquery'],
	function ( require, $ ) {
		/**
		 * Takes inserted configuration from the plugin-template and
		 * returns the parameters as JSON-config-file
		 *
		 * @param containerId
		 *            parent container where the plugin-template got
		 *            added
		 *
		 * @return config file format:
		 *
		 */
		return function ( containerId ) {

			var $container = $( '#' + containerId );

			var reflectivity = $container.find( '#reflectivity' ).val();
			var opacity = $container.find( '#opacity' ).val();
			var transparent = $container.find( '#transparent' ).is( ':checked' );
			var envmap = $container.find( 'select[id=envmapSelect] option:selected' ).val();

			var result = {
				opacity     : opacity,
				transparent : transparent,
				reflectivity: reflectivity,
				envmap : envmap
			};


			return result;
		};

	} );
