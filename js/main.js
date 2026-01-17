/**
 * SCALEUP.AI - Premium Landing Page JavaScript
 * Dark Premium SaaS Marketing Platform
 * ================================================
 */

(function() {
    'use strict';

    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const DOM = {
        header: document.querySelector('.header'),
        mobileToggle: document.querySelector('.mobile-toggle'),
        mobileMenu: document.querySelector('.mobile-menu'),
        mobileNavMenu: document.querySelector('.mobile-nav-menu'),
        mobileNavActions: document.querySelector('.mobile-nav-actions'),
        tabButtons: document.querySelectorAll('.tab-btn'),
        tabContents: document.querySelectorAll('.tab-content'),
        faqItems: document.querySelectorAll('.faq-item'),
        animatedElements: document.querySelectorAll('.step-card, .audience-card, .tool-card, .testimonial-card, .differential-item, .pricing-card')
    };

    // ==========================================================================
    // HEADER SCROLL EFFECT
    // ==========================================================================
    function initHeaderScroll() {
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;
            
            // Add scrolled class for enhanced shadow effect
            if (scrollY > 50) {
                DOM.header.classList.add('scrolled');
            } else {
                DOM.header.classList.remove('scrolled');
            }

            lastScrollY = scrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // ==========================================================================
    // MOBILE NAVIGATION - FIXED: Auto-close on link click
    // ==========================================================================
    function initMobileNav() {
        if (!DOM.mobileToggle || !DOM.mobileMenu) return;

        // Toggle menu
        DOM.mobileToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMobileMenu();
        });

        // Close menu when clicking on nav links
        if (DOM.mobileNavMenu) {
            DOM.mobileNavMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    closeMobileMenu();
                });
            });
        }

        // Close menu when clicking on action buttons
        if (DOM.mobileNavActions) {
            DOM.mobileNavActions.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', function() {
                    closeMobileMenu();
                });
            });
        }

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (DOM.mobileMenu.classList.contains('active')) {
                if (!DOM.mobileMenu.contains(e.target) && !DOM.mobileToggle.contains(e.target)) {
                    closeMobileMenu();
                }
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && DOM.mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    function toggleMobileMenu() {
        const isOpen = DOM.mobileMenu.classList.contains('active');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        DOM.mobileMenu.classList.add('active');
        DOM.mobileToggle.innerHTML = '<i class="fas fa-times"></i>';
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        DOM.mobileMenu.classList.remove('active');
        DOM.mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.body.style.overflow = '';
    }

    // ==========================================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                e.preventDefault();
                
                const target = document.querySelector(href);
                if (!target) return;

                const headerHeight = DOM.header.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // ==========================================================================
    // TOOLS TABS
    // ==========================================================================
    function initTabs() {
        if (!DOM.tabButtons.length) return;

        DOM.tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Update buttons
                DOM.tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Update content with fade effect
                DOM.tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }

    // ==========================================================================
    // FAQ ACCORDION
    // ==========================================================================
    function initFAQ() {
        if (!DOM.faqItems.length) return;

        DOM.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                // Close all items
                DOM.faqItems.forEach(faq => faq.classList.remove('active'));
                
                // Open clicked item if it wasn't active
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // ==========================================================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ==========================================================================
    function initScrollAnimations() {
        // Check for reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            // Make all elements visible without animation
            DOM.animatedElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -80px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Add animation class and observe
        DOM.animatedElements.forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.transitionDelay = `${Math.min(index * 0.05, 0.3)}s`;
            observer.observe(el);
        });

        // Additional elements to animate
        const additionalElements = document.querySelectorAll('.section-header, .differentials-content, .differentials-visual, .cta-content, .testimonials-stats, .pricing-guarantee');
        additionalElements.forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    // ==========================================================================
    // COUNTER ANIMATION
    // ==========================================================================
    function initCounters() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        if (!counters.length) return;

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const animateCounter = (counter) => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const text = counter.textContent;
            let suffix = '';
            let isDecimal = text.includes('.');
            let decimals = 0;
            
            // Extract suffix and decimal places
            if (text.includes('K')) {
                suffix = 'K+';
            } else if (text.includes('M')) {
                suffix = 'M+';
            } else if (text.includes('%')) {
                suffix = '%';
                decimals = 1;
            } else if (text.includes('/')) {
                suffix = '/5';
                decimals = 1;
            } else if (text.includes('+')) {
                suffix = '+';
            }
            
            const duration = 2000;
            const startTime = performance.now();
            
            const updateCounter = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Easing function for smooth animation
                const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                const current = target * easeOutQuart;
                
                if (suffix === 'K+') {
                    counter.textContent = (current / 1000).toFixed(1) + 'K+';
                } else if (suffix === 'M+') {
                    counter.textContent = (current / 1000000).toFixed(1) + 'M+';
                } else if (decimals > 0) {
                    counter.textContent = current.toFixed(decimals) + suffix;
                } else {
                    counter.textContent = Math.floor(current).toLocaleString() + suffix;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = text; // Reset to original text
                }
            };
            
            requestAnimationFrame(updateCounter);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => observer.observe(counter));
    }

    // ==========================================================================
    // FLOATING CARDS PARALLAX
    // ==========================================================================
    function initParallax() {
        const floatingCards = document.querySelectorAll('.floating-card');
        
        if (!floatingCards.length || window.innerWidth < 768) return;

        let rafId = null;

        window.addEventListener('mousemove', (e) => {
            if (rafId) return;
            
            rafId = requestAnimationFrame(() => {
                const mouseX = e.clientX / window.innerWidth;
                const mouseY = e.clientY / window.innerHeight;

                floatingCards.forEach((card, index) => {
                    const speed = (index + 1) * 8;
                    const x = (mouseX - 0.5) * speed;
                    const y = (mouseY - 0.5) * speed;
                    
                    card.style.transform = `translate(${x}px, ${y}px)`;
                });
                
                rafId = null;
            });
        });
    }

    // ==========================================================================
    // CTA BUTTON TRACKING (Analytics ready)
    // ==========================================================================
    function initCTATracking() {
        const ctaButtons = document.querySelectorAll('.btn-primary, .pricing-btn');
        
        ctaButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                // Track CTA clicks - ready for analytics integration
                const buttonText = this.textContent.trim();
                const section = this.closest('section')?.id || 'header';
                
                console.log(`[Scaleup.ai] CTA Clicked: "${buttonText}" in section "${section}"`);
                
                // Google Analytics example (uncomment when GA is set up):
                // if (typeof gtag !== 'undefined') {
                //     gtag('event', 'click', {
                //         'event_category': 'CTA',
                //         'event_label': buttonText,
                //         'section': section
                //     });
                // }
            });
        });
    }

    // ==========================================================================
    // LOADING STATE
    // ==========================================================================
    function initLoadingState() {
        window.addEventListener('load', function() {
            document.body.classList.add('loaded');
            
            // Trigger hero animations after page load
            setTimeout(() => {
                document.querySelector('.hero-content')?.classList.add('visible');
                document.querySelector('.hero-visual')?.classList.add('visible');
            }, 100);
        });
    }

    // ==========================================================================
    // KEYBOARD NAVIGATION
    // ==========================================================================
    function initKeyboardNav() {
        // FAQ keyboard navigation
        DOM.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            
            question.setAttribute('tabindex', '0');
            question.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });

        // Tab keyboard navigation
        DOM.tabButtons.forEach(button => {
            button.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    }

    // ==========================================================================
    // PRICING CARD HOVER EFFECTS
    // ==========================================================================
    function initPricingEffects() {
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        pricingCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // Add subtle glow on hover
                this.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        });
    }

    // ==========================================================================
    // TOOL CARD COMING SOON INTERACTION
    // ==========================================================================
    function initComingSoonCard() {
        const comingSoonCard = document.querySelector('.coming-soon-card');
        
        if (!comingSoonCard) return;
        
        // Add subtle pulse effect to coming soon badge
        const badge = comingSoonCard.querySelector('.coming-soon-badge');
        if (badge) {
            setInterval(() => {
                badge.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    badge.style.transform = 'scale(1)';
                }, 200);
            }, 3000);
        }
    }

    // ==========================================================================
    // INITIALIZE ALL MODULES
    // ==========================================================================
    function init() {
        initHeaderScroll();
        initMobileNav();
        initSmoothScroll();
        initTabs();
        initFAQ();
        initScrollAnimations();
        initCounters();
        initParallax();
        initCTATracking();
        initLoadingState();
        initKeyboardNav();
        initPricingEffects();
        initComingSoonCard();
        
        console.log('%c[Scaleup.ai] Premium Landing Page initialized successfully', 'color: #FF9029; font-weight: bold;');
    }

    // Run initialization when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
