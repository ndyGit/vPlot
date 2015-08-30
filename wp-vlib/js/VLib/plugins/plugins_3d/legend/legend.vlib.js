define( ['require', 'config', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'three', './GeometryWrapper.vlib', 'jquery',
		'plugins/plugins_3d/activity/fade/fade.vlib','three_multilinetext'],
	function ( require, Config, AbstractPlugin, UTILS, THREE, GeometryWrapper, $, Fade ) {
		/**
		 TODO<br />
		 @class Plugin BasicMaterial
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {
			var name = 'legend';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.LEGEND );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/legend/templates.js' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/legend/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.CONTEXT_3D],
				successors  : []
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var bm;
			var elementCounter = 0;
			var legend_;
			var goldenRatio;
			var height;
			var textPlane;
			var infoPlane;
			var textPlaneWidth;
			var infoPlaneWidth;
			var legendLabelWidth;
			var infoLabelWidth;
			var legendPositionOpen_ = {x: 0, y: 0, z: 0};
			var legendPositionClosed_ = {x: 0, y: 0, z: 0};
			var infoPositionOpen_ = {x: 0, y: 0, z: 0};
			var infoPositionClosed_ = {x: 0, y: 0, z: 0};
			var duration_ = 1;
			var visible_ = 0.8;
			var isLegendOpen_ = false;
			var isInfoOpen_ = false;
			var cameraDistance = 700;
			var dragWidth = 20;
			var labelFontWidth = 10;
			var backgroundColor = 0xfbfbfb;
			var dragColor = [0x3B5336, 0x361251, 0x203478, 0x2e2d2c, 0x908b00, 0x790726, 0x903370, 0x203478];
			var animation;
			var BACKGROUND_POSITION = 0;
			var TEXT_POSITION = -2;
			var ELEMENT_POSITION = -10;
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */

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
			 * @return config file format: {camera:{x:VALUE,y:VALUE,z:VALUE}}
			 */
			this.getConfigCallback = function ( containerId ) {
				var opacity = $( '#' + containerId + ' #opacity' ).val();
				var transparent = $( '#' + containerId + ' #transparent' ).is( ':checked' );

				var result = {
					opacity    : opacity,
					transparent: transparent
				};

				return result;
			};
			/**
			 * Takes arguments from config and inserts them to the plugin-template
			 *
			 * @param config
			 *            plugin config file
			 * @param containerId
			 *            parent container where the plugin-template got added
			 */
			this.setConfigCallback = function ( config, containerId ) {

				if ( config == "" ) {
					config = {
						opacity    : 0.9,
						transparent: true
					};
				}
				if ( config.opacity != undefined ) {
					$( '#' + containerId + ' #opacity' ).val(
						config.opacity );
				} else {
					$( '#' + containerId + ' #opacity' ).val( 0.9 );
					config.opacity = 0.9;
				}
				if ( config.transparent != undefined ) {
					if ( config.transparent === true ) {
						$( '#' + containerId + ' #transparent' ).attr( 'checked', 'checked' );
					}
				}

				// opacitySlider
				$( '#' + containerId ).find( ' #opacitySlider' ).slider( {
					orientation: "horizontal",
					range      : "min",
					min        : 0,
					max        : 100,
					value      : config.opacity * 100,
					slide      : function ( event, ui ) {
						$( '#' + containerId + ' #opacity' ).val( ui.value / 100 );
					}
				} );


			};
			var fadeIn = function ( duration ) {
				for ( var i = 0, len = legend_.children.length; i < len; ++i ) {
					animation.fadeIn( legend_.children[i], duration, UTILS.ACTIVITY.RENDERER.EASING.Quadratic.Out );
				}
			};
			var fadeOut = function ( duration ) {
				for ( var i = 0, len = legend_.children.length; i < len; ++i ) {
					animation.fadeOut( legend_.children[i], duration, UTILS.ACTIVITY.RENDERER.EASING.Quadratic.Out );
				}

			};

			var toggleLegend = function () {

				if ( !isLegendOpen_ ) {
					animation.moveTo( legend_, legendPositionOpen_, duration_, UTILS.ACTIVITY.RENDERER.EASING.Exponential.Out );
				} else {
					animation.moveTo( legend_, legendPositionClosed_, duration_, UTILS.ACTIVITY.RENDERER.EASING.Bounce.Out );
				}
				isLegendOpen_ = !isLegendOpen_;
				if ( !isLegendOpen_ ) {
					isInfoOpen_ = false;
				}
			};

			var toggleInfo = function () {
				if ( !isInfoOpen_ ) {
					animation.moveTo( legend_, infoPositionOpen_, duration_, UTILS.ACTIVITY.RENDERER.EASING.Exponential.InOut );
				} else {
					animation.moveTo( legend_, infoPositionClosed_, duration_, UTILS.ACTIVITY.RENDERER.EASING.Exponential.InOut );
				}
				isInfoOpen_ = !isInfoOpen_;
			};

			var getVisibleWindow = function ( renderWidth, renderHeight, camera ) {
				var w, h, vFOV, hFOV;
				vFOV = camera.fov * Math.PI / 180;
				h = 2 * Math.tan( vFOV / 2 ) * camera.position.z;
				w = h * camera.aspect;
				return {
					width : w,
					height: h
				}
			};

			var setPositionLegendOpen = function ( x, y, z ) {
				legendPositionOpen_ = {x: x, y: y, z: z};
				legendPositionClosed_.y = y;

			};

			var setPositionLegendClosed = function ( x, y, z ) {
				legendPositionClosed_ = {x: x, y: y, z: z};

			};

			var setPositionInfoOpen = function ( x, y, z ) {
				infoPositionOpen_ = {x: x, y: y, z: z};
				infoPositionClosed_.y = y;

			};

			var setPositionInfoClosed = function ( x, y, z ) {
				infoPositionClosed_ = {x: x, y: y, z: z};

			};
			var setY = function ( y ) {
				legendPositionOpen_.y = y;
				legendPositionClosed_.y = y;
				infoPositionOpen_.y = y;
				infoPositionOpen_.y = y;

			};

			/**
			 * @return clickable objects {Array}
			 */
			var addLegendElements = function ( objects, env ) {
				"use strict";
				var len = objects.length;
				var maxHeight = height / len;
				var groupHeight = maxHeight > 25 ? 25 : maxHeight;
				var properties, element;
				var margin = 5;
				var offsetX = 0;
				var offsetY = height / 3;
				var elements = new THREE.Object3D();
				var maxWidth = 0;

				for ( var i = 0; i < len; ++i ) {
					properties = objects[i];
					if ( Object.keys( properties ).length > 0 ) {
						element = getLegendElement( properties, groupHeight, env );
						element.group.position.set( 0, offsetY, 0 );
						elements.add( element.group );
						offsetY -= groupHeight + margin;
						maxWidth = element.width > maxWidth ? element.width : maxWidth;
					}
				}
				elements.position.set( -textPlaneWidth / 2 + margin, 0, 0 );
				legend_.add( elements );

				return true;
			};

			var addInfoElement = function(text, env){
				"use strict";


				var stext = new THREE.MultilineTextHelper(text,{
					maxWidth : infoPlaneWidth + 100,
					depthWrite    : false,
					depthTest     : false,
					size          : 11,
					height        : 0,
					font          : 'helvetiker',
					weight        : 'normal',
					style         : 'normal',
					bevelEnabled  : false,
					bevelThickness: 0,
					bevelSize     : 0,
					curveSegments : 6
				});

				//var stext = GeometryWrapper.getTextCanvas( goldenRatio.a,height,text,0, 0x000000);
				console.log(stext);
				stext.position.set( textPlaneWidth/2 + legendLabelWidth/2 + infoLabelWidth/2 +20 , height/3 , -2 );

				legend_.add(stext);
				return true;
			};


			var getLegendElement = function ( properties, height, env ) {

				var group = new THREE.Object3D();
				var width = 0;
				var margin = 5;
				var offset = height + margin;

				/* *************************************** */
				/* PLOT ICON */
				if ( properties.icon ) {
					var icon = GeometryWrapper.getSprite( Config.basePath + Config.appPath + properties.icon, {
						useScreenCoordinates: false,
						transparent : true,
						opacity : 1,
						depthWrite: false,
						depthTest: false
					} );
					icon.position.set( offset, 0, ELEMENT_POSITION );
					icon.scale.set( height, height, 1.0 );
					group.add( icon );
					offset += (height + margin);
					width += (height + margin);
				}

				/* *************************************** */
				/* COLORS / HEATMAP + SHAPE */
				var sprite, sprite2;
				if ( properties.sprite ) {
					/* use shape */
					sprite = GeometryWrapper.getSprite( properties.sprite );
					sprite.scale.set( height, height, 1.0 );
				} else {
					/* create surface */
					sprite = GeometryWrapper.getSurface( height, height, 0x000000 );
				}

				var useDefaultSprite = true;
				/*HEATMAPS*/

				if ( properties.heatmaps && properties.heatmaps.length > 0 ) {
					for ( var i = 0, len = properties.heatmaps.length; i < len; ++i ) {
						if(!properties.heatmaps[i]){
							continue;
						}
						sprite.material = sprite.material.clone();
						sprite.material.color = new THREE.Color( '#' + properties.heatmaps[i].spectrum.from );
						sprite.position.set( offset, 0, ELEMENT_POSITION );
						group.add( sprite.clone() );
						offset += height;
						width += height;
						/* 2nd color*/
						sprite2 = sprite.clone();
						sprite2.material = sprite.material.clone();
						sprite2.material.color = new THREE.Color( '#' + properties.heatmaps[i].spectrum.to );
						sprite2.position.set( offset, 0, ELEMENT_POSITION );
						group.add( sprite2.clone() );
						offset += height;
						width += height;
					}
					useDefaultSprite = false;
				}

				if ( properties.colors && properties.colors.length > 0 ) {
					/*COLORS*/
					for ( var i = 0, len = properties.colors.length; i < len; ++i ) {
						sprite.material = sprite.material.clone();
						sprite.material.color = new THREE.Color( '#' + properties.colors[i] );
						sprite.position.set( offset, 0, ELEMENT_POSITION );
						sprite.material.needsUpdate = true;
						group.add( sprite.clone() );
						offset += height;
						width += height;
					}
					useDefaultSprite = false;
				}

				/* default, if no color*/
				if ( useDefaultSprite ) {
					sprite.material.color = new THREE.Color( '#000000' );
					group.add( sprite );
					sprite.position.set( offset, 0, ELEMENT_POSITION );
					offset += height;
					width += height;
				}

				/* *************************************** */
				/* PLOT TYPE name  */
				var name = GeometryWrapper.getText( unescape( properties.name ), {
					depthWrite    : false,
					depthTest     : false,
					size          : 11,
					height        : 0,
					font          : 'helvetiker',
					weight        : 'normal',
					style         : 'normal',
					bevelEnabled  : false,
					bevelThickness: 0,
					bevelSize     : 0,
					curveSegments : 6
				} );

				name.geometry.computeBoundingBox();
				var nameWidth = ( name.geometry.boundingBox.max.x - name.geometry.boundingBox.min.x);
				var nameHeight = ( name.geometry.boundingBox.max.y - name.geometry.boundingBox.min.y);
				name.material.color = new THREE.Color( 0x000000 );
				name.position.set( offset, -nameHeight/2, ELEMENT_POSITION );

				group.add( name );
				width += nameWidth;

				if ( properties.pId )
					icon.pid = properties.pId;


				new UTILS.ACTIVITY.MOUSE.Click( $('#'+env.config.container), icon, function ( o ) {
					if ( o.intersection.object === undefined ) return;

					var buffer = bm.getBuffer( o.intersection.object.pid );
					var systemObj = buffer.getAttribute( Config.BUFFER.SYSTEM ).array;
					var system = systemObj[Config.BUFFER.SYSTEM];

					if ( !system ) return;

					var isActive = false;
					var hideArgs = {from: 1, to: 0.1};
					var showArgs = {from: 0.1, to: 1};
					var handle, fadeIcon, fadeSystem;

					if ( o.intersection.object.hasOwnProperty( "legend_item" ) ) {
						isActive = o.intersection.object.legend_item;
					} else {
						o.intersection.object.legend_item = false;
					}

					if ( !isActive ) {
						o.intersection.object.legend_item = true;
						fadeIcon = new Fade().exec( hideArgs, [] ).response;
						handle = new UTILS.ACTIVITY.AnimationHandler( [ fadeIcon ], function () {
							"use strict";
						} );
						handle.exec( o );
						o.intersection.object = system;
						handle.exec( o );

					} else {
						o.intersection.object.legend_item = false;
						fadeIcon = new Fade().exec( showArgs, [] ).response;
						handle = new UTILS.ACTIVITY.AnimationHandler( [fadeIcon], function () {
							"use strict";
						} );
						handle.exec( o );
						o.intersection.object = system;
						handle.exec( o );

					}

				}, this );



				return {
					group: group,
					width: width
				};
			};

			var getLegend = function ( sceneWidth, sceneHeight ) {

				var scene = new THREE.Scene();

				var aspectRatio = sceneWidth / sceneHeight;
				var camera = new THREE.PerspectiveCamera( 40, aspectRatio, 1, 5000 );
				camera.position.set( 0, 0, cameraDistance );


				var visibleWindow = getVisibleWindow( sceneWidth, sceneHeight, camera );
				goldenRatio = UTILS.math().goldenRatio( visibleWindow.width - dragWidth );
				height = visibleWindow.height * 1 / 4;
				var yOffset = ( -visibleWindow.height / 2 ) + height / 2;

				legend_ = new THREE.Object3D();

				/* ******************************************** */
				/* TEXTPLANE - LEGEND */
				textPlaneWidth = goldenRatio.b;
				textPlane = GeometryWrapper.getSurface( textPlaneWidth, height, backgroundColor, 1 );

				textPlane.position.set( 0, 0, BACKGROUND_POSITION );
				legend_.add( textPlane );

				var textOpenOffset = (visibleWindow.width / 2) - (textPlaneWidth / 2) - (dragWidth );
				var textClosedOffset = (visibleWindow.width / 2) + (textPlaneWidth / 2);

				setPositionLegendOpen( textOpenOffset, yOffset, 0 );
				setPositionLegendClosed( textClosedOffset, yOffset, 0 );

				/* ******************************************** */
				/* DRAG TEXTPLANE - LEGEND */
				var textPlaneDrag = GeometryWrapper.getSurface( dragWidth, height, 0x000000, 1 );
				textPlaneDrag.position.set( (-textPlaneWidth / 2) - (dragWidth / 2), 0, BACKGROUND_POSITION );

				legend_.add( textPlaneDrag );

				/* ******************************************** */
				/* textPlaneDrag label */
				var legendLabel = GeometryWrapper.getClickLabel( labelFontWidth, height, 'L e g e n d' );
				legendLabel.geometry.computeBoundingBox();
				var legendLabelBorders = legendLabel.geometry.boundingBox;
				var legendLabelHeight = Math.abs( legendLabelBorders.min.x ) + Math.abs( legendLabelBorders.max.x );
				legendLabelWidth = Math.abs( legendLabelBorders.min.y ) + Math.abs( legendLabelBorders.max.y );
				legendLabel.position.set( (-textPlaneWidth / 2) - (dragWidth / 2) - legendLabelWidth / 4, legendLabelHeight / 2, TEXT_POSITION );

				legend_.add( legendLabel );

				/* ******************************************** */
				/* DRAG INFOPLANE */
				var infoPlaneDrag = GeometryWrapper.getSurface( dragWidth, height, Math.random() * 0xffffff, 1 );
				infoPlaneDrag.position.set( (textPlaneWidth / 2) + (dragWidth / 2), 0, 0 );

				legend_.add( infoPlaneDrag );

				/* ******************************************** */
				/* textPlaneDrag label */
				var infoLabel = GeometryWrapper.getClickLabel( labelFontWidth, height, 'I n f o' );
				infoLabel.geometry.computeBoundingBox();
				var infoLabelBorders = infoLabel.geometry.boundingBox;
				var infoLabelHeight = Math.abs( infoLabelBorders.min.x ) + Math.abs( infoLabelBorders.max.x );
				infoLabelWidth = Math.abs( infoLabelBorders.min.y ) + Math.abs( infoLabelBorders.max.y );

				infoLabel.position.set( (textPlaneWidth / 2) + (dragWidth / 2) - infoLabelWidth / 2, infoLabelHeight / 2, TEXT_POSITION );
				legend_.add( infoLabel );

				/* ******************************************** */
				/* INFOPLANE */


				infoPlaneWidth = goldenRatio.a;

				infoPlane = GeometryWrapper.getSurface( infoPlaneWidth, height, backgroundColor, visible_ );
				infoPlane.position.set( (+textPlaneWidth / 2) + dragWidth + (infoPlaneWidth / 2), 0, BACKGROUND_POSITION );
				legend_.add( infoPlane );

				var infoOpenOffset = (visibleWindow.width / 2) - (textPlaneWidth / 2) - infoPlaneWidth;
				var infoClosedOffset = (visibleWindow.width / 2) + (textPlaneWidth / 2);

				setPositionInfoOpen( infoOpenOffset, yOffset, 0 );
				setPositionInfoClosed( textOpenOffset, yOffset, 0 );

				camera.lookAt( scene.position );

				legend_.position.set( legendPositionClosed_.x, yOffset, BACKGROUND_POSITION );


				setY( yOffset );
				scene.add( camera );
				scene.add( legend_ );

				var $container =  $( '#' + this.env.config.container );

				new UTILS.ACTIVITY.MOUSE.Click( $container,
					textPlaneDrag,
					function ( o ) {
						toggleLegend();
						o.intersection.object.material.color.setHex( dragColor[Math.floor( Math.random() * dragColor.length )] );
					} );

				new UTILS.ACTIVITY.MOUSE.Click( $container,
					infoPlaneDrag,
					function ( o ) {
						toggleInfo();
						o.intersection.object.material.color.setHex( dragColor[Math.floor( Math.random() * dragColor.length )] );
					} );

				var env = this.env;

				return {

					scene    : scene,
					camera   : camera,
					open     : function () {

						moveContainer( legendPositionOpen_, duration_, UTILS.ACTIVITY.RENDERER.EASING.Exponential.Out );
						isLegendOpen_ = !isLegendOpen_;
						if ( !isLegendOpen_ ) {
							isInfoOpen_ = false;
						}
						return this;
					},
					close    : function () {

						moveContainer( legendPositionClosed_, duration_, UTILS.ACTIVITY.RENDERER.EASING.Bounce.Out );
						isLegendOpen_ = !isLegendOpen_;
						return this;
					},
					setY     : setY,
					isVisible: function ( visible ) {
						visible_ = visible;
						return this;
					},
					isOpen   : function ( open ) {
						isLegendOpen_ = open;
						return this;
					},
					addLegendElements  : function ( objects ) {
						return addLegendElements( objects, env );
					},
					addInfoElement : function( text ){
						"use strict";
						return addInfoElement( text, env );
					}
				};
			};

			this.handleConfig = function ( config, env ) {
				env.config = config || {};
			};

			this.handleEnv = function ( env ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};

			this.exec = function ( config, childs, bufferManager ) {
				//console.log("[ legend ] \t\t EXECUTE");
				if ( bufferManager !== undefined ) {
					bm = bufferManager;
				}
				this.env = {};
				this.config = config;
				this.handleConfig( config, this.env );
				this.handleEnv( this.env );
				animation = new UTILS.ACTIVITY.PreparedTween();

				return {
					pId     : this.getId(),
					pType   : this.type,
					response: {
						context : this,
						callback: getLegend
					}
				};

			}

		});
		UTILS.CLASS.extend( Plugin, AbstractPlugin );
		return Plugin;
	} );
