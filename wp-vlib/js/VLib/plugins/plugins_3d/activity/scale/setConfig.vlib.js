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
		 			easing : this.defaultEasing,
		 			to : this.defaultTo,
		 			duration : this.defaultDuration
		 		};
		 	}
		 	if(config.yoyo === undefined){
		 		config.yoyo = this.defaultYoyo;
		 	}

		 	if(config.easing === undefined){
		 		config.easing = this.defaultEasing;
		 	}

		 	if(config.to === undefined){
		 		config.to = JSON.parse(JSON.stringify(this.defaultTo));
		 	}



		 	if(config.yoyo === true){
		 		c.find('#yoyo').attr('checked','checked');
		 	}

		 	if(config.easing !== undefined){
		 		$('#' + containerId).find('#easing').val(config.easing);
		 		$('#' + containerId ).find('#easingSelect').val(config.easing).attr('selected', 'selected');
		 	}else{
		 		$('#' + containerId).find('#easing').val(config.defaultEasing);
		 	}


		 	if(config.to.x !== undefined){
		 		$('#' + containerId).find('#toX').val(config.to.x);
		 	}else{
		 		$('#' + containerId).find('#toX').val(this.defaultTo.x);
		 	}
		 	if(config.to.y !== undefined){
		 		$('#' + containerId).find('#toY').val(config.to.y);
		 	}else{
		 		$('#' + containerId).find('#toY').val(this.defaultTo.y);
		 	}
		 	if(config.to.z !== undefined){
		 		$('#' + containerId).find('#toZ').val(config.to.z);
		 	}else{
		 		$('#' + containerId).find('#toZ').val(this.defaultTo.z);
		 	}


		 	if(config.duration !== undefined){
		 		$('#' + containerId + ' #duration').val(config.duration);
		 	}else {
		 		$('#' + containerId + ' #duration').val(this.defaultDuration);
		 		config.duration = this.defaultDuration;
		 	}

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

		 	$('#' + containerId ).find(' #easingSelect').change(function(){
		 		var selected = $(this).find('option:selected');
		 		$('#' + containerId ).find(' #easing').val(selected.val());
		 	});
		 };
		});
