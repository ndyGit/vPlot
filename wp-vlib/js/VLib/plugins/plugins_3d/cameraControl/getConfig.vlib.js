define(
	['require', 'jquery'],
	function ( require, $ ) {
		/**
		 * Takes inserted configuration from the plugin-template and
		 * returns the parameters as JSON-config-file
		 *
		 * @param containerId
		 *            parent container where the plugin-template got
		 *            added
		 *
		 * @return config file format:
		 *         {camera:{x:VALUE,y:VALUE,z:VALUE}}
		 */
		return function ( containerId ) {
			var $container = $( '#' + containerId );
			var lookAtX = $container.find( '#lookAt-x' ).val();
			var lookAtY = $container.find( '#lookAt-y' ).val();
			var lookAtZ = $container.find( '#lookAt-z' ).val();
			var posRotUp = $container.find( '#camera-pos-rot-up' ).val();
			var cam = JSON.parse( posRotUp );

			var useCC = $container.find( '#use-mouse-controller' ).is( ':checked' );

			var controlType = $container.find( 'select[id=controlTypeSelect] option:selected' ).val();

			var result = {
				controlType: controlType,
				position   : {
					x: cam.position.x,
					y: cam.position.y,
					z: cam.position.z
				},
				rotation   : {
					x: cam.rotation.x,
					y: cam.rotation.y,
					z: cam.rotation.z
				},
				up         : {
					x: cam.up.x,
					y: cam.up.y,
					z: cam.up.z
				},
				lookAt     : {
					x: parseFloat(lookAtX),
					y: parseFloat(lookAtY),
					z: parseFloat(lookAtZ)
				},
				useCC      : useCC
			};

			return result;
		};

	} );
