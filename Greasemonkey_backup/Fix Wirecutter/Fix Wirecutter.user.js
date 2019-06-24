// ==UserScript==
// @name     Fix Wirecutter
// @version  1
// @include  https://thewirecutter.com/*
// @grant    none
// ==/UserScript==
'use strict';

const head = document.getElementsByTagName('head')[0];
if (head) {
  const style = document.createElement('style');
  style.textContent = '.d762f6d8, ._03c602da, ._657ba766, ._47c4da54 {display: none !important;}';
  head.appendChild(style);
}
