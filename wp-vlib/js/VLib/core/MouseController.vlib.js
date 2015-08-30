define(['require','three','jquery'],function(require,THREE,$){

	var MouseController = function( container, renderer ){
		var CALLBACK_PREFIX = "vlib_mc_";
		var DEFAULT_CAMERA_ = { id : "defaultCamera"};
		var $container = $(container);
		var domElement = renderer.domElement;
		var projector = new THREE.Projector();


		/*
		 * map[ type ][ camera ][ 0 ]
		 */
		 /* map.type = [ { object: THREE.Object, callback : function, camera: camera} ]*/
		 var map = {
		 };
		 var cameras = {};

		 var setCamera = function( camera ){
		 	cameras[ camera.id ] = camera;
		 };
		 var clickObjectHandle = function( event ){
		 	event.preventDefault();
		 	var intersected = intersectionTest( event, map[ "click" ]);
		 };
		 var intersectionTest = function( e, cameraObjectsMapping ){

		 	var offsetX = $container.offset().left;
		 	var offsetY = $container.offset().top;
		 	var mouseVector = new THREE.Vector3(
		 		( ( e.clientX -offsetX)/ $container.width()) * 2 - 1,
		 		- ( ( e.clientY+$(window).scrollTop() -offsetY ) / $container.height() ) * 2 + 1,
		 		0 );
		 	/* for each camera do*/
		 	var camera,raycaster, intersections, result = [];
		 	for( cameraId in cameraObjectsMapping ){
		 		camera = cameras[ cameraId ];
		 		if(  camera.id !==  DEFAULT_CAMERA_.id){
		 			projector.unprojectVector( mouseVector, camera );
		 			raycaster = new THREE.Raycaster(
		 				camera.position,
		 				mouseVector.sub( camera.position ).normalize());
		 			intersections = raycaster.intersectObjects( cameraObjectsMapping[ cameraId ] );
		 			if(intersections.length > 0){
		 				intersections[ 0 ].object[CALLBACK_PREFIX+"click"].call(intersections[ 0 ]);
		 			}
		 		}else{
		 			console.log("[ MouseController ][ Warning ] default camera not set.");
		 		}
		 	}
		 	return result;
		 };
		 var handle = {
		 	'click' : clickObjectHandle
		 };
		 var attachListener = function( type ){

		 	if( !handle.hasOwnProperty( type ) ){
		 		console.log("[ MouseController ][ Warning ] "+type+" handle is not available.");
		 		return;
		 	}
		 	console.dir(handle[ type ]);
		 	domElement.addEventListener( type, handle[ type ], false );
		 };
		 var detachListener = function( type ){
		 	if( !handle.hasOwnProperty( type ) ) return;
		 	domElement.removeEventListener( type, handle[ type ] );
		 	console.log("[ MouseController ] eventListener  "+type+" is running");
		 };
		 var isValidType = function( type ){
		 	return handle.hasOwnProperty( type );
		 };

		 return {
		 	setDefaultCamera : function( camera ){
		 		cameras[ DEFAULT_CAMERA_.id ] = camera;
		 		console.dir(cameras);
		 	},
		 	register : function( type, threeObject, callback, camera ){
		 		console.log("[ MouseController ] register "+type+" callback");
		 		var cam = camera || DEFAULT_CAMERA_;

		 		/* check if event type exists */
		 		if(!isValidType( type )){
		 			console.log("[ Warning ][ MouseController.registerListener ] "+type+" is NOT supported.");
		 		}
		 		/* set event type */
		 		if(!map.hasOwnProperty( type ) ){
		 			map[ type ] = {};
		 		}
		 		/* set camera */
		 		/* check if camera has been added before*/
		 		if(!map[ type ].hasOwnProperty( cam.id ) ){
		 			map[ type ][ cam.id ] = [];
		 			if(cam.id != DEFAULT_CAMERA_.id){
		 				cameras[ cam.id ] = cam;
		 			}

		 		}

		 		/* set callback reference */
		 		threeObject[ CALLBACK_PREFIX+type ] = callback;
		 		/* add object to map */
		 		map[ type ][ cam.id ].push( threeObject );
		 		console.dir( map );
		 	},
		 	update : function( e ){

		 	},
		 	enable : attachListener,
		 	disable : detachListener
		 }
		};
		return MouseController;
	});
