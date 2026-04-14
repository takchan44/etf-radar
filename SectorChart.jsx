// src/components/SectorChart.jsx
const SECTOR_DATA = [
  { sector: "전체시장",  market: "us",     etfs: ["SPY", "VTI", "DIA"],  color: "#4F8EF7" },
  { sector: "기술",      market: "us",     etfs: ["QQQ", "SOXX", "XLK"], color: "#7F77DD" },
  { sector: "혁신",      market: "us",     etfs: ["ARKK"],                color: "#E8593C" },
  { sector: "소형주",    market: "us",     etfs: ["IWM"],                 color: "#EF9F27" },
  { sector: "선진국",    market: "global", etfs: ["VEA", "EFA"],          color: "#1D9E75" },
  { sector: "신흥국",    market: "global", etfs: ["EEM", "VWO"],          color: "#5DCAA5" },
  { sector: "전세계",    market: "global", etfs: ["ACWI"],                color: "#9FE1CB" },
];

const MARKET_LABELS = { us: "미국", korea: "한국", global: "글로벌" };

export default function SectorChart({ prices }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
        섹터별로 분류된 ETF 현황입니다. 가격 데이터는 대시보드 탭에서 새로고침하세요.
      </div>

      {SECTOR_DATA.map((group) => {
        const avgChange = group.etfs.reduce((acc, sym) => {
          return acc + (prices[sym]?.changePct || 0);
        }, 0) / group.etfs.length;
        const isUp = avgChange >= 0;

        return (
          <div
            key={group.sector}
            style={{
              background: "var(--color-background-primary)",
              border: "1px solid var(--color-border-tertiary)",
              borderRadius: "12px", padding: "20px",
              borderLeft: `4px solid ${group.color}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "10px", height: "10px", borderRadius: "50%",
                  background: group.color, flexShrink: 0,
                }} />
                <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--color-text-primary)" }}>
                  {group.sector}
                </span>
                <span style={{
                  fontSize: "11px", padding: "2px 8px", borderRadius: "99px",
                  background: "var(--color-background-secondary)", color: "var(--color-text-secondary)",
                }}>
                  {MARKET_LABELS[group.market]}
                </span>
              </div>
              {avgChange !== 0 && (
                <span style={{
                  fontSize: "13px", fontWeight: 500,
                  color: isUp ? "var(--color-text-success)" : "var(--color-text-danger)",
                }}>
                  {isUp ? "▲" : "▼"} 평균 {Math.abs(avgChange).toFixed(2)}%
                </span>
              )}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              {group.etfs.map((sym) => {
                const p = prices[sym];
                const changePct = p?.changePct || 0;
                const isSymUp = changePct >= 0;
                return (
                  <div
                    key={sym}
                    style={{
                      padding: "12px 16px", borderRadius: "8px",
                      background: "var(--color-background-secondary)",
                      minWidth: "120px",
                    }}
                  >
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)" }}>{sym}</div>
                    {p?.price ? (
                      <>
                        <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>
                          ${p.price.toFixed(2)}
                        </div>
                        <div style={{
                          fontSize: "12px", marginTop: "2px",
                          color: isSymUp ? "var(--color-text-success)" : "var(--color-text-danger)",
                        }}>
                          {isSymUp ? "+" : ""}{changePct.toFixed(2)}%
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: "12px", color: "var(--color-text-tertiary)" }}>—</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
