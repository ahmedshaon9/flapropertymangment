/**
 * FLA PROPERTY MAINTENANCE LLC — ADMIN CONTROL PANEL CONTROLLER (admin.js)
 * Linear/Stripe-style Minimal SaaS Dashboard
 * 
 * Modules:
 *  1. StorageAdapter & Seed Demo Data Generator
 *  2. Auth Controller & Security Gate
 *  3. Dashboard Overview & Real-time KPIs
 *  4. Quote Leads Manager, Slide-Over Detail Drawer, Satellite Lot Check & CSV/Excel Exporter
 *  5. Customer Review Moderation Queue (Pending -> Approved -> Live)
 *  6. Portfolio & Caption Manager with FileReader Image Uploader
 *  7. Live Page Text CMS (All 9 Pages) & Brand Color Customizer
 *  8. Settings, Password Management & JSON Database Backups
 */

(function () {
    'use strict';

    // ─────────────────────────────────────────────────────────────────
    // 1. STORAGE ADAPTER & INITIAL SEED DATA
    // ─────────────────────────────────────────────────────────────────
    const STORAGE_KEY = 'fla_site_data';
    const AUTH_KEY = 'fla_admin_auth';
    const PASSWORD_KEY = 'fla_admin_password';
    const DEFAULT_PASSWORD = 'FLA2026!';

    const CITIES = [
        'Lakeland', 'Winter Haven', 'Auburndale', 'Haines City',
        'Davenport', 'Bartow', 'Lake Wales', 'Dundee',
        'Polk City', 'Plant City', 'Mulberry', 'Zephyrhills',
        'Dade City', 'Lake Hamilton', 'Frostproof', 'Avon Park'
    ];

    const DEFAULT_DATA = {
        site_settings: {
            colors: {
                primary: '#007f5f',
                accent: '#80b918',
                darkBg: '#032119',
                lightBg: '#F8FAFC'
            },
            contact: {
                phone: '(863) 712-8783',
                phoneRaw: '8637128783',
                email: 'estimates@flapropertymaintenance.com',
                hours: '7 Days a Week — Rain or Shine (7:00 AM – 7:00 PM)',
                payments: 'Zelle, Cash App, Cash, Check'
            },
            page_texts: {
                home: {
                    h1: 'FLA PROPERTY MAINTENANCE LLC',
                    subheadline: 'Polk County’s Premier Commercial & Residential Lawn Care. Sharp Lines, Surgical Cuts, and 7-Day Rain-or-Shine Reliability across Lakeland, Winter Haven & Central Florida.',
                    cta_primary: 'Get Free Estimate',
                    cta_call: 'Call (863) 712-8783',
                    badge: 'OPEN 7 DAYS A WEEK • RAIN OR SHINE'
                },
                about: {
                    h1: 'Built on Commercial Scag Precision and Central Florida Pride',
                    subheadline: 'Learn how our local Lakeland crew delivers sharp vertical edging, immaculate turf, and dependable 7-day service with zero contracts.'
                },
                services: {
                    h1: 'Full-Service Lawn Care & Exterior Maintenance',
                    subheadline: 'From routine weekly mowing and same-day Mow & Go cuts to custom rock installations and seasonal storm cleanups.'
                },
                how_it_works: {
                    h1: 'How It Works: 4 Easy Steps to a Flawless Yard',
                    subheadline: 'Zero friction, zero guesswork. Fast quotes via text photos, commercial cuts, and seamless Zelle/Cash App completion billing.'
                },
                portfolio: {
                    h1: 'Our Work: Front Yard to Backyard Transformations',
                    subheadline: 'Explore our latest residential and commercial lawn maintenance, bed edging trenching, mulch, and seasonal yard cleanups.'
                },
                service_areas: {
                    h1: 'Serving All 16 Cities Across Polk County, FL',
                    subheadline: 'Our dedicated 7-day crews service Lakeland, Winter Haven, Auburndale, Davenport, Haines City, Bartow, Lake Wales, and surrounding communities.'
                },
                reviews: {
                    h1: 'Verified 5-Star Reviews from Central Florida Property Owners',
                    subheadline: 'Read real feedback from homeowners, HOAs, landlords, and commercial storefronts who count on our 7-day dispatch.'
                },
                faq: {
                    h1: 'Frequently Asked Questions About Our Lawn & Landscape Services',
                    subheadline: 'Everything you need to know about our free estimates, 7-day rain-or-shine schedule, one-time Mow & Go service, and yard prep standards.'
                }
            }
        },
        leads: [
            {
                id: 'lead_101',
                clientName: 'David Henderson',
                clientPhone: '(863) 555-0142',
                address: '4218 Grasslands Blvd',
                city: 'Lakeland',
                propertyType: 'Residential Home',
                services: ['Lawn Mowing & Edging', 'Mulch & Rock Installation'],
                frequency: 'Bi-Weekly Maintenance',
                yardCondition: 'Maintained / Normal Height',
                gateAccess: 'Wide Gate (Fits Commercial Mower)',
                replyPreference: 'Text Message',
                notes: 'Front flower beds need fresh dark brown mulch. Gate on east side has 48 inch clearance.',
                status: 'New',
                photos: ['assets/images/hero-lawn-mowing.webp'],
                createdAt: '2026-11-18T14:32:00Z'
            },
            {
                id: 'lead_102',
                clientName: 'Sarah Jenkins',
                clientPhone: '(863) 555-0289',
                address: '1504 Lake Martha Dr NE',
                city: 'Winter Haven',
                propertyType: 'Residential Home',
                services: ['One-Time Mow & Go', 'Overgrown Yard Cleanup'],
                frequency: 'One-Time Service',
                yardCondition: 'Tall / Overgrown Grass (Needs knockdown)',
                gateAccess: 'No Fence (Open Yard)',
                replyPreference: 'Text Message',
                notes: 'Listing home for sale on Monday, need crisp edging and grass cut short ASAP.',
                status: 'Quoted',
                photos: ['assets/images/commercial-grounds-mowing.webp'],
                createdAt: '2026-11-18T11:15:00Z'
            },
            {
                id: 'lead_103',
                clientName: 'Marcus Vance',
                clientPhone: '(863) 555-0371',
                address: '890 Havendale Blvd',
                city: 'Auburndale',
                propertyType: 'Commercial Property',
                services: ['Lawn Mowing & Edging', 'Bush, Hedge & Tree Care'],
                frequency: 'Weekly Maintenance',
                yardCondition: 'Maintained / Normal Height',
                gateAccess: 'Wide Gate (Fits Commercial Mower)',
                replyPreference: 'Phone Call',
                notes: 'Storefront property with parking lot islands and perimeter hedge trimming.',
                status: 'Scheduled',
                photos: [],
                createdAt: '2026-11-17T18:45:00Z'
            },
            {
                id: 'lead_104',
                clientName: 'Elena Rostova',
                clientPhone: '(863) 555-0498',
                address: '215 Champions Gate Way',
                city: 'Davenport',
                propertyType: 'HOA Community',
                services: ['Landscape Bed Makeover', 'Mulch & Rock Installation'],
                frequency: 'Custom Landscape Project',
                yardCondition: 'Maintained / Normal Height',
                gateAccess: 'Standard Walk-Gate Only',
                replyPreference: 'Text Message',
                notes: 'Short term vacation rental near Disney corridor. Need river rock installed around pool enclosure.',
                status: 'Completed',
                photos: ['assets/images/sunset-curb-appeal.webp'],
                createdAt: '2026-11-16T09:20:00Z'
            },
            {
                id: 'lead_105',
                clientName: 'Robert Campbell',
                clientPhone: '(863) 555-0563',
                address: '730 E Stuart Ave',
                city: 'Bartow',
                propertyType: 'Residential Home',
                services: ['Overgrown Yard Cleanup', 'Bush, Hedge & Tree Care'],
                frequency: 'One-Time Service',
                yardCondition: 'Heavy Debris / Leaves / Branches',
                gateAccess: 'Front Yard Only',
                replyPreference: 'Text Message',
                notes: 'Storm debris from oak tree and overgrown front bougainvillea.',
                status: 'New',
                photos: [],
                createdAt: '2026-11-18T16:05:00Z'
            },
            {
                id: 'lead_106',
                clientName: 'Crystal Miller',
                clientPhone: '(863) 555-0612',
                address: '1120 Bates Rd',
                city: 'Haines City',
                propertyType: 'Residential Home',
                services: ['Lawn Mowing & Edging'],
                frequency: 'Weekly Maintenance',
                yardCondition: 'Maintained / Normal Height',
                gateAccess: 'Wide Gate (Fits Commercial Mower)',
                replyPreference: 'Text Message',
                notes: 'Looking for a reliable crew that shows up every Tuesday rain or shine.',
                status: 'New',
                photos: [],
                createdAt: '2026-11-18T17:25:00Z'
            }
        ],
        reviews: [
            {
                id: 'rev_1',
                name: 'Michael Rodriguez',
                city: 'Lakeland',
                propertyType: 'Residential Homeowner',
                service: 'Lawn Mowing & Edging',
                rating: 5,
                text: 'FLA Property Maintenance has been servicing my lawn for over 6 months now. Razor sharp vertical edges along our driveway and zero grass clippings left behind on the patio. 10/10 service!',
                avatarUrl: '',
                status: 'approved',
                createdAt: '2026-11-14T10:00:00Z'
            },
            {
                id: 'rev_2',
                name: 'Amanda & Jason Cole',
                city: 'Winter Haven',
                propertyType: 'Residential Homeowner',
                service: 'Landscape Bed Makeovers',
                rating: 5,
                text: 'We texted photos of our messy front garden beds on Saturday and had a written quote 20 minutes later. By Monday afternoon, deep trench edging and river rock completely changed our curb appeal!',
                avatarUrl: '',
                status: 'approved',
                createdAt: '2026-11-12T15:30:00Z'
            },
            {
                id: 'rev_3',
                name: 'Brian K. (Property Manager)',
                city: 'Davenport',
                propertyType: 'HOA Community',
                service: 'One-Time Mow & Go',
                rating: 5,
                text: 'Managing 14 vacation rental homes means we need emergency mow-and-go cuts before guest arrivals. FLA Property Maintenance LLC answers texts immediately and gets the job done without fail.',
                avatarUrl: '',
                status: 'approved',
                createdAt: '2026-11-10T11:20:00Z'
            },
            {
                id: 'rev_4',
                name: 'Patricia Hughes',
                city: 'Auburndale',
                propertyType: 'Residential Homeowner',
                service: 'Bush, Hedge & Tree Care',
                rating: 5,
                text: 'Our 10ft ficus hedges were wildly overgrown. The crew trimmed them level with surgical precision and hauled away every single branch. Super respectful and hard-working team.',
                avatarUrl: '',
                status: 'pending',
                createdAt: '2026-11-18T13:40:00Z'
            },
            {
                id: 'rev_5',
                name: 'Carlos Mendez',
                city: 'Haines City',
                propertyType: 'Commercial Property',
                service: 'Seasonal Yard Cleanups',
                rating: 5,
                text: 'Called them for post-storm branch clearing on our office lot. Handled in 4 hours flat and billed easily via Zelle. Will definitely hire again.',
                avatarUrl: '',
                status: 'pending',
                createdAt: '2026-11-18T18:10:00Z'
            }
        ],
        portfolio: [
            {
                id: 'port_1',
                title: 'Commercial Turf Mowing & Crisp Trench Edging',
                category: 'Lawn Mowing & Edging',
                city: 'Lakeland',
                caption: 'Weekly commercial Scag cutting with surgical vertical mechanical edging along concrete walkways and parking curbs.',
                altText: 'Crisp lawn mowing and sharp trench edging on commercial property in Lakeland FL',
                imageUrl: 'assets/images/commercial-grounds-mowing.webp',
                featuredOnHome: true,
                order: 1
            },
            {
                id: 'port_2',
                title: 'Front Yard Bed Transformation & River Rock Install',
                category: 'Landscape Bed Makeover',
                city: 'Winter Haven',
                caption: 'Replaced rotted mulch with heavy-duty weed barrier fabric and smooth Tennessee river rock for zero-maintenance curb appeal.',
                altText: 'River rock bed makeover and Florida friendly landscaping in Winter Haven',
                imageUrl: 'assets/images/sunset-curb-appeal.webp',
                featuredOnHome: true,
                order: 2
            },
            {
                id: 'port_3',
                title: 'Overgrown Acre Knockdown & Mow & Go Service',
                category: 'One-Time Mow & Go',
                city: 'Auburndale',
                caption: 'Same-day emergency grass cut on a 2-foot overgrown rental property before city code inspection.',
                altText: 'Overgrown grass knockdown service and clean lawn in Auburndale FL',
                imageUrl: 'assets/images/hero-lawn-mowing.webp',
                featuredOnHome: true,
                order: 3
            },
            {
                id: 'port_4',
                title: 'Premium Dark Hardwood Mulch Installation',
                category: 'Mulch & Rock Installation',
                city: 'Davenport',
                caption: 'Installed 8 yards of rich triple-shredded brown hardwood mulch with deep hand-cut edging trenching around palm rings.',
                altText: 'Dark brown hardwood mulch installation around palm trees in Davenport FL',
                imageUrl: 'assets/images/hero-bg.webp',
                featuredOnHome: true,
                order: 4
            },
            {
                id: 'port_5',
                title: 'Perimeter Hedge Shaping & Tree Canopy Lifting',
                category: 'Bush, Hedge & Tree Care',
                city: 'Bartow',
                caption: 'Shaped 70 linear feet of viburnum hedges into laser-level privacy borders with all clippings mulched and hauled off.',
                altText: 'Surgical hedge trimming and privacy bushes in Bartow FL',
                imageUrl: 'assets/images/sunset-curb-appeal.webp',
                featuredOnHome: false,
                order: 5
            },
            {
                id: 'port_6',
                title: 'Complete HOA Seasonal Brush & Leaf Cleanup',
                category: 'Overgrown Yard Cleanup',
                city: 'Haines City',
                caption: 'Full property storm recovery clearing fallen oak limbs, heavy leaf accumulation, and fence line brush.',
                altText: 'HOA seasonal yard cleanup and debris removal in Haines City FL',
                imageUrl: 'assets/images/commercial-grounds-mowing.webp',
                featuredOnHome: false,
                order: 6
            }
        ]
    };

    const StorageAdapter = {
        loadData: function () {
            try {
                let data = localStorage.getItem(STORAGE_KEY);
                if (!data) {
                    // Seed with defaults
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
                    return JSON.parse(JSON.stringify(DEFAULT_DATA));
                }
                const parsed = JSON.parse(data);

                // Merge any newly submitted leads from the frontend 4-step form
                const standaloneLeads = localStorage.getItem('fla_quote_leads');
                if (standaloneLeads) {
                    try {
                        const parsedStandalone = JSON.parse(standaloneLeads);
                        parsedStandalone.forEach(lead => {
                            if (!parsed.leads.find(l => l.id === lead.id)) {
                                parsed.leads.unshift({
                                    id: lead.id,
                                    clientName: lead.name || 'Website Visitor',
                                    clientPhone: lead.phone || '',
                                    address: lead.address || '',
                                    city: lead.city || 'Lakeland',
                                    propertyType: lead.propertyType || 'Residential Home',
                                    services: lead.services || [],
                                    frequency: lead.frequency || 'Bi-Weekly Maintenance',
                                    yardCondition: lead.condition || 'Maintained / Normal Height',
                                    gateAccess: lead.gateAccess || 'Wide Gate (Fits Scag)',
                                    replyPreference: lead.contactPref || 'Text Message',
                                    notes: lead.notes || '',
                                    status: 'New',
                                    photos: [],
                                    createdAt: lead.createdAt || new Date().toISOString()
                                });
                            }
                        });
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
                    } catch (e) {
                        console.warn('Error syncing standalone leads', e);
                    }
                }

                return parsed;
            } catch (err) {
                console.error('StorageAdapter load error:', err);
                return JSON.parse(JSON.stringify(DEFAULT_DATA));
            }
        },

        saveData: function (data) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                // Fire custom storage event so other open tabs sync instantly
                window.dispatchEvent(new Event('storage'));
                return true;
            } catch (err) {
                console.error('StorageAdapter save error:', err);
                return false;
            }
        },

        getPassword: function () {
            return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD;
        },

        setPassword: function (newPassword) {
            localStorage.setItem(PASSWORD_KEY, newPassword);
            return true;
        },

        resetToDefaults: function () {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DATA));
            localStorage.setItem(PASSWORD_KEY, DEFAULT_PASSWORD);
            return JSON.parse(JSON.stringify(DEFAULT_DATA));
        }
    };

    // ─────────────────────────────────────────────────────────────────
    // 2. APPLICATION STATE & CONTROLLER
    // ─────────────────────────────────────────────────────────────────
    let appData = StorageAdapter.loadData();
    let currentTab = 'overview';
    let activeLeadId = null;
    let leadsFilter = { search: '', city: 'all', status: 'all' };
    let reviewsFilter = { tab: 'pending' };
    let portfolioFilter = { category: 'all', city: 'all' };

    // DOM Elements
    const authGate = document.getElementById('authGate');
    const adminApp = document.getElementById('adminApp');
    const loginForm = document.getElementById('loginForm');
    const adminPasswordInput = document.getElementById('adminPassword');
    const togglePasswordBtn = document.getElementById('togglePasswordBtn');
    const authErrorAlert = document.getElementById('authErrorAlert');
    const authErrorText = document.getElementById('authErrorText');
    const logoutBtn = document.getElementById('logoutBtn');
    const topLogoutBtn = document.getElementById('topLogoutBtn');

    // Sidebar & Navigation
    const sidebar = document.getElementById('adminSidebar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const navButtons = document.querySelectorAll('[data-tab-target]');
    const tabPanels = document.querySelectorAll('.tab-panel');
    const activeSectionTitle = document.getElementById('activeSectionTitle');

    // Drawer & Modals
    const leadDrawer = document.getElementById('leadDrawer');
    const leadDrawerBackdrop = document.getElementById('leadDrawerBackdrop');
    const closeDrawerBtn = document.getElementById('closeDrawerBtn');

    const reviewModal = document.getElementById('reviewModal');
    const reviewForm = document.getElementById('reviewForm');
    const closeReviewModalBtn = document.getElementById('closeReviewModalBtn');
    const cancelReviewModalBtn = document.getElementById('cancelReviewModalBtn');

    const portfolioModal = document.getElementById('portfolioModal');
    const portfolioForm = document.getElementById('portfolioForm');
    const closePortfolioModalBtn = document.getElementById('closePortfolioModalBtn');
    const cancelPortfolioModalBtn = document.getElementById('cancelPortfolioModalBtn');

    const passwordModal = document.getElementById('passwordModal');
    const passwordForm = document.getElementById('passwordForm');
    const closePasswordModalBtn = document.getElementById('closePasswordModalBtn');
    const cancelPasswordModalBtn = document.getElementById('cancelPasswordModalBtn');

    const addLeadModal = document.getElementById('addLeadModal');
    const addLeadForm = document.getElementById('addLeadForm');
    const closeAddLeadModalBtn = document.getElementById('closeAddLeadModalBtn');
    const cancelAddLeadModalBtn = document.getElementById('cancelAddLeadModalBtn');

    const adminToast = document.getElementById('adminToast');
    const toastMessage = document.getElementById('toastMessage');

    // ─────────────────────────────────────────────────────────────────
    // 3. TOAST NOTIFICATION UTILITY
    // ─────────────────────────────────────────────────────────────────
    let toastTimeout = null;
    function showToast(message, type = 'success') {
        if (!adminToast || !toastMessage) return;
        toastMessage.textContent = message;
        
        const icon = adminToast.querySelector('i');
        if (icon) {
            icon.className = type === 'success' 
                ? 'fas fa-check-circle text-emerald-400' 
                : 'fas fa-exclamation-circle text-amber-400';
        }

        adminToast.classList.add('is-visible');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            adminToast.classList.remove('is-visible');
        }, 3200);
    }

    // ─────────────────────────────────────────────────────────────────
    // 4. AUTHENTICATION & SESSION PROTECTION
    // ─────────────────────────────────────────────────────────────────
    function isAuthenticated() {
        return sessionStorage.getItem(AUTH_KEY) === 'true';
    }

    function initAuth() {
        if (isAuthenticated()) {
            authGate.classList.add('hidden');
            adminApp.classList.remove('hidden');
            renderAll();
        } else {
            authGate.classList.remove('hidden');
            adminApp.classList.add('hidden');
        }
    }

    // Toggle Password Visibility
    if (togglePasswordBtn && adminPasswordInput) {
        togglePasswordBtn.addEventListener('click', () => {
            const isPassword = adminPasswordInput.type === 'password';
            adminPasswordInput.type = isPassword ? 'text' : 'password';
            const icon = togglePasswordBtn.querySelector('i');
            if (icon) {
                icon.className = isPassword ? 'fas fa-eye-slash text-slate-500' : 'fas fa-eye text-slate-400';
            }
        });
    }

    // Handle Login Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const entered = (adminPasswordInput.value || '').trim();
            const correct = StorageAdapter.getPassword();

            if (entered === correct) {
                sessionStorage.setItem(AUTH_KEY, 'true');
                if (authErrorAlert) authErrorAlert.classList.add('hidden');
                
                // Animate transition into dashboard
                if (typeof gsap !== 'undefined') {
                    gsap.to(authGate, {
                        opacity: 0,
                        duration: 0.35,
                        ease: 'power2.in',
                        onComplete: () => {
                            authGate.classList.add('hidden');
                            authGate.style.opacity = 1;
                            adminApp.classList.remove('hidden');
                            gsap.fromTo(adminApp, 
                                { opacity: 0, y: 15 }, 
                                { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
                            );
                            renderAll();
                            showToast('Welcome to FLA Property Maintenance LLC Admin!');
                        }
                    });
                } else {
                    authGate.classList.add('hidden');
                    adminApp.classList.remove('hidden');
                    renderAll();
                    showToast('Welcome to FLA Property Maintenance LLC Admin!');
                }
            } else {
                // Wrong password - GSAP shake
                if (authErrorAlert) {
                    authErrorAlert.classList.remove('hidden');
                    if (authErrorText) {
                        authErrorText.textContent = 'Incorrect admin password. Default access: FLA2026!';
                    }
                }
                const card = document.getElementById('loginCard');
                if (card && typeof gsap !== 'undefined') {
                    gsap.fromTo(card, 
                        { x: -12 }, 
                        { x: 12, duration: 0.08, repeat: 5, yoyo: true, ease: 'power1.inOut', onComplete: () => {
                            gsap.set(card, { x: 0 });
                        }}
                    );
                }
                adminPasswordInput.focus();
                adminPasswordInput.select();
            }
        });
    }

    // Quick fill helper for testing
    const quickFillBtn = document.getElementById('quickFillPasswordBtn');
    if (quickFillBtn && adminPasswordInput) {
        quickFillBtn.addEventListener('click', () => {
            adminPasswordInput.value = StorageAdapter.getPassword();
            adminPasswordInput.focus();
        });
    }

    // Handle Logout
    function doLogout() {
        sessionStorage.removeItem(AUTH_KEY);
        adminApp.classList.add('hidden');
        authGate.classList.remove('hidden');
        if (adminPasswordInput) adminPasswordInput.value = '';
        if (authErrorAlert) authErrorAlert.classList.add('hidden');
        showToast('You have been logged out.');
    }

    if (logoutBtn) logoutBtn.addEventListener('click', doLogout);
    if (topLogoutBtn) topLogoutBtn.addEventListener('click', doLogout);

    // ─────────────────────────────────────────────────────────────────
    // 5. NAVIGATION & TAB SWITCHING
    // ─────────────────────────────────────────────────────────────────
    function switchTab(tabId) {
        currentTab = tabId;

        // Update nav items
        navButtons.forEach(btn => {
            const target = btn.getAttribute('data-tab-target');
            if (target === tabId) {
                btn.classList.add('is-active');
            } else {
                btn.classList.remove('is-active');
            }
        });

        // Update panels
        tabPanels.forEach(panel => {
            if (panel.id === `${tabId}Panel`) {
                panel.classList.remove('hidden');
            } else {
                panel.classList.add('hidden');
            }
        });

        // Update Top Bar Title
        const titles = {
            overview: 'Dashboard Overview',
            leads: 'Quote Leads Manager & Data Export',
            reviews: 'Customer Review Moderation Queue',
            portfolio: 'Portfolio & Caption Manager',
            cms: 'No-Code Website Text CMS',
            branding: 'Brand & Color Customizer',
            settings: 'System Settings, Security & Data Backup'
        };
        if (activeSectionTitle) {
            activeSectionTitle.textContent = titles[tabId] || 'Admin Dashboard';
        }

        // Close mobile sidebar if open
        closeMobileSidebar();

        // Render tab contents
        if (tabId === 'overview') renderOverview();
        if (tabId === 'leads') renderLeadsTable();
        if (tabId === 'reviews') renderReviewsList();
        if (tabId === 'portfolio') renderPortfolioGrid();
        if (tabId === 'cms') renderCmsEditor();
        if (tabId === 'branding') renderBrandingCustomizer();
        if (tabId === 'settings') renderSettingsView();
    }

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab-target');
            if (target) switchTab(target);
        });
    });

    // Mobile Sidebar Drawer
    function openMobileSidebar() {
        if (!sidebar) return;
        sidebar.classList.remove('-translate-x-full');
        document.body.classList.add('overflow-hidden');
    }

    function closeMobileSidebar() {
        if (!sidebar) return;
        sidebar.classList.add('-translate-x-full');
        document.body.classList.remove('overflow-hidden');
    }

    if (mobileMenuToggle) mobileMenuToggle.addEventListener('click', openMobileSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeMobileSidebar);

    // ─────────────────────────────────────────────────────────────────
    // 6. MODULE 1: DASHBOARD OVERVIEW & KPIS
    // ─────────────────────────────────────────────────────────────────
    function renderOverview() {
        const leads = appData.leads || [];
        const reviews = appData.reviews || [];
        const portfolio = appData.portfolio || [];

        // KPI Counts
        const totalLeads = leads.length;
        const newLeads = leads.filter(l => l.status === 'New').length;
        const pendingReviews = reviews.filter(r => r.status === 'pending').length;
        const approvedReviews = reviews.filter(r => r.status === 'approved');
        const totalPortfolio = portfolio.length;

        // Calculate Average Star Rating
        let avgRating = 5.0;
        if (approvedReviews.length > 0) {
            const sum = approvedReviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
            avgRating = (sum / approvedReviews.length).toFixed(1);
        }

        // Update DOM KPIs
        const kpiTotalLeads = document.getElementById('kpiTotalLeads');
        const kpiNewLeadsPill = document.getElementById('kpiNewLeadsPill');
        const kpiPendingReviews = document.getElementById('kpiPendingReviews');
        const kpiPendingReviewsPill = document.getElementById('kpiPendingReviewsPill');
        const kpiTotalPortfolio = document.getElementById('kpiTotalPortfolio');
        const kpiAvgRating = document.getElementById('kpiAvgRating');
        const kpiApprovedReviewsCount = document.getElementById('kpiApprovedReviewsCount');

        if (kpiTotalLeads) kpiTotalLeads.textContent = totalLeads;
        if (kpiNewLeadsPill) kpiNewLeadsPill.textContent = `+${newLeads} New`;
        if (kpiPendingReviews) kpiPendingReviews.textContent = pendingReviews;
        if (kpiPendingReviewsPill) {
            kpiPendingReviewsPill.textContent = pendingReviews > 0 ? `${pendingReviews} Awaiting Action` : 'All Moderated';
        }
        if (kpiTotalPortfolio) kpiTotalPortfolio.textContent = totalPortfolio;
        if (kpiAvgRating) kpiAvgRating.textContent = `${avgRating} ★`;
        if (kpiApprovedReviewsCount) kpiApprovedReviewsCount.textContent = `Based on ${approvedReviews.length} approved reviews`;

        // Update Sidebar Badges
        updateSidebarBadges(newLeads, pendingReviews, totalPortfolio);

        // Render Recent Leads Table (Latest 5)
        const recentLeadsTable = document.getElementById('recentLeadsTableBody');
        if (recentLeadsTable) {
            const sorted = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
            if (sorted.length === 0) {
                recentLeadsTable.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-slate-400">No leads submitted yet.</td></tr>`;
            } else {
                recentLeadsTable.innerHTML = sorted.map(lead => `
                    <tr class="cursor-pointer hover:bg-slate-50 transition-colors" onclick="window.adminApp.openLeadDetail('${lead.id}')">
                        <td class="font-semibold text-slate-900">${escapeHtml(lead.clientName)}</td>
                        <td class="text-slate-600">${escapeHtml(lead.city)}</td>
                        <td class="text-slate-600">${escapeHtml((lead.services || []).join(', ') || 'Lawn Mowing')}</td>
                        <td>${formatDateShort(lead.createdAt)}</td>
                        <td>${renderStatusBadge(lead.status)}</td>
                    </tr>
                `).join('');
            }
        }

        // Render Pending Reviews Quick Moderation Widget
        const pendingReviewsWidget = document.getElementById('overviewPendingReviewsList');
        if (pendingReviewsWidget) {
            const pending = reviews.filter(r => r.status === 'pending');
            if (pending.length === 0) {
                pendingReviewsWidget.innerHTML = `
                    <div class="p-6 text-center text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                        <i class="fas fa-check-circle text-emerald-500 text-2xl mb-2"></i>
                        <p class="font-medium text-slate-700">All customer reviews are up to date!</p>
                        <p class="text-xs text-slate-500 mt-1">New reviews submitted on the public website will queue here for moderation.</p>
                    </div>
                `;
            } else {
                pendingReviewsWidget.innerHTML = pending.map(rev => `
                    <div class="p-4 bg-amber-50/50 border border-amber-200/70 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <span class="font-bold text-slate-900 text-sm">${escapeHtml(rev.name)}</span>
                                <span class="text-xs text-slate-500">&bull; ${escapeHtml(rev.city)}</span>
                                <span class="text-amber-500 text-xs">${'★'.repeat(rev.rating || 5)}</span>
                            </div>
                            <p class="text-xs text-slate-600 line-clamp-2 italic">&ldquo;${escapeHtml(rev.text)}&rdquo;</p>
                        </div>
                        <div class="flex items-center gap-2 shrink-0">
                            <button onclick="window.adminApp.approveReview('${rev.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-md shadow-sm transition-colors">
                                <i class="fas fa-check mr-1"></i> Approve
                            </button>
                            <button onclick="window.adminApp.openEditReviewModal('${rev.id}')" class="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md transition-colors">
                                <i class="fas fa-edit mr-1"></i> Edit
                            </button>
                            <button onclick="window.adminApp.deleteReview('${rev.id}')" class="px-2 py-1.5 text-slate-400 hover:text-red-600 text-xs transition-colors" title="Delete Review">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }
    }

    function updateSidebarBadges(newLeads, pendingReviews, totalPortfolio) {
        const leadBadge = document.getElementById('sidebarLeadsBadge');
        const reviewBadge = document.getElementById('sidebarReviewsBadge');
        const portfolioBadge = document.getElementById('sidebarPortfolioBadge');

        if (leadBadge) {
            leadBadge.textContent = newLeads;
            leadBadge.className = newLeads > 0 
                ? 'px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700' 
                : 'hidden';
        }
        if (reviewBadge) {
            reviewBadge.textContent = pendingReviews;
            reviewBadge.className = pendingReviews > 0 
                ? 'px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700' 
                : 'hidden';
        }
        if (portfolioBadge) {
            portfolioBadge.textContent = totalPortfolio;
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // 7. MODULE 2: QUOTE LEADS MANAGER, SATELLITE LOT CHECK & DRAWER
    // ─────────────────────────────────────────────────────────────────
    function renderLeadsTable() {
        const tableBody = document.getElementById('leadsTableBody');
        const leadsCountLabel = document.getElementById('leadsTotalCountLabel');
        if (!tableBody) return;

        let filtered = (appData.leads || []).filter(lead => {
            // Search text
            if (leadsFilter.search) {
                const q = leadsFilter.search.toLowerCase();
                const matchName = (lead.clientName || '').toLowerCase().includes(q);
                const matchPhone = (lead.clientPhone || '').toLowerCase().includes(q);
                const matchAddress = (lead.address || '').toLowerCase().includes(q);
                const matchNotes = (lead.notes || '').toLowerCase().includes(q);
                if (!matchName && !matchPhone && !matchAddress && !matchNotes) return false;
            }
            // City filter
            if (leadsFilter.city !== 'all') {
                if ((lead.city || '').toLowerCase() !== leadsFilter.city.toLowerCase()) return false;
            }
            // Status filter
            if (leadsFilter.status !== 'all') {
                if ((lead.status || '').toLowerCase() !== leadsFilter.status.toLowerCase()) return false;
            }
            return true;
        });

        // Sort newest first
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (leadsCountLabel) {
            leadsCountLabel.textContent = `Showing ${filtered.length} of ${(appData.leads || []).length} quote requests`;
        }

        if (filtered.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-12 text-slate-400">
                        <i class="fas fa-inbox text-3xl mb-2 text-slate-300 block"></i>
                        No quote leads matching your filters.
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = filtered.map(lead => `
            <tr class="hover:bg-slate-50 transition-colors">
                <td>
                    <div class="font-bold text-slate-900">${escapeHtml(lead.clientName)}</div>
                    <div class="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                        <a href="tel:${lead.clientPhone}" class="text-emerald-700 hover:underline flex items-center gap-1 font-medium">
                            <i class="fas fa-phone-alt text-[10px]"></i> ${escapeHtml(lead.clientPhone)}
                        </a>
                        <span>&bull;</span>
                        <span class="text-slate-400">${escapeHtml(lead.replyPreference || 'Text')}</span>
                    </div>
                </td>
                <td>
                    <div class="text-slate-900 font-medium text-xs">${escapeHtml(lead.address)}</div>
                    <div class="text-[11px] text-slate-500">${escapeHtml(lead.city)}, FL</div>
                </td>
                <td>
                    <span class="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium mb-1">
                        ${escapeHtml(lead.propertyType || 'Residential')}
                    </span>
                    <div class="text-xs text-slate-600 line-clamp-1 max-w-[180px]">
                        ${escapeHtml((lead.services || []).join(', '))}
                    </div>
                </td>
                <td>
                    <div class="text-xs font-medium text-slate-800">${escapeHtml(lead.yardCondition || 'Normal')}</div>
                    <div class="text-[11px] text-slate-500">${escapeHtml(lead.gateAccess || 'Standard Gate')}</div>
                </td>
                <td class="text-xs text-slate-500 whitespace-nowrap">
                    ${formatDateShort(lead.createdAt)}
                </td>
                <td>
                    <select onchange="window.adminApp.changeLeadStatus('${lead.id}', this.value)" class="text-xs font-semibold py-1 px-2.5 rounded-full border border-slate-200 bg-white shadow-sm focus:ring-1 focus:ring-emerald-500 focus:outline-none cursor-pointer">
                        <option value="New" ${lead.status === 'New' ? 'selected' : ''}>🔵 New Lead</option>
                        <option value="Quoted" ${lead.status === 'Quoted' ? 'selected' : ''}>🟣 Quoted</option>
                        <option value="Scheduled" ${lead.status === 'Scheduled' ? 'selected' : ''}>🟡 Scheduled</option>
                        <option value="Completed" ${lead.status === 'Completed' ? 'selected' : ''}>🟢 Completed</option>
                    </select>
                </td>
                <td>
                    <div class="flex items-center gap-2">
                        <button onclick="window.adminApp.openLeadDetail('${lead.id}')" class="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5">
                            <i class="fas fa-eye text-[11px]"></i> Details
                        </button>
                        <button onclick="window.adminApp.deleteLead('${lead.id}')" class="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors" title="Delete Lead">
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Lead Detail Slide-Over Drawer
    function openLeadDetail(leadId) {
        activeLeadId = leadId;
        const lead = (appData.leads || []).find(l => l.id === leadId);
        if (!lead || !leadDrawer || !leadDrawerBackdrop) return;

        // Populate Drawer Details
        const drawerName = document.getElementById('drawerLeadName');
        const drawerDate = document.getElementById('drawerLeadDate');
        const drawerStatusBadge = document.getElementById('drawerLeadStatusBadge');
        const drawerStatusSelect = document.getElementById('drawerStatusSelect');

        const drawerPhoneLink = document.getElementById('drawerPhoneLink');
        const drawerSmsLink = document.getElementById('drawerSmsLink');
        const drawerEmailLink = document.getElementById('drawerEmailLink');
        const drawerGoogleMapsLink = document.getElementById('drawerGoogleMapsLink');

        const drawerPropertyType = document.getElementById('drawerPropertyType');
        const drawerServices = document.getElementById('drawerServices');
        const drawerFrequency = document.getElementById('drawerFrequency');
        const drawerYardCondition = document.getElementById('drawerYardCondition');
        const drawerGateAccess = document.getElementById('drawerGateAccess');
        const drawerFullAddress = document.getElementById('drawerFullAddress');
        const drawerClientEmail = document.getElementById('drawerClientEmail');
        const drawerReplyPref = document.getElementById('drawerReplyPref');
        const drawerNotes = document.getElementById('drawerNotes');
        const drawerPhotosWrap = document.getElementById('drawerPhotosWrap');

        if (drawerName) drawerName.textContent = lead.clientName;
        if (drawerDate) drawerDate.textContent = `Submitted ${formatDateFull(lead.createdAt)}`;
        if (drawerStatusBadge) drawerStatusBadge.innerHTML = renderStatusBadge(lead.status);
        if (drawerStatusSelect) drawerStatusSelect.value = lead.status;

        // Quick Communication Actions
        const cleanPhone = (lead.clientPhone || '').replace(/[^0-9]/g, '');
        if (drawerPhoneLink) {
            drawerPhoneLink.href = `tel:${cleanPhone}`;
            drawerPhoneLink.innerHTML = `<i class="fas fa-phone-alt mr-2"></i> Call ${lead.clientPhone}`;
        }
        if (drawerSmsLink) {
            const smsText = encodeURIComponent(`Hi ${lead.clientName}! This is FLA Property Maintenance regarding your quote request for ${lead.address}, ${lead.city}. We measured your turf via satellite and can get you scheduled this week!`);
            drawerSmsLink.href = `sms:${cleanPhone}?&body=${smsText}`;
            drawerSmsLink.innerHTML = `<i class="fas fa-comment-dots mr-2"></i> Text Quote (SMS)`;
        }
        const clientEmail = lead.email || lead.clientEmail || '';
        if (drawerEmailLink) {
            if (clientEmail) {
                const mailSubject = encodeURIComponent(`Free Lawn & Landscape Estimate - FLA Property Maintenance LLC`);
                const mailBody = encodeURIComponent(`Hi ${lead.clientName},\n\nThank you for requesting an estimate with FLA Property Maintenance LLC for your property at ${lead.address}, ${lead.city}.\n\nWe would love to discuss your lawn and landscape needs:\n- Services: ${(lead.services || []).join(', ')}\n- Frequency: ${lead.frequency || 'Bi-Weekly'}\n\nPlease let us know if you have any questions or when you would like our commercial Scag crew to begin!\n\nBest regards,\nFLA Property Maintenance LLC\n(863) 712-8783\nestimates@flapropertymaintenance.com`);
                drawerEmailLink.href = `mailto:${clientEmail}?subject=${mailSubject}&body=${mailBody}`;
                drawerEmailLink.classList.remove('opacity-50', 'pointer-events-none');
            } else {
                drawerEmailLink.href = '#';
                drawerEmailLink.classList.add('opacity-50', 'pointer-events-none');
            }
        }
        if (drawerClientEmail) drawerClientEmail.textContent = clientEmail || 'Not provided';

        // Satellite Yard Check (Google Maps)
        if (drawerGoogleMapsLink) {
            const fullQuery = encodeURIComponent(`${lead.address}, ${lead.city}, FL`);
            drawerGoogleMapsLink.href = `https://www.google.com/maps/search/?api=1&query=${fullQuery}`;
        }

        // Form fields
        if (drawerPropertyType) drawerPropertyType.textContent = lead.propertyType || 'Residential';
        if (drawerServices) {
            drawerServices.innerHTML = (lead.services || []).map(s => 
                `<span class="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold mr-1.5 mb-1.5">${escapeHtml(s)}</span>`
            ).join('') || '<span class="text-slate-400">Standard Mowing</span>';
        }
        if (drawerFrequency) drawerFrequency.textContent = lead.frequency || 'Bi-Weekly Maintenance';
        if (drawerYardCondition) drawerYardCondition.textContent = lead.yardCondition || 'Maintained / Normal';
        if (drawerGateAccess) drawerGateAccess.textContent = lead.gateAccess || 'Wide Gate (Fits Scag)';
        if (drawerFullAddress) drawerFullAddress.textContent = `${lead.address}, ${lead.city}, FL`;
        if (drawerReplyPref) drawerReplyPref.textContent = lead.replyPreference || 'Text Message';
        if (drawerNotes) drawerNotes.textContent = lead.notes || 'No additional notes provided by client.';

        // Photos
        if (drawerPhotosWrap) {
            if (lead.photos && lead.photos.length > 0) {
                drawerPhotosWrap.innerHTML = lead.photos.map(src => `
                    <div class="relative rounded-lg overflow-hidden border border-slate-200 group cursor-pointer" onclick="window.adminApp.openPhotoPreview('${src}')">
                        <img src="${src}" alt="Yard Photo" class="w-full h-28 object-cover group-hover:scale-105 transition-transform">
                        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-medium transition-opacity">
                            <i class="fas fa-search-plus mr-1"></i> Expand
                        </div>
                    </div>
                `).join('');
            } else {
                drawerPhotosWrap.innerHTML = `<p class="text-xs text-slate-400 italic">No yard photos attached to this estimate request.</p>`;
            }
        }

        // Open drawer
        leadDrawerBackdrop.classList.add('is-open');
        leadDrawer.classList.add('is-open');
        document.body.classList.add('overflow-hidden');
    }

    function closeLeadDetail() {
        if (!leadDrawer || !leadDrawerBackdrop) return;
        leadDrawer.classList.remove('is-open');
        leadDrawerBackdrop.classList.remove('is-open');
        document.body.classList.remove('overflow-hidden');
        activeLeadId = null;
    }

    if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeLeadDetail);
    if (leadDrawerBackdrop) leadDrawerBackdrop.addEventListener('click', closeLeadDetail);

    function changeLeadStatus(leadId, newStatus) {
        const lead = (appData.leads || []).find(l => l.id === leadId);
        if (!lead) return;
        lead.status = newStatus;
        StorageAdapter.saveData(appData);
        renderLeadsTable();
        renderOverview();
        showToast(`Lead marked as "${newStatus}"`);
    }

    function deleteLead(leadId) {
        if (!confirm('Are you sure you want to delete this quote lead permanently?')) return;
        appData.leads = (appData.leads || []).filter(l => l.id !== leadId);
        StorageAdapter.saveData(appData);
        closeLeadDetail();
        renderLeadsTable();
        renderOverview();
        showToast('Quote lead removed.');
    }

    // CSV & Excel Exporter
    function exportLeadsCSV(isExcel = false) {
        const leads = appData.leads || [];
        if (leads.length === 0) {
            alert('No quote leads available to export.');
            return;
        }

        const headers = [
            'Lead ID', 'Submission Date', 'Status', 'Client Name', 'Phone',
            'Street Address', 'City', 'Property Type', 'Selected Services',
            'Frequency', 'Yard Condition', 'Gate Access', 'Reply Preference', 'Notes'
        ];

        const rows = leads.map(l => [
            l.id,
            new Date(l.createdAt).toLocaleDateString() + ' ' + new Date(l.createdAt).toLocaleTimeString(),
            l.status,
            l.clientName,
            l.clientPhone,
            l.address,
            l.city,
            l.propertyType,
            (l.services || []).join('; '),
            l.frequency,
            l.yardCondition,
            l.gateAccess,
            l.replyPreference,
            l.notes || ''
        ]);

        // Escape CSV values
        const csvContent = [
            headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
            ...rows.map(row => row.map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(','))
        ].join('\r\n');

        // Add UTF-8 BOM so Excel opens it with perfect formatting
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const filename = `FLA_Property_Maintenance_Leads_${new Date().toISOString().slice(0, 10)}${isExcel ? '.csv' : '.csv'}`;
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(`Downloaded ${filename} successfully!`);
    }

    // Filter Listeners
    const leadsSearchInput = document.getElementById('leadsSearchInput');
    const leadsCityFilter = document.getElementById('leadsCityFilter');
    const leadsStatusFilterTabs = document.querySelectorAll('[data-lead-status-tab]');

    if (leadsSearchInput) {
        leadsSearchInput.addEventListener('input', (e) => {
            leadsFilter.search = e.target.value.trim();
            renderLeadsTable();
        });
    }

    if (leadsCityFilter) {
        // Populate 16 Cities
        leadsCityFilter.innerHTML = '<option value="all">All Cities (Polk County & Central FL)</option>' +
            CITIES.map(c => `<option value="${c}">${c}</option>`).join('');
        leadsCityFilter.addEventListener('change', (e) => {
            leadsFilter.city = e.target.value;
            renderLeadsTable();
        });
    }

    leadsStatusFilterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            leadsStatusFilterTabs.forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');
            leadsFilter.status = tab.getAttribute('data-lead-status-tab');
            renderLeadsTable();
        });
    });

    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const exportExcelBtn = document.getElementById('exportExcelBtn');
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', () => exportLeadsCSV(false));
    if (exportExcelBtn) exportExcelBtn.addEventListener('click', () => exportLeadsCSV(true));

    // ─────────────────────────────────────────────────────────────────
    // 8. MODULE 3: CUSTOMER REVIEW MODERATION (PENDING -> APPROVE -> LIVE)
    // ─────────────────────────────────────────────────────────────────
    function renderReviewsList() {
        const listWrap = document.getElementById('reviewsListWrap');
        const countLabel = document.getElementById('reviewsCountLabel');
        if (!listWrap) return;

        const allReviews = appData.reviews || [];
        let filtered = allReviews;

        if (reviewsFilter.tab === 'pending') {
            filtered = allReviews.filter(r => r.status === 'pending');
        } else if (reviewsFilter.tab === 'approved') {
            filtered = allReviews.filter(r => r.status === 'approved');
        }

        // Sort newest first
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        if (countLabel) {
            countLabel.textContent = `Showing ${filtered.length} ${reviewsFilter.tab === 'all' ? '' : reviewsFilter.tab} customer reviews`;
        }

        // Update Tab Badges
        const pendingBadge = document.getElementById('reviewTabPendingBadge');
        const approvedBadge = document.getElementById('reviewTabApprovedBadge');
        const allBadge = document.getElementById('reviewTabAllBadge');

        const pendingCount = allReviews.filter(r => r.status === 'pending').length;
        const approvedCount = allReviews.filter(r => r.status === 'approved').length;

        if (pendingBadge) pendingBadge.textContent = pendingCount;
        if (approvedBadge) approvedBadge.textContent = approvedCount;
        if (allBadge) allBadge.textContent = allReviews.length;

        if (filtered.length === 0) {
            listWrap.innerHTML = `
                <div class="col-span-full py-16 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
                    <i class="fas fa-star-half-alt text-4xl mb-3 text-slate-300 block"></i>
                    <p class="font-semibold text-slate-700">No reviews in the "${reviewsFilter.tab}" queue.</p>
                    <p class="text-xs text-slate-500 mt-1">Customer reviews submitted via /reviews will queue for your approval.</p>
                </div>
            `;
            return;
        }

        listWrap.innerHTML = filtered.map(rev => `
            <div class="saas-card p-5 flex flex-col justify-between ${rev.status === 'pending' ? 'border-amber-300 bg-amber-50/20' : ''}">
                <div>
                    <div class="flex items-start justify-between gap-3 mb-3">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-sm border border-emerald-200 overflow-hidden shrink-0">
                                ${rev.avatarUrl ? `<img src="${rev.avatarUrl}" class="w-full h-full object-cover">` : getInitials(rev.name)}
                            </div>
                            <div>
                                <h4 class="font-bold text-slate-900 text-sm leading-snug">${escapeHtml(rev.name)}</h4>
                                <div class="text-xs text-slate-500">${escapeHtml(rev.city)}, FL &bull; ${escapeHtml(rev.propertyType || 'Homeowner')}</div>
                            </div>
                        </div>
                        <div>
                            ${rev.status === 'approved' 
                                ? `<span class="badge-status badge-status--approved"><i class="fas fa-check-circle"></i> Live</span>` 
                                : `<span class="badge-status badge-status--pending"><i class="fas fa-clock"></i> Pending Approval</span>`
                            }
                        </div>
                    </div>

                    <div class="flex items-center gap-2 mb-2">
                        <div class="text-amber-500 text-xs">
                            ${'★'.repeat(rev.rating || 5)}${'☆'.repeat(5 - (rev.rating || 5))}
                        </div>
                        <span class="inline-block px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                            ${escapeHtml(rev.service || 'Lawn Care')}
                        </span>
                    </div>

                    <p class="text-slate-700 text-xs leading-relaxed mb-4 italic">
                        &ldquo;${escapeHtml(rev.text)}&rdquo;
                    </p>
                </div>

                <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span class="text-slate-400 text-[11px]">${formatDateShort(rev.createdAt)}</span>
                    <div class="flex items-center gap-1.5">
                        ${rev.status === 'pending' ? `
                            <button onclick="window.adminApp.approveReview('${rev.id}')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1 shadow-sm">
                                <i class="fas fa-check"></i> Approve &amp; Publish
                            </button>
                        ` : `
                            <button onclick="window.adminApp.unpublishReview('${rev.id}')" class="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors flex items-center gap-1">
                                <i class="fas fa-eye-slash"></i> Unpublish
                            </button>
                        `}
                        <button onclick="window.adminApp.openEditReviewModal('${rev.id}')" class="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-100 transition-colors" title="Edit Review">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="window.adminApp.deleteReview('${rev.id}')" class="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors" title="Delete Review">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function approveReview(reviewId) {
        const rev = (appData.reviews || []).find(r => r.id === reviewId);
        if (!rev) return;
        rev.status = 'approved';
        StorageAdapter.saveData(appData);
        renderReviewsList();
        renderOverview();
        showToast(`Review by ${rev.name} approved & published live!`);
    }

    function unpublishReview(reviewId) {
        const rev = (appData.reviews || []).find(r => r.id === reviewId);
        if (!rev) return;
        rev.status = 'pending';
        StorageAdapter.saveData(appData);
        renderReviewsList();
        renderOverview();
        showToast(`Review moved back to pending moderation.`);
    }

    function deleteReview(reviewId) {
        if (!confirm('Are you sure you want to delete this customer review?')) return;
        appData.reviews = (appData.reviews || []).filter(r => r.id !== reviewId);
        StorageAdapter.saveData(appData);
        renderReviewsList();
        renderOverview();
        showToast('Review removed.');
    }

    // Review Filter Tabs
    const reviewFilterTabs = document.querySelectorAll('[data-review-tab]');
    reviewFilterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            reviewFilterTabs.forEach(t => t.classList.remove('is-active'));
            tab.classList.add('is-active');
            reviewsFilter.tab = tab.getAttribute('data-review-tab');
            renderReviewsList();
        });
    });

    // Edit Review Modal
    let activeEditingReviewId = null;
    function openEditReviewModal(reviewId = null) {
        activeEditingReviewId = reviewId;
        const modalTitle = document.getElementById('reviewModalTitle');
        const rev = reviewId ? (appData.reviews || []).find(r => r.id === reviewId) : null;

        if (modalTitle) {
            modalTitle.textContent = rev ? 'Edit Customer Review' : '+ Add Customer Review Manually';
        }

        const nameInput = document.getElementById('modalRevName');
        const citySelect = document.getElementById('modalRevCity');
        const propTypeSelect = document.getElementById('modalRevPropType');
        const serviceSelect = document.getElementById('modalRevService');
        const ratingSelect = document.getElementById('modalRevRating');
        const textInput = document.getElementById('modalRevText');
        const statusCheckbox = document.getElementById('modalRevPublishNow');

        // Populate city options
        if (citySelect) {
            citySelect.innerHTML = CITIES.map(c => `<option value="${c}">${c}</option>`).join('');
        }

        if (rev) {
            if (nameInput) nameInput.value = rev.name || '';
            if (citySelect) citySelect.value = rev.city || 'Lakeland';
            if (propTypeSelect) propTypeSelect.value = rev.propertyType || 'Residential Homeowner';
            if (serviceSelect) serviceSelect.value = rev.service || 'Lawn Mowing & Edging';
            if (ratingSelect) ratingSelect.value = rev.rating || 5;
            if (textInput) textInput.value = rev.text || '';
            if (statusCheckbox) statusCheckbox.checked = rev.status === 'approved';
        } else {
            if (nameInput) nameInput.value = '';
            if (citySelect) citySelect.value = 'Lakeland';
            if (propTypeSelect) propTypeSelect.value = 'Residential Homeowner';
            if (serviceSelect) serviceSelect.value = 'Lawn Mowing & Edging';
            if (ratingSelect) ratingSelect.value = 5;
            if (textInput) textInput.value = '';
            if (statusCheckbox) statusCheckbox.checked = true;
        }

        if (reviewModal) reviewModal.classList.add('is-open');
    }

    function closeReviewModal() {
        if (reviewModal) reviewModal.classList.remove('is-open');
        activeEditingReviewId = null;
    }

    if (closeReviewModalBtn) closeReviewModalBtn.addEventListener('click', closeReviewModal);
    if (cancelReviewModalBtn) cancelReviewModalBtn.addEventListener('click', closeReviewModal);

    const openAddReviewBtn = document.getElementById('openAddReviewBtn');
    if (openAddReviewBtn) {
        openAddReviewBtn.addEventListener('click', () => openEditReviewModal(null));
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('modalRevName').value.trim();
            const city = document.getElementById('modalRevCity').value;
            const propertyType = document.getElementById('modalRevPropType').value;
            const service = document.getElementById('modalRevService').value;
            const rating = Number(document.getElementById('modalRevRating').value) || 5;
            const text = document.getElementById('modalRevText').value.trim();
            const publishNow = document.getElementById('modalRevPublishNow').checked;

            if (!name || !text) {
                alert('Please provide reviewer name and review comments.');
                return;
            }

            if (activeEditingReviewId) {
                // Update existing
                const rev = (appData.reviews || []).find(r => r.id === activeEditingReviewId);
                if (rev) {
                    rev.name = name;
                    rev.city = city;
                    rev.propertyType = propertyType;
                    rev.service = service;
                    rev.rating = rating;
                    rev.text = text;
                    rev.status = publishNow ? 'approved' : 'pending';
                }
                showToast('Review updated successfully.');
            } else {
                // Add new manual review
                const newRev = {
                    id: 'rev_' + Date.now(),
                    name,
                    city,
                    propertyType,
                    service,
                    rating,
                    text,
                    avatarUrl: '',
                    status: publishNow ? 'approved' : 'pending',
                    createdAt: new Date().toISOString()
                };
                appData.reviews.unshift(newRev);
                showToast('New review added successfully!');
            }

            StorageAdapter.saveData(appData);
            closeReviewModal();
            renderReviewsList();
            renderOverview();
        });
    }

    // ─────────────────────────────────────────────────────────────────
    // 9. MODULE 4: PORTFOLIO & CAPTION MANAGER
    // ─────────────────────────────────────────────────────────────────
    function renderPortfolioGrid() {
        const gridWrap = document.getElementById('portfolioGridWrap');
        const countLabel = document.getElementById('portfolioCountLabel');
        if (!gridWrap) return;

        let filtered = (appData.portfolio || []).filter(item => {
            if (portfolioFilter.category !== 'all' && item.category !== portfolioFilter.category) return false;
            if (portfolioFilter.city !== 'all' && item.city !== portfolioFilter.city) return false;
            return true;
        });

        if (countLabel) {
            countLabel.textContent = `Showing ${filtered.length} of ${(appData.portfolio || []).length} completed projects`;
        }

        if (filtered.length === 0) {
            gridWrap.innerHTML = `
                <div class="col-span-full py-16 text-center text-slate-400 bg-white border border-slate-200 rounded-xl">
                    <i class="fas fa-camera text-4xl mb-3 text-slate-300 block"></i>
                    <p class="font-semibold text-slate-700">No projects found for the selected category.</p>
                </div>
            `;
            return;
        }

        gridWrap.innerHTML = filtered.map(item => `
            <div class="saas-card overflow-hidden flex flex-col justify-between group">
                <div>
                    <div class="relative h-48 bg-slate-100 overflow-hidden">
                        <img src="${item.imageUrl}" alt="${escapeHtml(item.altText || item.title)}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
                        <div class="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                            <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-900/80 text-white backdrop-blur-sm">
                                ${escapeHtml(item.city)}
                            </span>
                            ${item.featuredOnHome ? `
                                <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
                                    <i class="fas fa-home text-[9px] mr-1"></i> Home Featured
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    <div class="p-4">
                        <span class="text-[11px] font-bold uppercase tracking-wider text-emerald-700 mb-1 block">
                            ${escapeHtml(item.category)}
                        </span>
                        <h4 class="font-bold text-slate-900 text-sm mb-1.5 line-clamp-1">${escapeHtml(item.title)}</h4>
                        <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">${escapeHtml(item.caption)}</p>
                        <div class="text-[11px] text-slate-400 font-mono bg-slate-50 px-2 py-1 rounded border border-slate-100 line-clamp-1">
                            Alt: "${escapeHtml(item.altText || item.title)}"
                        </div>
                    </div>
                </div>

                <div class="p-4 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                    <label class="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                        <input type="checkbox" onchange="window.adminApp.togglePortfolioFeatured('${item.id}', this.checked)" ${item.featuredOnHome ? 'checked' : ''} class="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500">
                        <span>Feature on Home</span>
                    </label>
                    <div class="flex items-center gap-1">
                        <button onclick="window.adminApp.openEditPortfolioModal('${item.id}')" class="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors" title="Edit Project">
                            <i class="fas fa-edit text-xs"></i>
                        </button>
                        <button onclick="window.adminApp.deletePortfolio('${item.id}')" class="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="Delete Project">
                            <i class="fas fa-trash text-xs"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    function togglePortfolioFeatured(itemId, isFeatured) {
        const item = (appData.portfolio || []).find(p => p.id === itemId);
        if (!item) return;
        item.featuredOnHome = isFeatured;
        StorageAdapter.saveData(appData);
        showToast(isFeatured ? 'Project featured on Homepage!' : 'Project unfeatured from Homepage.');
    }

    function deletePortfolio(itemId) {
        if (!confirm('Are you sure you want to delete this portfolio project?')) return;
        appData.portfolio = (appData.portfolio || []).filter(p => p.id !== itemId);
        StorageAdapter.saveData(appData);
        renderPortfolioGrid();
        renderOverview();
        showToast('Project removed.');
    }

    // Add / Edit Portfolio Modal
    let activeEditingPortfolioId = null;
    let portfolioUploadedBase64 = null;

    function openEditPortfolioModal(itemId = null) {
        activeEditingPortfolioId = itemId;
        portfolioUploadedBase64 = null;
        const modalTitle = document.getElementById('portfolioModalTitle');
        const item = itemId ? (appData.portfolio || []).find(p => p.id === itemId) : null;

        if (modalTitle) {
            modalTitle.textContent = item ? 'Edit Portfolio Project' : '+ Add New Portfolio Project';
        }

        const titleInput = document.getElementById('modalPortTitle');
        const categorySelect = document.getElementById('modalPortCategory');
        const citySelect = document.getElementById('modalPortCity');
        const altInput = document.getElementById('modalPortAlt');
        const captionInput = document.getElementById('modalPortCaption');
        const featuredCheckbox = document.getElementById('modalPortFeatured');
        const previewImg = document.getElementById('portfolioImagePreview');
        const previewPlaceholder = document.getElementById('portfolioImagePlaceholder');

        // Populate city options
        if (citySelect) {
            citySelect.innerHTML = CITIES.map(c => `<option value="${c}">${c}</option>`).join('');
        }

        if (item) {
            if (titleInput) titleInput.value = item.title || '';
            if (categorySelect) categorySelect.value = item.category || 'Lawn Mowing & Edging';
            if (citySelect) citySelect.value = item.city || 'Lakeland';
            if (altInput) altInput.value = item.altText || '';
            if (captionInput) captionInput.value = item.caption || '';
            if (featuredCheckbox) featuredCheckbox.checked = !!item.featuredOnHome;
            if (previewImg) {
                previewImg.src = item.imageUrl || '';
                previewImg.classList.remove('hidden');
            }
            if (previewPlaceholder) previewPlaceholder.classList.add('hidden');
        } else {
            if (titleInput) titleInput.value = '';
            if (categorySelect) categorySelect.value = 'Lawn Mowing & Edging';
            if (citySelect) citySelect.value = 'Lakeland';
            if (altInput) altInput.value = '';
            if (captionInput) captionInput.value = '';
            if (featuredCheckbox) featuredCheckbox.checked = true;
            if (previewImg) {
                previewImg.src = '';
                previewImg.classList.add('hidden');
            }
            if (previewPlaceholder) previewPlaceholder.classList.remove('hidden');
        }

        if (portfolioModal) portfolioModal.classList.add('is-open');
    }

    function closePortfolioModal() {
        if (portfolioModal) portfolioModal.classList.remove('is-open');
        activeEditingPortfolioId = null;
        portfolioUploadedBase64 = null;
    }

    if (closePortfolioModalBtn) closePortfolioModalBtn.addEventListener('click', closePortfolioModal);
    if (cancelPortfolioModalBtn) cancelPortfolioModalBtn.addEventListener('click', closePortfolioModal);

    const openAddPortfolioBtn = document.getElementById('openAddPortfolioBtn');
    if (openAddPortfolioBtn) {
        openAddPortfolioBtn.addEventListener('click', () => openEditPortfolioModal(null));
    }

    // Portfolio File Reader
    const portfolioFileInput = document.getElementById('portfolioFileInput');
    const portfolioDropzone = document.getElementById('portfolioDropzone');
    if (portfolioDropzone && portfolioFileInput) {
        portfolioDropzone.addEventListener('click', () => portfolioFileInput.click());
        portfolioFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                portfolioUploadedBase64 = event.target.result;
                const previewImg = document.getElementById('portfolioImagePreview');
                const placeholder = document.getElementById('portfolioImagePlaceholder');
                if (previewImg) {
                    previewImg.src = portfolioUploadedBase64;
                    previewImg.classList.remove('hidden');
                }
                if (placeholder) placeholder.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        });
    }

    if (portfolioForm) {
        portfolioForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = document.getElementById('modalPortTitle').value.trim();
            const category = document.getElementById('modalPortCategory').value;
            const city = document.getElementById('modalPortCity').value;
            const altText = document.getElementById('modalPortAlt').value.trim();
            const caption = document.getElementById('modalPortCaption').value.trim();
            const featuredOnHome = document.getElementById('modalPortFeatured').checked;

            if (!title) {
                alert('Please enter a project title.');
                return;
            }

            if (activeEditingPortfolioId) {
                // Update
                const item = (appData.portfolio || []).find(p => p.id === activeEditingPortfolioId);
                if (item) {
                    item.title = title;
                    item.category = category;
                    item.city = city;
                    item.altText = altText || title;
                    item.caption = caption;
                    item.featuredOnHome = featuredOnHome;
                    if (portfolioUploadedBase64) {
                        item.imageUrl = portfolioUploadedBase64;
                    }
                }
                showToast('Portfolio project updated!');
            } else {
                // Add new
                const newItem = {
                    id: 'port_' + Date.now(),
                    title,
                    category,
                    city,
                    altText: altText || title,
                    caption,
                    featuredOnHome,
                    imageUrl: portfolioUploadedBase64 || 'assets/images/hero-lawn-mowing.webp',
                    order: (appData.portfolio || []).length + 1
                };
                appData.portfolio.unshift(newItem);
                showToast('New project published to portfolio!');
            }

            StorageAdapter.saveData(appData);
            closePortfolioModal();
            renderPortfolioGrid();
            renderOverview();
        });
    }

    // Portfolio Category Filter Dropdown
    const portCategoryFilter = document.getElementById('portfolioCategoryFilter');
    if (portCategoryFilter) {
        portCategoryFilter.addEventListener('change', (e) => {
            portfolioFilter.category = e.target.value;
            renderPortfolioGrid();
        });
    }

    // ─────────────────────────────────────────────────────────────────
    // 10. MODULE 5: LIVE PAGE TEXT CMS (ALL 9 PAGES)
    // ─────────────────────────────────────────────────────────────────
    let currentCmsPage = 'home';

    function renderCmsEditor() {
        const selector = document.getElementById('cmsPageSelector');
        if (selector) selector.value = currentCmsPage;

        const texts = (appData.site_settings && appData.site_settings.page_texts) 
            ? (appData.site_settings.page_texts[currentCmsPage] || {}) 
            : {};
        const contact = (appData.site_settings && appData.site_settings.contact) || {};

        const h1Input = document.getElementById('cmsH1Input');
        const subheadlineInput = document.getElementById('cmsSubheadlineInput');
        const phoneInput = document.getElementById('cmsPhoneInput');
        const hoursInput = document.getElementById('cmsHoursInput');
        const paymentsInput = document.getElementById('cmsPaymentsInput');
        const ctaInput = document.getElementById('cmsCtaInput');

        if (h1Input) h1Input.value = texts.h1 || '';
        if (subheadlineInput) subheadlineInput.value = texts.subheadline || '';
        if (phoneInput) phoneInput.value = contact.phone || '(863) 712-8783';
        if (hoursInput) hoursInput.value = contact.hours || '7 Days a Week — Rain or Shine';
        if (paymentsInput) paymentsInput.value = contact.payments || 'Zelle, Cash App, Cash, Check';
        if (ctaInput) ctaInput.value = texts.cta_primary || 'Get Free Estimate';
    }

    const cmsPageSelector = document.getElementById('cmsPageSelector');
    if (cmsPageSelector) {
        cmsPageSelector.addEventListener('change', (e) => {
            currentCmsPage = e.target.value;
            renderCmsEditor();
        });
    }

    const saveCmsBtn = document.getElementById('saveCmsBtn');
    if (saveCmsBtn) {
        saveCmsBtn.addEventListener('click', () => {
            if (!appData.site_settings) appData.site_settings = {};
            if (!appData.site_settings.page_texts) appData.site_settings.page_texts = {};
            if (!appData.site_settings.page_texts[currentCmsPage]) appData.site_settings.page_texts[currentCmsPage] = {};
            if (!appData.site_settings.contact) appData.site_settings.contact = {};

            const h1Input = document.getElementById('cmsH1Input');
            const subheadlineInput = document.getElementById('cmsSubheadlineInput');
            const phoneInput = document.getElementById('cmsPhoneInput');
            const hoursInput = document.getElementById('cmsHoursInput');
            const paymentsInput = document.getElementById('cmsPaymentsInput');
            const ctaInput = document.getElementById('cmsCtaInput');

            appData.site_settings.page_texts[currentCmsPage].h1 = h1Input.value.trim();
            appData.site_settings.page_texts[currentCmsPage].subheadline = subheadlineInput.value.trim();
            appData.site_settings.page_texts[currentCmsPage].cta_primary = ctaInput.value.trim();

            appData.site_settings.contact.phone = phoneInput.value.trim();
            appData.site_settings.contact.hours = hoursInput.value.trim();
            appData.site_settings.contact.payments = paymentsInput.value.trim();

            StorageAdapter.saveData(appData);
            showToast(`Page texts saved for "${currentCmsPage.toUpperCase()}"!`);
        });
    }

    // ─────────────────────────────────────────────────────────────────
    // 11. MODULE 6: BRAND COLOR CUSTOMIZER
    // ─────────────────────────────────────────────────────────────────
    function renderBrandingCustomizer() {
        const colors = (appData.site_settings && appData.site_settings.colors) || {
            primary: '#007f5f',
            accent: '#80b918',
            darkBg: '#032119',
            lightBg: '#F8FAFC'
        };

        const primaryPicker = document.getElementById('colorPickerPrimary');
        const primaryHex = document.getElementById('colorHexPrimary');
        const accentPicker = document.getElementById('colorPickerAccent');
        const accentHex = document.getElementById('colorHexAccent');
        const darkPicker = document.getElementById('colorPickerDark');
        const darkHex = document.getElementById('colorHexDark');
        const lightPicker = document.getElementById('colorPickerLight');
        const lightHex = document.getElementById('colorHexLight');

        if (primaryPicker) primaryPicker.value = colors.primary;
        if (primaryHex) primaryHex.value = colors.primary;
        if (accentPicker) accentPicker.value = colors.accent;
        if (accentHex) accentHex.value = colors.accent;
        if (darkPicker) darkPicker.value = colors.darkBg;
        if (darkHex) darkHex.value = colors.darkBg;
        if (lightPicker) lightPicker.value = colors.lightBg;
        if (lightHex) lightHex.value = colors.lightBg;

        updateLiveColorPreview(colors);
    }

    function updateLiveColorPreview(colors) {
        const previewPrimary = document.getElementById('previewBrandBtn');
        const previewDarkBox = document.getElementById('previewDarkBox');
        if (previewPrimary) previewPrimary.style.backgroundColor = colors.primary;
        if (previewDarkBox) previewDarkBox.style.backgroundColor = colors.darkBg;
    }

    // Sync color inputs
    function bindColorPair(pickerId, hexId, key) {
        const picker = document.getElementById(pickerId);
        const hex = document.getElementById(hexId);
        if (!picker || !hex) return;

        picker.addEventListener('input', (e) => {
            hex.value = e.target.value.toUpperCase();
            if (appData.site_settings && appData.site_settings.colors) {
                appData.site_settings.colors[key] = e.target.value;
                updateLiveColorPreview(appData.site_settings.colors);
            }
        });

        hex.addEventListener('input', (e) => {
            if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                picker.value = e.target.value;
                if (appData.site_settings && appData.site_settings.colors) {
                    appData.site_settings.colors[key] = e.target.value;
                    updateLiveColorPreview(appData.site_settings.colors);
                }
            }
        });
    }

    bindColorPair('colorPickerPrimary', 'colorHexPrimary', 'primary');
    bindColorPair('colorPickerAccent', 'colorHexAccent', 'accent');
    bindColorPair('colorPickerDark', 'colorHexDark', 'darkBg');
    bindColorPair('colorPickerLight', 'colorHexLight', 'lightBg');

    const saveBrandingBtn = document.getElementById('saveBrandingBtn');
    if (saveBrandingBtn) {
        saveBrandingBtn.addEventListener('click', () => {
            StorageAdapter.saveData(appData);
            showToast('Brand theme colors updated & published live!');
        });
    }

    const resetBrandingBtn = document.getElementById('resetBrandingBtn');
    if (resetBrandingBtn) {
        resetBrandingBtn.addEventListener('click', () => {
            if (!confirm('Reset colors to default Jungle Teal & Lime Moss theme?')) return;
            appData.site_settings.colors = {
                primary: '#007f5f',
                accent: '#80b918',
                darkBg: '#032119',
                lightBg: '#F8FAFC'
            };
            StorageAdapter.saveData(appData);
            renderBrandingCustomizer();
            showToast('Colors restored to default!');
        });
    }

    // ─────────────────────────────────────────────────────────────────
    // 12. MODULE 7: SETTINGS, SECURITY & DATABASE BACKUPS
    // ─────────────────────────────────────────────────────────────────
    function renderSettingsView() {
        const dbStatsLeads = document.getElementById('dbStatsLeads');
        const dbStatsReviews = document.getElementById('dbStatsReviews');
        const dbStatsProjects = document.getElementById('dbStatsProjects');

        if (dbStatsLeads) dbStatsLeads.textContent = (appData.leads || []).length;
        if (dbStatsReviews) dbStatsReviews.textContent = (appData.reviews || []).length;
        if (dbStatsProjects) dbStatsProjects.textContent = (appData.portfolio || []).length;
    }

    // Password Change Modal
    const openChangePasswordBtn = document.getElementById('openChangePasswordBtn');
    if (openChangePasswordBtn) {
        openChangePasswordBtn.addEventListener('click', () => {
            const currentInput = document.getElementById('currentPasswordInput');
            const newInput = document.getElementById('newPasswordInput');
            const confirmInput = document.getElementById('confirmPasswordInput');
            if (currentInput) currentInput.value = '';
            if (newInput) newInput.value = '';
            if (confirmInput) confirmInput.value = '';
            if (passwordModal) passwordModal.classList.add('is-open');
        });
    }

    function closePasswordModal() {
        if (passwordModal) passwordModal.classList.remove('is-open');
    }

    if (closePasswordModalBtn) closePasswordModalBtn.addEventListener('click', closePasswordModal);
    if (cancelPasswordModalBtn) cancelPasswordModalBtn.addEventListener('click', closePasswordModal);

    if (passwordForm) {
        passwordForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const currentPass = document.getElementById('currentPasswordInput').value;
            const newPass = document.getElementById('newPasswordInput').value.trim();
            const confirmPass = document.getElementById('confirmPasswordInput').value.trim();

            if (currentPass !== StorageAdapter.getPassword()) {
                alert('Current password does not match.');
                return;
            }
            if (newPass.length < 6) {
                alert('New password must be at least 6 characters long.');
                return;
            }
            if (newPass !== confirmPass) {
                alert('New passwords do not match.');
                return;
            }

            StorageAdapter.setPassword(newPass);
            closePasswordModal();
            showToast('Admin password changed successfully!');
        });
    }

    // Database JSON Backup Export & Import
    const downloadBackupBtn = document.getElementById('downloadBackupBtn');
    if (downloadBackupBtn) {
        downloadBackupBtn.addEventListener('click', () => {
            const jsonStr = JSON.stringify(appData, null, 2);
            const blob = new Blob([jsonStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const filename = `FLA_Property_Maintenance_Backup_${new Date().toISOString().slice(0, 10)}.json`;
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('Database backup downloaded!');
        });
    }

    const restoreBackupInput = document.getElementById('restoreBackupInput');
    if (restoreBackupInput) {
        restoreBackupInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const parsed = JSON.parse(event.target.result);
                    if (parsed.leads && parsed.reviews && parsed.site_settings) {
                        appData = parsed;
                        StorageAdapter.saveData(appData);
                        renderAll();
                        showToast('Database restored successfully!');
                    } else {
                        alert('Invalid backup file structure.');
                    }
                } catch (err) {
                    alert('Could not parse JSON backup file.');
                }
            };
            reader.readAsText(file);
        });
    }

    const resetDemoDataBtn = document.getElementById('resetDemoDataBtn');
    if (resetDemoDataBtn) {
        resetDemoDataBtn.addEventListener('click', () => {
            if (!confirm('Warning: This will reset all leads, reviews, and portfolio items to fresh demo data. Continue?')) return;
            appData = StorageAdapter.resetToDefaults();
            renderAll();
            showToast('Reset to initial Polk County seed data!');
        });
    }

    // ─────────────────────────────────────────────────────────────────
    // 13. PHOTO EXPANDER LIGHTBOX
    // ─────────────────────────────────────────────────────────────────
    const photoModal = document.getElementById('photoModal');
    const photoModalImg = document.getElementById('photoModalImg');
    const closePhotoModalBtn = document.getElementById('closePhotoModalBtn');

    function openPhotoPreview(src) {
        if (!photoModal || !photoModalImg) return;
        photoModalImg.src = src;
        photoModal.classList.add('is-open');
    }

    function closePhotoPreview() {
        if (!photoModal) return;
        photoModal.classList.remove('is-open');
    }

    if (closePhotoModalBtn) closePhotoModalBtn.addEventListener('click', closePhotoPreview);
    if (photoModal) {
        photoModal.addEventListener('click', (e) => {
            if (e.target === photoModal) closePhotoPreview();
        });
    }

    // ─────────────────────────────────────────────────────────────────
    // 14. HELPER FORMATTING FUNCTIONS
    // ─────────────────────────────────────────────────────────────────
    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function formatDateShort(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    function formatDateFull(iso) {
        if (!iso) return '';
        const d = new Date(iso);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + 
               ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }

    function getInitials(name) {
        if (!name) return 'FL';
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function renderStatusBadge(status) {
        const s = (status || 'New').toLowerCase();
        if (s === 'new') {
            return `<span class="badge-status badge-status--new"><span class="status-indicator-dot"></span> New Lead</span>`;
        } else if (s === 'quoted') {
            return `<span class="badge-status badge-status--quoted"><span class="status-indicator-dot"></span> Quoted</span>`;
        } else if (s === 'scheduled') {
            return `<span class="badge-status badge-status--scheduled"><span class="status-indicator-dot"></span> Scheduled</span>`;
        } else if (s === 'completed') {
            return `<span class="badge-status badge-status--completed"><span class="status-indicator-dot"></span> Completed</span>`;
        }
        return `<span class="badge-status">${status}</span>`;
    }

    function renderAll() {
        renderOverview();
        renderLeadsTable();
        renderReviewsList();
        renderPortfolioGrid();
        renderCmsEditor();
        renderBrandingCustomizer();
        renderSettingsView();
    }

    // Expose functions globally for inline HTML event handlers
    window.adminApp = {
        openLeadDetail,
        changeLeadStatus,
        deleteLead,
        approveReview,
        unpublishReview,
        deleteReview,
        openEditReviewModal,
        togglePortfolioFeatured,
        openEditPortfolioModal,
        deletePortfolio,
        openPhotoPreview
    };

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', initAuth);
})();
