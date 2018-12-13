// ==UserScript==
// @name     Set Default Sort on Peapod to Name
// @version  1
// @include  https://www.peapod.com/*
// @grant    none
// ==/UserScript==
'use strict';

window.addEventListener('load', () => {
  // Wait for the select element to be created in the DOM so we can modify the model
  setInterval(() => {
    const selectEl = document.querySelector('select.select-text[aria-labelledby="aria_sort-header"]');
    if (selectEl) {
      init(selectEl);
    }
  }, 100);
});

/**
 * Change the selected option and dispatch a change event so Angular notices.
 * @param {HTMLSelectElement} selectEl - Sort selection field.
 */
function init(selectEl) {
  if (!selectEl.options[0].selected) {
    selectEl.options[0].selected = true;
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('change', false, true);
    selectEl.dispatchEvent(evt);
  }
}
