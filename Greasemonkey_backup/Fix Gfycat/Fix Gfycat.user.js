// ==UserScript==
// @name       Fix Gfycat
// @namespace  robgant.name
// @include    https://gfycat.com/*
// @grant      none
// ==/UserScript==
'use strict';

window.addEventListener('load', () => {
  // Don't autoplay related gifs
  const el = document.querySelector('.upnext-control input[type="checkbox"]');
  if (el) {
    el.click();
    el.checked = false;
  }
});
