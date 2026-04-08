const toggleNavButton = document.getElementById("nav-mobile-menu-btn");
const navMobileMenuOverlay = document.getElementById("nav-mobile-menu-overlay");

if (toggleNavButton) {
  toggleNavButton.addEventListener("click", () => {
    const navMobileMenuList = document.getElementById("nav-mobile-menu-box");
    const body = document.body;

    if (navMobileMenuList.classList.contains("active")) {
      navMobileMenuList.classList.remove("active");
      navMobileMenuOverlay.classList.remove("active");
      body.classList.remove("no-scroll");
    } else {
      navMobileMenuList.classList.add("active");
      navMobileMenuOverlay.classList.add("active");
      body.classList.add("no-scroll");
    }
  });
}

if (navMobileMenuOverlay) {
  navMobileMenuOverlay.addEventListener("click", () => {
    const navMobileMenuList = document.getElementById("nav-mobile-menu-box");
    const body = document.body;

    navMobileMenuList.classList.remove("active");
    navMobileMenuOverlay.classList.remove("active");
    body.classList.remove("no-scroll");
  });
}
