document.addEventListener("DOMContentLoaded", () => {
  // 1. 데이터
  const holidayData = [
    {
      time: "11:00",
      category: "MORNING",
      title: "늦은 기상하기",
      desc: "알림 소리에 눈을 뜨며 하루를 시작합니다.",
    },
    {
      time: "11:10",
      category: "MORNING",
      title: "물 한 잔과 음악 감상",
      desc: "물 한 잔을 마시며 좋아하는 음악으로 공간을 채웁니다.",
    },
    {
      time: "11:30",
      category: "MORNING",
      title: "여유 있게 아침 겸 점심 즐기기",
      desc: "여유롭게 브런치를 만들고 천천히 맛을 음미합니다.",
    },
    {
      time: "13:00",
      category: "AFTERNOON",
      title: "나만의 사이트 개발하기",
      desc: "나의 일상과 개성을 담은 사이트 개발을 진행합니다.",
    },
    {
      time: "16:00",
      category: "AFTERNOON",
      title: "아이쇼핑하기",
      desc: "라이프스타일 브랜드 팝업 스토어를 방문하여 디자인과 콘텐츠 레퍼런스를 수집합니다.",
    },
    {
      time: "18:00",
      category: "EVENING & NIGHT",
      title: "맛있는 저녁 먹기",
      desc: "하루의 성취감을 만끽하며 맛있는 음식으로 몸과 마음을 든든하게 채웁니다.",
    },
    {
      time: "20:00",
      category: "EVENING & NIGHT",
      title: "요즘 인기 있는 영화 감상",
      desc: "평소 보고 싶었던 영화를 보며 여유로운 문화생활을 즐깁니다.",
    },
    {
      time: "23:00",
      category: "EVENING & NIGHT",
      title: "짧은 독서 후 취침",
      desc: "조용한 밤, 책을 읽으며 하루를 차분하게 마무리하고 잠자리에 듭니다.",
    },
  ];

  const panoramaWrapper = document.getElementById("panoramaWrapper");
  const skyPanorama = document.getElementById("skyPanorama");
  const cityscape = document.getElementById("cityscape");
  const timelineDotsContainer = document.getElementById("timelineDots");
  const memoContent = document.getElementById("memoContent");

  // 2. 동적 빌딩 생성
  const buildingCount = 40;
  for (let i = 0; i < buildingCount; i++) {
    const building = document.createElement("div");
    building.className = "building";
    const randomHeight = Math.floor(Math.random() * 60) + 20;
    building.style.height = `${randomHeight}%`;
    if (i !== buildingCount - 1)
      building.style.marginRight = Math.floor(Math.random() * 10) + 2;
    cityscape.appendChild(building);
  }

  // 3. 타임라인 도트 생성
  holidayData.forEach((data, index) => {
    const dot = document.createElement("div");
    dot.className = "time-dot";
    dot.setAttribute("data-time", data.time);
    if (index === 0) dot.classList.add("active");
    dot.addEventListener("click", () => changeState(index));
    timelineDotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll(".time-dot");

  // 4. 상태 변경 함수
  function updateMemo(data) {
    memoContent.innerHTML = `
    <div class="memo-time-category">
      <span class="memo-time">${data.time}</span>
      <span class="memo-category">${data.category}</span>
    </div>
    <h2 class="memo-title">${data.title}</h2>
    <p class="memo-desc">${data.desc}</p>
  `;
  }

  function changeState(index) {
    dots.forEach((d) => d.classList.remove("active"));
    dots[index].classList.add("active");

    const translateX = -(index * (100 / 8));
    skyPanorama.style.transform = `translate3d(${translateX}%, 0, 0)`;
    panoramaWrapper.className = `panorama-container state-${index}`;

    memoContent.style.opacity = "0";
    setTimeout(() => {
      updateMemo(holidayData[index]);
      memoContent.style.opacity = "1";
    }, 300);
  }

  updateMemo(holidayData[0]);
});
