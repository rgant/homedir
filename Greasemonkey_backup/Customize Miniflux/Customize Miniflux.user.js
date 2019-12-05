// ==UserScript==
// @name        Customize Miniflux
// @description Adds keyboard shortcut to open article in a new background tab. Fixes CSS
// @namespace   name.robgant
// @include     https://reader.miniflux.app/*
// @version     1
// @grant       GM.openInTab
// ==/UserScript==
'use strict';

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
    // Don't do a browser find on key presses, except space bar for scrolling.
    if (evt.key !== ' ' && evt.key !== 'Enter') {
      // evt.stopPropagation();
      evt.preventDefault();
    }

    // My shortcut to open article in a new tab.
    if (evt.key === ';') {
      const lnkEl = document.querySelector('.entry-header h1 a');
      if (lnkEl) {
        evt.stopPropagation();
        GM.openInTab(lnkEl.href, true);
      }
    }

    // Try navigating backwards in history first, and only then go to the prev link.
    const prevKeys = ['k', 'p', 'ArrowLeft'];
    if (prevKeys.includes(evt.key)) {
      evt.stopPropagation();
      history.back();

      setTimeout(() => {
        // Special case if there is a prev action.
        const prevLnk = document.querySelector('.pagination-prev a');
        if (prevLnk) {
          prevLnk.click();
        }
      }, 150);
    }

    // Try navigating forwards in history first, and only then go to the next link.
    const nextKeys = ['j', 'n', 'ArrowRight'];
    if (nextKeys.includes(evt.key)) {
      evt.stopPropagation();
      history.forward();

      setTimeout(() => {
        // Special case if there is a next action.
        const nextLnk = document.querySelector('.pagination-next a');
        if (nextLnk) {
          nextLnk.click();
        }
      }, 150);
    }
  }
}, true);
