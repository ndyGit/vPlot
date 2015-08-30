var current_script = document.currentScript.src;
var CONFIG_DIR = current_script.replace( 'config.vlib.js', '' );
define( function ( require ) {
	/**
	 DO NOT CHANGE Config object directly!
	 */
	/**
	 Configuration file<br />
	 Holds information about
	 <ul>
	 <li>Plugin-Types</li>
	 <li>Channels</li>
	 <li>Path</li>
	 </ul>
	 @class Config
	 @readOnly
	 @module VLib
	 @constructor
	 **/
	var Config = function () {
		return {
			/* STATIC FINAL VARS */
			/**
			 @attribute PLUGINTYPE
			 @static
			 @final
			 @type {String}
			 **/
			PLUGINTYPE  : {
				ROOT      : 'root',
				CONTEXT_2D: 'context_2d',
				CONTEXT_3D: 'context_3d',
				LEGEND    : 'legend',
				CAMERA    : 'camera',
				AXES      : 'axes',
				PLOT      : 'plot',
				COLOR     : 'color',
				DATA      : 'data',
				GEOMETRY  : 'data_geometry',
				FUNCTION  : 'function',
				LIGHT     : 'light',
				MATERIAL  : 'material',
				LINETYPE  : 'lineType',
				STATE     : 'state',
				ACTIVITY  : 'activity',
				ANIMATION : 'animation',
				STANDALONE   : 'standalone'
			},
			PATTERN     : {
				ORIGIN: '<origin>'
			},
			ACTIVITY    : {
				CLICK: 'click'
			},
			STATE       : {
				PRE  : 'pre',
				READY: 'ready',
				POST : 'post'
			},
			ACTION      : {
				FADE : 'fade',
				MOVE : 'move',
				SCALE: 'scale',
				LINK : 'link',
				LABEL: 'label',
				TICK : 'tick'
			},
			BUFFER      : {
				CONFIG       : 'config',
				SYSTEM       : 'system',
				GEOMETRY     : 'geometry',
				METADATA     : 'buffer.attr.metadata',
				COLORS       : 'colors',
				COORDS       : 'coords',
				SCALED_COORDS: 'scaled_coords',
				RAW_DATA     : 'raw_data',
				BORDERS      : 'borders',
				SCALING      : 'scaling',
				RAW_DATA_TICK: 'tick',
				CURRENT_TICK : 'currentTick',
				RAW_LABELS_X : 'raw_labels_x',
				RAW_LABELS_Y : 'raw_labels_y',
				RAW_LABELS_Z : 'raw_labels_z',
				PLOT_HANDLER : 'plot_handler'
			},
			DATA_MAPPING: {
				X           : 'x',
				Y           : 'y',
				Z           : 'z',
				TICK        : 'tick',
				SIZE        : 'size',
				COLOR       : 'static_color',
				LABEL       : 'label',
				IGNORE      : 'ignore',
				AXIS_LABEL_X: 'xAxis_label',
				AXIS_LABEL_Y: 'yAxis_label',
				AXIS_LABEL_Z: 'zAxis_label'
			},

			defaults: {
				scale  : {
					x: 400,
					y: 400,
					z: 400
				},
				borders: {
					xMax: 'auto',
					yMax: 'auto',
					zMax: 'auto',
					xMin: 'auto',
					yMin: 'auto',
					zMin: 'auto',
					nice: false
				}
			},

			DEFAULT_PLOT_WIDTH : 400,
			DEFAULT_PLOT_HEIGHT: 400,
			PLOT_CONTAINER     : '.plot-container',


			/* PATH */
			/**
			 @attribute lib
			 Name of this library
			 @static
			 @final
			 @type {String}
			 **/
			lib                : 'VLib',
			appPath            : CONFIG_DIR,
			/**
			 @attribute basePath
			 base folder of this library
			 @static
			 @final
			 @type {String}
			 **/
			basePath           : '',
			/**
			 @attribute dataPath
			 base folder of this library
			 @static
			 @final
			 @type {String}
			 **/
			dataPath           : '',
			/**
			 @attribute getExternalDataDir
			 base path of plugins
			 @static
			 @final
			 @type {String}
			 **/
			getExternalDataDir : function () {
				return this.dataPath;
			},
			/**
			 @attribute getExternalDataPath
			 base path of plugins
			 @static
			 @final
			 @type {String}
			 **/
			getExternalDataPath: function () {
				return this.basePath + this.dataPath;
			},
			/**
			 @attribute getPluginPath
			 base path of plugins
			 @static
			 @final
			 @type {String}
			 **/
			getPluginPath      : function () {
				return '/plugins';
			},
			/**
			 @attribute baseData
			 base path of data folder
			 @static
			 @final
			 @type {String}
			 **/
			getDataPath        : function () {
				return this.basePath + this.appPath + '/data';
			},

			/**
			 @attribute absModules
			 absolute path to modules folder
			 @static
			 @final
			 @type {String}
			 **/
			getModulePath                         : function () {
				return 'core/modules/';
				//return this.basePath+'/'+this.appPath+'/core/modules';
			},


			/* CHANNELS */
			/**
			 @attribute CHANNEL_REQUEST_PNG
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_PNG                   : 'requestPNG',
			/**
			 @attribute CHANNEL_RESPOND_PNG
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_PNG                   : 'respondPNG',
			/**
			 @attribute CHANNEL_RESPOND_GROUP
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_GROUP                 : 'respondGroup',
			/**
			 @attribute CHANNEL_REQUEST_PLUGINS
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_PLUGINS               : 'requestPlugins',
			/**
			 @attribute CHANNEL_RESPOND_PLUGINS
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_PLUGINS               : 'respondPlugins',
			/**
			 @attribute CHANNEL_REQUEST_TEMPLATES
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_TEMPLATES             : 'requestTemplates',
			/**
			 @attribute CHANNEL_RESPOND_TEMPLATES
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_TEMPLATES             : 'respondTemplates',
			/**
			 @attribute CHANNEL_REQUEST_SAVETEMPLATECALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_SAVETEMPLATECALLBACK  : 'requestSaveTemplateCB',
			/**
			 @attribute CHANNEL_RESPOND_SAVETEMPLATECALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_SAVETEMPLATECALLBACK  : 'respondSaveTemplateCB',
			/**
			 @attribute CHANNEL_REQUEST_UPDATETEMPLATECALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_UPDATETEMPLATECALLBACK: 'requestUpdateTemplateCB',
			/**
			 @attribute CHANNEL_RESPOND_UPDATETEMPLATECALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_UPDATETEMPLATECALLBACK: 'respondUpdateTemplateCB',
			/**
			 @attribute CHANNEL_REQUEST_DELETETEMPLATECALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_DELETETEMPLATECALLBACK: 'requestDeleteTemplateCB',
			/**
			 @attribute CHANNEL_RESPOND_DELETETEMPLATECALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_DELETETEMPLATECALLBACK: 'respondDeleteTemplateCB',
			/**
			 @attribute CHANNEL_REQUEST_LOADTEMPLATECALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_LOADTEMPLATECALLBACK  : 'requestLoadTemplateCB',
			/**
			 @attribute CHANNEL_RESPOND_LOADTEMPLATECALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_LOADTEMPLATECALLBACK  : 'respondLoadTemplateCB',
			/**
			 @attribute CHANNEL_REQUEST_LOADFILECALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_LOADFILECALLBACK      : 'requestFileCB',
			/**
			 @attribute CHANNEL_RESPOND_LOADFILECALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_LOADFILECALLBACK      : 'respondFileCB',
			/**
			 @attribute CHANNEL_REQUEST_UPLOADDATACALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_UPLOADDATACALLBACK    : 'requestUploadDataCB',
			/**
			 @attribute CHANNEL_RESPOND_UPLOADDATACALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_UPLOADDATACALLBACK    : 'respondUploadDataCB',
			/**
			 @attribute CHANNEL_REQUEST_DELETEDATACALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_DELETEDATACALLBACK    : 'requestDeleteDataCB',
			/**
			 @attribute CHANNEL_RESPOND_DELETEDATACALLBACK
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_DELETEDATACALLBACK    : 'respondDeleteDataCB',
			/**
			 @attribute CHANNEL_REQUEST_FILEUPLOADURL
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_FILEUPLOADURL         : 'requestFileUploadUrl',
			/**
			 @attribute CHANNEL_RESPOND_FILEUPLOADURL
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_FILEUPLOADURL         : 'respondFileUploadUrl',
			/**
			 @attribute CHANNEL_REQUEST_FILES
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REQUEST_FILES                 : 'requestFiles',
			/**
			 @attribute CHANNEL_RESPOND_FILES
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESPOND_FILES                 : 'respondFiles',
			/**
			 @attribute CHANNEL_INJECT_SCRIPTTEMPLATE
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_INJECT_SCRIPTTEMPLATE         : 'requestScriptTemplateInject',
			/**
			 @attribute CHANNEL_DROP
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_DROP                          : 'drop',
			/**
			 @attribute CHANNEL_SCENEGRAPH_CONTEXT
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_SCENEGRAPH_CONTEXT            : 'scenegraphContext',
			/**
			 @attribute CHANNEL_SCENEGRAPH_UPDATE
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_SCENEGRAPH_UPDATE             : 'sceneGraphUpdate',
			/**
			 @attribute CHANNEL_RENDER_TEMPLATE
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RENDER_TEMPLATE               : 'renderTemplate',
			/**
			 @attribute CHANNEL_TEMPLATES_TEMPLATE_SELECTED
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_TEMPLATES_TEMPLATE_SELECTED   : 'templateSet',
			/**
			 @attribute CHANNEL_TEMPLATES_TEMPLATE_DELETE
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_TEMPLATES_TEMPLATE_DELETE     : 'templateDelete',

			/**
			 @attribute CHANNEL_RESET
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RESET               : 'reset',
			/**
			 @attribute CHANNEL_REFRESH
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_REFRESH             : 'refresh',
			/**
			 @attribute CHANNEL_SAVE_AS_PNG
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_SAVE_AS_PNG         : 'save_png',
			/**
			 @attribute CHANNEL_SAVE_AS_PNG
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_SAVE_AS_TEMPLATE    : 'save_vlib',
			/**
			 @attribute CHANNEL_ERROR
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_ERROR               : 'error',
			/**
			 @attribute CHANNEL_WARNING
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_WARNING             : 'warning',
			/**
			 @attribute CHANNEL_SUCCESS
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_SUCCESS             : 'success',
			/**
			 @attribute CHANNEL_INFO
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_INFO                : 'info',
			/**
			 @attribute CHANNEL_RENDERED_PLUGIN_LIST
			 @static
			 @final
			 @type {String}
			 **/
			CHANNEL_RENDERED_PLUGIN_LIST: 'renderedPluginList'
		};
	};
	return new Config();
} );
