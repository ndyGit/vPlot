define([ 'require', 'config','core/AbstractPlugin.vlib','core/Utils.vlib', 'three', 'jquery' ],
	function(require, Config, AbstractPlugin,UTILS,THREE, $) {
	/**
		TODO<br />
		@class Plugin BasicMaterial
		@constructor
		@extends AbstractPlugin
		**/
		var Plugin = (function() {
			var name = 'basicMaterial';
			Plugin.superClass.constuctor.call(this,name);
			Plugin.superClass.setContext.call(this,Config.PLUGINTYPE.CONTEXT_3D);
			Plugin.superClass.setType.call(this,Config.PLUGINTYPE.MATERIAL);
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call(this,Config.getPluginPath()+ '/plugins_3d/materials/basic/templates.js');
			Plugin.superClass.setIcon.call(this,Config.getPluginPath()+ '/plugins_3d/materials/basic/icon.png');
			Plugin.superClass.setAccepts.call(this,{
				predecessors : [ Config.PLUGINTYPE.PLOT ],
				successors : [ Config.PLUGINTYPE.ACTIVITY, Config.PLUGINTYPE.COLOR ]
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
		 this.getConfigCallback = function(containerId) {
		 	var opacity = $('#' + containerId + ' #opacity').val();
		 	var transparent = $('#' + containerId + ' #transparent').is(':checked');

		 	var result = {
		 		opacity:opacity,
		 		transparent:transparent
		 	};
		 	console.log("[ basicMaterial ][getConfig] "
		 		+ JSON.stringify(result));
		 	return result;
		 };
		/**
		 * Takes arguments from config and inserts them to the plugin-template
		 *
		 * @param config
		 *            plugin config file
		 * @param containerId
		 *            parent container where the plugin-template got added
		 */
		 this.setConfigCallback = function(config, containerId) {
		 	console.log("[ basicMaterial ][setConfig] "
		 		+ JSON.stringify(config));
		 	var material = this.interactiveObject;
		 	if (config == ""){
		 		config = {
		 			opacity:0.9,
		 			transparent:true
		 		};
		 	}
		 	if (config.opacity != undefined) {
		 		$('#' + containerId + ' #opacity').val(
		 			config.opacity);
		 	} else {
		 		$('#' + containerId + ' #opacity').val(0.9);
		 		config.opacity = 0.9;
		 	}
		 	if (config.transparent != undefined) {
		 		if(config.transparent === true){
		 			$('#' + containerId + ' #transparent').attr('checked','checked');
		 		}
		 	}

		 	// opacitySlider
		 	$('#' + containerId ).find(' #opacitySlider').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0,
		 		max: 100,
		 		value: config.opacity*100,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #opacity').val(ui.value/100);
		 			if( material !== undefined){
		 				material.opacity = ui.value/100;
		 			}
		 		}
		 	});

		 };
		 this.handleConfig = function( config, env){
		 	env.config = config || {};
		 	if (env.config.opacity === undefined){
		 		env.config.opacity = 1;
		 	}
		 	if (env.config.transparent === undefined){
		 		env.config.transparent = true;
		 	}

		 };
		 this.handleEnv = function( env){
		 	env.context = this;
		 	env.accepts = this.getAccepts();
		 	env.id = this.getId();
		 	env.name = this.getName();
		 	env.icon = this.getIcon();
		 };
		this.handleColor = function(){
			"use strict";
			if(this.env.raw_color !== undefined){
				this.interactiveObject.color = new THREE.Color("#"+this.env.raw_color);
			}else{
				this.interactiveObject.vertexColors = THREE.VertexColors;
			}
		};
		 this.exec = function(config, childs, bufferManager) {
		 	console.log("[ basicMaterial ] \t\t EXECUTE");
		 	console.log("config= " + JSON.stringify(config));
		 	this.env = {};
		 	this.childs = childs || [];
		 	this.handleConfig( config, this.env );
		 	this.handleEnv( this.env );

		 	Plugin.superClass.handleChilds( this.childs, this.env );


		 	this.interactiveObject = new THREE.MeshLambertMaterial({
		 		side : THREE.DoubleSide,
		 		transparent : this.env.config.transparent ,
		 		opacity: this.env.config.opacity,
		 		depthWrite: true,
		 		depthTest: true,
		 		shininess: 10,
		 		ambient : 0x050505,
		 		diffuse : 0x331100,
		 		specular : 0xffffff,
		 		reflectivity: 0.1,
			    shading: THREE.FlatShading

		 	});
			this.handleColor();
		 	return {
		 		pId : this.getId(),
		 		pType : this.type,
		 		response : {
		 			type : 'basicMaterial',
		 			material : this.interactiveObject,
		 			activities : this.env.activities
		 		}
		 	};

		 }

		});
UTILS.CLASS.extend(Plugin,AbstractPlugin);
return Plugin;
});
