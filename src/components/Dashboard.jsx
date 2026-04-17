import { useState } from "react";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";
const GRAY_LIGHT = "#F9FAFB";

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
      background: "#fff",
      border: `1.5px solid ${GRAY_BORDER}`,
      borderTop: `4px solid ${BLUE}`,
      borderRadius: "10px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      transition: "box-shadow 0.15s, border-color 0.15s",
      cursor: "default",
    }}
    onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.12)"}
    onMouseOut={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "20px", fontWeight: 700, color: "#111827" }}>{symbol}</div>
          <div style={{ fontSize: "12px", color: "#6B7280", marginTop: "2px" }}>
            {data?.name || meta.desc}
          </div>
        </div>
        <span style={{
          fontSize: "11px", padding: "3px 10px", borderRadius: "99px",
          background: BLUE_LIGHT, color: BLUE,
          border: `1.5px solid ${BLUE_BORDER}`, fontWeight: 600,
        }}>
          {meta.sector}
        </span>
      </div>

      {data?.error ? (
        <div style={{ fontSize: "13px", color: "#9CA3AF" }}>데이터 없음</div>
      ) : (
        <>
          <div style={{ fontSize: "26px", fontWeight: 700, color: "#111827" }}>
            {data?.currency === "KRW"
              ? `₩${(data?.price || 0).toLocaleString()}`
              : `$${(data?.price || 0).toFixed(2)}`}
          </div>
          <div style={{
            fontSize: "14px", fontWeight: 600,
            color: isUp ? "#16A34A" : "#DC2626",
            padding: "4px 10px", borderRadius: "6px",
            background: isUp ? "#F0FDF4" : "#FEF2F2",
            border: `1.5px solid ${isUp ? "#BBF7D0" : "#FECACA"}`,
            display: "inline-block",
          }}>
            {isUp ? "▲" : "▼"} {Math.abs(data?.changePct || 0).toFixed(2)}%
            <span style={{ fontWeight: 400, marginLeft: "6px" }}>
              ({isUp ? "+" : ""}{(data?.change || 0).toFixed(2)})
            </span>
          </div>
          <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
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
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {["all", "us", "korea", "global"].map((m) => (
          <button
            key={m}
            onClick={() => setFilter(m)}
            style={{
              padding: "7px 18px", borderRadius: "8px",
              border: filter === m ? `2px solid ${BLUE}` : `2px solid ${GRAY_BORDER}`,
              background: filter === m ? BLUE_LIGHT : "#fff",
              color: filter === m ? BLUE : "#374151",
              cursor: "pointer", fontSize: "13px", fontWeight: filter === m ? 700 : 400,
              transition: "all 0.15s",
            }}
          >
            {m === "all" ? "전체" : MARKET_LABELS[m]}
          </button>
        ))}
        {loading && (
          <span style={{ fontSize: "13px", color: "#9CA3AF", alignSelf: "center" }}>
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
          marginTop: "28px", padding: "20px 24px",
          background: "#fff",
          border: `1.5px solid ${GRAY_BORDER}`,
          borderRadius: "10px",
          display: "flex", gap: "40px", flexWrap: "wrap",
        }}>
          {[
            { label: "상승 종목", value: Object.values(prices).filter(p => (p.changePct || 0) > 0).length, color: "#16A34A" },
            { label: "하락 종목", value: Object.values(prices).filter(p => (p.changePct || 0) < 0).length, color: "#DC2626" },
            { label: "조회 종목 수", value: Object.keys(prices).length, color: BLUE },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{ fontSize: "12px", color: "#6B7280", marginBottom: "4px" }}>{label}</div>
              <div style={{ fontSize: "26px", fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
