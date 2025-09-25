// =================================================================================================
// =================================================================================================
// =================================================================================================
const wrappers = document.querySelectorAll(".wrapper");

wrappers.forEach(wrapper => {
  const scrollMenu = wrapper.querySelector(".scrollMenu");
  const btnLeft = wrapper.querySelector(".left");
  const btnRight = wrapper.querySelector(".right");

  // Tombol klik kiri-kanan
  btnLeft.addEventListener("click", () => {
    scrollMenu.scrollBy({ left: -200, behavior: "smooth" });
  });

  btnRight.addEventListener("click", () => {
    scrollMenu.scrollBy({ left: 200, behavior: "smooth" });
  });

  // Geser pakai mouse drag
  let isDown = false;
  let startX;
  let scrollLeft;
  let velX = 0;
  let momentumID;

  scrollMenu.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX - scrollMenu.offsetLeft;
    scrollLeft = scrollMenu.scrollLeft;
    cancelMomentum();
    scrollMenu.style.scrollBehavior = "auto";
  });

  window.addEventListener("mouseup", () => {
    if (isDown) {
      isDown = false;
      beginMomentum();
    }
  });

  scrollMenu.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollMenu.offsetLeft;
    const walk = (x - startX);
    const prevScrollLeft = scrollMenu.scrollLeft;
    scrollMenu.scrollLeft = scrollLeft - walk;
    velX = scrollMenu.scrollLeft - prevScrollLeft;
  });

  function beginMomentum() {
    cancelMomentum();
    momentumID = requestAnimationFrame(momentumLoop);
  }

  function cancelMomentum() {
    cancelAnimationFrame(momentumID);
  }

  function momentumLoop() {
    scrollMenu.scrollLeft += velX;
    velX *= 0.9;
    if (Math.abs(velX) > 0.2) {
      momentumID = requestAnimationFrame(momentumLoop);
    }
  }
});
// =================================================================================================
// =================================================================================================
// =================================================================================================

let a = document.getElementById("tomb");
let b = document.getElementById("side");

a.addEventListener("click", function() {
  b.classList.toggle("active");
});


// =================================================================================================
// =================================================================================================
// =================================================================================================

 document.querySelectorAll(".player").forEach(player => {
      const video = player.querySelector(".video");
      const playPause = player.querySelector(".playPause");
      const skipBack = player.querySelector(".skipBack");
      const skipForward = player.querySelector(".skipForward");
      const volume = player.querySelector(".volume");
      const progress = player.querySelector(".progress");
      const pip = player.querySelector(".pip");
      const fullscreen = player.querySelector(".fullscreen");
      const bigPlay = player.querySelector(".big-play");
      const time = player.querySelector(".time");
      const tooltip = player.querySelector(".tooltip");

      // Format waktu mm:ss
      function formatTime(sec) {
        if (isNaN(sec)) return "0:00";
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
      }

      // Play / Pause
      function togglePlayPause() {
        if (video.paused) {
          video.play();
          playPause.textContent = "⏸️";
          bigPlay.classList.add("hidden");
        } else {
          video.pause();
          playPause.textContent = "▶️";
          bigPlay.classList.remove("hidden");
        }
      }

      playPause.addEventListener("click", togglePlayPause);
      video.addEventListener("click", togglePlayPause);
      bigPlay.addEventListener("click", togglePlayPause);

      // Skip
      skipBack.addEventListener("click", () => video.currentTime -= 10);
      skipForward.addEventListener("click", () => video.currentTime += 10);

      // Volume
      volume.addEventListener("input", () => {
        video.volume = volume.value;
      });

      // Update progress & timer
      video.addEventListener("timeupdate", () => {
        const percent = (video.currentTime / video.duration) * 100;
        progress.value = percent;
        time.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
      });

      // Seek
      progress.addEventListener("input", () => {
        video.currentTime = (progress.value / 100) * video.duration;
      });

      // Tooltip waktu di progress bar
      progress.addEventListener("mousemove", (e) => {
        const rect = progress.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const previewTime = percent * video.duration;
        tooltip.style.left = `${e.clientX - rect.left}px`;
        tooltip.textContent = formatTime(previewTime);
        tooltip.style.display = "block";
      });
      progress.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });

      // PiP
      pip.addEventListener("click", async () => {
        if (document.pictureInPictureElement) {
          document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled) {
          await video.requestPictureInPicture();
        }
      });

      // Fullscreen
      fullscreen.addEventListener("click", () => {
        if (!document.fullscreenElement) {
          player.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      });

      // Show/Hide Controls
      let timeout;
      function showControls() {
        player.classList.add("show-controls");
        player.style.cursor = "default";
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          if (!video.paused) {
            player.classList.remove("show-controls");
            player.style.cursor = "none";
          }
        }, 3000);
      }

      player.addEventListener("mousemove", showControls);
      video.addEventListener("pause", () => {
        player.classList.add("show-controls");
        player.style.cursor = "default";
        bigPlay.classList.remove("hidden");
      });
      video.addEventListener("play", () => {
        showControls();
        bigPlay.classList.add("hidden");
      });

      // Init
      video.addEventListener("loadedmetadata", () => {
        time.textContent = `0:00 / ${formatTime(video.duration)}`;
      });
      showControls();
    });