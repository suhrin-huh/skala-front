// skillsPanel.js
// <skills-panel> 웹 컴포넌트. myProfile.html 안에 있던
// SKILLS 게이지 바 목록(마크업 + 데이터 + 스크롤 애니메이션)을 통째로 담당한다.

const SKILLS = [
  { label: "HTML / CSS", value: 95 },
  { label: "JavaScript", value: 94 },
  { label: "TypeScript", value: 92 },
  { label: "React", value: 94 },
  { label: "Next.js", value: 85 },
  { label: "React Native", value: 80 },
  { label: "Zustand", value: 90 },
  { label: "TanStack Query", value: 86 },
  { label: "Tailwind CSS", value: 88 },
];

function createSkillRow(skill) {
  const row = document.createElement("div");
  row.className = "skill-row";
  row.dataset.value = skill.value;
  row.innerHTML = `
    <div class="skill-top">
      <span class="skill-label">${skill.label}</span>
      <span class="skill-value">${skill.value}</span>
    </div>
    <div class="skill-track"><div class="skill-fill"></div></div>
  `;
  return row;
}

customElements.define(
  "skills-panel",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <div class="panel reveal">
          <div class="panel-header">
            <span class="eyebrow">SKILLS</span>
            <h2 class="panel-title">보유 기술</h2>
          </div>
          <div class="skills-list" id="skillsList"></div>
        </div>
      `;

      const list = this.querySelector("#skillsList");
      SKILLS.forEach((skill) => list.appendChild(createSkillRow(skill)));

      this.initGauges();
      this.initReveal();
    }

    // 스킬 게이지 바 애니메이션: 화면에 들어오면 실제 값까지 채운다
    initGauges() {
      const rows = this.querySelectorAll(".skill-row");

      if (!("IntersectionObserver" in window)) {
        rows.forEach((row) => {
          row.querySelector(".skill-fill").style.width =
            row.getAttribute("data-value") + "%";
        });
        return;
      }

      const gaugeObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const row = entry.target;
              const val = row.getAttribute("data-value");
              row.querySelector(".skill-fill").style.width = val + "%";
              gaugeObserver.unobserve(row);
            }
          });
        },
        { threshold: 0.4 },
      );
      rows.forEach((row) => gaugeObserver.observe(row));
    }

    // 스크롤 리빌: 컴포넌트가 비동기로 내용을 채우므로 리빌 관찰도 직접 관리한다
    initReveal() {
      const panel = this.querySelector(".reveal");
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduceMotion || !("IntersectionObserver" in window)) {
        panel.classList.add("in-view");
        return;
      }

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("in-view");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12 },
      );
      revealObserver.observe(panel);
    }
  },
);
