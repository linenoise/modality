/*
 * modality.js
 *
 * Modality - a modal window generator for jQuery Tools
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * -----
 * 
 * Tested with combination of jQuery 1.3.2 and jQuery Tools 1.1.2
 * 
*/

var Modality = new function() {
	
	var _next_modal_id = 0;
	
	/*   PRIVATE METHODS   */

	// _create_a_modal_window_for -- generates and appends a modal message div to document.body
	var _create_a_modal_window_for = function(that, request) {
		$('body').append(
			'<div class="modality" id="' + that.html_id + '"></div>'
		);
		$(that.selector).hide();
	}	

	// _add_title_if_provided_in -- generates and appends an h2 div containing requested title
	var _add_title_if_provided_in = function (that, request) {
		if (typeof request.title == 'string') {
			$(that.selector).append(
				'<h2>' + request.title + '</h2>'
			);
		}
	}

	// _add_content_if_provided_in -- generates and appends a classed div containing requested content
	var _add_content_if_provided_in = function (that, request) {
		if (typeof request.content == 'string') {
			$(that.selector).append(
				'<div class="contents">' + request.content + '</div>'
			);
		}
	}

	// _add_response_to -- Generates and appends an input option to controls form.  Creates form if needed.
	var _add_response_to = function (that, name) {
		// Create the controls div if it doesn't yet exist
		if (! $(that.selector + ' div.controls form').length) {
			$(that.selector).append(
				'<div class="controls"><form></form></div>'
			);
		}
		// And add the response as an input object
		var safe_name = name.replace(/\W/g, "_");
		$(that.selector + ' div.controls form').append(
			'<input type="submit" name="' + safe_name + 
			'" class="close ' + safe_name + 
			'" value="' + name + '" />'
		);
	}

	// _add_responses_if_provided_in -- calls _add_response for each requested response option
	var _add_responses_if_provided_in = function (that, request) {
		if (typeof request.responses == 'object' && request.responses.constructor == Array) {
			for (var i = 0; i < request.responses.length; i++) {
				_add_response_to(that, request.responses[i]);
			}
		}
	}

	// _add_default_response_if_none_provided_in -- adds a "Close" button if none others present
	var _add_default_response_if_none_provided_in = function (that, request) {
		if (! $(that.selector + ' input').length) {
			_add_response_to(that, 'Close');
		}
	}

	// _bind_callback_events_if_provided_in -- binds any requested callbacks to a specific form input
	var _bind_callback_events_if_provided_in = function (that, request) {
		if (typeof request.callbacks == 'object' && request.callbacks.constructor == Object) {
			for (response in request.callbacks) {
				if (typeof request.callbacks[response] == 'function') { 
					$(that.selector + ' input' + '.' + response.replace(/\W/g, "_")).click(function(){
						request.callbacks[response](this.value);
					}); 
				}
			}
		}
	}

	// _bind_notify_event_if_provided_in -- binds a requested notifier to all form inputs
	var _bind_notify_event_if_provided_in = function (that, request) {
		if (typeof request.notify == 'function') {
			var inputs = $(that.selector + ' div.controls form input').click(function(event) { 
				if (inputs[inputs.index(this)].type == 'submit') {
					request.notify(inputs[inputs.index(this)].value);
				}
			});
		}
	}

	// _bind_dispose_event_if_provided_in -- binds a requested reaper to inevitable dismissal of this modality
	var _bind_dispose_event_if_provided_in = function (that, request) {
		if (typeof request.dispose == 'function') {
			$(that.selector + ' div.controls form input').click(function(event) { 
				request.dispose();
				that.disposed = true;
			});
			$(document).keyup(function(event) {
				if (event.keyCode == 27) { 
					request.dispose();
					that.disposed = true;
				}
			});
		}
	}
	
	// _set_timeout_if_provided_in -- sets timetout to fade out modal window if requested
	var _set_timeout_if_provided_in = function(that, request) {
		if (typeof request.timeout == 'number') {
			that.presentation.timeout = request.timeout * 1000;
		}
	}

	// _set_default_timeout_if_not_provided_in -- sets the default timeout of 7 seconds
	var _set_default_timeout_if_not_provided_in = function(that, request) {
		if (typeof that.presentation.timeout == 'undefined') {
			that.presentation.timeout = 7000;
		}
	}

	// _default_presentation -- provides baseline presentation configuration options
	var _default_presentation = function() {
		return {
			js : {
				top_distance	: 120,
				load_speed		: 200,
				overlay_color	: '#000',
				overlay_opacity : 0.35,
			},
			css : {
				main : {
					"margin" 				: "0px auto",
					"background"	 		: "#fff",
					"width" 				: "350px",
					"padding" 				: "10px 10px 0px 10px",
					"text-align" 			: "left",
					"border-width" 			: "2px",
					"border-style" 			: "solid",
					"border-color" 			: "#333",
					"-moz-border-radius" 	: "10px",
					"-webkit-border-radius" : "10px",
					"font-size" 			: "10pt",
					"-moz-box-shadow" 		: "0 0 50px #EEE",
					"-webkit-box-shadow" 	: "0 0 50px #EEE",
				},
				header : {
					"background"	 		: "#FFF",
					"margin" 				: "0px 0px 10px 0px",
					"padding" 				: "5px 0px",
					"border" 				: "0px",
					"width" 				: "100%",
					"border-bottom-width" 	: "2px",
					"border-bottom-style" 	: "solid",
					"border-bottom-color" 	: "#333",
					"font-size" 			: "20px",
				},
				controls : {
					"text-align" 			: "right",
					"padding-top" 			: "20px",
				},
				buttons : {
					"font-size" 			: "10pt",
					"background"	 		: "#2A5988",
					"color" 				: "#FFF",
					"border-width" 			: "2px",
					"border-style" 			: "solid",
					"border-color" 			: "#000",
					"-moz-border-radius" 	: "10px",
					"-webkit-border-radius" : "10px",
					"padding" 				: "2px 5px",
					"margin-left" 			: "12px",
				}
			}
		};
	}

	// _load_default_blocking_presentation_into -- loads default blocking presentation variables
	var _load_default_blocking_presentation_into = function (that) {
		that.presentation = _default_presentation();
	}
	
	// _load_default_non_blocking_presentation_into -- loads default blocking presentation variables
	var _load_default_non_blocking_presentation_into = function (that) {
		that.presentation = _default_presentation();
		that.presentation.js.top_distance = 150;
		that.presentation.js.overlay_opacity = 0;
		that.presentation.css.main['-moz-box-shadow'] = "0 0 50px #000";
		that.presentation.css.main['-webkit-box-shadow'] = "0 0 50px #000";
	}
	
	// _css_writers -- provides methods to construct css from presentation options
	var _css_writers = function () {
		return {
			window_background : 	 function (value, css){ css.main['background'] = value; 
															css.header['background'] = value; },
			window_width : 			 function (value, css){ css.main['width'] = value + 'px'; },
			window_padding : 		 function (value, css){ css.main['padding'] = value + 'px'; },
			window_border_width : 	 function (value, css){ css.main['border-width'] = value + 'px'; },
			window_border_style : 	 function (value, css){ css.main['border-style'] = value; },
			window_border_color : 	 function (value, css){ css.main['border-color'] = value;
			 												css.header['border-bottom-color'] = value; },
			window_border_radius : 	 function (value, css){ css.main['-moz-border-radius'] = value + 'px';
			 												css.main['-webkit-border-radius'] = value + 'px'; },
			window_shadow_color :	 function (value, css){ css.main['-moz-box-shadow'] = "0 0 50px " + value;
															css.main['-webkit-box-shadow'] = "0 0 50px " + value; },

			header_font_size : 		 function (value, css){ css.header['font-size'] = value; },
			header_underline_width : function (value, css){ css.header['border-bottom-width'] = value + 'px'; },

			button_font_size : 		 function (value, css){ css.buttons['font-size'] = value; },
			button_background : 	 function (value, css){ css.buttons['background'] = value; },
			button_font_color : 	 function (value, css){ css.buttons['color'] = value; },
			button_spacing : 		 function (value, css){ css.buttons['margin-left'] = value + 'px'; },
			button_border_width : 	 function (value, css){ css.buttons['border-width'] = value + 'px'; },
			button_border_style : 	 function (value, css){ css.buttons['border-style'] = value; },
			button_border_color : 	 function (value, css){ css.buttons['border-color'] = value; },
			button_border_radius : 	 function (value, css){ css.buttons['-moz-border-radius'] = value + 'px';
			 												css.buttons['-webkit-border-radius'] = value + 'px'; },
		}
	}
	
	// _configure_presentation_for -- loads presentation configuration variables (from request) over defaults
	var _configure_presentation_for = function (that, request) {
		
		// Load variables governed by JavaScript
		if (typeof request.presentation == 'object' && request.presentation.constructor == Object) {
			for (var key in that.presentation.js) {
				that.presentation.js[key] = request.presentation[key];
			}
		}
		
		// Load variables governed by CSS		
		var writers = _css_writers();
		if (typeof request.presentation == 'object' && request.presentation.constructor == Object) {
			for (var key in writers) {
				if (typeof request.presentation[key] != 'undefined') {
					writers[key](request.presentation[key],that.presentation.css);
				}
			}
		}
		
	}

	// _bind_timeout_if_defined_in -- binds timeout event (used for notifications predominantly)
	var _bind_timeout_if_defined_in = function (that, request) {
		if (typeof that.presentation.timeout != 'undefined') {
			setTimeout(
				function() {
					$(that.selector).fadeOut('slow');
					that.overlay.close();
					if (typeof that.disposed == 'undefined') {
						request.dispose();
					}
				}, 
				that.presentation.timeout
			);
		}
	}

	// _show_in_overlay_window -- disables message input events, shows the modal window in an overlay
	var _show_in_overlay_window = function (that, request) {

		// If we have buttons, disable the submit event on it (so page doesn't refresh)
		if ($(that.selector + ' div.controls form').length) {
			$(that.selector + ' div.controls form').submit(function(event){
				event.preventDefault();
			});
		}
		
		// ... and show the overlay
		that.overlay = jQuery(that.selector).overlay({
			oneInstance  : false,
			closeOnClick : false,
			api          : true,
			top          : that.presentation.js.top_distance,
			expose       : { 
				loadSpeed : that.presentation.js.load_speed, 
				color     : that.presentation.js.overlay_color, 
				opacity   : that.presentation.js.overlay_opacity
			},
		});
		
		$(that.selector).css(that.presentation.css.main);
		$(that.selector + " h2").css(that.presentation.css.header);
		$(that.selector + " .controls").css(that.presentation.css.controls);
		$(that.selector + " .controls input").css(that.presentation.css.buttons);
		
		that.overlay.load();
		
		_bind_timeout_if_defined_in(that, request);
	}

	// _new_id -- returns a new, unique modality window ID
	var _new_modal_id = function () {
		return _next_modal_id++;
	}

	/*   PRIVATE CLASS INSTANTIATOR   */

	//  Modal -- superclass for modal attribute and method inheritance
	var Modal = function (request) {

		// Modal.id the unique ID for this modality
		this.id = _new_modal_id();
		this.html_id  = 'modality_'  + String(this.id); // i.e. '<div id="' + this.html_id ... 
		this.selector = '#' + this.html_id;				// i.e. $(this.selector).aardvark()...
				
		// Modal.show -- runs the modal window itself
		this.show = function() {
			_show_in_overlay_window(this, request);
		}

		return this;
	}

    return {
	
		/*  PUBLIC CLASS INSTANTIATORS   */
		
		/*
		 *	Modality.Dialog
		 *
		 *  Presents a modal dialog window with options and notifies callbacks with answer
		 *
		 *	Parameters: Takes an Object-hash containing the following keys, all optional
		 *	
		 *		title (string)     - The title to present in the window
		 *		content (string)   - The HTML contents of the window
		 *		responses (Array)  - an array of strings representing optional responses to the window
		 *		callbacks (Object) - a hash containing key-value pairs of callbacks to be executed
		 *							 when any one button or another is clicked.
		 *		notify (function)  - a callback to be executed when any button is clicked.
		 *		dispose (function) - a callback to be executed when the window is disposed for any reason 
		 *							 (button clicks, pressing escape, or timeout)
		 *							
		 *	Note: all functions serving as callbacks will be called with one argument:
		 *		  a string containing the text of the button clicked.
		 *
		*/
		Dialog : function(request) {
			this.inheritFrom = Modal;
			this.inheritFrom(request);
			
			_load_default_blocking_presentation_into(this);
			_configure_presentation_for(this, request);
			_create_a_modal_window_for(this, request);
			_add_title_if_provided_in(this, request);
			_add_content_if_provided_in(this, request);
			_add_responses_if_provided_in(this, request);
			_add_default_response_if_none_provided_in(this, request);
			_bind_callback_events_if_provided_in(this, request);
			_bind_notify_event_if_provided_in(this, request);
			_bind_dispose_event_if_provided_in(this, request);

			return this;
		},


		/*
		 *	Modality.Notice
		 *
		 *  Presents a modal notice window with default time to fade-out of three seconds
		 *
		 *	Parameters: Takes an Object-hash containing the following keys, all optional
		 *	
		 *		title (string)     - The title to present in the window
		 *		content (string)   - The HTML contents of the window
		 *		notify (function)  - a callback to be executed when any button is clicked.
		 *		dispose (function) - a callback to be executed when the window is disposed for any reason 
		 *							 (button clicks, pressing escape, or timeout)
		 *      timeout (number)   - the number of seconds to wait before fading out (default behavior
		 *							 is to stay in place until dismissed by user)
		 *							
		*/
		Notice : function(request) {
			this.inheritFrom = Modal;
			this.inheritFrom(request);
			
			_load_default_non_blocking_presentation_into(this);
			_configure_presentation_for(this, request);
			_create_a_modal_window_for(this, request);
			_add_title_if_provided_in(this, request);
			_add_content_if_provided_in(this, request);
			_add_default_response_if_none_provided_in(this, request);
			_bind_notify_event_if_provided_in(this, request);
			_bind_dispose_event_if_provided_in(this, request);
			_set_timeout_if_provided_in(this, request);
			_set_default_timeout_if_not_provided_in(this, request);

			return this;
		},

    };
}
