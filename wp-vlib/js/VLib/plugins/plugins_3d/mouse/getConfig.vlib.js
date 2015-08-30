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
			var activity =  $('#' + containerId + ' #activity').val();
			var lockActive = c.find('#lockActive').is(':checked');
			if(activity ==='' || activity === undefined){
		 		target = this.defaultActivity;
		 	}
			var result = {
				activity : activity,
				lockActive : lockActive
			};

			return result;
		}

	});
