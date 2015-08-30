/**
 * Created by Andreas Gratzer on 25/10/14.
 */
self.onmessage = function ( e ) {
importScripts( '../../libs/require/require.min.js' );
var _RESPONSE_PACKAGE_SIZE_ = 1000;
var isRunning = true,
	STATUS = {
		OK   : 'ok',
		ERROR: 'error',
		INFO : 'info',
		DONE : 'done'
	};

var sendMessage = function ( response, status ) {
	var msg = {status: status || STATUS.OK, response: response};
	postMessage( msg );
};
/* check args */


//sendMessage( "[ Worker " + id + " ] receives message  ", STATUS.INFO );
sendMessage( "test", STATUS.OK );

	id = e.data.id;
	require( {
			baseUrl: "./"
		},
		["require", "../utils/Utils.Scale.vlib.js"],
		function ( require, Scale ) {
			sendMessage( e.data, STATUS.OK );
		} );
};