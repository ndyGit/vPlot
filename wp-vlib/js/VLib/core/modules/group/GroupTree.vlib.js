/**
 * Created by Andreas Gratzer on 01/10/14.
 */
define( ['jquery', 'bootstrap'],
	function ( $ ) {
		'use strict';
		var GroupTree = function ( container ) {
			this.TREE_CONTAINER_ID = 'group-tree';
			this.$container = $( '<div />', {
				id: this.TREE_CONTAINER_ID
			} );
			$( container ).append( this.$container );
			this.tree = false;
			this.clickCallback = function(){};
			this.clickCallbackContext = null;
		};
		GroupTree.NODE_TYPE = {
			FILE  : 'file',
			FOLDER: 'folder',
			PLOT  : 'plot'
		};
		GroupTree.prototype.setTree = function ( tree ) {
			this.tree = tree;
			this.repaint();
		};
		GroupTree.prototype.getTree = function ( ) {
			return this.tree;
		};

		GroupTree.prototype.getIconByNode = function ( node ) {
			var bootstrapIcon = 'glyphicon-';
			switch ( node.type ) {
				case GroupTree.NODE_TYPE.FILE:
					bootstrapIcon += 'file';
					break;
				case GroupTree.NODE_TYPE.FOLDER:
					bootstrapIcon += 'folder-open';
					break;
				case GroupTree.NODE_TYPE.PLOT:
					bootstrapIcon += 'stats';
					break;
				default:
					bootstrapIcon += 'folder-open';
					break;
			}
			return bootstrapIcon;
		};
		GroupTree.prototype.addChildToTreeElem = function ( elem, child ) {
			elem.find( 'ul' ).first().append( child );
		};
		GroupTree.prototype.getTreeElem = function ( treeNode ) {

			if ( treeNode === undefined || treeNode === null || treeNode === false ) {
				return false;
			}

			/** ************************************ */
			/** add template * */
			var $icon = $( '<span />', {
				class: 'glyphicon tree-icon',

			} );
			$icon.addClass( this.getIconByNode( treeNode ) );

			var $link = $( '<a />',{
				href : '#'
			} ).append( $icon ).append(' ').append( unescape(treeNode.config.name) );

			var $template = $( '<li />' ).append( $link );

			if(treeNode.config.file){
				$link.attr('id',treeNode.id);
				$link.attr('class','tree-file list-group-item list-group-item-success');
			}else{
				$link.attr('class','tree-folder list-group-item active');
			}

			/** ************************************ */
			var $element = $( '<li />' ).html( $template ).append( $( '<ul/>' ) );
			if( treeNode.type === GroupTree.NODE_TYPE.FOLDER){
				$element.attr('class','tree-folder-base');
			}
			return $element;
		};

		GroupTree.prototype.treeToHtml = function ( node ) {
			if ( node === undefined || node === null || node === false ) {
				return false;
			}

			var $ul = $( '<ul/>',{ class : 'tree-base' } ),
				that = this,
				nodesTodo = [],
				htmlTodo = [],
				currentNode = node,
				currentHtml = this.getTreeElem( node );

			$ul.append( currentHtml );
			while ( currentNode !== undefined ) {
				$.each( currentNode.childs, function ( i, child ) {
					if( child.type !== GroupTree.NODE_TYPE.FILE ){
						var c = that.getTreeElem( child );
						that.addChildToTreeElem( currentHtml, c );
						nodesTodo.push( child );
						htmlTodo.push( c );
					}

				} );
				currentNode = nodesTodo.pop();
				currentHtml = htmlTodo.pop();
			}
			return $ul;
		};

		GroupTree.prototype.attachClickBehavior = function () {
			this.$container.find('.tree-folder' ).on('click',function(e){
				e.preventDefault();
				e.stopPropagation();
				console.log("click");
				var $icon = $(this ).parent().find('span');
				var $childs = $( this ).parent().next('ul');
				if( $icon.hasClass('glyphicon-folder-open')){
					$icon.removeClass('glyphicon-folder-open');
					$icon.addClass('glyphicon-folder-close');
					$childs.slideUp();
				}else{
					$icon.removeClass('glyphicon-folder-close');
					$icon.addClass('glyphicon-folder-open');
					$childs.slideDown();
				}
			});
			var that = this;
			this.$container.find('.tree-file' ).on('click',function(e){
				e.preventDefault();
				e.stopPropagation();
				var id = $( this ).attr('id');
				if( id ){
					that.clickCallback.apply(that.clickCallbackContext, [ id ] );
				}
			});
		};

		GroupTree.prototype.onClick = function( callback, context ){
			this.clickCallback = callback;
			this.clickCallbackContext = context;
		};

		GroupTree.prototype.setDragAndDrop = function ( callback ) {
			this.attachDragAndDrop = callback;
		};
		GroupTree.prototype.drop = function ( type, targetId ) {

			var node = new GroupTree.Node( type );
			node.config.name = type;
			var target = this.getNodeById( targetId );
			if ( !target ) {
				return false;
			}
			if ( this.isSuccessor( node, target ) ) {
				if ( target.type === GroupTree.NODE_TYPE.FILE ) {
					target.childs = [];
				}
				return this.add( node, target );
			}

			return false;
		};
		GroupTree.prototype.repaint = function () {
			this.$container.html( this.treeToHtml( this.tree ) );
		};

		GroupTree.prototype.update = function () {
			this.updateCallback( this.tree );
		};

		GroupTree.prototype.toString = function () {
			return JSON.stringify( this.tree );
		};
		GroupTree.prototype.getNodeById = function ( id ) {
			return this.getSiblingById( id, this.tree );
		};
		GroupTree.prototype.getSiblingById = function( id, node ){
			if( node.id === id){
				return node;
			}
			var i,len,n;
			for(i = 0, len = node.childs.length; i < len; ++i){
				n =  this.getSiblingById( id, node.childs[ i ]);
				if( n ){
					return n;
				}
			}
			return false;
		};

		return GroupTree;
	} )
;