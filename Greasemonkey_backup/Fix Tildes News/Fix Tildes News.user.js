// ==UserScript==
// @name        Fix Tildes News
// @description Open articles and comments pages in new tabs.
// @namespace   name.robgant
// @include     https://tildes.net/*
// @grant       GM.openInTab
// ==/UserScript==
'use strict';

document.querySelectorAll('.topic-title a, .topic-info-comments a').forEach(el => {
  el.setAttribute('target', '_blank');
});
