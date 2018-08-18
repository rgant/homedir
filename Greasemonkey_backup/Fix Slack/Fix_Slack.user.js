// ==UserScript==
// @name        Fix Slack
// @namespace   name.robgant
// @description Don't let Slack steal my keyboard shortcuts
// @include     https://*.slack.com/messages/*/
// @grant       none
// ==/UserScript==

document.addEventListener('keydown', function(evt){
	if (evt.metaKey) {
	   evt.stopPropagation();
	}
}, true);
