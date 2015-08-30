define( ['require', 'config', 'jquery'],
	function ( require, Config, $ ) {
		'use strict';

		var FileReader =  {};

		FileReader.FORMAT = {
			TSV   : 'tsv',
			CSV   : 'csv',
			CUSTOM: 'custom'
		};

		FileReader.getSeperator = function ( seperator ) {
			var s;
			switch ( seperator ) {
				case '<newline>' :
					s = "\n";
					break;
				case  '<tab>' :
					s = "\t";
					break;
				case  '<space>' :
					s = " ";
					break;
				default :
					s = seperator;
					break;
			}
			return s;
		};


		FileReader.readConent = function ( path, done ) {
			if ( path === undefined || path === '' ) {
				console.warn( "[ FileReader.readContent() ] Invalid path given." );
				return false;
			}

			try {

				$.get( Config.getExternalDataPath() + path, {} )
					.done( function ( data ) {
						if(done){
							done( data );
						}

					} )
					.fail( function () {
						console.warn( "Unable to read file " + path + "." );
						if(done){
							done();
						}
					} );

			} catch ( e ) {
				console.warn( e.message );
				if(done){
					done();
				}
			}

		};

		FileReader.toObjectArray = function ( path, mapping, row_seperator, col_seperator, done ) {

			var col, col_len, o, d = [];
			var mapping_len = mapping.length;
			var lines;
			FileReader.readConent(path,function( data ){
				if(!data){
					done();
					return;
				}
				lines = data.split( row_seperator );
				$( lines ).each( function ( index, line ) {
					col = line.split( col_seperator );
					col_len = col.length;

					o = {valid: true};
					for ( var i = 0; i < mapping_len; ++i ) {
						if ( mapping[i] !== 'ignore' ) {
							if ( i < col_len ) {
								o[mapping[i]] = col[i];
								o.valid = true;
							} else {
								o[mapping[i]] = false;
								if ( mapping[i] === Config.DATA_MAPPING.X ||
									mapping[i] === Config.DATA_MAPPING.Y ||
									mapping[i] === Config.DATA_MAPPING.Z )
									o.valid = false;
							}
						}
					}
					if ( o.valid ) d.push( o );

				} );
				done( d );
			});

		};


		FileReader.TSVReader = function ( path, mapping ) {
			var ROW_SEPERATOR = "\n";
			var COL_SEPERATOR = "\t";
			var file_content, mapping_ = [], lines;


			if ( (mapping !== undefined) && (typeof mapping === "string" ) ) {
				mapping_ = mapping.split( '-' );
			}

			return {
				update         : function ( path, done ) {

					file_content = FileReader.readConent( path,function( data ){
						file_content = data;
						if ( file_content ) {
							lines = file_content.split( ROW_SEPERATOR );
						}
						done();
					} );

				},
				setRowSeperator: function ( seperator ) {
					ROW_SEPERATOR = FileReader.getSeperator( seperator );
					if ( file_content ) {
						lines = file_content.split( ROW_SEPERATOR );
					}
				},
				setColSeperator: function ( seperator ) {
					COL_SEPERATOR = FileReader.getSeperator( seperator );
				},
				getColumnCount : function () {
					if ( !lines || lines.length === 0 ) return 0;
					return lines[0].split( COL_SEPERATOR ).length;
				},
				getRowCount    : function () {
					if ( lines ) {
						return lines.length;
					} else {
						return 0;
					}
				},
				getRow         : function ( index ) {
					if ( lines[index] === undefined ) return false;
					return lines[index];
				},
				getCell        : function ( row, col ) {
					if ( !lines || lines[row] === undefined ) return false;
					var column = lines[row].split( COL_SEPERATOR );
					if ( column[col] === undefined ) return false;
					return column[col];
				},
				toObjectArray  : function ( done ) {
					FileReader.toObjectArray( path, mapping_, ROW_SEPERATOR, COL_SEPERATOR, done );
				}
			};
		};

		FileReader.CSVReader = function ( path, mapping ) {
			var ROW_SEPERATOR = ";";
			var COL_SEPERATOR = ",";
			var file_content, mapping_ = [], lines;


			if ( (mapping !== undefined) && (typeof mapping === "string" ) ) {
				mapping_ = mapping.split( '-' );
			}

			return {
				update         : function ( path, done ) {

					file_content = FileReader.readConent( path,function( data ){
						file_content = data;
						if ( file_content ) {
							lines = file_content.split( ROW_SEPERATOR );
						}
						done();
					} );

				},
				setRowSeperator: function ( seperator ) {
					ROW_SEPERATOR = FileReader.getSeperator( seperator );
					if ( file_content ) {
						lines = file_content.split( ROW_SEPERATOR );
					}
				},
				setColSeperator: function ( seperator ) {
					COL_SEPERATOR = FileReader.getSeperator( seperator );
				},
				getColumnCount : function () {
					if ( !lines || lines.length === 0 ) return 0;
					return lines[0].split( COL_SEPERATOR ).length;
				},
				getRowCount    : function () {
					if ( lines ) {
						return lines.length;
					} else {
						return 0;
					}
				},
				getRow         : function ( index ) {
					if ( lines[index] === undefined ) return false;
					return lines[index];
				},
				getCell        : function ( row, col ) {
					if ( !lines || lines[row] === undefined ) return false;
					var column = lines[row].split( COL_SEPERATOR );
					if ( column[col] === undefined ) return false;
					return column[col];
				},
				toObjectArray  : function ( done ) {
					FileReader.toObjectArray( path, mapping_, ROW_SEPERATOR, COL_SEPERATOR, done );
				}
			};
		};

		FileReader.CustomReader = function ( path, mapping, row_seperator, col_seperator ) {

			var ROW_SEPERATOR = FileReader.getSeperator( row_seperator );
			var COL_SEPERATOR = FileReader.getSeperator( col_seperator );

			var file_content, mapping_ = [], lines;


			if ( (mapping !== undefined) && (typeof mapping === "string" ) ) {
				mapping_ = mapping.split( '-' );
			}

			return {
				update         : function ( path, done ) {

					file_content = FileReader.readConent( path,function( data ){
						file_content = data;
						if ( file_content ) {
							lines = file_content.split( ROW_SEPERATOR );
						}
						done();
					} );

				},
				setRowSeperator: function ( seperator ) {
					ROW_SEPERATOR = FileReader.getSeperator( seperator );
					if ( file_content ) {
						lines = file_content.split( ROW_SEPERATOR );
					}
				},
				setColSeperator: function ( seperator ) {
					COL_SEPERATOR = FileReader.getSeperator( seperator );
				},
				getColumnCount : function () {
					if ( !lines || lines.length === 0 ) return 0;
					return lines[0].split( COL_SEPERATOR ).length;
				},
				getRowCount    : function () {
					if ( lines ) {
						return lines.length;
					} else {
						return 0;
					}
				},
				getRow         : function ( index ) {
					if ( lines[index] === undefined ) return false;
					return lines[index];
				},
				getCell        : function ( row, col ) {
					if ( !lines || lines[row] === undefined ) return false;
					var column = lines[row].split( COL_SEPERATOR );
					if ( column[col] === undefined ) return false;
					return column[col];
				},
				toObjectArray  : function ( done ) {
					FileReader.toObjectArray( path, mapping_, ROW_SEPERATOR, COL_SEPERATOR, done );
				}
			};
		};

		return FileReader;

	} );
