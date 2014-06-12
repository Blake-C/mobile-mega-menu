/* 

Blake Cerecero
Blake@DigitalBlake.com
http://DigitalBlake.com
@blakecerecero

*/
(function($){
	jQuery.fn.extend({

		// Plugin Name
		megaMobileMenu: function(options){

			// Defaults options are set here
			// Every default goes within the { } brackets as seen below
			// A comma separates the different values
			var defaults = {
				changeToggleText: true,
				enableWidgetRegion: false,
				menuClass: '.mobile-mega-menu',
				resetMenu: false,
				stayOnActive: true,
				toogleTextOnClose: 'Close Menu'
			};

			var settings = $.extend(defaults, options);

			return this.each(function() {
				/* ------------------------- Plugin Starts Here ------------------------- */
				/* Variables */
				var animationSpeed = 250;
				var currentText = $('a.toggle-menu').html();

				/* ------------------------- Add toggle button to main menu items with sub menus and add back button to top of every sub ul after the root */
				$(settings.menuClass + ' ul ul').before('<a class="toggle" href="#"><div class="arrow">Next</div></a>').siblings('a:first-of-type').addClass('has-toggle');
				$(settings.menuClass + ' ul ul').prepend('<li><a class="back-button" href="#">Back</a></li>');

				// Stop scroll to top Animation on touch/tap/click
				$('html, body').on('touchstart click', function(){
					$("html, body").stop();
				});

				/* ------------------------- Generate and move Widget Region */
				if(settings.enableWidgetRegion === true){	
					var element = $(settings.menuClass + ' .widget-region').detach();
					$(settings.menuClass + ' ul:first-child').append(element);
				}

				/* ------------------------- Set a variable to calculate height of the tallest ul in the menu, then set that height as the min-height of the menu container */
				var maxHeight = -1;

				$(settings.menuClass + ' ul').each(function(){
					maxHeight = maxHeight > $(this).height() ? maxHeight : $(this).height();
				});

					/* Added 50px to min height to solve issue with last menu item being hidden on desktop */
				$(settings.menuClass).css('min-height', maxHeight + 50).hide();

				/* ------------------------- Set active menu item as is-in-view */
				if (settings.stayOnActive === true){
					var url = window.location.href;

					// Will only work if string in href matches with location
					//$(settings.menuClass + ' ul li a[href="'+ url +'"]').addClass('active');
					
					// Will also work for relative and absolute hrefs
					$(settings.menuClass + ' ul li a').filter(function() {
						return this.href === url;
					}).addClass('active');

					$(settings.menuClass + ' a.active').closest('ul').addClass('is-in-view').parents('ul').addClass('has-been-viewed');
					$(settings.menuClass + ' a.active').closest('ul').parents().siblings('li').find('ul').hide();
				}

				/* ------------------------- Toggle Menu ------------------------- */
				$('a.toggle-menu').click(function(event){
					event.preventDefault();

					/* When the menu is first opened give the first ul its is-in-view class */
					if (!$(settings.menuClass + ' ul:first-child').hasClass('has-been-viewed')){
						$(settings.menuClass + ' ul:first-child').toggleClass('is-in-view');
					}
					
					/* Change text when the menu is open to show the option to close the menu */
					$(this).toggleClass('extended');
					
					if (settings.changeToggleText === true){
						if ( $(this).hasClass('extended') ){
							$(this).html(settings.toogleTextOnClose);
						} else if ( !$(this).hasClass('extended') ) {
							$(this).html(currentText);
						}
					}

					/* 
					setup opening animation with open class and then check on the close click for the open
					class, set time out then reset the menu to root level when closed. 
					*/
					if (settings.resetMenu === true){

						$(settings.menuClass).fadeIn(1, function(){
							$(settings.menuClass).toggleClass('open').promise().done(function(){
								if (!$(settings.menuClass).hasClass('open')) {
									$(settings.menuClass).fadeOut();

									setTimeout(function() {
										$(settings.menuClass + ' ul').removeClass('is-in-view has-been-viewed');
									}, animationSpeed);
								}
							});
						});

					} else {

						$(settings.menuClass).fadeIn(1, function(){
							$(settings.menuClass).toggleClass('open').promise().done(function(){
								if (!$(settings.menuClass).hasClass('open')) {
									$(settings.menuClass).fadeOut();
								}
							});
						});

					}/* End Opening Animation */
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
					
					/* 
					as we traverse back up the menu we reset the previous menu from has-been-viewed 
					to the is-in-view class. Bringing back the slide in and slide off aniamtions. Once the animation is complete
					we go back down the DOM and remove the previous is-in-view ul class 
					*/
					$(this).parents('ul.is-in-view').closest('ul.has-been-viewed').toggleClass('has-been-viewed is-in-view').promise().done(function(){
						$('ul.is-in-view ul.is-in-view').toggleClass('is-in-view');
					});
				});


				/* ------------------------- Modernizer: For when css animations are not supported ------------------------- */
				if (!$('html').hasClass('csstransitions')) {

					/* Toggle Menu */
					$('a.toggle-menu').click(function(event){
						event.preventDefault();

						$(settings.menuClass).toggleClass('open-modernizer', animationSpeed);
					});

					/* Next */
					$('a.toggle').click(function(event){
						event.preventDefault();

						$(settings.menuClass + ' ul').animate({
							right: '+=100%'
						}, animationSpeed);
					});

					/* Back */
					$('a.back-button').click(function(event){
						event.preventDefault();

						$(settings.menuClass + ' ul').animate({
							right: '-=100%'
						}, animationSpeed);
					});

				} /* End Modernizer */

			}); // End this.each / End Plugin

		} // End megaMobileMenu
	}); // End jQuery.fn.extend
}( jQuery )); // End function