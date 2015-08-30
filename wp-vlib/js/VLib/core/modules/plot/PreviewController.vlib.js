/**
 * Created by Andreas Gratzer on 11/05/15.
 */
define(['require', 'jquery'], function ( require, $ ) {

	var PreviewController = function( $container ){
		"use strict";

		this.$container = $container;
		this.$imageContainer = $('<img/>',{
			'class' : 'preview-image'
		});
		this.images;
		this.opacity = 0;
		this.isVisible = false;
		this.currentElement = 0;
		this.elemCount = 0;
		this.initDone = false;
	};

	PreviewController.prototype.init = function( images ){
		"use strict";
		if( arguments.length === 0 || images === false ){
			return false;
		}
		if( !images instanceof Array ){
			this.images = [];
			this.images.push(images);
		}else{
			this.images = images;
		}

		this.elemCount = this.images.length;
		this.currentElement = 0;

		this.$container.append( this.$imageContainer );
		this.$imageContainer.attr('src', this.images);
		this.initDone = true;
		return true;
	};
	PreviewController.prototype.destroy = function(){
		"use strict";
		if(!this.initDone){
			return true;
		}
		console.log('PreviewController.detroy()');
		this.initDone = false;
		return true;
	};

	PreviewController.prototype.show = function(){
		"use strict";
		if(!this.initDone){
			return false;
		}
		console.log('PreviewController.show %s elements', this.elemCount);

		this.$container.fadeIn();
		this.isVisible = true;
		return true;
	};
	PreviewController.prototype.hide = function(){
		"use strict";
		if(!this.initDone){
			return false;
		}

		console.log('PreviewController.hide %s elements', this.elemCount);
		this.$container.fadeOut();
		this.isVisible = false;
		return true;
	};

	PreviewController.prototype.stepLeft = function(){
		"use strict";
		if(!this.initDone){
			return false;
		}
		return true;
	};
	PreviewController.prototype.stepRight = function(){
		"use strict";
		if(!this.initDone){
			return false;
		}
		return true;
	};

	return PreviewController;
} );