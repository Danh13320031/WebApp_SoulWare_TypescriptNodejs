const statusSelectList = document.querySelectorAll(
  "select[status-select].status-select",
);

if (statusSelectList && statusSelectList.length > 0) {
  console.log(statusSelectList);
  statusSelectList.forEach((select) => {
    select.addEventListener("change", async (e) => {
      console.log(e.target);
      const id = e.target.getAttribute("data-id");
      const selectValue = e.target.value;
      console.log(selectValue);
      const apiUrl = `/admin/songs/change-status/${id}/${selectValue}`;
      const fetchOptions = { method: "PATCH" };

      const res = await fetch(apiUrl, fetchOptions);
      const result = await res.json();

      if (result.status === "Success") {
        showAlert("success", result.message);
        setTimeout(() => {
          location.reload();
        }, 1000);
        return;
      } else {
        showAlert("error", result.message);
        return;
      }
    });
  });
}
