// <news-carousel> 웹 컴포넌트.
// index.html NEWS 패널의 캐러셀(마크업 + 데이터 + 무한 루프 인터랙션)을 담당한다.
// 사이트의 다른 3개 페이지(TRIP / PROFILE / HOLIDAY)를 소개하고,
// 각 카드는 해당 페이지의 특정 구간(#fragment)으로 이동한다.

const NEWS_ITEMS = [
  {
    category: "TRIP",
    title: "여행지별 에피소드",
    desc: "오사카부터 하노이까지, 카드를 뒤집으면 그 도시에서의 순간을 짧은 에피소드로 만나볼 수 있어요.",
    href: "myTrip.html",
  },
  {
    category: "PROFILE",
    title: "최신 프로젝트 진행",
    desc: "문제를 발견하고 풀어온 과정을 프로젝트별로 정리했습니다. 기술적 고민의 흐름을 따라가 보세요.",
    href: "myProfile.html",
  },
  {
    category: "HOLIDAY",
    title: "휴일 일과 업데이트",
    desc: "아침부터 밤까지, 시간을 넘기며 달라지는 하늘과 풍경을 직접 눌러 확인해보세요.",
    href: "myHoliday.html",
  },
];

function createNewsSlide(item) {
  const slide = document.createElement("article");
  slide.className = "carousel-slide";
  slide.innerHTML = `
    <a class="carousel-card" href="${item.href}">
      <div class="panel-header">
        <span class="eyebrow">${item.category}</span>
        <h3 class="panel-title">${item.title}</h3>
      </div>
      <p class="panel-desc">${item.desc}</p>
    </a>
  `;
  return slide;
}

customElements.define(
  "news-carousel",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <section class="panel featured">
          <div class="featured-texture" aria-hidden="true"></div>
          <span class="eyebrow">NEWS</span>
          <div class="carousel">
            <div class="carousel-viewport">
              <div class="carousel-track" id="newsTrack"></div>
            </div>
            <div class="carousel-dots" id="newsDots"></div>
          </div>
        </section>
      `;

      this.initCarousel();
    }

    initCarousel() {
      const track = this.querySelector("#newsTrack");
      const dotsEl = this.querySelector("#newsDots");

      NEWS_ITEMS.forEach((item) => track.appendChild(createNewsSlide(item)));

      const realSlides = Array.from(track.children);
      const total = realSlides.length;

      // Infinite Loop Clones
      const firstClone = realSlides[0].cloneNode(true);
      const lastClone = realSlides[total - 1].cloneNode(true);

      track.insertBefore(lastClone, realSlides[0]);
      track.appendChild(firstClone);

      let index = 1;

      function setTransform(withTransition = true) {
        track.style.transition = withTransition
          ? "transform 0.4s ease"
          : "none";
        track.style.transform = `translateX(-${index * 100}%)`;
      }

      function updateDots() {
        const realIndex = (index - 1 + total) % total;
        [...dotsEl.children].forEach((dot, i) => {
          dot.classList.toggle("active", i === realIndex);
        });
      }

      // Generate Navigation Dots
      realSlides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className = "carousel-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("aria-label", `${i + 1}번째 소식으로 이동`);
        dot.addEventListener("click", () => {
          index = i + 1;
          setTransform();
          updateDots();
        });
        dotsEl.appendChild(dot);
      });

      // Loop Shift Reset on Transition End
      track.addEventListener("transitionend", () => {
        if (index === total + 1) {
          index = 1;
          setTransform(false);
        } else if (index === 0) {
          index = total;
          setTransform(false);
        }
      });

      // Initial Position Setup
      setTransform(false);
    }
  },
);
