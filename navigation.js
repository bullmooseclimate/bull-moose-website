
(() => {
  const pageFor = {
    "#heat-pumps": "/heat-pumps.html",
    "#ducted-ductless": "/heat-pumps.html",
    "#installations": "/installation.html",
    "https://www.efficiencymaine.com/": "/efficiency-maine.html",
    "#maintenance": "/cleaning-maintenance.html"
  };

  const navigation = `
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

  function getDestination() {
    const slideLink = document.getElementById("slideLink");
    if (!slideLink) return "/contact.html";

    const originalLink = slideLink.getAttribute("href") || "";

    return pageFor[originalLink] || "/contact.html";
  }

  function updateExploreLink() {
    const categoryItems = document.getElementById("categoryItems");
    const slideLink = document.getElementById("slideLink");

    if (!categoryItems || !slideLink) return;

    const destination = getDestination();
    const label = slideLink.textContent.trim();

    let explore = categoryItems.querySelector(".bm-category-page-link");

    if (!explore) {
      explore = document.createElement("div");
      explore.className = "bm-category-page-link";

      const link = document.createElement("a");
      link.className = "button";

      explore.appendChild(link);
      categoryItems.appendChild(explore);
    }

    const link = explore.querySelector("a");

    const topic = {
      "/heat-pumps.html": "Heat Pumps",
      "/installation.html": "Installation",
      "/efficiency-maine.html": "Efficiency Maine",
      "/cleaning-maintenance.html": "Cleaning & Maintenance"
    };

    link.href = destination;
    link.textContent = `Explore ${topic[destination] || label || "this topic"}`;
  }

  function install() {
    const headerNav = document.querySelector(".header nav");

    if (headerNav && !headerNav.dataset.bmInstalled) {
      headerNav.innerHTML = navigation;
      headerNav.classList.add("bm-main-nav");
      headerNav.dataset.bmInstalled = "true";
    }

    const slideLink = document.getElementById("slideLink");
    const categoryItems = document.getElementById("categoryItems");

    if (slideLink && !slideLink.dataset.bmObserved) {
      slideLink.dataset.bmObserved = "true";

      new MutationObserver(updateExploreLink).observe(slideLink, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true
      });
    }

    if (categoryItems && !categoryItems.dataset.bmObserved) {
      categoryItems.dataset.bmObserved = "true";

      new MutationObserver(updateExploreLink).observe(categoryItems, {
        childList: true
      });
    }

    updateExploreLink();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", install);
  } else {
    install();
  }
})();

