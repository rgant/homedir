// ==UserScript==
// @name        Fix the Register
// @description Hides annoying elements
// @namespace   name.robgant
// @include     http://www.theregister.co.uk/*/*/*/*/
// @include     https://www.theregister.co.uk/*/*/*/*/
// @grant       none
// ==/UserScript==

let head = document.getElementsByTagName('head')[0];
if (head) {
  let style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = 'body #site_nav.glue{position:static !important;}';
  head.appendChild(style);
}
