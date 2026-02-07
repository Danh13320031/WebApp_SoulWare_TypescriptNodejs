const handleAudioPlayer = () => {
  const songPlayerAudio = document.getElementById("song-player-audio");

  if (songPlayerAudio) {
    let songData = songPlayerAudio.getAttribute("data-song");
    songData = JSON.parse(songData);

    const ap = new APlayer({
      container: songPlayerAudio,
      autoplay: true,
      theme: "#cc40d7",
      audio: [
        {
          name: songData.title,
          artist: songData.singerId.stageName,
          url: songData.audio,
          cover: songData.avatar,
        },
      ],
    });

    const songPlayerImage = document.querySelector(".song-player-image");
    const songPlayerPlay = document.querySelector(".song-player-play");

    const htmlPlay = `
    <i class="fa-solid fa-play me-1"></i> Tiếp tục phát
  `;
    const htmlPause = `
    <i class="fa-solid fa-pause me-1"></i> Tạm dừng
  `;

    if (ap.playing) {
      songPlayerPlay.innerHTML = htmlPause;
    } else {
      songPlayerPlay.innerHTML = htmlPlay;
    }

    if (songPlayerPlay) {
      songPlayerPlay.addEventListener("click", () => {
        if (ap.paused) {
          ap.play();
          songPlayerPlay.innerHTML = htmlPause;
          songPlayerImage.classList.add("running");
        } else {
          ap.pause();
          songPlayerPlay.innerHTML = htmlPlay;
          songPlayerImage.classList.remove("running");
        }
      });
    }

    ap.on("play", () => {
      songPlayerPlay.innerHTML = htmlPause;
      songPlayerImage.classList.add("running");
    });
    ap.on("pause", () => {
      songPlayerPlay.innerHTML = htmlPlay;
      songPlayerImage.classList.remove("running");
    });
  }
};

handleAudioPlayer();
