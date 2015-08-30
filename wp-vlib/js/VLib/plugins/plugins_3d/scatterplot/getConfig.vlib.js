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
		 	if(this.updateSizeActivity)
		 		this.updateSizeActivity.stop();
		 	var name = escape($('#' + containerId + ' #name').val());
		 	var type =  $('#' + containerId + ' #material').val();
		 	var particleSize = $('#' + containerId + ' #particleSize')
		 	.val();
		 	var opacity = $('#' + containerId + ' #opacity').val();
		 	var image =  $('#' + containerId + ' #image').val();
		 	var blending = $('#' + containerId + ' #blending').is(':checked');
		 	var transparent = $('#' + containerId + ' #transparent').is(':checked');
		 	var colors = $('#' + containerId + ' #colors').is(':checked');
		 	var sizeAttenuation = $('#' + containerId + ' #sizeAttenuation').is(':checked');

		 	var xScale = $('#' + containerId + ' #xScale').val();

		 	var yScale = $('#' + containerId + ' #yScale').val();

		 	var zScale = $('#' + containerId + ' #zScale').val();

		 	var result = {
		 		name : name,
		 		material : {
		 			'type' : type === '' ? this.defaults.type : type,
		 			'particleSize' : particleSize === '' ? this.defaults.size
		 			: particleSize,
		 			'opacity' : opacity === '' ? this.defaults.opacity
		 			: opacity,
		 			'image' : image,
		 			'blending' : blending === '' ? this.defaults.blending
		 			: blending,
		 			'transparent' : transparent === '' ? this.defaults.transparent
		 			: transparent,
		 			'colors' : colors === '' ? this.defaults.colors : colors,
		 			'sizeAttenuation' : sizeAttenuation === '' ?  this.defaults.sizeAttenuation : sizeAttenuation

		 		},
		 		scale : {
		 			'x' : xScale === '' ? this.defaults.xScale : xScale,
		 			'y' : yScale === '' ? this.defaults.yScale : yScale,
		 			'z' : zScale === '' ? this.defaults.zScale: zScale

		 		}

		 	};
		 	return result;
		 }

		});
