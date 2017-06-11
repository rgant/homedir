// ==UserScript==
// @name        Fix Slashdot
// @description Hides some annoying elements
// @namespace   name.robgant
// @include     http://*.slashdot.org/story/*
// @include     http://slashdot.org/story/*
// @include     https://*.slashdot.org/story/*
// @include     https://slashdot.org/story/*
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle('.main-content {margin-right: 0 !important;}');
GM_addStyle('.banner-wrapper, .view_mode, .adwrap {display: none !important;}');

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
