const form = document.getElementById("song-create-form");

const imageInput = document.getElementById("form-image-input");
const imageError = document.querySelector(".form-image-error");

const audioInput = document.getElementById("form-audio-input");
const audioError = document.querySelector(".form-audio-error");

const titleInput = document.getElementById("song-create-title");
const titleError = document.querySelector(".form-title-error");

const singerSelect = document.getElementById("song-singer");
const singerError = document.querySelector(".form-singer-error");

const topicSelect = document.getElementById("song-topic");
const topicError = document.querySelector(".form-topic-error");

const positionInput = document.getElementById("song-position");
const positionError = document.querySelector(".form-position-error");

const lyricsInput = document.getElementById("song-lyrics");
const lyricsError = document.querySelector(".form-lyrics-error");

const statusSelect = document.getElementById("song-status");
const statusError = document.querySelector(".form-status-error");

let imageValid = false;

imageInput.addEventListener("change", function () {
  imageValid = false;
  imageError.textContent = "";

  const file = imageInput.files[0];
  if (!file) {
    imageError.textContent = "Vui lòng chọn ảnh";
    return;
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    imageError.textContent = "Chỉ chấp nhận JPG, PNG, WEBP";
    imageInput.value = "";
    return;
  }

  const img = new Image();
  const objectUrl = URL.createObjectURL(file);

  img.onload = function () {
    if (img.width !== img.height) {
      imageError.textContent = "Ảnh phải có tỷ lệ 1:1 (ảnh vuông)";
      imageInput.value = "";
      URL.revokeObjectURL(objectUrl);
      return;
    }

    imageValid = true;
    URL.revokeObjectURL(objectUrl);
  };

  img.src = objectUrl;
});

form.addEventListener("submit", (e) => {
  let isValid = true;

  imageError.textContent = "";
  audioError.textContent = "";
  titleError.textContent = "";
  singerError.textContent = "";
  topicError.textContent = "";
  positionError.textContent = "";
  lyricsError.textContent = "";
  statusError.textContent = "";

  if (!imageInput.files.length || !imageValid) {
    imageError.textContent = "Ảnh hợp lệ là bắt buộc (tỷ lệ 1:1)";
    isValid = false;
  }

  if (!audioInput.files.length) {
    audioError.textContent = "Vui lòng chọn tệp âm thanh";
    isValid = false;
  }

  if (titleInput.value.trim() === "") {
    titleError.textContent = "Tên bài hát không được để trống";
    isValid = false;
  }

  if (!singerSelect.value) {
    singerError.textContent = "Vui lòng chọn nghệ sĩ";
    isValid = false;
  }

  if (!topicSelect.value) {
    topicError.textContent = "Vui lòng chọn chủ đề";
    isValid = false;
  }

  if (positionInput.value && Number(positionInput.value) <= 0) {
    positionError.textContent = "Vị trí phải lớn hơn 0";
    isValid = false;
  }

  if (lyricsInput.value.trim() === "") {
    lyricsError.textContent = "Lời bài hát không được để trống";
    isValid = false;
  }

  if (!statusSelect.value) {
    statusError.textContent = "Vui lòng chọn trạng thái";
    isValid = false;
  }

  if (!isValid) {
    e.preventDefault();
  }
});
