/**
 * FLA Property Management — Frontend Theme Color Injector (theme.js)
 * Reads admin-saved color theme from localStorage and applies CSS
 * custom properties to the entire page dynamically.
 * Include this script in <head> of every HTML page.
 */
(function () {
  'use strict';

  var KEY_THEME = 'fla_theme_colors';

  var DEFAULTS = {
    primary:   '#007f5f',
    primaryH:  '#00664c',
    secondary: '#80b918',
    heading:   '#0f172a',
    body:      '#374151',
    btnText:   '#ffffff',
    navBg:     '#ffffff',
    navText:   '#374151',
    heroBg:    '#f8fafc'
  };

  function applyTheme() {
    var saved;
    try {
      var raw = localStorage.getItem(KEY_THEME);
      saved = raw ? JSON.parse(raw) : null;
    } catch (e) { saved = null; }

    if (!saved) return; // No custom theme — use the CSS defaults

    var c = Object.assign({}, DEFAULTS, saved);

    // Build CSS variable overrides
    var css = [
      ':root {',
      '  --jungle-teal: ' + c.primary + ';',
      '  --lime-moss: '   + c.secondary + ';',
      '  --primary: '     + c.primary + ';',
      '  --primary-hover: ' + c.primaryH + ';',
      '  --primary-dark: '  + darken(c.primary, 20) + ';',
      '  --primary-darker: ' + darken(c.primary, 40) + ';',
      '  --secondary: '   + c.secondary + ';',
      '  --fla-heading-color: ' + c.heading + ';',
      '  --fla-body-color: '    + c.body + ';',
      '  --fla-btn-text: '      + c.btnText + ';',
      '  --fla-nav-bg: '        + c.navBg + ';',
      '  --fla-nav-text: '      + c.navText + ';',
      '  --fla-hero-bg: '       + c.heroBg + ';',
      '}'
    ].join('\n');

    // Heading overrides
    css += '\nh1,h2,h3,h4,h5,h6 { color: ' + c.heading + ' !important; }';

    // Nav background
    css += '\n.site-nav,.navbar,.nav-wrapper,.site-header { background: ' + c.navBg + ' !important; }';

    // Nav text
    css += '\n.nav-link,.nav-item,.site-nav a,.navbar a { color: ' + c.navText + ' !important; }';

    // Hero section
    css += '\n.hero-split,.hero,.hero-section,.hero-left { background-color: ' + c.heroBg + ' !important; }';

    // Primary buttons
    css += '\n.btn--primary,.cta-btn,.hero-cta,[class*="btn-primary"]:not(.admin-btn) { background: ' + c.primary + ' !important; color: ' + c.btnText + ' !important; border-color: ' + c.primary + ' !important; }';
    css += '\n.btn--primary:hover,.cta-btn:hover { background: ' + c.primaryH + ' !important; border-color: ' + c.primaryH + ' !important; }';

    // Inject style tag
    var existing = document.getElementById('fla-theme-override');
    if (existing) existing.remove();

    var style = document.createElement('style');
    style.id = 'fla-theme-override';
    style.textContent = css;
    var head = document.head || document.documentElement;
    head.appendChild(style);
  }

  /**
   * Darken a hex color by `amount` (0–255 per channel offset).
   */
  function darken(hex, amount) {
    var num = parseInt((hex || '#000000').replace('#', ''), 16);
    var r = Math.max(0, (num >> 16) - amount);
    var g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    var b = Math.max(0, (num & 0x0000FF) - amount);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  // Run immediately (before DOM paint)
  applyTheme();

  // Also run after DOM in case styles load late
  document.addEventListener('DOMContentLoaded', applyTheme);

  // Realtime multi-tab & BroadcastChannel listener
  window.addEventListener('storage', function (e) {
    if (e.key === KEY_THEME) applyTheme();
  });

  try {
    if (typeof BroadcastChannel !== 'undefined') {
      var bc = new BroadcastChannel('fla_realtime_channel');
      bc.onmessage = function (msg) {
        if (msg && msg.data && msg.data.type === 'theme') {
          applyTheme();
        }
      };
    }
  } catch (err) {}

  // Expose for manual re-trigger
  window.FLATheme = { apply: applyTheme };
})();
