/**
 * Client-side tamper deterrent — same behaviour as the Forevermark ring app's
 * security guard (forevermark-ring-app/ForeverMark-UAT/lib/security-guard.ts):
 *
 *   1. DevTools / view-source keyboard shortcuts are swallowed.
 *   2. Right-click (the other way into "Inspect") is disabled.
 *   3. Double-click, and the multi-click text-selection burst, are disabled.
 *
 * Form fields are exempt from 2 and 3 so shoppers can still right-click → Paste
 * and double-click to select a word while filling in search, contact or
 * checkout forms.
 *
 * Loaded from src/app/layout.tsx. Forevermark's DevTools *detection* + lockdown
 * (viewport-size heuristic, debugger trap, auth-cookie wipe) is switched off
 * there and has no equivalent here — this site has no auth session to end.
 *
 * NOTE: this is a deterrent, not a security boundary. Anything the browser
 * receives can still be read by a determined user (e.g. via the browser menu).
 */
(function () {
  "use strict";

  var EDITABLE = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

  function isEditable(target) {
    return target instanceof Element && target.closest(EDITABLE) !== null;
  }

  /* ── 1. Blocked keyboard shortcuts ── */
  document.addEventListener(
    "keydown",
    function (e) {
      // Prefer the physical key: on macOS, Option turns e.key for "I"/"J"/"C" into
      // other characters (e.g. "ˆ"), which would let Cmd+Option+I slip through.
      var k = e.code && e.code.indexOf("Key") === 0 ? e.code.slice(3).toLowerCase() : (e.key || "").toLowerCase();
      var ctrlish = e.ctrlKey || e.metaKey;

      var isDevTools =
        e.key === "F12" ||
        (ctrlish && e.shiftKey && (k === "i" || k === "j" || k === "c" || k === "k")) ||
        (ctrlish && e.altKey && (k === "i" || k === "j" || k === "c")) ||
        (ctrlish && k === "u");

      if (isDevTools) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true
  );

  /* ── 2. Block right-click ── */
  document.addEventListener(
    "contextmenu",
    function (e) {
      if (isEditable(e.target)) return;
      e.preventDefault();
    },
    true
  );

  /* ── 3. Disable double-click ── */
  document.addEventListener(
    "dblclick",
    function (e) {
      if (isEditable(e.target)) return;
      e.preventDefault();
      e.stopPropagation();
    },
    true
  );
  // Kills the double-click text-selection burst before it starts
  document.addEventListener(
    "mousedown",
    function (e) {
      if (e.detail > 1 && !isEditable(e.target)) e.preventDefault();
    },
    true
  );
})();
