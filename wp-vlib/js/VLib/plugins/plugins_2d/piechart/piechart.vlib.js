define(
	[ 'require', 'config', 'jquery','underscore','d3','nv' ],
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
			this.type = Config.PLUGINTYPE.PLOT;
			/** unique plugin name * */
			this.name = 'piechart';
			/** path to plugin-template file * */
			this.templates = Config.absPlugins
			+ '/plugins_2d/piechart/templates.js';
			this.icon = Config.absPlugins
			+ '/plugins_2d/piechart/icon.png';
			this.accepts = {
				predecessors : [ Config.PLUGINTYPE.CONTEXT_2D ],
				successors : [ Config.PLUGINTYPE.DATA ]
			}
			this.description = 'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]';

			this.data = [];
			this.chart = null;

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

				 		console.log("[ piechart ] \t\t EXEC");

				 		require([ 'libs/novus/src/models/legend' ]);
				 		require([ 'libs/novus/src/tooltip' ]);
				 		require([ 'libs/novus/src/models/pie' ]);
				 		require([ 'libs/novus/src/models/pieChart' ]);
				 		require([ 'libs/novus/src/models/utils' ]);



				 		this.data = [];


					//HANDLE CHIDLS...
					var child;
					for ( var i = 0; i < childs.length; ++i) {
						child = childs[i];
						if(child !== undefined && child.pType !== undefined){
							if($.inArray(child.pType, this.accepts.successors) != -1){
								switch(child.pType){
									case Config.PLUGINTYPE.DATA:
									this.data = this.data.concat(child.response.context.data);
									console.log("--------------");
									console.log(JSON.stringify(this.data));
									console.log("--------------");
									break;
								}
							}
						}else{
							console.log("pType of child plugin not set!");
						}
					}



					if(this.data.length == 0) return;



					return {
						pType : this.type,
						response : {
							generate: callback_fct,
							context: this
						}

					};

				}



				/** ********************************** */
				/** PRIVATE METHODS * */
				/** ********************************** */



				var callback_fct = function(container) {
					console.log("caller "+this.name+" w:"+container.width()+" h:"+container.height());
					console.log("this.data >> "+JSON.stringify(this.data));
					this.chart = nv.models.pieChart()
					.width(container.width())
					.height(container.height())
					.margin({top: 30, right: 60, bottom: 50, left: 70})
					//.x(function(d,i) { return i })
					.x(function(d) { return d.y })
					.y(function(d) { return d.x })
					.color(d3.scale.category10().range());


					//axesCallback(this.chart);
					d3.select('#'+container.attr('id') +' svg')
					.attr('width', container.width())
					.attr('height',container.height())
					.datum(this.data)
					//.datum(testdata)
					.transition().duration(500)
					.call(this.chart);
					return this.chart;

				}
				/*
				* default implementation
				* will be overwritten by axes plugin
				*/
				var axesCallback = function(chart){
					chart.xAxis
					.axisLabel("x - number of nodes");

				}


			});

return plugin;
});
