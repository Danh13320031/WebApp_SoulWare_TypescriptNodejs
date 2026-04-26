const avatarInput = document.querySelector("[profile-current-avatar-input]");
const avatarImg = document.querySelector("[profile-avatar-img]");
const avatarError = document.querySelector(".profile-avatar-error");

const emailInput = document.querySelector(".profile-email-input");
const emailError = document.querySelector(".profile-email-error");

const fullNameInput = document.querySelector(".profile-fullName-input");
const fullNameError = document.querySelector(".profile-fullName-error");

const phoneInput = document.querySelector(".profile-phone-input");
const phoneError = document.querySelector(".profile-phone-error");

const passwordInput = document.querySelector(".profile-password-input");
const passwordError = document.querySelector(".profile-password-error");

const confirmPasswordInput = document.querySelector(
  ".profile-confirmPassword-input",
);
const confirmPasswordError = document.querySelector(
  ".profile-confirmPassword-error",
);

let avatarValid =
  avatarImg &&
  avatarImg.getAttribute("src") &&
  avatarImg.getAttribute("src") !== "";

avatarInput.addEventListener("change", function () {
  avatarError.textContent = "";

  const file = avatarInput.files[0];

  // không chọn file mới -> dùng avatar cũ
  if (!file) {
    avatarValid =
      avatarImg &&
      avatarImg.getAttribute("src") &&
      avatarImg.getAttribute("src") !== "";
    return;
  }

  avatarValid = false;

  const img = new Image();
  const objectUrl = URL.createObjectURL(file);

  img.onload = function () {
    if (img.width !== img.height) {
      avatarError.textContent = "Ảnh đại diện phải có tỷ lệ 1:1";
      avatarInput.value = "";
      avatarValid = false;
      URL.revokeObjectURL(objectUrl);
      return;
    }

    avatarValid = true;
    URL.revokeObjectURL(objectUrl);
  };

  img.src = objectUrl;
});

const validateProfileForm = () => {
  let isValid = true;

  // reset error
  avatarError.textContent = "";
  emailError.textContent = "";
  fullNameError.textContent = "";
  phoneError.textContent = "";
  passwordError.textContent = "";
  confirmPasswordError.textContent = "";

  // AVATAR
  const hasOldAvatar =
    avatarImg &&
    avatarImg.getAttribute("src") &&
    avatarImg.getAttribute("src") !== "";

  const hasNewAvatar = avatarInput.files.length > 0;

  if (!hasOldAvatar && !hasNewAvatar) {
    avatarError.textContent = "Vui lòng chọn ảnh đại diện";
    isValid = false;
  } else if (hasNewAvatar && !avatarValid) {
    avatarError.textContent = "Ảnh đại diện phải có tỷ lệ 1:1";
    isValid = false;
  }

  // FULL NAME
  if (fullNameInput.value.trim() === "") {
    fullNameError.textContent = "Họ & tên không được để trống";
    isValid = false;
  }

  // EMAIL
  const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6})$/;

  if (emailInput.value.trim() === "") {
    emailError.textContent = "Email không được để trống";
    isValid = false;
  } else if (!emailRegex.test(emailInput.value)) {
    emailError.textContent = "Email không hợp lệ";
    isValid = false;
  }

  // PHONE
  const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

  if (phoneInput.value.trim() === "") {
    phoneError.textContent = "Số điện thoại không được để trống";
    isValid = false;
  } else if (!phoneRegex.test(phoneInput.value)) {
    phoneError.textContent = "Số điện thoại không hợp lệ";
    isValid = false;
  }

  // PASSWORD
  const passwordRegex =
    /(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=~`|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z])).{8,}/;

  if (passwordInput.value.trim() !== "") {
    if (!passwordRegex.test(passwordInput.value)) {
      passwordError.textContent =
        "Mật khẩu phải có chữ hoa, chữ thường, số, ký tự đặc biệt và ≥ 8 ký tự";
      isValid = false;
    }

    if (confirmPasswordInput.value.trim() === "") {
      confirmPasswordError.textContent = "Vui lòng nhập xác nhận mật khẩu";
      isValid = false;
    } else if (confirmPasswordInput.value !== passwordInput.value) {
      confirmPasswordError.textContent = "Mật khẩu xác nhận không khớp";
      isValid = false;
    }
  }

  return isValid;
};
