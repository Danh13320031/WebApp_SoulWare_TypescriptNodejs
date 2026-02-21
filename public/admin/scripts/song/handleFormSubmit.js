const songForm = document.getElementById("song-form");

if (songForm) {
  songForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateSongForm()) return;

    const formData = new FormData(songForm);
    const submitBtn = songForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    const loadText = "Đang xử lý...";
    const loadIcon = document.createElement("i");
    loadIcon.classList.add("fa-solid", "fa-spinner", "fa-spin");

    submitBtn.disabled = true;
    submitBtn.innerHTML = loadIcon.outerHTML + " " + loadText;

    const isUpdate = songForm.classList.contains("song-update-form");

    const apiUrl = songForm.action;
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
            result.message || "Cập nhật bài hát thành công!",
          );
        } else {
          sessionStorage.setItem(
            "flashMessage",
            JSON.stringify({
              type: "success",
              message: "Tạo bài hát thành công!",
            }),
          );
          window.location.href = "/admin/songs";
        }
      }
    } catch (error) {
      console.error("Lỗi kết nối::: ", error);
      showAlert("error", "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau!");
    } finally {
      // 6. Trả lại nút submit như cũ
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}
