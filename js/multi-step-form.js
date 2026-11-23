/**
 * FLA PROPERTY MAINTENANCE LLC — 4-STEP MULTI-STEP QUOTE FORM CONTROLLER (multi-step-form.js)
 * Tap-to-Select Micro-Commitments, Smart Pricing Modifiers, Satellite Lot Address,
 * Optional Photo Upload (FileReader), Dynamic Summary Recap, GSAP Transitions & Confirmation.
 * 
 * Works seamlessly both inline on the page AND dynamically docked inside the #quoteModal overlay!
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        // Find active form container (supports DOM relocation to #quoteModal overlay)
        function getFormRoot() {
            return document.getElementById('multiStepQuoteWrap') || document.querySelector('.multi-quote-card') || document;
        }

        const formRoot = getFormRoot();
        if (!formRoot) return;

        // Form state
        const state = {
            currentStep: 1,
            propertyType: 'Residential Home',
            services: new Set(['Lawn Mowing & Edging']),
            frequency: 'Bi-Weekly Maintenance',
            condition: 'Maintained / Normal Height',
            gateAccess: 'Wide Gate (Fits Scag)',
            address: '',
            city: 'Lakeland',
            notes: '',
            photos: [],
            name: '',
            email: '',
            phone: '',
            contactPref: 'Text Message'
        };

        // ─────────────────────────────────────────────────────────────
        // 1. ANIMATION UTILITIES
        // ─────────────────────────────────────────────────────────────
        function popElement(el) {
            if (typeof gsap !== 'undefined' && el) {
                gsap.fromTo(el, 
                    { scale: 0.94 }, 
                    { scale: 1, duration: 0.28, ease: 'back.out(2.2)' }
                );
            }
        }

        function shakeElement(el) {
            if (typeof gsap !== 'undefined' && el) {
                gsap.fromTo(el, 
                    { x: -8 }, 
                    { x: 8, duration: 0.08, repeat: 5, yoyo: true, ease: 'power1.inOut', onComplete: () => {
                        gsap.set(el, { x: 0 });
                    }}
                );
            }
        }

        // ─────────────────────────────────────────────────────────────
        // 2. TAP-TO-SELECT SELECTIONS (DELEGATED FOR 100% RELIABILITY)
        // ─────────────────────────────────────────────────────────────
        document.addEventListener('click', (e) => {
            const root = getFormRoot();

            // 2A. Property Type Cards (Single Select)
            const propCard = e.target.closest('.prop-select-card');
            if (propCard && root.contains(propCard)) {
                root.querySelectorAll('.prop-select-card').forEach(c => c.classList.remove('is-selected'));
                propCard.classList.add('is-selected');
                state.propertyType = propCard.getAttribute('data-value') || 'Residential Home';
                popElement(propCard);
                return;
            }

            // 2B. Services Pills (Multi-Select)
            const servicePill = e.target.closest('.service-select-pill');
            if (servicePill && root.contains(servicePill)) {
                const val = servicePill.getAttribute('data-value');
                if (state.services.has(val)) {
                    state.services.delete(val);
                    servicePill.classList.remove('is-selected');
                } else {
                    state.services.add(val);
                    servicePill.classList.add('is-selected');
                    popElement(servicePill);
                }
                return;
            }

            // 2C. Frequency Pills (Single Select)
            const freqPill = e.target.closest('.freq-select-pill');
            if (freqPill && root.contains(freqPill)) {
                root.querySelectorAll('.freq-select-pill').forEach(p => p.classList.remove('is-selected'));
                freqPill.classList.add('is-selected');
                state.frequency = freqPill.getAttribute('data-value') || 'Bi-Weekly Maintenance';
                popElement(freqPill);
                return;
            }

            // 2D. Yard Condition Cards (Single Select)
            const condCard = e.target.closest('.cond-select-card');
            if (condCard && root.contains(condCard)) {
                root.querySelectorAll('.cond-select-card').forEach(c => c.classList.remove('is-selected'));
                condCard.classList.add('is-selected');
                state.condition = condCard.getAttribute('data-value') || 'Maintained / Normal Height';
                popElement(condCard);
                return;
            }

            // 2E. Gate Access Pills (Single Select)
            const gatePill = e.target.closest('.gate-select-pill');
            if (gatePill && root.contains(gatePill)) {
                root.querySelectorAll('.gate-select-pill').forEach(p => p.classList.remove('is-selected'));
                gatePill.classList.add('is-selected');
                state.gateAccess = gatePill.getAttribute('data-value') || 'Wide Gate (Fits Scag)';
                popElement(gatePill);
                return;
            }

            // 2F. Quote Contact Preference Toggle
            const prefOpt = e.target.closest('.pref-option-pill');
            if (prefOpt && root.contains(prefOpt)) {
                root.querySelectorAll('.pref-option-pill').forEach(o => o.classList.remove('is-selected'));
                prefOpt.classList.add('is-selected');
                const radio = prefOpt.querySelector('input[type="radio"]');
                if (radio) radio.checked = true;
                state.contactPref = prefOpt.getAttribute('data-value') || 'Text Message';
                popElement(prefOpt);
                return;
            }

            // 2G. Next Button Click
            const nextBtn = e.target.closest('.btn-nav-next');
            if (nextBtn && root.contains(nextBtn)) {
                e.preventDefault();
                if (validateStep(state.currentStep)) {
                    goToStep(state.currentStep + 1, 'next');
                }
                return;
            }

            // 2H. Back Button Click
            const backBtn = e.target.closest('.btn-nav-back');
            if (backBtn && root.contains(backBtn)) {
                e.preventDefault();
                if (state.currentStep > 1) {
                    goToStep(state.currentStep - 1, 'back');
                }
                return;
            }

            // 2I. Submit Button Click (Delegated for 100% reliability both inline and in modal)
            const submitBtn = e.target.closest('.btn-nav-submit, #btnFinalSubmit');
            if (submitBtn && root.contains(submitBtn)) {
                e.preventDefault();
                processQuoteSubmit();
                return;
            }
        });

        // ─────────────────────────────────────────────────────────────
        // 3. OPTIONAL PHOTO UPLOAD (FileReader API)
        // ─────────────────────────────────────────────────────────────
        const photoDropZone = document.getElementById('photoDropZone');
        const photoFileInput = document.getElementById('photoFileInput');
        const photoPreviews = document.getElementById('photoPreviews');

        if (photoDropZone && photoFileInput && photoPreviews) {
            photoDropZone.addEventListener('click', () => photoFileInput.click());

            ['dragenter', 'dragover'].forEach(eventName => {
                photoDropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    photoDropZone.classList.add('is-dragover');
                });
            });

            ['dragleave', 'drop'].forEach(eventName => {
                photoDropZone.addEventListener(eventName, (e) => {
                    e.preventDefault();
                    photoDropZone.classList.remove('is-dragover');
                });
            });

            photoDropZone.addEventListener('drop', (e) => {
                const files = e.dataTransfer.files;
                handlePhotoFiles(files);
            });

            photoFileInput.addEventListener('change', (e) => {
                handlePhotoFiles(e.target.files);
            });

            function handlePhotoFiles(files) {
                if (!files || files.length === 0) return;

                const availableSlots = 3 - state.photos.length;
                if (availableSlots <= 0) {
                    alert('You can upload up to 3 yard photos.');
                    return;
                }

                const toProcess = Array.from(files).slice(0, availableSlots);
                toProcess.forEach(file => {
                    if (!file.type.startsWith('image/')) return;

                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const imgData = e.target.result;
                        state.photos.push(imgData);
                        renderPhotoPreviews();
                    };
                    reader.readAsDataURL(file);
                });
            }

            function renderPhotoPreviews() {
                photoPreviews.innerHTML = '';
                state.photos.forEach((photoUrl, idx) => {
                    const item = document.createElement('div');
                    item.className = 'photo-preview-item';
                    item.innerHTML = `
                        <img src="${photoUrl}" alt="Yard Photo ${idx + 1}">
                        <button type="button" class="photo-preview-remove" aria-label="Remove photo">&times;</button>
                    `;
                    item.querySelector('.photo-preview-remove').addEventListener('click', (e) => {
                        e.stopPropagation();
                        state.photos.splice(idx, 1);
                        renderPhotoPreviews();
                    });
                    photoPreviews.appendChild(item);
                });
            }
        }

        // ─────────────────────────────────────────────────────────────
        // 4. STEP PROGRESSION & VALIDATION
        // ─────────────────────────────────────────────────────────────
        function updateProgress(stepNum) {
            const root = getFormRoot();
            const stepperItems = root.querySelectorAll('.wireframe-stepper__item');
            stepperItems.forEach(item => {
                const s = parseInt(item.getAttribute('data-step-indicator'), 10);
                const circle = item.querySelector('.wireframe-stepper__circle');
                item.classList.remove('is-active', 'is-completed');
                if (s < stepNum) {
                    item.classList.add('is-completed');
                    if (circle) circle.innerHTML = '<i class="fas fa-check" style="font-size: 11px;"></i>';
                } else if (s === stepNum) {
                    item.classList.add('is-active');
                    if (circle) circle.textContent = s;
                } else {
                    if (circle) circle.textContent = s;
                }
            });

            // Animated Progress Bar & Step Badge
            const percentages = [25, 50, 75, 100];
            const progressBar = document.getElementById('quoteProgressBar');
            const stepBadge = document.getElementById('quoteStepBadge');
            if (progressBar) {
                progressBar.style.width = percentages[stepNum - 1] + '%';
            }
            if (stepBadge) {
                stepBadge.textContent = `Step ${stepNum} of 4`;
            }
        }

        function validateStep(stepNum) {
            const root = getFormRoot();

            if (stepNum === 1) {
                if (state.services.size === 0) {
                    const grid = root.querySelector('.service-pills-grid');
                    if (grid) shakeElement(grid);
                    alert('Please select at least one service you need.');
                    return false;
                }
                return true;
            }

            if (stepNum === 2) {
                return true; // Presets are always valid
            }

            if (stepNum === 3) {
                const addrInput = document.getElementById('quoteStreetAddress');
                const citySelect = document.getElementById('quoteCitySelect');
                const notesInput = document.getElementById('quoteSpecialNotes');

                state.address = (addrInput ? addrInput.value.trim() : '');
                state.city = (citySelect ? citySelect.value : 'Lakeland');
                state.notes = (notesInput ? notesInput.value.trim() : '');

                if (!state.address) {
                    if (addrInput) {
                        shakeElement(addrInput);
                        addrInput.focus();
                    }
                    alert('Please enter your property street address so our crew can measure your lot via satellite.');
                    return false;
                }
                return true;
            }

            if (stepNum === 4) {
                const nameInput = document.getElementById('quoteFullName');
                const emailInput = document.getElementById('quoteEmail');
                const phoneInput = document.getElementById('quotePhone');

                state.name = (nameInput ? nameInput.value.trim() : '');
                state.email = (emailInput ? emailInput.value.trim() : '');
                state.phone = (phoneInput ? phoneInput.value.trim() : '');

                if (!state.name) {
                    if (nameInput) {
                        shakeElement(nameInput);
                        nameInput.focus();
                    }
                    alert('Please enter your full name.');
                    return false;
                }

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!state.email || !emailRegex.test(state.email)) {
                    if (emailInput) {
                        shakeElement(emailInput);
                        emailInput.focus();
                    }
                    alert('Please enter a valid email address so we can send your written estimate.');
                    return false;
                }

                const cleanedPhone = state.phone.replace(/\D/g, '');
                if (cleanedPhone.length < 10) {
                    if (phoneInput) {
                        shakeElement(phoneInput);
                        phoneInput.focus();
                    }
                    alert('Please enter a valid 10-digit phone number so we can text or call your quote.');
                    return false;
                }
                return true;
            }

            return true;
        }

        function goToStep(targetStep, direction = 'next') {
            const root = getFormRoot();
            const currentStepEl = root.querySelector(`.form-step[data-step="${state.currentStep}"]`);
            const targetStepEl = root.querySelector(`.form-step[data-step="${targetStep}"]`);

            if (!currentStepEl || !targetStepEl) {
                console.warn('Step elements not found:', state.currentStep, targetStep);
                return;
            }

            // When entering step 4, hydrate summary recap chips
            if (targetStep === 4) {
                hydrateStep4Summary();
            }

            const outX = direction === 'next' ? -35 : 35;
            const inX = direction === 'next' ? 35 : -35;

            if (typeof gsap !== 'undefined') {
                gsap.to(currentStepEl, {
                    x: outX,
                    opacity: 0,
                    duration: 0.22,
                    ease: 'power2.in',
                    onComplete: () => {
                        currentStepEl.classList.remove('is-active');
                        currentStepEl.style.display = 'none';
                        gsap.set(currentStepEl, { clearProps: 'x,opacity' });

                        targetStepEl.style.display = 'block';
                        targetStepEl.classList.add('is-active');

                        gsap.fromTo(targetStepEl,
                            { x: inX, opacity: 0 },
                            { x: 0, opacity: 1, duration: 0.32, ease: 'power2.out' }
                        );

                        state.currentStep = targetStep;
                        updateProgress(targetStep);
                    }
                });
            } else {
                currentStepEl.classList.remove('is-active');
                currentStepEl.style.display = 'none';
                targetStepEl.style.display = 'block';
                targetStepEl.classList.add('is-active');
                state.currentStep = targetStep;
                updateProgress(targetStep);
            }
        }

        function hydrateStep4Summary() {
            const summaryPillsContainer = document.getElementById('summaryPillsList');
            if (!summaryPillsContainer) return;

            summaryPillsContainer.innerHTML = '';

            // Add Property Chip
            const propChip = document.createElement('span');
            propChip.className = 'summary-pill';
            propChip.innerHTML = `<i class="fas fa-home"></i> ${state.propertyType}`;
            summaryPillsContainer.appendChild(propChip);

            // Add Services Chip
            const servicesArray = Array.from(state.services);
            const servChip = document.createElement('span');
            servChip.className = 'summary-pill';
            servChip.innerHTML = `<i class="fas fa-leaf"></i> ${servicesArray.slice(0, 2).join(' + ')}${servicesArray.length > 2 ? ' +' + (servicesArray.length - 2) + ' more' : ''}`;
            summaryPillsContainer.appendChild(servChip);

            // Add City Chip
            const cityChip = document.createElement('span');
            cityChip.className = 'summary-pill';
            cityChip.innerHTML = `<i class="fas fa-map-marker-alt"></i> ${state.city}, FL`;
            summaryPillsContainer.appendChild(cityChip);
        }

        // Initialize progress bar at step 1
        updateProgress(1);

        // ─────────────────────────────────────────────────────────────
        // 5. FINAL SUBMIT & CONFIRMATION MORPH
        // ─────────────────────────────────────────────────────────────
        let isSubmitting = false;

        function processQuoteSubmit() {
            if (isSubmitting) return;
            if (!validateStep(4)) return;

            isSubmitting = true;

            // Generate clean payload
            const leadPayload = {
                id: 'quote_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
                propertyType: state.propertyType || 'Residential Home',
                services: Array.from(state.services),
                frequency: state.frequency || 'Bi-Weekly Maintenance',
                condition: state.condition || 'Maintained / Normal Height',
                gateAccess: state.gateAccess || 'Wide Gate (Fits Scag)',
                address: state.address || '',
                city: state.city || 'Lakeland',
                notes: state.notes || '',
                name: state.name,
                email: state.email,
                phone: state.phone,
                contactPref: state.contactPref || 'Text Message',
                photosCount: state.photos.length,
                status: 'new',
                createdAt: new Date().toISOString()
            };

            // 1. Save to primary localStorage key
            try {
                const existing = JSON.parse(localStorage.getItem('fla_quote_leads') || '[]');
                existing.unshift(leadPayload);
                localStorage.setItem('fla_quote_leads', JSON.stringify(existing));
            } catch (err) {
                console.warn('LocalStorage save error:', err);
            }

            // 2. Also save to site_data for compatibility
            try {
                const rawSite = localStorage.getItem('fla_site_data');
                if (rawSite) {
                    const parsedSite = JSON.parse(rawSite);
                    if (parsedSite && parsedSite.leads) {
                        parsedSite.leads.unshift(leadPayload);
                        localStorage.setItem('fla_site_data', JSON.stringify(parsedSite));
                    }
                }
            } catch (err) {}

            // 3. Send to backend REST API (persists to data/quotes.json)
            try {
                fetch('/api/quotes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(leadPayload)
                }).catch(() => {});
            } catch (e) {}

            // 4. Real-time broadcast to admin panel
            try {
                if (typeof BroadcastChannel !== 'undefined') {
                    const bc = new BroadcastChannel('fla_realtime_channel');
                    bc.postMessage({ type: 'quotes', payload: leadPayload });
                }
            } catch (e) {}

            // 5. Custom window event
            try {
                window.dispatchEvent(new CustomEvent('fla_new_quote', { detail: leadPayload }));
            } catch (e) {}

            // Show confirmation screen
            showConfirmation(leadPayload);
            isSubmitting = false;
        }

        const quoteFormEl = document.getElementById('multiStepQuoteForm');
        if (quoteFormEl) {
            quoteFormEl.addEventListener('submit', (e) => {
                e.preventDefault();
                processQuoteSubmit();
            });
        }

        function showConfirmation(lead) {
            const root = getFormRoot();
            const formBody = root.querySelector('.multi-quote-body');
            const confName = document.getElementById('confLeadName');
            const confProperty = document.getElementById('confLeadProperty');
            const confServices = document.getElementById('confLeadServices');
            const confAddress = document.getElementById('confLeadAddress');
            const confContact = document.getElementById('confLeadContact');
            const confSmsBtn = document.getElementById('confSmsBtn');
            const confirmationScreen = document.getElementById('quoteConfirmationScreen');

            if (confName) confName.textContent = lead.name;
            if (confProperty) confProperty.textContent = lead.propertyType;
            if (confServices) confServices.textContent = lead.services.join(', ');
            if (confAddress) confAddress.textContent = `${lead.address}, ${lead.city}, FL`;
            if (confContact) confContact.textContent = `${lead.phone} • ${lead.email} (${lead.contactPref})`;

            // Configure SMS link with pre-filled message
            if (confSmsBtn) {
                const smsBody = encodeURIComponent(`Hi FLA Property Maintenance! I just submitted an estimate request for ${lead.address}, ${lead.city}. Looking forward to your quote!`);
                confSmsBtn.href = `sms:8637128783?&body=${smsBody}`;
            }

            if (formBody && confirmationScreen) {
                if (typeof gsap !== 'undefined') {
                    gsap.to(formBody, {
                        opacity: 0,
                        scale: 0.96,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => {
                            formBody.style.display = 'none';
                            confirmationScreen.style.display = 'block';
                            confirmationScreen.classList.add('is-active');

                            gsap.fromTo(confirmationScreen,
                                { opacity: 0, scale: 0.95, y: 20 },
                                { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.8)' }
                            );

                            // Confetti checkmark pop
                            const checkIcon = confirmationScreen.querySelector('.conf-check-wrap');
                            if (checkIcon) {
                                gsap.fromTo(checkIcon,
                                    { scale: 0.5, rotation: -20 },
                                    { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' }
                                );
                            }
                        }
                    });
                } else {
                    formBody.style.display = 'none';
                    confirmationScreen.style.display = 'block';
                    confirmationScreen.classList.add('is-active');
                }
            }
        }

        // Reset form button in confirmation
        const resetQuoteBtn = document.getElementById('resetQuoteBtn');
        if (resetQuoteBtn) {
            resetQuoteBtn.addEventListener('click', () => {
                location.reload();
            });
        }
    });
})();
