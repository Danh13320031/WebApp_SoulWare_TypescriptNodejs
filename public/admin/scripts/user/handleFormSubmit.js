const userForm = document.getElementById("user-form");

if (userForm) {
  userForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateUserForm()) return;

    const formData = new FormData(userForm);
    const submitBtn = userForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    const loadText = "Đang xử lý...";
    const loadIcon = document.createElement("i");
    loadIcon.classList.add("fa-solid", "fa-spinner", "fa-spin");

    submitBtn.disabled = true;
    submitBtn.innerHTML = loadIcon.outerHTML + " " + loadText;

    const isUpdate = userForm.classList.contains("user-update-form");

    const apiUrl = userForm.action;
    const fetchOption = {
      method: isUpdate ? "PATCH" : "POST",
      body: formData,
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
            result.message || "Cập nhật quản trị viên thành công!",
          );
        } else {
          sessionStorage.setItem(
            "flashMessage",
            JSON.stringify({
              type: "success",
              message: result.message || "Tạo mới quản trị viên thành công",
            }),
          );
          window.location.href = "/admin/users";
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
