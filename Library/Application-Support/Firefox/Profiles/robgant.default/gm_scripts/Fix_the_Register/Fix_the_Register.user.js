// ==UserScript==
// @name        Fix the Register
// @description Hides annoying elements
// @namespace   name.robgant
// @include     http://www.theregister.co.uk/*/*/*/*/
// @grant       GM_addStyle
// ==/UserScript==

GM_addStyle('body #site_nav.glue{position:static !important;}');