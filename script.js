
let data = {};
let current = 0;
let timer = null;
let slideChangeToken = 0;
let pointerStart = null;
let wasRunningBeforePress = false;

const $ = id => document.getElementById(id);

const FIRST_SLIDE_IMAGE =
  "https://strongheatingcooling.com/assets/mini-split-DFttqcpW.jpg";

function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[character]));
}

function getCategories() {
  return Array.isArray(data.categories)
    ? data.categories.filter(category => category.visible !== false)
    : [];
}

function getSlides() {
  const categoryList = getCategories();

  const savedSlides = Array.isArray(data.slides)
    ? data.slides.filter(slide => slide.visible !== false)
    : [];

  return categoryList.map((category, index) => {
    const savedSlide = savedSlides[index] || {};

    const combined = {
      ...category,
      ...savedSlide,
      _category: category
    };

    if (index === 0) {
      combined.image = FIRST_SLIDE_IMAGE;
    }

    if (category.id === 'maintenance') {
      combined.image = '/assets/20260718_092057.jpg';
    }

    return combined;
  });
}

function fixAboutLogo() {
  document.querySelectorAll('.home-service-card').forEach(card => {
    const heading = card.querySelector('h3');
    const image = card.querySelector('img');

    if (
      heading &&
      image &&
      heading.textContent.trim() === 'About Bull Moose'
    ) {
      image.style.objectFit = 'contain';
      image.style.height = '240px';
      image.style.width = '100%';
      image.style.padding = '0';
      image.style.backgroundColor = '#ffffff';
    }
  });
}

function createTopicButtons() {
  const hero = $('hero');
  if (!hero) return;

  let nav = $('slideTopicButtons');

  if (!nav) {
    nav = document.createElement('nav');
    nav.id = 'slideTopicButtons';
    nav.className = 'topic-nav';
    nav.setAttribute('aria-label', 'Slideshow topics');
    hero.insertAdjacentElement('afterend', nav);
  }

  const list = getSlides();

  nav.style.setProperty('--topic-count', Math.max(1, list.length));

  nav.innerHTML = list.map((slide, index) => `
    <button
      class="topic-button ${index === current ? 'active' : ''}"
      data-slide="${index}"
      type="button"
      aria-pressed="${index === current}">
      ${escapeHTML(slide._category.label || slide.eyebrow || slide.title)}
    </button>
  `).join('');

  nav.querySelectorAll('.topic-button').forEach(button => {
    button.addEventListener('click', () => {
      showSlide(Number(button.dataset.slide));
    });
  });

  updateTopicButtons();
}

function updateTopicButtons() {
  const nav = $('slideTopicButtons');
  if (!nav) return;

  nav.querySelectorAll('.topic-button').forEach((button, index) => {
    const active = index === current;

    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
}

async function init() {
  try {
    const response = await fetch('/content/site.json', {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Could not load site content');
    }

    data = await response.json();

  } catch (error) {
    console.error('Could not load website content:', error);
    data = {
      categories: [],
      slides: [],
      settings: {},
      business: {}
    };
  }

  if ($('year')) {
    $('year').textContent = new Date().getFullYear();
  }

  const business = data.business || {};

  if ($('contactDetails')) {
    $('contactDetails').textContent =
      [business.phone, business.email].filter(Boolean).join(' · ');
  }

  fixAboutLogo();
  createTopicButtons();

  if (getSlides().length) {
    await showSlide(0, false);
    startSlideshow();
  }

  bindSlideshowGestures();
  bindContactForm();
  bindBtuForm();
  bindMenu();
}

async function showSlide(index, resetTimer = true) {
  const list = getSlides();
  if (!list.length) return;

  current = (index + list.length) % list.length;

  const slide = list[current];
  const token = ++slideChangeToken;

  if (resetTimer) {
    startSlideshow();
  }

  updateTopicButtons();

  const heroBg = $('heroBg');
  const heroCopy = document.querySelector('.hero-copy');

  if (slide.image) {
    const preload = new Image();
    preload.src = slide.image;

    try {
      await preload.decode();
    } catch (error) {
      // Continue if the image cannot be preloaded.
    }
  }

  if (token !== slideChangeToken) return;

  if (heroBg) {
    heroBg.style.backgroundImage = slide.image
      ? `url("${slide.image}")`
      : 'none';
  }

  if (heroCopy) {
    heroCopy.classList.add('slide-copy-changing');
  }

  setTimeout(() => {
    if (token !== slideChangeToken) return;

    if ($('slideEyebrow')) {
      $('slideEyebrow').textContent = slide.eyebrow || '';
    }

    if ($('slideTitle')) {
      $('slideTitle').textContent = slide.title || '';
    }

    if ($('slideDescription')) {
      $('slideDescription').textContent = slide.description || '';
    }

    if ($('slideLink')) {
      $('slideLink').textContent =
        slide.buttonText || 'Learn more';

      $('slideLink').href =
        slide.link || '/heat-pumps.html';

      $('slideLink').style.display =
        slide.buttonText || slide.link ? 'inline-block' : 'none';
    }

    if (heroCopy) {
      heroCopy.classList.remove('slide-copy-changing');
    }
  }, 250);
}

function stopSlideshow() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function startSlideshow() {
  stopSlideshow();

  const list = getSlides();

  if (
    list.length > 1 &&
    data.settings?.autoRotate !== false
  ) {
    timer = setInterval(() => {
      showSlide(current + 1, false);
    }, Number(data.settings?.slideInterval) || 5000);
  }
}

function bindSlideshowGestures() {
  const hero = $('hero');
  if (!hero) return;

  hero.addEventListener('pointerdown', event => {
    if (event.target.closest('a')) return;

    pointerStart = {
      x: event.clientX,
      y: event.clientY,
      time: Date.now()
    };

    wasRunningBeforePress = !!timer;
    stopSlideshow();
  });

  hero.addEventListener('pointerup', event => {
    if (!pointerStart) return;

    const dx = event.clientX - pointerStart.x;
    const dy = event.clientY - pointerStart.y;
    const elapsed = Date.now() - pointerStart.time;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      showSlide(current + (dx < 0 ? 1 : -1));

    } else if (
      Math.abs(dx) < 12 &&
      Math.abs(dy) < 12 &&
      elapsed < 500 &&
      !event.target.closest('.hero-copy')
    ) {
      const rect = hero.getBoundingClientRect();

      showSlide(
        current +
        (event.clientX < rect.left + rect.width / 2 ? -1 : 1)
      );
    }

    pointerStart = null;

    if (wasRunningBeforePress) {
      startSlideshow();
    }
  });

  hero.addEventListener('pointercancel', () => {
    pointerStart = null;

    if (wasRunningBeforePress) {
      startSlideshow();
    }
  });

  hero.addEventListener('contextmenu', event => {
    event.preventDefault();
  });
}

function bindContactForm() {
  const form = $('contactForm');
  if (!form) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const formData = new FormData(form);
    const endpoint = data.settings?.formspreeEndpoint;

    if (endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' }
        });

        if (!response.ok) {
          throw new Error('Submission failed');
        }

        if ($('formNote')) {
          $('formNote').textContent =
            'Thank you. Your request was submitted.';
        }

        form.reset();
        return;

      } catch (error) {
        if ($('formNote')) {
          $('formNote').textContent =
            'Online submission failed. Opening an email draft instead.';
        }
      }
    }

    const subject = encodeURIComponent(
      'Website estimate request - ' +
      (formData.get('name') || '')
    );

    const body = encodeURIComponent(
      [...formData.entries()]
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n')
    );

    const email =
      data.business?.email || 'bullmooseclimate@gmail.com';

    window.location.href =
      `mailto:${email}?subject=${subject}&body=${body}`;
  });
}

function bindBtuForm() {
  const form = $('btuForm');
  if (!form) return;

  form.addEventListener('submit', event => {
    event.preventDefault();

    const squareFeet = Number($('sqft')?.value);
    const ceiling = Number($('ceiling')?.value);
    const insulation = Number($('insulation')?.value);
    const windows = Number($('windows')?.value);

    const raw = squareFeet * 25 * ceiling * insulation * windows;

    const low = Math.round(raw * 0.85 / 1000) * 1000;
    const high = Math.round(raw * 1.15 / 1000) * 1000;

    const message =
      `Very rough planning estimate: ${low.toLocaleString()}–${high.toLocaleString()} BTU/hr. Not a heat-loss calculation or equipment recommendation.`;

    if ($('btuResult')) {
      $('btuResult').textContent = message;
    }

    if ($('btuHidden')) {
      $('btuHidden').value = message;
    }
  });
}

function bindMenu() {
  const button = document.querySelector('.menu');
  const nav = document.querySelector('.header nav');

  if (!button || !nav) return;

  button.addEventListener('click', () => {
    nav.classList.toggle('open');

    button.setAttribute(
      'aria-expanded',
      String(nav.classList.contains('open'))
    );
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    });
  });
}

init();
