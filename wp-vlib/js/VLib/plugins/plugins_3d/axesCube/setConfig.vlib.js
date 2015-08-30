define(
	[ 'require', 'jquery'],
	function(require, $) {
		var NICE_BORDER_MSG = "Nice borders will be calculated.";
		var EXACT_BORDER_MSG = "Exact data-borders will be taken.";
		var NICE_STEP_MSG = "Nice step size will be calculated.";
		var EXACT_STEP_MSG = "Exact step size will be calculated.";
		var xLabel = 'x';
		var yLabel = 'y';
		var zLabel = 'z';
		var niceTicksDefault = true;
		var xRangeDefault = 'auto';
		var yRangeDefault = 'auto';
		var zRangeDefault = 'auto';
		var defaultFontSize = 20;
		var decimalPlaces = 7;
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
		 return function(config, containerId) {
		 	console
		 	.log("[ axes ][setConfig] "
		 		+ JSON.stringify(config));
		 	if (config == "" || config === undefined){
		 		config = {
		 			labels : '',
		 			range : '',
		 			heatmapRange : false,
		 			numUnits : {},
		 			fontSize : defaultFontSize,
		 			mantissa : {},
		 			raster:{}
		 		};
		 	}
		 	if (!config.hasOwnProperty('labels'))
		 		config.labels = '';
		 	if (!config.hasOwnProperty('range'))
		 		config.range = '';
		 	if (!config.hasOwnProperty('numUnits'))
		 		config.numUnits = {};
		 	if (!config.hasOwnProperty('mantiassa'))
		 		config.mantiassa = {};
		 	if (!config.hasOwnProperty('raster'))
		 		config.raster = {};
		 	if (!config.hasOwnProperty('fontSize'))
		 		config.fontSize = defaultFontSize;

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

		 	if (config.valueRange != undefined) {
		 		if(config.valueRange === true){
		 			$('#' + containerId ).find(' #showValueRange').attr('checked','checked');
		 		}
		 	}
		 	if (config.heatmapRange != undefined) {
		 		if(config.heatmapRange === true){
		 			$('#' + containerId ).find(' #showHeatmapRange').attr('checked','checked');
		 		}
		 	}



		 	if (config.range.xMin != undefined) {
		 		$('#' + containerId + ' #xMin').val(config.range.xMin);
		 	} else {
		 		$('#' + containerId + ' #xMin').val(xRangeDefault);
		 	}
		 	if (config.range.yMin != undefined) {
		 		$('#' + containerId + ' #yMin').val(config.range.yMin);
		 	} else {
		 		$('#' + containerId + ' #yMin').val(yRangeDefault);
		 	}
		 	if (config.range.zMin != undefined) {
		 		$('#' + containerId + ' #zMin').val(config.range.zMin);
		 	} else {
		 		$('#' + containerId + ' #zMin').val(zRangeDefault);
		 	}

		 	if (config.range.xMax != undefined) {
		 		$('#' + containerId + ' #xMax').val(config.range.xMax);
		 	} else {
		 		$('#' + containerId + ' #xMax').val(xRangeDefault);
		 	}
		 	if (config.range.yMax != undefined) {
		 		$('#' + containerId + ' #yMax').val(config.range.yMax);
		 	} else {
		 		$('#' + containerId + ' #yMax').val(yRangeDefault);
		 	}
		 	if (config.range.zMax != undefined) {
		 		$('#' + containerId + ' #zMax').val(config.range.zMax);
		 	} else {
		 		$('#' + containerId + ' #zMax').val(zRangeDefault);
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
		 		if (config.numUnits.nice !== undefined) {
		 			if(config.numUnits.nice=== true){

		 				$('#' + containerId ).find(' #stepType').attr('checked','checked');
		 				$('#niceSteps').val(NICE_STEP_MSG);
		 			}else{
		 				$('#niceSteps').val(EXACT_STEP_MSG);
		 			}
		 		}else{
		 			$('#' + containerId ).find(' #stepType').attr('checked','checked');
		 			$('#niceSteps').val(NICE_STEP_MSG);
		 		}
		 	}else{
		 		config.numUnits = {};
		 		config.numUnits.x  = this.numUnitsDefault;
		 		config.numUnits.y  = this.numUnitsDefault;
		 		config.numUnits.z  = this.numUnitsDefault;
		 		config.numUnits.nice = niceTicksDefault;

		 	}
		 	/* fontSize */
		 	if(config.fontSize !== undefined){
		 		$('#' + containerId ).find(' #fontSize').val(config.fontSize);
		 	}else{
		 		config.fontSize = defaultFontSize;
		 	}
		 	/* decimal digits */
		 	if (config.mantissa !== undefined) {
		 		if (config.mantissa.x !== undefined) {
		 			$('#' + containerId ).find(' #mantissa-x').val(config.mantissa.x);
		 		} else {
		 			$('#' + containerId ).find(' #mantissa-x').val(2);
		 			config.mantissa.x = 2;
		 		}
		 		if (config.mantissa.y !== undefined) {
		 			$('#' + containerId ).find(' #mantissa-y').val(config.mantissa.y);
		 		} else {
		 			$('#' + containerId ).find(' #mantissa-y').val(2);
		 			config.mantissa.y = 2;
		 		}
		 		if (config.mantissa.z !== undefined) {
		 			$('#' + containerId ).find(' #mantissa-z').val(config.mantissa.z);
		 		} else {
		 			$('#' + containerId ).find(' #mantissa-z').val(2);
		 			config.mantissa.z = 2;
		 		}
		 	}else{
		 		config.mantissa = {};
		 		config.mantissa.x  = 2;
		 		config.mantissa.y  = 2;
		 		config.mantissa.z  = 2;

		 	}
		 	/* RASTER */
		 	if(config.raster.xy !== undefined){
		 		if(config.raster.xy.show !== undefined){
		 			if(config.raster.xy.show === true){
		 				$('#' + containerId ).find(' #xy-raster-show').attr('checked','checked');
		 			}
		 		}else{
		 			config.raster.xy.show = false;
		 		}
		 		if(config.raster.xy.opacity !== undefined && config.raster.xy.opacity !== ""){
		 			$('#' + containerId ).find(' #raster-xy').val(config.raster.xy.opacity);
		 		}else{
		 			$('#' + containerId ).find(' #raster-xy').val(0.06);
		 		}
		 	}else{
		 		config.raster.xy = {};
		 		config.raster.xy.show = false;
		 		config.raster.xy.opacity = 0.06;
		 		$('#' + containerId ).find(' #raster-xy').val(0.06);
		 	}
		 	if(config.raster.xz !== undefined){
		 		if(config.raster.xz.show !== undefined){
		 			if(config.raster.xz.show === true){
		 				$('#' + containerId ).find(' #xz-raster-show').attr('checked','checked');
		 			}
		 		}else{
		 			config.raster.xz.show = false;
		 		}
		 		if(config.raster.xz.opacity !== undefined && config.raster.xz.opacity !== ""){
		 			$('#' + containerId ).find(' #raster-xz').val(config.raster.xz.opacity);
		 		}else{
		 			$('#' + containerId ).find(' #raster-xz').val(0.06);
		 		}
		 	}else{
		 		config.raster.xz = {};
		 		config.raster.xz.show = false;
		 		config.raster.xz.opacity = 0.06;
		 		$('#' + containerId ).find(' #raster-xz').val(0.06);
		 	}
		 	if(config.raster.yz !== undefined){
		 		if(config.raster.yz.show !== undefined){
		 			if(config.raster.yz.show === true){
		 				$('#' + containerId ).find(' #yz-raster-show').attr('checked','checked');
		 			}
		 		}else{
		 			config.raster.yz.show = false;
		 		}
		 		if(config.raster.yz.opacity !== undefined && config.raster.yz.opacity !== ""){
		 			$('#' + containerId ).find(' #raster-yz').val(config.raster.yz.opacity);
		 		}else{
		 			$('#' + containerId ).find(' #raster-yz').val(0.06);
		 		}
		 	}else{
		 		config.raster.yz = {};
		 		config.raster.yz.show = false;
		 		config.raster.yz.opacity = 0.06;
		 		$('#' + containerId ).find(' #raster-yz').val(0.06);
		 	}

		 	/* Selector */

		 	$('#' + containerId ).find(' #stepType').click(function(){
		 		$(this).attr('checked', !$(this).attr('checked'));
		 		if($(this).attr('checked')){
		 			$('#niceSteps').val(NICE_STEP_MSG);
		 		}else{
		 			$('#niceSteps').val(EXACT_STEP_MSG);
		 		}
		 	});
		 	/* slider */
		 	$('#' + containerId ).find(' #granularitySliderX').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 2,
		 		max: 10,
		 		value: config.numUnits.x,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #granularity-x').val(ui.value);
		 		}
		 	});
		 	$('#' + containerId ).find(' #granularitySliderY').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 2,
		 		max: 10,
		 		value: config.numUnits.y,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #granularity-y').val(ui.value);
		 		}
		 	});
		 	$('#' + containerId ).find(' #granularitySliderZ').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 2,
		 		max: 10,
		 		value: config.numUnits.z,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #granularity-z').val(ui.value);
		 		}
		 	});
		 	$('#' + containerId ).find(' #raster-xy-slider').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0,
		 		max: 1,
		 		step: 0.01,
		 		value: config.raster.xy.opacity,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #raster-xy').val(ui.value);
		 		}
		 	});
		 	$('#' + containerId ).find(' #raster-xz-slider').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0,
		 		max: 1,
		 		step: 0.01,
		 		value: config.raster.xz.opacity,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #raster-xz').val(ui.value);
		 		}
		 	});
		 	$('#' + containerId ).find(' #raster-yz-slider').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0,
		 		max: 1,
		 		step: 0.01,
		 		value: config.raster.yz.opacity,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #raster-yz').val(ui.value);
		 		}
		 	});
		 };
		});
