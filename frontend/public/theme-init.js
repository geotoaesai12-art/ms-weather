// Runs before the page paints so there is no flash of the wrong theme.
(function () {
  var theme = 'light';
  try {
    if (localStorage.getItem('ms-weather:theme') === 'dark') theme = 'dark';
  } catch (e) {
    /* storage blocked: keep default */
  }
  document.documentElement.setAttribute('data-theme', theme);
})();
