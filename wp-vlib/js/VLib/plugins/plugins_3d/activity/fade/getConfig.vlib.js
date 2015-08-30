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
			var fadeFrom = c.find('#fadeFrom').val() / 100;
		 	var fadeTo = c.find('#fadeTo').val() / 100;
		 	var duration = c.find('#duration').val();
		 	if(fadeFrom === '' || fadeFrom === undefined){
		 		fadeFrom = this.defaultFrom;
		 	}
		 	if(fadeTo === '' || fadeTo === undefined){
		 		fadeTo = this.defaultTo;
		 	}
		 	if(duration === '' || duration === undefined){
		 		duration = this.defaultDuration;
		 	}
			var result = {
				yoyo : yoyo,
				from : fadeFrom,
				to : fadeTo,
				duration : duration
			};
			console.log('[ Fade ][getConfig] ' + JSON.stringify(result));
			return result;
		}

	});
