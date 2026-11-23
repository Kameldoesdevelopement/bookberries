// Runs before the page is painted, including when storage is unavailable.
(function () {
  var theme = 'default';
  try {
    if (localStorage.getItem('bookberries-theme') === 'cozy') theme = 'cozy';
  } catch (_) {}
  document.documentElement.dataset.theme = theme;
})();