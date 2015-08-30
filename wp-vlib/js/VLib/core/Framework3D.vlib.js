define(
	['require', 'three', 'fontHelveticer'],
	function ( require, THREE ) {
		var Framework3D = Framework3D || function () {
			};
		Framework3D.WebGLRenderer = THREE.WebGLRenderer;
		Framework3D.WebGLRenderTarget = THREE.WebGLRenderTarget;
		Framework3D.CanvasRenderer = THREE.CanvasRenderer;
		Framework3D.Clock = THREE.Clock;
		Framework3D.PerspectiveCamera = THREE.PerspectiveCamera;
		Framework3D.Scene = THREE.Scene;
		Framework3D.Projector = THREE.Projector;
		Framework3D.PointLight = THREE.PointLight;
		Framework3D.Raycaster = THREE.Raycaster;
		//Framework3D.SVGRenderer = THREE_SVGRenderer;
		Framework3D.Geometry = THREE.Geometry;
		Framework3D.BufferGeometry = THREE.BufferGeometry;
		Framework3D.BufferAttribute = THREE.BufferAttribute;
		Framework3D.PlaneGeometry = THREE.PlaneGeometry;
		Framework3D.BoxGeometry = THREE.BoxGeometry;
		Framework3D.Mesh = THREE.Mesh;
		Framework3D.Object3D = THREE.Object3D;
		Framework3D.Vector3 = THREE.Vector3;
		Framework3D.Color = THREE.Color;
		Framework3D.Face3 = THREE.Face3;
		Framework3D.Texture = THREE.Texture;
		Framework3D.LineStrip = THREE.LineStrip;
		Framework3D.Line = THREE.Line;
		Framework3D.MeshBasicMaterial = THREE.MeshBasicMaterial;
		Framework3D.MeshLambertMaterial = THREE.MeshLambertMaterial;
		Framework3D.DoubleSide = THREE.DoubleSide;
		Framework3D.GeometryUtils = THREE.GeometryUtils;

		Framework3D.createLine = function ( geometry, type, properties ) {
			var material;
			switch ( type ) {
				case 'solid':
					material = new THREE.LineBasicMaterial( properties );
					break;
				case 'dotted':
					material = new THREE.LineDashedMaterial( properties );
					material.dashSize = 5;
					material.gapSize = 5;
					break;
				case 'dashed':
					material = new THREE.LineDashedMaterial( properties );
					material.dashSize = 15;
					material.gapSize = 5;
					break;
				default:
					material = new THREE.LineBasicMaterial( properties );
					break;
			}

			return new THREE.Line( geometry, material, THREE.LineStrip );
		};
		Framework3D.createLineFromTo = function ( from, to, type, properties ) {
			var geometry = new THREE.Geometry();
			geometry.vertices.push( from, to );
			return Framework3D.LineBasic( geometry, type );
		};
		Framework3D.Cube = function ( dimX, dimY, dimZ, color ) {

			var cube = new THREE.Object3D();

			var lineX1 = new Framework3D.Cylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( dimX, 0, 0 ), color );
			var lineX2 = lineX1.clone();
			lineX2.position.y = dimY;
			var lineX3 = lineX1.clone();
			lineX3.position.z = dimZ;
			var lineX4 = lineX3.clone();
			lineX4.position.y = dimY;

			var lineY1 = new Framework3D.Cylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, dimY, 0 ), color );
			var lineY2 = lineY1.clone();
			lineY2.position.x = dimX;
			var lineY3 = lineY1.clone();
			lineY3.position.z = dimZ;
			var lineY4 = lineY3.clone();
			lineY4.position.x = dimX;


			var lineZ1 = new Framework3D.Cylinder( new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, dimZ ), color );
			var lineZ2 = lineZ1.clone();
			lineZ2.position.x = dimX;
			var lineZ3 = lineZ1.clone();
			lineZ3.position.y = dimY;
			var lineZ4 = lineZ3.clone();
			lineZ4.position.x = dimX;

			cube.add( lineX1 );
			cube.add( lineX2 );
			cube.add( lineX3 );
			cube.add( lineX4 );

			cube.add( lineY1 );
			cube.add( lineY2 );
			cube.add( lineY3 );
			cube.add( lineY4 );

			cube.add( lineZ1 );
			cube.add( lineZ2 );
			cube.add( lineZ3 );
			cube.add( lineZ4 );

			return cube;
		};
		Framework3D.Cylinder = function ( from, to, color, diameter ) {

			var vstart = from.clone();
			var vend = to.clone();
			var HALF_PI = Math.PI * .5;
			var distance = vstart.distanceTo( vend );
			var position = vend.clone().add( vstart ).divideScalar( 2 );
			var d = (diameter === undefined) ? 2 : diameter;

			var material = new THREE.MeshBasicMaterial( {
				color          : color,
				vertexColors   : THREE.VertexColors,
				side           : THREE.DoubleSide,
				depthWrite     : true,
				depthTest      : true,
				shininess      : 50,
				ambient        : 0xff0000,
				reflectivity   : 1.0,
				refractionRatio: 0.5

			} );
			var cylinder = new THREE.CylinderGeometry( d, d, distance, 10, 1, true );

			var orientation = new THREE.Matrix4();
			var offsetRotation = new THREE.Matrix4();
			var offsetPosition = new THREE.Matrix4();
			orientation.lookAt( vstart, vend, new THREE.Vector3( 0, 1, 0 ) );
			offsetRotation.makeRotationX( HALF_PI );
			orientation.multiply( offsetRotation );
			cylinder.applyMatrix( orientation );

			var mesh = new THREE.Mesh( cylinder, material );
			mesh.position.x = (vend.x - vstart.x) / 2;
			mesh.position.y = (vend.y - vstart.y) / 2;
			mesh.position.z = (vend.z - vstart.z) / 2;
			return mesh;
		};
		Framework3D.Cone = function ( from, to, color, diameter ) {

			var vstart = from.clone();
			var vend = to.clone();
			var HALF_PI = Math.PI * .5;
			var distance = vstart.distanceTo( vend );
			var position = vend.clone().add( vstart ).divideScalar( 2 );
			var d = (diameter === undefined) ? 2 : diameter;

			var material = new THREE.MeshBasicMaterial( {
				color          : color,
				vertexColors   : THREE.VertexColors,
				side           : THREE.DoubleSide,
				depthWrite     : true,
				depthTest      : true,
				shininess      : 50,
				ambient        : 0xff0000,
				reflectivity   : 1.0,
				refractionRatio: 0.5

			} );
			var cylinder = new THREE.CylinderGeometry( 0, d, distance, 10, 1, true );

			var orientation = new THREE.Matrix4();
			var offsetRotation = new THREE.Matrix4();
			var offsetPosition = new THREE.Matrix4();
			orientation.lookAt( vstart, vend, new THREE.Vector3( 0, 1, 0 ) );
			offsetRotation.makeRotationX( HALF_PI );
			orientation.multiply( offsetRotation );
			cylinder.applyMatrix( orientation );

			var mesh = new THREE.Mesh( cylinder, material );
			mesh.position.x = (vend.x - vstart.x) / 2;
			mesh.position.y = (vend.y - vstart.y) / 2;
			mesh.position.z = (vend.z - vstart.z) / 2;
			return mesh;
		};
		Framework3D.StaticLabel = function ( canvas, w, h ) {

			var texture = new THREE.Texture( canvas );
			texture.needsUpdate = true;
			var planeMaterial = new THREE.MeshBasicMaterial( {
				map        : texture,
				transparent: true,
				depthWrite: true,
				depthTest: true
			} );

			var textMesh = new THREE.Mesh( new THREE.PlaneGeometry(
				w, h ), planeMaterial );
			return textMesh;
		};
		Framework3D.DynamicLabel = function ( canvas, w, h ) {
			var texture = new THREE.Texture( canvas );
			texture.needsUpdate = true;
			var spriteMaterial = new THREE.SpriteMaterial( {
				map: texture,
				fog: true
			} );
			var sprite = new THREE.Sprite( spriteMaterial );
			sprite.scale.set( w, h, 1.0 );

			return sprite;
		};
		Framework3D.createText = function ( text, parameters ) {
			var p = {
				color         : parameters.color || 0x000000,
				depthWrite    : parameters.depthWrite || true,
				depthTest     : parameters.dephTest || true,
				size          : parameters.size || 20,
				height        : 0,
				font          : 'helvetiker',
				weight        : 'normal',
				style         : 'normal',
				bevelEnabled  : false,
				bevelThickness: 0,
				bevelSize     : 0,
				curveSegments : 6
			};
			var shape = new THREE.TextGeometry( text, p );
			var material = new THREE.MeshBasicMaterial( {
				color: p.color
			} );
			var textMesh = new THREE.Mesh( shape, material );
			return textMesh;
		};
		Framework3D.getGeometryDimensions = function ( geometry ) {
			geometry.computeBoundingBox();
			var borders = geometry.boundingBox;
			var width = Math.abs( borders.min.x ) + Math.abs( borders.max.x );
			var height = Math.abs( borders.min.y ) + Math.abs( borders.max.y );
			return {
				width : width,
				height: height
			};
		};
		Framework3D.createCanvas = function ( text, width, height, color, angle ) {
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
			context.fillStyle = color;
			var ctext = text.split( "" ).join( String.fromCharCode( 8202 ) )
			context.fillText( ctext, 0, 0 );
			context.translate( -tx, -ty );
			context.setTransform( PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0 );
		};
		/**
		 * This implementation of bounding box takes relative
		 * positions of child objects into account
		 * @param object
		 * @returns {THREE.Box3}
		 */
		Framework3D.getBoundingBox = function ( object ) {
			"use strict";

			var minX,minY,minZ,maxX,maxY,maxZ;
			minX = minY = minZ = Infinity;
			maxX = maxY = maxZ = -Infinity;

			if ( object instanceof THREE.Object3D ) {

				object.traverse( function ( mesh ) {
					//console.log(mesh);
					if ( mesh.hasOwnProperty('geometry') && mesh.geometry.hasOwnProperty('boundingBox') ) {
						mesh.geometry.computeBoundingBox();
						mesh.geometry.computeBoundingSphere();
						var box = mesh.geometry.boundingBox.clone();
						// overall box
						minX = Math.min( minX, box.min.x +mesh.position.x );
						minY = Math.min( minY, box.min.y +mesh.position.y);
						minZ = Math.min( minZ, box.min.z +mesh.position.z);
						maxX = Math.max( maxX, box.max.x +mesh.position.x);
						maxY = Math.max( maxY, box.max.y +mesh.position.y);
						maxZ = Math.max( maxZ, box.max.z +mesh.position.z);
						//console.log("minx= %s, maxx= %s box.min= %s, box.max= %s, mesh.position= %s",minX,maxX,box.min.x,box.max.x,mesh.position.x);
					}
				} );
			}
			var boxMin = new THREE.Vector3( minX, minY, minZ );
			var boxMax = new THREE.Vector3( maxX, maxY, maxZ );
			var b = new THREE.Box3( boxMin, boxMax );
			return b;
		};
		/*
		Framework3D.getBoundingBox = function ( object ) {
			"use strict";
			if ( object instanceof THREE.Object3D ) {
				var box;
				if( object.hasOwnProperty('boundingBox')){
					object.geometry.computeBoundingBox();
					box = object.geometry.boundingBox.clone();
				}else{
					box = new THREE.Box3(new THREE.Vector3(Infinity, Infinity, Infinity),new THREE.Vector3(-Infinity, -Infinity, -Infinity));
				}

				object.traverse( function ( child ) {
					//console.log(mesh);
					if ( child.hasOwnProperty('geometry') && child.geometry.hasOwnProperty('boundingBox') ) {
						child.geometry.computeBoundingBox();
						var childbox = child.geometry.boundingBox.clone();
						childbox.translate( child.localToWorld( new THREE.Vector3() ));
						box.union( childbox );
					}
				} );


			}
			return box;
		};
		 */
		Framework3D.sceneRemoveObjects = function( scene, objects ){
			"use strict";
			for(var i = 0, len = objects.length; i < len; ++i){
				scene.remove(objects[ i ]);
			}
		};


		return Framework3D;
	} );
