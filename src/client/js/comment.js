const commentForm = document.getElementById('commentForm');
const commentList = document.getElementById('commentList');
const commentListFirstLi = commentList.querySelector('li');
const commentContainers = document.querySelectorAll('.js-comment');
const btnDeletes = document.querySelectorAll('.js-btn-delete');

commentForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const input = event.target.querySelector('input[name="comment"]');
  const comment = input.value;
  if (!comment) return;
  const displayName = event.target.querySelector(
    'input[name="displayName"]'
  ).value;
  const photoUrl = event.target.querySelector('input[name="photoUrl"]').value;
  const videoId = event.target.querySelector('input[name="videoId"]').value;

  input.value = '';

  await fetch(`/api/video/${videoId}/comment/write`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      comment,
      videoId,
    }),
  });

  const li = document.createElement('li');
  li.className = 'comment';
  li.innerHTML = `
    <div class="comment-creator-photo">
      <img src='${photoUrl}'>
    </div>
    <div class="comment-txt-container">
      <div class="comment-creator-name">
        ${displayName}
        <div class="comment-createdat">
          방금전
        </div>
      </div>
      <div class="comment-txt">
        ${comment}
      </div>
    </div>
  `;
  if (commentListFirstLi.classList.contains('no-list')) {
    commentList.innerHTML = '';
  }
  commentList.prepend(li);
});

commentContainers.forEach((comment) => {
  const commentId = comment.dataset.commentId;
  const videoId = comment.dataset.videoId;
  const btnDelete = comment.querySelector('.js-btn-delete');

  btnDelete.addEventListener('click', async () => {
    commentList.innerHTML = '<div style="opacity: .5;">삭제 되었습니다.</div>';

    await fetch(`/api/video/${videoId}/comment/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commentId,
        videoId,
      }),
    });
  });
});

// btnDelete.addEventListener('click', () => {
//   alert(1);
// });
