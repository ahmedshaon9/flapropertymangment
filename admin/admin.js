/**
 * FLA PROPERTY MANAGEMENT — ADMIN PANEL ENGINE (admin.js)
 * Full SPA Admin: Auth · Dashboard · Quotes · Reviews · Portfolio · Settings · Theme
 */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════════════
     CONSTANTS & STORAGE KEYS
  ══════════════════════════════════════════════════════════════ */
  const KEY = {
    AUTH:      'fla_admin_auth',
    CREDS:     'fla_admin_creds',
    QUOTES:    'fla_quote_leads',
    REVIEWS:   'fla_admin_reviews',
    PORTFOLIO: 'fla_portfolio',
    META:      'fla_site_meta',
    BRANDING:  'fla_branding',
    THEME:     'fla_theme_colors'
  };

  const DEFAULT_CREDS = { username: 'admin', password: 'FLA@admin2024' };

  const DEFAULT_THEME = {
    primary:    '#007f5f',
    primaryH:   '#00664c',
    secondary:  '#80b918',
    heading:    '#0f172a',
    body:       '#374151',
    btnText:    '#ffffff',
    navBg:      '#ffffff',
    navText:    '#374151',
    heroBg:     '#f8fafc'
  };

  const COLOR_PRESETS = [
    {
      name: 'Forest Green',
      colors: { primary:'#007f5f', primaryH:'#00664c', secondary:'#80b918', heading:'#0f172a', body:'#374151', btnText:'#ffffff', navBg:'#ffffff', navText:'#374151', heroBg:'#f0f9f6' }
    },
    {
      name: 'Ocean Blue',
      colors: { primary:'#1d4ed8', primaryH:'#1e40af', secondary:'#0ea5e9', heading:'#0f172a', body:'#374151', btnText:'#ffffff', navBg:'#ffffff', navText:'#374151', heroBg:'#eff6ff' }
    },
    {
      name: 'Sunset Coral',
      colors: { primary:'#ea580c', primaryH:'#c2410c', secondary:'#f59e0b', heading:'#1c1917', body:'#44403c', btnText:'#ffffff', navBg:'#ffffff', navText:'#44403c', heroBg:'#fff7ed' }
    },
    {
      name: 'Royal Purple',
      colors: { primary:'#7c3aed', primaryH:'#6d28d9', secondary:'#a78bfa', heading:'#1e1b4b', body:'#374151', btnText:'#ffffff', navBg:'#ffffff', navText:'#374151', heroBg:'#f5f3ff' }
    },
    {
      name: 'Midnight Slate',
      colors: { primary:'#0f172a', primaryH:'#1e293b', secondary:'#64748b', heading:'#0f172a', body:'#475569', btnText:'#ffffff', navBg:'#0f172a', navText:'#e2e8f0', heroBg:'#f8fafc' }
    }
  ];

  const COLOR_FIELDS = [
    { id: 'primary',   label: 'Primary / Brand Color',   desc: 'Buttons, links, highlights, active states' },
    { id: 'primaryH',  label: 'Primary Hover',            desc: 'Button hover & active press state' },
    { id: 'secondary', label: 'Secondary / Accent',       desc: 'Accent stripe, secondary elements' },
    { id: 'heading',   label: 'Heading Color',            desc: 'H1, H2, H3 text across the site' },
    { id: 'body',      label: 'Body Text Color',          desc: 'Paragraphs, descriptions, labels' },
    { id: 'btnText',   label: 'Button Text Color',        desc: 'Text inside primary buttons' },
    { id: 'navBg',     label: 'Navigation Background',    desc: 'Main navbar background color' },
    { id: 'navText',   label: 'Navigation Text',          desc: 'Menu link text & icon color' },
    { id: 'heroBg',    label: 'Hero Background',          desc: 'Homepage hero section background tint' }
  ];

  /* ══════════════════════════════════════════════════════════════
     UTILITIES
  ══════════════════════════════════════════════════════════════ */
  function storage(key, value) {
    try {
      if (value === undefined) {
        const v = localStorage.getItem(key);
        return v ? JSON.parse(v) : null;
      }
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) { console.warn('Storage error', e); return null; }
  }

  function esc(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
  }

  function $id(id)   { return document.getElementById(id); }
  function $qs(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return [...(ctx || document).querySelectorAll(sel)]; }

  function fmt(isoStr) {
    if (!isoStr) return '—';
    const d = new Date(isoStr);
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' });
  }

  function timeAgo(isoStr) {
    if (!isoStr) return '';
    const diff = (Date.now() - new Date(isoStr)) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff/60) + 'm ago';
    if (diff < 86400) return Math.floor(diff/3600) + 'h ago';
    if (diff < 604800) return Math.floor(diff/86400) + 'd ago';
    return fmt(isoStr);
  }

  function initials(name) {
    if (!name) return 'FL';
    const p = name.trim().split(/\s+/);
    return p.length === 1 ? p[0].substring(0,2).toUpperCase() : (p[0][0] + p[p.length-1][0]).toUpperCase();
  }

  function toast(msg, type = 'success') {
    const c = $id('toast-container');
    if (!c) return;
    const icon = { success:'fa-circle-check', error:'fa-circle-xmark', info:'fa-circle-info' }[type] || 'fa-circle-check';
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${msg}</span>`;
    c.appendChild(el);
    setTimeout(() => el.remove(), 4000);
  }

  function uuid() {
    return crypto.randomUUID ? crypto.randomUUID()
      : Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  function uid() { return uuid(); }

  /* ══════════════════════════════════════════════════════════════
     AUTH MODULE
  ══════════════════════════════════════════════════════════════ */
  const Auth = {
    isLoggedIn() { return !!storage(KEY.AUTH); },

    login(username, password) {
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
      if (currentPass !== saved.password) return { ok: false, msg: 'Current password is incorrect.' };
      if (newPass !== confirmPass) return { ok: false, msg: 'New passwords do not match.' };
      if (newPass.length < 6) return { ok: false, msg: 'Password must be at least 6 characters.' };
      storage(KEY.CREDS, { username: saved.username, password: newPass });
      return { ok: true, msg: 'Password updated successfully!' };
    }
  };

  /* ══════════════════════════════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════════════════════════════ */
  const Nav = {
    sections: ['dashboard','quotes','reviews','portfolio','settings','colors'],
    current: 'dashboard',

    goto(section) {
      if (!this.sections.includes(section)) return;
      this.current = section;

      // Hide all, show target
      this.sections.forEach(s => {
        const el = $id('section-' + s);
        if (el) { el.classList.remove('active'); el.hidden = true; }
      });
      const target = $id('section-' + section);
      if (target) { target.classList.add('active'); target.hidden = false; }

      // Update nav links
      $all('.nav-link').forEach(a => {
        a.classList.toggle('active', a.dataset.section === section);
      });

      // Update header title
      const titles = {
        dashboard: 'Dashboard', quotes: 'Quote Requests', reviews: 'Reviews',
        portfolio: 'Portfolio', settings: 'Site Settings', colors: 'Theme & Colors'
      };
      const pt = $id('page-title');
      if (pt) pt.textContent = titles[section] || section;

      // Load section data
      Sections.load(section);
    },

    bindLinks() {
      document.addEventListener('click', e => {
        const link = e.target.closest('[data-section]');
        if (!link) return;
        e.preventDefault();
        Nav.goto(link.dataset.section);
      });
    }
  };

  /* ══════════════════════════════════════════════════════════════
     QUOTES MODULE
  ══════════════════════════════════════════════════════════════ */
  const Quotes = {
    getAll()         { return storage(KEY.QUOTES) || []; },
    save(list)       { storage(KEY.QUOTES, list); },

    updateStatus(id, status) {
      const list = this.getAll();
      const q = list.find(q => q.id === id);
      if (q) { q.status = status; this.save(list); }
    },

    isThisWeek(isoStr) {
      const d = new Date(isoStr);
      const now = new Date();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - now.getDay());
      weekStart.setHours(0,0,0,0);
      return d >= weekStart;
    },

    render(filter = '') {
      const tbody = $id('quotes-tbody');
      if (!tbody) return;
      let list = this.getAll();

      // Status filter
      const statusFilter = $id('quotes-status-filter');
      const sf = statusFilter ? statusFilter.value : 'all';
      if (sf !== 'all') list = list.filter(q => (q.status || 'new') === sf);

      // Search
      if (filter) {
        const q = filter.toLowerCase();
        list = list.filter(x =>
          (x.name||'').toLowerCase().includes(q) ||
          (x.email||'').toLowerCase().includes(q) ||
          (x.city||'').toLowerCase().includes(q) ||
          (x.phone||'').toLowerCase().includes(q) ||
          (x.services||[]).join(' ').toLowerCase().includes(q)
        );
      }

      if (!list.length) {
        tbody.innerHTML = `<tr><td colspan="11"><div class="empty-state"><i class="fa-regular fa-folder-open"></i><p>No quote requests found</p></div></td></tr>`;
        return;
      }

      tbody.innerHTML = list.map((q, i) => {
        const status = q.status || 'new';
        const statusBadge = `<span class="status-badge status-badge--${status}">${esc(status.charAt(0).toUpperCase()+status.slice(1))}</span>`;
        return `<tr>
          <td>${list.length - i}</td>
          <td>${fmt(q.createdAt)}</td>
          <td class="table-name-cell">${esc(q.name||'—')}</td>
          <td>${esc(q.phone||'—')}</td>
          <td>${esc(q.email||'—')}</td>
          <td>${esc((q.services||[]).join(', ')||'—')}</td>
          <td>${esc(q.city||'—')}</td>
          <td>${esc(q.propertyType||'—')}</td>
          <td>${esc(q.frequency||'—')}</td>
          <td>${statusBadge}</td>
          <td><div class="table-actions">
            <button class="btn-tbl" title="View details" data-quote-view="${esc(q.id||'')}"><i class="fa-solid fa-eye"></i></button>
            <button class="btn-tbl btn-tbl--danger" title="Delete" data-quote-del="${esc(q.id||'')}"><i class="fa-solid fa-trash"></i></button>
          </div></td>
        </tr>`;
      }).join('');
    },

    openDetail(id) {
      const q = this.getAll().find(x => x.id === id);
      if (!q) return;
      const body = $id('modal-quote-body');
      if (!body) return;
      const fields = [
        ['Name', q.name], ['Email', q.email], ['Phone', q.phone],
        ['Contact Preference', q.contactPref], ['City', q.city],
        ['Address', q.address], ['Property Type', q.propertyType],
        ['Condition', q.condition], ['Gate Access', q.gateAccess],
        ['Frequency', q.frequency], ['Submitted', fmt(q.createdAt)],
        ['Photos', q.photosCount ? q.photosCount + ' attached' : 'None']
      ];
      const services = (q.services||[]).join(', ') || '—';
      const notes = q.notes || '—';
      const status = q.status || 'new';

      body.innerHTML = `
        <div class="quote-detail-grid">
          ${fields.map(([l,v]) => `<div class="quote-detail-item"><label>${esc(l)}</label><p>${esc(v||'—')}</p></div>`).join('')}
          <div class="quote-detail-item quote-detail-full"><label>Services Requested</label><p>${esc(services)}</p></div>
          <div class="quote-detail-item quote-detail-full"><label>Notes / Additional Info</label><p>${esc(notes)}</p></div>
        </div>
        <div class="quote-status-changer">
          <span style="font-size:12.5px;font-weight:700;color:var(--a-text-xs);align-self:center;text-transform:uppercase;letter-spacing:.06em;">Update Status:</span>
          ${['new','contacted','quoted','won','lost'].map(s =>
            `<button class="btn-secondary btn-sm ${s === status ? 'btn-primary' : ''}" data-status-set="${esc(s)}" data-quote-id="${esc(id)}">${s.charAt(0).toUpperCase()+s.slice(1)}</button>`
          ).join('')}
        </div>`;

      // Status change buttons
      $all('[data-status-set]', body).forEach(btn => {
        btn.addEventListener('click', () => {
          Quotes.updateStatus(btn.dataset.quoteId, btn.dataset.statusSet);
          Quotes.render($id('quotes-search')?.value || '');
          Dashboard.refresh();
          Modals.close('modal-quote');
          toast('Status updated to "' + btn.dataset.statusSet + '"', 'success');
        });
      });

      Modals.open('modal-quote');
    },

    deleteQuote(id) {
      if (!confirm('Delete this quote request? This cannot be undone.')) return;
      const list = this.getAll().filter(q => q.id !== id);
      this.save(list);
      this.render($id('quotes-search')?.value || '');
      Dashboard.refresh();
      toast('Quote request deleted.', 'info');
    },

    exportCSV() {
      const list = this.getAll();
      if (!list.length) { toast('No quotes to export.', 'info'); return; }
      const headers = ['#','Date','Name','Email','Phone','Services','City','Property Type','Frequency','Condition','Gate Access','Notes','Status'];
      const rows = list.map((q, i) => [
        list.length - i,
        fmt(q.createdAt),
        q.name||'',
        q.email||'',
        q.phone||'',
        (q.services||[]).join('; '),
        q.city||'',
        q.propertyType||'',
        q.frequency||'',
        q.condition||'',
        q.gateAccess||'',
        (q.notes||'').replace(/"/g,'""'),
        q.status||'new'
      ]);
      const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'fla-quote-requests-' + new Date().toISOString().split('T')[0] + '.csv';
      a.click();
      toast('CSV export downloaded!', 'success');
    },

    bind() {
      // Search
      const search = $id('quotes-search');
      if (search) search.addEventListener('input', () => this.render(search.value));

      // Status filter
      const sf = $id('quotes-status-filter');
      if (sf) sf.addEventListener('change', () => this.render(search?.value || ''));

      // Export
      const expBtn = $id('export-quotes-btn');
      if (expBtn) expBtn.addEventListener('click', () => this.exportCSV());

      // Table actions (delegated)
      const tbl = $id('quotes-table');
      if (tbl) {
        tbl.addEventListener('click', e => {
          const viewBtn = e.target.closest('[data-quote-view]');
          if (viewBtn) { this.openDetail(viewBtn.dataset.quoteView); return; }
          const delBtn = e.target.closest('[data-quote-del]');
          if (delBtn) { this.deleteQuote(delBtn.dataset.quoteDel); }
        });
      }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     REVIEWS MODULE
  ══════════════════════════════════════════════════════════════ */
  const Reviews = {
    getAll()   { return storage(KEY.REVIEWS) || []; },
    save(list) { storage(KEY.REVIEWS, list); this.syncToFrontend(list); },

    // Sync approved reviews to the key the frontend reviews.js reads
    syncToFrontend(list) {
      const approved = list
        .filter(r => r.approved)
        .map(r => ({
          id: r.id, name: r.name, city: r.city || 'Florida',
          propertyType: r.role || 'Homeowner',
          service: r.service || 'Lawn Mowing & Edging',
          rating: r.rating || 5, message: r.message,
          createdAt: r.createdAt, source: 'admin'
        }));
      try { localStorage.setItem('fla_admin_approved_reviews', JSON.stringify(approved)); } catch(e){}
    },

    starsHtml(rating) {
      return Array.from({length:5}, (_,i) =>
        `<i class="fa-${i < rating ? 'solid' : 'regular'} fa-star"></i>`
      ).join('');
    },

    renderPending() {
      const list = this.getAll().filter(r => !r.approved);
      const container = $id('pending-reviews-list');
      const count = $id('count-pending');
      const badge = $id('badge-reviews');
      if (count) count.textContent = list.length;
      if (badge) { badge.textContent = list.length; badge.hidden = !list.length; }
      if (!container) return;
      if (!list.length) {
        container.innerHTML = `<div class="empty-state"><i class="fa-regular fa-clock"></i><p>No pending reviews — inbox is clear! 🎉</p></div>`;
        return;
      }
      container.innerHTML = `<div class="admin-reviews-list">
        ${list.map(r => this.reviewCard(r, 'pending')).join('')}
      </div>`;
      this.bindCardActions(container);
    },

    renderApproved() {
      const list = this.getAll().filter(r => r.approved);
      const container = $id('approved-reviews-list');
      const count = $id('count-approved');
      if (count) count.textContent = list.length;
      if (!container) return;
      if (!list.length) {
        container.innerHTML = `<div class="empty-state"><i class="fa-solid fa-check-circle" style="color:var(--a-success)"></i><p>No approved reviews yet</p></div>`;
        return;
      }
      container.innerHTML = `<div class="admin-reviews-list">
        ${list.map(r => this.reviewCard(r, 'approved')).join('')}
      </div>`;
      this.bindCardActions(container);
    },

    reviewCard(r, context) {
      return `<div class="review-admin-card" data-review-id="${esc(r.id)}">
        <div class="review-admin-avatar">${initials(r.name)}</div>
        <div class="review-admin-body">
          <div class="review-admin-name">${esc(r.name)}</div>
          <div class="review-admin-meta">${esc(r.role||'Homeowner')} · ${esc(r.city||'Florida')} · ${timeAgo(r.createdAt)}</div>
          <div class="review-admin-stars">${this.starsHtml(r.rating||5)}</div>
          <div class="review-admin-text">"${esc(r.message)}"</div>
        </div>
        <div class="review-admin-actions">
          ${context === 'pending'
            ? `<button class="btn-tbl btn-tbl--success" title="Approve & publish" data-rv-approve="${esc(r.id)}"><i class="fa-solid fa-check"></i></button>`
            : `<button class="btn-tbl" title="Unapprove" data-rv-unapprove="${esc(r.id)}"><i class="fa-solid fa-eye-slash"></i></button>`
          }
          <button class="btn-tbl" title="Edit" data-rv-edit="${esc(r.id)}"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-tbl btn-tbl--danger" title="Delete" data-rv-delete="${esc(r.id)}"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`;
    },

    bindCardActions(container) {
      container.addEventListener('click', e => {
        const approve  = e.target.closest('[data-rv-approve]');
        const unapprove= e.target.closest('[data-rv-unapprove]');
        const edit     = e.target.closest('[data-rv-edit]');
        const del      = e.target.closest('[data-rv-delete]');
        if (approve)   { this.approve(approve.dataset.rvApprove, true); }
        if (unapprove) { this.approve(unapprove.dataset.rvUnapprove, false); }
        if (edit)      { this.openEdit(edit.dataset.rvEdit); }
        if (del)       { this.delete(del.dataset.rvDelete); }
      });
    },

    approve(id, val) {
      const list = this.getAll();
      const r = list.find(x => x.id === id);
      if (r) { r.approved = val; this.save(list); }
      this.renderPending();
      this.renderApproved();
      Dashboard.refresh();
      toast(val ? '✅ Review approved and published!' : 'Review unpublished.', val ? 'success' : 'info');
    },

    delete(id) {
      if (!confirm('Delete this review? This cannot be undone.')) return;
      const list = this.getAll().filter(r => r.id !== id);
      this.save(list);
      this.renderPending();
      this.renderApproved();
      Dashboard.refresh();
      toast('Review deleted.', 'info');
    },

    add(formData) {
      const r = {
        id: uid(),
        name: formData.get('name'),
        city: formData.get('city'),
        role: formData.get('role'),
        service: formData.get('service'),
        rating: parseInt(formData.get('rating')) || 5,
        message: formData.get('message'),
        approved: formData.get('approved') === 'on',
        createdAt: new Date().toISOString()
      };
      const list = this.getAll();
      list.unshift(r);
      this.save(list);
      this.renderPending();
      this.renderApproved();
      Dashboard.refresh();
      toast(r.approved ? '✅ Review added and published!' : 'Review added — pending approval.', 'success');
    },

    openEdit(id) {
      const r = this.getAll().find(x => x.id === id);
      if (!r) return;
      const form = $id('form-edit-review');
      if (!form) return;
      form.querySelector('[name="id"]').value = r.id;
      form.querySelector('[name="name"]').value = r.name || '';
      form.querySelector('[name="city"]').value = r.city || '';
      form.querySelector('[name="role"]').value = r.role || '';
      form.querySelector('[name="message"]').value = r.message || '';
      form.querySelector('[name="rating"]').value = r.rating || 5;
      StarPicker.set('edit-star-picker', r.rating || 5);
      Modals.open('modal-review-edit');
    },

    saveEdit(formData) {
      const id = formData.get('id');
      const list = this.getAll();
      const r = list.find(x => x.id === id);
      if (!r) return;
      r.name    = formData.get('name');
      r.city    = formData.get('city');
      r.role    = formData.get('role');
      r.message = formData.get('message');
      r.rating  = parseInt(formData.get('rating')) || 5;
      this.save(list);
      this.renderPending();
      this.renderApproved();
      Modals.close('modal-review-edit');
      toast('Review updated!', 'success');
    },

    bind() {
      // Add review form
      const addForm = $id('form-add-review');
      if (addForm) {
        addForm.addEventListener('submit', e => {
          e.preventDefault();
          if (!addForm.querySelector('[name="name"]').value.trim()) {
            toast('Please enter reviewer name.', 'error'); return;
          }
          if (!addForm.querySelector('[name="message"]').value.trim()) {
            toast('Please enter review text.', 'error'); return;
          }
          this.add(new FormData(addForm));
          addForm.reset();
          StarPicker.set('add-star-picker', 5);
          addForm.querySelector('[name="rating"]').value = 5;
        });
      }

      // Edit form
      const editForm = $id('form-edit-review');
      if (editForm) {
        editForm.addEventListener('submit', e => {
          e.preventDefault();
          this.saveEdit(new FormData(editForm));
        });
      }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     PORTFOLIO MODULE
  ══════════════════════════════════════════════════════════════ */
  const Portfolio = {
    getAll()   { return storage(KEY.PORTFOLIO) || []; },
    save(list) { storage(KEY.PORTFOLIO, list); },

    render() {
      const grid = $id('portfolio-grid');
      if (!grid) return;
      const list = this.getAll();
      if (!list.length) {
        grid.innerHTML = `<div class="empty-state"><i class="fa-solid fa-images"></i><p>No portfolio items yet. Click "Add Item" to get started.</p></div>`;
        return;
      }
      grid.innerHTML = list.map(p => {
        const thumb = p.images && p.images[0]
          ? `<img src="${esc(p.images[0])}" alt="${esc(p.title)}" class="portfolio-admin-thumb">`
          : `<div class="portfolio-admin-thumb-placeholder"><i class="fa-solid fa-image"></i></div>`;
        return `<div class="portfolio-admin-card">
          ${thumb}
          <div class="portfolio-admin-info">
            <span class="portfolio-admin-category">${esc(p.category||'')}</span>
            <div class="portfolio-admin-title">${esc(p.title)}</div>
            <div class="portfolio-admin-desc">${esc(p.description)}</div>
            <div class="portfolio-admin-actions">
              <button class="btn-secondary btn-sm" data-pf-edit="${esc(p.id)}"><i class="fa-solid fa-pen"></i> Edit</button>
              <button class="btn-secondary btn-sm btn-danger" data-pf-delete="${esc(p.id)}"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
          </div>
        </div>`;
      }).join('');

      grid.addEventListener('click', e => {
        const editBtn = e.target.closest('[data-pf-edit]');
        const delBtn  = e.target.closest('[data-pf-delete]');
        if (editBtn) { this.openEdit(editBtn.dataset.pfEdit); }
        if (delBtn)  { this.delete(delBtn.dataset.pfDelete); }
      });
    },

    openAdd() {
      const form = $id('form-portfolio');
      if (form) form.reset();
      $id('preview-images').innerHTML = '';
      $id('preview-video').innerHTML = '';
      $id('portfolio-modal-title').textContent = 'Add Portfolio Item';
      $id('portfolio-submit-btn').innerHTML = '<i class="fa-solid fa-plus"></i> Add Portfolio Item';
      if (form) form.querySelector('[name="id"]').value = '';
      PortfolioUpload.reset();
      Modals.open('modal-portfolio');
    },

    openEdit(id) {
      const p = this.getAll().find(x => x.id === id);
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
      $id('portfolio-submit-btn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';

      // Restore image previews
      PortfolioUpload.reset();
      PortfolioUpload.existingImages = p.images || [];
      const prevWrap = $id('preview-images');
      if (prevWrap) {
        prevWrap.innerHTML = (p.images||[]).map((src, i) =>
          `<div class="preview-img-item" data-img-idx="${i}">
            <img src="${esc(src)}" alt="Image ${i+1}">
            <button type="button" class="preview-img-remove" data-rm-idx="${i}"><i class="fa-solid fa-xmark"></i></button>
          </div>`
        ).join('');
        $all('[data-rm-idx]', prevWrap).forEach(btn => {
          btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.rmIdx);
            PortfolioUpload.existingImages.splice(idx, 1);
            Portfolio.openEdit(id); // re-open to refresh
          });
        });
      }

      Modals.open('modal-portfolio');
    },

    save_item(formData, images, video) {
      const id = formData.get('id');
      const list = this.getAll();
      const isEdit = !!id;
      const existing = isEdit ? list.find(x => x.id === id) : null;

      const item = {
        id: isEdit ? id : uid(),
        title:       formData.get('title'),
        category:    formData.get('category'),
        description: formData.get('description'),
        location:    formData.get('location'),
        date:        formData.get('date'),
        images:      images,
        video:       video || (existing ? existing.video : null),
        createdAt:   isEdit ? (existing?.createdAt || new Date().toISOString()) : new Date().toISOString(),
        updatedAt:   new Date().toISOString()
      };

      if (isEdit) {
        const idx = list.findIndex(x => x.id === id);
        if (idx > -1) list[idx] = item;
      } else {
        list.unshift(item);
      }

      this.save(list);
      this.render();
      Modals.close('modal-portfolio');
      Dashboard.refresh();
      toast(isEdit ? '✅ Portfolio item updated!' : '✅ Portfolio item added!', 'success');
    },

    delete(id) {
      if (!confirm('Remove this portfolio item? This cannot be undone.')) return;
      const list = this.getAll().filter(x => x.id !== id);
      this.save(list);
      this.render();
      Dashboard.refresh();
      toast('Portfolio item removed.', 'info');
    },

    bind() {
      // Add button
      const addBtn = $id('add-portfolio-btn');
      if (addBtn) addBtn.addEventListener('click', () => this.openAdd());

      // Form submit
      const form = $id('form-portfolio');
      if (form) {
        form.addEventListener('submit', async e => {
          e.preventDefault();
          const submitBtn = $id('portfolio-submit-btn');
          if (!form.querySelector('[name="title"]').value.trim()) {
            toast('Please enter a title.', 'error'); return;
          }
          if (!form.querySelector('[name="description"]').value.trim()) {
            toast('Please enter a description.', 'error'); return;
          }
          if (submitBtn) submitBtn.disabled = true;
          try {
            const images = await PortfolioUpload.getImages();
            const video  = await PortfolioUpload.getVideo();
            this.save_item(new FormData(form), images, video);
          } catch(err) {
            toast(err.message || 'Upload error.', 'error');
          } finally {
            if (submitBtn) submitBtn.disabled = false;
          }
        });
      }
    }
  };

  /* Upload handler */
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
        r.onerror = () => reject(new Error('Could not read file: ' + file.name));
        r.readAsDataURL(file);
      });
    },

    async getImages() {
      const base64s = await Promise.all(this.newFiles.map(f => this.readFile(f)));
      return [...this.existingImages, ...base64s];
    },

    async getVideo() {
      if (!this.newVideo) return null;
      return this.readFile(this.newVideo);
    },

    bind() {
      // Image upload
      const imgZone  = $id('img-drop-zone');
      const imgInput = $id('input-portfolio-images');
      if (imgZone && imgInput) {
        imgZone.addEventListener('click', () => imgInput.click());
        imgInput.addEventListener('change', () => this.handleImages(imgInput.files));
        this.bindDrop(imgZone, files => {
          const imgs = [...files].filter(f => f.type.startsWith('image/'));
          this.handleImages(imgs);
        });
      }

      // Video upload
      const vidZone  = $id('vid-drop-zone');
      const vidInput = $id('input-portfolio-video');
      if (vidZone && vidInput) {
        vidZone.addEventListener('click', () => vidInput.click());
        vidInput.addEventListener('change', () => this.handleVideo(vidInput.files[0]));
        this.bindDrop(vidZone, files => {
          const vid = [...files].find(f => f.type.startsWith('video/'));
          if (vid) this.handleVideo(vid);
        });
      }

      // Logo upload
      const logoZone  = $id('logo-drop-zone');
      const logoInput = $id('input-logo');
      if (logoZone && logoInput) {
        logoZone.addEventListener('click', () => logoInput.click());
        logoInput.addEventListener('change', () => {
          const f = logoInput.files[0];
          if (!f) return;
          if (f.size > 500*1024) { toast('Logo must be under 500 KB.', 'error'); return; }
          const r = new FileReader();
          r.onload = () => {
            const prev = $id('logo-new-preview');
            if (prev) prev.innerHTML = `<img src="${r.result}" style="max-height:60px;margin-top:8px;border-radius:var(--a-radius-sm);">`;
            const branding = storage(KEY.BRANDING) || {};
            branding.logo = r.result;
            storage(KEY.BRANDING, branding);
            toast('Logo saved! Apply changes to see on website.', 'success');
          };
          r.readAsDataURL(f);
        });
      }

      // Favicon upload
      const favZone  = $id('favicon-drop-zone');
      const favInput = $id('input-favicon');
      if (favZone && favInput) {
        favZone.addEventListener('click', () => favInput.click());
        favInput.addEventListener('change', () => {
          const f = favInput.files[0];
          if (!f) return;
          const r = new FileReader();
          r.onload = () => {
            const prev = $id('favicon-preview');
            if (prev) prev.innerHTML = `<img src="${r.result}" style="width:32px;height:32px;margin-top:8px;border-radius:4px;">`;
            const branding = storage(KEY.BRANDING) || {};
            branding.favicon = r.result;
            storage(KEY.BRANDING, branding);
            toast('Favicon saved!', 'success');
          };
          r.readAsDataURL(f);
        });
      }
    },

    handleImages(files) {
      const MAX = 3;
      const existing = this.existingImages.length;
      const remaining = MAX - existing - this.newFiles.length;
      const toAdd = [...files].slice(0, remaining);

      toAdd.forEach(f => {
        if (!f.type.startsWith('image/')) return;
        if (f.size > 3*1024*1024) { toast(`"${f.name}" exceeds 3 MB limit.`, 'error'); return; }
        this.newFiles.push(f);
        const r = new FileReader();
        r.onload = () => {
          const wrap = $id('preview-images');
          if (!wrap) return;
          const item = document.createElement('div');
          item.className = 'preview-img-item';
          item.innerHTML = `<img src="${r.result}" alt="Preview"><button type="button" class="preview-img-remove"><i class="fa-solid fa-xmark"></i></button>`;
          item.querySelector('.preview-img-remove').addEventListener('click', () => {
            const idx = this.newFiles.indexOf(f);
            if (idx > -1) this.newFiles.splice(idx, 1);
            item.remove();
          });
          wrap.appendChild(item);
        };
        r.readAsDataURL(f);
      });

      if ([...files].length > remaining) {
        toast(`Max ${MAX} images allowed. ${[...files].length - remaining} skipped.`, 'info');
      }
    },

    handleVideo(file) {
      if (!file) return;
      if (file.size > 10*1024*1024) { toast('Video must be under 10 MB.', 'error'); return; }
      this.newVideo = file;
      const r = new FileReader();
      r.onload = () => {
        const wrap = $id('preview-video');
        if (!wrap) return;
        wrap.innerHTML = `<video src="${r.result}" controls style="max-width:300px;margin-top:12px;border-radius:var(--a-radius);border:1px solid var(--a-border);"></video>`;
      };
      r.readAsDataURL(file);
    },

    bindDrop(zone, handler) {
      zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('drag-over'); });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        handler(e.dataTransfer.files);
      });
    }
  };

  /* ══════════════════════════════════════════════════════════════
     SITE SETTINGS MODULE
  ══════════════════════════════════════════════════════════════ */
  const Settings = {
    loadMeta() {
      const meta = storage(KEY.META) || {};
      const form = $id('form-meta');
      if (!form) return;
      form.querySelector('[name="siteTitle"]').value     = meta.siteTitle || '';
      form.querySelector('[name="metaDesc"]').value      = meta.metaDesc || '';
      form.querySelector('[name="metaKeywords"]').value  = meta.metaKeywords || '';
      form.querySelector('[name="ogImage"]').value       = meta.ogImage || '';
      this.updateDescCount(meta.metaDesc || '');
    },

    updateDescCount(text) {
      const el = $id('meta-desc-chars');
      if (el) {
        el.textContent = text.length;
        el.style.color = text.length > 160 ? 'var(--a-danger)' : 'var(--a-text-xs)';
      }
    },

    saveMeta(formData) {
      const meta = {
        siteTitle:    formData.get('siteTitle'),
        metaDesc:     formData.get('metaDesc'),
        metaKeywords: formData.get('metaKeywords'),
        ogImage:      formData.get('ogImage')
      };
      storage(KEY.META, meta);
      const msg = $id('meta-save-msg');
      if (msg) { msg.hidden = false; setTimeout(() => msg.hidden = true, 3000); }
      toast('Meta settings saved!', 'success');
    },

    loadBranding() {
      const b = storage(KEY.BRANDING) || {};
      const phone = $id('branding-phone');
      const email = $id('branding-email');
      if (phone) phone.value = b.phone || '';
      if (email) email.value = b.email || '';
    },

    saveBranding() {
      const b = storage(KEY.BRANDING) || {};
      const phone = $id('branding-phone');
      const email = $id('branding-email');
      b.phone = phone ? phone.value : '';
      b.email = email ? email.value : '';
      storage(KEY.BRANDING, b);
      const msg = $id('branding-save-msg');
      if (msg) { msg.hidden = false; setTimeout(() => msg.hidden = true, 3000); }
      toast('Branding saved!', 'success');
    },

    bind() {
      const metaForm = $id('form-meta');
      if (metaForm) {
        const textarea = metaForm.querySelector('[name="metaDesc"]');
        if (textarea) textarea.addEventListener('input', () => this.updateDescCount(textarea.value));
        metaForm.addEventListener('submit', e => { e.preventDefault(); this.saveMeta(new FormData(metaForm)); });
      }

      const saveBtn = $id('save-branding-btn');
      if (saveBtn) saveBtn.addEventListener('click', () => this.saveBranding());

      const passForm = $id('form-change-pass');
      if (passForm) {
        passForm.addEventListener('submit', e => {
          e.preventDefault();
          const fd = new FormData(passForm);
          const result = Auth.changePassword(fd.get('currentPass'), fd.get('newPass'), fd.get('confirmPass'));
          const fb = $id('pass-change-feedback');
          if (fb) {
            fb.className = `form-feedback form-feedback--${result.ok ? 'ok' : 'error'}`;
            fb.textContent = result.msg;
            fb.hidden = false;
          }
          if (result.ok) { passForm.reset(); toast('Password updated!', 'success'); }
          else { toast(result.msg, 'error'); }
        });
      }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     THEME / COLOR MODULE
  ══════════════════════════════════════════════════════════════ */
  const Theme = {
    current: {},

    load() {
      this.current = { ...DEFAULT_THEME, ...(storage(KEY.THEME) || {}) };
    },

    save(colors) {
      storage(KEY.THEME, colors);
      this.current = colors;
    },

    apply(colors) {
      // Apply to frontend via global key (read by theme.js)
      storage(KEY.THEME, colors);
      this.current = colors;
    },

    renderPresets() {
      const container = $id('preset-swatches');
      if (!container) return;
      const saved = storage(KEY.THEME);
      container.innerHTML = COLOR_PRESETS.map((preset, i) => {
        const isActive = saved && saved.primary === preset.colors.primary;
        return `<div class="preset-swatch ${isActive ? 'active' : ''}" data-preset="${i}" title="Apply ${esc(preset.name)} theme">
          <div class="preset-dots">
            <div class="preset-dot" style="background:${preset.colors.primary}"></div>
            <div class="preset-dot" style="background:${preset.colors.secondary}"></div>
            <div class="preset-dot" style="background:${preset.colors.heading}"></div>
          </div>
          <span class="preset-name">${esc(preset.name)}</span>
        </div>`;
      }).join('');

      container.addEventListener('click', e => {
        const swatch = e.target.closest('[data-preset]');
        if (!swatch) return;
        const preset = COLOR_PRESETS[parseInt(swatch.dataset.preset)];
        this.applyPreset(preset.colors);
        $all('.preset-swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
      });
    },

    renderPickers() {
      const grid = $id('color-pickers-grid');
      if (!grid) return;
      this.load();
      grid.innerHTML = COLOR_FIELDS.map(field => `
        <div class="color-picker-card">
          <label class="color-picker-label">${esc(field.label)}</label>
          <div class="color-picker-row">
            <input type="color" id="cp-${field.id}" value="${esc(this.current[field.id] || '#007f5f')}">
            <input type="text" id="cph-${field.id}" value="${esc(this.current[field.id] || '#007f5f')}" maxlength="7" placeholder="#000000">
          </div>
          <p class="color-picker-desc">${esc(field.desc)}</p>
        </div>`).join('');

      // Sync pickers ↔ hex inputs
      COLOR_FIELDS.forEach(field => {
        const picker = $id('cp-' + field.id);
        const hex    = $id('cph-' + field.id);
        if (picker && hex) {
          picker.addEventListener('input', () => {
            hex.value = picker.value;
            this.updatePreviewFromPickers();
          });
          hex.addEventListener('input', () => {
            if (/^#[0-9a-fA-F]{6}$/.test(hex.value)) {
              picker.value = hex.value;
              this.updatePreviewFromPickers();
            }
          });
        }
      });

      this.updatePreviewFromPickers();
    },

    getCurrentPickerColors() {
      const c = {};
      COLOR_FIELDS.forEach(f => {
        const picker = $id('cp-' + f.id);
        c[f.id] = picker ? picker.value : (this.current[f.id] || DEFAULT_THEME[f.id]);
      });
      return c;
    },

    applyPreset(colors) {
      COLOR_FIELDS.forEach(f => {
        const picker = $id('cp-' + f.id);
        const hex    = $id('cph-' + f.id);
        if (picker && colors[f.id]) picker.value = colors[f.id];
        if (hex    && colors[f.id]) hex.value    = colors[f.id];
      });
      this.updatePreviewFromPickers();
    },

    updatePreviewFromPickers() {
      const c = this.getCurrentPickerColors();
      const previewH  = $id('preview-heading');
      const previewP  = $id('preview-body');
      const previewBtn= $id('preview-button');
      if (previewH)   previewH.style.color = c.heading;
      if (previewP)   previewP.style.color = c.body;
      if (previewBtn) {
        previewBtn.style.background = c.primary;
        previewBtn.style.color      = c.btnText;
        previewBtn.style.border     = 'none';
        previewBtn.style.padding    = '10px 20px';
        previewBtn.style.borderRadius = '8px';
        previewBtn.style.cursor     = 'default';
      }
    },

    bind() {
      const applyBtn = $id('apply-theme-btn');
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          const c = this.getCurrentPickerColors();
          this.apply(c);
          const msg = $id('theme-save-msg');
          if (msg) { msg.hidden = false; setTimeout(() => msg.hidden = true, 4000); }
          toast('✅ Theme colors applied to website!', 'success');
          this.renderPresets(); // refresh active state
        });
      }

      const resetBtn = $id('reset-theme-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (!confirm('Reset to default green theme?')) return;
          localStorage.removeItem(KEY.THEME);
          this.load();
          this.renderPickers();
          this.renderPresets();
          toast('Theme reset to default.', 'info');
        });
      }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     STAR PICKER
  ══════════════════════════════════════════════════════════════ */
  const StarPicker = {
    init(pickerId, hiddenName) {
      const container = $id(pickerId);
      if (!container) return;
      const form = container.closest('form');
      const hidden = form ? form.querySelector(`[name="${hiddenName}"]`) : null;
      let val = parseInt(hidden?.value) || 5;

      function update(n) {
        val = n;
        if (hidden) hidden.value = n;
        $all('.star-pick', container).forEach(s => {
          s.classList.toggle('star-pick--on', parseInt(s.dataset.v) <= n);
        });
      }

      $all('.star-pick', container).forEach(s => {
        s.addEventListener('click', () => update(parseInt(s.dataset.v)));
        s.addEventListener('mouseenter', () => {
          $all('.star-pick', container).forEach(x =>
            x.classList.toggle('star-pick--on', parseInt(x.dataset.v) <= parseInt(s.dataset.v))
          );
        });
      });

      container.addEventListener('mouseleave', () => update(val));
      update(val);
    },

    set(pickerId, val) {
      const container = $id(pickerId);
      if (!container) return;
      const form = container.closest('form');
      const hidden = form ? form.querySelector('[name="rating"]') : null;
      if (hidden) hidden.value = val;
      $all('.star-pick', container).forEach(s => {
        s.classList.toggle('star-pick--on', parseInt(s.dataset.v) <= val);
      });
    }
  };

  /* ══════════════════════════════════════════════════════════════
     MODALS
  ══════════════════════════════════════════════════════════════ */
  const Modals = {
    open(id) {
      const el = $id(id);
      if (el) el.hidden = false;
    },
    close(id) {
      const el = $id(id);
      if (el) el.hidden = true;
    },
    bindAll() {
      document.addEventListener('click', e => {
        const closeBtn = e.target.closest('.modal-close');
        if (closeBtn) this.close(closeBtn.dataset.modal);
        const backdrop = e.target.closest('.modal-backdrop');
        if (backdrop) {
          const modal = backdrop.closest('.modal');
          if (modal) this.close(modal.id);
        }
      });
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
          $all('.modal:not([hidden])').forEach(m => this.close(m.id));
        }
      });
    }
  };

  /* ══════════════════════════════════════════════════════════════
     TABS
  ══════════════════════════════════════════════════════════════ */
  function bindTabs() {
    document.addEventListener('click', e => {
      const btn = e.target.closest('.tab-btn');
      if (!btn) return;
      const targetId = btn.dataset.tab;
      if (!targetId) return;
      const parent = btn.closest('section') || document;
      $all('.tab-btn', parent).forEach(b => b.classList.remove('active'));
      $all('.tab-panel', parent).forEach(p => { p.classList.remove('active'); p.hidden = true; });
      btn.classList.add('active');
      const panel = $id(targetId);
      if (panel) { panel.classList.add('active'); panel.hidden = false; }
    });
  }

  /* ══════════════════════════════════════════════════════════════
     DASHBOARD
  ══════════════════════════════════════════════════════════════ */
  const Dashboard = {
    refresh() {
      const quotes    = Quotes.getAll();
      const reviews   = Reviews.getAll();
      const portfolio = Portfolio.getAll();
      const pending   = reviews.filter(r => !r.approved);

      // Stat cards
      const totalQ = $id('stat-total-quotes');
      const weekQ  = $id('stat-week-quotes');
      const penR   = $id('stat-pending-reviews');
      const portC  = $id('stat-portfolio-count');
      if (totalQ) totalQ.textContent = quotes.length;
      if (weekQ)  weekQ.textContent  = quotes.filter(q => Quotes.isThisWeek(q.createdAt)).length;
      if (penR)   penR.textContent   = pending.length;
      if (portC)  portC.textContent  = portfolio.length;

      // Update nav badges
      const qBadge = $id('badge-quotes');
      if (qBadge) { qBadge.textContent = quotes.length; qBadge.hidden = !quotes.length; }
      const rBadge = $id('badge-reviews');
      if (rBadge) { rBadge.textContent = pending.length; rBadge.hidden = !pending.length; }

      // Recent quotes list
      const rqList = $id('dash-recent-quotes');
      if (rqList) {
        const recent = quotes.slice(0, 5);
        if (!recent.length) {
          rqList.innerHTML = `<div class="empty-state"><i class="fa-regular fa-folder-open"></i><p>No quote requests yet</p></div>`;
        } else {
          rqList.innerHTML = recent.map(q => `
            <div class="dash-quote-row">
              <div class="dash-avatar">${initials(q.name)}</div>
              <div class="dash-row-info">
                <div class="dash-row-name">${esc(q.name||'Unknown')}</div>
                <div class="dash-row-sub">${esc((q.services||[]).slice(0,1).join('')||'—')} · ${esc(q.city||'—')}</div>
              </div>
              <div class="dash-row-time">${timeAgo(q.createdAt)}</div>
            </div>`).join('');
        }
      }

      // Pending reviews
      const prList = $id('dash-pending-reviews');
      if (prList) {
        if (!pending.length) {
          prList.innerHTML = `<div class="empty-state"><i class="fa-regular fa-star"></i><p>No pending reviews</p></div>`;
        } else {
          prList.innerHTML = pending.slice(0, 4).map(r => `
            <div class="dash-quote-row">
              <div class="dash-avatar" style="background:var(--a-amber-lt);color:var(--a-amber)">${initials(r.name)}</div>
              <div class="dash-row-info">
                <div class="dash-row-name">${esc(r.name)}</div>
                <div class="dash-row-sub">${'★'.repeat(r.rating||5)} · ${esc(r.city||'FL')}</div>
              </div>
              <div class="dash-row-time">${timeAgo(r.createdAt)}</div>
            </div>`).join('');
        }
      }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     SECTION LOADER
  ══════════════════════════════════════════════════════════════ */
  const Sections = {
    load(section) {
      if (section === 'dashboard') Dashboard.refresh();
      if (section === 'quotes')    Quotes.render();
      if (section === 'reviews')   { Reviews.renderPending(); Reviews.renderApproved(); }
      if (section === 'portfolio') Portfolio.render();
      if (section === 'settings')  { Settings.loadMeta(); Settings.loadBranding(); }
      if (section === 'colors')    { Theme.renderPresets(); Theme.renderPickers(); }
    }
  };

  /* ══════════════════════════════════════════════════════════════
     CLOCK
  ══════════════════════════════════════════════════════════════ */
  function startClock() {
    const el = $id('header-clock');
    if (!el) return;
    function tick() {
      el.textContent = new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit', hour12: true });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ══════════════════════════════════════════════════════════════
     SIDEBAR TOGGLE
  ══════════════════════════════════════════════════════════════ */
  function bindSidebar() {
    const toggle = $id('sidebar-toggle');
    const app    = $id('admin-app');
    const sidebar= $id('sidebar');
    if (!toggle || !app) return;
    toggle.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('mobile-open');
      } else {
        app.classList.toggle('sidebar-collapsed');
        sidebar.classList.toggle('sidebar-collapsed');
      }
    });
    // Close mobile sidebar on nav click
    $all('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) sidebar.classList.remove('mobile-open');
      });
    });
  }

  /* ══════════════════════════════════════════════════════════════
     LOGIN SCREEN
  ══════════════════════════════════════════════════════════════ */
  function bindLogin() {
    const form   = $id('login-form');
    const toggle = $id('toggle-password');
    const passIn = $id('login-password');

    if (toggle && passIn) {
      toggle.addEventListener('click', () => {
        const isPass = passIn.type === 'password';
        passIn.type = isPass ? 'text' : 'password';
        toggle.querySelector('i').className = isPass ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
      });
    }

    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const username = $id('login-username').value.trim();
        const password = $id('login-password').value;
        const errEl = $id('login-error');
        const btn   = $id('login-submit-btn');

        if (!username || !password) {
          if (errEl) { errEl.textContent = 'Please enter username and password.'; errEl.hidden = false; }
          return;
        }

        if (btn) { btn.disabled = true; btn.querySelector('span').textContent = 'Signing in…'; }

        setTimeout(() => {
          if (Auth.login(username, password)) {
            showApp();
          } else {
            if (errEl) { errEl.textContent = 'Incorrect username or password. Please try again.'; errEl.hidden = false; }
            if (btn)   { btn.disabled = false; btn.querySelector('span').textContent = 'Sign In'; }
          }
        }, 400);
      });
    }
  }

  function showLogin() {
    $id('login-screen').style.display = '';
    $id('admin-app').hidden = true;
  }

  function showApp() {
    $id('login-screen').style.display = 'none';
    $id('admin-app').hidden = false;
    Dashboard.refresh();
  }

  /* ══════════════════════════════════════════════════════════════
     BOOT
  ══════════════════════════════════════════════════════════════ */
  document.addEventListener('DOMContentLoaded', () => {
    bindLogin();
    Modals.bindAll();
    bindTabs();
    Nav.bindLinks();
    bindSidebar();
    startClock();

    if (Auth.isLoggedIn()) {
      showApp();
    } else {
      showLogin();
    }

    // Logout
    const logoutBtn = $id('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', () => {
      if (confirm('Log out of admin portal?')) Auth.logout();
    });

    // Bind all modules
    Quotes.bind();
    Reviews.bind();
    Portfolio.bind();
    PortfolioUpload.bind();
    Settings.bind();
    Theme.bind();

    // Star pickers
    StarPicker.init('add-star-picker', 'rating');
    StarPicker.init('edit-star-picker', 'rating');

    // Initial nav
    Nav.goto('dashboard');
  });

  // Expose minimal public API for debugging
  window.FLAAdmin = { Nav, Quotes, Reviews, Portfolio, Theme, Auth };

})();
