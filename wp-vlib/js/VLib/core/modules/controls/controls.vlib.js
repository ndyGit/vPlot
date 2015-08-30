define(
	['require', 'config', 'core/Utils.vlib', 'jquery', 'underscore', 'bootstrap'],
	function ( require, Config, UTILS, $, _ ) {
		/**
		 TODO<br />
		 @module Controls
		 @class Controls
		 **/
		var module = (function () {
			var _name = 'controls';
			// TODO: REFACTOR
			var _templates = Config.getModulePath() + '/controls/templates.js';
			var container;
			var currentTemplate = undefined;
			var files = [];

			var isRegisterd = function () {
				return (typeof module.subscribe === 'function')
				&& (typeof module.publish === 'function');
			};
			var _init = function ( container ) {
				if ( isRegisterd() ) {
					module.container = $( container );

					// inject templates
					module.publish( Config.CHANNEL_INJECT_SCRIPTTEMPLATE, {url: _templates} );


					/** *************************************** */
					/* CALL YOUR FUNCTIONS HERER */
					/** *************************************** */
					updateGui();
					addListener();

					module.publish( Config.CHANNEL_REQUEST_SAVETEMPLATECALLBACK );
					module.publish( Config.CHANNEL_REQUEST_UPDATETEMPLATECALLBACK );
					module.publish( Config.CHANNEL_REQUEST_DELETETEMPLATECALLBACK );
					module.publish( Config.CHANNEL_REQUEST_UPLOADDATACALLBACK );
					module.publish( Config.CHANNEL_REQUEST_DELETEDATACALLBACK );
					module.publish( Config.CHANNEL_REQUEST_FILEUPLOADURL );
					module.publish( Config.CHANNEL_REQUEST_FILES );
					/** *************************************** */
				} else {
					throw 'Module [ '
					+ this.name
					+ ' ] not registered! Use VLib.registerModule(obj) first.';
				}

			};
			/** *************************************** */
			/* ADD LISTENERS HERE */
			/** *************************************** */
			var addListener = function () {
				//console.log( "[ " + module.name + " ] add listener " );

				attachSavePlotListener();
				attachUploadDataListener();
				attachDeleteDataListener();
				attachResetListener();
				attachRefreshListener();
				attachSaveAsPngListener();
				attachSaveAsTemplateListener();

				module.subscribe( Config.CHANNEL_SCENEGRAPH_UPDATE, templateHandle );
				module.subscribe( Config.CHANNEL_TEMPLATES_TEMPLATE_SELECTED, templateHandle );

				module.subscribe( Config.CHANNEL_RESPOND_SAVETEMPLATECALLBACK, saveTemplateCBHandle );
				module.subscribe( Config.CHANNEL_RESPOND_UPDATETEMPLATECALLBACK, updateTemplateCBHandle );
				module.subscribe( Config.CHANNEL_RESPOND_UPLOADDATACALLBACK, setUploadDataCBHandle );
				module.subscribe( Config.CHANNEL_RESPOND_DELETEDATACALLBACK, deleteDataCBHandle );

				module.subscribe( Config.CHANNEL_RESPOND_FILEUPLOADURL, respondFileUploadUrlHandle );
				module.subscribe( Config.CHANNEL_RESPOND_FILES, respondFileshandle );
				module.subscribe( Config.CHANNEL_ERROR, showErrorMsg );
				module.subscribe( Config.CHANNEL_WARNING, showWarningMsg );
				module.subscribe( Config.CHANNEL_SUCCESS, showSuccessMsg );
				module.subscribe( Config.CHANNEL_INFO, showInfoMsg );
				module.subscribe( Config.CHANNEL_REFRESH, refreshHandle );
				module.subscribe( Config.CHANNEL_RESPOND_PNG, function( png ){
					"use strict";
					currentTemplate.template.thumbnail = png;
					if(currentTemplate.template.id && currentTemplate.template.id !== -1 && currentTemplate.template.id !== '' && currentTemplate.action === 'update'){
						updateTemplateCallback( currentTemplate );
					}else{
						saveTemplateCallback( currentTemplate );
					}

				} );

			};

			/* ******************************** */
			/* LISTENERS */
			/*
			 * Handles message from CHANNEL_RESPOND_FILES
			 * module.subscribe(Config.CHANNEL_RESPOND_FILES, respondFileshandle);
			 */

			var refreshHandle = function () {
				module.publish( Config.CHANNEL_RESQUEST_FILES );
				module.publish( Config.CHANNEL_RESQUEST_TEMPLATES );
			};

			var respondFileshandle = function ( obj ) {
				files = obj;
			};
			/*
			 * Handles message from CHANNEL_RESPOND_FILEUPLOADURL
			 * module.subscribe(Config.CHANNEL_RESPOND_FILEUPLOADURL,respondFileUploadUrlHandle);
			 */
			var respondFileUploadUrlHandle = function ( url ) {
				fileUploadUrl = url;
			};
			/*
			 * Handles messages from
			 *	CHANNEL_SCENEGRAPH_UPDATE and
			 *	CHANNEL_TEMPLATES_TEMPLATE_SELECTED
			 * module.subscribe(Config.CHANNEL_SCENEGRAPH_UPDATE, templateHandle);
			 * module.subscribe(Config.CHANNEL_TEMPLATES_TEMPLATE_SELECTED, templateHandle);
			 */
			var templateHandle = function ( obj ) {
				activateSavePlot();
				if(obj.template.id === undefined && currentTemplate.template.id !== undefined){
					var tmp = currentTemplate.template.id;
					currentTemplate = obj;
					currentTemplate.template.id = tmp;
				}else{
					currentTemplate = obj;
				}

				if( obj.template.id === undefined || obj.template.id === '' || obj.template.id === -1){
					deactivateSavePlot();
				}
			};
			var deactivateSavePlot = function(){
				"use strict";
				var savePlotButton = $( '#' + module.container.attr( 'id' ) ).find( '#save-plot' );
				savePlotButton.addClass('disabled');
				savePlotButton.unbind('click');
			};
			var activateSavePlot = function(){
				"use strict";
				var savePlotButton = $( '#' + module.container.attr( 'id' ) ).find( '#save-plot' );
				savePlotButton.removeClass('disabled');
				attachSavePlotListener();
			};
			/*
			 * Handles message from CHANNEL_RESPOND_UPLOADDATACALLBACK
			 * module.subscribe(Config.CHANNEL_RESPOND_UPLOADDATACALLBACK, setUploadDataCBHandle);
			 */
			var setUploadDataCBHandle = function ( callback ) {
				if ( typeof(callback) !== 'function' ) {
					showErrorMsg( 'uploadDataCallback is NOT a function!' );
					return;
				}
				uploadDataCallback = callback;

			};
			/*
			 * Handles message from CHANNEL_RESPOND_DELETEDATACALLBACK
			 * module.subscribe(Config.CHANNEL_RESPOND_DELETEDATACALLBACK, setDeleteDataCBHandle);
			 */
			var setDeleteDataCBHandle = function ( callback ) {
				if ( typeof(callback) !== 'function' ) {
					showErrorMsg( 'deleteDataCallback is NOT a function!' );
					return;
				}
				deleteDataCallback = callback;

			};

			/*
			 * Handles message from CHANNEL_RESPOND_SAVETEMPLATECALLBACK
			 * module.subscribe(Config.CHANNEL_RESPOND_SAVETEMPLATECALLBACK, saveTemplateCBHandle);
			 */
			var saveTemplateCBHandle = function ( callback ) {
				if ( typeof(callback) !== 'function' ) {
					showErrorMsg( 'saveTemplateCallback is NOT a function!' );
					return;
				}
				saveTemplateCallback = callback;
			};
			/*
			 * Handles message from CHANNEL_RESPOND_UPDATETEMPLATECALLBACK
			 * module.subscribe(Config.CHANNEL_RESPOND_UPDATETEMPLATECALLBACK, updateTemplateCBHandle);
			 */
			var updateTemplateCBHandle = function ( callback ) {
				if ( typeof(callback) !== 'function' ) {
					showErrorMsg( 'saveTemplateCallback is NOT a function!' );
					return;
				}
				updateTemplateCallback = callback;
			};

			var deleteDataCBHandle = function ( callback ) {
				if ( typeof(callback) !== 'function' ) {
					showErrorMsg( 'deleteDataCallback is NOT a function!' );
					return;
				}
				deleteDataCallback = callback;
			};


			var attachRefreshListener = function () {
				$( '#' + module.container.attr( 'id' ) ).find( '#refresh-template' ).bind( 'click', function (e) {
					e.preventDefault();
					e.stopPropagation();
					module.publish( Config.CHANNEL_REFRESH,{ plot : true } );
				} );
			};
			var attachResetListener = function () {
				$( '#' + module.container.attr( 'id' ) ).find( '#reset-template' ).bind( 'click', function () {
					module.publish( Config.CHANNEL_RESET );
				} );
			};
			var attachSaveAsPngListener = function () {
				$( '#' + module.container.attr( 'id' ) ).find( '#save-png' ).bind( 'click', function () {
					module.publish( Config.CHANNEL_SAVE_AS_PNG );
				} );
			};

			var attachSaveAsTemplateListener = function () {

				$( '#' + module.container.attr( 'id' ) ).find( '#save-template' ).bind( 'click', function () {

					if ( currentTemplate !== undefined && currentTemplate.template !== undefined && currentTemplate.template.sceneGraph !== false ) {
						UTILS.download( currentTemplate.template.name + ".vlib",
							JSON.stringify( currentTemplate.template ) );

						showSuccessMsg( "[ Download ] " + currentTemplate.template.name );
					} else {
						showInfoMsg( "[ Download ] No file selected." );
					}
				} );
			};

			var selectedFiles = [];
			var attachDeleteDataListener = function () {

				$( '#' + module.container.attr( 'id' ) ).find( '#delete-data' ).bind( 'click', function () {
					$( '#deleteDataModal' ).modal( 'show' );
					$( '#file-cnt' ).html( files.length );
					var c = $( '#' + module.container.attr( 'id' ) ).find( '#deleteDataTableContainer' );
					c.html( '' )
					$.each( files, function ( i, o ) {
						var row = $( '<tr/>' );
						row.append( $( '<td/>' ).html( '<input id="file-delete-checkbox-' + i + '" type="checkbox" class="file-delete-checkbox">' ) );
						row.append( $( '<td/>' ).html( o.name ) );
						row.attr( 'class', 'file' );
						row.attr( 'title', o.description );
						//ID hinzuf.
						row.attr( 'id', o.id );
						c.append( row );

					} );

					$( '#' + module.container.attr( 'id' ) ).find( '.file-delete-checkbox' ).change( function () {

						var toDelete = $( '#' + module.container.attr( 'id' ) ).find( '.file-delete-checkbox:checked' );
						$( '#file-delete-cnt' ).html( toDelete.length );

						var index;
						selectedFiles = [];
						for ( index = 0; index < toDelete.length; ++index ) {
							selectedFiles.push( $( "#" + toDelete[index].id ).closest( '.file' ).attr( 'id' ) );
						}

					} );
				} );
				$( '#' + module.container.attr( 'id' ) ).find( '#deleteFile' ).bind( 'click', function () {
					deleteDataCallback( selectedFiles );
					$( '#deleteDataModal' ).modal( 'hide' );

				} );


			};
			var getPlaceholders = function( node ){
				"use strict";
				if(!node){
					return [];
				}
				var placeholders = [];
				if( node.name === 'file' && node.hasOwnProperty("config") && node.config.regex !== ''){
					placeholders.push(node.config.regex);
				}
				for(var i = 0, len = node.childs.length; i < len; ++i){
					placeholders = placeholders.concat( getPlaceholders( node.childs[ i ]) );
				}
				return placeholders;
			};
			var attachSavePlotListener = function () {
				var that = this;
				$( '#' + module.container.attr( 'id' ) ).find( '#save-plot' ).unbind('click').bind( 'click', function ( e ) {
					e.preventDefault();
					e.stopPropagation();
					if ( currentTemplate !== undefined && currentTemplate.template !== undefined ) {

						$( '#t-id' ).val( currentTemplate.template.id );
						$( '#t-action' ).val('update');
						$( '#t-name' ).val( currentTemplate.template.name );
						$( '#t-description' ).val( currentTemplate.template.description );
						$( '#saveTemplateModal' ).modal( 'show' );
					}
				} );
				$( '#' + module.container.attr( 'id' ) ).find( '#save-as-plot' ).unbind('click').bind( 'click', function ( e ) {
					e.preventDefault();
					e.stopPropagation();
					if ( currentTemplate !== undefined && currentTemplate.template !== undefined ) {
						$( '#t-action' ).val('save');
						$( '#t-name' ).val( '' );
						$( '#t-description' ).val( '' );
						$( '#saveTemplateModal' ).modal( 'show' );
					}
				} );
				$( '#' + module.container.attr( 'id' ) ).find( '#saveTemplate' ).unbind('click').bind( 'click', function ( e ) {
					e.preventDefault();
					e.stopPropagation();
					var action = $( '#' + module.container.attr( 'id' ) ).find( '#t-action' ).val();
					var id = $( '#' + module.container.attr( 'id' ) ).find( '#t-id' ).val();
					var name = $( '#' + module.container.attr( 'id' ) ).find( '#t-name' ).val();
					var description = $( '#' + module.container.attr( 'id' ) ).find( '#t-description' ).val();
					var placeholders = getPlaceholders( currentTemplate.template.sceneGraph );
					currentTemplate.action = action;
					currentTemplate.template.id = id;
					currentTemplate.template.name = name;
					currentTemplate.template.description = description;
					currentTemplate.template.placeholders = placeholders;
					module.publish(Config.CHANNEL_REQUEST_PNG);

					$( '#saveTemplateModal' ).modal( 'hide' );
					$( '#t-name' ).val( '' );
					$( '#t-description' ).val( '' );
				} );
			};

			var attachUploadDataListener = function () {
				$( '#' + module.container.attr( 'id' ) ).find( '#upload-data' ).bind( 'click', function () {
					$( '#uploadDataModal' ).modal( 'show' );
				} );
				$( '#' + module.container.attr( 'id' ) ).find( '#uploadFile' ).bind( 'click', function () {
					uploadDataCallback( '#fileUploadForm' );
					$( '#uploadDataModal' ).modal( 'hide' );
					refreshHandle();

				} );
			};

			var progressHandlingFunction = function ( e ) {
				if ( e.lengthComputable ) {
					$( 'progress' ).attr( {value: e.loaded, max: e.total} );
				}
			};
			/* ******************************** */
			/* CALLBACK  SKELETONS*/
			var saveTemplateCallback = function () {
				showErrorMsg( 'controler.saveTemplateCallback not set!' );
			};
			var updateTemplateCallback = function () {
				showErrorMsg( 'controler.updateTemplateCallback not set!' );
			};
			var uploadDataCallback = function () {
				showErrorMsg( 'controler.uploadDataCallback not set!' );
			};
			var deleteDataCallback = function () {
				showErrorMsg( 'controler.deleteDataCallback not set!' );
			};
			/* ******************************** */
			/* MESSAGE TYPES */
			var showErrorMsg = function ( text ) {
				var msg = '<strong>ERROR</strong> ' + text;
				showMsg( 'alert-danger', msg );
			};
			var showWarningMsg = function ( text ) {
				var msg = '<strong>Warning</strong> ' + text;
				showMsg( 'alert-warning', msg );
			};
			var showInfoMsg = function ( text ) {
				var msg = '<strong>Info</strong> ' + text;
				showMsg( 'alert-info', msg );
			};
			var showSuccessMsg = function ( text ) {
				var msg = '<strong>Success</strong> ' + text;
				showMsg( 'alert-success', msg );
			};
			var showMsg = function ( type, text ) {
				var msg = $( '<div />' );
				msg.attr( 'class', 'alert alert-dismissable ' + type );
				msg.append( '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' );
				msg.append( text );
				$( '#' + module.container.attr( 'id' ) ).find( '#messageContainer' ).append( msg );
			};

			/*
			 * inject templet to module container
			 */
			var updateGui = function () {

				_.templateSettings.variable = "rc";
				// get template code
				var templateData = {}

				var template = _.template( $( "script.controlsContainer" )
					.html() );

				// add templates to container
				module.container.html( template( templateData ) );
			};


			/* public */
			return {
				name     : _name,
				container: container,
				init     : _init

			}
		})();

		return module;
	} );
