define(
	[ 'require', 'jquery'],
	function(require, $) {

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
		 	var c = $('#'+containerId);
		 	if (config == "" || config === undefined) {
		 		config = {
		 			yoyo : this.defaultYoyo,
		 			from : this.defaultFrom,
		 			to : this.defaultTo,
		 			duration : this.defaultDuration
		 		};
		 	}
		 	if (config.yoyo !== undefined) {
				if(config.yoyo === true){
					c.find('#yoyo').attr('checked','checked');
				}
			}
		 	if(config.from !== undefined){
		 		$('#' + containerId + ' #fadeFrom').val((config.from * 100).toFixed(0));
		 	}else {
		 		$('#' + containerId + ' #fadeFrom').val((defaultFrom * 100).toFixed(0));
		 		config.from = this.defaultFrom;
		 	}
		 	if(config.to !== undefined){
		 		$('#' + containerId + ' #fadeTo').val((config.to * 100).toFixed(0));
		 	}else {
		 		$('#' + containerId + ' #fadeTo').val((defaultTo * 100).toFixed(0));
		 		config.from = this.defaultTo;
		 	}
		 	if(config.duration !== undefined){
		 		$('#' + containerId + ' #duration').val(config.duration);
		 	}else {
		 		$('#' + containerId + ' #duration').val(this.defaultDuration);
		 		config.duration = this.defaultDuration;
		 	}

		 	$('#'+containerId ).find(' #fadeFromSlider').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0,
		 		max: 100,
		 		value: config.from *100,
		 		step : 1,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #fadeFrom').val(ui.value);
		 		}
		 	});
		 	$('#'+containerId ).find(' #fadeToSlider').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0,
		 		max: 100,
		 		value: config.to *100,
		 		step : 1,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #fadeTo').val(ui.value);
		 		}
		 	});
		 	$('#'+containerId ).find(' #durationSlider').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0.1,
		 		max: 10,
		 		value: config.duration,
		 		step : 0.1,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #duration').val(ui.value);
		 		}
		 	});
		 };
		});
