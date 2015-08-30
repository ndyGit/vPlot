var w = window;
define([ 'require', 'config', 'jquery','ggOrgChart' ], function(require, config, $, ggOrgChart) {
	
	
	
	
	var Tree = (function() {
		this.name = 'external tree';

		this.exec = function(data) {
			
			
			var container = 'vGraph';
			//var container = data.container;
			
			var oc_data_2 = {
					title : 'Mi organigrama',   // not used
					root : {
						id : '1',
						title : '10',
						//subtitle : '10',
						children : [
							{ id : '10A', title : '10A', type : 'collateral' },
							{ id : '10B', title : '10B', type : 'collateral' },
							{ id : '10staff01', title : '10staff01', type : 'staff' },
							{ id : '10staff02', title : '10staff02', type : 'staff' },
							{ id : '10staff03', title : '10staff03', type : 'staff' },
							{ id : '10staff04', title : '10staff04', type : 'staff' },
							{ id : '10staff05', title : '10staff05', type : 'staff' },
							//{ id : '10staff06', title : '10staff06', type : 'staff' },
							//{ id : '10staff07', title : '10staff07', type : 'staff' },
							{
								id : '11', title : '11',
								children : [
									{ id : '111', title : '111' },
									{ id : '112', visible : false,   // , title : '112'
										children : [
											{ id : '1121', title : '1121', type: "staff" },
											{ id : '1122', title : '1122', type: "staff" },
											{ id : '1123', title : '1123', type: "staff" },
											{ id : '1124', title : '1124', type: "staff" },
											{ id : '1125', title : '1125', type: "staff" }
										]
									},
								]
							},
							{ id : '12', visible : false,   // title : '12',
								children : [
									{ id : '12A', title : '12A', type : 'collateral' },
									// { id : '12B', title : '12B', type : 'collateral' },
									{ id : '121', title : '121', type : 'subordinate', 
										children : [
										    { id : '1211', title : '1211', type : 'staffleft' },
											{ id : '1212', title : '1212', type : 'stafftop'  },
										    { id : '1213', title : '1213', type : 'staffleft'
											//	, children : [
											//	    { id : '1213a', title : '1213a', type : 'subordinate' },
											//		{ id : '1213b', title : '1213b', type : 'subordinate' },
											//	    { id : '1213c', title : '1213c', type : 'subordinate' }
											//	]
										    },
										    { id : '1214', title : '1214', type : 'stafftop'  },
										    { id : '1215', title : '1215', type : 'staffleft' }
											]},
									{ id : '122', title : '122', type : 'subordinate'} 
								]
							},
							{
								id : '13', title : '13',
								children : [
									{ id : '130A', title : '130A', type : 'collateral' },
									{ id : '130B', title : '130B', type : 'collateral' },
									{ id : '131', title : '131', type : 'staff',
										children : [
											{ id : '1311', title : '1311' },
											{ id : '1312', title : '1312' }
										]
									},
									{ id : '132', title : '132', type : 'staff' },
									{ id : '133', title : '133', type : 'staff' },
									{ id : '134', title : '134' },
									//{ id : '135', title : '135' },
									//{ id : '136', title : '136' },
									{ id : '137', title : '137',
										children : [
											{ id : '1371', title : '1371' },
											{ id : '1372', title : '1372' }
										]
									},
								]
							}
						]
					}
				};
				
						var oc_data = {
								title : 'Mi organigrama',   // not used
								root : {
									id : '1',
									title : '3d',
									//subtitle : '10',
									children : [
										{ id : '10staff01', title : '10staff01', type : 'staff' },
										{ id : '10staff02', title : '10staff02', type : 'staff' },
										{ id : '10staff03', title : '10staff03', type : 'staff' },
										{ id : '10staff04', title : '10staff04', type : 'staff' },
										{ id : '10staff05', title : '10staff05', type : 'staff' }
										]
								}
						};



				//////////////////////////////////////////////////////////////////////////
				// UP TO HERE ARE THE STRUCTURE OF NODES AND HIERARCHIES FOR THE ORG CHART
				// FROM HERE YOU WILL FIND HOW TO DEFINE RENDERING AND LOOK AND FEEL
				//////////////////////////////////////////////////////////////////////////



				// standard box click handler; you can change this
				// used for both first and second forms of invocation of or chart rendering
				//
				function oc_box_click_handler (event, box) {
					if (box.oc_id !== undefined)
						alert('clicked on node with ID = ' + box.oc_id);
				}

				// SECOND FORM OF CALLING THE RENDERING METHOD
				// define the org chart styles
				//
				var use_images = false;
				var oc_options2 = {
					container          : container,
					box_color          : '#aaf',                 // fill color of boxes
					box_color_hover    : '#faa',                 // fill color of boxes when mouse is over them
					box_border_color   : '#008',                 // stroke color of boxes
					line_color         : '#f44',                 // color of connectors
					title_color        : '#000',                 // color of titles
					subtitle_color     : '#707',                 // color of subtitles
					use_images         : use_images,             // use images within boxes?
					box_click_handler  : oc_box_click_handler,   // handler (function) called on click on boxes (set to null if no handler)
					debug              : false                   // set to true if you want to debug the library
				};
				
				
				console.log('tree plugin done');

		    	// This method is called earlier than window.onload... ;)
				
				//TODO get domelement to return it
				
				
				ggOrgChart.render(oc_data, oc_options2);
			
		}

	});

	return new Tree();

});