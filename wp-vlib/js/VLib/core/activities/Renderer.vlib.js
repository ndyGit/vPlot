define( ['require',
		'jquery',
		'core/Framework3D.vlib',
		'tween'],
	function ( require, $, F3D, TWEEN ) {
		var RENDERER = RENDERER || (function () {
				var activities_ = {};
				return {
					add   : function ( activity ) {
						if ( !activities_.hasOwnProperty( activity.container ) ) {
							activities_[activity.container] = [];
						}
						activities_[activity.container].push( activity );
					},
					remove: function ( activity ) {

						if ( !activities_.hasOwnProperty( activity.container ) ) {
							return;
						}
						var i = activities_[activity.container].indexOf( activity );
						if ( i !== -1 ) {
							activities_[activity.container].splice( i, 1 );
						}
					},
					empty : function () {
						activities_ = {};
					},
					update: function ( time, scene, camera, renderer, container ) {

						TWEEN.update();

						if ( !activities_.hasOwnProperty( container ) ) {
							return;
						}
						for ( var i = 0, len = activities_[container].length; i < len; ++i ) {
							if ( !activities_[container][i] ) {
								break;
							}

							activities_[container][i].update( {
								time     : time,
								scene    : scene,
								camera   : camera,
								renderer : renderer,
								container: container
							} );
						}
					}
				}
			})();


		RENDERER.EASING = TWEEN.Easing;
		RENDERER.getEasing = function ( type ) {
			"use strict";
			var easing;
			switch( type ){
				case 'None':
					easing = TWEEN.Easing.Linear.None;
					break;
				case 'QuadraticIn':
					easing = TWEEN.Easing.Quadratic.In;
					break;
				case 'QuadraticOut':
					easing = TWEEN.Easing.Quadratic.Out;
					break;
				case 'QuadraticInOut':
					easing = TWEEN.Easing.Quadratic.InOut;
					break;
				case 'SinusoidalIn':
					easing = TWEEN.Easing.Sinusoidal.In;
					break;
				case 'SinusoidalOut':
					easing = TWEEN.Easing.Sinusoidal.Out;
					break;
				case 'SinusoidalInOut':
					easing = TWEEN.Easing.Sinusoidal.InOut;
					break;
				case 'ExponentialIn':
					easing = TWEEN.Easing.Exponential.In;
					break;
				case 'ExponentialOut':
					easing = TWEEN.Easing.Exponential.Out;
					break;
				case 'ExponentialInOut':
					easing = TWEEN.Easing.Exponential.InOut;
					break;
				case 'BackIn':
					easing = TWEEN.Easing.Back.In;
					break;
				case 'BackOut':
					easing = TWEEN.Easing.Back.Out;
					break;
				case 'BackInOut':
					easing = TWEEN.Easing.Back.InOut;
					break;
				case 'ElasticIn':
					easing = TWEEN.Easing.Elastic.In;
					break;
				case 'ElasticOut':
					easing = TWEEN.Easing.Elastic.Out;
					break;
				case 'ElasticInOut':
					easing = TWEEN.Easing.Elastic.InOut;
					break;
				case 'BounceIn':
					easing = TWEEN.Easing.Bounce.In;
					break;
				case 'BounceOut':
					easing = TWEEN.Easing.Bounce.Out;
					break;
				case 'BounceInOut':
					easing = TWEEN.Easing.Bounce.InOut;
					break;
				default :
					easing = TWEEN.Easing.Linear.None;
					break;
			}
			return easing;
		};
		RENDERER.Tween = TWEEN.Tween;
		RENDERER.Activity = function ( container, object, callback, context ) {
			if ( arguments.length !== 4 ) {
				console.error( "[ RENDERER.Activity ] Invalid number of arguments given." );
				return;
			}
			this.container = container;

			var active_ = false;

			var object_ = object;
			this.update = function ( e ) {
				if ( !active_ ) return;
				var args = e;
				args.object = object_;
				args.self = this;

				callback.apply( context, [args] );
			};
			this.start = function () {
				if ( active_ ) {
					return;
				}
				active_ = true;
				RENDERER.add( this );
			};
			this.stop = function () {
				if ( !active_ ) {
					return;
				}
				active_ = false;
				RENDERER.remove( this );
			};
			this.destroy = function () {
				active_ = false;
				RENDERER.remove( this );
			}
		};
		return RENDERER;
	} );
