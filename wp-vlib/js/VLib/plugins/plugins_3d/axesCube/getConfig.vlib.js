define(
	[ 'require', 'jquery'],
	function(require, $) {
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
		return function(containerId) {
			var x = $('#' + containerId + ' > form input[id=xLabel]')
			.val();
			var y = $('#' + containerId + ' > form input[id=yLabel]')
			.val();
			var z = $('#' + containerId + ' > form input[id=zLabel]')
			.val();


			var showHeatmapRange = $('#' + containerId + ' #showHeatmapRange').is(':checked');
			var borders = {};


			borders.xMin = $('#' + containerId + ' #xMin').val();
			borders.yMin = $('#' + containerId + ' #yMin').val();
			borders.zMin = $('#' + containerId + ' #zMin').val();

			borders.xMax = $('#' + containerId + ' #xMax').val();
			borders.yMax = $('#' + containerId + ' #yMax').val();
			borders.zMax = $('#' + containerId + ' #zMax').val();

			var fontSize = $('#' + containerId + ' #fontSize').val();

			var mantissaX = $('#' + containerId + ' #mantissa-x').val();
			var mantissaY = $('#' + containerId + ' #mantissa-y').val();
			var mantissaZ = $('#' + containerId + ' #mantissa-z').val();

			var granularityX = $('#' + containerId + ' #granularity-x').val();
			var granularityY = $('#' + containerId + ' #granularity-y').val();
			var granularityZ = $('#' + containerId + ' #granularity-z').val();

			/* RASTER */
			var rasterXY = $('#' + containerId + ' #xy-raster-show').is(':checked');
			var rasterXYOpacity =  $('#' + containerId + ' #raster-xy').val();

			var rasterXZ = $('#' + containerId + ' #xz-raster-show').is(':checked');
			var rasterXZOpacity =  $('#' + containerId + ' #raster-xz').val();

			var rasterYZ = $('#' + containerId + ' #yz-raster-show').is(':checked');
			var rasterYZOpacity =  $('#' + containerId + ' #raster-yz').val();

			/* validate range input */
			if(isNaN(borders.xMin)){
				borders.xMin = 'auto';
			}
			if(isNaN(borders.yMin)){
				borders.yMin = 'auto';
			}
			if(isNaN(borders.zMin)){
				borders.zMin = 'auto';
			}
			if(isNaN(borders.xMax)){
				borders.xMax = 'auto';
			}
			if(isNaN(borders.yMax)){
				borders.yMax = 'auto';
			}
			if(isNaN(borders.zMax)){
				borders.zMax = 'auto';
			}

			var niceSteps =  $('#' + containerId + ' #stepType').is(':checked');

			mantissaX = mantissaX < 0 ? 0 : mantissaX;
			mantissaY = mantissaY < 0 ? 0 : mantissaY;
			mantissaZ = mantissaZ < 0 ? 0 : mantissaZ;

			var result = {
				labels : {
					'x' : x === "" ? xLabel : x,
					'y' : y === "" ? yLabel : y,
					'z' : z === "" ? zLabel : z,
				},
				range : JSON.parse(JSON.stringify(borders)),
				heatmapRange : showHeatmapRange,
				numUnits : {
					'x' : granularityX,
					'y' : granularityY,
					'z' : granularityZ,
					nice : niceSteps
				},
				mantissa : {
					'x' : mantissaX,
					'y' : mantissaY,
					'z' : mantissaZ,
				},
				fontSize : fontSize,
				raster : {
					xy : {
						show : rasterXY,
						opacity : rasterXYOpacity
					},
					xz : {
						show : rasterXZ,
						opacity : rasterXZOpacity
					},
					yz : {
						show : rasterYZ,
						opacity : rasterYZOpacity
					}
				}
			};
			console
			.log("[ axes ][getConfig] "
				+ JSON.stringify(result));
			return result;
		}

	});
