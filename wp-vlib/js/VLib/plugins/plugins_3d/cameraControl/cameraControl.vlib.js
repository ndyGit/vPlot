define( ['require', 'config', './getConfig.vlib', './setConfig.vlib', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'jquery', './FirstPersonCC.vlib',
		'three', 'three_trackball_controls', 'three_orbit_controls'],
	function ( require, Config, getConfig, setConfig, AbstractPlugin, UTILS, $, FirstPerson ) {
		/**
		 @class Plugin CameraControl
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = function () {
			var name = 'cameraControl';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.CAMERA );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/cameraControl/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/cameraControl/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.CONTEXT_3D],
				successors  : []
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );

			this.$container;
			this.controls = null;
			this.renderActivity = null;
			this.camera = false;

			this.msg = false;

			this.config = null;
			this.defaults = {
				controlType: 'trackball',
				position        : {
					x: 800,
					y: 800,
					z: 800
				},
				rotation   : {
					x: -0.9,
					y: 0.9,
					z: 2.5
				},
				lookAt     : {
					x: 0,
					y: 0,
					z: 0
				},
				up : {
					x: 0,
					y: 1,
					z: 0
				},
				useCC      : true
			};

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
			this.setConfigCallback = setConfig;

			this.getConfigCallback = getConfig;

			this.handleConfig = function ( config ) {
				"use strict";
				if ( config === undefined || config === '' ) {
					config = {
						controlType: this.defaults.controlType,
						position        : this.defaults.position,
						rotation   : this.defaults.rotation,
						up          : this.defaults.up,
						lookAt     : this.defaults.lookAt,
						useCC      : this.defaults.useCC
					};
				}
				if ( !config.hasOwnProperty( 'controlType' ) ) {
					config.controlType = this.defaults.controlType;
				}
				if ( !config.hasOwnProperty( 'position' ) ) {
					config.position = this.defaults.position;
				}
				if ( !config.hasOwnProperty( 'up' ) ) {
					config.up = this.defaults.up;
				}
				if ( !config.hasOwnProperty( 'rotation' ) ) {
					config.rotation = this.defaults.rotation;
				}
				if ( !config.hasOwnProperty( 'lookAt' ) ) {
					config.lookAt = this.defaults.lookAt;
				}
				if ( !config.hasOwnProperty( 'useCC' ) ) {
					config.useCC = this.defaults.useCC;
				}
			};

			this.cameraUp = function ( up ) {
				if ( !this.camera ) {
					return false;
				}
				switch ( up ) {
					case 'x':
						this.camera.up.x = 1;
						this.camera.up.y = 0;
						this.camera.up.z = 0;
						break;
					case 'y':
						this.camera.up.x = 0;
						this.camera.up.y = 1;
						this.camera.up.z = 0;
						break;
					case 'z':
						this.camera.up.x = 0;
						this.camera.up.y = 0;
						this.camera.up.z = 1;
						break;
				}
				this.camera.lookAt( new THREE.Vector3( this.config.lookAt.x, this.config.lookAt.z, this.config.lookAt.z ) );

			};

			/**
			 * config = object config.controlType = (trackball||orbit) default =
			 * trackball
			 *
			 * config.pos = object = camera position config.pos.x config.pos.y
			 * config.pos.z
			 */
			this.exec = function ( config, childs, bufferManager, communication ) {

				this.communication = communication;
				this.config = config || {};
				this.handleConfig( this.config );

				if ( this.config.controlType === 'firstPerson' && config.useCC ) {
					this.msg = this.communication.messageController.addMsg( 'alert-info', 'Hold mouse button to rotate camera. <br /> Use W,A,S,D,R,F to move.' );
				}


				return {
					pId     : this.getId(),
					pType   : this.type,
					response: {
						controller: this
					}
				};

			};
		};

		UTILS.CLASS.extend( Plugin, AbstractPlugin );



		Plugin.prototype.init = function ( camera, $container ) {
			"use strict";


			// set camera
			this.camera = camera;
			// set container
			this.$container = $container;

			// set camera position
			this.camera.position.set( this.config.position.x, this.config.position.y, this.config.position.z );

			// set camera rotation
			this.camera.rotation.set( this.config.rotation.x, this.config.rotation.y, this.config.rotation.z );

			// set camera up
			this.camera.up.set( this.config.up.x, this.config.up.y, this.config.up.z );

			// set camera lookAt
			this.camera.lookAt( new THREE.Vector3(
				this.config.lookAt.x,
				this.config.lookAt.y,
				this.config.lookAt.z
			) );

			// init camera controller
			if ( !this.config.useCC ) {
				return;
			}

			if ( this.controls && this.controls.init ) {
				this.controls.init();
			}


			if ( this.renderActivity ) {
				return true;
			}

			this.destroy();


			this.setController( camera, this.config );

			this.renderActivity = new UTILS.ACTIVITY.RENDERER.Activity( $container.attr( 'id' ), camera,
				function ( e ) {
					this.controls.update( e.time );
				}, this );



		};

		Plugin.prototype.destroy = function () {
			"use strict";
			if ( !this.config.useCC ) {
				return false;
			}

			if ( this.renderActivity ) {
				this.renderActivity.stop();
			}
			this.renderActivity = null;

			this.controls = null;
			return true;
		};

		Plugin.prototype.stop = function () {
			"use strict";
			if ( !this.config.useCC ) {
				return false;
			}
			if ( this.controls ) {
				if ( this.controls.stop ) {
					this.controls.stop();
				}
				//this.controls = null;
			}
			if ( this.renderActivity ) {
				this.renderActivity.stop();
				return true;
			}
			return false;
		};

		Plugin.prototype.start = function () {
			"use strict";
			if ( !this.config.useCC ) {
				return false;
			}

			if ( this.renderActivity ) {
				this.renderActivity.start();
				return true;
			}
			return false;
		};

		Plugin.prototype.setController = function ( camera, config ) {

			var domelement = this.$container.get( 0 );

			console.log("setController");

			if ( !this.config.hasOwnProperty( 'controlType' ) ) {
				console.log( this.config );
				alert( '[ CameraController ] controlType not set!' );
				return;
			}



			switch ( this.config.controlType ) {
				case 'trackball':

					this.controls = new THREE.TrackballControls( camera, domelement );
					this.controls.target.set( config.lookAt.x, config.lookAt.y, config.lookAt.z );
					this.controls.rotateSpeed = 1.2;
					this.controls.zoomSpeed = 1.2;
					this.controls.panSpeed = 0.8;
					this.controls.noZoom = false;
					this.controls.noPan = true;
					this.controls.staticMoving = true;
					this.controls.dynamicDampingFactor = 1;
					this.controls.keys = [65, 83, 68];
					this.controls.lookVertical = true;
					this.controls.lookSpeed = 0.125;
					break;
				case 'orbit':

					this.controls = new THREE.OrbitControls( camera, domelement );
					this.controls.target.set( config.lookAt.x, config.lookAt.y, config.lookAt.z );
					this.controls.noPan = true;
					this.controls.zoomSpeed = 0.5;
					this.controls.rotateSpeed = 0.5;
					break;
				case 'firstPerson':

					this.controls = new FirstPerson( camera, this.$container, config );

					break;
				default:
					this.controls = new THREE.TrackballControls( camera, domelement );
					this.controls.target.set( config.lookAt.x, config.lookAt.y, config.lookAt.z );
					this.controls.rotateSpeed = 1.2;
					this.controls.zoomSpeed = 1.2;
					this.controls.panSpeed = 0.8;
					this.controls.noZoom = false;
					this.controls.noPan = true;
					this.controls.staticMoving = false;
					this.controls.dynamicDampingFactor = 1;
					this.controls.keys = [65, 83, 68];
					this.controls.lookVertical = true;
					this.controls.lookSpeed = 0.125;
					break;
			}

			return this.controls;

		};
		return Plugin;

	} );
