define( ['require', 'jquery', 'core/Framework3D.vlib', 'core/activities/Renderer.vlib'], function ( require, $, F3D, RENDERER ) {
	var PreparedTweens = function () {
		this.Easing = TWEEN.Easing;

		this.fadeTo = function ( object, opacity, duration, easing ) {
			var ease = arguments.length !== 4 ? TWEEN.Easing.Exponential.Out : easing;
			TweenLite.to( object.material, duration, {
				ease   : ease,
				opacity: opacity
			} );
		};

		this.moveTo = function ( object, properties, duration, easing ) {
			var easing_ = arguments.length !== 4 ? TWEEN.Easing.Linear.None : easing;
			var duration_ = arguments.length !== 3 ? 1 : duration;

			if ( arguments.length < 2 ) {
				return false;
			}
			properties.ease = easing_;
			TweenLite.to( object.position, duration_, properties );
		};

		this.fade = function ( object, opacityFrom, opacityTo, duration ) {

			var args = {object: object};
			var tween = new TWEEN.Tween( {opacity: opacityFrom}, args );
			tween.to( {opacity: opacityTo}, duration * 1000 );
			tween.onUpdate( function ( i, args ) {
				args.object.dynamic = true;
				args.object.material.opacity = this.opacity;
				args.object.material.needsUpdate = true;
				//console.log(args.object.material.opacity);
			} );

			return tween;
		};
		this.fadeVecF32 = function ( index, object, opacityFrom, opacityTo, duration, easing ) {
			var opacity = object.geometry.getAttribute( 'opacity' );
			var args = {
				index  : index,
				opacity: opacity
			};
			var tween = new TWEEN.Tween( {opacity: opacityFrom}, args );
			tween.to( {opacity: opacityTo}, duration * 1000 );
			tween.onUpdate( function ( i, args ) {
				args.opacity.array[args.index] = 0.3;//this.opacity;
				args.opacity.needsUpdate = true;
			} );

			return tween;
		};

		this.moveObject = function ( object, to, duration, easing ) {

			var args = {object: object};
			var to_cpy = JSON.parse( JSON.stringify( to ) );
			to_cpy.x = parseFloat( to_cpy.x );
			to_cpy.y = parseFloat( to_cpy.y );
			to_cpy.z = parseFloat( to_cpy.z );
			var tween = new TWEEN.Tween( object.position, args );
			tween.to( to_cpy, duration * 1000 );
			tween.easing( easing );
			tween.onUpdate( function ( i, args ) {
				args.object.position.set( this.x, this.y, this.z );
				args.object.needsUpdate = true;
			} );

			return tween;
		};

		this.scale = function ( object, to, duration, easing ) {
			var args = {object: object};
			var to_cpy = JSON.parse( JSON.stringify( to ) );
			to_cpy.x = parseFloat( to_cpy.x );
			to_cpy.y = parseFloat( to_cpy.y );
			to_cpy.z = parseFloat( to_cpy.z );
			var tween = new TWEEN.Tween( object.scale, args );
			tween.to( to_cpy, duration * 1000 );
			tween.easing( easing );
			tween.onUpdate( function ( i, args ) {
				args.object.scale.set( this.x, this.y, this.z );
				args.object.needsUpdate = true;
			} );
			return tween;
		};

		this.highlightArray = function ( container, object, to, duration, easing, doneCallback ) {
			"use strict";

			var clock = new F3D.Clock( false );
			var interpolate = function ( start, end, value ) {
				return start + ( end - start ) * value;
			};
			var elapsed, value, start, end, color, len = object.geometry.colors.length, colors = object.geometry.colors;
			var startTime = false;

			var renderActivity = new RENDERER.Activity( container, object, function ( e ) {

				if ( !startTime ) {
					clock.start();
					startTime = clock.startTime;
					return true;
				}

				elapsed = clock.getElapsedTime() / duration;
				elapsed = elapsed > 1 ? 1 : elapsed;
				value = easing( elapsed );

				for ( var i = 0; i < len; ++i ) {
					color = colors[i];

					color.r = interpolate( color.r, to[i].r, value);
					color.g = interpolate( color.g, to[i].g, value);
					color.b = interpolate( color.b, to[i].b, value);

				}

				object.geometry.colorsNeedUpdate = true;

				if ( elapsed === 1 ) {
					renderActivity.stop();
					doneCallback();
				}

			}, this );

			return renderActivity;

		};

		this.highlightF32Array = function ( object, to, duration, easing, doneCallback ) {
			"use strict";

			var tween = new TWEEN.Tween( object.geometry.getAttribute( 'color' ).array );
			tween.easing( easing );
			tween.to( to, duration * 1000 );
			tween.onUpdate( function () {
				object.geometry.attributes.color.needsUpdate = true;
			} );
			if ( doneCallback ) {
				tween.onComplete( function () {
					doneCallback();
				} );
			}

			return tween;
		};

		this.moveArray = function ( container, object, to, duration, easing, doneCallback ) {
			"use strict";


			var clock = new F3D.Clock( false );
			var interpolate = function ( start, end, value ) {
				return start + ( end - start ) * value;
			};
			var elapsed, value, start, end, vertex, len = object.geometry.vertices.length, vertices = object.geometry.vertices;
			var startTime = false;
			var renderActivity = new RENDERER.Activity( container, object, function ( e ) {

				if ( !startTime ) {
					clock.start();
					startTime = clock.startTime;
					return true;
				}

				elapsed = clock.getElapsedTime() / duration;
				elapsed = elapsed > 1 ? 1 : elapsed;
				value = easing( elapsed );

				for ( var i = 0; i < len; ++i ) {

					vertices[i].x = interpolate( vertices[i].x, to[i].x, value );
					vertices[i].y = interpolate( vertices[i].y, to[i].y, value );
					vertices[i].z = interpolate( vertices[i].z, to[i].z, value );

				}

				object.geometry.verticesNeedUpdate = true;

				if ( elapsed === 1 ) {
					renderActivity.stop();
					doneCallback();
				}

			}, this );

			return renderActivity;

		};

		this.moveF32Array = function ( object, to, duration, easing, doneCallback ) {
			"use strict";

			var tween = new TWEEN.Tween( object.geometry.getAttribute( 'position' ).array );
			tween.easing( easing );
			tween.to( to, duration * 1000 );
			tween.onUpdate( function () {
				object.geometry.attributes.position.needsUpdate = true;
			} );
			if ( doneCallback ) {
				tween.onComplete( function () {
					doneCallback();
				} );
			}


			return tween;
		};

		this.moveVecF32 = function ( index, object, to, duration, easing, doneCallback ) {
			var f32_index = index * 3;
			var f32_to = JSON.parse( JSON.stringify( to ) );
			f32_to.x = parseFloat( f32_to.x );
			f32_to.y = parseFloat( f32_to.y );
			f32_to.z = parseFloat( f32_to.z );
			var vertices = object.geometry.getAttribute( 'position' );
			var vector = {
				x: vertices.array[f32_index],
				y: vertices.array[f32_index + 1],
				z: vertices.array[f32_index + 2]
			};

			var args = {vertices: vertices};
			var tween = new TWEEN.Tween( vector, args );
			tween.to( f32_to, duration * 1000 );
			tween.easing( easing );
			tween.onStart( function () {
				vertices = object.geometry.getAttribute( 'position' );
				vector = {
					x: vertices.array[f32_index],
					y: vertices.array[f32_index + 1],
					z: vertices.array[f32_index + 2]
				};

				tween.updateStartingValues( vector );

			} );
			tween.onUpdate( function ( i, args ) {
				args.vertices.array[f32_index] = this.x;
				args.vertices.array[f32_index + 1] = this.y;
				args.vertices.array[f32_index + 2] = this.z;
				args.vertices.needsUpdate = true;
			} );
			tween.onComplete( function () {
				if ( doneCallback ) {
					doneCallback();
				}
			} );

			return tween;
		};
	};
	return PreparedTweens;
} );
