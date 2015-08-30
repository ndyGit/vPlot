/**
 * Created by Andreas Gratzer on 21/10/14.
 */
define( ['require', 'jquery', 'config'], function ( require, $, Config ) {
	var WordPressDBDriver = function ( wp ) {
		"use strict";
		var wordpress = wp;
		/* ********************************************* */
		/* HELPER */
		this.fetshAndRegisterExternaFiles = function ( vLib ) {

			var jsonObj = {"action": "get_visible_files"};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};
			$.ajax( {
				type   : 'POST',
				url    : wordpress.basePath + "process.php",
				data   : postArray,
				success: function ( data ) {
					vLib.emptyFileList();
					if ( data !== "" ) {
						var d = $.parseJSON( data );
						var fileTmp;
						for ( var i = 0; i < d.length; i++ ) {
							fileTmp = {
								id         : d[i].id,
								time       : d[i].time,
								path       : d[i].file_path,
								name       : d[i].file_name,
								fullName   : d[i].full_file_name,
								description: d[i].file_description
							};
							vLib.registerFile( fileTmp );
						}
					}
					vLib.publish( Config.CHANNEL_REQUEST_FILES );
					vLib.publish( Config.CHANNEL_REFRESH );
				}
			} );
		};
		this.fetshAndRegisterAllExternaFiles = function ( vLib ) {

			var jsonObj = {"action": "get_files"};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};
			$.ajax( {
				type   : 'POST',
				url    : wordpress.basePath + "process.php",
				data   : postArray,
				async : false,
				success: function ( data ) {
					vLib.emptyFileList();
					if ( data !== "" ) {
						var d = $.parseJSON( data );
						var fileTmp;
						for ( var i = 0; i < d.length; i++ ) {
							fileTmp = {
								id         : d[i].id,
								time       : d[i].time,
								path       : d[i].file_path,
								name       : d[i].file_name,
								fullName   : d[i].full_file_name,
								description: d[i].file_description
							};
							vLib.registerFile( fileTmp );
						}
					}
					vLib.publish( Config.CHANNEL_REQUEST_FILES );
					vLib.publish( Config.CHANNEL_REFRESH );
				}
			} );
		};

		this.fetshAndRegisterTemplates = function ( vLib ) {

			var jsonObj = {"action": "get_t"};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};
			$.ajax( {
				type   : 'POST',
				url    : wordpress.basePath + "process.php",
				data   : postArray,
				success: function ( data ) {
					vLib.emptyTemplateList();
					if ( data !== "" ) {
						var d = $.parseJSON( data );
						var t, pattern;
						for ( var i = 0; i < d.length; i++ ) {

							if(!d[i].id || !d[i].template_graph){
								console.log(d[i]);
								console.warn("[databasedriver][fetshAndRegisterTemplates] Invalid template object.");
								continue;
							}

							if ( d[i].pattern !== null ) {
								pattern = d[i].pattern.split( ',' );
							} else {
								pattern = [];
							}

							t = {
								id         : d[i].id,
								sceneGraph : JSON.parse( d[i].template_graph ),
								name       : d[i].template_name,
								description: d[i].template_description,
								pattern    : pattern
							};
							vLib.registerTemplate( t );
						}
					}
					vLib.publish( Config.CHANNEL_REQUEST_TEMPLATES );
					vLib.publish( Config.CHANNEL_REFRESH );
				}
			} );
		};

		/* ********************************************* */
		/* GROUP */
		this.saveGroup = function ( group, callback ) {

			var jsonObj = {
				action: "save-group",
				group : group
			};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};

			$.ajax( {
				type   : 'POST',
				url    : wordpress.basePath + "process.php",
				data   : postArray,
				success: function ( data ) {
					alert( "Save done." );
					if ( callback ) {
						callback.call( this, data );
					}
				},
				error  : function ( e ) {
					alert( "error" );
				}
			} );
		};

		this.updateGroup = function ( id, group, callback ) {
			var jsonObj = {
				action: "update-group",
				id    : id,
				group : group
			};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};

			$.ajax( {
				type   : 'POST',
				url    : wordpress.basePath + "process.php",
				data   : postArray,
				success: function ( data ) {
					alert( "Update done." );
					if ( callback ) {
						callback.call( this, data );
					}
				},
				error  : function ( e ) {
					alert( "error" );
				}
			} );
		};

		this.loadGroup = function ( id, callback ) {
			var jsonObj = {
				action: "load-group",
				id    : id
			};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};

			$.ajax( {
				type    : 'POST',
				url     : wordpress.basePath + "process.php",
				data    : postArray,
				dataType: 'json',
				success : function ( data ) {
					if ( callback ) {
						callback.call( this, data.group );
					}
					return data.group;
				},
				error   : function ( e ) {
					console.error( e.responseText );
					alert( "error" );
				}
			} );
		};
		this.deleteGroup = function ( callback, context, id ) {
			var jsonObj = {
				"action": "delete-group",
				id      : id
			};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};
			jQuery.ajax( {
				type    : 'POST',
				url     : wordpress.basePath + "process.php",
				data    : postArray,
				success : function ( e ) {
					if( callback )
					callback.call( context, e );
				},
				fail    : function () {
					alert( "Unable to delete group." );
				}
			} );
		};
		this.loadGroups = function ( callback, context ) {
			var jsonObj = {"action": "load-all-group-definitions"};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};
			jQuery.ajax( {
				type    : 'POST',
				dataType: "JSON",
				url     : wordpress.basePath + "process.php",
				data    : postArray,
				success : function ( data ) {
					callback.apply( context, [data] );
				},
				fail    : function () {
					alert( "Unable to load group list." );
				}
			} );
		};
		/* ********************************************* */
		/* TEMPLATE / PLOT */
		this.saveTemplate = function( callbackSuccess, callbackError, context, template ){
			var jsonObj = {
				action      : "save",
				name        : template.name,
				description : template.description,
				sceneGraph  : template.sceneGraph,
				placeholders: template.placeholders,
				thumbnail   : template.thumbnail
			};

			console.log(jsonObj);

			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};

			$.ajax( {
				type   : 'POST',
				url    : wordpress.basePath + "process.php",
				data   : postArray,
				success: function ( id ) {
					if( callbackSuccess )
						callbackSuccess.call( context, id );
				},
				error  : function ( e ) {
					if( callbackError ){
						callbackError.call( context, e );
					}else{
						alert('Save template failed.');
					}

				}
			} );
		};
		this.loadTemplate = function ( callbackSuccess, callbackError, context, id  ) {
			var jsonObj = {"action": "get_t_id", "id": id};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};

			$.ajax( {
				type    : 'POST',
				url     : wordpress.basePath + "process.php",
				data    : postArray,
				dataType: 'json',
				success : function ( data ) {
					if ( !data || data.length !== 1 ) return;
					var pattern;
					if ( data[0].pattern !== null ) {
						pattern = data[0].pattern.split( ',' );
					} else {
						pattern = [];
					}
					var template = {
						id         : data[0].id,
						sceneGraph : JSON.parse( data[0].template_graph ),
						name       : data[0].template_name,
						description: data[0].template_description,
						thumbnail   : data[0].template_thumbnail,
						pattern    : pattern
					};

					if ( callbackSuccess ) {
						callbackSuccess.call( context, template );
					}
					return template;
				},
				error   : function ( e ) {
					if(callbackError){
						callbackError.call( context, e );
					}else{
						alert( JSON.stringify( e ) );
					}
				}
			} );
		};
		this.loadTemplates = function( callback, context ){
			var jsonObj = {"action": "get_t"};
			var postData = JSON.stringify(jsonObj);
			var postArray = {query:postData};
			jQuery.ajax({
				type: 'POST',
				dataType: "json",
				url: wordpress.basePath + "process.php",
				data: postArray,
				success: function( data ){
					if( callback ){
						callback.apply(context, [ data ]);
					}
				},
				fail : function(){
					alert("Unable to load template list.");
				}
			});
		};
		this.updateTemplate = function( callbackSuccess, callbackError, context, template ){
			var jsonObj = {
				action      : "update_t",
				id          : template.id,
				name        : template.name,
				description : template.description,
				sceneGraph  : template.sceneGraph,
				placeholders: template.placeholders,
				thumbnail   : template.thumbnail
			};

			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};

			$.ajax( {
				type   : 'POST',
				url    : wordpress.basePath + "process.php",
				data   : postArray,
				success: function ( id ) {
					if( callbackSuccess )
						callbackSuccess.call( context, id );
				},
				error  : function ( e ) {
					if( callbackError ){
						callbackError.call( context, e );
					}else{
						alert('Update template failed.');
					}

				}
			} );
		};
		this.deleteTemplate = function( callback, context, id ){

			var jsonObj = {
				"action": "delete_t",
				id : id
			};
			var postData = JSON.stringify(jsonObj);
			var postArray = {query:postData};
			jQuery.ajax({
				type: 'POST',
				url: wordpress.basePath + "process.php",
				data: postArray,
				success: function( e ){
					if( callback ){
						callback.call( context );
					}
				},
				fail : function(){
					alert("Unable to load template list.");
				}
			});
		};
		/* ********************************************* */
		/* FILES */
		this.loadFile = function ( callbackSuccess, callbackError, context, id  ) {
			var jsonObj = {"action": "get_file_by_id", "id": id};
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};
			var d;
			$.ajax( {
				type    : 'POST',
				url     : wordpress.basePath + "process.php",
				data    : postArray,
				dataType: 'json',
				async : false,
				success : function ( data ) {

					if ( !data || data.length !== 1 ) return;

					if ( callbackSuccess ) {
						callbackSuccess.call( context, data[0] );
					}
					d = data[0];
				},
				error   : function ( e ) {
					console.error("wp-database-driver.loadFile() "+ e.message);
					if(callbackError){
						callbackError.call( context, false );
					}else{
						alert( JSON.stringify( e ) );
					}
					d = false;
				}
			} );
			return d;
		};
		this.updateFileVisibility = function( callback, context, id, isVisible ){

			var jsonObj = {
				"action": "update-file-visibility",
				id : id,
				isVisible : isVisible
			};
			var postData = JSON.stringify(jsonObj);
			var postArray = {query:postData};
			jQuery.ajax({
				type: 'POST',
				url: wordpress.basePath + "process.php",
				data: postArray,
				success: function( e ){
					if( callback ){
						callback.call( context, e );
					}
				},
				fail : function(){
					alert("Unable to load template list.");
				}
			});
		};
		this.deleteFiles = function( callback, context, fileIDArray){
			var jsonObj = {};
			jsonObj.action = "delete_files";
			jsonObj.files = fileIDArray;

			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};
			$.ajax( {
				type   : 'POST',
				url    : wordpress.basePath + "process.php",
				data   : postArray,
				success: function ( response ) {

					if( callback ){
						callback.apply( context, [ response ]);
					}
				},
				error  : function ( e ) {
					alert("Delete files failed");
				}
			} );
		};
		this.uploadFile = function (  callback, context, formData ) {

			$.ajax( {
				url        : wordpress.basePath + "processFileUpload.php",
				type       : 'POST',
				/* Ajax events */
				beforeSend : function ( e ) {
				},
				success    : function ( response ) {
					if( callback ){
						callback.apply( context, [ response ]);
					}
				},
				error      : function ( e ) {
					v.publish( Config.CHANNEL_ERROR, 'Error occurred during file upload! ' + e );
				},
				data       : formData,
				cache      : false,
				contentType: false,
				processData: false
			} );
		};
		this.loadAllFiles = function (  callback, context ) {
			var jsonObj = {};
			jsonObj.action = "get_files";
			var postData = JSON.stringify( jsonObj );
			var postArray = {query: postData};
			$.ajax( {
				type   : 'POST',
				url    : wordpress.basePath + "process.php",
				data   : postArray,
				dataType: 'json',
				success: function ( response ) {

					if( callback ){
						callback.apply( context, [ response ]);
					}
					return response;
				},
				error  : function ( e ) {
					console.log(e);
					alert("Load files failed");
				}
			} );
		};
		/* ********************************************* */
		/* POST - PLOT */
		this.createPlotPost = function ( callback, context, id ) {
			var jsonObj = {
				"action": "post_plot",
				id : id
			};
			var postData = JSON.stringify(jsonObj);
			var postArray = {cmd:postData};
			$.ajax( {
				type   : 'POST',
				url    : wordpress.basePath + "process.php",
				data   : postArray,
				success: function ( postId ) {
					if ( callback ) {
						callback.call( context, postId );
					}
					return postId;
				},
				error  : function ( e ) {
					alert( JSON.stringify( e ) );
				}
			} );
		};
		/* ********************************************* */
		/* POST - PLOT */
		this.createGroupPost = function ( callback, context, id ) {
			var jsonObj = {
				"action": "post_group",
				id : id
			};
			var postData = JSON.stringify(jsonObj);
			var postArray = {cmd:postData};
			$.ajax( {
				type   : 'POST',
				url    : wordpress.basePath + "process.php",
				data   : postArray,
				success: function ( postId ) {
					if ( callback ) {
						callback.call( context, postId );
					}
					return postId;
				},
				error  : function ( e ) {
					alert( JSON.stringify( e ) );
				}
			} );
		};


	};
	return WordPressDBDriver;
} );