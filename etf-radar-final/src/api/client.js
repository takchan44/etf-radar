// src/api/client.js
// 배포 후 WORKER_URL을 실제 Cloudflare Worker URL로 변경하세요

const WORKER_URL = import.meta.env.VITE_WORKER_URL || "https://etf-radar-api.YOUR_SUBDOMAIN.workers.dev";

export async function fetchETFPrices(symbols) {
  const res = await fetch(`${WORKER_URL}/api/etf/prices?symbols=${symbols}`);
  if (!res.ok) throw new Error(`가격 조회 실패: ${res.status}`);
  const json = await res.json();
  return json.data || {};
}

export async function fetchAIRecommend({ profile, market, riskLevel }) {
  const res = await fetch(`${WORKER_URL}/api/ai/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, market, riskLevel }),
  });
  if (!res.ok) throw new Error(`AI 추천 실패: ${res.status}`);
  return res.json();
}

export async function fetchETFList() {
  const res = await fetch(`${WORKER_URL}/api/etf/list`);
  if (!res.ok) throw new Error(`ETF 목록 조회 실패: ${res.status}`);
  return res.json();
}
