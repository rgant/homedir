// ==UserScript==
// @name           Remove AMP & Tracking
// @description    Converts AMP URLs to normal. Removes the tracking garbage from URLs.
// @namespace      robgant.name
// @include        *
// @run-at         document-start
// @grant          none
// ==/UserScript==
'use strict';

const loc = window.location.toString();
let cleanUrl = loc;
let gotTracking = false;
let gotAmp = false;

// Google Analytics Tracking
if (loc.indexOf('utm_source=') !== -1) {
  gotTracking = true;
  cleanUrl = cleanUrl.replace(/utm_\w+=[^&#]+&?/g, '').replace(/\?(?=$|#)/, '');
}

// Facebook Tracking
if (loc.indexOf('fbclid=') !== -1) {
  gotTracking = true;
  cleanUrl = cleanUrl.replace(/fbclid=[^&#]+&?/g, '').replace(/\?(?=$|#)/, '');
}

// Google AMP breaks pages because of my 3rd party content blocking
if (loc.indexOf('/amp/') !== -1 || loc.indexOf('//amp.') !== -1) {
  gotAmp = true;
  cleanUrl = cleanUrl.replace('/amp/', '/').replace('//amp.', '//');
}

if (gotAmp) {
  window.location.replace(cleanUrl);
} else if (gotTracking) {
  window.history.replaceState(null, '', cleanUrl);
}

// Show native controls on videos
const enableVideoControls = () => {
  document.querySelectorAll('video').forEach((vid) => {
    vid.controls = true;
    vid.setAttribute('controls', '');
  });
};
setTimeout(enableVideoControls, 1000);
enableVideoControls();
