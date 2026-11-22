/* ═══════════════════════════════════════════════════════════════════
   FLA PROPERTY MAINTENANCE LLC — JAVASCRIPT
   GSAP Animations, Interactive Before & After Slider, FAQ Accordion
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

        // Sticky Header styling
        if (header) {
            if (currentScroll > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        // Back to top visibility
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

    /* ─── MOBILE SERVICES ACCORDION TOGGLE ───────────────────────── */
    const mobileServicesToggle = document.getElementById('mobileServicesToggle');
    const mobileServicesSubmenu = document.getElementById('mobileServicesSubmenu');

    if (mobileServicesToggle && mobileServicesSubmenu) {
        mobileServicesToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const isOpen = mobileServicesSubmenu.classList.contains('is-open');
            if (isOpen) {
                mobileServicesSubmenu.classList.remove('is-open');
                mobileServicesToggle.classList.remove('is-active');
                mobileServicesToggle.setAttribute('aria-expanded', 'false');
            } else {
                mobileServicesSubmenu.classList.add('is-open');
                mobileServicesToggle.classList.add('is-active');
                mobileServicesToggle.setAttribute('aria-expanded', 'true');
            }
        });
    }

    const drawerSublinks = document.querySelectorAll('.mobile-drawer__sublink, .mobile-btn');
    drawerSublinks.forEach(link => {
        link.addEventListener('click', closeMobileDrawer);
    });

    /* ─── BEFORE & AFTER COMPARISON SLIDER ───────────────────────── */
    const baSlider = document.getElementById('baSlider');
    const baAfter = document.getElementById('baAfter');
    const baHandle = document.getElementById('baHandle');

    if (baSlider && baAfter && baHandle) {
        let isSliding = false;

        function setSliderPercentage(percentage) {
            if (percentage < 3) percentage = 3;
            if (percentage > 97) percentage = 97;

            baAfter.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
            baHandle.style.left = `${percentage}%`;
            baHandle.setAttribute('aria-valuenow', Math.round(percentage));
        }

        function setSliderPosition(clientX) {
            const rect = baSlider.getBoundingClientRect();
            let offsetX = clientX - rect.left;
            let percentage = (offsetX / rect.width) * 100;
            setSliderPercentage(percentage);
        }

        baSlider.addEventListener('mousedown', (e) => {
            isSliding = true;
            setSliderPosition(e.clientX);
        });

        window.addEventListener('mousemove', (e) => {
            if (!isSliding) return;
            setSliderPosition(e.clientX);
        });

        window.addEventListener('mouseup', () => {
            isSliding = false;
        });

        baSlider.addEventListener('touchstart', (e) => {
            isSliding = true;
            if (e.touches.length > 0) {
                setSliderPosition(e.touches[0].clientX);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (!isSliding) return;
            if (e.touches.length > 0) {
                setSliderPosition(e.touches[0].clientX);
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            isSliding = false;
        });

        // Keyboard arrow support for accessibility
        baSlider.addEventListener('keydown', (e) => {
            const currentPct = parseFloat(baHandle.style.left) || 50;
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                setSliderPercentage(currentPct - 5);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                setSliderPercentage(currentPct + 5);
            }
        });
    }

    /* ─── 1. SERVICES AUTOMATIC SLIDER & ARROWS ─────────────────────── */
    const servicesGrid = document.getElementById('servicesGrid');
    const servPrev = document.getElementById('servPrev');
    const servNext = document.getElementById('servNext');

    if (servicesGrid) {
        let servAutoTimer = null;
        const SERV_INTERVAL = 3600;

        function getServStep() {
            const firstCard = servicesGrid.querySelector('.service-card');
            return firstCard ? firstCard.offsetWidth + 26 : 380;
        }

        function slideServices(direction = 'next') {
            const step = getServStep();
            const maxScroll = servicesGrid.scrollWidth - servicesGrid.clientWidth;
            if (direction === 'next') {
                if (servicesGrid.scrollLeft >= maxScroll - 15) {
                    servicesGrid.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    servicesGrid.scrollBy({ left: step, behavior: 'smooth' });
                }
            } else {
                if (servicesGrid.scrollLeft <= 15) {
                    servicesGrid.scrollTo({ left: maxScroll, behavior: 'smooth' });
                } else {
                    servicesGrid.scrollBy({ left: -step, behavior: 'smooth' });
                }
            }
        }

        function startServAuto() {
            stopServAuto();
            servAutoTimer = setInterval(() => slideServices('next'), SERV_INTERVAL);
        }

        function stopServAuto() {
            if (servAutoTimer) clearInterval(servAutoTimer);
        }

        if (servNext) {
            servNext.addEventListener('click', () => {
                slideServices('next');
                startServAuto();
            });
        }

        if (servPrev) {
            servPrev.addEventListener('click', () => {
                slideServices('prev');
                startServAuto();
            });
        }

        servicesGrid.addEventListener('mouseenter', stopServAuto);
        servicesGrid.addEventListener('mouseleave', startServAuto);
        servicesGrid.addEventListener('touchstart', stopServAuto, { passive: true });
        servicesGrid.addEventListener('touchend', startServAuto, { passive: true });

        startServAuto();
    }

    /* ─── 2. REVIEWS (TESTIMONIALS) AUTOMATIC SLIDER & ARROWS ────────── */
    const testimonialsGrid = document.getElementById('testimonialsGrid');
    const testPrev = document.getElementById('testPrev');
    const testNext = document.getElementById('testNext');

    if (testimonialsGrid) {
        let testAutoTimer = null;
        const TEST_INTERVAL = 4200;

        function getTestStep() {
            const firstCard = testimonialsGrid.querySelector('.review-card');
            return firstCard ? firstCard.offsetWidth + 24 : 360;
        }

        function slideTestimonials(direction = 'next') {
            const step = getTestStep();
            const maxScroll = testimonialsGrid.scrollWidth - testimonialsGrid.clientWidth;
            if (direction === 'next') {
                if (testimonialsGrid.scrollLeft >= maxScroll - 15) {
                    testimonialsGrid.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    testimonialsGrid.scrollBy({ left: step, behavior: 'smooth' });
                }
            } else {
                if (testimonialsGrid.scrollLeft <= 15) {
                    testimonialsGrid.scrollTo({ left: maxScroll, behavior: 'smooth' });
                } else {
                    testimonialsGrid.scrollBy({ left: -step, behavior: 'smooth' });
                }
            }
        }

        function startTestAuto() {
            stopTestAuto();
            testAutoTimer = setInterval(() => slideTestimonials('next'), TEST_INTERVAL);
        }

        function stopTestAuto() {
            if (testAutoTimer) clearInterval(testAutoTimer);
        }

        if (testNext) {
            testNext.addEventListener('click', () => {
                slideTestimonials('next');
                startTestAuto();
            });
        }

        if (testPrev) {
            testPrev.addEventListener('click', () => {
                slideTestimonials('prev');
                startTestAuto();
            });
        }

        testimonialsGrid.addEventListener('mouseenter', stopTestAuto);
        testimonialsGrid.addEventListener('mouseleave', startTestAuto);
        testimonialsGrid.addEventListener('touchstart', stopTestAuto, { passive: true });
        testimonialsGrid.addEventListener('touchend', startTestAuto, { passive: true });

        startTestAuto();
    }

    /* ─── 3. FULLSCREEN QUOTE FORM MODAL CONTROLLER ─────────────────── */
    const quoteModal = document.getElementById('quoteModal');
    const quoteModalContent = document.getElementById('quoteModalContent');
    const quoteModalClose = document.getElementById('quoteModalClose');
    const quoteModalBackdrop = document.getElementById('quoteModalBackdrop');
    const multiQuoteCard = document.querySelector('.multi-quote-card');
    
    let quoteCardOriginalParent = null;
    let quoteCardOriginalSibling = null;

    if (multiQuoteCard) {
        quoteCardOriginalParent = multiQuoteCard.parentElement;
        quoteCardOriginalSibling = multiQuoteCard.nextElementSibling;
    }

    function openQuoteModal() {
        if (!quoteModal || !multiQuoteCard || !quoteModalContent) return;
        
        // Move the 4-step quote form into the modal content container
        quoteModalContent.appendChild(multiQuoteCard);
        
        quoteModal.classList.add('is-open');
        document.body.classList.add('quote-modal-open');
        
        // Close mobile drawer if open
        const mobileDrawer = document.getElementById('mobileDrawer');
        if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
            mobileDrawer.classList.remove('is-open');
            const hamburger = document.getElementById('hamburger');
            if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        }

        // Accessibility focus
        const firstInput = multiQuoteCard.querySelector('input, button');
        if (firstInput) setTimeout(() => firstInput.focus(), 150);
    }

    function closeQuoteModal() {
        if (!quoteModal || !multiQuoteCard) return;
        
        quoteModal.classList.remove('is-open');
        document.body.classList.remove('quote-modal-open');

        // Restore the 4-step quote form back to its original slot in .quote-split-grid
        if (quoteCardOriginalParent) {
            if (quoteCardOriginalSibling && quoteCardOriginalParent.contains(quoteCardOriginalSibling)) {
                quoteCardOriginalParent.insertBefore(multiQuoteCard, quoteCardOriginalSibling);
            } else {
                quoteCardOriginalParent.appendChild(multiQuoteCard);
            }
        }
    }

    // Attach open handler to Navbar quote buttons & triggers
    const quoteTriggers = document.querySelectorAll('a[href="#quote"], .nav-btn--solid, .mobile-btn--solid, [data-open-quote]');
    quoteTriggers.forEach(btn => {
        // Only hook navbar / top triggers that shouldn't just anchor scroll
        if (btn.closest('.header__actions') || btn.closest('.mobile-drawer__footer') || btn.hasAttribute('data-open-quote')) {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openQuoteModal();
            });
        }
    });

    if (quoteModalClose) {
        quoteModalClose.addEventListener('click', closeQuoteModal);
    }

    if (quoteModalBackdrop) {
        quoteModalBackdrop.addEventListener('click', closeQuoteModal);
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && quoteModal && quoteModal.classList.contains('is-open')) {
            closeQuoteModal();
        }
    });

    // Check if URL requests modal directly (e.g. index.html?openQuote=1 or #quote-modal)
    if (window.location.search.includes('openQuote=1') || window.location.hash === '#quote-modal') {
        setTimeout(openQuoteModal, 250);
    }

    /* ─── FAQ ACCORDION (FIRST ITEM GREEN BY DEFAULT) ─────────────── */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const panel = item.querySelector('.faq-panel');
        const icon = item.querySelector('.faq-icon i');

        trigger.addEventListener('click', () => {
            const isCurrentlyActive = item.classList.contains('faq-item--active-green');

            // Close all items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('faq-item--active-green');
                const otherTrigger = otherItem.querySelector('.faq-trigger');
                const otherPanel = otherItem.querySelector('.faq-panel');
                const otherIcon = otherItem.querySelector('.faq-icon i');

                if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                if (otherPanel) otherPanel.style.maxHeight = '0px';
                if (otherIcon) {
                    otherIcon.classList.remove('fa-minus');
                    otherIcon.classList.add('fa-plus');
                }
            });

            // If clicked was not active, open it
            if (!isCurrentlyActive) {
                item.classList.add('faq-item--active-green');
                trigger.setAttribute('aria-expanded', 'true');
                panel.style.maxHeight = panel.scrollHeight + 30 + 'px';
                if (icon) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                }
            }
        });
    });

    /* ─── QUICK QUOTE FORM INTERACTION ───────────────────────────── */
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-check"></i> REQUEST SUBMITTED!';
            submitBtn.style.backgroundColor = '#2d5218';
            submitBtn.disabled = true;

            // Check if success message container exists or create it
            let successBanner = document.getElementById('quoteSuccessMsg');
            if (!successBanner) {
                successBanner = document.createElement('div');
                successBanner.id = 'quoteSuccessMsg';
                successBanner.className = 'quote-success-banner';
                successBanner.innerHTML = `
                    <div style="margin-top:16px; padding:16px 20px; background-color:#edf6e8; border:1.5px solid #007f5f; border-radius:12px; color:#203a11; display:flex; align-items:center; gap:12px; box-shadow: 0 4px 15px rgba(72,131,42,0.15);">
                        <i class="fas fa-check-circle" style="font-size:22px; color:#007f5f; flex-shrink:0;"></i>
                        <div>
                            <strong style="display:block; font-size:14.5px; margin-bottom:2px;">Quote Request Sent Successfully!</strong>
                            <span style="font-size:13.5px; color:#4c5847;">Thank you! Our crew will text or call you at the number provided shortly, or you can call us directly at <strong>(863) 712-8783</strong>.</span>
                        </div>
                    </div>
                `;
                quoteForm.appendChild(successBanner);
            } else {
                successBanner.style.display = 'block';
            }

            setTimeout(() => {
                quoteForm.reset();
                submitBtn.innerHTML = originalHTML;
                submitBtn.style.backgroundColor = '';
                submitBtn.disabled = false;
            }, 1200);
        });
    }

    /* ═══════════════════════════════════════════════════════════════
       GSAP ANIMATIONS (PROGRESSIVE ENHANCEMENT — SAFE VISIBILITY)
       ═══════════════════════════════════════════════════════════════ */
    if (hasGSAP && hasScrollTrigger) {

        // Hero Entrance
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTl
            .from('.hero__badge', {
                y: 25,
                opacity: 0,
                duration: 0.6,
                delay: 0.15,
                clearProps: 'all'
            })
            .from('.hero__heading', {
                y: 35,
                opacity: 0,
                duration: 0.75,
                clearProps: 'all'
            }, '-=0.35')
            .from('.hero__subtext', {
                y: 25,
                opacity: 0,
                duration: 0.65,
                clearProps: 'all'
            }, '-=0.35')
            .from('.hero__buttons .btn', {
                y: 20,
                opacity: 0,
                stagger: 0.12,
                duration: 0.55,
                clearProps: 'all'
            }, '-=0.35');

        // Scroll reveals using safe ScrollTrigger batch / fromTo that clearProps
        function animateOnScroll(selector, varsFrom, varsTo, start = 'top 92%') {
            gsap.utils.toArray(selector).forEach((el, index) => {
                ScrollTrigger.create({
                    trigger: el,
                    start: start,
                    once: true,
                    onEnter: () => {
                        const toVars = Object.assign({}, varsTo, {
                            delay: (varsTo.delay || 0) + (index % 4) * (varsTo.staggerFactor || 0.1),
                            clearProps: 'transform,opacity'
                        });
                        delete toVars.staggerFactor;
                        gsap.fromTo(el, varsFrom, toVars);
                    }
                });
            });
        }

        // Floating Quote Card
        animateOnScroll('.quote-card', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' });

        // About Us
        animateOnScroll('.about-images', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
        animateOnScroll('.about-content', { x: 40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
        animateOnScroll('.feature-item', { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, staggerFactor: 0.08, ease: 'power2.out' });

        // Services Cards
        animateOnScroll('.service-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, staggerFactor: 0.12, ease: 'power2.out' });

        // Step Cards
        animateOnScroll('.step-card', { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.65, staggerFactor: 0.1, ease: 'power2.out' });

        // Portfolio Grid
        animateOnScroll('.portfolio-item', { scale: 0.94, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.65, staggerFactor: 0.08, ease: 'power2.out' });

        // Before & After
        animateOnScroll('.ba-slider-container', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75, ease: 'power2.out' });

        // Testimonials
        animateOnScroll('.review-card', { y: 35, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, staggerFactor: 0.12, ease: 'power2.out' });

        // FAQ Items
        animateOnScroll('.faq-item', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, staggerFactor: 0.08, ease: 'power2.out' });

        /* ─── CONTINUOUS HERO PORTFOLIO MARQUEE SLIDER (GSAP) ────────── */
        const track1 = document.getElementById('heroTrack1');
        const track2 = document.getElementById('heroTrack2');

        if (track1 && track2 && typeof gsap !== 'undefined') {
            // Clone cards to ensure gapless infinite loop
            track1.innerHTML += track1.innerHTML;
            track2.innerHTML += track2.innerHTML;

            // Animate Row 1 (Sliding Left)
            const anim1 = gsap.to(track1, {
                xPercent: -50,
                repeat: -1,
                duration: 25,
                ease: 'none'
            });

            // Animate Row 2 (Sliding Right, opposite direction)
            gsap.set(track2, { xPercent: -50 });
            const anim2 = gsap.to(track2, {
                xPercent: 0,
                repeat: -1,
                duration: 28,
                ease: 'none'
            });

            // Interactive hover slowdown so visitors can comfortably view any photo
            const gallery = document.querySelector('.hero-split__gallery');
            if (gallery) {
                gallery.addEventListener('mouseenter', () => {
                    anim1.timeScale(0.25);
                    anim2.timeScale(0.25);
                });
                gallery.addEventListener('mouseleave', () => {
                    anim1.timeScale(1);
                    anim2.timeScale(1);
                });
            }
        }

        // Refresh triggers once all DOM is parsed
        ScrollTrigger.refresh();

        // Additional refresh on complete window load (after webp images load)
        window.addEventListener('load', () => {
            ScrollTrigger.refresh();
        });
    }

});
