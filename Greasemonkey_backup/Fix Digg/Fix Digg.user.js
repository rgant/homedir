// ==UserScript==
// @name     Fix Digg
// @namespace  robgant.name
// @include    https://digg.com/*
// @grant    none
// ==/UserScript==

const head = document.getElementsByTagName('head')[0];
if (head) {
  const style = document.createElement('style');
  style.textContent = '.desktop-wrapper.has-header-banner {margin-top: 0 !important;}header.fixed {position: static !important;}';
  head.appendChild(style);
}
