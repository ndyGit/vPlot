define(
	['require', 'core/Utils.vlib', 'core/Framework3D.vlib', 'three', 'jquery'],
	function ( require, UTILS, F3D, THREE, $ ) {

		var F3DAxes = F3D || function () {
			};
		F3D.getLabelByIndex = function ( index, positionArray, labelsArray, fractionalDigits ) {
			"use strict";
			var label;
			if ( labelsArray ) {
				if ( index < labelsArray.length ) {
					if ( isNaN( labelsArray [index] ) ) {
						label = labelsArray [index];
					} else {
						label = labelsArray[index].toFixed( fractionalDigits );
					}

				} else {
					label = index + 1;
				}

			} else {
				label = parseFloat( positionArray[index] ).toFixed( fractionalDigits );
			}
			return label;
		};

		F3DAxes.createTickLabelsX = function ( tick, config, borders, scale, labels, positions ) {
			"use strict";
			var result = [];
			var color = config.color || '#000000';

			var labelWidth = 0;
			var labelHeight = parseInt( config.fontSize ) + 20;

			var nicePosObject, nicePosArray, scaler, landmark, coords;

			var customOffset = config.offset.x;
			var useStaticLabels = config.orientation === 'static';
			var rotation = {
				x: config.rotationX.x * Math.PI / 180,
				y: config.rotationX.y * Math.PI / 180,
				z: config.rotationX.z * Math.PI / 180
			};

			/* x-labels*/
			if ( scale.x > 0 ) {
				if ( config.numUnits.x > 0 ) {
					nicePosObject = tick.search( borders.xMin, borders.xMax, config.numUnits.x );
					nicePosObject.mantissa( config.mantissa.x );
					nicePosArray = nicePosObject.toArray();

					scaler = UTILS.scale();
					scaler.range( [0, scale.x] );
					scaler.domain( [nicePosObject.min, nicePosObject.max] );
					if ( positions ) {
						coords = scaler.linear( positions );
					} else {
						coords = scaler.linear( nicePosArray );
					}

					var label, text, offsetY = labelHeight / 2;
					for ( var i = 0, len = coords.length; i < len; ++i ) {
						text = this.getLabelByIndex( i, nicePosArray, labels, config.mantissa.x );
						labelWidth = ( text.toString().length * (config.fontSize / 2) ) + 5;

						/* label x*/
						label = F3DAxes.createLabel( text,
							{
								x: coords[i],
								y: -offsetY ,
								z: customOffset
							},
							labelWidth, labelHeight, color, config.fontSize, useStaticLabels );

						label.name = 'label';
						if ( useStaticLabels ) {
							label.rotation.set( rotation.x, rotation.y, rotation.z );
						} else {
							label.material.rotation = rotation.y;
						}

						result.push( label );
						/* landmark x*/
						landmark = new F3D.Cylinder(
							new F3D.Vector3( coords[i], 0, 0 ),
							new F3D.Vector3( coords[i], 10, 0 ),
							color, 1 );
						landmark.position.x = coords[i];
						result.push( landmark );

						/* raster ?  */
						if( config.raster.xy.show){
							var rasterXY = new F3D.Cylinder(
								new F3D.Vector3( coords[i], 0, 0 ),
								new F3D.Vector3( coords[i], scale.x, 0 ),
								color, 1 );
							rasterXY.position.x = coords[i];
							rasterXY.material.transparent = true;
							rasterXY.material.opacity = config.raster.xy.opacity;
							result.push( rasterXY );
						}
						if( config.raster.xz.show){
							var rasterXZ = new F3D.Cylinder(
								new F3D.Vector3( coords[i], 0, 0 ),
								new F3D.Vector3( coords[i], 0, scale.z ),
								color, 1 );
							rasterXZ.position.x = coords[i];
							rasterXZ.material.transparent = true;
							rasterXZ.material.opacity = config.raster.xz.opacity;
							result.push( rasterXZ );
						}


						if ( config.mirrorTicklines ) {
							landmark = landmark.clone();
							landmark.position.y = scale.y - 5;
							result.push( landmark );
						}
					}
				}
			}
			return result;
		};
		F3DAxes.createTickLabelsY = function ( tick, config, borders, scale, labels, positions ) {
			"use strict";
			var result = [];
			var color = config.color || '#000000';
			var labelWidth = 0;
			var labelHeight = parseInt( config.fontSize ) + 20;
			var nicePosObject, nicePosArray, scaler, landmark;
			var coords;

			var customOffset = config.offset.y;
			var useStaticLabels = config.orientation === 'static';

			var rotation = {
				x: config.rotationY.x * Math.PI / 180,
				y: config.rotationY.y * Math.PI / 180,
				z: config.rotationY.z * Math.PI / 180
			};

			/* y-labels*/
			if ( scale.y > 0 ) {
				if ( config.numUnits.y > 0 ) {
					nicePosObject = tick.search( borders.yMin, borders.yMax, config.numUnits.y );
					nicePosObject.mantissa( config.mantissa.y );
					nicePosArray = nicePosObject.toArray();
					scaler = UTILS.scale();
					scaler.range( [0, scale.y] );
					scaler.domain( [nicePosObject.min, nicePosObject.max] );
					if ( positions ) {
						coords = scaler.linear( positions );
					} else {
						coords = scaler.linear( nicePosArray );
					}
					var text, label;
					for ( var i = 0, len = coords.length; i < len; ++i ) {
						text = this.getLabelByIndex( i, nicePosArray, labels, config.mantissa.y );
						labelWidth = ( text.toString().length * (config.fontSize / 2) ) + 5;
						/* label y*/
						label = F3DAxes.createLabel( text,
							{
								x: -labelWidth / 2 +customOffset,
								y: coords[i],
								z: 0
							},
							labelWidth, labelHeight, color, config.fontSize, useStaticLabels );

						label.name = 'label';
						if ( useStaticLabels ) {
							label.rotation.set( rotation.x, rotation.y, rotation.z );
						} else {
							label.material.rotation = rotation.y;
						}

						result.push( label );

						/* landmark y*/
						landmark = new F3D.Cylinder(
							new F3D.Vector3( 0, coords[i], 0 ),
							new F3D.Vector3( 10, coords[i], 0 ),
							color, 1 );
						landmark.position.y = coords[i];
						result.push( landmark );
						if ( config.mirrorTicklines ) {
							landmark = landmark.clone();
							landmark.position.x = scale.x - 5;
							result.push( landmark );
						}

						if( config.raster.yx.show){
							var rasterYX = new F3D.Cylinder(
								new F3D.Vector3( 0, coords[i], 0 ),
								new F3D.Vector3( scale.x, coords[i] , 0 ),
								color, 1 );
							rasterYX.position.y = coords[i];
							rasterYX.material.transparent = true;
							rasterYX.material.opacity = config.raster.yx.opacity;
							result.push( rasterYX );
						}
						if( config.raster.yz.show){
							var rasterYZ = new F3D.Cylinder(
								new F3D.Vector3( coords[i], 0, 0 ),
								new F3D.Vector3( coords[i], 0, scale.z ),
								color, 1 );
							rasterYZ.position.y = coords[i];
							rasterYZ.material.transparent = true;
							rasterYZ.material.opacity = config.raster.yz.opacity;
							result.push( rasterYZ );
						}
					}
				}
			}
			return result;
		};
		F3DAxes.createTickLabelsZ = function ( tick, config, borders, scale, labels, positions ) {

			"use strict";
			var result = [];
			var color = config.color || '#000000';
			var labelWidth = 0;
			var labelHeight = parseInt( config.fontSize ) + 20;
			var nicePosObject, nicePosArray, scaler, landmark;
			var coords;

			var customOffset = config.offset.z;
			var useStaticLabels = config.orientation === 'static';
			var rotation = {
				x: config.rotationZ.x * Math.PI / 180,
				y: config.rotationZ.y * Math.PI / 180,
				z: config.rotationZ.z * Math.PI / 180
			};

			/* z-labels*/
			if ( scale.z > 0 ) {
				if ( config.numUnits.z > 0 ) {
					nicePosObject = tick.search( borders.zMin, borders.zMax, config.numUnits.z );
					nicePosObject.mantissa( config.mantissa.z );
					nicePosArray = nicePosObject.toArray();
					scaler = UTILS.scale();
					scaler.range( [0, scale.z] );
					scaler.domain( [nicePosObject.min, nicePosObject.max] );
					if ( positions ) {
						coords = scaler.linear( positions );
					} else {
						coords = scaler.linear( nicePosArray );
					}
					var text, label;
					for ( var i = 0, len = coords.length; i < len; ++i ) {
						text = this.getLabelByIndex( i, nicePosArray, labels, config.mantissa.z );
						labelWidth = ( text.toString().length * (config.fontSize / 2) ) + 5;
						/* label z*/
						label = F3D.createLabel( text,
							{
								x: -labelWidth / 2 +customOffset,
								y: -labelHeight / 2 ,
								z: coords[i]
							}, labelWidth, labelHeight, color, config.fontSize, useStaticLabels );

						label.name = 'label';
						if ( useStaticLabels ) {
							label.rotation.set( rotation.x, rotation.y, rotation.z );
						} else {
							label.material.rotation = rotation.y;
						}

						result.push( label );
						/* landmark z*/
						landmark = new F3D.Cylinder(
							new F3D.Vector3( 0, 0, coords[i] ),
							new F3D.Vector3( 10, 0, coords[i] ),
							color, 1 );
						landmark.position.z = coords[i];
						result.push( landmark );
						if ( config.mirrorTicklines ) {
							landmark = landmark.clone();
							landmark.position.x = scale.x - 5;
							result.push( landmark );
						}

						if( config.raster.zx.show){
							var rasterZX = new F3D.Cylinder(
								new F3D.Vector3( 0, 0,coords[i] ),
								new F3D.Vector3( scale.x, 0, coords[i] ),
								color, 1 );
							rasterZX.position.z = coords[i];
							rasterZX.material.transparent = true;
							rasterZX.material.opacity = config.raster.zx.opacity;
							result.push( rasterZX );
						}
						if( config.raster.zy.show){
							var rasterZY = new F3D.Cylinder(
								new F3D.Vector3( 0, 0,coords[i] ),
								new F3D.Vector3( 0, scale.y, coords[i] ),
								color, 1 );
							rasterZY.position.z = coords[i];
							rasterZY.material.transparent = true;
							rasterZY.material.opacity = config.raster.zy.opacity;
							result.push( rasterZY );
						}
					}
				}

			}
			return result;
		};

		F3DAxes.createCustomLabels = function ( config, env, color ) {
			var result = [], label, dim,
				fontSize = parseInt( config.fontSize ) + 10;
			/* x-label */
			if ( env.scale.x > 0 ) {
				label = F3D.createText( config.labels.x,
					{
						color: color,
						size : fontSize
					} );
				dim = F3D.getGeometryDimensions( label.geometry );
				label.position.set( (env.scale.x / 2) - dim.width / 2, -dim.height * 3, -dim.height * 2 );
				result.push( label );
			}
			/* y-label */
			if ( env.scale.y > 0 ) {
				label = F3D.createText( config.labels.y,
					{
						color: color,
						size : fontSize
					} );
				dim = F3D.getGeometryDimensions( label.geometry );
				label.position.set( -dim.height * 2, (env.scale.y / 2) - dim.width / 2, -dim.height * 2 );
				// label.rotateY(-45*Math.PI / 180);
				label.rotateZ( 90 * Math.PI / 180 );
				result.push( label );
			}
			/* z-label */
			if ( env.scale.z > 0 ) {
				label = F3D.createText( config.labels.z,
					{
						color: color,
						size : fontSize
					} );

				dim = F3D.getGeometryDimensions( label.geometry );
				label.position.set( -dim.height * 2, 0, (env.scale.z / 2) + dim.width / 2 );
				result.push( label );

			}
			return result;
		};
		F3DAxes.createHeatmap = function ( axesConfig, scale, heatmapConfig ) {
			if(!heatmapConfig){
				return false;
			}
			var heatmapWidth = 10;
			var offset = 0;
			var heatmap = new F3D.Cylinder(
				new F3D.Vector3( scale.x, 0, 0 ),
				new F3D.Vector3( scale.x, scale.y, 0 ),
				'#ffffff',
				heatmapWidth );
			var xPos = parseInt( scale.x ) + 10;
			var yPos = parseInt( scale.y );

			var labelHeight = parseInt( axesConfig.fontSize ) + 10;
			var hmStart = new F3D.Color( '#' + heatmapConfig.spectrum.from );
			var hmEnd = new F3D.Color( '#' + heatmapConfig.spectrum.to );
			var colors = heatmap.geometry.colors;

			for ( var i = 0, len = heatmap.geometry.vertices.length; i < len; ++i ) {
				if ( i < len / 2 ) {
					heatmap.geometry.colors[i] = hmStart;
				} else {
					heatmap.geometry.colors[i] = hmEnd;
				}
			}
			var faceIndices = ['a', 'b', 'c', 'd'];
			var vertexIndex, numberOfSides;
			for ( var i = 0, len = heatmap.geometry.faces.length; i < len; ++i ) {
				face = heatmap.geometry.faces[i];
				numberOfSides = (face instanceof F3D.Face3) ? 3 : 4;
				for ( var j = 0; j < numberOfSides; j++ ) {
					vertexIndex = face[faceIndices[j]];
					face.vertexColors[j] = heatmap.geometry.colors[vertexIndex];
				}
			}
			heatmap.geometry.dynamic = true;
			heatmap.geometry.verticesNeedUpdate = true;
			heatmap.geometry.colorsNeedUpdate = true;
			heatmap.geometry.buffersNeedUpdate = true;

			/*createLabel: text, x, y, z, w, h,color, fontSize*/
			var lwFrom = heatmapConfig.numberRange.from.toString().length * (axesConfig.fontSize / 2);
			var lwTo = heatmapConfig.numberRange.to.toString().length * (axesConfig.fontSize / 2);
			var labelWidth = lwTo > lwFrom ? lwTo : lwFrom;
			labelWidth = labelWidth < 30 ? 30 : labelWidth;
			/* minimal padding to avoid overlap*/

			var labelFrom = F3D.createLabel(
				heatmapConfig.numberRange.from,
				{
					x: offset + heatmapWidth + labelWidth / 2,
					y: 0,
					z: 0
				},
				labelWidth,
				labelHeight,
				'#' + heatmapConfig.spectrum.from,
				axesConfig.fontSize,
				true );


			var labelTo = F3D.createLabel(
				offset + heatmapConfig.numberRange.to,
				{
					x: heatmapWidth + labelWidth / 2,
					y: yPos,
					z: 0
				},
				labelWidth,
				labelHeight,
				'#' + heatmapConfig.spectrum.to,
				axesConfig.fontSize,
				true );

			var group = new THREE.Object3D();
			group.add( heatmap );
			group.add( labelFrom );
			group.add( labelTo );

			return [group, (offset + labelWidth + heatmapWidth + 10)];
		};
		F3DAxes.createCanvas = function ( text, width, height, angle ) {
			var canvas = document.createElement( 'canvas' );
			var PIXEL_RATIO = (function ( ctx ) {
				var dpr = window.devicePixelRatio || 1,
					bsr = ctx.webkitBackingStorePixelRatio ||
						ctx.mozBackingStorePixelRatio ||
						ctx.msBackingStorePixelRatio ||
						ctx.oBackingStorePixelRatio ||
						ctx.backingStorePixelRatio || 1;

				return dpr / bsr;
			})( canvas );

			var context = canvas.getContext( '2d' );
			var metric = context.measureText( text );
			canvas.width = width;
			canvas.height = height;

			var tx = width / 2;
			var ty = height / 2;
			context.translate( tx, ty );
			context.rotate( angle );

			context.textBaseline = "middle";
			context.textAlign = "center";
			context.font = "16px Verdana";
			context.fillStyle = "#ffffff";
			var ctext = text.split( "" ).join( String.fromCharCode( 8202 ) );
			context.fillText( ctext, 0, 0 );
			context.translate( -tx, -ty );
			context.setTransform( PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0 );
		};
		F3DAxes.createLabel = function ( text, coord, w, h, color, fontSize, staticLabel ) {

			var c = typeof color == 'undefined' ? "rgba(0, 0, 0, 0.5)" : color;
			var fs = typeof fontSize == 'undefined' ? defaultFontSize : fontSize;
			staticLabel = staticLabel === undefined ? false : staticLabel;

			var canvas = document.createElement( 'canvas' );
			var context = canvas.getContext( '2d' );

			canvas.width = w + 10;
			canvas.height = h;

			context.textBaseline = 'middle';
			context.font = fs + "px Arial";
			context.fillStyle = c;
			context.fillText( text, 0, fs );

			var label;
			if ( staticLabel ) {
				label = new F3D.StaticLabel( canvas, w, h );
			} else {
				label = new F3D.DynamicLabel( canvas, w, h );
			}
			label.position.set( coord.x, coord.y, coord.z );

			return label;
			/*
			 var label = F3D.createText(text,{
			 size : fontSize,
			 color : color
			 });
			 label.geometry.computeBoundingBox();
			 var box = label.geometry.boundingBox;

			 var center = {
			 x : (box.max.x - box.min.x)/2,
			 y : (box.max.y - box.min.y)/2,
			 z : (box.max.z - box.min.z)/2
			 };
			 label.position.set(coord.x + center.x , coord.y + center.y  , coord.z + center.x );
			 label.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -center.x, -center.y, -center.z ) );

			 return label;
			 */

		};
		F3DAxes.AxesCubeXYZ = function ( env, color, size ) {
			return new F3D.Cube( env.scale.x, env.scale.y, env.scale.z, color, size );
		};
		F3DAxes.AxesXYZ = function ( env, color, size ) {
			var axes = new THREE.Object3D();
			var lineX = new F3D.Cylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( env.scale.x, 0, 0 ), color );
			var lineY = new F3D.Cylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, env.scale.y, 0 ), color );
			var lineZ = new F3D.Cylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, env.scale.z ), color );

			var landmark;
			var landmark_len = 14;
			var lineAlongX = new F3D.Cylinder(
				new F3D.Vector3( 0, 0, 0 ),
				new F3D.Vector3( landmark_len, 0, 0 ),
				color, 1 );
			var lineAlongY = new F3D.Cylinder(
				new F3D.Vector3( 0, 0, 0 ),
				new F3D.Vector3( 0, landmark_len, 0 ),
				color, 1 );
			var lineAlongZ = new F3D.Cylinder(
				new F3D.Vector3( 0, 0, 0 ),
				new F3D.Vector3( 0, 0, landmark_len ),
				color, 1 );

			axes.add( lineX );
			axes.add( lineY );
			axes.add( lineZ );

			return axes;
		};
		F3DAxes.AxesXYZArrows = function ( env, color, size ) {
			var landmark;
			var landmark_len = 20;
			var axes = F3DAxes.AxesXYZ( env, color, size );

			var coneX = new F3D.Cone(
				new F3D.Vector3( env.scale.x + landmark_len, 0, 0 ),
				new F3D.Vector3( env.scale.x, 0, 0 ),
				color, 10 );
			coneX.position.x = env.scale.x + (landmark_len / 2);
			var coneY = new F3D.Cone(
				new F3D.Vector3( 0, env.scale.y + landmark_len, 0 ),
				new F3D.Vector3( 0, env.scale.y, 0 ),
				color, 10 );
			coneY.position.y = env.scale.y + (landmark_len / 2);
			var coneZ = new F3D.Cone(
				new F3D.Vector3( 0, 0, env.scale.z + landmark_len ),
				new F3D.Vector3( 0, 0, env.scale.z ),
				color, 10 );
			coneZ.position.z = env.scale.z + (landmark_len / 2);

			axes.add( coneX );
			axes.add( coneY );
			axes.add( coneZ );

			return axes;
		};
		F3DAxes.IndicatorsXYZ = function ( env, color, size ) {
			var axes = new THREE.Object3D();
			var landmark;
			var landmark_len = 14;
			var lineAlongX = new F3D.Cylinder(
				new F3D.Vector3( 0, 0, 0 ),
				new F3D.Vector3( landmark_len, 0, 0 ),
				color, 1 );
			var lineAlongY = new F3D.Cylinder(
				new F3D.Vector3( 0, 0, 0 ),
				new F3D.Vector3( 0, landmark_len, 0 ),
				color, 1 );
			var lineAlongZ = new F3D.Cylinder(
				new F3D.Vector3( 0, 0, 0 ),
				new F3D.Vector3( 0, 0, landmark_len ),
				color, 1 );
			size = 1;
			/* marker X */
			landmark = lineAlongX.clone();
			landmark.position.x = 0 + ( landmark_len / 2);
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.x = 0;
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.x = 0;
			axes.add( landmark );

			landmark = lineAlongX.clone();
			landmark.position.x = env.scale.x - ( landmark_len / 2);
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.x = env.scale.x;
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.x = env.scale.x;
			axes.add( landmark );

			/* marker Y */
			landmark = lineAlongX.clone();
			landmark.position.y = env.scale.y;
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.y = env.scale.y - ( landmark_len / 2);
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.y = env.scale.y;
			axes.add( landmark );

			/* marker Z */
			landmark = lineAlongX.clone();
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.z = env.scale.z - ( landmark_len / 2);
			axes.add( landmark );
			/* marker XY */
			landmark = lineAlongX.clone();
			landmark.position.x = env.scale.x - ( landmark_len / 2);
			landmark.position.y = env.scale.y;
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.x = env.scale.x;
			landmark.position.y = env.scale.y - ( landmark_len / 2);
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.x = env.scale.x;
			landmark.position.y = env.scale.y;
			axes.add( landmark );
			/* marker XZ */
			landmark = lineAlongX.clone();
			landmark.position.x = env.scale.x - ( landmark_len / 2);
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.x = env.scale.x;
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.x = env.scale.x;
			landmark.position.z = env.scale.z - ( landmark_len / 2);
			axes.add( landmark );
			/* marker YZ */
			landmark = lineAlongX.clone();
			landmark.position.y = env.scale.y;
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.y = env.scale.y - ( landmark_len / 2);
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.y = env.scale.y;
			landmark.position.z = env.scale.z - ( landmark_len / 2);
			axes.add( landmark );
			/* marker XYZ */
			landmark = lineAlongX.clone();
			landmark.position.x = env.scale.x - ( landmark_len / 2);
			landmark.position.y = env.scale.y;
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.x = env.scale.x;
			landmark.position.y = env.scale.y - ( landmark_len / 2);
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.x = env.scale.x;
			landmark.position.y = env.scale.y;
			landmark.position.z = env.scale.z - ( landmark_len / 2);
			return axes.add( landmark );
		};
		F3DAxes.AxesAndIndicatorsXYZ = function ( env, color, size ) {
			var axes = new THREE.Object3D();
			var lineX = new F3D.Cylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( env.scale.x, 0, 0 ), color );
			var lineY = new F3D.Cylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, env.scale.y, 0 ), color );
			var lineZ = new F3D.Cylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, env.scale.z ), color );

			var landmark;
			var landmark_len = 14;
			var lineAlongX = new F3D.Cylinder(
				new F3D.Vector3( 0, 0, 0 ),
				new F3D.Vector3( landmark_len, 0, 0 ),
				color, 1 );
			var lineAlongY = new F3D.Cylinder(
				new F3D.Vector3( 0, 0, 0 ),
				new F3D.Vector3( 0, landmark_len, 0 ),
				color, 1 );
			var lineAlongZ = new F3D.Cylinder(
				new F3D.Vector3( 0, 0, 0 ),
				new F3D.Vector3( 0, 0, landmark_len ),
				color, 1 );
			size = 1;
			/* marker X */
			landmark = lineAlongY.clone();
			landmark.position.x = env.scale.x;
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.x = env.scale.x;
			axes.add( landmark );
			/* marker Y */
			landmark = lineAlongX.clone();
			landmark.position.y = env.scale.y;
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.y = env.scale.y;
			axes.add( landmark );
			/* marker Z */
			landmark = lineAlongX.clone();
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			/* marker XY */
			landmark = lineAlongX.clone();
			landmark.position.x = env.scale.x - ( landmark_len / 2);
			landmark.position.y = env.scale.y;
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.x = env.scale.x;
			landmark.position.y = env.scale.y - ( landmark_len / 2);
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.x = env.scale.x;
			landmark.position.y = env.scale.y;
			axes.add( landmark );
			/* marker XZ */
			landmark = lineAlongX.clone();
			landmark.position.x = env.scale.x - ( landmark_len / 2);
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.x = env.scale.x;
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.x = env.scale.x;
			landmark.position.z = env.scale.z - ( landmark_len / 2);
			axes.add( landmark );
			/* marker YZ */
			landmark = lineAlongX.clone();
			landmark.position.y = env.scale.y;
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.y = env.scale.y - ( landmark_len / 2);
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.y = env.scale.y;
			landmark.position.z = env.scale.z - ( landmark_len / 2);
			axes.add( landmark );
			/* marker XYZ */
			landmark = lineAlongX.clone();
			landmark.position.x = env.scale.x - ( landmark_len / 2);
			landmark.position.y = env.scale.y;
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongY.clone();
			landmark.position.x = env.scale.x;
			landmark.position.y = env.scale.y - ( landmark_len / 2);
			landmark.position.z = env.scale.z;
			axes.add( landmark );
			landmark = lineAlongZ.clone();
			landmark.position.x = env.scale.x;
			landmark.position.y = env.scale.y;
			landmark.position.z = env.scale.z - ( landmark_len / 2);
			axes.add( landmark );

			axes.add( lineX );
			axes.add( lineY );
			axes.add( lineZ );

			return axes;
		};


		return F3DAxes;
	} );
