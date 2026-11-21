
let data, current = 0, timer = null, paused = false;
let pointerStart = null, wasRunningBeforePress = false;
let activeCategory = 0;

const $ = id => document.getElementById(id);

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
}[c]));

async function init() {
  try {
    const response = await fetch('/content/site.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load site content');
    data = await response.json();
  } catch (e) {
    console.error('Site content could not be loaded:', e);
    data = { categories: [], services: [] };
  }

  render();
  $('year').textContent = new Date().getFullYear();
  bindSlideshowGestures();
}

const categories = () =>
  Array.isArray(data.categories)
    ? data.categories.filter(c => c.visible !== false)
    : [];

const slides = () => categories();

function render() {
  renderTopicButtons();

  if (slides().length) {
    current = 0;
    showSlide(current);
  }

  $('servicesList').innerHTML = (data.services || [])
    .filter(s => s.visible !== false)
    .map(s => `<article class="card"><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></article>`)
    .join('');

  $('productsList').innerHTML = cards(data.products);
  $('projectsList').innerHTML = cards(data.projects);

  $('reviewsList').innerHTML = (data.testimonials || [])
    .filter(x => x.visible !== false)
    .map(t => `<article class="card"><p>“${esc(t.quote)}”</p><strong>${esc(t.name)}</strong></article>`)
    .join('');

  $('maintenanceTitle').textContent = data.maintenance?.title || '';
  $('maintenanceText').textContent = data.maintenance?.description || '';
  $('aboutTitle').textContent = data.about?.title || '';
  $('aboutText').textContent = data.about?.description || '';

  const b = data.business || {};
  $('contactDetails').textContent =
    [b.phone, b.email, b.serviceArea].filter(Boolean).join(' · ');

  if (data.settings?.autoRotate !== false) start();
}

function cards(arr) {
  return (arr || [])
    .filter(x => x.visible !== false)
    .map(x => `
      <article class="card">
        ${x.image ? `<img src="${esc(x.image)}" alt="">` : ''}
        <h3>${esc(x.title || x.model || '')}</h3>
        <p>${esc(x.description || '')}</p>
        ${x.details ? `<p>${esc(x.details)}</p>` : ''}
      </article>
    `)
    .join('');
}

function renderTopicButtons() {
  const list = categories();
  const nav = $('topicNav');

  nav.style.setProperty('--topic-count', Math.max(1, list.length));

  nav.innerHTML = list.map((c, i) => `
    <button
      class="topic-button ${i === activeCategory ? 'active' : ''}"
      data-i="${i}"
      type="button"
      aria-pressed="${i === activeCategory}">
      ${esc(c.label || c.title || 'Category')}
    </button>
  `).join('');

  nav.querySelectorAll('.topic-button').forEach(button => {
    button.addEventListener('click', () => {
      showSlide(Number(button.dataset.i));
    });
  });
}

function renderCategoryContent(category) {
  if (!category) return;

  $('categoryEyebrow').textContent =
    category.contentEyebrow || category.eyebrow || category.label || 'Explore';

  $('categoryHeading').textContent =
    category.contentTitle || category.title || category.label || 'Explore';

  $('categoryDescription').textContent =
    category.contentDescription || category.description || '';

  const items = Array.isArray(category.contentItems)
    ? category.contentItems.filter(x => x.visible !== false)
    : [];

  $('categoryItems').innerHTML = items.length
    ? items.map(item => `
        <article class="category-item">
          ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title || '')}">` : ''}
          <div class="item-copy">
            <h3>${esc(item.title || '')}</h3>
            <p>${esc(item.description || '')}</p>
            ${item.link ? `
              <a href="${esc(item.link)}"
                ${/^https?:/i.test(item.link) ? 'target="_blank" rel="noopener"' : ''}>
                ${esc(item.linkText || 'Learn more')} →
              </a>
            ` : ''}
          </div>
        </article>
      `).join('')
    : '<p class="category-empty">More information and photos can be added here.</p>';
}

function showSlide(i) {
  const list = slides();
  if (!list.length) return;

  current = (i + list.length) % list.length;
  activeCategory = current;

  const s = list[current];
  const heroBg = $('heroBg');

  heroBg.style.backgroundImage =
    s.image ? `url("${s.image}")` : 'none';

  $('slideEyebrow').textContent = s.eyebrow || '';
  $('slideTitle').textContent = s.title || '';
  $('slideDescription').textContent = s.description || '';

  $('slideLink').textContent = s.buttonText || 'Learn more';
  $('slideLink').href = s.link || '#contact';
  $('slideLink').style.display =
    s.buttonText || s.link ? 'inline-block' : 'none';

  renderCategoryContent(s);

  $('topicNav').querySelectorAll('.topic-button').forEach((button, index) => {
    button.classList.toggle('active', index === current);
    button.setAttribute('aria-pressed', String(index === current));
  });
}

function stop() {
  clearInterval(timer);
  timer = null;
}

function start() {
  stop();

  if (slides().length > 1 && !paused && data.settings?.autoRotate !== false) {
    timer = setInterval(
      () => showSlide(current + 1),
      Number(data.settings.slideInterval) || 5000
    );
  }
}

function bindSlideshowGestures() {
  const hero = $('hero');

  hero.addEventListener('pointerdown', e => {
    if (e.target.closest('a')) return;

    pointerStart = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };

    wasRunningBeforePress = !!timer;
    stop();
  });

  hero.addEventListener('pointerup', e => {
    if (!pointerStart) return;

    const dx = e.clientX - pointerStart.x;
    const dy = e.clientY - pointerStart.y;
    const elapsed = Date.now() - pointerStart.time;

    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      showSlide(current + (dx < 0 ? 1 : -1));
    } else if (
      Math.abs(dx) < 12 &&
      Math.abs(dy) < 12 &&
      elapsed < 500 &&
      !e.target.closest('.hero-copy')
    ) {
      const rect = hero.getBoundingClientRect();
      showSlide(current + (e.clientX < rect.left + rect.width / 2 ? -1 : 1));
    }

    pointerStart = null;

    if (wasRunningBeforePress && !paused) start();
  });

  hero.addEventListener('pointercancel', () => {
    pointerStart = null;
    if (wasRunningBeforePress && !paused) start();
  });

  hero.addEventListener('contextmenu', e => e.preventDefault());
}

$('btuForm').onsubmit = e => {
  e.preventDefault();

  const raw =
    +$('sqft').value *
    25 *
    +$('ceiling').value *
    +$('insulation').value *
    +$('windows').value;

  const lo = Math.round(raw * 0.85 / 1000) * 1000;
  const hi = Math.round(raw * 1.15 / 1000) * 1000;

  const msg =
    `Very rough planning estimate: ${lo.toLocaleString()}–${hi.toLocaleString()} BTU/hr. Not a heat-loss calculation or equipment recommendation.`;

  $('btuResult').textContent = msg;
  $('btuHidden').value = msg;
};

$('contactForm').onsubmit = async e => {
  e.preventDefault();

  const fd = new FormData(e.target);
  const endpoint = data.settings?.formspreeEndpoint;

  if (endpoint) {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: fd,
        headers: { Accept: 'application/json' }
      });

      if (!response.ok) throw Error();

      $('formNote').textContent = 'Thank you. Your request was submitted.';
      e.target.reset();
      return;
    } catch (err) {
      $('formNote').textContent =
        'Online submission failed. Opening an email draft instead.';
    }
  }

  const subject = encodeURIComponent(
    'Website estimate request - ' + fd.get('name')
  );

  const body = encodeURIComponent(
    [...fd.entries()].map(([k, v]) => `${k}: ${v}`).join('\n')
  );

  const email = data.business?.email || '';
  location.href =
    `mailto:${email}?subject=${subject}&body=${body}`;
};

document.querySelector('.menu').onclick = () => {
  const nav = document.querySelector('.header nav');

  nav.classList.toggle('open');

  document.querySelector('.menu').setAttribute(
    'aria-expanded',
    String(nav.classList.contains('open'))
  );
};

init();
