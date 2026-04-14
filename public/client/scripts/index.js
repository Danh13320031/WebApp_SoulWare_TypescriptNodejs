// Handle toggle mobile menu
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
// End handle toggle mobile menu

// Handle show password
const buttonShowPasswordList = document.querySelectorAll(
  ".button-show-password",
);

if (buttonShowPasswordList && buttonShowPasswordList.length > 0) {
  buttonShowPasswordList.forEach((button) => {
    button.addEventListener("click", () => {
      const inputPassword = document.querySelector("input.form-password-input");
      const inputConfirmPassword = document.querySelector(
        "input.form-confirm-password-input",
      );
      const iconShowPasswordList = document.querySelectorAll(
        ".icon-show-password",
      );
      const iconHidePasswordList = document.querySelectorAll(
        ".icon-hide-password",
      );

      if (
        !inputPassword ||
        !inputConfirmPassword ||
        !iconShowPasswordList ||
        !iconHidePasswordList
      )
        return;

      if (inputPassword.type === "password") {
        inputPassword.type = "text";
        inputConfirmPassword.type = "text";
        iconShowPasswordList.forEach((icon) => icon.classList.remove("d-none"));
        iconHidePasswordList.forEach((icon) => icon.classList.add("d-none"));
      } else {
        inputPassword.type = "password";
        inputConfirmPassword.type = "password";
        iconShowPasswordList.forEach((icon) => icon.classList.add("d-none"));
        iconHidePasswordList.forEach((icon) => icon.classList.remove("d-none"));
      }
    });
  });
}
// End handle show password
