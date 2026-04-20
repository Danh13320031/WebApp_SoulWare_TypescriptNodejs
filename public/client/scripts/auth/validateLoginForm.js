const form = document.getElementById("login-form");

const emailInput = document.getElementById("email");
const emailError = document.querySelector(".form-email-error");

const passwordInput = document.getElementById("password");
const passwordError = document.querySelector(".form-password-error");

const validateLoginForm = () => {
  let isValid = true;

  emailError.textContent = "";
  passwordError.textContent = "";

  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})*$/;

  if (emailInput.value.trim() === "") {
    emailError.textContent = "Địa chỉ email không được để trống";
    isValid = false;
  }
  if (emailInput.value && !emailRegex.test(emailInput.value)) {
    emailError.textContent = "Địa chỉ email không hợp lệ";
    isValid = false;
  }

  const passwordRegex =
    /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;

  if (!passwordInput.value) {
    passwordError.textContent = "Mật khẩu không được để trống";
    isValid = false;
  }
  if (passwordInput.value && !passwordRegex.test(passwordInput.value)) {
    passwordError.textContent =
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    isValid = false;
  }

  return isValid;
};
