/**
 * Captain Jack Website - JavaScript
 * Interaktive Features und Funktionalität
 */

(function() {
  'use strict';

  // === Header Scroll-Effect ===
  const header = document.querySelector('.header');
  const scrollThreshold = 100;

  function handleHeaderScroll() {
    if (window.scrollY > scrollThreshold) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', debounce(handleHeaderScroll, 10));
  handleHeaderScroll(); // Initial check

  // === Mobile Menu Toggle ===
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu on outside click
    document.addEventListener('click', function(e) {
      if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
      });
    });
  }

  // === Smooth Scroll for Anchor Links ===
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // === Lazy Loading Images ===
  const lazyImages = document.querySelectorAll('img[data-src]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.add('loaded');
    });
  }

  // === Form Validation ===
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      let isValid = true;
      const requiredFields = form.querySelectorAll('[required]');
      const successMessage = form.querySelector('.form-success');

      // Reset errors
      form.querySelectorAll('.form-error').forEach(error => {
        error.classList.remove('visible');
        error.textContent = '';
      });

      // Validate required fields
      requiredFields.forEach(field => {
        const errorEl = field.parentElement.querySelector('.form-error');

        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          if (errorEl) {
            errorEl.textContent = 'Dieses Feld ist erforderlich';
            errorEl.classList.add('visible');
          }
        } else {
          field.classList.remove('error');
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            if (errorEl) {
              errorEl.textContent = 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
              errorEl.classList.add('visible');
            }
          }
        }

        // Phone validation
        if (field.type === 'tel' && field.value.trim()) {
          const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
          if (!phoneRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            if (errorEl) {
              errorEl.textContent = 'Bitte geben Sie eine gültige Telefonnummer ein';
              errorEl.classList.add('visible');
            }
          }
        }
      });

      if (!isValid) {
        e.preventDefault();
      } else {
        e.preventDefault();
        // Show success message
        if (successMessage) {
          successMessage.classList.add('visible');
          form.reset();
          setTimeout(() => {
            successMessage.classList.remove('visible');
          }, 5000);
        }
      }
    });

    // Real-time validation on blur
    form.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
          this.classList.add('error');
        } else {
          this.classList.remove('error');
        }
      });
    });
  });

  // === Tab System ===
  const tabs = document.querySelectorAll('.tabs');

  tabs.forEach(tabContainer => {
    const tabButtons = tabContainer.querySelectorAll('.tab-btn');
    const tabPanels = tabContainer.querySelectorAll('.tab-panel');

    tabButtons.forEach((btn, index) => {
      btn.addEventListener('click', function() {
        // Remove active from all
        tabButtons.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        // Add active to clicked
        this.classList.add('active');
        tabPanels[index].classList.add('active');
      });
    });

    // Activate first tab by default
    if (tabButtons.length > 0) {
      tabButtons[0].classList.add('active');
      tabPanels[0].classList.add('active');
    }
  });

  // === Scroll Reveal Animation ===
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fadeInUp');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('animate-fadeInUp'));
  }

  // === Click-to-Call Button ===
  const callButtons = document.querySelectorAll('[data-action="call"]');

  callButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const phone = this.dataset.phone;
      if (phone) {
        window.location.href = 'tel:' + phone;
      }
    });
  });

  // === Counter Animation ===
  const counters = document.querySelectorAll('[data-counter]');

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.dataset.counter);
          const duration = 2000;
          const step = target / (duration / 16);
          let current = 0;

          const updateCounter = () => {
            current += step;
            if (current < target) {
              counter.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              counter.textContent = target;
            }
          };

          updateCounter();
          observer.unobserve(counter);
        }
      });
    }, {
      threshold: 0.5
    });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  // === Gallery Lightbox ===
  const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');

  galleryItems.forEach(item => {
    item.addEventListener('click', function() {
      const imgSrc = this.querySelector('img').src;
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.innerHTML = `
        <div class="lightbox-overlay">
          <button class="lightbox-close">×</button>
          <img src="${imgSrc}" alt="Gallery Image">
        </div>
      `;

      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';

      lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
        lightbox.remove();
        document.body.style.overflow = '';
      });

      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.className === 'lightbox-overlay') {
          lightbox.remove();
          document.body.style.overflow = '';
        }
      });
    });
  });

  // === Util Functions ===
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

  // === Add lightbox styles dynamically ===
  const lightboxStyles = document.createElement('style');
  lightboxStyles.textContent = `
    .lightbox {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
      background: rgba(10, 37, 64, 0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      animation: fadeIn 0.3s ease forwards;
    }
    
    .lightbox-overlay {
      position: relative;
      max-width: 90%;
      max-height: 90%;
    }
    
    .lightbox img {
      max-width: 100%;
      max-height: 90vh;
      border-radius: 12px;
    }
    
    .lightbox-close {
      position: absolute;
      top: -40px;
      right: 0;
      background: none;
      border: none;
      color: white;
      font-size: 2rem;
      cursor: pointer;
      padding: 0.5rem;
      line-height: 1;
    }
    
    @keyframes fadeIn {
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(lightboxStyles);

  // === Initialize ===
  console.log('⚓ Captain Jack Website - Ready to sail!');

})();
