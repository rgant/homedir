// ==UserScript==
// @name        Fix Slashdot
// @description Hides some annoying elements
// @namespace   name.robgant
// @include     http://*.slashdot.org/story/*
// @include     http://slashdot.org/story/*
// @include     https://*.slashdot.org/story/*
// @include     https://slashdot.org/story/*
// @grant       none
// ==/UserScript==
'use strict';

const head = document.getElementsByTagName('head')[0];
if (head) {
  const style = document.createElement('style');
  style.textContent = '.main-content {margin-right: 0 !important;}'
    + '.banner-wrapper, .view_mode, .adwrap {display: none !important;}';
  head.appendChild(style);
}

const anEl = document.getElementById('announcement');
const cmEl = document.getElementById('comments');

if (anEl) {
  anEl.parentNode.removeChild(anEl);
}

if (cmEl) {
  cmEl.style.marginRight = '0';
}
