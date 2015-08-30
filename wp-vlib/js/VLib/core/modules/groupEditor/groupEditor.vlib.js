define( ['require', 'jquery', 'underscore', 'config', './TreeHandler.vlib', 'text!./selectBestPlotModal.html'], function ( require, $, _, Config, TreeHandler, ModalBstPlotSelection ) {
	/**
	 @module Templates
	 @class Templates
	 **/
	var Module = function () {
		this.name = 'groupEditor';
		var _templates = Config.getModulePath() + 'groupEditor/templates.html';
		this.container;
		this.$tree;
		this.file_plot_mapping = {};

		this.isRegisterd = function () {
			return ( typeof this.subscribe === 'function' ) && ( typeof this.publish === 'function');
		};

		this.init = function ( container ) {
			this.container = $( container );
			if ( this.isRegisterd() ) {
				// inject script templates
				this.publish( Config.CHANNEL_INJECT_SCRIPTTEMPLATE, {url: _templates} );
				/** *************************************** */
				/* CALL FUNCTIONS HERER */
				/** *************************************** */
				this.addListener();
				this.addGui();
				this.publish( Config.CHANNEL_REQUEST_TEMPLATES );
				this.publish( Config.CHANNEL_RESQUEST_FILES );
				/** *************************************** */
			} else {
				throw 'Module [ '
				+ this.name
				+ ' ] not registered! Use VLib.registerModule(obj) first.';
			}

		};
	};
	/** *************************************** */
	/* ADD LISTENERS HERE */
	/** *************************************** */
	Module.prototype.addListener = function () {
		"use strict";
		this.subscribe( Config.CHANNEL_RESPOND_TEMPLATES, function ( plotList ) {
			this.$tree.setPlots( plotList );
		} );
		this.subscribe( Config.CHANNEL_RESPOND_FILES, function ( fileList ) {
			this.$tree.setFiles( fileList );
		} );
	};
	/** *************************************** */
	/* GUI */
	/** *************************************** */
	Module.prototype.addGui = function () {
		"use strict";
		var that = this;
		_.templateSettings.variable = "rc";
		// get template code
		var templateData = {
			title: 'Group'
		};
		var template = _.template( $( "script.templateGroupEditorContainer" ).html() );
		this.container.html( template( templateData ) );

		this.$tree = new TreeHandler( '#group-editor-tree' );
		this.$tree.onUpdate( function ( group ) {
			that.publish( Config.CHANNEL_RESPOND_GROUP, group );
		} );
		var group = new TreeHandler.Node( TreeHandler.NODE_TYPE.FOLDER );
		group.config.name = 'Group';
		this.$tree.setTree( group );
		this.$tree.attachDragAndDrop();
	};
	Module.prototype.getGroup = function () {
		"use strict";
		return this.$tree.getTree();
	};
	Module.prototype.setGroup = function ( group ) {
		"use strict";
		if ( !group ) {
			var g = new TreeHandler.Node( TreeHandler.NODE_TYPE.FOLDER );
			g.config.name = 'Group';
			this.$tree.setTree( g );
		} else {
			this.$tree.setTree( group );
		}
	};
	Module.prototype.mapBestPlotsToFiles = function () {
		this.$tree.applyToNodeType( this.$tree.tree, TreeHandler.NODE_TYPE.PLOT, this.selectBestPlot, this );
	};

	Module.prototype.selectBestPlot = function ( plotNode ) {
		"use strict";
		// node has to be a plot
		if ( plotNode.type !== TreeHandler.NODE_TYPE.PLOT ) {
			return false;
		}
		// node has to have at least one file as child
		if ( plotNode.childs.length === 0 ) {
			return false;
		}
		var plots = [], regex, index, file, fileName, bestPlots = [], tmpScore, bestScore = -1;

		/* get plots with patterns */
		for ( var i = 0, len = this.$tree.plots.length; i < len; ++i ) {
			if ( this.$tree.plots[i].pattern !== null && this.$tree.plots[i].pattern.length !== 0 ) {
				plots.push( this.$tree.plots[i] );
			}
		}

		/* compare possible patterns */
		file = plotNode.childs[0];
		for ( var i = 0, len = plots.length; i < len; ++i ) {
			tmpScore = this.getMatchingScore( plots[i], file );
			if ( tmpScore > bestScore ) {
				bestScore = tmpScore;
				bestPlots = [ plots[i] ];
			} else if ( tmpScore == bestScore ) {
				bestPlots.push( plots[i] )
			}
		}

		/* SET BEST PLOT  */
		/* multiple good plots found */
		if ( bestPlots.length > 1 ) {
			/* check if user already has mapped a good plot */
			if ( this.file_plot_mapping.hasOwnProperty( file.config.name ) ) {
				bestPlots = [this.file_plot_mapping[ file.config.name ]];
			} else {
				/* Let the user decide */
				this.userSelectBestPlot( plotNode, bestPlots, file );
				return false;
			}
		}

		if ( bestPlots.length === 1 ) {
			plotNode.config.name = bestPlots[0].name;
			plotNode.config.description = bestPlots[0].description;
			plotNode.config.file = {
				id: bestPlots[0].id
			};
			this.$tree.repaint();
			return true;
		}
		return false;
	};
	Module.prototype.userSelectBestPlot = function ( node, plots, file ) {
		"use strict";
		var containerId = 'vplot-select-best-' + node.id;
		var that = this;
		if ( $( '#' + containerId ).length > 0 ) {
			$( '#' + containerId ).remove();
		}

		_.templateSettings.variable = 'rc';
		var template = _.template( ModalBstPlotSelection );
		var templateData = {
			id   : containerId,
			plots: plots,
			file : file.config.file
		};
		$( 'body' ).append( template( templateData ) );
		$( '#' + containerId ).modal( {
			show: true
		} );
		$( '#' + containerId ).find( '#modal-save' ).click( function () {
			var bestPlotIndex = $( '#' + containerId ).find( '#vplot-best-select' ).val();
			that.file_plot_mapping[file.config.file.name] = plots[bestPlotIndex];
			that.mapBestPlotsToFiles();
		} );
	};
	Module.prototype.getMatchingScore = function ( plot, file ) {
		"use strict";
		var index = -1, fileName = file.config.file.fullName, regex, score = 0;
		for ( var i = 0, len2 = plot.pattern.length; i < len2; ++i ) {
			try {
				regex = new RegExp( plot.pattern[i], "g" );
				index = fileName.search( regex );
				if ( index !== -1 ) {
					score = fileName.substring( index, fileName.length ).length;
				}

			} catch ( e ) {
				console.info( "[ MAP PLOT TO FILE ] Bad REGEX! " + plot.pattern[ i ] );
			}
		}
		return score;
	};
	return Module;

} );
