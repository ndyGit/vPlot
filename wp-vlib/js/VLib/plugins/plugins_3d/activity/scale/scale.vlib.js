define([ 'require','./getConfig.vlib', './setConfig.vlib', 'config','core/Animation.vlib','core/Utils.vlib', 'jquery' ],
	function(require, getConfig, setConfig, Config, Animation,UTILS, $) {
	/**
		TODO<br />
		@class Plugin BasicMaterial
		@constructor
		@extends AbstractPlugin
		**/
		var Plugin = (function() {
			var name = 'scale';
			Plugin.superClass.constuctor.call(this,name);
			Plugin.superClass.setContext.call(this,Config.PLUGINTYPE.CONTEXT_3D);
			Plugin.superClass.setType.call(this,Config.PLUGINTYPE.ANIMATION);
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call(this,Config.getPluginPath()+ '/plugins_3d/activity/scale/templates.js');
			Plugin.superClass.setIcon.call(this,Config.getPluginPath()+ '/plugins_3d/activity/scale/icon.png');
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

			this.defaultYoyo = false;
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
		 	if (!env.config.hasOwnProperty('target'))
		 		env.config.target = this.defaultTarget;
		 	if (!env.config.hasOwnProperty('yoyo'))
		 		env.config.yoyo = this.defaultYoyo;
		 	if (!env.config.hasOwnProperty('easing'))
		 		env.config.yoyo = this.defaultEasing;
		 	if (!env.config.hasOwnProperty('to'))
		 		env.config.to = JSON.parse(JSON.stringify(this.defaultTo));
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

		this.scale = function( e ){
			var result = [],childs;
			if(e.intersection.object.hasOwnProperty("multiMaterialObject")){
				childs = e.intersection.object.multiMaterialObject.children;
				for(var i = 0, il = childs.length; i < il; ++i){
					result = result.concat( this.scaleSingleObject(childs[ i ] ) );
				}
			}else{
				result =  this.scaleSingleObject( e.intersection.object );
			}
			return Plugin.superClass.getAnimationChain( result, e, this.env);
		};

		this.scaleSingleObject = function( object ){

			this.tween = new UTILS.ACTIVITY.PreparedTween();
			var easing = this.getEasing( this.env.config.easing );
			var tween1,tween2, result = [];
			var target = JSON.parse(JSON.stringify( this.env.config.to ));
			var from = object.backup.scale.clone();

			target.x *= from.x;
			target.y *= from.y;
			target.z *= from.z;


			Plugin.superClass.getScale(target,object);

			tween1 = this.tween.scale(object, target, this.env.config.duration, easing );
			result.push( tween1 );
			if(this.env.config.yoyo){
				tween2 = this.tween.scale(object, from, this.env.config.duration, easing );
				result.push( tween2 );
			}
			return result;
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
			// console.log("scale");
			// console.dir(this.env.activities);

			var result = {
				aType : Config.ACTION.SCALE,
				context : this,
				callback : this.scale,
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

	});

UTILS.CLASS.extend(Plugin,Animation);
return Plugin;
});
