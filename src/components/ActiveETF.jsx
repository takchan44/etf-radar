import { useState } from "react";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";

const CATEGORIES = [
  { id: "trending_up",   label: "급상승",      icon: "▲", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  { id: "trending_down", label: "급하락",       icon: "▼", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  { id: "steady_growth", label: "꾸준한 성장",  icon: "→", color: BLUE,      bg: BLUE_LIGHT, border: BLUE_BORDER },
  { id: "near_52w_high", label: "52주 신고가",  icon: "★", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { id: "high_volume",   label: "거래량 상위",  icon: "◎", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
];

function ETFRow({ item, rank, category }) {
  const isUp = (item.changePct || 0) >= 0;
  return (
    <tr style={{ borderBottom: `1px solid ${GRAY_BORDER}`, transition: "background 0.1s" }}
      onMouseOver={e => e.currentTarget.style.background = BLUE_LIGHT}
      onMouseOut={e => e.currentTarget.style.background = rank % 2 === 0 ? "#F9FAFB" : "#fff"}
    >
      <td style={{ padding: "14px 16px" }}>
        <span style={{
          width: "28px", height: "28px", borderRadius: "50%",
          background: rank < 3 ? BLUE : "#E5E7EB",
          color: rank < 3 ? "#fff" : "#6B7280",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 700,
        }}>{rank + 1}</span>
      </td>
      <td style={{ padding: "14px 16px", fontWeight: 700, color: "#111827" }}>{item.symbol}</td>
      <td style={{ padding: "14px 16px", color: "#6B7280", fontSize: "13px" }}>{item.name}</td>
      <td style={{ padding: "14px 16px" }}>
        <span style={{
          fontSize: "13px", fontWeight: 600, padding: "3px 8px", borderRadius: "6px",
          color: isUp ? "#16A34A" : "#DC2626",
          background: isUp ? "#F0FDF4" : "#FEF2F2",
          border: `1.5px solid ${isUp ? "#BBF7D0" : "#FECACA"}`,
        }}>
          {isUp ? "▲" : "▼"} {Math.abs(item.changePct || 0).toFixed(2)}%
        </span>
      </td>
      {item.ret30d !== undefined && (
        <td style={{ padding: "14px 16px", color: (item.ret30d||0) >= 0 ? "#16A34A" : "#DC2626", fontWeight: 600 }}>
          {(item.ret30d||0) >= 0 ? "+" : ""}{(item.ret30d||0).toFixed(2)}%
        </td>
      )}
      <td style={{ padding: "14px 16px", color: "#6B7280", fontSize: "12px", maxWidth: "300px" }}>
        {item.reason || "-"}
      </td>
    </tr>
  );
}

export default function ActiveETF({ prices, etfData }) {
  const [category, setCategory] = useState("trending_up");
  const ai = etfData?.ai;
  const allPrices = Object.values(prices).filter(p => p && !p.error && (p.price || 0) > 0);

  // AI 데이터가 없으면 prices 기반으로 계산
  function getFallback(cat) {
    switch (cat) {
      case "trending_up":
        return [...allPrices].sort((a, b) => (b.changePct||0) - (a.changePct||0)).slice(0, 5)
          .map(p => ({ ...p, reason: "당일 상승률 상위 종목" }));
      case "trending_down":
        return [...allPrices].sort((a, b) => (a.changePct||0) - (b.changePct||0)).slice(0, 5)
          .map(p => ({ ...p, reason: "당일 하락률 상위 종목" }));
      case "steady_growth":
        return [...allPrices].filter(p => (p.ret30d||0) > 0)
          .sort((a, b) => (b.ret30d||0) - (a.ret30d||0)).slice(0, 5)
          .map(p => ({ ...p, reason: "30일 수익률 상위 종목" }));
      case "near_52w_high":
        return [...allPrices].filter(p => p.fromHigh !== undefined)
          .sort((a, b) => (b.fromHigh||0) - (a.fromHigh||0)).slice(0, 5)
          .map(p => ({ ...p, reason: "52주 고가 근접 종목" }));
      case "high_volume":
        return [...allPrices].sort((a, b) => (b.volume||0) - (a.volume||0)).slice(0, 5)
          .map(p => ({ ...p, reason: "거래량 상위 종목" }));
      default: return [];
    }
  }

  const currentItems = ai?.[category] || getFallback(category);
  const cat = CATEGORIES.find(c => c.id === category);

  // 요약 통계
  const surge = allPrices.filter(p => (p.changePct||0) >= 2).length;
  const plunge = allPrices.filter(p => (p.changePct||0) <= -2).length;
  const avgChange = allPrices.length > 0
    ? allPrices.reduce((s, p) => s + (p.changePct||0), 0) / allPrices.length
    : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* AI 요약 */}
      {ai?.summary && (
        <div style={{
          padding: "18px 20px", borderRadius: "10px",
          background: BLUE_LIGHT, border: `1.5px solid ${BLUE_BORDER}`,
        }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: BLUE, marginBottom: "6px" }}>AI 시장 분석</div>
          <div style={{ fontSize: "14px", color: "#1E40AF", lineHeight: 1.6 }}>{ai.summary}</div>
          {etfData?.updatedAt && (
            <div style={{ fontSize: "11px", color: "#93C5FD", marginTop: "8px" }}>
              기준: {new Date(etfData.updatedAt).toLocaleDateString("ko-KR")}
            </div>
          )}
        </div>
      )}

      {/* 요약 카드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px" }}>
        {[
          { label: "2% 이상 급등", value: surge, color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
          { label: "2% 이상 급락", value: plunge, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
          { label: "평균 등락률", value: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`, color: avgChange >= 0 ? "#16A34A" : "#DC2626", bg: avgChange >= 0 ? "#F0FDF4" : "#FEF2F2", border: avgChange >= 0 ? "#BBF7D0" : "#FECACA" },
          { label: "조회 종목 수", value: allPrices.length, color: BLUE, bg: BLUE_LIGHT, border: BLUE_BORDER },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: "10px", padding: "16px 20px" }}>
            <div style={{ fontSize: "12px", color, marginBottom: "6px", fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: "26px", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* 카테고리 탭 */}
      <div style={{ background: "#fff", border: `1.5px solid ${GRAY_BORDER}`, borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: `2px solid ${GRAY_BORDER}`, padding: "0 16px", background: "#F9FAFB", gap: "4px", overflowX: "auto" }}>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.id)} style={{
              padding: "12px 16px", border: "none",
              borderBottom: category === c.id ? `3px solid ${c.color}` : "3px solid transparent",
              background: category === c.id ? c.bg : "transparent",
              color: category === c.id ? c.color : "#6B7280",
              cursor: "pointer", fontSize: "13px", fontWeight: category === c.id ? 700 : 400,
              transition: "all 0.15s", whiteSpace: "nowrap",
              borderRadius: category === c.id ? "6px 6px 0 0" : "0",
            }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {currentItems.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontSize: "14px" }}>
            데이터가 없습니다. GitHub Actions가 실행되면 자동으로 채워집니다.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${cat?.border || BLUE_BORDER}`, background: cat?.bg || BLUE_LIGHT }}>
                  {["순위", "종목", "이름", "당일 등락", "30일 수익", "분석"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: cat?.color || BLUE, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, i) => <ETFRow key={item.symbol} item={item} rank={i} category={category} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ fontSize: "12px", color: "#9CA3AF", textAlign: "center" }}>
        * 매일 미국 장 마감 후 자동 업데이트 / AI 분석은 Grok이 수행
      </div>
    </div>
  );
}
