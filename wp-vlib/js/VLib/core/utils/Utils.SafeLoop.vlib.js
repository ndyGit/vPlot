define(['require'],function(require) {
	'use strict';
/*
	Inspired by
	http://www.picnet.com.au/blogs/Guido/post/2010/03/04/How-to-prevent-Stop-running-this-script-message-in-browsers
*/
var SafeLoop = function () {

	var count = 0;
	var STEPS_ = 20000;
	var YIELD_ = 1;
	var iterations = 0;
	var index = 0;
	var fun;
	var context = this;

	/**
		Abstract
		Method stub
	*/
	this.callback = function( e ){
		console.log("index:"+ e );
	};
	/**
		yield time in milliseconds
	*/
	this.yield = function( y ){
		YIELD_ = y;
		return this;
	};
	/*
		Set steps till yield
	*/
	this.steps = function( steps ){
		STEPS_ = steps;
		return this;
	};
	/**
		Set number of iterations
	*/
	this.iterations = function( i ){
		iterations = i;
		return this;
	};
	/**
	 * Update loop index
	 * @param newIndex
	 */
	this.setIndex = function( newIndex ){
		index = newIndex < 0 ? 0 : newIndex;
	};
	/**
		Initialization function
	*/
	this.loop = function( callback ){
		if( callback === undefined){
			console.log("[ ERROR ][ SafeLoop.run( data )] No callback given");
		}
		fun = callback;

		this.step();
	};
	/**
	 * Stop running loop
	 */
	this.break = function(){
		iterations = 0;
	};
	/**
		Set done callback.
		This method will be called after { iterations } steps
	*/
	this.done = function( cb ){
		this.callback = cb;
		return this;
	};
	this.step = function(){
		//console.log("iterations: "+iterations+" index: "+index +" steps: "+STEPS_+" yield: "+YIELD_);
		if(index < iterations){
			fun(index++);
			if(++count >= STEPS_){
				count = 0;
				setTimeout(function(){context.step();},YIELD_);
			}else{
				try {
					this.step();
				}catch(e){
					count = 0;
					setTimeout(function(){context.step();},YIELD_);
				}
			}
		}else{

			if(this.callback){
				this.callback.call( index );
				this.callback = false;
			}

		}

	};
};
return function(){
	return new SafeLoop();
};
});

/*
// better ?????
 var requestId;
 var counter = 0;

 function loop() {
 console.log(counter++);
 if( counter === 1000){
 stop();
 return;
 }

 requestId = window.requestAnimationFrame(loop);
 }

 function start() {
 if (!requestId) {
 loop();
 }
 }

 function stop() {
 if (requestId) {
 window.cancelAnimationFrame(requestId);
 requestId = undefined;
 }
 }

 start();
* */