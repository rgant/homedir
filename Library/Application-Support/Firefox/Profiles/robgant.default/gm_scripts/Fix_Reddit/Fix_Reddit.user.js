// ==UserScript==
// @name        Fix Reddit
// @description Open articles and comments pages in new tabs
// @namespace   name.robgant
// @include     https://www.reddit.com/*
// @grant       none
// ==/UserScript==

Array.forEach(
	document.querySelectorAll('a[class~=title],a[class~=comments]')
  ,function(el) {
    el.setAttribute('target', '_blank');
  }
);
