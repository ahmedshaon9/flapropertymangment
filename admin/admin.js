/**
 * FLA PROPERTY MANAGEMENT — ADVANCED ADMIN PORTAL ENGINE (admin.js)
 * 
 * Features:
 *  - Dual-Mode Engine: Seamlessly connects to Node.js REST API (/api/*) 
 *    with automatic fallback to localStorage for static deployments
 *  - Real-time Multi-Client Sync: Server-Sent Events (SSE) + BroadcastChannel + Storage events
 *  - Rock-Solid Modal System: Fixes all popup close bugs with zero CSS specificity conflicts
 *  - Bilingual i18n System: Instant English (EN) & Spanish (ES) switching for Florida teams
 *  - Live Dynamic Theme Engine: Instant real-time color adaptation across all site pages
 *  - Complete Quotes, Reviews Approval Pipeline, Portfolio & Site Settings modules
 */

(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     CONSTANTS, KEYS & STORAGE
  ══════════════════════════════════════════════════════════════ */
  const KEY = {
    AUTH:      'fla_admin_auth',
    CREDS:     'fla_admin_creds',
    QUOTES:    'fla_quote_leads',
    REVIEWS:   'fla_customer_reviews',
    PORTFOLIO: 'fla_portfolio',
    META:      'fla_site_meta',
    BRANDING:  'fla_branding',
    THEME:     'fla_theme_colors',
    LANG:      'fla_admin_lang'
  };

  const DEFAULT_CREDS = { username: 'admin', password: 'FLA@admin2026' };

  const DEFAULT_REVIEWS = [
    {
      id: "rev_1",
      name: "Michael R.",
      role: "Residential Homeowner",
      city: "Lakeland",
      service: "Lawn Mowing & Edging",
      rating: 5,
      message: "The lawn striping patterns are phenomenal! My yard looks like a championship golf course every single Thursday after the crew wraps up. The clean edging along the concrete driveway and garden borders is razor-sharp. Best lawn care service in Polk County, hands down!",
      approved: true,
      order: 1,
      createdAt: "2026-03-15T14:30:00.000Z"
    },
    {
      id: "rev_2",
      name: "Sarah T.",
      role: "Residential Homeowner",
      city: "Winter Haven",
      service: "Landscape Bed Makeovers",
      rating: 5,
      message: "FLA Property transformed our neglected flower beds into a tropical oasis. They removed 3 inches of weed-choked old dirt, installed heavy-duty weed barrier, planted gorgeous hibiscus and crotons, and finished with deep black mulch. Absolutely stunning curb appeal!",
      approved: true,
      order: 2,
      createdAt: "2026-04-10T16:20:00.000Z"
    },
    {
      id: "rev_3",
      name: "David K.",
      role: "Residential Homeowner",
      city: "Davenport",
      service: "One-Time Mow & Go",
      rating: 5,
      message: "Our riding mower broke down right in the middle of Florida rainy season. I called FLA Property for emergency one-time mowing and they arrived within 24 hours. The grass was nearly knee-high and they handled it effortlessly without leaving clumps. Saved my weekend!",
      approved: true,
      order: 3,
      createdAt: "2026-05-18T11:00:00.000Z"
    },
    {
      id: "rev_4",
      name: "Cypress Ridge HOA",
      role: "HOA Board Member",
      city: "Auburndale",
      service: "Commercial Lawn Mowing",
      rating: 5,
      message: "Reliability was our HOA board's top priority after two consecutive lawn contractors flaked out mid-season. FLA Property Maintenance hasn't missed a single scheduled service day in 8 months. Consistent, professional, fully insured, and prompt billing.",
      approved: true,
      order: 4,
      createdAt: "2026-06-02T09:45:00.000Z"
    },
    {
      id: "rev_5",
      name: "Elena M.",
      role: "Residential Homeowner",
      city: "Haines City",
      service: "Mulch & Rock Installation",
      rating: 5,
      message: "We ordered 8 yards of river rock and refreshed the mulch around 14 palm trees. The crew arrived right on time at 8:00 AM with their dump trailer and commercial wheelbarrows. By 2:00 PM the entire property was pristine, blown clean, and sparkling.",
      approved: true,
      order: 5,
      createdAt: "2026-06-25T13:15:00.000Z"
    },
    {
      id: "rev_6",
      name: "Marcus V.",
      role: "Residential Homeowner",
      city: "Bartow",
      service: "Bi-Weekly Lawn Maintenance",
      rating: 5,
      message: "Their bi-weekly mowing service keeps our half-acre property in peak condition all year long. What stands out most is the care they take around fence lines and flower beds — they never scar the sod or ding fence posts with string trimmers. True pros.",
      approved: true,
      order: 6,
      createdAt: "2026-07-12T15:40:00.000Z"
    },
    {
      id: "rev_7",
      name: "Amanda L.",
      role: "Residential Homeowner",
      city: "Plant City",
      service: "Bush, Hedge & Tree Care",
      rating: 5,
      message: "Our podocarpus hedge had grown out of control to over 12 feet tall. The FLA crew leveled it to a perfect 7-foot privacy screen with laser-straight lines. They hauled away every last branch and leaf clipping. Our backyard finally feels open and private again.",
      approved: true,
      order: 7,
      createdAt: "2026-08-04T10:10:00.000Z"
    },
    {
      id: "rev_8",
      name: "Sunbelt Rentals Yard",
      role: "Facility Manager",
      city: "Lake Wales",
      service: "Seasonal Yard Cleanups",
      rating: 5,
      message: "Managing a 2-acre commercial yard requires reliable contractors who respect safety protocols and heavy equipment movement. FLA Property handles our routine mowing, retention pond trimming, and perimeter weed control without disrupting customer traffic.",
      approved: true,
      order: 8,
      createdAt: "2026-09-01T08:30:00.000Z"
    }
  ];

  const DEFAULT_PORTFOLIO = [
    {
      id: "port_1",
      title: "Front Yard Curb Appeal Makeover",
      category: "Landscape Bed Makeovers",
      location: "Davenport, FL",
      description: "Complete front yard landscape renovation featuring heavy-duty commercial weed barrier, vibrant red mulch, tropical hibiscus, crotons, and razor-sharp border edging.",
      images: ["assets/images/landscape-bed-makeover.webp"],
      video: null,
      order: 1,
      date: "2026-08-15"
    },
    {
      id: "port_2",
      title: "Full Acre Turf Striping",
      category: "Lawn Mowing & Edging",
      location: "Winter Haven, FL",
      description: "Commercial zero-turn mower turf striping with diamond pattern on a 1.2-acre residential estate. Weekly cut height maintained at 3.75 inches for optimal root health.",
      images: ["assets/images/residential-lawn-striping.webp"],
      video: null,
      order: 2,
      date: "2026-08-10"
    },
    {
      id: "port_3",
      title: "Black Mulch & Tropical Palms",
      category: "Mulch & Rock Installation",
      location: "Haines City, FL",
      description: "Premium double-shredded black mulch installation around mature Washingtonian palms and stone retaining borders, creating rich color contrast against emerald sod.",
      images: ["assets/images/tropical-landscaping.webp"],
      video: null,
      order: 3,
      date: "2026-07-28"
    },
    {
      id: "port_4",
      title: "Overgrown Rental Property Rescue",
      category: "Seasonal Cleanups",
      location: "Lakeland, FL",
      description: "Comprehensive property reset for a rental turnover with waist-high overgrowth. Performed brush clearing, heavy mulching cut, weed abatement, and curb line trenching.",
      images: ["assets/images/scag-mower-backyard.webp"],
      video: null,
      order: 4,
      date: "2026-07-14"
    },
    {
      id: "port_5",
      title: "HOA Entrance Refresh",
      category: "Commercial Maintenance",
      location: "Auburndale, FL",
      description: "Multi-phase entrance beautification for a 200-home community. Trimmed 40+ ornamental hedges, freshened seasonal annuals, and power-edged 800 linear feet of curb.",
      images: ["assets/images/commercial-mower-landscaping.webp"],
      video: null,
      order: 5,
      date: "2026-06-30"
    },
    {
      id: "port_6",
      title: "Stone Border & Palm Tree Rings",
      category: "Landscape Design",
      location: "Clermont, FL",
      description: "Custom stacked stone landscape edging around 6 Sylvester palms, filled with polished Mexican beach pebble and low-voltage accent lighting.",
      images: ["assets/images/sunset-curb-appeal.webp"],
      video: null,
      order: 6,
      date: "2026-06-18"
    },
    {
      id: "port_7",
      title: "Canopy Lift & Privacy Hedge Leveling",
      category: "Bush & Tree Care",
      location: "Kissimmee, FL",
      description: "Precision hedging on a 60-foot Viburnum hedge leveled to a uniform 8-foot height, paired with a 10-foot canopy lift on front oak trees for clear street clearance.",
      images: ["assets/images/precision-lawn-mowing.webp"],
      video: null,
      order: 7,
      date: "2026-05-22"
    },
    {
      id: "port_8",
      title: "Spring Storm Cleanup & Property Reset",
      category: "Seasonal Cleanups",
      location: "Plant City, FL",
      description: "Post-storm branch removal, fallen debris shredding, turf aeration, and full estate detail cleanup across a 2-acre wooded lot.",
      images: ["assets/images/hero-lawn-mowing.webp"],
      video: null,
      order: 8,
      date: "2026-04-12"
    }
  ];

  const DEFAULT_THEME = {
    primary:    '#007f5f',
    primaryH:   '#00664c',
    secondary:  '#80b918',
    heading:    '#0f172a',
    body:       '#374151',
    btnText:    '#ffffff',
    navBg:      '#ffffff',
    navText:    '#374151',
    heroBg:     '#f0f9f6'
  };

  const COLOR_PRESETS = [
    {
      name: 'Forest Green',
      nameEs: 'Verde Bosque',
      colors: { primary:'#007f5f', primaryH:'#00664c', secondary:'#80b918', heading:'#0f172a', body:'#374151', btnText:'#ffffff', navBg:'#ffffff', navText:'#374151', heroBg:'#f0f9f6' }
    },
    {
      name: 'Ocean Blue',
      nameEs: 'Azul Océano',
      colors: { primary:'#1d4ed8', primaryH:'#1e40af', secondary:'#0ea5e9', heading:'#0f172a', body:'#374151', btnText:'#ffffff', navBg:'#ffffff', navText:'#374151', heroBg:'#eff6ff' }
    },
    {
      name: 'Sunset Coral',
      nameEs: 'Coral Atardecer',
      colors: { primary:'#ea580c', primaryH:'#c2410c', secondary:'#f59e0b', heading:'#1c1917', body:'#44403c', btnText:'#ffffff', navBg:'#ffffff', navText:'#44403c', heroBg:'#fff7ed' }
    },
    {
      name: 'Royal Purple',
      nameEs: 'Púrpura Real',
      colors: { primary:'#7c3aed', primaryH:'#6d28d9', secondary:'#a78bfa', heading:'#1e1b4b', body:'#374151', btnText:'#ffffff', navBg:'#ffffff', navText:'#374151', heroBg:'#f5f3ff' }
    },
    {
      name: 'Midnight Slate',
      nameEs: 'Pizarra Medianoche',
      colors: { primary:'#0f172a', primaryH:'#1e293b', secondary:'#64748b', heading:'#0f172a', body:'#475569', btnText:'#ffffff', navBg:'#0f172a', navText:'#e2e8f0', heroBg:'#f8fafc' }
    }
  ];

  const COLOR_FIELDS = [
    { id: 'primary',   label: 'Primary / Brand Color',  labelEs: 'Color Primario / Marca',       desc: 'Buttons, links, highlights, active states' },
    { id: 'primaryH',  label: 'Primary Hover',           labelEs: 'Color al Pasar el Cursor',    desc: 'Button hover & active press state' },
    { id: 'secondary', label: 'Secondary / Accent',      labelEs: 'Acento Secundario',           desc: 'Accent stripes, secondary badges' },
    { id: 'heading',   label: 'Heading Color',           labelEs: 'Color de Encabezados',        desc: 'H1, H2, H3 titles across website' },
    { id: 'body',      label: 'Body Text Color',         labelEs: 'Color de Texto General',      desc: 'Paragraphs, descriptions, labels' },
    { id: 'btnText',   label: 'Button Text Color',       labelEs: 'Texto de Botones',            desc: 'Text color inside primary buttons' },
    { id: 'navBg',     label: 'Navigation Background',   labelEs: 'Fondo del Menú de Navegación',desc: 'Main navbar background color' },
    { id: 'navText',   label: 'Navigation Text',         labelEs: 'Texto de Navegación',         desc: 'Menu link text & icon color' },
    { id: 'heroBg',    label: 'Hero Background',         labelEs: 'Fondo de la Sección Principal',desc: 'Hero section background tint' }
  ];

  /* ══════════════════════════════════════════════════════════════
     BILINGUAL (i18n) DICTIONARY
  ══════════════════════════════════════════════════════════════ */
  const I18N = {
    en: {
      dashboard: 'Dashboard',
      quotes: 'Quote Requests',
      reviews: 'Reviews',
      portfolio: 'Portfolio',
      settings: 'Site Settings',
      colors: 'Theme & Colors',
      viewWeb: 'View Website',
      logOut: 'Log Out',
      welcome: 'Welcome back, Admin 👋',
      welcomeSub: "Here's what's happening with your FLA Property website today.",
      totalQuotes: 'Total Quote Requests',
      newThisWeek: 'New This Week',
      pendingReviews: 'Pending Reviews',
      portfolioItems: 'Portfolio Items',
      recentQuotes: 'Recent Quote Requests',
      viewAll: 'View all',
      noQuotesYet: 'No quote requests yet',
      noPendingReviews: 'No pending reviews',
      quoteDetails: 'Quote Details',
      updateStatus: 'Update Status:',
      exportCsv: 'Export CSV',
      allStatus: 'All Status',
      addReview: 'Add Review',
      approved: 'Approved',
      pending: 'Pending',
      addItem: 'Add Item',
      liveSync: 'Realtime Active',
      themeApplied: '✓ Theme applied in real time!'
    },
    es: {
      dashboard: 'Panel Principal',
      quotes: 'Presupuestos',
      reviews: 'Reseñas',
      portfolio: 'Portafolio',
      settings: 'Ajustes del Sitio',
      colors: 'Tema y Colores',
      viewWeb: 'Ver Sitio Web',
      logOut: 'Cerrar Sesión',
      welcome: '¡Bienvenido, Administrador! 👋',
      welcomeSub: 'Estado actualizado de su sitio web de mantenimiento FLA Property.',
      totalQuotes: 'Total de Cotizaciones',
      newThisWeek: 'Nuevas Esta Semana',
      pendingReviews: 'Reseñas Pendientes',
      portfolioItems: 'Proyectos en Portafolio',
      recentQuotes: 'Cotizaciones Recientes',
      viewAll: 'Ver todas',
      noQuotesYet: 'Sin cotizaciones aún',
      noPendingReviews: 'Sin reseñas pendientes',
      quoteDetails: 'Detalles de la Cotización',
      updateStatus: 'Actualizar Estado:',
      exportCsv: 'Exportar CSV',
      allStatus: 'Todos los Estados',
      addReview: 'Añadir Reseña',
      approved: 'Aprobadas',
      pending: 'Pendientes',
      addItem: 'Añadir Proyecto',
      liveSync: 'Tiempo Real Activo',
      themeApplied: '✓ ¡Tema aplicado en tiempo real!'
    }
  };

  let currentLang = localStorage.getItem(KEY.LANG) || 'en';

  /* ══════════════════════════════════════════════════════════════
     REAL-TIME BROADCAST CHANNEL
  ══════════════════════════════════════════════════════════════ */
  let broadcastChannel = null;
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      broadcastChannel = new BroadcastChannel('fla_realtime_channel');
      broadcastChannel.onmessage = (msg) => {
        if (msg && msg.data) {
          handleRealtimeUpdate(msg.data.type, msg.data.payload);
        }
      };
    }
  } catch (e) {
    console.warn('BroadcastChannel unavailable:', e);
  }

  function broadcast(type, payload) {
    if (broadcastChannel) {
      try { broadcastChannel.postMessage({ type, payload }); } catch (e) {}
    }
  }

  function handleRealtimeUpdate(type) {
    if (type === 'quotes') {
      if (Nav.current === 'quotes') Quotes.render();
      Dashboard.refresh();
    } else if (type === 'reviews') {
      if (Nav.current === 'reviews') {
        Reviews.renderPending();
        Reviews.renderApproved();
      }
      Dashboard.refresh();
    } else if (type === 'portfolio') {
      if (Nav.current === 'portfolio') Portfolio.render();
      Dashboard.refresh();
    } else if (type === 'theme') {
      Theme.load();
      if (Nav.current === 'colors') {
        Theme.renderPickers();
        Theme.renderPresets();
      }
    }
  }

  // Cross-tab storage fallback listener
  window.addEventListener('storage', (e) => {
    if (e.key === KEY.QUOTES) handleRealtimeUpdate('quotes');
    if (e.key === KEY.REVIEWS) handleRealtimeUpdate('reviews');
    if (e.key === KEY.PORTFOLIO) handleRealtimeUpdate('portfolio');
    if (e.key === KEY.THEME) handleRealtimeUpdate('theme');
  });

  /* ══════════════════════════════════════════════════════════════
     API CLIENT WITH LOCALSTORAGE AUTO-FALLBACK
  ══════════════════════════════════════════════════════════════ */
  let apiAvailable = false;

  const API = {
    async check() {
      try {
        const res = await fetch('/api/settings', { method: 'GET', cache: 'no-store' });
        apiAvailable = res.ok;
        updateLiveIndicator(apiAvailable);
      } catch (e) {
        apiAvailable = false;
        updateLiveIndicator(false);
      }
      if (apiAvailable) this.initSSE();
      return apiAvailable;
    },

    initSSE() {
      try {
        const es = new EventSource('/api/events');
        es.addEventListener('quote_created', () => handleRealtimeUpdate('quotes'));
        es.addEventListener('quote_updated', () => handleRealtimeUpdate('quotes'));
        es.addEventListener('quote_deleted', () => handleRealtimeUpdate('quotes'));
        es.addEventListener('review_created', () => handleRealtimeUpdate('reviews'));
        es.addEventListener('review_updated', () => handleRealtimeUpdate('reviews'));
        es.addEventListener('review_deleted', () => handleRealtimeUpdate('reviews'));
        es.addEventListener('portfolio_created', () => handleRealtimeUpdate('portfolio'));
        es.addEventListener('portfolio_updated', () => handleRealtimeUpdate('portfolio'));
        es.addEventListener('portfolio_deleted', () => handleRealtimeUpdate('portfolio'));
        es.addEventListener('theme_updated', () => handleRealtimeUpdate('theme'));
      } catch (err) {
        console.warn('SSE not supported or disabled', err);
      }
    },

    async getQuotes() {
      let apiList = [];
      if (apiAvailable) {
        try {
          const res = await fetch('/api/quotes');
          if (res.ok) apiList = await res.json();
        } catch (e) {}
      }
      const localList = storage(KEY.QUOTES) || [];

      // Merge by ID or timestamp so no lead is EVER lost
      const map = new Map();
      localList.forEach(q => {
        if (q && (q.id || q.name)) map.set(String(q.id || (q.name + (q.createdAt || ''))), q);
      });
      apiList.forEach(q => {
        if (q && (q.id || q.name)) map.set(String(q.id || (q.name + (q.createdAt || ''))), q);
      });

      const merged = Array.from(map.values()).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      storage(KEY.QUOTES, merged);
      return merged;
    },

    async saveQuote(quote) {
      if (apiAvailable) {
        try {
          const res = await fetch('/api/quotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(quote)
          });
          if (res.ok) return await res.json();
        } catch (e) {}
      }
      const list = storage(KEY.QUOTES) || [];
      quote.id = quote.id || 'quote_' + Date.now();
      list.unshift(quote);
      storage(KEY.QUOTES, list);
      broadcast('quotes', quote);
      return quote;
    },

    async updateQuoteStatus(id, status) {
      if (apiAvailable) {
        try {
          await fetch('/api/quotes/' + encodeURIComponent(id), {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
          });
        } catch (e) {}
      }
      const list = storage(KEY.QUOTES) || [];
      const item = list.find(q => String(q.id) === String(id));
      if (item) {
        item.status = status;
        storage(KEY.QUOTES, list);
        broadcast('quotes', item);
      }
    },

    async deleteQuote(id) {
      if (apiAvailable) {
        try {
          await fetch('/api/quotes/' + encodeURIComponent(id), { method: 'DELETE' });
        } catch (e) {}
      }
      const list = (storage(KEY.QUOTES) || []).filter(q => String(q.id) !== String(id));
      storage(KEY.QUOTES, list);
      broadcast('quotes', { id });
    },

    async getReviews() {
      if (apiAvailable) {
        try {
          const res = await fetch('/api/reviews');
          if (res.ok) {
            const data = await res.json();
            storage(KEY.REVIEWS, data);
            return data;
          }
        } catch (e) {}
      }
      let list = storage(KEY.REVIEWS);
      if (!list || !list.length) {
        try {
          const res = await fetch('../data/reviews.json');
          if (res.ok) list = await res.json();
        } catch (e) {}
      }
      if (!list || !list.length) {
        list = JSON.parse(JSON.stringify(DEFAULT_REVIEWS));
      }
      storage(KEY.REVIEWS, list);
      return list;
    },

    async saveReview(rev) {
      if (apiAvailable) {
        try {
          const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(rev)
          });
          if (res.ok) return await res.json();
        } catch (e) {}
      }
      const list = storage(KEY.REVIEWS) || [];
      rev.id = rev.id || 'rev_' + Date.now();
      list.unshift(rev);
      storage(KEY.REVIEWS, list);
      broadcast('reviews', rev);
      return rev;
    },

    async updateReview(id, data) {
      if (apiAvailable) {
        try {
          await fetch('/api/reviews/' + encodeURIComponent(id), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
        } catch (e) {}
      }
      const list = storage(KEY.REVIEWS) || [];
      const idx = list.findIndex(r => String(r.id) === String(id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...data };
        storage(KEY.REVIEWS, list);
        broadcast('reviews', list[idx]);
      }
    },

    async setReviewApproval(id, approved) {
      if (apiAvailable) {
        try {
          await fetch('/api/reviews/' + encodeURIComponent(id) + '/approve', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ approved })
          });
        } catch (e) {}
      }
      const list = storage(KEY.REVIEWS) || [];
      const item = list.find(r => String(r.id) === String(id));
      if (item) {
        item.approved = approved;
        storage(KEY.REVIEWS, list);
        broadcast('reviews', item);
      }
    },

    async deleteReview(id) {
      if (apiAvailable) {
        try {
          await fetch('/api/reviews/' + encodeURIComponent(id), { method: 'DELETE' });
        } catch (e) {}
      }
      const list = (storage(KEY.REVIEWS) || []).filter(r => String(r.id) !== String(id));
      storage(KEY.REVIEWS, list);
      broadcast('reviews', { id });
    },

    async getPortfolio() {
      if (apiAvailable) {
        try {
          const res = await fetch('/api/portfolio');
          if (res.ok) {
            const data = await res.json();
            storage(KEY.PORTFOLIO, data);
            return data;
          }
        } catch (e) {}
      }
      let list = storage(KEY.PORTFOLIO);
      if (!list || !list.length) {
        try {
          const res = await fetch('../data/portfolio.json');
          if (res.ok) list = await res.json();
        } catch (e) {}
      }
      if (!list || !list.length) {
        list = JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO));
      }
      storage(KEY.PORTFOLIO, list);
      return list;
    },

    async savePortfolio(item) {
      if (apiAvailable) {
        try {
          const isEdit = !!item.id;
          const url = isEdit ? '/api/portfolio/' + encodeURIComponent(item.id) : '/api/portfolio';
          const method = isEdit ? 'PUT' : 'POST';
          const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
          });
          if (res.ok) return await res.json();
        } catch (e) {}
      }
      const list = storage(KEY.PORTFOLIO) || [];
      if (item.id) {
        const idx = list.findIndex(p => String(p.id) === String(item.id));
        if (idx !== -1) list[idx] = item;
      } else {
        item.id = 'port_' + Date.now();
        list.unshift(item);
      }
      storage(KEY.PORTFOLIO, list);
      broadcast('portfolio', item);
      return item;
    },

    async deletePortfolio(id) {
      if (apiAvailable) {
        try {
          await fetch('/api/portfolio/' + encodeURIComponent(id), { method: 'DELETE' });
        } catch (e) {}
      }
      const list = (storage(KEY.PORTFOLIO) || []).filter(p => String(p.id) !== String(id));
      storage(KEY.PORTFOLIO, list);
      broadcast('portfolio', { id });
    },

    async getTheme() {
      if (apiAvailable) {
        try {
          const res = await fetch('/api/theme');
          if (res.ok) {
            const data = await res.json();
            storage(KEY.THEME, data);
            return data;
          }
        } catch (e) {}
      }
      return storage(KEY.THEME) || DEFAULT_THEME;
    },

    async saveTheme(theme) {
      if (apiAvailable) {
        try {
          await fetch('/api/theme', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(theme)
          });
        } catch (e) {}
      }
      storage(KEY.THEME, theme);
      broadcast('theme', theme);
    }
  };

  function updateLiveIndicator(isOnline) {
    const textEl = $id('live-indicator-text');
    const wrapEl = $id('live-indicator');
    if (textEl && wrapEl) {
      if (isOnline) {
        textEl.textContent = currentLang === 'es' ? 'Servidor Conectado' : 'Live Sync Active';
        wrapEl.style.display = 'inline-flex';
      } else {
        textEl.textContent = currentLang === 'es' ? 'Local y Nube' : 'Client Sync';
        wrapEl.style.display = 'inline-flex';
      }
    }
  }

  /* ══════════════════════════════════════════════════════════════
     DOM & GENERAL UTILITIES
  ══════════════════════════════════════════════════════════════ */
  function storage(key, value) {
    try {
      if (value === undefined) {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : null;
      }
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return null;
    }
  }

  function esc(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function $id(id) { return document.getElementById(id); }
  function $all(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

  function fmtDate(isoStr) {
    if (!isoStr) return '—';
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
      });
    } catch (e) { return isoStr; }
  }

  function timeAgo(isoStr) {
    if (!isoStr) return '';
    try {
      const diff = (Date.now() - new Date(isoStr)) / 1000;
      if (diff < 60) return currentLang === 'es' ? 'Ahora' : 'Just now';
      if (diff < 3600) return Math.floor(diff / 60) + (currentLang === 'es' ? ' min' : 'm ago');
      if (diff < 86400) return Math.floor(diff / 3600) + (currentLang === 'es' ? ' h' : 'h ago');
      return fmtDate(isoStr);
    } catch (e) { return ''; }
  }

  function initials(name) {
    if (!name) return 'FL';
    const p = name.trim().split(/\s+/);
    return p.length === 1 ? p[0].substring(0, 2).toUpperCase() : (p[0][0] + p[p.length - 1][0]).toUpperCase();
  }

  function toast(msg, type = 'success') {
    const c = $id('toast-container');
    if (!c) return;
    const icon = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' }[type] || 'fa-circle-check';
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${esc(msg)}</span>`;
    c.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'all 0.3s ease';
      setTimeout(() => el.remove(), 300);
    }, 3800);
  }

  /* ══════════════════════════════════════════════════════════════
     ROCK-SOLID MODALS ENGINE (FIXES CLOSE BUGS FOREVER)
  ══════════════════════════════════════════════════════════════ */
  const Modals = {
    open(id) {
      const el = typeof id === 'string' ? $id(id) : id;
      if (!el) return;
      el.removeAttribute('hidden');
      el.classList.add('is-active');
      el.style.display = 'flex';
      document.body.classList.add('modal-open');
    },

    close(id) {
      const el = typeof id === 'string' ? $id(id) : id;
      if (!el) return;
      el.setAttribute('hidden', '');
      el.classList.remove('is-active');
      el.style.display = 'none';
      
      const anyActive = document.querySelector('.modal.is-active:not([hidden])');
      if (!anyActive) {
        document.body.classList.remove('modal-open');
      }
    },

    closeAll() {
      $all('.modal').forEach(m => this.close(m));
    },

    bindAll() {
      // Delegated click handler on the entire document
      document.addEventListener('click', (e) => {
        // 1. Click on close button inside any modal
        const closeBtn = e.target.closest('.modal-close');
        if (closeBtn) {
          e.preventDefault();
          e.stopPropagation();
          const targetId = closeBtn.dataset.modal || closeBtn.getAttribute('data-modal');
          if (targetId && $id(targetId)) {
            Modals.close(targetId);
          } else {
            const parentModal = closeBtn.closest('.modal');
            if (parentModal) Modals.close(parentModal);
          }
          return;
        }

        // 2. Click on modal backdrop overlay
        const backdrop = e.target.closest('.modal-backdrop');
        if (backdrop) {
          e.preventDefault();
          e.stopPropagation();
          const parentModal = backdrop.closest('.modal');
          if (parentModal) Modals.close(parentModal);
        }
      });

      // Escape key closes modals
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          Modals.closeAll();
        }
      });
    }
  };

  /* ══════════════════════════════════════════════════════════════
     AUTHENTICATION
  ══════════════════════════════════════════════════════════════ */
  const Auth = {
    isLoggedIn() { return !!storage(KEY.AUTH); },

    async login(username, password) {
      // Check Node server if available
      if (apiAvailable) {
        try {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          const data = await res.json();
          if (res.ok && data.success) {
            storage(KEY.AUTH, { user: username, token: data.token, ts: Date.now() });
            return true;
          }
        } catch (e) {}
      }

      // Local storage fallback check
      const saved = storage(KEY.CREDS) || DEFAULT_CREDS;
      if (username === saved.username && password === saved.password) {
        storage(KEY.AUTH, { user: username, ts: Date.now() });
        return true;
      }
      return false;
    },

    logout() {
      localStorage.removeItem(KEY.AUTH);
      location.reload();
    },

    changePassword(currentPass, newPass, confirmPass) {
      const saved = storage(KEY.CREDS) || DEFAULT_CREDS;
      if (currentPass !== saved.password) {
        return { ok: false, msg: currentLang === 'es' ? 'La contraseña actual es incorrecta.' : 'Current password is incorrect.' };
      }
      if (newPass !== confirmPass) {
        return { ok: false, msg: currentLang === 'es' ? 'Las nuevas contraseñas no coinciden.' : 'New passwords do not match.' };
      }
      if (newPass.length < 6) {
        return { ok: false, msg: currentLang === 'es' ? 'La contraseña debe tener al menos 6 caracteres.' : 'Password must be at least 6 characters.' };
      }
      storage(KEY.CREDS, { username: saved.username, password: newPass });
      return { ok: true, msg: currentLang === 'es' ? '¡Contraseña actualizada con éxito!' : 'Password updated successfully!' };
    }
  };

  /* ══════════════════════════════════════════════════════════════
     NAVIGATION & BILINGUAL ENGINE
  ══════════════════════════════════════════════════════════════ */
  const Nav = {
    sections: ['dashboard', 'quotes', 'reviews', 'portfolio', 'settings', 'colors'],
    current: 'dashboard',

    goto(section) {
      if (!this.sections.includes(section)) return;
      this.current = section;

      // Close open modals
      Modals.closeAll();

      this.sections.forEach(s => {
        const el = $id('section-' + s);
        if (el) {
          el.classList.remove('active');
          el.setAttribute('hidden', '');
          el.style.display = 'none';
        }
      });

      const target = $id('section-' + section);
      if (target) {
        target.classList.add('active');
        target.removeAttribute('hidden');
        target.style.display = 'block';
      }

      $all('.nav-link').forEach(a => {
        a.classList.toggle('active', a.dataset.section === section);
      });
      $all('.top-nav-tab').forEach(t => {
        t.classList.toggle('active', t.dataset.section === section);
      });

      const pt = $id('page-title');
      if (pt) {
        pt.textContent = I18N[currentLang][section] || section;
      }

      // Load specific section
      Sections.load(section);
    },

    bind() {
      document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-section]');
        if (!link) return;
        e.preventDefault();
        Nav.goto(link.dataset.section);
      });

      // Language Switcher
      const langWrap = $id('lang-switcher');
      if (langWrap) {
        langWrap.addEventListener('click', (e) => {
          const btn = e.target.closest('.lang-btn');
          if (!btn) return;
          const lang = btn.dataset.lang;
          setLanguage(lang);
        });
      }

      // Monetra Quick Search
      const quickSearch = $id('monetra-quick-search');
      if (quickSearch) {
        quickSearch.addEventListener('input', (e) => {
          const val = e.target.value.trim();
          if (val.length > 0) {
            Nav.goto('quotes');
            const qs = $id('quotes-search');
            if (qs) {
              qs.value = val;
              Quotes.render(val);
            }
          }
        });
      }

      // Refresh Data button
      const refreshBtn = $id('refresh-data-btn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          const icon = refreshBtn.querySelector('i');
          if (icon) icon.classList.add('fa-spin');
          await Sections.load(Nav.current);
          setTimeout(() => {
            if (icon) icon.classList.remove('fa-spin');
            toast('Data refreshed successfully', 'info');
          }, 350);
        });
      }

      // Quick export CSV button
      const quickExport = $id('btn-quick-export-csv');
      if (quickExport) {
        quickExport.addEventListener('click', (e) => {
          e.preventDefault();
          Quotes.exportCsv();
        });
      }
    }
  };

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(KEY.LANG, lang);

    $all('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang));

    // Update nav links
    $all('.nav-link').forEach(link => {
      const s = link.dataset.section;
      const textEl = link.querySelector('.nav-link-text');
      if (textEl && I18N[lang][s]) textEl.textContent = I18N[lang][s];
    });

    const pt = $id('page-title');
    if (pt) pt.textContent = I18N[lang][Nav.current] || Nav.current;

    updateLiveIndicator(apiAvailable);
    Sections.load(Nav.current);
    Theme.renderPresets();
    toast(lang === 'es' ? 'Idioma cambiado a Español' : 'Language set to English', 'info');
  }

  /* ══════════════════════════════════════════════════════════════
     QUOTE REQUESTS MODULE
  ══════════════════════════════════════════════════════════════ */
  const Quotes = {
    async getAll() {
      const list = await API.getQuotes();
      // Ensure every quote has an ID and status
      let modified = false;
      list.forEach((q, idx) => {
        if (!q.id) {
          q.id = 'quote_' + Date.now() + '_' + idx;
          modified = true;
        }
        if (!q.status) {
          q.status = 'new';
          modified = true;
        }
      });
      if (modified) storage(KEY.QUOTES, list);
      return list;
    },

    async updateStatus(id, status) {
      await API.updateQuoteStatus(id, status);
      await this.render($id('quotes-search')?.value || '');
      Dashboard.refresh();
      toast(currentLang === 'es' ? `Estado actualizado a "${status}"` : `Status updated to "${status}"`, 'success');
    },

    async deleteQuote(id) {
      const msg = currentLang === 'es' 
        ? '¿Eliminar esta solicitud de presupuesto? Esta acción no se puede deshacer.'
        : 'Delete this quote request? This action cannot be undone.';
      if (!confirm(msg)) return;

      await API.deleteQuote(id);
      await this.render($id('quotes-search')?.value || '');
      Dashboard.refresh();
      toast(currentLang === 'es' ? 'Solicitud eliminada' : 'Quote request deleted', 'info');
    },

    async openDetail(id) {
      const list = await this.getAll();
      const q = list.find(x => String(x.id) === String(id));
      if (!q) return;

      const body = $id('modal-quote-body');
      if (!body) return;

      const labels = currentLang === 'es' ? {
        name: 'Nombre', email: 'Correo Electrónico', phone: 'Teléfono',
        pref: 'Preferencia de Contacto', city: 'Ciudad', address: 'Dirección',
        prop: 'Tipo de Propiedad', cond: 'Condición del Terreno',
        gate: 'Acceso de Portón', freq: 'Frecuencia', date: 'Fecha de Envío',
        photos: 'Fotos Adjuntas', services: 'Servicios Solicitados', notes: 'Notas / Detalles'
      } : {
        name: 'Name', email: 'Email', phone: 'Phone',
        pref: 'Contact Preference', city: 'City', address: 'Address',
        prop: 'Property Type', cond: 'Lawn Condition',
        gate: 'Gate Access', freq: 'Frequency', date: 'Submitted',
        photos: 'Photos Attached', services: 'Services Requested', notes: 'Notes / Additional Info'
      };

      const fields = [
        [labels.name, q.name],
        [labels.phone, q.phone],
        [labels.email, q.email],
        [labels.city, q.city],
        [labels.address, q.address],
        [labels.prop, q.propertyType],
        [labels.freq, q.frequency],
        [labels.cond, q.condition],
        [labels.gate, q.gateAccess],
        [labels.pref, q.contactPref],
        [labels.date, fmtDate(q.createdAt)],
        [labels.photos, q.photosCount ? `${q.photosCount} files` : 'None']
      ];

      const servicesStr = Array.isArray(q.services) ? q.services.join(', ') : (q.services || '—');
      const currentStatus = q.status || 'new';

      body.innerHTML = `
        <div class="quote-detail-grid">
          ${fields.map(([lbl, val]) => `
            <div class="quote-detail-item">
              <label>${esc(lbl)}</label>
              <p>${esc(val || '—')}</p>
            </div>
          `).join('')}
          <div class="quote-detail-item quote-detail-full">
            <label>${esc(labels.services)}</label>
            <p style="font-weight:600; color:var(--a-primary);">${esc(servicesStr)}</p>
          </div>
          <div class="quote-detail-item quote-detail-full">
            <label>${esc(labels.notes)}</label>
            <p>${esc(q.notes || '—')}</p>
          </div>
        </div>

        <div class="quote-status-changer">
          <span style="font-size:12px;font-weight:700;color:var(--a-text-xs);align-self:center;text-transform:uppercase;">
            ${esc(I18N[currentLang].updateStatus)}
          </span>
          ${['new', 'contacted', 'quoted', 'won', 'lost'].map(st => `
            <button type="button" class="btn-secondary btn-sm ${st === currentStatus ? 'btn-primary' : ''}" 
              data-set-status="${st}" data-quote-id="${esc(q.id)}">
              ${esc(st.charAt(0).toUpperCase() + st.slice(1))}
            </button>
          `).join('')}
        </div>
      `;

      // Status change buttons inside modal
      $all('[data-set-status]', body).forEach(btn => {
        btn.addEventListener('click', async (e) => {
          e.preventDefault();
          const targetStatus = btn.dataset.setStatus;
          await Quotes.updateStatus(q.id, targetStatus);
          Modals.close('modal-quote');
        });
      });

      Modals.open('modal-quote');
    },

    async render(filter = '') {
      const tbody = $id('quotes-tbody');
      if (!tbody) return;

      let list = await this.getAll();

      // Status filter
      const sf = $id('quotes-status-filter')?.value || 'all';
      if (sf !== 'all') {
        list = list.filter(q => (q.status || 'new') === sf);
      }

      // Keyword Search
      if (filter) {
        const qStr = filter.toLowerCase().trim();
        list = list.filter(q =>
          (q.name || '').toLowerCase().includes(qStr) ||
          (q.email || '').toLowerCase().includes(qStr) ||
          (q.phone || '').toLowerCase().includes(qStr) ||
          (q.city || '').toLowerCase().includes(qStr) ||
          (Array.isArray(q.services) ? q.services.join(' ') : '').toLowerCase().includes(qStr)
        );
      }

      if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="11"><div class="empty-state"><i class="fa-regular fa-folder-open"></i><p>${esc(I18N[currentLang].noQuotesYet)}</p></div></td></tr>`;
        return;
      }

      tbody.innerHTML = list.map((q, i) => {
        const st = q.status || 'new';
        const stBadge = `<span class="status-badge status-badge--${st}">${esc(st.charAt(0).toUpperCase() + st.slice(1))}</span>`;
        const servicesStr = Array.isArray(q.services) ? q.services.join(', ') : (q.services || '—');

        return `
          <tr>
            <td>${list.length - i}</td>
            <td>${fmtDate(q.createdAt)}</td>
            <td class="table-name-cell">${esc(q.name || '—')}</td>
            <td>${esc(q.phone || '—')}</td>
            <td>${esc(q.email || '—')}</td>
            <td>${esc(servicesStr)}</td>
            <td>${esc(q.city || '—')}</td>
            <td>${esc(q.propertyType || '—')}</td>
            <td>${esc(q.frequency || '—')}</td>
            <td>${stBadge}</td>
            <td>
              <div class="table-actions">
                <button type="button" class="btn-tbl" title="View details" data-quote-view="${esc(q.id)}">
                  <i class="fa-solid fa-eye"></i>
                </button>
                <button type="button" class="btn-tbl btn-tbl--danger" title="Delete" data-quote-del="${esc(q.id)}">
                  <i class="fa-solid fa-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
    },

    async exportCSV() {
      const list = await this.getAll();
      if (!list.length) {
        toast('No quote records to export.', 'info');
        return;
      }
      const headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'Services', 'City', 'Address', 'Property', 'Condition', 'Gate', 'Frequency', 'Notes', 'Status'];
      const rows = list.map(q => [
        q.id || '',
        fmtDate(q.createdAt),
        q.name || '',
        q.phone || '',
        q.email || '',
        Array.isArray(q.services) ? q.services.join('; ') : (q.services || ''),
        q.city || '',
        q.address || '',
        q.propertyType || '',
        q.condition || '',
        q.gateAccess || '',
        q.frequency || '',
        (q.notes || '').replace(/"/g, '""'),
        q.status || 'new'
      ]);

      const csvContent = [headers, ...rows].map(row => row.map(c => `"${c}"`).join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `FLA-Quotes-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      toast('CSV file downloaded!', 'success');
    },

    bind() {
      const search = $id('quotes-search');
      if (search) {
        search.addEventListener('input', () => this.render(search.value));
      }

      const statusFilter = $id('quotes-status-filter');
      if (statusFilter) {
        statusFilter.addEventListener('change', () => this.render(search?.value || ''));
      }

      const exportBtn = $id('export-quotes-btn');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => this.exportCSV());
      }

      const tbody = $id('quotes-tbody');
      if (tbody) {
        tbody.addEventListener('click', (e) => {
          const viewBtn = e.target.closest('[data-quote-view]');
          if (viewBtn) {
            e.preventDefault();
            this.openDetail(viewBtn.dataset.quoteView);
            return;
          }

          const delBtn = e.target.closest('[data-quote-del]');
          if (delBtn) {
            e.preventDefault();
            this.deleteQuote(delBtn.dataset.quoteDel);
          }
        });
      }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     REVIEWS MODERATION & APPROVAL PIPELINE
  ══════════════════════════════════════════════════════════════ */
  const Reviews = {
    async getAll() {
      return await API.getReviews();
    },

    starsHtml(rating) {
      const r = Math.max(1, Math.min(5, parseInt(rating) || 5));
      return Array.from({ length: 5 }, (_, i) =>
        `<i class="fa-${i < r ? 'solid' : 'regular'} fa-star"></i>`
      ).join('');
    },

    async setRank(id, targetRank) {
      let list = await this.getAll();
      const idx = list.findIndex(r => String(r.id) === String(id));
      if (idx === -1) return;
      const item = list.splice(idx, 1)[0];
      const insertAt = Math.min(Math.max(0, targetRank - 1), list.length);
      list.splice(insertAt, 0, item);
      list.forEach((r, i) => { r.order = i + 1; });
      storage(KEY.REVIEWS, list);
      broadcast('reviews', { action: 'reorder', list });
      await this.renderPending();
      await this.renderApproved();
      Dashboard.refresh();
      toast(`✓ Review set as #${insertAt + 1} position! Live on website.`, 'success');
    },

    async move(id, delta) {
      let list = await this.getAll();
      const idx = list.findIndex(r => String(r.id) === String(id));
      if (idx === -1) return;
      const targetIdx = idx + delta;
      if (targetIdx < 0 || targetIdx >= list.length) return;
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      list.forEach((r, i) => { r.order = i + 1; });
      storage(KEY.REVIEWS, list);
      broadcast('reviews', { action: 'reorder', list });
      await this.renderPending();
      await this.renderApproved();
      Dashboard.refresh();
      toast('✓ Review order updated', 'info');
    },

    async approve(id, approveStatus) {
      await API.setReviewApproval(id, approveStatus);
      await this.renderPending();
      await this.renderApproved();
      Dashboard.refresh();
      toast(approveStatus ? '✓ Review approved & published live!' : 'Review unpublished to pending.', 'success');
    },

    async delete(id) {
      if (!confirm('Are you sure you want to delete this customer review?')) return;
      await API.deleteReview(id);
      await this.renderPending();
      await this.renderApproved();
      Dashboard.refresh();
      toast('Review deleted successfully.', 'info');
    },

    async renderPending() {
      const all = await this.getAll();
      const pending = all.filter(r => !r.approved);

      const count = $id('count-pending');
      const badge = $id('badge-reviews');
      if (count) count.textContent = pending.length;
      if (badge) {
        badge.textContent = pending.length;
        badge.hidden = pending.length === 0;
      }

      const listWrap = $id('pending-reviews-list');
      if (!listWrap) return;

      if (!pending.length) {
        listWrap.innerHTML = `
          <div class="empty-state">
            <i class="fa-regular fa-clock"></i>
            <p>${esc(I18N[currentLang].noPendingReviews)} — inbox clear! 🎉</p>
          </div>
        `;
        return;
      }

      listWrap.innerHTML = `
        <div class="admin-reviews-list">
          ${pending.map((r, idx) => this.cardHtml(r, 'pending', idx, pending.length)).join('')}
        </div>
      `;
    },

    async renderApproved() {
      const all = await this.getAll();
      const approved = all.filter(r => r.approved);

      const count = $id('count-approved');
      if (count) count.textContent = approved.length;

      const listWrap = $id('approved-reviews-list');
      if (!listWrap) return;

      if (!approved.length) {
        listWrap.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-check-circle" style="color:var(--a-success)"></i>
            <p>No approved reviews published yet.</p>
          </div>
        `;
        return;
      }

      listWrap.innerHTML = `
        <div class="admin-reviews-list">
          ${approved.map((r, idx) => this.cardHtml(r, 'approved', idx, approved.length)).join('')}
        </div>
      `;
    },

    cardHtml(r, type, index = 0, total = 1) {
      const city = r.city || 'Central Florida';
      const role = r.role || r.propertyType || 'Homeowner';
      const isFirst = index === 0;
      const isSecond = index === 1;
      const rankBadge = type === 'approved'
        ? `<span class="review-rank-badge ${isFirst ? 'rank--first' : isSecond ? 'rank--second' : ''}">
             ${isFirst ? '⭐ #1 Show First' : isSecond ? '🥈 #2 Show Second' : '#' + (index + 1)}
           </span>`
        : `<span class="review-rank-badge">Pending</span>`;

      return `
        <div class="review-admin-card" data-review-id="${esc(r.id)}">
          <div class="review-admin-avatar">${initials(r.name)}</div>
          <div class="review-admin-body">
            <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
              ${rankBadge}
              <span class="review-admin-name">${esc(r.name || 'Anonymous')}</span>
            </div>
            <div class="review-admin-meta">${esc(role)} · ${esc(city)}, FL · ${timeAgo(r.createdAt)}</div>
            <div class="review-admin-stars">${this.starsHtml(r.rating || 5)}</div>
            <div class="review-admin-text">"${esc(r.message || '')}"</div>
          </div>
          <div class="review-admin-actions">
            ${type === 'approved' ? `
              <button type="button" class="btn-move-fast" title="Make this review #1 (Show First on Website)" data-rv-rank="1" data-rv-id="${esc(r.id)}">
                <i class="fa-solid fa-star" style="color:#eab308;"></i> #1 First
              </button>
              <button type="button" class="btn-move-fast btn-move-fast--second" title="Make this review #2 (Show Second on Website)" data-rv-rank="2" data-rv-id="${esc(r.id)}">
                <i class="fa-solid fa-medal" style="color:#2563eb;"></i> #2 Second
              </button>
              <button type="button" class="btn-tbl" title="Move 1 position up" data-rv-up="${esc(r.id)}" ${isFirst ? 'disabled style="opacity:0.3;pointer-events:none;"' : ''}>
                <i class="fa-solid fa-arrow-up"></i>
              </button>
              <button type="button" class="btn-tbl" title="Move 1 position down" data-rv-down="${esc(r.id)}" ${index === total - 1 ? 'disabled style="opacity:0.3;pointer-events:none;"' : ''}>
                <i class="fa-solid fa-arrow-down"></i>
              </button>
              <button type="button" class="btn-tbl" title="Move back to pending" data-rv-unapprove="${esc(r.id)}">
                <i class="fa-solid fa-eye-slash"></i>
              </button>
            ` : `
              <button type="button" class="btn-tbl btn-tbl--success" title="Approve & publish live" data-rv-approve="${esc(r.id)}">
                <i class="fa-solid fa-check"></i> Approve
              </button>
            `}
            <button type="button" class="btn-tbl" title="Edit review" data-rv-edit="${esc(r.id)}">
              <i class="fa-solid fa-pen"></i> Edit
            </button>
            <button type="button" class="btn-tbl btn-tbl--danger" title="Delete review" data-rv-delete="${esc(r.id)}">
              <i class="fa-solid fa-trash"></i> Delete
            </button>
          </div>
        </div>
      `;
    },

    async openEdit(id) {
      const all = await this.getAll();
      const r = all.find(x => String(x.id) === String(id));
      if (!r) return;

      const form = $id('form-edit-review');
      if (!form) return;

      form.querySelector('[name="id"]').value = r.id;
      form.querySelector('[name="name"]').value = r.name || '';
      form.querySelector('[name="city"]').value = r.city || '';
      form.querySelector('[name="role"]').value = r.role || r.propertyType || '';
      form.querySelector('[name="message"]').value = r.message || '';
      form.querySelector('[name="rating"]').value = r.rating || 5;

      StarPicker.set('edit-star-picker', r.rating || 5);
      Modals.open('modal-review-edit');
    },

    bind() {
      const handleListClick = (e) => {
        const rankBtn = e.target.closest('[data-rv-rank]');
        if (rankBtn) {
          const targetRank = parseInt(rankBtn.dataset.rvRank);
          const id = rankBtn.dataset.rvId;
          this.setRank(id, targetRank);
          return;
        }
        const upBtn = e.target.closest('[data-rv-up]');
        if (upBtn) {
          this.move(upBtn.dataset.rvUp, -1);
          return;
        }
        const downBtn = e.target.closest('[data-rv-down]');
        if (downBtn) {
          this.move(downBtn.dataset.rvDown, 1);
          return;
        }
        const btnApprove = e.target.closest('[data-rv-approve]');
        if (btnApprove) {
          this.approve(btnApprove.dataset.rvApprove, true);
          return;
        }
        const btnUnapprove = e.target.closest('[data-rv-unapprove]');
        if (btnUnapprove) {
          this.approve(btnUnapprove.dataset.rvUnapprove, false);
          return;
        }
        const btnEdit = e.target.closest('[data-rv-edit]');
        if (btnEdit) {
          this.openEdit(btnEdit.dataset.rvEdit);
          return;
        }
        const btnDel = e.target.closest('[data-rv-delete]');
        if (btnDel) {
          this.delete(btnDel.dataset.rvDelete);
          return;
        }
      };

      const pendingWrap = $id('pending-reviews-list');
      if (pendingWrap) pendingWrap.addEventListener('click', handleListClick);

      const approvedWrap = $id('approved-reviews-list');
      if (approvedWrap) approvedWrap.addEventListener('click', handleListClick);

      // Add Review form
      const formAdd = $id('form-add-review');
      if (formAdd) {
        formAdd.addEventListener('submit', async (e) => {
          e.preventDefault();
          const name = formAdd.querySelector('[name="name"]').value.trim();
          const message = formAdd.querySelector('[name="message"]').value.trim();

          if (!name || !message) {
            toast('Please fill out reviewer name and review text.', 'error');
            return;
          }

          const fd = new FormData(formAdd);
          const rev = {
            id: 'rev_' + Date.now(),
            name: fd.get('name'),
            city: fd.get('city') || 'Central Florida',
            role: fd.get('role') || 'Homeowner',
            service: fd.get('service') || 'Lawn Mowing & Edging',
            rating: parseInt(fd.get('rating')) || 5,
            message: fd.get('message'),
            approved: fd.get('approved') === 'on',
            createdAt: new Date().toISOString()
          };

          await API.saveReview(rev);
          formAdd.reset();
          StarPicker.set('add-star-picker', 5);
          formAdd.querySelector('[name="rating"]').value = 5;

          await this.renderPending();
          await this.renderApproved();
          Dashboard.refresh();
          toast(rev.approved ? '✓ Review added & published live!' : '✓ Review saved to pending moderation', 'success');
        });
      }

      // Edit Review form
      const formEdit = $id('form-edit-review');
      if (formEdit) {
        formEdit.addEventListener('submit', async (e) => {
          e.preventDefault();
          const fd = new FormData(formEdit);
          const id = fd.get('id');
          const updates = {
            name: fd.get('name'),
            city: fd.get('city'),
            role: fd.get('role'),
            message: fd.get('message'),
            rating: parseInt(fd.get('rating')) || 5
          };

          await API.updateReview(id, updates);
          Modals.close('modal-review-edit');
          await this.renderPending();
          await this.renderApproved();
          Dashboard.refresh();
          toast('✓ Review updated successfully!', 'success');
        });
      }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     PORTFOLIO MANAGEMENT
  ══════════════════════════════════════════════════════════════ */
  const Portfolio = {
    async getAll() {
      return await API.getPortfolio();
    },

    async setRank(id, targetRank) {
      let list = await this.getAll();
      const idx = list.findIndex(p => String(p.id) === String(id));
      if (idx === -1) return;
      const item = list.splice(idx, 1)[0];
      const insertAt = Math.min(Math.max(0, targetRank - 1), list.length);
      list.splice(insertAt, 0, item);
      list.forEach((p, i) => { p.order = i + 1; });
      storage(KEY.PORTFOLIO, list);
      broadcast('portfolio', { action: 'reorder', list });
      await this.render();
      Dashboard.refresh();
      toast(`✓ Project moved to #${insertAt + 1} position! Live on site.`, 'success');
    },

    async move(id, delta) {
      let list = await this.getAll();
      const idx = list.findIndex(p => String(p.id) === String(id));
      if (idx === -1) return;
      const targetIdx = idx + delta;
      if (targetIdx < 0 || targetIdx >= list.length) return;
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      list.forEach((p, i) => { p.order = i + 1; });
      storage(KEY.PORTFOLIO, list);
      broadcast('portfolio', { action: 'reorder', list });
      await this.render();
      Dashboard.refresh();
      toast('✓ Portfolio order updated', 'info');
    },

    async render() {
      const grid = $id('portfolio-grid');
      if (!grid) return;

      const list = await this.getAll();
      if (!list.length) {
        grid.innerHTML = `
          <div class="empty-state">
            <i class="fa-solid fa-images"></i>
            <p>No portfolio items yet. Click "Add Item" to add your first showcase project.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = list.map((p, idx) => {
        const isFirst = idx === 0;
        const thumb = (p.images && p.images[0])
          ? `<img src="${esc(p.images[0])}" alt="${esc(p.title)}" class="portfolio-admin-thumb">`
          : `<div class="portfolio-admin-thumb-placeholder"><i class="fa-solid fa-image"></i></div>`;

        return `
          <div class="portfolio-admin-card" data-portfolio-id="${esc(p.id)}">
            ${thumb}
            <div class="portfolio-admin-info">
              <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
                <span class="portfolio-admin-category">${esc(p.category || 'Maintenance')}</span>
                <span class="portfolio-rank-badge ${isFirst ? 'rank--featured' : ''}">
                  ${isFirst ? '⭐ #1 Featured' : '#' + (idx + 1)}
                </span>
              </div>
              <div class="portfolio-admin-title">${esc(p.title)}</div>
              <div class="portfolio-admin-desc">${esc(p.description || '')}</div>
              <div class="portfolio-admin-actions" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:10px;">
                <button type="button" class="btn-move-fast" title="Set this project as #1 (Featured First)" data-pf-rank="1" data-pf-id="${esc(p.id)}">
                  <i class="fa-solid fa-star" style="color:#eab308;"></i> Show First
                </button>
                <button type="button" class="btn-tbl btn-tbl--sm" title="Move Up" data-pf-up="${esc(p.id)}" ${isFirst ? 'disabled style="opacity:0.3;pointer-events:none;"' : ''}>
                  <i class="fa-solid fa-arrow-up"></i>
                </button>
                <button type="button" class="btn-tbl btn-tbl--sm" title="Move Down" data-pf-down="${esc(p.id)}" ${idx === list.length - 1 ? 'disabled style="opacity:0.3;pointer-events:none;"' : ''}>
                  <i class="fa-solid fa-arrow-down"></i>
                </button>
                <button type="button" class="btn-secondary btn-sm" data-pf-edit="${esc(p.id)}">
                  <i class="fa-solid fa-pen"></i> Edit
                </button>
                <button type="button" class="btn-secondary btn-sm btn-danger" data-pf-del="${esc(p.id)}">
                  <i class="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        `;
      }).join('');
    },

    openAdd() {
      const form = $id('form-portfolio');
      if (form) form.reset();
      $id('preview-images').innerHTML = '';
      $id('preview-video').innerHTML = '';
      $id('portfolio-modal-title').textContent = 'Add Portfolio Item';
      const submitBtn = $id('portfolio-submit-btn');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Portfolio Item';
      if (form) form.querySelector('[name="id"]').value = '';
      PortfolioUpload.reset();
      Modals.open('modal-portfolio');
    },

    async openEdit(id) {
      const list = await this.getAll();
      const p = list.find(x => String(x.id) === String(id));
      if (!p) return;

      const form = $id('form-portfolio');
      if (!form) return;

      form.querySelector('[name="id"]').value = p.id;
      form.querySelector('[name="title"]').value = p.title || '';
      form.querySelector('[name="category"]').value = p.category || 'Lawn Mowing';
      form.querySelector('[name="description"]').value = p.description || '';
      form.querySelector('[name="location"]').value = p.location || '';
      form.querySelector('[name="date"]').value = p.date || '';

      $id('portfolio-modal-title').textContent = 'Edit Portfolio Item';
      const submitBtn = $id('portfolio-submit-btn');
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';

      PortfolioUpload.reset();
      PortfolioUpload.existingImages = Array.isArray(p.images) ? [...p.images] : [];

      const prevWrap = $id('preview-images');
      if (prevWrap) {
        prevWrap.innerHTML = PortfolioUpload.existingImages.map((src, i) => `
          <div class="preview-img-item">
            <img src="${esc(src)}" alt="Thumbnail">
            <button type="button" class="preview-img-remove" data-rm-img="${i}">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        `).join('');

        $all('[data-rm-img]', prevWrap).forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const idx = parseInt(btn.dataset.rmImg);
            PortfolioUpload.existingImages.splice(idx, 1);
            btn.closest('.preview-img-item')?.remove();
          });
        });
      }

      Modals.open('modal-portfolio');
    },

    async delete(id) {
      if (!confirm('Are you sure you want to delete this portfolio project?')) return;
      await API.deletePortfolio(id);
      await this.render();
      Dashboard.refresh();
      toast('Portfolio project removed.', 'info');
    },

    bind() {
      const addBtn = $id('add-portfolio-btn');
      if (addBtn) addBtn.addEventListener('click', () => this.openAdd());

      const grid = $id('portfolio-grid');
      if (grid) {
        grid.addEventListener('click', (e) => {
          const rankBtn = e.target.closest('[data-pf-rank]');
          if (rankBtn) {
            const targetRank = parseInt(rankBtn.dataset.pfRank);
            const id = rankBtn.dataset.pfId;
            this.setRank(id, targetRank);
            return;
          }
          const upBtn = e.target.closest('[data-pf-up]');
          if (upBtn) {
            this.move(upBtn.dataset.pfUp, -1);
            return;
          }
          const downBtn = e.target.closest('[data-pf-down]');
          if (downBtn) {
            this.move(downBtn.dataset.pfDown, 1);
            return;
          }
          const editBtn = e.target.closest('[data-pf-edit]');
          if (editBtn) {
            this.openEdit(editBtn.dataset.pfEdit);
            return;
          }
          const delBtn = e.target.closest('[data-pf-del]');
          if (delBtn) {
            this.delete(delBtn.dataset.pfDel);
            return;
          }
        });
      }

      const form = $id('form-portfolio');
      if (form) {
        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const title = form.querySelector('[name="title"]').value.trim();
          const desc = form.querySelector('[name="description"]').value.trim();

          if (!title || !desc) {
            toast('Please enter a project title and description.', 'error');
            return;
          }

          const btn = $id('portfolio-submit-btn');
          if (btn) btn.disabled = true;

          try {
            const images = await PortfolioUpload.getImages();
            const video = await PortfolioUpload.getVideo();
            const fd = new FormData(form);
            const id = fd.get('id');

            const item = {
              id: id || 'port_' + Date.now(),
              title: fd.get('title'),
              category: fd.get('category'),
              description: fd.get('description'),
              location: fd.get('location'),
              date: fd.get('date'),
              images: images.length ? images : ['assets/images/landscape-bed-makeover.webp'],
              video: video,
              updatedAt: new Date().toISOString()
            };

            await API.savePortfolio(item);
            Modals.close('modal-portfolio');
            await this.render();
            Dashboard.refresh();
            toast(id ? '✓ Portfolio project updated!' : '✓ New portfolio project added!', 'success');
          } catch (err) {
            toast('Failed to save portfolio project: ' + err.message, 'error');
          } finally {
            if (btn) btn.disabled = false;
          }
        });
      }
    }
  };

  /* Upload Helper for Portfolio */
  const PortfolioUpload = {
    newFiles: [],
    newVideo: null,
    existingImages: [],

    reset() {
      this.newFiles = [];
      this.newVideo = null;
      this.existingImages = [];
    },

    readFile(file) {
      return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = () => reject(new Error('Failed reading ' + file.name));
        r.readAsDataURL(file);
      });
    },

    async getImages() {
      const base64s = await Promise.all(this.newFiles.map(f => this.readFile(f)));
      return [...this.existingImages, ...base64s];
    },

    async getVideo() {
      if (!this.newVideo) return null;
      return await this.readFile(this.newVideo);
    },

    bind() {
      const imgZone = $id('img-drop-zone');
      const imgInput = $id('input-portfolio-images');
      if (imgZone && imgInput) {
        imgZone.addEventListener('click', () => imgInput.click());
        imgInput.addEventListener('change', () => this.handleImages(imgInput.files));
      }

      const vidZone = $id('vid-drop-zone');
      const vidInput = $id('input-portfolio-video');
      if (vidZone && vidInput) {
        vidZone.addEventListener('click', () => vidInput.click());
        vidInput.addEventListener('change', () => {
          const file = vidInput.files[0];
          if (file) {
            if (file.size > 10 * 1024 * 1024) {
              toast('Video must be under 10 MB limit.', 'error');
              return;
            }
            this.newVideo = file;
            const wrap = $id('preview-video');
            if (wrap) {
              wrap.innerHTML = `<video src="${URL.createObjectURL(file)}" controls style="max-width:280px;margin-top:10px;border-radius:8px;border:1px solid var(--a-border);"></video>`;
            }
          }
        });
      }
    },

    handleImages(files) {
      const MAX = 3;
      const space = MAX - this.existingImages.length - this.newFiles.length;
      const slice = [...files].slice(0, space);

      slice.forEach(f => {
        if (!f.type.startsWith('image/')) return;
        if (f.size > 3 * 1024 * 1024) {
          toast(`"${f.name}" exceeds 3 MB limit.`, 'error');
          return;
        }
        this.newFiles.push(f);
        const r = new FileReader();
        r.onload = () => {
          const wrap = $id('preview-images');
          if (!wrap) return;
          const item = document.createElement('div');
          item.className = 'preview-img-item';
          item.innerHTML = `
            <img src="${r.result}" alt="Preview">
            <button type="button" class="preview-img-remove"><i class="fa-solid fa-xmark"></i></button>
          `;
          item.querySelector('.preview-img-remove').addEventListener('click', (e) => {
            e.preventDefault();
            const idx = this.newFiles.indexOf(f);
            if (idx !== -1) this.newFiles.splice(idx, 1);
            item.remove();
          });
          wrap.appendChild(item);
        };
        r.readAsDataURL(f);
      });
    }
  };

  /* ══════════════════════════════════════════════════════════════
     DYNAMIC THEME & COLOR CHANGER (REALTIME AUTOMATIC)
  ══════════════════════════════════════════════════════════════ */
  const Theme = {
    current: { ...DEFAULT_THEME },

    async load() {
      this.current = await API.getTheme();
      this.applyToDocument(this.current);
    },

    applyToDocument(c) {
      // Apply CSS overrides to admin document
      document.documentElement.style.setProperty('--a-primary', c.primary);
      document.documentElement.style.setProperty('--a-primary-h', c.primaryH || c.primary);

      // Trigger frontend theme injector if on same page or window
      if (window.FLATheme && window.FLATheme.apply) {
        window.FLATheme.apply();
      }
    },

    async saveAndBroadcast(c) {
      this.current = { ...c };
      await API.saveTheme(this.current);
      this.applyToDocument(this.current);
      toast(I18N[currentLang].themeApplied, 'success');
    },

    renderPresets() {
      const container = $id('preset-swatches');
      if (!container) return;

      container.innerHTML = COLOR_PRESETS.map((preset, i) => {
        const isActive = this.current.primary === preset.colors.primary;
        const displayName = currentLang === 'es' ? (preset.nameEs || preset.name) : preset.name;
        return `
          <div class="preset-swatch ${isActive ? 'active' : ''}" data-preset-idx="${i}" title="Apply ${esc(displayName)}">
            <div class="preset-dots">
              <div class="preset-dot" style="background:${preset.colors.primary}"></div>
              <div class="preset-dot" style="background:${preset.colors.secondary}"></div>
              <div class="preset-dot" style="background:${preset.colors.heading}"></div>
            </div>
            <span class="preset-name">${esc(displayName)}</span>
          </div>
        `;
      }).join('');
    },

    renderPickers() {
      const grid = $id('color-pickers-grid');
      if (!grid) return;

      grid.innerHTML = COLOR_FIELDS.map(f => {
        const val = this.current[f.id] || DEFAULT_THEME[f.id] || '#007f5f';
        const label = currentLang === 'es' ? (f.labelEs || f.label) : f.label;
        return `
          <div class="color-picker-card">
            <label class="color-picker-label">${esc(label)}</label>
            <div class="color-picker-row">
              <input type="color" id="cp-${f.id}" value="${esc(val)}">
              <input type="text" id="cph-${f.id}" value="${esc(val)}" maxlength="7">
            </div>
            <p class="color-picker-desc">${esc(f.desc)}</p>
          </div>
        `;
      }).join('');

      // Wire two-way binding & immediate live preview
      COLOR_FIELDS.forEach(f => {
        const picker = $id('cp-' + f.id);
        const hex = $id('cph-' + f.id);
        if (picker && hex) {
          picker.addEventListener('input', () => {
            hex.value = picker.value;
            this.updateLivePreview();
          });
          hex.addEventListener('input', () => {
            if (/^#[0-9a-fA-F]{6}$/.test(hex.value)) {
              picker.value = hex.value;
              this.updateLivePreview();
            }
          });
        }
      });

      this.updateLivePreview();
    },

    getCurrentFromPickers() {
      const c = {};
      COLOR_FIELDS.forEach(f => {
        const picker = $id('cp-' + f.id);
        c[f.id] = picker ? picker.value : (this.current[f.id] || DEFAULT_THEME[f.id]);
      });
      return c;
    },

    updateLivePreview() {
      const c = this.getCurrentFromPickers();
      const h = $id('preview-heading');
      const p = $id('preview-body');
      const btn = $id('preview-button');
      if (h) h.style.color = c.heading;
      if (p) p.style.color = c.body;
      if (btn) {
        btn.style.background = c.primary;
        btn.style.color = c.btnText;
        btn.style.borderColor = c.primary;
      }
    },

    bind() {
      // Clicking ANY preset AUTOMATICALLY updates all colors in real time!
      const presetWrap = $id('preset-swatches');
      if (presetWrap) {
        presetWrap.addEventListener('click', async (e) => {
          const swatch = e.target.closest('[data-preset-idx]');
          if (!swatch) return;
          const idx = parseInt(swatch.dataset.presetIdx);
          const preset = COLOR_PRESETS[idx];
          if (!preset) return;

          // Update pickers
          COLOR_FIELDS.forEach(f => {
            const picker = $id('cp-' + f.id);
            const hex = $id('cph-' + f.id);
            if (picker && preset.colors[f.id]) picker.value = preset.colors[f.id];
            if (hex && preset.colors[f.id]) hex.value = preset.colors[f.id];
          });

          this.updateLivePreview();
          await this.saveAndBroadcast(preset.colors);
          this.renderPresets();
        });
      }

      // Explicit Apply Button
      const applyBtn = $id('apply-theme-btn');
      if (applyBtn) {
        applyBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          const c = this.getCurrentFromPickers();
          await this.saveAndBroadcast(c);
          this.renderPresets();
        });
      }

      // Reset Button
      const resetBtn = $id('reset-theme-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          if (!confirm('Reset colors back to default Forest Green?')) return;
          await this.saveAndBroadcast(DEFAULT_THEME);
          this.renderPickers();
          this.renderPresets();
        });
      }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     SITE SETTINGS & SEO
  ══════════════════════════════════════════════════════════════ */
  const Settings = {
    load() {
      const meta = storage(KEY.META) || {};
      const form = $id('form-meta');
      if (form) {
        form.querySelector('[name="siteTitle"]').value = meta.siteTitle || '';
        form.querySelector('[name="metaDesc"]').value = meta.metaDesc || '';
        form.querySelector('[name="metaKeywords"]').value = meta.metaKeywords || '';
        form.querySelector('[name="ogImage"]').value = meta.ogImage || '';
      }

      const branding = storage(KEY.BRANDING) || {};
      const phone = $id('branding-phone');
      const email = $id('branding-email');
      if (phone) phone.value = branding.phone || '';
      if (email) email.value = branding.email || '';
    },

    bind() {
      const formMeta = $id('form-meta');
      if (formMeta) {
        formMeta.addEventListener('submit', (e) => {
          e.preventDefault();
          const fd = new FormData(formMeta);
          const meta = {
            siteTitle: fd.get('siteTitle'),
            metaDesc: fd.get('metaDesc'),
            metaKeywords: fd.get('metaKeywords'),
            ogImage: fd.get('ogImage')
          };
          storage(KEY.META, meta);
          toast('✓ SEO Meta settings saved!', 'success');
        });
      }

      const saveBrandingBtn = $id('save-branding-btn');
      if (saveBrandingBtn) {
        saveBrandingBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const branding = storage(KEY.BRANDING) || {};
          branding.phone = $id('branding-phone')?.value || '';
          branding.email = $id('branding-email')?.value || '';
          storage(KEY.BRANDING, branding);
          toast('✓ Branding & contact info saved!', 'success');
        });
      }

      const formPass = $id('form-change-pass');
      if (formPass) {
        formPass.addEventListener('submit', (e) => {
          e.preventDefault();
          const fd = new FormData(formPass);
          const res = Auth.changePassword(fd.get('currentPass'), fd.get('newPass'), fd.get('confirmPass'));
          if (res.ok) {
            formPass.reset();
            toast(res.msg, 'success');
          } else {
            toast(res.msg, 'error');
          }
        });
      }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     STAR RATING PICKER WIDGET
  ══════════════════════════════════════════════════════════════ */
  const StarPicker = {
    init(pickerId, fieldName) {
      const c = $id(pickerId);
      if (!c) return;
      const form = c.closest('form');
      const hidden = form ? form.querySelector(`[name="${fieldName}"]`) : null;
      let val = parseInt(hidden?.value) || 5;

      const update = (n) => {
        val = n;
        if (hidden) hidden.value = n;
        $all('.star-pick', c).forEach(s => {
          s.classList.toggle('star-pick--on', parseInt(s.dataset.v) <= n);
        });
      };

      $all('.star-pick', c).forEach(s => {
        s.addEventListener('click', (e) => {
          e.preventDefault();
          update(parseInt(s.dataset.v));
        });
      });

      update(val);
    },

    set(pickerId, val) {
      const c = $id(pickerId);
      if (!c) return;
      const form = c.closest('form');
      const hidden = form ? form.querySelector('[name="rating"]') : null;
      if (hidden) hidden.value = val;
      $all('.star-pick', c).forEach(s => {
        s.classList.toggle('star-pick--on', parseInt(s.dataset.v) <= val);
      });
    }
  };

  /* ══════════════════════════════════════════════════════════════
     DASHBOARD REFRESH
  ══════════════════════════════════════════════════════════════ */
  const Dashboard = {
    async refresh() {
      const quotes = await Quotes.getAll();
      const reviews = await Reviews.getAll();
      const portfolio = await Portfolio.getAll();
      const pendingReviews = reviews.filter(r => !r.approved);

      // KPI Counts
      const totalQ = $id('stat-total-quotes');
      const weekQ = $id('stat-week-quotes');
      const penR = $id('stat-pending-reviews');
      const portC = $id('stat-portfolio-count');

      if (totalQ) totalQ.textContent = quotes.length;
      if (weekQ) {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        weekQ.textContent = quotes.filter(q => new Date(q.createdAt) >= weekAgo).length;
      }
      if (penR) penR.textContent = pendingReviews.length;
      if (portC) portC.textContent = portfolio.length;

      // Monetra Smart Pipeline & Live Review Counters
      const appR = $id('stat-approved-reviews');
      if (appR) appR.textContent = reviews.filter(r => r.approved).length;

      const walletTot = $id('wallet-leads-total');
      if (walletTot) walletTot.textContent = (quotes.length || 0) + ' Leads';

      // Update Monetra Quick Contact Avatars
      const quickAvatars = $id('quick-avatars-row');
      if (quickAvatars && quotes.length) {
        const topQuotes = quotes.slice(0, 5);
        quickAvatars.innerHTML = topQuotes.map(q => `
          <div class="quick-avatar-item" title="${esc(q.name || 'Client')} - ${esc(q.city || 'FL')}" data-quote-row="${esc(q.id)}">
            <span>${esc(initials(q.name))}</span>
          </div>
        `).join('') + `
          <div class="quick-avatar-item quick-avatar-add" data-section="quotes" title="View all quotes">
            <i class="fa-solid fa-arrow-right"></i>
          </div>
        `;
        $all('[data-quote-row]', quickAvatars).forEach(el => {
          el.addEventListener('click', () => Quotes.openDetail(el.dataset.quoteRow));
        });
      }

      // Badges
      const qBadge = $id('badge-quotes');
      if (qBadge) {
        qBadge.textContent = quotes.length;
        qBadge.hidden = quotes.length === 0;
      }
      const rBadge = $id('badge-reviews');
      if (rBadge) {
        rBadge.textContent = pendingReviews.length;
        rBadge.hidden = pendingReviews.length === 0;
      }

      // Recent Quotes
      const rqList = $id('dash-recent-quotes');
      if (rqList) {
        const recent = quotes.slice(0, 4);
        if (!recent.length) {
          rqList.innerHTML = `<div class="empty-state"><i class="fa-regular fa-folder-open"></i><p>${esc(I18N[currentLang].noQuotesYet)}</p></div>`;
        } else {
          rqList.innerHTML = recent.map(q => {
            const serv = Array.isArray(q.services) ? q.services[0] : (q.services || 'Lawn Care');
            return `
              <div class="dash-quote-row" data-quote-row="${esc(q.id)}" style="cursor:pointer;">
                <div class="dash-avatar">${initials(q.name)}</div>
                <div class="dash-row-info">
                  <div class="dash-row-name">${esc(q.name || 'Anonymous')}</div>
                  <div class="dash-row-sub">${esc(serv)} · ${esc(q.city || 'FL')}</div>
                </div>
                <div class="dash-row-time">${timeAgo(q.createdAt)}</div>
              </div>
            `;
          }).join('');

          $all('.dash-quote-row', rqList).forEach(row => {
            row.addEventListener('click', () => Quotes.openDetail(row.dataset.quoteRow));
          });
        }
      }

      // Pending Reviews
      const prList = $id('dash-pending-reviews');
      if (prList) {
        if (!pendingReviews.length) {
          prList.innerHTML = `<div class="empty-state"><i class="fa-regular fa-star"></i><p>${esc(I18N[currentLang].noPendingReviews)}</p></div>`;
        } else {
          prList.innerHTML = pendingReviews.slice(0, 3).map(r => `
            <div class="dash-quote-row">
              <div class="dash-avatar" style="background:var(--a-amber-lt);color:var(--a-amber)">${initials(r.name)}</div>
              <div class="dash-row-info">
                <div class="dash-row-name">${esc(r.name)}</div>
                <div class="dash-row-sub">${'★'.repeat(r.rating || 5)} · ${esc(r.city || 'FL')}</div>
              </div>
              <div class="dash-row-time">${timeAgo(r.createdAt)}</div>
            </div>
          `).join('');
        }
      }

      // Realtime Website Traffic & Visitor Analytics
      TrafficAnalytics.render();
    }
  };

  /* ══════════════════════════════════════════════════════════════
     REALTIME WEBSITE TRAFFIC & VISITOR ANALYTICS
  ══════════════════════════════════════════════════════════════ */
  const TrafficAnalytics = {
    currentMetric: 'views', // 'views' | 'unique' | 'quotes'

    getStats() {
      if (window.FLA_Analytics && typeof window.FLA_Analytics.getStats === 'function') {
        return window.FLA_Analytics.getStats();
      }
      return null;
    },

    render() {
      const stats = this.getStats();
      if (!stats) return;

      // Realtime Online Users: genuine live active sessions
      const onlineEl = $id('live-online-users');
      if (onlineEl) {
        onlineEl.textContent = stats.onlineNow || 1;
      }

      // This Week & Nov 2026 Visits
      const weekEl = $id('stat-weekly-visits');
      if (weekEl) weekEl.textContent = Number(stats.weeklyVisits || 0).toLocaleString();

      const monthEl = $id('stat-monthly-visits');
      if (monthEl) monthEl.textContent = Number(stats.monthlyVisits || 0).toLocaleString();

      // Which Pages Are Being Visited Right Now
      const pagesList = $id('active-pages-list');
      const countBadge = $id('active-pages-count');
      if (pagesList && stats.pages) {
        const topPages = stats.pages.slice(0, 6);
        const activeCount = topPages.filter(p => p.activeNow > 0).length;
        if (countBadge) {
          countBadge.textContent = activeCount > 0 ? `${activeCount} Live Active` : 'All Pages Tracked';
        }

        pagesList.innerHTML = topPages.map(p => {
          const isLive = p.activeNow > 0;
          return `
            <div class="active-page-item">
              <div class="page-item-info">
                <span class="page-dot" style="${isLive ? 'background:#16a34a;box-shadow:0 0 8px #16a34a;' : 'background:#94a3b8;'}"></span>
                <span class="page-name" title="${esc(p.name)}">${esc(p.name)}</span>
              </div>
              <span class="page-viewers-badge" style="${isLive ? 'color:#16a34a;font-weight:700;' : ''}">
                ${isLive ? `🟢 ${p.activeNow} online` : `${Number(p.views || 0).toLocaleString()} views`}
              </span>
            </div>
          `;
        }).join('');
      }

      // Update Chart headline and bars based on active metric
      this.updateChart(stats);
    },

    updateChart(stats) {
      if (!stats) stats = this.getStats();
      if (!stats) return;

      const metric = this.currentMetric;
      const history = stats.monthlyHistory || [];

      const headlineEl = $id('chart-traffic-headline');
      const subEl = $id('chart-headline-sub');
      const tooltipEl = $id('peak-bar-tooltip');
      const tfLabel = $id('traffic-timeframe-label');

      if (tfLabel) tfLabel.textContent = '2026';

      const currentMonthData = history[stats.currentMonth] || history[10] || {};

      if (metric === 'views') {
        if (headlineEl) headlineEl.textContent = Number(stats.totalVisits2026 || 0).toLocaleString();
        if (subEl) subEl.textContent = 'Total Page Views in 2026';
        if (tooltipEl) tooltipEl.textContent = `${Number(currentMonthData.views || 0).toLocaleString()} Views`;
      } else if (metric === 'unique') {
        if (headlineEl) headlineEl.textContent = Number(stats.totalUnique2026 || 0).toLocaleString();
        if (subEl) subEl.textContent = 'Unique Visitors in 2026';
        if (tooltipEl) tooltipEl.textContent = `${Number(currentMonthData.unique || 0).toLocaleString()} Uniques`;
      } else if (metric === 'quotes') {
        if (headlineEl) headlineEl.textContent = Number(stats.totalQuotes2026 || 0).toLocaleString();
        if (subEl) subEl.textContent = 'Quote Inquiries in 2026';
        if (tooltipEl) tooltipEl.textContent = `${Number(currentMonthData.quotes || 0).toLocaleString()} Inquiries`;
      }

      // Scale bar heights accurately to max month in 2026
      const vals = history.map(h => (metric === 'views' ? h.views : metric === 'unique' ? h.unique : h.quotes));
      const max = Math.max(...vals, 1);

      const container = $id('traffic-bars-container');
      if (container) {
        const barCols = $all('.bar-col', container);
        barCols.forEach((col, idx) => {
          const val = vals[idx] !== undefined ? vals[idx] : 0;
          const pct = Math.round((val / max) * 88);
          const fill = col.querySelector('.bar-fill');
          if (fill) fill.style.height = Math.max(12, pct) + '%';
        });
      }
    },

    bind() {
      // Tab switcher for chart
      const chartTabs = $id('traffic-chart-tabs');
      if (chartTabs) {
        chartTabs.addEventListener('click', (e) => {
          const btn = e.target.closest('.chart-pill-tab');
          if (!btn) return;
          $all('.chart-pill-tab', chartTabs).forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentMetric = btn.dataset.metric || 'views';
          this.updateChart();
        });
      }

      // Realtime BroadcastChannel & Storage listener
      if (window.BroadcastChannel) {
        try {
          const bc = new BroadcastChannel('fla_analytics_channel');
          bc.onmessage = () => {
            this.render();
          };
        } catch (e) {}
      }

      window.addEventListener('storage', (e) => {
        if (e.key === 'fla_traffic_events' || e.key === 'fla_active_sessions' || e.key === 'fla_page_counts') {
          this.render();
        }
      });

      // Periodic poller (every 2 seconds for continuous live visitors pulse)
      setInterval(() => {
        if (Nav.current === 'dashboard') {
          this.render();
        }
      }, 2000);
    }
  };

  /* ══════════════════════════════════════════════════════════════
     SECTION DISPATCHER
  ══════════════════════════════════════════════════════════════ */
  const Sections = {
    async load(section) {
      if (section === 'dashboard') await Dashboard.refresh();
      if (section === 'quotes') await Quotes.render();
      if (section === 'reviews') {
        await Reviews.renderPending();
        await Reviews.renderApproved();
      }
      if (section === 'portfolio') await Portfolio.render();
      if (section === 'settings') Settings.load();
      if (section === 'colors') {
        await Theme.load();
        Theme.renderPresets();
        Theme.renderPickers();
      }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     TABS MANAGER
  ══════════════════════════════════════════════════════════════ */
  function bindTabs() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      const targetId = btn.dataset.tab;
      if (!targetId) return;

      const parent = btn.closest('section') || document;
      $all('.tab-btn', parent).forEach(b => b.classList.remove('active'));
      $all('.tab-panel', parent).forEach(p => {
        p.classList.remove('active');
        p.setAttribute('hidden', '');
        p.style.display = 'none';
      });

      btn.classList.add('active');
      const panel = $id(targetId);
      if (panel) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
        panel.style.display = 'block';
      }
    });
  }

  /* ══════════════════════════════════════════════════════════════
     INITIALIZATION & BOOT
  ══════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', async () => {
    // 1. Check API availability
    await API.check();

    // 2. Bind modals
    Modals.bindAll();

    // 3. Bind tabs
    bindTabs();

    // 4. Bind navigation
    Nav.bind();

    // 4b. Bind Realtime Traffic Analytics
    TrafficAnalytics.bind();

    // 5. Sidebar toggle
    const sbToggle = $id('sidebar-toggle');
    const app = $id('admin-app');
    const sidebar = $id('sidebar');
    if (sbToggle && app && sidebar) {
      sbToggle.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          sidebar.classList.toggle('mobile-open');
        } else {
          app.classList.toggle('sidebar-collapsed');
          sidebar.classList.toggle('sidebar-collapsed');
        }
      });
    }

    // 6. Header Clock
    const clock = $id('header-clock');
    if (clock) {
      const updateClock = () => {
        clock.textContent = new Date().toLocaleTimeString(currentLang === 'es' ? 'es-ES' : 'en-US', {
          hour: '2-digit', minute: '2-digit', hour12: true
        });
      };
      updateClock();
      setInterval(updateClock, 1000);
    }

    // 7. Login logic
    const loginForm = $id('login-form');
    const togglePass = $id('toggle-password');
    const passIn = $id('login-password');

    if (togglePass && passIn) {
      togglePass.addEventListener('click', () => {
        const isPass = passIn.type === 'password';
        passIn.type = isPass ? 'text' : 'password';
        togglePass.querySelector('i').className = isPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      });
    }

    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const user = $id('login-username').value.trim();
        const pass = $id('login-password').value;
        const errEl = $id('login-error');
        const btn = $id('login-submit-btn');

        if (!user || !pass) {
          if (errEl) {
            errEl.textContent = 'Please enter both username and password.';
            errEl.hidden = false;
          }
          return;
        }

        if (btn) {
          btn.disabled = true;
          btn.querySelector('span').textContent = 'Signing in…';
        }

        const ok = await Auth.login(user, pass);
        if (ok) {
          $id('login-screen').style.display = 'none';
          $id('admin-app').hidden = false;
          $id('admin-app').style.display = 'flex';
          Nav.goto('dashboard');
        } else {
          if (errEl) {
            errEl.textContent = 'Incorrect username or password. Please try again.';
            errEl.hidden = false;
          }
          if (btn) {
            btn.disabled = false;
            btn.querySelector('span').textContent = 'Sign In';
          }
        }
      });
    }

    // Logout
    const logoutBtn = $id('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Log out of admin portal?')) Auth.logout();
      });
    }

    // 8. Bind all core modules
    Quotes.bind();
    Reviews.bind();
    Portfolio.bind();
    PortfolioUpload.bind();
    Settings.bind();
    Theme.bind();

    StarPicker.init('add-star-picker', 'rating');
    StarPicker.init('edit-star-picker', 'rating');

    // 9. Check logged in state
    if (Auth.isLoggedIn()) {
      $id('login-screen').style.display = 'none';
      $id('admin-app').hidden = false;
      $id('admin-app').style.display = 'flex';
      Nav.goto('dashboard');
    } else {
      $id('login-screen').style.display = 'flex';
      $id('admin-app').hidden = true;
      $id('admin-app').style.display = 'none';
    }

    // Apply language preference
    setLanguage(currentLang);

    // 10. Live Poller (every 2.5s) to guarantee instant quote and review sync
    let lastSeenQuotesCount = 0;
    setInterval(async () => {
      if (!Auth.isLoggedIn()) return;
      try {
        const quotes = await Quotes.getAll();
        if (lastSeenQuotesCount > 0 && quotes.length > lastSeenQuotesCount) {
          const newest = quotes[0];
          toast(currentLang === 'es' ? `🔔 ¡Nueva cotización de ${newest.name || 'Cliente'}!` : `🔔 New quote request from ${newest.name || 'Client'}!`, 'success');
          if (Nav.current === 'quotes') await Quotes.render($id('quotes-search')?.value || '');
          Dashboard.refresh();
        }
        lastSeenQuotesCount = quotes.length;
      } catch (err) {}
    }, 2500);
  });

  // Expose API
  window.FLAAdmin = { Modals, Nav, Quotes, Reviews, Portfolio, Theme, Auth, API };
})();
