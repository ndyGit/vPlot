define(
	[ 'require', 'jquery'],
	function(require, $) {

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
		 	if (config == "" || config === undefined) {
		 		config = {
		 			state : this.defaultState
		 		};
		 	}
		 	if(config.state !== undefined){
			    $container.find('#state').val(config.state);
			    $container.find('#stateSelect').val(config.state).attr('selected', 'selected');
		 	}else{
			    $container.find('#state').val(config.defaultState);
		 	}


			 $container.find(' #stateSelect').change(function(){
		 		var selected = $(this).find('option:selected');
		 		$('#' + containerId ).find(' #state').val(selected.val());
		 	});
		 };
		});
