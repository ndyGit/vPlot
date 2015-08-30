define(
	[ 'require','config', 'jquery'],
	function(require,Config, $) {

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

		 	var material = this.interactiveObject;
			 var $container = $('#'+containerId);
		 	if (config == ""){
		 		config = {
		 			opacity:0.9,
		 			transparent:true,
		 			lineWidth:3
		 		};
		 	}
		 	if (config.opacity !== undefined) {
			    $container.find('#opacity').val(config.opacity);
		 	} else {
			    $container.find('#opacity').val(0.9);
		 		config.opacity = 0.9;
		 	}
		 	if (config.transparent !== undefined) {
		 		if(config.transparent === true){
				    $container.find('#transparent').attr('checked','checked');
		 		}
		 	}
		 	if (config.lineWidth !== undefined) {
			    $container.find('#lineWidth').val(config.lineWidth);
		 	}else{
			    $container.find(' #lineWidth').val(3);
		 	}

		 	// opacitySlider
			 $container.find('#opacitySlider').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0,
		 		max: 100,
		 		value: config.opacity*100,
		 		slide: function (event, ui) {
				    $container.find( ' #opacity').val(ui.value/100);
		 			if(material !== undefined){
		 				material.opacity = ui.value/100;
		 			}
		 		}
		 	});
		 	// lineWidth slider
			 $container.find('#lineWidthSlider').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 1,
		 		max: 30,
		 		value: config.lineWidth,
		 		slide: function (event, ui) {
				    $container.find('#lineWidth').val(ui.value);
		 			if(material !== undefined){
		 				material.wireframeLinewidth = ui.value;
		 			}
		 		}
		 	});
		 };
		});
