self.onmessage = function ( e ) {
	var _RESPONSE_PACKAGE_SIZE_ = 1000;
	var isRunning = true,
		id = e.data.id,
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
	sendMessage( e.data, STATUS.OK );

	self.close();
};