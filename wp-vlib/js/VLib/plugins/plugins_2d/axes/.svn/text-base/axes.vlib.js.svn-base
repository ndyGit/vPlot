define(
	[ 'require', 'config', 'three', 'jquery'/*, 'three_font_helveticer'*/ ],
	function(require, Config, THREE, $) {

		var plugin = (function(state) {
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var xLabel = 'x';
			var yLabel = 'y';
			var zLabel = 'z';
			var xRange = 'auto';
			var yRange = 'auto';
			var zRange = 'auto';
			var granularityX = 2;
			var granularityY = 2;
			var granularityZ = 2;

			var xRangeDefault = 'auto';
			var yRangeDefault = 'auto';
			var zRangeDefault = 'auto';
			var fontSize = 20;
			var decimalPlaces = 7;

			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */
			this.config = null;
			this.labelColor = null;
			this.numUnitsDefault = 2;

			this.context = Config.PLUGINTYPE.CONTEXT_3D;
			this.type = Config.PLUGINTYPE.AXES;
			/** unique plugin name * */
			this.name = 'axes';

			/** path to plugin-template file * */
			this.templates = Config.absPlugins
			+ '/plugins_3d/axes/templates.js';
			this.icon = Config.absPlugins + '/plugins_3d/axes/icon.png';
			this.accepts = {
				predecessors : [ Config.PLUGINTYPE.PLOT ],
				successors : [Config.PLUGINTYPE.COLOR]
			}
			this.description = 'Requires: [ '+this.accepts.predecessors.join(', ')+' ] Accepts: [ '+this.accepts.successors.join(', ')+' ]';
			if(state !== undefined){
				xLabel = state.xLabel;
				yLabel = state.yLabel;
				zLabel = state.zLabel;
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
				var privates = {
					xLabel : xLabel,
					yLabel : yLabel,
					zLabel : zLabel,
					xRange : xRange,
					yRange : yRange,
					zRange : zRange,
					config : this.config,
					labelColor : this.labelColor
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
				 	var x = $('#' + containerId + ' > form input[id=xLabel]')
				 	.val();
				 	var y = $('#' + containerId + ' > form input[id=yLabel]')
				 	.val();
				 	var z = $('#' + containerId + ' > form input[id=zLabel]')
				 	.val();

				 	xRange = $('#' + containerId + ' #xRange').val();

				 	yRange = $('#' + containerId + ' #yRange').val();

				 	zRange = $('#' + containerId + ' #zRange').val();

				 	granularityX = $('#' + containerId + ' #granularity-x').val();
				 	granularityY = $('#' + containerId + ' #granularity-y').val();
				 	granularityZ = $('#' + containerId + ' #granularity-z').val();

				 	var result = {
				 		labels : {
				 			'x' : x === "" ? xLabel : x,
				 			'y' : y === "" ? yLabel : y,
				 			'z' : z === "" ? zLabel : z
				 		},
				 		range : {
				 			'x' : xRange === "" ? "auto" : xRange,
				 			'y' : yRange === "" ? "auto" : yRange,
				 			'z' : zRange === "" ? "auto" : zRange
				 		},
				 		numUnits : {
				 			'x' : granularityX,
				 			'y' : granularityY,
				 			'z' : granularityZ,
				 		}
				 	};
				 	console
				 	.log("[ axes ][getConfig] "
				 		+ JSON.stringify(result));
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
				 	console
				 	.log("[ axes ][setConfig] "
				 		+ JSON.stringify(config));
				 	if (config == "" || config === undefined)
				 		config = {
				 			labels : '',
				 			range : '',
				 			numUnits : {}
				 		};
				 		if (!config.hasOwnProperty('labels'))
				 			config.labels = '';
				 		if (!config.hasOwnProperty('range'))
				 			config.range = '';

				 		if (config.labels.x != undefined) {
				 			$('#' + containerId + ' > form input[id=xLabel]').val(
				 				config.labels.x);
				 		} else {
				 			$('#' + containerId + ' > form input[id=xLabel]').val(
				 				xLabel);
				 		}
				 		if (config.labels.y != undefined) {
				 			$('#' + containerId + ' > form input[id=yLabel]').val(
				 				config.labels.y);
				 		} else {
				 			$('#' + containerId + ' > form input[id=yLabel]').val(
				 				yLabel);
				 		}
				 		if (config.labels.z != undefined) {
				 			$('#' + containerId + ' > form input[id=zLabel]').val(
				 				config.labels.z);
				 		} else {
				 			$('#' + containerId + ' > form input[id=zLabel]').val(
				 				zLabel);
				 		}
				 		if (config.range.x != undefined) {
				 			$('#' + containerId + ' #xRange').val(config.range.x);
				 		} else {
				 			$('#' + containerId + ' #xRange').val(xRangeDefault);
				 		}
				 		if (config.range.y != undefined) {
				 			$('#' + containerId + ' #yRange').val(config.range.y);
				 		} else {
				 			$('#' + containerId + ' #yRange').val(yRangeDefault);
				 		}
				 		if (config.range.z != undefined) {
				 			$('#' + containerId + ' #zRange').val(config.range.z);
				 		} else {
				 			$('#' + containerId + ' #zRange').val(zRangeDefault);
				 		}
				 		if (config.numUnits !== undefined) {
				 			if (config.numUnits.x !== undefined) {
				 				$('#' + containerId ).find(' #granularity-x').val(config.numUnits.x);
				 			} else {
				 				$('#' + containerId ).find(' #granularity-x').val(this.numUnitsDefault);
				 				config.numUnits.x = this.numUnitsDefault;
				 			}
				 			if (config.numUnits.y !== undefined) {
				 				$('#' + containerId ).find(' #granularity-y').val(config.numUnits.y);
				 			} else {
				 				$('#' + containerId ).find(' #granularity-y').val(this.numUnitsDefault);
				 				config.numUnits.y = this.numUnitsDefault;
				 			}
				 			if (config.numUnits.z !== undefined) {
				 				$('#' + containerId ).find(' #granularity-z').val(config.numUnits.z);
				 			} else {
				 				$('#' + containerId ).find(' #granularity-z').val(this.numUnitsDefault);
				 				config.numUnits.z = this.numUnitsDefault;
				 			}
				 		}else{
				 			config.numUnits = {};
				 			config.numUnits.x  = this.numUnitsDefault;
				 			config.numUnits.y  = this.numUnitsDefault;
				 			config.numUnits.z  = this.numUnitsDefault;

				 		}

				 		// slider
				 		$('#' + containerId ).find(' #granularitySliderX').slider({
				 			orientation: "horizontal",
				 			range: "min",
				 			min: 0,
				 			max: 13,
				 			value: config.numUnits.x,
				 			slide: function (event, ui) {
				 				$('#' + containerId + ' #granularity-x').val(ui.value);
				 			}
				 		});
				 		$('#' + containerId ).find(' #granularitySliderY').slider({
				 			orientation: "horizontal",
				 			range: "min",
				 			min: 0,
				 			max: 13,
				 			value: config.numUnits.y,
				 			slide: function (event, ui) {
				 				$('#' + containerId + ' #granularity-y').val(ui.value);
				 			}
				 		});
				 		$('#' + containerId ).find(' #granularitySliderZ').slider({
				 			orientation: "horizontal",
				 			range: "min",
				 			min: 0,
				 			max: 13,
				 			value: config.numUnits.z,
				 			slide: function (event, ui) {
				 				$('#' + containerId + ' #granularity-z').val(ui.value);
				 			}
				 		});
				 	}

				 	this.exec = function(config, childs) {
				 		console.log("[ plugin ][ axes ] \t\t EXECUTE");
				 		this.config = config;
				 		if(this.config == '' || this.config === null || this.config === undefined){
				 			this.config = {
				 				labels:{x:'x',y:'y',z:'z'},
				 				range:{x:xRangeDefault,y:yRangeDefault,z:zRangeDefault}
				 			};
				 		}
				 		if (this.config.numUnits === null
				 			|| this.config.numUnits === undefined) {
				 			this.config.numUnits = {x:this.numUnitsDefault,y:this.numUnitsDefault,z:this.numUnitsDefault};
				 	}
				 	if(this.config.numUnits.x === undefined){
				 		this.config.numUnits.x = this.numUnitsDefault;
				 	}
				 	if(this.config.numUnits.y === undefined){
				 		this.config.numUnits.y = this.numUnitsDefault;
				 	}
				 	if(this.config.numUnits.z === undefined){
				 		this.config.numUnits.z = this.numUnitsDefault;
				 	}
					/*
					 * HANDLE CONFIG
					 */
					// set labels
					if (config.labels !== undefined) {
						xLabel = config.labels.x === undefined ? 'x'
						: config.labels.x;
						yLabel = config.labels.y === undefined ? 'y'
						: config.labels.y;
						zLabel = config.labels.z === undefined ? 'z'
						: config.labels.z;
					}
					// set range
					if (config.range !== undefined) {
						xRange = config.range.x === undefined ? xRangeDefault
						: config.range.x;
						yRange = config.range.y === undefined ? yRangeDefault
						: config.range.y;
						zRange = config.range.z === undefined ? zRangeDefault
						: config.range.z;
					}
					/** *********************************** * */
					/** HANDLE SUCCESSOR PLUGINGS * */
					/** *********************************** * */
					var child;
					for ( var i = 0; i < childs.length; ++i) {
						child = childs[i];

						if(child !== undefined && child.pType !== undefined){
							if($.inArray(child.pType, this.accepts.successors) != -1){
								switch(child.pType){
									case Config.PLUGINTYPE.COLOR:
									colorCallback = child.response.callback;
									colorContext = child.response.context;
									if(child.response.heatmap !== undefined){
										this.labelColor = '#'+child.response.color;
									}
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
					// 				this.labelColor = '#'+childs[i][key].color;
					// 			}
					// 		}
					// 	}
					// }
					return {
						pType : this.type,
						response : {
							// callback
							'callback' : getAxes,
							'context' : this,
							'rangeX' : xRange,
							'rangeY' : yRange,
							'rangeZ' : zRange
						}
					};

				}

				/** ********************************** */
				/** PRIVATE METHODS * */
				/** ********************************** */
				var getAxes = function(dataArray, dataPositionArray, x, y, z,
					xRange, yRange, zRange) {
					var result = [];
					/*
					 * add axes
					 */
					 var lineX = getLine(new THREE.Vector3(0, 0, 0),
					 	new THREE.Vector3(x, 0, 0));
					 var lineY = getLine(new THREE.Vector3(0, 0, 0),
					 	new THREE.Vector3(0, y, 0));
					 var lineZ = getLine(new THREE.Vector3(0, 0, 0),
					 	new THREE.Vector3(0, 0, z));

					 var lineXNeg = getLine(new THREE.Vector3(0, 0, 0),
					 	new THREE.Vector3(-x, 0, 0));
					 var lineYNeg = getLine(new THREE.Vector3(0, 0, 0),
					 	new THREE.Vector3(0, -y, 0));
					 var lineZNeg = getLine(new THREE.Vector3(0, 0, 0),
					 	new THREE.Vector3(0, 0, -z));

					 result.push(lineX);
					 result.push(lineY);
					 result.push(lineZ);

					 result.push(lineXNeg);
					 result.push(lineYNeg);
					 result.push(lineZNeg);

					/*
					 * add description
					 */
					 var w, h;
					 w = (xLabel.length) * (fontSize / 2);
					 h = fontSize + 5;
					 var labelX = getLabel(xLabel, x, -h, 0, w, h,this.labelColor);
					 w = (yLabel.length) * (fontSize / 2);
					 var labelY = getLabel(yLabel, -h/2, y+fontSize, 0, w, h,this.labelColor);
					 w = (zLabel.length) * (fontSize / 2);
					 var labelZ = getLabel(zLabel, -h / 2, -h, z, w, h,this.labelColor);

					 result.push(labelX);
					 result.push(labelY);
					 result.push(labelZ);



					/***********************************************************
					 * LABELING
					 */
					// -2 due to seperate push of "0" and "max" labels
					var numIntermedateUnitsX = parseInt(this.config.numUnits.x -2);
					var numIntermedateUnitsY = parseInt(this.config.numUnits.y -2);
					var numIntermedateUnitsZ = parseInt(this.config.numUnits.z -2);


					/***************************
					 * add range values to x
					 */

					// add zero value
					if(this.config.numUnits.x > 0 || this.config.numUnits.y > 0 || this.config.numUnits.z > 0){
						var wx = "0".toString().length * (fontSize / 2);
						result.push(getLabel(0, 0, -h / 2, 0, wx, h));
					}
					// add max value
					if(this.config.numUnits.x >=2){

						var dx = xRange;
						var wx = dx.toString().length * (fontSize / 2);
						result.push(getLabel(dx, x, -h / 2, 0, wx, h));
						// push guideline
						result.push(getLine(
							new THREE.Vector3(x, 0, 0),
							new THREE.Vector3(x, 6, 0)));

					}
					// add min value
					if(this.config.numUnits.x >=2){
						var dx = xRange * -1;
						var wx = dx.toString().length * (fontSize / 2);
						var posXMin = x * -1;
						result.push(getLabel(dx, posXMin, -h / 2, 0, wx, h));
					// push guideline
					result.push(getLine(
						new THREE.Vector3(posXMin, 0, 0),
						new THREE.Vector3(posXMin, 6, 0)));
				}
					// add intermediate positive values
					if(this.config.numUnits.x >2){
						var stepValue = parseFloat((xRange / (numIntermedateUnitsX + 1))
							.toFixed(2));

						var stepRange = x / (numIntermedateUnitsX + 1);
						var dx = 0;
						var xPos = 0;
						for ( var i = 1; i <= numIntermedateUnitsX; ++i) {
							// push value
							dx += stepValue;
							dx = parseFloat(dx.toFixed(decimalPlaces));
							var wx = dx.toString().length * (fontSize / 2);
							xPos += stepRange;

							var label = getLabel(dx, xPos, -h / 2, 0, wx, h);
							result.push(label);
							// push guideline
							result.push(getLine(
								new THREE.Vector3(xPos, 0, 0),
								new THREE.Vector3(xPos, 6, 0)));
						}
						// add intermediate negative values
						var stepValue = parseFloat((xRange / (numIntermedateUnitsX + 1))
							.toFixed(2));

						var stepRange = x / (numIntermedateUnitsX + 1);
						var dx = 0;
						var xPos = 0;
						for ( var i = 1; i <= numIntermedateUnitsX; ++i) {
							dx -= stepValue;
							dx = parseFloat(dx.toFixed(decimalPlaces));
							var wx = dx.toString().length * (fontSize / 2);
							xPos -= stepRange;

							var label = getLabel(dx, xPos, -h / 2, 0, wx, h);
							result.push(label);
							// push guideline
							result.push(getLine(
								new THREE.Vector3(xPos, 0, 0),
								new THREE.Vector3(xPos, 6, 0)));
						}
					}
					/***************************
					 * add range values to y
					 */

					// add max value
					if(this.config.numUnits.y >= 2){
						var dy = yRange;
						var wy = dy.toString().length * (fontSize / 2);
						result.push(getLabel(dy,-h / 2, y, 0, wy, h));
						// push guideline
						result.push(getLine(
							new THREE.Vector3(0, y, 0),
							new THREE.Vector3(6, y, 0)));
					}
					// add min value
					if(this.config.numUnits.y >= 2){
						var dy = yRange * -1;
						var wy = dy.toString().length * (fontSize / 2);
						result.push(getLabel(dy, -h / 2, y * -1, 0, wy, h));
					}

					// add intermediate positive values
					if(this.config.numUnits.y > 2){
						var stepValue = parseFloat((yRange / (numIntermedateUnitsY + 1))
							.toFixed(2));

						var stepRange = y / (numIntermedateUnitsY + 1);
						var dy = 0;
						var yPos = 0;
						for ( var i = 1; i <= numIntermedateUnitsY; ++i) {
							dy += stepValue;
							dy = parseFloat(dy.toFixed(decimalPlaces));
							var wy = dy.toString().length * (fontSize / 2);
							yPos += stepRange;

							var label = getLabel(dy, -h / 2, yPos, 0, wy, h);
							result.push(label);
							// push guideline
							result.push(getLine(
								new THREE.Vector3(0, yPos, 0),
								new THREE.Vector3(6, yPos, 0)));
						}
						// add intermediate negative values
						var stepValue = parseFloat((yRange / (numIntermedateUnitsY + 1))
							.toFixed(2));

						var stepRange = y / (numIntermedateUnitsY + 1);
						var dy = 0;
						var yPos = 0;
						for ( var i = 1; i <= numIntermedateUnitsY; ++i) {
							dy -= stepValue;
							dy = parseFloat(dy.toFixed(decimalPlaces));
							var wy = dy.toString().length * (fontSize / 2);
							yPos -= stepRange;

							var label = getLabel(dy, -h / 2, yPos, 0, wy, h);
							result.push(label);
							// push guideline
							result.push(getLine(
								new THREE.Vector3(0, yPos, 0),
								new THREE.Vector3(6, yPos, 0)));
						}
					}
					/***************************
					 * add range values to z
					 */

					// add max value
					if(this.config.numUnits.z >= 2){
						var dz = zRange;
						var wz = dz.toString().length * (fontSize / 2);
						result.push(getLabel(dz,-h / 2, 0,z, wz, h));
						// push guideline
						result.push(getLine(
							new THREE.Vector3(0, 0, z),
							new THREE.Vector3(6, 0, z)));
					}
					// add min value
					if(this.config.numUnits.z >= 2){
						var dz = zRange * -1;
						var wz = dz.toString().length * (fontSize / 2);
						result.push(getLabel(dz, -h / 2, 0, z*-1, wz, h));
						// push guideline
						result.push(getLine(
							new THREE.Vector3(0, 0, z*-1),
							new THREE.Vector3(6, 0, z*-1)));
					}
					// add intermediate positive values
					if(this.config.numUnits.z > 2){
						var stepValue = parseFloat((zRange / (numIntermedateUnitsZ + 1))
							.toFixed(2));

						var stepRange = z / (numIntermedateUnitsZ + 1);
						var dz = 0;
						var zPos = 0;
						for ( var i = 1; i <= numIntermedateUnitsZ; ++i) {
							dz += stepValue;
							dz = parseFloat(dz.toFixed(decimalPlaces));
							var wz = dz.toString().length * (fontSize / 2);
							zPos += stepRange;

							var label = getLabel(dz, -h / 2, 0, zPos, wz, h);
							result.push(label);
							// push guideline
							result.push(getLine(
								new THREE.Vector3(0, 0, zPos),
								new THREE.Vector3(6, 0, zPos)));
						}
						// add intermediate negative values
						var stepValue = parseFloat((zRange / (numIntermedateUnitsZ + 1))
							.toFixed(2));

						var stepRange = z / (numIntermedateUnitsZ + 1);
						var dz = 0;
						var zPos = 0;
						for ( var i = 1; i <= numIntermedateUnitsZ; ++i) {
							dz -= stepValue;
							dz = parseFloat(dz.toFixed(decimalPlaces));
							var wz = dz.toString().length * (fontSize / 2);
							zPos -= stepRange;

							var label = getLabel(dz, -h / 2, 0, zPos, wz, h);
							result.push(label);
							// push guideline
							result.push(getLine(
								new THREE.Vector3(0, 0, zPos),
								new THREE.Vector3(6, 0, zPos)));
						}
					}
					/***************************
					 * add data values
					 */
					// var offset = h;
					// for(var i = 0; i < dataPositionArray.length; ++i){
					// var dx = dataArray[i].z;
					// var wx = dx.toString().length * (fontSize/2);
					//
					// var xPos = dataPositionArray[i].x ;
					// var yPos = dataPositionArray[i].y ;
					// var zPos = dataPositionArray[i].z ;
					// xPos = xPos > 0 ? xPos+offset : xPos-offset;
					// yPos = yPos > 0 ? yPos+offset : yPos-offset;
					// //zPos = zPos > 0 ? zPos+offset : zPos-offset;
					// var label = getLabel(dx,xPos,yPos,zPos,wx,h);
					// result.push(label);
					// }

					return result;
				}
				var getLabel = function(text, x, y, z, w, h,color) {
					var c = color === undefined ? "rgba(0, 0, 0, 0.5)" : color;
					/*
					 * var label = new THREE.TextGeometry( text, { size: 10,
					 * height: 10, curveSegments: 2, font: "helvetiker" });
					 *
					 */
					// create a canvas element
					var canvas = document.createElement('canvas');
					var context = canvas1.getContext('2d');
					var padding = 10;
					canvas1.width = w + padding;
					canvas1.height = h + padding;
					// context1.fillStyle = "#CC5422";
					// context1.fillRect(0,0,w,h);
					context.font = fontSize + "px Arial";
					context.fillStyle = c;
					context.fillText(text, 0, fontSize);

					// canvas contents will be used for a texture
					var texture = new THREE.Texture(canvas)
					texture.needsUpdate = true;

					// var material1 = new THREE.MeshBasicMaterial({
					// 	map : texture1,
					// 	side : THREE.DoubleSide
					// });
					// material1.transparent = true;
					// var textMesh = new THREE.Mesh(new THREE.PlaneGeometry(
					// 	canvas1.width, canvas1.height), material1);
					// textMesh.position.set(x, y, z);

					var spriteMaterial = new THREE.SpriteMaterial(
						{ map: texture, useScreenCoordinates: true, alignment: THREE.SpriteAlignment.topLeft } );
					var sprite = new THREE.Sprite( spriteMaterial );
					sprite.position.set(x, y, z);

					var spritey = makeTextSprite( text, { fontsize: 20, backgroundColor: {r:100, g:100, b:255, a:1} } );
					spritey.position.set(x, y, z);

					return spritey;
				}
				var makeTextSprite = function( message, parameters )
				{
					if ( parameters === undefined ) parameters = {};
					var fontface = parameters.hasOwnProperty("fontface") ?
					parameters["fontface"] : "Arial";
					var fontsize = parameters.hasOwnProperty("fontsize") ?
					parameters["fontsize"] : 18;
					var borderThickness = parameters.hasOwnProperty("borderThickness") ?
					parameters["borderThickness"] : 4;
					var borderColor = parameters.hasOwnProperty("borderColor") ?
					parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
					var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
					parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

					var spriteAlignment = THREE.SpriteAlignment.topLeft;
					var canvas = document.createElement('canvas');
					var context = canvas.getContext('2d');
					context.font = "Bold " + fontsize + "px " + fontface;

					var metrics = context.measureText( message );
					var textWidth = metrics.width;

					context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
						+ backgroundColor.b + "," + backgroundColor.a + ")";

context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
	+ borderColor.b + "," + borderColor.a + ")";
context.lineWidth = borderThickness;
roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);


context.fillStyle = "rgba(0, 0, 0, 1.0)";
context.fillText( message, borderThickness, fontsize + borderThickness);

var texture = new THREE.Texture(canvas)
texture.needsUpdate = true;
var spriteMaterial = new THREE.SpriteMaterial(
	{ map: texture, useScreenCoordinates: false, alignment: spriteAlignment } );
var sprite = new THREE.Sprite( spriteMaterial );
sprite.scale.set(100,50,1.0);
return sprite;
}

var roundRect = function(ctx, x, y, w, h, r)
{
	ctx.beginPath();
	ctx.moveTo(x+r, y);
	ctx.lineTo(x+w-r, y);
	ctx.quadraticCurveTo(x+w, y, x+w, y+r);
	ctx.lineTo(x+w, y+h-r);
	ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
	ctx.lineTo(x+r, y+h);
	ctx.quadraticCurveTo(x, y+h, x, y+h-r);
	ctx.lineTo(x, y+r);
	ctx.quadraticCurveTo(x, y, x+r, y);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
}
				/*
				 * @param from THREE.Vector3(x, y, z) @param to THREE.Vector3(x,
				 * y, z) @return THREE.Line
				 *
				 */
				 var getLine = function(from, to) {
				 	var lineMat = new THREE.LineBasicMaterial({
				 		color : 0x000000,
				 		lineWidth : 1
				 	});
				 	var lineGeo = new THREE.Geometry();
				 	lineGeo.vertices.push(from, to);

				 	var line = new THREE.Line(lineGeo, lineMat);
				 	line.type = THREE.Lines;

				 	return line;
				 }

				});

return plugin;
});
