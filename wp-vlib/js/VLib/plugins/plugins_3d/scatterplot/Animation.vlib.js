define(
	[ 'require', 'config', 'core/utils.vlib','jquery', 'three','tween' ],
	function(require, Config, UTILS, $,THREE,TWEEN) {
		'use strict';
		var ANIMATION = ANIMATION || (function(){
			/* PRIVATES*/
			var _duration = 1000;
			/* PUBLIC INTERFACE*/
			return {

			}
		})();
		ANIMATION.TWEEN = {
			GEOMETRY : {
				project : function(from,to,duration){

					var positionsFrom = from.geometry.attributes.position.array;
					var positionsTo = to.attributes.position.array;
					var target,helper,params;
					if(positionsFrom.length !== positionsTo.length){
						throw new Error("ANIMATION.GEOMETRY.project: from != to "+positionsFrom.length+"-"+positionsTo.length);
					}

					for(var i = 0, len = positionsFrom.length; i < len; i+=3){

						helper = {
							x:positionsFrom[i],
							y:positionsFrom[i+1],
							z:positionsFrom[i+2]
						};
						target = {
							x:positionsTo[i],
							y:positionsTo[i+1],
							z:positionsTo[i+2]
						};
						//console.log(target);
						params = {
							index : i,
							system : from
						};

						var tween = new TWEEN.Tween( helper,params);
						tween.to(target, Math.random() *duration);
						tween.easing(TWEEN.Easing.Back.InOut);
						tween.onUpdate(function(o,args){
							var positionArray = args.system.geometry.attributes.position.array;
							positionArray[args.index] = this.x;
							positionArray[args.index+1] = this.y;
							positionArray[args.index+2] = this.z;
							args.system.geometry.attributes.position.needsUpdate = true;
						});
						tween.onComplete(function() {
							tween = undefined;
						});

						tween.start();

					}
				}
			}
		}
		return ANIMATION;
	});
