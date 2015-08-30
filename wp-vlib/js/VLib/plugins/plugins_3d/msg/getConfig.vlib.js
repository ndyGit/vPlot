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

			var msg = $container.find( '#msgText' ).val();
			var type = $container.find( '#msgType' ).val();
			var time = $container.find( '#time' ).val();
			var remove = $container.find('#remove').is(':checked');

			var result = {
				msg : msg,
				type : type,
				remove : remove,
				time : time
			};

			return result;
		};

	});
