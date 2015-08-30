define([ 'require', 'config', 'core/Utils.vlib', 'three', 'jquery'],
	function(require, Config,UTILS,THREE, $) {
		var Wrapper = {
			getSurface : function(width, height, color, opacity ){
				return new THREE.Mesh(new THREE.PlaneGeometry(width, height,1,1), new THREE.MeshBasicMaterial({
					color : color,
					depthWrite: false,
					depthTest: false,
					transparent : false,
					opacity : opacity
				}));
			},
			getClickLabel : function(width, height, text){
				var text =  Wrapper.getText(text,{
					depthWrite: false,
					depthTest: false,
					size : width,
					height : 0,
					font : 'helvetiker',
					weight : 'normal',
					style : 'normal',
					bevelEnabled : false,
					bevelThickness : 0,
					bevelSize : 0,
					curveSegments: 6
				});
				text.rotateZ(-90*Math.PI / 180);
				return text;
			},
			getText : function(text, parameters){

				var shape = new THREE.TextGeometry(text, parameters);
				var material = new THREE.MeshBasicMaterial({color: 0xffffff,depthWrite: false,depthTest: false});
				var textMesh = new THREE.Mesh(shape, material);
				return textMesh;
			},


			/**
			 * Multiline Text with canvas. Embedded within a THREE.Sprite.
			 *
			 *
			 *
			 * @param width
			 * @param height
			 * @param text
			 * @param angle
			 * @param color
			 * @returns {THREE.Sprite}
			 */
			getTextCanvas : function(width, height, text, angle,color){


				var canvas = document.createElement('canvas');
				var PIXEL_RATIO = (function (ctx) {
					var dpr = window.devicePixelRatio || 1,
					bsr = ctx.webkitBackingStorePixelRatio ||
					ctx.mozBackingStorePixelRatio ||
					ctx.msBackingStorePixelRatio ||
					ctx.oBackingStorePixelRatio ||
					ctx.backingStorePixelRatio || 1;

					return dpr / bsr;
				})(canvas);

				var context = canvas.getContext('2d');
				var metric = context.measureText(text);
				canvas.width = width;
				canvas.height = height;

				var tx = width/2;
				var ty = 20;
				var maxWidth = width - 20;
				var maxLines = 6;

				//context.translate(tx,ty);
				context.rotate(angle);

				context.textBaseline = "middle";
				context.textAlign = "center";
				context.font = "14px Helvetica";
				context.fillStyle = color;


				//http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
				var lineHeight = 18;
				var lineCnt = 0;
				text = text.replace("<br/>"," <NEWLINE> ");
				text = text.replace("<br />"," <NEWLINE> ");
				text = text.replace("\n"," <NEWLINE> ");

				var ctext = text;// text.split("").join(String.fromCharCode(8202));
				var words = ctext.split(' ');
				var line = '';
				for(var n = 0; n < words.length; n++) {
					if(words[n] === '<NEWLINE>'){
						context.fillText(line, tx, ty);
						line = ' ';
						ty += lineHeight;
						lineCnt++;
						if(lineCnt === maxLines){
							break;
						}else{
							continue;
						}

					};
					var testLine = line + words[n] + ' ';
					var metrics = context.measureText(testLine);
					var testWidth = metrics.width;

					if (testWidth > maxWidth && n > 0) {
						if(lineCnt === maxLines){
							break;
						}
						context.fillText(line, tx, ty);
						line = words[n] + ' ';
						ty += lineHeight;
						lineCnt++;
					}
					else {
						line = testLine;
					}
				}
				context.fillText(line, tx, ty);


				context.setTransform(PIXEL_RATIO, 0, 0, PIXEL_RATIO, 0, 0);

				var texture = new THREE.Texture(canvas);
				texture.needsUpdate = true;
				var spriteMaterial = new THREE.SpriteMaterial({
					map: texture,
					depthWrite: false,
					depthTest: false
				} );
				var sprite = new THREE.Sprite( spriteMaterial );
				sprite.scale.set(width,height,1.0);
				return sprite;
			},
			getSprite : function( path, properties ){
				var p = properties === undefined ? { } : properties;
				var icon = new THREE.ImageUtils.loadTexture( path );
				p.map = icon;
				return new THREE.Sprite( new THREE.SpriteMaterial( p ));
			}
		};
		return Wrapper;
	});
