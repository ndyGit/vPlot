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
		 *
		 */
		 return function(containerId) {

		 	var lineWidth = $('#' + containerId + ' #lineWidth').val();
		 	var opacity = $('#' + containerId + ' #opacity').val();
		 	var transparent = $('#' + containerId + ' #transparent').is(':checked');

		 	var result = {
		 		opacity:opacity,
		 		transparent:transparent,
		 		lineWidth:lineWidth
		 	}
		 	console.log("[ wireframeMaterial ][getConfig] "
		 		+ JSON.stringify(result));
		 	return result;
		 }

		});
