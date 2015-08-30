define(
	[ 'require','./getConfig.vlib', './setConfig.vlib', 'config', 'core/AbstractPlugin.vlib','core/Utils.vlib', 'three', 'jquery'],
	function(require, getConfig, setConfig, Config, AbstractPlugin, UTILS, THREE, $) {
		/**
			TODO<br />
			@class Plugin Axes
			@constructor
			@extends AbstractPlugin
			**/
			var Plugin = (function(state) {
				var name = 'axesCube';
				Plugin.superClass.constuctor.call(this,name);
				Plugin.superClass.setContext.call(this,Config.PLUGINTYPE.CONTEXT_3D);
				Plugin.superClass.setType.call(this,Config.PLUGINTYPE.AXES);
				/** path to plugin-template file * */
				Plugin.superClass.setTemplates.call(this,Config.getPluginPath()+ '/plugins_3d/axesCube/templates.js');
				Plugin.superClass.setIcon.call(this,Config.getPluginPath()+ '/plugins_3d/axesCube/icon.png');
				Plugin.superClass.setAccepts.call(this,{
					predecessors : [ Config.PLUGINTYPE.PLOT ],
					successors : [Config.PLUGINTYPE.COLOR]
				});
				Plugin.superClass.setDescription.call(this,'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]');
				/** ********************************** */
				/** PRIVATE VARIABLES * */
				/** ********************************** */

				var borders = {
					xMin : 'auto',
					yMin : 'auto',
					zMin : 'auto',
					xMax : 'auto',
					yMax : 'auto',
					zMax : 'auto',
					nice : true
				};
				var granularityX = 2;
				var granularityY = 2;
				var granularityZ = 2;

				var xRangeDefault = 'auto';
				var yRangeDefault = 'auto';
				var zRangeDefault = 'auto';
				var defaultFontSize = 20;
				var decimalPlaces = 7;

				/** ********************************** */
				/** PUBLIC VARIABLES * */
				/** ********************************** */
				this.config = null;
				this.labelColor = 0x373530;
				this.numUnitsDefault = 2;

				if(state !== undefined){
					xRange = state.xRange;
					yRange = state.yRange;
					zRange = state.zRange;
					this.config = state.config;
					this.labelColor = state.labelColor;

				}
				/** ********************************** */
				/** PUBLIC METHODS * */
				/** ********************************** */
				this.deepCopy = function(){
					var privates = undefined;
					return new Plugin(/* privates */);
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
				 this.getConfigCallback = getConfig;
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
				 this.handleEnv = function( env, config, bufferManager ){
				 	env.context = this;
				 	env.accepts = this.getAccepts();
				 	env.id = this.getId();
				 	env.name = this.getName();
				 	env.icon = this.getIcon();
				 }
				 this.handleConfig = function( config, env ){
				 	var defaultConfig = {
				 		labels:{x:'x',y:'y',z:'z'},
				 		range:{
				 			x:xRangeDefault,
				 			y:yRangeDefault,
				 			z:zRangeDefault
				 		},
				 		mantissa:{x:2,y:2,z:2},
				 		fontSize : defaultFontSize,
				 		raster:{
				 			xy:{show:false,opacity:0.2},
				 			xz:{show:false,opacity:0.2},
				 			yz:{show:false,opacity:0.2}
				 		}
				 	};
				 	env.config = config || defaultConfig;

				 	if (env.config.numUnits === null || env.config.numUnits === undefined) {
				 		env.config.numUnits = {x:env.numUnitsDefault,y:env.numUnitsDefault,z:env.numUnitsDefault};
				 	}
				 	if(env.config.numUnits.x === undefined){
				 		env.config.numUnits.x = env.numUnitsDefault;
				 	}
				 	if(env.config.numUnits.y === undefined){
				 		env.config.numUnits.y = env.numUnitsDefault;
				 	}
				 	if(env.config.numUnits.z === undefined){
				 		env.config.numUnits.z = env.numUnitsDefault;
				 	}
				 	if(env.config.numUnits.nice === undefined){
				 		env.config.numUnits.nice = true;
				 	}

				 	if (env.config.fontSize === undefined) {
				 		env.config.fontSize = defaultFontSize;
				 	}

				 	if (env.config.mantissa === null || env.config.mantissa === undefined) {
				 		env.config.mantissa = {x:2,y:2,z:2};
				 	}
				 	if(env.config.mantissa.x === undefined){
				 		env.config.mantissa.x = 2;
				 	}
				 	if(env.config.mantissa.y === undefined){
				 		env.config.mantissa.y = 2;
				 	}
				 	if(env.config.mantissa.z === undefined){
				 		env.config.mantissa.z =2;
				 	}

				 	/* set labels */
				 	if (env.config.labels !== undefined) {
				 		xLabel = env.config.labels.x === undefined ? 'x'
				 		: env.config.labels.x;
				 		yLabel = env.config.labels.y === undefined ? 'y'
				 		: env.config.labels.y;
				 		zLabel = env.config.labels.z === undefined ? 'z'
				 		: env.config.labels.z;
				 	}

				 	/*set range*/
				 	if (env.config.range !== undefined) {

				 		/* min values */
				 		borders.xMin = env.config.range.xMin === undefined ? xRangeDefault
				 		: env.config.range.xMin;
				 		borders.yMin = env.config.range.yMin === undefined ? yRangeDefault
				 		: env.config.range.yMin;
				 		borders.zMin = env.config.range.zMin === undefined ? zRangeDefault
				 		: env.config.range.zMin;
				 		/* max values */
				 		borders.xMax = env.config.range.xMax === undefined ? xRangeDefault
				 		: env.config.range.xMax;
				 		borders.yMax = env.config.range.yMax === undefined ? yRangeDefault
				 		: env.config.range.yMax;
				 		borders.zMax = env.config.range.zMax === undefined ? zRangeDefault
				 		: env.config.range.zMax;
				 		borders.nice = env.config.numUnits.nice;

				 	}

				 	/*set raster*/
				 	if(env.config.raster === undefined){
				 		env.config.raster = {
				 			xy:{show:false},
				 			xz:{show:false},
				 			yz:{show:false}
				 		};
				 	}

				 	if(env.config.heatmapRange === undefined){
				 		env.config.heatmapRange = false;
				 	}

				 }
				 this.exec = function(config, childs) {
				 	console.log("[ plugin ][ axes ] \t\t EXECUTE "+JSON.stringify(config));

				 	var env = {};
				 	this.handleEnv( env );
				 	this.handleConfig( config, env );
				 	this.config = env.config;
				 	/** *********************************** * */
				 	/** HANDLE SUCCESSOR PLUGINGS * */
				 	/** *********************************** * */
				 	var child = undefined;
				 	for ( var i = 0; i < childs.length; ++i) {
				 		child = childs[i];
				 		if(child !== undefined && child.pType !== undefined){
				 			if($.inArray(child.pType, this.accepts.successors) != -1){
				 				switch(child.pType){
				 					case Config.PLUGINTYPE.COLOR:
				 					this.labelColor = '#'+child.response.color;
				 					break;
				 				}
				 			}
				 		}else{
				 			console.log("pType of child plugin not set!");
				 		}
				 	}


				 	return {
				 		pId : this.getId(),
				 		pType : this.type,
				 		response : {
							// callback
							'callback' : getAxes,
							'context' : this,
							'borders' : JSON.parse( JSON.stringify( borders ) )
						}
					};

				}

				/** ********************************** */
				/** PRIVATE METHODS * */
				/** ********************************** */
				/*
				* @param b
				*	borders set by user
				* @param db
				*	calculated data-borders
				*/
				var getAxes = function( env ) {

					var result = [];


					/* add axes geometry */
					var cubeElements = createCube( env.scale.x, env.scale.y, env.scale.z, this.labelColor, 4 );
					result = result.concat(cubeElements);

					/* add tick labels */
					var tick;
					if( true === this.config.numUnits.nice ){
						tick = UTILS.nice().loose(true);
					}else{
						tick = UTILS.interpolate();
					}
					var tickLabelArray = createTickLabels(tick,this.config,env.borders, env.scale, this.labelColor);
					for( var i = 0, len = tickLabelArray.length; i < len;++i ){
						result.push(tickLabelArray[i]);
					}
					/* show heatmap ? */
					if( true/*this.config.heatmapRange*/){
						var heatmap,offset = 0, padding = 10;
						for(var i = 0; i < env.heatmaps.length; ++i){
							heatmap = createHeatmap(this.config,env.scale,env.heatmaps[ i ]);
							heatmap[ 0 ].position.x = parseInt(env.scale.x) + offset + padding;
							result.push(heatmap[ 0 ]);
							offset += heatmap[ 1 ];
						}
					}

					return result;
				}

				var createTickLabels = function(tick, config, borders, scale, color){
					var result = [];
					var labelWidth =0;
					var labelHeight = parseInt(config.fontSize) + 10;
					var nicePosObject, nicePosArray, scaler, landmark;
					/* x-labels*/
					if(scale.x > 0){

						nicePosObject = tick.search(borders.xMin,borders.xMax,config.numUnits.x);
						nicePosObject.mantissa(config.mantissa.x);
						nicePosArray = nicePosObject.toArray();
						scaler = UTILS.scale();
						scaler.range([0,scale.x]);
						scaler.domain([nicePosObject.min,nicePosObject.max]);
						var coords = scaler.linear(nicePosArray);

						for(var i=0, len = coords.length; i < len;++i){
							labelWidth = nicePosArray[i].toString().length * (config.fontSize / 2);
							/* label x*/
							result.push(getLabel( nicePosArray[i],
							{
								x : coords[i],
								y : -labelHeight ,
								z : 0
							},
							labelWidth, labelHeight, color, config.fontSize,false ));
							/* landmark x*/
							landmark =  createCylinder(
								new THREE.Vector3( coords[i], 0, 0 ),
								new THREE.Vector3( coords[i], 10, 0 ),
								color,1);
							landmark.position.x = coords[i];
							result.push(landmark);
							landmark =  landmark.clone();
							landmark.position.y = scale.y -5;
							result.push(landmark);
						}
					}
					/* y-labels*/
					if(scale.y > 0){
						nicePosObject = tick.search(borders.yMin,borders.yMax,config.numUnits.y);
						nicePosObject.mantissa(config.mantissa.y);
						nicePosArray = nicePosObject.toArray();
						scaler = UTILS.scale();
						scaler.range([0,scale.y]);
						scaler.domain([nicePosObject.min,nicePosObject.max]);
						coords = scaler.linear(nicePosArray);
						for(var i=0, len = coords.length; i < len;++i){
							labelWidth = nicePosArray[i].toString().length * (config.fontSize / 2);
							/* label y*/
							result.push(getLabel( nicePosArray[i],
							{
								x : -labelWidth /2 ,
								y : coords[i],
								z : 0
							},
							labelWidth, labelHeight, color, config.fontSize,false ));
							/* landmark y*/
							landmark =  createCylinder(
								new THREE.Vector3( 0,coords[i], 0 ),
								new THREE.Vector3( 10, coords[i], 0 ),
								color,1);
							landmark.position.y = coords[i];
							result.push(landmark);
							landmark =  landmark.clone();
							landmark.position.x = scale.x -5;
							result.push(landmark);
						}
					}
					/* z-labels*/
					if(scale.z > 0){
						nicePosObject = tick.search(borders.zMin,borders.zMax,config.numUnits.z);
						nicePosObject.mantissa(config.mantissa.z);
						nicePosArray = nicePosObject.toArray();
						scaler = UTILS.scale();
						scaler.range([0,scale.z]);
						scaler.domain([nicePosObject.min,nicePosObject.max]);
						coords = scaler.linear(nicePosArray);
						for(var i=0, len = coords.length; i < len;++i){
							labelWidth = nicePosArray[i].toString().length * (config.fontSize / 2);
							/* label z*/
							result.push(getLabel( nicePosArray[i],
							{
								x : -labelWidth /2,
								y : -labelHeight /2,
								z :  coords[i]
							}, labelWidth, labelHeight, color, config.fontSize,false ));
							/* landmark z*/
							landmark =  createCylinder(
								new THREE.Vector3( 0,0,coords[i] ),
								new THREE.Vector3( 10,0,coords[i] ),
								color,1);
							landmark.position.z = coords[i];
							result.push(landmark);
							landmark =  landmark.clone();
							landmark.position.x = scale.x -5;
							result.push(landmark);
						}
					}
					return result;
				}

				var createCube = function(dimX,dimY,dimZ,color,width){
					// var geometry = new THREE.BoxGeometry( dimX, dimY, dimZ );
					// var mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
					// 	transparent:true,
					// 	opacity:0,
					// 	depthWrite: false,
					// 	depthTest: false
					// }));
					// mesh.position.set(dimX/2,dimY/2,dimZ/2);
					// var cube = new THREE.EdgesHelper( mesh, color );
					// cube.material.linewidth = width;
					// cube.position.set(dimX/2,dimY/2,dimZ/2);
					// return [ cube, mesh ];

					var result = [];

					var lineX1 = createCylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( dimX, 0, 0 ),color);
					var lineX2 = lineX1.clone();
					lineX2.position.y = dimY;
					var lineX3 = lineX1.clone();
					lineX3.position.z = dimZ;
					var lineX4 = lineX3.clone();
					lineX4.position.y = dimY;

					var lineY1 = createCylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, dimY, 0 ),color);
					var lineY2 = lineY1.clone();
					lineY2.position.x = dimX;
					var lineY3 = lineY1.clone();
					lineY3.position.z = dimZ;
					var lineY4 = lineY3.clone();
					lineY4.position.x = dimX;


					var lineZ1 = createCylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, dimZ ),color);
					var lineZ2 = lineZ1.clone();
					lineZ2.position.x = dimX;
					var lineZ3 = lineZ1.clone();
					lineZ3.position.y = dimY;
					var lineZ4 = lineZ3.clone();
					lineZ4.position.x = dimX;

					result.push( lineX1 );
					result.push( lineX2 );
					result.push( lineX3 );
					result.push( lineX4 );

					result.push( lineY1 );
					result.push( lineY2 );
					result.push( lineY3 );
					result.push( lineY4 );

					result.push( lineZ1 );
					result.push( lineZ2 );
					result.push( lineZ3 );
					result.push( lineZ4 );



					return result;

				}
				var createHeatmap = function(axesConfig,scale,heatmapConfig){
					var heatmapWidth = 10;
					var offset = 5;
					var heatmap = createCylinder(
						new THREE.Vector3( scale.x ,0, 0 ),
						new THREE.Vector3( scale.x , scale.y, 0 ),
						'#ffffff',
						heatmapWidth);
					var xPos = parseInt(scale.x)+10;
					var yPos = parseInt(scale.y);
					var labelHeight = parseInt(axesConfig.fontSize) + 10;
					var hmStart = new THREE.Color('#'+heatmapConfig.spectrum.from);
					var hmEnd = new THREE.Color('#'+heatmapConfig.spectrum.to);
					var colors = heatmap.geometry.colors;

					for(var i = 0, len = heatmap.geometry.vertices.length; i < len; ++i){
						if(i < len / 2){
							heatmap.geometry.colors[i] = hmStart;
						}else{
							heatmap.geometry.colors[i] = hmEnd;
						}
					}
					var faceIndices = [ 'a', 'b', 'c', 'd' ];/* face indices as chars */
					var vertexIndex,numberOfSides;
					for ( var i = 0,len = heatmap.geometry.faces.length; i < len; ++i) {
						face = heatmap.geometry.faces[i];
						numberOfSides = (face instanceof THREE.Face3) ? 3 : 4;
						for ( var j = 0; j < numberOfSides; j++) {
							vertexIndex = face[faceIndices[j]];
							face.vertexColors[j] = heatmap.geometry.colors[vertexIndex];
						}
					}
					heatmap.geometry.dynamic = true;
					heatmap.geometry.verticesNeedUpdate = true;
					heatmap.geometry.colorsNeedUpdate = true;
					heatmap.geometry.buffersNeedUpdate = true;


					/*getLabel: text, x, y, z, w, h,color, fontSize*/
					var lwFrom  = heatmapConfig.numberRange.from.toString().length * (axesConfig.fontSize / 2);
					var lwTo  = heatmapConfig.numberRange.to.toString().length * (axesConfig.fontSize / 2);
					var labelWidth = lwTo > lwFrom ? lwTo : lwFrom;
					labelWidth = labelWidth < 30 ? 30 : labelWidth; /* minimal padding to avoid overlap*/

					var labelFrom = getLabel(
						heatmapConfig.numberRange.from,
						{
							x : offset + heatmapWidth + labelWidth/2,
							y : 0,
							z : 0
						},
						labelWidth,
						labelHeight,
						'#'+heatmapConfig.spectrum.from,
						axesConfig.fontSize,
						true);


					var labelTo = getLabel(
						offset + heatmapConfig.numberRange.to,
						{
							x : heatmapWidth + labelWidth/2,
							y : yPos ,
							z : 0
						},
						labelWidth,
						labelHeight,
						'#'+heatmapConfig.spectrum.to,
						axesConfig.fontSize,
						true);

					var group = new THREE.Object3D();
					group.add(heatmap);
					group.add(labelFrom);
					group.add(labelTo);

					return [ group, (offset + labelWidth + heatmapWidth +10) ];
				}
				var createCylinder = function(from, to, color,diameter){

					var vstart = from.clone();
					var vend = to.clone();
					var HALF_PI = Math.PI * .5;
					var distance = vstart.distanceTo(vend);
					var position  = vend.clone().add(vstart).divideScalar(2);
					var d = (diameter === undefined) ? 2 : diameter;

					var material = new THREE.MeshBasicMaterial({
						color : color,
						vertexColors : THREE.VertexColors,
						side : THREE.DoubleSide,
						depthWrite: true,
						depthTest: true,
						shininess: 50,
						ambient : 0xff0000,
						reflectivity: 1.0,
						refractionRatio: 0.5

					});
					var cylinder = new THREE.CylinderGeometry(d,d,distance,10,1,true);

					var orientation = new THREE.Matrix4();
					var offsetRotation = new THREE.Matrix4();
					var offsetPosition = new THREE.Matrix4();
					orientation.lookAt(vstart,vend,new THREE.Vector3(0,1,0));
					offsetRotation.makeRotationX(HALF_PI);
					orientation.multiply(offsetRotation);
					cylinder.applyMatrix(orientation);

					var mesh = new THREE.Mesh(cylinder,material);
					mesh.position.x = (vend.x - vstart.x)/2;
					mesh.position.y = (vend.y - vstart.y)/2;
					mesh.position.z = (vend.z - vstart.z)/2;
					return mesh;
				}
				var getLine = function(from, to, lineWidth,c) {

					var geometry = new THREE.Geometry();
					geometry.vertices.push(from, to);

					return new THREE.Line(geometry, new THREE.LineBasicMaterial( {
						color: c === undefined ? 0x505050 : c,
						dashSize: 10,
						gapSize: 10,
						linewidth: lineWidth === undefined ? 1 : lineWidth,
					} ), THREE.LinePieces );

				}
				var getLabel = function(text, coord, w, h, color, fontSize, staticLabel) {


					var c = typeof color == 'undefined' ? "rgba(0, 0, 0, 0.5)" : color;
					var fs = typeof fontSize == 'undefined' ? defaultFontSize : fontSize;
					staticLabel = staticLabel === undefined ?  false : staticLabel;

					/* create a canvas element*/
					var canvas = document.createElement('canvas');
					var context = canvas.getContext('2d');

					canvas.width = w + 10;
					canvas.height = h ;
					 /*context.fillStyle = "#CC5422";
					 context.fillRect(0,0,w,h);*/
					 context.textBaseline = 'middle';
					 context.font = fs + "px Arial";
					 context.fillStyle = c;
					 context.fillText(text, 0, fs);

					 var texture = new THREE.Texture(canvas)
					 texture.needsUpdate = true;

					 var label;
					 if(staticLabel){
					 	label = getStaticLabel(texture,coord,w,h);
					 }else{
					 	label = getDynamicLabel(texture,coord,w,h);
					 }


					 label.position.set(coord.x, coord.y, coord.z);
					 return label;
					}
					var getStaticLabel = function(texture, coord, w, h){

						var planeMaterial = new THREE.MeshBasicMaterial({
							map : texture,
							side : THREE.DoubleSide,
							transparent : true
						});

						var textMesh = new THREE.Mesh(new THREE.PlaneGeometry(
							w, h), planeMaterial);

						return textMesh;
					}
					var getDynamicLabel = function(texture, coord, w, h){
						var spriteMaterial = new THREE.SpriteMaterial({
							map: texture,
							fog : true
						} );
						var sprite = new THREE.Sprite( spriteMaterial );
						sprite.scale.set(w,h,1.0);
						return sprite;
					}

				});
UTILS.CLASS.extend(Plugin,AbstractPlugin);
return Plugin;
});
