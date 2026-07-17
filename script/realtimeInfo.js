// realtimeInfo.js
// 화면(DOM) 담당 모듈. weatherAPI.js의 fetchWeather()를 import해서
// 지도 위 핀 렌더링 → 핀 클릭 시 모달(실시간 시각 + 기온/습도) 표시까지 처리한다.

import { fetchWeather } from "./weatherAPI.js";

const CITIES = [
  {
    id: "seoul",
    name: "대한민국 서울 KR",
    lat: 37.57,
    lon: 126.98,
    timezone: "Asia/Seoul",
    mapPosition: { xPct: 80, yPct: 41 },
  },
  {
    id: "tokyo",
    name: "일본 도쿄 JP",
    lat: 35.68,
    lon: 139.69,
    timezone: "Asia/Tokyo",
    mapPosition: { xPct: 84, yPct: 41 },
  },
  {
    id: "paris",
    name: "프랑스 파리 FR",
    lat: 48.85,
    lon: 2.35,
    timezone: "Europe/Paris",
    mapPosition: { xPct: 47, yPct: 36 },
  },
  {
    id: "newyork",
    name: "미국 뉴욕 US",
    lat: 40.71,
    lon: -74.01,
    timezone: "America/New_York",
    mapPosition: { xPct: 30, yPct: 41 },
  },
  {
    id: "london",
    name: "영국 런던 GB",
    lat: 51.51,
    lon: -0.13,
    timezone: "Europe/London",
    mapPosition: { xPct: 46, yPct: 34 },
  },
];

const PIN_ICON = `
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12 22s-7-6.5-7-12A7 7 0 0 1 12 3a7 7 0 0 1 7 7c0 5.5-7 12-7 12Zm0-9.4a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z"
    />
  </svg>
`;

const worldMap = document.getElementById("worldMap");

if (worldMap) {
  let openModal = null;
  let openPin = null;
  let clockIntervalId = null;

  CITIES.forEach((city) => {
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = "map-pin";
    pin.style.left = `${city.mapPosition.xPct}%`;
    pin.style.top = `${city.mapPosition.yPct}%`;
    pin.setAttribute("aria-label", `${city.name} 실시간 정보 보기`);
    pin.setAttribute("aria-expanded", "false");
    pin.innerHTML = PIN_ICON;

    pin.addEventListener("click", (event) => {
      event.stopPropagation();

      // 같은 핀을 다시 누르면 닫기
      if (openPin === pin) {
        closeModal();
        return;
      }

      openCityModal(city, pin);
    });

    worldMap.appendChild(pin);
  });

  document.addEventListener("click", () => {
    closeModal();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeModal();
    }
  });

  function openCityModal(city, pinEl) {
    closeModal();

    const modal = document.createElement("div");
    modal.className = "city-modal";
    modal.setAttribute("role", "dialog");
    modal.addEventListener("click", (event) => event.stopPropagation());

    const [country, capital] = city.name.split(" ");

    modal.innerHTML = `
      <button type="button" class="city-modal-close" aria-label="닫기">✕</button>
      <p class="city-modal-title">${country}(${capital})</p>
      <p class="city-modal-time" id="cityModalTime"></p>
      <hr class="city-modal-divider" />
      <p class="weather-slot">
        <span class="city-modal-loading">실시간 날씨 로딩 중... ⏳</span>
      </p>
    `;

    positionModal(modal, city.mapPosition);

    modal
      .querySelector(".city-modal-close")
      .addEventListener("click", closeModal);

    worldMap.appendChild(modal);

    pinEl.setAttribute("aria-expanded", "true");

    openModal = modal;
    openPin = pinEl;

    startClock(city.timezone);
    loadWeather(city);
  }

  function closeModal() {
    if (!openModal) return;

    if (clockIntervalId) {
      clearInterval(clockIntervalId);
      clockIntervalId = null;
    }

    openPin?.setAttribute("aria-expanded", "false");
    openModal.remove();
    openModal = null;
    openPin = null;
  }

  function positionModal(modal, mapPosition) {
    modal.style.left = `${mapPosition.xPct}%`;
    modal.style.top = `${mapPosition.yPct}%`;

    const horizontal =
      mapPosition.xPct > 75
        ? "right"
        : mapPosition.xPct < 25
          ? "left"
          : "center";
    const vertical = mapPosition.yPct < 25 ? "below" : "above";

    const translateX =
      horizontal === "right" ? "-100%" : horizontal === "left" ? "0%" : "-50%";
    const translateY = vertical === "above" ? "calc(-100% - 0.9rem)" : "0.9rem";

    modal.style.transform = `translate(${translateX}, ${translateY})`;
  }

  function startClock(timezone) {
    const timeEl = document.getElementById("cityModalTime");
    if (!timeEl) return;

    function tick() {
      timeEl.textContent = getCityTimeString(timezone);
    }

    tick();
    clockIntervalId = setInterval(tick, 1000);
  }

  async function loadWeather(city) {
    const slot = openModal?.querySelector(".weather-slot");
    if (!slot) return;

    try {
      const { temperature, humidity } = await fetchWeather(city.lat, city.lon);

      // 모달이 그 사이 닫혔으면 무시
      if (!openModal || !openModal.contains(slot)) return;

      slot.innerHTML = `
        <ul class="city-modal-list">
          <li> 현재 기온: ${temperature}°C</li>
          <li> 현재 습도: ${humidity}%</li>
        </ul>
      `;
    } catch (error) {
      if (!openModal || !openModal.contains(slot)) return;

      slot.innerHTML = `
        <span class="city-modal-error">날씨 정보를 불러오지 못했어요.</span>
      `;
    }
  }

  function getCityTimeString(timezone) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).formatToParts(new Date());

    const get = (type) => parts.find((p) => p.type === type)?.value ?? "";

    return `${get("year")}.${get("month")}.${get("day")} ${get("hour")}:${get(
      "minute",
    )}`;
  }
}
