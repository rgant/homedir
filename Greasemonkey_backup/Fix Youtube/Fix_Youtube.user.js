// ==UserScript==
// @name        Fix Youtube
// @description Hide the masthead and don't go into watchlist mode
// @namespace   name.robgant
// @include     https://www.youtube.com/*
// @grant       none
// ==/UserScript==
'use strict';

Array.forEach(
  document.querySelectorAll('.pl-video .yt-uix-sessionlink'),
  el => {
    const url = el.href.replace('&list=WL', '').replace(/&index=\d+/, '');
    el.href = url;
    el.setAttribute('target', '_blank');
  }
);

document.body.className += ' appbar-hidden';
document.getElementById('masthead-appbar').className = 'hid';

document.addEventListener('spfdone', () => {
  document.body.className += ' appbar-hidden';
  document.getElementById('masthead-appbar').className = 'hid';

  Array.forEach(
    document.querySelectorAll('.pl-video .yt-uix-sessionlink'),
    el => {
      const url = el.href.replace('&list=WL', '').replace(/&index=\d+/, '');
      el.href = url;
      el.setAttribute('target', '_blank');
    }
  );
});
