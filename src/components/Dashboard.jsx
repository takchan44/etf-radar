// src/components/Dashboard.jsx
const MARKET_LABELS = { us: "미국", korea: "한국", global: "글로벌" };

const ETF_META = {
  SPY:  { market: "us",     sector: "전체시장",  desc: "S&P 500 추종" },
  QQQ:  { market: "us",     sector: "기술",      desc: "나스닥 100 추종" },
  IWM:  { market: "us",     sector: "소형주",    desc: "Russell 2000 추종" },
  DIA:  { market: "us",     sector: "전체시장",  desc: "다우존스 추종" },
  VTI:  { market: "us",     sector: "전체시장",  desc: "전체 미국 주식시장" },
  ARKK: { market: "us",     sector: "혁신",      desc: "파괴적 혁신 기업" },
  VEA:  { market: "global", sector: "선진국",    desc: "미국 제외 선진국" },
  EEM:  { market: "global", sector: "신흥국",    desc: "신흥 시장 추종" },
  ACWI: { market: "global", sector: "전체시장",  desc: "전 세계 주식시장" },
};

function ETFCard({ symbol, data }) {
  const meta = ETF_META[symbol] || { market: "us", sector: "기타", desc: "" };
  const isUp = (data?.changePct || 0) >= 0;

  return (
    <div style={{
      background: "var(--color-background-primary)",
      border: "1px solid var(--color-border-tertiary)",
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "18px", fontWeight: 500, color: "var(--color-text-primary)" }}>{symbol}</div>
          <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)", marginTop: "2px" }}>
            {data?.name || meta.desc}
          </div>
        </div>
        <span style={{
          fontSize: "11px", padding: "3px 8px", borderRadius: "99px",
          background: "var(--color-background-secondary)",
          color: "var(--color-text-secondary)",
        }}>
          {meta.sector}
        </span>
      </div>

      {data?.error ? (
        <div style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>데이터 없음</div>
      ) : (
        <>
          <div style={{ fontSize: "24px", fontWeight: 500, color: "var(--color-text-primary)" }}>
            {data?.currency === "KRW"
              ? `₩${(data?.price || 0).toLocaleString()}`
              : `$${(data?.price || 0).toFixed(2)}`}
          </div>
          <div style={{
            fontSize: "14px", fontWeight: 500,
            color: isUp ? "var(--color-text-success)" : "var(--color-text-danger)",
          }}>
            {isUp ? "▲" : "▼"} {Math.abs(data?.changePct || 0).toFixed(2)}%
            <span style={{ fontWeight: 400, marginLeft: "6px" }}>
              ({isUp ? "+" : ""}{(data?.change || 0).toFixed(2)})
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
            거래량: {(data?.volume || 0).toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
}

export default function Dashboard({ prices, loading }) {
  const [filter, setFilter] = useState("all");
  const symbols = Object.keys(ETF_META).filter((s) =>
    filter === "all" ? true : ETF_META[s].market === filter
  );

  return (
    <div>
      {/* Filter */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {["all", "us", "korea", "global"].map((m) => (
          <button
            key={m}
            onClick={() => setFilter(m)}
            style={{
              padding: "6px 14px", borderRadius: "99px",
              border: `1px solid ${filter === m ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`,
              background: filter === m ? "var(--color-background-secondary)" : "transparent",
              color: filter === m ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              cursor: "pointer", fontSize: "13px",
            }}
          >
            {m === "all" ? "전체" : MARKET_LABELS[m]}
          </button>
        ))}
        {loading && (
          <span style={{ fontSize: "13px", color: "var(--color-text-tertiary)", alignSelf: "center" }}>
            데이터 로딩 중...
          </span>
        )}
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        gap: "16px",
      }}>
        {symbols.map((symbol) => (
          <ETFCard key={symbol} symbol={symbol} data={prices[symbol]} />
        ))}
      </div>

      {/* Summary */}
      {Object.keys(prices).length > 0 && (
        <div style={{
          marginTop: "24px", padding: "16px",
          background: "var(--color-background-primary)",
          border: "1px solid var(--color-border-tertiary)",
          borderRadius: "12px",
          display: "flex", gap: "32px", flexWrap: "wrap",
        }}>
          {[
            { label: "상승 종목", value: Object.values(prices).filter(p => (p.changePct || 0) > 0).length, color: "var(--color-text-success)" },
            { label: "하락 종목", value: Object.values(prices).filter(p => (p.changePct || 0) < 0).length, color: "var(--color-text-danger)" },
            { label: "조회 종목 수", value: Object.keys(prices).length, color: "var(--color-text-primary)" },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>{label}</div>
              <div style={{ fontSize: "22px", fontWeight: 500, color }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
