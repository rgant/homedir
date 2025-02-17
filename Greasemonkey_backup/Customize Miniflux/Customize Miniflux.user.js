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

/* Preserved in case I lose the custom CSS on miniflux settings
const customStyles = document.createElement('style');
customStyles.setAttribute('type', 'text/css');
customStyles.textContent = `
:root {
  --entry-content-color: #fff;
  --entry-header-title-link-color: #fff;
  --link-color: #fff;
}

body {
  max-width: 70%;
}

.entry-content figcaption {
  color: inherit;
  text-transform: none !important;
}

.nav-container {
  display: grid;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  grid-template-columns: 1fr 70% 1fr;
  z-index: -1;
}

.nav-lnk {
  text-align: center;
  text-decoration: none;
  font-size: 25.5vw;
}
`;
document.head.appendChild(customStyles);
*/

// Fix encoded characters in article titles
const lnk = document.querySelector('h1 a');
if (lnk && lnk.innerHTML.match(/&[lg]t;/)) {
  lnk.innerHTML = lnk.textContent;
}

document.addEventListener('keydown', evt => {
  if (evt.target.nodeName !== 'INPUT' && !evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey) {
    // Don't do a browser find on key presses, except space bar for scrolling.
    if (evt.key !== ' ' && evt.key !== 'Enter') {
      // Not Needed: evt.stopPropagation();
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
