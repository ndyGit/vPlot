define(
	['require', 'jquery'],
	function ( require, $ ) {

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
		return function ( config, containerId ) {
			var $container = $('#'+containerId);
			var context = this;
			if( config === undefined || config === '' ){
				config = this.defaults;
			}

			if(config.easing !== undefined){
				$container.find('#easing').val(config.easing);
				$container.find('#easingSelect').val(config.easing).attr('selected', 'selected');
			}else{
				$container.find('#easing').val(this.defaults.easing).attr('selected', 'selected');
			}

			if(config.duration !== undefined){
				$container.find('#duration').val(config.duration);
			}else {
				$container.find('#duration').val(this.defaults.duration);
				config.duration = this.defaults.duration;
			}
			$container.find(' #easingSelect').change(function(){
				var selected = $(this).find('option:selected');
				$container.find(' #easing').val(selected.val());
			});
			$container.find(' #durationSlider').slider({
				orientation: "horizontal",
				range: "min",
				min: 0.1,
				max: 10,
				value: config.duration,
				step : 0.1,
				slide: function (event, ui) {
					$container.find('#duration').val(ui.value);
				}
			});

		};
	} );
