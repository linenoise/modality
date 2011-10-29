Modality
========

A modal window library for jQuery and jQuery Tools.

Installation
------------

		<script type="text/javascript" src="/javascript/jquery.min.js"></script>
		<script type="text/javascript" src="/javascript/jquery.tools.min.js"></script>
		<script type="text/javascript" src="/javascript/modality.js"></script>

Opening a basic dialog window
-----------------------------
		<script type="text/javascript">
		     var notifier = function(message) { alert("notifier: you pressed " + message); }
		     var callbacker = function(message) { alert("callbacker: you pressed " + message); }
		
			Modality.Dialog({
				title     : 'Your modal window generator is talking to you',
				content   : '<p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, ' + 
							'sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna ' + 
							'aliquam erat volutpat.</p>' + 
							'<p>Should precautionary measures be taken?</p>',
				responses : ['Yes', 'No'],
				notify    : notifier,
				callbacks : {
					'Yes' : callbacker,
					'No'  : callbacker,
				}
			}).show();
		</script>

Opening a basic notice
----------------------

		<script type="text/javascript">
			Modality.Notice({
				title   : 'This will soon fade',
				content : '<p><em>a modal window in G sharp minor.</em></p>',
		 		timeout : 2
		 	}).show();
		</script>

Opening a notice with custom presentation
-----------------------------------------

		<script type="text/javascript">
			Modality.Notice({
		 		title   : 'This will soon fade',
				content : '<p><em>a modal window in G sharp minor.</em></p>',
		 		timeout : 2
			presentation : {
				top_distance	  : 120,
				overlay_opacity   : 0,
				window_shadow_color : '#000',			
			}
		 	}).show();
		</script>

License
-------

		Copyright (c) 2009 Dann Stayskal
		http://dann.stayskal.com/software

		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the 
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with this program.  If not, see <http://www.gnu.org/licenses/>.

