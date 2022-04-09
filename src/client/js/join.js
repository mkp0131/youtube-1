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
