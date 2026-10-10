/**
 * Satyam Yadav Portfolio - Main UI Logic & Micro-Interactions
 * Handles 3D Card Tilts, Scrollspy, Typing Animation, Modals, Audio Synth, and Copy Toasts
 */

(function () {
  'use strict';

  // --- 1. Dynamic Typing Effect ---
  const typingWords = [
    'Supply Chain & Demand Forecasting',
    'Inventory Analytics & Cost Reduction',
    'MySQL Architecture (~100K Orders)',
    'DRDO SSPL Crystal Growth Research',
    'Predictive Sales & Vehicle Modeling'
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 75;
  const deleteSpeed = 40;
  const pauseEnd = 1600;

  function handleTyping() {
    const textElement = document.getElementById('typing-text');
    if (!textElement) return;

    const currentWord = typingWords[wordIndex];

    if (isDeleting) {
      textElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      setTimeout(handleTyping, pauseEnd);
      return;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % typingWords.length;
      setTimeout(handleTyping, 400);
      return;
    }

    setTimeout(handleTyping, isDeleting ? deleteSpeed : typingSpeed);
  }

  // --- 2. 3D Card Tilt with Dynamic Glare ---
  function init3DCardTilts() {
    const tiltCards = document.querySelectorAll('.card-tilt-3d, .hero-profile-card');

    tiltCards.forEach(card => {
      // Create glare element if missing
      if (!card.querySelector('.card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -9; // Max 9 deg tilt
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // --- 3. Scrollspy & Header Styler ---
  function initScrollspy() {
    const header = document.querySelector('.site-header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;

      // Header background
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      // Scrollspy active section
      sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 120;
        const sectionId = current.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${sectionId}`) {
              link.classList.add('active');
            }
          });
        }
      });
    }, { passive: true });
  }

  // --- 4. Animated Skill Bars on Scroll ---
  function initSkillObserver() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    if (!skillBars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-level') || '80%';
          bar.style.width = targetWidth;
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => observer.observe(bar));
  }

  // --- 5. Modal SQL Inspector ---
  function initSQLModal() {
    const openBtn = document.getElementById('open-sql-modal-btn');
    const closeBtn = document.getElementById('close-sql-modal-btn');
    const modal = document.getElementById('sql-inspector-modal');

    if (!modal) return;

    if (openBtn) {
      openBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // --- 6. Toast Notification & Copy Clipboard ---
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `
      <span style="color: var(--cyan-400); font-weight: bold;">⚡</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(15px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  function initCopyButtons() {
    const copyBtns = document.querySelectorAll('[data-copy-text]');
    copyBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const textToCopy = btn.getAttribute('data-copy-text');
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Text: ${textToCopy}`);
        });
      });
    });
  }

  // --- 7. Contact Form Simulation ---
  function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value || 'Visitor';
      const email = document.getElementById('contact-email')?.value;
      const message = document.getElementById('contact-message')?.value;

      if (!email || !message) {
        showToast('Please fill in your email and message.', 'error');
        return;
      }

      // Simulate sending
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Transmit...';

      setTimeout(() => {
        submitBtn.innerHTML = 'Message Received!';
        showToast(`Thank you, ${name}! Your transmission has been queued for Satyam Yadav.`);
        form.reset();

        // Also create a direct mailto backup option for recruiter
        window.open(`mailto:satyamyadav_23me244@dtu.ac.in?subject=Portfolio Connection from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`, '_blank');

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }, 3000);
      }, 1000);
    });
  }

  // --- 8. Mobile Navigation Toggle & Resume Dropdown ---
  function initMobileMenu() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (toggleBtn && navLinks) {
      toggleBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
      });

      // Close menu on link click
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          navLinks.classList.remove('open');
        });
      });
    }

    // Resume Dropdown click toggle
    const resumeBtn = document.getElementById('nav-resume-btn');
    const resumeMenu = document.getElementById('resume-menu');
    if (resumeBtn && resumeMenu) {
      resumeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        resumeMenu.classList.toggle('show');
      });

      document.addEventListener('click', (e) => {
        if (!resumeMenu.contains(e.target) && e.target !== resumeBtn) {
          resumeMenu.classList.remove('show');
        }
      });
    }
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    handleTyping();
    init3DCardTilts();
    initScrollspy();
    initSkillObserver();
    initSQLModal();
    initCopyButtons();
    initContactForm();
    initMobileMenu();
  });
})();
