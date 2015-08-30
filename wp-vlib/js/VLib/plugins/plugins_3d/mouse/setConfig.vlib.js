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
		 	var c = $('#'+containerId);
		 	if (config == "" || config === undefined) {
		 		config = {
		 			activity : this.defaultActivity,

		 			lockActive : this.defaultLockActive
		 		};
		 	}
		 	if(config.activity !== undefined){
		 		$('#' + containerId).find('#activity').val(config.activity);
		 		$('#' + containerId ).find('#activitySelect').val(config.activity).attr('selected', 'selected');
		 	}else{
		 		$('#' + containerId).find('#activity').val(config.defaultActivity);
		 	}


			if (config.lockActive !== undefined) {
				if(config.lockActive === true){
					c.find('#lockActive').attr('checked','checked');
				}
			}

		 	$('#' + containerId ).find(' #activitySelect').change(function(){
		 		var selected = $(this).find('option:selected');
		 		$('#' + containerId ).find(' #activity').val(selected.val());
		 	});
		 };
		});
