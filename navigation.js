(() => {
  const logoPath = "/assets/bmcs%20tran.png";

  const menu = `
    <a href="/">Home</a>

    <div class="bm-nav-group">
      <div class="bm-nav-line">
        <a href="/heat-pumps.html">Heat Pumps</a>
        <button class="bm-submenu-toggle" type="button"
          aria-label="Open Heat Pumps submenu"
          aria-expanded="false">⌄</button>
      </div>
      <div class="bm-dropdown" hidden>
        <a href="/heat-pumps.html">Heat Pump Overview</a>
        <a href="/ductless-systems.html">Ductless Systems</a>
        <a href="/ducted-systems.html">Ducted Systems</a>
        <a href="/multi-zone-systems.html">Multi-Zone Systems</a>
      </div>
    </div>

    <a href="/installation.html">Installation</a>
    <a href="/cleaning-maintenance.html">Cleaning &amp; Maintenance</a>
    <a href="/efficiency-maine.html">Efficiency Maine</a>
    <a href="/about.html">About</a>
    <a href="/espanol.html">Español</a>
    <a class="cta" href="/contact.html">Get an Estimate</a>
  `;

  function installBranding() {
    const header = document.querySelector(".header");
    const brand = header?.querySelector(".brand, .logo");

    if (brand) {
      brand.classList.remove("logo");
      brand.classList.add("brand");
      brand.innerHTML = `
        <img src="${logoPath}" alt="Bull Moose Climate Systems moose logo">
        <span class="brand-name">
          <strong>BULL MOOSE</strong>
          <span>CLIMATE SYSTEMS LLC</span>
        </span>
      `;
    }

    const footer = document.querySelector("footer");

    if (footer) {
      footer.classList.add("footer");
      footer.innerHTML = `
        <a href="/" class="footer-brand">
          <img src="${logoPath}" alt="Bull Moose Climate Systems moose logo">
          <span class="footer-brand-name">
            <strong>BULL MOOSE</strong>
            <span>CLIMATE SYSTEMS LLC</span>
          </span>
        </a>
        <p>Residential heat-pump solutions in Maine.</p>
        <p>
          <a href="tel:+12078978780">207-897-8780</a>
          &nbsp;·&nbsp;
          <a href="mailto:bullmooseclimate@gmail.com">Email</a>
          &nbsp;·&nbsp;
          <a href="https://wa.me/12078978780">WhatsApp</a>
        </p>
        <small>&copy; ${new Date().getFullYear()} Bull Moose Climate Systems LLC</small>
      `;
    }
  }

  function installNavigation() {
    const header = document.querySelector(".header");
    const nav = header?.querySelector("nav");

    if (!header || !nav) return;

    nav.innerHTML = menu;
    nav.classList.add("bm-main-nav");

    nav.querySelectorAll(".bm-submenu-toggle").forEach(button => {
      button.addEventListener("click", event => {
        event.preventDefault();
        event.stopPropagation();

        const dropdown = button.closest(".bm-nav-group")
          .querySelector(".bm-dropdown");
        const opening = dropdown.hidden;

        nav.querySelectorAll(".bm-dropdown").forEach(item => {
          item.hidden = true;
        });

        nav.querySelectorAll(".bm-submenu-toggle").forEach(item => {
          item.setAttribute("aria-expanded", "false");
        });

        dropdown.hidden = !opening;
        button.setAttribute("aria-expanded", String(opening));
      });
    });

    document.addEventListener("click", event => {
      if (!nav.contains(event.target)) {
        nav.querySelectorAll(".bm-dropdown").forEach(item => {
          item.hidden = true;
        });
      }
    });
  }

  function initialize() {
    installBranding();
    installNavigation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
