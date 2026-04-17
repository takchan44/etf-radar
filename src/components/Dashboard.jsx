import { useState } from "react";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";

const MARKET_LABELS = { us: "미국", korea: "한국", global: "글로벌" };

const ETF_META = {
  // ── 미국 전체시장 ──────────────────────────────
  SPY:  { market: "us", sector: "전체시장",  desc: "S&P 500" },
  VOO:  { market: "us", sector: "전체시장",  desc: "S&P 500 (Vanguard)" },
  IVV:  { market: "us", sector: "전체시장",  desc: "S&P 500 (iShares)" },
  VTI:  { market: "us", sector: "전체시장",  desc: "미국 전체 주식" },
  ITOT: { market: "us", sector: "전체시장",  desc: "미국 전체 주식 (iShares)" },
  DIA:  { market: "us", sector: "전체시장",  desc: "다우존스 30" },
  // ── 미국 기술/성장 ─────────────────────────────
  QQQ:  { market: "us", sector: "기술",      desc: "나스닥 100" },
  QQQM: { market: "us", sector: "기술",      desc: "나스닥 100 (소액)" },
  VGT:  { market: "us", sector: "기술",      desc: "IT 섹터" },
  XLK:  { market: "us", sector: "기술",      desc: "기술 섹터 SPDR" },
  SOXX: { market: "us", sector: "반도체",    desc: "반도체 iShares" },
  SMH:  { market: "us", sector: "반도체",    desc: "반도체 VanEck" },
  IGV:  { market: "us", sector: "소프트웨어",desc: "소프트웨어 iShares" },
  CIBR: { market: "us", sector: "사이버보안",desc: "사이버보안 First Trust" },
  HACK: { market: "us", sector: "사이버보안",desc: "사이버보안 ETFMG" },
  CLOU: { market: "us", sector: "클라우드",  desc: "클라우드 컴퓨팅" },
  WCLD: { market: "us", sector: "클라우드",  desc: "클라우드 WisdomTree" },
  ROBO: { market: "us", sector: "로보틱스",  desc: "로보틱스 & AI" },
  BOTZ: { market: "us", sector: "로보틱스",  desc: "로보틱스 Global X" },
  // ── 미국 AI/혁신 ───────────────────────────────
  ARKK: { market: "us", sector: "혁신",      desc: "ARK 혁신 ETF" },
  ARKW: { market: "us", sector: "혁신",      desc: "ARK 차세대인터넷" },
  ARKQ: { market: "us", sector: "혁신",      desc: "ARK 자율기술&로봇" },
  ARKF: { market: "us", sector: "혁신",      desc: "ARK 핀테크" },
  ARKG: { market: "us", sector: "혁신",      desc: "ARK 유전체혁명" },
  AIQ:  { market: "us", sector: "AI",        desc: "AI & 빅데이터" },
  IRBO: { market: "us", sector: "AI",        desc: "AI & 로보틱스" },
  // ── 미국 소형/중형 ─────────────────────────────
  IWM:  { market: "us", sector: "소형주",    desc: "Russell 2000" },
  IJR:  { market: "us", sector: "소형주",    desc: "S&P 600 소형주" },
  MDY:  { market: "us", sector: "중형주",    desc: "S&P 400 중형주" },
  IJH:  { market: "us", sector: "중형주",    desc: "S&P 400 (iShares)" },
  // ── 미국 가치/배당 ─────────────────────────────
  VTV:  { market: "us", sector: "가치주",    desc: "대형 가치주" },
  IWD:  { market: "us", sector: "가치주",    desc: "Russell 1000 가치" },
  DVY:  { market: "us", sector: "배당",      desc: "고배당 iShares" },
  VYM:  { market: "us", sector: "배당",      desc: "고배당 Vanguard" },
  SCHD: { market: "us", sector: "배당",      desc: "배당 성장 Schwab" },
  HDV:  { market: "us", sector: "배당",      desc: "핵심 배당 iShares" },
  DGRO: { market: "us", sector: "배당",      desc: "배당 성장 iShares" },
  // ── 미국 섹터 ──────────────────────────────────
  XLF:  { market: "us", sector: "금융",      desc: "금융 섹터" },
  XLV:  { market: "us", sector: "헬스케어",  desc: "헬스케어 섹터" },
  XLE:  { market: "us", sector: "에너지",    desc: "에너지 섹터" },
  XLI:  { market: "us", sector: "산업",      desc: "산업 섹터" },
  XLY:  { market: "us", sector: "소비재",    desc: "임의소비재 섹터" },
  XLP:  { market: "us", sector: "필수소비재",desc: "필수소비재 섹터" },
  XLU:  { market: "us", sector: "유틸리티",  desc: "유틸리티 섹터" },
  XLRE: { market: "us", sector: "부동산",    desc: "부동산 섹터" },
  XLB:  { market: "us", sector: "소재",      desc: "소재 섹터" },
  XLC:  { market: "us", sector: "통신",      desc: "통신 섹터" },
  IBB:  { market: "us", sector: "바이오",    desc: "바이오텍 iShares" },
  XBI:  { market: "us", sector: "바이오",    desc: "바이오텍 SPDR" },
  IYR:  { market: "us", sector: "부동산",    desc: "부동산 iShares" },
  VNQ:  { market: "us", sector: "부동산",    desc: "리츠 Vanguard" },
  // ── 미국 채권/안전자산 ─────────────────────────
  TLT:  { market: "us", sector: "채권",      desc: "20년+ 미국채" },
  IEF:  { market: "us", sector: "채권",      desc: "7-10년 미국채" },
  SHY:  { market: "us", sector: "채권",      desc: "1-3년 미국채" },
  AGG:  { market: "us", sector: "채권",      desc: "미국 종합채권" },
  BND:  { market: "us", sector: "채권",      desc: "미국 채권 Vanguard" },
  HYG:  { market: "us", sector: "채권",      desc: "하이일드 채권" },
  LQD:  { market: "us", sector: "채권",      desc: "투자등급 회사채" },
  GLD:  { market: "us", sector: "원자재",    desc: "금 SPDR" },
  IAU:  { market: "us", sector: "원자재",    desc: "금 iShares" },
  SLV:  { market: "us", sector: "원자재",    desc: "은 iShares" },
  USO:  { market: "us", sector: "원자재",    desc: "원유 United States" },
  // ── 미국 레버리지/인버스 ───────────────────────
  TQQQ: { market: "us", sector: "레버리지",  desc: "나스닥 3배 레버리지" },
  SQQQ: { market: "us", sector: "인버스",    desc: "나스닥 3배 인버스" },
  UPRO: { market: "us", sector: "레버리지",  desc: "S&P500 3배 레버리지" },
  SPXU: { market: "us", sector: "인버스",    desc: "S&P500 3배 인버스" },
  // ── 글로벌 ────────────────────────────────────
  VEA:  { market: "global", sector: "선진국",   desc: "미국 제외 선진국" },
  EFA:  { market: "global", sector: "선진국",   desc: "선진국 iShares" },
  IEFA: { market: "global", sector: "선진국",   desc: "핵심 선진국 iShares" },
  VWO:  { market: "global", sector: "신흥국",   desc: "신흥국 Vanguard" },
  EEM:  { market: "global", sector: "신흥국",   desc: "신흥국 iShares" },
  IEMG: { market: "global", sector: "신흥국",   desc: "핵심 신흥국 iShares" },
  ACWI: { market: "global", sector: "전세계",   desc: "전 세계 주식" },
  VT:   { market: "global", sector: "전세계",   desc: "전 세계 Vanguard" },
  URTH: { market: "global", sector: "전세계",   desc: "세계 iShares MSCI" },
  EWJ:  { market: "global", sector: "일본",     desc: "일본 iShares" },
  EWG:  { market: "global", sector: "독일",     desc: "독일 iShares" },
  EWY:  { market: "global", sector: "한국",     desc: "한국 iShares" },
  EWZ:  { market: "global", sector: "브라질",   desc: "브라질 iShares" },
  FXI:  { market: "global", sector: "중국",     desc: "중국 대형주 iShares" },
  MCHI: { market: "global", sector: "중국",     desc: "중국 MSCI iShares" },
  KWEB: { market: "global", sector: "중국",     desc: "중국 인터넷 KraneShares" },
  EWC:  { market: "global", sector: "캐나다",   desc: "캐나다 iShares" },
  EWA:  { market: "global", sector: "호주",     desc: "호주 iShares" },
  EWU:  { market: "global", sector: "영국",     desc: "영국 iShares" },
  // ── 한국 ──────────────────────────────────────
  "069500": { market: "korea", sector: "전체시장",  desc: "KODEX 200" },
  "133690": { market: "korea", sector: "전체시장",  desc: "TIGER 코스피100" },
  "229200": { market: "korea", sector: "전체시장",  desc: "KODEX 코스닥150" },
  "102110": { market: "korea", sector: "전체시장",  desc: "TIGER 200" },
  "148020": { market: "korea", sector: "헬스케어",  desc: "KODEX 바이오" },
  "091160": { market: "korea", sector: "반도체",    desc: "KODEX 반도체" },
  "157490": { market: "korea", sector: "반도체",    desc: "TIGER 반도체" },
  "305720": { market: "korea", sector: "2차전지",   desc: "KODEX 2차전지산업" },
  "305540": { market: "korea", sector: "2차전지",   desc: "TIGER 2차전지테마" },
  "139220": { market: "korea", sector: "IT",        desc: "TIGER IT" },
  "266390": { market: "korea", sector: "IT",        desc: "KODEX 게임산업" },
  "364980": { market: "korea", sector: "AI",        desc: "TIGER AI코리아그로스" },
  "385720": { market: "korea", sector: "AI",        desc: "KODEX AI반도체핵심장비" },
  "195930": { market: "korea", sector: "선진국",    desc: "TIGER 선진국MSCI" },
  "192090": { market: "korea", sector: "신흥국",    desc: "TIGER 신흥국MSCI" },
  "114800": { market: "korea", sector: "인버스",    desc: "KODEX 인버스" },
  "122630": { market: "korea", sector: "레버리지",  desc: "KODEX 레버리지" },
  "252670": { market: "korea", sector: "인버스",    desc: "KODEX 200선물인버스2X" },
  "233740": { market: "korea", sector: "레버리지",  desc: "KODEX 코스닥150레버리지" },
  "kodex-dividend": { market: "korea", sector: "배당", desc: "KODEX 고배당" },
};

const SECTORS = [...new Set(Object.values(ETF_META).map(e => e.sector))].sort();

function ETFCard({ symbol, data }) {
  const meta = ETF_META[symbol] || { market: "us", sector: "기타", desc: "" };
  const isUp = (data?.changePct || 0) >= 0;

  return (
    <div style={{
      background: "#fff",
      border: `1.5px solid ${GRAY_BORDER}`,
      borderTop: `4px solid ${BLUE}`,
      borderRadius: "10px",
      padding: "16px",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
      transition: "box-shadow 0.15s",
    }}
    onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(37,99,235,0.12)"}
    onMouseOut={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: "17px", fontWeight: 700, color: "#111827" }}>{symbol}</div>
          <div style={{ fontSize: "11px", color: "#6B7280", marginTop: "2px" }}>{data?.name || meta.desc}</div>
        </div>
        <span style={{
          fontSize: "10px", padding: "2px 8px", borderRadius: "99px",
          background: BLUE_LIGHT, color: BLUE,
          border: `1.5px solid ${BLUE_BORDER}`, fontWeight: 600, whiteSpace: "nowrap",
        }}>
          {meta.sector}
        </span>
      </div>

      {data?.error ? (
        <div style={{ fontSize: "12px", color: "#9CA3AF" }}>데이터 없음</div>
      ) : (
        <>
          <div style={{ fontSize: "22px", fontWeight: 700, color: "#111827" }}>
            {data?.currency === "KRW"
              ? `₩${(data?.price || 0).toLocaleString()}`
              : `$${(data?.price || 0).toFixed(2)}`}
          </div>
          <div style={{
            fontSize: "13px", fontWeight: 600,
            color: isUp ? "#16A34A" : "#DC2626",
            padding: "3px 8px", borderRadius: "6px",
            background: isUp ? "#F0FDF4" : "#FEF2F2",
            border: `1.5px solid ${isUp ? "#BBF7D0" : "#FECACA"}`,
            display: "inline-block",
          }}>
            {isUp ? "▲" : "▼"} {Math.abs(data?.changePct || 0).toFixed(2)}%
            <span style={{ fontWeight: 400, marginLeft: "4px" }}>
              ({isUp ? "+" : ""}{(data?.change || 0).toFixed(2)})
            </span>
          </div>
        </>
      )}
    </div>
  );
}

export default function Dashboard({ prices, loading }) {
  const [marketFilter, setMarketFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [search, setSearch] = useState("");

  const symbols = Object.keys(ETF_META).filter((s) => {
    const meta = ETF_META[s];
    const matchMarket = marketFilter === "all" || meta.market === marketFilter;
    const matchSector = sectorFilter === "all" || meta.sector === sectorFilter;
    const matchSearch = search === "" ||
      s.toLowerCase().includes(search.toLowerCase()) ||
      meta.desc.toLowerCase().includes(search.toLowerCase()) ||
      meta.sector.toLowerCase().includes(search.toLowerCase());
    return matchMarket && matchSector && matchSearch;
  });

  return (
    <div>
      {/* 검색 */}
      <div style={{ marginBottom: "16px" }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="종목명 또는 섹터 검색..."
          style={{
            width: "100%", padding: "10px 16px", borderRadius: "8px",
            border: `2px solid ${GRAY_BORDER}`, fontSize: "14px",
            outline: "none", boxSizing: "border-box",
            transition: "border-color 0.15s",
          }}
          onFocus={e => e.target.style.borderColor = BLUE}
          onBlur={e => e.target.style.borderColor = GRAY_BORDER}
        />
      </div>

      {/* 시장 필터 */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
        {["all", "us", "korea", "global"].map((m) => (
          <button key={m} onClick={() => setMarketFilter(m)} style={{
            padding: "6px 16px", borderRadius: "8px",
            border: marketFilter === m ? `2px solid ${BLUE}` : `2px solid ${GRAY_BORDER}`,
            background: marketFilter === m ? BLUE_LIGHT : "#fff",
            color: marketFilter === m ? BLUE : "#374151",
            cursor: "pointer", fontSize: "13px", fontWeight: marketFilter === m ? 700 : 400,
            transition: "all 0.15s",
          }}>
            {m === "all" ? "전체 시장" : MARKET_LABELS[m]}
          </button>
        ))}
        {loading && <span style={{ fontSize: "13px", color: "#9CA3AF", alignSelf: "center" }}>로딩 중...</span>}
      </div>

      {/* 섹터 필터 */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
        <button onClick={() => setSectorFilter("all")} style={{
          padding: "4px 12px", borderRadius: "99px",
          border: sectorFilter === "all" ? `2px solid ${BLUE}` : `2px solid ${GRAY_BORDER}`,
          background: sectorFilter === "all" ? BLUE : "#fff",
          color: sectorFilter === "all" ? "#fff" : "#374151",
          cursor: "pointer", fontSize: "12px", fontWeight: 600,
          transition: "all 0.15s",
        }}>전체 섹터</button>
        {SECTORS.map(s => (
          <button key={s} onClick={() => setSectorFilter(s)} style={{
            padding: "4px 12px", borderRadius: "99px",
            border: sectorFilter === s ? `2px solid ${BLUE}` : `2px solid ${GRAY_BORDER}`,
            background: sectorFilter === s ? BLUE : "#fff",
            color: sectorFilter === s ? "#fff" : "#374151",
            cursor: "pointer", fontSize: "12px", fontWeight: 600,
            transition: "all 0.15s",
          }}>{s}</button>
        ))}
      </div>

      {/* 결과 수 */}
      <div style={{ fontSize: "13px", color: "#6B7280", marginBottom: "16px" }}>
        {symbols.length}개 종목
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "14px",
      }}>
        {symbols.map((symbol) => (
          <ETFCard key={symbol} symbol={symbol} data={prices[symbol]} />
        ))}
      </div>

      {/* Summary */}
      {Object.keys(prices).length > 0 && (
        <div style={{
          marginTop: "28px", padding: "20px 24px",
          background: "#fff", border: `1.5px solid ${GRAY_BORDER}`,
          borderRadius: "10px", display: "flex", gap: "40px", flexWrap: "wrap",
        }}>
          {[
            { label: "상승 종목", value: Object.values(prices).filter(p => (p.changePct || 0) > 0).length, color: "#16A34A" },
            { label: "하락 종목", value: Object.values(prices).filter(p => (p.changePct || 0) < 0).length, color: "#DC2626" },
            { label: "전체 종목", value: Object.keys(ETF_META).length, color: BLUE },
            { label: "표시 종목", value: symbols.length, color: "#6B7280" },
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
