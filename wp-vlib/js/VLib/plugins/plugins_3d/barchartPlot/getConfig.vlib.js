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
			var $container = $('#' + containerId);

			var name = escape( $container.find(' #name' ).val() );
			var xScale = $container.find(' #xScale' ).val();
			var yScale = $container.find(' #yScale' ).val();
			var zScale = $container.find(' #zScale' ).val();
			var dataInterpretations = $container.find( 'input[name=optionDataInterpretation]:checked' ).val();
			var offsetX = $container.find( '#offset-x' ).val();
			var offsetY = $container.find( '#offset-y' ).val();

			var result = {
				name : name,
				dataInterpretation : dataInterpretations,
				scale: {
					'x': xScale === "" ? xScaleDefault : xScale,
					'y': yScale === "" ? yScaleDefault : yScale,
					'z': zScale === "" ? zScaleDefault : zScale
				},
				offset      : {
					x: parseInt( offsetX ),
					y: parseInt( offsetY )
				}
			};
			console.log( "[ surface ][getConfig] " );
			return result;
		};

	} );
