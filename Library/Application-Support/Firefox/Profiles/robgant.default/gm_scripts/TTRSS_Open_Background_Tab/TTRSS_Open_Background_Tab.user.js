// ==UserScript==
// @name        TTRSS Open Background Tab
// @namespace   name.robgant.slashdot
// @description Adds keyboard shortcut to open article in a new background tab
// @include     https://rss.wh0rd.org/
// @include     https://rss.wh0rd.org/#f*
// @include     https://rss.wh0rd.org/index.php*
// @grant       GM_openInTab
// ==/UserScript==

document.addEventListener('keydown', function(evt){
	if (evt.which == 59) {
		var headlines_el = document.getElementById('headlines-frame');
		if (headlines_el) {
			var entry_el = headlines_el.getElementsByClassName('Selected').item(0);
			if (entry_el) {
			    var lnk = entry_el.getElementsByClassName('title').item(0);
			    if (lnk) {
    				evt.stopPropagation();
    				evt.preventDefault();
    				var tab = GM_openInTab(lnk.href, true);
    			}
			}
		}
	} else if (evt.metaKey) {
	   evt.stopPropagation();
	}
}, true);
