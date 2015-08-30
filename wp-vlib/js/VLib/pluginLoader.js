define(function(require) {

	/**
	 * argument v: An instance of VLib.
	 */
	return (function(registerPluginCallback) {
		if(typeof registerPluginCallback !== 'function')
			new TypeError('registerPluginCallback is not a callback function!');
		/** ********************************************** */
		/** REGISTER CORE PLUGINS */
		/** ********************************************** */
		var plugin;
		//registerPluginCallback(plugin);

		// 2d
		// plugin = require('plugins/2d/2d.vlib');
		// registerPluginCallback(plugin);
		/*plugin = require('plugins/2d/line_chart/line_chart.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/dataset2d/dataset2d.vlib');
		registerPluginCallback(plugin);

		//var twoD = require('plugins/tree/tree.vlib');
		//registerPluginCallback(twoD);
		*/

		/******** 3D ********/

		// Context 3D
		plugin = require('plugins/plugins_3d/3d/3d.vlib');
		registerPluginCallback(plugin);

		// Camera
		plugin = require('plugins/plugins_3d/cameraControl/cameraControl.vlib');
		registerPluginCallback(plugin);

		// Legend
		plugin = require('plugins/plugins_3d/legend/legend.vlib');
		registerPluginCallback(plugin);

		// Plots
		plugin = require('plugins/plugins_3d/scatterplot/scatterplot.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/surfaceplot/surfaceplot.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/lineplot/lineplot.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/barchartPlot/barchartplot.vlib');
		registerPluginCallback(plugin);



		// Data
		plugin = require('plugins/plugins_3d/dataset/dataset.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/file/file.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/geometry/plane.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/geometry/line.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/fun/fun.vlib');
		registerPluginCallback(plugin);


		// Axes
		plugin = require('plugins/plugins_3d/axes/axes.vlib');
		registerPluginCallback(plugin);
		// plugin = require('plugins/plugins_3d/axesCube/axesCube.vlib');
		// registerPluginCallback(plugin);

		// Color
		plugin = require('plugins/plugins_3d/heatmapPoints/heatmapPoints.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/color/color.vlib');
		registerPluginCallback(plugin);


		// plugin = require('plugins/plugins_3d/light/light.vlib');
		// registerPluginCallback(plugin);

		// Materials
		plugin = require('plugins/plugins_3d/materials/basic/basicMaterial.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/materials/wireframe/wireframeMaterial.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/materials/cubemap/cubemapMaterial.vlib');
		registerPluginCallback(plugin);

		// Mouse
		plugin = require('plugins/plugins_3d/mouse/mouse.vlib');
		registerPluginCallback(plugin);

		// Animations
		plugin = require('plugins/plugins_3d/activity/fade/fade.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/activity/move/move.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/activity/scale/scale.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/activity/link/link.vlib');
		registerPluginCallback(plugin);
		plugin = require('plugins/plugins_3d/activity/label/label.vlib');
		registerPluginCallback(plugin);

		// Tick
		plugin = require('plugins/plugins_3d/activity/tick/tick.vlib');
		registerPluginCallback(plugin);

		// State
		plugin = require('plugins/plugins_3d/state/state.vlib');
		registerPluginCallback(plugin);

		// Msg
		plugin = require('plugins/plugins_3d/msg/msg.vlib');
		registerPluginCallback(plugin);

		/***********************************************************************
		 * REGISTER ADDITIONAL PLUGINS HERE e.g. plugin to add:
		 * 'VLib/plugins/myPlugin/myPlugin.vlib.js' var myPlugin =
		 * require('plugins/myPlugin/myPlugin.vlib');
		 * registerPluginCallback(myModule);
		 */
		// var myPlugin = require('plugins/root/root.vlib');
		// registerPluginCallback( new myPlugin());


	})

});
