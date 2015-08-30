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
		 	var context = this;
		 	if (config == "" || config === undefined) {
		 		config = {
		 			name : this.defaults.name,
		 			linewidth : '',
		 			scale : ''
		 		};
		 	}
		 	if (config.name === undefined){
		 		$('#' + containerId + ' #name').val(this.defaults.name);
		 	}else{
		 		$('#' + containerId + ' #name').val(unescape(config.name));
		 	}
		 	if(config.lineType !== undefined){
		 		$('#'+containerId+' input[type=radio][name=optionLinetype][value='+config.lineType+']').attr('checked',true);
		 	}
		 	if (config.lineWidth !== undefined) {
		 		$('#' + containerId + ' #lineWidth').val(
		 			config.lineWidth);
		 	} else {
		 		$('#' + containerId + ' #lineWidth').val(
		 			3);
		 		config.lineWidth = 3;
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


		 	$('#'+containerId ).find(' #lineWidthSlider').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 1,
		 		max: 10,
		 		value: config.lineWidth,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #lineWidth').val(ui.value);
		 			if( context.interactiveObject !== undefined ){
		 				context.interactiveObject.material.linewidth = ui.value;
		 				context.interactiveObject.material.dashSize = ui.value;
		 				context.interactiveObject.material.gaphSize = 2*ui.value;
		 			}
		 		}
		 	});
			 $('#' + containerId ).find('.nav-tabs a').click(function(e){
				 e.preventDefault();
				 $(this).tab('show');
				 var targetId = $(this ).attr('href');
				 $('#' + containerId ).find('.tab-pane' ).removeClass('active');
				 $('#' + containerId ).find( targetId ).addClass('active');
			 });
		 };
		});
