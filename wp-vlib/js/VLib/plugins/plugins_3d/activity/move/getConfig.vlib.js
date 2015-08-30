define(
	[ 'require','config', 'jquery'],
	function(require, Config, $) {
		/**
		 * Takes inserted configuration from the plugin-template and
		 * returns the parameters as JSON-config-file
		 *
		 * @param containerId
		 *            parent container where the plugin-template got
		 *            added
		 *
		 * @return config file format:
		 *         {camera:{x:VALUE,y:VALUE,z:VALUE}}
		*/
		return function(containerId) {
			var $container = $('#'+containerId);
			var target =  $container.find(' #target').val();
			var origin = $container.find('#origin').is(':checked');
			var yoyo = $container.find('#yoyo').is(':checked');
			var activeOnComplete = $container.find('#activeOnComplete').is(':checked');
			var easing =  $container.find(' #easing').val();

			var toX = $container.find('#toX').val();
		 	var toY = $container.find('#toY').val();
		 	var toZ = $container.find('#toZ').val();

		 	var duration = $container.find('#duration').val();
		 	var valid = true;
		 	if(isNaN(toX) || isNaN(toY) || isNaN(toZ)){
		 		if(toX !== Config.PATTERN.ORIGIN){
		 			toX = this.defaultTo.x;
		 			valid = false;
		 		}
		 		if(toY !== Config.PATTERN.ORIGIN){
		 			toY = this.defaultTo.y;
		 			valid = false;
		 		}
		 		if(toZ !== Config.PATTERN.ORIGIN){
		 			toZ = this.defaultTo.z;
		 			valid = false;
		 		}
		 		if(!valid){
		 			alert("[ Move.config ] Invalid TO vector! Defaults will be used.");
		 		}
		 	}
		 	if(isNaN(duration)){
		 		duration = this.defaultDuration;
		 		alert("[ Move.config ] Invalid DURATION! Default value will be used.");
		 	}

		 	if(target ==='' || target === undefined){
		 		target = this.defaultTarget;
		 	}
		 	if(easing ==='' || easing === undefined){
		 		easing = this.defaultEasing;
		 	}

		 	if(toX === '' || toX === undefined){
		 		toX = this.defaultTo.x;
		 	}
		 	if(toY === '' || toY === undefined){
		 		toY = this.defaultTo.y;
		 	}
		 	if(toZ === '' || toZ === undefined){
		 		toZ = this.defaultTo.z;
		 	}

		 	if(duration === '' || duration === undefined){
		 		duration = JSON.parse(JSON.stringify(this.defaultDuration));
		 	}
			var result = {
				target : target,
				yoyo : yoyo,
				activeOnComplete : activeOnComplete,
				easing : easing,
				to : {
					x : toX,
					y : toY,
					z : toZ
				},
				origin : origin,
				duration : duration
			};
			console.log('[ Move ][getConfig] ' + JSON.stringify(result));
			return result;
		};

	});
