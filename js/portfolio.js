/**
 * FLA PROPERTY MAINTENANCE LLC — OUR WORK / PORTFOLIO JAVASCRIPT
 * GSAP 3 & ScrollTrigger Animations, Interactive Category Filtering,
 * Draggable Before & After Comparison Sliders, and Slide-Over Quick-View Modal
 */

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────
    // 1. GSAP & SCROLLTRIGGER INITIALIZATION
    // ─────────────────────────────────────────────────────────────
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);

            // Hero Entrance Stagger Animation
            const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

            heroTl
                .from('.breadcrumb', { opacity: 0, y: -15, duration: 0.6, delay: 0.1 })
                .from('.portfolio-hero__badge', { opacity: 0, scale: 0.85, duration: 0.6 }, '-=0.3')
                .from('.portfolio-hero__heading', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
                .from('.portfolio-hero__subtext', { opacity: 0, y: 25, duration: 0.7 }, '-=0.5')
                .from('.portfolio-hero__buttons .btn', { opacity: 0, y: 20, stagger: 0.15, duration: 0.6 }, '-=0.4');

            // Subtle Hero Parallax
            gsap.to('.portfolio-hero__bg-img', {
                yPercent: 12,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.portfolio-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // Bento Gallery Batch Reveal on Scroll
            ScrollTrigger.batch('.bento-card', {
                start: 'top 85%',
                onEnter: (batch) => {
                    gsap.fromTo(batch,
                        { opacity: 0, y: 40, scale: 0.96 },
                        { opacity: 1, y: 0, scale: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' }
                    );
                },
                once: true
            });

            // Craftsmanship Section Reveal (Safe, non-blocking reveal)
            if (document.querySelector('.craftsmanship-section')) {
                gsap.from('.craft-card', {
                    scrollTrigger: {
                        trigger: '.craftsmanship-section',
                        start: 'top 90%',
                        once: true
                    },
                    x: -20,
                    opacity: 0.3,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                    clearProps: 'all'
                });

                gsap.from('.craftsmanship-media', {
                    scrollTrigger: {
                        trigger: '.craftsmanship-section',
                        start: 'top 90%',
                        once: true
                    },
                    scale: 0.98,
                    duration: 0.55,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            }
        }

        // Guaranteed visibility for craftsmanship cards and media
        document.querySelectorAll('.craft-card, .craftsmanship-media').forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. INTERACTIVE CATEGORY FILTERING
    // ─────────────────────────────────────────────────────────────
    const filterButtons = document.querySelectorAll('.filter-btn');
    const bentoCards = document.querySelectorAll('.bento-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            // Update active button state
            filterButtons.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Filter cards with smooth scale/fade
            bentoCards.forEach(card => {
                const category = card.getAttribute('data-category');
                const isMatch = (filter === 'all' || category === filter);

                if (isMatch) {
                    card.style.display = '';
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(card,
                            { opacity: 0, scale: 0.92 },
                            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' }
                        );
                    } else {
                        card.style.opacity = '1';
                    }
                } else {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, {
                            opacity: 0,
                            scale: 0.92,
                            duration: 0.25,
                            ease: 'power2.in',
                            onComplete: () => {
                                card.style.display = 'none';
                            }
                        });
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // ─────────────────────────────────────────────────────────────
    // 3. INTERACTIVE BEFORE & AFTER COMPARISON SLIDERS (DRAG & TOUCH)
    // ─────────────────────────────────────────────────────────────
    const compareContainers = document.querySelectorAll('.ba-compare');

    compareContainers.forEach(container => {
        const afterImg = container.querySelector('.ba-img--after');
        const handle = container.querySelector('.ba-handle');
        let isDragging = false;

        function updateSlider(clientX) {
            const rect = container.getBoundingClientRect();
            let offsetX = clientX - rect.left;

            // Constrain between 4% and 96%
            let percent = (offsetX / rect.width) * 100;
            percent = Math.max(4, Math.min(96, percent));

            // Clip path on top image and move handle
            afterImg.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
            handle.style.left = `${percent}%`;
        }

        // Pointer Events (Mouse, Touch, Stylus unified)
        container.addEventListener('pointerdown', (e) => {
            isDragging = true;
            container.setPointerCapture(e.pointerId);
            updateSlider(e.clientX);
        });

        container.addEventListener('pointermove', (e) => {
            if (!isDragging) return;
            updateSlider(e.clientX);
        });

        function stopDrag(e) {
            if (isDragging) {
                isDragging = false;
                try {
                    container.releasePointerCapture(e.pointerId);
                } catch (err) {
                    // Ignore pointer capture release error if already released
                }
            }
        }

        container.addEventListener('pointerup', stopDrag);
        container.addEventListener('pointercancel', stopDrag);

        // Initial default at 50%
        afterImg.style.clipPath = 'inset(0 50% 0 0)';
        handle.style.left = '50%';
    });

    // ─────────────────────────────────────────────────────────────
    // 4. SLIDE-OVER PROJECT QUICK-VIEW MODAL
    // ─────────────────────────────────────────────────────────────
    const projectModal = document.getElementById('projectModal');
    const modalBackdrop = document.getElementById('modalBackdrop');
    const modalClose = document.getElementById('modalClose');

    const modalTitle = document.getElementById('modalTitle');
    const modalImg = document.getElementById('modalImg');
    const modalLocation = document.getElementById('modalLocation');
    const modalService = document.getElementById('modalService');
    const modalType = document.getElementById('modalType');
    const modalTurnaround = document.getElementById('modalTurnaround');
    const modalDesc = document.getElementById('modalDesc');

    function openModal(card) {
        if (!projectModal) return;

        // Hydrate from card data attributes
        const title = card.getAttribute('data-title') || 'Project Showcase';
        const location = card.getAttribute('data-location') || 'Polk County, FL';
        const service = card.getAttribute('data-service') || 'Property Maintenance';
        const type = card.getAttribute('data-type') || 'Residential';
        const turnaround = card.getAttribute('data-turnaround') || '1 Day';
        const image = card.getAttribute('data-image') || 'assets/images/landscape-bed-makeover.webp';
        const desc = card.getAttribute('data-desc') || '';

        if (modalTitle) modalTitle.textContent = title;
        if (modalLocation) modalLocation.textContent = location;
        if (modalService) modalService.textContent = service;
        if (modalType) modalType.textContent = type;
        if (modalTurnaround) modalTurnaround.textContent = turnaround;
        if (modalImg) {
            modalImg.src = image;
            modalImg.alt = title;
        }
        if (modalDesc) modalDesc.textContent = desc;

        // Show modal
        projectModal.classList.add('is-open');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        if (!projectModal) return;
        projectModal.classList.remove('is-open');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Attach click to all bento cards
    bentoCards.forEach(card => {
        card.addEventListener('click', (e) => {
            openModal(card);
        });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Escape key to close
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-open')) {
            closeModal();
        }
    });

    // ── 5. LOAD ADMIN-ADDED PORTFOLIO ITEMS ─────────────────────
    function loadAdminPortfolio() {
        const gallery = document.getElementById('bentoGallery');
        if (!gallery) return;

        let adminItems = [];
        try {
            const raw = localStorage.getItem('fla_portfolio');
            adminItems = raw ? JSON.parse(raw) : [];
        } catch (e) { adminItems = []; }

        if (!adminItems.length) return;

        const catMap = {
            'Lawn Mowing': 'mowing',
            'Landscape Design': 'makeovers',
            'Mulch & Rock': 'mulch-rock',
            'Bush & Hedge': 'tree-hedge',
            'Irrigation': 'makeovers',
            'Yard Cleanup': 'cleanups',
            'One-Time Mow': 'mowing'
        };

        adminItems.forEach(item => {
            const cat = catMap[item.category] || 'makeovers';
            const img = (item.images && item.images.length > 0) ? item.images[0] : 'assets/images/landscape-bed-makeover.webp';
            const location = item.location || 'Central Florida';
            const desc = item.description || '';
            const title = item.title || 'Project Showcase';

            const card = document.createElement('article');
            card.className = 'bento-card bento-card--span-6';
            card.setAttribute('data-category', cat);
            card.setAttribute('data-title', title);
            card.setAttribute('data-location', location);
            card.setAttribute('data-service', item.category || 'Property Maintenance');
            card.setAttribute('data-type', 'Residential / Commercial');
            card.setAttribute('data-turnaround', item.date || 'Completed');
            card.setAttribute('data-image', img);
            card.setAttribute('data-desc', desc);

            card.innerHTML = `
                <div class="bento-card__img-wrap">
                    <img src="${img}" alt="${title}" class="bento-card__img" width="800" height="500" loading="lazy">
                    <div class="bento-card__overlay"></div>
                </div>
                <div class="bento-card__top">
                    <span class="bento-badge-city"><i class="fas fa-map-marker-alt"></i> ${location}</span>
                    <span class="bento-badge-cat"><i class="fas fa-star"></i> ${item.category || 'Portfolio'}</span>
                </div>
                <div class="bento-card__content">
                    <div class="bento-card__meta-bar">
                        <span class="bento-card__meta-item"><i class="fas fa-check-circle"></i> Verified Work</span>
                        <span class="bento-card__meta-item"><i class="fas fa-calendar"></i> ${item.date || 'Recent'}</span>
                    </div>
                    <h3 class="bento-card__title">${title}</h3>
                    <p class="bento-card__desc">${desc}</p>
                    <span class="bento-card__cta-btn">
                        Quick View Project <i class="fas fa-arrow-right"></i>
                    </span>
                </div>
            `;

            card.addEventListener('click', () => openModal(card));
            gallery.prepend(card);
        });
    }

    loadAdminPortfolio();

})();
