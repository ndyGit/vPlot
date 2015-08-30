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
							Group-List <small>{v}Plot.js</small>
						</span>
				</div>

				<form class="navbar-form navbar-right" role="search">
					<button type="button" class="btn navbar-btn disabled">
						Groups <span class="badge" id="badge-plots">0</span></button>
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
	<div class="center">
		<ul class="pagination"></ul>
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
var GroupListController = GroupListController || (function ( wp ) {

		var wordpress = wp;
		var createGroupPostCallback = function () {
			alert( 'noop' );
		};
		var loadGroupsCallback = function () {
			alert( 'noop' );
		};
		var deleteGroupCallback = function () {
			alert( "noop" );
		};

		var container = jQuery( '#vplot_list' );
		var $pageinationContainer = jQuery( '.pagination' );
		var $filterContainer = jQuery( '#plot-list-filter' );
		var $badgeContainer = jQuery( '#badge-plots' );

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
		var thumbnail = jQuery( '<div />', {
			class: 'thumbnail'
		} );

		var caption = jQuery( '<div />', {
			class: 'caption'
		} );
		var page = jQuery( '<li />' ).append( '<a href="#">x</a>' );
		thumbnail.append( caption );
		dsContainer.append( thumbnail );
		/********************************************/
		var updatePagination = function ( data ) {
			$pageinationContainer.empty();
			if ( !data ) {
				console.warn( "[ GroupListController.updatePagination() ] Data not loaded yet!" );
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

			$pageinationContainer.append( back );
			if ( range[0] !== 1 ) {
				tmp = page.clone();
				tmp.find( 'a' ).html( '...' );
				tmp.attr( 'class', 'disabled' );
				$pageinationContainer.append( tmp );
			}
			for ( var i = range[0], len = range[1]; i <= len; ++i ) {

				tmp = page.clone();
				tmp.find( 'a' ).html( i );
				tmp.find( 'a' ).attr( 'id', i );
				tmp.find( 'a' ).attr( 'class', 'page' );
				if ( activePage === i ) {
					tmp.attr( 'class', 'active' );
				}
				$pageinationContainer.append( tmp );
			}
			if ( range[1] < pages ) {
				tmp = page.clone();
				tmp.find( 'a' ).html( '...' );
				tmp.attr( 'class', 'disabled' );
				$pageinationContainer.append( tmp );
			}
			$pageinationContainer.append( next );

			$pageinationContainer.find( '.page' ).click( function () {
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
		};
		var getElement = function ( dataset ) {

			var controlsContainer = jQuery( '<div />', {class: 'modal-footer'} );
			var controls = '<p><a href="#" id="' + dataset.id + '" class="btn btn-default btn-post" role="button"><span class="glyphicon glyphicon-comment"></span><span style="padding-left:5px;">Post it</span></a>';
			controls += '<a href="' + wordpress.adminUrl + '?page=group&id=' + dataset.id + '" class="btn btn-primary btn-edit" role="button"><span class="glyphicon glyphicon-folder-open"></span> <span style="padding-left:5px;">Edit</span></a>';
			controls += '<a href="#" id="' + dataset.id + '" class="btn btn-danger btn-delete" role="button"><span class="glyphicon glyphicon-trash"></span> <span style="padding-left:5px;">Delete</span></a></p>';

			var element = dsContainer.clone();

			controlsContainer.append( controls );
			element.find( '.caption' )
				//.append( '<span class="glyphicon glyphicon-folder-open"></span> ')
				.append( '<h3>' + unescape( dataset.name ) + '</hr>' )
				.append( '<p>' + dataset.time + '</p>' )
				.append( '<p>' + unescape( dataset.description ) + '</p>' )
				.append( '<div class="alert alert-warning"><b>wp-shortcode</b> [vGroup id=' + dataset.id + ']</div>' )
				.append( controlsContainer );

			container.append( element );
			return element;

		};
		var showElements = function ( data ) {
			if ( !data ) {
				console.warn( "[ GroupListController.updatePagination() ] Data not loaded yet!" );
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
			$badgeContainer.html( dataLen );
			jQuery( '.btn-delete' ).bind( 'click', function () {
				var id = jQuery( this ).attr( 'id' );
				var group = getGroup( id );
				if ( confirm( 'Delete [ id=' + group.id + ' ] ' + unescape(group.name) + '?' ) ) {
					deleteGroup( id );
				}
			} );
			jQuery( '.btn-post' ).bind( 'click', function () {
				var id = jQuery( this ).attr( 'id' );
				var plot = getGroup( id );
				if ( confirm( 'Create Post [vGroup id=' + plot.id + ' ] ' + unescape(plot.name) + '?' ) ) {
					createGroupPost( id );
				}
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

		var deleteGroup = function ( id ) {
			deleteGroupCallback( function () {
				location.reload();
			}, this, id );
		};

		var loadGroups = function () {
			loadGroupsCallback( function ( data ) {
				data_ = data.reverse();
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
			$filterContainer.val( '' );
			$filterContainer.keyup( function ( e ) {
				if ( '' === $filterContainer.val() ) {
					showElements( data_ );
					updatePagination( data_ );
					return;
				}
				var data = jQuery.grep( data_, function ( n, i ) {
					return n.name.indexOf( $filterContainer.val() ) >= 0 || n.description.indexOf( $filterContainer.val() ) >= 0;
				} );
				activePage = 1;
				showElements( data );
				updatePagination( data );
			} );
		};
		return {
			setCreateGroupPostCallback: function ( cb ) {
				createGroupPostCallback = cb;
			},
			setLoadGroupsCalback      : function ( cb ) {
				loadGroupsCallback = cb;
			},
			setDeleteFileCalback     : function ( cb ) {
				deleteGroupCallback = cb;
			},
			run                       : function () {
				loadGroups();
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
		GroupListController.setCreateGroupPostCallback( db.createGroupPost );
		GroupListController.setDeleteFileCalback( db.deleteGroup );
		GroupListController.setLoadGroupsCalback( db.loadGroups );

		GroupListController.run();
	} );
} );

</script>
</body>
</html>
