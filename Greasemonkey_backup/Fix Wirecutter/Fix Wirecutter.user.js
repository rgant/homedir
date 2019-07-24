// ==UserScript==
// @name     Fix Wirecutter
// @version  1
// @include  https://thewirecutter.com/*
// @grant    none
// ==/UserScript==
'use strict';

const head = document.getElementsByTagName('head')[0];
if (head) {
  const style = document.createElement('style');
  style.textContent = 'header div {position: static !important;}';
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