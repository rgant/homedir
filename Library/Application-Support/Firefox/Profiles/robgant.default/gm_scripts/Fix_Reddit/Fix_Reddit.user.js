// ==UserScript==
// @name        Fix Reddit
// @description Open articles and comments pages in new tabs
// @namespace   name.robgant
// @include     https://www.reddit.com/*
// @grant       GM.openInTab
// ==/UserScript==

Array.forEach(
	document.querySelectorAll('a.title,a.comments,a.bylink'),
  function(el) {
	el.setAttribute('target', '_blank');
  }
);

Array.forEach(
  document.querySelectorAll('.subreddit'),
  function(el) {
	if (el.textContent.endsWith('nosleep') ||
		el.textContent.endsWith('WritingPrompts') ||
		el.textContent.endsWith('The_Donald') ||
		el.textContent.endsWith('vegan') ||
		el.textContent.endsWith('sports') ||
		el.textContent.endsWith('Patriots') ||
		el.textContent.endsWith('bostonceltics')
	   ) {
	  var thing = el.parentNode;
	  while (thing && !thing.classList.contains('thing')) {
		  thing = thing.parentNode;
	  }
	  thing.parentNode.removeChild(thing);
	}
  }
);

var search_el = document.querySelector('input[name=restrict_sr]');
if (search_el) {
	search_el.checked = true;
}

var entries = document.querySelectorAll('#siteTable .thing'),
	indx = -1;
function page_nav(evt) {
	var key = evt.which;
	// 106 = j, 107 = k, 59 = ;
	if (
		evt.target.nodeName !== 'INPUT' && evt.target.nodeName !== 'TEXTAREA' &&
		!evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey &&
		(key == 106 || key == 107 || key == 59)
	) {
		evt.preventDefault();
		evt.stopPropagation();

		if (key == 106) {
			indx++;
		} else if (key == 107) {
			indx--;
		}

		if (indx < 0) {
			indx = 0;
		} else if (indx >= entries.length) {
			indx = entries.length - 1;
		}

		var item = entries.item(indx);
		if (item && item.id) {
			if (key == 59) {
				var tab = GM.openInTab(item.dataset.permalink, true);
				// console.log('openInTab:', item.dataset.permalink);
			} else {
			 	window.location.hash = '#' + item.id;
			}
		}
	}
}
document.addEventListener('keypress', page_nav, false);
