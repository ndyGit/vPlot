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
		 *         {camera:{x:VALUE,y:VALUE,z:VALUE}}
		*/
		return function(containerId) {
			var c = $('#'+containerId);

			var yoyo = c.find('#yoyo').is(':checked');
			var activeOnComplete = c.find('#activeOnComplete').is(':checked');
			var easing =  $('#' + containerId + ' #easing').val();

			var toX = c.find('#toX').val();
		 	var toY = c.find('#toY').val();
		 	var toZ = c.find('#toZ').val();

		 	var duration = c.find('#duration').val();

		 	if(isNaN(toX) || isNaN(toY) || isNaN(toZ)){
		 		toX = this.defaultTo.x;
		 		toY = this.defaultTo.y;
		 		toZ = this.defaultTo.z;
		 		alert("[ Move.config ] Invalid TO vector! Defaults will be used.");
		 	}
		 	if(isNaN(duration)){
		 		duration = this.defaultDuration;
		 		alert("[ Move.config ] Invalid DURATION! Default value will be used.");
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
				yoyo : yoyo,
				activeOnComplete : activeOnComplete,
				easing : easing,
				to : {
					x : toX,
					y : toY,
					z : toZ
				},
				duration : duration
			};
			console.log('[ Move ][getConfig] ' + JSON.stringify(result));
			return result;
		};

	});
