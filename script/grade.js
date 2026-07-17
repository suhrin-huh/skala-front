// 성적 계산기
// 3과목(HTML, CSS, JavaScript) 점수를 연속으로 입력받아
// 총점/평균을 구하고 합격 여부와 등급을 alert로 보여준다.

(function () {
  const startBtn = document.getElementById("gradeStartBtn");

  if (!startBtn) return;

  startBtn.addEventListener("click", startGradeCalculator);

  function startGradeCalculator() {
    var subjects = ["HTML", "CSS", "JavaScript"];
    var total = 0;

    for (let i = 0; i < subjects.length; i++) {
      const input = prompt(subjects[i] + " 점수를 입력하세요.");

      // 사용자가 '취소'를 누르면 계산 중단
      if (input === null) {
        return;
      }

      const score = Number(input);

      // 숫자가 아닌 값을 입력한 경우
      if (input.trim() === "" || Number.isNaN(score)) {
        alert("숫자를 입력해주세요. 처음부터 다시 시작합니다.");
        return;
      }

      total += score;
    }

    const average = total / subjects.length;
    const roundedAverage = Math.round(average * 10) / 10;
    const isPass = average >= 60;
    const grade = getGrade(average);
    const isExcellent = grade === "A";

    const resultLines = [
      "====== 📊 성적 결과표 ======",
      `• 총점: ${total}점`,
      `• 평균: ${roundedAverage}점`,
      `• 등급: ${grade}`,
      "-----------------",
      isPass
        ? `• 결과: 🎉 합격입니다!${isExcellent ? " 우수자로 선정되었습니다." : ""}`
        : "• 결과: 😢 불합격입니다.",
    ];

    alert(resultLines.join("\n"));
  }

  function getGrade(average) {
    if (average >= 90) return "A";
    if (average >= 80) return "B";
    if (average >= 70) return "C";
    if (average >= 60) return "D";
    return "F";
  }
})();
