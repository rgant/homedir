// ==UserScript==
// @name        Remove Amazon tracking info.
// @description Removes the tracking garbage from URLs
// @namespace   name.robgant
// @include     https://smile.amazon.com/*
// @version     1
// @run-at      document-start
// @grant       none
// ==/UserScript==
'use strict';

const loc = window.location.toString();

if (loc.indexOf('/ref=') !== -1 || loc.indexOf('?') !== =1) {
  const cleanUrl = loc.replace(/(?:\/ref=|\?).*/, '');
  history.replaceState(null, '', cleanUrl);
}
