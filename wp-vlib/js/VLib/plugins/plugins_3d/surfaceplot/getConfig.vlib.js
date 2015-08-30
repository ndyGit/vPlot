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
			 var name = escape($('#' + containerId + ' #name').val());
		 	var xScale = $('#' + containerId + ' #xScale').val();
		 	var yScale = $('#' + containerId + ' #yScale').val();
		 	var zScale = $('#' + containerId + ' #zScale').val();

		 	var result = {
		 		name : name,
		 		scale : {
		 			'x' : xScale === "" ? xScaleDefault : xScale,
		 			'y' : yScale === "" ? yScaleDefault : yScale,
		 			'z' : zScale === "" ? zScaleDefault : zScale

		 		}
		 	};
		 	console.log("[ surface ][getConfig] ");
		 	return result;
		 }

		});
