define([ 'require', 'config', 'jquery' ], function(require, Config, $) {

	/**
	 * @return object dataset object.data == dataset object.color ==
	 *         collorCallback(data)
	 *
	 */
	 var plugin = (function() {
	 	/** ********************************** */
	 	/** PUBLIC VARIABLES * */
	 	/** ********************************** */
	 	this.context = Config.PLUGINTYPE.CONTEXT_2D;
	 	this.type = Config.PLUGINTYPE.DATA;
	 	this.name = 'dataset2d';
	 	this.accepts = {
	 		predecessors : [ Config.PLUGINTYPE.PLOT],
	 		successors : [Config.PLUGINTYPE.COLOR,Config.PLUGINTYPE.LINETYPE ]
	 	}
		// default color
		this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
		this.lineType;
		this.data = [];

		/** path to plugin-template file * */
		this.templates = Config.absPlugins + '/plugins_2d/dataset/templates.js';
		this.icon = Config.absPlugins + '/plugins_2d/dataset/icon.png';
		this.description = 'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]';


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
		 * @return config file format: { data:VALUE}
		 */
		 this.getConfigCallback = function(containerId) {

		 	var name = $('#' + containerId + ' > form input[id=dataset-name]').val();
		 	var data = $('#' + containerId + ' > form input[id=data]').val();
		 	if (data != "") {
		 		data = JSON.parse(data);
		 	}

		 	var result = {
		 		'name' : name,
		 		'data' : data
		 	};
		 	console.log("[ dataset ][getConfig] " + JSON.stringify(result));
		 	return result;
		 }
		/**
		 * Takes arguments from config and inserts them to the plugin-template
		 *
		 * @param config
		 *            plugin config file
		 * @param containerId
		 *            parent container where the plugin-template got added
		 */
		 this.setConfigCallback = function(config, containerId) {
		 	console.log("[ dataset ][setConfig] " + JSON.stringify(config));
		 	if (config == "" || config === undefined){
		 		config = {data:[]};
		 	}

		 	if (config.data !== undefined) {
		 		$('#' + containerId + ' > form input[id=data]').val(JSON.stringify(config.data));
		 	}
		 	if (config.name !== undefined) {
		 		$('#' + containerId + ' > form input[id=dataset-name]').val(config.name);
		 	}
		 	//HELPER
		 	var refreshDataTable = function(config){
		 		var c = $('#' + containerId).find('#dataTableContainer');
		 		c.html('')
		 		$.each(config.data,function(i,o){
		 			var row = $('<tr/>');
		 			row.append($('<td/>').html(o.x));
		 			row.append($('<td/>').html(o.y));
		 			row.append($('<td/>').html('<button id="'+i+'" type="button" class="deleteData ui-state-default ui-corner-all"><span class="ui-icon ui-icon-close"></span></button>'));
		 			c.append(row);
		 		});
		 		// delete handle
		 		$('#'+containerId).find('.deleteData').click(function(){
		 			var index = $(this).attr('id');
		 			config.data.splice(index,1);
		 			//update container
		 			$('#' + containerId + ' > form input[id=data]').val(JSON.stringify(config.data));
		 			refreshDataTable(config);
		 		});


		 	}
		 	// add handle
		 	$('#'+containerId).find('#addDataset').click(function(){
		 		var x = $('#'+containerId).find('#dataset-x');
		 		var y = $('#'+containerId).find('#dataset-y');
		 		if(x.val() == '' || y.val() == '' ) return;

		 		var dataset = {'x':x.val(),'y':y.val()};
		 		if(config.data === undefined)
		 			config.data = [];
		 		config.data.push(dataset);
		 			//update container
		 			$('#' + containerId + ' > form input[id=data]').val(JSON.stringify(config.data));
		 			x.val('');
		 			y.val('');

		 			refreshDataTable(config);
		 		});
		 	// fill table
		 	refreshDataTable(config);



		 }

		 this.exec = function(config, childs) {
		 	console.log("[ dataset ] \t\t EXEC");

		 	/** *********************************** * */
		 	/** HANDLE CONFIG * */
		 	/** *********************************** * */
		 	if (config.data === undefined)
		 		return;


		 	var data = [];

		 	if (config.data) {
		 		data = data.concat(config.data);
		 	}


		 	/** *********************************** * */
		 	/** HANDLE SUCCESSOR PLUGINGS * */
		 	/** *********************************** * */
		 	var colorCallback 	= null;
		 	var colorCallbackObj = null;
		 	var child;
			for ( var i = 0; i < childs.length; ++i) {
				child = childs[i];
				if(child !== undefined && child.pType !== undefined){
					if($.inArray(child.pType, this.accepts.successors) != -1){
						switch(child.pType){
							case Config.PLUGINTYPE.COLOR:
								this.color = child.response.color;
							break;
							case Config.PLUGINTYPE.LINETYPE:
								this.lineType = child.response.type;
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
			// 		// check if child is in successor list

			// 		if ($.inArray(key, this.accepts.successors) != -1) {
			// 			// handle color plugin
			// 			if (( Config.PLUGINTYPE.COLOR ) === key) {
			// 				this.color = childs[i][key].color;
			// 			}
			// 			if (( Config.PLUGINTYPE.LINETYPE ) === key) {
			// 				this.lineType = childs[i][key].type;
			// 			}
			// 		}
			// 	}
			// }

			if(config.name == ''){
				config.name = 'dataset_'+Math.floor((Math.random()*100)+1);;
			}

			if(this.lineType === undefined){
				this.lineType = {area:false,bar:false};
			}
			this.data = {
				area: this.lineType.area === undefined ? false : this.lineType.area,
				bar : this.lineType.bar === undefined ? false : this.lineType.bar,
				values: config.data,
				key: config.name,
				color: this.color

			};

			return {
				pType : this.type,
				response : {
					context : this
				}
			};

		}



		/** ********************************** */
		/** PRIVATE METHODS * */
		/** ********************************** */


	});

return plugin;

});
