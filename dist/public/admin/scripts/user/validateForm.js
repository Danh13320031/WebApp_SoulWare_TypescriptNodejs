const form = document.getElementById("user-form");

const imageInput = document.getElementById("form-image-input");
const imageError = document.querySelector(".form-image-error");
const imageView = document.querySelector(".form-image-view");

const nameInput = document.getElementById("user-name");
const nameError = document.querySelector(".form-name-error");

const emailInput = document.getElementById("user-email");
const emailError = document.querySelector(".form-email-error");

const passwordInput = document.getElementById("user-password");
const passwordError = document.querySelector(".form-password-error");

const phoneInput = document.getElementById("user-phone");
const phoneError = document.querySelector(".form-phone-error");

const positionInput = document.getElementById("user-position");
const positionError = document.querySelector(".form-position-error");

const statusSelect = document.getElementById("user-status");
const statusError = document.querySelector(".form-status-error");

// const roleSelect = document.getElementById("user-role");
// const roleError = document.querySelector(".form-role-error");

let imageValid = imageView && imageView.getAttribute("src") ? true : false;

imageInput.addEventListener("change", function () {
  imageError.textContent = "";

  const file = imageInput.files[0];
  if (!file) {
    imageValid = imageView && imageView.getAttribute("src") ? true : false;
    return;
  }

  imageValid = false;

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    imageError.textContent = "Chỉ chấp nhận JPG, PNG, WEBP";
    imageInput.value = "";
    return;
  }

  const img = new Image();
  const objectUrl = URL.createObjectURL(file);

  img.onload = function () {
    if (img.width !== img.height) {
      imageError.textContent = "Ảnh phải có tỷ lệ 1:1 (ảnh vuông)";
      imageInput.value = "";
      URL.revokeObjectURL(objectUrl);
      return;
    }

    imageValid = true;
    URL.revokeObjectURL(objectUrl);
  };

  img.src = objectUrl;
});

const validateUserForm = () => {
  let isValid = true;
  const isUpdate = form.classList.contains("user-update-form");

  if (typeof tinymce !== "undefined") tinymce.triggerSave();

  imageError.textContent = "";
  nameError.textContent = "";
  passwordError.textContent = "";
  phoneError.textContent = "";
  positionError.textContent = "";
  emailError.textContent = "";
  statusError.textContent = "";
  // roleError.textContent = "";

  const hasOldImage =
    imageView &&
    imageView.getAttribute("src") &&
    imageView.getAttribute("src") !== "";
  const hasNewImage = imageInput.files.length > 0;

  if (!hasNewImage && !hasOldImage) {
    imageError.textContent = "Vui lòng chọn ảnh đại diện";
    isValid = false;
  } else if (hasNewImage && !imageValid) {
    imageError.textContent = "Ảnh mới không hợp lệ (yêu cầu tỷ lệ 1:1)";
    isValid = false;
  }

  if (nameInput.value.trim() === "") {
    nameError.textContent = "Tên người dùng không được để trống";
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

  if (!isUpdate) {
    if (!passwordInput.value) {
      passwordError.textContent = "Mật khẩu không được để trống";
      isValid = false;
    }
    if (passwordInput.value && !passwordRegex.test(passwordInput.value)) {
      passwordError.textContent =
        "Mật khẩu phải bao gồm cả chữ hoa, chữ thường, số, ký tự đặc biệt và ít nhất 8 ký tự";
      isValid = false;
    }
  } else {
    if (passwordInput.value && !passwordRegex.test(passwordInput.value)) {
      passwordError.textContent =
        "Mật tự phải bao gồm cả chữ hoa, chữ thuong, số, ký tự đặc biệt và ít nhất 8 ký tự";
      isValid = false;
    }
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

  if (positionInput.value && Number(positionInput.value) <= 0) {
    positionError.textContent = "Vị trí phải lớn hơn 0";
    isValid = false;
  }

  if (!statusSelect.value) {
    statusError.textContent = "Vui lòng chọn trạng thái";
    isValid = false;
  }

  // if (!roleSelect.value) {
  //   roleError.textContent = "Vui lòng chọn vai trò";
  //   isValid = false;
  // }

  return isValid;
};
