// ==UserScript==
// @name        Fix Slack
// @description Don't let Slack steal my keyboard shortcuts
// @namespace   name.robgant
// @include     https://*.slack.com/*
// @grant       none
// ==/UserScript==
'use strict';

document.addEventListener('keydown', evt => {
  if (evt.metaKey) {
    evt.stopPropagation();
  }
}, true);

const head = document.getElementsByTagName('head')[0];
if (head) {
  const style = document.createElement('style');
  style.textContent = '[lang] body, [lang] .c-texty_input {font-family: "PT Sans"}';
  head.appendChild(style);
}

// From https://github.com/kfahy/slack-disable-wysiwyg-bookmarklet/blob/master/index.js
const disableWysiwyg = () => {
    const workspaceIds = slackDebug.clientStore.workspaces.getAllWorkspaces();
    for (const workspaceId of workspaceIds) {
        const { redux } = slackDebug[workspaceId];
        const {
            wysiwyg_composer,
            wysiwyg_composer_ios,
            wysiwyg_composer_webapp,
            ...payload
        } = redux.getState().experiments;
        redux.dispatch({
            type: '[19] Bulk add experiment assignments to redux',
            payload
        });
    }
};

window.addEventListener('load', disableWysiwyg, false);