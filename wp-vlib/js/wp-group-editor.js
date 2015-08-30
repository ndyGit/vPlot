/**
 * Created by Andreas Gratzer on 03/10/14.
 */
/* WORDPRESS DATA */
var wordpress = vlib_ || {basePath: '', appPath: '', templateId: -1};
window.vlib_globals = wordpress;
console.dir( wordpress );
var dataPath = 'data/';
var $ = $ || jQuery;

requirejs.config( {
	baseUrl: wordpress.basePath + wordpress.appPath,
	appDir : './',
	paths: {
		'config'                  : 'config.vlib',
		'jquery'                  : 'vendor/jquery/dist/jquery.min'
	}
} );

jQuery( document ).ready( function () {
	'use strict';

	require( ['vLib_utils','vLib_full', '../wp-database-driver'], function ( Utils, Wrapper, DBDriver ) {

		/* ******************************************************* */
		/*  INIT  */
		var dbDriver = new DBDriver( wordpress );

		var v = new Wrapper.vLib({
			basePath : wordpress.basePath,
			appPath : wordpress.appPath,
			dataPath : dataPath
		});

		dbDriver.fetshAndRegisterAllExternaFiles( v );
		dbDriver.fetshAndRegisterTemplates( v );
		/* GET TEMPLATE BY ID CALLBACK */
		v.setLoadTemplateCallback( dbDriver.loadTemplate );
		/* GET FILE BY ID CALLBACK */
		v.setLoadFileCallback( dbDriver.loadFile );

		var plot = new Wrapper.vPlot();
		v.registerModule( plot );
		plot.init("#plot-container");

		var group = new Wrapper.vGroup( plot );
		v.registerModule( group );
		group.init('#group-container');

		var groupEditor = new Wrapper.vGroupEditor();
		v.registerModule( groupEditor );
		groupEditor.init('#group-editor-container');


		/* ******************************************************* */
		/*  HELPER  */
		var loadGroupCallback = function( group ){
			groupEditor.setGroup( group );
			$( '#group-save' ).html( "update" );
		};
		var saveGroupCallback = function( id ){
			window.location.href = wordpress.adminUrl+'?page=group&id='+id;
		};
		var updateGroupCallback = function( group ){
			$( '#group-save' ).html( "update" );
		};
		/* ******************************************************* */
		/*  EXTERNAL BUTTONS  */
		$( '#group-save' ).click( function () {
			var action = ($(this ).html()).toLowerCase();
			if( action === 'save'){
				dbDriver.saveGroup( groupEditor.getGroup(), saveGroupCallback );
			}else{
				dbDriver.updateGroup( wordpress.id, groupEditor.getGroup(), updateGroupCallback );
			}
		} );
		$( '#group-map-plot-to-file' ).click( function () {
			groupEditor.mapBestPlotsToFiles();
		});

		/* ******************************************************* */
		/*  SET DATA  */
		if( wordpress.id ){
			dbDriver.loadGroup( wordpress.id, loadGroupCallback );
		}else{
			groupEditor.setGroup();
		}

	} );
} );