// ==UserScript==
// @name     		Customize Miniflux
// @description Adds keyboard shortcut to open article in a new background tab. Fixes CSS
// @namespace   name.robgant
// @include     https://reader.miniflux.app/*/entry/*
// @include     https://reader.miniflux.app/feed/*/entry/*
// @version  		1
// @grant       GM.openInTab
// ==/UserScript==

const head = document.getElementsByTagName('head')[0];
if (head) {
  const style = document.createElement('style');
  style.textContent = [
    'body { max-width: 900px; }',
    '.entry-content figcaption { text-transform: none !important; }',
  ].join(' ');
  head.appendChild(style);
}

document.addEventListener('keydown', evt => {
  if (evt.target.nodeName !== 'INPUT' && !evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey) {
    // Don't do a browser find on key presses.
    // evt.stopPropagation();
    evt.preventDefault();

    if (evt.key === ';') {
      const lnkEl = document.querySelector('.entry-header h1 a');
      if (lnkEl) {
        evt.stopPropagation();
        GM.openInTab(lnkEl.href, true);
      }
    }
  }
}, true);
