const form = document.getElementById("singer-group-form");

const imageInput = document.getElementById("form-image-input");
const imageError = document.querySelector(".form-image-error");
const imageView = document.querySelector(".form-image-view");

const nameInput = document.getElementById("singer-group-name");
const nameError = document.querySelector(".form-name-error");

const positionInput = document.getElementById("singer-group-position");
const positionError = document.querySelector(".form-position-error");

const statusSelect = document.getElementById("singer-group-status");
const statusError = document.querySelector(".form-status-error");

const memberError = document.querySelector(".form-member-error");

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

const validateSingerGroupForm = () => {
  let isValid = true;

  if (typeof tinymce !== "undefined") tinymce.triggerSave();

  imageError.textContent = "";
  nameError.textContent = "";
  positionError.textContent = "";
  statusError.textContent = "";

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

  if (positionInput.value && Number(positionInput.value) <= 0) {
    positionError.textContent = "Vị trí phải lớn hơn 0";
    isValid = false;
  }

  if (!statusSelect.value) {
    statusError.textContent = "Vui lòng chọn trạng thái";
    isValid = false;
  }

  const tomSelectItemList = document.querySelectorAll(
    ".ts-wrapper .ts-control .item",
  );
  if (tomSelectItemList.length <= 0) {
    memberError.textContent = "Vui lòng chọn thành viên cho nhóm";
    isValid = false;
  } else {
    if (tomSelectItemList.length <= 1) {
      memberError.textContent = "Nhóm cần có ít nhất 2 thành viên";
      isValid = false;
    }
  }

  return isValid;
};
