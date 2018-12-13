// ==UserScript==
// @name           Fix Fark
// @namespace      name.robgant
// @description    Automatically visit Articles from RSS, and others
// @include        http://www.fark.com/comments/*
// @include        https://www.fark.com/comments/*
// @include        http://www.fark.com/vidplayer/*
// @include        https://www.fark.com/vidplayer/*
// @grant          none
// ==/UserScript==
'use strict';

if (window.history.length <= 1 && !window.location.hash) {
  const trEl = document.getElementById('newsContainer').getElementsByClassName('headlineRow').item(0);
  if (trEl) {
    // The tag img is now a background on this span / cell
    const iconImg = trEl.cells.item(1).getElementsByTagName('a').item(0);
    if (iconImg && iconImg.title !== 'Photoshop') {
      const lnk = trEl.getElementsByTagName('a').item(0).href;
      const farkUrlPttrn = /http:\/\/www\.fark\.co(\/cgi\/go\.pl\?i=\d+&l!|m\/goto\/\d+\/)www\.fark\.com\//;
      if (lnk && !lnk.match(farkUrlPttrn)) {
        window.location = lnk;
      } else {
        console.error('lnk not found');
      }
    } else {
      console.error('img not found');
    }
  } else {
    console.error('#newsContainer .headlineRow Not Found');
  }
}

const entries = document.querySelectorAll('div#commentsArea > table.notctable,'
    + 'div#commentsArea > table.notctableTF');

let indx = -1;
/**
 * Scroll comments using j and k keys
 * @param {KeyboardEvent} evt - Keypress Event
 */
function pageNav(evt) {
  if (
    !evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey
        && (evt.key === 'j' || evt.key === 'k')
  ) {
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.key === 'j') {
      indx++;
    } else {
      indx--;
    }

    if (indx < 0) {
      indx = 0;
    } else if (indx >= entries.length) {
      indx = entries.length - 1;
    }

    const item = entries.item(indx);
    if (item && item.id) {
      window.location.hash = '#' + item.id;
    }
  }
}
document.addEventListener('keypress', pageNav, false);
