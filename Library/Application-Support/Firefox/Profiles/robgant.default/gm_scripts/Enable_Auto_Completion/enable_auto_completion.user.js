// ==UserScript==
// @name        Fix Most Pages
// @namespace   robgant.name
// @description Enable autocomplete, sanitize password inputs, disable _gaq links, fix youtube embeds.
// @include     *
// @grant       none
// ==/UserScript==

// Enable Autocompletion where turned off
Array.forEach(
	document.querySelectorAll("*[autocomplete=off]")
	,function(el) {
		el.removeAttribute("autocomplete");
	}
);

// Make password inputs sane
var rtnfls_re = new RegExp("^ *(javascript: *)?return +false;? *$");
Array.forEach(
	document.querySelectorAll("input[type=password]")
	,function(el) {
		// Remove the readonly attribute used by some banks GUI keyboards
		if (el.getAttribute("readonly")) {
			el.removeAttribute("readonly");
		}

		var evts = ['contextmenu', 'copy', 'cut', 'dragend', 'dragover', 'dragstart', 'drop', 'input', 'keydown', 'keypress', 'keyup', 'paste'],
			i = evts.length-1,
			attr;

		// Loop through the list of events and remove any of them that are set to just return false
		for (; i>=0; i--) {
			attr = 'on'+evts[i];
			if ( rtnfls_re.test( el.getAttribute(attr) ) ) {
				el.removeAttribute(attr);
			}
		}
	}
);

// Make _gaq click links work when GA isn't loaded.
Array.forEach(
	document.querySelectorAll("a[onclick^=_gaq]")
  ,function(el) {
    el.removeAttribute("onclick");
  }
);

// Show Info so I can add to Watch Later on YouTube Player
Array.forEach(
	window.document.querySelectorAll('iframe[src^="https://www.youtube.com/embed/"], iframe[src^="http://www.youtube.com/embed/"]'),
	function(el){
		if (el.src && el.src.indexOf('showinfo=0') >= 0) {
			el.src = el.src.replace('showinfo=0', 'showinfo=1');
		}
	}
);
