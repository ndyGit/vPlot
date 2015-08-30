({
	//The top level directory that contains your app. If this option is used
	//then it assumed your scripts are in a subdirectory under this path.
	//This option is not required. If it is not specified, then baseUrl
	//below is the anchor point for finding things. If this option is specified,
	//then all the files from the app directory will be copied to the dir:
	//output area, and baseUrl will assume to be a relative path under
	//this directory.
	appDir                    : "../",
	//By default, all modules are located relative to this path. If baseUrl
	//is not explicitly set, then all modules are loaded relative to
	//the directory that holds the build file. If appDir is set, then
	//baseUrl should be specified as relative to the appDir.
	baseUrl                   : "./",
	//The directory path to save the output. If not specified, then
	//the path will default to be a directory called "build" as a sibling
	//to the build file. All relative paths are relative to the build file.
	dir                       : "../../VLib_dist/",
	paths                     : {
		'three'                   : 'libs/vendor/threejs/build/three.min',
		'threeShaderLib'          : 'libs/threeCustom/renderers/shaders/ShaderLib',
		'fontHelveticer'          : 'libs/threeCustom/fonts/helvetiker_regular.typeface',
		'config'                  : './config.vlib',
		'pluginLoader'            : 'pluginLoader',
		//'jquery_ui'                 : 'libs/jquery-ui/custom-min/jquery-ui.min',
		'jquery_ui'               : 'libs/vendor/jquery-ui/jquery-ui.min',
		'jquery'                  : 'libs/vendor/jquery/dist/jquery.min',
		'bootstrap'               : 'libs/vendor/bootstrap/dist/js/bootstrap.min',
		'underscore'              : 'libs/vendor/underscore/underscore-min',
		'tween'                   : 'libs/tween/tween',
		'three_multilinetext'     : 'libs/threeCustom/helpers/MultilineTextHelper',
		'three_trackball_controls': 'libs/threeCustom/controls/TrackballControls',
		'three_orbit_controls'    : 'libs/threeCustom/controls/OrbitControls',
		'orgChart'                : 'libs/jOrgChart_AMD/jquery.jOrgChart',
		'text'                    : 'libs/vendor/text/text'
	},
	shim                      : {

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
		'threeShaderLib'          : {
			exports: 'THREE',
			deps   : ['three']
		},
		'three_multilinetext'     : {
			exports: 'THREE',
			deps   : ['three']
		},
		'three_trackball_controls': {
			exports: 'THREE',
			deps   : ['three']
		},
		'three_orbit_controls'    : {
			exports: 'THREE',
			deps   : ['three']
		},

		'bootstrap': {
			deps   : ['jquery'],
			exports: '$'
		},
		'jquery_ui': {
			exports: '$',
			deps   : ['jquery']
		}
	},
	wrapShim                  : true,
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
	optimizeCss               : "standard.keepLines.keepWhitespace",
	//List the modules that will be optimized. All their immediate and deep
	//dependencies will be included in the module's file when the build is
	//done. If that module or any of its dependencies includes i18n bundles,
	//only the root bundles will be included unless the locale: section is set above.

	//optimize: "uglify",
	optimize                  : "none",
	modules                   : [
		{
			name: 'vlib_full'
		}/*,
		 {
		 name: 'vlib_base'
		 }*/
	]
})
