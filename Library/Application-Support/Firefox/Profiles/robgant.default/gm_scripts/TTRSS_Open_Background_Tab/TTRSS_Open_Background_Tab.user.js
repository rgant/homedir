// ==UserScript==
// @name        TTRSS Open Background Tab
// @namespace   name.robgant.slashdot
// @description Adds keyboard shortcut to open article in a new background tab
// @include     https://rss.wh0rd.org/
// @include     https://rss.wh0rd.org/#f*
// @include     https://rss.wh0rd.org/index.php*
// @grant       GM_openInTab
// ==/UserScript==

document.addEventListener('keydown', function(evt){
	if (evt.which == 59) {
		var headlines_el = document.getElementById('headlines-frame');
		if (headlines_el) {
			var entry_el = headlines_el.getElementsByClassName('Selected').item(0);
			if (entry_el) {
			    var lnk = entry_el.getElementsByClassName('title').item(0);
			    if (lnk) {
    				evt.stopPropagation();
    				evt.preventDefault();
    				var tab = GM_openInTab(lnk.href, true);
    			}
			}
		}
	} else if (evt.metaKey) {
	   evt.stopPropagation();
	}
}, true);

(function(){
	function patch_cdmExpandArticle(window) {
		var orig = window.cdmExpandArticle;
		window.cdmExpandArticle = function(){
			//console.log('Monkey Patch');
			result = orig.apply(this, arguments);
			Array.forEach(
				window.document.querySelectorAll('iframe[src^="https://www.youtube.com/embed/"]'),
				function(el){
					if (el.src && el.src.indexOf('showinfo=0') >= 0) {
						el.src = el.src.replace('showinfo=0', 'showinfo=1');
					}
				}
			);
			return result;
		}
		//console.log('Monkey Patched cdmExpandArticle');
	}
	
	var scrpt = document.createElement('scr'+'ipt');
	scrpt.appendChild(document.createTextNode('('+ patch_cdmExpandArticle +')(window);'));
	(document.body || document.head || document.documentElement).appendChild(scrpt);
	//console.log('Monkey Patching code injected.');
})();