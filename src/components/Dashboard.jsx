import { useState, useMemo } from "react";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";

const ETF_META = {
  SPY:  { aum: "5,800억$", expense: "0.09%", benchmark: "S&P 500",      summary: "미국 대형주 시장 전체를 추종하는 가장 유동성 높은 ETF" },
  VOO:  { aum: "4,700억$", expense: "0.03%", benchmark: "S&P 500",      summary: "Vanguard의 저보수 S&P 500 추종 ETF" },
  QQQ:  { aum: "2,500억$", expense: "0.20%", benchmark: "나스닥 100",   summary: "기술주 중심 나스닥 100 추종, 성장주 대표 ETF" },
  VTI:  { aum: "4,300억$", expense: "0.03%", benchmark: "CRSP 전체",   summary: "미국 전체 주식시장을 하나로 담은 ETF" },
  DIA:  { aum: "340억$",   expense: "0.16%", benchmark: "다우존스 30",  summary: "전통 우량 대형주 30개로 구성된 다우존스 추종" },
  IWM:  { aum: "650억$",   expense: "0.19%", benchmark: "Russell 2000", summary: "미국 소형주 2000개, 경기 민감도 높은 ETF" },
  SOXX: { aum: "120억$",   expense: "0.35%", benchmark: "PHLX 반도체",  summary: "반도체 설계·제조·장비 기업 집중 투자" },
  SMH:  { aum: "230억$",   expense: "0.35%", benchmark: "MVIS 반도체",  summary: "엔비디아·TSMC 등 글로벌 반도체 TOP 25" },
  XLK:  { aum: "670억$",   expense: "0.10%", benchmark: "S&P 기술",     summary: "S&P 500 내 IT 섹터 집중 투자" },
  XLF:  { aum: "430억$",   expense: "0.10%", benchmark: "S&P 금융",     summary: "은행·보험·자산운용사 등 금융 섹터" },
  XLV:  { aum: "380억$",   expense: "0.10%", benchmark: "S&P 헬스케어", summary: "제약·의료기기·바이오 등 헬스케어 섹터" },
  XLE:  { aum: "310억$",   expense: "0.10%", benchmark: "S&P 에너지",   summary: "정유·가스 에너지 섹터, 유가 민감" },
  ARKK: { aum: "67억$",    expense: "0.75%", benchmark: "액티브",        summary: "파괴적 혁신 기업에 집중 투자하는 ARK 대표 ETF" },
  GLD:  { aum: "740억$",   expense: "0.40%", benchmark: "금 현물",       summary: "금 현물 가격을 추종하는 안전자산 ETF" },
  TLT:  { aum: "600억$",   expense: "0.15%", benchmark: "미국채 20년+",  summary: "장기 미국 국채, 금리 하락 시 강세" },
  SCHD: { aum: "640억$",   expense: "0.06%", benchmark: "다우 배당100",  summary: "배당 성장 기업 100개, 저보수 배당 대표 ETF" },
  TQQQ: { aum: "230억$",   expense: "0.86%", benchmark: "나스닥 3배",    summary: "나스닥 100의 3배 레버리지, 단기 트레이딩용" },
  SQQQ: { aum: "38억$",    expense: "0.90%", benchmark: "나스닥 인버스", summary: "나스닥 하락 시 수익, 헤지용 인버스" },
  EEM:  { aum: "210억$",   expense: "0.70%", benchmark: "MSCI 신흥국",  summary: "신흥국 대형·중형주, 중국·인도 비중 높음" },
  ACWI: { aum: "230억$",   expense: "0.32%", benchmark: "MSCI ACWI",    summary: "전 세계 선진국·신흥국 포함 글로벌 ETF" },
};

const ASSET_CLASSES = ["전체", "주식", "채권", "원자재", "레버리지", "인버스", "암호화폐"];
const ASSET_MAP = {
  채권: ["채권"], 원자재: ["원자재"], 레버리지: ["레버리지"], 인버스: ["인버스"], 암호화폐: ["암호화폐"],
  주식: ["전체시장","기술","반도체","AI","혁신","소형주","중형주","가치주","성장주","배당","금융","헬스케어","에너지","산업","소비재","필수소비재","유틸리티","부동산","소재","통신","바이오","로보틱스","소프트웨어","사이버보안","클라우드","2차전지","IT","선진국","신흥국","전세계","일본","중국","한국","브라질","독일","캐나다","호주","영국"],
};

const SORT_OPTIONS = [
  { id: "changePct_desc", label: "등락률 높은순" },
  { id: "changePct_asc",  label: "등락률 낮은순" },
  { id: "ret30d_desc",    label: "30일 수익 높은순" },
  { id: "ret30d_asc",     label: "30일 수익 낮은순" },
  { id: "volume_desc",    label: "거래량 높은순" },
  { id: "price_desc",     label: "가격 높은순" },
  { id: "fromHigh_desc",  label: "52주 고가 근접순" },
];

function getSentiment(changePct, ret30d) {
  const score = (changePct || 0) * 0.4 + (ret30d || 0) * 0.6;
  if (score > 5)  return { label: "강세", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" };
  if (score > 1)  return { label: "약세상",color: "#65A30D", bg: "#F7FEE7", border: "#D9F99D" };
  if (score > -1) return { label: "보합",  color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" };
  if (score > -5) return { label: "약세",  color: "#EA580C", bg: "#FFF7ED", border: "#FED7AA" };
  return                 { label: "강세하",color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" };
}

// 핵심 요약 카드
function SummaryCard({ item }) {
  const isUp = (item.changePct || 0) >= 0;
  const isKRW = item.currency === "KRW";
  const meta = ETF_META[item.symbol] || {};
  const sentiment = getSentiment(item.changePct, item.ret30d);

  return (
    <div style={{
      background: "#fff", border: `1.5px solid ${GRAY_BORDER}`,
      borderTop: `4px solid ${isUp ? "#16A34A" : "#DC2626"}`,
      borderRadius: "10px", padding: "16px",
      display: "flex", flexDirection: "column", gap: "8px",
      transition: "box-shadow 0.15s", cursor: "pointer",
    }}
    onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.12)"}
    onMouseOut={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>{item.symbol}</div>
          <div style={{ fontSize: "11px", color: "#9CA3AF", marginTop: "1px" }}>{item.name}</div>
        </div>
        <span style={{
          fontSize: "10px", padding: "2px 8px", borderRadius: "99px",
          background: sentiment.bg, color: sentiment.color, border: `1px solid ${sentiment.border}`,
          fontWeight: 700,
        }}>{sentiment.label}</span>
      </div>

      <div style={{ fontSize: "22px", fontWeight: 700, color: "#111827" }}>
        {isKRW ? `₩${(item.price||0).toLocaleString()}` : `$${(item.price||0).toFixed(2)}`}
      </div>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <span style={{
          fontSize: "12px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px",
          color: isUp ? "#16A34A" : "#DC2626",
          background: isUp ? "#F0FDF4" : "#FEF2F2",
          border: `1px solid ${isUp ? "#BBF7D0" : "#FECACA"}`,
        }}>{isUp ? "▲" : "▼"} {Math.abs(item.changePct||0).toFixed(2)}%</span>
        {item.ret30d != null && (
          <span style={{
            fontSize: "12px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px",
            color: (item.ret30d||0) >= 0 ? "#1E40AF" : "#DC2626",
            background: (item.ret30d||0) >= 0 ? BLUE_LIGHT : "#FEF2F2",
            border: `1px solid ${(item.ret30d||0) >= 0 ? BLUE_BORDER : "#FECACA"}`,
          }}>30일 {(item.ret30d||0) >= 0 ? "+" : ""}{(item.ret30d||0).toFixed(1)}%</span>
        )}
      </div>

      {meta.summary && (
        <div style={{ fontSize: "11px", color: "#6B7280", lineHeight: 1.5, borderTop: `1px solid #F3F4F6`, paddingTop: "8px" }}>
          {meta.summary}
        </div>
      )}

      {meta.expense && (
        <div style={{ display: "flex", gap: "12px" }}>
          <span style={{ fontSize: "10px", color: "#9CA3AF" }}>보수 <b style={{ color: "#374151" }}>{meta.expense}</b></span>
          {meta.aum && <span style={{ fontSize: "10px", color: "#9CA3AF" }}>AUM <b style={{ color: "#374151" }}>{meta.aum}</b></span>}
        </div>
      )}
    </div>
  );
}

// 상세 팝업
function DetailPopup({ item, onClose, onCompare, compareList }) {
  const meta = ETF_META[item.symbol] || {};
  const isUp = (item.changePct||0) >= 0;
  const isKRW = item.currency === "KRW";
  const inCompare = compareList.includes(item.symbol);
  const sentiment = getSentiment(item.changePct, item.ret30d);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: "16px", padding: "28px", maxWidth: "580px", width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
          <div>
            <div style={{ fontSize: "24px", fontWeight: 700, color: "#111827" }}>{item.symbol}</div>
            <div style={{ fontSize: "13px", color: "#6B7280" }}>{item.name}</div>
          </div>
          <button onClick={onClose} style={{ width: "32px", height: "32px", borderRadius: "50%", border: "none", background: "#F3F4F6", color: "#6B7280", cursor: "pointer", fontSize: "18px" }}>×</button>
        </div>

        {/* 1줄 요약 */}
        {meta.summary && (
          <div style={{ background: BLUE_LIGHT, border: `1px solid ${BLUE_BORDER}`, borderRadius: "8px", padding: "12px", marginBottom: "16px", fontSize: "13px", color: "#1E40AF", lineHeight: 1.6 }}>
            {meta.summary}
          </div>
        )}

        {/* 감성 + 가격 */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <span style={{ fontSize: "28px", fontWeight: 700, color: "#111827" }}>
            {isKRW ? `₩${(item.price||0).toLocaleString()}` : `$${(item.price||0).toFixed(2)}`}
          </span>
          <span style={{ fontSize: "14px", fontWeight: 600, padding: "4px 12px", borderRadius: "8px", color: isUp ? "#16A34A" : "#DC2626", background: isUp ? "#F0FDF4" : "#FEF2F2", border: `1.5px solid ${isUp ? "#BBF7D0" : "#FECACA"}` }}>
            {isUp ? "▲" : "▼"} {Math.abs(item.changePct||0).toFixed(2)}%
          </span>
          <span style={{ fontSize: "12px", fontWeight: 700, padding: "4px 10px", borderRadius: "8px", color: sentiment.color, background: sentiment.bg, border: `1px solid ${sentiment.border}` }}>
            {sentiment.label}
          </span>
        </div>

        {/* 성과 지표 */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "16px" }}>
          {[
            { label: "5일 수익률",  value: item.ret5d,    isPct: true },
            { label: "30일 수익률", value: item.ret30d,   isPct: true },
            { label: "52주 고가",   value: item.high52,   isPrice: true, isKRW },
            { label: "52주 저가",   value: item.low52,    isPrice: true, isKRW },
            { label: "고가 대비",   value: item.fromHigh, isPct: true },
            { label: "거래량",      value: item.volume,   isVol: true },
          ].map(({ label, value, isPct, isPrice, isVol }) => {
            const color = isPct ? ((value||0) >= 0 ? "#16A34A" : "#DC2626") : "#111827";
            let display = "-";
            if (value != null) {
              if (isPrice) display = isKRW ? `₩${value.toLocaleString()}` : `$${value.toFixed(2)}`;
              else if (isPct) display = `${(value||0) >= 0 ? "+" : ""}${(value||0).toFixed(2)}%`;
              else if (isVol) display = value.toLocaleString();
            }
            return (
              <div key={label} style={{ background: "#F9FAFB", borderRadius: "8px", padding: "10px" }}>
                <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "4px" }}>{label}</div>
                <div style={{ fontSize: "14px", fontWeight: 700, color }}>{display}</div>
              </div>
            );
          })}
        </div>

        {/* ETF 기본 정보 */}
        <div style={{ borderTop: `1px solid ${GRAY_BORDER}`, paddingTop: "14px", marginBottom: "16px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#9CA3AF", marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.5px" }}>ETF 기본 정보</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            {[
              { label: "섹터", value: item.sector || "-" },
              { label: "시장", value: item.market === "us" ? "미국" : item.market === "korea" ? "한국" : "글로벌" },
              { label: "AUM", value: meta.aum || "-" },
              { label: "보수율", value: meta.expense || "-" },
              { label: "추종 지수", value: meta.benchmark || "-" },
              { label: "데이터 출처", value: "Yahoo Finance" },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid #F3F4F6` }}>
                <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{label}</span>
                <span style={{ fontSize: "11px", fontWeight: 600, color: "#374151" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 데이터 신뢰도 */}
        <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "10px", marginBottom: "16px", fontSize: "11px", color: "#6B7280", lineHeight: 1.6 }}>
          <b style={{ color: "#374151" }}>데이터 기준:</b> Yahoo Finance 자동 수집 · 매일 장 마감 후 갱신 · 5개씩 안정적 요청 · 실패 시 2회 재시도
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => onCompare(item.symbol)} style={{
            flex: 1, padding: "10px", borderRadius: "8px",
            border: `2px solid ${inCompare ? "#DC2626" : BLUE}`,
            background: inCompare ? "#FEF2F2" : BLUE_LIGHT,
            color: inCompare ? "#DC2626" : BLUE,
            cursor: "pointer", fontSize: "13px", fontWeight: 600,
          }}>
            {inCompare ? "비교에서 제거" : "비교에 추가"}
          </button>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "none", background: BLUE, color: "#fff", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}

// ETF 비교 뷰
function CompareView({ compareList, prices, onRemove, onClear }) {
  const items = compareList.map(sym => prices[sym]).filter(Boolean);
  if (items.length === 0) return null;

  const metrics = [
    { key: "price",     label: "현재가",    type: "price" },
    { key: "changePct", label: "당일 등락", type: "pct" },
    { key: "ret5d",     label: "5일 수익",  type: "pct" },
    { key: "ret30d",    label: "30일 수익", type: "pct" },
    { key: "fromHigh",  label: "52주 고가 대비", type: "pct" },
    { key: "volume",    label: "거래량",    type: "vol" },
    { key: "high52",    label: "52주 고가", type: "price" },
    { key: "low52",     label: "52주 저가", type: "price" },
  ];

  return (
    <div style={{ background: "#fff", border: `2px solid ${BLUE_BORDER}`, borderRadius: "10px", overflow: "hidden" }}>
      <div style={{ padding: "14px 20px", background: BLUE_LIGHT, borderBottom: `1px solid ${BLUE_BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "14px", fontWeight: 700, color: BLUE }}>ETF 비교</span>
          <span style={{ fontSize: "11px", color: "#93C5FD" }}>{items.length}개 선택 (최대 4개)</span>
        </div>
        <button onClick={onClear} style={{ fontSize: "12px", color: "#DC2626", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>전체 초기화</button>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${GRAY_BORDER}`, background: "#F9FAFB" }}>
              <th style={{ padding: "10px 16px", textAlign: "left", color: "#6B7280", fontWeight: 600, minWidth: "120px" }}>지표</th>
              {items.map(item => {
                const sentiment = getSentiment(item.changePct, item.ret30d);
                return (
                  <th key={item.symbol} style={{ padding: "10px 16px", textAlign: "right", minWidth: "140px" }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ color: BLUE, fontWeight: 700 }}>{item.symbol}</span>
                        <button onClick={() => onRemove(item.symbol)} style={{ fontSize: "10px", color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}>✕</button>
                      </div>
                      <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", color: sentiment.color, background: sentiment.bg }}>{sentiment.label}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {metrics.map(({ key, label, type }) => (
              <tr key={key} style={{ borderBottom: `1px solid ${GRAY_BORDER}` }}>
                <td style={{ padding: "10px 16px", color: "#6B7280", fontWeight: 600 }}>{label}</td>
                {items.map(item => {
                  const val = item[key];
                  const isKRW = item.currency === "KRW";
                  const isPct = type === "pct";
                  const color = isPct ? ((val||0) >= 0 ? "#16A34A" : "#DC2626") : "#111827";
                  let display = "-";
                  if (val != null) {
                    if (type === "price") display = isKRW ? `₩${val.toLocaleString()}` : `$${val.toFixed(2)}`;
                    else if (type === "pct") display = `${(val||0) >= 0 ? "+" : ""}${(val||0).toFixed(2)}%`;
                    else if (type === "vol") display = val.toLocaleString();
                  }
                  // 최고값 강조
                  const allVals = items.map(i => i[key] || 0);
                  const isMax = val === Math.max(...allVals) && items.length > 1;
                  return (
                    <td key={item.symbol} style={{ padding: "10px 16px", textAlign: "right", fontWeight: isMax ? 700 : 500, color, background: isMax ? (isPct ? "#F0FDF4" : BLUE_LIGHT) : "transparent" }}>
                      {display}{isMax && items.length > 1 ? " 🏆" : ""}
                    </td>
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

// 나스닥 100 종목
const NASDAQ100 = [
  "MSFT","AAPL","NVDA","AMZN","META","GOOGL","GOOG","TSLA","AVGO","COST",
  "NFLX","ASML","AMD","CSCO","TMUS","ADBE","PEP","AZN","INTU","INTC",
  "BKNG","QCOM","TXN","AMGN","HON","SBUX","GILD","VRTX","LRCX","REGN",
  "PANW","MU","ADI","SNPS","KLAC","MRVL","CDNS","MELI","CRWD","CTAS",
  "CSX","ORLY","MNST","MDLZ","NXPI","WDAY","PAYX","FTNT","CHTR","DXCM",
  "KDP","CEG","ROST","FAST","ODFL","GEHC","IDXX","TEAM","VRSK","CPRT",
  "ABNB","LULU","BIIB","ON","DLTR","FANG","GFS","ZS","TTD","PCAR",
  "DDOG","ILMN","WBD","ALGN","SIRI","ENPH","RIVN","OKTA","PYPL","ISRG",
  "ADSK","EA","EBAY","MRNA","WBA","BMRN","ZM","XEL","AEP","EXC",
  "PCG","NEE","TSCO","CSGP","ANSS","SWKS","CTSH","MTCH","PARA","NXST",
];

export default function Dashboard({ prices, loading, etfData }) {
  const [viewMode, setViewMode] = useState("table"); // table | card
  const [nasdaq100View, setNasdaq100View] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [assetClass, setAssetClass] = useState("전체");
  const [sectorFilter, setSectorFilter] = useState("전체");
  const [marketFilter, setMarketFilter] = useState("전체");
  const [sortBy, setSortBy] = useState("volume_desc");
  const [detail, setDetail] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [minChangePct, setMinChangePct] = useState("");
  const [maxChangePct, setMaxChangePct] = useState("");

  const allPrices = Object.values(prices).filter(p => p && !p.error && (p.price||0) > 0);

  // 섹터 목록 동적 생성
  const allSectors = useMemo(() => {
    const s = new Set(allPrices.map(p => p.sector).filter(Boolean));
    return ["전체", ...Array.from(s).sort()];
  }, [allPrices.length]);

  // 필터 + 정렬
  const filtered = useMemo(() => {
    let items = [...allPrices];

    if (searchText) {
      const q = searchText.toLowerCase();
      items = items.filter(p =>
        p.symbol.toLowerCase().includes(q) ||
        (p.name||"").toLowerCase().includes(q) ||
        (p.sector||"").toLowerCase().includes(q)
      );
    }
    if (assetClass !== "전체") {
      const sectors = ASSET_MAP[assetClass] || [];
      items = items.filter(p => sectors.includes(p.sector));
    }
    if (sectorFilter !== "전체") items = items.filter(p => p.sector === sectorFilter);
    if (marketFilter !== "전체") {
      const m = marketFilter === "미국" ? "us" : marketFilter === "한국" ? "korea" : "global";
      items = items.filter(p => p.market === m);
    }
    if (showFavOnly) items = items.filter(p => favorites.includes(p.symbol));
    if (minChangePct !== "") items = items.filter(p => (p.changePct||0) >= Number(minChangePct));
    if (maxChangePct !== "") items = items.filter(p => (p.changePct||0) <= Number(maxChangePct));

    const [field, dir] = sortBy.split("_");
    items.sort((a, b) => {
      const av = a[field] || 0, bv = b[field] || 0;
      return dir === "desc" ? bv - av : av - bv;
    });
    return items.slice(0, 50);
  }, [allPrices, searchText, assetClass, sectorFilter, marketFilter, showFavOnly, favorites, sortBy, minChangePct, maxChangePct]);

  // 나스닥 100 종목 데이터
  const nasdaq100Items = useMemo(() => {
    return NASDAQ100.map(sym => {
      const p = Object.values(prices).find(p => p && p.symbol === sym);
      if (p) return p;
      return { symbol: sym, name: sym, price: 0, changePct: 0, volume: 0, market: "us", sector: "나스닥100", error: true };
    });
  }, [prices]);

  // 요약 통계
  const surge = allPrices.filter(p => (p.changePct||0) >= 2).length;
  const plunge = allPrices.filter(p => (p.changePct||0) <= -2).length;
  const avgChange = allPrices.length > 0 ? allPrices.reduce((s,p) => s+(p.changePct||0), 0) / allPrices.length : 0;

  function toggleCompare(symbol) {
    setCompareList(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol].slice(0, 4));
  }
  function toggleFavorite(symbol) {
    setFavorites(prev => prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]);
  }

  const isUp = (p) => (p.changePct||0) >= 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* 요약 카드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
        {[
          { label: "2% 이상 급등", value: surge, color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
          { label: "2% 이상 급락", value: plunge, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
          { label: "평균 등락률", value: `${avgChange >= 0 ? "+" : ""}${avgChange.toFixed(2)}%`, color: avgChange >= 0 ? "#16A34A" : "#DC2626", bg: avgChange >= 0 ? "#F0FDF4" : "#FEF2F2", border: avgChange >= 0 ? "#BBF7D0" : "#FECACA" },
          { label: "전체 종목", value: allPrices.length, color: BLUE, bg: BLUE_LIGHT, border: BLUE_BORDER },
          { label: "필터 결과", value: filtered.length, color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
        ].map(({ label, value, color, bg, border }) => (
          <div key={label} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: "10px", padding: "14px 16px" }}>
            <div style={{ fontSize: "11px", color, marginBottom: "4px", fontWeight: 600 }}>{label}</div>
            <div style={{ fontSize: "22px", fontWeight: 700, color }}>{value}</div>
          </div>
        ))}
      </div>

      {/* 데이터 기준 배너 */}
      <div style={{ background: BLUE_LIGHT, border: `1px solid ${BLUE_BORDER}`, borderRadius: "8px", padding: "10px 16px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontSize: "11px", fontWeight: 700, color: BLUE }}>데이터 기준</span>
        {["출처: Yahoo Finance", "매일 장 마감 후 자동 수집", "실패 시 2회 재시도", "5분 캐시 적용"].map(t => (
          <span key={t} style={{ fontSize: "10px", color: "#1E40AF", background: "#fff", padding: "2px 8px", borderRadius: "99px", border: `1px solid ${BLUE_BORDER}` }}>{t}</span>
        ))}
        {etfData?.updatedAt && (
          <span style={{ fontSize: "10px", color: "#93C5FD", marginLeft: "auto" }}>
            최종: {new Date(etfData.updatedAt).toLocaleString("ko-KR")}
          </span>
        )}
      </div>

      {/* 비교 뷰 */}
      {compareList.length > 0 && (
        <CompareView compareList={compareList} prices={prices}
          onRemove={sym => setCompareList(prev => prev.filter(s => s !== sym))}
          onClear={() => setCompareList([])} />
      )}

      {/* 나스닥 100 탭 버튼 */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button onClick={() => setNasdaq100View(false)} style={{
          padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
          border: `2px solid ${!nasdaq100View ? BLUE : GRAY_BORDER}`,
          background: !nasdaq100View ? BLUE_LIGHT : "#fff",
          color: !nasdaq100View ? BLUE : "#6B7280", cursor: "pointer",
        }}>전체 대시보드</button>
        <button onClick={() => setNasdaq100View(true)} style={{
          padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: 600,
          border: `2px solid ${nasdaq100View ? "#7C3AED" : GRAY_BORDER}`,
          background: nasdaq100View ? "#F5F3FF" : "#fff",
          color: nasdaq100View ? "#7C3AED" : "#6B7280", cursor: "pointer",
        }}>나스닥 100 종목</button>
      </div>

      {/* 나스닥 100 뷰 */}
      {nasdaq100View && (
        <div style={{ background: "#fff", border: "1.5px solid #DDD6FE", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", background: "#F5F3FF", borderBottom: "1px solid #DDD6FE", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "14px", fontWeight: 700, color: "#7C3AED" }}>나스닥 100 종목 ({nasdaq100Items.filter(p => !p.error).length}개 데이터)</span>
            <span style={{ fontSize: "11px", color: "#A78BFA" }}>총 100개 종목</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #DDD6FE", background: "#F5F3FF" }}>
                  {["순위", "종목", "현재가", "당일 등락", "30일 수익", "거래량"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "11px", color: "#7C3AED", fontWeight: 700 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {nasdaq100Items.map((item, i) => {
                  const up = (item.changePct||0) >= 0;
                  const hasData = !item.error && item.price > 0;
                  return (
                    <tr key={item.symbol}
                      style={{ borderBottom: `1px solid ${GRAY_BORDER}`, background: i % 2 === 0 ? "#fff" : "#FAFAFA", cursor: hasData ? "pointer" : "default", transition: "background 0.1s" }}
                      onMouseOver={e => hasData && (e.currentTarget.style.background = "#F5F3FF")}
                      onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#FAFAFA"}
                      onClick={() => hasData && setDetail(item)}
                    >
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{
                          width: "26px", height: "26px", borderRadius: "50%",
                          background: i < 3 ? "#7C3AED" : "#E5E7EB",
                          color: i < 3 ? "#fff" : "#6B7280",
                          display: "inline-flex", alignItems: "center", justifyContent: "center",
                          fontSize: "11px", fontWeight: 700,
                        }}>{i + 1}</span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ fontWeight: 700, color: "#111827" }}>{item.symbol}</div>
                        <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{item.name}</div>
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: hasData ? "#111827" : "#D1D5DB" }}>
                        {hasData ? `$${item.price.toFixed(2)}` : "—"}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        {hasData ? (
                          <span style={{
                            fontSize: "12px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px",
                            color: up ? "#16A34A" : "#DC2626",
                            background: up ? "#F0FDF4" : "#FEF2F2",
                            border: `1px solid ${up ? "#BBF7D0" : "#FECACA"}`,
                          }}>{up ? "▲" : "▼"} {Math.abs(item.changePct||0).toFixed(2)}%</span>
                        ) : <span style={{ color: "#D1D5DB" }}>—</span>}
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: hasData && item.ret30d != null ? ((item.ret30d||0) >= 0 ? "#16A34A" : "#DC2626") : "#D1D5DB" }}>
                        {hasData && item.ret30d != null ? `${(item.ret30d||0) >= 0 ? "+" : ""}${(item.ret30d||0).toFixed(2)}%` : "—"}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#6B7280", fontSize: "11px" }}>
                        {hasData ? (item.volume||0).toLocaleString() : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "12px 16px", fontSize: "11px", color: "#A78BFA", borderTop: "1px solid #DDD6FE", background: "#F5F3FF" }}>
            * 나스닥 100은 개별 주식 종목입니다. 데이터가 없는 종목(—)은 수집 대상에 포함되지 않아요.
          </div>
        </div>
      )}

      {/* 필터 영역 */}
      {!nasdaq100View && <div style={{ background: "#fff", border: `1.5px solid ${GRAY_BORDER}`, borderRadius: "10px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* 검색 + 보기 모드 */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input value={searchText} onChange={e => setSearchText(e.target.value)}
            placeholder="티커, 종목명, 섹터 검색..."
            style={{ flex: 1, padding: "8px 14px", borderRadius: "8px", border: `2px solid ${GRAY_BORDER}`, fontSize: "13px", outline: "none" }}
            onFocus={e => e.target.style.borderColor = BLUE}
            onBlur={e => e.target.style.borderColor = GRAY_BORDER}
          />
          <button onClick={() => setShowFavOnly(!showFavOnly)} style={{
            padding: "8px 14px", borderRadius: "8px",
            border: `2px solid ${showFavOnly ? "#F59E0B" : GRAY_BORDER}`,
            background: showFavOnly ? "#FFFBEB" : "#fff",
            color: showFavOnly ? "#D97706" : "#6B7280",
            cursor: "pointer", fontSize: "12px", fontWeight: 600, whiteSpace: "nowrap",
          }}>★ 즐겨찾기{favorites.length > 0 ? ` (${favorites.length})` : ""}</button>
          <div style={{ display: "flex", border: `2px solid ${GRAY_BORDER}`, borderRadius: "8px", overflow: "hidden" }}>
            {[["table","≡ 테이블"], ["card","⊞ 카드"]].map(([mode, label]) => (
              <button key={mode} onClick={() => setViewMode(mode)} style={{
                padding: "8px 12px", border: "none", fontSize: "12px", fontWeight: 600,
                background: viewMode === mode ? BLUE : "#fff",
                color: viewMode === mode ? "#fff" : "#6B7280",
                cursor: "pointer",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* 자산군 + 시장 필터 */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "11px", color: "#9CA3AF", alignSelf: "center", fontWeight: 600 }}>자산군</span>
          {ASSET_CLASSES.map(a => (
            <button key={a} onClick={() => setAssetClass(a)} style={{
              padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: 600,
              border: `1.5px solid ${assetClass === a ? BLUE : GRAY_BORDER}`,
              background: assetClass === a ? BLUE : "#fff",
              color: assetClass === a ? "#fff" : "#6B7280", cursor: "pointer",
            }}>{a}</button>
          ))}
          <span style={{ fontSize: "11px", color: "#9CA3AF", alignSelf: "center", fontWeight: 600, marginLeft: "8px" }}>시장</span>
          {["전체", "미국", "한국", "글로벌"].map(m => (
            <button key={m} onClick={() => setMarketFilter(m)} style={{
              padding: "4px 12px", borderRadius: "99px", fontSize: "12px", fontWeight: 600,
              border: `1.5px solid ${marketFilter === m ? "#7C3AED" : GRAY_BORDER}`,
              background: marketFilter === m ? "#7C3AED" : "#fff",
              color: marketFilter === m ? "#fff" : "#6B7280", cursor: "pointer",
            }}>{m}</button>
          ))}
        </div>

        {/* 정렬 + 등락률 범위 필터 */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 600 }}>정렬</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
            padding: "6px 12px", borderRadius: "8px", border: `1.5px solid ${GRAY_BORDER}`,
            fontSize: "12px", background: "#fff", cursor: "pointer", outline: "none",
          }}>
            {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
          </select>
          <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 600, marginLeft: "8px" }}>등락률 범위</span>
          <input type="number" value={minChangePct} onChange={e => setMinChangePct(e.target.value)}
            placeholder="최소%" style={{ width: "70px", padding: "6px 8px", borderRadius: "8px", border: `1.5px solid ${GRAY_BORDER}`, fontSize: "12px", outline: "none" }} />
          <span style={{ color: "#9CA3AF" }}>~</span>
          <input type="number" value={maxChangePct} onChange={e => setMaxChangePct(e.target.value)}
            placeholder="최대%" style={{ width: "70px", padding: "6px 8px", borderRadius: "8px", border: `1.5px solid ${GRAY_BORDER}`, fontSize: "12px", outline: "none" }} />
          {(searchText || assetClass !== "전체" || sectorFilter !== "전체" || marketFilter !== "전체" || showFavOnly || minChangePct || maxChangePct) && (
            <button onClick={() => { setSearchText(""); setAssetClass("전체"); setSectorFilter("전체"); setMarketFilter("전체"); setShowFavOnly(false); setMinChangePct(""); setMaxChangePct(""); }} style={{
              padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600,
              border: `1.5px solid #FECACA`, background: "#FEF2F2", color: "#DC2626", cursor: "pointer",
            }}>필터 초기화</button>
          )}
        </div>
      </div>

      </div>}

      {/* 결과 수 */}
      {!nasdaq100View && <div style={{ fontSize: "12px", color: "#9CA3AF" }}>
        {loading ? "로딩 중..." : `${filtered.length}개 표시 (전체 ${allPrices.length}개 중 상위 50개) · 클릭 시 상세 정보`}
        {compareList.length > 0 && <span style={{ marginLeft: "12px", color: BLUE, fontWeight: 600 }}>비교 중: {compareList.join(", ")}</span>}
      </div>}

      {/* 카드 뷰 */}
      {!nasdaq100View && viewMode === "card" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "14px" }}>
          {filtered.slice(0, 50).map(item => (
            <div key={item.symbol} onClick={() => setDetail(item)} style={{ position: "relative" }}>
              <SummaryCard item={item} />
              <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "4px" }}>
                <button onClick={e => { e.stopPropagation(); toggleFavorite(item.symbol); }} style={{
                  background: "none", border: "none", cursor: "pointer", fontSize: "14px",
                  color: favorites.includes(item.symbol) ? "#F59E0B" : "#D1D5DB",
                }}>★</button>
                <button onClick={e => { e.stopPropagation(); toggleCompare(item.symbol); }} style={{
                  background: compareList.includes(item.symbol) ? BLUE : "#F3F4F6",
                  border: "none", cursor: "pointer", fontSize: "10px", fontWeight: 700,
                  color: compareList.includes(item.symbol) ? "#fff" : "#6B7280",
                  padding: "2px 6px", borderRadius: "4px",
                }}>비교</button>
              </div>
            </div>
          ))}
          {filtered.length > 50 && <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#9CA3AF", fontSize: "12px", padding: "16px" }}>카드 뷰는 최대 50개까지 표시됩니다. 테이블 뷰를 이용해주세요.</div>}
        </div>
      )}

      {/* 테이블 뷰 */}
      {!nasdaq100View && viewMode === "table" && (
        <div style={{ background: "#fff", border: `1.5px solid ${GRAY_BORDER}`, borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
              <thead>
                <tr style={{ borderBottom: `2px solid ${BLUE_BORDER}`, background: BLUE_LIGHT }}>
                  {["★", "비교", "종목", "이름", "섹터", "감성", "현재가", "당일", "30일", "거래량", "출처"].map(h => (
                    <th key={h} style={{ padding: "11px 14px", textAlign: "left", fontSize: "11px", color: BLUE, fontWeight: 700, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={11} style={{ padding: "40px", textAlign: "center", color: "#9CA3AF" }}>조건에 맞는 종목이 없습니다</td></tr>
                ) : filtered.map((item, i) => {
                  const up = isUp(item);
                  const isKRW = item.currency === "KRW";
                  const sentiment = getSentiment(item.changePct, item.ret30d);
                  const inCmp = compareList.includes(item.symbol);
                  const isFav = favorites.includes(item.symbol);
                  return (
                    <tr key={item.symbol}
                      style={{ borderBottom: `1px solid ${GRAY_BORDER}`, background: i % 2 === 0 ? "#fff" : "#F9FAFB", cursor: "pointer", transition: "background 0.1s" }}
                      onMouseOver={e => e.currentTarget.style.background = BLUE_LIGHT}
                      onMouseOut={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#F9FAFB"}
                      onClick={() => setDetail(item)}
                    >
                      <td style={{ padding: "10px 14px" }} onClick={e => { e.stopPropagation(); toggleFavorite(item.symbol); }}>
                        <span style={{ cursor: "pointer", fontSize: "14px", color: isFav ? "#F59E0B" : "#D1D5DB" }}>★</span>
                      </td>
                      <td style={{ padding: "10px 14px" }} onClick={e => { e.stopPropagation(); toggleCompare(item.symbol); }}>
                        <button style={{
                          padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: 700, border: "none",
                          background: inCmp ? BLUE : "#F3F4F6", color: inCmp ? "#fff" : "#6B7280", cursor: "pointer",
                        }}>비교</button>
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: "#111827" }}>{item.symbol}</td>
                      <td style={{ padding: "10px 14px", color: "#6B7280", fontSize: "12px", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "99px", background: BLUE_LIGHT, color: BLUE, border: `1px solid ${BLUE_BORDER}`, fontWeight: 600, whiteSpace: "nowrap" }}>
                          {item.sector || "-"}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", color: sentiment.color, background: sentiment.bg, border: `1px solid ${sentiment.border}`, whiteSpace: "nowrap" }}>
                          {sentiment.label}
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: "#111827", whiteSpace: "nowrap" }}>
                        {isKRW ? `₩${(item.price||0).toLocaleString()}` : `$${(item.price||0).toFixed(2)}`}
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px", color: up ? "#16A34A" : "#DC2626", background: up ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${up ? "#BBF7D0" : "#FECACA"}`, whiteSpace: "nowrap" }}>
                          {up ? "▲" : "▼"} {Math.abs(item.changePct||0).toFixed(2)}%
                        </span>
                      </td>
                      <td style={{ padding: "10px 14px", fontWeight: 600, color: (item.ret30d||0) >= 0 ? "#16A34A" : "#DC2626", whiteSpace: "nowrap" }}>
                        {item.ret30d != null ? `${(item.ret30d||0) >= 0 ? "+" : ""}${(item.ret30d||0).toFixed(2)}%` : "-"}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#6B7280", fontSize: "11px", whiteSpace: "nowrap" }}>
                        {(item.volume||0).toLocaleString()}
                      </td>
                      <td style={{ padding: "10px 14px", color: "#9CA3AF", fontSize: "10px", whiteSpace: "nowrap" }}>Yahoo Finance</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {detail && (
        <DetailPopup item={detail} onClose={() => setDetail(null)} onCompare={toggleCompare} compareList={compareList} />
      )}
    </div>
  );
}
