// src/components/Portfolio.jsx
import { useState } from "react";

const PRESETS = [
  { name: "안정형 60/40", items: [{ symbol: "SPY", shares: 10 }, { symbol: "VEA", shares: 5 }, { symbol: "ACWI", shares: 5 }] },
  { name: "성장형 100", items: [{ symbol: "QQQ", shares: 10 }, { symbol: "ARKK", shares: 5 }, { symbol: "EEM", shares: 5 }] },
];

export default function Portfolio({ prices }) {
  const [holdings, setHoldings] = useState([
    { symbol: "SPY", shares: 5 },
    { symbol: "QQQ", shares: 3 },
  ]);
  const [newSymbol, setNewSymbol] = useState("");
  const [newShares, setNewShares] = useState("");

  function addHolding() {
    const sym = newSymbol.toUpperCase().trim();
    if (!sym || !newShares) return;
    setHoldings((prev) => {
      const existing = prev.findIndex((h) => h.symbol === sym);
      if (existing >= 0) {
        return prev.map((h, i) => i === existing ? { ...h, shares: h.shares + Number(newShares) } : h);
      }
      return [...prev, { symbol: sym, shares: Number(newShares) }];
    });
    setNewSymbol("");
    setNewShares("");
  }

  function removeHolding(symbol) {
    setHoldings((prev) => prev.filter((h) => h.symbol !== symbol));
  }

  const rows = holdings.map((h) => {
    const p = prices[h.symbol];
    const price = p?.price || 0;
    const value = price * h.shares;
    const changePct = p?.changePct || 0;
    return { ...h, price, value, changePct };
  });

  const totalValue = rows.reduce((acc, r) => acc + r.value, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Summary */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "1px solid var(--color-border-tertiary)",
        borderRadius: "12px", padding: "24px",
        display: "flex", gap: "32px", flexWrap: "wrap",
      }}>
        <div>
          <div style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>총 평가금액</div>
          <div style={{ fontSize: "28px", fontWeight: 500, color: "var(--color-text-primary)" }}>
            ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
        <div>
          <div style={{ fontSize: "13px", color: "var(--color-text-tertiary)" }}>보유 종목</div>
          <div style={{ fontSize: "28px", fontWeight: 500, color: "var(--color-text-primary)" }}>{holdings.length}</div>
        </div>
      </div>

      {/* Presets */}
      <div style={{ display: "flex", gap: "8px" }}>
        <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", alignSelf: "center" }}>프리셋: </span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            onClick={() => setHoldings(p.items)}
            style={{
              padding: "6px 14px", borderRadius: "99px",
              border: "1px solid var(--color-border-tertiary)",
              background: "transparent", color: "var(--color-text-secondary)",
              cursor: "pointer", fontSize: "12px",
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Holdings table */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "1px solid var(--color-border-tertiary)",
        borderRadius: "12px", overflow: "hidden",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--color-border-tertiary)" }}>
              {["종목", "수량", "현재가", "평가금액", "수익률", "비중", ""].map((h) => (
                <th key={h} style={{
                  padding: "12px 16px", textAlign: "left",
                  fontSize: "12px", color: "var(--color-text-tertiary)", fontWeight: 400,
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.symbol} style={{ borderBottom: "1px solid var(--color-border-tertiary)" }}>
                <td style={{ padding: "14px 16px", fontWeight: 500, color: "var(--color-text-primary)" }}>{r.symbol}</td>
                <td style={{ padding: "14px 16px", color: "var(--color-text-secondary)" }}>{r.shares}</td>
                <td style={{ padding: "14px 16px", color: "var(--color-text-secondary)" }}>
                  {r.price > 0 ? `$${r.price.toFixed(2)}` : "—"}
                </td>
                <td style={{ padding: "14px 16px", color: "var(--color-text-primary)" }}>
                  {r.value > 0 ? `$${r.value.toFixed(2)}` : "—"}
                </td>
                <td style={{
                  padding: "14px 16px",
                  color: r.changePct >= 0 ? "var(--color-text-success)" : "var(--color-text-danger)",
                }}>
                  {r.changePct !== 0 ? `${r.changePct >= 0 ? "+" : ""}${r.changePct.toFixed(2)}%` : "—"}
                </td>
                <td style={{ padding: "14px 16px", color: "var(--color-text-secondary)" }}>
                  {totalValue > 0 ? `${((r.value / totalValue) * 100).toFixed(1)}%` : "—"}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <button
                    onClick={() => removeHolding(r.symbol)}
                    style={{
                      padding: "3px 10px", borderRadius: "6px", fontSize: "12px",
                      border: "1px solid var(--color-border-tertiary)",
                      background: "transparent", color: "var(--color-text-tertiary)", cursor: "pointer",
                    }}
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add holding */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "1px solid var(--color-border-tertiary)",
        borderRadius: "12px", padding: "20px",
        display: "flex", gap: "12px", alignItems: "flex-end", flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>종목 코드</label>
          <input
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
            placeholder="SPY"
            style={{
              padding: "8px 12px", borderRadius: "8px",
              border: "1px solid var(--color-border-secondary)",
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)", fontSize: "14px", width: "100px",
            }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          <label style={{ fontSize: "12px", color: "var(--color-text-secondary)" }}>수량</label>
          <input
            type="number"
            value={newShares}
            onChange={(e) => setNewShares(e.target.value)}
            placeholder="10"
            style={{
              padding: "8px 12px", borderRadius: "8px",
              border: "1px solid var(--color-border-secondary)",
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)", fontSize: "14px", width: "80px",
            }}
          />
        </div>
        <button
          onClick={addHolding}
          style={{
            padding: "8px 20px", borderRadius: "8px", border: "none",
            background: "var(--color-text-primary)", color: "var(--color-background-primary)",
            cursor: "pointer", fontSize: "14px", fontWeight: 500,
          }}
        >
          추가
        </button>
      </div>
    </div>
  );
}
