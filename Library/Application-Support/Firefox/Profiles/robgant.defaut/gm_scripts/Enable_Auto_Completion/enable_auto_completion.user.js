// ==UserScript==
// @name        Enable Auto Completion
// @namespace   robgant.name
// @description Allow Autocompletion on all elements
// @include     *
// @grant       none
// ==/UserScript==

Array.forEach(
	document.querySelectorAll("*[autocomplete]")
	,function(el) {
		el.removeAttribute("autocomplete");
	}
);

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
