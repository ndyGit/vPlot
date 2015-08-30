define(['require', 'three_tween'],function(require) {
	'use strict';

	var Animation = function(){
		this.Easing = TWEEN.Easing;
		this.fadeTo = function( object, opacity, duration, easing){
			var ease = arguments.length !== 4 ? TWEEN.Easing.Exponential.Out : easing;
			TweenLite.to(object.material, duration, {
				ease:ease,
				opacity : opacity
			});
		};
		this.moveTo = function( object, properties, duration, easing){
			var easing_ = arguments.length !== 4 ? TWEEN.Easing.Linear.None : easing;
			var duration_ = arguments.length !== 3 ? 1 : duration;
			if(arguments.length < 2) return false;
			properties.ease = easing_;
			// console.dir(properties);
			// console.dir(object);

			//properties.delay = 1;
			TweenLite.to(object.position, duration_, properties);
		}
	}

	return Animation;

});
