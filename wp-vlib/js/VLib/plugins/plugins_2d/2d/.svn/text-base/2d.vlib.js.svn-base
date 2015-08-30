define(
	[ 'require', 'config', 'jquery','underscore','nv' ],
	function(require, Config, $,_) {


		var plugin = (function(state) {

			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var sceneHeightDefault = 'auto';
			var sceneWidthDefault = 'auto';
			var container = 'body';





			if(state !== undefined){
				sceneHeightDefault = state.sceneHeightDefault;
				sceneWidthDefault = state.sceneWidthDefault;
				container = state.container;


			}
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */

			this.context = Config.PLUGINTYPE.CONTEXT_2D;
			this.type = Config.PLUGINTYPE.CONTEXT_2D;
			/** unique plugin name * */
			this.name = '2d';
			/** path to plugin-template file * */
			this.templates = Config.absPlugins
			+ '/plugins_2d/2d/templates.js';
			this.icon = Config.absPlugins
			+ '/plugins_2d/2d/icon.png';
			this.accepts = {
				predecessors : [ Config.PLUGINTYPE.ROOT ],
				successors : [ Config.PLUGINTYPE.PLOT ]
			}
			this.description = 'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]';
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.deepCopy = function(){
				var privates = {
					sceneHeightDefault	: sceneHeightDefault,
					sceneWidthDefault 	: sceneWidthDefault,
					container			: container,

							// no need to copy state of intersection stuff. they are just short-time buffers
						};
						return new plugin(privates);
					}
				/**
				 * Takes inserted configuration from the plugin-template and
				 * returns the parameters as JSON-config-file
				 *
				 * @param containerId
				 *            parent container where the plugin-template got
				 *            added
				 *
				 * @return config file format:
				 *         {camera:{x:VALUE,y:VALUE,z:VALUE}}
				 */
				 this.getConfigCallback = function(containerId) {
				 	var sceneWidth = $(
				 		'#' + containerId + ' > form input[id=sceneWidth]')
				 	.val();
				 	var sceneHeight = $(
				 		'#' + containerId + ' > form input[id=sceneHeight]')
				 	.val();

				 	var result = {
				 		scene : {
				 			width : sceneWidth,
				 			height : sceneHeight
				 		}
				 	};
				 	console.log("[ 2d ][getConfig] " + JSON.stringify(result));
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
				 	console.log("[ 2d ][setConfig] " );
				 	if (config == "")
				 		config = {
				 			scene : ''
				 		};

				 		if (config.scene.width != undefined) {
				 			$('#' + containerId + ' > form input[id=sceneWidth]')
				 			.val(config.scene.width);
				 		} else {
				 			$('#' + containerId + ' > form input[id=sceneWidth]')
				 			.val(sceneWidthDefault);
				 		}
				 		if (config.scene.height != undefined) {
				 			$('#' + containerId + ' > form input[id=sceneHeight]')
				 			.val(config.scene.height);
				 		} else {
				 			$('#' + containerId + ' > form input[id=sceneHeight]')
				 			.val(sceneHeightDefault);
				 		}

				 	}

				 	this.exec = function(config, childs) {

				 		console.log("[ 2d ] \t\t EXEC");
				 		require([ 'libs/novus/src/models/legend' ]);
				 		require([ 'libs/novus/src/tooltip' ]);
				 		require([ 'libs/novus/src/models/line' ]);
				 		require([ 'libs/novus/src/models/scatter' ]);
				 		require([ 'libs/novus/src/models/linePlusBarChart' ]);


				 		require([ 'libs/novus/src/utils' ]);

				 		if (config.container !== undefined) {
				 			container = $('#'+config.container);
				 		}else{
				 			alert("plugin 3d ERROR: NO RENDER CONTAINER GIVEN!");
				 		}

				 		var renderContainerId = '2d-render-container';
				 		var renderContainer = '<svg id="'+renderContainerId+'"></svg>';
				 		container.html(renderContainer);

				 		if (config.scene === undefined) {
				 			config.scene = {};
				 		}


				 		this.width = config.scene.width === undefined ? container
				 		.width() : config.scene.width;
				 		this.height = config.scene.height === undefined ? container
				 		.height() : config.scene.height;



					//HANDLE CHIDLS...
					var child;
					for ( var i = 0; i < childs.length; ++i) {
						child = childs[i];

						if(child !== undefined && child.pType !== undefined){
							if($.inArray(child.pType, this.accepts.successors) != -1){
								switch(child.pType){
									case Config.PLUGINTYPE.PLOT:
									var context = child.response.context;
									nv.addGraph({
										generate : child.response.generate.apply(context,[container])
									});
									nv.utils.windowResize(context.chart.update);
									nv.utils.windowResize(context.chart.xAxis.scale().domain());
									 //context.chart.xAxis.scale().domain();
									// context.chart.yAxis.scale().domain();
									break;
								}
							}
						}else{
							console.log("pType of child plugin not set!");
						}
					}
					// each child is the result of a successor plugin
					// for ( var i = 0; i < childs.length; ++i) {

					// 	for ( var key in childs[i]) {

					// 		// just iterate over "own" keys and ignore
					// 		// prototypes
					// 		// check if child is in successor list
					// 		if ($.inArray(key, this.accepts.successors) != -1) {

					// 			if (key === Config.PLUGINTYPE.PLOT) {
					// 				var context = childs[i][key].context;
					// 				nv.addGraph({
					// 					generate : childs[i][key].generate.apply(context,[container])
					// 				});
					// 				nv.utils.windowResize(context.chart.update);
					// 				nv.utils.windowResize(context.chart.xAxis.scale().domain());
					// 				 //context.chart.xAxis.scale().domain();
					// 				// context.chart.yAxis.scale().domain();
					// 			}
					// 		}
					// 	}
					// }

					return true;

				}



				/** ********************************** */
				/** PRIVATE METHODS * */
				/** ********************************** */



			});

return plugin;
});
