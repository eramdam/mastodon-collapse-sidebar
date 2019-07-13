// ==UserScript==
// @name Mastodon's Collapsible Sidebar
// @namespace Violentmonkey Scripts
// @match https://octodon.social/*
// @inject-into auto
// @version      0.1 (alpha as fuck)
// @description  Makes the sidebar of Mastodon collapse when not hovered
// @author       Damien Erambert a.k.a @Eramdam(@octodon.social)
// @grant none
// ==/UserScript==


function setupListeners() {
  const composeForm = document.querySelector('.compose-form');
  const drawer = document.querySelector('.drawer')
  const composerObserver = new MutationObserver(() => {
    const hasStuffInUpload = composeForm.querySelectorAll('.compose-form__upload-wrapper > *').length > 1;
    const hasReply = Boolean(composeForm.querySelector('.reply-indicator'))
    console.log({hasStuffInUpload, hasReply})

    if (hasStuffInUpload || hasReply) {
      drawer.classList.add('custom-stuff-inside')
    } else {
      drawer.classList.remove('custom-stuff-inside')
    }
  });
  composerObserver.observe(composeForm, {
    childList: true,
    subtree: true,
  })

  const cssStyles = `
.drawer {
    width: 54px;
    transition: all 200ms;
}

.drawer:hover,
.drawer:focus-within,
.drawer.custom-stuff-inside {
    width: 300px;
}

.drawer .drawer__inner > *,
.drawer .search label,
.drawer .drawer__tab:not(:first-child) {
    opacity: 0;
    visibility: collapse;
    transition: opacity 150ms;
}

.drawer:-moz-any(:focus-within, :hover, .custom-stuff-inside) .drawer__inner > *,
.drawer:-moz-any(:focus-within, :hover, .custom-stuff-inside) .search label,
.drawer:-moz-any(:focus-within, :hover, .custom-stuff-inside) .drawer__tab:not(:first-child) {
    opacity: 1;
    visibility: visible;
}

.drawer:-moz-any(:hover, :focus-within, .custom-stuff-inside) .drawer__tab:first-child {
    min-width: unset;
}

.drawer .drawer__tab:first-child {
    min-width: calc(100% - 10px);
}
  `;
  const style = document.createElement('style')
  style.innerHTML = cssStyles
  document.head.appendChild(style)

}

(() => {
  const root = document.querySelector('#mastodon');
  const observer = new MutationObserver(() => {
    const hasComposer = Boolean(document.querySelector('textarea.autosuggest-textarea__textarea'))

    if (hasComposer) {
      setupListeners()
      observer.disconnect();
    }
  })

  observer.observe(root, {
    subtree: true,
    childList: true
  })
})();