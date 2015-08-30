define(['require', 'config', 'core/Utils.vlib', 'jquery', 'underscore','jquery_ui','orgChart','bootstrap'], function(require, Config, Utils,$,_) {
	'use strict';
	/**
	 @module SceneGraph
	 @class SceneGraph
	 **/
	var module = (function() {
		var _name = 'sceneGraph';
		var plots;
		var plugins;
		var renderedPlugins;
		var activePlugin;
		var activeTemplate;
		var loadedTemplates = [];
		var files = [];
		var _templates = Config.getModulePath() + '/scenegraph/templates.js';

		var Tree = Utils.struct.treeNode;
		var treeId = -1;
		var treeName = '';
		var treeDescription = '';
		var templatePattern = [];
		var templateThumbnail = false;
		var tree = null;

		var isRegisterd = function() {
			return (typeof module.subscribe === 'function') && (typeof module.publish === 'function');
		};
		var _init = function(container) {

			if (isRegisterd()) {
				this.container = $(container);
				/* inject templates */
				module.publish(Config.CHANNEL_INJECT_SCRIPTTEMPLATE, {
					url: _templates
				}); /** *************************************** */
				/* CALL YOUR FUNCTIONS HERER */
				/** *************************************** */
				addListener();
				addGui();
				reset();
				refresh();

				/* get plugins from core */
				module.publish('requestPlugins', {
					src: _name
				});
				module.publish(Config.CHANNEL_REQUEST_FILES);
				module.publish(Config.CHANNEL_REQUEST_TEMPLATES);

				/** *************************************** */
			} else {
				this.publish(Config.CHANNEL_ERROR,'Module SceneGraph not registered! Use VLib.registerModule(obj) first.');
				throw 'Module [ ' + this.name + ' ] not registered! Use VLib.registerModule(obj) first.';
			}

		};

		/** *************************************** */
		/* ADD PRIVATE CODE HERER */
		/** *************************************** */
		var addGui = function() {

			var template = _.template($('script.scenegraphBaseContainer').html());
			var t = $(template());
			module.container.html( t );
		};

		/* LISTENERS */
		var addListener = function() {
			/**
			 SUBSCRIPTION<br />
			 @event Config.CHANNEL_RESPOND_PLUGINS
			 */
			module.subscribe(Config.CHANNEL_RESPOND_PLUGINS, respondPluginhandle);
			/**
			 SUBSCRIPTION<br />
			 @event Config.CHANNEL_RESPOND_FILES
			 */
			module.subscribe(Config.CHANNEL_RESPOND_FILES, respondFileshandle);
			//module.subscribe(Config.CHANNEL_RENDER_TEMPLATE, setTemplateHandle);
			/**
			 SUBSCRIPTION<br />
			 Incoming message is an object {name:VALUE,description:VALUE,template:OBJECT(sceneGraph-tree)}.<br />

			 @event Config.CHANNEL_TEMPLATES_TEMPLATE_SELECTED
			 @bubbles
			 Config.CHANNEL_SCENEGRAPH_UPDATE
			 Config.CHANNEL_RENDER_TEMPLATE
			 Config.CHANNEL_SCENEGRAPH_CONTEXT
			 @broadcast
			 Config.CHANNEL_SCENEGRAPH_UPDATE
			 Config.CHANNEL_RENDER_TEMPLATE
			 Config.CHANNEL_SCENEGRAPH_CONTEXT
			 */
			module.subscribe(Config.CHANNEL_RENDER_TEMPLATE, setTemplateHandle);
			/**
			 SUBSCRIPTION<br />
			 @event Config.CHANNEL_RESET
			 @bubbles
			 Config.CHANNEL_SCENEGRAPH_UPDATE
			 Config.CHANNEL_RENDER_TEMPLATE
			 @broadcast
			 Config.CHANNEL_SCENEGRAPH_UPDATE
			 Config.CHANNEL_RENDER_TEMPLATE
			 */
			module.subscribe(Config.CHANNEL_RESET, function(){
				reset();
				refresh();
			});
			/**
			 SUBSCRIPTION<br />
			 @event Config.CHANNEL_REFRESH
			 @bubbles
			 Config.CHANNEL_SCENEGRAPH_UPDATE
			 Config.CHANNEL_RENDER_TEMPLATE
			 @broadcast
			 Config.CHANNEL_SCENEGRAPH_UPDATE
			 Config.CHANNEL_RENDER_TEMPLATE
			 */
			module.subscribe(Config.CHANNEL_REFRESH, refresh);

			module.subscribe(Config.CHANNEL_RENDERED_PLUGIN_LIST, function(obj){
				renderedPlugins = obj;
				refresh(false);
			});
			module.subscribe(Config.CHANNEL_RESPOND_TEMPLATES,function( obj ){
				plots = obj;
			});

		};
		var updateActiveTemplate = function ( id, name, description, sceneGraph, pattern, thumbnail ) {
			if( !activeTemplate){
				activeTemplate = {};
			}
			activeTemplate.id = id;
			activeTemplate.name = name;
			activeTemplate.description = description;
			activeTemplate.sceneGraph = sceneGraph;
			activeTemplate.pattern = pattern;
			activeTemplate.thumbnail = thumbnail;
		};
		var setTemplateHandle = function(obj) {
			var t = obj.template;
			/* remove drop behavior from base container*/
			removeDropBehaviorFromBase();

			/*set tree*/
			tree = templateToTree(t.sceneGraph);
			treeId = t.id;
			treeName = t.name;
			treeDescription = t.description;
			templatePattern = t.pattern;
			templateThumbnail = t.thumbnail;

			$('#'+module.container.attr('id')).find('h3').html('SceneGraph <span class="badge pull-right">'+treeName+'</span>');
			/* repaint scenegraph */
			refresh( false );
			/* publish new context */
			updateContext();
		};
		var updateContext = function(){
			/*publish new context*/
			module.publish(Config.CHANNEL_SCENEGRAPH_CONTEXT, {
				context: plugins[tree.name].context
			});
		};
		var removeDropBehaviorFromBase = function(){
			if (module.container.is('.ui-droppable')){
				module.container.droppable('destroy');
				module.container.removeClass('node');
			}

		};
		// var handleDrop = function(obj) {
		// console.log("[ " + module.name + " ] handle drop. data: "
		// + JSON.stringify(obj));
		// }
		var templateToTree = function(template) {
			// TODO: check template structure
			return template;
		};
		/**
		 * repaints scenegraph and publishes the updated scenegraph tree
		 *
		 * @publish CHANNEL_SCENEGRAPH_UPDATE object object =
		 *          {sceneGraph : tree}
		 */
		var refresh = function( submitRenderRequest ) {

			// repaint scenegraph
			repaintSceneGraph();
			attachClickListener();
			attachDropHandler();
			module.container.unbind('click');
			// publish change
			updateActiveTemplate(treeId, treeName,treeDescription,tree, templatePattern, templateThumbnail);

			module.publish(Config.CHANNEL_SCENEGRAPH_UPDATE, {
				template : activeTemplate
			});
			if(!submitRenderRequest) return;
			module.publish(Config.CHANNEL_RENDER_TEMPLATE, {
				template:activeTemplate
			});
		};
		/**
		 * call refresh after reset!
		 */
		var reset = function() {
			renderedPlugins = undefined;
			tree = false;
			treeId = -1;
			treeName = '';
			treeDescription = '';
			$('#'+module.container.attr('id')).find('h3').html('SceneGraph ');
			// add drop behavior to "root" element (== module base container)
			module.container.addClass('node');
			module.publish(Config.CHANNEL_SCENEGRAPH_CONTEXT, {
				context: false
			});
			updateActiveTemplate(treeId, treeName,treeDescription,tree, templatePattern, templateThumbnail);

			module.publish(Config.CHANNEL_SCENEGRAPH_UPDATE, {
				template : activeTemplate
			});
		};
		/** ************************************* * */
		/** TREE HANDLING * */
		var pluginGetShortName = function( treeNode ){
			if(!treeNode || !renderedPlugins){
				return false;
			}
			for(var i = 0, il = renderedPlugins.length; i < il; ++i){
				if(renderedPlugins[ i ] && treeNode.id === renderedPlugins[ i ].id){
					if( renderedPlugins[ i ].hasOwnProperty('getShortName') ){
						return renderedPlugins[ i].getShortName();
					}
				}
			}
			return false;
		};
		var getTreeElem = function(treeNode) {

			if (treeNode === undefined || treeNode === null || treeNode === false) return false;
			//console.log("tree id " + treeNode.id);
			/** ************************************ */
			var shortName = pluginGetShortName( treeNode );
			/** add template * */
			_.templateSettings.variable = 'rc';
			var template = _.template($('script.treeNodeContainer').html());
			if(!plugins[treeNode.name]){
				console.warn('[ SceneGraph ] Plugin %s not found!',treeNode.name);
				return false;
			}
			var templateData = {
				id: treeNode.id,
				name: shortName || treeNode.name,
				type : plugins[treeNode.name].type,
				icon: Config.basePath+Config.appPath+plugins[treeNode.name].icon,
				alt: treeNode.name
			};
			var t = $(template(templateData));
			/** ************************************ */
			return $('<li/>').attr('id', treeNode.id).html(t).append('<ul></ul>');
		};
		var addChildToTreeElem = function(elem, child) {
			//console.log("add " + child.html() + " to " + elem.html());
			elem.find('ul').first().append(child);
		};

		var treeToHtml = function(treeNode, html) {
			if (treeNode === undefined || treeNode === null || treeNode === false){
				return false;
			}
			var s = html;
			if (s === undefined){
				s = $('<ul/>', {
					id: 'sceneGraph-tree',
					style: 'display:none'
				});
			}
			var nodesTodo = [];
			var htmlTodo = [];
			var currentNode = treeNode;
			var currentHtml = getTreeElem(treeNode);
			s.append(currentHtml);
			while (currentNode !== undefined) {
				$.each(currentNode.childs, function(index, child) {
					var c = getTreeElem(child);
					addChildToTreeElem(currentHtml, c);
					nodesTodo.push(child);
					htmlTodo.push(c);
				});
				currentNode = nodesTodo.pop();
				currentHtml = htmlTodo.pop();
			}
			return s;
		};
		var treeWalker = (function() {
			var getNode = function(node, id) {
				//console.log("getNode: "+node.id+" = "+id+"?");
				var result = false;
				if (node.id === id) {
					result = node;
				} else {
					for (var i = 0; i < node.childs.length; ++i) {
						result = getNode(node.childs[i], id);
						if (result !== false) {
							break;
						}
					}
				}
				return result;
			};

			var getParent = function(node, id) {
				//console.log("getNode: "+node.id+" = "+id+"?");
				var currentNode = node;
				var currentChilds = node.childs;
				var todo = [];
				while (true) {
					for (var i = 0; i < currentChilds.length; ++i) {
						if (id === currentChilds[i].id) {
							return currentNode;
						}
						todo.push(currentChilds[i]);
					}
					if (todo.length === 0){
						break;
					}
					currentNode = todo.pop();
					currentChilds = currentNode.childs;
				}
				return false;
			};
			var removeChild = function(node, id) {
				for(var i = 0, il = renderedPlugins.length; i < il; ++i){
					if(renderedPlugins[ i ].id === id){
						if(renderedPlugins[ i ].hasOwnProperty("destroy"))
							renderedPlugins[ i ].destroy();
						break;
					}
				}

				var result = false;
				for (var i = node.childs.length - 1; i >= 0; --i) {
					if (id === node.childs[i].id) {
						node.childs.splice(i, 1);
						result = true;
						break;
					}
				}
			};
			return {
				getNodeById: function(id) {
					if (tree === null) return false;
					return getNode(tree, id);
				},
				removeNodeById: function(id) {
					if (tree === null){
						module.publish(Config.CHANNEL_ERROR,'[SceneGraph] Tree is null. Something odd happened.');
						return false;
					}
					// element to delete is root.
					// reset!
					if (tree.id === id) {
						reset();
						return true;
					}
					var node = getParent(tree, id);
					if (node === false) {
						return false;
					}
					return removeChild(node, id);
				}
			};
		})();
		/** ************************************* * */
		var repaintSceneGraph = function() {
			// console.log("repaintSceneGraph " + module.container.attr('id'));
			/* ************************************ */
			/* empty container */
			var treeContainer = $('#' + module.container.attr('id') ).find('#sceneGraph');
			treeContainer.html('');
			/* ************************************ */
			/* build orgChart tree structure */
			treeContainer.html(treeToHtml(tree));
			/* ************************************ */
			/* init tree */

			$(' #sceneGraph-tree').jOrgChart({
				chartElement: treeContainer[0],
				dragAndDrop: false
			});

		};
		var attachClickListener = function() {
			// console.log("attachClickListener");
			// remove old listeners
			$('div.node').unbind('click');
			$('div.node').bind('click', function handleClickEvent(event) {
				var id = $(this).find('.treeNode').attr('id');
				var node = treeWalker.getNodeById(id);
				if (node) {
					event.stopPropagation();
					openDialog(node);
				} else {
					// THROW ERROR
					console.log('unable to open dialog. node not found.');
					module.publish(Config.CHANNEL_ERROR,'[SceneGraph] Unable to open dialog. node not found.');
				}

				//console.log(JSON.stringify(node));
			});
		};
		var attachDropHandler = function() {
			// console.log("attachDropHandler");
			//if ($(".node").is('.ui-droppable') == true) $(".node").droppable('destroy');
			// remove drop behavior from nodes
			$('.node').droppable({
				greedy: true,
				hoverClass: 'ui-state-active',
				zIndex: 1000,
				drop: function(event, ui) {
					var newNodeId = ui.draggable.attr('id');
					var newNodeName = newNodeId.split('-')[2];
					// console.log(newNodeId + " " + newNodeName);
					var parentId = $(this).find('.treeNode').attr('id');
					if(parentId === undefined){
						//dorp on base container?
						if($(this).attr('id') === module.container.attr('id')){
							// drop on base container
							// remove drop behavior from base container
							removeDropBehaviorFromBase();
							// add new node ass root node
							tree = new Tree(newNodeName);

							// refresh
							refresh( true );
							updateContext();
						}else{
							// THROW ERROR
							module.publish(Config.CHANNEL_ERROR,
								'[SceneGraph] Drop on base container but no root id found.');
						}
					}else{
						var parentNode = treeWalker.getNodeById(parentId);
						// check if new node type is in the successor list of the parent node
						if (_.intersection(plugins[parentNode.name].accepts.successors, [plugins[newNodeName].type]).length > 0) {
							parentNode.childs.push(new Tree(newNodeName));
							refresh( true );
						} else {
							// THROW EXCEPTION / PUBLISH ERROR
							module.publish(Config.CHANNEL_INFO,'<i>'+newNodeName+'</i> is NOT a successor of target node.');
						}
					}
				}
			});

		};
		/** ************************************* * */
		var respondFileshandle = function(obj){
			// console.log('[ sceneGraph ][ handle incoming files ]');
			files = obj;
		};
		var respondPluginhandle = function(obj) {
			if (obj.target !== _name) return;

			// console.log('[ sceneGraph ][ handle incoming plugins ]');
			plugins = obj.plugins;

		};
		var getConfigCallback = function() {
			// console.log("get set ConfigCallback( " + node.name + ", " + containerId + " ) is not implemented by current plugin!");
			throw new Error('[sceneGraph][getConfigCallback] Empty Callback skeleton called!');
		};
		var updateConfig = function(treeNode, containerId) {

			var config = getConfigCallback.apply(activePlugin,[ containerId ]);
			config = config || {};
			treeNode.config = config;

			updateActiveTemplate(treeId, treeName,treeDescription,tree, templatePattern, templateThumbnail);


			module.publish(Config.CHANNEL_SCENEGRAPH_UPDATE, {
				template : activeTemplate
			});
			module.publish(Config.CHANNEL_RENDER_TEMPLATE, {
				template : activeTemplate
			});

		};
		var openDialog = function(treeNode) {

			var containerId = 'dialog-' + treeNode.name + '-' + treeNode.id;
			//$('#' + containerId).remove();

			if (_.indexOf(loadedTemplates, treeNode.name) === -1) {
				/*inject templates to DOM from plugin*/
				module.publish(
					Config.CHANNEL_INJECT_SCRIPTTEMPLATE, {
						url: plugins[treeNode.name].templates
					});

				/*mark template as loaded*/
				loadedTemplates.push(treeNode.name);
			}
			_.templateSettings.variable = 'rc';
			/** ************************************** */
			var pluginTemplate = function(){return '';};
			/** LOAD TEMPLATE - PLUGIN FORM * */
			if (plugins[treeNode.name].templates !== undefined) {

				pluginTemplate = _.template($('script.pluginConfigForm#' + treeNode.name).html());
			}
			/** ************************************** */
			/** LOAD TEMPLATE - MODAL DIALOG * */
			var template = _.template($('script.modalDialogContainer').html());

			/*get template code*/
			var templateData = {
				id: containerId,
				name: treeNode.name,
				content: pluginTemplate()
			};
			/** ************************************** */
			/*if there is an old dialog container, remove it.*/
			if ($('#' + containerId).length > 0) {
				$('#' + containerId).remove();
			}

			$('body').append(template(templateData));


			/* Check if we got a reference of currently rendered plugins.
			 * This will make live updates possible.
			 * If not, fall back to flyweight handling.
			 */
			if(renderedPlugins !== undefined && renderedPlugins.length > 0){

				for(var i = 0, len = renderedPlugins.length; i< len; ++i){
					if(renderedPlugins[i].id === treeNode.id){
						activePlugin = renderedPlugins[i];
						getConfigCallback = renderedPlugins[i].getConfigCallback;
						renderedPlugins[i].setConfigCallback(
							treeNode.config,
							containerId,
							{
								files : files,
								plugins : plugins,
								plots : plots
							});
						break;
					}
				}
			}else{
				/* FALLBACK */
				if (typeof plugins[treeNode.name].getConfigCallback === 'function') {
					getConfigCallback = plugins[treeNode.name].getConfigCallback;
				}
				/*set configuration*/
				if (typeof plugins[treeNode.name].setConfigCallback === 'function') {
					plugins[treeNode.name].setConfigCallback.apply(plugins[treeNode.name], [ treeNode.config, containerId, {
						files : files,
						plugins : plugins,
						plots : plots
					} ]);
				}
			}

			$('#' + containerId).modal({
				show : true
			});
			$('#' + containerId).find('#modal-save').click(function(){
				updateConfig(treeNode, containerId);

			});
			$('#' + containerId).find('#modal-delete').click(function(){
				treeWalker.removeNodeById(treeNode.id);

				refresh( true );
			});
		};



		/* facade */
		return {
			/**
			 Module name
			 @public
			 @property name
			 @type {String}
			 **/
			name: _name,
			/**
			 @public
			 @method init
			 **/
			init: _init

		};
	})();

	return module;
});
