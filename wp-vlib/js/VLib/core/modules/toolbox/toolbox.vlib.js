define(
	[ 'require', 'config', 'jquery', 'underscore' ],
	function(require, Config, $, _) {
		/**
			TODO<br />
			@module Toolbox
			@class Toolbox
			**/
			var module = (function() {
				var _name = 'toolbox';
				// TODO: REFACTOR
				var _templates = Config.getModulePath()+'/toolbox/templates.js';
				var _plugins = null;

				var isRegisterd = function() {
					return (typeof module.subscribe === 'function')
					&& (typeof module.publish === 'function');
				};
				var _init = function(container) {
					if (isRegisterd()) {
						this.container = $(container);
						// inject templates
						module.publish(Config.CHANNEL_INJECT_SCRIPTTEMPLATE,{url : _templates});

						/** *************************************** */
						/* CALL YOUR FUNCTIONS HERER */
						/** *************************************** */
						addListener();

						// get plugins from core
						//console.log('[ toolbox ][ requesting plugins ]');
						module.publish(Config.CHANNEL_REQUEST_PLUGINS,
						{
							src : _name
						});
						module.publish(Config.CHANNEL_INFO,'<i>DRAG</i> plugins from Toolbox and <i>DROP</i> them into the SceneGraph.');
						// module.publish('drop',{x:10,y:20});
						/** *************************************** */
					} else {
						throw 'Module [ '
						+ this.name
						+ ' ] not registered! Use VLib.registerModule(obj) first.';
					}

				};
				/** *************************************** */
				/* ADD LISTENERS HERE */
				/** *************************************** */
				var addListener = function() {
					//console.log("[ " + module.name + " ] add listener ");
					module.subscribe(Config.CHANNEL_RESPOND_PLUGINS,
						respondPluginhandle);

					module.subscribe(Config.CHANNEL_SCENEGRAPH_CONTEXT,
						scenegraphContextHandle);

				}

				/* LISTENERS */

				/*
				 *	@param obj Object
				 *		{
				 *			context	: node.treeNode.type
				 *		}
				 **/
				 var scenegraphContextHandle = function(obj){
				 	//console.log("[ toolbox ][ scenegraphContextHandle] "+JSON.stringify(obj));
				 	updateGui(obj.context);
				 };
				 var respondPluginhandle = function(obj) {
				 	if (obj.target != _name)
				 		return;
				 	//console.log('[ toolbox ][ handle incoming plugins ]');
				 	_plugins = obj.plugins;
					//module.container.append(" " + JSON.stringify(obj.plugins));
					// add gui elements after plugin list has been loaded
					updateGui();
					//updateGui(Config.PLUGINTYPE.CONTEXT_3D);
				};

				var updateGui = function(context) {

					var pluginsToShow = [];
					if(!context){
						for(var key in _plugins){
							if((_plugins[key].type === Config.PLUGINTYPE.CONTEXT_3D) || (_plugins[key].type === Config.PLUGINTYPE.CONTEXT_2D)){
								pluginsToShow.push(_plugins[key]);
							}
						}
					}else{

						for(var key in _plugins){
							if((_plugins[key].context === context) && (_plugins[key].type !== Config.PLUGINTYPE.CONTEXT_3D &&
								_plugins[key].type !== Config.PLUGINTYPE.CONTEXT_2D)){
								pluginsToShow.push(_plugins[key]);
							}
						}
				}

				_.templateSettings.variable = "rc";
					// get template code
					var templateData = {
						title : 'Toolbox',
						plugins : pluginsToShow,
						path : Config.basePath+Config.appPath
					};

					var template = _.template($("script.pluginListContainer")
						.html());

					// add templates to container
					$('.plugin').remove();
					module.container.html(template(templateData));

					// add drag beahvior
					$('.plugin').draggable({
						cursor : 'move',
						helper : function() {
							var id = $(this).attr('id');

							var currentIcon = $('#'+id+" img").attr('src');
							//console.log(currentIcon);
							_.templateSettings.variable = "rc";
							var template = _.template($("script.pluginDragHelperContainer").html());


							return $(template({
								icon: currentIcon,
								name:id
							})).clone();

						},
						start : function(){
							"use strict";
							var id = $(this).attr('id');
							var idParts = id.split('-');
							if(idParts.length !== 3){
								console.warn('[ Toolbox.plugin.drag() ] Invalid number of idParts given.');
								return;
							}
							addHighlightToTargets( idParts[1],idParts[2] );
						},
						stop :function( event, ui){
							"use strict";
							dropListener( event, ui );
							var id = $(this).attr('id');
							var idParts = id.split('-');
							if(idParts.length !== 3){
								console.warn('[ Toolbox.plugin.drag() ] Invalid number of idParts given.');
								return;
							}
							removeHighlightFromTargets( idParts[1],idParts[2] );
						}
					});


				};
				var addHighlightToTargets = function( type, name ){
					"use strict";
					console.log("add highlight "+name);
					if(!_plugins.hasOwnProperty(name)){
						return;
					}
					var predecessors = _plugins[ name ].accepts.predecessors;
					/* add possible targets from scenegraph */
					var preTypes = predecessors.map(function(el){
						return '.type-'+el;
					});
					$.grep(preTypes,function(el){
						$( el ).addClass('btn-primary');
					});
					/* highlight possible targets from toolbox */
					var infoTypes = predecessors.map(function(el){
						return '.info-type-'+el;
					});

					$.grep(infoTypes,function(el){
						$( el ).addClass('btn-warning');
					});
				};
			var removeHighlightFromTargets = function( type, name ){
				"use strict";
				console.log("remove highlight "+name);
				if(!_plugins.hasOwnProperty(name)){
					return;
				}
				var predecessors = _plugins[ name ].accepts.predecessors;
				var preTypes = predecessors.map(function(el){
					return '.type-'+el;
				});
				$.grep(preTypes,function(el){
					$( el ).removeClass('btn-primary');
				});
				var infoTypes = predecessors.map(function(el){
					return '.info-type-'+el;
				});
				$.grep(infoTypes,function(el){
					$( el ).removeClass('btn-warning');
				});
			};
				var dropListener = function(event, ui) {

					var id = $(this).attr("id");
					var offsetXPos = parseInt(ui.offset.left);
					var offsetYPos = parseInt(ui.offset.top);
					console.log('[ toolbox ]'+" drop: x: "+offsetXPos+" y: "+offsetYPos);
					module.publish(Config.CHANNEL_DROP,{plugin:id,x:offsetXPos,y:offsetYPos});

				};

				/* public */
				return {
					name : _name,
					init : _init

				};
			})();

			return module;
		});
