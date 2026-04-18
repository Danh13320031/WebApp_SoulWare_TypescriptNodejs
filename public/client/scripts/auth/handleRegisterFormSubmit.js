const registerForm = document.getElementById("register-form");

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateRegisterForm()) return;

    const formData = new FormData(registerForm);
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    console.log(submitBtn);
    const originalBtnText = submitBtn.innerHTML;

    const loadText = "Đang xử lý...";
    const loadIcon = document.createElement("i");
    loadIcon.classList.add("fa-solid", "fa-spinner", "fa-spin");

    submitBtn.disabled = true;
    submitBtn.innerHTML = loadIcon.outerHTML + " " + loadText;

    console.log(JSON.stringify(Object.fromEntries(formData)));

    const apiUrl = registerForm.action;
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
        return;
      } else {
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
