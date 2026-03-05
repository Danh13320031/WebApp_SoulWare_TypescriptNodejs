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

const table = document.querySelector(".main-table");
let type;

if (table) type = table.dataset.type;

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

// Handle change status
const statusSelectList = document.querySelectorAll(
  "select[status-select].status-select",
);

if (statusSelectList && statusSelectList.length > 0) {
  console.log(statusSelectList);
  statusSelectList.forEach((select) => {
    select.addEventListener("change", async (e) => {
      console.log(e.target);
      const id = e.target.getAttribute("data-id");
      let selectValue = e.target.value;
      console.log(selectValue);
      const apiUrl = `/admin/${type}/change-status/${id}/${selectValue}`;
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
// End handle change status

// Handle pagination
const paginationBox = document.getElementById("main-pagination-box");

if (paginationBox) {
  const url = new URL(window.location.href);
  const limit = url.searchParams.get("limit") || 10;

  const paginationLinkNum = paginationBox.querySelectorAll(
    ".main-pagination-number",
  );
  const paginationLinkPrev = paginationBox.querySelector(
    ".main-pagination-prev",
  );
  const paginationLinkNext = paginationBox.querySelector(
    ".main-pagination-next",
  );

  if (paginationLinkNum && paginationLinkNum.length > 0) {
    paginationLinkNum.forEach((link) => {
      link.addEventListener("click", (e) => {
        const page = e.target.getAttribute("data-page");

        url.searchParams.set("type", type);
        url.searchParams.set("page", page);
        url.searchParams.set("limit", limit);

        window.location.href = url.href;
      });
    });
  }

  if (paginationLinkPrev) {
    paginationLinkPrev.addEventListener("click", async (e) => {
      const page = e.target.getAttribute("data-page");

      url.searchParams.set("type", type);
      url.searchParams.set("page", page);
      url.searchParams.set("limit", limit);

      window.location.href = url.href;
    });
  }

  if (paginationLinkNext) {
    console.log(paginationLinkNext);
    paginationLinkNext.addEventListener("click", async (e) => {
      const page = e.target.getAttribute("data-page");
      console.log(page);

      url.searchParams.set("type", type);
      url.searchParams.set("page", page);
      url.searchParams.set("limit", limit);

      window.location.href = url.href;
    });
  }
}
// End handle pagination

// Handle search filter
const mainSearchForm = document.getElementById("main-search-form");

if (mainSearchForm) {
  const url = new URL(window.location.href);
  const mainSearchInput = document.getElementById("main-search-input");
  const mainSearchReset = document.getElementById("main-search-reset");

  if (mainSearchInput.value) mainSearchReset.classList.remove("d-none");
  else mainSearchReset.classList.add("d-none");

  mainSearchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = document.getElementById("main-search-input").value;

    url.searchParams.set("keyword", keyword);
    window.location.href = url.href;
  });

  mainSearchInput.addEventListener("input", (e) => {
    if (e.target.value) mainSearchReset.classList.remove("d-none");
    else mainSearchReset.classList.add("d-none");
  });

  mainSearchReset.addEventListener("click", () => {
    if (url.searchParams.get("keyword")) {
      url.searchParams.delete("keyword");
      window.location.href = url.href;
    } else {
      mainSearchInput.value = "";
      mainSearchReset.classList.add("d-none");
    }
  });
}
// End handle search filter

// Handle status filter
const mainCardFilterStatus = document.getElementById("main-card-filter-status");

if (mainCardFilterStatus) {
  const url = new URL(window.location.href);
  const mainCardStatusSelect = mainCardFilterStatus.querySelector(
    ".main-card-status-select",
  );

  if (url && mainCardStatusSelect) {
    mainCardStatusSelect.addEventListener("change", (e) => {
      const status = e.target.value;

      if (url.searchParams.get("status") === "all") {
        url.searchParams.delete("status");
      } else {
        url.searchParams.set("status", status);
      }

      window.location.href = url.href;
    });
  }
}
// End handle status filter

// Handle singer filter
const mainCardFilterSinger = document.getElementById("main-card-filter-singer");

if (mainCardFilterSinger) {
  const url = new URL(window.location.href);
  const mainCardSingerSelect = mainCardFilterSinger.querySelector(
    ".main-card-singer-select",
  );

  if (url && mainCardSingerSelect) {
    mainCardSingerSelect.addEventListener("change", (e) => {
      const singer = e.target.value;

      if (url.searchParams.get("singer") === "all") {
        url.searchParams.delete("singer");
      } else {
        url.searchParams.set("singer", singer);
      }

      window.location.href = url.href;
    });
  }
}
// End handle singer filter

// Handle topic filter
const mainCardFilterTopic = document.getElementById("main-card-filter-topic");

if (mainCardFilterTopic) {
  const url = new URL(window.location.href);
  const mainCardTopicSelect = mainCardFilterTopic.querySelector(
    ".main-card-topic-select",
  );

  if (url && mainCardTopicSelect) {
    mainCardTopicSelect.addEventListener("change", (e) => {
      const topic = e.target.value;

      if (url.searchParams.get("topic") === "all") {
        url.searchParams.delete("topic");
      } else {
        url.searchParams.set("topic", topic);
      }

      window.location.href = url.href;
    });
  }
}
// End handle topic filter

// Handle sort filter
const mainCardFilterSort = document.getElementById("main-card-filter-sort");

if (mainCardFilterSort) {
  const url = new URL(window.location.href);
  const mainCardSortSelect = mainCardFilterSort.querySelector(
    ".main-card-sort-select",
  );

  if (url && mainCardSortSelect) {
    mainCardSortSelect.addEventListener("change", (e) => {
      const sort = e.target.value;

      url.searchParams.set("sort", sort);
      window.location.href = url.href;
    });
  }
}
// End handle sort filter
