// ==UserScript==
// @name      Set Default Sort on Peapod to Name
// @namespace robgant.name
// @include   https://www.stopandshop.com/*
// @grant     none
// ==/UserScript==
'use strict';

window.addEventListener('load', () => {
  let historyLen = 0;

  // Wait for the select element to be created in the DOM so we can modify the model
  setInterval(() => {
    if (window.history.length !== historyLen) {
      setTimeout(() => {
        const selectEl = document.querySelector('#product-search-sort-by-select');
        if (selectEl) {
          console.log('GOT SELECT');
          init(selectEl);
        } else {
          historyLen = 0;
        }
      }, 2000);
      historyLen = window.history.length;
    }

    console.log('HistoryLen:', historyLen);
  }, 100);
});

/**
 * Change the selected option and dispatch a change event so Angular notices.
 * @param {HTMLSelectElement} selectEl - Sort selection field.
 */
function init(selectEl) {
  selectEl.options[0].selected = true;
  const evt = document.createEvent('HTMLEvents');
  evt.initEvent('change', false, true);
  selectEl.dispatchEvent(evt);
  console.log('DONE');
}
