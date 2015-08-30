define( ['require',
		'../activities/Mouse.vlib',
		'../activities/Renderer.vlib',
		'../activities/PreparedTweens.vlib'],
	function ( require, MOUSE_ACTIVITIES, RENDERER_ACTIVITIES, PREPARED_ACTIVITIES ) {

		var ACTIVITY = ACTIVITY || {};
		/**
		 * Processes given animation chain and calls <doneCB> when last
		 * animation has finished.
		 *
		 * @param animations
		 * @param doneCB
		 * @param env
		 * @constructor
		 */
		ACTIVITY.AnimationHandler = function ( animations, doneCB, env ) {
			this.done = function () {/*noop*/};
			this.env = env || { context : this };
			this.animations = animations;
			if ( doneCB ) {
				this.done = doneCB;
			}

			this.exec = function ( e ) {
				var animationChain = [], tmp;
				var that = this;

				if(this.animations.length === 0){
					that.done( that.env.context );
				}

				for ( var i = 0, il = this.animations.length; i < il; ++i ) {

					tmp = this.animations[i].callback.apply( this.animations[i].context, [e] );

					tmp[tmp.length - 1].onComplete( function () {
						that.done( that.env.context );

					} );

					tmp[0].start();
				}
			}
		};
		/**
		 * Processes sequential and parallel animations
		 *
		 * @param animations
		 * @param activityEnv
		 * @constructor
		 */
		ACTIVITY.MouseActivityHandler = function ( animations, activityEnv ) {
			var active = false;
			var animations = animations;
			var running = [];
			var lock = activityEnv.config.lockActive;
			this.destroyable = false;

			var animationDone = function ( index ) {
				var i = running.indexOf( index );
				if ( i !== -1 ) {
					running.splice( i, 1 );
				}
			};
			var isRunning = function ( index ) {
				return running.indexOf( index ) === -1 ? false : true;
			};
			this.isLocked = function () {
				return (lock && active);
			};

			this.exec = function ( e, doneCB, doneCTX, destroy ) {
				/*
				// blocking?
				if(isRunning(e.intersection.object.id)){
					return false;
				}
				*/
				if(animations.length === 0){
					return false;
				}
				running.push( e.intersection.object.id );

				var sequentialAnimations, parallelAnimations = animations.length, doneCounter = 0;

				if(parallelAnimations === 0){
					doneCB.call( doneCTX, e.intersection.object.id );
				}

				for(var i = 0, il = parallelAnimations; i < il; ++i){
					sequentialAnimations = animations[ i ].callback.apply( animations[i].context, [e] );
					/* FIRE DONE IF LAST ANIMATION IN SEQUENTIAL-CHAIN REACHED */
					sequentialAnimations[sequentialAnimations.length - 1].onComplete( function () {
						animationDone( e.intersection.object.id );
						/* FIRE DONE IF ALL PARALLEL ANIMATION-CHAINS HAVE FINISHED */
						if(doneCB && doneCTX){
							doneCounter++;
							if(doneCounter === parallelAnimations) {
								doneCB.call( doneCTX, e.intersection.object.id );
								//console.log( "parallelAnimations on object %s DONE!", e.intersection.object.id );
								doneCounter = 0;
							}
						}
					} );


					if( destroy ){

						/* NORMAL ANIMATION */
						if( !this.destroyable ){
							sequentialAnimations[ 0 ].start();

						}else{
							/* SPECIAL OBJECT (LINK,LABEL). DESTROY WHAT CAN BE DESTROYED*/
							for( var j = 0, jl = sequentialAnimations.length; j < jl; ++j){
								if( sequentialAnimations[ j ].hasOwnProperty('destroy')){
									sequentialAnimations[ j ].destroy();
								}
							}
						}

					}else{
						/* START FIRST ANIMATION IN SEQUENTIAL-CHAIN */
						sequentialAnimations[ 0 ].start();
						if( sequentialAnimations[ 0].hasOwnProperty('destroy') ){
							this.destroyable = true;
						}
					}

				}
				active = true;
				return true;
			};



		};

		ACTIVITY.MOUSE = MOUSE_ACTIVITIES;
		ACTIVITY.RENDERER = RENDERER_ACTIVITIES;
		ACTIVITY.PreparedTween = PREPARED_ACTIVITIES;
		ACTIVITY.EVENT = {
			DIRECT: 'direct'
		};
		return ACTIVITY;
	} );
/*
 running = [];
 var animationDone = function ( index ) {
 var i = running.indexOf( index );
 if ( i !== -1 ) {
 console.log("%s deleted from index %s, value=%s",index,i,running[i]);
 running.splice( i, 1 );

 }
 };

 start = function( id){
 running.push( id );
 console.dir(running);
 setTimeout(function(){
 animationDone( id );
 },Math.random()*100);

 }
 for(var i = 0; i < 5; ++i){
 start(i);
 }
* */