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
			var $container =  $( '#' + containerId );
			var data = $container.find( 'input[id=data]' ).val();
			var mapping = $container.find( '#data-mapping' ).val();

			if ( data !== undefined && data !== '' ) {
				data = JSON.parse( data );
			} else {
				data = [];
			}

			var result = {
				data: data,
				mapping : mapping
			};

			console.log( "[ dataset ][getConfig] " + JSON.stringify( result ) );
			return result;
		};

	} );
