define(function(require) {

	var plugin = (function() {
				this.name = 'root';
				this.exec = function(config){
					alert("plugin[ root ] code function called from module "+config);
					return "done";
				}
				return {
					name	:	this.name,
					exec	:	this.exec
				}	
			});
	
	return plugin;

});