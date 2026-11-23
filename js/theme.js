/**
 * FLA Property Management — Dynamic Frontend Theme & Color Injector (theme.js)
 * 
 * Automatically applies brand colors, heading colors, button styles,
 * form active states, badges, and navigation styling across the entire website.
 * Responds to real-time broadcasts and storage changes instantly.
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

  function darken(hex, amount) {
    var num = parseInt((hex || '#007f5f').replace('#', ''), 16);
    var r = Math.max(0, (num >> 16) - amount);
    var g = Math.max(0, ((num >> 8) & 0x00FF) - amount);
    var b = Math.max(0, (num & 0x0000FF) - amount);
    return '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);
  }

  function applyTheme() {
    var saved = null;
    try {
      var raw = localStorage.getItem(KEY_THEME);
      saved = raw ? JSON.parse(raw) : null;
    } catch (e) { saved = null; }

    var c = Object.assign({}, DEFAULTS, saved || {});
    var primaryDark = darken(c.primary, 25);
    var primaryDarker = darken(c.primary, 45);

    var css = `
      :root {
        --jungle-teal: ${c.primary};
        --lime-moss: ${c.secondary};
        --primary: ${c.primary};
        --primary-hover: ${c.primaryH || darken(c.primary, 18)};
        --primary-dark: ${primaryDark};
        --primary-darker: ${primaryDarker};
        --primary-light: color-mix(in srgb, ${c.primary} 12%, transparent);
        --primary-pale: color-mix(in srgb, ${c.primary} 6%, transparent);
        --primary-border: color-mix(in srgb, ${c.primary} 30%, transparent);

        --secondary: ${c.secondary};
        --secondary-hover: ${darken(c.secondary, 15)};
        --secondary-light: color-mix(in srgb, ${c.secondary} 15%, transparent);
        --secondary-pale: color-mix(in srgb, ${c.secondary} 8%, transparent);
        --secondary-border: color-mix(in srgb, ${c.secondary} 35%, transparent);

        --brand-green: ${c.primary};
        --brand-green-hover: ${c.primaryH || darken(c.primary, 18)};
        --brand-green-dark: ${primaryDark};
        --brand-green-darker: ${primaryDarker};
        --brand-green-light: color-mix(in srgb, ${c.primary} 12%, transparent);
        --brand-green-pale: color-mix(in srgb, ${c.primary} 6%, transparent);
        --brand-green-border: color-mix(in srgb, ${c.primary} 30%, transparent);

        --brand-accent: ${c.secondary};
        --brand-primary: ${c.primary};

        --fla-heading-color: ${c.heading};
        --fla-body-color: ${c.body};
        --fla-btn-text: ${c.btnText};
        --fla-nav-bg: ${c.navBg};
        --fla-nav-text: ${c.navText};
        --fla-hero-bg: ${c.heroBg};
      }

      /* ── HEADINGS & TEXT ── */
      h1, h2, h3, h4, h5, h6, .hero__heading, .quote-main-heading {
        color: ${c.heading} !important;
      }

      /* ── ALL PRIMARY BUTTONS ACROSS THE ENTIRE WEBSITE ── */
      .btn--primary,
      .btn-primary,
      .btn-nav-submit,
      .btn-nav-next,
      .btn-form-nav.btn-nav-next,
      .btn-form-nav.btn-nav-submit,
      #btnFinalSubmit,
      .cta-btn,
      .hero-cta,
      .btn-topbar-cta,
      .btn-phone-circle,
      button.btn-primary,
      a.btn--primary {
        background-color: ${c.primary} !important;
        border-color: ${c.primary} !important;
        color: ${c.btnText} !important;
      }

      .btn--primary:hover,
      .btn-primary:hover,
      .btn-nav-submit:hover,
      .btn-nav-next:hover,
      .btn-form-nav.btn-nav-next:hover,
      .btn-form-nav.btn-nav-submit:hover,
      #btnFinalSubmit:hover,
      .cta-btn:hover,
      .hero-cta:hover,
      a.btn--primary:hover {
        background-color: ${c.primaryH || darken(c.primary, 18)} !important;
        border-color: ${c.primaryH || darken(c.primary, 18)} !important;
      }

      /* ── FORM SELECTIONS, CARDS & PILLS ── */
      .select-card.is-selected,
      .prop-select-card.is-selected,
      .service-select-pill.is-selected,
      .freq-select-card.is-selected,
      .cond-select-card.is-selected,
      .gate-select-card.is-selected,
      .pref-option-pill.is-selected {
        border-color: ${c.primary} !important;
        background-color: color-mix(in srgb, ${c.primary} 9%, transparent) !important;
      }

      .select-card.is-selected .option-letter,
      .prop-select-card.is-selected .option-letter,
      .freq-select-card.is-selected .option-letter,
      .cond-select-card.is-selected .option-letter {
        background-color: ${c.primary} !important;
        color: #ffffff !important;
      }

      .service-select-pill.is-selected i,
      .service-select-pill.is-selected .service-pill-icon {
        color: ${c.primary} !important;
      }

      /* ── PROGRESS BARS ── */
      .progress-bar-fill,
      .form-progress-bar__fill,
      .step-progress__bar,
      .step-indicator-fill {
        background-color: ${c.primary} !important;
      }

      /* ── BADGES & PILLS ── */
      .quote-badge-pill,
      .hero__badge,
      .badge-pill,
      .service-badge,
      .bento-badge-cat,
      .bento-badge-city,
      .review-card__verified-badge,
      .stat-badge,
      .review-card__service-tag {
        color: ${c.primary} !important;
        border-color: color-mix(in srgb, ${c.primary} 30%, transparent) !important;
        background-color: color-mix(in srgb, ${c.primary} 10%, transparent) !important;
      }

      /* ── PRIMARY ICONS & HIGHLIGHTS ── */
      .text-primary,
      .text-brand-green,
      .text-emerald-600,
      .brand-text,
      .fa-check-circle,
      .fa-clipboard-check,
      .trust-check-item i,
      .summary-recap-strip__left i,
      .step-badge {
        color: ${c.primary} !important;
      }

      /* ── TABS & FILTERS ── */
      .filter-btn.active,
      .review-tab-btn.active,
      .tab-btn.active {
        background-color: ${c.primary} !important;
        color: #ffffff !important;
        border-color: ${c.primary} !important;
      }

      /* ── INPUTS FOCUS ── */
      .multi-input:focus,
      .form-input:focus,
      input:focus,
      select:focus,
      textarea:focus {
        border-color: ${c.primary} !important;
        box-shadow: 0 0 0 3px color-mix(in srgb, ${c.primary} 18%, transparent) !important;
      }

      /* ── NAVIGATION & NAVBAR ── */
      .site-header,
      .site-nav,
      .primary-nav,
      .header-inner {
        background-color: ${c.navBg} !important;
      }

      .nav-link,
      .nav-item a {
        color: ${c.navText} !important;
      }

      .nav-link:hover,
      .nav-link.active {
        color: ${c.primary} !important;
      }
    `;

    var existing = document.getElementById('fla-theme-override');
    if (existing) existing.remove();

    var style = document.createElement('style');
    style.id = 'fla-theme-override';
    style.textContent = css;
    (document.head || document.documentElement).appendChild(style);
  }

  // Run immediately (before DOM paint)
  applyTheme();

  // Run on DOM ready
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

  window.FLATheme = { apply: applyTheme, darken: darken };
})();
