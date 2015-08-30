define([ 'require', 'config', './setConfig.vlib', './getConfig.vlib', 'core/AbstractPlugin.vlib','core/Utils.vlib', 'three', 'jquery' ],
	function(require, Config, setConfig, getConfig, AbstractPlugin,UTILS,THREE, $) {
	/**
		TODO<br />
		@class Plugin WireframeMaterial
		@constructor
		@extends AbstractPlugin
	**/
	var Plugin = (function() {
		var name = 'wireframeMaterial';
		Plugin.superClass.constuctor.call(this,name);
		Plugin.superClass.setContext.call(this,Config.PLUGINTYPE.CONTEXT_3D);
		Plugin.superClass.setType.call(this,Config.PLUGINTYPE.MATERIAL);
		/** path to plugin-template file * */
		Plugin.superClass.setTemplates.call(this,Config.getPluginPath()+ '/plugins_3d/materials/wireframe/templates.html');
		Plugin.superClass.setIcon.call(this,Config.getPluginPath()+ '/plugins_3d/materials/wireframe/icon.png');
		Plugin.superClass.setAccepts.call(this,{
			predecessors : [ Config.PLUGINTYPE.PLOT ],
			successors : [Config.PLUGINTYPE.COLOR, Config.PLUGINTYPE.ACTIVITY]
		});
		Plugin.superClass.setDescription.call(this,'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]');
		/** ********************************** */
		/** PRIVATE VARIABLES * */
		/** ********************************** */

		/** ********************************** */
		/** PUBLIC VARIABLES * */
		/** ********************************** */
		this.interactiveObject;
		/** ********************************** */
		/** PUBLIC METHODS * */
		/** ********************************** */
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

		this.handleColor = function(){
			"use strict";
			if(this.env.raw_color !== undefined){
				this.interactiveObject.color = new THREE.Color("#"+this.env.raw_color);
			}else{
				this.interactiveObject.vertexColors = THREE.VertexColors;
			}
		};

		 this.handleConfig = function( config, env){
		 	env.config = config || {};
		 	if (env.config.opacity === undefined){
		 		env.config.opacity = 1;
		 	}
		 	if (env.config.transparent === undefined){
		 		env.config.transparent = true;
		 	}
		 	if (env.config.lineWidth === undefined){
		 		env.config.lineWidth = 3;
		 	}

		 };
		 this.handleEnv = function( env){
		 	env.context = this;
		 	env.accepts = this.getAccepts();
		 	env.id = this.getId();
		 	env.name = this.getName();
		 	env.icon = this.getIcon();
		 };
		 this.exec = function(config, childs) {
		 	console.log("[ wireframeMaterial ] \t\t EXECUTE");
		 	console.log("config= " + JSON.stringify(config));
		 	this.env = {};
		 	this.childs = childs || [];
		 	this.handleConfig( config, this.env );
		 	this.handleEnv( this.env );

		 	Plugin.superClass.handleChilds( this.childs, this.env );

		 	this.interactiveObject = new THREE.MeshBasicMaterial({
		 		side : THREE.DoubleSide,
		 		wireframe : true,
		 		wireframeLinewidth: this.env.config.lineWidth,
		 		transparent : this.env.config.transparent,
		 		opacity: this.env.config.opacity,
		 		sizeAttenuation : true
		 	});

		 	this.handleColor();

		 	return {
		 		pId : this.getId(),
		 		pType : this.type,
		 		response : {
		 			type : 'wireframeMaterial',
		 			material : this.interactiveObject,
		 			activities : this.env.activities
		 		}
		 	};

		 };

		});
UTILS.CLASS.extend(Plugin,AbstractPlugin);
return Plugin;
});
