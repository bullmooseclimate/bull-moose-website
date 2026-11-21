
(() => {
  const menu = `
    <a href="/">Home</a>

    <div class="bm-nav-group">
      <div class="bm-nav-line">
        <a href="/heat-pumps.html">Heat Pumps</a>
        <button class="bm-submenu-toggle" type="button"
          aria-label="Open Heat Pumps submenu" aria-expanded="false">⌄</button>
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
    <a class="cta" href="/contact.html">Get an Estimate</a>
  `;

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

        const group = button.closest(".bm-nav-group");
        const dropdown = group.querySelector(".bm-dropdown");
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
        nav.querySelectorAll(".bm-submenu-toggle").forEach(item => {
          item.setAttribute("aria-expanded", "false");
        });
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installNavigation);
  } else {
    installNavigation();
  }
})();

