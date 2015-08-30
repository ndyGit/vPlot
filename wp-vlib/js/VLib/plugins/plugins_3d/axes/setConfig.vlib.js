define(
	[ 'require', 'jquery','config'],
	function(require, $, Config) {
		var NICE_BORDER_MSG = "Nice borders will be calculated.";
		var EXACT_BORDER_MSG = "Exact data-borders will be taken.";
		var NICE_STEP_MSG = "Nice step size will be calculated.";
		var EXACT_STEP_MSG = "Exact step size will be calculated.";
		var xRangeDefault = 'auto';
		var yRangeDefault = 'auto';
		var zRangeDefault = 'auto';

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
			 var $container = $( '#' + containerId );
		 	if (config === "" || config === undefined){
		 		config = this.defaults;
		 	}

			 if (!config.hasOwnProperty('rotation')){
				 config.rotation = this.defaults.rotation;
			 }
		 	if (!config.hasOwnProperty('type'))
		 		config.type = this.defaults.type;
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
		 		config.fontSize = this.defaults.fontSize;

			 if(config.orientation === undefined){
				 config.orientation= this.defaults.orientation;
			 }

			 if(config.tickData === undefined){
				 config.tickData = this.defaults.tickData;
			 }
			 if(config.tickData.x === undefined){
				 config.tickData.x = this.defaults.tickData.x;
			 }
			 if(config.tickData.y === undefined){
				 config.tickData.y = this.defaults.tickData.y;
			 }
			 if(config.tickData.z === undefined){
				 config.tickData.z = this.defaults.tickData.z;
			 }

		 	if (config.type == undefined) {
		 		config.type = this.defaults.type;
		 	}
		 	if (config.labels.x != undefined) {
		 		$container.find('input[id=xLabel]').val(
		 			config.labels.x);
		 	} else {
		 		$container.find('input[id=xLabel]').val(
		 			this.defaults.labels.x);
		 	}
		 	if (config.labels.y != undefined) {
		 		$container.find('input[id=yLabel]').val(
		 			config.labels.y);
		 	} else {
		 		$container.find('input[id=yLabel]').val(
		 			this.defaults.labels.y);
		 	}
		 	if (config.labels.z != undefined) {
		 		$container.find('input[id=zLabel]').val(
		 			config.labels.z);
		 	} else {
		 		$container.find('input[id=zLabel]').val(
		 			this.defaults.labels.z);
		 	}

			 if (config.rotationX.x !== undefined) {
				 $container.find('input[id=x-rotation-x]').val(
					 config.rotationX.x);
			 } else {
				 $container.find('input[id=x-rotation-x]').val(
					 this.defaults.rotationX.x);
			 }
			 if (config.rotationX.y !== undefined) {
				 $container.find('input[id=x-rotation-y]').val(
					 config.rotationX.y);
			 } else {
				 $container.find('input[id=x-rotation-y]').val(
					 this.defaults.rotation.y);
			 }
			 if (config.rotationX.z !== undefined) {
				 $container.find('input[id=x-rotation-z]').val(
					 config.rotationX.z);
			 } else {
				 $container.find('input[id=x-rotation-z]').val(
					 this.defaults.rotationX.z);
			 }

			 if (config.rotationY.x !== undefined) {
				 $container.find('input[id=y-rotation-x]').val(
					 config.rotationY.x);
			 } else {
				 $container.find('input[id=y-rotation-x]').val(
					 this.defaults.rotationY.x);
			 }
			 if (config.rotationY.y !== undefined) {
				 $container.find('input[id=y-rotation-y]').val(
					 config.rotationY.y);
			 } else {
				 $container.find('input[id=y-rotation-y]').val(
					 this.defaults.rotationY.y);
			 }
			 if (config.rotationY.z !== undefined) {
				 $container.find('input[id=y-rotation-z]').val(
					 config.rotationY.z);
			 } else {
				 $container.find('input[id=y-rotation-z]').val(
					 this.defaults.rotationY.z);
			 }

			 if (config.rotationZ.x !== undefined) {
				 $container.find('input[id=z-rotation-x]').val(
					 config.rotationZ.x);
			 } else {
				 $container.find('input[id=z-rotation-x]').val(
					 this.defaults.rotationZ.x);
			 }
			 if (config.rotationZ.y !== undefined) {
				 $container.find('input[id=z-rotation-y]').val(
					 config.rotationZ.y);
			 } else {
				 $container.find('input[id=z-rotation-y]').val(
					 this.defaults.rotationZ.y);
			 }
			 if (config.rotationZ.z !== undefined) {
				 $container.find('input[id=z-rotation-z]').val(
					 config.rotationZ.z);
			 } else {
				 $container.find('input[id=z-rotation-z]').val(
					 this.defaults.rotationZ.z);
			 }

			 $container.find( 'input[type=radio][name=optionStaticDynamic][value=' + config.orientation + ']' ).attr( 'checked', 'checked' );

			 $container.find( 'input[type=radio][name=optionTicklabelsDataX][value=' + config.tickData.x + ']' ).attr( 'checked', 'checked' );
			 $container.find( 'input[type=radio][name=optionTicklabelsDataY][value=' + config.tickData.y + ']' ).attr( 'checked', 'checked' );
			 $container.find( 'input[type=radio][name=optionTicklabelsDataZ][value=' + config.tickData.z + ']' ).attr( 'checked', 'checked' );


		 	if (config.valueRange !== undefined) {
		 		if(config.valueRange === true){
		 			$container.find(' #showValueRange').attr('checked','checked');
		 		}
		 	}
		 	if (config.heatmapRange !== undefined) {
		 		if(config.heatmapRange === true){
		 			$container.find(' #showHeatmapRange').attr('checked','checked');
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

		 	if (config.mirrorTicklines !== undefined) {
		 		if( config.mirrorTicklines === true){
		 			$container.find(' #mirror-ticklines').attr('checked','checked');
		 		}
		 	}
		 	if (config.numUnits !== undefined) {
		 		if (config.numUnits.x !== undefined) {
		 			$container.find(' #granularity-x').val(config.numUnits.x);
		 		} else {
		 			$container.find(' #granularity-x').val(this.defaults.numUnits);
		 			config.numUnits.x = this.defaults.numUnits;
		 		}
		 		if (config.numUnits.y !== undefined) {
		 			$container.find(' #granularity-y').val(config.numUnits.y);
		 		} else {
		 			$container.find(' #granularity-y').val(this.defaults.numUnits);
		 			config.numUnits.y = this.defaults.numUnits;
		 		}
		 		if (config.numUnits.z !== undefined) {
		 			$container.find(' #granularity-z').val(config.numUnits.z);
		 		} else {
		 			$container.find(' #granularity-z').val(this.defaults.numUnits);
		 			config.numUnits.z = this.defaults.numUnits;
		 		}
		 		if (config.numUnits.nice !== undefined) {
		 			if(config.numUnits.nice === true){
		 				$container.find(' #stepType').attr('checked','checked');
		 				$('#niceSteps').val(NICE_STEP_MSG);
		 			}else{
		 				$('#niceSteps').val(EXACT_STEP_MSG);
		 			}
		 		}else{
		 			$container.find(' #stepType').attr('checked','checked');
		 			$('#niceSteps').val(NICE_STEP_MSG);
		 		}
		 	}else{
		 		config.numUnits = {};
		 		config.numUnits.x  = this.defaults.numUnits;
		 		config.numUnits.y  = this.defaults.numUnits;
		 		config.numUnits.z  = this.defaults.numUnits;
		 		config.numUnits.nice = this.defaults.nice;

		 	}
		 	/* fontSize */
		 	if(config.fontSize !== undefined){
		 		$container.find(' #fontSize').val(config.fontSize);
		 	}else{
		 		config.fontSize = defaultFontSize;
		 	}
		 	/* decimal digits */
		 	if (config.mantissa !== undefined) {
		 		if (config.mantissa.x !== undefined) {
		 			$container.find(' #mantissa-x').val(config.mantissa.x);
		 		} else {
		 			$container.find(' #mantissa-x').val(2);
		 			config.mantissa.x = 2;
		 		}
		 		if (config.mantissa.y !== undefined) {
		 			$container.find(' #mantissa-y').val(config.mantissa.y);
		 		} else {
		 			$container.find(' #mantissa-y').val(2);
		 			config.mantissa.y = 2;
		 		}
		 		if (config.mantissa.z !== undefined) {
		 			$container.find(' #mantissa-z').val(config.mantissa.z);
		 		} else {
		 			$container.find(' #mantissa-z').val(2);
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
		 				$container.find(' #xy-raster-show').attr('checked','checked');
		 			}
		 		}else{
		 			config.raster.xy.show = false;
		 		}
		 		if(config.raster.xy.opacity !== undefined && config.raster.xy.opacity !== ""){
		 			$container.find(' #raster-xy').val(config.raster.xy.opacity);
		 		}else{
		 			$container.find(' #raster-xy').val(0.06);
		 		}
		 	}else{
		 		config.raster.xy = {};
		 		config.raster.xy.show = false;
		 		config.raster.xy.opacity = 0.06;
		 		$container.find(' #raster-xy').val(0.06);
		 	}
		 	if(config.raster.xz !== undefined){
		 		if(config.raster.xz.show !== undefined){
		 			if(config.raster.xz.show === true){
		 				$container.find(' #xz-raster-show').attr('checked','checked');
		 			}
		 		}else{
		 			config.raster.xz.show = false;
		 		}
		 		if(config.raster.xz.opacity !== undefined && config.raster.xz.opacity !== ""){
		 			$container.find(' #raster-xz').val(config.raster.xz.opacity);
		 		}else{
		 			$container.find(' #raster-xz').val(0.06);
		 		}
		 	}else{
		 		config.raster.xz = {};
		 		config.raster.xz.show = false;
		 		config.raster.xz.opacity = 0.06;
		 		$container.find(' #raster-xz').val(0.06);
		 	}

			 if(config.raster.yx !== undefined){
				 if(config.raster.yx.show !== undefined){
					 if(config.raster.yx.show === true){
						 $container.find(' #yx-raster-show').attr('checked','checked');
					 }
				 }else{
					 config.raster.yx.show = false;
				 }
				 if(config.raster.yx.opacity !== undefined && config.raster.yx.opacity !== ""){
					 $container.find(' #raster-yx').val(config.raster.yx.opacity);
				 }else{
					 $container.find(' #raster-yx').val(0.06);
				 }
			 }else{
				 config.raster.yx = {};
				 config.raster.yx.show = false;
				 config.raster.yx.opacity = 0.06;
				 $container.find(' #raster-yx').val(0.06);
			 }

		 	if(config.raster.yz !== undefined){
		 		if(config.raster.yz.show !== undefined){
		 			if(config.raster.yz.show === true){
		 				$container.find(' #yz-raster-show').attr('checked','checked');
		 			}
		 		}else{
		 			config.raster.yz.show = false;
		 		}
		 		if(config.raster.yz.opacity !== undefined && config.raster.yz.opacity !== ""){
		 			$container.find(' #raster-yz').val(config.raster.yz.opacity);
		 		}else{
		 			$container.find(' #raster-yz').val(0.06);
		 		}
		 	}else{
		 		config.raster.yz = {};
		 		config.raster.yz.show = false;
		 		config.raster.yz.opacity = 0.06;
		 		$container.find(' #raster-yz').val(0.06);
		 	}
			 if(config.raster.zx !== undefined){
				 if(config.raster.zx.show !== undefined){
					 if(config.raster.zx.show === true){
						 $container.find(' #zx-raster-show').attr('checked','checked');
					 }
				 }else{
					 config.raster.zx.show = false;
				 }
				 if(config.raster.zx.opacity !== undefined && config.raster.zx.opacity !== ""){
					 $container.find(' #raster-zx').val(config.raster.zx.opacity);
				 }else{
					 $container.find(' #raster-zx').val(0.06);
				 }
			 }else{
				 config.raster.zx = {};
				 config.raster.zx.show = false;
				 config.raster.zx.opacity = 0.06;
				 $container.find(' #raster-zx').val(0.06);
			 }

			 if(config.raster.zy !== undefined){
				 if(config.raster.zy.show !== undefined){
					 if(config.raster.zy.show === true){
						 $container.find(' #zy-raster-show').attr('checked','checked');
					 }
				 }else{
					 config.raster.zy.show = false;
				 }
				 if(config.raster.zy.opacity !== undefined && config.raster.zy.opacity !== ""){
					 $container.find(' #raster-zy').val(config.raster.zy.opacity);
				 }else{
					 $container.find(' #raster-zy').val(0.06);
				 }
			 }else{
				 config.raster.zy = {};
				 config.raster.zy.show = false;
				 config.raster.zy.opacity = 0.06;
				 $container.find(' #raster-zy').val(0.06);
			 }

			 if(config.orientation === 'dynamic'){
				 $container.find('#x-rotation-x' ).attr('disabled','disabled').slideUp();
				 $container.find('#x-rotation-z' ).attr('disabled','disabled').slideUp();
				 $container.find('#y-rotation-x' ).attr('disabled','disabled').slideUp();
				 $container.find('#y-rotation-z' ).attr('disabled','disabled').slideUp();
				 $container.find('#z-rotation-x' ).attr('disabled','disabled').slideUp();
				 $container.find('#z-rotation-z' ).attr('disabled','disabled').slideUp();
			 }
			 $container.find('input[name=optionStaticDynamic]:radio').change(function () {
				 "use strict";
				if($container.find('input[name=optionStaticDynamic][value=static]' ).is(':checked')){
					$container.find('#x-rotation-x' ).removeAttr('disabled' ).slideDown();
					$container.find('#x-rotation-z' ).removeAttr('disabled').slideDown();
					$container.find('#y-rotation-x' ).removeAttr('disabled').slideDown();
					$container.find('#y-rotation-z' ).removeAttr('disabled').slideDown();
					$container.find('#z-rotation-x' ).removeAttr('disabled').slideDown();
					$container.find('#z-rotation-z' ).removeAttr('disabled').slideDown();
				}else{
					$container.find('#x-rotation-x' ).attr('disabled','disabled' ).slideUp();
					$container.find('#x-rotation-z' ).attr('disabled','disabled').slideUp();
					$container.find('#y-rotation-x' ).attr('disabled','disabled').slideUp();
					$container.find('#y-rotation-z' ).attr('disabled','disabled').slideUp();
					$container.find('#z-rotation-x' ).attr('disabled','disabled').slideUp();
					$container.find('#z-rotation-z' ).attr('disabled','disabled').slideUp();
				}
			 });

			 if(config.offset === undefined){
				 config.offset = this.defaults.offset;
			 }
			 if(config.offset.x === undefined){
				 config.offset.x = this.defaults.offset.x;
			 }
			 if(config.offset.y === undefined){
				 config.offset.y = this.defaults.offset.y;
			 }
			 if(config.offset.z === undefined){
				 config.offset.z = this.defaults.offset.z;
			 }

			 $container.find(' #offset-x' ).val( config.offset.x);
			 $container.find(' #offset-y' ).val( config.offset.y);
			 $container.find(' #offset-z' ).val( config.offset.z);


		 	/* Selector */
		 	$container.find(' #stepType').click(function(){
		 		$(this).attr('checked', !$(this).attr('checked'));
		 		if($(this).attr('checked')){
		 			$('#niceSteps').val(NICE_STEP_MSG);
		 		}else{
		 			$('#niceSteps').val(EXACT_STEP_MSG);
		 		}
		 	});

			 /* slider */
			 $container.find(' #offsetSliderX').slider({
				 orientation: "horizontal",
				 range: "min",
				 min: -200,
				 max: 200,
				 value: config.offset.x,
				 slide: function (event, ui) {
					 $container.find(' #offset-x').val(ui.value);
				 }
			 });
			 $container.find(' #offsetSliderY').slider({
				 orientation: "horizontal",
				 range: "min",
				 min: -200,
				 max: 200,
				 value: config.offset.y,
				 slide: function (event, ui) {
					 $container.find(' #offset-y').val(ui.value);
				 }
			 });
			 $container.find(' #offsetSliderZ').slider({
				 orientation: "horizontal",
				 range: "min",
				 min: -200,
				 max: 200,
				 value: config.offset.z,
				 slide: function (event, ui) {
					 $container.find(' #offset-z').val(ui.value);
				 }
			 });


		 	$container.find(' #granularitySliderX').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0,
		 		max: 10,
		 		value: config.numUnits.x,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #granularity-x').val(ui.value);
		 		}
		 	});
		 	$container.find(' #granularitySliderY').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0,
		 		max: 10,
		 		value: config.numUnits.y,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #granularity-y').val(ui.value);
		 		}
		 	});
		 	$container.find(' #granularitySliderZ').slider({
		 		orientation: "horizontal",
		 		range: "min",
		 		min: 0,
		 		max: 10,
		 		value: config.numUnits.z,
		 		slide: function (event, ui) {
		 			$('#' + containerId + ' #granularity-z').val(ui.value);
		 		}
		 	});
		 	$container.find(' #raster-xy-slider').slider({
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
		 	$container.find(' #raster-xz-slider').slider({
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
			 $container.find(' #raster-yx-slider').slider({
				 orientation: "horizontal",
				 range: "min",
				 min: 0,
				 max: 1,
				 step: 0.01,
				 value: config.raster.yx.opacity,
				 slide: function (event, ui) {
					 $('#' + containerId + ' #raster-yx').val(ui.value);
				 }
			 });
		 	$container.find(' #raster-yz-slider').slider({
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
			 $container.find(' #raster-zx-slider').slider({
				 orientation: "horizontal",
				 range: "min",
				 min: 0,
				 max: 1,
				 step: 0.01,
				 value: config.raster.zx.opacity,
				 slide: function (event, ui) {
					 $('#' + containerId + ' #raster-zx').val(ui.value);
				 }
			 });
			 $container.find(' #raster-zy-slider').slider({
				 orientation: "horizontal",
				 range: "min",
				 min: 0,
				 max: 1,
				 step: 0.01,
				 value: config.raster.zy.opacity,
				 slide: function (event, ui) {
					 $('#' + containerId + ' #raster-zy').val(ui.value);
				 }
			 });

		 	$('.axes-img').each(function(e){
		 		var tmp = $(this).attr('alt');
		 		$(this).attr('src',Config.getDataPath()+'/'+tmp);
		 	});

			 if(!this.carousel){
				 this.carouselID = 'axes-type-carousel-'+Math.ceil(Math.random()*1000);
			 }
			 $container.find('#axes-type-carousel' ).attr('id',this.carouselID);
			 $container.find('#'+this.carouselID ).find('li').attr('data-target','#'+this.carouselID);
			 this.carousel = $container.find('#'+this.carouselID);
			 this.carousel.carousel({
				 interval: false
			 });
			 this.carousel.carousel( config.type );

			 $container.find('.nav-tabs a').click(function(e){
				 e.preventDefault();
				 $(this).tab('show');
				 var targetId = $(this ).attr('href');
				 $container.find('.tab-pane' ).removeClass('active');
				 $container.find( targetId ).addClass('active');
			 });

			 $container.find('.list-group-item.header' ).css('cursor','pointer');
			 $container.find('.list-group-item.header').click(function(){
				 var id = $(this).attr('id');
				 $('.'+id).slideToggle();
			 });
		 };
		});
