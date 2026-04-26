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

// Handle show alert
const globalAlert = document.getElementById("global-alert");
const globalAlertMessage = document.getElementById("global-alert-message");
const globalAlertClose = document.getElementById("global-alert-close");

if (globalAlertClose) {
  globalAlertClose.addEventListener("click", () => {
    globalAlert.classList.add("d-none");
  });
}

let alertTimeout;

const showAlert = (type, message) => {
  if (!globalAlert || !globalAlertMessage) return;

  clearTimeout(alertTimeout);

  if (type === "error") {
    const iconErrorClose = document.createElement("i");
    iconErrorClose.classList.add("fa-solid", "fa-xmark");

    globalAlert.classList.add("error");
    globalAlertMessage.classList.add("error");
    globalAlertClose.className = "button-danger global-alert-close";
    globalAlertClose.innerHTML = iconErrorClose.outerHTML;
  } else {
    const iconSuccessClose = document.createElement("i");
    iconSuccessClose.classList.add("fa-solid", "fa-check");

    globalAlert.classList.add("success");
    globalAlertMessage.classList.add("success");
    globalAlertClose.className = "button-success global-alert-close";
    globalAlertClose.innerHTML = iconSuccessClose.outerHTML;
  }

  globalAlertMessage.innerText = message;
  globalAlert.classList.add("active");

  alertTimeout = setTimeout(() => {
    globalAlert.classList.remove("active");
  }, 3500);
};

const flashData = sessionStorage.getItem("flashMessage");

if (flashData) {
  const { type, message } = JSON.parse(flashData);

  showAlert(type, message);
  sessionStorage.removeItem("flashMessage");
}
// End handle show alert

// Handle show password
const buttonShowPasswordList = document.querySelectorAll(
  ".button-show-password",
);

if (buttonShowPasswordList && buttonShowPasswordList.length > 0) {
  buttonShowPasswordList.forEach((button) => {
    button.addEventListener("click", () => {
      const inputPassword = document.querySelector("input.form-password-input");
      const inputConfirmPassword = document.querySelector(
        "input.form-confirmPassword-input",
      );
      const iconShowPasswordList = document.querySelectorAll(
        ".icon-show-password",
      );
      const iconHidePasswordList = document.querySelectorAll(
        ".icon-hide-password",
      );

      if (!inputConfirmPassword) {
        if (inputPassword.type === "password") {
          inputPassword.type = "text";
          iconShowPasswordList.forEach((icon) =>
            icon.classList.remove("d-none"),
          );
          iconHidePasswordList.forEach((icon) => icon.classList.add("d-none"));
        } else {
          inputPassword.type = "password";
          iconShowPasswordList.forEach((icon) => icon.classList.add("d-none"));
          iconHidePasswordList.forEach((icon) =>
            icon.classList.remove("d-none"),
          );
        }
      } else {
        if (inputPassword.type === "password") {
          inputPassword.type = "text";
          inputConfirmPassword.type = "text";
          iconShowPasswordList.forEach((icon) =>
            icon.classList.remove("d-none"),
          );
          iconHidePasswordList.forEach((icon) => icon.classList.add("d-none"));
        } else {
          inputPassword.type = "password";
          inputConfirmPassword.type = "password";
          iconShowPasswordList.forEach((icon) => icon.classList.add("d-none"));
          iconHidePasswordList.forEach((icon) =>
            icon.classList.remove("d-none"),
          );
        }
      }
    });
  });
}
// End handle show password
