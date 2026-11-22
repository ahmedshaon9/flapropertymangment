/**
 * FLA PROPERTY MAINTENANCE LLC — FAQ JAVASCRIPT (faq.js)
 * GSAP 3, ScrollTrigger & Flip Interactive Mechanics:
 * Smooth Accordion Drawer Animation, Category Filtering,
 * Live Search with Real-Time Keyword Highlighting, and Empty State Handling.
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // Elements
        const faqItems = document.querySelectorAll('.faq-item');
        const catButtons = document.querySelectorAll('.faq-cat-btn');
        const searchInput = document.getElementById('faqSearchInput');
        const searchClear = document.getElementById('searchClear');
        const countDisplay = document.getElementById('visibleCount');
        const emptyState = document.getElementById('faqEmptyState');
        const resetBtn = document.getElementById('faqResetBtn');

        let activeCategory = 'all';
        let searchQuery = '';

        // Store original text content of question and answer for clean highlight replacement
        const originalContent = new Map();
        faqItems.forEach(item => {
            const qEl = item.querySelector('.faq-question');
            const aEl = item.querySelector('.faq-content');
            originalContent.set(item, {
                question: qEl ? qEl.innerHTML : '',
                answer: aEl ? aEl.innerHTML : ''
            });
        });

        // ─────────────────────────────────────────────────────────────
        // 1. GSAP SCROLLTRIGGER INITIAL REVEAL
        // ─────────────────────────────────────────────────────────────
        if (typeof gsap !== 'undefined') {
            if (typeof ScrollTrigger !== 'undefined') {
                gsap.registerPlugin(ScrollTrigger);

                // Hero Stagger Timeline
                const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
                heroTl
                    .from('.breadcrumb', { opacity: 0, y: -15, duration: 0.6, delay: 0.1 })
                    .from('.faq-hero__badge', { opacity: 0, scale: 0.85, duration: 0.5 }, '-=0.3')
                    .from('.faq-hero__heading', { opacity: 0, y: 30, duration: 0.7 }, '-=0.3')
                    .from('.faq-hero__subtext', { opacity: 0, y: 20, duration: 0.6 }, '-=0.4')
                    .from('.faq-search-wrap', { opacity: 0, scale: 0.95, duration: 0.6 }, '-=0.3')
                    .from('.faq-hero__buttons .btn', { opacity: 0, y: 15, stagger: 0.12, duration: 0.5 }, '-=0.3');

                // Stagger reveal of FAQ items
                ScrollTrigger.batch('.faq-item', {
                    start: 'top 88%',
                    onEnter: (batch) => {
                        gsap.fromTo(batch,
                            { opacity: 0, y: 25 },
                            { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', clearProps: 'all' }
                        );
                    },
                    once: true
                });
            }
        }

        // ─────────────────────────────────────────────────────────────
        // 2. ACCORDION EXPANSION / COLLAPSE
        // ─────────────────────────────────────────────────────────────
        function toggleAccordion(item) {
            const isExpanded = item.classList.contains('is-expanded');
            const body = item.querySelector('.faq-body');
            const header = item.querySelector('.faq-header');

            if (isExpanded) {
                // Collapse
                if (typeof gsap !== 'undefined') {
                    gsap.to(body, {
                        height: 0,
                        opacity: 0,
                        duration: 0.35,
                        ease: 'power2.out',
                        onComplete: () => {
                            item.classList.remove('is-expanded');
                            header.setAttribute('aria-expanded', 'false');
                        }
                    });
                } else {
                    body.style.height = '0';
                    body.style.opacity = '0';
                    item.classList.remove('is-expanded');
                    header.setAttribute('aria-expanded', 'false');
                }
            } else {
                // Expand
                item.classList.add('is-expanded');
                header.setAttribute('aria-expanded', 'true');

                if (typeof gsap !== 'undefined') {
                    body.style.height = 'auto';
                    const targetHeight = body.scrollHeight;
                    body.style.height = '0';
                    gsap.to(body, {
                        height: targetHeight,
                        opacity: 1,
                        duration: 0.35,
                        ease: 'power2.out',
                        onComplete: () => {
                            body.style.height = 'auto';
                        }
                    });
                } else {
                    body.style.height = 'auto';
                    body.style.opacity = '1';
                }
            }
        }

        faqItems.forEach(item => {
            const header = item.querySelector('.faq-header');
            if (header) {
                header.addEventListener('click', () => {
                    toggleAccordion(item);
                });
            }
        });

        // Initialize Q1 as expanded
        const firstItem = document.querySelector('.faq-item[data-id="q1"]');
        if (firstItem) {
            firstItem.classList.add('is-expanded');
            const firstHeader = firstItem.querySelector('.faq-header');
            const firstBody = firstItem.querySelector('.faq-body');
            if (firstHeader) firstHeader.setAttribute('aria-expanded', 'true');
            if (firstBody) {
                firstBody.style.height = 'auto';
                firstBody.style.opacity = '1';
            }
        }

        // ─────────────────────────────────────────────────────────────
        // 3. KEYWORD HIGHLIGHTING LOGIC
        // ─────────────────────────────────────────────────────────────
        function applyHighlight(text, term) {
            if (!term) return text;
            // Escape special regex chars
            const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escaped})`, 'gi');
            return text.replace(regex, '<mark class="faq-highlight">$1</mark>');
        }

        function restoreOriginalContent(item) {
            const stored = originalContent.get(item);
            if (!stored) return;
            const qEl = item.querySelector('.faq-question');
            const aEl = item.querySelector('.faq-content');
            if (qEl) qEl.innerHTML = stored.question;
            if (aEl) aEl.innerHTML = stored.answer;
        }

        function updateHighlights(item, term) {
            const stored = originalContent.get(item);
            if (!stored) return;
            const qEl = item.querySelector('.faq-question');
            const aEl = item.querySelector('.faq-content');

            if (!term) {
                restoreOriginalContent(item);
                return;
            }

            if (qEl) qEl.innerHTML = applyHighlight(stored.question, term);
            if (aEl) aEl.innerHTML = applyHighlight(stored.answer, term);
        }

        // ─────────────────────────────────────────────────────────────
        // 4. FILTERING & LIVE SEARCH PIPELINE
        // ─────────────────────────────────────────────────────────────
        function filterFAQs() {
            let visibleCount = 0;
            const query = searchQuery.trim().toLowerCase();

            // Use GSAP Flip if loaded
            let flipState = null;
            if (typeof gsap !== 'undefined' && typeof Flip !== 'undefined') {
                flipState = Flip.getState('.faq-item');
            }

            faqItems.forEach(item => {
                const category = item.getAttribute('data-category');
                const rawQuestion = (originalContent.get(item)?.question || '').toLowerCase();
                const rawAnswer = (originalContent.get(item)?.answer || '').toLowerCase();
                const rawKeywords = (item.getAttribute('data-keywords') || '').toLowerCase();

                const categoryMatch = (activeCategory === 'all' || category === activeCategory);
                const searchMatch = !query || rawQuestion.includes(query) || rawAnswer.includes(query) || rawKeywords.includes(query);

                if (categoryMatch && searchMatch) {
                    item.style.display = 'block';
                    visibleCount++;
                    // Update highlight
                    updateHighlights(item, query);
                } else {
                    item.style.display = 'none';
                    restoreOriginalContent(item);
                }
            });

            // Update counter
            if (countDisplay) {
                countDisplay.textContent = visibleCount;
            }

            // Empty state toggle
            if (emptyState) {
                if (visibleCount === 0) {
                    emptyState.classList.add('is-visible');
                } else {
                    emptyState.classList.remove('is-visible');
                }
            }

            // Search clear button toggle
            if (searchClear) {
                if (query.length > 0) {
                    searchClear.classList.add('is-visible');
                } else {
                    searchClear.classList.remove('is-visible');
                }
            }

            // Animate layout shift with Flip
            if (flipState && typeof Flip !== 'undefined') {
                Flip.from(flipState, {
                    duration: 0.35,
                    ease: 'power3.out',
                    stagger: 0.02,
                    fade: true
                });
            }
        }

        // ─────────────────────────────────────────────────────────────
        // 5. EVENT LISTENERS: CATEGORY TABS & SEARCH
        // ─────────────────────────────────────────────────────────────
        catButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetCat = btn.getAttribute('data-category') || 'all';
                activeCategory = targetCat;

                catButtons.forEach(b => b.classList.remove('is-active'));
                btn.classList.add('is-active');

                filterFAQs();
            });
        });

        // Search input listener
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value;
                filterFAQs();
            });
        }

        // Clear search button
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                searchQuery = '';
                filterFAQs();
                if (searchInput) searchInput.focus();
            });
        }

        // Reset search button inside empty state
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                searchQuery = '';
                activeCategory = 'all';

                catButtons.forEach(b => {
                    b.classList.remove('is-active');
                    if (b.getAttribute('data-category') === 'all') {
                        b.classList.add('is-active');
                    }
                });

                filterFAQs();
            });
        }
    });
})();
