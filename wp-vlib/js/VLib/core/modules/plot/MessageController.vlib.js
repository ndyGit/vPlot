/**
 * Created by Andreas Gratzer on 27/11/14.
 */
define(['require', 'jquery'], function ( require, $ ) {

	var MessageController = function( $container ){
		"use strict";

		var container = $container;
		var msgCounter = 0;
		var isOpen = false;

		var getMsgType = function( type ){
			var t;
			switch( type ){
				case 'success':
				case MessageController.MSG_TYPE.SUCCESS:
					t = MessageController.MSG_TYPE.SUCCESS;
					break;
				case 'info':
				case MessageController.MSG_TYPE.INFO:
					t = MessageController.MSG_TYPE.INFO;
					break;
				case 'warning':
				case MessageController.MSG_TYPE.WARNING:
				t = MessageController.MSG_TYPE.WARNING;
				break;
				case 'danger':
				case MessageController.MSG_TYPE.DANGER:
					t = MessageController.MSG_TYPE.DANGER;
					break;
				default:
					console.warn('[ MessageController.getMsgType( %s ) ] Invalid type given.', type);
					t = MessageController.MSG_TYPE.SUCCESS;
					break;
			}

			return t;
		};


		this.addMsg = function ( type, text, open, discardable ) {


			// set default value to false
			discardable = (typeof(discardable) === 'boolean') ? discardable : false;

			var msgId = 'plot-msg-' + msgCounter++;

			var msg = $( '<div />', {
				class: 'alert alert-dismissable ' + getMsgType( type ),
				id   : msgId,
				style: 'display : none;'
			} );

			msg.append( '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' );
			msg.append( text );

			if( discardable ){
				msg.addClass('discardable');
			}

			container.append( msg );

			 if ( open ) {
			    this.open();
			 }

			msg.fadeIn();

			return msgId;
		};

		this.updateMsg = function( msgId, text ){
			if ( !msgId ) {
				return false;
			}
			var msg = container.find( '#' + msgId );
			msg.html( text );
		};

		this.open = function () {
			if( this.isOpen() ){
				return true;
			}
			container.slideDown();
			isOpen = true;
			return true;
		};

		this.close = function () {
			if( !this.isOpen() ){
				return true;
			}
			container.slideUp();
			isOpen = false;
			return true;
		};

		this.toggle = function(){
			if( this.isOpen()){
				this.close();
			}else{
				this.open();
			}
		};

		this.isOpen = function(){
			return isOpen;
		};

		this.empty = function(){
			container.html( '' );
			return true;
		};

		this.removeMsg = function ( id ) {
			if ( !id ) {
				return false;
			}
			var msg = container.find( '#' + id );
			msg.slideUp().promise().done( function () {
				msg.remove();
			} );

			return true;
		};

		this.removeDiscardableMsgs = function(){
			container.find('.discardable' ).each(function(){
				$(this).slideUp().promise().done( function () {
					$(this).remove();
				} );
			});
		};
	};

	MessageController.MSG_TYPE = {
		SUCCESS : 'alert-success',
		INFO : 'alert-info',
		WARNING : 'alert-warning',
		DANGER : 'alert-danger'
	};

	return MessageController;
} );