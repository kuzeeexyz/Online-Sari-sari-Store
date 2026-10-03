/* ============================================================
   SariSari PH — Light / Dark Theme Switcher
   ------------------------------------------------------------
   Toggles the data-theme attribute on <html> with a smooth CSS
   transition, saves the choice to localStorage, and (via the
   tiny inline script in each page's <head>) restores it before
   first paint to avoid a flash of the wrong theme.
   ============================================================ */
(function () {
  'use strict';

  const STORAGE_KEY = "sarisari-theme";

  /* Read the currently applied theme */
  function getCurrentTheme() {
    return document.documentElement.getAttribute("data-theme") || "light";
  }

  /* Apply a theme and persist it */
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* storage may be unavailable (private mode) — ignore */
    }
  }

  /* Flip between light and dark */
  function toggleTheme() {
    applyTheme(getCurrentTheme() === "dark" ? "light" : "dark");
  }

  /* Wire up the navbar toggle button */
  function init() {
    const button = document.getElementById("themeToggle");
    if (button) {
      button.addEventListener("click", toggleTheme);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();