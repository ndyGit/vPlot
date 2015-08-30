var FileUpload = function () {
};
FileUpload.prototype = {
	upload        : function ( form, callback ) {
		var apc_key = 'apc_' + Math.ceil( Math.random() * 100000 );
		//form.find( '#progress_key' ).val( apc_key );
		var progressBar = form.find( '#progressbar' );
		var progress = this.getProgressbar();
		//progress.attr('src', this.wordpress.basePath + 'uploadProgress.php');
		var options = {
			url         : this.wordpress.basePath + 'processBulkUpload.php',
			beforeSubmit: function () {
				"use strict";
				progressBar.html(progress);
				progressBar.fadeIn();
			},
			uploadProgress: function(event, position, total, percentComplete) {
				var percentVal = percentComplete + '%';
				progress.find('#upload-progress' ).css('width',percentVal);
			},
			success     : function ( response ) {
				"use strict";
				callback.call( this, response );
				progressBar.fadeOut();
			}
		};

		form.ajaxSubmit( options );

	},
	getContainer  : function () {
		console.error( "[ FileUpload.attachContainer ] Abstract method stub." );
	},
	getInputGroup : function ( id ) {
		var group = jQuery( '<div />', {
			class: 'form-group'
		} );
		var label = jQuery( '<label />', {
			'for': id
		} ).html( 'Source' );
		var input = jQuery( '<input />', {
			type    : 'file',
			id      : id,
			name    : id+'[]',
			multiple: 'multiple'
		} );
		return group.append( label ).append( input );
	},
	getProgressbar: function () {
		var progressbar = jQuery( '<div />', {
			class: 'progress'
		} );
		var progress = jQuery( '<div />', {
			class          : 'progress-bar',
			id             : 'upload-progress',
			'role'         : 'progressbar',
			'aria-valuemin': 0,
			'aria-valuemax': 100,
			'style'        : 'width:0%;'
		} );
		return progressbar.append( progress );
	}
};
