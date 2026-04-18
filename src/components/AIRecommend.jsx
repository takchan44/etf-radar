import { useState } from "react";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";

const CATEGORIES = [
  { id: "trending_up",   label: "급상승",       icon: "▲", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  { id: "trending_down", label: "급하락",        icon: "▼", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  { id: "steady_growth", label: "꾸준한 성장",   icon: "→", color: BLUE,      bg: BLUE_LIGHT, border: BLUE_BORDER },
  { id: "near_52w_high", label: "52주 신고가",   icon: "★", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { id: "high_volume",   label: "거래량 상위",   icon: "◎", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
];

function ETFCard({ item, rank }) {
  const isUp = (item.changePct || 0) >= 0;
  const cat = CATEGORIES.find(c => c.id === item._category) || CATEGORIES[0];

  return (
    <div style={{
      background: "#fff",
      border: `1.5px solid ${GRAY_BORDER}`,
      borderTop: `4px solid ${cat.color}`,
      borderRadius: "12px",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      transition: "box-shadow 0.15s",
    }}
    onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
    onMouseOut={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            width: "32px", height: "32px", borderRadius: "50%",
            background: rank < 3 ? cat.color : "#E5E7EB",
            color: rank < 3 ? "#fff" : "#6B7280",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 700, flexShrink: 0,
          }}>{rank + 1}</span>
          <div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "#111827" }}>{item.symbol}</div>
            <div style={{ fontSize: "12px", color: "#6B7280" }}>{item.name}</div>
          </div>
        </div>
        <span style={{
          fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "99px",
          color: isUp ? "#16A34A" : "#DC2626",
          background: isUp ? "#F0FDF4" : "#FEF2F2",
          border: `1.5px solid ${isUp ? "#BBF7D0" : "#FECACA"}`,
        }}>
          {isUp ? "▲" : "▼"} {Math.abs(item.changePct || 0).toFixed(2)}%
        </span>
      </div>

      {item.ret30d != null && (
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "8px 12px", flex: 1 }}>
            <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "2px" }}>30일 수익</div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: (item.ret30d||0) >= 0 ? "#16A34A" : "#DC2626" }}>
              {(item.ret30d||0) >= 0 ? "+" : ""}{(item.ret30d||0).toFixed(2)}%
            </div>
          </div>
          {item.volume && (
            <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "8px 12px", flex: 1 }}>
              <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "2px" }}>거래량</div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                {(item.volume||0).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}

      {item.reason && (
        <div style={{
          fontSize: "13px", color: "#4B5563", lineHeight: 1.6,
          padding: "10px 12px", borderRadius: "8px",
          background: cat.bg, border: `1px solid ${cat.border}`,
        }}>
          {item.reason}
        </div>
      )}
    </div>
  );
}

export default function AIRecommend({ etfData }) {
  const [activeTab, setActiveTab] = useState("trending_up");
  const ai = etfData?.ai;

  const currentItems = ai?.[activeTab] || [];
  const cat = CATEGORIES.find(c => c.id === activeTab);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* AI 요약 배너 */}
      {ai?.summary ? (
        <div style={{
          background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)",
          borderRadius: "14px", padding: "24px 28px",
          display: "flex", flexDirection: "column", gap: "10px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{
              fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px",
              background: "rgba(255,255,255,0.2)", color: "#fff",
            }}>AI 시장 분석</span>
            {etfData?.updatedAt && (
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                {new Date(etfData.updatedAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })} 기준
              </span>
            )}
          </div>
          <div style={{ fontSize: "15px", color: "#fff", lineHeight: 1.7, fontWeight: 400 }}>
            {ai.summary}
          </div>
        </div>
      ) : (
        <div style={{
          background: BLUE_LIGHT, border: `1.5px solid ${BLUE_BORDER}`,
          borderRadius: "12px", padding: "20px",
          display: "flex", alignItems: "center", gap: "16px",
        }}>
          <div style={{ fontSize: "32px" }}>🤖</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: BLUE, marginBottom: "4px" }}>AI 분석 준비 중</div>
            <div style={{ fontSize: "13px", color: "#1E40AF", lineHeight: 1.6 }}>
              매일 미국 장 마감 후 Grok AI가 전체 ETF를 분석해요. GitHub Actions에서 Run workflow를 실행하면 AI 분석이 업데이트됩니다.
            </div>
          </div>
        </div>
      )}

      {/* 통계 카드 */}
      {etfData?.prices && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "12px" }}>
          {[
            { label: "분석 종목 수", value: etfData.prices.length, color: BLUE, bg: BLUE_LIGHT, border: BLUE_BORDER },
            { label: "2% 이상 급등", value: etfData.prices.filter(p => (p.changePct||0) >= 2).length, color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
            { label: "2% 이상 급락", value: etfData.prices.filter(p => (p.changePct||0) <= -2).length, color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
            { label: "미국 ETF", value: etfData.prices.filter(p => p.market === "us").length, color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
            { label: "한국 ETF", value: etfData.prices.filter(p => p.market === "korea").length, color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
          ].map(({ label, value, color, bg, border }) => (
            <div key={label} style={{ background: bg, border: `1.5px solid ${border}`, borderRadius: "10px", padding: "14px 16px" }}>
              <div style={{ fontSize: "11px", color, marginBottom: "4px", fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: "22px", fontWeight: 700, color }}>{value}</div>
            </div>
          ))}
        </div>
      )}

      {/* 카테고리 탭 */}
      <div style={{ background: "#fff", border: `1.5px solid ${GRAY_BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
        <div style={{
          display: "flex", borderBottom: `2px solid ${GRAY_BORDER}`,
          background: "#F9FAFB", gap: "4px", padding: "0 16px", overflowX: "auto",
        }}>
          {CATEGORIES.map((c) => (
            <button key={c.id} onClick={() => setActiveTab(c.id)} style={{
              padding: "14px 18px", border: "none",
              borderBottom: activeTab === c.id ? `3px solid ${c.color}` : "3px solid transparent",
              background: activeTab === c.id ? c.bg : "transparent",
              color: activeTab === c.id ? c.color : "#6B7280",
              cursor: "pointer", fontSize: "13px",
              fontWeight: activeTab === c.id ? 700 : 400,
              transition: "all 0.15s", whiteSpace: "nowrap",
              borderRadius: activeTab === c.id ? "6px 6px 0 0" : "0",
            }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        <div style={{ padding: "20px" }}>
          {!ai ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontSize: "14px" }}>
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>🤖</div>
              AI 분석 데이터가 없어요.<br/>
              GitHub Actions에서 Run workflow를 실행해주세요.
            </div>
          ) : currentItems.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF", fontSize: "14px" }}>
              이 카테고리의 데이터가 없어요.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
              {currentItems.map((item, i) => (
                <ETFCard key={item.symbol} item={{ ...item, _category: activeTab }} rank={i} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 안내 */}
      <div style={{
        padding: "14px 18px", borderRadius: "10px",
        background: "#F9FAFB", border: `1px solid ${GRAY_BORDER}`,
        fontSize: "12px", color: "#6B7280", lineHeight: 1.7,
      }}>
        <b style={{ color: "#374151" }}>AI 분석 기준:</b> 매일 미국 장 마감 후 Yahoo Finance 데이터를 Grok AI가 분석 · 급상승/급하락/꾸준한성장/52주신고가/거래량상위 카테고리로 분류 · 투자 참고용이며 실제 투자 결정은 본인 판단으로 해주세요.
      </div>
    </div>
  );
}
