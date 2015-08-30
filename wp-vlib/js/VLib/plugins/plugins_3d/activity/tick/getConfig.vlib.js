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

			var easing =  $container.find(' #easing').val();
			var duration = $container.find('#duration').val();

			var result = {
				easing : easing,
				duration : duration
			};
			console.log('[ Tick ][getConfig] ' + JSON.stringify(result));
			return result;
		};

	});
