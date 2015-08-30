define(['require'],function(require) {
	'use strict';

	var Interpolation = function(){

	return {
		/**
		 *
		 * @param dmin  data range min
		 * @param dmax  data range max
		 * @param m     desired number of labels
		 * @return      XWilkinson.Label
		 */
		 search : function(dmin, dmax, m){
		 	var label = new Label();
		 	label.numUnits = parseInt(m);
		 	label.min = parseFloat(dmin);
		 	label.max = parseFloat(dmax);
		 	label.step = (label.max - label.min) / (label.numUnits - 1);
		 	return label;
		 }
		}
	};

	var Label = function(){
		this.min = undefined;
		this.max = undefined;
		this.step = undefined;
		this.score = undefined;
		this.fractionalDigits = 2;
		this.mantissa = function(cnt){
			this.fractionalDigits = cnt;
			return this;
		};
		this.toArray = function(){
			var s = [];
			if(this.min >= this.max) return [this.min, this.max+this.step];
			for(var x = this.min; x <= this.max; x = x+this.step){
				s.push(x.toFixed(this.fractionalDigits));
			}
			return s;
		};
		this.toString = function(){
			return this.toArray().join(" ");
		};
	}



	return function(){
		return new Interpolation();
	}

});
