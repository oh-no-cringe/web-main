const sections = document.querySelectorAll(".content-section");
const tocLinks = document.querySelectorAll(".toc a");
const navLinks = document.querySelectorAll(".main-nav a");

function activateLinks() {
  let currentId = "";

  sections.forEach((section) => {
    const top = section.offsetTop - 160;
    const height = section.offsetHeight;

    if (window.scrollY >= top && window.scrollY < top + height) {
      currentId = section.id;
    }
  });

  tocLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
}

window.addEventListener("scroll", activateLinks);
window.addEventListener("load", activateLinks);

window.addEventListener("load", () => {
  const logoImage = document.getElementById("logoImage");
  const logoPlaceholder = document.getElementById("logoPlaceholder");

  if (logoImage && logoImage.getAttribute("src") && !logoImage.complete) {
    logoImage.style.display = "none";
    logoPlaceholder.style.display = "flex";
  }

  logoImage.addEventListener("load", () => {
    logoImage.style.display = "block";
    logoPlaceholder.style.display = "none";
  });

  logoImage.addEventListener("error", () => {
    logoImage.style.display = "none";
    logoPlaceholder.style.display = "flex";
  });
});

// ===== Скрытие верхней полоски только на телефоне =====
(function() {
  if (window.innerWidth > 768) return;

  const topbar = document.querySelector('.topbar');
  if (!topbar) return;

  let lastScrollTop = 0;
  let ticking = false;

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > 50) {
          topbar.classList.add('hide-on-scroll');
        } else {
          topbar.classList.remove('hide-on-scroll');
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ===== Панель доступности для слабовидящих =====
(function() {
  const a11yToggle = document.getElementById('a11yToggle');
  const a11yOptions = document.getElementById('a11yOptions');
  if (!a11yToggle || !a11yOptions) return;

  // Открытие/закрытие панели
  a11yToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = a11yOptions.classList.toggle('open');
    a11yToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Закрыть при клике вне панели
  document.addEventListener('click', (e) => {
    if (!a11yOptions.contains(e.target) && e.target !== a11yToggle) {
      a11yOptions.classList.remove('open');
      a11yToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Закрыть по Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && a11yOptions.classList.contains('open')) {
      a11yOptions.classList.remove('open');
      a11yToggle.setAttribute('aria-expanded', 'false');
      a11yToggle.focus();
    }
  });

  // Цветовые схемы
  const modeButtons = a11yOptions.querySelectorAll('[data-mode]');
  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.dataset.mode;
      document.body.classList.remove('a11y-high-contrast', 'a11y-yellow-black', 'a11y-blue-white');
      if (mode !== 'default') {
        document.body.classList.add(`a11y-${mode}`);
      }
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      localStorage.setItem('a11y-mode', mode);
    });
  });

  // Размер шрифта
  const sizeButtons = a11yOptions.querySelectorAll('[data-size]');
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const size = btn.dataset.size;
      document.body.classList.remove('a11y-font-large', 'a11y-font-xlarge');
      if (size === 'large') {
        document.body.classList.add('a11y-font-large');
      } else if (size === 'xlarge') {
        document.body.classList.add('a11y-font-xlarge');
      }
      sizeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      localStorage.setItem('a11y-font', size);
    });
  });

  // Широкий интервал
  const spacingBtn = document.getElementById('a11ySpacing');
  if (spacingBtn) {
    spacingBtn.addEventListener('click', () => {
      const isActive = document.body.classList.toggle('a11y-wide-spacing');
      spacingBtn.classList.toggle('active', isActive);
      localStorage.setItem('a11y-spacing', isActive ? 'on' : 'off');
    });
  }

  // Скрыть изображения
  const imagesBtn = document.getElementById('a11yImages');
  if (imagesBtn) {
    imagesBtn.addEventListener('click', () => {
      const isActive = document.body.classList.toggle('a11y-hide-images');
      imagesBtn.classList.toggle('active', isActive);
      localStorage.setItem('a11y-images', isActive ? 'on' : 'off');
    });
  }

  // Подчёркивать ссылки
  const underlineBtn = document.getElementById('a11yUnderline');
  if (underlineBtn) {
    underlineBtn.addEventListener('click', () => {
      const isActive = document.body.classList.toggle('a11y-underline-links');
      underlineBtn.classList.toggle('active', isActive);
      localStorage.setItem('a11y-underline', isActive ? 'on' : 'off');
    });
  }

  // Восстановление настроек из localStorage
  function restoreSettings() {
    const mode = localStorage.getItem('a11y-mode') || 'default';
    const font = localStorage.getItem('a11y-font') || 'normal';
    const spacing = localStorage.getItem('a11y-spacing') || 'off';
    const images = localStorage.getItem('a11y-images') || 'off';
    const underline = localStorage.getItem('a11y-underline') || 'off';

    // Применить цветовую схему
    if (mode !== 'default') {
      document.body.classList.add(`a11y-${mode}`);
    }
    modeButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.mode === mode);
    });

    // Применить размер шрифта
    if (font === 'large') document.body.classList.add('a11y-font-large');
    if (font === 'xlarge') document.body.classList.add('a11y-font-xlarge');
    sizeButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.size === font);
    });

    // Применить остальные
    if (spacing === 'on') {
      document.body.classList.add('a11y-wide-spacing');
      spacingBtn?.classList.add('active');
    }
    if (images === 'on') {
      document.body.classList.add('a11y-hide-images');
      imagesBtn?.classList.add('active');
    }
    if (underline === 'on') {
      document.body.classList.add('a11y-underline-links');
      underlineBtn?.classList.add('active');
    }
  }

  restoreSettings();
})();

// ===== Карта: подсветка активного маркера при табуляции =====
(function() {
  const hotspots = document.querySelectorAll('.map-hotspot');
  hotspots.forEach(h => {
    h.addEventListener('focus', () => {
      h.style.zIndex = '30';
    });
    h.addEventListener('blur', () => {
      h.style.zIndex = '';
    });
  });
})();


// Плавная прокрутка для всех якорных ссылок
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    
    // Пропускаем если это просто # или javascript:void
    if (href === '#' || href.startsWith('javascript')) return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});