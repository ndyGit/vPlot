/**
 * Created by Andreas Gratzer on 08/10/14.
 */

requirejs.config( {

	paths: {

		'config'        : 'config.vlib',
		'jquery_ui'     : 'vendor/jquery-ui/jquery-ui.min',
		'jquery'        : 'vendor/jquery/dist/jquery.min',
		'bootstrap'     : 'vendor/bootstrap/dist/js/bootstrap.min',
		'underscore'    : 'vendor/underscore/underscore-min',
		'three'         : 'vendor/threejs/build/three.min',
		'fontHelveticer': 'libs/three/r68/examples/fonts/helvetiker_regular.typeface',
		'orgChart'      : 'libs/jOrgChart/jquery.jOrgChart'
	},
	shim : {
		'jquery_ui'     : {
			exports: '$',
			'deps' : ['jquery']
		},
		'underscore'    : {
			exports: '_'
		},
		'three'         : {
			exports: 'THREE'
		},
		'fontHelveticer': {
			'deps': ['three']
		},
		'tween'         : {
			exports: 'TWEEN'
		},
		'orgChart'      : {
			exports: '$',
			'deps' : ['jquery']
		}
	}

} );

/**
 * VLIB UTILS
 */
define( function ( require ) {
	'use strict';
	return require( 'core/Utils.vlib' );
} );
