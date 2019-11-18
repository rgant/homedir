// ==UserScript==
// @name           Remove UTM
// @description    Removes the UTM Tracking garbage from URLs
// @namespace      robgant.name
// @include        *
// @run-at         document-start
// @grant          none
// ==/UserScript==
'use strict';

const loc = window.location.toString();
if (loc.indexOf('utm_source=') !== -1) {
  window.location.replace(loc.replace(/utm_\w+=[^&#]+&?/g, '').replace(/\?(?=$|#)/, ''));
}
