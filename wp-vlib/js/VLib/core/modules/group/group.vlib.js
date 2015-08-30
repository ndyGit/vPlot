define( ['require', 'jquery', 'underscore', 'config', './GroupTree.vlib'],
	function ( require, $, _, Config, GroupTree ) {
		/**
		 @module Templates
		 @class Templates
		 **/
		var Module = function ( plot ) {
			this.plotModule;
			var _templates = Config.getModulePath() + 'group/templates.js';
			this.name = 'group';
			this.container;
			this.$tree;
			this.loadTemplate = function () {
				alert( 'noop' );
			};
			this.loadFile = function () {
				alert( 'noop' );
			};

			if ( plot === undefined ) {
				console.error( '[ Group ] target plot not set!' );
				return;
			}
			if ( typeof plot === 'object' ) {
				if ( plot.hasOwnProperty( 'container' ) ) {
					this.plotModule = plot.container;
				} else {
					console.error( '[ Group ] target plot not set!' );
					return;
				}
			} else {
				this.plotModule = plot;
			}

			this.isRegisterd = function () {
				return ( typeof this.subscribe === 'function' ) && ( typeof this.publish === 'function');
			};

			this.init = function ( container ) {
				this.container = $( container );
				if ( this.isRegisterd() ) {

					/** *************************************** */
					/* CALL FUNCTIONS HERER */
					/** *************************************** */
					this.addListener();
					this.addGui();
					this.$tree = new GroupTree( container );
					this.$tree.onClick( this.plotClicked, this );
					this.publish( Config.CHANNEL_REQUEST_LOADTEMPLATECALLBACK );
					this.publish( Config.CHANNEL_REQUEST_LOADFILECALLBACK );
					/** *************************************** */
				} else {
					throw 'Module [ '
					+ this.name
					+ ' ] not registered! Use VLib.registerModule(obj) first.';
				}

			};
		};
		/** *************************************** */
		/* ADD LISTENERS HERER */
		/** *************************************** */
		Module.prototype.addListener = function () {
			"use strict";
			this.subscribe( Config.CHANNEL_RESPOND_GROUP, this.setGroup );
			this.subscribe( Config.CHANNEL_RESPOND_LOADTEMPLATECALLBACK, function ( loadTemplateCallback ) {
				this.loadTemplate = loadTemplateCallback;
			} );
			this.subscribe( Config.CHANNEL_RESPOND_LOADFILECALLBACK, function ( loadFileCallback ) {
				this.loadFile = loadFileCallback;
			} );
		};
		Module.prototype.addGui = function () {
			"use strict";
			this.container.html( "" );
			this.container.addClass( "tree" );
		};
		Module.prototype.setGroup = function ( group ) {
			"use strict";
			this.$tree.setTree( group );
			this.$tree.attachClickBehavior();
			this.publish( Config.CHANNEL_RENDER_TEMPLATE, {
				template: false,
				target  : this.plotModule
			} );
		};
		Module.prototype.plotClicked = function ( nodeId ) {
			"use strict";
			var that = this;
			var node = this.$tree.getNodeById( nodeId );
			var plotId;
			if ( node.type === GroupTree.NODE_TYPE.PLOT && node.config.file ) {
				plotId = node.config.file.id;
			} else {
				console.warn( "[ Click ] Plot node not found." );
				return;
			}
			if(node.hasOwnProperty('bestFileIndex')){
				delete node.bestFileIndex;
			}
			this.loadTemplate( function ( plot ) {
					that.replacePlaceholders( plot.sceneGraph, node );
					that.publish( Config.CHANNEL_RENDER_TEMPLATE, {
						template: plot,
						target  : that.plotModule
					} );
				},
				function ( error ) {
					that.publish( Config.CHANNEL_ERROR, '[ Group Module ] Loading plot template failed. ' + error.message );
				}, this, plotId );

		};
		Module.prototype.getFileById = function ( id ) {
			"use strict";
			return this.loadFile( function () {
			}, function () {
			}, this, id );
		};
		Module.prototype.replacePlaceholders = function ( sgNode, treeNode ) {
			"use strict";

			if ( sgNode.name === 'file' ) {
				var file = this.getMatchingFile( sgNode.config.regex, treeNode );

				if ( file && file.file_path) {
					sgNode.config.path = file.file_path;
				}else{
					console.warn("[Group Module] replacePlaceholders() Matching file not found.");
				}
			}
			for ( var i = 0, len = sgNode.childs.length; i < len; ++i ) {
				this.replacePlaceholders( sgNode.childs[i], treeNode );
			}

		};
		Module.prototype.getFilesByTreeNode = function ( treeNode ) {
			"use strict";
			var treeNodefiles = treeNode.childs, files = [], fileId;
			for ( var i = 0, len = treeNodefiles.length; i < len; ++i ) {
				fileId = treeNodefiles[i].config.file.id;
				files.push( this.getFileById( fileId ) );
			}
			return files;
		};
		Module.prototype.getMatchingFile = function ( pattern, treeNode ) {
			"use strict";
			var files = this.getFilesByTreeNode( treeNode );

			if ( files.length === 1 ) {
				return files[0];
			}

			var regex = new RegExp( pattern, "g" );

			var index = -1, file, fileName, score = 0, tmpScore, bestFiles = [];


			if ( !files ) {
				alert("no files found");
				return false;
			}

			for ( var i = 0, len = files.length; i < len; ++i ) {
				try {
					file = files[ i ];
					fileName = file.full_file_name;
					console.log( fileName );
					index = fileName.search( regex );
					if ( index !== -1 ) {
						tmpScore = fileName.substring( index, fileName.length ).length;
						if ( tmpScore > score ) {
							score = tmpScore;
							bestFiles = [ file ];
						} else if ( tmpScore === score ) {
							bestFiles.push( file );
						}

					}

				} catch ( e ) {
					console.info( "[ MAP PLOT TO FILE ] Bad REGEX! " );
				}
			}


			var bestFile = false;
			if ( bestFiles.length === 1 ) {
				bestFile = bestFiles[0];
			} else {
				if ( treeNode.hasOwnProperty( 'bestFileIndex' ) ) {

					if ( treeNode.bestFileIndex < bestFiles.length ) {
						bestFile = bestFiles[treeNode.bestFileIndex];
						treeNode.bestFileIndex += 1;
					}else{
						bestFile = bestFiles[0];
						treeNode.bestFileIndex = 1;
					}
				} else {
					bestFile = bestFiles[0];
					treeNode.bestFileIndex = 1;
				}
			}

			return bestFile;


		};
		return Module;

	} );
