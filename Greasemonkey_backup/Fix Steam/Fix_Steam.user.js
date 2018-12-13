// ==UserScript==
// @name        Fix Steam
// @namespace   name.robgant
// @description Removes JS from Links
// @include     https://steamcommunity.com/*
// @grant       none
// ==/UserScript==
'use strict';

Array.forEach(
  document.querySelectorAll('a[href^="javascript:ShowModalContent"]'),
  el => {
    const m = el.href.match(/javascript:ShowModalContent\((?:%20)*'[^']+',(?:%20)*'([^']+)'/);
    if (m) {
      el.href = m[1];
    }
  }
);

