define(
	['require', 'jquery', 'core/Utils.vlib', 'config'],
	function ( require, $, UTILS, Config ) {


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

			console.log( "[ file ][setConfig] " + JSON.stringify( config ) );

			if ( config == "" || config === undefined ) {
				config = {data: []};
			}
			var $container = $( '#' + containerId );
			var files = external.files || [];
			var context = this;
			var file_index = 0;
			var preview_row = 0;
			var mappings = [];
			var formats = UTILS.FileReader.FORMAT;
			var format_index = UTILS.FileReader.FORMAT.TSV;
			var selected_format;

			var file_select = $container.find( '#fileSelect' );
			var file = $container.find( '#file' );
			var path = $container.find( 'input[id=path]' );
			var file_row_back = $container.find( '#file-row-back' );
			var file_row_next = $container.find( '#file-row-next' );
			var preview_rows = $container.find( '#preview_rows' );
			var preview_current_row = $container.find( '#current_preview_row' );
			var format_select = $container.find( '#formatSelect' );
			var format = $container.find( '#format' );
			var mapping_table = $container.find( '#mapping-table' );
			var mapping_add = $container.find( '#mapping-add' );
			var custom_row_sep = $container.find( '#format-custom-row' );
			var custom_col_sep = $container.find( '#format-custom-col' );
			var placeholder_regex = '';
			var regex_info_container = $container.find( '#info-placeholder-regex' );
			var regex_container = $( '#file-regex' );

			var updateInfo = function ( index, files, format ) {
				var mapping_string = mappings.join( '-' );
				if ( files[index] !== undefined ) {
					$container.find( '#info-name' ).html( files[index].name );
					$container.find( '#path' ).html( files[index].path );
					$container.find( '#info-link' ).html( files[index].name + '.dat' );
					$container.find( '#info-link' ).attr( "href", Config.getExternalDataPath() + files[index].path );
					$container.find( '#info-description' ).html( files[index].description );
					$container.find( '#info-format' ).html( format );
					$container.find( '#info-mapping' ).html( mapping_string );
					$container.find( '#file-info' ).fadeIn();
					$container.find( '#info-placeholder' ).fadeOut();
				} else if ( index === -1 ) {
					$container.find( '#file-info' ).fadeOut();
					$container.find( '#info-placeholder' ).fadeIn();
					$container.find( '#info-name' ).html( 'PLACEHOLDER' );
					$container.find( '#info-placeholder-format' ).html( format );
					$container.find( '#info-placeholder-mapping' ).html( mapping_string );
					$container.find( '#info-mapping' ).html( mapping_string );
					$container.find( '#info-placeholder-regex' ).html( placeholder_regex );
				}


			};
			var getMapSelect = function ( col, key ) {
				var select = '<select id="mapping-select-' + col + '"class="form-control">';
				for ( var k in context.MAP ) {
					if ( context.MAP.hasOwnProperty( k ) ) {
						if ( key === context.MAP[k] ) {
							select += '<option value="' + context.MAP[k] + '" SELECTED>' + context.MAP[k] + '</option>';
						} else {
							select += '<option value="' + context.MAP[k] + '">' + context.MAP[k] + '</option>';
						}
					}
				}
				select += '<select>';
				return select;
			};

			var getMapping = function ( col, key, value ) {
				var row = '<tr class="mapping">' +
					'<td>' + col + '</td>' +
					'<td>' + getMapSelect( col, key ) + '</td>' +
					'<td>' + value + '</td>' +
					'<td ><button type="button" class="btn btn-danger" id="mapping-delete-' + col + '">' +
					'<span class="glyphicon glyphicon-remove" ></span></button></td>' +
					'</tr>';
				return row;
			};
			var updateMappingTable = function ( mappings, mapping_table, reader, row ) {

				mapping_table.html( "" );
				var value = "";
				for ( var i = 0, len = mappings.length; i < len; ++i ) {
					if ( reader ) {
						value = reader.getCell( row, i );
						if ( value === '' ) {
							value = false;
						}
					} else {
						value = false;
						console.warn( '[ File.updateMappingTable() ] No FileReader found!' );
					}
					mapping_table.append( getMapping( i, mappings[i], value ) );
				}
				attachDeletemapping( containerId );
				attachMapSelectListener();
				updateInfo( file_index, files, format_index );
			};
			var attachDeletemapping = function ( containerId ) {
				var del = $( 'button[id*=mapping-delete-]' );
				var id;
				del.click( function () {
					id = this.id.split( '-' )[2];
					mappings.splice( id, 1 );
					$( this ).closest( '.mapping' ).remove();
					updateMappingTable( mappings, mapping_table, context.reader, preview_row );
				} );

			};
			var attachMapSelectListener = function ( containerId ) {
				var map_selects = $( '[id*=mapping-select-]' );
				map_selects.change( function () {
					var id = this.id.split( '-' )[2];
					var selected = $( this ).find( 'option:selected' ).val();
					mappings[id] = selected;
					updateInfo( file_index, files, format_index );
				} );
			};

			var fetchDataAndUpdate = function(){
				"use strict";
				if ( file_index == -1 || files[file_index] === 'undefined' ) {
					preview_rows.html( 0 );
					return false;
				}
				context.reader.update( files[file_index].path, function () {
					"use strict";
					preview_rows.html( context.reader.getRowCount() );
					updateMappingTable( mappings, mapping_table, context.reader, preview_row );
				} );
			};

			/* FILL FILE SELECT */
			file_select.append( '<option value="-1">PLACEHOLDER</option>' );
			for ( var i = 0, len = files.length; i < len; ++i ) {
				file_select.append( '<option value="' + i + '">' + files[i].name + '</option>' );
			}

			if ( config.path !== undefined && config.path != '' ) {
				path.val( config.path );
				for ( var index = 0, len = files.length; index < len; ++index ) {
					if ( files[index].path == config.path ) {
						file_index = index;
						file_select.val( file_index ).attr( 'selected', 'selected' );
						$container.find( '#file-regex-container' ).fadeOut();
						break;
					}
				}
			} else {
				file_index = -1;
				file_select.val( file_index ).attr( 'selected', 'selected' );
				$container.find( '#file-regex-container' ).fadeIn();
			}
			/* ADDITIONAL DATA */
			if ( config.data !== undefined ) {
				$container.find( 'input[id=data]' ).val( JSON.stringify( config.data ) );
			}

			/* FORMAT SELECT */
			for ( key in formats ) {
				if ( formats.hasOwnProperty( key ) ) {
					format_select.append( '<option value="' + formats[key] + '">' + formats[key] + '</option>' );
				}
			}
			if ( config.format !== undefined && config.format != '' ) {
				format.html( config.format );
				format_index = config.format;
				$container.find( '#info-format' ).html( config.format );
				format_select.val( config.format ).attr( 'selected', 'selected' );
				if ( config.format === UTILS.FileReader.FORMAT.CUSTOM ) {
					$( '#format-cutom-container' ).fadeIn();
				}
			} else {
				format_index = UTILS.FileReader.FORMAT.TSV;
				/* DEFAULT: select first file*/
				format_select.val( format_index ).attr( 'selected', 'selected' );
			}

			if ( config.format_row !== undefined ) {
				custom_row_sep.val( config.format_row );
			}
			if ( config.format_col !== undefined ) {
				custom_col_sep.val( config.format_col );
			}

			/* MAPPING*/
			if ( config.mapping !== undefined && config.mapping != '' ) {
				mappings = config.mapping.split( "-" );
			} else {
				mappings = this.defaults.mapping.split( "-" );
			}
			if ( config.regex !== undefined && config.regex != '' ) {
				regex_container.val( config.regex );
				placeholder_regex = config.regex;
			}

			if ( files[file_index] !== undefined ) {
				context.reader.update( files[file_index].path, function () {
					"use strict";
					preview_rows.html( context.reader.getRowCount() );
					updateMappingTable( mappings, mapping_table, context.reader, preview_row );

				});
			}
			/* ADD NEW MAPPING */
			mapping_add.click( function () {
				mappings.push( context.MAP.IGNORE );
				updateMappingTable( mappings, mapping_table, context.reader, preview_row );
			} );

			/* DATASET PREVIEW */
			preview_current_row.html( preview_row );

			file_row_next.unbind('click');
			file_row_next.click( function () {
				if ( preview_row < context.reader.getRowCount() ) {
					preview_row++;
					preview_current_row.html( preview_row );
					updateMappingTable( mappings, mapping_table, context.reader, preview_row );
				}
			} );
			file_row_back.unbind('click');
			file_row_back.click( function () {
				if ( preview_row > 0 ) {
					preview_row--;
					preview_current_row.html( preview_row );
					updateMappingTable( mappings, mapping_table, context.reader, preview_row );
				}
			} );

			var custom_button = $container.find( '#format-cutom-update' );
			custom_button.click( function () {
				if ( custom_row_sep.val() === '\\n' ) {
					custom_row_sep.val( "<newline>" );
				}
				if ( custom_row_sep.val() === '\\t' ) {
					custom_row_sep.val( "<tab>" );
				}
				if ( custom_row_sep.val() === ' ' ) {
					custom_row_sep.val( "<space>" );
				}
				if ( custom_col_sep.val() === '\\n' ) {
					custom_col_sep.val( "<newline>" );
				}
				if ( custom_col_sep.val() === '\\t' ) {
					custom_col_sep.val( "<tab>" );
				}
				if ( custom_col_sep.val() === ' ' ) {
					custom_col_sep.val( "<space>" );
				}
				context.reader.setRowSeperator( custom_row_sep.val() );
				context.reader.setColSeperator( custom_col_sep.val() );
				preview_rows.html( context.reader.getRowCount() );
				updateMappingTable( mappings, mapping_table, context.reader, preview_row );
			} );
			format_select.change( function () {
				var file = '';
				if ( files[file_index] !== undefined ) {
					file = files[file_index];
				}

				selected_format = $( this ).find( 'option:selected' ).val();
				$container.find( '#format' ).html( selected_format );
				switch ( selected_format ) {
					case UTILS.FileReader.FORMAT.TSV :
						$container.find( '#format-cutom-container' ).fadeOut();
						context.reader = new UTILS.FileReader.TSVReader( file.path, mappings.join( '-' ) );
						break;
					case UTILS.FileReader.FORMAT.CSV :
						$container.find( '#format-cutom-container' ).fadeOut();
						context.reader = new UTILS.FileReader.CSVReader( file.path, mappings.join( '-' ) );
						break;
					case UTILS.FileReader.FORMAT.CUSTOM :
						$container.find( '#format-cutom-container' ).fadeIn();

						context.reader = new UTILS.FileReader.CustomReader( file.path,
							mappings.join( '-' ),
							custom_row_sep.val(),
							custom_col_sep.val() );
						break;
					default :
						$container.find( '#format-cutom-container' ).fadeOut();
						console.warn( "[ File.change( format ) ] Unknown file format. > " + selected_format );
						return;
						break;
				};

				format_index = selected_format;
			} );

			file_select.change( function ( e ) {
				e.preventDefault();
				e.stopPropagation();
				var selected = $( this ).find( 'option:selected' );
				file_index = selected.val();



				if ( selected.val() == -1 ) {
					$container.find( '#file-regex' ).html( "" );
					$container.find( '#file-regex-container' ).fadeIn();
				} else {
					$container.find( '#file-regex' ).html( "" );
					$container.find( '#file-regex-container' ).fadeOut();
				}
			} );

			$container.find( '.nav-tabs a' ).click( function ( e ) {
				e.preventDefault();
				$( this ).tab( 'show' );
				var targetId = $( this ).attr( 'href' );
				$container.find( '.tab-pane' ).removeClass( 'active' );
				$container.find( targetId ).addClass( 'active' );
				if($(this ).attr('href') === "#mapping-tab"){

					fetchDataAndUpdate();

				}
			} );

		}
	} );
