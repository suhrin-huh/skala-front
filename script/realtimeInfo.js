// realtimeInfo.js
// 화면(DOM) 담당 모듈. weatherAPI.js의 fetchWeather()를 import해서
// 도시 선택(change 이벤트) → 로딩 표시 → 실시간 기온/습도 렌더링까지 처리한다.

import { fetchWeather } from "./weatherAPI.js";

const citySelect = document.getElementById("citySelect");
const weatherBox = document.getElementById("weather-box");

const cityData = {
  seoul: { name: "대한민국 서울 KR", lat: 37.57, lon: 126.98 },
  tokyo: { name: "일본 도쿄 JP", lat: 35.68, lon: 139.69 },
  paris: { name: "프랑스 파리 FR", lat: 48.85, lon: 2.35 },
  newyork: { name: "미국 뉴욕 US", lat: 40.71, lon: -74.01 },
  london: { name: "영국 런던 GB", lat: 51.51, lon: -0.13 },
};

function renderLoading(cityName) {
  weatherBox.innerHTML = `
    <p class="weather-box-title">📍 ${cityName} 정보</p>
    <p class="weather-loading">실시간 날씨 로딩 중... ⏳</p>
  `;
}

function renderWeather(cityName, temperature, humidity) {
  weatherBox.innerHTML = `
    <p class="weather-box-title">🌍 ${cityName} 실시간 날씨</p>
    <ul class="weather-box-list">
      <li>🌡️ 현재 기온: ${temperature}°C</li>
      <li>💧 현재 습도: ${humidity}%</li>
    </ul>
  `;
}

function renderError(cityName) {
  weatherBox.innerHTML = `
    <p class="weather-box-title">📍 ${cityName} 정보</p>
    <p class="weather-error">날씨 정보를 불러오지 못했어요. 잠시 후 다시 시도해주세요.</p>
  `;
}

async function updateWeather(cityKey) {
  const city = cityData[cityKey];

  if (!city) return;

  renderLoading(city.name);

  try {
    const { temperature, humidity } = await fetchWeather(city.lat, city.lon);
    renderWeather(city.name, temperature, humidity);
  } catch (error) {
    renderError(city.name);
  }
}

if (citySelect && weatherBox) {
  citySelect.addEventListener("change", (event) => {
    updateWeather(event.target.value);
  });

  // 페이지 로드 시 현재 선택된 도시(select 기본값) 날씨를 바로 불러온다.
  updateWeather(citySelect.value);
}
