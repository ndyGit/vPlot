define( ['require', 'config', 'core/Utils.vlib'], function ( require, Config, UTILS ) {
	/**
	 TODO<br />
	 Abstract Class used by plugins.
	 @class AbstractPlugin
	 @constructor
	 @example
	 var NewPlugin = function(){
			var name = 'UNIQUE_NAME';
			NewPlugin.superClass.constuctor.call(this,name);
			Plugin.superClass.setContext.call(this,Config.PLUGINTYPE.CONTEXT_3D);
			Plugin.superClass.setType.call(this,Config.PLUGINTYPE.PLOT);
			//...
		}
	 UTILS.CLASS.extend(NewPlugin,AbstractPlugin);
	 //Override abstract methods
	 NewPlugin.prototype = {
			exec : function(config,childs){
				//TODO
			}
			//...
		};
	 @abstract
	 **/
	var AbstractPlugin = function ( name ) {
		/** ********************************** */
		/** PUBLIC VARIABLES * */
		/** ********************************** */
		this.buffer;
		/**
		 Unique plugin ID.
		 @property id
		 @type String
		 @uses UTILS.getUUID()
		 @readOnly
		 **/
		this.id = UTILS.getUUID();
		/**
		 Unique plugin name.
		 @property name
		 @type String
		 @uses UTILS.getUUID()
		 @writeOnce
		 **/
		this.name = name;
		/**
		 Plugin context according to Config.PLUGINTYPE.(CONTEXT_2D | CONTEXT_3D)
		 @property context
		 @type {Config.PLUGINTYPE.(CONTEXT_2D | CONTEXT_3D)}
		 @writeOnce
		 **/
		this.context = undefined;
		/** plugin type according to Config.PLUGINTYPE  **/
		this.type = undefined;

		/**
		 Path to plugin-template file
		 @property templates
		 @type String
		 @default undefined
		 **/
		this.templates = undefined;
		/**
		 path to plugin-icon.<br />
		 Config.absPlugins + PLUGINFOLDER + FILENAME
		 @property icon
		 @type String
		 @default undefined
		 **/
		this.icon = Config.absPlugins + '/default_plugin_icon.png';
		/**
		 Lists of accepted childs and parents.
		 @property accepts
		 @type {Object}
		 @default {
			predecessors : [  ],
			successors : [  ]}
		 **/
		this.accepts = {
			predecessors: [],
			successors  : []
		}
		/** Informations about PARENT and CHILD plugins **/
		this.description = 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]';
	};

	AbstractPlugin.prototype = {
		/** ********************************** */
		/** PUBLIC METHODS * */
		/** ********************************** */
		setBuffer        : function ( buffer ) {
			this.buffer = buffer;
		},
		getBuffer        : function () {
			return this.buffer;
		},
		/**
		 Use this method If and only if a new plugin gets instantiated with data from a plugin-flyweight.<br />
		 Plugin id will be set automatically. This method is supposed for flyweight <-> plugin synchronization.
		 @method setId
		 @public
		 @param id {UUID}
		 Config.PLUGINTYPE.(CONTEXT_2D | CONTEXT_3D)
		 **/
		setId            : function ( id ) {
			this.id = id;
		},
		/**
		 Returns unique plugin id.
		 @method getId
		 @public
		 @param id {String}
		 Unique plugin id.
		 **/
		getId            : function () {
			return this.id;
		},
		/**
		 @method setContext
		 @public
		 @param context {String}
		 Config.PLUGINTYPE.(CONTEXT_2D | CONTEXT_3D)
		 **/
		setContext       : function ( context ) {
			this.context = context;
		},
		/**
		 @method setType
		 @public
		 @param type {String}
		 Config.PLUGINTYPE.XXX
		 **/
		setType          : function ( type ) {
			this.type = type;
		},
		/**
		 @method getType
		 @public
		 @return Config.PLUGINTYPE.XXX
		 **/
		getType          : function () {
			return this.type;
		},
		/**
		 @method setName
		 @public
		 @param name {String}
		 **/
		setName          : function ( name ) {
			this.name = name;
		},
		/**
		 @method getName
		 @public
		 @return name {String}
		 **/
		getName          : function () {
			return this.name;
		},
		/**
		 @method setTemplates
		 @public
		 @param templates {String}
		 Path to html-script-template file.
		 **/
		setTemplates     : function ( templates ) {
			this.templates = templates;
		},
		/**
		 @method setIcon
		 @public
		 @param type {icon}
		 Path to icon.
		 **/
		setIcon          : function ( icon ) {
			this.icon = icon;
		},
		/**
		 @method getIcon
		 @public
		 @return type {icon}
		 Path to icon.
		 **/
		getIcon          : function () {
			return this.icon;
		},
		/**
		 Lists of accepted childs and parents.
		 @method setAccepts
		 @public
		 @param accepts {Object} {
			predecessors : [  ],
			successors : [  ]
			}
		 **/
		setAccepts       : function ( accepts ) {
			this.accepts = accepts;
		},
		getAccepts       : function () {
			return this.accepts;
		},
		/**
		 @method setDescription
		 @public
		 @param description {icon}
		 Description.
		 **/
		setDescription   : function ( description ) {
			this.description = description;
		},


		/** ********************************** */
		/** ABSTRACT METHODS * */
		/** ********************************** */
		/**
		 Takes configuration from the plugin-template and
		 returns the parameters as JSON-config-file<br />
		 THIS IS AN ABSTRACT METHOD AND HAS TO BE OVERWRITTEN.
		 @method getConfigCallback
		 @abstract
		 @param containerId {String}
		 Parent container which encloses the
		 plugin - config - form ( defined by @property templates)
		 @return {Object}
		 Plugin config file
		 **/
		getConfigCallback: function ( containerId ) {
			throw new Error( 'Unsupported operation on an abstract method.' );
		},
		/**
		 *
		 *
		 *
		 * @param config
		 *            plugin config file
		 * @param containerId
		 *            parent container where the plugin-template got
		 *            added
		 */
		/**
		 Takes arguments from config and inserts them to the
		 plugin-template<br />
		 THIS IS AN ABSTRACT METHOD AND HAS TO BE OVERWRITTEN.
		 @method setConfigCallback
		 @abstract
		 @param config {Object}
		 Plugin configuration object

		 @param containerId {String}
		 Parent container which encloses the
		 plugin - config - form ( defined by @property templates)

		 @return {Object}
		 Plugin config file
		 **/
		setConfigCallback: function ( config, containerId ) {
			throw new Error( 'Unsupported operation on an abstract method.' );
		},
		/**
		 Where the magic happens...<br />
		 Called by parser<br />
		 THIS IS AN ABSTRACT METHOD AND HAS TO BE OVERWRITTEN.
		 @method exec
		 @abstract
		 @param config {Object}
		 Plugin configuration object

		 @param childs {Array}
		 Array of child plugins.<br />
		 to be more precise: The results of childs-exec() methods.

		 @return {Object}

		 **/
		exec             : function ( config, childs, buffer ) {
			throw new Error( 'Unsupported operation on an abstract method.' );
		},
		handleChilds     : function ( childs, env, doneCB, doneCTX ) {
			var successors = env.accepts.successors;
			/* Data.vlib */
			env.datasets = [];
			env.raw_data = [];

			env.heatmaps = [];
			env.activities = [];
			env.stateActivities = [];
			env.animations = [];
			/* Axes.vlib */
			env.axesSet = false;
			env.axesCallback = false;
			env.axesContext = false;
			/* Material.vlib */
			env.materials = [];
			/* Color.vlib, Heatmap.vlib */
			env.heatmaps = [];
			env.raw_heatmap = false;
			env.colorCallback = false;
			env.colorContext = false;
			/* Function.vlib */
			env.functionCallback = false;
			env.functionContext = false;

			var dataChilds = {};
			var child;
			for ( var i = 0; i < childs.length; ++i ) {
				child = childs[i];

				if ( child !== undefined && child.pType !== undefined ) {

					if ( $.inArray( child.pType, successors ) != -1 ) {
						switch ( child.pType ) {
							case Config.PLUGINTYPE.GEOMETRY:
							case Config.PLUGINTYPE.DATA:
								dataChilds[child.pId] = child;
								break;

							case Config.PLUGINTYPE.AXES:
								env.axesCallback = child.response.callback;
								env.axesContext = child.response.context;
								env.borders = child.response.borders;
								env.boundingBox = {nice: env.borders.nice};
								env.axesSet = true;
								break;
							case Config.PLUGINTYPE.MATERIAL:
								if ( child.response.type == 'wireframeMaterial' ) {
									env.materials.push( child.response );
								} else {
									env.materials.unshift( child.response );
								}
								break;
							case Config.PLUGINTYPE.COLOR:
								env.raw_color = child.response.color;
								env.colorCallback = child.response.callback;
								env.colorContext = child.response.context;
								if ( child.response.heatmap !== undefined ) {
									env.raw_heatmap = child.response.heatmap;
									env.heatmaps.push( child.response.heatmap )
								}
								if ( child.response.color !== undefined ) {
									env.raw_color = child.response.color;
								}
								break;
							case Config.PLUGINTYPE.FUNCTION:
								env.functionCallback = child.response.callback;
								env.functionContext = child.response.context;
								break;
							case Config.PLUGINTYPE.ACTIVITY:
								env.activities.push( child.response );
								break;
							case Config.PLUGINTYPE.STATE:
								env.stateActivities.push( child.response );
								break;
							case Config.PLUGINTYPE.ANIMATION:
								env.animations.push( child.response );
								break;
						}
					}
				} else {
					console.log( 'pType of child plugin not set!' );
				}
			}
			var tmpData, tmpChild, ChildDone, len = Object.keys( dataChilds ).length, doneCounter = 0;


			for ( var pId in dataChilds ) {
				if ( dataChilds.hasOwnProperty( pId ) ) {
					tmpChild = dataChilds[pId];
					tmpChild.response.onDone( function ( e ) {
						"use strict";
						for ( var pId in dataChilds ) {
							if ( pId === e.id && dataChilds.hasOwnProperty( pId ) ) {
								ChildDone = dataChilds[pId];
								doneCounter++;
								tmpData = ChildDone.response.getData();
								env.datasets.push( ChildDone );
								env.heatmaps.push( ChildDone.response.getHeatmaps() );
								env.raw_data = env.raw_data.concat( tmpData );


								delete dataChilds[ pId ];
								if ( doneCB && doneCTX && doneCounter === len ) {
									doneCB.call( doneCTX );
								}
							}
						}
					}, this );
					tmpChild.response.start();
				}
			}


			if ( doneCB && doneCTX && len === 0 ) {
				doneCB.call( doneCTX );
			}

		},
		destroyActivities: function ( activities ) {
			"use strict";
			if ( !activities ) {
				return;
			}

			for ( var i = 0, il = activities.length; i < il; ++i ) {
				if ( activities[i] && activities[i].destroy ) {
					activities[i].destroy.call( activities[i] );
				} else if ( Object.prototype.toString.call( activities[i] ) === '[object Array]' ) {

					for ( var j = 0, jl = activities[i].length; j < jl; ++j ) {
						if ( activities[i][j] && activities[i][j].destroy ) {
							activities[i][j].destroy.call( activities[i][j] );
						}
					}
				}
			}
		},
		createBackup     : function ( object ) {
			if ( !object.clone ) {
				console.warn( '[ Plot.createBackup( object ) ] object not cloneable' );
				return;
			}
			object.backup = object.clone();
			if ( object.geometry ) {
				object.backup.geometry = object.geometry.clone();
			}
			if ( object.material ) {
				object.backup.material = object.material.clone();
			}
			var child;
			for ( var i = 0, len = object.children.length; i < len; ++i ) {
				child = object.children[i];
				child.backup = child.clone();
				if ( child.geometry ) {
					object.backup.children[i].geometry = child.geometry.clone();
					child.backup.geometry = child.geometry.clone();
				}
				if ( child.material ) {
					object.backup.children[i].material = child.material.clone();
					child.backup.material = child.material.clone();

				}

			}
			if ( object.multiMaterialObject ) {
				object.multiMaterialObject.backup = object.backup;
			}

		},
		filterActivities : function ( activities, needle ) {
			"use strict";
			return $.grep( activities, function ( o ) {
				"use strict";
				return o.aType === needle;
			} );
		},

		getBuffer : function( bufferManager, env ){
			"use strict";
			return bufferManager.getBuffer( env.id );
		}

	};
	return AbstractPlugin;

} )
;
