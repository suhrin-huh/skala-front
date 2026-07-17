// weatherAPI.js
// 데이터(fetch) 담당 모듈. 화면(DOM)은 건드리지 않고
// Open-Meteo 무료 API로부터 날씨 데이터만 받아서 반환한다.

export async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("날씨 데이터를 불러오지 못했습니다.");
  }

  const data = await response.json();

  return {
    temperature: data.current.temperature_2m,
    humidity: data.current.relative_humidity_2m,
  };
}
