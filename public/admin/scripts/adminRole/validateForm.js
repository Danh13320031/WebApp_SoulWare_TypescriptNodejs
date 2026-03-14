const form = document.getElementById("admin-role-form");

const nameInput = document.getElementById("admin-role-name");
const nameError = document.querySelector(".form-name-error");

const statusSelect = document.getElementById("admin-role-status");
const statusError = document.querySelector(".form-status-error");

const validateAdminRoleForm = () => {
  let isValid = true;

  if (typeof tinymce !== "undefined") tinymce.triggerSave();

  nameError.textContent = "";
  statusError.textContent = "";

  if (nameInput.value.trim() === "") {
    nameError.textContent = "Tên người dùng không được để trống";
    isValid = false;
  }

  if (!statusSelect.value) {
    statusError.textContent = "Vui lòng chọn trạng thái";
    isValid = false;
  }

  return isValid;
};
