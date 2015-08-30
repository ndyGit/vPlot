define( ['require',
		'config',
		'jquery',
		'core/Framework3D.vlib', 'core/utils/Utils.Activity.vlib'],
	function ( require, Config, $, F3D, ACTIVITY ) {
		var MOUSE = MOUSE || (function () {
				var activities_ = {};
				var threshold = {};
				var overList = [];
				var destroyableActivityList = [];

				var mouse_counter = 0;
				var projector = new F3D.Projector();
				var raycaster = new F3D.Raycaster();


				var intersectionTest = function ( event, camera, container, activities ) {
					event.preventDefault();
					if ( activities.length === 0 ) {
						return;
					}

					var cId = container.attr( "id" );

					var offsetX = container.offset().left;
					var offsetY = container.offset().top;

					var mouseVector = new F3D.Vector3(
						( ( event.clientX - offsetX) / container.width()) * 2 - 1,
						-( ( event.clientY + $( window ).scrollTop() - offsetY ) / container.height() ) * 2 + 1,
						0 );

					//console.log("MOUSE( %s, %s ) Container( %s, %s )", mouseVector.x, mouseVector.y, offsetX, offsetY);
					projector.unprojectVector( mouseVector, camera );
					var normalizedMouseVector = mouseVector.sub( camera.position ).normalize();

					raycaster.params.PointCloud.threshold = threshold[cId].point;
					raycaster.linePrecision = threshold[cId].line;

					raycaster.ray.set(
						camera.position,
						normalizedMouseVector );

					return raycaster.intersectObjects( activities );
				};

				var actionOnIntersection = function ( event_type, event, scene, camera, renderer, container, intersectables ) {
					var cId = container.attr( "id" );
					var intersections = intersectionTest( event, camera, container, intersectables );
					var args = {
						event    : event,
						scene    : scene,
						camera   : camera,
						renderer : renderer,
						container: container
					};

					var mouse, mouseActive, mouseActivities;

					if ( intersections.length > 0 ) {

						mouseActivities = intersections[0].object.mouse;

						/* FIRST CALL: INIT */
						if ( mouseActivities.active.length === 0 ) {
							for ( var i = 0, len = mouseActivities.activities.length; i < len; ++i ) {
								mouseActivities.activities[i].root = mouseActivities.activities[i];
								mouseActivities.active.push( mouseActivities.activities[i] );
							}
						}
						args.intersection = intersections[0];
						activityStep( event_type, args );

					} else {
						/* NO HIT */
						container.css( "cursor", "default" );
						/* OUT EVENT ?*/

						handleOut( event_type, args, false );
					}

				};

				var activityStep = function ( event, args ) {
					"use strict";
					var activity,
						checkChilds = [],
						mouseActivities = args.intersection.object.mouse,
						mouseActive = mouseActivities.active,
						object = args.intersection.object,
						addedRoots = [],
						isRoot,
						tmp = [],
						running = [],
						destroy = false;

					/* RUN ACTIVE ACTIVITIES */
					for ( var i = 0, len = mouseActive.length; i < len; ++i ) {
						activity = mouseActive[i];
						if ( activity.type === event ) {
							//console.log( activity.type + ' === ' + event );
							if ( !activity.handle.isLocked() ) {
								if ( activity.type === MOUSE.EVENT.OVER ) {
									overList.push( {o: object, a: args} );
									handleOut( event, args, object );
								}
								/* run handle */
								//console.log( 'run ' + activity.type );
								activity.handle.exec( args );
								running.push( i );
								if ( true === activity.handle.destroyable ) {
									destroyableActivityList.push( {o: object, a: args} );
								}
							}
						}
					}

					mouseActivities.active = replaceActivitiesByChilds( running, mouseActive );

				};
				/* REPLACE ACTIVE AND EXECUTED ACTIVITIES THROUGH CHILDS */
				var replaceActivitiesByChilds = function ( running, activities ) {

					if ( running.length === 0 ) return activities;

					var activity,
						index,
						tmp = [],
						isRoot,
						addedRoots = [];

					for ( var i = 0, len = activities.length; i < len; ++i ) {
						index = running[i];
						// running activity: replace by childs
						if ( i === index ) {
							activity = activities[index];
							if ( activity.childs && activity.childs.length > 0 ) {
								for ( var k = 0; k < activity.childs.length; ++k ) {
									activity.childs[index].root = activity.root;
									tmp.push( activity.childs[index] );
								}
							} else {
								isRoot = false;
								for ( var j = 0; j < addedRoots.length; ++j ) {
									if ( activity.root.uuid === addedRoots[j].uuid ) {
										isRoot = true;
										break;
									}
								}
								if ( !isRoot ) {
									tmp.push( activity.root );
									addedRoots.push( activity.root );
								}
							}
						} else {
							//inactive activity: just push it to response object
							tmp.push( activities[i] );
						}

					}
					return tmp;
				};
				var handleDestroyables = function ( event, currentlyOver ) {
					"use strict";
					var destroyable, destroyed = false;
					for ( var i = 0, len = destroyableActivityList.length; i < len; ++i ) {
						destroyed = false;
						destroyable = destroyableActivityList[i];
						if(!destroyable) continue;
						if ( !currentlyOver || (currentlyOver.uuid !== destroyable.o.uuid) ) {
							// find coresponding activity type
							for( var j = 0, len2 = destroyable.o.mouse.activities.length; j < len2; ++j ){
								if( event === destroyable.o.mouse.activities[ j ].type ){
									destroyable.o.mouse.activities[ j ].handle.exec( destroyable.a, false, false, true );
									destroyed = true;
								}
							}
							if( destroyed ){
								destroyableActivityList.splice(i,1);
							}
						}

					}

				};
				var handleOut = function ( event, args, currentlyOver ) {

					var activeOverActivity, over, tmp;
					for ( var i = 0, len = overList.length; i < len; ++i ) {
						over = overList[i];
						activeOverActivity = over.o.mouse.active;
						if ( !currentlyOver || currentlyOver.uuid !== over.o.uuid ) {
							// replace empty intersection object by over object
							activityStep( MOUSE.EVENT.OUT, over.a );

						}
					}
					// OVER events are handled by OUT events
					if( event !== MOUSE.EVENT.OVER ){
						handleDestroyables( event, currentlyOver );
					}

				};
				return {
					add   : function ( activity ) {

						if ( !activities_.hasOwnProperty( activity.cId ) ) {
							activities_[activity.cId] = {
								click   : [],
								dblclick: [],
								over    : [],
								out     : [],
								drag    : []
							}
						}
						if ( !threshold.hasOwnProperty( activity.cId ) ) {
							threshold[activity.cId] = {
								point: 10,
								line : 10
							}
						}
						activity.id = mouse_counter++;
						if ( activity.o.mouse === undefined ) {
							activity.o.mouse = {
								activities: [activity],
								active    : []
							};
						}
						if ( activity instanceof MOUSE.Click ) {
							if ( activities_[activity.cId].click.indexOf( activity.o ) === -1 ) {
								activities_[activity.cId].click.push( activity.o );
							}
						}
						if ( activity instanceof MOUSE.DBLClick ) {
							if ( activities_[activity.cId].dblclick.indexOf( activity.o ) === -1 ) {
								activities_[activity.cId].dblclick.push( activity.o );
							}
						}
						if ( activity instanceof MOUSE.Over ) {
							if ( activities_[activity.cId].over.indexOf( activity.o ) === -1 ) {
								activities_[activity.cId].over.push( activity.o );
							}
						}
						if ( activity instanceof MOUSE.Out ) {
							if ( activities_[activity.cId].out.indexOf( activity.o ) === -1 ) {
								activities_[activity.cId].out.push( activity.o );
							}
						}

					},
					remove: function ( activity ) {
						var i;
						if ( activity instanceof MOUSE.Click ) {
							i = activities_[activity.cId].click.indexOf( activity.o );
							if ( i !== -1 ) {
								activities_[activity.cId].click.splice( i, 1 );
							}

						} else if ( activity instanceof MOUSE.DBLClick ) {
							i = activities_[activity.cId].dblclick.indexOf( activity.o );
							if ( i !== -1 ) {
								activities_[activity.cId].dblclick.splice( i, 1 );
							}
						}
						else if ( activity instanceof MOUSE.Over ) {
							i = activities_[activity.cId].over.indexOf( activity.o );
							if ( i !== -1 ) {
								activities_[activity.cId].over.splice( i, 1 );
							}
						} else if ( activity instanceof MOUSE.Out ) {
							i = activities_[activity.cId].out.indexOf( activity.o );
							if ( i !== -1 ) {
								activities_[activity.cId].out.splice( i, 1 );
							}
						}


					},
					empty : function ( containerId ) {
						//console.log( "MOUSE EMPTY CONTAINER " + containerId );
						over = false;
						activities_[containerId] = {
							click   : [],
							dblclick: [],
							over    : [],
							out     : [],
							drag    : []
						};
					},

					click            : function ( event, scene, camera, renderer, container ) {
						var cId = container.attr( "id" );

						if ( activities_[cId] === undefined || activities_[cId].click.length === 0 ) return;
						actionOnIntersection(
							MOUSE.EVENT.CLICK,
							event,
							scene,
							camera,
							renderer,
							container,
							activities_[cId].click
						);

					},
					dblclick         : function ( event, scene, camera, renderer, container ) {

						var cId = container.attr( "id" );
						if ( activities_[cId] === undefined || activities_[cId].dblclick.length === 0 ) return;

						actionOnIntersection(
							MOUSE.EVENT.DBLCLICK,
							event,
							scene,
							camera,
							renderer,
							container,
							activities_[cId].dblclick
						);
					},
					moveOver         : function ( event ) {
						var cId = event.target.container.attr( "id" );
						actionOnIntersection(
							MOUSE.EVENT.OVER,
							event,
							event.target.scene,
							event.target.camera,
							event.target.renderer,
							event.target.container,
							activities_[cId].over );

					},
					moveOut          : function ( event ) {
						var cId = event.target.container.attr( "id" );
						actionOnIntersection(
							MOUSE.EVENT.OUT,
							event,
							event.target.scene,
							event.target.camera,
							event.target.renderer,
							event.target.container,
							activities_[cId].out );

					},
					over             : function ( event, scene, camera, renderer, container ) {
						var cId = container.attr( "id" );
						if ( activities_[cId] === undefined || activities_[cId].over.length === 0 ) return;
						renderer.domElement.scene = scene;
						renderer.domElement.camera = camera;
						renderer.domElement.renderer = renderer;
						renderer.domElement.container = container;
						renderer.domElement.addEventListener( 'mousemove', MOUSE.moveOver, true );
					},
					out              : function ( event, scene, camera, renderer, container ) {
						renderer.domElement.removeEventListener( 'mousemove', MOUSE.moveOut, true );
					},
					setPointThreshold: function ( container, object, value ) {
						if ( !object.hasOwnProperty( "userData" ) ) {
							object.userData = {};
						}
						if ( !object.userData.hasOwnProperty( "threshold" ) ) {
							object.userData.threshold = {};
						}
						object.userData.threshold.point = value;
						if ( !threshold.hasOwnProperty( container ) ) {
							threshold[container] = {
								point: value,
								line : 10
							}
						} else {
							if ( threshold[container].hasOwnProperty( "point" ) ) {
								if ( threshold[container].point < value ) {
									threshold[container].point = value;
								}
							} else {
								threshold[container].point = value;
							}

						}
					},
					setLineThreshold : function ( container, object, value ) {
						if ( !object.hasOwnProperty( "userData" ) ) {
							object.userData = {};
						}
						if ( !object.userData.hasOwnProperty( "threshold" ) ) {
							object.userData.threshold = {};
						}
						object.userData.threshold.line = value;
						if ( !threshold.hasOwnProperty( container ) ) {
							threshold[container] = {
								line : value,
								point: 10
							}
						} else {
							if ( threshold[container].hasOwnProperty( "line" ) ) {
								if ( threshold[container].line < value ) {
									threshold[container].line = value;
								}
							} else {
								threshold[container].line = value;
							}

						}
					},
					extend           : function ( original, context ) {
						for ( key in context ) {
							if ( context.hasOwnProperty( key ) ) {
								original[key] = context[key];
							}
						}
					}
				};
			})();
		MOUSE.EVENT = {
			CLICK   : 'click',
			DBLCLICK: 'dblclick',
			OVER    : 'over',
			OUT     : 'out'
		};

		MOUSE.absoluteToRelativeMouseCoords = function ( $container, event ) {

			var offsetX = $container.offset().left;
			var offsetY = $container.offset().top;

			return new F3D.Vector3(
				(event.pageX - offsetX - $container.width() / 2),
				-(event.pageY - offsetY - $container.height() / 2),
				0 );
		};

		/*
		 * Copy activities to childs and init each activity
		 **/
		MOUSE.handleActivities = function ( system, env ) {
			if ( env.activities === undefined || env.activities.length === 0 ) return [];

			if ( !system.material ) {
				if ( system.children.length !== 0 ) {
					for ( var i = 0, len = system.children.length; i < len; ++i ) {
						MOUSE.handleActivities( system.children[i], env );
					}
				}
			} else {
				if ( system.mouse === undefined ) {
					system.mouse = {
						activities: [],
						active    : []
					};
				}
				var activityChain = MOUSE.initActivities( system, env.activities );
				system.mouse.activities = activityChain;
				return activityChain;
			}
		};
		/*
		 * Creates activities and binds them to system.
		 * */
		MOUSE.initActivities = function ( system, activities ) {
			if ( activities.length === 0 ) return [];
			var tmp, activity, result = [];
			for ( var i = 0, il = activities.length; i < il; ++i ) {
				tmp = activities[i];
				activity = tmp.callback.apply( tmp.context, [system] );
				activity.addChilds( MOUSE.initActivities( system, tmp.subActivities ) );
				result.push( activity );
			}
			return result;
		};
		MOUSE.FunctionHandle = function ( callback ) {

			this.isLocked = function () {
				return false;
			};
			this.reset = function () {
				/* stub */
			};
			this.exec = function ( e ) {
				callback( e );
			}
		};
		MOUSE.Mouse = function ( container, object, handle ) {
			if ( object === undefined ) return;
			this.handle = handle;
			if ( typeof handle === 'function' ) {
				this.handle = new MOUSE.FunctionHandle( handle );
			}
			this.childs = [];
			this.cId = -1;
			if ( container instanceof $ ) {
				this.cId = container.find( Config.PLOT_CONTAINER ).attr( "id" );
			} else {
				this.cId = $( '#' + container ).find( Config.PLOT_CONTAINER ).attr( "id" );
			}

			if ( object instanceof F3D.Geometry ) {
				this.o = new F3D.Mesh( object );
				this.o.mouse = object.mouse;
				this.o.backup = object.backup;
			} else {
				this.o = object;
			}

			this.destroy = function () {
				MOUSE.remove( this );
			};
			this.addChilds = function ( a ) {
				if ( a instanceof Array ) {
					this.childs = this.childs.concat( a );
				} else {
					this.childs.push( a );
				}
			};

		};
		MOUSE.Click = function ( container, object, handle ) {
			this.type = MOUSE.EVENT.CLICK;
			MOUSE.extend( this, new MOUSE.Mouse( container, object, handle ) );
			MOUSE.add( this );
		};
		MOUSE.DBLClick = function ( container, object, handle ) {
			this.type = MOUSE.EVENT.DBLCLICK;
			MOUSE.extend( this, new MOUSE.Mouse( container, object, handle ) );
			MOUSE.add( this );
		};
		MOUSE.Over = function ( container, object, handle ) {
			this.type = MOUSE.EVENT.OVER;
			MOUSE.extend( this, new MOUSE.Mouse( container, object, handle ) );
			MOUSE.add( this );
		};
		MOUSE.Out = function ( container, object, handle ) {
			this.type = MOUSE.EVENT.OUT;
			MOUSE.extend( this, new MOUSE.Mouse( container, object, handle ) );
			MOUSE.add( this );
		};

		return MOUSE;
	} );
