// What's in my bag? (모달 버전)
// 가방 속 이미지를 가려두고, 마우스가 지나간 부분만 원형으로 보여준다.
// 지정된 시간(기본 5초)이 지나면 물건 하나를 무작위로 골라 개수를 묻고,
// 맞히면 SUCCESS, 틀리면 FAIL을 stamp 모달로 보여준다.

(function () {
  const startBtn = document.getElementById("bagStartBtn");
  const backdrop = document.getElementById("bagModal");

  if (!startBtn || !backdrop) return;

  const EXPLORE_SECONDS = 5;

  // 가방 속 물건 종류와 개수
  const bagItems = [
    { name: "클립", count: 8 },
    { name: "돋보기", count: 1 },
    { name: "가위", count: 1 },
  ];

  const closeBtn = document.getElementById("bagCloseBtn");
  const startInnerBtn = document.getElementById("bagStartInnerBtn");

  const timerEl = document.getElementById("bagTimer");
  const stage = document.getElementById("bagStage");

  const questionText = document.getElementById("bagQuestionText");
  const answerInput = document.getElementById("bagAnswerInput");
  const errorEl = document.getElementById("bagError");
  const submitBtn = document.getElementById("bagSubmitBtn");

  const resultStamp = document.getElementById("bagResultStamp");
  const resultMessage = document.getElementById("bagResultMessage");
  const resultAnswerEl = document.getElementById("bagResultAnswer");
  const closeResultBtn = document.getElementById("bagCloseResultBtn");
  const restartBtn = document.getElementById("bagRestartBtn");

  const screens = backdrop.querySelectorAll(".game-screen");
  const modalBox = document.getElementById("bagModalBox");

  let currentQuestion = null;
  let timeLeft = EXPLORE_SECONDS;
  let timerId = null;

  function showScreen(name) {
    screens.forEach(function (screen) {
      screen.classList.toggle("active", screen.dataset.screen === name);
    });
    modalBox.classList.toggle("is-stamp", name === "result");
  }

  function openModal() {
    backdrop.classList.add("open");
    requestAnimationFrame(function () {
      backdrop.classList.add("show");
    });
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    backdrop.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(function () {
      backdrop.classList.remove("open");
      resetAll();
    }, 250);
  }

  // 한글 종성 유무에 따라 "은"/"는" 조사를 골라준다
  function pickParticle(word, withBatchim, withoutBatchim) {
    const lastChar = word[word.length - 1];
    const code = lastChar.charCodeAt(0) - 0xac00;
    if (code < 0 || code > 11171) return withoutBatchim;
    const hasBatchim = code % 28 !== 0;
    return hasBatchim ? withBatchim : withoutBatchim;
  }

  // 스테이지 위 마우스(또는 터치) 좌표를 CSS 변수로 반영해 원형으로 이미지 노출
  function reveal(clientX, clientY) {
    const rect = stage.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    stage.style.setProperty("--mx", x + "%");
    stage.style.setProperty("--my", y + "%");
  }

  function handleMouseMove(e) {
    reveal(e.clientX, e.clientY);
  }

  function handleTouchMove(e) {
    if (!e.touches || !e.touches[0]) return;
    e.preventDefault();
    reveal(e.touches[0].clientX, e.touches[0].clientY);
  }

  function resetStagePosition() {
    stage.style.setProperty("--mx", "-20%");
    stage.style.setProperty("--my", "-20%");
  }

  function stopTimer() {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  function startExplore() {
    resetStagePosition();
    timeLeft = EXPLORE_SECONDS;
    timerEl.textContent = timeLeft + "초 남음";
    showScreen("explore");

    stopTimer();
    timerId = setInterval(function () {
      timeLeft--;
      if (timeLeft <= 0) {
        stopTimer();
        startQuestion();
      } else {
        timerEl.textContent = timeLeft + "초 남음";
      }
    }, 1000);
  }

  function startQuestion() {
    currentQuestion = bagItems[Math.floor(Math.random() * bagItems.length)];
    const particle = pickParticle(currentQuestion.name, "은", "는");
    questionText.innerHTML =
      '<span class="bag-question-target">' +
      currentQuestion.name +
      "</span>" +
      particle +
      " 몇 개 있을까요?";
    answerInput.value = "";
    errorEl.textContent = "";
    submitBtn.disabled = true;
    showScreen("question");
  }

  function sanitizeAnswerInput() {
    answerInput.value = answerInput.value.replace(/[^0-9]/g, "");
  }

  function validateAnswer() {
    submitBtn.disabled = answerInput.value.trim() === "";
  }

  function submitAnswer() {
    if (submitBtn.disabled || !currentQuestion) return;

    const guess = Number(answerInput.value);
    const isCorrect = guess === currentQuestion.count;

    resultStamp.textContent = isCorrect ? "SUCCESS" : "FAIL";
    resultStamp.classList.toggle("is-fail", !isCorrect);
    resultMessage.textContent = isCorrect
      ? "정답입니다!"
      : "아쉽지만 오답이에요.";
    resultAnswerEl.textContent =
      currentQuestion.name + " " + currentQuestion.count + "개";

    showScreen("result");
  }

  function resetAll() {
    stopTimer();
    currentQuestion = null;
    resetStagePosition();
    answerInput.value = "";
    errorEl.textContent = "";
    submitBtn.disabled = true;
    showScreen("intro");
  }

  // 카드 클릭 -> 인트로 모달 오픈
  startBtn.addEventListener("click", function () {
    resetAll();
    openModal();
  });

  // 인트로의 START -> 탐색 시작
  startInnerBtn.addEventListener("click", startExplore);

  // 탐색 스테이지 마우스/터치 이동
  stage.addEventListener("mousemove", handleMouseMove);
  stage.addEventListener("touchmove", handleTouchMove, { passive: false });

  // 정답 입력 검증
  answerInput.addEventListener("input", function () {
    sanitizeAnswerInput();
    validateAnswer();
  });
  answerInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") submitAnswer();
  });

  // 제출하기 -> 결과 화면 (stamp)
  submitBtn.addEventListener("click", submitAnswer);

  // 결과 화면 닫기 / 다시하기 (다시하기는 탐색부터 재시작)
  closeResultBtn.addEventListener("click", closeModal);
  restartBtn.addEventListener("click", startExplore);

  // 닫기 버튼
  closeBtn.addEventListener("click", closeModal);

  // 배경 클릭 시 닫기
  backdrop.addEventListener("click", function (e) {
    if (e.target === backdrop) closeModal();
  });

  // ESC로 닫기
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && backdrop.classList.contains("open")) {
      closeModal();
    }
  });
})();
