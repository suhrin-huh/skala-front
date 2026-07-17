// musicPlayer.js
// <music-player> 웹 컴포넌트. myTrip.html 안에 있던
// CD 플레이어 사이드바(플로팅 버튼 + 슬라이드 패널 + BGM 재생)를 통째로 담당한다.

customElements.define(
  "music-player",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <audio id="bgm-player" loop>
          <source src="/media/audio.mp3" type="audio/mpeg" />
        </audio>

        <div class="sidebar-trigger-zone" id="sidebar-trigger-area">
          <div class="cd-floating-btn" id="floating-btn">
            <svg
              class="player-icon icon-stop-state"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 2C6.48 2 2 6.48 2 12v7c0 1.1.9 2 2 2h4v-8H4v-1c0-4.41 3.59-8 8-8s8 3.59 8 8v1h-4v8h4c1.1 0 2-.9 2-2v-7c0-5.52-4.48-10-10-10z"
              />
            </svg>
            <svg
              class="player-icon icon-play-state"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient
                  id="eq-flow-gradient"
                  gradientUnits="userSpaceOnUse"
                  x1="-24"
                  y1="0"
                  x2="0"
                  y2="0"
                  spreadMethod="reflect"
                >
                  <stop offset="0%" stop-color="#b6503a">
                    <animate
                      attributeName="stop-color"
                      values="#b6503a; #d98c4a; #8a3324; #b6503a"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <stop offset="100%" stop-color="#d98c4a">
                    <animate
                      attributeName="stop-color"
                      values="#d98c4a; #8a3324; #b6503a; #d98c4a"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </stop>
                  <animate
                    attributeName="x1"
                    values="-24; 24; -24"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="x2"
                    values="0; 48; 0"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </linearGradient>
              </defs>
              <rect x="4" y="10" width="3" height="4" transform="translate(0 0)">
                <animate
                  attributeName="height"
                  values="4; 16; 4"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  values="10; 4; 10"
                  dur="0.6s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x="10" y="6" width="3" height="12">
                <animate
                  attributeName="height"
                  values="12; 20; 12"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  values="6; 2; 6"
                  dur="0.8s"
                  repeatCount="indefinite"
                />
              </rect>
              <rect x="16" y="10" width="3" height="4">
                <animate
                  attributeName="height"
                  values="4; 14; 4"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="y"
                  values="10; 5; 10"
                  dur="0.5s"
                  repeatCount="indefinite"
                />
              </rect>
            </svg>
          </div>
        </div>

        <aside class="cd-sidebar" id="music-sidebar">
          <div class="cd-player">
            <div class="cd-well">
              <div class="cd-disc" id="cd-disc-media">
                <div class="cd-center"></div>
              </div>
            </div>

            <div
              class="pull-string-container"
              id="pull-trigger"
              aria-label="줄을 당겨 플레이어 제어"
            >
              <div class="string-line"></div>
              <div class="string-handle"></div>
            </div>
          </div>

          <p class="cd-title-guide">
            하단의 줄을 잡고 아래로 세게 당겼다 놓으면<br />CD 플레이어가 전자기
            탄성과 함께 작동합니다.
          </p>
        </aside>
      `;

      this.initPlayer();
    }

    initPlayer() {
      const bgmPlayer = this.querySelector("#bgm-player");
      const sidebar = this.querySelector("#music-sidebar");
      const floatingBtn = this.querySelector("#floating-btn");
      const pullTrigger = this.querySelector("#pull-trigger");
      const cdDiscMedia = this.querySelector("#cd-disc-media");

      let isPlaying = false;

      // 1. 호버 인터랙션 (열기 / 닫기)
      floatingBtn.addEventListener("mouseenter", () => {
        sidebar.classList.add("open");
        floatingBtn.classList.add("active");
      });

      sidebar.addEventListener("mouseenter", () => {
        sidebar.classList.add("open");
        floatingBtn.classList.add("active");
      });

      sidebar.addEventListener("mouseleave", () => {
        sidebar.classList.remove("open");
        floatingBtn.classList.remove("active");
      });

      // 2. CD 플레이어 줄당기기 탄성 물리 인터랙션
      pullTrigger.addEventListener("click", () => {
        pullTrigger.classList.add("pulling");

        setTimeout(() => {
          pullTrigger.classList.remove("pulling");
        }, 750);

        if (!isPlaying) {
          bgmPlayer.play();
          cdDiscMedia.style.animationPlayState = "running";
          floatingBtn.classList.add("playing");
          isPlaying = true;
        } else {
          bgmPlayer.pause();
          cdDiscMedia.style.animationPlayState = "paused";
          floatingBtn.classList.remove("playing");
          isPlaying = false;
        }
      });
    }
  },
);
