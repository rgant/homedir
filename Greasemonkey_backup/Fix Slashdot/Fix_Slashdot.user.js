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

let head = document.getElementsByTagName('head')[0];
if (head) {
  let style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = '.main-content {margin-right: 0 !important;}.banner-wrapper, .view_mode, .adwrap {display: none !important;}';
  head.appendChild(style);
}

var an_el = document.getElementById('announcement'),
    cm_el = document.getElementById('comments');

if (an_el) {
    an_el.parentNode.removeChild(an_el);
}

if (cm_el) {
    cm_el.style.marginRight = '0';
}

if (sp_el) {
    sp_el.style.display = 'none';
}
