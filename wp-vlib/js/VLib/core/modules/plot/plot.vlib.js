define(
	['require', 'config', 'core/Utils.vlib', 'core/BufferManager.vlib', 'jquery',
		'underscore', './MessageController.vlib','./PreviewController.vlib', 'libs/canvas2image', 'libs/base64', 'libs/rgbcolors', 'libs/StackBlur', 'libs/canvg'],
	function ( require, Config, UTILS, BufferManager, $, _, MessageController, PreviewController ) {
		'use strict';
		/**
		 TODO<br />
		 @module Plot
		 @class Plot
		 **/
		var module = function ( w, h ) {
			this.container = 'body';
			this.name = 'plot';
			this.plugins = null;
			this.pluginBLuePrints = undefined;
			this.renderedPlugins;
			this.renderedPlugins = [];
			this.loadTemplate = function () {
				console.warn( '[ PlotModule.loadTemplate( id ) ] loadTemplate not set!' );
				this.publish( Config.CHANNEL_WARNING, '[ PlotModule.loadTemplate( id ) ] Invalid call on abstract method loadTemplate. Register loadTemplate callback first!' );
			};

			var width = w || '100%';
			var height = h || '100%';
			var plotWidth;
			var plotHeight;
			var baseId;
			var freshnderId;
			var containerID;
			var renderId;
			var handler;

			var communicationObject = {};
			var renderResult;
			var runningPlugin;
			var animationId;
			var isRendering = false;
			var lastRenderedObj;

			var _templates = Config.getModulePath() + 'plot/templates.js';

			var bm;
			var buffer;
			var groupController;
			var GROUPCONTAINER_ID = '#group';
			var context = this;

			this.disposeRenderedPlugins = function () {
				for ( var i = 0, il = this.renderedPlugins.length; i < il; ++i ) {
					if ( this.renderedPlugins[i].hasOwnProperty( "destroy" ) ) {
						this.renderedPlugins[i].destroy();
						this.renderedPlugins[i] = null;
					} else if ( this.renderedPlugins[i].hasOwnProperty( "stop" ) ) {
						/* stop root */
						this.renderedPlugins[i].stop();
					}
				}
				this.renderedPlugins = [];
				runningPlugin = null;
			};
			this.isRegisterd = function () {
				return (typeof this.subscribe === 'function') && (typeof this.publish === 'function');

			};
			this.init = function ( container ) {

				this.container = $( container );


				console.log( '********************plot init container ' + this.container.attr( 'id' ) );
				bm = new BufferManager();
				buffer = bm.getBuffer( this.container.attr( 'id' ) );

				if ( this.isRegisterd() ) {

					/** *************************************** */
					/* REQUEST TEMPLATE INJECTION */
					/** *************************************** */
					this.publish( Config.CHANNEL_INJECT_SCRIPTTEMPLATE, {
						url: _templates
					} );

					/** *************************************** */
					/* CALL FUNCTIONS HERE */
					/** *************************************** */
					this.addGui();
					this.addListener();

					handler = buffer.setAttribute( Config.BUFFER.PLOT_HANDLER, Object ).array;
					handler.messageController = new MessageController( this.container.find( '#plotMessage' ) );
					handler.previewController = new PreviewController(this.container.find( '#plotPreview' ));


					/* REQUEST LOAD_TEMPLATE_CALLBACK FROM CORE */
					this.publish( Config.CHANNEL_REQUEST_LOADTEMPLATECALLBACK );
					/* REQUESTPLUGINS FROM CORE */
					this.publish( Config.CHANNEL_REQUEST_PLUGINS, {
						src: this.container
					} );


					/** *************************************** */
				} else {
					this.publish( Config.CHANNEL_ERROR, 'Module[ plot ] not registered! Use VLib.registerModule(obj) first.' );
					throw 'Module [ ' + this.name + ' ] not registered! Use VLib.registerModule(obj) first.';
				}

			};
			this.updateCommunitationObject = function () {
				communicationObject = {
					context        : this,
					publish        : this.publish,
					subscripe      : this.subscribe,
					messageController : handler.messageController,
					loadTemplate   : this.loadTemplate,
					currentTemplate: lastRenderedObj
				};
			};
			this.addGui = function () {

				this.container.html( '' );
				/** add controler template * */
				_.templateSettings.variable = 'rc';
				var template = _.template( $( 'script.plotContainer' ).html() );
				this.container.append( template() );
				this.baseContainer = this.container.find( '#vPlot-BaseContainer' );
				this.plotContainer = this.container.find( '#plotContainer' );
				this.controlsContainer = this.container.find( '#plotControls' );


				this.baseContainer.attr( 'id', 'vPlot-base-' + this.container.attr( 'id' ) );
				this.plotContainer.attr( 'id', 'vPlot-render-' + this.container.attr( 'id' ) );

				this.baseContainer.css( 'width', width );
				this.baseContainer.css( 'height', height );

				containerID = this.container.attr( 'id' );


				// // height is zero
				if ( this.baseContainer.height() === 0 ) {
					this.baseContainer.height( this.container.height() );
				}
				if ( this.baseContainer.height() === 0 ) {
					this.publish( Config.CHANNEL_INFO, 'Module[ plot ] Container.height() is ZERO! Trying to set Container.height = BaseContainer.width' );
					this.baseContainer.height( this.container.width() );
				}
				if ( this.baseContainer.height() === 0 ) {
					this.publish( Config.CHANNEL_ERROR, 'Module[ plot ] Container.height() is ZERO!' );
				}
				if ( this.baseContainer.width() === 0 ) {
					this.baseContainer.width( this.container.width() );
				}
				if ( this.baseContainer.width() === 0 ) {
					this.publish( Config.CHANNEL_INFO, 'Module[ plot ] Container.width() is ZERO! Trying to set Container.width = BaseContainer.height' );
					this.baseContainer.width( this.container.height() );
				}
				if ( this.baseContainer.width() === 0 ) {
					this.publish( Config.CHANNEL_ERROR, 'Module[ plot ] Container.width() is ZERO!' );
				}

				width = this.baseContainer.width();
				height = this.baseContainer.height();
				plotWidth = width;
				plotHeight = height;

				baseId = this.baseContainer.attr( 'id' );
				renderId = this.plotContainer.attr( 'id' );
				this.plotContainer.width( '100%' );
				this.plotContainer.height( '100%' );
				var that = this;

				window.addEventListener( 'resize', resizePlot, false );
			};



			/** *************************************** */
			/* LISTENERS */
			/** *************************************** */
			this.attachFocusListener = function () {
				this.container.mouseenter( function () {

					$( this ).find( '#plotControls' ).fadeIn( 'slow' );

				} ).mouseleave( function () {
					$( this ).find( '#plotControls' ).fadeOut( 'slow' );
				} );
			};

			this.attachRefreshListener = function () {
				var that = this;
				this.controlsContainer.find( '#plot-refresh' ).click( function () {
					that.refresh();
				} );
			};

			this.attachLogListener = function () {
				var that = this;
				this.controlsContainer.find( '#plot-log' ).click( function () {
					handler.messageController.toggle();
				} );
			};

			this.attachSaveListener = function () {
				var that = this;
				this.controlsContainer.find( '#plot-save' ).click( function () {

					try {
						Canvas2Image.saveAsPNG( renderResult.domElement );
					} catch ( e ) {
						if ( e instanceof TypeError ) {
							//2d -svg to canvas to png
							that.plotContainer.append( '<canvas id="plot-canvas"></canvas>' );
							var canvas = document.createElement( 'canvas' );
							//svg to canvas
							var svg = that.plotContainer.find( 'svg' ).prop( 'outerHTML' ).trim();

							canvg( canvas, svg );
							//canvas to png
							Canvas2Image.saveAsPNG( canvas );
						}
					}

				} );
			};

			var isOpen = false;
			this.attachFullscreenClickListener = function () {

				var target = document.getElementById( this.container.attr( 'id' ) );
				this.controlsContainer.find( '#plot-fullscreen' ).click( function () {
					if ( !isOpen ) {
						if ( lastRenderedObj === undefined ) return;

						if ( target.requestFullscreen ) {
							target.requestFullscreen();
						} else if ( target.mozRequestFullScreen ) {
							target.mozRequestFullScreen();
						} else if ( target.webkitRequestFullscreen ) {
							target.webkitRequestFullscreen();
						} else if ( target.msRequestFullscreen ) {
							target.msRequestFullscreen();
						}

					} else {
						if ( document.exitFullscreen ) {
							document.exitFullscreen();
						} else if ( document.mozCancelFullScreen ) {
							document.mozCancelFullScreen();
						} else if ( document.webkitExitFullscreen ) {
							document.webkitExitFullscreen();
						}
					}
				} );
			};

			this.handleFullscreenState = function ( fullscreen ) {

				if ( fullscreen ) {
					this.resizeToFullscreen();
					isOpen = true;
				} else {
					this.resizeToNormal();
					isOpen = false;
				}
				//this.refresh();
			};

			var originalWidth, originalHeight;
			this.resizeToFullscreen = function () {
				var windowWidth = $( window ).width();
				var windowHeight = $( window ).height();

				originalWidth = document.getElementById( baseId ).style.width;
				originalHeight = document.getElementById( baseId ).style.height;
				document.getElementById( baseId ).style.width = windowWidth + 'px';
				document.getElementById( baseId ).style.height = windowHeight + 'px';
				resizePlot();
			};

			this.resizeToNormal = function () {

				/* SET PIXEL WIDTHxHEIGHT */
				this.baseContainer.width( width );
				this.baseContainer.height( height );
				resizePlot();
				/* SET STYLE WIDTHxHEIGHT. ( avoids wrong resizing due to "%" values) */
				document.getElementById( baseId ).style.width = originalWidth;
				document.getElementById( baseId ).style.height = originalHeight;
				resizePlot();
			};

			var resizePlot = function () {
				width = context.baseContainer.width();
				height = context.baseContainer.height();
				if ( runningPlugin ) {
					console.log( width, height );
					runningPlugin.resize( width, height );
				}

			};

			this.attachFullscreenListener = function () {
				var that = this;
				document.addEventListener( 'fullscreenchange', function () {
					that.handleFullscreenState( document.fullscreen );
				}, false );

				document.addEventListener( 'mozfullscreenchange', function () {
					that.handleFullscreenState( document.mozFullScreen );
				}, false );

				document.addEventListener( 'webkitfullscreenchange', function () {
					that.handleFullscreenState( document.webkitIsFullScreen );
				}, false );

				document.addEventListener( 'msfullscreenchange', function () {
					that.handleFullscreenState( document.msFullscreenElement );
				}, false );
			};

			this.addListener = function () {

				this.attachFullscreenListener();
				this.attachFullscreenClickListener();
				this.attachFocusListener();
				this.attachRefreshListener();
				this.attachLogListener();

				this.attachSaveListener();
				/**
				 SUBSCRIPTION
				 @event Config.CHANNEL_RESPOND_PLUGINS
				 */
				this.subscribe( Config.CHANNEL_SAVE_AS_PNG, function () {
					Canvas2Image.saveAsPNG( renderResult.domElement );
				} );
				/**
				 SUBSCRIPTION
				 @event Config.CHANNEL_REQUEST_PNG
				 */
				this.subscribe( Config.CHANNEL_REQUEST_PNG, function () {
					this.publish( Config.CHANNEL_RESPOND_PNG, Canvas2Image.saveAsPNG( renderResult.domElement, true ).src );
				} );
				/**
				 SUBSCRIPTION
				 @event Config.CHANNEL_RESPOND_PLUGINS
				 */
				this.subscribe( Config.CHANNEL_RESPOND_PLUGINS,
					this.respondPluginhandle );
				/**
				 SUBSCRIPTION
				 @event Config.CHANNEL_RENDER_TEMPLATE
				 */
				this.subscribe( Config.CHANNEL_RENDER_TEMPLATE, render );
				/**
				 SUBSCRIPTION
				 @event Config.CHANNEL_TEMPLATES_TEMPLATE_SELECTED
				 */
				this.subscribe( Config.CHANNEL_TEMPLATES_TEMPLATE_SELECTED, function ( obj ) {
					//alert("CHANNEL_TEMPLATES_TEMPLATE_SELECTED");
					//render.apply(this,[obj]);
				} );
				/**
				 SUBSCRIPTION
				 @event Config.CHANNEL_RESET
				 */
				this.subscribe( Config.CHANNEL_RESET, function () {
					this.reset();
				} );
				/**
				 SUBSCRIPTION
				 @event Config.CHANNEL_REFRESH
				 */
				this.subscribe( Config.CHANNEL_REFRESH, function ( e ) {
					//if( e && e.plot )
						//this.refresh();
				} );
				/**
				 SUBSCRIPTION
				 @event Config.CHANNEL_REFRESH
				 */
				this.subscribe( Config.CHANNEL_RESPOND_LOADTEMPLATECALLBACK, function ( loadTemplateCallback ) {
					this.loadTemplate = loadTemplateCallback;
				} );

			};

			this.refresh = function () {

				if ( lastRenderedObj === undefined ) return;

				isRendering = false;
				this.publish( Config.CHANNEL_RENDER_TEMPLATE, lastRenderedObj );

			};

			this.reset = function () {

				handler.messageController.empty();
				handler.messageController.addMsg(MessageController.MSG_TYPE.INFO, '[ plot module ] waiting for update...', true );

				if ( runningPlugin !== null && runningPlugin !== undefined ) {
					if ( typeof runningPlugin.stop === 'function' ) {
						runningPlugin.stop();
					}
					this.plotContainer.html( '' );
				}
				this.disposeRenderedPlugins();
				runningPlugin = null;
				lastRenderedObj = undefined;
				bm.empty();
			};

			this.parse = function ( treeElement ) {

				var result = [], c;
				for ( var i = 0; i < treeElement.childs.length; ++i ) {
					var tmp = this.parse( treeElement.childs[i] );
					var clone = new this.pluginBLuePrints[treeElement.childs[i].name]();
					clone.setId( treeElement.childs[i].id );
					this.renderedPlugins.push( clone );
					c = treeElement.childs[i].config || {};
					c.container = containerID;
					result.push( clone.exec( c, tmp, bm, communicationObject ) );

				}
				return result;
			};

			this.respondPluginhandle = function ( obj ) {
				if ( obj.target != this.container )
					return;
				this.plugins = obj.plugins;
				this.pluginBLuePrints = obj.bluePrint;
			};
			var runRenderJob = function ( obj, context ) {

				isRendering = true;
				var root = obj.template.sceneGraph;
				if ( root.config === '' || root.config === undefined ) {
					root.config = {};
				}

				//root.config.container = this.plotContainer === undefined ? this.container : this.plotContainer;
				root.config.container = containerID;

				lastRenderedObj = obj;
				handler.messageController.empty();
				context.updateCommunitationObject();
				context.renderedPlugins = [];
				UTILS.ACTIVITY.MOUSE.empty( renderId );

				var parseStartMsg = handler.messageController.addMsg( MessageController.MSG_TYPE.INFO, '[ Plot ][ render ][ ' + context.container.attr( 'id' ) + ' ][ START ]', true, true );

				/* PARSE AND EXEC CHILDS */
				var parsed = context.parse( root );
				/* SET ROOT  */
				runningPlugin = new context.pluginBLuePrints[root.name]();
				runningPlugin.setId( root.id );
				context.renderedPlugins.push( runningPlugin );

				/* SET ROOT DONE CALLBACK */
				runningPlugin.onDone( function () {
					isRendering = false;

					handler.messageController.addMsg( MessageController.MSG_TYPE.INFO, '[ Plot ][ render ][ ' + context.container.attr( 'id' ) + ' ][ DONE ]', true, true );

					handler.messageController.removeDiscardableMsgs();

					handler.previewController.hide();

					setTimeout(function(){
						handler.messageController.close();
					},3000);

				}, this );

				/* EXEC ROOT */
				renderResult = null;

				renderResult = runningPlugin.exec( root.config, parsed, bm );

				if ( renderResult.animationId !== undefined ) {
					animationId = renderResult.animationId;
				}
				context.plotContainer.html( renderResult.domElement );

				context.publish( Config.CHANNEL_RENDERED_PLUGIN_LIST, context.renderedPlugins );

			};

			var render = function ( obj ) {


				if ( isRendering ) {
					console.info( "[ PlotModule.render() ] is locked!" );
					return false;

				}
				if ( obj.target !== undefined ) {
					if ( (typeof obj.target === 'object') && obj.target !== this.container ) {
						return false
					}
					/* is target an id?*/
					if ( typeof obj.target === 'string' && obj.target !== this.container.attr( 'id' ) ) {
						console.log( obj.target + " != " + this.container.attr( 'id' ) );
						return false;
					}
				}

				if ( obj.template === undefined || obj.template === false ) {
					isRendering = false;
					handler.messageController.addMsg( MessageController.MSG_TYPE.INFO, '[ Plot ] waiting for update...', true );
					this.plotContainer.html( '' );
					return false;
				}

				if ( obj.template.sceneGraph === undefined || obj.template.sceneGraph === false ) {
					isRendering = false;
					handler.messageController.addMsg( MessageController.MSG_TYPE.INFO, '[ Plot ] waiting for update...', true );
					return false;
				}

				if ( obj.template.thumbnail !== undefined) {
					handler.previewController.init( obj.template.thumbnail );
				}

				handler.messageController.open();

				setMetadata(obj);

				if ( runningPlugin ) {
					var that = this;
					if ( runningPlugin.hasOwnProperty( 'postprocess' ) ) {
						runningPlugin.postprocess( function () {
							context.disposeRenderedPlugins();
							handler.previewController.show();
							runRenderJob( obj, that );
						}, that );

					} else {
						handler.previewController.show();
						runRenderJob( obj, this );
					}
				} else {
					handler.previewController.show();
					runRenderJob( obj, this );
				}


			};
			var setMetadata = function( obj ){
				if(!buffer) return false;
				var bMetadata = buffer.setAttribute( Config.BUFFER.METADATA, Object);
				var oMetadata = bMetadata.array;

				oMetadata.name = obj.template.name || "";
				oMetadata.description = obj.template.description || "";

				return true;
			}


		};

		return module;
	} );
