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
		 	var antialias = c.find('#antialias').is(':checked');
		 	var alpha = c.find('#alpha').is(':checked');

		 	var sceneWidth = c.find('#sceneWidth').val();
		 	var sceneHeight = c.find('#sceneHeight').val();


			var envmap = c.find( 'select[id=envmapSelect] option:selected' ).val();


		 	var result = {
		 		antialias : antialias,
		 		alpha : alpha,
		 		scene : {
		 			width : sceneWidth,
		 			height : sceneHeight
		 		},
			    envmap : envmap

		 	};

		 	return result;
		 };

		});
