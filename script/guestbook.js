// <guestbook-panel> 웹 컴포넌트.
// index.html NEWS 아래에 표시되는 방문록(이름 + 내용) 목록을 담당한다.

const GUESTBOOK_ENTRIES = [
  {
    name: "지나가던 개발자",
    message:
      "여행 앨범 카드 뒤집는 인터랙션 재밌게 봤어요! CD 플레이어 디테일까지 살아있네요.",
  },
  {
    name: "익명",
    message: "프로필 페이지 프로젝트 설명이 자세해서 좋았습니다. 화이팅하세요!",
  },
  {
    name: "동료 스터디원",
    message: "휴일 파노라마 타임라인 아이디어 정말 좋네요. 저도 따라 만들어보고 싶어요.",
  },
];

function createGuestbookEntry(entry) {
  const li = document.createElement("li");
  li.className = "guestbook-entry";
  li.innerHTML = `
    <span class="guestbook-name">${entry.name}</span>
    <p class="guestbook-message">${entry.message}</p>
  `;
  return li;
}

customElements.define(
  "guestbook-panel",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <section class="panel guestbook-panel-inner">
          <div class="panel-header">
            <span class="eyebrow">GUESTBOOK</span>
            <h2 class="panel-title">방문록</h2>
            <p class="panel-desc">다녀가신 분들이 남겨주신 이야기예요.</p>
          </div>
          <ul class="guestbook-list"></ul>
        </section>
      `;

      const list = this.querySelector(".guestbook-list");
      GUESTBOOK_ENTRIES.forEach((entry) => {
        list.appendChild(createGuestbookEntry(entry));
      });
    }
  },
);
