document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.header');
  const navLinks = document.querySelectorAll('.nav-link');
  const actionBtns = document.querySelectorAll('.action-btn');

  // Header scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // Smooth hover animations for nav links
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const icon = link.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1.2) translateY(-2px)';
        icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    });

    link.addEventListener('mouseleave', () => {
      const icon = link.querySelector('i');
      if (icon) {
        icon.style.transform = 'scale(1) translateY(0)';
      }
    });
  });

  // Button hover effects
  actionBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      btn.style.transform = 'translateY(-2px)';
      btn.style.boxShadow = '0 4px 12px rgba(240, 165, 0, 0.2)';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translateY(0)';
      btn.style.boxShadow = 'none';
    });
  });

  // Logo animation
  const logoIcon = document.querySelector('.logo-icon');
  if (logoIcon) {
    logoIcon.addEventListener('mouseenter', () => {
      logoIcon.style.transform = 'scale(1.1) rotate(10deg)';
    });

    logoIcon.addEventListener('mouseleave', () => {
      logoIcon.style.transform = 'scale(1) rotate(0deg)';
    });
  }
});