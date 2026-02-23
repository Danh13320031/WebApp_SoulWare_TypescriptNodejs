// Handle toggle sider
const headerButtonMenu = document.querySelector("#header .header-button-menu");
const siderOverlay = document.querySelector("#sider .sider-overlay");

if (headerButtonMenu && siderOverlay) {
  headerButtonMenu.addEventListener("click", () => {
    const siderContent = document.querySelector("#sider .sider-content");

    if (siderContent && siderOverlay) {
      siderContent.classList.toggle("active");
      siderOverlay.classList.toggle("active");
      document.body.classList.toggle("no-scroll");
    }
  });

  siderOverlay.addEventListener("click", () => {
    const siderContent = document.querySelector("#sider .sider-content");

    if (siderContent && siderOverlay) {
      siderContent.classList.remove("active");
      siderOverlay.classList.remove("active");
      document.body.classList.remove("no-scroll");
    }
  });
}
// End handle toggle sider

// Handle form image
const formImagePreview = document.querySelectorAll(
  "div[form-image-preview].form-image-preview",
);

if (formImagePreview && formImagePreview.length > 0) {
  formImagePreview.forEach((item) => {
    const formImageInput = item.querySelector(
      "input[form-image-input].form-image-input",
    );

    if (!formImageInput) return;

    formImageInput.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        item.querySelector("img[form-image-view].form-image-view").src =
          reader.result;
      };
    });
  });
}

const formImageRemove = document.querySelectorAll(
  "button[form-image-remove].form-image-remove",
);

if (formImageRemove && formImageRemove.length > 0) {
  formImageRemove.forEach((item) => {
    item.addEventListener("click", () => {
      item.parentElement.parentElement.querySelector(
        "input[form-image-input].form-image-input",
      ).value = "";
      item.parentElement.parentElement.querySelector(
        "img[form-image-view].form-image-view",
      ).src = "";
    });
  });
}
// End handle form image

// Handle form audio
const formAudioPreview = document.querySelector(
  "div[form-audio-preview].form-audio-preview",
);

if (formAudioPreview) {
  const formAudioInput = formAudioPreview.querySelector(
    "input[form-audio-input].form-audio-input",
  );

  if (formAudioInput) {
    formAudioInput.addEventListener("change", (e) => {
      const file = e.target.files[0];

      if (!file) return;

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        formAudioPreview.querySelector(
          "audio[form-audio-view].form-audio-view",
        ).src = reader.result;
      };
    });
  }
}

const formAudioRemove = document.querySelector(
  "button[form-audio-remove].form-audio-remove",
);

if (formAudioRemove) {
  formAudioRemove.addEventListener("click", () => {
    formAudioPreview.querySelector(
      "input[form-audio-input].form-audio-input",
    ).value = "";
    formAudioPreview.querySelector(
      "audio[form-audio-view].form-audio-view",
    ).src = "";
  });
}
// End handle form audio

// Handle show alert
const globalAlert = document.getElementById("global-alert");
const globalAlertMessage = document.getElementById("global-alert-message");
const globalAlertClose = document.getElementById("global-alert-close");

if (globalAlertClose) {
  globalAlertClose.addEventListener("click", () => {
    globalAlert.classList.add("d-none");
  });
}

let alertTimeout;

const showAlert = (type, message) => {
  if (!globalAlert || !globalAlertMessage) return;

  clearTimeout(alertTimeout);

  if (type === "error") {
    const iconErrorClose = document.createElement("i");
    iconErrorClose.classList.add("fa-solid", "fa-xmark");

    globalAlert.classList.add("error");
    globalAlertMessage.classList.add("error");
    globalAlertClose.className = "button-icon-danger global-alert-close";
    globalAlertClose.innerHTML = iconErrorClose.outerHTML;
  } else {
    const iconSuccessClose = document.createElement("i");
    iconSuccessClose.classList.add("fa-solid", "fa-check");

    globalAlert.classList.add("success");
    globalAlertMessage.classList.add("success");
    globalAlertClose.className = "button-icon-success global-alert-close";
    globalAlertClose.innerHTML = iconSuccessClose.outerHTML;
  }

  globalAlertMessage.innerText = message;
  globalAlert.classList.add("active");

  alertTimeout = setTimeout(() => {
    globalAlert.classList.remove("active");
  }, 3500);
};

const flashData = sessionStorage.getItem("flashMessage");

if (flashData) {
  const { type, message } = JSON.parse(flashData);

  showAlert(type, message);
  sessionStorage.removeItem("flashMessage");
}
// End handle show alert

// Handle show / hide confirm modal
const modalSystem = document.getElementById("modal-system");
const modalOverlay = modalSystem.querySelector(".modal-overlay");
const modalBox = modalSystem.querySelector(".modal-box");
const modalClose = modalSystem.querySelector(".modal-close");
const modalCancel = modalSystem.querySelector(".modal-cancel");
const modalConfirm = modalSystem.querySelector(".modal-confirm");

const modalMessage = modalSystem.querySelector(".modal-message");
const modalTitle = modalSystem.querySelector(".modal-title");

const handleOpenModal = (type, status, title, message) => {
  switch (type) {
    case "alert": {
      modalClose.style.display = "none";
      modalCancel.style.display = "none";
      break;
    }
  }

  switch (status) {
    case "success": {
      modalTitle.style.color = "var(--success-color)";
      modalClose.className = "button-icon-success modal-close";
      modalConfirm.className = "button-success modal-confirm";
      break;
    }

    case "error": {
      modalTitle.style.color = "var(--error-color)";
      modalClose.className = "button-icon-danger modal-close";
      modalConfirm.className = "button-danger modal-confirm";
      break;
    }

    case "warning": {
      modalTitle.style.color = "var(--warning-color)";
      modalClose.className = "button-icon-warning modal-close";
      modalConfirm.className = "button-warning modal-confirm";
      break;
    }

    case "info": {
      modalTitle.style.color = "var(--info-color)";
      modalClose.className = "button-icon-info modal-close";
      modalConfirm.className = "button-info modal-confirm";
      break;
    }

    default: {
      modalTitle.style.color = "var(--text-color)";
      modalClose.className = "button-text modal-close";
      modalConfirm.className = "button-text modal-confirm";
      break;
    }
  }

  modalTitle.innerText = title;
  modalMessage.innerText = message;

  modalSystem.classList.add("active");
  document.body.classList.add("no-scroll");
};

const handleCloseModal = () => {
  modalSystem.classList.remove("active");
  document.body.classList.remove("no-scroll");
};

modalOverlay.addEventListener("click", handleCloseModal);
modalClose.addEventListener("click", handleCloseModal);
modalCancel.addEventListener("click", handleCloseModal);

const handleConfirmModal = (options = {}) =>
  new Promise((resolve, reject) => {
    handleOpenModal(
      options.type,
      options.status,
      options.title,
      options.message,
    );

    const cleanUp = () => {
      handleCloseModal();

      modalConfirm.removeEventListener("click", onConfirm);
      modalClose.removeEventListener("click", onCancel);
      modalCancel.removeEventListener("click", onCancel);
      modalOverlay.removeEventListener("click", outsideClick);
    };

    const onConfirm = () => {
      cleanUp();
      resolve(true);
    };

    const onCancel = () => {
      cleanUp();
      reject(false);
    };

    const outsideClick = (e) => {
      if (e.target === modalSystem) {
        onCancel();
      }
    };

    modalConfirm.addEventListener("click", onConfirm);
    modalCancel.addEventListener("click", onCancel);
    document.addEventListener("click", outsideClick);
  });
// End handle show / hide confirm modal

// Handle soft delete item from db
const buttonDeleteList = document.querySelectorAll(".button-delete");

if (buttonDeleteList && buttonDeleteList.length > 0) {
  buttonDeleteList.forEach((button) => {
    button.addEventListener("click", async () => {
      const ok = await handleConfirmModal({
        type: "confirm",
        status: "error",
        title: "Xoá dữ liệu",
        message: "Bạn có muốn xóa bài hát này không?",
      });

      console.log(ok);

      if (!ok) return;

      const id = button.dataset.id;
      const type = button.dataset.type;

      const apiUrl = `/admin/${type}/soft-delete/${id}`;
      const fetchOptions = { method: "PATCH" };

      const res = await fetch(apiUrl, fetchOptions);
      const result = await res.json();

      if (result.status === "Success") {
        showAlert("success", result.message);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showAlert("error", result.message);
      }
    });
  });
}
// End handle soft delete item from db
