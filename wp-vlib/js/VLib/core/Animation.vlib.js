define([ 'require','core/AbstractPlugin.vlib','core/Utils.vlib' ],
	function(require, AbstractPlugin, UTILS) {
		var Animation = function( name ){
			Animation.superClass.constuctor.call(this,name);
		};

		UTILS.CLASS.extend(Animation,AbstractPlugin);

		Animation.prototype.getAnimationChain = function( animationArray, e, env ){
			if(env === undefined || env.animations === undefined){
				//console.error("[ Animation ] No environment given.");
				return animationArray;
			}
		 	var animations = env.animations;
		 	var animationChain = [];
		 	for(var i = 0, il = animations.length; i < il; ++i){
		 		tmp = animations[ i ].callback.apply(animations[ i ].context, [ e ]);
		 		animationChain = animationChain.concat( tmp );
		 	}
		 	animationChain = animationArray.concat( animationChain );
		 	for(var i = 1, il = animationChain.length; i < il; ++i){
		 		animationChain[i-1].chain(animationChain[ i ]);
		 	}
		 	return animationChain;
		 };

		 Animation.prototype.getEasing = function( type ){
		 	var easing;
		 	switch( type ){
		 		case 'None':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Linear.None;
		 		break;
		 		case 'QuadraticIn':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Quadratic.In;
		 		break;
		 		case 'QuadraticOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Quadratic.Out;
		 		break;
		 		case 'QuadraticInOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Quadratic.InOut;
		 		break;
		 		case 'SinusoidalIn':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Sinusoidal.In;
		 		break;
		 		case 'SinusoidalOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Sinusoidal.Out;
		 		break;
		 		case 'SinusoidalInOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Sinusoidal.InOut;
		 		break;
		 		case 'ExponentialIn':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Exponential.In;
		 		break;
		 		case 'ExponentialOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Exponential.Out;
		 		break;
		 		case 'ExponentialInOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Exponential.InOut;
		 		break;
		 		case 'BackIn':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Back.In;
		 		break;
		 		case 'BackOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Back.Out;
		 		break;
		 		case 'BackInOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Back.InOut;
		 		break;
		 		case 'ElasticIn':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Elastic.In;
		 		break;
		 		case 'ElasticOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Elastic.Out;
		 		break;
		 		case 'ElasticInOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Elastic.InOut;
		 		break;
		 		case 'BounceIn':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Bounce.In;
		 		break;
		 		case 'BounceOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Bounce.Out;
		 		break;
		 		case 'BounceInOut':
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Bounce.InOut;
		 		break;
		 		default :
		 		easing = UTILS.ACTIVITY.RENDERER.EASING.Linear.None;
		 		break;
		 	}
		 	return easing;
		 };
		Animation.prototype.getF32Position = function( target, e ){
			var vertices = e.intersection.object.geometry.getAttribute('position').array;
			var index = e.intersection.index;
			if( target.x === ''){
				target.x = vertices[ index*3 ];
			}
			if( target.y === ''){
				target.y = vertices[ index*3+1 ];
			}
			if( target.z === ''){
				target.z = vertices[ index*3+2 ];
			}
		};
		Animation.prototype.getPosition = function( target, object ){
			var pos = object.position;
			if( target.x === ''){
				target.x = pos.x;
			}
			if( target.y === ''){
				target.y = pos.y;
			}
			if( target.z === ''){
				target.z = pos.z;
			}
		};
		Animation.prototype.getScale = function( target, object ){
			var scale = object.scale;
			if( target.x === ''){
				target.x = scale.x;
			}
			if( target.y === ''){
				target.y = scale.y;
			}
			if( target.z === ''){
				target.z = scale.z;
			}
			if( target.x == 0){
				target.x = 0.0001;
			}
			if( target.y == 0){
				target.y = 0.0001;
			}
			if( target.z == 0){
				target.z = 0.0001;
			}
		};
		 return Animation;
	});
