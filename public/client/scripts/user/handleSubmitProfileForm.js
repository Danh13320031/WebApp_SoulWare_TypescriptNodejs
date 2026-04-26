const profileForm = document.querySelector(".profile-form");

if (profileForm) {
  profileForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // validate
    if (!validateProfileForm()) return;

    const formData = new FormData(profileForm);
    const submitBtn = profileForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    const loadText = "Đang xử lý...";
    const loadIcon = document.createElement("i");
    loadIcon.classList.add("fa-solid", "fa-spinner", "fa-spin");

    submitBtn.disabled = true;
    submitBtn.innerHTML = loadIcon.outerHTML + " " + loadText;

    const apiUrl = profileForm.action;

    const fetchOption = {
      method: "PATCH",
      body: formData,
    };

    try {
      const res = await fetch(apiUrl, fetchOption);
      const result = await res.json();

      if (result.status === "Fail") {
        showAlert("error", result.message || "Cập nhật thất bại!");
        return;
      } else {
        showAlert("success", result.message || "Cập nhật thành công!");
        form.reset();
        return;
      }
    } catch (error) {
      console.error("Lỗi kết nối::: ", error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}
