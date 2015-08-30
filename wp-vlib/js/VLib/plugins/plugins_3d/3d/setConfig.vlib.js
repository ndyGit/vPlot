define(
	[ 'require', 'jquery','three'],
	function(require, $) {
		return function(config, containerId) {
			var c = $('#'+containerId);
			if (config === undefined ){
				config = {
					scene : {width:'auto',height:'auto'},
					alpha : false,
					antialias : true
				};
			}
			if(config.scene === undefined){
				config.scene =  {width:'auto',height:'auto'};
			}
			if(config.camera === undefined){
				config.camera =  {x:0,y:0,z:1000};
			}
			if (config.antialias !== undefined) {
				if(config.antialias === true){
					c.find('#antialias').attr('checked','checked');
				}
			}
			if (config.alpha !== undefined) {
				if(config.alpha === true){
					$('#' + containerId + ' #alpha').attr('checked','checked');
				}
			}
			if (config.scene.width !== undefined) {
				c.find('#sceneWidth')
				.val(config.scene.width);
			} else {
				c.find('#sceneWidth')
				.val(this.sceneWidthDefault);
			}
			if (config.scene.height !== undefined) {
				c.find('#sceneHeight')
				.val(config.scene.height);
			} else {
				c.find('#sceneHeight')
				.val(this.sceneHeightDefault);
			}

			if ( config.envmap === undefined ) {
				config.envmap = this.defaultEnvmap;
			}

			c.find( 'select[id=envmapSelect] option[value=' + config.envmap + ']' ).attr( 'selected', 'selected' );

			var $getCam = c.find('#getcam');
			var $setCam = c.find('#setcam');
			var $lookAt = c.find('#setLookAt');

			/* INTERACTIVE */
			var context = this;

			$lookAt.click(function(){
				"use strict";
				context.env.camera.lookAt(new THREE.Vector3(
					c.find('#camXLookAt').val(),
					c.find('#camYLookAt').val(),
					c.find('#camZLookAt').val()
				));
			});


		};
	});
