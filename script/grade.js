// Grade Calculator (모달 버전)
// 과목과 점수를 입력해 표에 추가하고, "점수 계산하기"를 누르면
// "과목 - 점수" 리스트와 함께 평균 점수를 보여준다.

(function () {
  const startBtn = document.getElementById("gradeStartBtn");
  const backdrop = document.getElementById("gradeModal");

  if (!startBtn || !backdrop) return;

  const closeBtn = document.getElementById("gradeCloseBtn");
  const startInnerBtn = document.getElementById("gradeStartInnerBtn");

  const subjectInput = document.getElementById("gradeSubjectInput");
  const scoreInput = document.getElementById("gradeScoreInput");
  const addBtn = document.getElementById("gradeAddBtn");
  const errorEl = document.getElementById("gradeError");

  const tableEl = document.getElementById("gradeTable");
  const tableEmptyEl = document.getElementById("gradeTableEmpty");
  const calcBtn = document.getElementById("gradeCalcBtn");

  const resultListEl = document.getElementById("gradeResultList");
  const averageEl = document.getElementById("gradeAverage");
  const closeResultBtn = document.getElementById("gradeCloseResultBtn");
  const restartBtn = document.getElementById("gradeRestartBtn");

  const screens = backdrop.querySelectorAll(".game-screen");
  const modalBox = document.getElementById("gradeModalBox");

  let entries = [];

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

  // 점수 입력값은 숫자와 소수점 하나만 허용
  function sanitizeScoreInput() {
    let v = scoreInput.value.replace(/[^0-9.]/g, "");
    const firstDot = v.indexOf(".");
    if (firstDot !== -1) {
      v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g, "");
    }
    scoreInput.value = v;
  }

  // 과목명 + 점수가 둘 다 유효할 때만 + 버튼 활성화
  function validateForm() {
    const subject = subjectInput.value.trim();
    const score = Number(scoreInput.value);
    const isValid =
      subject !== "" && scoreInput.value.trim() !== "" && !Number.isNaN(score);
    addBtn.disabled = !isValid;
    if (isValid) errorEl.textContent = "";
  }

  function renderTable() {
    if (entries.length === 0) {
      tableEl.innerHTML =
        '<p class="grade-table-empty" id="gradeTableEmpty">아직 추가된 과목이 없어요.</p>';
      calcBtn.disabled = true;
      return;
    }

    tableEl.innerHTML = entries
      .map(function (entry, i) {
        return (
          '<div class="grade-row">' +
          '<span class="grade-row-subject">' +
          entry.subject +
          "</span>" +
          '<span class="grade-row-score">' +
          entry.score +
          "</span>" +
          '<button type="button" class="grade-row-remove" data-index="' +
          i +
          '" aria-label="' +
          entry.subject +
          ' 삭제">×</button>' +
          "</div>"
        );
      })
      .join("");

    calcBtn.disabled = false;
  }

  function addEntry() {
    if (addBtn.disabled) return;

    const subject = subjectInput.value.trim();
    const score = Number(scoreInput.value);

    // 이미 추가된 과목이면 안내만 하고 중단 (alert 대신 인라인 메시지)
    const isDuplicate = entries.some(function (entry) {
      return entry.subject === subject;
    });
    if (isDuplicate) {
      errorEl.textContent = "이미 추가된 과목이에요.";
      return;
    }

    entries.push({ subject: subject, score: score });
    renderTable();

    subjectInput.value = "";
    scoreInput.value = "";
    addBtn.disabled = true;
    errorEl.textContent = "";
  }

  function removeEntry(index) {
    entries.splice(index, 1);
    renderTable();
  }

  function calcAverage() {
    if (entries.length === 0) return;

    const total = entries.reduce(function (sum, entry) {
      return sum + entry.score;
    }, 0);
    const avg = Math.round((total / entries.length) * 10) / 10;

    resultListEl.innerHTML = entries
      .map(function (entry) {
        return (
          '<div class="grade-row grade-row--result">' +
          '<span class="grade-row-subject">' +
          entry.subject +
          "</span>" +
          '<span class="grade-row-score">' +
          entry.score +
          "점</span>" +
          "</div>"
        );
      })
      .join("");

    averageEl.textContent = avg;
    showScreen("result");
  }

  function resetAll() {
    entries = [];
    subjectInput.value = "";
    scoreInput.value = "";
    errorEl.textContent = "";
    addBtn.disabled = true;
    renderTable();
    showScreen("intro");
  }

  function restart() {
    entries = [];
    subjectInput.value = "";
    scoreInput.value = "";
    errorEl.textContent = "";
    addBtn.disabled = true;
    renderTable();
    showScreen("input");
  }

  // 카드 클릭 -> 인트로 모달 오픈
  startBtn.addEventListener("click", function () {
    resetAll();
    openModal();
  });

  // 인트로의 START -> 입력 화면
  startInnerBtn.addEventListener("click", function () {
    showScreen("input");
  });

  // 입력 값 검증
  subjectInput.addEventListener("input", validateForm);
  scoreInput.addEventListener("input", function () {
    sanitizeScoreInput();
    validateForm();
  });

  // 엔터로도 추가 가능하게
  [subjectInput, scoreInput].forEach(function (el) {
    el.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        addEntry();
      }
    });
  });

  // + 버튼 -> 표에 추가
  addBtn.addEventListener("click", addEntry);

  // 표의 삭제 버튼 (이벤트 위임)
  tableEl.addEventListener("click", function (e) {
    const btn = e.target.closest(".grade-row-remove");
    if (!btn) return;
    removeEntry(Number(btn.dataset.index));
  });

  // 점수 계산하기 -> 결과 화면
  calcBtn.addEventListener("click", calcAverage);

  // 결과 화면 닫기 / 다시하기
  closeResultBtn.addEventListener("click", closeModal);
  restartBtn.addEventListener("click", restart);

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