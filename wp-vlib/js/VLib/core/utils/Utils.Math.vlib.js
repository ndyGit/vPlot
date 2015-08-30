define(['require'],function(require) {
	'use strict';
	var MathFunctions = function(){
		/**
		* http://en.wikipedia.org/wiki/Golden_ratio
		* phi = a / b = (a + b) / a
		* input = a+b
		* deciamalDigits = precision
		*/
		this.goldenRatio = function( input, deciamlDigits ){
			if(arguments.length == 0) {
				throw new Error("[ Math.goldenRatio ] invalid  input.");
			}
			var ab = parseFloat( input );
			var result = {a:false,b:false,ab:ab};
			var phi = 1.61803398875;
			var precision = deciamlDigits === 'undefined' ? 0 : deciamlDigits;
			result.a = parseFloat(( ab / phi ).toFixed( precision ));
			result.b = parseFloat(( ab - result.a ).toFixed( precision ));

			return result;
		};
	};
	return function(){
		return new MathFunctions();
	};
});
