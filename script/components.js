const NAV_ITEMS = [
  { key: "myProfile", href: "myProfile.html", label: "INTRODUCE" },
  { key: "myClass", href: "myClass.html", label: "CLASS" },
  { key: "myHoliday", href: "myHoliday.html", label: "HOLIDAY" },
  { key: "myTrip", href: "myTrip.html", label: "TRIP" },
  { key: "signUp", href: "signUp.html", label: "SIGNUP" },
];

customElements.define(
  "site-header",
  class extends HTMLElement {
    connectedCallback() {
      const active = this.getAttribute("active");
      this.innerHTML = `
        <header class="topbar">
          <a href="index.html" class="brand">
          <span>SKALA</span>
          <span>FRONT</span>
          </a>
          <nav>
            ${NAV_ITEMS.map(
              (item) =>
                `<a href="${item.href}"${item.key === active ? ' class="active"' : ""}>${item.label}</a>`,
            ).join("\n")}
          </nav>
          <div class="utility">MINCHAE HWANG</div>
        </header>`;
    }
  },
);

customElements.define(
  "site-footer",
  class extends HTMLElement {
    connectedCallback() {
      const note = this.getAttribute("note");
      this.innerHTML = `
        <footer class="page-footer">
          <p>이메일 문의: minchaeh217@gmail.com</p>
          <p>© 2026 황민채 포트폴리오. 모든 내용은 학습 목적을 위해 작성되었습니다.</p>
          ${note ? `<p>${note}</p>` : ""}
        </footer>`;
    }
  },
);
