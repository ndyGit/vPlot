define( ['require', './getConfig.vlib', './setConfig.vlib', 'config', 'core/Animation.vlib', 'core/Utils.vlib', 'jquery'],
	function ( require, getConfig, setConfig, Config, Animation, UTILS, $ ) {
		/**
		 @class Plugin Link
		 @constructor
		 @extends AbstractPlugin
		 **/
		var Plugin = (function () {
			var name = 'link';
			Plugin.superClass.constuctor.call( this, name );
			Plugin.superClass.setContext.call( this, Config.PLUGINTYPE.CONTEXT_3D );
			Plugin.superClass.setType.call( this, Config.PLUGINTYPE.ANIMATION );
			/** path to plugin-template file * */
			Plugin.superClass.setTemplates.call( this, Config.getPluginPath() + '/plugins_3d/activity/link/templates.html' );
			Plugin.superClass.setIcon.call( this, Config.getPluginPath() + '/plugins_3d/activity/link/icon.png' );
			Plugin.superClass.setAccepts.call( this, {
				predecessors: [Config.PLUGINTYPE.ACTIVITY, Config.PLUGINTYPE.ANIMATION],
				successors  : [Config.PLUGINTYPE.ACTIVITY, Config.PLUGINTYPE.ANIMATION]
			} );
			Plugin.superClass.setDescription.call( this, 'Requires: [ ' + this.accepts.predecessors.join( ', ' ) + ' ] Accepts: [ ' + this.accepts.successors.join( ', ' ) + ' ]' );
			/** ********************************** */
			/** PRIVATE VARIABLES * */
			/** ********************************** */
			var isActive = false;
			/** ********************************** */
			/** PUBLIC VARIABLES * */
			/** ********************************** */

			this.defaultBlank = false;
			this.defaultLinkType = 'hyperlink';

			this.env;
			this.childs;
			this.bufferManager;
			this.tween;
			/** ********************************** */
			/** PUBLIC METHODS * */
			/** ********************************** */
			this.destroy = function () {
				if ( this.activity )
					this.activity.destroy();
			};
			/**
			 * Takes inserted configuration from the plugin-template and returns the
			 * parameters as JSON-config-file
			 *
			 * @param containerId
			 *            parent container where the plugin-template got added
			 *
			 * @return config file format: {camera:{x:VALUE,y:VALUE,z:VALUE}}
			 */
			this.getConfigCallback = getConfig;
			/**
			 * Takes arguments from config and inserts them to the plugin-template
			 *
			 * @param config
			 *            plugin config file
			 * @param containerId
			 *            parent container where the plugin-template got added
			 */
			this.setConfigCallback = setConfig;
			this.handleConfig = function ( config, env ) {
				env.config = config || {};
				if ( !env.config.hasOwnProperty( 'blank' ) )
					env.config.target = this.defaultBlank;
				if ( !env.config.hasOwnProperty( 'link' ) )
					env.config.link = '';
				if ( !env.config.hasOwnProperty( 'linkType' ) )
					env.config.linkType = this.defaultLinkType;

			};
			this.handleEnv = function ( env ) {
				env.context = this;
				env.accepts = this.getAccepts();
				env.id = this.getId();
				env.name = this.getName();
				env.icon = this.getIcon();
			};
			var Link = function ( env ) {
				var link = env.config.link;
				var blank = env.config.blank;
				var linkType = env.config.linkType;
				var callback;
				this.openHyperlink = function ( link, target ) {
					var win;

					if ( target ) {
						win = window.open( 'http://' + link, '_blank' );
						win.focus();
					} else {
						window.location.href = 'http://' + link;
					}

				};
				this.openPlot = function ( id, linkBack ) {
					"use strict";
					if ( !env.communication || !env.communication.loadTemplate ) {
						console.warn( '[ Plugin Link ] Unable to load plot. Communication object, or getPlotById callback not set.' );
						return false;
					}
					var backLink = '';
					var currentTemplate = env.communication.currentTemplate || false;
					if ( currentTemplate && linkBack ) {
						backLink = ' <a class="vplot-load-plot" href="#" id="' + currentTemplate.template.id + '">GO BACK to <b>' + currentTemplate.template.name + '</b></a>';
					}
					env.communication.loadTemplate( function ( plot ) {
							env.communication.publish( Config.CHANNEL_RENDER_TEMPLATE, {
								template: plot,
								target  : env.config.container
							} );
							/* LINK BACK */
							var that = this;
							env.communication.messageController.addMsg( 'success', 'Plot-Template <b>' + plot.name + '</b> loaded. ' + backLink );
							$( '.vplot-load-plot' ).on( 'click', function ( e ) {
								"use strict"
								e.preventDefault();
								e.stopPropagation();
								var plotId = $( this ).attr('id');
								that.openPlot( plotId, false );
							} );
						}, function ( error ) {
							env.communication.publish( Config.CHANNEL_ERROR, 'Loading plot template failed.' );
							env.communication.messageController.addMsg( 'danger', 'Loading plot template failed.' );
						},
						this, id );
					/*
					 env.communication.loadTemplate( id, function( plot ){
					 alert("load");
					 if( plot ){
					 env.communication.plotPushMsg('alert-success','Plot-Template <b>'+plot.name+'</b> loaded. '+backLink);

					 env.communication.publish(Config.CHANNEL_RENDER_TEMPLATE,{
					 tempalte : plot,
					 target : env.config.container
					 });

					 $('.vplot-load-plot' ).on('click',function( e ){
					 "use strict"
					 e.preventDefault();
					 e.stopPropagation();
					 var plotId = $( this ).attr('id');

					 env.communication.loadTemplate(plotId,function( template ){
					 alert("DONE");
					 env.communication.publish(Config.CHANNEL_RENDER_TEMPLATE,{
					 tempalte : tempalte,
					 target : env.config.container
					 });
					 });
					 return false;
					 });
					 }
					 } );
					 */

				};

				this.start = function () {
					callback();
					if ( link === "" ) return;
					switch ( linkType ) {
						case 'hyperlink':
							this.openHyperlink( link, blank );
							break;
						case 'plot':
							this.openPlot( link, true );
							break;
					}

				};
				this.onComplete = function ( cb ) {
					callback = cb;
				};
			};
			this.link = function ( e ) {
				return Plugin.superClass.getAnimationChain( [new Link( this.env )], e, this.env );
			};

			this.exec = function ( config, childs, bufferManager, communication ) {


				this.bufferManager = bufferManager;
				this.env = {};
				this.env.communication = communication;
				this.handleConfig( config, this.env );
				this.handleEnv( this.env );
				Plugin.superClass.handleChilds( childs, this.env );
				this.childs = childs;

				var subactivities = [];
				for ( var i = 0, il = this.env.animations.length; i < il; ++i ) {
					subactivities = subactivities.concat( this.env.animations[i].activities );
				}
				this.env.activities = this.env.activities.concat( subactivities );


				var result = {
					aType     : Config.ACTION.LINK,
					context   : this,
					callback  : this.link,
					activities: this.env.activities
				};
				return {
					pId     : this.getId(),
					pType   : this.type,
					response: result
				};
			};
			/** ********************************** */
			/** PRIVATE METHODS * */
			/** ********************************** */

		});

		UTILS.CLASS.extend( Plugin, Animation );
		return Plugin;
	} );
