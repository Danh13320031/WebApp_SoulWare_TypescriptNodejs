const uploadImage = (blobInfo, progress) =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open("POST", "/admin/upload");
    xhr.upload.onprogress = (e) => {
      progress(e.loaded / e.total);
    };
    xhr.onload = () => {
      const json = JSON.parse(xhr.responseText);
      if (json.status === "Fail") {
        reject(json.message);
        return;
      }
      resolve(json.data.location);
    };

    const formData = new FormData();

    formData.append("file", blobInfo.blob(), blobInfo.filename());
    xhr.send(formData);
  });

tinymce.init({
  license_key: "gpl",
  selector: ".tinymce-editor",
  plugins: "link lists table image code",
  toolbar:
    "undo redo | bold italic underline | bullist numlist | link image | code",
  branding: false,
  image_uploadtab: true,
  automatic_uploads: true,
  images_upload_handler: uploadImage,
});
