const fileUploadElements = document.querySelectorAll('.js-file-upload');

fileUploadElements.forEach((fileUpload) => {
  const fileInput = fileUpload.querySelector('input[type="file"]');
  fileInput.value = '';
  fileInput.addEventListener('input', function () {
    const fileNameElements = fileUpload.querySelector('.js-file-name');
    const fileName = this.files[0].name;
    fileNameElements.innerText = fileName;
    fileUpload.classList.add('on');
  });
});
