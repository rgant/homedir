// ==UserScript==
// @name           Remove UTM
// @namespace      robgant.name
// @description    Removes the UTM Tracking garbage from URLs
// @include        *
// @run-at         document-start
// @grant          none
// ==/UserScript==

var loc = window.location.toString();
if (loc.indexOf('utm_source=') !== -1) {
	window.location.replace(loc.replace(/utm_\w+=[^&#]+&?/g, '').replace(/\?(?=$|#)/, ''));
}
