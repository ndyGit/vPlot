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
			var $container = $( '#' + containerId );

			if ( config === "" || config === undefined ) {

				config = {
					position : this.defaults.position,
					useDataLabel   : this.defaults.useDataLabel,
					customText : this.defaults.customText,
					offset : {
						x : this.defaults.offset.x,
						y : this.defaults.offset.y
					}
				};
			}
			if(config.position === undefined){
				config.position= this.defaults.position;
			}
			if(config.animation === undefined){
				config.animation= this.defaults.animation;
			}
			if(config.useDataLabel === undefined){
				config.useDataLabel= this.defaults.useDataLabel;
			}
			if(config.customText === undefined){
				config.customText = this.defaults.customText;
			}
			if(config.offset === undefined){
				config.offset = this.defaults.offset;
			}
			if(config.offset.x === undefined){
				config.offset.x = this.defaults.offset.x;
			}
			if(config.offset.y === undefined){
				config.offset.y = this.defaults.offset.y;
			}

			$container.find( 'input[type=radio][name=optionPosition][value=' + config.position + ']' ).attr( 'checked', 'checked' );
			$container.find( 'input[type=radio][name=optionAnimation][value=' + config.animation + ']' ).attr( 'checked', 'checked' );

			if(config.useDataLabel){
				$container.find(' #useDataLabel').attr('checked','checked');
			}

			$container.find(' #customText').val( unescape( config.customText ) );
			$container.find(' #offset-x' ).val( config.offset.x);
			$container.find(' #offset-y' ).val( config.offset.y);

			/* slider */
			$('#' + containerId ).find(' #offsetSliderX').slider({
				orientation: "horizontal",
				range: "min",
				min: -200,
				max: 200,
				value: config.offset.x,
				slide: function (event, ui) {
					$container.find(' #offset-x').val(ui.value);
				}
			});
			$('#' + containerId ).find(' #offsetSliderY').slider({
				orientation: "horizontal",
				range: "min",
				min: -200,
				max: 200,
				value: config.offset.y,
				slide: function (event, ui) {
					$container.find(' #offset-y').val(ui.value);
				}
			});

		};
	} );
