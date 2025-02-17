// ==UserScript==
// @name           Wired Fixes
// @namespace      robgant.name
// @description    Make headers static instead of position fixed.
// @include        https://www.wired.com/*
// @run-at         document-start
// @grant          none
// ==/UserScript==
'use strict';

const head = document.getElementsByTagName('head')[0];
if (head) {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.id = 'ROB-SCRIPT';
  style.textContent = [
    '#global-header, .persistent-top { position:static !important; }',
    '.responsive-asset { opacity: 1 !important; }',
  ].join(' ');
  head.appendChild(style);
} else {
  console.error('FAILED TO FIND HEAD!');
}
