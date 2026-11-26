/**
 * FLA PROPERTY MAINTENANCE LLC — FRONTEND DATA SYNC ENGINE (frontend-sync.js)
 * Automatically syncs the public website with changes made in /admin:
 *  1. Live CSS Variable Injection (Colors & Branding)
 *  2. Page Headline & Subheadline Overrides from CMS
 *  3. Dynamic Approval Review Stream (Pending reviews held until approved in /admin)
 *  4. 4-Step Form Real-time Lead Dispatcher to /admin
 *  3. Dynamic Approval Review Stream (Pending reviews held until approved; strict ordering support)
 *  4. Portfolio Realtime Showcase & Ordering Sync
 *  5. 4-Step Form Real-time Lead Dispatcher to /admin
 */

(function () {
    'use strict';

    const STORAGE_KEY = 'fla_site_data';

    function esc(s) {
        if (!s) return '';
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    }

    function getSiteData() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            console.warn('[FLA Sync] Could not parse fla_site_data', e);
            return null;
        }
    }

    function detectPageSlug() {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('about')) return 'about';
        if (path.includes('services') && !path.includes('services/')) return 'services';
        if (path.includes('how-it-works')) return 'how_it_works';
        if (path.includes('portfolio') || path.includes('our-work')) return 'portfolio';
        if (path.includes('service-areas')) return 'service_areas';
        if (path.includes('reviews')) return 'reviews';
        if (path.includes('contact')) return 'contact';
        if (path.includes('faq')) return 'faq';
        return 'home';
    }

    // ─────────────────────────────────────────────────────────────────
    // 1. APPLY DYNAMIC BRAND COLORS (DEFERS TO fla_theme_colors)
    // ─────────────────────────────────────────────────────────────────
    function applyBrandColors(colors) {
        // If master dynamic theme is active, let theme.js manage colors
        if (localStorage.getItem('fla_theme_colors')) return;
        if (!colors) return;
        const root = document.documentElement;

        if (colors.primary) {
            root.style.setProperty('--primary', colors.primary);
            root.style.setProperty('--brand-green', colors.primary);
            root.style.setProperty('--brand-primary', colors.primary);
        }
        if (colors.darkBg) {
            root.style.setProperty('--topbar-bg', colors.darkBg);
            root.style.setProperty('--brand-green-darker', colors.darkBg);
        }
        if (colors.accent) {
            root.style.setProperty('--secondary', colors.accent);
            root.style.setProperty('--brand-accent', colors.accent);
        }
        if (colors.lightBg) {
            root.style.setProperty('--bg-light', colors.lightBg);
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. APPLY CMS PAGE TEXTS
    // ─────────────────────────────────────────────────────────────────
    function applyPageTexts(pageTexts, contact) {
        const slug = detectPageSlug();
        const page = pageTexts ? pageTexts[slug] : null;

        if (page) {
            // Apply H1 if customized
            if (page.h1) {
                const h1 = document.querySelector('h1');
                if (h1 && !h1.hasAttribute('data-no-sync')) {
                    h1.textContent = page.h1;
                }
            }

            // Apply Hero Subheadline if customized
            if (page.subheadline) {
                const subheadline = document.querySelector('.hero__subtext, .about-hero__subtext, .services-hero__subtext, .faq-hero__subtext, .reviews-hero__subtext');
                if (subheadline && !subheadline.hasAttribute('data-no-sync')) {
                    subheadline.textContent = page.subheadline;
                }
            }
        }

        // Apply global phone & hours
        if (contact && contact.phone) {
            const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
            phoneLinks.forEach(link => {
                if (link.hasAttribute('data-sync-phone')) {
                    link.innerHTML = `<i class="fas fa-phone-alt mr-1"></i> ${contact.phone}`;
                }
            });
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // 3. SYNC APPROVED REVIEWS ONTO REVIEWS PAGE & HOMEPAGE (STRICT ORDER)
    // ─────────────────────────────────────────────────────────────────
    function syncApprovedReviews(siteReviews) {
        let list = [];
        try {
            const rawCustom = localStorage.getItem('fla_customer_reviews');
            if (rawCustom) list = JSON.parse(rawCustom);
        } catch (e) {}

        if (!list || !list.length) {
            list = siteReviews || [];
        }

        if (!list || !Array.isArray(list)) return;
        const approved = list.filter(r => r.approved === true || r.status === 'approved');
        const reviewsGrid = document.getElementById('reviewsGrid');

        // If on reviews.html and reviewsGrid exists, inject approved reviews seamlessly
        if (reviewsGrid && approved.length > 0) {
            reviewsGrid.innerHTML = approved.map(rev => {
                const cleanText = (rev.message || rev.text || '').trim();
                let starsHtml = '';
                for (let i = 1; i <= 5; i++) {
                    starsHtml += i <= (rev.rating || 5) ? '<i class="fas fa-star"></i>' : '<i class="far fa-star"></i>';
                }
                const name = rev.name || 'Anonymous';
                const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'FL';
                const city = rev.city || 'Lakeland';
                const role = rev.role || rev.propertyType || 'Residential Client';
                const service = rev.service || 'Lawn Mowing & Edging';

                return `
                    <article class="review-card review-card--approved-sync" data-service="${esc(service)}" data-city="${esc(city)}" data-property="${esc(role)}">
                        <div class="review-card__header">
                            <div class="review-card__user">
                                <div class="review-card__avatar">
                                    ${rev.avatarUrl ? `<img src="${rev.avatarUrl}" alt="${esc(name)}" class="review-card__avatar-img">` : `<span class="review-card__avatar-text">${initials}</span>`}
                                </div>
                                <div class="review-card__user-info">
                                    <h3 class="review-card__name">
                                        ${esc(name)}
                                        <span class="review-card__verified-badge" title="Verified Client"><i class="fas fa-check-circle"></i> Verified Client</span>
                                    </h3>
                                    <div class="review-card__meta-tags">
                                        <span class="review-card__city"><i class="fas fa-map-marker-alt"></i> ${esc(city)}, FL</span>
                                        <span>&bull;</span>
                                        <span>${esc(role)}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="review-card__rating">
                                <div class="review-card__stars" aria-label="${rev.rating || 5} out of 5 stars">
                                    ${starsHtml}
                                </div>
                                <span class="review-card__rating-num">${(rev.rating || 5).toFixed(1)}</span>
                            </div>
                        </div>
                        <p class="review-card__body">
                            &ldquo;${esc(cleanText)}&rdquo;
                        </p>
                        <div class="review-card__footer">
                            <span class="review-card__service-tag"><i class="fas fa-tag"></i> ${esc(service)}</span>
                        </div>
                    </article>
                `;
            }).join('');
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // 4. SYNC PORTFOLIO GALLERY ONTO PORTFOLIO PAGE & HOMEPAGE
    // ─────────────────────────────────────────────────────────────────
    function syncPortfolio() {
        let list = [];
        try {
            const raw = localStorage.getItem('fla_portfolio');
            if (raw) list = JSON.parse(raw);
        } catch (e) {}

        if (!list || !list.length) return;

        // 1. Sync Bento Gallery on portfolio.html / our-work.html
        const bentoGallery = document.getElementById('bentoGallery');
        if (bentoGallery) {
            bentoGallery.innerHTML = list.map((item, idx) => {
                const isFeatured = idx === 0;
                const spanClass = isFeatured ? 'bento-card--span-8' : 'bento-card--span-4';
                const img = (item.images && item.images[0]) || 'assets/images/landscape-bed-makeover.webp';
                const cat = item.category || 'Landscape';
                const loc = item.location || 'Central Florida';

                return `
                    <article class="bento-card ${spanClass}" data-category="${esc(cat.toLowerCase())}" 
                        data-title="${esc(item.title)}" 
                        data-location="${esc(loc)}" 
                        data-service="${esc(cat)}" 
                        data-type="Residential" 
                        data-turnaround="1 Day"
                        data-image="${esc(img)}"
                        data-desc="${esc(item.description)}">
                        <div class="bento-card__img-wrap">
                            <img src="${esc(img)}" alt="${esc(item.title)}" class="bento-card__img" width="800" height="500" loading="lazy" onerror="if(!this.dataset.erred){this.dataset.erred='1';this.src='assets/images/landscape-bed-makeover.webp';}">
                            <div class="bento-card__overlay"></div>
                        </div>
                        <div class="bento-card__top">
                            <span class="bento-badge-city"><i class="fas fa-map-marker-alt"></i> ${esc(loc)}</span>
                            <span class="bento-badge-cat"><i class="fas fa-star"></i> ${esc(cat)}</span>
                        </div>
                        <div class="bento-card__content">
                            <div class="bento-card__meta-bar">
                                <span class="bento-card__meta-item"><i class="fas fa-home"></i> Residential</span>
                                <span class="bento-card__meta-item"><i class="fas fa-calendar-day"></i> ${esc(item.date || '2026')}</span>
                            </div>
                            <h3 class="bento-card__title">${esc(item.title)}</h3>
                            <p class="bento-card__desc">${esc(item.description)}</p>
                            <span class="bento-card__cta-btn">
                                Quick View Project <i class="fas fa-arrow-right"></i>
                            </span>
                        </div>
                    </article>
                `;
            }).join('');
        }

        // 2. Sync Portfolio Grid on index.html (Homepage)
        const homePortfolioGrid = document.querySelector('#portfolio .portfolio-grid');
        if (homePortfolioGrid) {
            homePortfolioGrid.innerHTML = list.slice(0, 6).map(item => {
                const img = (item.images && item.images[0]) || 'assets/images/landscape-bed-makeover.webp';
                const loc = item.location || 'Central Florida';
                const title = item.title || 'FLA Property Maintenance';
                return `
                    <div class="portfolio-item">
                        <img src="${esc(img)}" alt="${esc(title)} in ${esc(loc)}" width="600" height="400" loading="lazy" onerror="if(!this.dataset.erred){this.dataset.erred='1';this.src='assets/images/landscape-bed-makeover.webp';}">
                        <div class="portfolio-item__overlay">
                            <span class="portfolio-item__badge">${esc(loc).toUpperCase()}</span>
                            <h4 class="portfolio-item__caption">${esc(title)}</h4>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // 5. INTERCEPT QUOTE FORM SUBMISSIONS -> SYNC TO /admin LEADS
    // ─────────────────────────────────────────────────────────────────
    function initQuoteFormSync() {
        const quoteFormEl = document.getElementById('multiStepQuoteForm');
        const submitBtn = document.getElementById('btnFinalSubmit') || document.getElementById('submitQuoteBtn');
        if (!quoteFormEl && !submitBtn) return;

        function handleSync() {
            setTimeout(() => {
                const standalone = localStorage.getItem('fla_quote_leads');
                if (standalone) {
                    try {
                        const parsedLeads = JSON.parse(standalone);
                        const latest = parsedLeads[parsedLeads.length - 1];
                        if (latest) {
                            const siteData = getSiteData();
                            if (siteData && siteData.leads) {
                                if (!siteData.leads.find(l => l.id === latest.id)) {
                                    siteData.leads.unshift({
                                        id: latest.id,
                                        clientName: latest.name || 'Website Visitor',
                                        clientPhone: latest.phone || '',
                                        clientEmail: latest.email || '',
                                        email: latest.email || '',
                                        address: latest.address || '',
                                        city: latest.city || 'Lakeland',
                                        propertyType: latest.propertyType || 'Residential Home',
                                        services: latest.services || [],
                                        frequency: latest.frequency || 'Bi-Weekly Maintenance',
                                        yardCondition: latest.condition || 'Maintained / Normal Height',
                                        gateAccess: latest.gateAccess || 'Wide Gate (Fits Scag)',
                                        replyPreference: latest.contactPref || 'Text Message',
                                        notes: latest.notes || '',
                                        status: 'New',
                                        photos: [],
                                        createdAt: latest.createdAt || new Date().toISOString()
                                    });
                                    localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
                                }
                            }
                        }
                    } catch (err) {
                        console.warn('[FLA Sync] Error syncing quote lead', err);
                    }
                }
            }, 300);
        }

        if (quoteFormEl) quoteFormEl.addEventListener('submit', handleSync);
        if (submitBtn) submitBtn.addEventListener('click', handleSync);
    }

    // ─────────────────────────────────────────────────────────────────
    // 5. INTERCEPT REVIEW SUBMISSION -> MARK AS PENDING FOR MODERATION
    // 6. INTERCEPT REVIEW SUBMISSION -> MARK AS PENDING FOR MODERATION
    // ─────────────────────────────────────────────────────────────────
    function initReviewFormSync() {
        const reviewForm = document.getElementById('customerReviewForm');
        if (!reviewForm) return;

        reviewForm.addEventListener('submit', (e) => {
            const nameInput = document.getElementById('reviewerName');
            const cityInput = document.getElementById('reviewerCity');
            const propertyTypeInput = document.getElementById('reviewerPropertyType');
            const serviceInput = document.getElementById('reviewerService');
            const messageInput = document.getElementById('reviewerMessage');

            if (!nameInput || !messageInput) return;
            const name = nameInput.value.trim();
            const text = messageInput.value.trim();

            if (name && text) {
                const siteData = getSiteData();
                if (siteData && siteData.reviews) {
                    const pendingRev = {
                        id: 'rev_' + Date.now(),
                        name: name,
                        city: cityInput ? cityInput.value : 'Lakeland',
                        propertyType: propertyTypeInput ? propertyTypeInput.value : 'Residential Homeowner',
                        service: serviceInput ? serviceInput.value : 'Lawn Mowing & Edging',
                        rating: 5,
                        text: text,
                        avatarUrl: '',
                        status: 'pending', // Held for moderation!
                        createdAt: new Date().toISOString()
                    };
                    siteData.reviews.unshift(pendingRev);
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
                }
                const pendingRev = {
                    id: 'rev_' + Date.now(),
                    name: name,
                    city: cityInput ? cityInput.value : 'Lakeland',
                    role: propertyTypeInput ? propertyTypeInput.value : 'Residential Homeowner',
                    service: serviceInput ? serviceInput.value : 'Lawn Mowing & Edging',
                    rating: 5,
                    message: text,
                    avatarUrl: '',
                    approved: false, // Held for moderation in /admin
                    createdAt: new Date().toISOString()
                };

                let reviewsList = [];
                try {
                    const raw = localStorage.getItem('fla_customer_reviews');
                    if (raw) reviewsList = JSON.parse(raw);
                } catch (e) {}
                reviewsList.unshift(pendingRev);
                localStorage.setItem('fla_customer_reviews', JSON.stringify(reviewsList));
            }
        });
    }

    // ─────────────────────────────────────────────────────────────────
    // 6. INITIAL RUN & CROSS-TAB EVENT LISTENER
    // ─────────────────────────────────────────────────────────────────
    function runSync() {
        const data = getSiteData();
        if (data && data.site_settings) {
            applyBrandColors(data.site_settings.colors);
            applyPageTexts(data.site_settings.page_texts, data.site_settings.contact);
        }
        syncApprovedReviews(data ? data.reviews : null);
        syncPortfolio();
    }

    document.addEventListener('DOMContentLoaded', () => {
        runSync();
        initQuoteFormSync();
        initReviewFormSync();

        // Automatically load realtime analytics tracker across all website pages
        if (typeof window !== 'undefined' && !window.FLA_Analytics && !window.location.pathname.includes('/admin')) {
            const s = document.createElement('script');
            const isSub = window.location.pathname.includes('/services/');
            s.src = isSub ? '../js/analytics.js' : 'js/analytics.js';
            s.defer = true;
            document.head.appendChild(s);
        }
    });

    // Cross-tab sync
    window.addEventListener('storage', (e) => {
        if (!e.key || e.key === STORAGE_KEY || e.key === 'fla_customer_reviews' || e.key === 'fla_portfolio' || e.key === 'fla_theme_colors') {
            runSync();
        }
    });

    // Broadcast channel sync
    if (window.BroadcastChannel) {
        try {
            const bc = new BroadcastChannel('fla_analytics_channel');
            bc.onmessage = () => {
                runSync();
            };
        } catch (e) {}
    }

})();
