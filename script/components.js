const NAV_ITEMS = [
  { key: "myProfile", href: "myProfile.html", label: "PROFILE" },
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
          <div class="utility">
            <a href="login.html" class="utility-auth" id="utilityAuth">로그인</a>
          </div>
        </header>`;

      this.refreshAuthState();
    }

    // Supabase 연동 실패가 헤더 자체의 렌더링을 막지 않도록 동적 import()로 지연 로드한다.
    async refreshAuthState() {
      try {
        const { getCurrentUser } = await import("/supabase/action.js");
        const user = await getCurrentUser();
        if (user) this.renderLoggedIn();
      } catch {
        // Supabase 연동이 안 되는 상황에서는 기본값(로그인 링크)을 그대로 둔다.
      }
    }

    renderLoggedIn() {
      const authEl = this.querySelector("#utilityAuth");
      if (!authEl) return;

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "utility-auth";
      btn.id = "utilityAuth";
      btn.textContent = "로그아웃";
      btn.addEventListener("click", async () => {
        btn.disabled = true;
        try {
          const { signOut } = await import("/supabase/action.js");
          await signOut();
        } finally {
          window.location.href = "index.html";
        }
      });
      authEl.replaceWith(btn);
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

// URL 해시(#id)로 진입했을 때 스크롤뿐 아니라 키보드 포커스도 함께 옮긴다.
document.addEventListener("DOMContentLoaded", () => {
  if (!location.hash) return;

  let target;
  try {
    target = document.querySelector(location.hash);
  } catch {
    return;
  }
  if (!target) return;

  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }
  target.focus();
});
