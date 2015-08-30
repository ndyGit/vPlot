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
		 *  {
		 *		position : position,
		 *		animation : animation,
	 	 *		useDataLabel : useDataLabel,
		 *		customText : customText,
		 *		offset : {
		 *			x : offset,
		 *			y : offset
		 *		}
		 *	}
		 */
		return function ( containerId ) {
			var $container = $( '#' + containerId );

			var useDataLabelContainer = $container.find( '#useDataLabel' );
			var customTextContainer = $container.find( '#customText' );

			var position = $container.find( 'input[name=optionPosition]:checked' ).val();
			var animation = $container.find( 'input[name=optionAnimation]:checked' ).val();
			var useDataLabel = useDataLabelContainer.is( ':checked' );
			var customText = escape( customTextContainer.val() );
			var offsetX = $container.find( '#offset-x' ).val();
			var offsetY = $container.find( '#offset-y' ).val();

			var result = {
				position    : position,
				animation   : animation,
				useDataLabel: useDataLabel,
				customText  : customText,
				offset      : {
					x: parseInt( offsetX ),
					y: parseInt( offsetY )
				}
			};

			return result;
		};

	} );
