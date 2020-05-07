// ==UserScript==
// @name        Customize Miniflux
// @description Adds keyboard shortcut to open article in a new background tab. Fixes CSS
// @namespace   name.robgant
// @include     https://reader.miniflux.app/*/entry/*
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
    '.nav-container { display: grid; position: fixed; top: 0; right: 0; bottom: 0; left: 0;',
    ' grid-template-columns: 1fr 900px 1fr; z-index: -1; }',
    '.nav-lnk { text-align: center; text-decoration: none; font-size: 25.5vw; }',
  ].join(' ');
  head.appendChild(style);
}

const prevLnk = document.querySelector('.pagination-prev a');
const nextLnk = document.querySelector('.pagination-next a');

const goToPrev = () => {
  history.back();

  // Special case if there is a prev action.
  if (prevLnk) {
    setTimeout(() => {
      window.location = prevLnk.href;
    }, 250);
  }

  return false;
};

const goToNext = () => {
  history.forward();

  // Special case if there is a next action.
  if (nextLnk) {
    setTimeout(() => {
      window.location = nextLnk.href;
    }, 250);
  }

  return false;
};

// Add fixed navigation
const container = document.createElement('div');
container.className = 'nav-container';
const pLnk = document.createElement('a');
pLnk.className = 'nav-lnk';
pLnk.style.gridColumn = 1;
pLnk.textContent = '«';
pLnk.click = goToPrev;
if (prevLnk) {
  prevLnk.click = goToPrev;
  pLnk.href = prevLnk.href;
}

const nLnk = document.createElement('a');
nLnk.className = 'nav-lnk';
nLnk.style.gridColumn = 3;
nLnk.textContent = '»';
container.appendChild(pLnk);
nLnk.click = goToNext;
if (nextLnk) {
  nextLnk.click = goToNext;
  nLnk.href = nextLnk.href;
}

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

    // Try navigating backwards in history first, and only then go to the prev link.
    const prevKeys = ['k', 'p', 'ArrowLeft'];
    if (prevKeys.includes(evt.key)) {
      evt.stopPropagation();
      goToPrev();
    }

    // Try navigating forwards in history first, and only then go to the next link.
    const nextKeys = ['j', 'n', 'ArrowRight'];
    if (nextKeys.includes(evt.key)) {
      evt.stopPropagation();
      goToNext();
    }
  }
}, true);
