// ==UserScript==
// @name     Set Default Sort on Peapod to Name
// @version  1
// @include  https://www.peapod.com/*
// @grant    none
// ==/UserScript==

window.addEventListener('load', function() {
  // Wait for the select element to be created in the DOM so we can modify the model
  var initWatcher = setInterval(function () {
    var select_el = document.querySelector('select.select-text[aria-labelledby="aria_sort-header"]');
    if (select_el) {
      clearInterval(initWatcher);
      init(select_el);
    }
	}, 100);
});

function init(select_el) {
  select_el.options[0].selected = true;
  var evt = document.createEvent('HTMLEvents');
  evt.initEvent('change', false, true);
  select_el.dispatchEvent(evt);
}
