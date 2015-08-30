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
		 	var name = $('#' + containerId).find('#name').html();
		 	var description = $('#' + containerId).find('#description').html();
		 	var path = $('#' + containerId).find('#path').html();
		 	var mapping = $('#' + containerId).find('#info-mapping').html();
		 	var format = $('#' + containerId).find('#format').html();
		 	var format_row = $('#' + containerId).find('#format-custom-row').val();
		 	var format_col = $('#' + containerId).find('#format-custom-col').val();
		 	var regex = $('#' + containerId).find('#file-regex').val();
		 	if(path === ''){
		 		path = this.defaults.path;
		 	}
		 	if(mapping === ''){
		 		mapping = this.defauts.mapping;
		 	}
		 	if(format === ''){
		 		format = this.defaults.format;
		 	}
		 	var result = {
		 		name : name,
		 		description : description,
		 		path : path,
		 		mapping : mapping,
		 		format : format,
		 		format_row : format_row,
		 		format_col : format_col,
		 		regex : regex
		 	};
		 	console.log("[ file ][getConfig] " + JSON.stringify(result));
		 	return result;
		 };

		});
