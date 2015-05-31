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

if (window.history.length <= 1 && !window.location.hash) {
	var tr_el = document.getElementById('newsContainer').getElementsByClassName('headlineRow').item(0);
	if (tr_el) {
		// The tag img is now a background on this span / cell
		var icon_img = tr_el.cells.item(1).getElementsByTagName('a').item(0);
		if (icon_img && icon_img.title != 'Photoshop') {
			var lnk = tr_el.getElementsByTagName('a').item(0).href;
			if (lnk && !lnk.match(/http:\/\/www\.fark\.co(\/cgi\/go\.pl\?i=\d+&l!|m\/goto\/\d+\/)http:\/\/www\.fark\.com\//)) {
				window.location = lnk;
			} else {
				console.error("lnk not found");
			}
		} else {
			console.error("img not found");
		}
	} else {
		console.error("#newsContainer .headlineRow Not Found");
	}
}

var sheet = document.styleSheets[document.styleSheets.length-1];
sheet.insertRule("#abPleaBar { visibility:hidden; display:none; }", sheet.cssRules.length);

var entries = document.querySelectorAll('div#commentsArea > table.notctable, div#commentsArea > table.notctableTF'),
    indx = -1;
function page_nav(evt) {
    var key = evt.which;
    // 106 = j, 107 = k
    if (
        !evt.altKey && !evt.ctrlKey && !evt.metaKey && !evt.shiftKey
        && (key == 106 || key == 107)
    ) {
        evt.preventDefault();
        evt.stopPropagation();

        if (key == 106) {
            indx++;
        } else {
            indx--;
        }

        if (indx < 0) {
            indx = 0;
        } else if (indx >= entries.length) {
            indx = entries.length - 1;
        }

        var item = entries.item(indx);
        if (item && item.id) {
            window.location.hash = '#' + item.id;
        }
    }
}
document.addEventListener('keypress', page_nav, false);
