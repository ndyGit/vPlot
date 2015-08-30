define(['require','core/Utils.vlib','core/Buffer.vlib'],function(require,UTILS,Buffer) {
	'use strict';
	var BufferManager = function(){
		this._bufferMap = {};
	};
	BufferManager.prototype.getBuffer = function(id){
		if(this._bufferMap[id] === undefined){
			this._bufferMap[id] = new Buffer(id);
		}
		return this._bufferMap[id];
	};
	BufferManager.prototype.isBuffer = function( id ){
		return this._bufferMap.hasOwnProperty( id );
	};
	BufferManager.prototype.deleteBuffer = function( id ){
		if( this._bufferMap.hasOwnProperty( id ) ){
			delete this._bufferMap[ id ];
		}
	};
	BufferManager.prototype.empty = function(){
		this._bufferMap = null;
		this._bufferMap = {};
	};
	return BufferManager;
});
