const userRoleForm = document.getElementById("user-role-form");

if (userRoleForm) {
  userRoleForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateUserRoleForm()) return;

    const formData = new FormData(userRoleForm);
    const submitBtn = userRoleForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    const loadText = "Đang xử lý...";
    const loadIcon = document.createElement("i");
    loadIcon.classList.add("fa-solid", "fa-spinner", "fa-spin");

    submitBtn.disabled = true;
    submitBtn.innerHTML = loadIcon.outerHTML + " " + loadText;

    const isUpdate = userRoleForm.classList.contains("user-role-update-form");

    const apiUrl = userRoleForm.action;
    const fetchOption = {
      method: isUpdate ? "PATCH" : "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await fetch(apiUrl, fetchOption);
      const result = await res.json();

      if (result.status === "Fail") {
        showAlert(
          "error",
          result.message || "Vui lòng kiểm tra lại thông tin!",
        );
      } else {
        if (isUpdate) {
          showAlert(
            "success",
            result.message || "Cập nhật vai trò người dùng thành công!",
          );
        } else {
          sessionStorage.setItem(
            "flashMessage",
            JSON.stringify({
              type: "success",
              message:
                result.message || "Tạo mới vai trò quản trị viên thành công",
            }),
          );
          window.location.href = "/admin/user-roles";
        }
      }
    } catch (error) {
      console.error("Lỗi kết nối::: ", error);
      showAlert("error", "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau!");
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}
