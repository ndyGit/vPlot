define(
	[ 'require','config', 'jquery'],
	function(require,Config, $) {
		var xScaleDefault = Config.defaults.scale.x;
		var yScaleDefault = Config.defaults.scale.y;
		var zScaleDefault = Config.defaults.scale.z;
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
		 	var context = this;

		 	if(context.updateSizeActivity)
		 		context.updateSizeActivity.start();

		 	if (config === '') {
		 		config = {};
		 	}
		 	if (config.name === undefined){
		 		config.name = this.defaults.name;
		 	}
		 	if (config.material === undefined){
		 		config.material = {};
		 	}
		 	if(config.material.type === undefined){
		 		config.material.type = this.defaults.type;
		 	}
		 	if(config.material.particleSize === undefined){
		 		config.material.particleSize = this.defaults.size;
		 	}
		 	if(config.material.opacity === undefined){
		 		config.material.opacity = this.defaults.opacity;
		 	}
		 	if(config.material.colors === undefined){
		 		config.material.colors = this.defaults.colors;
		 	}
		 	if(config.material.sizeAttenuation === undefined){
		 		config.material.sizeAttenuation = this.defaults.sizeAttenuation;
		 	}
		 	if (config.scale === undefined){
		 		config.scale = {};
		 	}
		 	if(config.scale.x === undefined){
		 		config.scale.x = this.defaults.xScale;
		 	}
		 	if(config.scale.y === undefined){
		 		config.scale.y = this.defaults.yScale;
		 	}
		 	if(config.scale.z === undefined){
		 		config.scale.z = this.defaults.zScale;
		 	}

			 $container.find('#name').val( unescape(config.name));
			 $container.find('#material').val( config.material.type);
			 $container.find('#materialSelect').val(config.material.type).attr('selected', 'selected');

			 $container.find('#particleSize').val( config.material.particleSize);

			 $container.find('#opacity').val( config.material.opacity);

			 $container.find(' #image').val( config.material.image);
			 $container.find('#iamgeSelect').val(config.material.image).attr('selected', 'selected');


		 	if(config.material.blending === true){
			    $container.find(' #blending').attr('checked','checked');
		 	}


		 	if(config.material.transparent === true){
			    $container.find(' #transparent').attr('checked','checked');
		 	}

		 	if(config.material.colors === true){
			    $container.find('#colors').attr('checked','checked');
		 	}
		 	if(config.material.sizeAttenuation === true){
			    $container.find('#sizeAttenuation').attr('checked','checked');
		 	}


			 $container.find(' #xScale').val(config.scale.x);


			 $container.find( ' #yScale').val(config.scale.y);


			 $container.find(' #zScale').val(config.scale.z);



			 $container.find(' #particleSizeSlider').slider({
		 		orientation: 'horizontal',
		 		range: 'min',
		 		min: 1,
		 		max: 200,
		 		value: config.material.particleSize,
		 		slide: function (event, ui) {
				    $container.find('#particleSize').val(ui.value);
		 			if(context.interactiveObject !== undefined){
		 				context.interactiveObject.material.size = ui.value;
		 				context.interactiveObject.userData.size = ui.value;
		 			}
		 		}
		 	});

			 $container.find(' #opacitySlider').slider({
		 		orientation: 'horizontal',
		 		range: 'min',
		 		min: 0,
		 		max: 100,
		 		value: config.material.opacity*100,
		 		slide: function (event, ui) {
		 			$('#' + containerId ).find('#opacity').val(ui.value/100);
		 			if(context.interactiveObject !== undefined){
		 				context.interactiveObject.material.opacity = ui.value/100;
		 			}
		 		}
		 	});
			 $container.find(' #iamgeSelect').change(function(){

		 		var selected = $(this).find('option:selected');
		 		$('#' + containerId ).find(' #image').val(selected.val());
		 		if(context.interactiveObject !== undefined){
		 			context.interactiveObject.material.map = THREE.ImageUtils.loadTexture(Config.getDataPath()+'/'+selected.val());
		 		}
		 	});
			 $container.find(' #materialSelect').change(function(){
		 		var selected = $(this).find('option:selected');
		 		$('#' + containerId ).find(' #material').val(selected.val());
		 	});
		 	if(context.interactiveObject !== undefined){
		 		var material = context.interactiveObject.material;
		 		var geometry = context.interactiveObject.geometry;
			    $container.find('#colors').on('change',function(){
		 			if($(this).is(':checked')){
		 				material.vertexColors = true;
		 				geometry.attributes.color.needsUpdate = true;
		 				geometry.colorsNeedUpdate = true;

		 			}else{
		 				material.vertexColors = false;
		 				geometry.attributes.color.needsUpdate = true;
		 				geometry.colorsNeedUpdate = true;
		 			}
		 		});
		 	};
			 $container.find('.nav-tabs a').click(function(e){
				 e.preventDefault();
				 $(this).tab('show');
				 var targetId = $(this ).attr('href');
				 $container.find('.tab-pane' ).removeClass('active');
				 $container.find( targetId ).addClass('active');
			 });
		 };
		});
