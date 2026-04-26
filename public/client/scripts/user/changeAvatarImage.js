// Handle form image
const changeBtn = document.querySelector("[profile-avatar-change]");
const removeBtn = document.querySelector("[profile-avatar-remove]");
const fileInput = document.querySelector("[profile-current-avatar-input]");
const avatarImgTag = document.querySelector("[profile-avatar-img]");
const oldAvatarInput = document.querySelector("[profile-old-avatar-input]");
const initialAvatar = avatarImgTag.src;

changeBtn.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    avatarImgTag.src = event.target.result;
  };
  reader.readAsDataURL(file);
});

removeBtn.addEventListener("click", () => {
  avatarImgTag.src = initialAvatar;
  fileInput.value = "";
  oldAvatarInput.value = "";
});
// End handle form image
