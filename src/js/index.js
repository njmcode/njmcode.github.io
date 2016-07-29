// Basic module to watch scroll pos and apply/remove body CSS class
// accordingly

var StickyNav = (function() {

	var navEl,
		navTopY,
		scrollY,
		isSticky;

	var _dbt;

	var STICKY_CLASS = 'sticky',
		RESIZE_DEBOUNCE = 100;

	// Store the current scroll position
	function _trackScrollPos() {
		scrollY = window.scrollY || 
			((window.pageYOffset || document.body.scrollTop) - 
			(document.body.clientTop || 0));
	}

	// Store the Y pos of the nav bar relative to the page
	// (this is the 'trigger line' for sticking/unsticking the nav)
	function _trackNavAnchorPos() {
		_trackScrollPos();
		var navbox = navEl.getBoundingClientRect();
		navTopY = navbox.top + scrollY;
	}

	// Fired by the resize listener.
	function _onResize() {
		document.body.classList.remove(STICKY_CLASS);
		isSticky = false;
		setTimeout(function() {
			_trackNavAnchorPos();
			_onScroll();
		}, 1);
	}

	// Fired by the scroll listener.
	// Checks scroll pos against nav pos and sticks/unsticks accordingly
	function _onScroll() {
		_trackScrollPos();
		if(scrollY > navTopY) {
			if(!isSticky) {
				document.body.classList.add(STICKY_CLASS);
				isSticky = true;
			}
		} else {
			if(isSticky) {
				document.body.classList.remove(STICKY_CLASS);
				isSticky = false;
			}
		}
	}

	// Initialize
	function init(options) {
		if(!options || options.selector === undefined) {
			console.warn('Unable to start StickyNav: missing `selector` option');
			return false;
		}
		// Bind and store nav element reference
		navEl = document.querySelector(options.selector);
		if(navEl === undefined) {
			console.warn('Unable to start StickyNav: no element found for selector `' + options.selector + '`');
			return false;
		}
		// Set up listeners for resize (debounce) and scroll
		window.addEventListener('resize', function() {
			clearTimeout(_dbt);
			_dbt = setTimeout(_onResize, RESIZE_DEBOUNCE);
		});
		window.addEventListener('scroll', _onScroll);
		// Start
		isSticky = false;
		_onResize();

		console.log('StickyNav initialized');
	}

	// Public API
	return {
		init: init
	};

})();

// Set up
StickyNav.init({ selector: 'nav' });