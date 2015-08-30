define(['require'],function(require) {
	'use strict';
	/**
	* An Extension of Wilkinson’s Algorithm for Positioning Tick Labels on Axes
	* Justin Talbot, Sharon Lin, Pat Hanrahan
	* Adapted from http://www.justintalbot.com/research/axis-labeling/ (JAVA version by Ahmet Karahan)
	*
	* @author Andreas Gratzer
	*/
	var XWilkinson = function(nice){
		var nice = nice;
		var n;
		var loose = false;
		var wWeight = [ 0.25, 0.2, 0.5, 0.05 ];
		var machineEpsilon = new MachineEpsilon();
		var w = function(s,c,d,l){
			return wWeight[0]*s + wWeight[1]*c + wWeight[2]*d + wWeight[3]*l;
		};
		var changeWight = function(w){
			wWeight = w;
			nice.reset();
		};
	/*
	 * a mod b for float numbers (reminder of a/b)
	 */
	 var flooredMod = function(a, n) {
	 	return a-n*Math.floor(a/n);
	 };
	 var v = function(min, max, step) {
	 	return (flooredMod(min, step) < machineEpsilon.doubleValue() && min<=0 && max>=0) ? 1 : 0;
	 };
	 var simplicity = function(min, max,  step) {
	 	if(nice.getQ().length>1)
	 		return 1 - n.i/(nice.getQ().length-1) - n.j + v(min, max, step);
	 	else
	 		return 1 - n.j + v(min, max, step);
	 };
	 var simplicity_max = function() {
	 	if(nice.getQ().length>1)
	 		return 1 - n.i/(nice.getQ().length-1) - n.j + 1.0;
	 	else
	 		return 1 - n.j + 1.0;
	 };
	 var coverage = function( dmin,  dmax,  lmin,  lmax) {
	 	var a = dmax-lmax;
	 	var b = dmin-lmin;
	 	var c = 0.1*(dmax-dmin);
	 	return 1 - 0.5 * ((a*a+b*b)/(c*c));
	 };

	 var coverage_max = function( dmin,  dmax,  span) {
	 	var range = dmax-dmin;
	 	if(span > range) {
	 		var half = (span-range)/2;
	 		var r = 0.1*range;
	 		return 1 - half*half/(r*r);
	 	} else{
	 		return 1.0;
	 	}

	 };
	/*
	 *
	 * @param k		number of labels
	 * @param m		number of desired labels
	 * @param dmin	data range minimum
	 * @param dmax	data range maximum
	 * @param lmin	label range minimum
	 * @param lmax	label range maximum
	 * @return		density
	 *
	 * k-1 number of intervals between labels
	 * m-1 number of intervals between desired number of labels
	 * r   label interval length/label range
	 * rt  desired label interval length/actual range
	 */
	 var density = function( k, m, dmin, dmax, lmin, lmax) {
	 	var r = (k-1)/(lmax-lmin);
	 	var rt = (m-1)/(Math.max(lmax, dmax)-Math.min(lmin, dmin));
		return 2-Math.max(r/rt, rt/r);// return 1-Math.max(r/rt, rt/r); (paper is wrong)
	};

	var density_max = function( k,  m) {
		if(k >= m)
			return 2-(k-1)/(m-1);// return 2-(k-1)/(m-1); (paper is wrong)
		else
			return 1;
	};

	var legibility = function( min,  max,  step) {
		return 1; // Later more
	};
	return {
		loose :function(value){
			loose = value;
			nice.reset();
			return this;
		},
		/**
		 *
		 * @param min  data range min
		 * @param max  data range max
		 * @param m     desired number of labels
		 * @return      XWilkinson.Label
		 */
		 search : function(min, max, m){

		 	var dmin = parseFloat(min);
		 	var dmax = parseFloat(max);

		 	var best = new Label();
		 	var bestScore = -2;
		 	var sm, dm, cm, delta;
		 	if(isNaN(dmin) || isNaN(dmax) || (dmin >= dmax)){
		 		best.min = dmin;
		 		best.max = dmax;
		 		best.step = 1;
		 		best.score = 0;

		 		return best;
		 	}
		 	while(true){
		 		n = nice.next();
		 		sm = simplicity_max();
		 		if(w(sm, 1, 1, 1) < bestScore)
		 			break;
		 		for(var k = 2;;k++){

		 			dm = density_max(k, m);
		 			if(w(sm, 1, dm, 1) < bestScore)
		 				break;
		 			delta = (dmax-dmin)/(k+1)/n.j/nice.getQ()[n.i];
		 			var z = Math.ceil(nice.logB(delta));
		 			while(true) {
		 				var step = n.j*nice.getQ()[n.i]*Math.pow(nice.base, z);
		 				cm = coverage_max(dmin, dmax, step*(k-1));
		 				if(w(sm,cm,dm,1) < bestScore)
		 					break;
		 				var min_start = (Math.floor(dmax/step) - (k-1)) * n.j;
		 				var max_start = Math.ceil(dmin/step) * n.j;
		 				if(min_start > max_start) {
		 					z = z+1;
		 					continue;
		 				}
		 				for(var start = min_start; start<=max_start; start++) {
		 					var lmin = start * step/n.j;
		 					var lmax = lmin + step*(k-1);
		 					var lstep = step;
		 					var c = coverage(dmin, dmax, lmin, lmax);
		 					var s = simplicity(lmin, lmax, lstep);
		 					var d = density(k, m, dmin, dmax, lmin, lmax);
		 					var l = legibility(lmin, lmax, lstep);
		 					var score = w(s, c, d, l);

		 					if(score > bestScore && (!loose || (lmin <= dmin && lmax >= dmax))) {
		 						best.min = lmin; best.max = lmax; best.step = lstep; best.score = score;
		 						bestScore = score;
		 					}
		 				}
		 				z = z+1;
		 			}
		 		}
		 	}
		 	nice.reset();
		 	return best;
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
			if(this.step === 0) return [this.min,this.max];
			for(var x = this.min; x <= this.max; x = x+this.step){
				s.push(x.toFixed(this.fractionalDigits));
			}
			return s;
		};
		this.toString = function(){
			return this.toArray().join(" ");
		};
	};

	var MachineEpsilon = function(){
		var floatEpsilon;
		var doubleEpsilon;

		// Loop to compute the float epsilon value.
		var fTemp = parseFloat(0.5);
		while (1 + fTemp > 1) fTemp /= 2;
		floatEpsilon = fTemp;

		// Loop to compute the double epsilon value.
		var dTemp = 0.5;
		while (1 + dTemp > 1) dTemp /= 2;
		doubleEpsilon = dTemp;


	/**
	 * Return the float epsilon value.
	 * @returns the value
	 */
	 this.floatValue = function() { return floatEpsilon; }

	/**
	 * Return the double epsilon value.
	 * @returns the value
	 */
	 this.doubleValue = function() { return doubleEpsilon; }
	};

	/**
	 * Inner helper class NiceStep used as a C-struct to keep results between runs
	 * of next().
	 */
	 var NiceStep = function(){
	 	this.stepSize = undefined;
	 	this.offset = undefined;
	 	this.i = undefined;
	 	this.j = undefined;
	 };

	 var NiceStepSizeGenerator = function(){
	 	var Q = [1, 5, 2, 2.5, 4, 3];
	 	var base = 10;
	 	var niceStep = new NiceStep();

	 	if(arguments.length === 2){
	 		Q = arguments[0];
	 		base = arguments[1];
	 	}

	 	var  logB = function(a) {
	 		return Math.log(a)/Math.log(base);
	 	};
	 	var changeBase = function(base) {
	 		this.base = base;
	 		reset();
	 	};
	 	var stepSize = function(j, q) {
	 		return j*q/Math.pow(base, Math.floor(logB(j*q)));
	 	};
	 	var offsets = function(j, q) {
			var offs = [];//new double[j];
			for(var i=0; i<j; i++) {
				offs[i] = q*i/Math.pow(base, Math.floor(logB(j*q)));
			}
			return offs;
		};

		var i = 0;
		var io = 0;
		var j = 1;
		var q = Q[i];
		var ss = stepSize(j,q);
		var O = offsets(j,q);
		var o = 0;
		var ssOffMap = {};
		var resetRequired = false;

		return {
			base : base,
			logB : logB,
			getQ : function(){
				return Q;
			},
			reset : function(){
				if(resetRequired){
					i = 0;
					io = 0;
					j = 1;
					q = Q[i];
					ss = stepSize(j, q);
					O = offsets(j, q);
					ssOffMap = {};
					resetRequired = false;
				}
			},
			next : function(){
				//console.log("i "+i+", io "+io+", j "+j+", q "+q+", ss "+ss+", O "+JSON.stringify(O)+", o "+o+",  ssOffmap "+JSON.stringify(ssOffMap));
				niceStep.stepSize = ss;
				niceStep.offset = o;
				niceStep.i = i; // all output and calculations should add 1 because Wilkinsons index start from 1
				niceStep.j = j;

				// Keep track of existing offsets and stepSizes to avoid duplicate returns of
				// step size, offset pairs
				if(ssOffMap.hasOwnProperty(ss)) {  // ss already exist
					var oSet = ssOffMap[ss];
					while (!oSet.push(o) && io<O.length-1)  {
						++io;
						niceStep.offset = o = O[io];
					}

				} else {
					var oSet = [];
					oSet.push(o);
					ssOffMap[ss] = oSet;
				}
				++io; // position for next offset if it exists

				// iterate for next call
				if (io < O.length) {  	// if there are more offsets read them for next call
					o = O[io];    		// read offset and do nothing else
				} else {				// otherwise read for next step size
					io = 0;
					i = (i < Q.length-1) ? i+1 : 0;
					j = (i == 0) ? j+1 : j;
					q  = Q[i];
					ss = stepSize(j, q);
					O  = offsets(j, q);
					o = O[io];
				}
				resetRequired = true;
				return niceStep;
			}
		}
	};

	return function(){
		return new XWilkinson(new NiceStepSizeGenerator());
	}

});
