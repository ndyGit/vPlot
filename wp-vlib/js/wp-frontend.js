console.log( "WP-FRONTEND" );
/* ************************************************************************** */
/* WORDPRESS PATH INFORMATIONS */
var wordpress = vlib_ || {basePath: '', appPath: ''};
console.dir( wordpress );
var pluginPath = wordpress.basePath + wordpress.appPath + '/';
var cssPath = wordpress.basePath + 'css/';
var dataPath = 'data/';
var $ = $ || jQuery;

/**
 * Wordpress frontend app.
 * Singleton
 */
var WpFrontendApp = WpFrontendApp || (function ( scriptPath, stylePath ) {
		/* ************************************************************************** */
		/* REQUIRE.JS PATH CONFIGURATION */
		requirejs.config( {
			baseUrl: wordpress.basePath + wordpress.appPath,
			appDir : './'
		} );
		/* ************************************************************************** */
		/* ATTACH SCRIPTS */
		var injectScript = function ( path ) {
			var script = document.createElement( "script" );
			script.type = "text/javascript";
			script.src = scriptPath + path;
			( document.getElementsByTagName( "head" )[0] || document.documentElement ).appendChild( script );
		};
		var loadGroup = function ( id, callback ) {
			var jsonObj = {
				action: "load-group",
				id    : id
			};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};

			$.ajax( {
				type    : 'POST',
				url     : wordpress.basePath + "process.php",
				data    : postArray,
				dataType: 'json',
				success : function ( data ) {
					if ( callback ) {
						callback.call( this, data.group );
					}
					return data.group;
				},
				error   : function ( e ) {
					console.error( e.responseText );
					alert( "error" );
				}
			} );
		};
		/* LOAD TEMPLATE METHOD FROM wp-database-driver.js */
		var loadTemplate = function ( callbackSuccess, callbackError, context, id  ) {
			var jsonObj = {"action": "get_t_id", "id": id};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};

			$.ajax( {
				type    : 'POST',
				url     : wordpress.basePath + "process.php",
				data    : postArray,
				dataType: 'json',
				success : function ( data ) {
					if ( !data || data.length !== 1 ) return;
					var pattern;
					if ( data[0].pattern !== null ) {
						pattern = data[0].pattern.split( ',' );
					} else {
						pattern = [];
					}
					var template = {
						id         : data[0].id,
						sceneGraph : JSON.parse( data[0].template_graph ),
						name       : data[0].template_name,
						description: data[0].template_description,
						thumbnail   : data[0].template_thumbnail,
						pattern    : pattern
					};

					if ( callbackSuccess ) {
						callbackSuccess.call( context, template );
					}
					return template;
				},
				error   : function ( e ) {
					if(callbackError){
						callbackError.call( context, e );
					}else{
						alert( JSON.stringify( e ) );
					}
				}
			} );
		};
		/* LOAD FILE METHOD FROM wp-database-driver.js */
		var loadFile = function ( callbackSuccess, callbackError, context, id  ) {
			var jsonObj = {"action": "get_file_by_id", "id": id};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};
			var d;
			$.ajax( {
				type    : 'POST',
				url     : wordpress.basePath + "process.php",
				data    : postArray,
				dataType: 'json',
				async : false,
				success : function ( data ) {

					if ( !data || data.length !== 1 ) return;

					if ( callbackSuccess ) {
						callbackSuccess.call( context, data[0] );
					}
					d = data[0];
				},
				error   : function ( e ) {
					console.error("wp-database-driver.loadFile() "+ e.message);
					if(callbackError){
						callbackError.call( context, false );
					}else{
						alert( JSON.stringify( e ) );
					}
					d = false;
				}
			} );
			return d;
		};
		/* ************************************************************************** */
		/* ATTACH STYLESHEETS */
		var injectStyle = function ( path ) {
			var style = document.createElement( "link" );
			style.rel = "stylesheet";
			style.href = stylePath + path;
			( document.getElementsByTagName( "head" )[0] || document.documentElement ).appendChild( style );
		};
		/* ************************************************************************** */
		/* FETCH DATA AND ATTACH PLOT-MODULES */
		var run = function () {

			require( ['vLib_base'], function ( Wrapper ) {
				var VLib = Wrapper.vLib;
				var PlotModule = Wrapper.vPlot;
				var GroupModule = Wrapper.vGroup;

				var v = new VLib( {
					basePath: wordpress.basePath,
					appPath : wordpress.appPath,
					dataPath: dataPath
				} );
				v.setLoadTemplateCallback( loadTemplate );
				/* GET FILE BY ID CALLBACK */
				v.setLoadFileCallback( loadFile );

				/* REPLACE PLOT SHORTCODES */
				jQuery( '.vlib-plot' ).each( function ( index ) {
					var $this = jQuery( this );
					var templ_id = $this.attr( 'id' );
					var uniquePlotId = templ_id+'-'+index;
					$this.attr( 'id',uniquePlotId  );


					var width = $this.parent().find( '#vPlot-width' ).val();
					var height = $this.parent().find( '#vPlot-height' ).val();
					$this.closest( '.vlib-plot-container' ).css('width', width );
					//$this.closest( '.vlib-plot-container' ).css('height', height );

					var plot = new PlotModule( width, '' );
					v.registerModule( plot );
					plot.init( "#" + uniquePlotId );

					var jsonObj = {"action": "get_t_id", "id": templ_id};
					var postData = JSON.stringify( jsonObj );
					var postArray = {query: postData};

					loadTemplate(function( template ){
						"use strict";
							v.load( template, plot );
					},function( error ){
						"use strict";
							alert( 'Load template failed. '+error.message );
					},this,templ_id
					);

				} );

				/* REPLACE GROUP SHORTCODES */
				jQuery( '.vlib-group' ).each( function ( index ) {
					var $this = jQuery( this );
					var groupId = $this.attr( 'id' );
					var uniqueGroupId = groupId+'-'+index;


					var width = $this.parent().find( '#vPlot-width' ).val();
					var height = $this.parent().find( '#vPlot-height' ).val();
					var basePanel = $this.find('.vlib-plot-container');
					var groupContainer = $this.find( "#group-" + groupId );
					var groupPlotContainer = $this.find( "#group-plot-" + groupId );

					groupContainer.attr('id','group-'+uniqueGroupId);
					groupPlotContainer.attr('id','group-plot-'+uniqueGroupId);

					basePanel.css('min-width', width );
					basePanel.css('min-height', height );

					var plot = new PlotModule(width, height);
					v.registerModule( plot );
					plot.init( groupPlotContainer );

					var group = new GroupModule( plot );
					v.registerModule( group );
					group.init( groupContainer );

					loadGroup( groupId, function ( groupTemplate ) {
						"use strict";
						group.setGroup( groupTemplate );
					} );

				} );

				jQuery( '.vlib-group-container' ).on( 'click', function ( e ) {
					"use strict";
					e.preventDefault();
					e.stopPropagation();
					var $that = jQuery( this );

					if ( $that.find( '.toggle-group' ).is( ':hidden' ) ) {
						$that.removeClass( 'glyphicon-folder-close' );
						$that.addClass( 'glyphicon-folder-open' );
					} else {
						$that.removeClass( 'glyphicon-folder-open' );
						$that.addClass( 'glyphicon-folder-close' );
					}
					$that.find( '.toggle-group' ).slideToggle();

					return false;
				} );

				jQuery( ' .toggle-group' ).mouseleave( function (e) {
					"use strict";
					e.preventDefault();
					e.stopPropagation();
					var $that = jQuery( this );
					if ( $that.is( ':hidden' ) ) {
						return false;
					}

					$that.closest('.vlib-group-container').removeClass( 'glyphicon-folder-open' );
					$that.closest('.vlib-group-container').addClass( 'glyphicon-folder-close' );
					$that.slideUp();
					return false;
				} );

				jQuery('.toggle-plot-container' ).on('click',function(){
					"use strict";
					var $that = jQuery( this );
					var basePanel = $that.closest('.vlib-plot-container');
					var plotPanel = $that.closest('.vlib-base-panel').find('.plot-panel' );
					if ( plotPanel.is( ':hidden' ) ) {
						$that.removeClass( 'glyphicon-circle-arrow-down' );
						$that.addClass( 'glyphicon-circle-arrow-up' );
						basePanel.removeClass('override-size');
					}else{
						$that.removeClass( 'glyphicon-circle-arrow-up' );
						$that.addClass( 'glyphicon-circle-arrow-down' );
						basePanel.addClass('override-size');
					}
					plotPanel.slideToggle();
				});
			} );
		};

		// injectScript( 'require.min.js' );
		// injectStyle( 'pageStyle.css' );
		// injectStyle( 'bootstrap/dist/css/bootstrap.min.css' );
		return {
			run: run
		}
	})( pluginPath, cssPath );


/* ************************************************************************** */
/* RUN IF READY*/
jQuery( document ).ready( function () {
	WpFrontendApp.run();

} );













