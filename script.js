document.addEventListener('DOMContentLoaded', () => {

  /* ---- Custom Cursor ---- */
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (window.innerWidth > 900 && cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.transform = `translate3d(${mouseX - 4}px, ${mouseY - 4}px, 0)`;
    });

    const followLoop = () => {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.transform = `translate3d(${followerX - 18}px, ${followerY - 18}px, 0)`;
      requestAnimationFrame(followLoop);
    };
    followLoop();

    const clickables = document.querySelectorAll('a, button, .project-card, .service-card, .stat-card, .skill-tag, .tl-item');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });
  }

  /* ---- Mobile Sidebar + Nav Toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const navLinks = document.getElementById('topnav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      // On narrow screens, toggle sidebar; on mid screens toggle nav links
      if (window.innerWidth <= 900) {
        sidebar && sidebar.classList.toggle('open');
        navLinks && navLinks.classList.toggle('open');
      }
    });
  }

  // Close mobile menu on link click
  const allNavLinks = document.querySelectorAll('.topnav-link');
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('active');
      sidebar && sidebar.classList.remove('open');
      navLinks && navLinks.classList.remove('open');
    });
  });

  /* ---- Active Nav Link on Scroll ---- */
  const sections = document.querySelectorAll('.page-section');

  const updateActiveLink = () => {
    let current = 'home';
    const scrollPos = window.scrollY + window.innerHeight * 0.35;

    sections.forEach(section => {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute('id');
      }
    });

    allNavLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-section') === current) {
        link.classList.add('active');
      }
    });
  };

  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });

  /* ---- Scroll Reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');

  const revealOnScroll = () => {
    const wh = window.innerHeight;
    revealEls.forEach(el => {
      if (el.getBoundingClientRect().top < wh - 60) {
        el.classList.add('active');
      }
    });
  };

  revealOnScroll();
  window.addEventListener('scroll', revealOnScroll, { passive: true });

  /* ---- Sidebar CTA smooth scroll ---- */
  const sidebarCta = document.querySelector('.sidebar-cta');
  if (sidebarCta) {
    sidebarCta.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('contact');
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  }

});
