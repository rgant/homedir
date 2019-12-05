// ==UserScript==
// @name        Fix Slack
// @description Don't let Slack steal my keyboard shortcuts
// @namespace   name.robgant
// @include     https://*.slack.com/*
// @grant       none
// ==/UserScript==
'use strict';

document.addEventListener('keydown', evt => {
  if (evt.metaKey) {
    evt.stopPropagation();
  }
}, true);

const head = document.getElementsByTagName('head')[0];
if (head) {
  const style = document.createElement('style');
  style.textContent = '[lang] body, [lang] .c-texty_input {font-family: "PT Sans"}';
  head.appendChild(style);
}
