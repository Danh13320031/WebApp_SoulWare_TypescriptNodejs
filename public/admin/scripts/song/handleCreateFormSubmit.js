const formCreateSong = document.getElementById("song-create-form");

if (formCreateSong) {
  formCreateSong.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (typeof tinymce !== "undefined") tinymce.triggerSave();

    const formData = new FormData(formCreateSong);
    const submitBtn = formCreateSong.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    const loadText = "Đang xử lý...";
    const loadIcon = document.createElement("i");

    loadIcon.classList.add("fa-solid", "fa-spinner", "fa-spin");
    submitBtn.disabled = true;
    submitBtn.innerHTML = loadIcon.outerHTML + " " + loadText;

    const apiUrl = formCreateSong.action;
    const fetchOption = {
      method: "POST",
      body: formData,
    };

    try {
      const res = await fetch(apiUrl, fetchOption);
      const result = await res.json();

      if (!res.ok || result.status === "Fail")
        showAlert(
          "error",
          result.message || "Vui lòng kiểm tra lại thông tin!",
        );
      else {
        sessionStorage.setItem(
          "flashMessage",
          JSON.stringify({
            type: "success",
            message: "Tạo bài hát thành công!",
          }),
        );
        window.location.href = "/admin/songs";
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
