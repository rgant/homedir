// ==UserScript==
// @name        Fix BoingBoing
// @description Add style to hide element and use normal youtube embeds.
// @namespace   name.robgant
// @include     http://boingboing.net/*/*/*/*
// @include     https://boingboing.net/*/*/*/*
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle('#adskin, #ad_leaderboard {display: none !important;}');

//<iframe width="560" height="315" src="https://www.youtube.com/embed/cZLYvI-I0Ig" 
// frameborder="0" allowfullscreen></iframe>
Array.forEach(
  document.getElementsByClassName('video-container-yt')
  ,function(el) {
    var embed = document.createElement('iframe'),
        img = el.style.backgroundImage,
        re = /\/vi\/([^\/]+)\//,
        m = img.match(re);

    if (m[1]) {
      embed.setAttribute('frameborder', 0);
      embed.setAttribute('allowfullscreen', true);
      embed.setAttribute('width', el.clientWidth);
      embed.setAttribute('height', el.clientHeight);
      embed.setAttribute('src', 'https://www.youtube.com/embed/' + m[1] + '?showinfo=1');

      el.parentNode.replaceChild(embed, el);
    }    
  }
);