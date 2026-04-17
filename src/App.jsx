import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import AIRecommend from "./components/AIRecommend";
import Portfolio from "./components/Portfolio";
import SectorChart from "./components/SectorChart";
import ActiveETF from "./components/ActiveETF";
import { fetchETFPrices } from "./api/client";

const TABS = [
  { id: "dashboard", label: "대시보드" },
  { id: "recommend", label: "AI 추천" },
  { id: "portfolio", label: "포트폴리오" },
  { id: "sector",    label: "섹터 분류" },
  { id: "active",    label: "액티브 ETF" },
];

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";

// 한국 ETF는 .KS 붙여서 요청, 나머지는 그대로
const ALL_SYMBOLS = [
  // 미국
  "SPY","VOO","IVV","VTI","DIA","QQQ","QQQM","VGT","XLK","SOXX","SMH","IGV",
  "CIBR","CLOU","ROBO","BOTZ","ARKK","ARKW","ARKQ","ARKF","ARKG","AIQ","IRBO",
  "IWM","IJR","MDY","IJH","VTV","IWD","DVY","VYM","SCHD","HDV","DGRO",
  "XLF","XLV","XLE","XLI","XLY","XLP","XLU","XLRE","XLB","XLC","IBB","XBI","VNQ",
  "TLT","IEF","SHY","AGG","BND","HYG","LQD","GLD","IAU","SLV","USO",
  "TQQQ","SQQQ","UPRO","SPXU",
  // 글로벌
  "VEA","EFA","IEFA","VWO","EEM","IEMG","ACWI","VT","EWJ","EWG","EWY","EWZ","FXI","MCHI","KWEB","EWC","EWA","EWU",
  // 한국 (.KS 붙여서 요청)
  "069500.KS","133690.KS","229200.KS","102110.KS","148020.KS",
  "091160.KS","157490.KS","305720.KS","305540.KS","139220.KS",
  "266390.KS","364980.KS","385720.KS","195930.KS","192090.KS",
  "114800.KS","122630.KS","252670.KS","233740.KS",
].join(",");

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadPrices();
    const interval = setInterval(loadPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  async function loadPrices() {
    try {
      setLoading(true);
      const data = await fetchETFPrices(ALL_SYMBOLS);
      setPrices(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("가격 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6" }}>
      <header style={{
        background: "#1E3A5F",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 8px rgba(0,0,0,0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "22px", fontWeight: 700, color: "#fff", letterSpacing: "-0.5px" }}>
            ETF Radar
          </span>
          <span style={{
            fontSize: "11px", padding: "3px 10px", borderRadius: "99px",
            background: BLUE, color: "#fff", fontWeight: 600,
          }}>AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {lastUpdated && (
            <span style={{ fontSize: "12px", color: "#93C5FD" }}>
              업데이트: {lastUpdated.toLocaleTimeString("ko-KR")}
            </span>
          )}
          {loading && <span style={{ fontSize: "12px", color: "#93C5FD" }}>로딩 중...</span>}
          <button
            onClick={loadPrices}
            style={{
              padding: "7px 16px", borderRadius: "8px",
              border: "2px solid #93C5FD",
              background: "transparent", color: "#93C5FD", cursor: "pointer",
              fontSize: "13px", fontWeight: 500, transition: "all 0.15s",
            }}
            onMouseOver={e => { e.target.style.background = BLUE; e.target.style.borderColor = BLUE; e.target.style.color = "#fff"; }}
            onMouseOut={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "#93C5FD"; e.target.style.color = "#93C5FD"; }}
          >
            새로고침
          </button>
        </div>
      </header>

      <nav style={{
        background: "#fff",
        borderBottom: `2px solid ${GRAY_BORDER}`,
        padding: "0 24px",
        display: "flex", gap: "4px",
        overflowX: "auto",
      }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "14px 20px", border: "none",
              borderBottom: tab === t.id ? `3px solid ${BLUE}` : "3px solid transparent",
              background: tab === t.id ? BLUE_LIGHT : "transparent",
              color: tab === t.id ? BLUE : "#6B7280",
              cursor: "pointer", fontSize: "14px",
              fontWeight: tab === t.id ? 700 : 400,
              transition: "all 0.15s",
              borderRadius: tab === t.id ? "6px 6px 0 0" : "0",
              outline: tab === t.id ? `2px solid ${BLUE_BORDER}` : "none",
              outlineOffset: "-2px", whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main style={{ padding: "28px 24px", maxWidth: "1280px", margin: "0 auto" }}>
        {tab === "dashboard" && <Dashboard prices={prices} loading={loading} />}
        {tab === "recommend" && <AIRecommend />}
        {tab === "portfolio" && <Portfolio prices={prices} />}
        {tab === "sector"    && <SectorChart prices={prices} />}
        {tab === "active"    && <ActiveETF prices={prices} />}
      </main>
    </div>
  );
}
