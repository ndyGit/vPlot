define(
	['require', 'config', 'jquery'],
	function ( require, Config, $ ) {
		var xScaleDefault = Config.defaults.scale.x
		var yScaleDefault = Config.defaults.scale.y;
		var zScaleDefault = Config.defaults.scale.z;
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

			if ( config === "" || config === undefined ) {
				config = {
					name              : this.defaults.name,
					dataInterpretation: this.defaults.dataInterpretation,
					scale             : {},
					offset            : {
						x: this.defaults.offset.x,
						y: this.defaults.offset.y
					}
				};
			}
			var $container = $( '#' + containerId );
			if ( config.scale === undefined ) {
				config.scale = {};
			}
			if ( config.name === undefined ) {
				$container.find( '#name' ).val( this.defaults.name );
			} else {
				$container.find( '#name' ).val( unescape( config.name ) );
			}
			if ( config.scale.x !== undefined ) {
				$container.find( '#xScale' ).val( config.scale.x );
			} else {
				$container.find( '#xScale' ).val( xScaleDefault );
			}
			if ( config.scale.y !== undefined ) {
				$container.find( '#yScale' ).val( config.scale.y );
			} else {
				$container.find( '#yScale' ).val( yScaleDefault );
			}
			if ( config.scale.z !== undefined ) {
				$container.find( '#zScale' ).val( config.scale.z );
			} else {
				$container.find( '#zScale' ).val( zScaleDefault );
			}

			if ( config.offset === undefined ) {
				config.offset = this.defaults.offset;
			}
			if ( config.offset.x === undefined ) {
				config.offset.x = this.defaults.offset.x;
			}
			if ( config.offset.y === undefined ) {
				config.offset.y = this.defaults.offset.y;
			}
			$container.find(' #offset-x' ).val( config.offset.x);
			$container.find(' #offset-y' ).val( config.offset.y);

			if ( config.dataInterpretation === undefined ) {
				config.dataInterpretation = this.defaults.dataInterpretation;
			}

			$container.find( 'input[type=radio][name=optionDataInterpretation][value=' + config.dataInterpretation + ']' ).attr( 'checked', 'checked' );

			/* slider */
			$('#' + containerId ).find(' #offsetSliderX').slider({
				orientation: "horizontal",
				range: "min",
				min: 0,
				max: 20,
				value: config.offset.x,
				slide: function (event, ui) {
					$container.find(' #offset-x').val(ui.value);
				}
			});
			$('#' + containerId ).find(' #offsetSliderY').slider({
				orientation: "horizontal",
				range: "min",
				min: 0,
				max: 20,
				value: config.offset.y,
				slide: function (event, ui) {
					$container.find(' #offset-y').val(ui.value);
				}
			});

			$container.find( '.nav-tabs a' ).click( function ( e ) {
				e.preventDefault();
				$( this ).tab( 'show' );
				var targetId = $( this ).attr( 'href' );
				$container.find( '.tab-pane' ).removeClass( 'active' );
				$container.find( targetId ).addClass( 'active' );
			} );
		};
	} );
