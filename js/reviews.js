/**
 * FLA Property Maintenance LLC — Customer Reviews Engine
 * Handles:
 *  1. Interactive 5-star rating widget with GSAP elastic feedback
 *  2. Instant FileReader circular photo/logo avatar preview
 *  3. Dynamic review submission with localStorage persistence
 *  4. GSAP Flip layout re-ordering & celebration pulse
 *  5. Dual-axis filter engine (Service Category Tabs + 16-City Dropdown)
 *  6. Real-time Hero rating dashboard count recalculation
 *  7. ScrollTrigger batch card entrance animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Register GSAP plugins safely if present
    if (typeof gsap !== 'undefined') {
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }
        if (typeof Flip !== 'undefined') {
            gsap.registerPlugin(Flip);
        }
    }

    const STORAGE_KEY = 'fla_customer_reviews';
    const BASE_REVIEW_COUNT = 48;

    // DOM Elements
    const reviewForm = document.getElementById('customerReviewForm');
    const reviewerNameInput = document.getElementById('reviewerName');
    const reviewerPhotoInput = document.getElementById('reviewerPhotoInput');
    const uploadPhotoBtn = document.getElementById('uploadPhotoBtn');
    const photoPreviewBox = document.getElementById('photoPreviewBox');
    const photoPreviewImg = document.getElementById('photoPreviewImg');
    const photoPlaceholderIcon = document.getElementById('photoPlaceholderIcon');
    const reviewerCitySelect = document.getElementById('reviewerCity');
    const reviewerServiceSelect = document.getElementById('reviewerService');
    const reviewerPropertyTypeSelect = document.getElementById('reviewerPropertyType');
    const reviewerMessageInput = document.getElementById('reviewerMessage');
    const submitReviewBtn = document.getElementById('submitReviewBtn');

    const starBtns = document.querySelectorAll('.star-interactive-btn');
    const starFeedback = document.getElementById('starFeedback');
    const starRatingValue = document.getElementById('starRatingValue');

    const reviewsGrid = document.getElementById('reviewsGrid');
    const serviceTabBtns = document.querySelectorAll('.review-tab-btn');
    const cityFilterSelect = document.getElementById('reviewCityFilter');

    const heroReviewCountEl = document.getElementById('heroReviewCount');
    const heroScoreNumEl = document.getElementById('heroScoreNum');

    let currentRating = 5;
    let uploadedPhotoBase64 = null;

    const ratingDescriptions = {
        1: '1.0 — Needs Improvement',
        2: '2.0 — Fair',
        3: '3.0 — Satisfactory Service',
        4: '4.0 — Great Experience! Recommended.',
        5: '5.0 — Exceptional! Best on the block.'
    };

    // ─────────────────────────────────────────────────────────────
    // EXPANDABLE REVIEW FORM TOGGLE CONTROLLER
    // ─────────────────────────────────────────────────────────────
    const leaveReviewSection = document.getElementById('leave-review');
    const openReviewFormBtn = document.getElementById('openReviewFormBtn');
    const closeReviewFormBtn = document.getElementById('closeReviewFormBtn');
    const mobileAddReviewBtn = document.getElementById('mobileAddReviewBtn');

    function openReviewSection(shouldScroll = true) {
        if (!leaveReviewSection) return;
        leaveReviewSection.style.display = 'block';
        leaveReviewSection.classList.add('is-open');

        if (openReviewFormBtn) {
            openReviewFormBtn.setAttribute('aria-expanded', 'true');
            openReviewFormBtn.classList.add('btn--is-active');
            openReviewFormBtn.innerHTML = '<i class="fas fa-times"></i> Close Review Form';
        }

        if (typeof gsap !== 'undefined') {
            gsap.fromTo(leaveReviewSection,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
            );
        }

        if (shouldScroll) {
            leaveReviewSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        setTimeout(() => {
            if (reviewerNameInput) reviewerNameInput.focus();
        }, 350);
    }

    function closeReviewSection() {
        if (!leaveReviewSection) return;

        if (typeof gsap !== 'undefined') {
            gsap.to(leaveReviewSection, {
                opacity: 0,
                y: -15,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: () => {
                    leaveReviewSection.style.display = 'none';
                    leaveReviewSection.classList.remove('is-open');
                }
            });
        } else {
            leaveReviewSection.style.display = 'none';
            leaveReviewSection.classList.remove('is-open');
        }

        if (openReviewFormBtn) {
            openReviewFormBtn.setAttribute('aria-expanded', 'false');
            openReviewFormBtn.classList.remove('btn--is-active');
            openReviewFormBtn.innerHTML = '<i class="fas fa-pen"></i> Leave a Review on This Page';
        }
    }

    function toggleReviewSection() {
        const isOpen = leaveReviewSection && (
            leaveReviewSection.classList.contains('is-open') ||
            leaveReviewSection.style.display === 'block'
        );
        if (isOpen) {
            closeReviewSection();
        } else {
            openReviewSection(true);
        }
    }

    if (openReviewFormBtn) {
        openReviewFormBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleReviewSection();
        });
    }

    if (closeReviewFormBtn) {
        closeReviewFormBtn.addEventListener('click', (e) => {
            e.preventDefault();
            closeReviewSection();
        });
    }

    if (mobileAddReviewBtn) {
        mobileAddReviewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openReviewSection(true);
        });
    }

    // Auto-open if URL hash is #leave-review
    if (window.location.hash === '#leave-review') {
        openReviewSection(true);
    }

    // ─────────────────────────────────────────────────────────────
    // 1. INTERACTIVE STAR RATING WIDGET
    // ─────────────────────────────────────────────────────────────
    function setStarDisplay(rating) {
        starBtns.forEach(btn => {
            const btnVal = parseInt(btn.getAttribute('data-rating'), 10);
            if (btnVal <= rating) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        if (starFeedback) {
            starFeedback.textContent = ratingDescriptions[rating] || `${rating}.0`;
        }
    }

    starBtns.forEach(btn => {
        const val = parseInt(btn.getAttribute('data-rating'), 10);

        btn.addEventListener('mouseenter', () => {
            setStarDisplay(val);
        });

        btn.addEventListener('mouseleave', () => {
            setStarDisplay(currentRating);
        });

        btn.addEventListener('click', () => {
            currentRating = val;
            if (starRatingValue) {
                starRatingValue.value = val;
            }
            setStarDisplay(currentRating);

            // GSAP Elastic bounce on clicked star
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(btn, 
                    { scale: 0.65, rotate: -15 }, 
                    { scale: 1, rotate: 0, duration: 0.5, ease: 'elastic.out(1.2, 0.4)' }
                );
            }
        });
    });

    // ─────────────────────────────────────────────────────────────
    // 2. CLIENT-SIDE FILEREADER PHOTO / LOGO PREVIEW
    // ─────────────────────────────────────────────────────────────
    if (uploadPhotoBtn && reviewerPhotoInput) {
        uploadPhotoBtn.addEventListener('click', () => {
            reviewerPhotoInput.click();
        });
    }

    if (reviewerPhotoInput) {
        reviewerPhotoInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // Enforce file size limit of 5MB
            if (file.size > 5 * 1024 * 1024) {
                alert('Image file size must be under 5MB.');
                reviewerPhotoInput.value = '';
                return;
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                uploadedPhotoBase64 = event.target.result;
                if (photoPreviewImg) {
                    photoPreviewImg.src = uploadedPhotoBase64;
                    photoPreviewImg.style.display = 'block';
                }
                if (photoPlaceholderIcon) {
                    photoPlaceholderIcon.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. PERSISTENCE & HERO DASHBOARD RECALCULATION
    // ─────────────────────────────────────────────────────────────
    function getStoredReviews() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            console.warn('Could not read from localStorage', err);
            return [];
        }
    }

    function saveStoredReviews(reviews) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
        } catch (err) {
            console.warn('Could not save to localStorage', err);
        }
    }

    function updateHeroStats(storedCount) {
        const total = BASE_REVIEW_COUNT + storedCount;
        if (heroReviewCountEl) {
            heroReviewCountEl.textContent = total;
        }
        if (heroScoreNumEl) {
            heroScoreNumEl.textContent = '5.0';
        }
    }

    function getInitials(name) {
        if (!name) return 'FL';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) {
            return parts[0].substring(0, 2).toUpperCase();
        }
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function generateStarsHtml(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    function createReviewCardElement(data, isNew = false) {
        const card = document.createElement('article');
        card.className = `review-card ${isNew ? 'review-card--new' : ''}`;
        card.setAttribute('data-service', data.service || 'Lawn Mowing & Edging');
        card.setAttribute('data-city', data.city || 'Lakeland');
        card.setAttribute('data-property', data.propertyType || 'Residential Homeowner');

        const avatarContent = data.photo 
            ? `<img src="${data.photo}" alt="${data.name}" loading="lazy">`
            : getInitials(data.name);

        const timeLabel = data.time || 'Verified Just Now';

        card.innerHTML = `
            <div class="review-card__header">
                <div class="review-card__avatar">${avatarContent}</div>
                <div class="review-card__identity">
                    <h3 class="review-card__name">
                        ${escapeHtml(data.name)}
                        <span class="review-card__verified-badge">
                            <i class="fas fa-check-circle"></i> Verified Client
                        </span>
                    </h3>
                    <div class="review-card__meta-tags">
                        <span class="review-card__city">
                            <i class="fas fa-map-marker-alt"></i> ${escapeHtml(data.city)}, FL
                        </span>
                        <span>&bull;</span>
                        <span>${escapeHtml(data.propertyType)}</span>
                    </div>
                </div>
            </div>
            <div class="review-card__stars-row">
                <div class="review-card__stars" aria-label="${data.rating} out of 5 stars">
                    ${generateStarsHtml(data.rating)}
                </div>
                <span class="review-card__time">${escapeHtml(timeLabel)}</span>
            </div>
            <p class="review-card__body">
                &ldquo;${escapeHtml(data.message)}&rdquo;
            </p>
            <div class="review-card__footer">
                <span class="review-card__service-tag">
                    <i class="fas fa-tag"></i> ${escapeHtml(data.service)}
                </span>
                ${isNew ? '<span class="review-card__badge-live"><i class="fas fa-bolt"></i> Just Posted</span>' : ''}
            </div>
        `;

        return card;
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    // ─────────────────────────────────────────────────────────────
    // 4. LOAD SAVED REVIEWS ON INITIALIZATION
    // ─────────────────────────────────────────────────────────────
    function initializeSavedReviews() {
        const stored = getStoredReviews();
        if (stored.length > 0 && reviewsGrid) {
            // Prepend in reverse so newest appears first
            stored.slice().reverse().forEach(reviewData => {
                const card = createReviewCardElement(reviewData, false);
                reviewsGrid.prepend(card);
            });
        }
        updateHeroStats(stored.length);
    }

    initializeSavedReviews();

    // ─────────────────────────────────────────────────────────────
    // 5. FORM SUBMISSION HANDLER
    // ─────────────────────────────────────────────────────────────
    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = (reviewerNameInput ? reviewerNameInput.value.trim() : '');
            const city = (reviewerCitySelect ? reviewerCitySelect.value : '');
            const service = (reviewerServiceSelect ? reviewerServiceSelect.value : '');
            const propertyType = (reviewerPropertyTypeSelect ? reviewerPropertyTypeSelect.value : 'Residential Homeowner');
            const message = (reviewerMessageInput ? reviewerMessageInput.value.trim() : '');
            const rating = parseInt(starRatingValue ? starRatingValue.value : '5', 10) || 5;

            // Form validation
            if (!name) {
                alert('Please enter your full name or business name.');
                reviewerNameInput.focus();
                return;
            }
            if (!city) {
                alert('Please select your Central Florida city.');
                reviewerCitySelect.focus();
                return;
            }
            if (!service) {
                alert('Please select the service completed on your property.');
                reviewerServiceSelect.focus();
                return;
            }
            if (!message || message.length < 15) {
                alert('Please share at least a few words (15+ characters) about your experience.');
                reviewerMessageInput.focus();
                return;
            }

            const newReview = {
                id: Date.now(),
                name,
                city,
                service,
                propertyType,
                message,
                rating,
                photo: uploadedPhotoBase64,
                time: 'Verified Just Now'
            };

            // Save to localStorage
            const stored = getStoredReviews();
            stored.unshift(newReview);
            saveStoredReviews(stored);

            // Animate submission into DOM using GSAP Flip if available
            let flipState = null;
            if (typeof Flip !== 'undefined' && reviewsGrid) {
                flipState = Flip.getState('.review-card');
            }

            const newCard = createReviewCardElement(newReview, true);
            if (reviewsGrid) {
                reviewsGrid.prepend(newCard);
            }

            if (flipState && typeof Flip !== 'undefined') {
                Flip.from(flipState, {
                    duration: 0.6,
                    ease: 'power2.out',
                    stagger: 0.04
                });
            } else if (typeof gsap !== 'undefined') {
                gsap.from(newCard, {
                    y: -30,
                    opacity: 0,
                    duration: 0.6,
                    ease: 'power3.out'
                });
            }

            // Update hero review counter
            updateHeroStats(stored.length);

            // Reset form fields
            reviewForm.reset();
            currentRating = 5;
            setStarDisplay(5);
            if (starRatingValue) starRatingValue.value = '5';
            uploadedPhotoBase64 = null;
            if (photoPreviewImg) {
                photoPreviewImg.src = '';
                photoPreviewImg.style.display = 'none';
            }
            if (photoPlaceholderIcon) {
                photoPlaceholderIcon.style.display = 'block';
            }

            // Scroll smoothly to reviews grid so the user sees their new post and close form
            setTimeout(() => {
                closeReviewSection();
                newCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 600);
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 6. DUAL-AXIS FILTER ENGINE (TABS + CITY DROPDOWN)
    // ─────────────────────────────────────────────────────────────
    let activeServiceFilter = 'all';
    let activeCityFilter = 'all';

    function applyFilters() {
        const cards = document.querySelectorAll('.review-card');
        if (!cards.length) return;

        let flipState = null;
        if (typeof Flip !== 'undefined' && reviewsGrid) {
            flipState = Flip.getState('.review-card');
        }

        cards.forEach(card => {
            const cardService = card.getAttribute('data-service') || '';
            const cardCity = card.getAttribute('data-city') || '';
            const cardProp = card.getAttribute('data-property') || '';

            // Service matching
            let matchesService = false;
            if (activeServiceFilter === 'all') {
                matchesService = true;
            } else if (activeServiceFilter === 'commercial-hoa') {
                matchesService = (cardProp.includes('Commercial') || cardProp.includes('HOA'));
            } else {
                matchesService = (cardService.toLowerCase() === activeServiceFilter.toLowerCase());
            }

            // City matching
            let matchesCity = (activeCityFilter === 'all' || cardCity.toLowerCase() === activeCityFilter.toLowerCase());

            if (matchesService && matchesCity) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });

        if (flipState && typeof Flip !== 'undefined') {
            Flip.from(flipState, {
                duration: 0.45,
                ease: 'power2.out',
                absolute: true
            });
        }
    }

    serviceTabBtns.forEach(tab => {
        tab.addEventListener('click', () => {
            serviceTabBtns.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeServiceFilter = tab.getAttribute('data-filter') || 'all';
            applyFilters();
        });
    });

    if (cityFilterSelect) {
        cityFilterSelect.addEventListener('change', () => {
            activeCityFilter = cityFilterSelect.value;
            applyFilters();
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 7. SCROLLTRIGGER BATCH ENTRANCE ANIMATIONS
    // ─────────────────────────────────────────────────────────────
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.batch('.review-card', {
            interval: 0.08,
            batchMax: 4,
            onEnter: batch => {
                gsap.fromTo(batch, 
                    { y: 35, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.65, ease: 'power2.out', stagger: 0.1, overwrite: 'auto' }
                );
            },
            start: 'top 90%'
        });

        ScrollTrigger.batch('.pillar-card', {
            interval: 0.1,
            batchMax: 4,
            onEnter: batch => {
                gsap.fromTo(batch,
                    { y: 40, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', stagger: 0.12, overwrite: 'auto' }
                );
            },
            start: 'top 88%'
        });
    }
});
