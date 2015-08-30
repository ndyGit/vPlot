define(
	['require', 'config', 'core/AbstractPlugin.vlib', 'core/Utils.vlib', 'jquery'],
	function ( require, Config, AbstractPlugin, UTILS, $ ) {

		var Data = function ( name ) {
			Data.superClass.constuctor.call( this, name );
			this.reader;
			this.MAP = Config.DATA_MAPPING;
		};

		/* Data extends AbstractPlugin */
		UTILS.CLASS.extend( Data, AbstractPlugin );
		Data.prototype.getRawData = function ( bufferManager, env ) {

			var buffer = bufferManager.getBuffer( env.id );

			return buffer.getAttribute( Config.BUFFER.RAW_DATA ).array;
		};
		Data.prototype.getRawColors = function ( bufferManager, env ) {
			var buffer = bufferManager.getBuffer( env.id );
			return buffer.getAttribute( Config.BUFFER.RAW_COLORS );
		};

		Data.prototype.preProcess = function ( childs, bufferManager, env ) {

			var com = env.communication.messageController;

			var context = this;
			env.fillDatabufferDone = false;
			env.ensureNumericDone = false;
			env.autofillDone = false;
			env.updateDirtyFlagDone = false;
			env.fillAxisLabelsDone = false;

			this.initBuffers( bufferManager, env );
			env.msgId = com.addMsg( 'info', '[ Data ][ preprocess ][ handle child plugins ]',false,true );
			Data.superClass.handleChilds( childs, env, function () {
				"use strict";
				var com = env.communication.messageController;
				var context = this;
				com.updateMsg( env.msgId, '[ Data ][ preprocess ][ fetch raw data ]' );
				this.fillDataBuffer( function () {
					env.fillDatabufferDone = true;

					context.fillAxisLabels( function () {
						env.fillAxisLabelsDone = true;
						context.done( env );
					}, bufferManager, env );

					com.updateMsg( env.msgId, '[ Data ][ preprocess ][ process raw data ]' );
					context.autofillMissingValues( function () {
						env.autofillDone = true;

						context.ensureNumericXYZSizeTick( function () {
							env.ensureNumericDone = true;
							com.updateMsg( env.msgId, '[ Data ][ preprocess ][ apply functions ]' );
							context.processFunctionPlugins( function () {
								com.updateMsg( env.msgId, '[ Data ][ preprocess ][ remove invalid datasets ]' );
								context.removeInvalidDatasets( function () {

									com.updateMsg( env.msgId, '[ Data ][ preprocess ][ apply colors ]' );
									context.processColorPlugins( function () {

										context.updateDirtyFlag( function () {
											env.updateDirtyFlagDone = true;

											context.done( env );
										}, bufferManager, env );

									}, bufferManager, env );

								}, bufferManager, env );

							}, bufferManager, env );

						}, bufferManager, env );
					}, bufferManager, env );


				}, bufferManager, env );

			}, this );


		};

		Data.prototype.initBuffers = function ( bufferManager, env ) {

			var buffer = bufferManager.getBuffer( env.id );
			if ( !buffer.isAttribute( Config.BUFFER.RAW_DATA ) ) {
				buffer.setAttribute( Config.BUFFER.RAW_DATA, Array );
			}
			if ( !buffer.isAttribute( Config.BUFFER.RAW_LABELS_X ) ) {
				buffer.setAttribute( Config.BUFFER.RAW_LABELS_X, Array );
			}
			if ( !buffer.isAttribute( Config.BUFFER.RAW_LABELS_Y ) ) {
				buffer.setAttribute( Config.BUFFER.RAW_LABELS_Y, Array );
			}
			if ( !buffer.isAttribute( Config.BUFFER.RAW_LABELS_Z ) ) {
				buffer.setAttribute( Config.BUFFER.RAW_LABELS_Z, Array );
			}
		};

		Data.prototype.done = function ( env ) {
			"use strict";
			if ( !env.fillDatabufferDone || !env.ensureNumericDone || !env.autofillDone || !env.updateDirtyFlagDone || !env.fillAxisLabelsDone ) {
				return false;
			}

			if ( !env.doneSubscriptions ) {
				env.communication.messageController.removeMsg( env.msgId );
				delete env.msgId;
				//console.warn( '[ Data ] onDone( cb ) not set?' );
				return false;
			}


			var cb, ctx;
			for ( var i = 0, len = env.doneSubscriptions.length; i < len; ++i ) {
				cb = env.doneSubscriptions[i].cb;
				ctx = env.doneSubscriptions[i].ctx;
				cb.call( ctx, env );
			}
			env.communication.messageController.removeMsg( env.msgId );
			delete env.msgId;
			return true;
		};

		Data.prototype.onDone = function ( cb, ctx, env ) {
			"use strict";
			if ( !env.doneSubscriptions ) {
				env.doneSubscriptions = [];
			}
			env.doneSubscriptions.push( {cb: cb, ctx: ctx} );
		};

		Data.prototype.updateDirtyFlag = function ( done, bufferManager, env ) {
			var buffer = bufferManager.getBuffer( env.id );
			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA );

			buffer.isDirtyCB( Config.BUFFER.RAW_DATA, raw_data.array, function ( dirty ) {
				"use strict";
				raw_data.dirty = dirty;
				if ( dirty ) {
					buffer.setHash( Config.BUFFER.RAW_DATA, raw_data.array );
				}
				buffer = undefined;
				done();
			} );

		};

		Data.prototype.removeInvalidDatasets = function ( done, bufferManager, env ) {
			"use strict";

			var com = env.communication.messageController;
			var buffer = bufferManager.getBuffer( env.id );
			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA );
			var raw_data_len = raw_data.array.length;

			var MAPPING_X = Config.DATA_MAPPING.X;
			var MAPPING_Y = Config.DATA_MAPPING.Y;
			var MAPPING_Z = Config.DATA_MAPPING.Z;

			var dataset, isValid, progress = 0;
			var sl = UTILS.safeloop();
			sl.iterations( raw_data_len )
				.done( function () {
					"use strict";
					com.updateMsg( env.msg, '[ Data ][ remove invalid datasets ][ 100% ]' );
					done();
				} )
				.loop( function ( i ) {
					"use strict";
					dataset = raw_data.array[i];
					isValid = true;

					progress = Math.ceil( ( i / raw_data_len ) * 100 );
					com.updateMsg( env.msg, '[ Data ][ remove invalid datasets ][ ' + progress + '% ]' );

					if ( dataset.hasOwnProperty( MAPPING_X ) && !Number.isFinite( dataset.x ) ) {
						isValid = false;
					}
					if ( dataset.hasOwnProperty( MAPPING_Y ) && !Number.isFinite( dataset.y ) ) {
						isValid = false;
					}
					if ( dataset.hasOwnProperty( MAPPING_Z ) && !Number.isFinite( dataset.z ) ) {
						isValid = false;
					}

					/* REMOVE INVALID DATASETS */
					if ( !isValid ) {
						raw_data.array.splice( i, 1 );
						sl.setIndex( --i );
						sl.iterations( --raw_data_len );
					}
				} );
		};

		Data.prototype.fillAxisLabels = function ( done, bufferManager, env ) {
			"use strict";

			var buffer = bufferManager.getBuffer( env.id );
			var raw_labels_x = buffer.getAttribute( Config.BUFFER.RAW_LABELS_X );
			var raw_labels_y = buffer.getAttribute( Config.BUFFER.RAW_LABELS_Y );
			var raw_labels_z = buffer.getAttribute( Config.BUFFER.RAW_LABELS_Z );

			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA );
			if ( !raw_data ) {
				return false;
			}
			var raw_data_len = raw_data.array.length;

			raw_labels_x.array = [];
			raw_labels_y.array = [];
			raw_labels_z.array = [];

			var com = env.communication.messageController;
			com.updateMsg( env.msg, '[ Data ][ fetch raw labels ][ 0% ]' );
			var progress = 0;

			var AXIS_LABEL_X = Config.DATA_MAPPING.AXIS_LABEL_X;
			var AXIS_LABEL_Y = Config.DATA_MAPPING.AXIS_LABEL_Y;
			var AXIS_LABEL_z = Config.DATA_MAPPING.AXIS_LABEL_Z;

			var dataset;
			var MAPPING_X = Config.DATA_MAPPING.X;
			var MAPPING_Y = Config.DATA_MAPPING.Y;
			var MAPPING_Z = Config.DATA_MAPPING.Z;

			var sl = UTILS.safeloop();
			sl.iterations( raw_data_len )
				.done( function () {
					"use strict";
					com.updateMsg( env.msg, '[ Data ][ fetch raw labels ][ 100% ]' );
					done();
				} )
				.loop( function ( i ) {
					"use strict";
					dataset = raw_data.array[i];

					progress = Math.ceil( ( i / raw_data_len ) * 100 );
					com.updateMsg( env.msg, '[ Data ][ fetch raw labels ][ ' + progress + '% ]' );
					if ( dataset.hasOwnProperty( AXIS_LABEL_X ) ) {
						raw_labels_x.array.push( dataset[AXIS_LABEL_X] );
					}
					if ( dataset.hasOwnProperty( AXIS_LABEL_Y ) ) {
						raw_labels_y.array.push( dataset[AXIS_LABEL_Y] );
					}
					if ( dataset.hasOwnProperty( AXIS_LABEL_z ) ) {
						raw_labels_z.array.push( dataset[AXIS_LABEL_z] );
					}
					/* REMOVE PURE LABEL-DATASETS */
					if ( !dataset.hasOwnProperty( MAPPING_X ) && !dataset.hasOwnProperty( MAPPING_Y ) && !dataset.hasOwnProperty( MAPPING_Z ) ) {
						raw_data.array.splice( i, 1 );
						sl.setIndex( --i );
						sl.iterations( --raw_data_len );
					}
				} );

		};

		Data.prototype.configData2Raw = function ( done, bufferManager, env ) {
			"use strict";
			var buffer = bufferManager.getBuffer( env.id );
			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA );
			var com = env.communication.messageController;
			var progress = 0;
			if ( env.config.hasOwnProperty( "data" ) && env.config.data !== undefined && env.config.data.length !== 0 ) {


				var configData = env.config.data;
				var configDataLen = configData.length;

				UTILS.safeloop()
					.iterations( configDataLen )
					.done( function () {
						"use strict";
						com.updateMsg( env.msg, '[ Data ][ fetch raw data ][ 1/3 ][ 100% ]' );
						done();
					} )
					.loop( function ( i ) {
						"use strict";
						progress = Math.ceil( ( i / configDataLen ) * 100 );
						com.updateMsg( env.msg, '[ Data ][ fetch raw data ][ 1/3 ][ ' + progress + '% ]' );

						raw_data.array.push( configData[i] );


					} );
			} else {
				done();
			}

		};

		Data.prototype.childData2Raw = function ( done, bufferManager, env ) {
			"use strict";
			var buffer = bufferManager.getBuffer( env.id );
			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA );
			var com = env.communication.messageController;
			var progress = 0;
			if ( env.raw_data && env.raw_data.length !== 0 ) {

				var len = env.raw_data.length;
				UTILS.safeloop()
					.iterations( len )
					.done( function () {
						"use strict";
						com.updateMsg( env.msg, '[ Data ][ fetch raw data ][ 2/3 ][ 100% ]' );
						done();
					} )
					.loop( function ( i ) {
						"use strict";
						if ( i % 100 === 0 ) {
							progress = Math.ceil( ( i / len ) * 100 );
							com.updateMsg( env.msg, '[ Data ][ fetch raw data ][ 2/3 ][ ' + progress + '% ]' );
						}
						raw_data.array.push( env.raw_data[i] );
					} );

			} else {
				done();
			}
		};

		Data.prototype.fileData2Raw = function ( done, bufferManager, env ) {
			"use strict";
			var buffer = bufferManager.getBuffer( env.id );
			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA );

			if ( env.config.hasOwnProperty( "path" ) && env.config.path !== undefined && env.config.path.length !== 0 ) {
				if ( env.config.hasOwnProperty( "mapping" ) && env.config.mapping !== undefined ) {
					if ( env.config.hasOwnProperty( "format" ) && env.config.format !== undefined ) {

						switch ( env.config.format ) {
							case UTILS.FileReader.FORMAT.TSV :
								this.reader = new UTILS.FileReader.TSVReader( env.config.path, env.config.mapping );
								break;
							case UTILS.FileReader.FORMAT.CSV :
								this.reader = new UTILS.FileReader.CSVReader( env.config.path, env.config.mapping );
								break;
							case UTILS.FileReader.FORMAT.CUSTOM :

								this.reader = new UTILS.FileReader.CustomReader(
									env.config.path,
									env.config.mapping,
									env.config.format_row,
									env.config.format_col );
								break;
							default :
								console.error( "[ Data.fillDataBuffer ] Unknown file format.  " + env.config.format );
								this.reader = null;
								break;
						}
						if ( this.reader ) {
							this.reader.toObjectArray( function ( d ) {
								raw_data.array = raw_data.array.concat( d );
								done();
							} );

						} else {
							done();
						}

					} else {
						console.error( "[ Data.fillDataBuffer ] File format not set." );
						done();
					}
				} else {
					console.error( "[ Data.fillDataBuffer ] Mapping not set." );
					done();
				}
			} else {
				done();
			}

		};

		Data.prototype.fillDataBuffer = function ( done, bufferManager, env ) {

			var buffer = bufferManager.getBuffer( env.id );
			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA );
			var com = env.communication.messageController;
			raw_data.array = [];
			var context = this;
			var msg = com.addMsg( 'info', '[ Data ][ fetch raw data ][ 1/3 ]' );
			env.msg = msg;
			this.configData2Raw( function () {
				"use strict";
				context.childData2Raw( function () {
					"use strict";
					com.updateMsg( msg, '[ Data ][ fetch raw data ][ 2/3 ]' );
					context.fileData2Raw( function () {
						"use strict";
						com.updateMsg( msg, '[ Data ][ fetch raw data ][ 3/3 ][ progress: 100% ]' );
						com.removeMsg( msg );
						delete env.msg;
						done();
					}, bufferManager, env );
				}, bufferManager, env );

			}, bufferManager, env );

		};

		Data.prototype.ensureNumericXYZSizeTick = function ( done, bufferManager, env ) {
			var buffer = bufferManager.getBuffer( env.id );
			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA ).array;
			var dataset;

			UTILS.safeloop()
				.iterations( raw_data.length )
				.done( function () {
					"use strict";
					done();
				} )
				.loop( function ( i ) {
					"use strict";
					dataset = raw_data[i];
					if ( dataset.x ) {
						dataset.x = parseFloat( dataset.x );
						if ( isNaN( dataset.x ) ) {
							console.warn( '[ data ] x is not a number.' );
							dataset.x = 0;
						}
					}
					if ( dataset.y ) {
						dataset.y = parseFloat( dataset.y );
						if ( isNaN( dataset.y ) ) {
							console.warn( '[ data ] y is not a number.' );
							dataset.y = 0;
						}
					}
					if ( dataset.z ) {
						dataset.z = parseFloat( dataset.z );
						if ( isNaN( dataset.z ) ) {
							console.warn( '[ data ] z is not a number.' );
							dataset.z = 0;
						}
					}
					if ( dataset.size ) {
						dataset.size = parseFloat( dataset.size );
						if ( isNaN( dataset.size ) ) {
							console.warn( '[ data ] z is not a number.' );
							dataset.size = 1;
						}
					}
					if ( dataset.tick ) {
						dataset.tick = parseInt( dataset.tick );
						if ( isNaN( dataset.tick ) ) {
							console.warn( '[ data ] tick is not a number.' );
							dataset.tick = 0;
						}
					}
				} );

		};

		Data.prototype.autofillMissingValues = function ( done, bufferManager, env ) {
			"use strict";

			var buffer = bufferManager.getBuffer( env.id );
			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA ).array;
			if ( !raw_data ) {
				return false;
			}
			var raw_data_len = raw_data.length;
			var dataset;
			UTILS.safeloop()
				.iterations( raw_data.length )
				.done( function () {
					"use strict";
					done();
				} )
				.loop( function ( i ) {
					dataset = raw_data[i];

					if ( dataset.hasOwnProperty( Config.DATA_MAPPING.X ) ||
						dataset.hasOwnProperty( Config.DATA_MAPPING.Y ) ||
						dataset.hasOwnProperty( Config.DATA_MAPPING.Z ) ) {


						if ( !dataset.hasOwnProperty( Config.DATA_MAPPING.X ) ) {
							dataset.x = i;
						}
						if ( !dataset.hasOwnProperty( Config.DATA_MAPPING.Y ) ) {
							dataset.y = 0;
						}
						if ( !dataset.hasOwnProperty( Config.DATA_MAPPING.Z ) ) {
							dataset.z = 0;
						}
						if ( !dataset.hasOwnProperty( Config.DATA_MAPPING.SIZE ) ) {
							dataset.size = 1;
						}
						if ( !dataset.hasOwnProperty( Config.DATA_MAPPING.TICK ) ) {
							dataset.tick = 0;
						}
						if ( !dataset.hasOwnProperty( Config.DATA_MAPPING.LABEL ) ) {
							dataset.label = '( ' + dataset.x + ', ' + dataset.y + ', ' + dataset.z + ' )';
						}
					}
				} );

		};
		Data.prototype.processFunctionPlugins = function ( done, bufferManager, env ) {
			"use strict";

			if ( !env.functionCallback || !env.functionContext ) {
				done();
				return;
			}

			var scope = this;
			var buffer = bufferManager.getBuffer( env.id );
			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA );

			var funDoneCB = function () {
				"use strict";
				done();
				return;
			};
			env.functionCallback.apply( env.functionContext, [funDoneCB, raw_data.array] );

		};

		Data.prototype.processColorPlugins = function ( done, bufferManager, env ) {
			"use strict";
			var scope = this;
			var buffer = bufferManager.getBuffer( env.id );
			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA );
			var context, callback;
			if ( env.colorCallback && env.colorContext ) {
				context = env.colorContext;
				callback = env.colorCallback;
			} else {
				/* fill with default colors */
				context = this;
				callback = this.defaultCollorCallback;
			}
			scope.addColorsToDataBuffer( function () {
				done();
			}, context, callback, bufferManager, env );
		};


		Data.prototype.addColorsToDataBuffer = function ( done, context, callback, bufferManager, env ) {

			var buffer = bufferManager.getBuffer( env.id );
			var raw_data = buffer.getAttribute( Config.BUFFER.RAW_DATA );
			var colors = callback.apply( context, [raw_data.array] );
			var MAP_COLOR = Config.DATA_MAPPING.COLOR;
			var len = raw_data.array.length;

			UTILS.safeloop()
				.iterations( len )
				.done( function () {
					"use strict";

					done( env );
				} )
				.loop( function ( i ) {
					"use strict";
					raw_data.array[i].color = colors[i];
					if ( raw_data.array[i].hasOwnProperty( MAP_COLOR ) ) {
						if ( raw_data.array[i][MAP_COLOR] !== false )
							raw_data.array[i].color = raw_data.array[i][MAP_COLOR];
					}
				} );


		};

		Data.prototype.defaultCollorCallback = function ( data ) {
			return UTILS.initArray( data.length, '000000' );
		};

		return Data;
	} )
;
