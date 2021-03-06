define(['require','jquery','underscore','config'],function(require,$,_,Config) {
			/**
			TODO<br />
			@module Templates
			@class Templates
			**/
			var module = (function() {
				this._name = 'templates';
				var templateArray = [];
				var _templates = Config.getModulePath()+'templates/templates.js';
				var isRegisterd = function() {
					return ( typeof module.subscribe === 'function' ) && ( typeof module.publish === 'function');
				}

				var _init = function(container) {
					this.container = $(container);

					if (isRegisterd()) {
				// inject script templates
				module.publish(Config.CHANNEL_INJECT_SCRIPTTEMPLATE,{url : _templates});
				/** *************************************** */
				/* CALL FUNCTIONS HERER */
				/** *************************************** */
				addListener();
				addGui();
				/** *************************************** */
			} else {
				throw 'Module [ '
				+ this.name
				+ ' ] not registered! Use VLib.registerModule(obj) first.';
			}

		};

		/** *************************************** */
		/* ADD LISTENERS HERER */
		/** *************************************** */
		var addListener = function() {
			//console.log("[ "+module.name+" ] add listener");
			module.subscribe(Config.CHANNEL_RESPOND_TEMPLATES,
				respondTemplatesHandle);

			module.subscribe(Config.CHANNEL_RESPOND_DELETETEMPLATECALLBACK, deleteTemplateCBHandle);


		};
		/** *************************************** */
		/* ADD FUNCTIONS HERE */
		/** *************************************** */
		var addGui = function(){

			_.templateSettings.variable = "rc";
			// get template code
			var templateData = {
				title : 'Saved Plots'
			};
			var template = _.template($("script.templateListContainer").html());

			module.container.html(template(templateData));

			// request templates
			//console.log('[ Templates ][ addGui ] requestTemplates');
			module.publish(Config.CHANNEL_REQUEST_TEMPLATES);
		};
		var deleteTemplateCallback = function(){
			this.publish(Config.CHANNEL_ERROR,'templates. saveTemplateCallback not set!');
		};
		/* LISTENERS */
		var deleteTemplateCBHandle = function(callback){
			if(typeof(callback) !== 'function'){
				this.publish(Config.CHANNEL_ERROR,'deleteTemplateCallback is NOT a function!');
				return;
			}
			deleteTemplateCallback = callback;
		}
		/**
		 * click listener
		 * broadcasts template to subscribers of chanel XXX
		 */
		 var templateClickListener = function(){
		 	$('.vLibTemplate').click(function(){
		 		var id = $(this).attr('id');
		 		var index = id.split('-')[1];

		 		module.publish(Config.CHANNEL_RESET,{});
		 		module.publish(Config.CHANNEL_TEMPLATES_TEMPLATE_SELECTED,{template:_.clone(templateArray[index])});
		 		//module.publish(Config.CHANNEL_RENDER_TEMPLATE,{template:_.clone(templateArray[index])});
		 	});
		 	$('.vLibTemplateDelete').click(function(){
		 		var id = $(this).attr('id');
		 		var index = id.split('-')[1];
		 		var template = templateArray[index];
		 		if(!confirm('Delete template [ id='+template.id+', name='+template.name+' ]?'))
		 			return;

		 		deleteTemplateCallback(_.clone(template));

		 	});

		 }
		/**
		 * @param obj: Array of objects
		 * 	each object: {
		 * 		id 		: int
		 * 		sceneGraph	: object,
		 * 		name		: string,
		 * 		description	: string,
		 * 		timestamp	: string
		 *  }
		 */
		 var respondTemplatesHandle = function(obj){

		 	//console.log("[templates] respondTemplatesHandle() called");
		 	templateArray = _.clone(obj);
		 	var t = module.container.find('#templateContainer');
		 	t.html("");
		 	if(obj.length == 0) return;

		 	var template = _.template($("script.templateContainer").html());
		 	_.templateSettings.variable = "rc";
		 	$.each(obj,function(i,o){
		 		t.append(template({index:i,id:o.id,name:o.name,description:o.description}));
		 	});
		 	templateClickListener();
		 }

		 /* public */
		 return {
		 	name : _name,
		 	init : _init

		 }
		})();
		return module;

	});
