// ==UserScript==
// @name       Fix Wirecutter
// @namespace  robgant.name
// @include    https://thewirecutter.com/*
// @include    https://www.nytimes.com/wirecutter/*
// @grant      none
// ==/UserScript==
'use strict';

const head = document.getElementsByTagName('head')[0];
if (head) {
  const style = document.createElement('style');
  style.textContent = 'body {margin-top: 0 !important;}#site_header_wrapper, header div {position: static !important;}';
  head.appendChild(style);
}

/*
Doesn't work because the banner is not in the original source html.
const cookie_banner_el = document.querySelector('span[data-gtm-trigger="cookie_banner_dismiss"]');
if (cookie_banner_el) {
  const root_el = cookie_banner_el.parentElement.parentElement.parentElement;
  root_el.removeChild(cookie_banner_el.parentElement.parentElement);
}
*/

// Show lazy loaded images manually
document.querySelectorAll('img[data-srcset]').forEach(el => {
  const srcs = el.getAttribute('data-srcset')
    .split(',')
    .map(src => src.split(' '))
    .sort((a, b) => parseInt(b[1], 10) - parseInt(a[1], 10));

  el.src = srcs[0][0];
  // Remove the blur effects
  el.style.opacity = 1;
  el.style.filter = 'none';
});

document.querySelectorAll('img[data-src]:not([src])').forEach(el => {
  el.src = el.getAttribute('data-src');
  // Remove the blur effects
  el.style.opacity = 1;
  el.style.filter = 'none';
});
