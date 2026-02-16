const headerButtonMenu = document.querySelector("#header .header-button-menu");
const siderOverlay = document.querySelector("#sider .sider-overlay");

if (headerButtonMenu && siderOverlay) {
  headerButtonMenu.addEventListener("click", () => {
    const siderContent = document.querySelector("#sider .sider-content");

    if (siderContent && siderOverlay) {
      siderContent.classList.toggle("active");
      siderOverlay.classList.toggle("active");
      document.body.classList.toggle("no-scroll");
    }
  });

  siderOverlay.addEventListener("click", () => {
    const siderContent = document.querySelector("#sider .sider-content");

    if (siderContent && siderOverlay) {
      siderContent.classList.remove("active");
      siderOverlay.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  });
}
