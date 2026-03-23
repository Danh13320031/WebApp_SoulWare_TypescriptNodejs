const permissionUpdateButton = document.getElementById(
  "permission-update-button",
);

if (permissionUpdateButton) {
  permissionUpdateButton.addEventListener("click", async () => {
    const thRoleList = document.querySelectorAll("th[th-role]");
    const inputCheckedList = document.querySelectorAll(
      "input.form-check-input:checked",
    );

    if (!thRoleList || thRoleList.length <= 0) return;
    if (!inputCheckedList || inputCheckedList.length <= 0) {
      showAlert("error", "Vui lòng chọn vai trò quản trị!");
      return;
    }

    let permissionList = [];
    let permissionObj = {
      roleId: "",
      permissions: [],
    };

    thRoleList.forEach((th) => {
      const thId = th.getAttribute("data-id");

      permissionObj.roleId = thId;
      permissionList.push(permissionObj);

      inputCheckedList.forEach((input) => {
        const inputId = input.getAttribute("data-id");
        const inputValue = input.value;

        permissionList.forEach((item) => {
          if (
            item.roleId === inputId &&
            !item.permissions.includes(inputValue)
          ) {
            item.permissions.push(inputValue);
          }
        });
      });

      permissionObj = {
        roleId: "",
        permissions: [],
      };
    });

    const mainTable = document.getElementById("main-table");
    const dataType = mainTable.getAttribute("data-type");

    const apiUrl = `/admin/auth/${dataType}/update`;
    const apiOptions = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(permissionList),
    };

    try {
      const res = await fetch(apiUrl, apiOptions);
      const result = await res.json();

      if (result.status === "Success") {
        showAlert("success", result.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showAlert("error", result.message);
      }
    } catch (error) {
      console.error("Lỗi kết nối::: ", error);
      showAlert("error", "Lỗi kết nối đến máy chủ. Vui lòng thử lại sau!");
    }
  });
}
