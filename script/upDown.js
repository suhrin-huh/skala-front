// Up-Down 숫자 맞추기 게임
// 컴퓨터가 1~50 사이의 숫자를 정하고, 사용자가 prompt()로 맞출 때까지 반복한다.

(function () {
  const startBtn = document.getElementById("updownStartBtn");

  if (!startBtn) return;

  startBtn.addEventListener("click", startUpDownGame);

  function startUpDownGame() {
    var computerNum = Math.floor(Math.random() * 50) + 1;

    let tryCount = 0;
    let isCorrect = false;

    while (!isCorrect) {
      const input = prompt(
        "1부터 50 사이의 숫자 중 컴퓨터가 생각한 숫자는 무엇일까요?",
      );

      // 사용자가 '취소'를 누르면 게임 중단
      if (input === null) {
        return;
      }

      const guess = Number(input);

      // 숫자가 아닌 값을 입력한 경우
      if (input.trim() === "" || Number.isNaN(guess)) {
        alert("숫자를 입력해주세요.");
        continue;
      }

      tryCount++;

      if (guess > computerNum) {
        alert("Down!");
      } else if (guess < computerNum) {
        alert("Up!");
      } else {
        alert(`축하합니다! ${tryCount}번 만에 맞추셨습니다.`);
        isCorrect = true;
      }
    }
  }
})();
