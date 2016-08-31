// ==UserScript==
// @name        Fix Youtube
// @description Hide the masthead and don't go into watchlist mode
// @namespace   name.robgant
// @include     https://www.youtube.com/*
// @grant       none
// ==/UserScript==

function fixes() {
  Array.forEach(
    document.querySelectorAll('.pl-video .yt-uix-sessionlink')
    , function(el) {
      var url = el.href.replace('&list=WL', '').replace(/&index=\d+/, '');
      el.href = url;
      el.setAttribute('target', '_blank');
    }
  );

  document.body.className += ' appbar-hidden';
  document.getElementById('masthead-appbar').className = 'hid';

//   console.log('HERE');
}

document.addEventListener('spfdone', function(e) {
//   console.log('ThERE', e);
  fixes();
});

fixes();
// console.log('WHERE');
