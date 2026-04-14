const form = document.getElementById("register-form");

const fullNameInput = document.getElementById("fullName");
const fullNameError = document.querySelector(".form-fullName-error");

const emailInput = document.getElementById("email");
const emailError = document.querySelector(".form-email-error");

const passwordInput = document.getElementById("password");
const passwordError = document.querySelector(".form-password-error");

const confirmPasswordInput = document.getElementById("confirmPassword");
const confirmPasswordError = document.querySelector(
  ".form-confirmPassword-error",
);

const phoneInput = document.getElementById("phone");
const phoneError = document.querySelector(".form-phone-error");

const validateRegisterForm = () => {
  let isValid = true;

  fullNameError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";
  phoneError.textContent = "";
  emailError.textContent = "";

  if (fullNameInput.value.trim() === "" || fullNameInput.value.trim() === "") {
    fullNameError.textContent = "Tên người dùng không được để trống";
    isValid = false;
  }

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

  const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

  if (!phoneInput.value) {
    phoneError.textContent = "Số điện thoại không được để trống";
    isValid = false;
  }
  if (phoneInput.value && !phoneRegex.test(phoneInput.value)) {
    phoneError.textContent = "Số điện thoại không hợp lệ";
    isValid = false;
  }

  if (confirmPasswordInput.value.trim() === "") {
    confirmPasswordError.textContent = "Vui lòng xác nhận mật khẩu";
    isValid = false;
  }
  if (
    confirmPasswordInput.value &&
    confirmPasswordInput.value !== passwordInput.value
  ) {
    confirmPasswordError.textContent = "Mật khẩu xác nhận không khớp";
    isValid = false;
  }

  return isValid;
};
