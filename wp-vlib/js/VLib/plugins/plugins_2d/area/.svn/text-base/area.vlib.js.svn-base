define(['require','config'],function(require,Config) {

	var plugin = (function() {
		/** ********************************** */
		/** PUBLIC VARIABLES * */
		/** ********************************** */
		this.context = Config.PLUGINTYPE.CONTEXT_2D;
		this.type = Config.PLUGINTYPE.LINETYPE;
		this.name = 'area';

		/** path to plugin-template file * */
		this.accepts = {
			predecessors : [ Config.PLUGINTYPE.DATA ],
			successors : [  ]
		}
		this.icon = Config.absPlugins + '/plugins_2d/area/icon.png';
		this.description = 'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]';
		/** ********************************** */
		/** PUBLIC METHODS * */
		/** ********************************** */
		/**

		/***/

		 this.exec = function(config) {
		 	console.log("[ area ] \t\t EXEC");
		 	if(config == '' || config === undefined){
		 		config = {area:true,bar:false};
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
