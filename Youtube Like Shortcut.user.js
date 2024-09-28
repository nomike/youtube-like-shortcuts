  // ==UserScript==
// @name         YouTube Like Shortcut
// @namespace    http://github.com/nomike/
// @version      1.0
// @description  Adds keyboard shortcuts to like/dislike YouTube videos.
// @author       nomike <nomike@nomike.com>
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @homepageURL  http://github.com/nomike/youtube-like-shortcuts/
// ==/UserScript==

let isMobile = location.hostname == "m.youtube.com";
let isShorts = () => location.pathname.startsWith("/shorts");

function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  const height = innerHeight || document.documentElement.clientHeight;
  const width = innerWidth || document.documentElement.clientWidth;
  return (
    // When short (channel) is ignored, the element (like/dislike AND short itself) is
    // hidden with a 0 DOMRect. In this case, consider it outside of Viewport
    !(rect.top == 0 && rect.left == 0 && rect.bottom == 0 && rect.right == 0) &&
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= height &&
    rect.right <= width
  );
}

function getButtons() {
  if (isShorts()) {
    let elements = document.querySelectorAll(
      isMobile ? "ytm-like-button-renderer" : "#like-button > ytd-like-button-renderer",
    );
    for (let element of elements) {
      if (isInViewport(element)) {
        return element;
      }
    }
  }
  if (isMobile) {
    return (
      document.querySelector(".slim-video-action-bar-actions .segmented-buttons") ??
      document.querySelector(".slim-video-action-bar-actions")
    );
  }
  if (document.getElementById("menu-container")?.offsetParent === null) {
    return (
      document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div") ??
      document.querySelector("ytd-menu-renderer.ytd-video-primary-info-renderer > div")
    );
  } else {
    return document.getElementById("menu-container")?.querySelector("#top-level-buttons-computed");
  }
}

function getDislikeButton() {
  if (getButtons().children[0].tagName === "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER") {
    if (getButtons().children[0].children[1] === undefined) {
      return document.querySelector("#segmented-dislike-button");
    } else {
      return getButtons().children[0].children[1];
    }
  } else {
    if (getButtons().querySelector("segmented-like-dislike-button-view-model")) {
      const dislikeViewModel = getButtons().querySelector("dislike-button-view-model");
      if (!dislikeViewModel) cLog("Dislike button wasn't added to DOM yet...");
      return dislikeViewModel;
    } else {
      return getButtons().children[1];
    }
  }
}


function getLikeButton() {
  return getButtons().children[0].tagName === "YTD-SEGMENTED-LIKE-DISLIKE-BUTTON-RENDERER"
    ? document.querySelector("#segmented-like-button") !== null
      ? document.querySelector("#segmented-like-button")
      : getButtons().children[0].children[0]
    : getButtons().querySelector("like-button-view-model") ?? getButtons().children[0];
}


(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'l') {
          	console.debug("In event handler");
            var likeButton = getLikeButton().querySelector("button");
            if (likeButton) {
              	console.log("Clicking like button...");
              	console.log(likeButton);
                likeButton.click();
            } else {
                console.debug("Like button not found");
            }
        }
    });
    document.addEventListener('keydown', function(event) {
        if (event.altKey && event.key === 'u') {
          	console.log("In event handler");
            var likeButton = getDislikeButton().querySelector("button");
            if (likeButton) {
              	console.log("Clicking dislike button...");
              	console.log(likeButton);
                likeButton.click();
            } else {
                console.debug("Like button not found");
            }
        }
    });
})();
