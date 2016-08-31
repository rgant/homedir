// ==UserScript==
// @name        Block MSN JavaScript
// @description Prevents all scripts from executing.
// @namespace   name.robgant
// @include     http://www.msn.com/*
// @grant       none
// @run-at         document-start
// ==/UserScript==

window.addEventListener('beforescriptexecute', function(e) {
  e.stopPropagation();
  e.preventDefault();
}, true);