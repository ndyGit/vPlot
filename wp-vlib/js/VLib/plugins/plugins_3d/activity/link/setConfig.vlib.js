define(
	['require', 'jquery'],
	function ( require, $ ) {
		var showHtmlBySelection = function ( container, selection ) {
			"use strict";
			var hyperlinkContainer = container.find( '#option-link-hyperlink' );
			var plotContainer = container.find( '#option-link-plot' );
			var fileContainer = container.find( '#option-link-file' );
			hyperlinkContainer.slideUp();
			plotContainer.slideUp();
			fileContainer.slideUp();
			switch ( selection ) {
				case 'hyperlink':
					hyperlinkContainer.slideDown();
					break;
				case 'plot':
					plotContainer.slideDown();
					break;
				case 'file':
					fileContainer.slideDown();
					break;
			}
		};
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
		return function ( config, containerId, external ) {
			var c = $( '#' + containerId );
			var files = external.files;
			var plots = external.plots;

			var plotSelection = c.find( '#selectPlot' );

			for ( var i = 0, il = plots.length; i < il; ++i ) {
				plotSelection.append( '<option value="' + plots[i].id + '">[ id=' + plots[i].id + ' ][ name=' + plots[i].name + ' ]</option>' );
			}

			if ( config == "" || config === undefined ) {
				config = {
					blank   : this.defaultBlank,
					link    : '',
					linkType: 'hyperlink'
				};
			}
			c.find( 'input[type=radio][value=' + config.linkType + ']' ).attr( 'checked', 'checked' );
			if ( config.blank === undefined ) {
				config.blank = this.defaultBlank;
			}
			if ( config.linkType === undefined ) {
				config.linkType = this.defaultLinkType;
			}
			switch ( config.linkType ) {
				case 'hyperlink':
					if ( config.blank === true ) {
						c.find( '#hyperlinkBlank' ).attr( 'checked', 'checked' );
					}
					if ( config.link !== undefined ) {
						$( '#' + containerId ).find( '#hyperlink' ).val( config.link );
					}
					break;
				case 'plot':
					c.find( '#selectPlot option[value='+config.link+']' ).attr('selected','selected');
					break;
			}


			showHtmlBySelection( c, config.linkType );


			/* click event */
			c.find( 'input[type=radio][name=optionLinkType]' ).on( 'change', function ( e ) {
				"use strict";
				e.preventDefault();
				e.stopPropagation();

				var value = $( this ).val();
				showHtmlBySelection( c, value );
				return false;
			} );
		};
	} );
