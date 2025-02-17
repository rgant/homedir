// ==UserScript==
// @name        Fix Hacker News
// @description Open articles and comments pages in new tabs.
// @namespace   name.robgant
// @include     https://news.ycombinator.com/*
// @grant       GM.openInTab
// ==/UserScript==
'use strict';

document.querySelectorAll('.titleline a, .subline a:not([class])').forEach(el => {
  el.setAttribute('target', '_blank');
});
