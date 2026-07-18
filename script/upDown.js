// Up-Down 숫자 맞추기 게임 (모달 버전)
// 컴퓨터가 1~50 사이의 숫자를 정하고, 사용자가 모달 안의 input으로 맞출 때까지 반복한다.
// prompt() / alert() 대신 3단계 모달(인트로 → 플레이 → 결과)로 진행된다.

(function () {
  const startBtn = document.getElementById("updownStartBtn");
  const backdrop = document.getElementById("updownModal");

  if (!startBtn || !backdrop) return;

  const MIN = 1;
  const MAX = 50;
  const RANGE_MESSAGE = "1부터 50사이의 숫자를 입력해주세요";

  const closeBtn = document.getElementById("updownCloseBtn");
  const startInnerBtn = document.getElementById("updownStartInnerBtn");
  const submitBtn = document.getElementById("updownSubmitBtn");
  const input = document.getElementById("updownInput");
  const errorEl = document.getElementById("updownError");
  const roundEl = document.getElementById("updownRound");
  const feedbackEl = document.getElementById("updownFeedback");
  const resultCountEl = document.getElementById("updownResultCount");
  const closeResultBtn = document.getElementById("updownCloseResultBtn");
  const restartBtn = document.getElementById("updownRestartBtn");
  const screens = backdrop.querySelectorAll(".game-screen");
  const modalBox = document.getElementById("updownModalBox");

  let computerNum = null;
  let round = 1;

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
      resetGame();
    }, 250);
  }

  // 숫자가 아닌 문자는 애초에 입력되지 않도록 필터링
  function sanitizeInput() {
    input.value = input.value.replace(/[^0-9]/g, "");
  }

  // 값이 바뀔 때마다 1~50 범위인지 검사해 에러 문구 + 버튼 활성화 상태를 갱신
  function validateInput() {
    const raw = input.value;

    if (raw === "") {
      errorEl.textContent = "";
      submitBtn.disabled = true;
      return;
    }

    const num = Number(raw);

    if (num < MIN || num > MAX) {
      errorEl.textContent = RANGE_MESSAGE;
      submitBtn.disabled = true;
      return;
    }

    errorEl.textContent = "";
    submitBtn.disabled = false;
  }

  function resetGame() {
    computerNum = null;
    round = 1;
    errorEl.textContent = "";
    feedbackEl.innerHTML = "";
    input.value = "";
    submitBtn.disabled = true;
    showScreen("intro");
  }

  function startGame() {
    computerNum = Math.floor(Math.random() * MAX) + 1;
    round = 1;
    errorEl.textContent = "";
    feedbackEl.innerHTML = "";
    input.value = "";
    submitBtn.disabled = true;
    roundEl.textContent = round + "번째 도전";
    showScreen("playing");
    // 자동 포커스는 주지 않는다 (사용자가 직접 클릭해서 입력)
  }

  function submitGuess() {
    if (submitBtn.disabled) return;

    const guess = Number(input.value);

    if (guess === computerNum) {
      resultCountEl.textContent = round;
      showScreen("result");
      return;
    }

    const isUp = guess < computerNum;
    feedbackEl.innerHTML =
      '<span class="game-feedback-arrow">' +
      (isUp ? "▲ UP" : "▼ DOWN") +
      "</span>" +
      '<span class="game-feedback-number">' +
      guess +
      "</span>";

    round++;
    roundEl.textContent = round + "번째 도전";
    input.value = "";
    submitBtn.disabled = true;
    // 자동 포커스는 주지 않는다
  }

  // 카드 클릭 -> 인트로 모달 오픈
  startBtn.addEventListener("click", function () {
    resetGame();
    openModal();
  });

  // 인트로의 START -> 게임 시작 (플레이 화면)
  startInnerBtn.addEventListener("click", startGame);

  // 입력 값 필터링 + 실시간 범위 검증
  input.addEventListener("input", function () {
    sanitizeInput();
    validateInput();
  });

  // 입력하기 -> 정답 체크
  submitBtn.addEventListener("click", submitGuess);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") submitGuess();
  });

  // 닫기 / 결과 화면 닫기 / 다시하기
  closeBtn.addEventListener("click", closeModal);
  closeResultBtn.addEventListener("click", closeModal);
  restartBtn.addEventListener("click", startGame);

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
