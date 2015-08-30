define([ 'require','./getConfig.vlib', './setConfig.vlib', 'config','core/Animation.vlib','core/Utils.vlib', 'jquery' ],
	function(require, getConfig, setConfig, Config, Animation,UTILS, $) {
	/**
		TODO<br />
		@class Plugin BasicMaterial
		@constructor
		@extends Animation
		**/
		var Plugin = (function() {
			var name = 'fade';
			Plugin.superClass.constuctor.call(this,name);
			Plugin.superClass.setContext.call(this,Config.PLUGINTYPE.CONTEXT_3D);
			Plugin.superClass.setType.call(this,Config.PLUGINTYPE.ANIMATION);
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call(this,Config.getPluginPath()+ '/plugins_3d/activity/fade/templates.js');
			Plugin.superClass.setIcon.call(this,Config.getPluginPath()+ '/plugins_3d/activity/fade/icon.png');
			Plugin.superClass.setAccepts.call(this,{
				predecessors : [ Config.PLUGINTYPE.ACTIVITY, Config.PLUGINTYPE.ANIMATION, Config.PLUGINTYPE.STATE ],
				successors : [Config.PLUGINTYPE.ACTIVITY, Config.PLUGINTYPE.ANIMATION]
			});
			Plugin.superClass.setDescription.call(this,'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]');
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var isActive = false;
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.defaultYoyo = false;
			this.defaultFrom = 1;
			this.defaultTo = 0.5;
			this.defaultDuration = 1;

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
			};
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
		 	if (!env.config.hasOwnProperty('yoyo'))
		 		env.config.yoyo = this.defaultYoyo;
		 	if (!env.config.hasOwnProperty('from'))
		 		env.config.from = this.defaultFrom;
		 	if (!env.config.hasOwnProperty('to'))
		 		env.config.to = this.defaultTo;
		 	if (!env.config.hasOwnProperty('duration'))
		 		env.config.duration = this.defaultDuration;
		 };
		 this.handleEnv = function( env ){
		 	env.context = this;
		 	env.accepts = this.getAccepts();
		 	env.id = this.getId();
		 	env.name = this.getName();
		 	env.icon = this.getIcon();
		 };


		 this.fadeActivity = function( e ){
		 	this.tween = new UTILS.ACTIVITY.PreparedTween();
		 	var tween1,tween2, result = [];

		 	if(e.intersection.object.hasOwnProperty("multiMaterialObject")){

		 		var childs = e.intersection.object.multiMaterialObject.children;
		 		for(var i = 0, il = childs.length; i < il; ++i){
		 			tween1 = this.tween.fade(childs[i],this.env.config.from, this.env.config.to, this.env.config.duration );
		 			result.push( tween1 );
		 			if(this.env.config.yoyo){
		 				tween2 = this.tween.fade(childs[i], this.env.config.to, this.env.config.from, this.env.config.duration );
		 				result.push( tween2 );
		 			}
		 		}
		 	}else{
		 		tween1 = this.tween.fade(e.intersection.object,this.env.config.from, this.env.config.to, this.env.config.duration );
		 		result.push( tween1 );
		 		if(this.env.config.yoyo){
		 			tween2 = this.tween.fade(e.intersection.object, this.env.config.to, this.env.config.from, this.env.config.duration );
		 			result.push( tween2 );
		 		}
		 	}

		 	return Plugin.superClass.getAnimationChain( result, e, this.env );
		 };
		 this.fadeF32Activity = function( e ){

		 	this.tween = new UTILS.ACTIVITY.PreparedTween();
		 	var tween1,tween2, result = [];
		 	tween1 = this.tween.fadeVecF32(
		 		e.intersection.index,
		 		e.intersection.object,
		 		this.env.config.from,
		 		this.env.config.to,
		 		this.env.config.duration );
		 	result.push( tween1 );
		 	if(this.env.config.yoyo){
		 		tween2 = this.tween.fadeVecF32(e.intersection.index,
		 			e.intersection.object,
		 			this.env.config.to,
		 			this.env.config.from,
		 			this.env.config.duration );
		 		tween1.chain( tween2);
		 		result.push( tween2 );
		 	}
		 	return Plugin.superClass.getAnimationChain( result, e, this.env );
		 };
		 this.fade = function( e ){
		 	if(e.intersection.hasOwnProperty("index") && e.intersection.index !== null){
		 		/* SHADER ? */
		 		if(e.intersection.object.material.name === 'shader'){
		 			return this.fadeF32Activity( e );
		 		}else{
		 			return this.fadeActivity( e );
		 		}

		 	}else{
		 		return this.fadeActivity( e );
		 	}
		 };
		 this.exec = function(config, childs, bufferManager) {


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

		 	var result = {
		 		aType : Config.ACTION.FADE,
		 		context : this,
		 		callback : this.fade,
		 		activities : this.env.activities
		 	};
		 	return {
		 		pId : this.getId(),
		 		pType : this.type,
		 		response : result
		 	};
		 }

		});
UTILS.CLASS.extend(Plugin,Animation);
return Plugin;
});
