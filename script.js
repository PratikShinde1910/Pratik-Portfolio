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
    const isClickable = e.target.closest('a, button, .project-card, .service-card, .stat-card, .skill-tag, .tl-item, .tool-card');

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

});
