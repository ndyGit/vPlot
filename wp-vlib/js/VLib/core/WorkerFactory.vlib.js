define(['require','core/Utils.vlib','config'],function(require,UTILS,Config) {
	'use strict';

	var WorkerFactory = function(){
		this.Thread = window.Worker;
		this.isWorker = true;
		if(typeof this.Thread  !== "function"){
			this.Thread  = PseudoWorker;
			this.isWorker = false;
		}
		this.Thread.postMessage = this.Thread.webkitPostMessage || this.Thread.postMessage;
	}
	WorkerFactory.prototype.create = function(options){
		var task,blob;
		switch(options.type){
			case "scale-objects-linear":
			task = this.isWorker ? WorkerFactory.TASK.workerScaleObjectsLinear : WorkerFactory.TASK.pseudoworkerScaleObjectsLinear;
			break;
			default:
			throw new Error("[ WorkerFactory ] Unsupported type!");
			break;
		};
		/*
		* http://stackoverflow.com/questions/5408406/web-workers-without-a-separate-javascript-file/16799132#16799132
		*/
		blob = task;
		if(this.isWorker){
			blob = URL.createObjectURL( new Blob([ '(',task.toString(),')()' ], { type: 'application/javascript' }));
			//blob = Config.basePath+"/"+Config.appPath+"/core/WorkerScaleLinear.vlib.js";
		}
		return new this.Thread(blob);
	}

	/*****************************************************************************************************************************/
	/* WORKER TASKS */
	/*****************************************************************************************************************************/
	WorkerFactory.TASK = {
		workerScaleObjectsLinear : function(){

			self.onmessage = function(e){

				var url = e.data.url;
				var data = e.data.data;
				var borders = e.data.borders;
				var dataOffset = e.data.offset;
				var dataLen = data.length;
				importScripts(url+"/libs/require/require.min.js");

				require ({
					/*TODO: HARDCODED PATH! CHANGE TO RELATIVE*/
					baseUrl: url

				},["core/utils/Utils.Scale.vlib"],function(Scale){

					var xScaler = Scale().range([borders.x_SCALE_MIN,borders.x_SCALE_MAX]).domain([borders.x_MIN,borders.x_MAX]);
					var yScaler = Scale().range([borders.y_SCALE_MIN,borders.y_SCALE_MAX]).domain([borders.y_MIN,borders.y_MAX]);
					var zScaler = Scale().range([borders.z_SCALE_MIN,borders.z_SCALE_MAX]).domain([borders.z_MIN,borders.z_MAX]);

					var tId;
					var packageSize = 2000;
					var offset = 0;
					var result;
					var run = function(){

						for(;offset < dataLen;){
							result = {
								indices : [],
								vertices : []
							};
							var d;
							for(var i = 0; i < packageSize; ++i){
								if(offset + i >= dataLen ){
									break;
								}
								d = data[offset + i];
								data[offset + i].x = xScaler.linear(d.x);
								data[offset + i].y = yScaler.linear(d.y);
								data[offset + i].z = zScaler.linear(d.z);
								result.indices.push(dataOffset + offset + i);
								result.vertices.push(data[offset + i]);
							}
							postMessage(result);
							offset += i;
						}
					};

					run();

					self.close();
					//self.terminate();
				});
			};
},
pseudoworkerScaleObjectsLinear : function(e, postMessage,waitingtime){
	var url = e.data.url;
	var data = e.data.data;
	var borders = e.data.borders;
	var dataOffset = e.data.offset;
	var xScaler = UTILS.scale().range([borders.x_SCALE_MIN,borders.x_SCALE_MAX]).domain([borders.x_MIN,borders.x_MAX]);
	var yScaler = UTILS.scale().range([borders.y_SCALE_MIN,borders.y_SCALE_MAX]).domain([borders.y_MIN,borders.y_MAX]);
	var zScaler = UTILS.scale().range([borders.z_SCALE_MIN,borders.z_SCALE_MAX]).domain([borders.z_MIN,borders.z_MAX]);

	var dataLen = data.length;
	var tId;
	var packageSize = 5000;
	var offset = 0;
	var result;
	var run = function(){
		if(offset >= dataLen)
			return;
		result = {
			indices : [],
			vertices : []
		};
		for(var i = 0; i < packageSize; ++i){
			if(offset + i >= dataLen ){
				clearTimeout(tId);
				break;
			}
			data[offset + i].x = xScaler.linear(data[offset + i].x);
			data[offset + i].y = yScaler.linear(data[offset + i].y);
			data[offset + i].z = zScaler.linear(data[offset + i].z);
			result.indices.push(dataOffset + offset + i);
			result.vertices.push(data[offset + i]);
		}
		postMessage({data:result});
		offset += i;
		tId = setTimeout(run,5);
	};
	tId = setTimeout(run,0);
}
};
/*****************************************************************************************************************************/
/* PSEUDO WORKER  */
/*****************************************************************************************************************************/
var PseudoWorker = function(task){
	var WAITINGTIME = 0;
this.onmessage = function(e){/* function stub */};
this.postMessage = function(msg){
	task({data:msg},this.onmessage,WAITINGTIME);
}
};
return new WorkerFactory();
});
