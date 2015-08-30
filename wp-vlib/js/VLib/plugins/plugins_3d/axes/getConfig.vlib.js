define(
	['require', 'jquery'],
	function ( require, $ ) {
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
		return function ( containerId ) {
			var type = 0;
			var $container = $( '#' + containerId );
			var x = $container.find( 'input[id=xLabel]' ).val();
			var y = $container.find( 'input[id=yLabel]' ).val();
			var z = $container.find( 'input[id=zLabel]' ).val();

			if ( x === '' ) {
				x = ' ';
			}
			if ( y === '' ) {
				y = ' ';
			}
			if ( z === '' ) {
				z = ' ';
			}
			var rotationX = {
				x: $container.find( 'input[id=x-rotation-x]' ).val(),
				y: $container.find( 'input[id=x-rotation-y]' ).val(),
				z: $container.find( 'input[id=x-rotation-z]' ).val()
			};

			var rotationY = {
				x: $container.find( 'input[id=y-rotation-x]' ).val(),
				y: $container.find( 'input[id=y-rotation-y]' ).val(),
				z: $container.find( 'input[id=y-rotation-z]' ).val()
			};

			var rotationZ = {
				x: $container.find( 'input[id=z-rotation-x]' ).val(),
				y: $container.find( 'input[id=z-rotation-y]' ).val(),
				z: $container.find( 'input[id=z-rotation-z]' ).val()
			};


			rotationX.x = isNaN( rotationX.x ) ? 0 : rotationX.x;
			rotationX.y = isNaN( rotationX.y ) ? 0 : rotationX.y;
			rotationX.z = isNaN( rotationX.z ) ? 0 : rotationX.z;

			rotationY.x = isNaN( rotationY.x ) ? 0 : rotationY.x;
			rotationY.y = isNaN( rotationY.y ) ? 0 : rotationY.y;
			rotationY.z = isNaN( rotationY.z ) ? 0 : rotationY.z;

			rotationZ.x = isNaN( rotationZ.x ) ? 0 : rotationZ.x;
			rotationZ.y = isNaN( rotationZ.y ) ? 0 : rotationZ.y;
			rotationZ.z = isNaN( rotationZ.z ) ? 0 : rotationZ.z;


			var orientation = $container.find( 'input[name=optionStaticDynamic]:checked' ).val();

			var tickDataX = $container.find( 'input[name=optionTicklabelsDataX]:checked' ).val();
			var tickDataY = $container.find( 'input[name=optionTicklabelsDataY]:checked' ).val();
			var tickDataZ = $container.find( 'input[name=optionTicklabelsDataZ]:checked' ).val();

			if ( this.carousel ) {
				type = this.carousel.find( '.active' ).index();
			}
			var mirrorTicklines = $container.find( ' #mirror-ticklines' ).is( ':checked' );

			var showHeatmapRange = $container.find( ' #showHeatmapRange' ).is( ':checked' );
			var borders = {};
			borders.xMin = $container.find( ' #xMin' ).val();
			borders.yMin = $container.find( ' #yMin' ).val();
			borders.zMin = $container.find( ' #zMin' ).val();

			borders.xMax = $container.find( ' #xMax' ).val();
			borders.yMax = $container.find( ' #yMax' ).val();
			borders.zMax = $container.find( ' #zMax' ).val();

			var fontSize = $container.find( ' #fontSize' ).val();

			var mantissaX = $container.find( ' #mantissa-x' ).val();
			var mantissaY = $container.find( ' #mantissa-y' ).val();
			var mantissaZ = $container.find( ' #mantissa-z' ).val();

			var granularityX = $container.find( ' #granularity-x' ).val();
			var granularityY = $container.find( ' #granularity-y' ).val();
			var granularityZ = $container.find( ' #granularity-z' ).val();

			/* RASTER */
			var rasterXY = $container.find( ' #xy-raster-show' ).is( ':checked' );
			var rasterXYOpacity = $container.find( ' #raster-xy' ).val();

			var rasterXZ = $container.find( ' #xz-raster-show' ).is( ':checked' );
			var rasterXZOpacity = $container.find( ' #raster-xz' ).val();

			var rasterYX = $container.find( ' #yx-raster-show' ).is( ':checked' );
			var rasterYXOpacity = $container.find( ' #raster-yx' ).val();

			var rasterYZ = $container.find( ' #yz-raster-show' ).is( ':checked' );
			var rasterYZOpacity = $container.find( ' #raster-yz' ).val();

			var rasterZX = $container.find( ' #zx-raster-show' ).is( ':checked' );
			var rasterZXOpacity = $container.find( ' #raster-zx' ).val();

			var rasterZY = $container.find( ' #zy-raster-show' ).is( ':checked' );
			var rasterZYOpacity = $container.find( ' #raster-zy' ).val();

			/* validate range input */
			if ( isNaN( borders.xMin ) ) {
				borders.xMin = 'auto';
			}
			if ( isNaN( borders.yMin ) ) {
				borders.yMin = 'auto';
			}
			if ( isNaN( borders.zMin ) ) {
				borders.zMin = 'auto';
			}
			if ( isNaN( borders.xMax ) ) {
				borders.xMax = 'auto';
			}
			if ( isNaN( borders.yMax ) ) {
				borders.yMax = 'auto';
			}
			if ( isNaN( borders.zMax ) ) {
				borders.zMax = 'auto';
			}

			var niceSteps = $container.find( ' #stepType' ).is( ':checked' );

			mantissaX = mantissaX < 0 ? 0 : mantissaX;
			mantissaY = mantissaY < 0 ? 0 : mantissaY;
			mantissaZ = mantissaZ < 0 ? 0 : mantissaZ;

			var offsetX = $container.find( '#offset-x' ).val();
			var offsetY = $container.find( '#offset-y' ).val();
			var offsetZ = $container.find( '#offset-z' ).val();

			var result = {
				type           : type,
				labels         : {
					'x': x,
					'y': y,
					'z': z
				},
				mirrorTicklines: mirrorTicklines,
				range          : JSON.parse( JSON.stringify( borders ) ),
				heatmapRange   : showHeatmapRange,
				numUnits       : {
					'x' : granularityX,
					'y' : granularityY,
					'z' : granularityZ,
					nice: niceSteps
				},
				mantissa       : {
					'x': mantissaX,
					'y': mantissaY,
					'z': mantissaZ
				},
				rotationX      : rotationX,
				rotationY      : rotationY,
				rotationZ      : rotationZ,
				fontSize       : fontSize,
				raster         : {
					xy: {
						show   : rasterXY,
						opacity: rasterXYOpacity
					},
					xz: {
						show   : rasterXZ,
						opacity: rasterXZOpacity
					},
					yx: {
						show   : rasterYX,
						opacity: rasterYXOpacity
					},
					yz: {
						show   : rasterYZ,
						opacity: rasterYZOpacity
					},
					zx: {
						show   : rasterZX,
						opacity: rasterZXOpacity
					},
					zy: {
						show   : rasterZY,
						opacity: rasterZYOpacity
					}
				},
				orientation    : orientation,
				offset      : {
					x: parseInt( offsetX ),
					y: parseInt( offsetY ),
					z: parseInt( offsetZ )
				},
				tickData : {
					x : tickDataX,
					y : tickDataY,
					z : tickDataZ
				}
			};
			console
				.log( "[ axes ][getConfig] "
				+ JSON.stringify( result ) );
			return result;
		};

	} );
