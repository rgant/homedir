// ==UserScript==
// @name           Wired View All Fix
// @namespace      robgant.name
// @description    Displays articles on Wired unpaginated.
// @include        http://www.wired.com/*/*/*/
// @run-at         document-start
// @grant          none
// ==/UserScript==

/*
Array.forEach(
	document.querySelectorAll('a[href$="/all/"]')
	,function(lnk) {
		if (lnk.textContent == "View All") {
			window.location.replace(lnk.href);
		}
	}
);

Array.forEach(
	document.querySelectorAll('a[href$="viewall=true"]')
	,function(lnk) {
		if (lnk.textContent == "View all") {
			window.location.replace(lnk.href);
		}
	}
);
*/

if (document.getElementsByClassName('gallery-wrap').length) {
	window.location = "http://deslide.clusterfake.net/?o=html_table&u=" + encodeURIComponent(window.location.href);
}