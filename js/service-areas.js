/**
 * FLA PROPERTY MAINTENANCE LLC — SERVICE AREAS JAVASCRIPT
 * GSAP 3 & ScrollTrigger Animations, Interactive SVG Map Radar & Routes,
 * 16-City Filter Tabs & Live Instant Search
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
                .from('.areas-hero__badge', { opacity: 0, scale: 0.85, duration: 0.6 }, '-=0.3')
                .from('.areas-hero__heading', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
                .from('.areas-hero__subtext', { opacity: 0, y: 25, duration: 0.7 }, '-=0.5')
                .from('.areas-hero__buttons .btn', { opacity: 0, y: 20, stagger: 0.15, duration: 0.6 }, '-=0.4')
                .from('.areas-trust-strip .areas-trust-item', { opacity: 0, y: 15, stagger: 0.12, duration: 0.5 }, '-=0.3');

            // Subtle Hero Parallax
            gsap.to('.areas-hero__bg-img', {
                yPercent: 12,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.areas-hero',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });

            // City Cards Batch Reveal on Scroll
            ScrollTrigger.batch('.city-card', {
                start: 'top 85%',
                onEnter: (batch) => {
                    gsap.fromTo(batch,
                        { opacity: 0, y: 35, scale: 0.96 },
                        { opacity: 1, y: 0, scale: 1, stagger: 0.06, duration: 0.5, ease: 'power2.out' }
                    );
                },
                once: true
            });

            // Corridor Dispatch Table Reveal
            gsap.from('.corridor-table tbody tr', {
                scrollTrigger: {
                    trigger: '.corridor-table-wrap',
                    start: 'top 80%'
                },
                x: 20,
                opacity: 0,
                duration: 0.45,
                stagger: 0.08,
                ease: 'power2.out'
            });

            // Neighborhood Property Cards Reveal (Safe, non-blocking)
            if (document.querySelector('.neighborhood-props-grid')) {
                gsap.from('.prop-type-card', {
                    scrollTrigger: {
                        trigger: '.neighborhood-props-grid',
                        start: 'top 92%',
                        once: true
                    },
                    y: 20,
                    opacity: 0.3,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: 'power2.out',
                    clearProps: 'all'
                });
            }
        }

        // Guaranteed visibility for property type cards
        document.querySelectorAll('.prop-type-card').forEach(el => {
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });

        // ─────────────────────────────────────────────────────────
        // 2. SVG MAP RADAR PULSE & ROUTE DASH ANIMATIONS
        // ─────────────────────────────────────────────────────────
        // Radar pulse rings expanding outward from Lakeland HQ
        const radarTl = gsap.timeline({ repeat: -1 });
        radarTl
            .fromTo('#radarRing1', { r: 15, opacity: 0.8 }, { r: 60, opacity: 0, duration: 2.2, ease: 'power1.out' }, 0)
            .fromTo('#radarRing2', { r: 35, opacity: 0.6 }, { r: 110, opacity: 0, duration: 2.2, ease: 'power1.out' }, 0.5)
            .fromTo('#radarRing3', { r: 60, opacity: 0.4 }, { r: 175, opacity: 0, duration: 2.2, ease: 'power1.out' }, 1.0);

        // Animated dashed route lines flowing from HQ outward
        gsap.to('.map-route-line', {
            strokeDashoffset: -24,
            duration: 1.6,
            ease: 'none',
            repeat: -1
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. MAP PINS & CITY CARDS CROSS-HOVER LINKING
    // ─────────────────────────────────────────────────────────────
    const cityCards = document.querySelectorAll('.city-card');
    const mapNodes = document.querySelectorAll('.map-node');

    cityCards.forEach(card => {
        const cityKey = card.getAttribute('data-city');
        const matchingNode = document.querySelector(`.map-node[data-city="${cityKey}"]`);

        card.addEventListener('mouseenter', () => {
            if (matchingNode) {
                matchingNode.classList.add('is-highlighted');
                const circle = matchingNode.querySelector('.map-node-circle');
                if (circle && typeof gsap !== 'undefined') {
                    gsap.to(circle, { r: 9, fill: '#80b918', duration: 0.25 });
                }
            }
        });

        card.addEventListener('mouseleave', () => {
            if (matchingNode) {
                matchingNode.classList.remove('is-highlighted');
                const circle = matchingNode.querySelector('.map-node-circle');
                if (circle && typeof gsap !== 'undefined') {
                    const originalR = matchingNode.classList.contains('map-node--hq') ? 9 : 5.5;
                    const originalFill = matchingNode.classList.contains('map-node--hq') ? '#80b918' : '#007f5f';
                    gsap.to(circle, { r: originalR, fill: originalFill, duration: 0.25 });
                }
            }
        });
    });

    mapNodes.forEach(node => {
        const cityKey = node.getAttribute('data-city');
        const matchingCard = document.querySelector(`.city-card[data-city="${cityKey}"]`);

        node.addEventListener('click', () => {
            if (matchingCard) {
                matchingCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(matchingCard,
                        { scale: 0.97, borderColor: '#80b918' },
                        { scale: 1, borderColor: '#bcd9aa', duration: 0.6, ease: 'elastic.out(1, 0.4)' }
                    );
                }
            }
        });
    });

    // ─────────────────────────────────────────────────────────────
    // 4. INTERACTIVE CORRIDOR TABS & LIVE SEARCH FILTER
    // ─────────────────────────────────────────────────────────────
    const corridorTabs = document.querySelectorAll('.corridor-tab-btn');
    const searchInput = document.getElementById('citySearchInput');
    let currentCorridor = 'all';

    function filterCityCards() {
        const query = (searchInput ? searchInput.value.toLowerCase().trim() : '');

        cityCards.forEach(card => {
            const cardCorridor = card.getAttribute('data-corridor');
            const cardCity = (card.getAttribute('data-city') || '').toLowerCase();
            const cardCounty = (card.getAttribute('data-county') || '').toLowerCase();
            const cardTitle = (card.querySelector('.city-card__title') ? card.querySelector('.city-card__title').textContent.toLowerCase() : '');
            const cardDesc = (card.querySelector('.city-card__desc') ? card.querySelector('.city-card__desc').textContent.toLowerCase() : '');

            // Check corridor match
            const matchesCorridor = (currentCorridor === 'all' || cardCorridor === currentCorridor);

            // Check search text query match
            const matchesSearch = (!query || 
                cardCity.includes(query) || 
                cardCounty.includes(query) || 
                cardTitle.includes(query) || 
                cardDesc.includes(query)
            );

            if (matchesCorridor && matchesSearch) {
                card.style.display = '';
                if (typeof gsap !== 'undefined') {
                    gsap.fromTo(card,
                        { opacity: 0, scale: 0.95 },
                        { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }
                    );
                } else {
                    card.style.opacity = '1';
                }
            } else {
                if (typeof gsap !== 'undefined') {
                    gsap.to(card, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.2,
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
    }

    // Corridor Tab Switcher
    corridorTabs.forEach(btn => {
        btn.addEventListener('click', () => {
            currentCorridor = btn.getAttribute('data-corridor') || 'all';

            corridorTabs.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            filterCityCards();
        });
    });

    // Real-Time Search Typing Listener
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            filterCityCards();
        });
    }

})();
