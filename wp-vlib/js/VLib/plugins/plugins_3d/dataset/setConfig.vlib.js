define(
	['require', 'config', 'jquery'],
	function ( require, Config, $ ) {

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
			console.log( "[ dataset ][setConfig] " + JSON.stringify( config ) );

			var context = this;
			var $container = $( '#' + containerId );
			var $mappingAdd = $container.find( '#mapping-add' );
			var $mappingTable = $container.find( '#mapping-table' );
			var mappings = [];
			var $dataContainer = $container.find( 'input[id=data]' );
			var $dataMappingInput = $container.find( '#data-mapping' );
			var $dataAddContainer = $container.find( '#dataset-add-data' );
			var $input = $( '<input />', {type: 'text', style: 'width:100%'} );
			var $row = $( '<tr/>' );


			if ( config == "" || config === undefined ) {
				config = {data: []};
			}
			if ( config.data !== undefined ) {
				$container.find( 'input[id=data]' ).val( JSON.stringify( config.data ) );
			}
			if ( config.mapping !== undefined ) {
				$dataMappingInput.val( config.mapping );
				mappings = config.mapping.split( '-' );
			}

			var data_ = config.data;
			//HELPER
			//****************************************************************
			var getMapSelect = function ( col, key ) {
				var select = '<select id="mapping-select-' + col + '"class="form-control">';
				for ( k in context.MAP ) {
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
			var updateMappingTable = function ( mappings, mapping_table ) {

				mapping_table.html( "" );
				var value = "";
				for ( var i = 0, len = mappings.length; i < len; ++i ) {

					mapping_table.append( getMapping( i, mappings[i], value ) );
				}
				attachDeletemapping( containerId );
				attachMapSelectListener();
				$dataMappingInput.val( mappings.join( '-' ) );
				initAddControls();
			};
			var attachDeletemapping = function ( containerId ) {
				var del = $( 'button[id*=mapping-delete-]' );
				var id;
				del.click( function () {
					id = this.id.split( '-' )[2];
					mappings.splice( id, 1 );
					$( this ).closest( '.mapping' ).remove();
					updateMappingTable( mappings, $mappingTable );
					refreshDataTable( data_ );
				} );

			};
			var attachMapSelectListener = function ( containerId ) {
				var map_selects = $( '[id*=mapping-select-]' );
				map_selects.change( function () {
					var id = this.id.split( '-' )[2];
					var selected = $( this ).find( 'option:selected' ).val();
					mappings[id] = selected;
					$dataMappingInput.val( mappings.join( '-' ) );
					initAddControls();
					refreshDataTable( data_ );
				} );
			};
			/* ADD NEW MAPPING */
			$mappingAdd.click( function () {
				mappings.push( context.MAP.IGNORE );
				updateMappingTable( mappings, $mappingTable, context.reader );
			} );

			//****************************************************************
			var updateDataContainer = function () {
				"use strict";
				$dataContainer.val( JSON.stringify( data_ ) );
			};
			var editData = function ( index, key, value ) {
				"use strict";
				data_[index][key] = value;
				updateDataContainer();
			};
			var attachDataChangeListener = function ( containerId ) {
				"use strict";
				var value, id;
				var $data = $( '#' + containerId ).find( '.dataset-data-field' );
				$data.on( 'keyup', function () {
					id = $( this ).attr( 'id' ).split( '-' );
					value = $( this ).val();
					editData( id[0], id[1], value );
				} )
			};

			var refreshDataTable = function ( data ) {

				var $tableBody = $container.find( '#dataTableContainer' );
				var $tableHeader = $container.find( '#dataTableHeader' );

				var $tableHeaderRow = $( '<tr/>' );
				var mappedValue, mappingsLen = mappings.length;
				$tableBody.html( '' );

				for ( var i = 0, len = mappings.length; i < len; ++i ) {
					$tableHeaderRow.append( $( '<td/>' ).html( mappings[i] ) );
				}
				$tableHeader.html( $tableHeaderRow );

				$.each( data, function ( i, o ) {
					$row.html( '' );
					for ( var j = 0; j < mappingsLen; ++j ) {
						if ( o.hasOwnProperty( mappings[j] ) ) {
							mappedValue = o[mappings[j]];
						} else {
							mappedValue = '';
						}

						$row.append( $( '<td/>' ).html( $input.clone().addClass( 'dataset-data-field' ).val( mappedValue ).attr( 'id', i + '-' + mappings[j] ) ) );
					}
					$row.append( $( '<td/>' ).html( '<button id="' + i + '" type="button" class="deleteData btn btn-xs btn-danger"><span class="glyphicon glyphicon-remove"></span></button>' ) );
					$tableBody.append( $row.clone() );

				} );


				attachDataChangeListener( containerId );
				//****************************************************************
				// delete handle
				$container.find( '.deleteData' ).click( function () {
					var index = $( this ).attr( 'id' );
					data.splice( index, 1 );
					//update container
					updateDataContainer();
					refreshDataTable( data );
				} );
			};
			// add handle
			var groupAdd = function ( group, label ) {
				"use strict";
				var $label = $( '<span />', {class: 'input-group-addon'} ).html( label );
				var $element = $( '<input />', {type: 'text', class: 'form-control dataset-element'} ).html( label );
				group.append( $label ).append( $element );
			};
			var initAddControls = function () {
				"use strict";

				$dataAddContainer.html( '' );
				var $group = $( '<div />', {class: 'input-group', style: 'margin:4px'} );
				var $sizedGroup = $group.clone();
				for ( var i = 0, len = mappings.length; i < len; ++i ) {
					if ( i % 3 === 0 ) {
						$dataAddContainer.append( $sizedGroup );
						$sizedGroup = $group.clone();
					}
					groupAdd( $sizedGroup, mappings[i] );
				}
				$dataAddContainer.append( $sizedGroup );
			};
			$container.find( '#addDataset' ).click( function () {
				var $dataElements = $dataAddContainer.find( '.dataset-element' );
				var dataset = {};
				$.each( $dataElements, function ( index, element ) {
					"use strict";
					dataset[mappings[index]] = $( element ).val();
				} );

				if ( data_ === undefined ) {
					data_ = [];
				}

				data_.push( dataset );
				//update container
				updateDataContainer();
				refreshDataTable( data_ );
				$dataElements.val('');
			} );
			//****************************************************************
			var $pageinationContainer = $container.find( '.pagination' );
			var $geometriesTableHeader = $container.find( '#geometriesTableHeader' );
			var $geometriesTableBody = $container.find( '#geometriesTableContainer' );
			var $page = $( '<li />' ).append( '<a href="#">x</a>' );
			var pages, listSize = 5, activePage = 1, pageRange = 2;
			var fadeDuration = 400;

			var getElement = function ( dataset ) {

				var $element = $row.clone();
				$element.html( '' );
				var mappedValue, mappingsLen = mappings.length;

				for ( var j = 0; j < mappingsLen; ++j ) {
					if ( dataset.hasOwnProperty( mappings[j] ) ) {
						mappedValue = dataset[mappings[j]];
					} else {
						mappedValue = '';
					}
					$element.append( $( '<td/>' ).html( mappedValue ) );
				}

				$geometriesTableBody.append( $element );
				return $element;
			};

			var showElements = function ( data ) {
				"use strict";
				if ( !data || data.length === 0 ) {
					return;
				}
				var dataLen = data.length;
				var e;
				var offset = listSize * (activePage - 1);

				$geometriesTableBody.empty();
				var $tableHeaderRow = $( '<tr/>' );
				var mappingsLen = mappings.length;
				for ( var i = 0; i < mappingsLen; ++i ) {
					$tableHeaderRow.append( $( '<td/>' ).html( mappings[i] ) );
				}
				$geometriesTableHeader.html( $tableHeaderRow );

				for ( var i = 0; i < listSize; ++i ) {
					if ( ( offset + i) >= dataLen ) break;
					e = getElement( data[offset + i] );
					e.delay( i * fadeDuration ).fadeIn( {
						duration: fadeDuration
					} );
				}

			};

			var updatePagination = function ( data ) {
				$pageinationContainer.empty();
				if ( !data ) {
					console.warn( "[ GroupListController.updatePagination() ] Data not loaded yet!" );
					return;
				}
				if ( data.length === 0 ) return;

				var back = $( '<li />' )
					.append( '<a href="#" class="page-back">&laquo;</a>' );
				var next = $( '<li />' )
					.append( '<a href="#" class="page-next">&raquo;</a>' );
				pages = Math.ceil( data.length / listSize );
				var tmp;

				var range_left = activePage - pageRange;
				var range_right = activePage + pageRange;
				var range = [range_left, range_right];

				if ( range_left < 1 ) {
					range[0] = 1;
					range[1] += ( 1 + Math.abs( range_left ) );
				}
				if ( range_right > pages ) {
					range[0] -= (range_right - pages);
					range[1] = pages;
				}
				if ( range[0] < 1 ) range[0] = 1;
				if ( range[1] > pages ) range[1] = pages;

				$pageinationContainer.append( back );
				if ( range[0] !== 1 ) {
					tmp = $page.clone();
					tmp.find( 'a' ).html( '...' );
					tmp.attr( 'class', 'disabled' );
					$pageinationContainer.append( tmp );
				}
				for ( var i = range[0], len = range[1]; i <= len; ++i ) {

					tmp = $page.clone();
					tmp.find( 'a' ).html( i );
					tmp.find( 'a' ).attr( 'id', i );
					tmp.find( 'a' ).attr( 'class', 'page' );
					if ( activePage === i ) {
						tmp.attr( 'class', 'active' );
					}
					$pageinationContainer.append( tmp );
				}
				if ( range[1] < pages ) {
					tmp = $page.clone();
					tmp.find( 'a' ).html( '...' );
					tmp.attr( 'class', 'disabled' );
					$pageinationContainer.append( tmp );
				}
				$pageinationContainer.append( next );

				$pageinationContainer.find( '.page' ).click( function () {
					loadGeometriesPage( $( this ).attr( 'id' ) );
				} );

				$container.find( '.page-back' ).click( function () {
					if ( activePage > 1 ) {
						loadGeometriesPage( ( activePage - 1 ) );
					}
				} );
				$container.find( '.page-next' ).click( function () {
					if ( activePage < pages )
						loadGeometriesPage( ( activePage + 1 ) );
				} );
			};

			var loadGeometriesPage = function ( index ) {
				activePage = parseInt( index );

				showElements( context.env.raw_data );
				updatePagination( context.env.raw_data );
			};

			//****************************************************************

			// fill table
			updateMappingTable( mappings, $mappingTable );
			// set geometries-length info
			$container.find('.geometries-data-len' ).html( context.env.raw_data.length );
			$container.find( '.nav-tabs a' ).click( function ( e ) {
				e.preventDefault();
				$( this ).tab( 'show' );
				var targetId = $( this ).attr( 'href' );
				$container.find( '.tab-pane' ).removeClass( 'active' );
				$container.find( targetId ).addClass( 'active' );
				if ( targetId === '#data-tab' ) {
					refreshDataTable( data_ );
				}
				if ( targetId === '#geometries-tab' ) {
					loadGeometriesPage( 1 );
				}
			} );
		}
	} );
