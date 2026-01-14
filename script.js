// ========================================
// DAWOODZAI TECH SOLUTIONS - MAIN JAVASCRIPT
// ========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // ========================================
    // NAVIGATION SCROLL EFFECT
    // ========================================
    
    const navbar = document.getElementById('navbar');
    
    function handleScroll() {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleScroll);
    
    
    // ========================================
    // MOBILE MENU TOGGLE
    // ========================================
    
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    
    // Create mobile menu and overlay
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    mobileMenu.id = 'mobileMenu';
    
    const mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-menu-overlay';
    mobileOverlay.id = 'mobileOverlay';
    
    // Clone navigation links for mobile
    const mobileNavLinks = navLinks.cloneNode(true);
    mobileNavLinks.className = 'mobile-nav-links';
    
    // Add logo to mobile menu
    const mobileLogo = document.createElement('div');
    mobileLogo.innerHTML = '<div class="logo-text">DTS</div>';
    mobileLogo.style.fontSize = '2rem';
    mobileLogo.style.fontWeight = '900';
    mobileLogo.style.color = 'var(--primary-blue)';
    mobileLogo.style.marginBottom = '1rem';
    
    mobileMenu.appendChild(mobileLogo);
    mobileMenu.appendChild(mobileNavLinks);
    
    document.body.appendChild(mobileOverlay);
    document.body.appendChild(mobileMenu);
    
    // Toggle mobile menu
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            mobileToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });
    }
    
    // Close mobile menu when clicking overlay
    mobileOverlay.addEventListener('click', function() {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    });
    
    // Close mobile menu when clicking a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    
    // ========================================
    // SCROLL ANIMATIONS
    // ========================================
    
    const animateElements = document.querySelectorAll('[data-animate]');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    
    // ========================================
    // PROJECT FILTERING (Projects Page)
    // ========================================
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    // Add animation
                    card.style.animation = 'fadeInUp 0.5s ease';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
    
    
    // ========================================
    // CONTACT FORM VALIDATION & SUBMISSION
    // ========================================
    
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear previous errors
            document.querySelectorAll('.error-message').forEach(error => {
                error.textContent = '';
            });
            
            document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
                input.classList.remove('error');
            });
            
            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            let isValid = true;
            
            // Validate name
            if (name === '') {
                showError('name', 'Name is required');
                isValid = false;
            }
            
            // Validate email
            if (email === '') {
                showError('email', 'Email is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showError('email', 'Please enter a valid email');
                isValid = false;
            }
            
            // Validate message
            if (message === '') {
                showError('message', 'Message is required');
                isValid = false;
            } else if (message.length < 10) {
                showError('message', 'Message must be at least 10 characters');
                isValid = false;
            }
            
            // If form is valid, submit it
            if (isValid) {
                submitForm();
            }
        });
    }
    
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field) field.classList.add('error');
        if (errorElement) errorElement.textContent = '⚠ ' + message;
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
   function submitForm() {
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const btnText = submitButton.querySelector('.btn-text');
    const btnLoading = submitButton.querySelector('.btn-loading');
    
    // Show loading state
    submitButton.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    // Prepare form data
    const formData = new FormData(contactForm);
    
    // Send to Formspree
    fetch(contactForm.action, {
        method: contactForm.method,
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        submitButton.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';

        if (response.ok) {
            const successMessage = document.getElementById('successMessage');
            if (successMessage) {
                successMessage.style.display = 'flex';
                successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            contactForm.reset();

            setTimeout(() => {
                if (successMessage) successMessage.style.display = 'none';
            }, 5000);
        } else {
            alert('Oops! There was a problem sending your message.');
        }
    })
    .catch(error => {
        submitButton.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        alert('Oops! There was a problem sending your message.');
        console.error(error);
    });
}

    
    // ========================================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ========================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    
    // ========================================
    // PERFORMANCE: LAZY LOAD IMAGES
    // ========================================
    
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    
    // ========================================
    // ADD ANIMATION TO STATS ON SCROLL
    // ========================================
    
    const statValues = document.querySelectorAll('.stat-value, .quick-stat-value, .stat-number');
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                animateValue(entry.target);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });
    
    statValues.forEach(stat => statsObserver.observe(stat));
    
    function animateValue(element) {
        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const number = parseInt(text.replace(/[^0-9]/g, ''));
        
        if (isNaN(number)) return;
        
        const duration = 2000;
        const steps = 60;
        const increment = number / steps;
        let current = 0;
        
        const timer = setInterval(function() {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            
            let displayValue = Math.floor(current);
            if (hasPlus) displayValue += '+';
            if (hasPercent) displayValue += '%';
            
            element.textContent = displayValue;
        }, duration / steps);
    }
    
    
    // ========================================
    // INITIALIZE TOOLTIPS (if needed)
    // ========================================
    
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            tooltip.style.position = 'absolute';
            tooltip.style.background = 'rgba(0, 0, 0, 0.8)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '0.5rem 1rem';
            tooltip.style.borderRadius = '0.5rem';
            tooltip.style.fontSize = '0.875rem';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.zIndex = '9999';
            tooltip.style.pointerEvents = 'none';
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            
            this._tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this._tooltip) {
                this._tooltip.remove();
                this._tooltip = null;
            }
        });
    });
    
    
    // ========================================
    // UTILITY: DEBOUNCE FUNCTION
    // ========================================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Optimize scroll performance
    const optimizedScroll = debounce(handleScroll, 10);
    window.addEventListener('scroll', optimizedScroll);
    
    
    // ========================================
    // CONSOLE MESSAGE
    // ========================================
    
    console.log('%c🚀 Dawoodzai Tech Solutions', 'font-size: 20px; font-weight: bold; color: #2563eb;');
    console.log('%cWebsite built with HTML, CSS, and JavaScript', 'font-size: 14px; color: #64748b;');
    console.log('%c📞 Contact: 832-292-7088', 'font-size: 12px; color: #64748b;');
    console.log('%c✉️ Email: nooriibrahim07@gmail.com', 'font-size: 12px; color: #64748b;');
    
});

// ========================================
// END OF SCRIPT
// ========================================