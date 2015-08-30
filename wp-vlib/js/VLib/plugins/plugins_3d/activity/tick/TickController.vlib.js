/**
 * Created by Andreas Gratzer on 05/12/14.
 */
define( ['require', 'jquery', 'config', 'core/Utils.vlib', 'core/activities/PreparedTweens.vlib','core/Framework3D.vlib'], function ( require, $, Config, UTILS, PreparedTweens, F3D ) {
	var Tick = function ( config, env, bufferManager ) {
		"use strict";
		var context = this;
		this.config = config;
		this.tweenCollection = new PreparedTweens();
		this.env = env;
		this.bufferManager = bufferManager;
		this.tickDirection = false;
		this.ticks = false;
		this.currentTick = false;

		this.intersectionArgs = false;
		this.object = false;
		this.objectPID = false;
		this.tweenCoords = false;
		this.tweenColors = false;
		this.easing = UTILS.ACTIVITY.RENDERER.getEasing( this.config.easing );
		this.duration = this.config.duration;

		this.$container = $( '#' + this.env.config.container ).find( Config.PLOT_CONTAINER );

		this.isDataDone = false;
		this.isColorsDone = false;

		this.onCompleteCallback = function () {
			/* NOOP */
		};
		this.dataDone = function(){
			context.isDataDone = true;
			if( context.isDataDone && context.isColorsDone ){
				F3D.getBoundingBox( context.object );
				context.onCompleteCallback();
			}
		};
		this.colorsDone = function(){
			context.isColorsDone = true;
			if( context.isDataDone && context.isColorsDone ){
				F3D.getBoundingBox( context.object );
				context.onCompleteCallback();
			}
		};


		this.renderloop = new UTILS.ACTIVITY.RENDERER.Activity( this.$container, this.object, function () {
			//TODO ANIMATE OBJECT
		}, this );
	};

	/**
	 *
	 * @param args
	 */
	Tick.prototype.setIntersectionArgs = function ( args ) {

		this.intersectionArgs = args;
		this.object = this.intersectionArgs.intersection.object;

		this.objectPID = this.object.userData.id;
		/* multimaterial object ?  */
		if(!this.objectPID){
			if( this.object.parent ){
				this.objectPID = this.object.parent.userData.id;
			}
		}
		this.objectBuffer = this.bufferManager.getBuffer( this.objectPID );
		this.ticks = this.objectBuffer.getAttribute( Config.BUFFER.RAW_DATA_TICK ).array;
		this.currentTick = this.objectBuffer.getAttribute( Config.BUFFER.CURRENT_TICK ).array.currentTick;
	};

	/**
	 *
	 * @param tickDirection
	 */
	Tick.prototype.setTickDirection = function ( tickDirection ) {
		"use strict";
		this.tickDirection = tickDirection;
	};

	/**
	 *
	 * @returns {boolean}
	 */
	Tick.prototype.start = function () {
		"use strict";
		var scaledData = this.objectBuffer.getAttribute( Config.BUFFER.SCALED_COORDS );
		var colors = this.objectBuffer.getAttribute( Config.BUFFER.COLORS );
		var nextTick = this.getNextTick( this.currentTick, this.ticks );

		if ( scaledData.array[nextTick] ) {

			if ( scaledData.array[nextTick] instanceof Float32Array ) {
				this.tweenCoords = this.tweenCollection.moveF32Array( this.object, scaledData.array[nextTick], this.duration, this.easing, this.dataDone );
			} else {
				this.tweenCoords = this.tweenCollection.moveArray( this.$container.attr('id'), this.object, scaledData.array[nextTick], this.duration, this.easing, this.dataDone );
			}

		} else {
			console.warn( '[ TickController.start() ] COORD - Tick "%s" not found!' );
		}

		if ( colors.array[ nextTick ] instanceof Float32Array ) {
			this.tweenColors = this.tweenCollection.highlightF32Array( this.object, colors.array[nextTick], this.duration, this.easing, this.colorsDone );

		}else {
			this.tweenColors = this.tweenCollection.highlightArray( this.$container.attr('id'), this.object, colors.array[nextTick], this.duration, this.easing, this.colorsDone );
		}

		this.setCurrentTickBuffer( nextTick );
		if ( this.tweenCoords ) {
			this.tweenCoords.start();
		}
		if ( this.tweenColors ) {
			this.tweenColors.start();
		}

		return true;
	};

	/**
	 *
	 * @param currentTick
	 * @param ticks
	 * @returns tick index
	 */
	Tick.prototype.getNextTick = function ( currentTick, ticks ) {
		"use strict";

		var keys = Object.keys( ticks );
		var pos = keys.indexOf( currentTick.toString() );

		if ( pos !== -1 && (pos + 1) < keys.length ) {
			return keys[pos + 1];
		}

		return keys[0];
	};
	/**
	 *
	 * @returns {boolean}
	 */
	Tick.prototype.stop = function () {
		"use strict";
		if ( this.tweenCoords ) {
			this.tweenCoords.stop();
		}
		if ( this.tweenColors ) {
			this.tweenColors.stop();
		}
		return true;
	};
	/**
	 *
	 */
	Tick.prototype.destroy = function () {
		"use strict";
		this.intersectionArgs = false;
		this.tweenCoords = false;
		this.tweenColors = false;
		this.object = false;
		this.objectPID = false;

	};
	/**
	 *
	 */
	Tick.prototype.onComplete = function ( callback ) {
		"use strict";
		this.onCompleteCallback = callback;
	};

	/**
	 *
	 * @param bufferManager
	 * @param env
	 */
	Tick.prototype.setCurrentTickBuffer = function ( tick ) {
		var tba = this.objectBuffer.getAttribute( Config.BUFFER.CURRENT_TICK );
		tba.array.currentTick = tick;
	};

	return Tick;
} );