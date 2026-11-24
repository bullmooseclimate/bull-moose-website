(() => {
  const logoPath = "/assets/bmcs%20tran.png";
  const phoneNumber = "+12078978780";
  const phoneDisplay = "207-897-8780";
  const emailAddress = "bullmooseclimate@gmail.com";
  const whatsappUrl = "https://wa.me/12078978780";

  const icons = {
    phone: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.4 19.4 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.2-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.8 2.1z"/>
      </svg>`,

    email: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="2.5" y="4.5" width="19" height="15" rx="2"/>
        <path d="m3 6 9 7 9-7"/>
      </svg>`,

    whatsapp: `
      <svg class="whatsapp-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.3-4.7a8.5 8.5 0 1 1 16.2-4z"/>
        <path d="M8.5 7.5c-.3-.7-.6-.7-.9-.7h-.7c-.3 0-.7.2-.9.6-.3.3-1.1 1.1-1.1 2.7s1.1 3.1 1.3 3.3c.2.2 2.1 3.4 5.2 4.6 2.6 1 3.1.8 3.7.7.6-.1 1.9-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.7-.5l-2.2-1.1c-.3-.1-.5-.2-.7.2-.2.3-.8 1.1-1 1.3-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.3-.4.3-.6.1-.1 0-.5 0-.6z"/>
      </svg>`
  };

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

  function iconForLink(link) {
    const href = (link.getAttribute("href") || "").toLowerCase();

    if (href.startsWith("tel:")) return icons.phone;
    if (href.startsWith("mailto:")) return icons.email;

    if (href.includes("wa.me") || href.includes("whatsapp")) {
      return icons.whatsapp;
    }

    return "";
  }

  function addContactIcons() {
    document.querySelectorAll(
      'a[href^="tel:"], a[href^="mailto:"], a[href*="wa.me"], a[href*="whatsapp"]'
    ).forEach(link => {
      if (link.dataset.contactIconAdded === "true") return;

      const icon = iconForLink(link);
      if (!icon) return;

      if (!link.querySelector("svg")) {
        link.insertAdjacentHTML("afterbegin", icon);
      }

      link.classList.add("bm-contact-link");
      link.dataset.contactIconAdded = "true";
    });

    const contactDetails = document.getElementById("contactDetails");

    if (
      contactDetails &&
      contactDetails.textContent.trim() &&
      !contactDetails.dataset.contactLinksAdded
    ) {
      contactDetails.innerHTML = `
        <span class="bm-contact-inline">
          <a href="tel:${phoneNumber}">
            ${icons.phone}
            <span>${phoneDisplay}</span>
          </a>

          <a href="${whatsappUrl}" target="_blank" rel="noopener">
            ${icons.whatsapp}
            <span>WhatsApp</span>
          </a>

          <a href="mailto:${emailAddress}">
            ${icons.email}
            <span>Email</span>
          </a>
        </span>
      `;

      contactDetails.dataset.contactLinksAdded = "true";
    }
  }

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

        <div class="footer-contact-icons">
          <a href="tel:${phoneNumber}">
            ${icons.phone}
            <span>${phoneDisplay}</span>
          </a>

          <a href="${whatsappUrl}" target="_blank" rel="noopener">
            ${icons.whatsapp}
            <span>WhatsApp</span>
          </a>

          <a href="mailto:${emailAddress}">
            ${icons.email}
            <span>Email</span>
          </a>
        </div>

        <small>
          &copy; ${new Date().getFullYear()} Bull Moose Climate Systems LLC
        </small>
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

        button.setAttribute(
          "aria-expanded",
          String(opening)
        );
      });
    });

    document.addEventListener("click", event => {
      if (!nav.contains(event.target)) {
        nav.querySelectorAll(".bm-dropdown").forEach(item => {
          item.hidden = true;
        });

        nav.querySelectorAll(".bm-submenu-toggle").forEach(button => {
          button.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  function initialize() {
    installBranding();
    installNavigation();
    addContactIcons();

    const contactDetails = document.getElementById("contactDetails");

    if (contactDetails) {
      const observer = new MutationObserver(() => {
        addContactIcons();
      });

      observer.observe(contactDetails, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize);
  } else {
    initialize();
  }
})();
