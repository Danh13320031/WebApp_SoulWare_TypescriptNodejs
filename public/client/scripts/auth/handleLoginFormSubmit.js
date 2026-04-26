const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    const formData = new FormData(loginForm);
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    console.log(submitBtn);
    const originalBtnText = submitBtn.innerHTML;

    const loadText = "Đang xử lý...";
    const loadIcon = document.createElement("i");
    loadIcon.classList.add("fa-solid", "fa-spinner", "fa-spin");

    submitBtn.disabled = true;
    submitBtn.innerHTML = loadIcon.outerHTML + " " + loadText;

    const apiUrl = loginForm.action;
    const fetchOption = {
      method: "POST",
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
        return;
      } else {
        sessionStorage.setItem(
          "flashMessage",
          JSON.stringify({
            type: "success",
            message: result.message || "Đăng nhập thành công!",
          }),
        );
        window.location.href = "/topics";
      }
    } catch (error) {
      console.error("Lỗi kết nối::: ", error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}
