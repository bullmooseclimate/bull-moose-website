
(() => {
  const pageFor = {
    "heat-pumps": "/heat-pumps.html",
    "ducted-ductless": "/heat-pumps.html",
    "installations": "/installation.html",
    "efficiency-maine": "/efficiency-maine.html",
    "maintenance": "/cleaning-maintenance.html"
  };

  const nav = `
    <a href="/">Home</a>
    <div class="bm-nav-group">
      <a href="/heat-pumps.html">Heat Pumps <span>⌄</span></a>
      <div class="bm-dropdown">
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
    <a class="cta" href="/contact.html">Get an estimate</a>
  `;

  function install() {
    const headerNav = document.querySelector(".header nav");

    if (headerNav) {
      headerNav.classList.add("bm-main-nav");
      headerNav.innerHTML = nav;
    }

    const menu = document.querySelector(".menu");

    if (menu && headerNav && !menu.dataset.bmBound) {
      menu.dataset.bmBound = "1";

      menu.addEventListener("click", () => {
        headerNav.classList.toggle("open");

        menu.setAttribute(
          "aria-expanded",
          String(headerNav.classList.contains("open"))
        );
      });
    }

    const slideLink = document.getElementById("slideLink");

    function updateSlideLink() {
      if (!slideLink) return;

      const category =
        window.data?.categories?.[window.activeCategory];

      if (category) {
        slideLink.href =
          pageFor[category.id] || "/contact.html";
      }
    }

    if (slideLink && !slideLink.dataset.bmObserved) {
      slideLink.dataset.bmObserved = "1";

      new MutationObserver(updateSlideLink).observe(
        slideLink,
        {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true
        }
      );

      updateSlideLink();
    }

    const categoryItems =
      document.getElementById("categoryItems");

    if (categoryItems && !categoryItems.dataset.bmObserved) {
      categoryItems.dataset.bmObserved = "1";

      function addPageButton() {
        categoryItems
          .querySelector(".bm-category-page-link")
          ?.remove();

        const category =
          window.data?.categories?.[window.activeCategory];

        if (!category) return;

        const wrapper = document.createElement("div");
        wrapper.className = "bm-category-page-link";

        const link = document.createElement("a");
        link.className = "button";
        link.href = pageFor[category.id] || "/contact.html";
        link.textContent =
          `Explore ${category.label || "this topic"}`;

        wrapper.appendChild(link);
        categoryItems.appendChild(wrapper);
      }

      new MutationObserver(addPageButton).observe(
        categoryItems,
        { childList: true }
      );

      setTimeout(addPageButton, 250);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install);
  } else {
    install();
  }

  setTimeout(install, 300);
})();
