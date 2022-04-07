const video = document.getElementById('video');
const btnFullscreen = document.getElementById('btnFullsreen');
const btnFullscreenIcon = btnFullscreen.querySelector('i');
const videoContainer = document.getElementById('videoContainer');
const btnMute = document.getElementById('btnMute');
const btnMuteIcon = btnMute.querySelector('i');
const videoVolume = document.getElementById('videoVolume');
const btnPlay = document.getElementById('btnPlay');
const btnPlayIcon = btnPlay.querySelector('i');
const playDuration = document.getElementById('playDuration');
const playTime = document.getElementById('playTime');
const playBar = document.getElementById('playBar');
const videoControls = document.getElementById('videoControls');
const videoPlayIcon = document.getElementById('videoPlayIcon');
const videoPlayIconFont = videoPlayIcon.querySelector('i');

// 풀스크린 START
const changeFullscreenIcon = () => {
  // fullscreen 모드일 경우
  if (document.fullscreenElement) {
    btnFullscreenIcon.classList.remove('fa-expand');
    btnFullscreenIcon.classList.add('fa-compress');
  }
  // fullscreen 모드가 아닐경우
  else {
    btnFullscreenIcon.classList.remove('fa-compress');
    btnFullscreenIcon.classList.add('fa-expand');
  }
};

btnFullscreen.addEventListener('click', () => {
  // fullscreen 모드일 경우
  if (document.fullscreenElement) {
    document.exitFullscreen();
  }
  // fullscreen 모드가 아닐경우
  else {
    videoContainer.requestFullscreen();
  }
});

document.addEventListener('fullscreenchange', changeFullscreenIcon);
// 풀스크린 END

// 볼륨컨트롤 START
let volume = 1;
btnMute.addEventListener('click', () => {
  // 이미 뮤트상태라면
  if (video.muted) {
    btnMuteIcon.classList.remove('fa-volume-xmark');
    btnMuteIcon.classList.add('fa-volume-high');
    video.muted = false;
    videoVolume.value = volume;
  }
  // 뮤트가 아닌 상태
  else {
    btnMuteIcon.classList.remove('fa-volume-high');
    btnMuteIcon.classList.add('fa-volume-xmark');
    video.muted = true;
    videoVolume.value = 0;
  }
});

videoVolume.addEventListener('input', (event) => {
  const value = event.target.value;
  volume = value;
  video.volume = volume;
});
// 볼륨컨트롤 END

// 재생 START
const fadePlayIcon = () => {
  // 재생중이 아니라면
  if (video.paused) {
    videoPlayIconFont.classList.remove('fa-circle-play');
    videoPlayIconFont.classList.add('fa-circle-pause');
    videoPlayIcon.classList.add('on');
    setTimeout(() => {
      videoPlayIcon.classList.remove('on');
    }, 500);
  }
  // 재생중 이라면
  else {
    videoPlayIconFont.classList.remove('fa-circle-pause');
    videoPlayIconFont.classList.add('fa-circle-play');
    videoPlayIcon.classList.add('on');
    setTimeout(() => {
      videoPlayIcon.classList.remove('on');
    }, 500);
  }
};

const changeBtnPlayIcon = () => {
  // 재생중이 아니라면
  if (video.paused) {
    btnPlayIcon.classList.remove('fa-pause');
    btnPlayIcon.classList.add('fa-play');
  }
  // 재생중 이라면
  else {
    btnPlayIcon.classList.remove('fa-play');
    btnPlayIcon.classList.add('fa-pause');
  }
};

const playIconHandle = () => {
  changeBtnPlayIcon();
  fadePlayIcon();
  videoControlFade();
};

btnPlay.addEventListener('click', () => {
  // 재생중이 아니라면
  if (video.paused) {
    video.play();
  }
  // 재생중 이라면
  else {
    video.pause();
  }
});
video.addEventListener('click', () => {
  // 재생중이 아니라면
  if (video.paused) {
    video.play();
  }
  // 재생중 이라면
  else {
    video.pause();
  }
});

video.addEventListener('play', playIconHandle);
video.addEventListener('pause', playIconHandle);
// 재생 END

// 재생시간 START
video.addEventListener('timeupdate', () => {
  const currentTime = Math.floor(video.currentTime);
  playTime.innerText = makeTimeFormat(currentTime);
  playBar.value = currentTime;
});

// 재생바 START
playBar.addEventListener('input', (event) => {
  const value = event.target.value;
  video.currentTime = value;
});
// 재생바 END

// 컨트롤바 FADE START
let videoControlFadeTimer;
const videoControlFade = () => {
  clearInterval(videoControlFadeTimer);
  videoControls.style.opacity = 1;
  videoControlFadeTimer = setTimeout(() => {
    videoControls.style.opacity = 0;
  }, 2000);
};
videoContainer.addEventListener('mouseleave', () => {
  videoControlFade();
});
videoContainer.addEventListener('mousemove', (event) => {
  videoControlFade();
});
// 컨트롤바 FADE END

// 시작시 세팅 START
const makeTimeFormat = (time) => {
  return new Date(time * 1000).toISOString().substring(14, 19);
};

const checkVideoReady = setInterval(() => {
  if (video.readyState >= 1) {
    clearInterval(checkVideoReady);

    // 전체 재생시간 세팅 START
    const duration = Math.floor(video.duration);
    playDuration.innerText = makeTimeFormat(duration);
    playBar.max = duration;
    playBar.value = 0;
    // 전체 재생시간 세팅 END

    // 볼륨세팅 START
    video.volume = volume;
    // 볼륨세팅 END
  }
}, 10);
// 시작시 세팅 END

// 재생이 끝나면 view 카운트 START
video.addEventListener('ended', () => {
  const videoId = videoContainer.dataset.videoId;
  fetch(`/api/video/${videoId}/view`, {
    method: 'POST',
  });
});
// 재생이 끝나면 view 카운트 END
