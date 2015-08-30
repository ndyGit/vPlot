define([ 'require','./getConfig.vlib', './setConfig.vlib', 'config','core/Animation.vlib','core/Utils.vlib', 'jquery' ],
	function(require, getConfig, setConfig, Config, Animation,UTILS, $) {
	/**
		TODO<br />
		@class Plugin BasicMaterial
		@constructor
		@extends AbstractPlugin
		**/
		var Plugin = (function() {
			var name = 'move';
			Plugin.superClass.constuctor.call(this,name);
			Plugin.superClass.setContext.call(this,Config.PLUGINTYPE.CONTEXT_3D);
			Plugin.superClass.setType.call(this,Config.PLUGINTYPE.ANIMATION);
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call(this,Config.getPluginPath()+ '/plugins_3d/activity/move/templates.js');
			Plugin.superClass.setIcon.call(this,Config.getPluginPath()+ '/plugins_3d/activity/move/icon.png');
			Plugin.superClass.setAccepts.call(this,{
				predecessors : [ Config.PLUGINTYPE.ACTIVITY, Config.PLUGINTYPE.ANIMATION, Config.PLUGINTYPE.STATE ],
				successors : [ Config.PLUGINTYPE.ACTIVITY, Config.PLUGINTYPE.ANIMATION ]
			});
			Plugin.superClass.setDescription.call(this,'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]');
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var isActive = false;
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.PATTERN_ORIGIN = '<origin>';
			this.defaultTarget = 'group';
			this.defaultYoyo = false;
			this.defaultOrigin = false;
			this.defaultEasing = 'None';
			this.defaultTo = {x:'',y:'',z:''};
			this.defaultDuration = 1;
			this.defaultActiveOnComplete = true;

			this.env;
			this.childs;
			this.bufferManager;
			this.tween;
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.destroy = function(){
				if(this.activity)
					this.activity.destroy();
			}
		/**
		 * Takes inserted configuration from the plugin-template and returns the
		 * parameters as JSON-config-file
		 *
		 * @param containerId
		 *            parent container where the plugin-template got added
		 *
		 * @return config file format: {camera:{x:VALUE,y:VALUE,z:VALUE}}
		 */
		 this.getConfigCallback = getConfig;
		/**
		 * Takes arguments from config and inserts them to the plugin-template
		 *
		 * @param config
		 *            plugin config file
		 * @param containerId
		 *            parent container where the plugin-template got added
		 */
		 this.setConfigCallback = setConfig;
		 this.handleConfig = function( config, env){
		 	env.config = config || {};
		 	if (!env.config.hasOwnProperty('target'))
		 		env.config.target = this.defaultTarget;
		 	if (!env.config.hasOwnProperty('yoyo'))
		 		env.config.yoyo = this.defaultYoyo;
		 	if (!env.config.hasOwnProperty('origin'))
		 		env.config.origin = this.defaultOrigin;
		 	if (!env.config.hasOwnProperty('easing'))
		 		env.config.yoyo = this.defaultEasing;
		 	if (!env.config.hasOwnProperty('to'))
		 		env.config.to = JSON.parse(JSON.stringify(this.defaultTo));
		 	if (!env.config.hasOwnProperty('duration'))
		 		env.config.duration = this.defaultDuration;
		 	if (!env.config.hasOwnProperty('activeOnComplete'))
		 		env.config.activeOnComplete = this.defaultActiveOnComplete;
		 };
		 this.handleEnv = function( env ){
		 	env.context = this;
		 	env.accepts = this.getAccepts();
		 	env.id = this.getId();
		 	env.name = this.getName();
		 	env.icon = this.getIcon();
		 }

		 this.getEasing = function( type ){
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
		 this.getTargetPosition = function( object, object_type ){
		 	var target = JSON.parse(JSON.stringify( this.env.config.to ));

		 	if( target.x === ''){
		 		target.x = object.object[ object.index*3 ];
		 	}
		 	if( target.y === ''){
		 		target.y = object.object[ object.index*3+1 ];
		 	}
		 	if( target.z === ''){
		 		target.z = object.object[ object.index*3+2 ];
		 	}

		 	return target;
		 };

		 this.moveVecF32 = function( e ){
		 	//Plugin.superClass.handleActivities( e.intersection.object, this.bufferManager, this.env );
		 	this.tween = new UTILS.ACTIVITY.PreparedTween();
		 	var easing = this.getEasing( this.env.config.easing );
		 	var tween1,tween2,from, result = [];
		 	var target = JSON.parse(JSON.stringify( this.env.config.to ));

		 	getF32Position( target, e );

		 	tween1 = this.tween.moveVecF32(
		 		e.intersection.index,
		 		e.intersection.object,
		 		target,
		 		this.env.config.duration,
		 		easing
		 		);
		 	result.push( tween1 );
		 	if(this.env.config.yoyo){
		 		var from = {
		 			x : '',
		 			y : '',
		 			z : ''
		 		};
		 		getF32Position( from, e );
		 		tween2 = this.tween.moveVecF32(e.intersection.index,e.intersection.object, from, this.env.config.duration, easing );
		 		result.push( tween2 );
		 	}

		 	return Plugin.superClass.getAnimationChain( result, e, this.env);
		 };

		 this.moveVector = function( e ){
		 	var tweens;
		 	if(e.intersection.hasOwnProperty('index') &&
		 		e.intersection.index !== null &&
		 		e.intersection.index !== undefined){
		 		/* move PointCloud element */
		 	tweens = this.moveVecF32( e );

			 } else if(e.intersection.hasOwnProperty('face') &&
			 	e.intersection.face !== null){
			 	/* move surface */
			 	tweens = this.moveObject( e );
			 }else{
			 	/* move vertex */
			 	tweens = this.moveObject( e );
			 }

		 return tweens;
		};

		this.activities;
		this.moveObject = function( e ){

			var result = [],childs;
			if(e.intersection.object.hasOwnProperty("parent") && e.intersection.object.parent.hasOwnProperty("multiMaterialObject")){
				childs = e.intersection.object.parent.multiMaterialObject.children;
				for(var i = 0, il = childs.length; i < il; ++i){
					result = result.concat( this.moveSingleObject(childs[ i ] ) );
				}
			}else{
				result =  this.moveSingleObject( e.intersection.object );
			}
			return Plugin.superClass.getAnimationChain( result, e, this.env );
		};

		this.moveSingleObject = function( object ){

			this.tween = new UTILS.ACTIVITY.PreparedTween();
			var easing = this.getEasing( this.env.config.easing );
			var tween1,tween2;
			var target = JSON.parse(JSON.stringify( this.env.config.to ));
			getPosition(target,object);
			tween1 = this.tween.moveObject(object, target, this.env.config.duration, easing );
			if(this.env.config.yoyo){
				var from = getBackup( object ).position.clone();
				tween2 = this.tween.moveObject(object, from, this.env.config.duration, easing );
				return [ tween1, tween2 ];
			}
			return [ tween1 ];
		};

		this.exec = function(config, childs, bufferManager) {
			this.bufferManager = bufferManager;
			this.env = {};
			this.handleConfig( config, this.env );
			this.handleEnv( this.env );
			Plugin.superClass.handleChilds( childs, this.env );
			this.childs = childs;
			this.bufferManager = bufferManager;
			var subactivities = [];
			for(var i = 0, il = this.env.animations.length; i < il; ++i){
				subactivities = subactivities.concat( this.env.animations[ i ].activities );
			}
			this.env.activities = this.env.activities.concat( subactivities );
			if(this.env.config.target === 'group'){
				callback = this.moveObject;
			}else{
				callback = this.moveVector;
			}

			var result = {
				aType : Config.ACTION.MOVE,
				context : this,
				callback : callback,
				activities : this.env.activities
			};
			return {
				pId : this.getId(),
				pType : this.type,
				response : result
			};
		};
		/** ********************************** */
		/** PRIVATE METHODS * */
		/** ********************************** */
		var getF32Position = function( target, e ){
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
			if(!e.intersection.object.backup){
				console.error("[ move.getf32Position() ] Geometry backup not found.");
				//console.dir(e.intersection.object);
				return;
			}
			vertices = e.intersection.object.backup.geometry.getAttribute('position').array;
			if(target.x === Config.PATTERN.ORIGIN){
				target.x = vertices[ index*3 ];
			}
			if(target.y === Config.PATTERN.ORIGIN){
				target.y = vertices[ index*3+1 ];
			}
			if(target.z === Config.PATTERN.ORIGIN){
				target.z = vertices[ index*3+2 ];
			}
		};
		var getPosition = function( target, object, backup ){

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
			if(!object.backup){
				console.error("[ move.getPosition() ] Geometry backup not found.");
				//console.dir(object);
				return;
			}

			if(target.x === Config.PATTERN.ORIGIN){
				target.x = object.backup.position.x
			}
			if(target.y === Config.PATTERN.ORIGIN){
				target.y = object.backup.position.y
			}
			if(target.z === Config.PATTERN.ORIGIN){
				target.z = object.backup.position.z
			}
		};
		var getBackup = function( object ){
			var backup;
			if(object.backup){
				backup = object.backup;
			}else if(object.multiMaterialObject){
				backup = object.multiMaterialObject.backup;
			}else if( object.parent &&  object.parent.multiMaterialObject && object.parent.multiMaterialObject.backup ){
				backup = object.parent.multiMaterialObject.backup;
			}
			return backup;
		}
	});

UTILS.CLASS.extend(Plugin,Animation);
return Plugin;
});
