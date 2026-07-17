// 내 가방 보기
// myBag 배열(소지품 객체: 이름 + 수량)을 반복문으로 순회해서
// showMyBag() 함수가 alert로 목록을 보여준다.

(function () {
  const startBtn = document.getElementById("bagStartBtn");

  if (!startBtn) return;

  startBtn.addEventListener("click", showMyBag);

  function showMyBag() {
    const myBag = [
      { name: "여권", icon: "🛂", count: 1 },
      { name: "스마트폰", icon: "📱", count: 2 },
      { name: "지갑", icon: "👛", count: 1 },
    ];

    const resultLines = ["🎒 [내 가방 속 물품 목록]", "-----------------"];

    for (let i = 0; i < myBag.length; i++) {
      const item = myBag[i];
      resultLines.push(`- ${item.name} ${item.icon} : ${item.count}개`);
    }

    resultLines.push("-----------------");
    resultLines.push(`총 물품 종류: ${myBag.length}가지`);

    alert(resultLines.join("\n"));
  }
})();
