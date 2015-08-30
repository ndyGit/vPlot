/* ************************************************************************** */
/* WORDPRESS DATA */
var wordpress = vlib_ || {basePath: '', appPath: '', templateId: -1};
window.vlib_globals = wordpress;
console.dir( wordpress );
var dataPath = 'data/';

var ImportController = ImportController || (function ( wp ) {
		'use strict';
		var STATICS = {
			TABS      : '#upload-tabs',
			TAB_UPLOAD: '#tab-upload',
			TAB_EDIT  : '#tab-edit',
			TAB_SHOW  : '#tab-show',
			FORM      : '#upload-form',
			FORM_IN   : '#upload-input-container',
			MSG       : '#msg',
			INFO      : '#upload-info',
			SUBMIT    : '#file-upload-submit',
			SUCCESS   : 'Upload finished.',
			EXT_TEMPLATE : 'vlib',
			GROUP_NAME : 'form-group-name',
			GROUP_DESCRIPTION : 'form-group-description',
			GROUP_GROUP : 'form-group-create-group',
			GROUP_FILE_VISIBLE : 'form-group-file-vivible'
		};
		var wordpress = wp;
		var tabs = jQuery( STATICS.TABS );
		var form = jQuery( STATICS.FORM );
		var container = jQuery( STATICS.FORM_IN );
		var msgContainer = jQuery( STATICS.MSG );
		var infoContainer = jQuery( STATICS.INFO );
		var handle;
		var html5Support = function () {
			return false;
		};
		var initUploadHandle = function () {
			if ( html5Support() ) {
				handle = new HTML5FileUploadHandle( infoContainer, wordpress );
			} else {
				handle = new FileUploadHandle( infoContainer, wordpress );
			}
		};
		var attachContainer = function () {
			var input = handle.getContainer( form.attr( 'id' ) );
			container.append( input );
			var extension;
			jQuery( input ).find('input' ).bind('change',function(){
				for( var i = 0, len = this.files.length; i < len; ++i){
					extension = this.files[ i].name.split('.' ).pop().toLowerCase();
					if( STATICS.EXT_TEMPLATE !== extension){
						jQuery('#'+STATICS.GROUP_NAME ).fadeIn();
						jQuery('#'+STATICS.GROUP_DESCRIPTION ).fadeIn();
						jQuery('#'+STATICS.GROUP_FILE_VISIBLE ).fadeIn();
						jQuery('#'+STATICS.GROUP_GROUP ).fadeIn();
					}
				}

			});
		};
		var alertMsg = function ( text ) {
			msgContainer.html( '<div class="alert alert-danger" role="alert"><b>Error: </b> ' + text + '</div>' );
		};
		var successMsg = function ( text ) {
			msgContainer.html( '<div class="alert alert-success" role="alert"><b>Success: </b>' + text + '</div>' );
		};
		var infoMsg = function ( text ) {
			msgContainer.append( '<div class="alert alert-info" role="alert">'+ text + '</div>' );
		};
		var clearMsg = function () {
			msgContainer.empty();
		};
		var openGroup = function ( id ) {
			window.location.href = '?page=group&id='+id;
		};
		var openGroupList = function () {
			window.location.href = '?page=groups';
		};
		var uploadDoneCallback = function ( response ) {
			//successMsg( STATICS.SUCCESS );
			if ( jQuery( '#upload-form-create-group' ).is( ':checked' ) ) {
				successMsg( '<a href="#" id="open-group" > Open Group </a> <a href="#" id="open-group-list"> Open Group-List </a>' );
				jQuery('#open-group' ).click(function(e){
					e.preventDefault();
					e.stopPropagation();
					openGroup(response);
				});
				jQuery('#open-group-list' ).click(function(e){
					e.preventDefault();
					e.stopPropagation();
					openGroupList();
				});
			} else {
				successMsg( response );
			}

		};

		var handleClickSubmit = function () {
			jQuery( STATICS.SUBMIT ).click( function () {
				clearMsg();
				if ( !handle.isValid() ) {
					alertMsg( 'Invalid file.' );
				} else {
					handle.upload( form, uploadDoneCallback );
				}
			} );
		};

		return {
			run: function ( id ) {


				initUploadHandle();
				attachContainer();
				handleClickSubmit();
				infoMsg('<b>Hint: </b><b>.vlib</b> files will be added as <b>Plot</b>.');
				infoMsg('<b>Hint: </b>File/Folder structures within a <b>.zip</b> file can be represented as <b>Group</b>.');
				/* AVOID LOADING TAB IF IT IS DISABLED */
				jQuery( ".nav-tabs a[data-toggle=tab]" ).on( "click", function ( e ) {
					if ( jQuery( this ).parent().hasClass( "disabled" ) ) {
						e.preventDefault();
						return false;
					}
				} );

			}
		};
	})( wordpress );

jQuery( document ).ready( function () {
	'use strict';
	ImportController.run( wordpress.id );
} );
