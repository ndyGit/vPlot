define(['require','config'],function(require,Config) {

	var plugin = (function() {
		/** ********************************** */
		/** PUBLIC VARIABLES * */
		/** ********************************** */
		this.context = Config.PLUGINTYPE.CONTEXT_2D;
		this.type = Config.PLUGINTYPE.LINETYPE;
		this.name = 'lineType';

		/** path to plugin-template file * */
		this.templates = Config.absPlugins
		+ '/plugins_2d/lineType/templates.js';
		this.accepts = {
			predecessors : [ Config.PLUGINTYPE.DATA ],
			successors : [  ]
		}
		this.icon = Config.absPlugins + '/plugins_2d/lineType/icon.png';
		this.description = 'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]';
		/** ********************************** */
		/** PUBLIC METHODS * */
		/** ********************************** */
		/**
		 * Takes inserted configuration from the plugin-template and
		 * returns the parameters as JSON-config-file
		 *
		 * @param containerId
		 *            parent container where the plugin-template got
		 *            added
		 *
		 * @return config file format:
		 *         { path:VALUE,data:VALUE}
		 */
		 this.getConfigCallback = function(containerId) {
		 	var color = $('#' + containerId + ' > form input[id=color]')
		 	.val();
		 	var result = {
		 		bar : false,
		 		area : true
		 	};
		 	console.log("[ lineType ][getConfig] "+JSON.stringify(result));
		 	return result;
		 }
		/**
		 * Takes arguments from config and inserts them to the
		 * plugin-template
		 *
		 * @param config
		 *            plugin config file
		 * @param containerId
		 *            parent container where the plugin-template got
		 *            added
		 */
		 this.setConfigCallback = function(config, containerId) {
		 	console.log("[ lineType ][setConfig] "+JSON.stringify(config));
		 	if (config == "" || config === undefined)
		 		config = {};

		 	//TODO


		 }
		 this.exec = function(config) {
		 	console.log("[ lineType ] \t\t EXEC");
		 	if(config == '' || config === undefined){
		 		config = {area:false,bar:true};
		 	}
		 	return {
		 		pType : this.type,
		 		response : {
		 			type : config
		 		}
		 	};
		 }


	});

return plugin;

});
