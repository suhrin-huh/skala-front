// travelAlbum.js
// <travel-album> 웹 컴포넌트. myTrip.html 안에 있던
// TRAVEL ALBUM 캐러셀(마크업 + TRIPS 데이터 + 인터랙션)을 통째로 담당한다.

const TRIPS = [
  {
    country: "일본",
    region: "오사카",
    label: "Japan - Osaka",
    episode:
      "늦가을의 선선한 바람이 불던 오사카의 밤. 도톤보리 밤거리는 화려한 네온사인과 활기로 가득했다. 출출해질 때쯤 어디선가 풍겨오는 고소한 다코야키 냄새를 따라 발걸음을 옮겼다. 호호 불며 먹은 뜨거운 다코야키 한 입에 깊어가는 가을 밤의 낭만이 입안 가득 퍼지는 듯했다.",
    image: "/media/japan-osaka.jpg",
    date: "2025-11-20",
  },
  {
    country: "일본",
    region: "교토",
    label: "Japan - Kyoto",
    episode:
      "겨울의 초입, 서리가 내릴 듯 차가운 새벽 안개가 자욱했던 교토. 아라시야마의 대나무 숲을 찾아 혼자 조용히 걸었다. 바람에 사각거리는 대나무 소리 외에는 아무런 소음도 들리지 않는 고요함 속에서, 복잡했던 마음이 차분하게 정리되며 맑아지는 것을 느꼈다.",
    image: "/media/japan-kyoto.jpg",
    date: "2024-12-03",
  },
  {
    country: "그리스",
    region: "산토리니",
    label: "Greece - Santorini",
    episode:
      "여름의 열기가 조금은 차분해진 9월 초 가을의 산토리니. 하얀 벽과 파란 지붕이 내려다보이는 골목길 모퉁이 카페에 자리를 잡았다. 끝없이 펼쳐진 푸른 에메랄드빛 바다를 바라보며 마신 따뜻한 커피 한 잔은 바쁜 일상 속에서 느껴보지 못한 최고의 여유와 평온을 선물해주었다.",
    image: "/media/greece-santorini.jpg",
    date: "2025-09-05",
  },
  {
    country: "프랑스",
    region: "파리",
    label: "France - Paris",
    episode:
      "해가 장짱하고 따스한 완연한 초여름의 파리. 센 강변을 따라 한가로이 걷다 우연히 발걸음을 멈추었다. 감미로운 아코디언 선율을 연주하는 거리 공연가를 마주쳤기 때문이다. 윤슬이 반짝이는 센 강을 배경으로 흐르는 음악은 마치 영화 속 한 장면에 들어와 있는 듯한 착각을 불러일으켰다.",
    image: "/media/france-paris.jpg",
    date: "2024-06-18",
  },
  {
    country: "프랑스",
    region: "니스",
    label: "France - Nice",
    episode:
      "눈부신 햇살과 푸른 바다가 매력적인 니스에서의 여름날. 시원한 지중해 바람을 맞으며 야외 테이블에 앉아 로컬 푸드인 소카를 맛보았다. 바삭하고 고소한 그 맛과 함께 살갗을 스치던 따스한 남프랑스의 여름 공기가 지금까지도 너무나 그리워진다.",
    image: "/media/france-nice.jpg",
    date: "2024-06-22",
  },
  {
    country: "이탈리아",
    region: "로마",
    label: "Italy - Rome",
    episode:
      "기분 좋은 봄바람이 살랑이던 4월의 로마. 따스한 봄 햇살을 받으며 도착한 트레비 분수 앞은 전 세계에서 온 여행자들로 가득했다. 나도 분수를 등지고 서서, 다시 로마에 올 수 있기를 바라며 오른손으로 왼쪽 어깨 너머로 동전을 던졌다. 물방울과 함께 반짝이던 소원 하나가 꼭 이루어지길.",
    image: "/media/italy-rome.jpg",
    date: "2025-04-09",
  },
  {
    country: "베트남",
    region: "하노이",
    label: "Vietnam - Hanoi",
    episode:
      "우기가 끝나가고 선선한 가을바람이 불기 시작한 10월의 하노이. 구시가지의 좁고 복잡한 골목길을 정처 없이 헤맸다. 끊임없이 지나가는 오토바이들의 경적 소리가 처음엔 낯설었지만, 이내 가을날의 하노이가 가진 특유의 정겹고 활기찬 삶의 멜로디로 다가왔다.",
    image: "/media/vietnam-hanoi.jpg",
    date: "2023-10-11",
  },
];

function createTripSlide(trip, tripId) {
  const slide = document.createElement("div");
  slide.className = "trip-slide";
  slide.dataset.tripId = tripId;

  slide.innerHTML = `
    <div class="trip-card">
      <div class="trip-card-inner">
        <div class="trip-card-face trip-card-front">
          <img src="${trip.image}" alt="${trip.country} ${trip.region}" />
          <span class="trip-label">${trip.label}</span>
        </div>
        <div class="trip-card-face trip-card-back">
          <button type="button" class="trip-card-back-close" aria-label="닫기">✕</button>
          <p class="trip-card-back-title">${trip.country} · ${trip.region}</p>
          <p class="trip-card-back-date">${trip.date}</p>
          <p class="trip-card-back-episode">${trip.episode}</p>
          <span class="trip-card-back-stamp" aria-hidden="true"></span>
        </div>
      </div>
    </div>
  `;
  return slide;
}

customElements.define(
  "travel-album",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <section class="panel">
          <button
            type="button"
            class="travel-video-btn"
            id="travelVideoBtn"
            aria-label="여행 영상 보기"
          >
            <svg viewBox="0 0 24 24">
              <path
                d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"
              />
            </svg>
          </button>

          <section class="panel-section">
            <div class="panel-header">
              <h2 class="panel-title">TRAVEL ALBUM</h2>
              <p class="panel-desc">
                  여행지의 추억을 담은 앨범입니다. <span class="highlight">카드를 클릭</span>하면 여행지에서의 소소한 에피소드를 구경할 수 있습니다.
                </p>
            </div>

            <div class="trip-carousel" id="tripCarousel">
              <button
                type="button"
                class="trip-arrow trip-arrow-prev"
                id="tripPrevBtn"
                aria-label="이전 여행지"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M15 5 8 12l7 7" />
                </svg>
              </button>

              <div class="trip-carousel-viewport">
                <div class="trip-track" id="tripTrack"></div>
              </div>

              <button
                type="button"
                class="trip-arrow trip-arrow-next"
                id="tripNextBtn"
                aria-label="다음 여행지"
              >
                <svg viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </section>

          <div class="travel-video-modal" id="travelVideoModal">
            <div class="travel-video-modal-inner">
              <button
                type="button"
                class="travel-video-modal-close"
                id="travelVideoCloseBtn"
                aria-label="영상 닫기"
              >
                ✕
              </button>
              <video id="travelVideoPlayer" controls>
                <source src="/media/video.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
        </section>
      `;

      this.initCarousel();
      this.initVideoModal();
    }

    initVideoModal() {
      const videoBtn = this.querySelector("#travelVideoBtn");
      const modal = this.querySelector("#travelVideoModal");
      const closeBtn = this.querySelector("#travelVideoCloseBtn");
      const video = this.querySelector("#travelVideoPlayer");

      function openModal() {
        modal.classList.add("open");
        video.play();
      }

      function closeModal() {
        modal.classList.remove("open");
        video.pause();
        video.currentTime = 0;
      }

      videoBtn.addEventListener("click", openModal);
      closeBtn.addEventListener("click", closeModal);

      // 모달 바깥(반투명 배경) 클릭 시에도 닫힘
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeModal();
      });
    }

    initCarousel() {
      const tripTrack = this.querySelector("#tripTrack");
      const tripViewport = this.querySelector(".trip-carousel-viewport");
      const tripPrevBtn = this.querySelector("#tripPrevBtn");
      const tripNextBtn = this.querySelector("#tripNextBtn");

      // 초기화: 데이터 전부 렌더링
      TRIPS.forEach((trip, i) => {
        tripTrack.appendChild(createTripSlide(trip, i));
      });

      const realTripSlides = Array.from(tripTrack.children);
      const tripTotal = realTripSlides.length;

      let tripIndex = 0; // 시작점은 첫 번째 카드 (0번 인덱스)
      let openTripId = null;

      // 버튼 활성화/비활성화 상태 업데이트
      function updateButtonStates() {
        tripPrevBtn.disabled = tripIndex === 0;
        tripNextBtn.disabled = tripIndex === tripTotal - 1;

        tripPrevBtn.style.opacity = tripIndex === 0 ? "0.3" : "1";
        tripPrevBtn.style.pointerEvents = tripIndex === 0 ? "none" : "auto";

        tripNextBtn.style.opacity = tripIndex === tripTotal - 1 ? "0.3" : "1";
        tripNextBtn.style.pointerEvents =
          tripIndex === tripTotal - 1 ? "none" : "auto";
      }

      // 특정 인덱스의 카드를 뷰포트 중앙으로 이동
      function centerTripTo(i, withTransition = true) {
        if (i < 0 || i >= tripTotal) return;

        tripIndex = i;

        const cardWidthPx = realTripSlides[0].getBoundingClientRect().width;
        const gapPx = parseFloat(getComputedStyle(tripTrack).gap) || 0;
        const viewportWidthPx = tripViewport.getBoundingClientRect().width;

        const offset =
          viewportWidthPx / 2 - (i * (cardWidthPx + gapPx) + cardWidthPx / 2);

        tripTrack.style.transition = withTransition
          ? "transform 0.5s cubic-bezier(0.45, 0, 0.2, 1)"
          : "none";
        tripTrack.style.transform = `translateX(${offset}px)`;

        updateButtonStates();
      }

      // 카드 뒤집기 제어
      function closeOpenTripCard() {
        if (openTripId === null) return;
        tripTrack
          .querySelectorAll(`[data-trip-id="${openTripId}"] .trip-card`)
          .forEach((card) => card.classList.remove("is-flipped"));
        openTripId = null;
      }

      function openTripCard(tripId) {
        if (openTripId !== null && openTripId !== tripId) {
          closeOpenTripCard();
        }
        tripTrack
          .querySelectorAll(`[data-trip-id="${tripId}"] .trip-card`)
          .forEach((card) => card.classList.add("is-flipped"));
        openTripId = tripId;
      }

      // 카드 클릭 이벤트 바인딩
      realTripSlides.forEach((slideEl, domIndex) => {
        const card = slideEl.querySelector(".trip-card");
        const closeBtn = slideEl.querySelector(".trip-card-back-close");
        const tripId = slideEl.dataset.tripId;

        card.addEventListener("click", () => {
          centerTripTo(domIndex);
          openTripCard(tripId);
        });

        closeBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          closeOpenTripCard();
        });
      });

      // 좌우 화살표 버튼 이벤트 리스너
      tripPrevBtn.addEventListener("click", () => {
        if (tripIndex > 0) {
          closeOpenTripCard();
          centerTripTo(tripIndex - 1);
        }
      });

      tripNextBtn.addEventListener("click", () => {
        if (tripIndex < tripTotal - 1) {
          closeOpenTripCard();
          centerTripTo(tripIndex + 1);
        }
      });

      window.addEventListener("resize", () => centerTripTo(tripIndex, false));

      // 초기 셋팅
      centerTripTo(tripIndex, false);
    }
  },
);
