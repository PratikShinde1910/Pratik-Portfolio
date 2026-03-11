

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Constants ---- */
  const CURSOR_FRICTION = 0.12;
  const FOLLOWER_OFFSET = 18;
  const CURSOR_OFFSET = 4;
  const MOBILE_BREAKPOINT = 900;
  const REVEAL_OFFSET = 60;

  /* ---- Custom Cursor ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;
  let isCursorActive = false;
  let animationFrameId = null;

  const updateCursorPosition = (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.transform = `translate3d(${mouseX - CURSOR_OFFSET}px, ${mouseY - CURSOR_OFFSET}px, 0)`;
  };

  const followLoop = () => {
    followerX += (mouseX - followerX) * CURSOR_FRICTION;
    followerY += (mouseY - followerY) * CURSOR_FRICTION;
    follower.style.transform = `translate3d(${followerX - FOLLOWER_OFFSET}px, ${followerY - FOLLOWER_OFFSET}px, 0)`;
    animationFrameId = requestAnimationFrame(followLoop);
  };

  const initCursor = () => {
    if (window.innerWidth > MOBILE_BREAKPOINT && cursor && follower) {
      if (!isCursorActive) {
        isCursorActive = true;
        document.addEventListener('mousemove', updateCursorPosition, { passive: true });
        followLoop();
      }
    } else {
      if (isCursorActive) {
        isCursorActive = false;
        document.removeEventListener('mousemove', updateCursorPosition);
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      }
    }
  };

  initCursor();
  window.addEventListener('resize', initCursor, { passive: true });

  // Event Delegation for hover effects
  const handleCursorHover = (e, isHovering) => {
    if (!isCursorActive) return;
    const isClickable = e.target.closest('a, button, .project-card, .service-card, .stat-card, .skill-tag, .tl-item, .tool-card, .modal-close, .btn-desc, .btn-github');

    if (isClickable) {
      if (isHovering) {
        cursor?.classList.add('hover');
        follower?.classList.add('hover');
      } else {
        cursor?.classList.remove('hover');
        follower?.classList.remove('hover');
      }
    }
  };

  document.addEventListener('mouseover', (e) => handleCursorHover(e, true), { passive: true });
  document.addEventListener('mouseout', (e) => handleCursorHover(e, false), { passive: true });

  /* ---- Mobile Sidebar + Nav Toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const navLinks = document.getElementById('topnav-links');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');

    if (window.innerWidth <= MOBILE_BREAKPOINT) {
      sidebar?.classList.toggle('open');
      navLinks?.classList.toggle('open');
    }
  });

  // Close mobile menu on link click using Event Delegation
  navLinks?.addEventListener('click', (e) => {
    if (e.target.closest('.topnav-link')) {
      hamburger?.classList.remove('active');
      sidebar?.classList.remove('open');
      navLinks?.classList.remove('open');
    }
  });

  /* ---- Intersection Observer for Active Nav Link (Scroll Spy) ---- */
  const sections = document.querySelectorAll('.page-section');
  const allNavLinks = document.querySelectorAll('.topnav-link');

  // Trigger when a section crosses the top 35% of the viewport
  const navObserverOptions = {
    root: null,
    rootMargin: '-35% 0px -65% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If section intersects our bounds, mark its nav link as active
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('data-section') === currentId) {
            link.classList.add('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  /* ---- Intersection Observer for Scroll Reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserverOptions = {
    root: null,
    // Trigger slightly before element comes into view (wh - 60px)
    rootMargin: `0px 0px -${REVEAL_OFFSET}px 0px`,
    threshold: 0.01 // Fire as soon as 1% is visible past the rootMargin
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Good for performance: stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, revealObserverOptions);

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---- Sidebar CTA smooth scroll ---- */
  const sidebarCta = document.querySelector('.sidebar-cta');
  sidebarCta?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  });

  /* ============================================================
     PROJECT MODAL LOGIC
     ============================================================ */
  const projectData = {
    'fithive': {
      title: 'FitHive',
      tags: ['React Native', 'Expo', 'Supabase', 'PostgreSQL', 'AI', 'NLP Chatbot'],
      desc: `
        <p><strong>Overview:</strong> FitHive is an AI-assisted health and fitness mobile application built to help users develop sustainable daily habits through gamification, community engagement, and intelligent health tracking. The app combines personalized AI-driven insights with a reward-based system to keep users motivated and consistent.</p>
        <p><strong>Key Features:</strong> It features an NLP-powered 24×7 fitness chatbot that provides instant guidance on workouts, nutrition, sleep, and hydration. User activity data such as water intake, workouts, sleep cycles, and personal goals are analyzed to generate smart health summaries and daily mission recommendations.</p>
        <p><strong>Ecosystem:</strong> The platform also includes a dynamic reward and streak system, community feed for shared progress, and optional coach connect support. Built using React Native (Expo) and Supabase for a seamless experience with Expo Push Notifications for real-time engagement.</p>
      `,
      images: [
        'fithive-8.png',
        'fithive-7.png',
        'fithive-3.png',
        'fithive-2.png',
        'fithive-5.png',
        'fithive-4.png',
        'fithive-9.png',
        'fithive-10.png'
      ]
    },
    'carpark': {
      title: 'CarPark',
      tags: ['React Native', 'Firebase', 'Google Maps API', 'IoT'],
      desc: `
        <p><strong>Overview:</strong> CarPark is a smart parking management mobile application designed to help users find, book, and manage parking spaces efficiently in real time. The app reduces the hassle of searching for parking in crowded urban areas by providing live slot availability within a defined radius.</p>
        <p><strong>Key Features:</strong> It features QR-based check-in and check-out functionality to streamline entry and exit processes. Google Maps integration enables users to locate nearby parking spaces and EV charging stations with accurate navigation support.</p>
        <p><strong>Architecture:</strong> Uses real-time data synchronization to dynamically update parking availability and booking status. Built using React Native for the frontend, with Firebase for real-time database synchronization and backend services.</p>
      `,
      images: [
        'carpark-1.jpg',
        'carpark-2.jpg',
        'carpark-3.jpg',
        'carpark-4.jpg',
        'carpark-5.jpg'
      ]
    },
    'motive': {
      title: 'Motive',
      tags: ['React Native', 'Expo', 'Health', 'Mindfulness'],
      desc: `
        <p><strong>Overview:</strong> Motive is a mindfulness and meditation mobile application designed to help users establish and maintain daily mindfulness practices.</p>
        <p><strong>Key Features:</strong> The app features guided meditation sessions, personalized health summaries, and progress tracking to empower mental well-being and daily relaxation.</p>
        <p><strong>Design:</strong> Built with a clean, immersive user interface focusing on calm, soothing visuals to deliver a premium user experience.</p>
      `,
      images: [
        'motive-1.png',
        'motive-2.png',
        'motive-3.png',
        'motive-4.png'
      ]
    },
    'annapurna': {
      title: 'AnnaPurna',
      tags: ['React Native', 'Expo', 'TypeScript', 'UI/UX'],
      desc: `
        <p><strong>Overview:</strong> Annapurna is a modern mobile recipe application designed to provide a simple and intuitive cooking experience. The app allows users to discover, explore, and save a wide variety of recipes through a clean and organized interface.</p>
        <p><strong>Key Features:</strong> Users can browse recipes by categories, search for specific dishes using keywords, and view detailed recipe pages with ingredients, cooking time, servings, and step-by-step preparation instructions. A dedicated favorites section enables quick access to saved recipes.</p>
        <p><strong>Architecture:</strong> The application focuses on smooth navigation and a seamless user experience using bottom tab navigation. Built using React Native (Expo) with TypeScript, ensuring scalable architecture, type safety, and responsive mobile performance.</p>
      `,
      images: [
        'annapurna-1.png',
        'annapurna-2.png',
        'annapurna-3.png',
        'annapurna-4.png',
        'annapurna-5.png'
      ]
    },
    'quickbite': {
      title: 'QuickBite',
      tags: ['React Native', 'Express.js', 'MongoDB', 'JWT Auth'],
      desc: `
        <p><strong>Overview:</strong> QuickBite is a full-stack campus food pickup application built to streamline restaurant browsing, ordering, and authentication in a secure and scalable way. The app allows users to explore restaurants, filter by categories, add favorites, manage carts, and place pickup orders seamlessly.</p>
        <p><strong>Key Features:</strong> It implements secure JWT-based authentication, with protected backend routes and token management using AsyncStorage and Axios interceptors. User-specific data such as favorites and orders are dynamically fetched from MongoDB.</p>
        <p><strong>Architecture:</strong> The application follows a structured client-server architecture built using React Native (Expo) with TypeScript on the frontend, and Node.js, Express.js, and MongoDB Atlas on the backend, deployed via Netlify and Render.</p>
      `,
      images: [
        'quickbite-1.png',
        'quickbite-2.png',
        'quickbite-3.png',
        'quickbite-4.png',
        'quickbite-5.png',
        'quickbite-6.png',
        'quickbite-7.png',
        'quickbite-8.png'
      ]
    },
    'leadify': {
      title: 'Leadify',
      tags: ['React Native', 'Redux Toolkit', 'CRM', 'Dashboard'],
      desc: `
        <p><strong>Overview:</strong> Leadify is a mobile-based Customer Relationship Management application designed to help small teams and individuals efficiently manage leads, customers, and sales data. The app provides a structured and intuitive system for tracking lead progress.</p>
        <p><strong>Key Features:</strong> Users can create and manage leads with categorized statuses enabling clear sales pipeline visibility. A dedicated dashboard presents lead statistics and visual charts for quick performance analysis. The application also supports customer management with search functionality and editable profiles.</p>
        <p><strong>Architecture:</strong> Built using React Native (Expo) with Redux Toolkit for state management, React Native Paper for UI components, AsyncStorage for local persistence, and Formik + Yup for form validation.</p>
      `,
      images: [
        'leadify-1.png',
        'leadify-2.png',
        'leadify-3.png',
        'leadify-4.png',
        'leadify-5.png'
      ]
    }
  };

  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const modalTitle = document.getElementById('modal-title');
  const modalTags = document.getElementById('modal-tags');
  const modalDesc = document.getElementById('modal-desc');
  const modalGallery = document.getElementById('modal-gallery');

  const descButtons = document.querySelectorAll('.btn-desc');

  /* ---- Screen Labels for all projects ---- */
  const screenLabels = {
    'fithive': [
      'Dashboard', 'Health Metrics', 'User Profile',
      'Coach List', 'Coach Bio', 'Coach Chat',
      'Rewards Store', 'Gift Details'
    ],
    'carpark': [
      'Owner Profile', 'Home Screen', 'Booking Confirmed', 'Wallet / Payment', 'Parking Nearby'
    ],
    'motive': [
      'Meditation Home', 'Session Player', 'Health Summary', 'Progress Tracker'
    ],
    'annapurna': [
      'Recipe Browser', 'Category View', 'Recipe Detail', 'Ingredients', 'Favorites'
    ],
    'quickbite': [
      'Restaurant List', 'Menu View', 'Cart', 'Order Confirmation',
      'Favorites', 'Profile', 'Auth', 'Categories'
    ],
    'leadify': [
      'Dashboard', 'Lead Pipeline', 'Lead Detail', 'Customer List', 'Analytics'
    ]
  };

  /** Build the unified swipe carousel for any project */
  const buildSwipeCarousel = (projectId, images) => {
    const labels = screenLabels[projectId] || [];

    const slidesHTML = images.map((url, i) => `
      <div class="sc-slide" data-index="${i}">
        <div class="sc-phone-frame">
          <img src="${url}" alt="${labels[i] || 'App Screen'}" loading="lazy" />
        </div>
        <div class="sc-slide-label">${labels[i] || ''}</div>
      </div>
    `).join('');

    const dotsHTML = images.map((_, i) => `
      <button class="sc-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Go to slide ${i + 1}"></button>
    `).join('');

    return `
      <div class="sc-carousel-wrap">
        <div class="sc-section-label">App Screens Preview</div>
        <div class="sc-carousel" id="sc-carousel">
          ${slidesHTML}
        </div>
        <div class="sc-dots" id="sc-dots">
          ${dotsHTML}
        </div>
      </div>
    `;
  };

  /** Attach drag + IntersectionObserver + dot click to a carousel */
  const initCarouselInteractions = () => {
    const carousel = document.getElementById('sc-carousel');
    if (!carousel) return;

    // Mouse drag to scroll
    let isDragging = false, startX = 0, scrollStart = 0;

    carousel.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollStart = carousel.scrollLeft;
      carousel.style.scrollBehavior = 'auto';
    });

    carousel.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      carousel.scrollLeft = scrollStart - (x - startX);
    });

    const stopDrag = () => {
      isDragging = false;
      carousel.style.scrollBehavior = 'smooth';
    };
    carousel.addEventListener('mouseup', stopDrag);
    carousel.addEventListener('mouseleave', stopDrag);

    // Dot sync via IntersectionObserver
    const dots = document.querySelectorAll('.sc-dot');
    const slides = carousel.querySelectorAll('.sc-slide');

    const dotObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.index, 10);
          dots.forEach((d, i) => d.classList.toggle('active', i === idx));
        }
      });
    }, { root: carousel, threshold: 0.6 });

    slides.forEach(slide => dotObserver.observe(slide));

    // Dot click → scroll to slide
    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        slides[idx]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      });
    });

    return { carousel, slides, isDragging };
  };

  const openModal = (projectId) => {
    const data = projectData[projectId];
    if (!data) return;

    // Populate data
    modalTitle.textContent = data.title;
    modalTags.innerHTML = data.tags.map(tag => `<span class="ptag">${tag}</span>`).join('');
    modalDesc.innerHTML = data.desc;

    // ── Build unified swipe carousel for all projects ──
    let galleryHTML = buildSwipeCarousel(projectId, data.images);

    // ── FitHive: Also add grid gallery + lightbox ──
    if (projectId === 'fithive') {
      const labels = screenLabels['fithive'];
      const gridHTML = data.images.map((url, i) => `
        <div class="fh-grid-item" data-index="${i}">
          <img src="${url}" alt="${labels[i] || 'FitHive Screen'}" loading="lazy" />
        </div>
      `).join('');

      galleryHTML += `
        <div class="fh-grid-wrap">
          <div class="sc-section-label">All Screenshots</div>
          <div class="fh-grid" id="fh-grid">
            ${gridHTML}
          </div>
        </div>
      `;
    }

    modalGallery.innerHTML = galleryHTML;

    // ── Init carousel interactions ──
    const carouselCtx = initCarouselInteractions();

    // ── FitHive: Lightbox setup ──
    if (projectId === 'fithive' && carouselCtx) {
      const gridItems = document.querySelectorAll('.fh-grid-item');

      // Create lightbox DOM (appended once)
      let lightbox = document.getElementById('fh-lightbox');
      if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'fh-lightbox';
        lightbox.id = 'fh-lightbox';

        const lbSlidesHTML = data.images.map(url => `
          <div class="fh-lightbox-slide">
            <img src="${url}" alt="FitHive screenshot" />
          </div>
        `).join('');

        lightbox.innerHTML = `
          <div class="fh-lightbox-backdrop" id="fh-lightbox-backdrop"></div>
          <div class="fh-lightbox-content">
            <div class="fh-lightbox-track" id="fh-lightbox-track">
              ${lbSlidesHTML}
            </div>
          </div>
          <button class="fh-lightbox-close" id="fh-lightbox-close" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <button class="fh-lightbox-nav fh-lightbox-prev" id="fh-lb-prev" aria-label="Previous">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <button class="fh-lightbox-nav fh-lightbox-next" id="fh-lb-next" aria-label="Next">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
          <div class="fh-lightbox-counter" id="fh-lb-counter">1 / ${data.images.length}</div>
        `;
        document.body.appendChild(lightbox);
      }

      let lbIndex = 0;
      const lbTrack = document.getElementById('fh-lightbox-track');
      const lbCounter = document.getElementById('fh-lb-counter');

      const updateLightbox = () => {
        lbTrack.style.transform = `translateX(-${lbIndex * 100}%)`;
        lbCounter.textContent = `${lbIndex + 1} / ${data.images.length}`;
      };

      const openLightbox = (idx) => {
        lbIndex = idx;
        updateLightbox();
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
      };

      const closeLightbox = () => {
        lightbox.classList.remove('is-open');
      };

      gridItems.forEach(item => {
        item.addEventListener('click', () => {
          openLightbox(parseInt(item.dataset.index, 10));
        });
      });

      // Also allow carousel slides to open lightbox on click (not drag)
      carouselCtx.slides.forEach(slide => {
        let clickStartX = 0;
        slide.addEventListener('mousedown', (e) => { clickStartX = e.pageX; });
        slide.addEventListener('click', (e) => {
          if (Math.abs(e.pageX - clickStartX) < 5) {
            openLightbox(parseInt(slide.dataset.index, 10));
          }
        });
      });

      document.getElementById('fh-lightbox-close').addEventListener('click', closeLightbox);
      document.getElementById('fh-lightbox-backdrop').addEventListener('click', closeLightbox);
      document.getElementById('fh-lb-prev').addEventListener('click', () => {
        if (lbIndex > 0) { lbIndex--; updateLightbox(); }
      });
      document.getElementById('fh-lb-next').addEventListener('click', () => {
        if (lbIndex < data.images.length - 1) { lbIndex++; updateLightbox(); }
      });

      // Keyboard nav for lightbox
      const lbKeyHandler = (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft' && lbIndex > 0) { lbIndex--; updateLightbox(); }
        if (e.key === 'ArrowRight' && lbIndex < data.images.length - 1) { lbIndex++; updateLightbox(); }
      };
      document.addEventListener('keydown', lbKeyHandler);

      // Touch swipe for lightbox
      let lbTouchStartX = 0;
      const lbContent = lightbox.querySelector('.fh-lightbox-content');
      lbContent.addEventListener('touchstart', (e) => { lbTouchStartX = e.touches[0].clientX; }, { passive: true });
      lbContent.addEventListener('touchend', (e) => {
        const diff = lbTouchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && lbIndex < data.images.length - 1) { lbIndex++; updateLightbox(); }
          if (diff < 0 && lbIndex > 0) { lbIndex--; updateLightbox(); }
        }
      }, { passive: true });
    }

    // Show modal & prevent scrolling
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  // Event Listeners for opening modal via Event Delegation
  document.addEventListener('click', (e) => {
    const descBtn = e.target.closest('.btn-desc');
    if (descBtn) {
      e.preventDefault();
      const projectId = descBtn.getAttribute('data-project');
      openModal(projectId);
    }
  });

  // Event Listeners for closing modal
  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  /* ============================================================
     FORMSPREE CONTACT FORM
     ============================================================ */
  const FORMSPREE_URL = 'https://formspree.io/f/xykdraav';

  const contactForm = document.getElementById('contact-form');
  const btnSend = document.getElementById('btn-send');
  const formStatus = document.getElementById('form-status');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate required fields
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const subject = document.getElementById('contact-subject').value;
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !subject || !message) return;

    // Set loading state — disable button to prevent duplicate submissions
    btnSend.disabled = true;
    btnSend.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = 'form-status';

    try {
      const response = await fetch(FORMSPREE_URL, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Success
        formStatus.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
        formStatus.className = 'form-status form-status-success';
        contactForm.reset();
      } else {
        // Formspree returned an error
        const data = await response.json();
        const errMsg = (data.errors && data.errors.map(e => e.message).join(', ')) || 'Submission failed.';
        formStatus.textContent = `❌ ${errMsg}`;
        formStatus.className = 'form-status form-status-error';
      }
    } catch (error) {
      // Network or unexpected error
      console.error('Form submission error:', error);
      formStatus.textContent = '❌ Something went wrong. Please check your connection and try again.';
      formStatus.className = 'form-status form-status-error';
    } finally {
      btnSend.disabled = false;
      btnSend.textContent = 'Send message';

      // Auto-dismiss status after 6s
      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 6000);
    }
  });

});
