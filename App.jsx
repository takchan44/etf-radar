import { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import AIRecommend from "./components/AIRecommend";
import Portfolio from "./components/Portfolio";
import SectorChart from "./components/SectorChart";
import { fetchETFPrices } from "./api/client";

const TABS = [
  { id: "dashboard", label: "대시보드" },
  { id: "recommend", label: "AI 추천" },
  { id: "portfolio", label: "포트폴리오" },
  { id: "sector",    label: "섹터 분류" },
];

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    loadPrices();
    const interval = setInterval(loadPrices, 5 * 60 * 1000); // 5분마다 갱신
    return () => clearInterval(interval);
  }, []);

  async function loadPrices() {
    try {
      setLoading(true);
      const symbols = "SPY,QQQ,IWM,DIA,VTI,ARKK,VEA,EEM,ACWI";
      const data = await fetchETFPrices(symbols);
      setPrices(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("가격 조회 실패:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-background-tertiary)" }}>
      {/* Header */}
      <header style={{
        background: "var(--color-background-primary)",
        borderBottom: "1px solid var(--color-border-tertiary)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "60px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px", fontWeight: 500, color: "var(--color-text-primary)" }}>
            ETF 대시보드
          </span>
          <span style={{
            fontSize: "11px", padding: "2px 8px", borderRadius: "99px",
            background: "var(--color-background-success)", color: "var(--color-text-success)",
          }}>
            AI 추천
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {lastUpdated && (
            <span style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>
              업데이트: {lastUpdated.toLocaleTimeString("ko-KR")}
            </span>
          )}
          <button
            onClick={loadPrices}
            style={{
              padding: "6px 14px", borderRadius: "8px", border: "1px solid var(--color-border-secondary)",
              background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer",
              fontSize: "13px",
            }}
          >
            새로고침
          </button>
        </div>
      </header>

      {/* Tab Nav */}
      <nav style={{
        background: "var(--color-background-primary)",
        borderBottom: "1px solid var(--color-border-tertiary)",
        padding: "0 24px",
        display: "flex", gap: "4px",
      }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "12px 16px",
              border: "none",
              borderBottom: tab === t.id ? "2px solid var(--color-text-primary)" : "2px solid transparent",
              background: "transparent",
              color: tab === t.id ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: tab === t.id ? 500 : 400,
              transition: "all 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <main style={{ padding: "24px", maxWidth: "1280px", margin: "0 auto" }}>
        {tab === "dashboard"  && <Dashboard prices={prices} loading={loading} />}
        {tab === "recommend"  && <AIRecommend />}
        {tab === "portfolio"  && <Portfolio prices={prices} />}
        {tab === "sector"     && <SectorChart prices={prices} />}
      </main>
    </div>
  );
}
