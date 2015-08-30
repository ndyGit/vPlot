define(function(require) {
	/**
		Publish Subscribe Pattern<br />
		@class VMediator
		@constructor
	 **/
	var VMediator =  function(){

		/**
			Channel - Message mapping
			@private
			@property moduleChannels
			@type {Object}
		**/
		var moduleChannels = {};
		var subscribeModule = function(channel, fn){
			if (!moduleChannels[channel])
				moduleChannels[channel] = [];

			moduleChannels[channel].push({ context: this, callback: fn });
			return this;
		},
		publishModule = function(channel){
			if (!moduleChannels[channel]) return false;
			var args = Array.prototype.slice.call(arguments, 1);
			for (var i = 0, l = moduleChannels[channel].length; i < l; i++) {
				var subscription = moduleChannels[channel][i];
				subscription.callback.apply(subscription.context, args);
			}
			return this;
		};
		getChannels = function(){
			return moduleChannels;
		};

		return {
			/**
				Channels in use
		 		@public
		 		@method getChannels
		 		@return {Object}
		 	 **/
			getChannels: getChannels,
			/**
				Adds <b>publish</b> and <b>subscribe</b> functionality to the
				given module by injecting these methods.
		 		@public
		 		Module
		 		@param obj
		 		@method registerModule
		 	 **/
			registerModule: function(obj){
				obj.subscribe = subscribeModule;
				obj.publish = publishModule;
				console.log("[VLibMediator][registerModule][ "+obj.name+" ]");
			},
			publish	:	publishModule
		};

	};

	return VMediator;

});
