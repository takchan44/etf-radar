// src/api/client.js

const WORKER_URL = import.meta.env.VITE_WORKER_URL || "";

export async function fetchETFData() {
  // 여러 경로 시도
  const paths = ["/data.json", "./data.json", "../public/data.json"];
  for (const p of paths) {
    try {
      const res = await fetch(`${p}?t=${Date.now()}`);
      if (res.ok) return res.json();
    } catch {}
  }
  throw new Error("데이터 파일을 불러오지 못했습니다");
}

export async function fetchETFPrices(symbols) {
  if (WORKER_URL) {
    const res = await fetch(`${WORKER_URL}/api/etf/prices?symbols=${symbols}`);
    if (!res.ok) throw new Error(`가격 조회 실패: ${res.status}`);
    const json = await res.json();
    return json.data || {};
  }
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
