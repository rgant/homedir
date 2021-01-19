// ==UserScript==
// @name        Customize Miniflux
// @description Adds keyboard shortcut to open article in a new background tab.
// @namespace   name.robgant
// @include     https://reader.miniflux.app/*/entry/*
// @version     1
// @grant       GM.openInTab
// ==/UserScript==
'use strict';

const prevLnk = document.querySelector('.pagination-prev a');
const nextLnk = document.querySelector('.pagination-next a');

// Add fixed navigation
const container = document.createElement('div');
container.className = 'nav-container';
const pLnk = document.createElement('a');
pLnk.className = 'nav-lnk';
pLnk.style.gridColumn = 1;
pLnk.textContent = '«';
if (prevLnk) {
  pLnk.href = prevLnk.href;
}

const nLnk = document.createElement('a');
nLnk.className = 'nav-lnk';
nLnk.style.gridColumn = 3;
nLnk.textContent = '»';
if (nextLnk) {
  nLnk.href = nextLnk.href;
}

container.appendChild(pLnk);
container.appendChild(nLnk);
document.body.appendChild(container);

// Fix encoded characters in article titles
const lnk = document.querySelector('h1 a');
if (lnk && lnk.innerHTML.match(/&amp;(?:\w+|#x?\d+);|&[lg]t;/)) {
  lnk.innerHTML = lnk.textContent;
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

    if (evt.key === 'l') {
      // Ignore
      evt.stopPropagation();
    }
  }
}, true);
