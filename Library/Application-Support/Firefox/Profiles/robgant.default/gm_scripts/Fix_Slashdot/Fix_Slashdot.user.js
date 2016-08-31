// ==UserScript==
// @name        Fix Slashdot
// @description Hides some annoying elements
// @namespace   name.robgant
// @include     http://*.slashdot.org/story/*
// @include     http://slashdot.org/story/*
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle('.main-content {margin-right: 0 !important;}')

var sn_el = document.getElementById('sitenotice'),
    as_el = document.querySelector('#firehose aside');

if (sn_el) {
    sn_el.parentNode.removeChild(sn_el);
}

if (as_el) {
    as_el.parentNode.removeChild(as_el);
}