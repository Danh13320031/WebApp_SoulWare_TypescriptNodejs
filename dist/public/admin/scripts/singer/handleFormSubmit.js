const singerForm = document.getElementById("singer-form");

if (singerForm) {
  singerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateSingerForm()) return;

    const formData = new FormData(singerForm);
    const submitBtn = singerForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    const loadText = "Đang xử lý...";
    const loadIcon = document.createElement("i");
    loadIcon.classList.add("fa-solid", "fa-spinner", "fa-spin");

    submitBtn.disabled = true;
    submitBtn.innerHTML = loadIcon.outerHTML + " " + loadText;

    const isUpdate = singerForm.classList.contains("singer-update-form");

    const apiUrl = singerForm.action;
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
          showAlert("success", result.message || "Cập nhật ca sĩ công!");
        } else {
          sessionStorage.setItem(
            "flashMessage",
            JSON.stringify({
              type: "success",
              message: result.message || "Tạo mới ca sĩ công",
            }),
          );
          window.location.href = "/admin/singers";
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
