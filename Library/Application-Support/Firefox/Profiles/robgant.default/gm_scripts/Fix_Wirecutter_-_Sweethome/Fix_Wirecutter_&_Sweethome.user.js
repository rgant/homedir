// ==UserScript==
// @name        Fix Wirecutter & Sweethome
// @namespace   name.robgant
// @description Fix lazy loaded images
// @include     http://thesweethome.com/*
// @include     http://wirecutter.com/*
// @grant       none
// ==/UserScript==

Array.forEach(
  document.querySelectorAll('img[data-lazy-src]')
  ,function(el) {
    var url = el.getAttribute('data-lazy-src');
    el.src = url;
  }
);
