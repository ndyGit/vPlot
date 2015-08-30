self.onmessage = function(e){

	var url = e.data.url;
	var data = e.data.data;
	var borders = e.data.borders;
	var dataOffset = e.data.offset;
	var dataLen = data.length;
	importScripts("../libs/require/require.min.js");

	require ({
		/*TODO: HARDCODED PATH! CHANGE TO RELATIVE*/
		baseUrl: '../'

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
	});
};
