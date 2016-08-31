// ==UserScript==
// @name        Fix Most Pages
// @namespace   robgant.name
// @description Enable autocomplete, sanitize password inputs, disable _gaq links, disable video & audio autoplay, fix youtube embeds. 
// @include     *
// @grant       none
// ==/UserScript==

// Enable Autocompletion where turned off

function sanitize_page() {
	Array.forEach(
		document.querySelectorAll("*[autocomplete=off]")
		,function(el) {
			if (el.id != "lst-ib") {
				el.removeAttribute("autocomplete");
			}
		}
	);

	// Enable spell checking where turned off
	Array.forEach(
		document.querySelectorAll("*[spellcheck=false]")
		,function(el) {
			console.log('spellcheck', el)
			el.removeAttribute("spellcheck");
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

	// Try to make HTML5 video and audio not autoplay
	// Array.forEach(
	// 	document.querySelectorAll("video, audio")
	// 	,function(el) {
	// 		el.setAttribute('autoplay', false);
	// 		el.setAttribute('preload', 'none');
	// 	}
	// );
	// Array.forEach(
	// 	document.querySelectorAll('iframe[src*="autoplay="]')
	// 	,function(el) {
	// // http://www.denverpost.com treats any value (even 0) of the autoplay parameter as a true.
	// // 		var s = el.src.replace(/autoplay=1/, 'autoplay=0');
	// // 		s = s.replace(/autoplay=true/, 'autoplay=false');
	// // 		s = s.replace(/autoplay=t/, 'autoplay=f');
	// // 		s = s.replace(/autoplay=[^0f][^&]*/, 'autoplay=');
	// 		el.src = el.src.replace(/autoplay=[^&]+/, 'autoplay=');
	// 	}
	// );

	// Show Info so I can add to Watch Later on YouTube Player
	Array.forEach(
		window.document.querySelectorAll('iframe[src^="https://www.youtube.com/embed/"], iframe[src^="http://www.youtube.com/embed/"]'),
		function(el){
			if (el.src && el.src.indexOf('showinfo=0') >= 0) {
				el.src = el.src.replace('showinfo=0', 'showinfo=1');
			}
		}
	);
}

sanitize_page();
window.addEventListener("load", sanitize_page, false);