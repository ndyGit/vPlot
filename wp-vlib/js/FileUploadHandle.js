var FileUploadHandle = function ( info, wp ) {
	'use strict';
	this.wordpress = wp;
	this.name = "Handle";
	this.infoBox = info;
	this.help = '';
	this.input = undefined;
	this.valid = false;
};
FileUploadHandle.prototype = Object.create( FileUpload.prototype );
FileUploadHandle.prototype.constructor = FileUploadHandle;

FileUploadHandle.prototype.getContainer = function ( id ) {
	'use strict';

	var that = this;
	var input = this.getInputGroup( id + '-input' );
	input.append( this.help );
	input.find( 'input[id=' + id + '-input]' ).bind( 'change', function () {
		jQuery( this ).attr( 'class', 'btn-success' );
		that.valid = true;
	} );
	this.input = input;
	return input;
};
FileUploadHandle.prototype.isValid = function () {
	'use strict';
	return this.valid;
};
