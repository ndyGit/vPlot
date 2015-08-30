define(
	['require', './getConfig.vlib', './setConfig.vlib', 'config', 'core/Utils.vlib', 'core/Buffer.vlib', 'core/AbstractPlugin.vlib', 'core/Framework3D.vlib', 'jquery', 'libs/Detector', 'libs/stats', 'libs/animFrame', 'threeShaderLib'
		/*,'effectcomposer', 'bloomPass', 'maskPass', 'renderPass', 'shaderPass', 'convolutionShader', 'copyShader', 'fxaaShader'*/
	],
	function ( require, getConfig, setConfig, Config, UTILS, Buffer, AbstractPlugin, F3D, $ ) {
		'use strict';
		/**
		 @class Plugin 3D
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function ( state ) {
			var name = '3d';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/3d/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/3d/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.ROOT],
				successors  : [
					Config.PLUGINTYPE.PLOT,
					Config.PLUGINTYPE.LEGEND,
					Config.PLUGINTYPE.CAMERA,
					Config.PLUGINTYPE.COLOR,
					Config.PLUGINTYPE.STANDALONE
				]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );


			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var dpr = 1;
			if ( window.devicePixelRatio !== undefined ) {
				dpr = window.devicePixelRatio;
			}

			var SCENE_WIDTH;
			var SCENE_HEIGHT;
			var env = {};
			var doneCallback = function () {/*noop*/
			};
			var doneContext = undefined;
			var buffer;
			var animationFrameId;
			var container = $( 'body' );
			var plotContainer;
			var pIdList = [];
			var plotList = [];
			var runningPlots = 0;
			var sceneObjects = [];
			var plotContainerId;
			var stats = null;
			var camera = null;

			var domEvents;
			var clearColor = 0xffffff;

			//camera controller
			var cameraController = null;
			// legend scene object
			var legend;
			// legend callback
			var lcall;
			// legend context
			var lcon;

			var scene = null;
			var renderer = null;
			var controls = null;
			var clock = null;
			var running = false;

			var effectFXAA;
			var cmposer;
			var light3;

			var context = this;


			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */

			this.env = undefined;
			this.sceneHeightDefault = 'auto';
			this.sceneWidthDefault = 'auto';
			this.camera = undefined;
			this.camXDefaultPosition = 800;
			this.camYDefaultPosition = 800;
			this.camZDefaultPosition = 800;
			this.camXDefaultRotation = -0.9;
			this.camYDefaultRotation = 0.9;
			this.camZDefaultRotation = 2.5;
			this.camXDefaultUp = 0;
			this.camYDefaultUp = 1;
			this.camZDefaultUp = 0;
			this.defaultEnvmap = 'none';
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.deepCopy = function () {
				var privates = {
					// no need to copy state of intersection stuff. they are just short-time buffers
				};
				return new Plugin( privates );
			};
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
			this.getConfigCallback = getConfig;
			/*
			 * Takes arguments from config and inserts them to the
			 * plugin-template
			 *
			 * @param config
			 *            plugin config file
			 * @param containerId
			 *            parent container where the plugin-template got
			 *            added
			 */
			this.setConfigCallback = setConfig;

			this.handleConfig = function ( config, env ) {
				env.config = config || {};
				if ( config.scene === undefined ) {
					config.scene = {width: 'auto', height: 'auto'};
				}
				if ( env.config.camera === undefined ) {
					env.config.camera = {};
					env.config.camera.position = {
						x: this.camXDefaultPosition,
						y: this.camYDefaultPosition,
						z: this.camZDefaultPosition
					};
					env.config.camera.rotation = {
						x: this.camXDefaultRotation,
						y: this.camYDefaultRotation,
						z: this.camZDefaultRotation
					};
					env.config.camera.up = {x: this.camXDefaultUp, y: this.camYDefaultUp, z: this.camZDefaultUp};
				}
				if ( env.config.camera.position === undefined ) {
					env.config.camera.position = {
						x: this.camXDefaultPosition,
						y: this.camYDefaultPosition,
						z: this.camZDefaultPosition
					};
				}
				if ( env.config.camera.rotation === undefined ) {
					env.config.camera.rotation = {
						x: this.camXDefaultRotation,
						y: this.camYDefaultRotation,
						z: this.camZDefaultRotation
					};
				}
				if ( env.config.camera.up === undefined ) {
					env.config.camera.up = {x: this.camXDefaultUp, y: this.camYDefaultUp, z: this.camZDefaultUp};
				}

				if ( env.config.alpha === undefined ) {
					config.alpha = true;
				}
				if ( env.config.antialias === undefined ) {
					env.config.antialias = true;
				}
				if ( !env.config.hasOwnProperty( 'envmap' ) ) {
					env.config.envmap = this.defaultEnvmap;
				}

			};

			this.handleEnv = function ( env, config, bufferManager ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};


			/**
			 * Returns a minimal description of this plugin.
			 * This method is used by the sceneGraph module.
			 * @returns {string}
			 *
			 */
			this.getShortName = function () {
				"use strict";
				return "THREE.js";
			};

			this.onDone = function ( cb, ctx ) {
				doneCallback = cb;
				doneContext = ctx;
			};

			this.postprocess = function ( doneCallback, doneContext ) {
				if ( !plotList || plotList.length === 0 ) {
					doneCallback();
					return;
				}
				var plot, counter = 0;
				for ( var i = 0, len = plotList.length; i < len; ++i ) {
					plot = plotList[i];
					plot.response.onPostprocess( function () {
						counter++;
						if ( counter === len ) {
							doneCallback();
						}

					}, this, plot.response.context );
				}
			};


			this.exec = function ( config, childs, bufferManager ) {

				//console.log('[ 3d ] \t\t EXEC '+ this.getId());
				if ( bufferManager !== undefined ) {
					buffer = bufferManager.getBuffer( this.getId() );
				}

				env = {};
				this.env = env;
				this.handleEnv( env );
				this.handleConfig( config, env );


				if ( env.config.container !== undefined ) {
					container = $( '#' + env.config.container );
				} else {
					alert( 'plugin 3d ERROR: NO RENDER CONTAINER GIVEN!' );
				}

				plotContainer = container.find( Config.PLOT_CONTAINER );
				plotContainerId = plotContainer.attr( 'id' );
				if ( !plotContainer ) {
					alert( 'plugin 3d ERROR: Plot container not found!' );
				}

				handleChilds( childs );


				/* ********************************* init */
				if ( true/*!running*/ ) {

					clock = new F3D.Clock();
					updateSceneDimensions();
					initRenderer( env );
					initScene();
					initCamera( env );
					initLights();
					initStats();
					initLegend();
					initSkyBox( env );
					initF3DPostprocessing();

					onWindowResize();
					resetCameraControler( true );


					env.camera = camera;

					/* scene.add(new THREE.AxisHelper(400));*/
					/**
					 * START RENDER LOOP
					 */
					this.start();

				}


				attachListeners();

				console.info( '[ plugin ][ 3d ] sceneSize( ' + SCENE_WIDTH + ' x ' + SCENE_HEIGHT + ' )' );

				runPlots( function () {
					doneCallback.call( doneContext );
					/* fill legend */
					if ( legend ) {
						fillLegend( bufferManager, legend, pIdList );
					}
				} );

				return renderer;

			};

			this.resize = function ( w, h ) {
				//console.log("RESIZE %s x %s",w,h);
				SCENE_WIDTH = w;
				SCENE_HEIGHT = h;

				if ( cameraController ) {
					cameraController.stop();
					cameraController.destroy();
				}

				if ( camera ) {
					camera.aspect = SCENE_WIDTH / SCENE_HEIGHT;
					camera.updateProjectionMatrix();
					resetCameraControler( true );
				}

				if ( renderer ) {
					renderer.setSize( SCENE_WIDTH, SCENE_HEIGHT );
					/*
					 composer.setSize( SCENE_WIDTH, SCENE_HEIGHT );
					 effectFXAA.uniforms.resolution.value.set( 1/SCENE_WIDTH*dpr, 1/SCENE_HEIGHT*dpr );
					 */

				}

			};

			this.stop = function () {

				console.info( '[ 3D ] Stopping animation frame loop!' );
				if ( animationFrameId !== undefined ) {
					cancelRequestAnimFrame( animationFrameId );
					animationFrameId = undefined;
				}

				/* remove everything which is related to this scope from singletons */
				UTILS.ACTIVITY.MOUSE.empty( plotContainer.attr( 'id' ) );
				UTILS.ACTIVITY.RENDERER.empty( plotContainer.attr( 'id' ) );

				removeListeners();

				dealocateSceneObjects();

				/* destroy camera controller */
				reomoveCameraControler();


				sceneObjects = [];
				plotList = [];
				stats = null;
				camera = null;

				scene = null;
				renderer = null;
				controls = null;
				clock = null;
				running = false;

				return true;
			};

			this.start = function () {
				running = true;
				if ( !animationFrameId ) {
					console.info( '[ 3D ] Starting animation frame loop!' );
					animate.apply( this, [] );
				}
			};

			/** ********************************** */
			/** PRIVATE METHODS * */
			/** ********************************** */

			var animate = function () {
				animationFrameId = requestAnimFrame( animate );
				render.apply( this, [] );
			};

			/**
			 * Renders the current state
			 */

			var render = function () {

				renderer.clear();

				renderer.render( scene, camera );
				//composer.render();
				if ( legend ) {
					renderer.render( legend.scene, legend.camera );
				}

				UTILS.ACTIVITY.RENDERER.update( clock.getDelta(), scene, camera, renderer, plotContainerId );

				if ( stats !== null && stats !== undefined ) {
					stats.update();
				}

			};

			var runPlots = function ( done ) {
				var plot;
				runningPlots = plotList.length;
				if ( runningPlots === 0 ) {
					done();
				}
				for ( var i = 0, len = plotList.length; i < len; ++i ) {
					plot = plotList[i];
					/* SET DONE CALLBACK */
					plot.response.onDone.call( plot.response.context, function ( id ) {
						runningPlots--;
						if ( runningPlots === 0 ) {
							done();
						}
					}, this );
					/* RUN PLOT */
					plot.response.run.apply( plot.response.context, [scene, camera] );
				}

			};


			var initSkyBox = function ( env ) {

				if ( env.config.envmap === undefined || env.config.envmap === 'none' ) {
					return;
				}
				var path = Config.getDataPath() + '/textures/cube/' + env.config.envmap + '/';
				var format = '.jpg';
				var urls = [
					path + 'px' + format, path + 'nx' + format,
					path + 'py' + format, path + 'ny' + format,
					path + 'pz' + format, path + 'nz' + format
				];
				var reflectionCube = THREE.ImageUtils.loadTextureCube( urls );
				reflectionCube.format = THREE.RGBFormat;


				var shader = THREE.ShaderLib["cube"];
				shader.uniforms["tCube"].value = reflectionCube;

				var material = new THREE.ShaderMaterial( {

					fragmentShader: shader.fragmentShader,
					vertexShader  : shader.vertexShader,
					uniforms      : shader.uniforms,
					depthWrite    : false,
					side          : THREE.BackSide

				} );

				var sky = new THREE.Mesh( new THREE.BoxGeometry( 10000, 10000, 10000 ), material );


				scene.add( sky );
			};

			var initLegend = function () {
				if ( lcall && lcon ) {
					legend = lcall.apply( lcon, [SCENE_WIDTH, SCENE_HEIGHT] );
				}
			};

			var initRenderer = function ( env ) {
				if ( Detector.webgl ) {

					renderer = new F3D.WebGLRenderer( {
						antialias            : env.config.antialias,
						alpha                : env.config.alpha,
						preserveDrawingBuffer: true
					} );

				} else {
					renderer = new F3D.CanvasRenderer();
				}

				/* set background color */
				renderer.autoClear = false;
				renderer.setClearColor( clearColor, 1 );
			};

			var initScene = function () {
				scene = new F3D.Scene();
				scene.name = Math.ceil( Math.random() * 100 );

				/* add objects to scene */
				for ( var i = 0; i < sceneObjects.length; ++i ) {
					scene.add( sceneObjects[i] );
				}
			};

			/**
			 * Initialize camera with default values
			 * and add it to scene
			 * @param env
			 */
			var initCamera = function ( env ) {
				camera = new F3D.PerspectiveCamera( 45, (SCENE_WIDTH / SCENE_HEIGHT),
					1, 15000 );
				//console.log("SET ROT: %s, %s, %s ", env.config.camera.rotation.x, env.config.camera.rotation.y, env.config.camera.rotation.z );
				camera.position.set( parseFloat( env.config.camera.position.x ), parseFloat( env.config.camera.position.y ), parseFloat( env.config.camera.position.z ) );
				camera.rotation.set( env.config.camera.rotation.x, env.config.camera.rotation.y, env.config.camera.rotation.z );
				camera.up.set( env.config.camera.up.x, env.config.camera.up.y, env.config.camera.up.z );
				scene.add( camera );
				camera.lookAt( scene.position );


			};

			var initStats = function () {
				stats = new Stats();
				stats.domElement.style.position = 'relative';
				stats.domElement.style.width = '100%';
				stats.domElement.style.top = '0px';
				container.parent().find( '#plotStats' ).html( stats.domElement );
			};

			var initLights = function () {
				/*PointLight: color, intensity, distance */
				var light1 = new F3D.PointLight( 0xffffff, 1.5 );
				light1.position.set( -5000, -5000, -5000 );


				var light2 = new F3D.PointLight( 0xffffff, 1.5 );
				light2.position.set( 5000, 5000, 5000 );
				var light3 = new F3D.PointLight( 0xffffff, 1.5 );


				scene.add( light1 );
				scene.add( light2 );
				scene.add( light3 );

				light3.userData.counter = 0;
				light3.shadowCameraVisible = true;
				context.lightAnimation = new UTILS.ACTIVITY.RENDERER.Activity( container.attr( 'id' ), light3,
					function ( e ) {
						var offset = 500;
						e.object.position.x = e.camera.position.x + offset;
						e.object.position.y = e.camera.position.y + offset;
						e.object.position.z = e.camera.position.z;
					}, context );
				context.lightAnimation.start();
			};

			var initF3DPostprocessing = function () {
				/*
				 var renderTargetParameters = {
				 minFilter: THREE.LinearFilter,
				 magFilter: THREE.LinearFilter,
				 format: THREE.RGBFormat,
				 stencilBufer: false
				 };
				 var renderTarget = new F3D.WebGLRenderTarget(SCENE_WIDTH,SCENE_HEIGHT,renderTargetParameters);
				 composer = new THREE.EffectComposer( renderer,renderTarget );
				 var renderModel = new THREE.RenderPass( scene, camera );
				 var effectBloom = new THREE.BloomPass( 0.1 );
				 var effectCopy = new THREE.ShaderPass( THREE.CopyShader );
				 effectFXAA = new THREE.ShaderPass( THREE.FXAAShader );
				 effectFXAA.uniforms.resolution.value.set( 1/SCENE_WIDTH*dpr, 1/SCENE_HEIGHT*dpr );


				 effectCopy.renderToScreen = true;
				 composer.addPass( renderModel );
				 composer.addPass( effectFXAA );
				 composer.addPass( effectBloom );
				 composer.addPass( effectCopy );

				 */
			};

			var handleChilds = function ( childs ) {
				sceneObjects = [];
				var child;
				for ( var i = 0; i < childs.length; ++i ) {
					child = childs[i];
					if ( child !== undefined && child.pType !== undefined ) {
						if ( $.inArray( child.pType, context.accepts.successors ) != -1 ) {
							switch ( child.pType ) {
								case Config.PLUGINTYPE.CAMERA:
									cameraController = child.response.controller;
									break;
								case Config.PLUGINTYPE.LIGHT:
									sceneObjects.push( child.response );
									break;
								case Config.PLUGINTYPE.PLOT:
									pIdList.push( child.pId );
									plotList.push( child );
									break;
								case Config.PLUGINTYPE.COLOR:
									clearColor = '#' + child.response.color;
									break;
								case Config.PLUGINTYPE.LEGEND:
									lcall = child.response.callback;
									lcon = child.response.context;
									break;
							}
						}
					} else {
						console.warn( '[ 3D ] pType of child plugin not set!' );
					}
				}
			};

			var updateSceneDimensions = function () {
				var base = container.find( '.vPlot-BaseContainer' );
				SCENE_WIDTH = ((context.env.config.scene.width === undefined) || (context.env.config.scene.width === 'auto')) ? base.width() : context.env.config.scene.width;

				SCENE_HEIGHT = ((context.env.config.scene.height === undefined) || (context.env.config.scene.height === 'auto')) ? base.height() : context.env.config.scene.height;

				/* check if min-height is set */
				if ( SCENE_HEIGHT === 0 ) {
					SCENE_HEIGHT = base.css( 'min-height' );

				}
				/* default height */
				if ( SCENE_HEIGHT === 0 ) {
					SCENE_HEIGHT = Config.DEFAULT_PLOT_HEIGHT;
				}

			};
			var fillLegend = function ( bufferManager, legend, bufferDescriptors ) {
				var plotBuffer, dataObjects = [];
				var _ATTRIBUTE_ = Config.BUFFER.METADATA;
				for ( var i = 0, len = bufferDescriptors.length; i < len; ++i ) {
					plotBuffer = bufferManager.getBuffer( bufferDescriptors[i] );
					if ( plotBuffer ) {
						if ( plotBuffer.isAttribute( _ATTRIBUTE_ ) ) {
							dataObjects.push( plotBuffer.getAttribute( _ATTRIBUTE_ ).array );
						} else {
							console.warn( "[ Warning ][ 3d ][ fillLegend ][ buffer id =" + bufferDescriptors[i] + " ] No data found." );
						}
					} else {
						console.warn( "[ Warning ][ 3d ][ fillLegend ] No buffer with id = " + bufferDescriptors[i] + " found." );
					}
				}
				legend.addLegendElements( dataObjects );

				var plotbuffer = bufferManager.getBuffer( env.config.container );
				var metadata = plotbuffer.getAttribute( Config.BUFFER.METADATA ).array;
				legend.addInfoElement( metadata.name + "<br />" + metadata.description );

			};

			var resetCameraControler = function ( init ) {
				if ( !cameraController ) {
					return;
				}
				console.info( '[ 3D ] Reset mouse controler. camera=' + camera.id );

				cameraController.stop();
				if ( init ) {
					cameraController.init( camera, container.find( Config.PLOT_CONTAINER ) );
				}
				cameraController.start();

				console.info( '[ 3D ] Reset mouse controler. camera=' + camera.id + " DONE" );
			};

			var reomoveCameraControler = function () {
				if ( !cameraController ) {
					return;
				}
				cameraController.stop();

			};

			/* dealocate scene objects and empty scene */
			var dealocateSceneObjects = function () {
				for ( var i = 0; i < sceneObjects.length; ++i ) {
					if ( sceneObjects[i].hasOwnProperty( "destroy" ) )
						sceneObjects[i].destroy();
					scene.remove( sceneObjects[i] );
					sceneObjects[i].deallocateObject();
				}
			};

			var attachListeners = function () {
				if ( !renderer ) {
					return false;
				}
				renderer.domElement.addEventListener( 'click', onClickListener, false );
				renderer.domElement.addEventListener( 'dblclick', onDBLClickListener, false );
				renderer.domElement.addEventListener( 'mouseover', onOverListener, true );
				renderer.domElement.addEventListener( 'mouseout', onOutListener, true );
			};

			var removeListeners = function () {
				if ( !renderer ) {
					return false;
				}
				renderer.domElement.removeEventListener( 'click', onClickListener, false );
				renderer.domElement.removeEventListener( 'dblclick', onDBLClickListener, false );
				renderer.domElement.removeEventListener( 'mouseover', onOverListener, true );
				renderer.domElement.removeEventListener( 'mouseout', onOutListener, true );
			};

			var onClickListener = function ( e ) {
				e.preventDefault();
				UTILS.ACTIVITY.MOUSE.click( e, scene, camera, renderer, plotContainer );
				if ( !legend ) return;
				UTILS.ACTIVITY.MOUSE.click( e, scene, legend.camera, renderer, plotContainer );
			};
			var onDBLClickListener = function ( e ) {
				e.preventDefault();
				UTILS.ACTIVITY.MOUSE.dblclick( e, scene, camera, renderer, plotContainer );
			};

			var onOverListener = function ( e ) {
				e.preventDefault();
				resetCameraControler();
				UTILS.ACTIVITY.MOUSE.over( e, scene, camera, renderer, plotContainer );
			};

			var onOutListener = function ( e ) {
				e.preventDefault();
				reomoveCameraControler();
				UTILS.ACTIVITY.MOUSE.out( e, scene, camera, renderer, plotContainer );
			};
			var onWindowResize = function () {

				updateSceneDimensions();
				if ( camera ) {

					camera.aspect = SCENE_WIDTH / SCENE_HEIGHT;
					camera.updateProjectionMatrix();
					//resetCameraControler();
				}

				if ( renderer ) {
					renderer.setSize( SCENE_WIDTH, SCENE_HEIGHT );
				}

			};

		});
		UTILS.CLASS.extend( Plugin, AbstractPlugin );
		return Plugin;
	} );
