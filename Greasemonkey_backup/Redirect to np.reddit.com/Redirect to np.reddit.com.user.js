// ==UserScript==
// @name        Redirect to np.reddit.com
// @namespace   name.robgant
// @description Redirect Reddit to np
// @include     https://old.reddit.com/*
// @include     https://www.reddit.com/*
// @version     1
// @run-at      document-start
// @grant       none
// ==/UserScript==
'use strict';

const npUrl = window.location.href.replace(window.location.host, 'np.reddit.com');
window.location.replace(npUrl);
