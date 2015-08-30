requirejs.config( {
	paths: {
		'three'                     : 'libs/vendor/threejs/build/three.min',
		'threeShaderLib'            : 'libs/threeCustom/renderers/shaders/ShaderLib',
		'fontHelveticer'            : 'libs/threeCustom/fonts/helvetiker_regular.typeface',
		'config'                    : './config.vlib',
		'pluginLoader'              : 'pluginLoader',
		'jquery_ui'                 : 'libs/vendor/jquery-ui/jquery-ui.min',
		'jquery'                    : 'libs/vendor/jquery/dist/jquery.min',
		'underscore'                : 'libs/vendor/underscore/underscore-min',
		'tween'                     : 'libs/tween/tween',
		'three_multilinetext'       : 'libs/threeCustom/helpers/MultilineTextHelper',
		'three_trackball_controls'  : 'libs/threeCustom/controls/TrackballControls',
		'three_orbit_controls'      : 'libs/threeCustom/controls/OrbitControls',
		'orgChart'                  : 'libs/jOrgChart_AMD/jquery.jOrgChart',
		'bootstrap'                 : 'libs/vendor/bootstrap/dist/js/bootstrap.min',
		'text'                      : 'libs/vendor/text/text'
	},
	shim : {

		'underscore'              : {
			exports: '_'
		},
		'three'                   : {
			exports: 'THREE'
		},
		'fontHelveticer'          : {
			deps: ['three']
		},
		'tween'                   : {
			exports: 'TWEEN'
		},
		'threeShaderLib': {
			exports: 'THREE',
			deps : ['three']
		},
		'three_multilinetext': {
			exports: 'THREE',
			deps : ['three']
		},
		'three_trackball_controls': {
			exports: 'THREE',
			deps : ['three']
		},
		'three_orbit_controls': {
			exports: 'THREE',
			deps : ['three']
		},
		'jquery_ui': {
			exports: '$',
			deps : ['jquery']
		},
		'bootstrap': {
			deps: ['jquery']
		}
	}

} );



define([
	'core/Vlib',
	'core/modules/plot/plot.vlib','core/modules/templates/templates.vlib',
	'core/modules/controls/controls.vlib','core/modules/toolbox/toolbox.vlib',
	'core/modules/scenegraph/scenegraph.vlib','core/modules/group/group.vlib',
	'core/modules/groupEditor/groupEditor.vlib', 'config'], function (

	CORE_VLIB,
	MODULE_PLOT,
	MODULE_TEMPLATE,
	MODULE_CONTROLS,
	MODULE_TOOLBOX,
	MODULE_SCENEGRAPH,
	MODULE_GROUP,
	MODULE_GROUP_EDITOR,
	CONFIG) {

	return {
		vLib        : CORE_VLIB,
		vPlot       : MODULE_PLOT,
		vTemplates  : MODULE_TEMPLATE,
		vControls   : MODULE_CONTROLS,
		vToolbox    : MODULE_TOOLBOX,
		vScenegraph : MODULE_SCENEGRAPH,
		vGroup      : MODULE_GROUP,
		vGroupEditor: MODULE_GROUP_EDITOR,
		vConfig     : CONFIG
	};
} );
