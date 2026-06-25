document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Dynamic Content Loader (JSON Fetch with HTML Fallback Failsafe)
  // ==========================================================================
  fetch('./content.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Local content.json load failed, using static HTML fallback');
      }
      return response.json();
    })
    .then(data => {
      // 1. Populate Personal and Contact Metadata
      const heroTitle = document.querySelector('.hero-title');
      if (heroTitle) {
        document.title = `${data.name} - Executive Biodata & Portfolio`;
        heroTitle.textContent = data.name;
      }
      const heroSubtitle = document.querySelector('.hero-subtitle');
      if (heroSubtitle) {
        heroSubtitle.textContent = data.subtitle || data.title;
      }
      
      // Update quick contacts in header
      const contactLinks = document.querySelectorAll('.hero-content .contact-link');
      if (contactLinks.length >= 2) {
        contactLinks[0].textContent = data.phone;
        contactLinks[0].setAttribute('href', `tel:${data.phone.replace(/\s+/g, '')}`);
        contactLinks[1].textContent = data.email;
        contactLinks[1].setAttribute('href', `mailto:${data.email}`);
      }
      
      const contactText = document.querySelector('.hero-content .contact-text');
      if (contactText) {
        contactText.textContent = data.location;
      }
      
      const linkedinLink = document.querySelector('.hero-content a[href*="linkedin.com"]');
      if (linkedinLink) {
        linkedinLink.textContent = data.linkedin.replace('https://www.', '').replace('https://', '');
        linkedinLink.setAttribute('href', data.linkedin);
      }

      // Update hero bio paragraphs
      const bioElement = document.querySelector('.hero-bio');
      if (bioElement && data.biographyText && data.biographyText.length > 0) {
        bioElement.innerHTML = data.biographyText.join(' ');
      }
      
      // 2. Populate Metrics Dashboard
      const metricsContainer = document.querySelector('.metrics-grid');
      if (metricsContainer && data.metrics) {
        metricsContainer.innerHTML = data.metrics.map(m => `
          <div class="metric-card" tabindex="0">
            <div class="metric-value">${m.value}</div>
            <div class="metric-label">${m.label}</div>
            <div class="metric-desc">${m.desc}</div>
          </div>
        `).join('');
      }

      // 3. Populate 6R operational philosophy
      const philosophyContainer = document.querySelector('.philosophy-grid');
      if (philosophyContainer && data.philosophyItems) {
        philosophyContainer.innerHTML = data.philosophyItems.map(p => `
          <div class="philosophy-item">
            <span class="phi-value">${p.key}</span>
            <span class="phi-subtitle">${p.value}</span>
            <p class="phi-desc">${p.desc}</p>
          </div>
        `).join('');
      }

      // 4. Populate Hero Awards Grid
      const heroAwardsContainer = document.querySelector('.hero-awards-grid');
      if (heroAwardsContainer && data.heroAwards) {
        const svgIcons = [
          // Icon 1 (Globe/Global)
          `<svg class="hero-award-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>
          </svg>`,
          // Icon 2 (Star/Influential)
          `<svg class="hero-award-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>`,
          // Icon 3 (Trophy/GRI)
          `<svg class="hero-award-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34"/>
            <path d="M12 2a4 4 0 0 0-4 4v7a4 4 0 0 0 8 0V6a4 4 0 0 0-4-4z"/>
          </svg>`,
          // Icon 4 (Leaf/Eco/Green Hotel)
          `<svg class="hero-award-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 1 8a7 7 0 0 1-9 10zm0 0v-6"/>
          </svg>`
        ];

        heroAwardsContainer.innerHTML = data.heroAwards.map((a, i) => `
          <div class="hero-award-card" tabindex="0">
            <div class="hero-award-icon-container">
              ${svgIcons[i % svgIcons.length]}
            </div>
            <div class="hero-award-content">
              <span class="hero-award-category">${a.category}</span>
              <h3 class="hero-award-title">${a.title}</h3>
            </div>
          </div>
        `).join('');
      }

      // 5. Populate Major Achievements & Executive Awards
      const execAwardsContainer = document.querySelector('.awards-features-grid');
      if (execAwardsContainer && data.executiveAwards) {
        execAwardsContainer.innerHTML = data.executiveAwards.map(a => `
          <div class="exec-award-card">
            <div class="exec-award-images single-img">
              <div class="award-img-box">
                <img src="${a.image}" alt="${a.title} Certificate" class="exec-award-img" loading="lazy" decoding="async">
                <span class="award-img-label">${a.label}</span>
              </div>
            </div>
            <div class="exec-award-info">
              <span class="award-crown">${a.crown}</span>
              <h3>${a.title}</h3>
              <p class="award-org">${a.org}</p>
              <p class="award-text">${a.text}</p>
            </div>
          </div>
        `).join('');
      }

      // 6. Populate Career History Timeline
      const timelineContainer = document.querySelector('.timeline-container');
      if (timelineContainer && data.timeline) {
        timelineContainer.innerHTML = data.timeline.map(t => `
          <div class="timeline-item" data-category="${t.category}">
            <div class="timeline-dot"></div>
            <div class="timeline-meta">
              <span class="timeline-date">${t.date}</span>
              <span class="timeline-location">${t.location}</span>
            </div>
            <h3 class="timeline-role">${t.role}</h3>
            <h4 class="timeline-company">${t.company}</h4>
            <ul class="timeline-details">
              ${t.details.map(d => `<li>${d.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}</li>`).join('')}
            </ul>
          </div>
        `).join('');
      }

      // 7. Populate Skills Sidebar Grid
      const skillsContainer = document.querySelector('.skills-container');
      if (skillsContainer && data.skills) {
        skillsContainer.innerHTML = data.skills.map(s => `
          <div class="skill-category">
            <span class="skill-cat-title">${s.category}</span>
            <div class="skill-badges">
              ${s.items.map(item => `<span class="skill-badge">${item}</span>`).join('')}
            </div>
          </div>
        `).join('');
      }

      // 8. Populate Education Timeline
      const eduContainer = document.querySelector('.education-timeline');
      if (eduContainer && data.education) {
        eduContainer.innerHTML = data.education.map(e => `
          <div class="edu-item">
            <div class="edu-dot"></div>
            <span class="edu-year">${e.date}</span>
            <h3 class="edu-title">${e.degree}</h3>
            <span class="edu-inst">${e.school}</span>
          </div>
        `).join('');
      }

      // 9. Populate Personal details list
      const detailsContainer = document.querySelector('.personal-details-grid');
      if (detailsContainer && data.personalDetails) {
        detailsContainer.innerHTML = data.personalDetails.map(d => `
          <div class="detail-row">
            <span class="detail-label">${d.label}:</span>
            <span class="detail-value">${d.value}</span>
          </div>
        `).join('');
      }

      // 10. Populate Languages Profile
      const langContainer = document.querySelector('.languages-grid');
      if (langContainer && data.languages) {
        langContainer.innerHTML = data.languages.map(l => `
          <div class="lang-row">
            <span class="lang-name">${l.language}</span>
            <span class="lang-level">${l.level}</span>
          </div>
        `).join('');
      }

      // 11. Populate Certifications
      const certList = document.querySelector('.certifications-card .timeline-details');
      if (certList && data.certifications) {
        certList.innerHTML = data.certifications.map(c => `<li>${c}</li>`).join('');
      }

      // 12. Populate Memberships
      const memList = document.querySelector('.memberships-card .timeline-details');
      if (memList && data.memberships) {
        memList.innerHTML = data.memberships.map(m => `<li>${m}</li>`).join('');
      }

      // Initialize control event listeners with dynamically loaded parameters
      initInteractiveControls(data);
    })
    .catch(err => {
      console.warn(err.message);
      // Failsafe: Run interactive logic on static HTML directly
      initInteractiveControls();
    });

  // ==========================================================================
  // 2. Interactive Page Event Handlers
  // ==========================================================================
  function initInteractiveControls(data = null) {
    // 2.1 Theme Toggle (Light / Dark Mode)
    const htmlElement = document.documentElement;
    const themeToggleBtn = document.getElementById('theme-toggle');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggleBtn) {
      // Avoid duplicate event wiring
      const newToggle = themeToggleBtn.cloneNode(true);
      themeToggleBtn.parentNode.replaceChild(newToggle, themeToggleBtn);
      
      newToggle.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        newToggle.style.transform = 'scale(0.8)';
        setTimeout(() => {
          newToggle.style.transform = 'none';
        }, 150);
      });
    }

    // 2.2 Expand/Collapse Personal Details
    const togglePersonalBtn = document.getElementById('toggle-personal');
    const personalContent = document.getElementById('personal-content');

    if (togglePersonalBtn && personalContent) {
      const newTogglePersonal = togglePersonalBtn.cloneNode(true);
      togglePersonalBtn.parentNode.replaceChild(newTogglePersonal, togglePersonalBtn);
      
      newTogglePersonal.addEventListener('click', () => {
        const isCollapsed = personalContent.classList.toggle('collapsed');
        newTogglePersonal.textContent = isCollapsed ? 'Show' : 'Hide';
        newTogglePersonal.setAttribute('aria-expanded', !isCollapsed);
      });
    }

    // 2.3 Career Timeline Interactive Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filterValue = btn.getAttribute('data-filter');

        timelineItems.forEach(item => {
          const categories = item.getAttribute('data-category').split(' ');
          
          if (filterValue === 'all' || categories.includes(filterValue)) {
            item.classList.remove('hidden');
            item.style.opacity = '0';
            item.style.transform = 'translateY(10px)';
            setTimeout(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.classList.add('hidden');
          }
        });
      });
    });

    // 2.4 Executive Print Controls
    const printBtn = document.getElementById('btn-print');
    const mobilePrintBtn = document.getElementById('btn-mobile-print');

    const triggerPrint = () => {
      window.print();
    };

    if (printBtn) {
      const newPrint = printBtn.cloneNode(true);
      printBtn.parentNode.replaceChild(newPrint, printBtn);
      newPrint.addEventListener('click', triggerPrint);
    }
    if (mobilePrintBtn) {
      const newMobilePrint = mobilePrintBtn.cloneNode(true);
      mobilePrintBtn.parentNode.replaceChild(newMobilePrint, mobilePrintBtn);
      newMobilePrint.addEventListener('click', triggerPrint);
    }

    // 2.5 Contact Form Processing (Direct WhatsApp API & Default Mailto Clients)
    const contactForm = document.getElementById('contact-form');
    const submitEmailBtn = document.getElementById('btn-submit-email');
    const submitWhatsAppBtn = document.getElementById('btn-submit-whatsapp');

    // Use dynamic data configs if available, otherwise fallback to static profiles
    const emailTarget = data ? data.email : 'sumant.singh@hotmail.com';
    const whatsappPhone = data ? data.whatsapp : '919121773501';

    if (submitWhatsAppBtn) {
      submitWhatsAppBtn.addEventListener('click', () => {
        const name = document.getElementById('c-name').value.trim();
        const email = document.getElementById('c-email').value.trim();
        const phone = document.getElementById('c-phone').value.trim();
        const message = document.getElementById('c-message').value.trim();

        if (!name || !email || !message) {
          contactForm.reportValidity();
          return;
        }

        const waText = `Hello Sumant,\n\nMy name is *${name}* (${email}${phone ? ', ' + phone : ''}).\nI reviewed your portfolio and would like to connect.\n\n*Message Details:*\n"${message}"`;
        const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(waText)}`;
        
        window.open(waUrl, '_blank');
      });
    }

    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('c-name').value.trim();
        const email = document.getElementById('c-email').value.trim();
        const phone = document.getElementById('c-phone').value.trim();
        const message = document.getElementById('c-message').value.trim();

        const emailSubject = `Executive Inquiry - Sumant Singh Portfolio (from ${name})`;
        const emailBody = `Dear Sumant,\n\nI reviewed your executive portfolio and would like to get in touch regarding professional opportunities.\n\nMessage:\n"${message}"\n\nContact Details:\n- Name: ${name}\n- Email: ${email}\n- Phone: ${phone || 'Not provided'}\n\nBest regards,\n${name}`;

        const mailtoUrl = `mailto:${emailTarget}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        
        window.location.href = mailtoUrl;
      });
    }
  }
});
