// <guestbook-panel> 웹 컴포넌트.
// index.html NEWS 아래에 표시되는 방명록(이름 + 내용) 목록과 작성 폼을 담당한다.
// Supabase 연동 실패가 패널 자체의 렌더링을 막지 않도록 동적 import()로 지연 로드한다.

function createGuestbookEntry(entry) {
  const li = document.createElement("li");
  li.className = "guestbook-entry";

  const name = document.createElement("span");
  name.className = "guestbook-name";
  name.textContent = entry.author;

  const message = document.createElement("p");
  message.className = "guestbook-message";
  message.textContent = entry.content;

  const date = document.createElement("span");
  date.className = "guestbook-date";
  date.textContent = entry.created_at_display || "";

  li.append(name, message, date);
  return li;
}

function createStatusItem(message) {
  const li = document.createElement("li");
  li.className = "guestbook-status";
  li.textContent = message;
  return li;
}

customElements.define(
  "guestbook-panel",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <section class="panel guestbook-panel-inner">
          <div class="panel-header guestbook-panel-header">
            <div class="guestbook-panel-header-text">
              <span class="eyebrow">GUESTBOOK</span>
              <h2 class="panel-title">방문록</h2>
              <p class="panel-desc">다녀가신 분들이 남겨주신 이야기예요.</p>
            </div>
            <button
              type="button"
              class="btn btn-primary btn-small"
              id="guestbookWriteBtn"
            >
              방명록 작성하기
            </button>
          </div>
          <ul class="guestbook-list" id="guestbookList"></ul>

          <!-- 로그인 필요 안내 모달 -->
          <div class="modal-backdrop" id="guestbookLoginModal">
            <div
              class="modal-box modal-box--form"
              role="dialog"
              aria-modal="true"
              aria-label="로그인 필요"
            >
              <button
                class="modal-close"
                id="guestbookLoginCloseBtn"
                aria-label="닫기"
              >
                ×
              </button>
              <h2 class="modal-title">로그인이 필요합니다</h2>
              <p class="modal-desc">방명록은 로그인한 회원만 남길 수 있어요.</p>
              <p class="modal-desc">
                아래 버튼을 누르면 회원가입 페이지로 이동합니다.
              </p>
              <div class="modal-actions">
                <button
                  type="button"
                  class="btn btn-primary btn-nav"
                  id="guestbookLoginConfirmBtn"
                >
                  확인
                </button>
              </div>
            </div>
          </div>

          <!-- 방명록 작성 모달 -->
          <div class="modal-backdrop" id="guestbookWriteModal">
            <div
              class="modal-box modal-box--form"
              role="dialog"
              aria-modal="true"
              aria-label="방명록 작성"
            >
              <button
                class="modal-close"
                id="guestbookWriteCloseBtn"
                aria-label="닫기"
              >
                ×
              </button>
              <h2 class="modal-title">방명록 작성하기</h2>
              <p class="modal-desc">
                남기고 싶은 이야기를 자유롭게 적어주세요.
              </p>
              <textarea
                class="form-control guestbook-write-textarea"
                id="guestbookWriteTextarea"
                rows="4"
                maxlength="300"
                placeholder="여기에 내용을 입력하세요"
              ></textarea>
              <p
                class="form-error-message"
                id="guestbookWriteError"
                hidden
              ></p>
              <div class="modal-actions modal-actions--confirm">
                <button
                  type="button"
                  class="btn btn-secondary btn-nav"
                  id="guestbookWriteCancelBtn"
                >
                  취소
                </button>
                <button
                  type="button"
                  class="btn btn-primary btn-nav"
                  id="guestbookWriteSubmitBtn"
                >
                  등록하기
                </button>
              </div>
            </div>
          </div>
        </section>
      `;

      this.listEl = this.querySelector("#guestbookList");
      this.loginModal = this.querySelector("#guestbookLoginModal");
      this.writeModal = this.querySelector("#guestbookWriteModal");
      this.writeTextarea = this.querySelector("#guestbookWriteTextarea");
      this.writeError = this.querySelector("#guestbookWriteError");
      this.writeSubmitBtn = this.querySelector("#guestbookWriteSubmitBtn");

      this.bindEvents();
      this.loadList();
    }

    openModal(modalEl) {
      modalEl.classList.add("open");
      requestAnimationFrame(() => {
        modalEl.classList.add("show");
      });
      document.body.style.overflow = "hidden";
    }

    closeModal(modalEl) {
      modalEl.classList.remove("show");
      document.body.style.overflow = "";
      setTimeout(() => {
        modalEl.classList.remove("open");
      }, 250);
    }

    bindEvents() {
      const writeBtn = this.querySelector("#guestbookWriteBtn");
      const loginCloseBtn = this.querySelector("#guestbookLoginCloseBtn");
      const loginConfirmBtn = this.querySelector("#guestbookLoginConfirmBtn");
      const writeCloseBtn = this.querySelector("#guestbookWriteCloseBtn");
      const writeCancelBtn = this.querySelector("#guestbookWriteCancelBtn");

      writeBtn.addEventListener("click", () => this.handleWriteBtnClick());

      loginCloseBtn.addEventListener("click", () =>
        this.closeModal(this.loginModal),
      );
      loginConfirmBtn.addEventListener("click", () => {
        window.location.href = "signUp.html";
      });
      this.loginModal.addEventListener("click", (e) => {
        if (e.target === this.loginModal) this.closeModal(this.loginModal);
      });

      writeCloseBtn.addEventListener("click", () =>
        this.closeModal(this.writeModal),
      );
      writeCancelBtn.addEventListener("click", () =>
        this.closeModal(this.writeModal),
      );
      this.writeModal.addEventListener("click", (e) => {
        if (e.target === this.writeModal) this.closeModal(this.writeModal);
      });
      this.writeSubmitBtn.addEventListener("click", () =>
        this.handleWriteSubmit(),
      );

      document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (this.loginModal.classList.contains("open")) {
          this.closeModal(this.loginModal);
        }
        if (this.writeModal.classList.contains("open")) {
          this.closeModal(this.writeModal);
        }
      });
    }

    async loadList() {
      this.listEl.replaceChildren(
        createStatusItem("방명록을 불러오는 중..."),
      );
      try {
        const { getGuestbookList } = await import("/supabase/action.js");
        const result = await getGuestbookList();
        if (!result.success) {
          this.listEl.replaceChildren(
            createStatusItem("알 수 없는 오류가 발생하였습니다."),
          );
          return;
        }
        if (!result.list || result.list.length === 0) {
          this.listEl.replaceChildren(
            createStatusItem(
              "아직 작성된 방명록이 없어요. 첫 번째 이야기를 남겨보세요!",
            ),
          );
          return;
        }
        this.listEl.replaceChildren(
          ...result.list.map((entry) => createGuestbookEntry(entry)),
        );
      } catch {
        this.listEl.replaceChildren(
          createStatusItem("알 수 없는 오류가 발생하였습니다."),
        );
      }
    }

    async handleWriteBtnClick() {
      try {
        const { getCurrentUser } = await import("/supabase/action.js");
        const user = await getCurrentUser();
        if (user) {
          this.writeError.hidden = true;
          this.writeError.textContent = "";
          this.writeTextarea.value = "";
          this.openModal(this.writeModal);
        } else {
          this.openModal(this.loginModal);
        }
      } catch {
        // 로그인 여부 확인 자체가 안 되는 상황(연동 미설정 등)도
        // 회원가입 안내로 유도한다.
        this.openModal(this.loginModal);
      }
    }

    async handleWriteSubmit() {
      const content = this.writeTextarea.value.trim();
      this.writeError.hidden = true;
      this.writeError.textContent = "";

      this.writeSubmitBtn.disabled = true;
      try {
        const { addGuestbookEntry } = await import("/supabase/action.js");
        const result = await addGuestbookEntry(content);
        if (result.success) {
          this.writeTextarea.value = "";
          this.closeModal(this.writeModal);
          this.loadList();
        } else {
          this.writeError.textContent = "알 수 없는 오류가 발생하였습니다.";
          this.writeError.hidden = false;
        }
      } catch {
        this.writeError.textContent = "알 수 없는 오류가 발생하였습니다.";
        this.writeError.hidden = false;
      } finally {
        this.writeSubmitBtn.disabled = false;
      }
    }
  },
);
