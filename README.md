Mobile-Mega-Menu
================

The mobile mega menu is designed to allow for deep menu structures to be navigated easily on mobile devices. It has a left-right animation that makes it easy to understand where you are in the menu hierarchy.

##Installation
Install Bower Components with [Bower](http://bower.io/): ```bower install```
Install NPM Components with [NPM](https://www.npmjs.org/): ```npm install```
Run Development Server for Sass editing: ```grunt serve```
Build files with: ```grunt build```

##Usage
Add Mobile Mega Menu CSS
```html
<link rel="stylesheet" href="css/jquery.mobile-mega-menu.min.css">
```

Load Modernizr
```html
<script src="bower_components/modernizr/modernizr.js" type="text/javascript"></script>
```

Load Jquery
```html
<script src="bower_components/jquery/dist/jquery.min.js" ></script>
```

Load Mobile Mega Menu JS
```html
<script src="js/jquery.mobile-mega-menu.min.js" ></script>
```

Initiate Plugin
```javascript
$( '.mobile-mega-menu' ).mobileMegaMenu({
	changeToggleText: false,
	enableWidgetRegion: false,
	prependCloseButton: false,
	stayOnActive: true,
	toogleTextOnClose: 'Close Menu'
});
```

## Options
**changeToggleText** - default - true
- Use this with toogleTextOnClose to change the text of the button that will open your menu.

**toogleTextOnClose** - default - Close Menu
- If changeToggleText is true then you can change the toggle text with this option. The initial text that is used on your menu toggle will be the default for when the menu is closed.

**enableWidgetRegion** - default - false
- Specify a div element with class of widget-region then place other items within that region to then have it appear below the first unordered list item. This can be search fields, social media links, or any valid HTML.

**prependCloseButton** - default - false
- If the menu will be covering the entire screen you can add a close button at the top of the menu stack.

**stayOnActive** - default - true
- When set to true, the menu level where you select a page will be present the first time you open the menu after the page loads again.

##Contact
   * Twitter: [https://twitter.com/BlakeCerecero][1]
   * Portfolio: [http://digitalblake.com/][2]
   
[1]: https://twitter.com/BlakeCerecero "https://twitter.com/BlakeCerecero"
[2]: http://digitalblake.com/ "http://digitalblake.com/"

This content is released under the [MIT License](http://opensource.org/licenses/MIT).