define(
	[ 'require','config', 'jquery'],
	function(require, Config, $) {

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
		 	var $container = $('#'+containerId);
		 	var context = this;
		 	if (config == "" || config === undefined) {
		 		config = {
		 			target : this.defaultTarget,
		 			yoyo : this.defaultYoyo,
		 			activeOnComplete : this.defaultActiveOnComplete,
		 			easing : this.defaultEasing,
		 			from : this.defaultFrom,
		 			to : this.defaultTo,
		 			origin : this.defaultOrigin,
		 			duration : this.defaultDuration
		 		};
		 	}
		 	if(config.yoyo === undefined){
		 		config.yoyo = this.defaultYoyo;
		 	}
		 	if(config.origin === undefined){
		 		config.origin = this.defaultOrigin;
		 	}
		 	if(config.activeOnComplete === undefined){
		 		config.activeOnComplete = this.defaultActiveOnComplete;
		 	}
		 	if(config.easing === undefined){
		 		config.easing = this.defaultEasing;
		 	}

		 	if(config.to === undefined){
		 		config.to = JSON.parse(JSON.stringify(this.defaultTo));
		 	}

		 	if(config.target !== undefined){
			    $container.find('#target').val(config.target);
			    $container.find('#targetSelect').val(config.target).attr('selected', 'selected');
		 	}else{
			    $container.find('#easing').val(config.defaultEasing);
		 	}

		 	if(config.yoyo === true){
			    $container.find('#yoyo').attr('checked','checked');
		 	}
		 	if(config.origin === true){
			    $container.find('#origin').attr('checked','checked');
		 	}

		 	if(config.easing !== undefined){
			    $container.find('#easing').val(config.easing);
			    $container.find('#easingSelect').val(config.easing).attr('selected', 'selected');
		 	}else{
			    $container.find('#easing').val(config.defaultEasing);
		 	}


		 	if(config.to.x !== undefined){
			    $container.find('#toX').val(config.to.x);
		 	}else{
			    $container.find('#toX').val(this.defaultTo.x);
		 	}
		 	if(config.to.y !== undefined){
			    $container.find('#toY').val(config.to.y);
		 	}else{
			    $container.find('#toY').val(this.defaultTo.y);
		 	}
		 	if(config.to.z !== undefined){
			    $container.find('#toZ').val(config.to.z);
		 	}else{
			    $container.find('#toZ').val(this.defaultTo.z);
		 	}


		 	if(config.duration !== undefined){
			    $container.find('#duration').val(config.duration);
		 	}else {
			    $container.find('#duration').val(this.defaultDuration);
		 		config.duration = this.defaultDuration;
		 	}

			 $container.find(' #durationSlider').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0.1,
		 		max: 10,
		 		value: config.duration,
		 		step : 0.1,
		 		slide: function (event, ui) {
				    $container.find('#duration').val(ui.value);
		 		}
		 	});
			 $container.find(' #targetSelect').change(function(){
		 		var selected = $(this).find('option:selected');
				 $container.find(' #target').val(selected.val());
		 	});
			 $container.find(' #easingSelect').change(function(){
		 		var selected = $(this).find('option:selected');
		 		$container.find(' #easing').val(selected.val());
		 	});
		 	var last_x;
		 	var last_y;
		 	var last_z;
			 $container.find(' #origin').click(function(){
		 		if(this.checked){
		 			last_x = $container.find('#toX').val();
		 			last_y = $container.find('#toY').val();
		 			last_z = $container.find('#toZ').val();
				    $container.find('#toX').val(Config.PATTERN.ORIGIN);
				    $container.find('#toY').val(Config.PATTERN.ORIGIN);
				    $container.find('#toZ').val(Config.PATTERN.ORIGIN);
		 		}else{
				    $container.find('#toX').val(last_x);
				    $container.find('#toY').val(last_y);
				    $container.find('#toZ').val(last_z);
		 		}
		 	});
		 };
		});
