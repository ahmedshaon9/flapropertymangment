/**
 * FLA PROPERTY MAINTENANCE LLC — HOW IT WORKS JAVASCRIPT
 * GSAP 3 & ScrollTrigger Animations, Interactive Timeline Scrubbing,
 * Scag Lawn Mower Tracker, Real-Time Yard Readiness Meter, and Service Track Tabs
 */

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────
    // 1. GSAP & SCROLLTRIGGER INITIALIZATION
    // ─────────────────────────────────────────────────────────────
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero Entrance Stagger Animation
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        heroTl
            .from('.breadcrumb', { opacity: 0, y: -15, duration: 0.6, delay: 0.1 })
            .from('.hiw-hero__badge', { opacity: 0, scale: 0.85, duration: 0.6 }, '-=0.3')
            .from('.hiw-hero__heading', { opacity: 0, y: 30, duration: 0.8 }, '-=0.4')
            .from('.hiw-hero__subtext', { opacity: 0, y: 25, duration: 0.7 }, '-=0.5')
            .from('.hiw-hero__buttons .btn', { opacity: 0, y: 20, stagger: 0.15, duration: 0.6 }, '-=0.4')
            .from('.hiw-trust-strip .hiw-trust-item', { opacity: 0, y: 15, stagger: 0.12, duration: 0.5 }, '-=0.3');

        // Background subtle parallax
        gsap.to('.hiw-hero__bg-img', {
            yPercent: 12,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hiw-hero',
                start: 'top top',
                end: 'bottom top',
                scrub: true
            }
        });

        // ─────────────────────────────────────────────────────────
        // 2. TIMELINE PROGRESS & SCAG MOWER TRACKER
        // ─────────────────────────────────────────────────────────
        const timelineWrapper = document.querySelector('.hiw-timeline-wrapper');
        const timelineProgress = document.getElementById('timelineProgress');
        const mowerTracker = document.getElementById('mowerTracker');
        const steps = gsap.utils.toArray('.hiw-timeline-step');

        if (timelineWrapper && timelineProgress && mowerTracker) {
            // Animate progress line and mower tracker on scroll
            gsap.timeline({
                scrollTrigger: {
                    trigger: timelineWrapper,
                    start: 'top 70%',
                    end: 'bottom 85%',
                    scrub: 0.8,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        // Move the mower smoothly along the path
                        gsap.set(timelineProgress, { height: `${progress * 100}%` });
                        gsap.set(mowerTracker, { top: `${progress * 100}%` });
                    }
                }
            });

            // Trigger active state on each step node & card as mower reaches it
            steps.forEach((step, index) => {
                const node = step.querySelector('.hiw-timeline-node');
                const card = step.querySelector('.hiw-step-card');

                ScrollTrigger.create({
                    trigger: step,
                    start: 'top 65%',
                    onEnter: () => {
                        if (node) {
                            node.classList.add('active', 'is-active');
                        }
                        if (card) {
                            card.classList.add('active', 'is-active');
                            gsap.fromTo(card,
                                { opacity: 0.75, scale: 0.98 },
                                { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.5)' }
                            );
                        }
                    },
                    onLeaveBack: () => {
                        if (index > 0) {
                            if (node) node.classList.remove('active', 'is-active');
                            if (card) card.classList.remove('active', 'is-active');
                        }
                    }
                });
            });
        }

        // ─────────────────────────────────────────────────────────
        // 3. 3D HOVER TILT ON STEP CARDS (DESKTOP)
        // ─────────────────────────────────────────────────────────
        if (window.matchMedia('(min-width: 992px)').matches) {
            const tiltCards = document.querySelectorAll('.hiw-step-card--tilt, .hiw-payment-card, .hiw-bento-card');

            tiltCards.forEach(card => {
                const xTo = gsap.quickTo(card, 'rotationY', { duration: 0.4, ease: 'power2.out' });
                const yTo = gsap.quickTo(card, 'rotationX', { duration: 0.4, ease: 'power2.out' });

                card.addEventListener('mousemove', (e) => {
                    const rect = card.getBoundingClientRect();
                    const xCenter = rect.left + rect.width / 2;
                    const yCenter = rect.top + rect.height / 2;
                    const mouseX = e.clientX - xCenter;
                    const mouseY = e.clientY - yCenter;

                    const rotateY = (mouseX / (rect.width / 2)) * 5; // Max 5 deg
                    const rotateX = -(mouseY / (rect.height / 2)) * 5;

                    xTo(rotateY);
                    yTo(rotateX);
                });

                card.addEventListener('mouseleave', () => {
                    xTo(0);
                    yTo(0);
                });
            });
        }

        // ─────────────────────────────────────────────────────────
        // 4. GSAP SCROLL REVEALS FOR BENTO & TABLE
        // ─────────────────────────────────────────────────────────
        gsap.fromTo('.hiw-payment-card, .hiw-bento-card:not(.hiw-guarantee-card):not(.hiw-bento-card--featured)',
        { opacity: 0, y: 25 },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.hiw-payment-section',
                start: 'top 85%',
                once: true
            },
            clearProps: 'all'
        }
    );

        gsap.from('.hiw-comparison-table tbody tr, .hiw-table tbody tr', {
            scrollTrigger: {
                trigger: '.hiw-table-wrap',
                start: 'top 85%'
            },
            opacity: 0,
            x: -20,
            duration: 0.45,
            stagger: 0.08,
            ease: 'power2.out'
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 5. SERVICE TRACK SWITCHER (TABS)
    // ─────────────────────────────────────────────────────────────
    const trackBtns = document.querySelectorAll('.hiw-track-btn');
    const trackPanels = {
        'mow-go': document.getElementById('track-mow-go'),
        'routine': document.getElementById('track-routine'),
        'makeover': document.getElementById('track-makeover'),
        'commercial': document.getElementById('track-commercial')
    };

    function activateTrack(targetTrack) {
        // Deactivate all buttons
        trackBtns.forEach(btn => {
            const isTarget = btn.getAttribute('data-track') === targetTrack;
            btn.classList.toggle('active', isTarget);
            btn.classList.toggle('is-active', isTarget);
            btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
        });

        // Switch panels with smooth fade
        Object.keys(trackPanels).forEach(key => {
            const panel = trackPanels[key];
            if (panel) {
                if (key === targetTrack) {
                    panel.style.display = 'block';
                    panel.classList.add('active', 'is-active');
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(panel,
                            { opacity: 0, y: 12 },
                            { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
                        );
                    }
                } else {
                    panel.style.display = 'none';
                    panel.classList.remove('active', 'is-active');
                }
            }
        });
    }

    trackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTrack = btn.getAttribute('data-track');
            activateTrack(targetTrack);
        });
    });

    // Ensure initial active panel is visible on page load
    activateTrack('mow-go');

    // ─────────────────────────────────────────────────────────────
    // 6. YARD PREPARATION READINESS METER
    // ─────────────────────────────────────────────────────────────
    const prepCheckboxes = [
        document.getElementById('prepCheck1'),
        document.getElementById('prepCheck2'),
        document.getElementById('prepCheck3'),
        document.getElementById('prepCheck4')
    ].filter(Boolean);

    const meterFill = document.getElementById('meterFill');
    const meterPercent = document.getElementById('meterPercent');
    const meterStatus = document.getElementById('meterStatus');
    const meterStatusIcon = document.getElementById('meterStatusIcon');
    const meterStatusBox = document.getElementById('meterStatusBox');

    function updateReadinessMeter() {
        if (!meterFill || !meterPercent || !meterStatus) return;

        const total = prepCheckboxes.length;
        const checked = prepCheckboxes.filter(cb => cb.checked).length;
        const percent = Math.round((checked / total) * 100);

        // Animate fill bar
        if (typeof gsap !== 'undefined') {
            gsap.to(meterFill, {
                width: `${percent}%`,
                duration: 0.45,
                ease: 'power2.out'
            });
        } else {
            meterFill.style.width = `${percent}%`;
        }

        // Animate number counter
        meterPercent.textContent = `${percent}%`;

        // Update status text & styles
        if (checked === 0) {
            meterStatus.textContent = '0 of 4 Completed — Yard not ready yet!';
            if (meterStatusIcon) meterStatusIcon.className = 'fas fa-exclamation-triangle';
            meterFill.style.background = '#ef4444';
        } else if (checked === 1) {
            meterStatus.textContent = '1 of 4 Completed — Off to a good start!';
            if (meterStatusIcon) meterStatusIcon.className = 'fas fa-info-circle';
            meterFill.style.background = '#f59e0b';
        } else if (checked === 2) {
            meterStatus.textContent = '2 of 4 Completed — Halfway ready to mow!';
            if (meterStatusIcon) meterStatusIcon.className = 'fas fa-info-circle';
            meterFill.style.background = '#f59e0b';
        } else if (checked === 3) {
            meterStatus.textContent = '3 of 4 Completed — Just one step left!';
            if (meterStatusIcon) meterStatusIcon.className = 'fas fa-bolt';
            meterFill.style.background = 'linear-gradient(90deg, #007f5f, #80b918)';
        } else if (checked === 4) {
            meterStatus.textContent = '4 of 4 Completed — 100% Ready to Mow! 🚀';
            if (meterStatusIcon) meterStatusIcon.className = 'fas fa-check-circle';
            meterFill.style.background = '#80b918';

            // Celebration pulse
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(meterStatusBox,
                    { scale: 0.98 },
                    { scale: 1.02, yoyo: true, repeat: 1, duration: 0.3 }
                );
            }
        }
    }

    // Attach listeners to checkboxes
    prepCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateReadinessMeter);
    });

    // Run initial calculation on page load
    updateReadinessMeter();

})();
