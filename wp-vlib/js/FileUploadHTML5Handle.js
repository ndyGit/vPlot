var HTML5FileUploadHandle = function( container ){
	this.name = "HTML5Handle";
	this.base = container;
	this.help = '<p class="help-block">Upload file(s) or folder.</p>';
}
HTML5FileUploadHandle.prototype = Object.create(FileUpload.prototype);
HTML5FileUploadHandle.prototype.constructor = HTML5FileUploadHandle;

HTML5FileUploadHandle.prototype.getContainer = function(){
	var input = this.getInputGroup( id+'-input' );
	input.append( this.help );
	return input;
}
