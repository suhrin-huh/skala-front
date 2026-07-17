// todoModal.js
// <todo-modal> 웹 컴포넌트. myClass.html 안에 있던
// TO-DO 모달(마크업 + 열기/닫기 로직)을 통째로 담당한다.

customElements.define(
  "todo-modal",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div class="todo-modal-overlay">
          <div class="todo-modal">
            <div class="todo-header">
              <div class="todo-title">과목명</div>
              <button class="close-btn">✖</button>
            </div>
            <div class="todo-body">
              <ul class="todo-list">
                <!-- 자바스크립트로 리스트가 렌더링 될 영역 -->
              </ul>
            </div>
          </div>
        </div>
      `;

      this.overlay = this.querySelector(".todo-modal-overlay");
      this.titleEl = this.querySelector(".todo-title");
      this.listEl = this.querySelector(".todo-list");
      this.closeBtn = this.querySelector(".close-btn");

      this.closeBtn.addEventListener("click", () => this.close());

      // 배경(오버레이) 클릭 시 닫힘
      this.overlay.addEventListener("click", (event) => {
        if (event.target === this.overlay) this.close();
      });
    }

    // 과목명과 TO-DO 리스트를 받아 모달을 열고 렌더링한다.
    open(subjectName, todos) {
      this.titleEl.innerText = subjectName;
      this.listEl.innerHTML = ""; // 기존 리스트 초기화

      const items =
        todos && todos.length
          ? todos
          : ["할 일이 아직 등록되지 않았습니다."];

      items.forEach((todo, index) => {
        const li = document.createElement("li");
        li.className = "todo-item";

        // 커스텀 체크박스와 텍스트를 담은 레이아웃 생성
        li.innerHTML = `
          <input type="checkbox" id="todo-${index}">
          <label class="todo-text" for="todo-${index}">${todo}</label>
        `;
        this.listEl.appendChild(li);
      });

      this.overlay.classList.add("active");
    }

    close() {
      this.overlay.classList.remove("active");
    }
  },
);
