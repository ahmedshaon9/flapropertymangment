/* ═══════════════════════════════════════════════════════════════════
   FLA PROPERTY MAINTENANCE LLC — ABOUT US PAGE JAVASCRIPT
   GSAP ScrollTrigger Animations, Sticky Header, Mobile Drawer
   ═══════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── REGISTER GSAP PLUGINS ──────────────────────────────────── */
    const hasGSAP = typeof gsap !== 'undefined';
    const hasScrollTrigger = typeof ScrollTrigger !== 'undefined';

    if (hasGSAP && hasScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
    }

    /* ─── STICKY HEADER SCROLL EFFECT ────────────────────────────── */
    const header = document.getElementById('header');
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (header) {
            if (currentScroll > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        if (backToTop) {
            if (currentScroll > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
    }, { passive: true });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ─── MOBILE DRAWER MENU ─────────────────────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileDrawerOverlay = document.getElementById('mobileDrawerOverlay');
    const mobileDrawerClose = document.getElementById('mobileDrawerClose');
    const drawerLinks = document.querySelectorAll('.mobile-drawer__link');

    function openMobileDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMobileDrawer() {
        if (!mobileDrawer) return;
        mobileDrawer.classList.remove('is-open');
        document.body.style.overflow = '';
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
    }

    if (hamburger) hamburger.addEventListener('click', openMobileDrawer);
    if (mobileDrawerClose) mobileDrawerClose.addEventListener('click', closeMobileDrawer);
    if (mobileDrawerOverlay) mobileDrawerOverlay.addEventListener('click', closeMobileDrawer);

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeMobileDrawer);
    });

    /* ═══════════════════════════════════════════════════════════════
       GSAP SCROLL-TRIGGERED ANIMATIONS — ABOUT PAGE
       ═══════════════════════════════════════════════════════════════ */
    if (!hasGSAP || !hasScrollTrigger) return;

    // Defaults
    gsap.defaults({ ease: 'power3.out', duration: 0.9 });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 769px)', () => {

        /* ─── HERO ENTRANCE ──────────────────────────────────────── */
        const heroTl = gsap.timeline({ delay: 0.15 });

        heroTl
            .from('.breadcrumb', { opacity: 0, y: -15, duration: 0.5 });

        if (document.querySelector('.about-hero__badge')) {
            heroTl.from('.about-hero__badge', { opacity: 0, y: 20, scale: 0.9, duration: 0.6 }, '-=0.3');
        }

        heroTl
            .from(['.about-hero__heading', '.services-hero__heading'], { opacity: 0, y: 30, duration: 0.7 }, '-=0.35')
            .from(['.about-hero__subtext', '.services-hero__subtext'], { opacity: 0, y: 25, duration: 0.6 }, '-=0.35')
            .from(['.about-hero__buttons .btn', '.services-hero__buttons .btn'], {
                opacity: 0, y: 20, stagger: 0.12, duration: 0.5
            }, '-=0.3');

        /* ─── SECTION 2: OUR STORY ───────────────────────────────── */
        // Left images
        gsap.from('.about-story__images', {
            scrollTrigger: {
                trigger: '.about-story-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -60,
            duration: 1
        });

        gsap.from('.guarantee-badge', {
            scrollTrigger: {
                trigger: '.guarantee-badge',
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.5,
            rotate: -15,
            duration: 0.8,
            delay: 0.4
        });

        // Right content
        gsap.from('.about-story__content .badge-pill', {
            scrollTrigger: {
                trigger: '.about-story__content',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.6
        });

        gsap.from('.about-story__content .section-title', {
            scrollTrigger: {
                trigger: '.about-story__content',
                start: 'top 78%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 25,
            duration: 0.7,
            delay: 0.1
        });

        gsap.from('.story-quote', {
            scrollTrigger: {
                trigger: '.story-quote',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -30,
            duration: 0.7
        });

        gsap.from('.about-story__content .about-copy', {
            scrollTrigger: {
                trigger: '.about-story__content .about-copy',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            stagger: 0.15,
            duration: 0.6
        });

        gsap.from('.trust-badge-item', {
            scrollTrigger: {
                trigger: '.trust-badges-row',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 25,
            scale: 0.95,
            stagger: 0.1,
            duration: 0.6
        });

        /* ─── SECTION 3: FLA FORMULA ─────────────────────────────── */
        gsap.from('.fla-formula-section .badge-pill', {
            scrollTrigger: {
                trigger: '.fla-formula-section',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.6
        });

        gsap.from('.fla-formula-section .section-title', {
            scrollTrigger: {
                trigger: '.fla-formula-section',
                start: 'top 78%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 25,
            duration: 0.7,
            delay: 0.1
        });

        gsap.from('.formula-card', {
            scrollTrigger: {
                trigger: '.formula-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            stagger: 0.15,
            duration: 0.8,
            clearProps: 'all',
            onComplete: function () {
                // Re-apply featured card's permanent translateY
                const featured = document.querySelector('.formula-card--featured');
                if (featured) featured.style.transform = 'translateY(-8px)';
            }
        });

        /* ─── SECTION 4: CORE VALUES ─────────────────────────────── */
        gsap.from('.core-values-section .badge-pill', {
            scrollTrigger: {
                trigger: '.core-values-section',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.6
        });

        gsap.from('.core-values-section .section-title', {
            scrollTrigger: {
                trigger: '.core-values-section',
                start: 'top 78%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 25,
            duration: 0.7,
            delay: 0.1
        });

        gsap.from('.value-card', {
            scrollTrigger: {
                trigger: '.values-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 35,
            stagger: 0.12,
            duration: 0.7,
            clearProps: 'all'
        });

        /* ─── SECTION 5: PROPERTIES ──────────────────────────────── */
        gsap.from('.properties-section .badge-pill', {
            scrollTrigger: {
                trigger: '.properties-section',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.6
        });

        gsap.from('.properties-section .section-title', {
            scrollTrigger: {
                trigger: '.properties-section',
                start: 'top 78%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 25,
            duration: 0.7,
            delay: 0.1
        });

        gsap.from('.properties-section .section-intro', {
            scrollTrigger: {
                trigger: '.properties-section',
                start: 'top 76%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.6,
            delay: 0.2
        });

        gsap.from('.property-card', {
            scrollTrigger: {
                trigger: '.properties-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            scale: 0.95,
            stagger: 0.12,
            duration: 0.7,
            clearProps: 'all'
        });

        /* ─── SECTION 6: COMMITMENT ──────────────────────────────── */
        gsap.from('.commitment__content', {
            scrollTrigger: {
                trigger: '.commitment-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -50,
            duration: 0.9
        });

        gsap.from('.commitment-checklist__item', {
            scrollTrigger: {
                trigger: '.commitment-checklist',
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -20,
            stagger: 0.1,
            duration: 0.5
        });

        gsap.from('.commitment__img-box', {
            scrollTrigger: {
                trigger: '.commitment-grid',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 50,
            duration: 0.9
        });

        gsap.from('.commitment__floating-stat', {
            scrollTrigger: {
                trigger: '.commitment__floating-stat',
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            scale: 0.4,
            rotate: -20,
            duration: 0.8,
            delay: 0.3
        });

        /* ─── SECTION 7: BOTTOM CTA ──────────────────────────────── */
        gsap.from('.bottom-cta__content .about-hero__badge', {
            scrollTrigger: {
                trigger: '.bottom-cta-banner',
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            duration: 0.6
        });

        gsap.from('.bottom-cta__heading', {
            scrollTrigger: {
                trigger: '.bottom-cta-banner',
                start: 'top 78%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 30,
            duration: 0.7,
            delay: 0.1
        });

        gsap.from('.bottom-cta__subtext', {
            scrollTrigger: {
                trigger: '.bottom-cta-banner',
                start: 'top 76%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 25,
            duration: 0.6,
            delay: 0.2
        });

        gsap.from('.bottom-cta__buttons .btn', {
            scrollTrigger: {
                trigger: '.bottom-cta__buttons',
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 20,
            stagger: 0.12,
            duration: 0.5,
            delay: 0.1
        });
    });

    /* ─── MOBILE: Simpler fade-in-up for all animated elements ─── */
    mm.add('(max-width: 768px)', () => {
        const mobileAnimElements = [
            '.breadcrumb',
            '.about-hero__badge',
            '.about-hero__heading',
            '.about-hero__subtext',
            '.about-hero__buttons',
            '.about-story__images',
            '.about-story__content .badge-pill',
            '.about-story__content .section-title',
            '.story-quote',
            '.about-copy',
            '.trust-badge-item',
            '.fla-formula-section .badge-pill',
            '.fla-formula-section .section-title',
            '.formula-card',
            '.core-values-section .badge-pill',
            '.core-values-section .section-title',
            '.value-card',
            '.properties-section .badge-pill',
            '.properties-section .section-title',
            '.properties-section .section-intro',
            '.property-card',
            '.commitment__content .badge-pill',
            '.commitment__content .section-title',
            '.commitment__copy',
            '.commitment-checklist__item',
            '.commitment__img-box',
            '.commitment__floating-stat',
            '.bottom-cta__heading',
            '.bottom-cta__subtext',
            '.bottom-cta__buttons .btn'
        ];

        mobileAnimElements.forEach(selector => {
            const els = document.querySelectorAll(selector);
            els.forEach(el => {
                gsap.from(el, {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 92%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 0,
                    y: 25,
                    duration: 0.6,
                    clearProps: 'all'
                });
            });
        });
    });

});
