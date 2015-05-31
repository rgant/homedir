// ==UserScript==
// @name           Wired View All Fix
// @namespace      robgant.name
// @description    Deslide galleries
// @include        http://www.wired.com/*/*/*/
// @run-at         document-start
// @grant          none
// ==/UserScript==

if (document.getElementsByClassName('gallery-wrap').length) {
	window.location = "http://deslide.clusterfake.net/?o=html_table&u=" + encodeURIComponent(window.location.href);
}
