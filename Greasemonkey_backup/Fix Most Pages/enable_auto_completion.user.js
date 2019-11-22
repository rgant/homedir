// ==UserScript==
// @name        Fix Most Pages
// @namespace   robgant.name
// @description Enable autocomplete, sanitize password inputs, disable _gaq links, show video &
//              audio controls, fix youtube embeds.
// @include     *
// @grant       none
// ==/UserScript==
'use strict';

/**
 * Make general modifications to any pages where these apply.
 */
function sanitizePage() {
  // Enable Autocompletion where turned off
  document.querySelectorAll('*[autocomplete=off]').forEach(el => {
    el.removeAttribute('autocomplete');
  });

  // Enable spell checking where turned off
  document.querySelectorAll('*[spellcheck=false]').forEach(el => {
    el.removeAttribute('spellcheck');
  });

  // Make password inputs sane
  const rtnflsPttrn = /^ *(javascript: *)?return +false;? *$/;
  document.querySelectorAll('input[type=password]').forEach(el => {
    // Remove the readonly attribute used by some banks GUI keyboards
    if (el.getAttribute('readonly')) {
      el.removeAttribute('readonly');
    }

    const evts = [
      'contextmenu',
      'copy',
      'cut',
      'dragend',
      'dragover',
      'dragstart',
      'drop',
      'input',
      'keydown',
      'keypress',
      'keyup',
      'paste',
    ];
    let i = evts.length - 1;
    let attr;

    // Loop through the list of events and remove any of them that are set to just return false
    for (; i >= 0; i--) {
      attr = 'on' + evts[i];
      if (rtnflsPttrn.test(el.getAttribute(attr))) {
        el.removeAttribute(attr);
      }
    }
  });

  // Make _gaq click links work when GA isn't loaded.
  document.querySelectorAll('a[onclick^=_gaq]').forEach(el => {
    el.removeAttribute('onclick');
  });

  // Try to make HTML5 video and audio show controls
  document.querySelectorAll('video, audio').forEach(el => {
    el.setAttribute('controls', 'controls');
  });

  // Show Info so I can add to Watch Later on YouTube Player
  document.querySelectorAll(
    'iframe[src^="https://www.youtube.com/embed/"], iframe[src^="http://www.youtube.com/embed/"]'
  ).forEach(el => {
    if (el.src && el.src.indexOf('showinfo=0') >= 0) {
      el.src = el.src.replace('showinfo=0', 'showinfo=1');
    }
  });
}

sanitizePage();
window.addEventListener('load', sanitizePage, false);
