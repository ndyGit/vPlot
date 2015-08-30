
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

/**
 * BASE FUNCTIONALITY OF VLIB
 */
 define(function( require ) {

 	return {
 		vLib 	: 	require('core/Vlib'),
 		vPlot 	: 	require('core/modules/plot/plot.vlib'),
	    vGroup  :   require('core/modules/group/group.vlib')
 	};
 });
