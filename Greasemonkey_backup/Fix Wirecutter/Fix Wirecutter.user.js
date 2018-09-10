// ==UserScript==
// @name     Fix Wirecutter
// @version  1
// @include  https://thewirecutter.com/*
// @grant    none
// ==/UserScript==

let head = document.getElementsByTagName('head')[0];
if (head) {
  let style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = '.sticky-header-active .site-header .desktop-header {position: static !important;}';
  head.appendChild(style);
}
