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

			var $container = $('#'+containerId);
			var state =  $container.find(' #state').val();

			if(state ==='' || state === undefined){
		 		state = this.defaultState;
		 	}
			var result = {
				state : state
			};
			console.log('[ state ][getConfig] ' + JSON.stringify(result));

			return result;
		};

	});
