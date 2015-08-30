/**
 * Created by Andreas Gratzer on 21/11/14.
 */
define( ['require', './getConfig.vlib', './setConfig.vlib', 'config',
		'core/Animation.vlib', 'core/Utils.vlib',
		'jquery', 'text!./label.html', 'plugins/plugins_3d/mouse/mouse.vlib'],
	function ( require, getConfig, setConfig, Config, Animation, UTILS, $, ACTIVITY_LABEL, MousePlugin ) {
		"use strict";
		var LabelController = function (  env, bufferMangager ) {
			this.id = 'label-'+Math.ceil(Math.random() * 1000);
			this.env = env;
			this.bufferManager = bufferMangager;
			this.customText = unescape(this.env.config.customText);
			this.animation = this.env.config.animation;
			this.position = this.env.config.position;
			this.offset = this.env.config.offset;

			this.$label = $( ACTIVITY_LABEL );

			this.$headerContainer = this.$label.find( '.panel-heading' );
			this.$contentContainer = this.$label.find( '.panel-body' );

			this.intersectionArgs = false;
			this.rendererActivity = false;

			this.isVisible = false;


			this.addLabel();

			this.onComplete = function (){/* noop */};

			this.destroy = function(){
				this.hideLabel();
				if ( this.rendererActivity ) {
					this.rendererActivity.stop();
				}
			};

		};

		LabelController.prototype.addLabel = function(){
			this.$label.attr('id', this.id);
			$('#'+this.env.config.container ).append( this.$label );
		};

		LabelController.prototype.removeLabel = function(){
			$('#'+this.env.config.container ).find('#'+this.id ).remove();
		};

		LabelController.prototype.showLabel = function () {
			if ( !this.isVisible ) {
				switch( this.animation ){
					case 'show' :
						this.$label.show();
						break;
					case 'slide' :
						this.$label.slideDown();
						break;
					case 'fade' :
						this.$label.fadeIn();
						break;
					default :
						this.$label.slideDown();
						break;
				}
			}
			this.isVisible = true;
		};

		LabelController.prototype.hideLabel = function () {

			switch( this.animation ){
				case 'show' :
					this.$label.hide();
					break;
				case 'slide' :
					this.$label.slideUp();
					break;
				case 'fade' :
					this.$label.fadeOut();
					break;
				default :
					this.$label.slideUp();
					break;
			}
			this.isVisible = false;
		};

		LabelController.prototype.setLabelHeader = function( header ){
			this.$headerContainer.html( header );
		};

		LabelController.prototype.setLabelContent = function( content ){
			this.$contentContainer.html( content );
		};
		LabelController.prototype.appendLabelContent = function( content ){
			this.$contentContainer.append( content );
		};

		LabelController.prototype.setIntersectionArgs = function ( args ) {
			this.intersectionArgs = args;
		};


		LabelController.prototype.updateLabelPosition = function () {

			var offsetLeft, offsetTop;

			switch ( this.position ) {
				case 'mouse' :

					this.$label.css( {
						'top'     : '0px',
						'left'    : '0px',
						'position': 'absolute!important'
					} );

					offsetLeft = this.intersectionArgs.event.pageX + this.offset.x;
					offsetTop = this.intersectionArgs.event.pageY + this.offset.y;

					this.$label.offset( {
						left: offsetLeft,
						top : offsetTop
					} );

					break;
				case 'static-top-left' :

					this.$label.css( {
						'top' : this.offset.y + 'px',
						'left': this.offset.x + 'px'
					} );

					break;
				case 'static-bottom-left' :

					this.$label.css( {
						'bottom': this.offset.y + 'px',
						'left'  : this.offset.x + 'px'
					} );

					break;
				case 'static-top-right' :

					this.$label.css( {
						'top' : this.offset.y + 'px',
						'right': this.offset.x + 'px'
					} );

					break;
				case 'static-bottom-right' :

					this.$label.css( {
						'bottom': this.offset.y + 'px',
						'right'  : this.offset.x + 'px'
					} );

					break;
			}
		};

		LabelController.prototype.start = function () {
			var container = $( '#' + this.env.config.container ).find( Config.PLOT_CONTAINER ).attr( 'id' );
			var objectBuffer, hitIndex, data, _RAW_DATA_ = Config.BUFFER.RAW_DATA;
			var object = this.intersectionArgs.intersection.object;

			var face, numVertices, numGeometries, dataIndex,
				metadata, closest, intersectionPoint, distances, tmpDist;

			var objectId, objectName;

			if ( object.userData.id ) {
				/* Common Object3D ??? */
				objectBuffer = this.bufferManager.getBuffer( object.userData.id );
				objectId = object.userData.id;
				objectName = object.userData.name;
			} else {

				/* GROUP / Multimaterial Object ??? */
				if ( object.parent && object.parent.children.length !== 0 ) {
					objectId = object.parent.userData.id;
					objectName = object.parent.userData.name;
					objectBuffer = this.bufferManager.getBuffer( object.parent.userData.id );
				} else {
					console.log( object );
					console.warn( "[ Label ] object id not found!" );
					return;
				}
			}

			metadata = objectBuffer.getAttribute( Config.BUFFER.METADATA ).array;
			data = objectBuffer.getAttribute( _RAW_DATA_ );


			if ( metadata && metadata.numGeometries ) {
				numGeometries = metadata.numGeometries;
			} else {
				numGeometries = 1;
			}

			/* particle? */
			if ( !isNaN(this.intersectionArgs.intersection.index) ) {
				hitIndex = this.intersectionArgs.intersection.index;
				//console.log('hitIndex=%s',hitIndex);
				//console.log(data.array);
				if ( hitIndex !== undefined && hitIndex !== -1 && this.bufferManager.isBuffer( objectId ) ) {
					//console.log(data.array[hitIndex]);
					this.$contentContainer.html( this.customText + '<br />' + data.array[hitIndex].label );
				}
				/* face? */
			} else if ( this.intersectionArgs.intersection.faceIndex && this.intersectionArgs.intersection.face ) {
				numVertices = object.geometry.vertices.length -1;
				var numGeometryVertices = numVertices / numGeometries;
				hitIndex = this.intersectionArgs.intersection.faceIndex;
				if ( hitIndex && hitIndex !== -1 && this.bufferManager.isBuffer( objectId ) ) {
					/* get closest point from intersected face */
					face = this.intersectionArgs.intersection.face;
					intersectionPoint = this.intersectionArgs.intersection.point;
					// calculate distances between intersection point and intersected face-vertices
					distances = [];
					distances.push( intersectionPoint.distanceTo( object.geometry.vertices[face.a] ) );
					distances.push( intersectionPoint.distanceTo( object.geometry.vertices[face.b] ) );
					distances.push( intersectionPoint.distanceTo( object.geometry.vertices[face.c] ) );

					// Find closes face-vertext to intersection point
					closest = face.a;
					tmpDist = distances[0];
					if ( tmpDist > distances[1] ) {
						tmpDist = distances[1];
						closest = face.b;
					}
					if ( tmpDist > distances[2] ) {
						tmpDist = distances[2];
						closest = face.c;
					}
					// Closest vertext to raw data index
					if ( numGeometries > 1 ) {
						dataIndex = Math.ceil( closest / numGeometryVertices ) - 1;

					} else {
						dataIndex = closest - 1;
					}

					//console.log('numVertices %s, numGeometries %s',numVertices,numGeometries);
					//console.log(face);
					//console.log( 'closest: %s, dataIndex: %s',closest, dataIndex );

					if ( dataIndex < 0 ) {
						dataIndex = 0;
					}

					// Set raw data label
					this.setLabelContent('');
					if ( this.env.config.useDataLabel ) {
						this.appendLabelContent( data.array[ dataIndex ].label + '<br />' );
					}
					this.appendLabelContent( this.customText );

				}
			}
			/* Create new activity */
			if ( !this.rendererActivity ) {

				this.rendererActivity = new UTILS.ACTIVITY.RENDERER.Activity(
					container,
					this.intersectionArgs.intersection.object,
					function () {
						//console.log(this.intersectionArgs.intersection);
						this.setLabelHeader( objectName );
						this.updateLabelPosition();
						this.showLabel();
						//this.destroy();
					},
					this
				);

			}
			/* Attach activity to render loop */
			this.rendererActivity.start();

			return true;
		};


		return LabelController;
	} );