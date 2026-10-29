/* MCP Reef Health Data Portal - loader (shipped with the WordPress plugin).
   Reads manifest.json from the dashboard folder (never cached) and loads the version it
   names. The folder comes from data-base on the container, written by the shortcode. */
(function () {
  var root = document.getElementById('mcp-reef');
  if (!root) { return; }
  var me = document.currentScript;
  var base = root.getAttribute('data-base') || (me && me.src.replace(/[^\/]*$/, '')) || '';
  if (base && base.slice(-1) !== '/') { base += '/'; }
  function fail() {
    root.innerHTML = '<p style="padding:24px;font-family:system-ui,sans-serif">The reef ' +
      'dashboard could not be loaded. Please try again in a moment.</p>';
  }
  fetch(base + 'manifest.json?t=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { if (!r.ok) { throw r.status; } return r.json(); })
    .then(function (m) {
      (m.fonts || []).forEach(function (href) {
        if (href.indexOf('https://fonts.googleapis.com/') !== 0) { return; }
        var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href;
        document.head.appendChild(l);
      });
      var css = document.createElement('link');
      css.rel = 'stylesheet'; css.href = base + m.css;
      document.head.appendChild(css);
      var js = document.createElement('script');
      js.src = base + m.js; js.onerror = fail;
      document.body.appendChild(js);
    })
    .catch(fail);
})();
