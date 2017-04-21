/*!

jQuery Plugin Mobile Mega Menu
Blake Cerecero
Blake@DigitalBlake.com
http://DigitalBlake.com
@blakecerecero

*/
'use strict';

(function($){
	jQuery.fn.extend({

		// Plugin Name
		mobileMegaMenu: function(options){

			// Defaults options are set here
			// Every default goes within the { } brackets as seen below
			// A comma separates the different values
			var defaults = {
				changeToggleText: false,
				enableWidgetRegion: false,
				prependCloseButton: false,
				stayOnActive: true,
				toogleTextOnClose: 'Close Menu',
				menuToggle: 'toggle-menu'
			};

			var settings = $.extend(defaults, options);

			return this.each(function() {
				/* ------------------------- Plugin Starts Here ------------------------- */

				/* Variables */
				var animationSpeed 	= 250, // Change SCSS to match this speed
					nextButton 		= '<a class="next-button" href="#"><div class="arrow">Next</div></a>',
					backButton 		= '<li><a class="back-button" href="#">Back</a></li>',
					closeButton 	= '<li><a class="close-button '+ settings.menuToggle +'" href="#">Close Menu</a></li>',
					maxHeight 		= -1;

				var $menuRoot 		= $(this), // Root of Mobile Mega Menu
					$currentText 	= $('a.' + settings.menuToggle).html(); // Existing text of menu toggle

				/* ------------------------- Add next button to main menu items with sub menus and add back button to top of every sub ul after the root */
				$menuRoot.find('ul a').addClass('menu-item');
				$menuRoot.find('ul ul').before(nextButton).siblings('a:first-of-type').addClass('has-next-button');
				$menuRoot.find('ul ul').prepend(backButton);

				/* ------------------------- Prepend Close Button  */
				if (settings.prependCloseButton){
					$menuRoot.find('ul').closest('ul').prepend(closeButton);
				}

				/* Variables */
				var $toggleMenu 	= $('a.' + settings.menuToggle), // DOM Search for Menu Toggle
					$nextAction 	= $menuRoot.find('a.next-button'), // DOM Search for Next Button
					$backAction 	= $menuRoot.find('a.back-button'); // DOM Search for Back Button

				/* ------------------------- Generate and move Widget Region */
				if(settings.enableWidgetRegion){
					var widgets = $menuRoot.find('.widget-region').detach();
					$menuRoot.find('ul:first').append(widgets);
				}

				/* ------------------------- Set a variable to calculate height of the tallest ul in the menu, then set that height as the min-height of the menu container */
				var subLists = $menuRoot.find('ul');
				var resizeTimer;

				// use setTimeout to prevent function call on every pixel resize
				// for better performance
				$(window).resize(function() {
					clearTimeout(resizeTimer);

					resizeTimer = setTimeout(function() {
						min_el_height();
					}, 500);
				});

				function min_el_height() {
					subLists.toArray().forEach(function(element){
						maxHeight = maxHeight > $(element).height() ? maxHeight : $(element).height();
					});

					$menuRoot.css('min-height', maxHeight + 50);
				};

				min_el_height(); // call function once on initialization

				/* ------------------------- Set active menu item as is-in-view */
				if (settings.stayOnActive){
					var windowHref = window.location.href;
					var pageUrl = windowHref.replace('#', '');

					// Will also work for relative and absolute hrefs
					$menuRoot.find('ul li a').filter(function() {
						// Grab anchors that are part of the original menu structure and not anything added by the plugin
						if ( $(this).hasClass('menu-item') ) {
							// Turn the href for the anchor into an array
							var menuItem = String(this.href).split('/');
							menuItem.pop(); // Remove last empty item in array
							menuItem.pop(); // Remove last page item in array

							// Find parent of anchor and turn it into an array
							var currentItemParent = $(this).parents('li').parents('li').children('a.menu-item')
							var currentItemParentURL = String($(currentItemParent).attr('href')).split('/');
							currentItemParentURL.pop(); // Remove last empty item in array

							if (currentItemParent.length) { // If the current page has a parent
								if (JSON.stringify(menuItem) === JSON.stringify(currentItemParentURL)) { // JSON.stringify so we can compare our arrays
									return this.href === pageUrl; // If the page URL and menu URL match return true
								}
							} else {
								return this.href === pageUrl; // If the page URL and menu URL match return true
							}
						}
					}).addClass('active').css('font-weight', 'bold');

					if ( $menuRoot.find('a.active').siblings('ul').length > 0 ) {
						$menuRoot.find('a.active').removeClass('active').css('font-weight', 'bold').siblings('ul').find('li:first-of-type').first().find('a').addClass('active');
					}

					$menuRoot.find('a.active').closest('ul').addClass('is-in-view').parents('ul').addClass('has-been-viewed');
					$menuRoot.find('a.active').closest('ul').parents().siblings('li').find('ul').hide();
				}

/* ------------------------- Actions ------------------------- */

				/* ------------------------- Open Menu ------------------------- */
				$toggleMenu.click(function(event){
					event.preventDefault();

					/* When the menu is first opened give the first ul its is-in-view class */
					if ( !$menuRoot.find('ul:first-child').hasClass('has-been-viewed') ){
						$menuRoot.find('ul:first-child').toggleClass('is-in-view');
					}

					/* Change text when the menu is open to show the option to close the menu */
					if (settings.changeToggleText){
						if ( !$menuRoot.hasClass('open') ){
							$('a.' + settings.menuToggle).html(settings.toogleTextOnClose);
						} else if ( $menuRoot.hasClass('open') ) {
							$('a.' + settings.menuToggle).html($currentText);
						}
					}

					/* Open menu by adding open class and removing hidden, reverse on close */
					$menuRoot.toggleClass('open');

				});/* End a.toggle-menu */



				/* ------------------------- Next Button ------------------------- */
				$nextAction.click(function(event){
					event.preventDefault();

					setTimeout(function() {
						$('html, body').animate({scrollTop:0}, animationSpeed);
					}, animationSpeed);

					/* Set is-in-view class for current ul and only that ul */
					$(this).siblings('ul:first-of-type').addClass('is-in-view');
					/* Once the sub ul is visible we hide other sibling uls so that they do not appear above the is-in-view ul */
					$(this).parents().siblings('li').find('ul').hide();
					/* If we use the back button and decide to go into another submenu we need to bring back the hidden sibling uls */
					$(this).siblings('ul').show();
					/* Once we go in a level we remove the is-in-view class and add the has-been-viewed class, this allows for the slide off animation and the slide in animations  */
					$(this).parents('ul:first-of-type').addClass('has-been-viewed').removeClass('is-in-view');
				});



				/* ------------------------- Back Button ------------------------- */
				$backAction.click(function(event){
					event.preventDefault();

					/* As we traverse back up the menu we reset the previous menu item from has-been-viewed to the is-in-view class.
					Bringing back the slide in and slide off aniamtions. Once the animation is complete we go back down the DOM and remove the previous is-in-view ul class */
					$(this).parents('ul.is-in-view').closest('ul.has-been-viewed').toggleClass('has-been-viewed is-in-view').promise().done(function(){
						$menuRoot.find('ul.is-in-view ul.is-in-view').toggleClass('is-in-view');
					});
				});



				/* ------------------------- Modernizer: For when css animations are not supported ------------------------- */
				if ( $('html').hasClass('no-csstransforms') || $('html').hasClass('no-cssanimations') ) {

					/* Toggle Menu */
					$toggleMenu.click(function(event){
						event.preventDefault();

						$menuRoot.css('transform', 'none');

						if ( $menuRoot.hasClass('open') ) {
							$menuRoot.animate({
								left: 0
							});
						} else {
							$menuRoot.animate({
								left: '-100%'
							});
						}

					});

					/* Next */
					$nextAction.click(function(event){
						event.preventDefault();

						$menuRoot.find('.has-been-viewed').css('transform', 'none');

						$menuRoot.find('ul').animate({
							right: '+=100%'
						}, animationSpeed);
					});

					/* Back */
					$backAction.click(function(event){
						event.preventDefault();

						$menuRoot.find('.has-been-viewed').css('transform', 'none');

						$menuRoot.find('ul').animate({
							right: '-=100%'
						}, animationSpeed);
					});

				} /* End Modernizer */



			}); // End this.each / End Plugin

		} // End mobileMegaMenu
	}); // End jQuery.fn.extend
}( jQuery )); // End function
