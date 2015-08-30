define(
	[ 'require', 'jquery'],
	function(require, $) {
		/**
		 * Takes inserted configuration from the plugin-template and
		 * returns the parameters as JSON-config-file
		 *
		 * @param containerId
		 *            parent container where the plugin-template got
		 *            added
		 *
		 * @return config file format:
		 *         {camera:{x:VALUE,y:VALUE,z:VALUE}}
		*/
		return function(containerId) {
			var c = $('#'+containerId);

			var linkType = c.find('input[name=optionLinkType]:checked' ).val();

			var hyperlinkBlank = c.find('#hyperlinkBlank').is(':checked');
			var hyperlink = c.find('#hyperlink').val();

			var plotId = c.find('#selectPlot :checked' ).val();


			var link = false;
			var blank = false;

			switch ( linkType ) {
				case 'hyperlink':
					link = hyperlink;
					blank = hyperlinkBlank;
					break;
				case 'plot':
					link = plotId;
					blank = false;
					break;
			}
			var result = {
				blank : blank,
				link : link,
				linkType : linkType
			};
			console.log('[ Link ][getConfig] ' + JSON.stringify(result));
			return result;
		};

	});
