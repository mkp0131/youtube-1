const displayNameInput = document.getElementById('displayNameInput');
const photoInput = document.getElementById('photoInput');
const photoImg = document.getElementById('photoImg');
const profileForm = document.getElementById('profileForm');

// 새로고침 초기화
photoInput.value = '';
displayNameInput.value = displayNameInput.dataset.value;

displayNameInput.addEventListener('keydown', function (event) {
  if (event.keyCode === 13) {
    this.blur();
  }

  const txt = this.value;
  if (txt.length > 10 && event.keyCode !== 8) {
    event.preventDefault();
  }
});

photoInput.addEventListener('change', (event) => {
  const {
    target: { files },
  } = event;

  if (!files) return;

  const maxSize = 3000000; //파일 맥스 사이즈 7MB
  if (files[0].size >= maxSize) {
    alert('7메가 이상의 파일은 업로드가 불가합니다.');
    return;
  }

  var fileReader = new FileReader();
  fileReader.readAsDataURL(files[0]);
  fileReader.onload = async (event) => {
    // 데이터 url
    const file = event.target.result;
    photoImg.src = file;
  };
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
