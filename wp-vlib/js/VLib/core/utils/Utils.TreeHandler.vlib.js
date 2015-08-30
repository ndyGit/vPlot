/**
 * Created by Andreas Gratzer on 01/10/14.
 */
define( [
		'jquery', 'underscore',
		'text!core/htmlTemplates/modalDialog.html',
		'text!core/htmlTemplates/groupEditFolder.html',
		'text!core/htmlTemplates/groupEditFile.html',
		'text!core/htmlTemplates/groupEditPlot.html',
		'orgChart', 'jquery_ui', 'bootstrap'],
	function ( $, _, DialogTemplate, EditFolderTempalte, EditFileTempalte, EditPlotTempalte ) {
		'use strict';
		var TreeHandler = function ( container ) {
			this.TREE_CONTAINER_ID = 'group-tree';
			this.JORG_ID = 'group-jorg-data';
			this.$container = $( '<div />', {
				id: this.TREE_CONTAINER_ID
			} );
			$( container ).append( this.$container );
			$( container ).append( DialogTemplate );
			$( container ).append( EditFolderTempalte );
			$( container ).append( EditFileTempalte );
			$( container ).append( EditPlotTempalte );

			this.nodes = [];
			this.tree = false;
			this.files = [];
			this.plots = [];
			this.updateCallback = function () {
			};
			this.attachDragAndDrop = function () {
			};
			this.nodeRemoveHelper = function ( node ) {
				for ( var i = 0, len = this.childs.length; i < len; ++i ) {
					if ( this.childs[i].id === node.id ) {
						this.childs.splice( i, 1 );
						return true;
					}
				}
				return false;
			};

		};

		TreeHandler.Node = function ( type ) {
			this.id = type + '-xxxxxxxx-xxxx-vLib-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g, function ( c ) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString( 16 );
			} );

			this.type = type;
			this.config = {name: '', description: '', file: false};
			this.parentId = false;
			this.childs = [];
		};
		TreeHandler.NODE_TYPE = {
			FILE  : 'file',
			FOLDER: 'folder',
			PLOT  : 'plot'
		};
		TreeHandler.prototype.cloneNode = function( node ){
			var clone = {};
			clone.id = node.id;
			clone.type = node.type;
			clone.parentId = node.parentId;
			clone.config = {};
			clone.config.name = node.config.name;
			clone.config.description = node.config.description;
			clone.childs = [];
			for(var i = 0, len = node.childs.length; i < len; ++i){
				clone.childs.push( cloneNode( node.childs[ i ]) );
			}
			return clone;
		};
		TreeHandler.prototype.setUpdateCallback = function ( callback ) {
			this.updateCallback = callback;
		};
		TreeHandler.prototype.setFiles = function ( files ) {
			this.files = files;
		};
		TreeHandler.prototype.setPlots = function ( plots ) {
			this.plots = plots;
		};
		TreeHandler.prototype.setTree = function ( tree ) {
			this.tree = tree;
			this.nodes = this.treeToList( tree );
			this.repaint();

		};
		TreeHandler.prototype.treeToList = function ( node ) {
			var sub = [node];
			for ( var i = 0, len = node.childs.length; i < len; ++i ) {
				sub = sub.concat( this.treeToList( node.childs[i] ) );
			}
			return sub;
		};
		TreeHandler.prototype.getIconByNode = function ( node ) {
			var bootstrapIcon = 'glyphicon-';
			switch ( node.type ) {
				case TreeHandler.NODE_TYPE.FILE:
					bootstrapIcon += 'file';
					break;
				case TreeHandler.NODE_TYPE.FOLDER:
					bootstrapIcon += 'folder-open';
					break;
				case TreeHandler.NODE_TYPE.PLOT:
					bootstrapIcon += 'stats';
					break;
				default:
					bootstrapIcon += 'folder-open';
					break;
			}
			return bootstrapIcon;
		};
		TreeHandler.prototype.addChildToTreeElem = function ( elem, child ) {
			elem.find( 'ul' ).first().append( child );
		};
		TreeHandler.prototype.getTreeElem = function ( treeNode ) {

			if ( treeNode === undefined || treeNode === null || treeNode === false ) {
				return false;
			}

			/** ************************************ */
			/** add template * */
			var $icon = $( '<span />', {
				class: 'glyphicon'
			} );
			$icon.addClass( this.getIconByNode( treeNode ) );
			var $name = $( '<span />' ).append( treeNode.config.name );
			var $template = $( '<div />', {
				id   : treeNode.id,
				class: 'node plugin btn'
			} ).append( $icon ).append( '<br />' ).append( $name );

			if ( treeNode.type === TreeHandler.NODE_TYPE.PLOT ) {
				if ( treeNode.config.file ) {
					$template.addClass( 'btn-success' );
				} else {
					$template.addClass( 'btn-danger' );
				}
			} else {
				$template.addClass( 'btn-default' );
			}
			if ( treeNode.type === TreeHandler.NODE_TYPE.FILE ) {
				if ( treeNode.config.file ) {
					$template.addClass( 'btn-default' );
				} else {
					$template.addClass( 'btn-warning' );
				}
			} else {
				$template.addClass( 'btn-default' );
			}
			/** ************************************ */
			return $( '<li />' ).html( $template ).append( '<ul></ul>' );
		};

		TreeHandler.prototype.treeToHtml = function ( node ) {
			if ( node === undefined || node === null || node === false ) {
				return false;
			}

			var $ul = $( '<ul/>', {
					id   : this.JORG_ID,
					style: 'display:none'
				} ),
				that = this,
				nodesTodo = [],
				htmlTodo = [],
				currentNode = node,
				currentHtml = this.getTreeElem( node );

			$ul.append( currentHtml );
			while ( currentNode !== undefined ) {
				$.each( currentNode.childs, function ( i, child ) {
					var c = that.getTreeElem( child );
					that.addChildToTreeElem( currentHtml, c );
					nodesTodo.push( child );
					htmlTodo.push( c );
				} );
				currentNode = nodesTodo.pop();
				currentHtml = htmlTodo.pop();
			}
			return $ul;
		};

		TreeHandler.prototype.getNodeById = function ( id ) {
			var node;
			for ( var i = 0, len = this.nodes.length; i < len; ++i ) {
				if ( this.nodes[i].id === id ) {
					node = this.nodes[i];
					return node;
				}
			}
			return false;
		};

		TreeHandler.prototype.getTemplateByNode = function ( node ) {
			var t = '';
			switch ( node.type ) {
				case TreeHandler.NODE_TYPE.FOLDER:
					t = _.template( $( 'script.groupEditFolder' ).html() );
					break;
				case TreeHandler.NODE_TYPE.FILE:
					t = _.template( $( 'script.groupEditFile' ).html() );
					break;
				case TreeHandler.NODE_TYPE.PLOT:
					t = _.template( $( 'script.groupEditPlot' ).html() );
					break;
			}
			;
			return t;
		};

		TreeHandler.prototype.getFileById = function ( id ) {
			for ( var i = 0, len = this.files.length; i < len; ++i ) {
				if ( this.files[i].id === id ) {
					return this.files[i];
				}
			}
			return false;
		};

		TreeHandler.prototype.getPlotById = function ( id ) {
			for ( var i = 0, len = this.plots.length; i < len; ++i ) {
				if ( this.plots[i].id === id ) {
					return this.plots[i];
				}
			}
			return false;
		};

		TreeHandler.prototype.applyToNodeType = function ( node, type, callback ) {
			if ( node.type === type ) {
				callback( node );
			}
			for ( var i = 0, len = node.childs.length; i < len; ++i ) {
				this.applyToNodeType( node.childs[i], type, callback );
			}
		};

		TreeHandler.prototype.remove = function ( node ) {
			if ( !node ) return false;
			var tmp, parent, id;
			if ( node instanceof TreeHandler.Node ) {
				id = node.id;
				tmp = node;
			} else {
				/* id? */
				if ( !isNaN( parseFloat( node ) ) ) {
					tmp = this.getNodeById( id );
					id = node;
				} else {
					/* object */
					id = node.id;
					tmp = this.getNodeById( node.id );
				}

				if ( !tmp ) {
					return false;
				}
			}

			parent = this.getNodeById( tmp.parentId );
			console.dir( parent );

			for ( var i = 0, len = this.nodes.length; i < len; ++i ) {
				if ( this.nodes[i].id === id ) {
					for ( var j = 0, len2 = this.nodes[i].childs.length; j < len2; ++j ) {
						this.remove( this.nodes[i].childs[j] );
					}
					this.nodes.splice( i, 1 );
					if ( parent ) {
						parent.remove( tmp );
					}
					return true;
				}
			}
			return false;
		};

		TreeHandler.prototype.add = function ( child, parent ) {
			if ( arguments.length === 1 && this.tree === false ) {
				this.tree = child;
				this.nodes.push( child );
			}
			if ( this.tree === false && arguments.length === 2 ) {
				this.tree = parent;
				this.nodes.push( parent );
			}
			if ( !parent ) {
				this.repaint();
				return true;
			}

			child.parentId = parent.id;
			parent.childs.push( child );
			child.remove = this.nodeRemoveHelper;
			child.clone = this.nodeCloneHelper;
			this.nodes.push( child );

			this.repaint();
			return child;
		};
		TreeHandler.prototype.isSuccessor = function ( child, parent ) {
			if ( (parent.type === TreeHandler.NODE_TYPE.FILE || parent.type === TreeHandler.NODE_TYPE.PLOT)
				&& child.type === TreeHandler.NODE_TYPE.FOLDER ) {
				return false;
			}
			if ( parent.type === TreeHandler.NODE_TYPE.FILE && child.type === TreeHandler.NODE_TYPE.FILE ) {
				return false;
			}
			if ( parent.type === TreeHandler.NODE_TYPE.PLOT && (child.type === TreeHandler.NODE_TYPE.PLOT ) ) {
				return false;
			}
			if ( parent.type === TreeHandler.NODE_TYPE.FILE && child.type == TreeHandler.NODE_TYPE.PLOT ) {
				return false;
			}
			if ( parent.type === TreeHandler.NODE_TYPE.FOLDER && child.type == TreeHandler.NODE_TYPE.FILE ) {
				return false;
			}
			return true;
		};
		TreeHandler.prototype.attachClickBehavior = function () {
			var that = this,
				node;
			$( '.node' ).on( 'click', function ( e ) {
				e.preventDefault();
				node = that.getNodeById( $( this ).attr( 'id' ) );
				that.openDialog( node );
				e.stopPropagation();
			} );
		};

		TreeHandler.prototype.openDialog = function ( node ) {

			_.templateSettings.variable = 'rc';
			var that = this;
			var nodeContentTemplate = this.getTemplateByNode( node );
			var modalDialogId = 'dialog-' + node.type;
			var inputContainerId = 'group-edit-' + node.type;
			var modalTemplate = _.template( $( 'script.modalDialogContainer' ).html() );
			var fileId = node.config.file.id || -1;
			var file = this.getFileById( fileId );
			var templateData = {
				id     : modalDialogId,
				name   : node.config.name,
				content: nodeContentTemplate( {
					id          : node.id,
					name        : node.config.name,
					filename    : file.name || '',
					fullFilename: file.fullName || '',
					filepath    : file.path || '',
					description : node.config.description,
					files       : this.files,
					plots       : this.plots
				} )
			};
			/*if there is an old dialog container, remove it.*/
			if ( $( '#' + modalDialogId ).length > 0 ) {
				$( '#' + modalDialogId ).remove();
			}
			$( 'body' ).append( modalTemplate( templateData ) );

			var $modal = $( '#' + modalDialogId );

			$modal.modal( {
				show: true
			} );
			var fileName = $( '#' + modalDialogId ).find( '#group-node-realname' );
			var name = $( '#' + modalDialogId ).find( '#group-node-name' );
			var filePath = $( '#' + modalDialogId ).find( '#group-node-path' );
			var description = $( '#' + modalDialogId ).find( '#group-node-description' );
			var selection = $( '#' + modalDialogId ).find( '#group-select' );

			selection.find( "option[id='" + fileId + "']" ).attr( 'selected', 'selected' );

			$modal.find( '#modal-save' ).click( function () {
				node.config.name = name.val();
				node.config.description = escape( description.val() );
				that.updatePlotNode( node );
				that.repaint();
				that.updateCallback( that.tree );
			} );

			$modal.find( '#modal-delete' ).click( function () {
				if ( node === that.nodes[0] ) {
					alert( 'It is not possible to delete ROOT node.' );
					return false;
				}
				that.remove( node );
				that.repaint();
			} );

			selection.on( 'change', function () {
				var selected = $( this ).val().split( '-' );
				if ( selected.length !== 2 ) {
					name.val( '' );
					fileName.val( '' );
					filePath.val( '' );
					description.html( '' );
					node.config.file = false;

					return;
				}
				var id = selected[0];
				var index = selected[1];
				var selectedFile = false;
				if ( node.type === TreeHandler.NODE_TYPE.FILE ) {
					selectedFile = that.files[index];
					node.config.file = {
						id: selectedFile.id
					};
					name.val( selectedFile.name );
					fileName.val( selectedFile.name );
					filePath.val( selectedFile.fullName );
					description.html( selectedFile.description );
				} else if ( node.type === TreeHandler.NODE_TYPE.PLOT ) {
					selectedFile = that.plots[index];
					node.config.file = {
						id: selectedFile.id
					};
					name.val( selectedFile.name );
					fileName.val( selectedFile.name );
					description.html( selectedFile.description );
				}
			} );
		};

		TreeHandler.prototype.setDragAndDrop = function ( callback ) {
			this.attachDragAndDrop = callback;
		};
		TreeHandler.prototype.drop = function ( type, targetId ) {

			var node = new TreeHandler.Node( type );
			node.config.name = type;
			var target = this.getNodeById( targetId );
			if ( !target ) {
				return false;
			}
			if ( this.isSuccessor( node, target ) ) {
				if ( target.type === TreeHandler.NODE_TYPE.FILE ) {
					target.childs = [];
				}
				return this.add( node, target );
			}

			return false;
		};
		TreeHandler.prototype.repaint = function () {
			var $chartElement = $( '<div />', {id: this.TREE_CONTAINER_ID + '-chart'} );
			this.$container.html( this.treeToHtml( this.tree ) );
			this.$container.append( $chartElement );
			$( '#' + this.JORG_ID ).jOrgChart( {
				chartElement: $chartElement[0],
				dragAndDrop : true
			} );
			this.attachClickBehavior();
			this.attachDragAndDrop();
			this.update();
		};

		TreeHandler.prototype.update = function () {
			var treeClone = this.tree.clone();
			var group = this.treeToGroup( treeClone );
			this.updateCallback( group );
		};
		/**
		 * Replace file and plot containers by file and plot objects.
		 * @param tree
		 */
		TreeHandler.prototype.treeToGroup = function ( node ) {
			var groupNode = this.cloneNode(node);
			if ( node.type === TreeHandler.NODE_TYPE.FILE ) {
				node.config.file = this.getFileById( node.config.file.id );
			} else if ( node.type === TreeHandler.NODE_TYPE.PLOT ) {
				node.config.file = this.getPlotById( node.config.file.id );
			}
		};
		TreeHandler.prototype.toString = function () {
			return JSON.stringify( this.tree );
		};


		TreeHandler.prototype.updatePlotNode = function ( node ) {

			if ( node.type === TreeHandler.NODE_TYPE.PLOT && node.config.file ) {
				var parent = this.getNodeById( node.parentId );
				if ( parent && parent.type === TreeHandler.NODE_TYPE.FILE ) {
					if ( parent.config.file ) {
						this.updatePlaceholder( node.config.file.sceneGraph, parent );
					}
				}
			}
		};
		TreeHandler.prototype.updatePlaceholder = function ( node, fileNode ) {
			console.log( "update placeholder" );
			console.dir( node );
			console.dir( fileNode );
			if ( node.name === 'file' && node.config.regex !== '' ) {
				node.config.path = fileNode.config.file.path;
			}
			for ( var i = 0, len = node.childs.length; i < len; ++i ) {
				this.updatePlaceholder( node.childs[i], fileNode );
			}
		};
		return TreeHandler;
	} )
;