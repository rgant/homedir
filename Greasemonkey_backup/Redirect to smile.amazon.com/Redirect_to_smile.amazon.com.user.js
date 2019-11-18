// ==UserScript==
// @name        Redirect to smile.amazon.com
// @description Redirect Amazon to Smile
// @namespace   name.robgant
// @include     https://www.amazon.com/*
// @version     1
// @run-at      document-start
// @grant       none
// ==/UserScript==
'use strict';

const npUrl = window.location.href.replace(window.location.host, 'smile.amazon.com');
window.location.replace(npUrl);
