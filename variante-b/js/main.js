/**
 * Captain Jack Website Variante B - JavaScript
 * UX-Optimized: Mobile-first, Conversion-focused
 */

(function() {
  'use strict';

  // === Header Scroll-Effect ===
  const header = document.querySelector('.header');
  const scrollThreshold = 50;

  function handleHeaderScroll() {
    if (window.scrollY > scrollThreshold) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', debounce(handleHeaderScroll, 16), { passive: true });
  handleHeaderScroll(); // Initial check

  // === Mobile Menu Toggle ===
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      const isOpen = this.classList.toggle('active');
      navLinks.classList.toggle('active');
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on outside click (for mobile)
    document.addEventListener('click', function(e) {
      if (!mobileMenuBtn.contains(e.target) && !navLinks.contains(e.target)) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
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
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without jumping
        history.pushState(null, null, targetId);
      }
    });
  });

  // === Scroll Reveal Animation ===
  const revealElements = document.querySelectorAll('[data-reveal]');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // === FAQ Accordion ===
  window.toggleFaq = function(element) {
    const faqItem = element.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    
    // Close all FAQ items
    document.querySelectorAll('.faq-item.active').forEach(item => {
      item.classList.remove('active');
    });
    
    // Toggle current if it wasn't active
    if (!isActive) {
      faqItem.classList.add('active');
    }
  };

  // === Problem Modal (Progressive Disclosure) ===
  const modalData = {
    'problem-storage': {
      title: 'Sichere Bootslagerung',
      icon: '🏠',
      solution: 'Unsere klimatisierte Lagerhalle und überdachten Stellplätze bieten maximale Sicherheit:',
      benefits: [
        '24/7 Videoüberwachung',
        'Elektronische Zutrittskontrolle',
        'Klimatisierung gegen Feuchtigkeit',
        'Versicherung inklusive'
      ],
      cta: 'Lagerplatz anfragen',
      link: 'kontakt.html?type=storage'
    },
    'problem-cleaning': {
      title: 'Keelcrab® Reinigung',
      icon: '🧼',
      solution: 'Die revolutionäre Unterwasserreinigung direkt am Liegeplatz:',
      benefits: [
        'Kein Kran nötig – Boot bleibt liegen',
        'Bis zu 70% günstiger als traditionell',
        'Reinigung in 1-3 Stunden',
        '4K-Video Dokumentation inklusive'
      ],
      cta: 'Termin buchen',
      link: 'kontakt.html?type=service'
    },
    'problem-service': {
      title: 'Alles aus einer Hand',
      icon: '⚡',
      solution: 'Ein Ansprechpartner für alle Ihre Bedürfnisse:',
      benefits: [
        'Lagerung + Service kombiniert',
        'Ein Kontakt, eine Rechnung',
        'Digitale Übersicht Ihrer Services',
        'Persönliche Betreuung vor Ort'
      ],
      cta: 'Kombi-Paket anfragen',
      link: 'kontakt.html?type=combo'
    }
  };

  // Modal Triggers
  document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
    trigger.addEventListener('click', function() {
      const modalId = this.getAttribute('data-modal-trigger');
      if (modalData[modalId]) {
        openModal(modalData[modalId]);
      }
    });
  });

  window.openModal = function(data) {
    const modal = document.getElementById('problemModal');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalBody) return;
    
    modalBody.innerHTML = `
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <div style="font-size: 3rem; margin-bottom: 1rem;">${data.icon}</div>
        <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">${data.title}</h3>
        <p style="color: #666; margin-bottom: 1.5rem;">${data.solution}</p>
      </div>
      <ul style="list-style: none; margin-bottom: 2rem;">
        ${data.benefits.map(benefit => `
          <li style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; color: #2d3748;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00C2D1" stroke-width="2" style="flex-shrink: 0;">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            ${benefit}
          </li>
        `).join('')}
      </ul>
      <a href="${data.link}" class="btn btn-accent btn-full" style="text-decoration: none;">${data.cta}</a>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function() {
    const modal = document.getElementById('problemModal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close modal on outside click
  document.getElementById('problemModal')?.addEventListener('click', function(e) {
    if (e.target === this) {
      closeModal();
    }
  });

  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // === Video Modal (Placeholder) ===
  window.showVideoModal = function() {
    // In a real implementation, this would open a video player
    // For now, we'll show an alert with the intended behavior
    alert('Hier würde ein Keelcrab-Demovideo abgespielt werden.\n\nIn der vollständigen Implementierung würde dies:\n- Einen YouTube/Vimeo-Player in einem Modal öffnen\n- Oder auf die Keelcrab-Produktseite verlinken\n- Oder eine eigene Video-Hosting-Lösung nutzen');
  };

  // === Sticky Footer Hide/Show on Scroll (Mobile Optimization)
  let lastScrollY = window.scrollY;
  const stickyFooter = document.querySelector('.sticky-footer');

  if (stickyFooter && window.innerWidth <= 768) {
    window.addEventListener('scroll', debounce(function() {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      
      // Hide when scrolling down, show when scrolling up
      if (scrollDirection === 'down' && currentScrollY > 200) {
        stickyFooter.style.transform = 'translateY(100%)';
      } else {
        stickyFooter.style.transform = 'translateY(0)';
      }
      
      lastScrollY = currentScrollY;
    }, 100), { passive: true });

    // Initially visible
    stickyFooter.style.transform = 'translateY(0)';
    stickyFooter.style.transition = 'transform 0.3s ease';
  }

  // === Form Validation Helpers ===
  const forms = document.querySelectorAll('form[data-validate]');

  forms.forEach(form => {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
      // Real-time validation on blur
      input.addEventListener('blur', function() {
        validateField(this);
      });
      
      // Clear error on input
      input.addEventListener('input', function() {
        this.classList.remove('error');
        const errorEl = this.parentElement.querySelector('.form-error');
        if (errorEl) {
          errorEl.classList.remove('visible');
        }
      });
    });

    form.addEventListener('submit', function(e) {
      let isValid = true;
      
      inputs.forEach(input => {
        if (!validateField(input)) {
          isValid = false;
        }
      });

      if (!isValid) {
        e.preventDefault();
      }
    });
  });

  function validateField(field) {
    if (!field.hasAttribute('required')) return true;
    
    const value = field.value.trim();
    let isValid = true;
    
    if (!value) {
      isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
      }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\+\d\s\-\(\)]{8,}$/;
      if (!phoneRegex.test(value)) {
        isValid = false;
      }
    }
    
    // Toggle error state
    if (isValid) {
      field.classList.remove('error');
      field.classList.add('success');
    } else {
      field.classList.add('error');
      field.classList.remove('success');
    }
    
    return isValid;
  }

  // === Performance: Lazy Load Images (if supported) ===
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // === Prefers Reduced Motion ===
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('[data-reveal]').forEach(el => {
      el.classList.add('revealed');
    });
  }

  // === Utility Functions ===
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

  // === Service Chip Toggling (for contact page) ===
  window.toggleChip = function(chip) {
    chip.classList.toggle('selected');
    const checkbox = chip.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = chip.classList.contains('selected');
    }
  };

  // === Testimonial Carousel ===
  const testimonialCarousel = document.querySelector('.testimonial-carousel');
  
  if (testimonialCarousel) {
    const slides = testimonialCarousel.querySelectorAll('.testimonial-slide');
    const dots = testimonialCarousel.querySelectorAll('.carousel-dots .dot');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.remove('active');
        dots[i]?.classList.remove('active');
      });
      
      slides[index].classList.add('active');
      dots[index]?.classList.add('active');
      currentSlide = index;
    }
    
    function nextSlide() {
      const next = (currentSlide + 1) % slides.length;
      showSlide(next);
    }
    
    // Auto-play every 5 seconds
    function startAutoplay() {
      slideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoplay() {
      clearInterval(slideInterval);
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        stopAutoplay();
        showSlide(index);
        startAutoplay();
      });
    });
    
    // Pause on hover
    testimonialCarousel.addEventListener('mouseenter', stopAutoplay);
    testimonialCarousel.addEventListener('mouseleave', startAutoplay);
    
    // Start autoplay
    startAutoplay();
  }

  console.log('⚓ Captain Jack Variante B - UX Optimized and Ready!');
})();
