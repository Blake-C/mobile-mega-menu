/* 

Blake Cerecero
Blake@DigitalBlake.com
http://DigitalBlake.com
@blakecerecero

*/
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
				toogleTextOnClose: 'Close Menu'
			};

			var settings = $.extend(defaults, options);

			return this.each(function() {
				/* ------------------------- Plugin Starts Here ------------------------- */
				/* Variables */
				var animationSpeed 	= 250,  // Change SCSS to match this speed
					currentText 	= $('a.toggle-menu').html(), // Existing text of menu toggle
					menuClass 		= '.mobile-mega-menu', // Base Class
					arrowButton 	= '<a class="toggle" href="#"><div class="arrow">Next</div></a>',
					backButton 		= '<li><a class="back-button" href="#">Back</a></li>',
					closeButton 	= '<li><a class="close-button toggle-menu" href="#">Close Menu</a></li>';

				/* ------------------------- Add toggle button to main menu items with sub menus and add back button to top of every sub ul after the root */
				$(menuClass + ' ul ul').before(arrowButton).siblings('a:first-of-type').addClass('has-toggle');
				$(menuClass + ' ul ul').prepend(backButton);

				/* ------------------------- Prepend Close Button  */
				if (settings.prependCloseButton){
					$(menuClass + ' ul').closest('ul').prepend(closeButton);
				}

				// Stop scroll to top Animation on touch/tap/click
				$('html, body').on('touchstart click', function(){
					$("html, body").stop();
				});

				/* ------------------------- Generate and move Widget Region */
				if(settings.enableWidgetRegion){	
					var element = $(menuClass + ' .widget-region').detach();
					$(menuClass + ' ul:first-child').append(element);
				}

				/* ------------------------- Set a variable to calculate height of the tallest ul in the menu, then set that height as the min-height of the menu container */
				var maxHeight = -1;

				$(menuClass + ' ul').each(function(){
					maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
				});

					/* Added 50px to min height to solve issue with last menu item being hidden on desktop */
				$(menuClass).css('min-height', maxHeight + 50).addClass('remove');

				/* ------------------------- Set active menu item as is-in-view */
				if (settings.stayOnActive){
					var str = window.location.href,
						url = str.replace('#', '');
					
					// Will also work for relative and absolute hrefs
					$(menuClass + ' ul li a').filter(function() {
						return this.href === url;
					}).addClass('active');

					$(menuClass + ' a.active').closest('ul').addClass('is-in-view').parents('ul').addClass('has-been-viewed');
					$(menuClass + ' a.active').closest('ul').parents().siblings('li').find('ul').hide();
				}

				/* ------------------------- Toggle Menu ------------------------- */
				$('a.toggle-menu').click(function(event){
					event.preventDefault();

					/* When the menu is first opened give the first ul its is-in-view class */
					if (!$(menuClass + ' ul:first-child').hasClass('has-been-viewed')){
						$(menuClass + ' ul:first-child').toggleClass('is-in-view');
					}
					
					/* Change text when the menu is open to show the option to close the menu */
					// $(this).toggleClass('extended');
					
					if (settings.changeToggleText){
						if ( !$(menuClass).hasClass('open') ){
							$('a.toggle-menu').html(settings.toogleTextOnClose);
						} else if ( $(menuClass).hasClass('open') ) {
							$('a.toggle-menu').html(currentText);
						}
					}

					/* Open menu by adding open class and removing hidden, reverse on close */
					$(menuClass).toggleClass('open').delay(animationSpeed).toggleClass('remove');

				});/* End a.toggle-menu */


				/* ------------------------- Toggle Sub Menus ------------------------- */
				$('a.toggle').click(function(event){
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


				/* ------------------------- Back Button for Sub Menus ------------------------- */
				$('a.back-button').click(function(event){
					event.preventDefault();
					
					/* As we traverse back up the menu we reset the previous menu item from has-been-viewed to the is-in-view class. 
					Bringing back the slide in and slide off aniamtions. Once the animation is complete we go back down the DOM and remove the previous is-in-view ul class */
					$(this).parents('ul.is-in-view').closest('ul.has-been-viewed').toggleClass('has-been-viewed is-in-view').promise().done(function(){
						$('ul.is-in-view ul.is-in-view').toggleClass('is-in-view');
					});
				});


				/* ------------------------- Modernizer: For when css animations are not supported ------------------------- */
				if (!$('html').hasClass('csstransitions')) {

					/* Toggle Menu */
					$('a.toggle-menu').click(function(event){
						event.preventDefault();

						$(menuClass).toggleClass('open-modernizer', animationSpeed);
					});

					/* Next */
					$('a.toggle').click(function(event){
						event.preventDefault();

						$(menuClass + ' ul').animate({
							right: '+=100%'
						}, animationSpeed);
					});

					/* Back */
					$('a.back-button').click(function(event){
						event.preventDefault();

						$(menuClass + ' ul').animate({
							right: '-=100%'
						}, animationSpeed);
					});

				} /* End Modernizer */

			}); // End this.each / End Plugin

		} // End mobileMegaMenu
	}); // End jQuery.fn.extend
}( jQuery )); // End function