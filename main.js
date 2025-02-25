// DOM Elements
const preloader = document.getElementById('preloader');
const menuToggle = document.querySelector('.menu-toggle');
const header = document.querySelector('.header');
const searchForm = document.querySelector('.search-form');

// Preloader removal
let preloaderRemoved = false;

function removePreloader() {
  if (!preloaderRemoved && preloader) {
    preloaderRemoved = true;
    preloader.style.opacity = '0';
    setTimeout(() => {
      if (preloader && preloader.parentNode) {
        preloader.style.display = 'none';
        preloader.parentNode.removeChild(preloader);
      }
    }, 300);
  }
}

// Try to remove preloader as soon as possible
if (document.readyState === 'complete') {
  removePreloader();
} else {
  window.addEventListener('load', removePreloader);
  // Backup event listener
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(removePreloader, 2000);
  });
  // Final fallback
  setTimeout(removePreloader, 5000);
}

// Header scroll behavior
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll <= 0) {
    header.classList.remove('scroll-up');
    return;
  }
  
  if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
    header.classList.remove('scroll-up');
    header.classList.add('scroll-down');
  } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
    header.classList.remove('scroll-down');
    header.classList.add('scroll-up');
  }
  lastScroll = currentScroll;
});

// Form submission with debounce
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

searchForm.addEventListener('submit', debounce((e) => {
  e.preventDefault();
  // Add your search logic here
  console.log('Search submitted');
}, 300));

// Lazy loading images
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const lazyLoadScript = document.createElement('script');
    lazyLoadScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(lazyLoadScript);
  }
});

// Performance optimizations
document.addEventListener('DOMContentLoaded', () => {
  // Defer non-critical images
  const deferImages = document.querySelectorAll('img[data-defer]');
  deferImages.forEach(img => {
    requestIdleCallback(() => {
      img.src = img.dataset.defer;
    });
  });

  // Prefetch links on hover
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        document.head.appendChild(prefetchLink);
      }
    });
  });
});

// Districts Slider
class DistrictsSlider {
  constructor() {
    this.slider = document.querySelector('.districts-slider');
    this.track = document.querySelector('.districts-track');
    this.slides = Array.from(this.track.children);
    this.prevButton = document.querySelector('.nav-button.prev');
    this.nextButton = document.querySelector('.nav-button.next');
    
    this.slideWidth = 0;
    this.currentIndex = 0;
    this.slidesPerView = 3;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.init();
  }

  init() {
    // Calculate slide width
    this.updateSlideWidth();

    // Set initial position
    this.updateTrackPosition();

    // Add event listeners
    window.addEventListener('resize', () => {
      this.updateSlideWidth();
      this.updateTrackPosition();
    });

    if (this.prevButton && this.nextButton) {
      this.prevButton.addEventListener('click', () => this.move('prev'));
      this.nextButton.addEventListener('click', () => this.move('next'));
    }

    // Touch events for mobile
    this.track.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
    });

    this.track.addEventListener('touchend', (e) => {
      this.touchEndX = e.changedTouches[0].clientX;
      const diff = this.touchStartX - this.touchEndX;
      
      if (Math.abs(diff) > 50) { // Minimum swipe distance
        if (diff > 0) {
          this.move('next');
        } else {
          this.move('prev');
        }
      }
    });

    // Update buttons state
    this.updateButtons();
  }

  updateSlideWidth() {
    if (window.innerWidth <= 768) {
      this.slidesPerView = 1;
    } else if (window.innerWidth <= 1024) {
      this.slidesPerView = 2;
    } else {
      this.slidesPerView = 3;
    }

    this.slideWidth = this.slider.offsetWidth / this.slidesPerView;
    this.slides.forEach(slide => {
      slide.style.flexBasis = `${this.slideWidth}px`;
      slide.style.minWidth = `${this.slideWidth}px`;
    });
  }

  updateTrackPosition() {
    const position = -this.currentIndex * this.slideWidth;
    this.track.style.transform = `translateX(${position}px)`;
  }

  move(direction) {
    if (direction === 'next' && this.currentIndex < this.slides.length - this.slidesPerView) {
      this.currentIndex++;
    } else if (direction === 'prev' && this.currentIndex > 0) {
      this.currentIndex--;
    }

    this.updateTrackPosition();
    this.updateButtons();
  }

  updateButtons() {
    if (this.prevButton && this.nextButton) {
      this.prevButton.disabled = this.currentIndex === 0;
      this.nextButton.disabled = this.currentIndex >= this.slides.length - this.slidesPerView;
    }
  }
}

// Initialize districts slider when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const districtsSlider = new DistrictsSlider();
});
