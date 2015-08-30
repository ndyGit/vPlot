<!DOCTYPE HTML>
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta content="width=device-width, initial-scale=1.0" name="viewport">
	<title>PlotList</title>
	<style>
		.center {
			text-align: center;
		}
	</style>
</head>
<body>
<div class="container">
	<div class="page-header">
		<nav class="navbar navbar-default" role="navigation">
			<div class="container-fluid">
				<!-- Brand and toggle get grouped for better mobile display -->
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
					        data-target="#bs-example-navbar-collapse-1">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					</button>
						<span class="btn navbar-btn disabled navbar-brand">
							File-List <small>{v}Plot.js</small>
						</span>
				</div>

				<form class="navbar-form navbar-right" role="search">
					<button type="button" class="btn navbar-btn disabled">
						Files <span class="badge" id="badge-plots">0</span></button>
					<div class="form-group">
						<input id="plot-list-filter" type="text" class="form-control" placeholder="Filter">
					</div>
				</form>
			</div>
			<!-- /.container-fluid -->
		</nav>

		<div class="center">
			<ul class="pagination"></ul>
		</div>
	</div>
	<div id="vplot_list"></div>
	<div class="page-footer">
		<div class="center">
			<ul class="pagination"></ul>
		</div>
	</div>

</div>
</body>
<script>
/* WORDPRESS DATA */
var vlib_ =###WORDPRESS###;
var wordpress = vlib_ || {basePath: '', appPath: '', templateId: -1};
window.vlib_globals = wordpress;
console.dir( wordpress );
var dataPath = 'data/';
var $ = $ || jQuery;
var FileListController = FileListController || (function ( wp ) {

		var wordpress = wp;

		var loadFilesCallback = function () {
			alert( 'noop' );
		};
		var deleteFileCallback = function () {
			alert( "noop" );
		};
		var updateFileVisibilityCallback = function () {
			alert( "noop" );
		};

		var container = jQuery( '#vplot_list' );
		var pageinationContainer = jQuery( '.pagination' );
		var filterContainer = jQuery( '#plot-list-filter' );
		var badgeContainer = jQuery( '#badge-plots' );

		var data_;
		var listSize = 5;
		var pageRange = 2;
		var pages;
		var fadeDuration = 400;
		var activePage = 1;
		/********************************************/
		/** THUMB CONTAINER **/
		var dsContainer = jQuery( '<div />', {
			class: 'col-sm-3',
			style: "width: 100%; margin-bottom:30px; display:none;"
		} );
		var panel = jQuery( '<div />', {
			class: 'panel panel-default'
		} );

		var header = jQuery( '<div />', {
			class: 'panel-heading'
		} );
		var body = jQuery( '<div />', {
			class: 'panel-body'
		} );
		var page = jQuery( '<li />' ).append( '<a href="#">x</a>' );
		panel.append( header ).append( body );
		dsContainer.append( panel );
		/********************************************/
		var updatePagination = function ( data ) {
			pageinationContainer.empty();
			if ( !data ) {
				console.warn( "[ FileListController.updatePagination() ] Data not loaded yet!" );
				return;
			}
			if ( data.length === 0 ) return;

			var back = jQuery( '<li />' )
				.append( '<a href="#" class="page-back">&laquo;</a>' );
			var next = jQuery( '<li />' )
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

			pageinationContainer.append( back );
			if ( range[0] !== 1 ) {
				tmp = page.clone();
				tmp.find( 'a' ).html( '...' );
				tmp.attr( 'class', 'disabled' );
				pageinationContainer.append( tmp );
			}
			for ( var i = range[0], len = range[1]; i <= len; ++i ) {

				tmp = page.clone();
				tmp.find( 'a' ).html( i );
				tmp.find( 'a' ).attr( 'id', i );
				tmp.find( 'a' ).attr( 'class', 'page' );
				if ( activePage === i ) {
					tmp.attr( 'class', 'active' );
				}
				pageinationContainer.append( tmp );
			}
			if ( range[1] < pages ) {
				tmp = page.clone();
				tmp.find( 'a' ).html( '...' );
				tmp.attr( 'class', 'disabled' );
				pageinationContainer.append( tmp );
			}
			pageinationContainer.append( next );

			pageinationContainer.find( '.page' ).click( function () {
				loadPage( jQuery( this ).attr( 'id' ) );
			} );

			jQuery( '.page-back' ).click( function () {
				if ( activePage > 1 ) {
					loadPage( ( activePage - 1 ) );
				}
			} );
			jQuery( '.page-next' ).click( function () {
				if ( activePage < pages )
					loadPage( ( activePage + 1 ) );
			} );
		}
		var getElement = function ( dataset ) {

			var controlsContainer = jQuery( '<div />', {class: 'modal-footer'} );
			var controls = '<p><a href="#" id="' + dataset.id + '" class="btn btn-danger btn-delete" role="button"><span class="glyphicon glyphicon-trash"></span> <span style="padding-left:5px;">Delete</span></a></p>';

			var element = dsContainer.clone();
			controlsContainer.append( controls );
			var table = '<table class="table table-hover">';
			table += '<tr>';
			table += '<td class="file-table-label">Id:</td><td class="file-table-value">'+dataset.id+'</td>';
			table += ' </tr>';
			table += '<tr>';
			table += '<td class="file-table-label">Path:</td><td class="file-table-value">'+dataset.file_path+'</td>';
			table += ' </tr>';
			table += '<tr>';
			table += '<td class="file-table-label">Creation date:</td><td class="file-table-value">'+dataset.time+'</td>';
			table += ' </tr>';
			table += '<tr>';
			table += '<td class="file-table-label">Description:</td><td class="file-table-value">'+dataset.file_description+'</td>';
			table += ' </tr>';
			table += '<tr>';
			if(dataset.file_is_visible === "1"){
				table += '<td class="file-table-label">';
				table += '<span class="glyphicon glyphicon-refresh file-is-visible-refresh" style="margin-right: 10px; display:none;"></span>';
				table += 'Is visible:</td><td class="file-table-value"><input type="checkbox" name="isVisible" value="'+dataset.id+'" checked="checked"></td>';

			}else{
				table += '<td class="file-table-label">';
				table += '<span class="glyphicon glyphicon-refresh file-is-visible-refresh" style="margin-right: 10px; display:none;"></span>';
				table += 'Is visible:</td><td class="file-table-value"><input type="checkbox" name="isVisible" value="'+dataset.id+'"></td>';
			}
			table += ' </tr>';
			table += '</table>';
			element.find('.panel-heading')
				.append( '<b>'+ dataset.file_name  + '</b>' );
			element.find( '.panel-body' )
				.append( table )
				.append( controlsContainer );

			container.append( element );
			return element;

		};
		var showElements = function ( data ) {
			if ( !data ) {
				console.warn( "[ FileListController.updatePagination() ] Data not loaded yet!" );
				return;
			}
			if ( data.length === 0 ) return;
			var dataLen = data.length;
			var e;
			var offset = listSize * (activePage - 1);
			container.empty();
			for ( var i = 0; i < listSize; ++i ) {
				if ( ( offset + i) >= dataLen ) break;
				e = getElement( data[offset + i] );
				e.delay( i * fadeDuration ).fadeIn( {
					duration: fadeDuration
				} );
			}
			badgeContainer.html( dataLen );
			jQuery( '.btn-delete' ).bind( 'click', function (e) {
				e.preventDefault();
				e.stopPropagation();
				var id = jQuery( this ).attr( 'id' );
				var group = getGroup( id );
				if ( confirm( 'Delete [ id=' + group.id + ' ] ' + group.file_name + '?' ) ) {
					deleteFile( id );
				}
			} );

			jQuery( '[name=isVisible]' ).bind( 'change', function () {
				var id = jQuery( this ).val();
				updateFileVisibility(this, id, this.checked);
			} );

		};
		var getGroup = function ( id ) {
			var plot;
			for ( var i = 0, len = data_.length; i < len; ++i ) {
				if ( data_[i].id === id ) {
					plot = data_[i];
				}
			}
			return plot;
		};
		var getIndexById = function ( id ) {
			var plot;
			for ( var i = 0, len = data_.length; i < len; ++i ) {
				if ( data_[i].id === id ) {
					return i;
				}
			}
			return -1;
		};

		var createGroupPost = function ( id ) {
			createGroupPostCallback( function ( postId ) {
				if ( !isNaN( postId ) ) {
					var target = wordpress.adminUrl.replace( 'admin.php', '' );
					target += 'post.php?post=' + postId + '&action=edit'
					location.href = target;
				} else {
					alert( 'Insert post failed.' );
				}

			}, this, id );
		};

		var deleteFile = function ( id ) {
			deleteFileCallback( function () {
				location.reload();
			}, this, [ id ] );
		};
		var updateFileVisibility = function ( target, id, isVisible ) {
			var refreshIcon = $( target ).parent().parent().find('.file-is-visible-refresh' );
			refreshIcon.fadeIn();
			updateFileVisibilityCallback( function (response) {

				refreshIcon.fadeOut();
			}, this, id, isVisible  );
		};

		var loadFiles = function () {
			loadFilesCallback( function ( data ) {
				data_ = data;
				showElements( data_ );
				updatePagination( data_ );
			}, this );
		};

		var loadPage = function ( index ) {
			activePage = parseInt( index );
			showElements( data_ );
			updatePagination( data_ );
		};
		var attachFilter = function () {
			filterContainer.val( '' );
			filterContainer.keyup( function ( e ) {
				if ( '' === filterContainer.val() ) {
					showElements( data_ );
					updatePagination( data_ );
					return;
				}
				var data = jQuery.grep( data_, function ( n, i ) {
					console.log(n);
					return n.file_name.indexOf( filterContainer.val() ) >= 0 || n.file_description.indexOf( filterContainer.val() ) >= 0 || n.file_path.indexOf( filterContainer.val() ) >= 0;
				} );
				activePage = 1;
				showElements( data );
				updatePagination( data );
			} );
		};
		return {
			setUpdateFileVisibilityCalback : function( cb ){
				updateFileVisibilityCallback = cb;
			},
			setLoadFilesCalback      : function ( cb ) {
				loadFilesCallback = cb;
			},
			setDeleteFileCalback     : function ( cb ) {
				deleteFileCallback = cb;
			},
			run                       : function () {
				loadFiles();
				attachFilter();
			},
			load                      : loadPage,
			activePage                : activePage
		}
	})(###WORDPRESS### );


jQuery( document ).ready( function () {
	requirejs.config( {
		baseUrl: wordpress.basePath + wordpress.appPath,
		paths  : {
			'config': 'config.vlib',
			'jquery': 'libs/vendor/jquery/dist/jquery.min'
		}

	} );
	require( ['../wp-database-driver'], function ( DBDriver ) {
		console.log( "WP-BACKEND-LIST-PLOTS" );
		var db = new DBDriver( wordpress );
		FileListController.setUpdateFileVisibilityCalback( db.updateFileVisibility);
		FileListController.setDeleteFileCalback( db.deleteFiles);
		FileListController.setLoadFilesCalback( db.loadAllFiles );

		FileListController.run();
	} );
} );

</script>
</body>
</html>
