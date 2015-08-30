/**
 * Created by Andreas Gratzer on 24/11/14.
 */
define( ['require', 'config', 'core/Utils.vlib', 'jquery', 'core/Framework3d.vlib'],
	function ( require, Config, UTILS, $, F3D ) {
		"use strict";
		var FirstPersonControls = function ( camera, $container, config ) {

			this.camera = camera;
			this.$container = $container;
			this.config = config;

			this.domElement = $container.get(0);

			this.target = new F3D.Vector3( config.lookAt.x, config.lookAt.y, config.lookAt.z );
			this.rotation = new F3D.Vector3( 0, 0, 0 );
			this.rotationSpeed = 0.5;

			this.mouseMovement = {x:0,y:0};
			this.PI_2 = Math.PI / 2;

			/* MOVEMENT FLAGS */
			this.moveForward = false;
			this.moveBackward = false;
			this.moveLeft = false;
			this.moveRight = false;
			this.moveUp = false;
			this.moveDown = false;

			this.mouseActive = false;

			var context = this;

			this.bindMouseMove = function(){
				context.onMouseMove.apply( context, arguments );
			};
			this.bindMouseDown = function(){
				context.onMouseDown.apply( context, arguments );
			};
			this.bindMouseUp = function(){
				context.onMouseUp.apply( context, arguments );
			};
			this.bindKeyDown = function(){
				context.onKeyDown.apply( context, arguments );
			};
			this.bindKeyUp = function(){
				context.onKeyUp.apply( context, arguments );
			};


			this.camera.lookAt( this.target );
			this.init();
		};

		FirstPersonControls.prototype.update = function( e ){
			this.updateCameraPosition( e );
			this.updateCameraRotation( e );
		};

		FirstPersonControls.prototype.init = function( ){
			var that = this;
			this.domElement.addEventListener( 'mousemove', that.bindMouseMove, false );
			this.domElement.addEventListener( 'mousedown', that.bindMouseDown, false );
			this.domElement.addEventListener( 'mouseup', that.bindMouseUp, false );
			window.addEventListener( 'keydown', that.bindKeyDown, false );
			window.addEventListener( 'keyup', that.bindKeyUp, false );

			//context.camera.rotation.order = 'YXZ';
		};

		FirstPersonControls.prototype.stop = function( ){
			var that = this;
			this.$container.css( "cursor", "default" );
			this.domElement.removeEventListener('mousemove', that.bindMouseMove);
			this.domElement.removeEventListener('mousedown', that.bindMouseDown);
			this.domElement.removeEventListener('mouseup', that.bindMouseUp);
			this.domElement.removeEventListener('keydown', that.bindKeyDown);
			this.domElement.removeEventListener('keyup', that.bindKeyUp);
		};

		FirstPersonControls.prototype.onMouseMove = function ( e ) {

			e.preventDefault();
			e.stopPropagation();

			if ( !this.mouseActive ) {
				return;
			}

			this.mouseMovement.x = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
			this.mouseMovement.y = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

			//var quadrant = UTILS.ACTIVITY.MOUSE.absoluteToRelativeMouseCoords( this.$container, e );


			/*
			 this.mouse.push( new F3D.Vector3(e.clientX, e.clientY) );
			 if( this.mouse.length < 2 ){
			 return;
			 }
			 // get difference to last mouse position
			 var m2 = this.mouse.pop();
			 var m1 = this.mouse.pop();
			 var diffX = m1.x - m2.x;
			 var diffY = m1.y - m2.y;

			 console.log("DIFF: %s %s", diffX, diffY);

			 if( diffX < 0){
			 this.rotation.y = -this.rotationSpeed;
			 }else if( diffX > 0){
			 this.rotation.y = this.rotationSpeed;
			 }

			 if( diffY < 0){
			 this.rotation.x = -this.rotationSpeed;
			 }else if( diffY > 0){
			 this.rotation.x = this.rotationSpeed;
			 }
			 */

		};

		FirstPersonControls.prototype.updateCameraRotation = function ( ) {

			if ( !this.mouseActive ) {
				return;
			}
			this.camera.up.x = this.config.up.x;
			this.camera.up.y = this.config.up.y;
			this.camera.up.z = this.config.up.z;

			console.log(this.camera.up);
			if(this.config.up.x === 1){
				this.camera.rotation.x -= this.mouseMovement.x * 0.002;
				this.camera.rotation.y += this.mouseMovement.y * 0.002;
				//this.camera.rotation.x = Math.max( - this.PI_2, Math.min( this.PI_2, this.camera.rotation.x ) );
			}else if(this.config.up.y === 1){
			//	this.camera.rotation.x -= this.mouseMovement.y * 0.002;
				this.camera.rotation.y -= this.mouseMovement.x * 0.002;
				this.camera.rotation.x = Math.max( - this.PI_2, Math.min( this.PI_2, this.camera.rotation.x ) );
			}else{
				this.camera.rotation.x -= this.mouseMovement.x * 0.002;
				this.camera.rotation.y += this.mouseMovement.y * 0.002;
			}

			this.camera.up.x = this.config.up.x;
			this.camera.up.y = this.config.up.y;
			this.camera.up.z = this.config.up.z;


		};

		FirstPersonControls.prototype.updateCameraPosition = function ( ) {

			if ( this.moveForward ) {

				this.camera.translateZ( -10 );
			}

			if ( this.moveBackward ) {
				this.camera.translateZ( 10 );
			}

			if ( this.moveLeft ) {
				this.camera.translateX( -10 );
			}

			if ( this.moveRight ) {
				this.camera.translateX( 10 );
			}

			if ( this.moveUp ) {
				this.camera.translateY( 10 );
			}

			if ( this.moveDown ) {
				this.camera.translateY( -10 );
			}
		};

		FirstPersonControls.prototype.onMouseDown = function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			this.mouseActive = true;
			this.$container.css( "cursor", "none" );
		};

		FirstPersonControls.prototype.onMouseUp = function ( e ) {
			e.preventDefault();
			e.stopPropagation();

			this.mouseActive = false;
			this.$container.css( "cursor", "default" );
		};

		FirstPersonControls.prototype.onKeyDown = function ( e ) {
			switch ( e.keyCode ) {

				case 38: /*up*/
				case 87: /*W*/
					this.moveForward = true;
					break;

				case 37: /*left*/
				case 65: /*A*/
					this.moveLeft = true;
					break;

				case 40: /*down*/
				case 83: /*S*/
					this.moveBackward = true;
					break;

				case 39: /*right*/
				case 68: /*D*/
					this.moveRight = true;
					break;

				case 82: /*R*/
					this.moveUp = true;
					break;
				case 70: /*F*/
					this.moveDown = true;
					break;

			}
		};

		FirstPersonControls.prototype.onKeyUp = function ( e ) {
			switch ( e.keyCode ) {

				case 38: /*up*/
				case 87: /*W*/
					this.moveForward = false;
					break;

				case 37: /*left*/
				case 65: /*A*/
					this.moveLeft = false;
					break;

				case 40: /*down*/
				case 83: /*S*/
					this.moveBackward = false;
					break;

				case 39: /*right*/
				case 68: /*D*/
					this.moveRight = false;
					break;

				case 82: /*R*/
					this.moveUp = false;
					break;
				case 70: /*F*/
					this.moveDown = false;
					break;

			}
		};




		FirstPersonControls.prototype.deg2rad = function ( deg ) {
			return deg * Math.PI / 180;
		};


		return FirstPersonControls;

	} );