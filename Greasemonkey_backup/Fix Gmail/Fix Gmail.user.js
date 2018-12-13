// ==UserScript==
// @name       Fix Gmail
// @version    1
// @namespace  name.robgant
// @include    https://mail.google.com/mail/*
// @grant      none
// ==/UserScript==
'use strict';

const head = document.getElementsByTagName('head')[0];
if (head) {
  const style = document.createElement('style');
  style.setAttribute('type', 'text/css');
  style.textContent = '.zA > .xY.bq4 { display: flex !important; }';
  head.appendChild(style);
}
