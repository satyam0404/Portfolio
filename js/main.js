/**
 * Satyam Yadav Portfolio - Main UI Logic & Micro-Interactions
 * Handles 3D Card Tilts, Scrollspy, Typing Animation, Modals, Audio Synth, and Copy Toasts
 */

(function () {
  'use strict';

  // --- 1. Dynamic Typing Effect ---
  const typingWords = [
    'Data & Business Analytics',
    'SQL Architecture & KPI Modeling',
    'Python (Pandas, NumPy, Scikit-learn)',
    'Power BI & Interactive Dashboards',
    'Predictive Machine Learning & EDA',
    'Customer Intelligence & CLV Projections'
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

  // --- 7. Direct Message Form Handler (FormSubmit Direct API + Multi-Channel Instant Dispatch) ---
  function initContactForm() {
    const form = document.getElementById('portfolio-contact-form');
    if (!form) return;

    const statusBox = document.getElementById('form-status-box');
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('btn-transmit-submit') || form.querySelector('button[type="submit"]');

    function highlightDispatchButtons() {
      const gmailBtn = document.getElementById('btn-dispatch-gmail');
      const waBtn = document.getElementById('btn-dispatch-whatsapp');
      if (gmailBtn) {
        gmailBtn.classList.add('highlight-pulse');
        setTimeout(() => gmailBtn.classList.remove('highlight-pulse'), 3500);
      }
      if (waBtn) {
        waBtn.classList.add('highlight-pulse');
        setTimeout(() => waBtn.classList.remove('highlight-pulse'), 3500);
      }
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = nameInput?.value?.trim() || 'Visitor';
      const email = emailInput?.value?.trim();
      const message = messageInput?.value?.trim();

      if (!email || !message) {
        showToast('Please enter both your email address and message.');
        return;
      }

      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display: inline-block; animation: spin 1s linear infinite; margin-right: 6px;">⚡</span>
        <span>Transmitting to Satyam...</span>
      `;

      try {
        const response = await fetch('https://formsubmit.co/ajax/satyamyadav_23me244@dtu.ac.in', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            name: name,
            email: email,
            message: message,
            _subject: `New Portfolio Message from ${name} (${email})`,
            _template: 'table',
            _captcha: 'false'
          })
        });

        const result = await response.json().catch(() => ({}));

        if (result.success === true || result.success === 'true') {
          // 100% delivered to DTU inbox
          if (statusBox) {
            statusBox.className = 'form-status-box success';
            statusBox.style.display = 'flex';
            statusBox.innerHTML = `
              <div class="form-status-header">
                <span>✔</span> <span>Message Delivered Directly to Satyam</span>
              </div>
              <div class="form-status-body">
                Your message has been transmitted directly to <strong>satyamyadav_23me244@dtu.ac.in</strong>. Satyam will review your message and reply via email shortly.
              </div>
            `;
          }
          submitBtn.innerHTML = '✔ Transmitted Successfully!';
          submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          showToast(`Success! Your message was transmitted to Satyam Yadav.`);
          form.reset();

          setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
          }, 4500);

        } else if (result.message && (result.message.includes('Activation') || result.message.includes('actived') || result.message.includes('activate'))) {
          // FormSubmit requires 1-time activation email confirmation
          if (statusBox) {
            statusBox.className = 'form-status-box warning';
            statusBox.style.display = 'flex';
            statusBox.innerHTML = `
              <div class="form-status-header">
                <span>📬</span> <span>1-Time Form Activation Required</span>
              </div>
              <div class="form-status-body">
                FormSubmit has dispatched a 1-click activation link to <strong>satyamyadav_23me244@dtu.ac.in</strong>.<br>
                Satyam, please click <strong>"Activate Form"</strong> in your DTU inbox once to enable permanent automatic delivery.<br><br>
                👉 <strong>Send instantly right now:</strong> Click <strong>Gmail Web</strong> or <strong>WhatsApp</strong> below to dispatch your message immediately!
              </div>
            `;
          }
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          showToast('Activation email sent to Satyam. Use Gmail or WhatsApp below for instant send!');
          highlightDispatchButtons();

        } else {
          // Any other FormSubmit response
          throw new Error(result.message || 'Transmission failed');
        }

      } catch (err) {
        console.warn('Direct API submission notice:', err);
        if (statusBox) {
          statusBox.className = 'form-status-box warning';
          statusBox.style.display = 'flex';
          statusBox.innerHTML = `
            <div class="form-status-header">
              <span>⚡</span> <span>Instant Webmail & Chat Options Ready</span>
            </div>
            <div class="form-status-body">
              Your message is pre-filled and ready to send directly. Click <strong>Gmail Web</strong> or <strong>WhatsApp</strong> below to transmit in 1 click!
            </div>
          `;
        }
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        showToast('Click Gmail Web or WhatsApp below to send instantly!');
        highlightDispatchButtons();
      }
    });

    // Wire up Instant Dispatch Channels
    const gmailDispatchBtn = document.getElementById('btn-dispatch-gmail');
    const waDispatchBtn = document.getElementById('btn-dispatch-whatsapp');
    const copyDispatchBtn = document.getElementById('btn-dispatch-copy');

    if (gmailDispatchBtn) {
      gmailDispatchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = nameInput?.value?.trim() || 'Visitor';
        const email = emailInput?.value?.trim() || 'Not specified';
        const msg = messageInput?.value?.trim() || 'Hello Satyam, I reviewed your data analytics portfolio and would like to connect.';
        
        const subject = encodeURIComponent(`Data Analytics Opportunity / Inquiry from ${name}`);
        const body = encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${msg}`);
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=satyamyadav_23me244@dtu.ac.in&su=${subject}&body=${body}`;
        
        window.open(gmailUrl, '_blank', 'noopener,noreferrer');
        showToast('Opening pre-filled compose window in Gmail Web...');
      });
    }

    if (waDispatchBtn) {
      waDispatchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = nameInput?.value?.trim() || 'Visitor';
        const email = emailInput?.value?.trim() || 'Not specified';
        const msg = messageInput?.value?.trim() || 'Hello Satyam, I reviewed your data analytics portfolio and would like to connect.';

        const waText = encodeURIComponent(`Hello Satyam,\n\nFrom: ${name} (${email})\n\nMessage:\n${msg}`);
        const waUrl = `https://api.whatsapp.com/send?phone=919650446219&text=${waText}`;

        window.open(waUrl, '_blank', 'noopener,noreferrer');
        showToast('Opening WhatsApp with pre-filled message...');
      });
    }

    if (copyDispatchBtn) {
      copyDispatchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = nameInput?.value?.trim() || 'Visitor';
        const email = emailInput?.value?.trim() || 'Not specified';
        const msg = messageInput?.value?.trim() || 'Hello Satyam, I reviewed your data analytics portfolio and would like to connect.';

        const payload = `Recipient: satyamyadav_23me244@dtu.ac.in\nSubject: Data Analytics Inquiry from ${name}\nFrom: ${name} (${email})\n\nMessage:\n${msg}`;
        navigator.clipboard.writeText(payload).then(() => {
          showToast('Copied full message & recipient details to clipboard!');
        }).catch(() => {
          showToast('Text copied to clipboard!');
        });
      });
    }
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
