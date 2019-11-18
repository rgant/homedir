// ==UserScript==
// @name        TTRSS Open Background Tab
// @description Adds keyboard shortcut to open article in a new background tab
// @namespace   name.robgant
// @include     https://rss.wh0rd.org/
// @include     https://rss.wh0rd.org/#f*
// @include     https://rss.wh0rd.org/index.php*
// @grant       GM.openInTab
// ==/UserScript==
'use strict';

document.addEventListener('keydown', evt => {
  if (evt.key === ';') {
    const headlinesEl = document.getElementById('headlines-frame');
    if (headlinesEl) {
      const entryEl = headlinesEl.getElementsByClassName('active').item(0);
      if (entryEl) {
        const lnkEl = entryEl.getElementsByClassName('title').item(0);
        if (lnkEl) {
          evt.stopPropagation();
          evt.preventDefault();
          GM.openInTab(lnkEl.href, true);
        }
      }
    }
  } else if (evt.metaKey) {
    evt.stopPropagation();
  }
}, true);

(function () {
  /**
   * Don't change the scroll position for clicks in the body content.
   * @param {Window} window - global browser window object
   */
  function patchCdmClicked(window) {
    const orig = window.cdmClicked;
    window.cdmClicked = function (event, id, inBody) {
      if (inBody) {
        return false;
      }
      return orig(event, id, inBody);
    };
  }

  const scrpt = document.createElement('script');
  scrpt.appendChild(document.createTextNode('(' + patchCdmClicked + ')(window);'));
  (document.body || document.head || document.documentElement).appendChild(scrpt);
})();
