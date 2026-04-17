// src/components/ActiveETF.jsx
// 거래량 상위, 52주 신고가/신저가, 단기 급등/급락 ETF 정리

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";

const ETF_META = {
  SPY:  { name: "S&P 500",           market: "us" },
  VOO:  { name: "S&P 500 Vanguard",  market: "us" },
  QQQ:  { name: "나스닥 100",          market: "us" },
  VTI:  { name: "미국 전체 주식",       market: "us" },
  DIA:  { name: "다우존스 30",          market: "us" },
  IWM:  { name: "Russell 2000",       market: "us" },
  TQQQ: { name: "나스닥 3배 레버리지",   market: "us" },
  SQQQ: { name: "나스닥 3배 인버스",     market: "us" },
  UPRO: { name: "S&P500 3배 레버리지",  market: "us" },
  SPXU: { name: "S&P500 3배 인버스",   market: "us" },
  ARKK: { name: "ARK 혁신 ETF",        market: "us" },
  SOXX: { name: "반도체 iShares",       market: "us" },
  SMH:  { name: "반도체 VanEck",        market: "us" },
  XLK:  { name: "기술 섹터",            market: "us" },
  XLE:  { name: "에너지 섹터",           market: "us" },
  XLF:  { name: "금융 섹터",            market: "us" },
  GLD:  { name: "금 SPDR",             market: "us" },
  TLT:  { name: "20년+ 미국채",         market: "us" },
  EEM:  { name: "신흥국 iShares",       market: "global" },
  FXI:  { name: "중국 대형주",           market: "global" },
};

const CATEGORIES = [
  { id: "volume",   label: "거래량 상위" },
  { id: "high52",   label: "52주 신고가" },
  { id: "low52",    label: "52주 신저가" },
  { id: "surge",    label: "단기 급등" },
  { id: "plunge",   label: "단기 급락" },
];

function getRank(prices, category) {
  const entries = Object.entries(prices).filter(([, v]) => v && !v.error && v.price > 0);

  switch (category) {
    case "volume":
      return [...entries]
        .sort((a, b) => (b[1].volume || 0) - (a[1].volume || 0))
        .slice(0, 10);
    case "surge":
      return [...entries]
        .filter(([, v]) => (v.changePct || 0) > 0)
        .sort((a, b) => (b[1].changePct || 0) - (a[1].changePct || 0))
        .slice(0, 10);
    case "plunge":
      return [...entries]
        .filter(([, v]) => (v.changePct || 0) < 0)
        .sort((a, b) => (a[1].changePct || 0) - (b[1].changePct || 0))
        .slice(0, 10);
    case "high52":
      return [...entries]
        .sort((a, b) => (b[1].changePct || 0) - (a[1].changePct || 0))
        .slice(0, 10);
    case "low52":
      return [...entries]
        .sort((a, b) => (a[1].changePct || 0) - (b[1].changePct || 0))
        .slice(0, 10);
    default:
      return [];
  }
}

function Badge({ value }) {
  const isUp = value >= 0;
  return (
    <span style={{
      fontSize: "13px", fontWeight: 600,
      padding: "3px 10px", borderRadius: "6px",
      color: isUp ? "#16A34A" : "#DC2626",
      background: isUp ? "#F0FDF4" : "#FEF2F2",
      border: `1.5px solid ${isUp ? "#BBF7D0" : "#FECACA"}`,
    }}>
      {isUp ? "▲" : "▼"} {Math.abs(value).toFixed(2)}%
    </span>
  );
}

function RankTable({ items, category }) {
  if (items.length === 0) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontSize: "14px" }}>
        데이터를 불러오는 중입니다. 대시보드 탭에서 새로고침 해주세요.
      </div>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead>
          <tr style={{ borderBottom: `2px solid ${BLUE_BORDER}`, background: BLUE_LIGHT }}>
            {["순위", "종목", "이름", "현재가", "등락률", category === "volume" ? "거래량" : "시장"].map((h) => (
              <th key={h} style={{
                padding: "12px 16px", textAlign: "left",
                fontSize: "12px", color: BLUE, fontWeight: 700,
              }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map(([symbol, data], i) => {
            const meta = ETF_META[symbol];
            const isUp = (data.changePct || 0) >= 0;
            return (
              <tr key={symbol} style={{
                borderBottom: `1px solid ${GRAY_BORDER}`,
                background: i % 2 === 0 ? "#fff" : "#F9FAFB",
                transition: "background 0.1s",
              }}
              onMouseOver={e => e.currentTarget.style.background = BLUE_LIGHT}
              onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#F9FAFB"}
              >
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: i < 3 ? BLUE : "#E5E7EB",
                    color: i < 3 ? "#fff" : "#6B7280",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: 700,
                  }}>
                    {i + 1}
                  </span>
                </td>
                <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827" }}>{symbol}</td>
                <td style={{ padding: "14px 16px", color: "#6B7280" }}>{meta?.name || data.name || "-"}</td>
                <td style={{ padding: "14px 16px", fontWeight: 600, color: "#111827" }}>
                  ${(data.price || 0).toFixed(2)}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <Badge value={data.changePct || 0} />
                </td>
                <td style={{ padding: "14px 16px", color: "#6B7280" }}>
                  {category === "volume"
                    ? (data.volume || 0).toLocaleString()
                    : <span style={{
                        fontSize: "11px", padding: "2px 8px", borderRadius: "99px",
                        background: BLUE_LIGHT, color: BLUE, border: `1px solid ${BLUE_BORDER}`,
                        fontWeight: 600,
                      }}>
                        {meta?.market === "us" ? "미국" : meta?.market === "korea" ? "한국" : "글로벌"}
                      </span>
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ActiveETF({ prices }) {
  const [category, setCategory] = useState("volume");
  const ranked = getRank(prices, category);

  const summaryStats = {
    surge: Object.values(prices).filter(p => (p?.changePct || 0) >= 2).length,
    plunge: Object.values(prices).filter(p => (p?.changePct || 0) <= -2).length,
    topVolume: Object.values(prices).reduce((max, p) => Math.max(max, p?.volume || 0), 0),
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 요약 카드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "14px" }}>
        {[
          { label: "2% 이상 급등 종목", value: summaryStats.surge, color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
          { label: "2% 이상 급락 종목", value: summaryStats.plunge, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
          { label: "최고 거래량", value: summaryStats.topVolume > 0 ? (summaryStats.topVolume / 1e6).toFixed(1) + "M" : "-", color: BLUE, bg: BLUE_LIGHT, border: BLUE_BORDER },
          { label: "조회 종목 수", value: Object.keys(prices).length, color: "#6B7280", bg: "#F9FAFB", border: GRAY_BORDER },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} style={{
            background: bg, border: `1.5px solid ${border}`,
            borderRadius: "10px", padding: "18px 20px",
          }}>
            <div style={{ fontSize: "12px", color, marginBottom: "6px", fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: "28px", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* 카테고리 탭 */}
      <div style={{
        background: "#fff", border: `1.5px solid ${GRAY_BORDER}`,
        borderRadius: "10px", overflow: "hidden",
      }}>
        <div style={{
          display: "flex", borderBottom: `2px solid ${GRAY_BORDER}`,
          padding: "0 16px", gap: "4px", background: "#F9FAFB",
        }}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              style={{
                padding: "12px 18px", border: "none",
                borderBottom: category === cat.id ? `3px solid ${BLUE}` : "3px solid transparent",
                background: category === cat.id ? BLUE_LIGHT : "transparent",
                color: category === cat.id ? BLUE : "#6B7280",
                cursor: "pointer", fontSize: "13px",
                fontWeight: category === cat.id ? 700 : 400,
                transition: "all 0.15s",
                outline: category === cat.id ? `2px solid ${BLUE_BORDER}` : "none",
                outlineOffset: "-2px",
                borderRadius: category === cat.id ? "6px 6px 0 0" : "0",
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "0" }}>
          <RankTable items={ranked} category={category} />
        </div>
      </div>

      <div style={{ fontSize: "12px", color: "#9CA3AF", textAlign: "center" }}>
        * 현재 조회된 종목 기준 / 52주 신고가·신저가는 당일 등락률 기준으로 표시됩니다
      </div>
    </div>
  );
}

import { useState } from "react";
