const form = document.getElementById("user-role-form");

const nameInput = document.getElementById("user-role-name");
const nameError = document.querySelector(".form-name-error");

const statusSelect = document.getElementById("user-role-status");
const statusError = document.querySelector(".form-status-error");

const validateUserRoleForm = () => {
  let isValid = true;

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
