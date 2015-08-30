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
		 	var lineType = $('#'+containerId+' input[type=radio][name=optionLinetype]:checked').val();
		 	var lineWidth = $('#' + containerId + ' #lineWidth').val();

			 var name = escape($('#' + containerId + ' #name').val());
		 	if(lineWidth === undefined || lineWidth ==""){
		 		lineWidth = 3;
		 	}

		 	var xScale = $('#' + containerId + ' #xScale').val();
		 	var yScale = $('#' + containerId + ' #yScale').val();
		 	var zScale = $('#' + containerId + ' #zScale').val();

		 	var scale = {
		 		'x' : xScale === "" ? xScaleDefault : parseFloat(xScale),
		 		'y' : yScale === "" ? yScaleDefault : parseFloat(yScale),
		 		'z' : zScale === "" ? zScaleDefault : parseFloat(zScale)

		 	};

		 	var result = {
		 		name : name,
		 		lineType : lineType,
		 		lineWidth: lineWidth,
		 		scale : scale

		 	};
		 	return result;
		 }

});
