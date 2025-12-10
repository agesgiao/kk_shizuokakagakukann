document.addEventListener("DOMContentLoaded", () => {
  const voiceMap = {};
  for (let i = 1; i <= 12; i++) {
    voiceMap[`voice${i}`] = document.getElementById(`voice${i}`);
  }

  // 動画マップ kk1～kk13 + kk61/kk62
  const videoMap = {};
  for (let i = 1; i <= 11; i++) {
    videoMap[`kk${i}`] = document.getElementById(`kk${i}`);
  }
  videoMap.kk61 = document.getElementById("kk61");
  videoMap.kk62 = document.getElementById("kk62");

  // 音声マップ
  const audioMap = {
    voice1: document.getElementById("voice1"),
    voice2: document.getElementById("voice2"),
    voice3: document.getElementById("voice3"),
    voice4: document.getElementById("voice4"),
    voice5: document.getElementById("voice5"),
    voice6: document.getElementById("voice6"),
    voice7: document.getElementById("voice7"),
    voice8: document.getElementById("voice8"),
	voice9: document.getElementById("voice9"),
	voice10: document.getElementById("voice10"),
	voice11: document.getElementById("voice11"),
	voice12: document.getElementById("voice12")
  };

  const overlaySuccess = document.getElementById("overlay-success");
  const overlayFail = document.getElementById("overlay-fail");
  const overlayVideoSuccess = document.getElementById("overlay-video-success");
  const overlayVideoFail = document.getElementById("overlay-video-fail");
  const countdownEl = document.getElementById("countdown");

  let challengeStarted = false;
  let endingTriggered = false;
  let countdownInterval, timeoutId;
  const voiceQueue = [];
  let currentVoice = null;
  const playedVoices = new Set();

  function enqueueVoice(id) {
    if (currentVoice || voiceQueue.includes(id) || playedVoices.has(id)) return;
    voiceQueue.push(id);
    tryPlayNextVoice();
  }

  function tryPlayNextVoice() {
    if (currentVoice || voiceQueue.length === 0) return;
    const nextId = voiceQueue.shift();
    const next = voiceMap[nextId];
    if (!next) {
      tryPlayNextVoice();
      return;
    }
    currentVoice = next;
    playedVoices.add(nextId);
    currentVoice.currentTime = 0;
    currentVoice.play();
    currentVoice.onended = () => {
      currentVoice = null;
      tryPlayNextVoice();
    };
  }

  function resetMedia() {
    Object.values(videoMap).forEach(v => { v.pause(); v.currentTime = 0; });
    Object.values(audioMap).forEach(a => { a.pause(); a.currentTime = 0; });
    Object.values(voiceMap).forEach(v => { v.pause(); v.currentTime = 0; });
  }

  function resetOverlay() {
    overlaySuccess.style.display = "none";
    overlayFail.style.display = "none";
    overlayVideoSuccess.pause();
    overlayVideoSuccess.currentTime = 0;
    overlayVideoFail.pause();
    overlayVideoFail.currentTime = 0;
  }

  function resetAll() {
    resetMedia();
    resetOverlay();
    countdownEl.style.display = "none";
    clearTimeout(timeoutId);
    clearInterval(countdownInterval);
    challengeStarted = false;
    endingTriggered = false;
    voiceQueue.length = 0;
    currentVoice = null;
  }

  function startCountdown() {
    if (challengeStarted) return;
    challengeStarted = true;
    let count = 30;
    countdownEl.textContent = count;
    countdownEl.style.display = "block";

    countdownInterval = setInterval(() => {
      count--;
      countdownEl.textContent = count;
      if (count <= 0) {
        clearInterval(countdownInterval);
        countdownEl.style.display = "none";
      }
    }, 1000);

    timeoutId = setTimeout(() => {
      if (!endingTriggered) {
        overlayFail.style.display = "flex";
        overlayVideoFail.play();
        videoMap.kk61.play();

        overlayVideoFail.onplay = () => {
          audioMap.kk61.currentTime = 0;
          audioMap.kk61.play().catch(e => console.warn("kk61 audio blocked:", e));
        };

        challengeStarted = false;
        endingTriggered = true;
      }
    }, 30000);
  }

  overlayVideoSuccess.onended = () => { overlaySuccess.style.display = "none"; };
  overlayVideoFail.onended = () => { overlayFail.style.display = "none"; };

  for (let i = 1; i <= 13; i++) {
    const el = document.getElementById(`target${i}`);
    el.addEventListener("targetFound", () => {
      if (challengeStarted && i !== 1 && !endingTriggered) return;

      switch(i) {
        case 1:
          if (challengeStarted && !endingTriggered) {
            clearTimeout(timeoutId);
            clearInterval(countdownInterval);
            countdownEl.style.display = "none";
            overlaySuccess.style.display = "flex";
            overlayVideoSuccess.play();
            videoMap.kk62.play();

            overlayVideoSuccess.onplay = () => {
              audioMap.kk62.currentTime = 0;
              audioMap.kk62.play().catch(e => console.warn("kk62 audio blocked:", e));
            };

            challengeStarted = false;
            endingTriggered = true;
          } else if (!challengeStarted) {
            enqueueVoice("voice1");
          }
          break;
        case 2: videoMap.kk2.play(); enqueueVoice("voice2"); break;
        case 3: videoMap.kk3.play(); enqueueVoice("voice3"); break;
        case 4: videoMap.kk4.play(); enqueueVoice("voice4"); break;
        case 5: videoMap.kk5.play(); enqueueVoice("voice5"); break;
        case 6: videoMap.kk6.play(); enqueueVoice("voice6"); break;
        case 7: videoMap.kk7.play(); enqueueVoice("voice7"); break;
        case 8: videoMap.kk8.play(); enqueueVoice("voice8"); break;
        case 9: videoMap.kk9.play(); enqueueVoice("voice9"); break;
        case 10: videoMap.kk10.play(); enqueueVoice("voice10"); break;
        case 11: videoMap.kk11.play(); enqueueVoice("voice11"); break;
        case 12: enqueueVoice("voice12"); voiceMap.voice12.onended = () => { startCountdown(); }; break;
        case 13: location.reload(); break;
      }
    });
  }

  resetAll();
});