const singerGroupForm = document.getElementById("singer-group-form");

if (singerGroupForm) {
  singerGroupForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateSingerGroupForm()) return;

    const formData = new FormData(singerGroupForm);
    const submitBtn = singerGroupForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    const loadText = "Đang xử lý...";
    const loadIcon = document.createElement("i");
    loadIcon.classList.add("fa-solid", "fa-spinner", "fa-spin");

    submitBtn.disabled = true;
    submitBtn.innerHTML = loadIcon.outerHTML + " " + loadText;

    const isUpdate = singerGroupForm.classList.contains(
      "singer-group-update-form",
    );

    const apiUrl = singerGroupForm.action;
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
            result.message || "Cập nhật nhóm ca sĩ thành công!",
          );
        } else {
          sessionStorage.setItem(
            "flashMessage",
            JSON.stringify({
              type: "success",
              message: result.message || "Tạo mới nhóm ca sĩ thành công!",
            }),
          );
          window.location.href = "/admin/singer-groups";
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
