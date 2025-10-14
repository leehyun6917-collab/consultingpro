/**
 * 컨설팅 프로 - Main JavaScript
 */

(function() {
    'use strict';

    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.menu-close');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    // Ensure menu is closed on page load
    if (navMenu) {
        navMenu.classList.remove('active');
        body.style.overflow = '';
    }
    if (menuToggle) {
        menuToggle.classList.remove('active');
    }

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            // Toggle the menu state
            const isActive = navMenu.classList.contains('active');
            if (isActive) {
                // Close menu
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                body.style.overflow = '';
            } else {
                // Open menu
                navMenu.classList.add('active');
                menuToggle.classList.add('active');
                body.style.overflow = 'hidden';
            }
        });
    }

    if (menuClose && navMenu) {
        menuClose.addEventListener('click', function(e) {
            e.stopPropagation();
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
            body.style.overflow = '';
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
                body.style.overflow = '';
            }
        }
    });

    // Close menu when clicking on a link
    const menuLinks = document.querySelectorAll('.nav-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (menuToggle) {
                    menuToggle.classList.remove('active');
                }
                body.style.overflow = '';
            }
        });
    });

    // ========================================
    // Review Slider
    // ========================================
    const reviewCards = document.querySelectorAll('.review-card');
    const prevBtn = document.querySelector('.review-prev');
    const nextBtn = document.querySelector('.review-next');
    let currentReview = 0;

    function showReview(index) {
        reviewCards.forEach(card => card.classList.remove('active'));
        if (reviewCards[index]) {
            reviewCards[index].classList.add('active');
        }
    }

    if (prevBtn && nextBtn && reviewCards.length > 0) {
        prevBtn.addEventListener('click', function() {
            currentReview = (currentReview - 1 + reviewCards.length) % reviewCards.length;
            showReview(currentReview);

            // Track event
            if (window.gtag) {
                gtag('event', 'review_slide', {
                    'direction': 'previous',
                    'review_index': currentReview
                });
            }
        });

        nextBtn.addEventListener('click', function() {
            currentReview = (currentReview + 1) % reviewCards.length;
            showReview(currentReview);

            // Track event
            if (window.gtag) {
                gtag('event', 'review_slide', {
                    'direction': 'next',
                    'review_index': currentReview
                });
            }
        });

        // Auto-slide reviews
        setInterval(function() {
            currentReview = (currentReview + 1) % reviewCards.length;
            showReview(currentReview);
        }, 5000);
    }

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (mobileMenu && mobileMenu.classList.contains('active')) {
                    mobileMenu.classList.remove('active');
                    body.style.overflow = '';
                }
            }
        });
    });

    // ========================================
    // FAQ Tracking
    // ========================================
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach((item, index) => {
        item.addEventListener('toggle', function() {
            if (this.open && window.gtag) {
                const question = this.querySelector('.faq-question').textContent;
                gtag('event', 'faq_toggle', {
                    'faq_question': question,
                    'faq_index': index,
                    'action': 'open'
                });
            }
        });
    });

    // ========================================
    // Scroll Animations
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');

                // Track section views
                if (window.gtag && entry.target.dataset.section) {
                    gtag('event', 'view_content', {
                        'content_type': 'section',
                        'content_id': entry.target.dataset.section
                    });
                }
            }
        });
    }, observerOptions);

    // Observe sections for animation
    const animatedSections = document.querySelectorAll('.kpi-item, .process-step, .program-card, .partner-item');
    animatedSections.forEach(section => {
        observer.observe(section);
    });

    // ========================================
    // Header Scroll Effect
    // ========================================
    const header = document.querySelector('.header');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Hide/show header on scroll
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.classList.add('hidden');
        } else {
            header.classList.remove('hidden');
        }

        lastScrollTop = scrollTop;
    });

    // ========================================
    // Tab Functionality for What We Do Section
    // ========================================
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // Track event
            if (window.gtag) {
                gtag('event', 'tab_click', {
                    'tab_name': targetTab,
                    'section': 'what_we_do'
                });
            }
        });
    });

    // ========================================
    // Process Steps Interaction
    // ========================================
    const processSteps = document.querySelectorAll('.process-step');

    processSteps.forEach((step, index) => {
        step.addEventListener('mouseenter', function() {
            // Remove active from all
            processSteps.forEach(s => s.querySelector('.step-circle').classList.remove('active'));
            // Add active to current
            this.querySelector('.step-circle').classList.add('active');
        });
    });

    // ========================================
    // Partner Logo Impression Tracking
    // ========================================
    const partnersSection = document.querySelector('.partners-section');

    if (partnersSection) {
        const partnersObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && window.gtag) {
                    gtag('event', 'logo_impression', {
                        'section': 'partners',
                        'visibility': entry.intersectionRatio
                    });
                    partnersObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        partnersObserver.observe(partnersSection);
    }

    // ========================================
    // Form Validation (for future use)
    // ========================================
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePhone(phone) {
        const re = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
        return re.test(phone);
    }

    // ========================================
    // Loading Performance
    // ========================================
    window.addEventListener('load', function() {
        // Add loaded class for animations
        document.body.classList.add('loaded');

        // Lazy load images
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    });

    // ========================================
    // Consult Page Redirect
    // ========================================
    if (window.location.pathname === '/consult' || window.location.pathname === '/consult.html') {
        // Add aria-live region for accessibility
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.textContent = '카카오 채널로 이동 중입니다...';
        document.body.appendChild(liveRegion);

        // Redirect to Kakao channel
        setTimeout(function() {
            window.location.href = 'http://pf.kakao.com/_cbBxcn';
        }, 100);
    }

    // ========================================
    // Add CSS for animations
    // ========================================
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .header.scrolled {
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }

        .header.hidden {
            transform: translateY(-100%);
            transition: transform 0.3s ease;
        }

        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0,0,0,0);
            white-space: nowrap;
            border: 0;
        }
    `;
    document.head.appendChild(style);

    // ========================================
    // Testimonials Slider
    // ========================================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const indicators = document.querySelectorAll('.indicator');
    let currentTestimonial = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        // Remove active class from all cards and indicators
        testimonialCards.forEach(card => card.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current card and indicator
        if (testimonialCards[index]) {
            testimonialCards[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
        showTestimonial(currentTestimonial);
    }

    // Set up auto-slide every 3 seconds
    function startTestimonialSlider() {
        testimonialInterval = setInterval(nextTestimonial, 3000);
    }

    // Stop auto-slide when user interacts
    function stopTestimonialSlider() {
        clearInterval(testimonialInterval);
    }

    // Add click handlers to indicators
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopTestimonialSlider();
            currentTestimonial = index;
            showTestimonial(currentTestimonial);
            startTestimonialSlider(); // Restart auto-slide
        });
    });

    // Start the testimonial slider if elements exist
    if (testimonialCards.length > 0) {
        startTestimonialSlider();

        // Pause on hover
        const sliderWrapper = document.querySelector('.testimonials-slider-wrapper');
        if (sliderWrapper) {
            sliderWrapper.addEventListener('mouseenter', stopTestimonialSlider);
            sliderWrapper.addEventListener('mouseleave', startTestimonialSlider);
        }
    }

    // ========================================
    // FAQ Slider
    // ========================================
    const faqSlides = document.querySelectorAll('.faq-slide');
    const faqIndicators = document.querySelectorAll('.faq-indicator');
    let currentFaq = 0;
    let faqInterval;

    function showFaqSlide(index) {
        // Remove active class from all slides and indicators
        faqSlides.forEach(slide => slide.classList.remove('active'));
        faqIndicators.forEach(indicator => indicator.classList.remove('active'));

        // Add active class to current slide and indicator
        if (faqSlides[index]) {
            faqSlides[index].classList.add('active');
        }
        if (faqIndicators[index]) {
            faqIndicators[index].classList.add('active');
        }
    }

    function nextFaqSlide() {
        currentFaq = (currentFaq + 1) % faqSlides.length;
        showFaqSlide(currentFaq);
    }

    // Set up auto-slide every 2 seconds
    function startFaqSlider() {
        faqInterval = setInterval(nextFaqSlide, 2000);
    }

    // Stop auto-slide when user interacts
    function stopFaqSlider() {
        clearInterval(faqInterval);
    }

    // Add click handlers to FAQ indicators
    faqIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', function() {
            stopFaqSlider();
            currentFaq = index;
            showFaqSlide(currentFaq);
            startFaqSlider(); // Restart auto-slide
        });
    });

    // Start the FAQ slider if elements exist
    if (faqSlides.length > 0) {
        startFaqSlider();

        // Pause on hover
        const faqWrapper = document.querySelector('.faq-slider-wrapper');
        if (faqWrapper) {
            faqWrapper.addEventListener('mouseenter', stopFaqSlider);
            faqWrapper.addEventListener('mouseleave', startFaqSlider);
        }
    }

    // ========================================
    // Kakao CTA Click Tracking (Session-based)
    // ========================================
    const kakaoLinks = document.querySelectorAll('a[href*="pf.kakao.com/_cbBxcn"]');
    const KAKAO_CLICK_KEY = 'kakao_cta_clicked';

    kakaoLinks.forEach(link => {
        // Ensure all Kakao links open in new tab
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');

        link.addEventListener('click', function(e) {
            // Check if already tracked in this session
            const hasClicked = sessionStorage.getItem(KAKAO_CLICK_KEY);

            if (!hasClicked && window.gtag) {
                // Get button context information
                const buttonText = this.textContent.trim();
                const buttonClass = this.className;
                const pageLocation = window.location.pathname;

                // Track GA4 event
                gtag('event', 'kakao_cta_click', {
                    'button_text': buttonText,
                    'button_class': buttonClass,
                    'page_location': pageLocation,
                    'session_unique': true
                });

                // Track Google Ads conversion event
                gtag('event', 'conversion_event_contact', {
                    'send_to': 'AW-17644734866'
                });

                // Mark as clicked in this session
                sessionStorage.setItem(KAKAO_CLICK_KEY, 'true');

                console.log('카카오 CTA 클릭 이벤트 추적됨 (GA4 + Google Ads 전환, 세션당 1회)');
            }
        });
    });

    // ========================================
    // Initialize on DOM Ready
    // ========================================
    console.log('컨설팅 프로 - 사이트가 성공적으로 로드되었습니다.');

})();