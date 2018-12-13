// ==UserScript==
// @name        Fix Reddit
// @description Open articles and comments pages in new tabs
// @namespace   name.robgant
// @include     https://np.reddit.com/*
// @grant       GM.openInTab
// ==/UserScript==
'use strict';

Array.forEach(
  document.querySelectorAll('a.choice[href="https://np.reddit.com/gilded/"]'),
  el => {
    el.href = 'https://np.reddit.com/r/popular/gilded/';
  });

Array.forEach(
  document.querySelectorAll('a.title,a.comments,a.bylink'),
  el => {
    el.setAttribute('target', '_blank');
    el.href = el.href.replace('//www.reddit.com', '//np.reddit.com');
  }
);

Array.forEach(
  document.querySelectorAll('.subreddit'),
  el => {
    const subreddts = [
      'AskOuija',
      'baseball',
      'BostonBruins',
      'bostonceltics',
      'CollegeBasketball',
      'fantasyfootball',
      'natureismetal',
      'nba',
      'nfl',
      'nosleep',
      'NYGiants',
      'Patriots',
      'polandball',
      'redsox',
      'soccer',
      'sports',
      'The_Donald',
      'vegan',
      'Warts',
      'WritingPrompts',
    ];
    for (const subr of subreddts) {
      if (el.textContent.endsWith(subr)) {
        let thing = el.parentNode;
        while (thing && !thing.classList.contains('thing')) {
          thing = thing.parentNode;
        }
        thing.parentNode.removeChild(thing);
        break;
      }
    }
  }
);

const searchEl = document.querySelector('input[name=restrict_sr]');
if (searchEl) {
  searchEl.checked = true;
}

const entries = document.querySelectorAll('#siteTable .thing');

let indx = -1;
/**
 * Scroll posts using j and k keys. Open articles using ; key.
 * @param {KeyboardEvent} evt - Keypress Event
 */
function pageNav(evt) {
  if (
    evt.target.nodeName !== 'INPUT' && evt.target.nodeName !== 'TEXTAREA'
    && !evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey
    && (evt.key === 'j' || evt.key === 'k' || evt.key === ';')
  ) {
    evt.preventDefault();
    evt.stopPropagation();

    if (evt.key === 'j') {
      indx++;
    } else if (evt.key === 'k') {
      indx--;
    }

    if (indx < 0) {
      indx = 0;
    } else if (indx >= entries.length) {
      indx = entries.length - 1;
    }

    const item = entries.item(indx);
    if (item && item.id) {
      if (evt.key === ';') {
        GM.openInTab(item.dataset.permalink, true);
      } else {
        window.location.hash = '#' + item.id;
      }
    }
  }
}
document.addEventListener('keypress', pageNav, false);
