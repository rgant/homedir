// ==UserScript==
// @name        Block In Page JavaScript
// @description Prevents all scripts from executing.
// @namespace   name.robgant
// @include     http://www.msn.com/*
// @include     http://www.usatoday.com/*
// @include     https://www.msn.com/*
// @include     https://www.usatoday.com/*
// @include     http://nymag.com/*
// @grant       none
// @run-at         document-start
// ==/UserScript==

window.addEventListener('beforescriptexecute', function(e) {
  e.stopPropagation();
  e.preventDefault();
}, true);