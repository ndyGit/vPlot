/* ************************************************************************** */
/* WORDPRESS DATA */
var wordpress = vlib_ || {basePath: '', appPath: '', templateId: -1};
window.vlib_globals = wordpress;
console.dir( wordpress );
var pluginPath = wordpress.basePath + wordpress.appPath + '/';
var cssPath = wordpress.basePath + 'css/';
var dataPath = 'data/';
/* ************************************************************************** */
/* REQUIRE.JS PATH CONFIGURATION */
requirejs.config( {
	baseUrl: wordpress.basePath + wordpress.appPath,
	appDir : './',
	paths: {
		'config'                  : 'config.vlib',
		'jquery'                  : 'libs/vendor/jquery/dist/jquery.min'
	}
} );

require( ['require','vLib_full', '../wp-database-driver'], function ( require,Wrapper, DBDriver ) {

	/**
	 * Wordpress backend app.
	 * Singleton
	 */
	var WpBackendApp = WpBackendApp || (function ( scriptPath, stylePath ) {

			console.log("in backend-app");
			console.log(Wrapper);
			/* PRIVATE VARIABLES */
			var VLib = Wrapper.vLib;
			var PlotModule = Wrapper.vPlot;
			var templates = Wrapper.vTemplates;
			var controls = Wrapper.vControls;
			var toolbox = Wrapper.vToolbox;
			var sceneGraph = Wrapper.vScenegraph;

			var Config = Wrapper.vConfig;

			var v;
			/* INIT WORDPRESS DB DRIVER */
			var db = new DBDriver( wordpress );

			/* PRIVATE METHODS */

			/* ************************************************************************ */
			/* VLIB CALLBACKS */
			/* ************************************************************************ */
			var fileDeleteCB = function ( fileIDArray ) {

				db.deleteFiles(function( response ){
					"use strict";
					if ( response > 0 ) {
						v.publish( Config.CHANNEL_SUCCESS, 'Files deleted! ' );
						fetshAndRegisterExternaFiles();
					} else {
						v.publish( Config.CHANNEL_ERROR, 'Delete files failed! Response=' + response + '] ' );
						fetshAndRegisterExternaFiles();
					}
				}, this, fileIDArray);

			};

			var fileUploadCB = function ( formId ) {
				var formData = new FormData( $( formId )[0] );
				db.uploadFile( function( response ){
					"use strict";
					v.publish( Config.CHANNEL_SUCCESS, 'File upload done.! ' + response );
					db.fetshAndRegisterExternaFiles( v );
				}, this, formData );

			};
			var deleteTemplateCB = function ( id ) {

				db.uploadFile( function( response ){
					"use strict";
					if ( response === "1" ) {
						v.publish( Config.CHANNEL_SUCCESS, 'Template deleted! ' );
						fetshAndRegisterTemplates( v );
					} else {
						v.publish( Config.CHANNEL_ERROR, 'Delete template failed! Response=' + response + '] ' );
					}
				}, this, id );

			};
			var saveTemplateCB = function ( obj ) {

				var template = obj.template;
				if ( template.name === "" ) {
					alert( "Please set at least a template-name! " +template.name);
					return;
				}
				if ( !template.sceneGraph ) {
					alert( "No SceneGraph template given!" );
					return;
				}
				db.saveTemplate( function( id ){
					"use strict";
					v.publish( Config.CHANNEL_SUCCESS, 'Template saved! ' );
					loadTemplate( id );
					db.fetshAndRegisterTemplates( v );
				},function(e){
					"use strict";
					v.publish( Config.CHANNEL_ERROR, 'Save template failed! ' + JSON.stringify( e ) );
				}, this, template );

			};
			var updateTemplateCB = function ( obj ) {

				var template = obj.template;
				if ( template.name === "" ) {
					alert( "Please set at least a template-name!" );
					return;
				}
				if ( !template.sceneGraph ) {
					alert( "No SceneGraph template given!" );
					return;
				}

				db.updateTemplate( function( response ){
					"use strict";
					v.publish( Config.CHANNEL_SUCCESS, response );
					loadTemplate( template.id );
					db.fetshAndRegisterTemplates( v );
				},function(e){
					"use strict";
					v.publish( Config.CHANNEL_ERROR, 'Update template failed! ' + JSON.stringify( e ) );
				}, this, template );

			};

			var loadTemplate = function ( templateId, callback ) {

				db.loadTemplate(
					function( template ){
						"use strict";
						v.load( template );
						v.publish( Config.CHANNEL_SUCCESS, 'Template <b>'+template.name+'</b> loaded! ' );

						if( callback ){
							callback( template );
						}
					},
					function( error ){
						"use strict";
						v.publish( Config.CHANNEL_ERROR, 'Load template failed! ' + JSON.stringify( error ) );
						if( callback ){
							callback( false );
						}
					},
					this,
					templateId
				);

			};
			/* ************************************************************************** */
			/* FETCH DATA AND ATTACH PLOT-MODULES */
			var run = function () {

				/* INIT VLIB FRAMEWORK*/
				v = new VLib( {
					basePath: wordpress.basePath,
					appPath : wordpress.appPath,
					dataPath: dataPath
				} );

				var plot = new PlotModule('100%','500px');
				/* REGISTER MODULES */
				//v.registerModule(templates);
				v.registerModule( controls );
				v.registerModule( toolbox );
				v.registerModule( sceneGraph );
				v.registerModule( plot );
				/* SET CALLBACKS */
				/* ************************************************************************** */
				/* GET TEMPLATE BY ID CALLBACK */
				v.setLoadTemplateCallback( db.loadTemplate );
				/* ************************************************************************** */
				/* GET FILE BY ID CALLBACK */
				v.setLoadFileCallback( db.loadFile );
				/* ************************************************************************** */
				/* DELETE DATA CALLBACK */
				v.setDeleteDataCallback( fileDeleteCB );
				/* ************************************************************************** */
				/* UPLOAD DATA CALLBACK */
				/* ************************************************************************** */
				v.setUploadDataCallback( fileUploadCB );
				/* ************************************************************************** */
				/* SAVE TEMPLATE CALLBACK */
				/* ************************************************************************** */
				v.setSaveTemplateCallback( saveTemplateCB );
				/* ************************************************************************** */
				/* SAVE TEMPLATE CALLBACK */
				/* ************************************************************************** */
				v.setUpdateTemplateCallback( updateTemplateCB );
				/* ************************************************************************** */
				/*DELETE TEMPLATE CALLBACK */
				/* ************************************************************************** */
				v.setDeleteTemplateCallback( deleteTemplateCB );
				/* INIT MODULES */
				//templates.init('#vTempl');
				controls.init( '#vControls' );
				toolbox.init( '#vList' );
				sceneGraph.init( '#vGraph' );
				plot.init( '#vPlot' );
				/* REGISTER EXTERNAL FILES */
				db.fetshAndRegisterExternaFiles( v );
				/* REGISTER STORED TEMPLATES AND PLOTS */
				db.fetshAndRegisterTemplates( v );
				/* ************************************************************************** */
				/* PROMPT INFO */

				console.info( '#######################################' );
				console.info( "VLib version " + v.version );
				console.info( '[ main ][channels in use ] ' + Object.keys( v.getChannels ) );
				console.info( '[ main ][plugins in use ] ' + Object.keys( v.getPlugins ) );
				console.info( '#######################################' );

				if ( wordpress.id !== null ) {
					loadTemplate( wordpress.id );
				}
			};


			return {
				run: run
			};
		})( pluginPath, cssPath );


	/* ************************************************************************** */
	/* RUN IF READY*/
	jQuery( document ).ready( function () {
		WpBackendApp.run();
	} );
} );
