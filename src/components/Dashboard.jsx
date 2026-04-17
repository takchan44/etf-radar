import { useState } from "react";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";

const ETF_META = {
  SPY:  { aum: "5800억", expense: "0.09%", benchmark: "S&P 500", source: "Yahoo Finance" },
  VOO:  { aum: "4700억", expense: "0.03%", benchmark: "S&P 500", source: "Yahoo Finance" },
  QQQ:  { aum: "2500억", expense: "0.20%", benchmark: "나스닥 100", source: "Yahoo Finance" },
  VTI:  { aum: "4300억", expense: "0.03%", benchmark: "CRSP US Total", source: "Yahoo Finance" },
  DIA:  { aum: "340억",  expense: "0.16%", benchmark: "다우존스 30", source: "Yahoo Finance" },
  IWM:  { aum: "650억",  expense: "0.19%", benchmark: "Russell 2000", source: "Yahoo Finance" },
  SOXX: { aum: "120억",  expense: "0.35%", benchmark: "PHLX 반도체", source: "Yahoo Finance" },
  SMH:  { aum: "230억",  expense: "0.35%", benchmark: "MVIS 반도체", source: "Yahoo Finance" },
  XLK:  { aum: "670억",  expense: "0.10%", benchmark: "S&P 기술섹터", source: "Yahoo Finance" },
  XLF:  { aum: "430억",  expense: "0.10%", benchmark: "S&P 금융섹터", source: "Yahoo Finance" },
  XLV:  { aum: "380億",  expense: "0.10%", benchmark: "S&P 헬스케어", source: "Yahoo Finance" },
  XLE:  { aum: "310억",  expense: "0.10%", benchmark: "S&P 에너지", source: "Yahoo Finance" },
  ARKK: { aum: "67억",   expense: "0.75%", benchmark: "액티브 운용", source: "Yahoo Finance" },
  GLD:  { aum: "740억",  expense: "0.40%", benchmark: "금 현물", source: "Yahoo Finance" },
  TLT:  { aum: "600억",  expense: "0.15%", benchmark: "미국채 20년+", source: "Yahoo Finance" },
  SCHD: { aum: "640억",  expense: "0.06%", benchmark: "다우존스 배당100", source: "Yahoo Finance" },
  TQQQ: { aum: "230억",  expense: "0.86%", benchmark: "나스닥 3배", source: "Yahoo Finance" },
  SQQQ: { aum: "38억",   expense: "0.90%", benchmark: "나스닥 인버스3배", source: "Yahoo Finance" },
  EEM:  { aum: "210억",  expense: "0.70%", benchmark: "MSCI 신흥국", source: "Yahoo Finance" },
  ACWI: { aum: "230억",  expense: "0.32%", benchmark: "MSCI ACWI", source: "Yahoo Finance" },
};

const CATEGORIES = [
  { id: "all",    label: "전체",           icon: "◎" },
  { id: "us",     label: "미국",           icon: "▪" },
  { id: "korea",  label: "한국",           icon: "▪" },
  { id: "global", label: "글로벌",         icon: "▪" },
  { id: "surge",  label: "급상승 TOP10",   icon: "▲", color: "#16A34A" },
  { id: "plunge", label: "급하락 TOP10",   icon: "▼", color: "#DC2626" },
  { id: "volume", label: "거래량 TOP10",   icon: "◎", color: "#7C3AED" },
  { id: "ret30d", label: "30일 수익 TOP10",icon: "→", color: "#D97706" },
];

function getFiltered(prices, category) {
  const all = Object.values(prices).filter(p => p && !p.error && (p.price||0) > 0);
  switch (category) {
    case "us":     return all.filter(p => p.market === "us").slice(0, 10);
    case "korea":  return all.filter(p => p.market === "korea").slice(0, 10);
    case "global": return all.filter(p => p.market === "global").slice(0, 10);
    case "surge":  return [...all].sort((a,b) => (b.changePct||0)-(a.changePct||0)).slice(0,10);
    case "plunge": return [...all].sort((a,b) => (a.changePct||0)-(b.changePct||0)).slice(0,10);
    case "volume": return [...all].sort((a,b) => (b.volume||0)-(a.volume||0)).slice(0,10);
    case "ret30d": return [...all].filter(p=>p.ret30d!=null).sort((a,b)=>(b.ret30d||0)-(a.ret30d||0)).slice(0,10);
    default:       return all.slice(0,10);
  }
}

// 상세 팝업
function DetailPopup({ item, onClose, onCompare, compareList }) {
  const meta = ETF_META[item.symbol] || {};
  const isUp = (item.changePct||0) >= 0;
  const isKRW = item.currency === "KRW";
  const inCompare = compareList.includes(item.symbol);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
      zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: "16px", padding: "28px",
        maxWidth: "560px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }} onClick={e => e.stopPropagation()}>
        {/* 헤더 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#111827" }}>{item.symbol}</div>
            <div style={{ fontSize: "14px", color: "#6B7280", marginTop: "2px" }}>{item.name}</div>
          </div>
          <button onClick={onClose} style={{
            width: "32px", height: "32px", borderRadius: "50%", border: "none",
            background: "#F3F4F6", color: "#6B7280", cursor: "pointer", fontSize: "18px",
          }}>×</button>
        </div>

        {/* 가격 */}
        <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "20px" }}>
          <span style={{ fontSize: "32px", fontWeight: 700, color: "#111827" }}>
            {isKRW ? `₩${(item.price||0).toLocaleString()}` : `$${(item.price||0).toFixed(2)}`}
          </span>
          <span style={{
            fontSize: "16px", fontWeight: 600, padding: "4px 12px", borderRadius: "8px",
            color: isUp ? "#16A34A" : "#DC2626",
            background: isUp ? "#F0FDF4" : "#FEF2F2",
            border: `1.5px solid ${isUp ? "#BBF7D0" : "#FECACA"}`,
          }}>
            {isUp ? "▲" : "▼"} {Math.abs(item.changePct||0).toFixed(2)}%
          </span>
        </div>

        {/* 성과 지표 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "5일 수익률", value: item.ret5d != null ? `${(item.ret5d||0) >= 0 ? "+" : ""}${(item.ret5d||0).toFixed(2)}%` : "-", color: (item.ret5d||0) >= 0 ? "#16A34A" : "#DC2626" },
            { label: "30일 수익률", value: item.ret30d != null ? `${(item.ret30d||0) >= 0 ? "+" : ""}${(item.ret30d||0).toFixed(2)}%` : "-", color: (item.ret30d||0) >= 0 ? "#16A34A" : "#DC2626" },
            { label: "52주 고가", value: item.high52 ? (isKRW ? `₩${item.high52.toLocaleString()}` : `$${item.high52.toFixed(2)}`) : "-", color: "#111827" },
            { label: "52주 저가", value: item.low52 ? (isKRW ? `₩${item.low52.toLocaleString()}` : `$${item.low52.toFixed(2)}`) : "-", color: "#111827" },
            { label: "고가 대비", value: item.fromHigh != null ? `${(item.fromHigh||0).toFixed(2)}%` : "-", color: (item.fromHigh||0) >= 0 ? "#16A34A" : "#DC2626" },
            { label: "거래량", value: (item.volume||0).toLocaleString(), color: "#111827" },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: "#F9FAFB", borderRadius: "8px", padding: "12px" }}>
              <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "4px" }}>{label}</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* 메타 정보 */}
        <div style={{ borderTop: `1px solid ${GRAY_BORDER}`, paddingTop: "16px", marginBottom: "20px" }}>
          <div style={{ fontSize: "12px", fontWeight: 700, color: "#6B7280", marginBottom: "10px" }}>ETF 기본 정보</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {[
              { label: "섹터", value: item.sector || "-" },
              { label: "시장", value: item.market === "us" ? "미국" : item.market === "korea" ? "한국" : "글로벌" },
              { label: "AUM", value: meta.aum || "-" },
              { label: "보수율", value: meta.expense || "-" },
              { label: "추종 지수", value: meta.benchmark || "-" },
              { label: "데이터 출처", value: meta.source || "Yahoo Finance" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid #F3F4F6` }}>
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{label}</span>
                <span style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 필터링 기준 */}
        <div style={{ background: BLUE_LIGHT, borderRadius: "8px", padding: "12px", marginBottom: "20px", border: `1px solid ${BLUE_BORDER}` }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: BLUE, marginBottom: "4px" }}>데이터 신뢰도 기준</div>
          <div style={{ fontSize: "12px", color: "#1E40AF", lineHeight: 1.6 }}>
            매일 미국 장 마감 후 Yahoo Finance에서 자동 수집 · 5개씩 나눠 안정적으로 요청 · 실패 시 2회 재시도 · 5분 캐시 적용
          </div>
        </div>

        {/* 버튼 */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => onCompare(item.symbol)}
            style={{
              flex: 1, padding: "10px", borderRadius: "8px",
              border: `2px solid ${inCompare ? "#DC2626" : BLUE}`,
              background: inCompare ? "#FEF2F2" : BLUE_LIGHT,
              color: inCompare ? "#DC2626" : BLUE,
              cursor: "pointer", fontSize: "13px", fontWeight: 600,
            }}
          >
            {inCompare ? "비교에서 제거" : "비교에 추가"}
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, padding: "10px", borderRadius: "8px",
              border: "none", background: BLUE, color: "#fff",
              cursor: "pointer", fontSize: "13px", fontWeight: 600,
            }}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// 비교 뷰
function CompareView({ compareList, prices, onRemove, onClear }) {
  const items = compareList.map(sym => prices[sym]).filter(Boolean);
  if (items.length === 0) return null;

  const metrics = ["price", "changePct", "ret5d", "ret30d", "volume", "high52", "low52", "fromHigh"];
  const labels = { price: "현재가", changePct: "당일 등락", ret5d: "5일 수익", ret30d: "30일 수익", volume: "거래량", high52: "52주 고가", low52: "52주 저가", fromHigh: "고가 대비" };

  return (
    <div style={{ background: "#fff", border: `1.5px solid ${BLUE_BORDER}`, borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }}>
      <div style={{ padding: "14px 20px", background: BLUE_LIGHT, borderBottom: `1px solid ${BLUE_BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: BLUE }}>ETF 비교 ({items.length}개)</span>
        <button onClick={onClear} style={{ fontSize: "12px", color: "#DC2626", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>전체 초기화</button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${GRAY_BORDER}`, background: "#F9FAFB" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", color: "#6B7280", fontWeight: 600 }}>지표</th>
              {items.map(item => (
                <th key={item.symbol} style={{ padding: "10px 16px", textAlign: "right", color: BLUE, fontWeight: 700 }}>
                  {item.symbol}
                  <button onClick={() => onRemove(item.symbol)} style={{ marginLeft: "6px", fontSize: "10px", color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}>✕</button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map(metric => (
              <tr key={metric} style={{ borderBottom: `1px solid ${GRAY_BORDER}` }}>
                <td style={{ padding: "10px 16px", color: "#6B7280", fontWeight: 600 }}>{labels[metric]}</td>
                {items.map(item => {
                  const val = item[metric];
                  const isKRW = item.currency === "KRW";
                  const isPct = ["changePct","ret5d","ret30d","fromHigh"].includes(metric);
                  const isPrice = ["price","high52","low52"].includes(metric);
                  const color = isPct ? ((val||0) >= 0 ? "#16A34A" : "#DC2626") : "#111827";
                  let display = "-";
                  if (val != null) {
                    if (isPrice) display = isKRW ? `₩${val.toLocaleString()}` : `$${val.toFixed(2)}`;
                    else if (isPct) display = `${(val||0) >= 0 ? "+" : ""}${(val||0).toFixed(2)}%`;
                    else if (metric === "volume") display = val.toLocaleString();
                    else display = String(val);
                  }
                  return (
                    <td key={item.symbol} style={{ padding: "10px 16px", textAlign: "right", fontWeight: 600, color }}>{display}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ETFRow({ item, rank, onDetail, isFavorite, onFavorite }) {
  const isUp = (item.changePct||0) >= 0;
  const isKRW = item.currency === "KRW";

  return (
    <tr
      style={{ borderBottom: `1px solid ${GRAY_BORDER}`, background: rank % 2 === 0 ? "#fff" : "#F9FAFB", cursor: "pointer", transition: "background 0.1s" }}
      onMouseOver={e => e.currentTarget.style.background = BLUE_LIGHT}
      onMouseOut={e => e.currentTarget.style.background = rank % 2 === 0 ? "#fff" : "#F9FAFB"}
      onClick={() => onDetail(item)}
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
      <td style={{ padding: "12px 16px" }}>
        <button onClick={e => { e.stopPropagation(); onFavorite(item.symbol); }} style={{
          background: "none", border: "none", cursor: "pointer", fontSize: "16px",
          color: isFavorite ? "#F59E0B" : "#D1D5DB",
        }}>★</button>
      </td>
      <td style={{ padding: "12px 16px", fontWeight: 700, color: "#111827" }}>{item.symbol}</td>
      <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "13px" }}>{item.name}</td>
      <td style={{ padding: "12px 16px" }}>
        <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: BLUE_LIGHT, color: BLUE, border: `1px solid ${BLUE_BORDER}`, fontWeight: 600 }}>
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
      <td style={{ padding: "12px 16px", fontWeight: 600, color: (item.ret30d||0) >= 0 ? "#16A34A" : "#DC2626" }}>
        {item.ret30d != null ? `${(item.ret30d||0) >= 0 ? "+" : ""}${(item.ret30d||0).toFixed(2)}%` : "-"}
      </td>
      <td style={{ padding: "12px 16px", color: "#6B7280", fontSize: "12px" }}>
        {(item.volume||0).toLocaleString()}
      </td>
      <td style={{ padding: "12px 16px", color: "#9CA3AF", fontSize: "11px" }}>Yahoo Finance</td>
    </tr>
  );
}

export default function Dashboard({ prices, loading, etfData }) {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("all");
  const [searchText, setSearchText] = useState("");
  const [detail, setDetail] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavOnly, setShowFavOnly] = useState(false);

  const allPrices = Object.values(prices).filter(p => p && !p.error && (p.price||0) > 0);
  const surge = allPrices.filter(p => (p.changePct||0) >= 2).length;
  const plunge = allPrices.filter(p => (p.changePct||0) <= -2).length;
  const avgChange = allPrices.length > 0 ? allPrices.reduce((s,p) => s+(p.changePct||0), 0) / allPrices.length : 0;

  // 검색 + 즐겨찾기 필터
  let filtered = { ...prices };
  if (searchText) {
    filtered = Object.fromEntries(
      Object.entries(prices).filter(([sym, p]) =>
        sym.toLowerCase().includes(searchText.toLowerCase()) ||
        (p?.name||"").toLowerCase().includes(searchText.toLowerCase()) ||
        (p?.sector||"").toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }
  if (showFavOnly) {
    filtered = Object.fromEntries(Object.entries(filtered).filter(([sym]) => favorites.includes(sym)));
  }

  const items = getFiltered(filtered, category);

  function toggleCompare(symbol) {
    setCompareList(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol].slice(0, 4));
  }

  function toggleFavorite(symbol) {
    setFavorites(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]);
  }

  const cat = CATEGORIES.find(c => c.id === category);

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

      {/* 데이터 신뢰도 배너 */}
      <div style={{ background: BLUE_LIGHT, border: `1px solid ${BLUE_BORDER}`, borderRadius: "8px", padding: "12px 16px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "12px", fontWeight: 700, color: BLUE }}>데이터 기준</span>
        {["출처: Yahoo Finance", "매일 장 마감 후 자동 수집", "5개씩 안정적 요청", "실패 시 2회 재시도"].map(t => (
          <span key={t} style={{ fontSize: "11px", color: "#1E40AF", background: "#fff", padding: "3px 10px", borderRadius: "99px", border: `1px solid ${BLUE_BORDER}` }}>{t}</span>
        ))}
        {etfData?.updatedAt && (
          <span style={{ fontSize: "11px", color: "#93C5FD", marginLeft: "auto" }}>
            최종 업데이트: {new Date(etfData.updatedAt).toLocaleString("ko-KR")}
          </span>
        )}
      </div>

      {/* 비교 뷰 */}
      {compareList.length > 0 && (
        <CompareView
          compareList={compareList}
          prices={prices}
          onRemove={sym => setCompareList(prev => prev.filter(s => s !== sym))}
          onClear={() => setCompareList([])}
        />
      )}

      {/* 검색 + 즐겨찾기 */}
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          placeholder="종목명, 섹터, 티커 검색..."
          style={{
            flex: 1, padding: "10px 16px", borderRadius: "8px",
            border: `2px solid ${GRAY_BORDER}`, fontSize: "14px",
            outline: "none", boxSizing: "border-box",
          }}
          onFocus={e => e.target.style.borderColor = BLUE}
          onBlur={e => e.target.style.borderColor = GRAY_BORDER}
        />
        <button
          onClick={() => setShowFavOnly(!showFavOnly)}
          style={{
            padding: "10px 16px", borderRadius: "8px",
            border: `2px solid ${showFavOnly ? "#F59E0B" : GRAY_BORDER}`,
            background: showFavOnly ? "#FFFBEB" : "#fff",
            color: showFavOnly ? "#D97706" : "#6B7280",
            cursor: "pointer", fontSize: "13px", fontWeight: 600,
          }}
        >
          ★ 즐겨찾기 {favorites.length > 0 ? `(${favorites.length})` : ""}
        </button>
      </div>

      {/* 카테고리 탭 + 테이블 */}
      <div style={{ background: "#fff", border: `1.5px solid ${GRAY_BORDER}`, borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: `2px solid ${GRAY_BORDER}`, padding: "0 16px", background: "#F9FAFB", gap: "4px", overflowX: "auto" }}>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setCategory(c.id)} style={{
              padding: "12px 14px", border: "none",
              borderBottom: category === c.id ? `3px solid ${c.color || BLUE}` : "3px solid transparent",
              background: category === c.id ? BLUE_LIGHT : "transparent",
              color: category === c.id ? (c.color || BLUE) : "#6B7280",
              cursor: "pointer", fontSize: "13px",
              fontWeight: category === c.id ? 700 : 400,
              transition: "all 0.15s", whiteSpace: "nowrap",
              borderRadius: category === c.id ? "6px 6px 0 0" : "0",
            }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "10px 16px 4px", fontSize: "12px", color: "#9CA3AF" }}>
          {loading ? "로딩 중..." : `${items.length}개 종목 표시 · 행 클릭 시 상세 정보`}
          {compareList.length > 0 && <span style={{ marginLeft: "12px", color: BLUE, fontWeight: 600 }}>비교 중: {compareList.join(", ")}</span>}
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${BLUE_BORDER}`, background: BLUE_LIGHT }}>
                {["순위", "★", "종목", "이름", "섹터", "현재가", "당일 등락", "30일 수익", "거래량", "출처"].map(h => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: "12px", color: BLUE, fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>데이터가 없습니다</td></tr>
              ) : (
                items.map((item, i) => (
                  <ETFRow
                    key={item.symbol}
                    item={item}
                    rank={i}
                    onDetail={setDetail}
                    isFavorite={favorites.includes(item.symbol)}
                    onFavorite={toggleFavorite}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <DetailPopup
          item={detail}
          onClose={() => setDetail(null)}
          onCompare={toggleCompare}
          compareList={compareList}
        />
      )}
    </div>
  );
}
