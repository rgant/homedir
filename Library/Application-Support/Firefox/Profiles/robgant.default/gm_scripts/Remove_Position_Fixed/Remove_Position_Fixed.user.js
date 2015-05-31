// ==UserScript==
// @name        Remove Position Fixed
// @namespace   name.robgant
// @description Makes some things on the page with position fixed become static. Adds a menu command to run the script.
// @include     *
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

function unfix_position() {
//    console.log("Unfixing Positions!!");
    Array.forEach(
        document.querySelectorAll("div, header, section, nav")
        ,function(el) {
            if (window.getComputedStyle(el).position === 'fixed') {
                el.style.position = 'static';
                el.style.cssText += ';position:static !important;';
            }
        }
    );
}

GM_registerMenuCommand("Position Unfixed", unfix_position);

function set_default_unfix() {
    var domain = window.location.host;
    GM_setValue(domain, true);
}

GM_registerMenuCommand("Default Unfixed", set_default_unfix);

var domain = window.location.host;
if (GM_getValue(domain, false)) {
//    console.log("Default Unfixed Position");
    window.addEventListener("scroll", function(evt){
        window.setTimeout(unfix_position, 800);
        window.removeEventListener("scroll", arguments.callee);
    }, false);
}
//else { console.log("Not Default Unfixed Position"); }
