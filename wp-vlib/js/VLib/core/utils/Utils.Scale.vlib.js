/**
 * Created by Andreas Gratzer on 28/10/14.
 * Inspired by D3
 */
define(['require'],function(require) {
	'use strict';
	var Scale = function(){
		this._domain = [0,1];
		this._range = [0,1];
		this.domainMin;
		this.domainMax;
		this.domainDelta;
		this.linearArray = function( x ){

			if(!(x instanceof Array)){
				console.error("[ Scale.linearArray ] Input is not an Array.");
				return false;
			};
			var buffer = x.slice( 0 );
			for(var i = 0, len = buffer.length; i < len; ++i){
				buffer[ i ] = ((buffer[ i ]) - this.domainMin ) / this.domainDelta;
				buffer[ i ] = this.rangeMin + (buffer[ i ] * this.rangeDelta);
			}
			return buffer;
		};
		this.linearF32Array = function( x ){

			if(!(x instanceof Float32Array)){
				console.error("[ Scale.linearF32Array ] Input is not a Float32Array.");
				return false;
			};
			var buffer = new Float32Array( x );
			for(var i = 0, len = buffer.length; i < len; ++i){
				buffer[ i ] = ((buffer[ i ]) - this.domainMin ) / this.domainDelta;
				buffer[ i ] = this.rangeMin + (buffer[ i ] * this.rangeDelta);
			}
			return buffer;
		};
		this.linearF32Value = function( x ){
			console.log("linearValue "+x);
			if(arguments.length !== 1){
				console.error("[ Scale.linearValue ] Invalid number of arguments.");
				return false;
			}
			var buffer = new Float32Array(1);
			buffer[0] = x;
			buffer[0] = ((buffer[0]) - this.domainMin ) / this.domainDelta;
			buffer[0] = this.rangeMin + (buffer[0] * this.rangeDelta);
			return x;
		};
		this.linearValue = function( x ){

			if(arguments.length !== 1){
				console.error("[ Scale.linearValue ] Invalid number of arguments.");
				return false;
			}
			var buffer = x;
			buffer = ((buffer) - this.domainMin ) / this.domainDelta;
			buffer = this.rangeMin + (buffer * this.rangeDelta);
			return buffer;
		};
		this.linear = function( x ){
			if(arguments.length !== 1){
				throw new Error("scale linear. invalid number of arguments");
			}
			if((x instanceof Float32Array)){
				return this.linearF32Array( x );
			}
			if((x instanceof Array)){
				return this.linearArray( x );
			}
			return this.linearValue( x );
		};
		this.logarithmic = function(x,base){
			var result;
			var values = x;
			if(!(x instanceof Array)){
				values = [ x ];
			}
			var log = function(x){
				return Math.log(x < 0 ? 0 : x) / Math.log(base);
			};
			result = values.map(log);

			return this.linear(result);
		};
		this.range = function(range){
			this._range = range;
			this.rangeMin = parseFloat(this._range[0]);
			this.rangeMax = parseFloat(this._range[1]);
			this.rangeDelta = this.rangeMax - this.rangeMin;
			/* set to 1 to avoid division by zero*/
			this.rangeDelta = this.rangeDelta === 0 ? 1 : this.rangeDelta;
			return this;
		};
		this.domain = function(domain){
			this._domain = domain;
			this.domainMin = parseFloat(this._domain[0]);
			this.domainMax = parseFloat(this._domain[1]);
			this.domainDelta = this.domainMax - this.domainMin;
			/* set to 1 to avoid division by zero*/
			this.domainDelta = this.domainDelta === 0 ? 1 : this.domainDelta;
			return this;
		}
	};
	return function(){
		return new Scale();
	}

});
