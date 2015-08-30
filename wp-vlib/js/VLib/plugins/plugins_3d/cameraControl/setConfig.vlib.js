define(
	['require', 'jquery', 'three'],
	function ( require, $ ) {

		var cam2form = function( $container, camera, cam ){
			"use strict";

			cam.position.x = camera.position.x;
			cam.position.y = camera.position.y;
			cam.position.z = camera.position.z;

			cam.rotation.x = camera.rotation.x;
			cam.rotation.y = camera.rotation.y;
			cam.rotation.z = camera.rotation.z;

			cam.up.x = camera.up.x;
			cam.up.y = camera.up.y;
			cam.up.z = camera.up.z;

			$container.find('#camera-pos-rot-up' ).val(JSON.stringify(cam));
		};
		var camUP2form = function( $container, camera, cam ){
			"use strict";

			cam.up.x = camera.up.x;
			cam.up.y = camera.up.y;
			cam.up.z = camera.up.z;

			$container.find('#camera-pos-rot-up' ).val(JSON.stringify(cam));
		};
		return function ( config, containerId ) {
			"use strict";
			var context = this;
			var cam = {};
			var $container = $( '#' + containerId );


			if ( config === undefined || config === "" ) {
				config = {};
			}
			if ( config.position === undefined ) {
				config.position = {
					x: this.defaults.position.x,
					y: this.defaults.position.y,
					z: this.defaults.position.z};
			}
			if ( config.rotation === undefined ) {
				config.rotation = {
					x: this.defaults.rotation.x,
					y: this.defaults.rotation.y,
					z: this.defaults.rotation.z};
			}
			if ( config.up === undefined ) {
				config.up = {
					x: this.defaults.up.x,
					y: this.defaults.up.y,
					z: this.defaults.up.z};
			}
			if ( config.lookAt === undefined ) {
				config.lookAt = {
					x: this.defaults.lookAt.x,
					y: this.defaults.lookAt.y,
					z: this.defaults.lookAt.z};
			}
			if ( config.useCC === undefined ) {
				config.useCC = this.defaults.useCC;
			}

			// set camera config
			cam.position = config.position;
			cam.rotation = config.rotation;
			cam.up = config.up;
			$container.find('#camera-pos-rot-up' ).val(JSON.stringify(cam));

			//lookAt
			if ( config.lookAt.x !== undefined ) {
				$container.find( '#lookAt-x' ).val( config.lookAt.x );
			} else {
				$container.find( '#lookAt-x' ).val( this.defaults.lookAt.x );
			}
			if ( config.lookAt.y !== undefined ) {
				$container.find( '#lookAt-y' ).val( config.lookAt.y );
			} else {
				$container.find( '#lookAt-y' ).val( this.defaults.lookAt.y );
			}
			if ( config.lookAt.z !== undefined ) {
				$container.find( '#lookAt-z' ).val( config.lookAt.z );
			} else {
				$container.find( '#lookAt-z' ).val( this.defaults.lookAt.z );
			}

			if(config.useCC === true){
				$container.find('#use-mouse-controller').attr('checked', 'checked');
				$container.find('#cc-container' ).slideDown();
			}
			$container.find('#use-mouse-controller' ).click(function(){
				if($(this ).is(':checked')){
					$container.find('#cc-container' ).slideDown();
				}else{
					$container.find('#cc-container' ).slideUp();
				}
			});


			if(config.up.x === 1){
				$container.find('#cc-upX' ).addClass('btn-success');
			}else if(config.up.y === 1){
				$container.find('#cc-upY' ).addClass('btn-success');
			}else{
				$container.find('#cc-upZ' ).addClass('btn-success');
			}


			$container.find('#cc-upX' ).click(function(){
				context.cameraUp('x');
				cam2form($container, context.camera, cam);
				$container.find($('[id^=cc-up]') ).removeClass('btn-success');
				$container.find('#cc-upX' ).addClass('btn-success');
			});
			$container.find('#cc-upY' ).click(function(){
				context.cameraUp('y');
				cam2form($container, context.camera, cam);
				$container.find($('[id^=cc-up]') ).removeClass('btn-success');
				$container.find('#cc-upY' ).addClass('btn-success');
			});
			$container.find('#cc-upZ' ).click(function(){
				context.cameraUp('z');
				cam2form($container, context.camera, cam);
				$container.find($('[id^=cc-up]') ).removeClass('btn-success');
				$container.find('#cc-upZ' ).addClass('btn-success');
			});

			var rcpTextContainer = $container.find('#cc-pos span' ).first();
			$container.find('#cc-pos' ).click(function(){
				cam2form($container, context.camera, cam);
				rcpTextContainer.html("Done");
				$container.find('#remember-camera-position' ).fadeIn("slow",function(){
					rcpTextContainer.html("Remember current camera position");
					$container.find('#remember-camera-position' ).fadeOut();
				});
			});




			//Type
			if ( config.controlType === undefined ) {
				config.controlType = this.defaults.controlType;

			}

			$container.find( 'select[id=controlTypeSelect] option[value=' + config.controlType + ']' ).attr( 'selected', 'selected' );

		};

	} );
