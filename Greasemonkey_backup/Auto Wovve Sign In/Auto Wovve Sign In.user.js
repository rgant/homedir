// ==UserScript==
// @name     Auto Wovve Sign In
// @version  1
// @include  https://wobbe.workbar.com/users/sign_in*
// @run-at document-idle
// @grant    none
// ==/UserScript==

var pw_fld = document.getElementById('user_password'),
    frm_el = document.getElementById('new_user');

if (pw_fld && frm_el && pw_fld.value) {
  // console.log('SUBMITTING FORM');
  frm_el.submit();
//} else {
//  console.log('FALSE', pw_fld, frm_el, pw_fld.value);
}