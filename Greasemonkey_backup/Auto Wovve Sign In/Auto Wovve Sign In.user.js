// ==UserScript==
// @name     Auto Wovve Sign In
// @version  1
// @include  https://wobbe.workbar.com/users/sign_in*
// @run-at document-idle
// @grant    none
// ==/UserScript==
'use strict';

const pwFld = document.getElementById('user_password');
const frmEl = document.getElementById('new_user');

if (pwFld && frmEl && pwFld.value) {
  frmEl.submit();
}
