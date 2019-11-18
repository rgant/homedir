// ==UserScript==
// @name        Fix Slack
// @description Don't let Slack steal my keyboard shortcuts
// @namespace   name.robgant
// @include     https://*.slack.com/*
// @grant       none
// ==/UserScript==
'use strict';

document.addEventListener('keydown', evt => {
  if (evt.metaKey) {
    evt.stopPropagation();
  }
}, true);
