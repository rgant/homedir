// ==UserScript==
// @name           Wired Fixes
// @namespace      robgant.name
// @description    Displays articles on Wired unpaginated.
// @include        https://www.wired.com/*/*/*/
// @include        https://www.wired.com/story/*
// @run-at         document-start
// @grant          none
// ==/UserScript==

let head = document.getElementsByTagName('head')[0];
if (head) {
  let style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = 'body #global-header,body .header{position:static !important;}';
  head.appendChild(style);
}
