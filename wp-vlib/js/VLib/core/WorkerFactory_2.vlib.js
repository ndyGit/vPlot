define(['require','core/worker/Worker.Tasks.vlib','core/worker/PseudoWorker.Tasks.vlib','config'],function(require, TASKS, PSEUDOTASKS, Config) {
	'use strict';

	/*****************************************************************************************************************************/
	/* WORKER WRAPPER  */
	/*****************************************************************************************************************************/
	var WorkerWrapper = function( worker, workerTask ){
		var thread = worker;
		var task = workerTask;

		/**
		This method creates a worker-argument-object and serializes it.<br />
		@method buildArgs
		@param args {Array}
		@return Serialized worker-arguments {String}
		@private
		**/

		var buildArgs = function( args ){
			var threadArgs = {};
			threadArgs.deps = task.deps;
			threadArgs.requires = task.requires;
			threadArgs.args = args;
			//return JSONfn.stringify( threadArgs );
			return threadArgs;
		};

		return{
			onmessage : thread.onmessage,
			onerror : thread.onerror,
			postMessage : function( args ){
				var threadArgs = buildArgs( args );
				thread.postMessage( threadArgs );
			}
		};
	};
	/*****************************************************************************************************************************/
	/* PSEUDO WORKER  */
	/*****************************************************************************************************************************/
	var PseudoWorker = function( task ){
		var WAITINGTIME = 0;
		/**
		 THIS IS AN ABSTRACT METHOD AND HAS TO BE OVERWRITTEN.
		 @method onmessage
		 @abstract
		 **/
		this.onmessage = function( e ){
			console.log("[Worker error] call on abstract function [ onmessage ]");
			console.dir( e.data );
		};
		/**
		 THIS IS AN ABSTRACT METHOD AND HAS TO BE OVERWRITTEN.
		 @method onerror
		 @abstract
		 **/
		this.onerror= function( e ){
			console.log("[Worker error] call on abstract function [ onerror ]");
			console.dir( e.data );
		};
		this.terminate = function(){
			/* stub */
		};
		this.postMessage = function(msg){

			var that = this;
			var context = {
				isPseudoWorker : true,
				isRunning : true,
				postMessage : function( e ){
					console.log("response from PSEUDO");
					that.onmessage( { data: e} );
				},
				onerror : this.onerror
			};

			task.apply( context, [ { data : msg } ]);

		};
	};
	var WorkerFactory = function( forcePseudoWorker ){
		var STATUS = {
			OK : 'ok',
			ERROR : 'error',
			INFO : 'info',
			DONE : 'done'
		};
		var Thread = window.Worker;
		Thread.postMessage = Thread.webkitPostMessage || Thread.postMessage;
		var isWorker = true;
		if(typeof Thread  !== "function"){
			Thread  = PseudoWorker;
			isWorker = false;
		}

		if(forcePseudoWorker !== undefined && forcePseudoWorker == true){
			Thread = PseudoWorker;
			isWorker = false;
			console.log("WebWorker not available. Using PseudoWorker.");
		}
		var getWorker = function( task, onUpdate, onDone, onError, onInfo ){
			var blobURL = task;
			if( isWorker ){
				blobURL = URL.createObjectURL( new Blob([ '(',task.toString(),')()' ], { type: 'application/javascript' }));
			}
			var worker = new Thread( blobURL );

			var writer = function(e) {
				var msg = e.data;
				switch(msg.status){
					case STATUS.OK :
						onUpdate( msg.response );
						break;
					case STATUS.ERROR :
						onError( msg.response );
						break;
					case STATUS.INFO :
						onInfo( msg.response );
						break;
					case STATUS.DONE :
						this.terminate();
						onDone( msg.response );
						break;
				}
			};
			worker.onmessage = writer;
			worker.onerror = onError;
			return worker;
		};
		return{
			TASK : isWorker ? TASKS : PSEUDOTASKS,
			STATUS : STATUS,
			create : function( task, update, done, error, info ){
				/*
				 * http://stackoverflow.com/questions/5408406/web-workers-without-a-separate-javascript-file/16799132#16799132
				 */
				var workerTask = task;
				if( typeof task === 'string' ){
					switch( task ){
						case 'echo':
							workerTask = this.TASK.ECHO_TASK;
							break;
						case 'scale-objects-lin':
							workerTask = this.TASK.TASK_SCALE_OBJECTS_LIN;
							break;
						case 'scale-float32array-lin':
							workerTask = this.TASK.TASK_SCALE_FLOAT32ARRAY_LIN;
							break;
						default:
							console.error("[ WorkerFactory.create ] Invalid task given.");
							return false;
							break;
					}
				}
				//return new WorkerWrapper( new Worker(Config.basePath+Config.appPath+'/core/worker/EchoWorker.vlib.js'), workerTask );
				return new WorkerWrapper( getWorker( workerTask.worker, update, done, error, info ), workerTask );
			}
		};

	};
	return WorkerFactory;
});
