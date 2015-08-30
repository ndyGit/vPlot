/**
 * Created by Andreas Gratzer on 05/06/15.
 */
THREE.MultilineTextHelper = function ( text, parameters ) {

	THREE.Object3D.call( this );

	parameters.posZ = parameters.posZ || 0;
	parameters.maxWidth = parameters.maxWidth || false;
	parameters.color = parameters.color || 0x0000;

	var EM = new THREE.TextGeometry('M',parameters);
	EM.computeBoundingBox();
	var padding = 10;
	this.EMSIZE = {
		width : EM.boundingBox.max.x - EM.boundingBox.min.x,
		height : EM.boundingBox.max.y - EM.boundingBox.min.y + padding
	};


	this.material = new THREE.MeshBasicMaterial({color: parameters.color, depthWrite: false,depthTest: false});
	this.rows = 0;

	if(!parameters.maxWidth){
		var geometry = new THREE.TextGeometry(text,parameters);
		this.add( new THREE.Mesh(geometry,this.material));
		return;
	}
	// in-text newlines
	var parts = text.split('<br />');
	for(var i = 0, len = parts.length; i < len; ++i){
		this.addRows( parts[i], parameters );
	}

};

THREE.MultilineTextHelper.prototype = Object.create( THREE.Object3D.prototype );

THREE.MultilineTextHelper.prototype.addRows = function( text, parameters ){
	"use strict";

	var charCount = text.length;
	var wordArray = text.split(" ");
	var estimatedLen = charCount * this.EMSIZE.width;
	var tmpText = '', word;
	if(estimatedLen < parameters.maxWidth){
		// text is shorter than maxWidth... just add a new row
		this.addSingleRow(text,parameters);
	}else{
		// text is longer than maxWidth...
		//var estimatedRowCnt = Math.ceil(estimatedLen / parameters.maxWidth);
		while( word = wordArray.shift() ){

			if((tmpText.length + word.length)*this.EMSIZE.width > parameters.maxWidth){
				this.addSingleRow(tmpText,parameters);
				wordArray.unshift(word);
				tmpText = '';
			}
			tmpText += word+' ';

		}
	}



};
THREE.MultilineTextHelper.prototype.addSingleRow = function(text, parameters){
	"use strict";
	var geometry = new THREE.TextGeometry(text,parameters);
	var mesh = new THREE.Mesh(geometry,this.material);
	mesh.position.set(0,-(this.rows * this.EMSIZE.height),parameters.posZ);
	this.add( mesh );
	this.rows++;
};