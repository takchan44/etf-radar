import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import AIRecommend from "./components/AIRecommend";
import ActiveETF from "./components/ActiveETF";
import { fetchETFData } from "./api/client";

const TABS = [
  { id: "dashboard", label: "대시보드" },
  { id: "active",    label: "액티브 ETF" },
  { id: "recommend", label: "AI 추천" },
];

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [etfData, setEtfData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => { loadData(); }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchETFData();
      setEtfData(data);
    } catch (err) {
      setError("데이터를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  const prices = {};
  (etfData?.prices || []).forEach(p => { prices[p.symbol] = p; });

  return (
    <div style={{ minHeight: "100vh", background: "#F3F4F6" }}>
      <header style={{
        background: "#1E3A5F", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: "64px", position: "sticky", top: 0, zIndex: 100,
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
          {etfData?.updatedAt && (
            <span style={{ fontSize: "12px", color: "#93C5FD" }}>
              업데이트: {new Date(etfData.updatedAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })}
            </span>
          )}
          {loading && <span style={{ fontSize: "12px", color: "#93C5FD" }}>로딩 중...</span>}
          <button
            onClick={loadData}
            style={{
              padding: "7px 16px", borderRadius: "8px",
              border: "2px solid #93C5FD", background: "transparent",
              color: "#93C5FD", cursor: "pointer", fontSize: "13px", fontWeight: 500,
            }}
            onMouseOver={e => { e.target.style.background = BLUE; e.target.style.borderColor = BLUE; e.target.style.color = "#fff"; }}
            onMouseOut={e => { e.target.style.background = "transparent"; e.target.style.borderColor = "#93C5FD"; e.target.style.color = "#93C5FD"; }}
          >
            새로고침
          </button>
        </div>
      </header>

      <nav style={{
        background: "#fff", borderBottom: `2px solid ${GRAY_BORDER}`,
        padding: "0 24px", display: "flex", gap: "4px", overflowX: "auto",
      }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
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
          }}>
            {t.label}
          </button>
        ))}
      </nav>

      <main style={{ padding: "28px 24px", maxWidth: "1280px", margin: "0 auto" }}>
        {error && (
          <div style={{
            padding: "16px", borderRadius: "10px", marginBottom: "20px",
            background: "#FEF2F2", border: "1.5px solid #FECACA", color: "#DC2626",
          }}>
            {error}
          </div>
        )}
        {tab === "dashboard" && <Dashboard prices={prices} loading={loading} etfData={etfData} />}
        {tab === "active"    && <ActiveETF prices={prices} etfData={etfData} />}
        {tab === "recommend" && <AIRecommend etfData={etfData} />}
      </main>
    </div>
  );
}
