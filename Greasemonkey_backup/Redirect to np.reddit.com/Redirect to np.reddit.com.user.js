// ==UserScript==
// @name        Redirect to np.reddit.com
// @description Redirect Reddit to np
// @namespace   name.robgant
// @include     https://old.reddit.com/*
// @include     https://www.reddit.com/*
// @exclude     https://www.reddit.com/media*
// @version     1
// @run-at      document-start
// @grant       none
// ==/UserScript==
'use strict';

const npUrl = window.location.href.replace(window.location.host, 'np.reddit.com');
window.location.replace(npUrl);
