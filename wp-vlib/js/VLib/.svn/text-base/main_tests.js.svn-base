requirejs.config({

	paths : {
		'vlib' : 'core/Vlib',
		'config' : 'config.vlib',
		'pluginLoader' : 'pluginLoader',
		'jquery' : 'libs/jquery/jquery.min',
		'underscore' : 'libs/underscore/underscore.min',
		'three' : 'libs/three/build/three.min',
		'three_trackball_controls' : 'libs/three/controls/TrackballControls',
		'three_orbit_controls' : 'libs/three/controls/OrbitAndPanControls',
		'orgChart' : 'libs/jOrgChart/jquery.jOrgChart',
		'd3':'libs/novus/lib/d3.v3',
		'nv':'libs/novus/nv.d3'
	},
	shim : {
		'underscore' : {
			exports : '_'
		},

		'three' : {
			exports : 'THREE'
		},

		'three_trackball_controls' : {
			exports : 'THREE',
			'deps' : ['three']
		},
		'three_orbit_controls' : {
			exports : 'THREE',
			'deps' : ['three']
		},
		'orgChart' : {
			exports : '$',
			'deps' : ['jquery']
		},
		'd3':{
			exports: 'd3'
		},
		'nv':{
			'deps' : ['d3'],
			exports: 'd3'
		}

	}
});

/**
 * MAIN EDIT-MODE
 */
 define(function(require) {

 	require(
 		[ 'jquery', 'config'],
 		function($,Config) {
 			var surface_1 = require('templates/t1_surface.tmpl.vlib');
 			var surface1 = {
 				sceneGraph	: surface_1,
 				name		: 'Surface test ',
 				description	: 'T1: 3d surface and axes using a plane dataset. FUNCTION z = cos(x)'
 			};
	 	// ************************************************************************
		// INIT LIB
		// ************************************************************************
		var VLib = require('vlib');
		var v = new VLib();

		var plotModule = require('core/modules/plot/plot.vlib');
		var plot = new plotModule();



		var run = function(){
			$('.vlib-plot').each(function(e){
				var templ_id = $(this).attr('id');
				var plot = new plotModule();
				v.registerModule(plot);
				plot.init('#'+templ_id);
				//AJAX-load template
				//var template = load(templ_id);
				v.load(surface1,plot);
			});
		}
		$(document).ready(function(){
			run();
		});

	});






 });
