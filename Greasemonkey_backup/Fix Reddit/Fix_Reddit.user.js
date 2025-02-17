// ==UserScript==
// @name        Fix Reddit
// @description Open articles and comments pages in new tabs. Hide unintersting subreddits.
// @namespace   name.robgant
// @include     https://old.reddit.com/*
// @grant       GM.openInTab
// ==/UserScript==
'use strict';

const head = document.getElementsByTagName('head')[0];
if (head) {
  const style = document.createElement('style');
  style.textContent = '.listingsignupbar, .commentsignupbar, .organic-listing, .hover-bubble,'
    + ' .read-next-container, .promoted, .promotedlink, .happening-now-wrap, .midcol { display: none !important; }'
    + '#header-img { max-height: 50px; max-width: 50px; }';
  head.appendChild(style);
}

document.querySelectorAll('.pinnable-content').forEach(el => {
  el.dataset.pinCondition = () => false;
});

document.querySelectorAll('.sponsored-indicator').forEach(el => {
  let thing = el.parentNode;
  while (thing && !thing.classList.contains('thing')) {
    thing = thing.parentNode;
  }

  thing.parentNode.removeChild(thing);
});

const badSubreddts = [
  'TeenMomOGandTeenMom2',
  'survivor',
  'vanderpumprules',
  'briannachickenfrsnark',
  'LoveIslandUSA',
  'travisandtaylor',
  'TwoSentenceHorror',
  '49ers',
  '90DayFiance',
  'Asmongold',
  'BostonBruins',
  'BravoRealHousewives',
  'Browns',
  'CFB',
  'Cricket',
  'FundieSnarkUncensored',
  'Genshin_Impact',
  'GreenBayPackers',
  'Jujutsufolk',
  'Kanye',
  'coys',
  'LivestreamFail',
  'Patriots',
  'SquaredCircle',
  'Superstonk',
  'barstoolsports',
  'baseball',
  'bostonceltics',
  'buffalobills',
  'cowboys',
  'discordapp',
  'fantasyfootball',
  'FFIE',
  'formula1',
  'formuladank',
  'furry_irl',
  'Helldivers',
  'hockey',
  'nhl',
  'nba',
  'nbacirclejerk',
  'nflcirclejerk',
  'popping',
  'redsox',
  'SaintMeghanMarkle',
  'sports',
  'steelers',
  'ufc',
  'UFOs',
  'wallstreetbets',
  'whenthe',
];
document.querySelectorAll('.subreddit').forEach(el => {
  for (const subr of badSubreddts) {
    if (el.textContent.startsWith('u/') || el.textContent.endsWith(subr)) {
      let thing = el.parentNode;
      while (thing && !thing.classList.contains('thing')) {
        thing = thing.parentNode;
      }

      thing.parentNode.removeChild(thing);
      break;
    }
  }
});

document.querySelectorAll('ul.flat-list.buttons').forEach(el => {
  let child;
  let indx = 0;

  while ((child = el.children.item(indx)) !== null) {
    if (child.textContent.includes('permalink')) {
      const lnk = child.querySelector('a');
      // console.log('LNK', lnk);
      if (lnk && !lnk.href.includes('?context=3')) {
        lnk.href += '?context=3';
      }

      // Keep this link
      indx += 1;
    } else if (child.textContent.includes('parent') || child.classList.contains('first') || child.textContent.includes('NSFW')) {
      // console.log('CHILD', child);
      // Keep these links
      indx += 1;
    } else {
      el.removeChild(child);
    }
  }
});

document.querySelectorAll('a.title,a.comments,a.bylink,a.thumbnail').forEach(el => {
  el.setAttribute('target', '_blank');

  // Some weird bug where reddit image gallery links are broken for thumbnails and titles.
  if (el.href === window.location.href || el.href.includes('/gallery/')) {
    let thing = el.parentNode;
    while (thing && !thing.classList.contains('thing')) {
      thing = thing.parentNode;
    }

    // But the link to the comments is fine...
    const cmtEl = thing.querySelector('a.comments');
    if (cmtEl) {
      el.href = cmtEl.href;
    }
  }

  el.setAttribute('href', el.href.replace('//www.reddit.com', '//np.reddit.com'));
  el.removeAttribute('data-href-url');
  el.removeAttribute('data-outbound-url');
});

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
