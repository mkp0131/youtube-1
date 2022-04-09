const fileUploadElements = document.querySelectorAll('.js-file-upload');
const profileForm = document.getElementById('profileForm');

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

let isSubmit = false;
profileForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (isSubmit === false) {
    isSubmit = true;
    profileForm.querySelector('button[type="submit"]').innerHTML =
      '처리중입니다.';
    profileForm.submit();
  }
});
