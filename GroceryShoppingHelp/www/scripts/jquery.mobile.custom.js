/*
* jQuery Mobile v1.4.5
* http://jquerymobile.com
*
* Copyright 2010, 2014 jQuery Foundation, Inc. and other contributors
* Released under the MIT license.
* http://jquery.org/license
*
*/

(function ( root, doc, factory ) {
	if ( typeof define === "function" && define.amd ) {
		// AMD. Register as an anonymous module.
		define( [ "jquery" ], function ( $ ) {
			factory( $, root, doc );
			return $.mobile;
		});
	} else {
		// Browser globals
		factory( root.jQuery, root, doc );
	}
}( this, document, function ( jQuery, window, document, undefined ) {(function( $ ) {
	$.mobile = {};
}( jQuery ));

(function( $, window, undefined ) {
	$.extend( $.mobile, {

		// Version of the jQuery Mobile Framework
		version: "1.4.5",

		// Deprecated and no longer used in 1.4 remove in 1.5
		// Define the url parameter used for referencing widget-generated sub-pages.
		// Translates to example.html&ui-page=subpageIdentifier
		// hash segment before &ui-page= is used to make Ajax request
		subPageUrlKey: "ui-page",

		hideUrlBar: true,

		// Keepnative Selector
		keepNative: ":jqmData(role='none'), :jqmData(role='nojs')",

		// Deprecated in 1.4 remove in 1.5
		// Class assigned to page currently in view, and during transitions
		activePageClass: "ui-page-active",

		// Deprecated in 1.4 remove in 1.5
		// Class used for "active" button state, from CSS framework
		activeBtnClass: "ui-btn-active",

		// Deprecated in 1.4 remove in 1.5
		// Class used for "focus" form element state, from CSS framework
		focusClass: "ui-focus",

		// Automatically handle clicks and form submissions through Ajax, when same-domain
		ajaxEnabled: true,

		// Automatically load and show pages based on location.hash
		hashListeningEnabled: true,

		// disable to prevent jquery from bothering with links
		linkBindingEnabled: true,

		// Set default page transition - 'none' for no transitions
		defaultPageTransition: "fade",

		// Set maximum window width for transitions to apply - 'false' for no limit
		maxTransitionWidth: false,

		// Minimum scroll distance that will be remembered when returning to a page
		// Deprecated remove in 1.5
		minScrollBack: 0,

		// Set default dialog transition - 'none' for no transitions
		defaultDialogTransition: "pop",

		// Error response message - appears when an Ajax page request fails
		pageLoadErrorMessage: "Error Loading Page",

		// For error messages, which theme does the box use?
		pageLoadErrorMessageTheme: "a",

		// replace calls to window.history.back with phonegaps navigation helper
		// where it is provided on the window object
		phonegapNavigationEnabled: false,

		//automatically initialize the DOM when it's ready
		autoInitializePage: true,

		pushStateEnabled: true,

		// allows users to opt in to ignoring content by marking a parent element as
		// data-ignored
		ignoreContentEnabled: false,

		buttonMarkup: {
			hoverDelay: 200
		},

		// disable the alteration of the dynamic base tag or links in the case
		// that a dynamic base tag isn't supported
		dynamicBaseEnabled: true,

		// default the property to remove dependency on assignment in init module
		pageContainer: $(),

		//enable cross-domain page support
		allowCrossDomainPages: false,

		dialogHashKey: "&ui-state=dialog"
	});
})( jQuery, this );

(function( $, window, undefined ) {
	var nsNormalizeDict = {},
		oldFind = $.find,
		rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
		jqmDataRE = /:jqmData\(([^)]*)\)/g;

	$.extend( $.mobile, {

		// Namespace used framework-wide for data-attrs. Default is no namespace

		ns: "",

		// Retrieve an attribute from an element and perform some massaging of the value

		getAttribute: function( element, key ) {
			var data;

			element = element.jquery ? element[0] : element;

			if ( element && element.getAttribute ) {
				data = element.getAttribute( "data-" + $.mobile.ns + key );
			}

			// Copied from core's src/data.js:dataAttr()
			// Convert from a string to a proper data type
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? JSON.parse( data ) :
					data;
			} catch( err ) {}

			return data;
		},

		// Expose our cache for testing purposes.
		nsNormalizeDict: nsNormalizeDict,

		// Take a data attribute property, prepend the namespace
		// and then camel case the attribute string. Add the result
		// to our nsNormalizeDict so we don't have to do this again.
		nsNormalize: function( prop ) {
			return nsNormalizeDict[ prop ] ||
				( nsNormalizeDict[ prop ] = $.camelCase( $.mobile.ns + prop ) );
		},

		// Find the closest javascript page element to gather settings data jsperf test
		// http://jsperf.com/single-complex-selector-vs-many-complex-selectors/edit
		// possibly naive, but it shows that the parsing overhead for *just* the page selector vs
		// the page and dialog selector is negligable. This could probably be speed up by
		// doing a similar parent node traversal to the one found in the inherited theme code above
		closestPageData: function( $target ) {
			return $target
				.closest( ":jqmData(role='page'), :jqmData(role='dialog')" )
				.data( "mobile-page" );
		}

	});

	// Mobile version of data and removeData and hasData methods
	// ensures all data is set and retrieved using jQuery Mobile's data namespace
	$.fn.jqmData = function( prop, value ) {
		var result;
		if ( typeof prop !== "undefined" ) {
			if ( prop ) {
				prop = $.mobile.nsNormalize( prop );
			}

			// undefined is permitted as an explicit input for the second param
			// in this case it returns the value and does not set it to undefined
			if ( arguments.length < 2 || value === undefined ) {
				result = this.data( prop );
			} else {
				result = this.data( prop, value );
			}
		}
		return result;
	};

	$.jqmData = function( elem, prop, value ) {
		var result;
		if ( typeof prop !== "undefined" ) {
			result = $.data( elem, prop ? $.mobile.nsNormalize( prop ) : prop, value );
		}
		return result;
	};

	$.fn.jqmRemoveData = function( prop ) {
		return this.removeData( $.mobile.nsNormalize( prop ) );
	};

	$.jqmRemoveData = function( elem, prop ) {
		return $.removeData( elem, $.mobile.nsNormalize( prop ) );
	};

	$.find = function( selector, context, ret, extra ) {
		if ( selector.indexOf( ":jqmData" ) > -1 ) {
			selector = selector.replace( jqmDataRE, "[data-" + ( $.mobile.ns || "" ) + "$1]" );
		}

		return oldFind.call( this, selector, context, ret, extra );
	};

	$.extend( $.find, oldFind );

})( jQuery, this );

/*!
 * jQuery UI Core c0ab71056b936627e8a7821f03c044aec6280a40
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/category/ui-core/
 */
(function( $, undefined ) {

var uuid = 0,
	runiqueId = /^ui-id-\d+$/;

// $.ui might exist from components with no dependencies, e.g., $.ui.position
$.ui = $.ui || {};

$.extend( $.ui, {
	version: "c0ab71056b936627e8a7821f03c044aec6280a40",

	keyCode: {
		BACKSPACE: 8,
		COMMA: 188,
		DELETE: 46,
		DOWN: 40,
		END: 35,
		ENTER: 13,
		ESCAPE: 27,
		HOME: 36,
		LEFT: 37,
		PAGE_DOWN: 34,
		PAGE_UP: 33,
		PERIOD: 190,
		RIGHT: 39,
		SPACE: 32,
		TAB: 9,
		UP: 38
	}
});

// plugins
$.fn.extend({
	focus: (function( orig ) {
		return function( delay, fn ) {
			return typeof delay === "number" ?
				this.each(function() {
					var elem = this;
					setTimeout(function() {
						$( elem ).focus();
						if ( fn ) {
							fn.call( elem );
						}
					}, delay );
				}) :
				orig.apply( this, arguments );
		};
	})( $.fn.focus ),

	scrollParent: function() {
		var scrollParent;
		if (($.ui.ie && (/(static|relative)/).test(this.css("position"))) || (/absolute/).test(this.css("position"))) {
			scrollParent = this.parents().filter(function() {
				return (/(relative|absolute|fixed)/).test($.css(this,"position")) && (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		} else {
			scrollParent = this.parents().filter(function() {
				return (/(auto|scroll)/).test($.css(this,"overflow")+$.css(this,"overflow-y")+$.css(this,"overflow-x"));
			}).eq(0);
		}

		return ( /fixed/ ).test( this.css( "position") ) || !scrollParent.length ? $( this[ 0 ].ownerDocument || document ) : scrollParent;
	},

	uniqueId: function() {
		return this.each(function() {
			if ( !this.id ) {
				this.id = "ui-id-" + (++uuid);
			}
		});
	},

	removeUniqueId: function() {
		return this.each(function() {
			if ( runiqueId.test( this.id ) ) {
				$( this ).removeAttr( "id" );
			}
		});
	}
});

// selectors
function focusable( element, isTabIndexNotNaN ) {
	var map, mapName, img,
		nodeName = element.nodeName.toLowerCase();
	if ( "area" === nodeName ) {
		map = element.parentNode;
		mapName = map.name;
		if ( !element.href || !mapName || map.nodeName.toLowerCase() !== "map" ) {
			return false;
		}
		img = $( "img[usemap=#" + mapName + "]" )[0];
		return !!img && visible( img );
	}
	return ( /input|select|textarea|button|object/.test( nodeName ) ?
		!element.disabled :
		"a" === nodeName ?
			element.href || isTabIndexNotNaN :
			isTabIndexNotNaN) &&
		// the element and all of its ancestors must be visible
		visible( element );
}

function visible( element ) {
	return $.expr.filters.visible( element ) &&
		!$( element ).parents().addBack().filter(function() {
			return $.css( this, "visibility" ) === "hidden";
		}).length;
}

$.extend( $.expr[ ":" ], {
	data: $.expr.createPseudo ?
		$.expr.createPseudo(function( dataName ) {
			return function( elem ) {
				return !!$.data( elem, dataName );
			};
		}) :
		// support: jQuery <1.8
		function( elem, i, match ) {
			return !!$.data( elem, match[ 3 ] );
		},

	focusable: function( element ) {
		return focusable( element, !isNaN( $.attr( element, "tabindex" ) ) );
	},

	tabbable: function( element ) {
		var tabIndex = $.attr( element, "tabindex" ),
			isTabIndexNaN = isNaN( tabIndex );
		return ( isTabIndexNaN || tabIndex >= 0 ) && focusable( element, !isTabIndexNaN );
	}
});

// support: jQuery <1.8
if ( !$( "<a>" ).outerWidth( 1 ).jquery ) {
	$.each( [ "Width", "Height" ], function( i, name ) {
		var side = name === "Width" ? [ "Left", "Right" ] : [ "Top", "Bottom" ],
			type = name.toLowerCase(),
			orig = {
				innerWidth: $.fn.innerWidth,
				innerHeight: $.fn.innerHeight,
				outerWidth: $.fn.outerWidth,
				outerHeight: $.fn.outerHeight
			};

		function reduce( elem, size, border, margin ) {
			$.each( side, function() {
				size -= parseFloat( $.css( elem, "padding" + this ) ) || 0;
				if ( border ) {
					size -= parseFloat( $.css( elem, "border" + this + "Width" ) ) || 0;
				}
				if ( margin ) {
					size -= parseFloat( $.css( elem, "margin" + this ) ) || 0;
				}
			});
			return size;
		}

		$.fn[ "inner" + name ] = function( size ) {
			if ( size === undefined ) {
				return orig[ "inner" + name ].call( this );
			}

			return this.each(function() {
				$( this ).css( type, reduce( this, size ) + "px" );
			});
		};

		$.fn[ "outer" + name] = function( size, margin ) {
			if ( typeof size !== "number" ) {
				return orig[ "outer" + name ].call( this, size );
			}

			return this.each(function() {
				$( this).css( type, reduce( this, size, true, margin ) + "px" );
			});
		};
	});
}

// support: jQuery <1.8
if ( !$.fn.addBack ) {
	$.fn.addBack = function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	};
}

// support: jQuery 1.6.1, 1.6.2 (http://bugs.jquery.com/ticket/9413)
if ( $( "<a>" ).data( "a-b", "a" ).removeData( "a-b" ).data( "a-b" ) ) {
	$.fn.removeData = (function( removeData ) {
		return function( key ) {
			if ( arguments.length ) {
				return removeData.call( this, $.camelCase( key ) );
			} else {
				return removeData.call( this );
			}
		};
	})( $.fn.removeData );
}





// deprecated
$.ui.ie = !!/msie [\w.]+/.exec( navigator.userAgent.toLowerCase() );

$.support.selectstart = "onselectstart" in document.createElement( "div" );
$.fn.extend({
	disableSelection: function() {
		return this.bind( ( $.support.selectstart ? "selectstart" : "mousedown" ) +
			".ui-disableSelection", function( event ) {
				event.preventDefault();
			});
	},

	enableSelection: function() {
		return this.unbind( ".ui-disableSelection" );
	},

	zIndex: function( zIndex ) {
		if ( zIndex !== undefined ) {
			return this.css( "zIndex", zIndex );
		}

		if ( this.length ) {
			var elem = $( this[ 0 ] ), position, value;
			while ( elem.length && elem[ 0 ] !== document ) {
				// Ignore z-index if position is set to a value where z-index is ignored by the browser
				// This makes behavior of this function consistent across browsers
				// WebKit always returns auto if the element is positioned
				position = elem.css( "position" );
				if ( position === "absolute" || position === "relative" || position === "fixed" ) {
					// IE returns 0 when zIndex is not specified
					// other browsers return a string
					// we ignore the case of nested elements with an explicit value of 0
					// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
					value = parseInt( elem.css( "zIndex" ), 10 );
					if ( !isNaN( value ) && value !== 0 ) {
						return value;
					}
				}
				elem = elem.parent();
			}
		}

		return 0;
	}
});

// $.ui.plugin is deprecated. Use $.widget() extensions instead.
$.ui.plugin = {
	add: function( module, option, set ) {
		var i,
			proto = $.ui[ module ].prototype;
		for ( i in set ) {
			proto.plugins[ i ] = proto.plugins[ i ] || [];
			proto.plugins[ i ].push( [ option, set[ i ] ] );
		}
	},
	call: function( instance, name, args, allowDisconnected ) {
		var i,
			set = instance.plugins[ name ];

		if ( !set ) {
			return;
		}

		if ( !allowDisconnected && ( !instance.element[ 0 ].parentNode || instance.element[ 0 ].parentNode.nodeType === 11 ) ) {
			return;
		}

		for ( i = 0; i < set.length; i++ ) {
			if ( instance.options[ set[ i ][ 0 ] ] ) {
				set[ i ][ 1 ].apply( instance.element, args );
			}
		}
	}
};

})( jQuery );

(function( $, window, undefined ) {

	// Subtract the height of external toolbars from the page height, if the page does not have
	// internal toolbars of the same type. We take care to use the widget options if we find a
	// widget instance and the element's data-attributes otherwise.
	var compensateToolbars = function( page, desiredHeight ) {
		var pageParent = page.parent(),
			toolbarsAffectingHeight = [],

			// We use this function to filter fixed toolbars with option updatePagePadding set to
			// true (which is the default) from our height subtraction, because fixed toolbars with
			// option updatePagePadding set to true compensate for their presence by adding padding
			// to the active page. We want to avoid double-counting by also subtracting their
			// height from the desired page height.
			noPadders = function() {
				var theElement = $( this ),
					widgetOptions = $.mobile.toolbar && theElement.data( "mobile-toolbar" ) ?
						theElement.toolbar( "option" ) : {
							position: theElement.attr( "data-" + $.mobile.ns + "position" ),
							updatePagePadding: ( theElement.attr( "data-" + $.mobile.ns +
								"update-page-padding" ) !== false )
						};

				return !( widgetOptions.position === "fixed" &&
					widgetOptions.updatePagePadding === true );
			},
			externalHeaders = pageParent.children( ":jqmData(role='header')" ).filter( noPadders ),
			internalHeaders = page.children( ":jqmData(role='header')" ),
			externalFooters = pageParent.children( ":jqmData(role='footer')" ).filter( noPadders ),
			internalFooters = page.children( ":jqmData(role='footer')" );

		// If we have no internal headers, but we do have external headers, then their height
		// reduces the page height
		if ( internalHeaders.length === 0 && externalHeaders.length > 0 ) {
			toolbarsAffectingHeight = toolbarsAffectingHeight.concat( externalHeaders.toArray() );
		}

		// If we have no internal footers, but we do have external footers, then their height
		// reduces the page height
		if ( internalFooters.length === 0 && externalFooters.length > 0 ) {
			toolbarsAffectingHeight = toolbarsAffectingHeight.concat( externalFooters.toArray() );
		}

		$.each( toolbarsAffectingHeight, function( index, value ) {
			desiredHeight -= $( value ).outerHeight();
		});

		// Height must be at least zero
		return Math.max( 0, desiredHeight );
	};

	$.extend( $.mobile, {
		// define the window and the document objects
		window: $( window ),
		document: $( document ),

		// TODO: Remove and use $.ui.keyCode directly
		keyCode: $.ui.keyCode,

		// Place to store various widget extensions
		behaviors: {},

		// Scroll page vertically: scroll to 0 to hide iOS address bar, or pass a Y value
		silentScroll: function( ypos ) {
			if ( $.type( ypos ) !== "number" ) {
				ypos = $.mobile.defaultHomeScroll;
			}

			// prevent scrollstart and scrollstop events
			$.event.special.scrollstart.enabled = false;

			setTimeout(function() {
				window.scrollTo( 0, ypos );
				$.mobile.document.trigger( "silentscroll", { x: 0, y: ypos });
			}, 20 );

			setTimeout(function() {
				$.event.special.scrollstart.enabled = true;
			}, 150 );
		},

		getClosestBaseUrl: function( ele )	{
			// Find the closest page and extract out its url.
			var url = $( ele ).closest( ".ui-page" ).jqmData( "url" ),
				base = $.mobile.path.documentBase.hrefNoHash;

			if ( !$.mobile.dynamicBaseEnabled || !url || !$.mobile.path.isPath( url ) ) {
				url = base;
			}

			return $.mobile.path.makeUrlAbsolute( url, base );
		},
		removeActiveLinkClass: function( forceRemoval ) {
			if ( !!$.mobile.activeClickedLink &&
				( !$.mobile.activeClickedLink.closest( "." + $.mobile.activePageClass ).length ||
					forceRemoval ) ) {

				$.mobile.activeClickedLink.removeClass( $.mobile.activeBtnClass );
			}
			$.mobile.activeClickedLink = null;
		},

		// DEPRECATED in 1.4
		// Find the closest parent with a theme class on it. Note that
		// we are not using $.fn.closest() on purpose here because this
		// method gets called quite a bit and we need it to be as fast
		// as possible.
		getInheritedTheme: function( el, defaultTheme ) {
			var e = el[ 0 ],
				ltr = "",
				re = /ui-(bar|body|overlay)-([a-z])\b/,
				c, m;
			while ( e ) {
				c = e.className || "";
				if ( c && ( m = re.exec( c ) ) && ( ltr = m[ 2 ] ) ) {
					// We found a parent with a theme class
					// on it so bail from this loop.
					break;
				}

				e = e.parentNode;
			}
			// Return the theme letter we found, if none, return the
			// specified default.
			return ltr || defaultTheme || "a";
		},

		enhanceable: function( elements ) {
			return this.haveParents( elements, "enhance" );
		},

		hijackable: function( elements ) {
			return this.haveParents( elements, "ajax" );
		},

		haveParents: function( elements, attr ) {
			if ( !$.mobile.ignoreContentEnabled ) {
				return elements;
			}

			var count = elements.length,
				$newSet = $(),
				e, $element, excluded,
				i, c;

			for ( i = 0; i < count; i++ ) {
				$element = elements.eq( i );
				excluded = false;
				e = elements[ i ];

				while ( e ) {
					c = e.getAttribute ? e.getAttribute( "data-" + $.mobile.ns + attr ) : "";

					if ( c === "false" ) {
						excluded = true;
						break;
					}

					e = e.parentNode;
				}

				if ( !excluded ) {
					$newSet = $newSet.add( $element );
				}
			}

			return $newSet;
		},

		getScreenHeight: function() {
			// Native innerHeight returns more accurate value for this across platforms,
			// jQuery version is here as a normalized fallback for platforms like Symbian
			return window.innerHeight || $.mobile.window.height();
		},

		//simply set the active page's minimum height to screen height, depending on orientation
		resetActivePageHeight: function( height ) {
			var page = $( "." + $.mobile.activePageClass ),
				pageHeight = page.height(),
				pageOuterHeight = page.outerHeight( true );

			height = compensateToolbars( page,
				( typeof height === "number" ) ? height : $.mobile.getScreenHeight() );

			// Remove any previous min-height setting
			page.css( "min-height", "" );

			// Set the minimum height only if the height as determined by CSS is insufficient
			if ( page.height() < height ) {
				page.css( "min-height", height - ( pageOuterHeight - pageHeight ) );
			}
		},

		loading: function() {
			// If this is the first call to this function, instantiate a loader widget
			var loader = this.loading._widget || $( $.mobile.loader.prototype.defaultHtml ).loader(),

				// Call the appropriate method on the loader
				returnValue = loader.loader.apply( loader, arguments );

			// Make sure the loader is retained for future calls to this function.
			this.loading._widget = loader;

			return returnValue;
		}
	});

	$.addDependents = function( elem, newDependents ) {
		var $elem = $( elem ),
			dependents = $elem.jqmData( "dependents" ) || $();

		$elem.jqmData( "dependents", $( dependents ).add( newDependents ) );
	};

	// plugins
	$.fn.extend({
		removeWithDependents: function() {
			$.removeWithDependents( this );
		},

		// Enhance child elements
		enhanceWithin: function() {
			var index,
				widgetElements = {},
				keepNative = $.mobile.page.prototype.keepNativeSelector(),
				that = this;

			// Add no js class to elements
			if ( $.mobile.nojs ) {
				$.mobile.nojs( this );
			}

			// Bind links for ajax nav
			if ( $.mobile.links ) {
				$.mobile.links( this );
			}

			// Degrade inputs for styleing
			if ( $.mobile.degradeInputsWithin ) {
				$.mobile.degradeInputsWithin( this );
			}

			// Run buttonmarkup
			if ( $.fn.buttonMarkup ) {
				this.find( $.fn.buttonMarkup.initSelector ).not( keepNative )
				.jqmEnhanceable().buttonMarkup();
			}

			// Add classes for fieldContain
			if ( $.fn.fieldcontain ) {
				this.find( ":jqmData(role='fieldcontain')" ).not( keepNative )
				.jqmEnhanceable().fieldcontain();
			}

			// Enhance widgets
			$.each( $.mobile.widgets, function( name, constructor ) {

				// If initSelector not false find elements
				if ( constructor.initSelector ) {

					// Filter elements that should not be enhanced based on parents
					var elements = $.mobile.enhanceable( that.find( constructor.initSelector ) );

					// If any matching elements remain filter ones with keepNativeSelector
					if ( elements.length > 0 ) {

						// $.mobile.page.prototype.keepNativeSelector is deprecated this is just for backcompat
						// Switch to $.mobile.keepNative in 1.5 which is just a value not a function
						elements = elements.not( keepNative );
					}

					// Enhance whatever is left
					if ( elements.length > 0 ) {
						widgetElements[ constructor.prototype.widgetName ] = elements;
					}
				}
			});

			for ( index in widgetElements ) {
				widgetElements[ index ][ index ]();
			}

			return this;
		},

		addDependents: function( newDependents ) {
			$.addDependents( this, newDependents );
		},

		// note that this helper doesn't attempt to handle the callback
		// or setting of an html element's text, its only purpose is
		// to return the html encoded version of the text in all cases. (thus the name)
		getEncodedText: function() {
			return $( "<a>" ).text( this.text() ).html();
		},

		// fluent helper function for the mobile namespaced equivalent
		jqmEnhanceable: function() {
			return $.mobile.enhanceable( this );
		},

		jqmHijackable: function() {
			return $.mobile.hijackable( this );
		}
	});

	$.removeWithDependents = function( nativeElement ) {
		var element = $( nativeElement );

		( element.jqmData( "dependents" ) || $() ).remove();
		element.remove();
	};
	$.addDependents = function( nativeElement, newDependents ) {
		var element = $( nativeElement ),
			dependents = element.jqmData( "dependents" ) || $();

		element.jqmData( "dependents", $( dependents ).add( newDependents ) );
	};

	$.find.matches = function( expr, set ) {
		return $.find( expr, null, null, set );
	};

	$.find.matchesSelector = function( node, expr ) {
		return $.find( expr, null, null, [ node ] ).length > 0;
	};

})( jQuery, this );



// buttonMarkup is deprecated as of 1.4.0 and will be removed in 1.5.0.

(function( $, undefined ) {

// General policy: Do not access data-* attributes except during enhancement.
// In all other cases we determine the state of the button exclusively from its
// className. That's why optionsToClasses expects a full complement of options,
// and the jQuery plugin completes the set of options from the default values.

// Map classes to buttonMarkup boolean options - used in classNameToOptions()
var reverseBoolOptionMap = {
		"ui-shadow" : "shadow",
		"ui-corner-all" : "corners",
		"ui-btn-inline" : "inline",
		"ui-shadow-icon" : "iconshadow", /* TODO: Remove in 1.5 */
		"ui-mini" : "mini"
	},
	getAttrFixed = function() {
		var ret = $.mobile.getAttribute.apply( this, arguments );

		return ( ret == null ? undefined : ret );
	},
	capitalLettersRE = /[A-Z]/g;

// optionsToClasses:
// @options: A complete set of options to convert to class names.
// @existingClasses: extra classes to add to the result
//
// Converts @options to buttonMarkup classes and returns the result as an array
// that can be converted to an element's className with .join( " " ). All
// possible options must be set inside @options. Use $.fn.buttonMarkup.defaults
// to get a complete set and use $.extend to override your choice of options
// from that set.
function optionsToClasses( options, existingClasses ) {
	var classes = existingClasses ? existingClasses : [];

	// Add classes to the array - first ui-btn
	classes.push( "ui-btn" );

	// If there is a theme
	if ( options.theme ) {
		classes.push( "ui-btn-" + options.theme );
	}

	// If there's an icon, add the icon-related classes
	if ( options.icon ) {
		classes = classes.concat([
			"ui-icon-" + options.icon,
			"ui-btn-icon-" + options.iconpos
		]);
		if ( options.iconshadow ) {
			classes.push( "ui-shadow-icon" ); /* TODO: Remove in 1.5 */
		}
	}

	// Add the appropriate class for each boolean option
	if ( options.inline ) {
		classes.push( "ui-btn-inline" );
	}
	if ( options.shadow ) {
		classes.push( "ui-shadow" );
	}
	if ( options.corners ) {
		classes.push( "ui-corner-all" );
	}
	if ( options.mini ) {
		classes.push( "ui-mini" );
	}

	// Create a string from the array and return it
	return classes;
}

// classNameToOptions:
// @classes: A string containing a .className-style space-separated class list
//
// Loops over @classes and calculates an options object based on the
// buttonMarkup-related classes it finds. It records unrecognized classes in an
// array.
//
// Returns: An object containing the following items:
//
// "options": buttonMarkup options found to be present because of the
// presence/absence of corresponding classes
//
// "unknownClasses": a string containing all the non-buttonMarkup-related
// classes found in @classes
//
// "alreadyEnhanced": A boolean indicating whether the ui-btn class was among
// those found to be present
function classNameToOptions( classes ) {
	var idx, map, unknownClass,
		alreadyEnhanced = false,
		noIcon = true,
		o = {
			icon: "",
			inline: false,
			shadow: false,
			corners: false,
			iconshadow: false,
			mini: false
		},
		unknownClasses = [];

	classes = classes.split( " " );

	// Loop over the classes
	for ( idx = 0 ; idx < classes.length ; idx++ ) {

		// Assume it's an unrecognized class
		unknownClass = true;

		// Recognize boolean options from the presence of classes
		map = reverseBoolOptionMap[ classes[ idx ] ];
		if ( map !== undefined ) {
			unknownClass = false;
			o[ map ] = true;

		// Recognize the presence of an icon and establish the icon position
		} else if ( classes[ idx ].indexOf( "ui-btn-icon-" ) === 0 ) {
			unknownClass = false;
			noIcon = false;
			o.iconpos = classes[ idx ].substring( 12 );

		// Establish which icon is present
		} else if ( classes[ idx ].indexOf( "ui-icon-" ) === 0 ) {
			unknownClass = false;
			o.icon = classes[ idx ].substring( 8 );

		// Establish the theme - this recognizes one-letter theme swatch names
		} else if ( classes[ idx ].indexOf( "ui-btn-" ) === 0 && classes[ idx ].length === 8 ) {
			unknownClass = false;
			o.theme = classes[ idx ].substring( 7 );

		// Recognize that this element has already been buttonMarkup-enhanced
		} else if ( classes[ idx ] === "ui-btn" ) {
			unknownClass = false;
			alreadyEnhanced = true;
		}

		// If this class has not been recognized, add it to the list
		if ( unknownClass ) {
			unknownClasses.push( classes[ idx ] );
		}
	}

	// If a "ui-btn-icon-*" icon position class is absent there cannot be an icon
	if ( noIcon ) {
		o.icon = "";
	}

	return {
		options: o,
		unknownClasses: unknownClasses,
		alreadyEnhanced: alreadyEnhanced
	};
}

function camelCase2Hyphenated( c ) {
	return "-" + c.toLowerCase();
}

// $.fn.buttonMarkup:
// DOM: gets/sets .className
//
// @options: options to apply to the elements in the jQuery object
// @overwriteClasses: boolean indicating whether to honour existing classes
//
// Calculates the classes to apply to the elements in the jQuery object based on
// the options passed in. If @overwriteClasses is true, it sets the className
// property of each element in the jQuery object to the buttonMarkup classes
// it calculates based on the options passed in.
//
// If you wish to preserve any classes that are already present on the elements
// inside the jQuery object, including buttonMarkup-related classes that were
// added by a previous call to $.fn.buttonMarkup() or during page enhancement
// then you should omit @overwriteClasses or set it to false.
$.fn.buttonMarkup = function( options, overwriteClasses ) {
	var idx, data, el, retrievedOptions, optionKey,
		defaults = $.fn.buttonMarkup.defaults;

	for ( idx = 0 ; idx < this.length ; idx++ ) {
		el = this[ idx ];
		data = overwriteClasses ?

			// Assume this element is not enhanced and ignore its classes
			{ alreadyEnhanced: false, unknownClasses: [] } :

			// Otherwise analyze existing classes to establish existing options and
			// classes
			classNameToOptions( el.className );

		retrievedOptions = $.extend( {},

			// If the element already has the class ui-btn, then we assume that
			// it has passed through buttonMarkup before - otherwise, the options
			// returned by classNameToOptions do not correctly reflect the state of
			// the element
			( data.alreadyEnhanced ? data.options : {} ),

			// Finally, apply the options passed in
			options );

		// If this is the first call on this element, retrieve remaining options
		// from the data-attributes
		if ( !data.alreadyEnhanced ) {
			for ( optionKey in defaults ) {
				if ( retrievedOptions[ optionKey ] === undefined ) {
					retrievedOptions[ optionKey ] = getAttrFixed( el,
						optionKey.replace( capitalLettersRE, camelCase2Hyphenated )
					);
				}
			}
		}

		el.className = optionsToClasses(

			// Merge all the options and apply them as classes
			$.extend( {},

				// The defaults form the basis
				defaults,

				// Add the computed options
				retrievedOptions
			),

			// ... and re-apply any unrecognized classes that were found
			data.unknownClasses ).join( " " );
		if ( el.tagName.toLowerCase() !== "button" ) {
			el.setAttribute( "role", "button" );
		}
	}

	return this;
};

// buttonMarkup defaults. This must be a complete set, i.e., a value must be
// given here for all recognized options
$.fn.buttonMarkup.defaults = {
	icon: "",
	iconpos: "left",
	theme: null,
	inline: false,
	shadow: true,
	corners: true,
	iconshadow: false, /* TODO: Remove in 1.5. Option deprecated in 1.4. */
	mini: false
};

$.extend( $.fn.buttonMarkup, {
	initSelector: "a:jqmData(role='button'), .ui-bar > a, .ui-bar > :jqmData(role='controlgroup') > a, button:not(:jqmData(role='navbar') button)"
});

})( jQuery );


/*!
 * jQuery UI Widget c0ab71056b936627e8a7821f03c044aec6280a40
 * http://jqueryui.com
 *
 * Copyright 2013 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/jQuery.widget/
 */
(function( $, undefined ) {

var uuid = 0,
	slice = Array.prototype.slice,
	_cleanData = $.cleanData;
$.cleanData = function( elems ) {
	for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
		try {
			$( elem ).triggerHandler( "remove" );
		// http://bugs.jquery.com/ticket/8235
		} catch( e ) {}
	}
	_cleanData( elems );
};

$.widget = function( name, base, prototype ) {
	var fullName, existingConstructor, constructor, basePrototype,
		// proxiedPrototype allows the provided prototype to remain unmodified
		// so that it can be used as a mixin for multiple widgets (#8876)
		proxiedPrototype = {},
		namespace = name.split( "." )[ 0 ];

	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;

	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	// create selector for plugin
	$.expr[ ":" ][ fullName.toLowerCase() ] = function( elem ) {
		return !!$.data( elem, fullName );
	};

	$[ namespace ] = $[ namespace ] || {};
	existingConstructor = $[ namespace ][ name ];
	constructor = $[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without "new" keyword
		if ( !this._createWidget ) {
			return new constructor( options, element );
		}

		// allow instantiation without initializing for simple inheritance
		// must use "new" keyword (the code above always passes args)
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};
	// extend with the existing constructor to carry over any static properties
	$.extend( constructor, existingConstructor, {
		version: prototype.version,
		// copy the object used to create the prototype in case we need to
		// redefine the widget later
		_proto: $.extend( {}, prototype ),
		// track widgets that inherit from this widget in case this widget is
		// redefined after a widget inherits from it
		_childConstructors: []
	});

	basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	basePrototype.options = $.widget.extend( {}, basePrototype.options );
	$.each( prototype, function( prop, value ) {
		if ( !$.isFunction( value ) ) {
			proxiedPrototype[ prop ] = value;
			return;
		}
		proxiedPrototype[ prop ] = (function() {
			var _super = function() {
					return base.prototype[ prop ].apply( this, arguments );
				},
				_superApply = function( args ) {
					return base.prototype[ prop ].apply( this, args );
				};
			return function() {
				var __super = this._super,
					__superApply = this._superApply,
					returnValue;

				this._super = _super;
				this._superApply = _superApply;

				returnValue = value.apply( this, arguments );

				this._super = __super;
				this._superApply = __superApply;

				return returnValue;
			};
		})();
	});
	constructor.prototype = $.widget.extend( basePrototype, {
		// TODO: remove support for widgetEventPrefix
		// always use the name + a colon as the prefix, e.g., draggable:start
		// don't prefix for widgets that aren't DOM-based
		widgetEventPrefix: existingConstructor ? (basePrototype.widgetEventPrefix || name) : name
	}, proxiedPrototype, {
		constructor: constructor,
		namespace: namespace,
		widgetName: name,
		widgetFullName: fullName
	});

	// If this widget is being redefined then we need to find all widgets that
	// are inheriting from it and redefine all of them so that they inherit from
	// the new version of this widget. We're essentially trying to replace one
	// level in the prototype chain.
	if ( existingConstructor ) {
		$.each( existingConstructor._childConstructors, function( i, child ) {
			var childPrototype = child.prototype;

			// redefine the child widget using the same prototype that was
			// originally used, but inherit from the new version of the base
			$.widget( childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto );
		});
		// remove the list of existing child constructors from the old constructor
		// so the old child constructors can be garbage collected
		delete existingConstructor._childConstructors;
	} else {
		base._childConstructors.push( constructor );
	}

	$.widget.bridge( name, constructor );

	return constructor;
};

$.widget.extend = function( target ) {
	var input = slice.call( arguments, 1 ),
		inputIndex = 0,
		inputLength = input.length,
		key,
		value;
	for ( ; inputIndex < inputLength; inputIndex++ ) {
		for ( key in input[ inputIndex ] ) {
			value = input[ inputIndex ][ key ];
			if ( input[ inputIndex ].hasOwnProperty( key ) && value !== undefined ) {
				// Clone objects
				if ( $.isPlainObject( value ) ) {
					target[ key ] = $.isPlainObject( target[ key ] ) ?
						$.widget.extend( {}, target[ key ], value ) :
						// Don't extend strings, arrays, etc. with objects
						$.widget.extend( {}, value );
				// Copy everything else by reference
				} else {
					target[ key ] = value;
				}
			}
		}
	}
	return target;
};

$.widget.bridge = function( name, object ) {
	var fullName = object.prototype.widgetFullName || name;
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = slice.call( arguments, 1 ),
			returnValue = this;

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.widget.extend.apply( null, [ options ].concat(args) ) :
			options;

		if ( isMethodCall ) {
			this.each(function() {
				var methodValue,
					instance = $.data( this, fullName );
				if ( options === "instance" ) {
					returnValue = instance;
					return false;
				}
				if ( !instance ) {
					return $.error( "cannot call methods on " + name + " prior to initialization; " +
						"attempted to call method '" + options + "'" );
				}
				if ( !$.isFunction( instance[options] ) || options.charAt( 0 ) === "_" ) {
					return $.error( "no such method '" + options + "' for " + name + " widget instance" );
				}
				methodValue = instance[ options ].apply( instance, args );
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue && methodValue.jquery ?
						returnValue.pushStack( methodValue.get() ) :
						methodValue;
					return false;
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, fullName );
				if ( instance ) {
					instance.option( options || {} )._init();
				} else {
					$.data( this, fullName, new object( options, this ) );
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( /* options, element */ ) {};
$.Widget._childConstructors = [];

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	defaultElement: "<div>",
	options: {
		disabled: false,

		// callbacks
		create: null
	},
	_createWidget: function( options, element ) {
		element = $( element || this.defaultElement || this )[ 0 ];
		this.element = $( element );
		this.uuid = uuid++;
		this.eventNamespace = "." + this.widgetName + this.uuid;
		this.options = $.widget.extend( {},
			this.options,
			this._getCreateOptions(),
			options );

		this.bindings = $();
		this.hoverable = $();
		this.focusable = $();

		if ( element !== this ) {
			$.data( element, this.widgetFullName, this );
			this._on( true, this.element, {
				remove: function( event ) {
					if ( event.target === element ) {
						this.destroy();
					}
				}
			});
			this.document = $( element.style ?
				// element within the document
				element.ownerDocument :
				// element is window or document
				element.document || element );
			this.window = $( this.document[0].defaultView || this.document[0].parentWindow );
		}

		this._create();
		this._trigger( "create", null, this._getCreateEventData() );
		this._init();
	},
	_getCreateOptions: $.noop,
	_getCreateEventData: $.noop,
	_create: $.noop,
	_init: $.noop,

	destroy: function() {
		this._destroy();
		// we can probably remove the unbind calls in 2.0
		// all event bindings should go through this._on()
		this.element
			.unbind( this.eventNamespace )
			.removeData( this.widgetFullName )
			// support: jquery <1.6.3
			// http://bugs.jquery.com/ticket/9413
			.removeData( $.camelCase( this.widgetFullName ) );
		this.widget()
			.unbind( this.eventNamespace )
			.removeAttr( "aria-disabled" )
			.removeClass(
				this.widgetFullName + "-disabled " +
				"ui-state-disabled" );

		// clean up events and states
		this.bindings.unbind( this.eventNamespace );
		this.hoverable.removeClass( "ui-state-hover" );
		this.focusable.removeClass( "ui-state-focus" );
	},
	_destroy: $.noop,

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			parts,
			curOption,
			i;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.widget.extend( {}, this.options );
		}

		if ( typeof key === "string" ) {
			// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
			options = {};
			parts = key.split( "." );
			key = parts.shift();
			if ( parts.length ) {
				curOption = options[ key ] = $.widget.extend( {}, this.options[ key ] );
				for ( i = 0; i < parts.length - 1; i++ ) {
					curOption[ parts[ i ] ] = curOption[ parts[ i ] ] || {};
					curOption = curOption[ parts[ i ] ];
				}
				key = parts.pop();
				if ( value === undefined ) {
					return curOption[ key ] === undefined ? null : curOption[ key ];
				}
				curOption[ key ] = value;
			} else {
				if ( value === undefined ) {
					return this.options[ key ] === undefined ? null : this.options[ key ];
				}
				options[ key ] = value;
			}
		}

		this._setOptions( options );

		return this;
	},
	_setOptions: function( options ) {
		var key;

		for ( key in options ) {
			this._setOption( key, options[ key ] );
		}

		return this;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;

		if ( key === "disabled" ) {
			this.widget()
				.toggleClass( this.widgetFullName + "-disabled", !!value );
			this.hoverable.removeClass( "ui-state-hover" );
			this.focusable.removeClass( "ui-state-focus" );
		}

		return this;
	},

	enable: function() {
		return this._setOptions({ disabled: false });
	},
	disable: function() {
		return this._setOptions({ disabled: true });
	},

	_on: function( suppressDisabledCheck, element, handlers ) {
		var delegateElement,
			instance = this;

		// no suppressDisabledCheck flag, shuffle arguments
		if ( typeof suppressDisabledCheck !== "boolean" ) {
			handlers = element;
			element = suppressDisabledCheck;
			suppressDisabledCheck = false;
		}

		// no element argument, shuffle and use this.element
		if ( !handlers ) {
			handlers = element;
			element = this.element;
			delegateElement = this.widget();
		} else {
			// accept selectors, DOM elements
			element = delegateElement = $( element );
			this.bindings = this.bindings.add( element );
		}

		$.each( handlers, function( event, handler ) {
			function handlerProxy() {
				// allow widgets to customize the disabled handling
				// - disabled as an array instead of boolean
				// - disabled class as method for disabling individual parts
				if ( !suppressDisabledCheck &&
						( instance.options.disabled === true ||
							$( this ).hasClass( "ui-state-disabled" ) ) ) {
					return;
				}
				return ( typeof handler === "string" ? instance[ handler ] : handler )
					.apply( instance, arguments );
			}

			// copy the guid so direct unbinding works
			if ( typeof handler !== "string" ) {
				handlerProxy.guid = handler.guid =
					handler.guid || handlerProxy.guid || $.guid++;
			}

			var match = event.match( /^(\w+)\s*(.*)$/ ),
				eventName = match[1] + instance.eventNamespace,
				selector = match[2];
			if ( selector ) {
				delegateElement.delegate( selector, eventName, handlerProxy );
			} else {
				element.bind( eventName, handlerProxy );
			}
		});
	},

	_off: function( element, eventName ) {
		eventName = (eventName || "").split( " " ).join( this.eventNamespace + " " ) + this.eventNamespace;
		element.unbind( eventName ).undelegate( eventName );
	},

	_delay: function( handler, delay ) {
		function handlerProxy() {
			return ( typeof handler === "string" ? instance[ handler ] : handler )
				.apply( instance, arguments );
		}
		var instance = this;
		return setTimeout( handlerProxy, delay || 0 );
	},

	_hoverable: function( element ) {
		this.hoverable = this.hoverable.add( element );
		this._on( element, {
			mouseenter: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-hover" );
			},
			mouseleave: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-hover" );
			}
		});
	},

	_focusable: function( element ) {
		this.focusable = this.focusable.add( element );
		this._on( element, {
			focusin: function( event ) {
				$( event.currentTarget ).addClass( "ui-state-focus" );
			},
			focusout: function( event ) {
				$( event.currentTarget ).removeClass( "ui-state-focus" );
			}
		});
	},

	_trigger: function( type, event, data ) {
		var prop, orig,
			callback = this.options[ type ];

		data = data || {};
		event = $.Event( event );
		event.type = ( type === this.widgetEventPrefix ?
			type :
			this.widgetEventPrefix + type ).toLowerCase();
		// the original event may come from any element
		// so we need to reset the target on the new event
		event.target = this.element[ 0 ];

		// copy original event properties over to the new event
		orig = event.originalEvent;
		if ( orig ) {
			for ( prop in orig ) {
				if ( !( prop in event ) ) {
					event[ prop ] = orig[ prop ];
				}
			}
		}

		this.element.trigger( event, data );
		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], [ event ].concat( data ) ) === false ||
			event.isDefaultPrevented() );
	}
};

$.each( { show: "fadeIn", hide: "fadeOut" }, function( method, defaultEffect ) {
	$.Widget.prototype[ "_" + method ] = function( element, options, callback ) {
		if ( typeof options === "string" ) {
			options = { effect: options };
		}
		var hasOptions,
			effectName = !options ?
				method :
				options === true || typeof options === "number" ?
					defaultEffect :
					options.effect || defaultEffect;
		options = options || {};
		if ( typeof options === "number" ) {
			options = { duration: options };
		}
		hasOptions = !$.isEmptyObject( options );
		options.complete = callback;
		if ( options.delay ) {
			element.delay( options.delay );
		}
		if ( hasOptions && $.effects && $.effects.effect[ effectName ] ) {
			element[ method ]( options );
		} else if ( effectName !== method && element[ effectName ] ) {
			element[ effectName ]( options.duration, options.easing, callback );
		} else {
			element.queue(function( next ) {
				$( this )[ method ]();
				if ( callback ) {
					callback.call( element[ 0 ] );
				}
				next();
			});
		}
	};
});

})( jQuery );

(function( $, undefined ) {

var rcapitals = /[A-Z]/g,
	replaceFunction = function( c ) {
		return "-" + c.toLowerCase();
	};

$.extend( $.Widget.prototype, {
	_getCreateOptions: function() {
		var option, value,
			elem = this.element[ 0 ],
			options = {};

		//
		if ( !$.mobile.getAttribute( elem, "defaults" ) ) {
			for ( option in this.options ) {
				value = $.mobile.getAttribute( elem, option.replace( rcapitals, replaceFunction ) );

				if ( value != null ) {
					options[ option ] = value;
				}
			}
		}

		return options;
	}
});

//TODO: Remove in 1.5 for backcompat only
$.mobile.widget = $.Widget;

})( jQuery );

(function( $, undefined ) {
$.mobile.widgets = {};

var originalWidget = $.widget,

	// Record the original, non-mobileinit-modified version of $.mobile.keepNative
	// so we can later determine whether someone has modified $.mobile.keepNative
	keepNativeFactoryDefault = $.mobile.keepNative;

$.widget = (function( orig ) {
	return function() {
		var constructor = orig.apply( this, arguments ),
			name = constructor.prototype.widgetName;

		constructor.initSelector = ( ( constructor.prototype.initSelector !== undefined ) ?
			constructor.prototype.initSelector : ":jqmData(role='" + name + "')" );

		$.mobile.widgets[ name ] = constructor;

		return constructor;
	};
})( $.widget );

// Make sure $.widget still has bridge and extend methods
$.extend( $.widget, originalWidget );

// For backcompat remove in 1.5
$.mobile.document.on( "create", function( event ) {
	$( event.target ).enhanceWithin();
});

$.widget( "mobile.page", {
	options: {
		theme: "a",
		domCache: false,

		// Deprecated in 1.4 remove in 1.5
		keepNativeDefault: $.mobile.keepNative,

		// Deprecated in 1.4 remove in 1.5
		contentTheme: null,
		enhanced: false
	},

	// DEPRECATED for > 1.4
	// TODO remove at 1.5
	_createWidget: function() {
		$.Widget.prototype._createWidget.apply( this, arguments );
		this._trigger( "init" );
	},

	_create: function() {
		// If false is returned by the callbacks do not create the page
		if ( this._trigger( "beforecreate" ) === false ) {
			return false;
		}

		if ( !this.options.enhanced ) {
			this._enhance();
		}

		this._on( this.element, {
			pagebeforehide: "removeContainerBackground",
			pagebeforeshow: "_handlePageBeforeShow"
		});

		this.element.enhanceWithin();
		// Dialog widget is deprecated in 1.4 remove this in 1.5
		if ( $.mobile.getAttribute( this.element[0], "role" ) === "dialog" && $.mobile.dialog ) {
			this.element.dialog();
		}
	},

	_enhance: function () {
		var attrPrefix = "data-" + $.mobile.ns,
			self = this;

		if ( this.options.role ) {
			this.element.attr( "data-" + $.mobile.ns + "role", this.options.role );
		}

		this.element
			.attr( "tabindex", "0" )
			.addClass( "ui-page ui-page-theme-" + this.options.theme );

		// Manipulation of content os Deprecated as of 1.4 remove in 1.5
		this.element.find( "[" + attrPrefix + "role='content']" ).each( function() {
			var $this = $( this ),
				theme = this.getAttribute( attrPrefix + "theme" ) || undefined;
				self.options.contentTheme = theme || self.options.contentTheme || ( self.options.dialog && self.options.theme ) || ( self.element.jqmData("role") === "dialog" &&  self.options.theme );
				$this.addClass( "ui-content" );
				if ( self.options.contentTheme ) {
					$this.addClass( "ui-body-" + ( self.options.contentTheme ) );
				}
				// Add ARIA role
				$this.attr( "role", "main" ).addClass( "ui-content" );
		});
	},

	bindRemove: function( callback ) {
		var page = this.element;

		// when dom caching is not enabled or the page is embedded bind to remove the page on hide
		if ( !page.data( "mobile-page" ).options.domCache &&
			page.is( ":jqmData(external-page='true')" ) ) {

			// TODO use _on - that is, sort out why it doesn't work in this case
			page.bind( "pagehide.remove", callback || function( e, data ) {

				//check if this is a same page transition and if so don't remove the page
				if( !data.samePage ){
					var $this = $( this ),
						prEvent = new $.Event( "pageremove" );

					$this.trigger( prEvent );

					if ( !prEvent.isDefaultPrevented() ) {
						$this.removeWithDependents();
					}
				}
			});
		}
	},

	_setOptions: function( o ) {
		if ( o.theme !== undefined ) {
			this.element.removeClass( "ui-page-theme-" + this.options.theme ).addClass( "ui-page-theme-" + o.theme );
		}

		if ( o.contentTheme !== undefined ) {
			this.element.find( "[data-" + $.mobile.ns + "='content']" ).removeClass( "ui-body-" + this.options.contentTheme )
				.addClass( "ui-body-" + o.contentTheme );
		}
	},

	_handlePageBeforeShow: function(/* e */) {
		this.setContainerBackground();
	},
	// Deprecated in 1.4 remove in 1.5
	removeContainerBackground: function() {
		this.element.closest( ":mobile-pagecontainer" ).pagecontainer({ "theme": "none" });
	},
	// Deprecated in 1.4 remove in 1.5
	// set the page container background to the page theme
	setContainerBackground: function( theme ) {
		this.element.parent().pagecontainer( { "theme": theme || this.options.theme } );
	},
	// Deprecated in 1.4 remove in 1.5
	keepNativeSelector: function() {
		var options = this.options,
			keepNative = $.trim( options.keepNative || "" ),
			globalValue = $.trim( $.mobile.keepNative ),
			optionValue = $.trim( options.keepNativeDefault ),

			// Check if $.mobile.keepNative has changed from the factory default
			newDefault = ( keepNativeFactoryDefault === globalValue ?
				"" : globalValue ),

			// If $.mobile.keepNative has not changed, use options.keepNativeDefault
			oldDefault = ( newDefault === "" ? optionValue : "" );

		// Concatenate keepNative selectors from all sources where the value has
		// changed or, if nothing has changed, return the default
		return ( ( keepNative ? [ keepNative ] : [] )
			.concat( newDefault ? [ newDefault ] : [] )
			.concat( oldDefault ? [ oldDefault ] : [] )
			.join( ", " ) );
	}
});
})( jQuery );


}));
