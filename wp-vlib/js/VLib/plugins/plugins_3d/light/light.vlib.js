define([ 'require','config','core/AbstractPlugin.vlib','core/Utils.vlib', 'three' ],
	function(require,Config, AbstractPlugin,UTILS, THREE) {
	/**
		TODO<br />
		@class Plugin Light
		@constructor
		@extends AbstractPlugin
	**/
	var Plugin = (function() {
		var name = 'light';
		Plugin.superClass.constuctor.call(this,name);
		Plugin.superClass.setContext.call(this,Config.PLUGINTYPE.CONTEXT_3D);
		Plugin.superClass.setType.call(this,Config.PLUGINTYPE.LIGHT);
		/** path to plugin-template file * */
		Plugin.superClass.setTemplates.call(this,Config.getPluginPath()+ '/plugins_3d/light/templates.js');
		Plugin.superClass.setIcon.call(this,Config.getPluginPath()+ '/plugins_3d/light/icon.png');
		Plugin.superClass.setAccepts.call(this,{
			predecessors : [ Config.PLUGINTYPE.CONTEXT_3D ],
			successors : []
		});
		Plugin.superClass.setDescription.call(this,'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]');

		var config = null;
		this.exec = function(c, childs) {
			config = c;
			console.log("[ light ] \t\t EXEC");
			if(config === undefined || config == ""){
				config = {};
			}
			var light = null;
			var type, color, pos, intensity, distance;
			color = config.color === undefined ? 'FF0000' : config.color;
			intensity = config.intensity === undefined ? 10 : config.intensity;
			distance = config.distance === undefined ? 10 : config.distance;
			if(config.type === undefined){
				config.type = 'ambient';
			}

			switch(config.type){
				case 'point':
					light = new THREE.PointLight('#' + color, intensity, distance);
					break;
				case 'ambient':
					light = new THREE.AmbientLight('#' + color);
				break;
				default:
					light = new THREE.AmbientLight('#' + color);
				break;
			}

			var posX, posY, posZ;
			if (config.hasOwnProperty('pos')) {
				posX = config.pos.x == undefined ? 0 : config.pos.x;
				posY = config.pos.y == undefined ? 0 : config.pos.y;
				posZ = config.pos.z == undefined ? 0 : config.pos.z;
			}

			// set its position
			light.position.x = posX;
			light.position.y = posY;
			light.position.z = posZ;

//			console.log("[ light ][ type ] "+config.type+" "+light);
//			console.log("[ light ][ color ] "+color);
//			console.log("[ light ][ intensity ] "+intensity);
//			console.log("[ light ][ distance ] "+distance);
//			console.log("[ light ][ x ] "+posX);
//			console.log("[ light ][ y ] "+posY);
//			console.log("[ light ][ z ] "+posZ);

			return {
				pId : this.getId(),
				pType : this.type,
				response : light
			};
		}

	});
	UTILS.CLASS.extend(Plugin,AbstractPlugin);
	return Plugin;

});
