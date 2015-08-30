({
	//The top level directory that contains your app. If this option is used
	//then it assumed your scripts are in a subdirectory under this path.
	//This option is not required. If it is not specified, then baseUrl
	//below is the anchor point for finding things. If this option is specified,
	//then all the files from the app directory will be copied to the dir:
	//output area, and baseUrl will assume to be a relative path under
	//this directory.
	appDir: "../",
	//By default, all modules are located relative to this path. If baseUrl
	//is not explicitly set, then all modules are loaded relative to
	//the directory that holds the build file. If appDir is set, then
	//baseUrl should be specified as relative to the appDir.
	baseUrl: "./",
	//The directory path to save the output. If not specified, then
	//the path will default to be a directory called "build" as a sibling
	//to the build file. All relative paths are relative to the build file.
	dir: "../../../tests/js/VLib",
	//Set paths for modules. If relative paths, set relative to baseUrl above.
	//If a special value of "empty:" is used for the path value, then that
	//acts like mapping the path to an empty file. It allows the optimizer to
	//resolve the dependency to path, but then does not include it in the output.
	//Useful to map module names that are to resources on a CDN or other
	//http: URL when running in the browser and during an optimization that
	//file should be skipped because it has no dependencies.
	paths : {
		'vlib' : 'core/Vlib',
		'config' : 'config.vlib',
		'pluginLoader' : 'pluginLoader',
		'jquery_ui' : 'libs/jquery-ui/js/jquery-ui-1.10.3.custom.min',
		'jquery' : 'libs/jquery/jquery.min',
		'underscore' : 'libs/underscore/underscore.min',
		'three' : 'libs/three/build/three',
		'three_tween' : 'libs/three/build/tween',
		'three_trackball_controls' : 'libs/three/examples/js/controls/TrackballControls',
		'three_orbit_controls' : 'libs/three/examples/js/controls/OrbitAndPanControls',
		'three_buffer' : 'libs/three/build/BufferGeometryUtils',
		'orgChart' : 'libs/jOrgChart/jquery.jOrgChart',
		'bootstrap':'libs/bootstrap/bootstrap.min',
		'fontHelveticer' : 'libs/font_helveticer'

	},
	shim : {

		'underscore' : {
			exports : '_'
		},
		'three' : {
			exports : 'THREE'
		},
		'three_tween' : {
			exports : 'TWEEN'
		},
		'three_buffer' : {
			'deps' : ['three'],
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
		'jquery_ui' : {
			exports : '$',
			'deps' : ['jquery']
		},
		'orgChart' : {
			exports : '$',
			'deps' : ['jquery']
		},
		'bootstrap' : {
			'deps' : ['jquery']
		}

	},
	//Allows namespacing requirejs, require and define calls to a new name.
	//This allows stronger assurances of getting a module space that will
	//not interfere with others using a define/require AMD-based module
	//system. The example below will rename define() calls to foo.define().
	//See http://requirejs.org/docs/faq-advanced.html#rename for a more
	//complete example.
	//namespace: 'vlib',
	//If it is not a one file optimization, scan through all .js files in the
	//output directory for any plugin resource dependencies, and if the plugin
	//supports optimizing them as separate files, optimize them. Can be a
	//slower optimization. Only use if there are some plugins that use things
	//like XMLHttpRequest that do not work across domains, but the built code
	//will be placed on another domain.
	optimizeAllPluginResources: false,
	//Allow CSS optimizations. Allowed values:
	//- "standard": @import inlining and removal of comments, unnecessary
	//whitespace and line returns.
	//Removing line returns may have problems in IE, depending on the type
	//of CSS.
	//- "standard.keepLines": like "standard" but keeps line returns.
	//- "none": skip CSS optimizations.
	//- "standard.keepComments": keeps the file comments, but removes line
	//returns. (r.js 1.0.8+)
	//- "standard.keepComments.keepLines": keeps the file comments and line
	//returns. (r.js 1.0.8+)
	//- "standard.keepWhitespace": like "standard" but keeps unnecessary whitespace.
	optimizeCss: "standard.keepLines.keepWhitespace",
	 //List the modules that will be optimized. All their immediate and deep
	//dependencies will be included in the module's file when the build is
	//done. If that module or any of its dependencies includes i18n bundles,
	//only the root bundles will be included unless the locale: section is set above.
	//removeCombined: true,
	modules: [
	{
		name:'main_plot'
	}
	]
})
