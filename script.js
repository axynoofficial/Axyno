/**
 * ==============================================================================
 * AXYNO — INTERACTIVE ENGINE & DYNAMIC RENDERER
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  initIntroAnimation();
  initAmbientGlow();
  initNavigation();
  initDynamicContent();
  initProjectModal();
  initLegalModals();
  initContactForm();
});

/* ==============================================================================
   1. INTRO ANIMATION CONTROLLER
   ============================================================================== */
function initIntroAnimation() {
  const overlay = document.getElementById('introOverlay');
  const skipBtn = document.getElementById('skipIntroBtn');
  const cfg = AXYNO_CONFIG.introAnimation;

  if (!overlay) return;

  const alreadySeen = cfg.playOncePerSession && sessionStorage.getItem('axyno_intro_seen') === '1';

  if (!cfg.enabled || alreadySeen) {
    overlay.classList.add('hidden');
    return;
  }

  let completed = false;
  function finishIntro() {
    if (completed) return;
    completed = true;
    overlay.classList.add('hidden');
    if (cfg.playOncePerSession) {
      sessionStorage.setItem('axyno_intro_seen', '1');
    }
  }

  // Allow manual skip
  if (skipBtn) {
    skipBtn.addEventListener('click', finishIntro);
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      finishIntro();
    }
  });

  // Check if video is provided
  if (cfg.videoUrl) {
    const videoContainer = document.getElementById('introVideoContainer');
    const fallbackContainer = document.getElementById('introFallbackContainer');
    
    if (videoContainer) {
      videoContainer.innerHTML = `
        <video id="introVideo" playsinline muted autoplay preload="auto">
          <source src="${cfg.videoUrl}" type="video/mp4">
        </video>
      `;
      if (fallbackContainer) fallbackContainer.style.display = 'none';

      const video = document.getElementById('introVideo');
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // In case browser autoplay policy blocks video, use CSS fallback
          if (fallbackContainer) fallbackContainer.style.display = 'flex';
          overlay.classList.add('animating');
          setTimeout(finishIntro, cfg.durationMs || 3200);
        });
      }

      video.addEventListener('ended', finishIntro);
      // Safety timer in case video ends or stalls
      setTimeout(finishIntro, (cfg.durationMs || 3200) + 1500);
    }
  } else {
    // Fallback CSS animation
    overlay.classList.add('animating');
    setTimeout(finishIntro, cfg.durationMs || 3000);
  }
}

/* ==============================================================================
   2. AMBIENT CURSOR LIGHT EFFECT
   ============================================================================== */
function initAmbientGlow() {
  const glow = document.getElementById('ambientGlow');
  if (!glow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 3;
  let currentX = mouseX;
  let currentY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }, { passive: true });

  function animate() {
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;
    glow.style.transform = `translate(${currentX - 300}px, ${currentY - 300}px)`;
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

/* ==============================================================================
   3. NAVIGATION (STICKY + MOBILE DRAWER + SCROLLSPY)
   ============================================================================== */
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('navHamburger');
  const mobileNav = document.getElementById('mobileNav');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateScrollSpy();
  }, { passive: true });

  // Mobile Menu Toggle
  function toggleMenu(forceClose = false) {
    const isOpen = forceClose ? false : !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMenu());
  }

  // Close mobile nav on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(true));
  });

  // Active section scrollspy
  function updateScrollSpy() {
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }
}

/* ==============================================================================
   4. DYNAMIC CONTENT RENDERING FROM CONFIG
   ============================================================================== */
function initDynamicContent() {
  renderBrandElements();
  renderWorks();
  renderServices();
  renderPricing();
  renderAbout();
  renderContact();
  renderFooter();
}

function renderBrandElements() {
  // Update page title & meta if needed
  document.title = `${AXYNO_CONFIG.brand.name} — ${AXYNO_CONFIG.brand.tagline}`;
}

function renderWorks() {
  const grid = document.getElementById('worksGrid');
  if (!grid) return;

  grid.innerHTML = AXYNO_CONFIG.projects.map((proj, idx) => `
    <article class="work-card" data-project-id="${proj.id}">
      <div class="work-media">
        <img src="${proj.image}" alt="${proj.name} Preview" loading="lazy">
      </div>
      <div class="work-body">
        <div class="work-header-meta">
          <span class="work-category-badge">${proj.category}</span>
          <span class="work-year">${proj.year}</span>
        </div>
        <h3 class="work-title">${proj.name}</h3>
        <p class="work-description">${proj.shortDescription}</p>
        <button type="button" class="work-action" data-index="${idx}" aria-label="View project ${proj.name}">
          View Project
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </article>
  `).join('');

  // Attach click handlers
  grid.querySelectorAll('.work-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index');
      const project = AXYNO_CONFIG.projects[index];
      if (project.url) {
        window.open(project.url, '_blank', 'noopener,noreferrer');
      } else {
        openProjectModal(project);
      }
    });
  });
}

function renderServices() {
  const list = document.getElementById('servicesList');
  if (!list) return;

  const ICONS = {
    code: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    layout: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>`,
    spark: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    cube: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`,
    orbit: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="3"/><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0"/><path d="M12 3a9 9 0 0 1 0 18"/></svg>`
  };

  list.innerHTML = AXYNO_CONFIG.services.map(s => `
    <div class="service-item">
      <div class="service-icon-box">
        ${ICONS[s.icon] || ICONS.spark}
      </div>
      <h3 class="service-name">${s.name}</h3>
      <p class="service-desc">${s.description}</p>
      <div class="service-tags">
        ${s.tags.map(tag => `<span class="service-tag-item">${tag}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderPricing() {
  const grid = document.getElementById('pricingGrid');
  if (!grid) return;

  grid.innerHTML = AXYNO_CONFIG.pricing.map(plan => `
    <div class="pricing-card ${plan.featured ? 'featured' : ''}">
      ${plan.badge ? `<span class="pricing-badge">${plan.badge}</span>` : ''}
      <h3 class="pricing-plan-name">${plan.name}</h3>
      <p class="pricing-plan-sub">${plan.subtitle}</p>
      
      <div class="pricing-amount-wrap">
        <span class="pricing-amount">${plan.price}</span>
        ${plan.period ? `<span class="pricing-period">${plan.period}</span>` : ''}
      </div>

      <p class="pricing-desc">${plan.description}</p>

      <ul class="pricing-features">
        ${plan.features.map(f => `
          <li class="pricing-feature-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>${f}</span>
          </li>
        `).join('')}
      </ul>

      <a href="#contact" class="btn ${plan.featured ? 'btn-primary' : 'btn-ghost'}" data-plan="${plan.name}">
        ${plan.ctaText}
      </a>
    </div>
  `).join('');

  // Handle plan preselection in contact form
  grid.querySelectorAll('[data-plan]').forEach(btn => {
    btn.addEventListener('click', () => {
      const planName = btn.getAttribute('data-plan');
      const budgetSelect = document.getElementById('contactBudget');
      if (budgetSelect) {
        if (planName.toUpperCase().includes('WEDDING')) budgetSelect.value = "Under ₹500";
        else if (planName.toUpperCase().includes('POSTER')) budgetSelect.value = "Under ₹500";
        else budgetSelect.value = "Undecided / Flexible";
      }
    });
  });
}

function renderAbout() {
  const about = AXYNO_CONFIG.about;
  const highlightsContainer = document.getElementById('aboutHighlights');
  if (!highlightsContainer) return;

  highlightsContainer.innerHTML = about.highlights.map(h => `
    <div class="highlight-row">
      <span class="highlight-number">${h.number}</span>
      <div class="highlight-content">
        <h4>${h.title}</h4>
        <p>${h.description}</p>
      </div>
    </div>
  `).join('');
}

function renderContact() {
  const emailEl = document.getElementById('contactDisplayEmail');
  const locEl = document.getElementById('contactDisplayLocation');
  const socialRow = document.getElementById('contactSocialRow');
  const projectTypeSelect = document.getElementById('contactProjectType');
  const budgetSelect = document.getElementById('contactBudget');

  if (emailEl) emailEl.textContent = AXYNO_CONFIG.contact.email;
  if (locEl) locEl.textContent = AXYNO_CONFIG.contact.location;

  // Render social buttons
  if (socialRow) {
    const SOCIAL_SVGS = {
      instagram: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>`,
      linkedin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>`,
      twitter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>`,
      github: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>`
    };

    socialRow.innerHTML = AXYNO_CONFIG.socials.map(s => `
      <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="social-circle-btn" aria-label="${s.name}">
        ${SOCIAL_SVGS[s.icon] || SOCIAL_SVGS.linkedin}
      </a>
    `).join('');
  }

  // Populate Select fields
  if (projectTypeSelect) {
    projectTypeSelect.innerHTML = AXYNO_CONFIG.contact.projectTypes.map(t => `<option value="${t}">${t}</option>`).join('');
  }
  if (budgetSelect) {
    budgetSelect.innerHTML = AXYNO_CONFIG.contact.budgetRanges.map(b => `<option value="${b}">${b}</option>`).join('');
  }
}

function renderFooter() {
  const yearEl = document.getElementById('footerYear');
  const servicesList = document.getElementById('footerServicesList');
  const socialsList = document.getElementById('footerSocialsList');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  if (servicesList) {
    servicesList.innerHTML = AXYNO_CONFIG.services.map(s => `
      <li><a href="#services">${s.name}</a></li>
    `).join('');
  }

  if (socialsList) {
    socialsList.innerHTML = AXYNO_CONFIG.socials.map(s => `
      <li><a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.name}</a></li>
    `).join('');
  }
}

/* ==============================================================================
   5. PROJECT MODAL (<dialog>)
   ============================================================================== */
const projectModal = document.getElementById('projectModal');

function initProjectModal() {
  if (!projectModal) return;

  const closeBtn = document.getElementById('modalCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeProjectModal);
  }

  // Close when clicking outside content (on backdrop)
  projectModal.addEventListener('click', (e) => {
    const rect = projectModal.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      closeProjectModal();
    }
  });

  projectModal.addEventListener('cancel', () => {
    document.body.style.overflow = '';
  });
}

function openProjectModal(project) {
  if (!projectModal) return;

  document.getElementById('modalProjectImg').src = project.image;
  document.getElementById('modalProjectImg').alt = project.name;
  document.getElementById('modalCategory').textContent = `${project.category} · ${project.year}`;
  document.getElementById('modalTitle').textContent = project.name;
  document.getElementById('modalOverview').textContent = project.overview || project.shortDescription;

  // Tags
  const tagsContainer = document.getElementById('modalTags');
  if (tagsContainer && project.tags) {
    tagsContainer.innerHTML = project.tags.map(t => `<span class="modal-tag">${t}</span>`).join('');
  }

  // Deliverables
  const delivContainer = document.getElementById('modalDeliverablesList');
  if (delivContainer && project.deliverables) {
    delivContainer.innerHTML = project.deliverables.map(d => `<li>${d}</li>`).join('');
  }

  projectModal.showModal();
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.close();
  document.body.style.overflow = '';
}

/* ==============================================================================
   6. LEGAL MODALS (Privacy & Terms)
   ============================================================================== */
const legalModal = document.getElementById('legalModal');

function initLegalModals() {
  if (!legalModal) return;

  const closeBtn = document.getElementById('legalModalCloseBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      legalModal.close();
      document.body.style.overflow = '';
    });
  }

  legalModal.addEventListener('click', (e) => {
    const rect = legalModal.getBoundingClientRect();
    const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
                        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
    if (!isInDialog) {
      legalModal.close();
      document.body.style.overflow = '';
    }
  });

  document.querySelectorAll('[data-legal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.getAttribute('data-legal');
      const item = AXYNO_CONFIG.footer.legal[type];
      if (item) {
        document.getElementById('legalModalTitle').textContent = item.title;
        document.getElementById('legalModalContent').textContent = item.content;
        legalModal.showModal();
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

/* ==============================================================================
   7. CONTACT FORM INTERACTION
   ============================================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusMsg = document.getElementById('contactStatusMsg');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    const origBtnText = submitBtn.innerHTML;

    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending...`;
    statusMsg.textContent = "Transmitting inquiry to Axyno...";
    statusMsg.style.color = "var(--gold-bright)";

    const formData = new FormData(form);
    const action = AXYNO_CONFIG.contact.formAction;

    if (action) {
      try {
        const res = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          statusMsg.textContent = "Thank you. Your message has been received. We will respond within 24 hours.";
          form.reset();
        } else {
          statusMsg.textContent = "Message delivery delayed. Please email directly at hello@axyno.studio.";
        }
      } catch (err) {
        statusMsg.textContent = "Network error. Please contact hello@axyno.studio directly.";
      }
    } else {
      // Elegant simulated local confirmation
      setTimeout(() => {
        statusMsg.textContent = `Thank you, ${formData.get('name') || 'there'}! Your project details have been recorded. We will connect with you at ${formData.get('email')} shortly.`;
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = origBtnText;
      }, 900);
    }
  });
}
