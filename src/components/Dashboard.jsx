import { useState } from "react";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";

const MARKET_LABELS = { us: "미국", korea: "한국", global: "글로벌" };

const CATEGORIES = [
  { id: "all",       label: "전체",        icon: "◎" },
  { id: "us",        label: "미국",        icon: "🇺🇸" },
  { id: "korea",     label: "한국",        icon: "🇰🇷" },
  { id: "global",    label: "글로벌",      icon: "🌐" },
  { id: "surge",     label: "급상승",      icon: "▲", color: "#16A34A" },
  { id: "plunge",    label: "급하락",      icon: "▼", color: "#DC2626" },
  { id: "volume",    label: "거래량 상위", icon: "◎", color: "#7C3AED" },
  { id: "ret30d",    label: "30일 수익 상위", icon: "→", color: "#D97706" },
];

function getFiltered(prices, category) {
  const all = Object.values(prices).filter(p => p && !p.error && (p.price || 0) > 0);
  switch (category) {
    case "us":     return all.filter(p => p.market === "us").slice(0, 10);
    case "korea":  return all.filter(p => p.market === "korea").slice(0, 10);
    case "global": return all.filter(p => p.market === "global").slice(0, 10);
    case "surge":  return [...all].sort((a, b) => (b.changePct||0) - (a.changePct||0)).slice(0, 10);
    case "plunge": return [...all].sort((a, b) => (a.changePct||0) - (b.changePct||0)).slice(0, 10);
    case "volume": return [...all].sort((a, b) => (b.volume||0) - (a.volume||0)).slice(0, 10);
    case "ret30d": return [...all].filter(p => p.ret30d !== undefined).sort((a, b) => (b.ret30d||0) - (a.ret30d||0)).slice(0, 10);
    default:       return all.slice(0, 10);
  }
}

function ETFRow({ item, rank }) {
  const isUp = (item.changePct || 0) >= 0;
  const isKRW = item.currency === "KRW";

  return (
    <tr
      style={{ borderBottom: `1px solid ${GRAY_BORDER}`, background: rank % 2 === 0 ? "#fff" : "#F9FAFB", transition: "background 0.1s" }}
      onMouseOver={e => e.currentTarget.style.background = BLUE_LIGHT}
      onMouseOut={e => e.currentTarget.style.background = rank % 2 === 0 ? "#fff" : "#F9FAFB"}
    >
      <td style={{ padding: "12px 16px" }}>
        <span style={{
          width: "28px", height: "28px", borderRadius: "50%",
          background: rank < 3 ? BLUE : "#E5E7EB",
          color: rank < 3 ? "#fff" : "#6B7280",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: "12px", fontWeight: 700,
        }}>{rank + 1}</span>
      </td>
      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#111827" }}>{item.symbol}</td>
      <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>{item.name}</td>
      <td style={{ padding: "12px 16px" }}>
        <span style={{
          fontSize: "11px", padding: "2px 8px", borderRadius: "99px",
          background: BLUE_LIGHT, color: BLUE, border: `1px solid ${BLUE_BORDER}`, fontWeight: 600,
        }}>
          {item.sector || "-"}
        </span>
      </td>
      <td style={{ padding: "12px 16px", fontWeight: 600, color: "#111827" }}>
        {isKRW ? `₩${(item.price||0).toLocaleString()}` : `$${(item.price||0).toFixed(2)}`}
      </td>
      <td style={{ padding: "12px 16px" }}>
        <span style={{
          fontSize: "13px", fontWeight: 600, padding: "3px 8px", borderRadius: "6px",
          color: isUp ? "#16A34A" : "#DC2626",
          background: isUp ? "#F0FDF4" : "#FEF2F2",
          border: `1.5px solid ${isUp ? "#BBF7D0" : "#FECACA"}`,
        }}>
          {isUp ? "▲" : "▼"} {Math.abs(item.changePct||0).toFixed(2)}%
        </span>
      </td>
      {item.ret30d !== undefined && (
        <td style={{ padding: "12px 16px", fontWeight: 600, color: (item.ret30d||0) >= 0 ? "#16A34A" : "#DC2626" }}>
          {(item.ret30d||0) >= 0 ? "+" : ""}{(item.ret30d||0).toFixed(2)}%
        </td>
      )}
      <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "12px" }}>
        {(item.volume||0).toLocaleString()}
      </td>
    </tr>
  );
}

export default function Dashboard({ prices, loading, etfData }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const allPrices = Object.values(prices).filter(p => p && !p.error && (p.price||0) > 0);

  // 검색 필터
  const searchFiltered = search
    ? Object.fromEntries(
        Object.entries(prices).filter(([sym, p]) =>
          sym.toLowerCase().includes(search.toLowerCase()) ||
          (p?.name || "").toLowerCase().includes(search.toLowerCase()) ||
          (p?.sector || "").toLowerCase().includes(search.toLowerCase())
        )
      )
    : prices;

  const items = getFiltered(searchFiltered, category);

  // 요약 통계
  const surge = allPrices.filter(p => (p.changePct||0) >= 2).length;
  const plunge = allPrices.filter(p => (p.changePct||0) <= -2).length;
  const avgChange = allPrices.length > 0
    ? allPrices.reduce((s, p) => s + (p.changePct||0), 0) / allPrices.length : 0;

  const hasRet30d = items.some(p => p.ret30d !== undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* 요약 카드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "14px" }}>
        {[
          { label: "2% 이상 급등", value: surge, color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
          { label: "2% 이상 급락", value: plunge, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
          { label: "평균 등락률", value: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`, color: avgChange >= 0 ? "#16A34A" : "#DC2626", bg: avgChange >= 0 ? "#F0FDF4" : "#FEF2F2", border: avgChange >= 0 ? "#BBF7D0" : "#FECACA" },
          { label: "전체 종목 수", value: allPrices.length, color: BLUE, bg: BLUE_LIGHT, border: BLUE_BORDER },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: "10px", padding: "16px 20px" }}>
            <div style={{ fontSize: "12px", color, marginBottom: "6px", fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: "26px", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* 검색 */}
      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="종목명 또는 섹터 검색..."
        style={{
          width: "100%", padding: "10px 16px", borderRadius: "8px",
          border: `2px solid ${GRAY_BORDER}`, fontSize: "14px",
          outline: "none", boxSizing: "border-box", transition: "border-color 0.15s",
        }}
        onFocus={e => e.target.style.borderColor = BLUE}
        onBlur={e => e.target.style.borderColor = GRAY_BORDER}
      />

      {/* 카테고리 탭 + 테이블 */}
      <div style={{ background: "#fff", border: `1.5px solid ${GRAY_BORDER}`, borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: `2px solid ${GRAY_BORDER}`, padding: "0 16px", background: "#F9FAFB", gap: "4px", overflowX: "auto" }}>
          {CATEGORIES.map((cat) => (
            <button key={cat.id} onClick={() => setCategory(cat.id)} style={{
              padding: "12px 16px", border: "none",
              borderBottom: category === cat.id ? `3px solid ${cat.color || BLUE}` : "3px solid transparent",
              background: category === cat.id ? BLUE_LIGHT : "transparent",
              color: category === cat.id ? (cat.color || BLUE) : "#6B7280",
              cursor: "pointer", fontSize: "13px",
              fontWeight: category === cat.id ? 700 : 400,
              transition: "all 0.15s", whiteSpace: "nowrap",
              borderRadius: category === cat.id ? "6px 6px 0 0" : "0",
            }}>
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "12px 16px 4px", fontSize: "13px", color: "#6B7280" }}>
          {loading ? "로딩 중..." : `${items.length}개 종목`}
        </div>

        {items.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#9CA3AF", fontSize: "14px" }}>
            데이터가 없습니다.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${BLUE_BORDER}`, background: BLUE_LIGHT }}>
                  {["순위", "종목", "이름", "섹터", "현재가", "당일 등락", ...(hasRet30d ? ["30일 수익"] : []), "거래량"].map(h => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: BLUE, fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => <ETFRow key={item.symbol} item={item} rank={i} />)}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {etfData?.updatedAt && (
        <div style={{ fontSize: "12px", color: "#9CA3AF", textAlign: "center" }}>
          * 마지막 업데이트: {new Date(etfData.updatedAt).toLocaleString("ko-KR")} / 매일 미국 장 마감 후 자동 갱신
        </div>
      )}
    </div>
  );
}
