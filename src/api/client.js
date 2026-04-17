// src/api/client.js
// data.json에서 ETF 데이터를 읽어옴 (매일 자동 업데이트)

const BASE_URL = import.meta.env.BASE_URL || "/";
const WORKER_URL = import.meta.env.VITE_WORKER_URL || "";

export async function fetchETFData() {
  const res = await fetch(`${BASE_URL}data.json?t=${Date.now()}`);
  if (!res.ok) throw new Error("데이터 파일을 불러오지 못했습니다");
  return res.json();
}

export async function fetchETFPrices(symbols) {
  // Worker URL이 있으면 실시간 조회, 없으면 data.json 사용
  if (WORKER_URL) {
    const res = await fetch(`${WORKER_URL}/api/etf/prices?symbols=${symbols}`);
    if (!res.ok) throw new Error(`가격 조회 실패: ${res.status}`);
    const json = await res.json();
    return json.data || {};
  }
  // data.json fallback
  const data = await fetchETFData();
  const result = {};
  (data.prices || []).forEach(p => { result[p.symbol] = p; });
  return result;
}

export async function fetchAIRecommend({ profile, market, riskLevel }) {
  if (WORKER_URL) {
    const res = await fetch(`${WORKER_URL}/api/ai/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile, market, riskLevel }),
    });
    if (!res.ok) throw new Error(`AI 추천 실패: ${res.status}`);
    return res.json();
  }
  throw new Error("Worker URL이 설정되지 않았습니다");
}
