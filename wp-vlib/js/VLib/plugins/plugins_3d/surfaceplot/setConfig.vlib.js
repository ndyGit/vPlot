define(
	[ 'require','config', 'jquery'],
	function(require,Config, $) {
		var xScaleDefault = Config.defaults.scale.x
		var yScaleDefault = Config.defaults.scale.y;
		var zScaleDefault = Config.defaults.scale.z;
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
		 return function(config, containerId) {
		 	console.log("[ surface ][setConfig] ");
		 	if (config === "" || config === undefined) {
		 		config = {
		 			name : this.defaults.name,
		 			scale : {}
		 		};
		 	}

		 	if(config.scale === undefined){
		 		config.scale = {};
		 	}
		 	if (config.name === undefined){
		 		$('#' + containerId + ' #name').val(this.defaults.name);
		 	}else{
		 		$('#' + containerId + ' #name').val(unescape(config.name));
		 	}
		 	if (config.scale.x !== undefined) {
		 		$('#' + containerId + ' #xScale').val(config.scale.x);
		 	} else {
		 		$('#' + containerId + ' #xScale').val(xScaleDefault);
		 	}
		 	if (config.scale.y !== undefined) {
		 		$('#' + containerId + ' #yScale').val(config.scale.y);
		 	} else {
		 		$('#' + containerId + ' #yScale').val(yScaleDefault);
		 	}
		 	if (config.scale.z !== undefined) {
		 		$('#' + containerId + ' #zScale').val(config.scale.z);
		 	} else {
		 		$('#' + containerId + ' #zScale').val(zScaleDefault);
		 	}
		 	$('#' + containerId ).find('.nav-tabs a').click(function(e){
			    e.preventDefault();
			    $(this).tab('show');
			    var targetId = $(this ).attr('href');
			    $('#' + containerId ).find('.tab-pane' ).removeClass('active');
			    $('#' + containerId ).find( targetId ).addClass('active');
		 	});
		 };
		});
