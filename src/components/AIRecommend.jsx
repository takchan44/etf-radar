import { useState } from "react";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";

const ISSUE_TYPE_LABEL = {
  macro:     { label: "매크로",   color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  earnings:  { label: "실적",     color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  policy:    { label: "정책",     color: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC" },
  sentiment: { label: "심리",     color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
  technical: { label: "기술적",   color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
};

const IMPACT_LABEL = {
  high:   { label: "영향 높음", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  medium: { label: "영향 중간", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  low:    { label: "영향 낮음", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
};

const CATEGORIES = [
  { id: "trending_up",   label: "급상승",      icon: "▲", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  { id: "trending_down", label: "급하락",       icon: "▼", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  { id: "steady_growth", label: "꾸준한 성장",  icon: "→", color: BLUE,      bg: BLUE_LIGHT, border: BLUE_BORDER },
  { id: "near_52w_high", label: "52주 신고가",  icon: "★", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { id: "high_volume",   label: "거래량 상위",  icon: "◎", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
];

const TABS = [
  { id: "overview",  label: "시장 개요" },
  { id: "etf",       label: "ETF 분석" },
  { id: "sector",    label: "섹터 트렌드" },
  { id: "issues",    label: "오늘의 이슈" },
];

function ETFCard({ item, rank, category }) {
  const isUp = (item.changePct || 0) >= 0;
  const cat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  const impact = IMPACT_LABEL[item.impact] || IMPACT_LABEL.medium;

  return (
    <div style={{
      background: "#fff", border: `1.5px solid ${GRAY_BORDER}`,
      borderTop: `4px solid ${cat.color}`, borderRadius: "12px", padding: "18px",
      display: "flex", flexDirection: "column", gap: "10px",
      transition: "box-shadow 0.15s",
    }}
    onMouseOver={e => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
    onMouseOut={e => e.currentTarget.style.boxShadow = "none"}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            width: "30px", height: "30px", borderRadius: "50%",
            background: rank < 3 ? cat.color : "#E5E7EB",
            color: rank < 3 ? "#fff" : "#6B7280",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 700, flexShrink: 0,
          }}>{rank + 1}</span>
          <div>
            <div style={{ fontSize: "17px", fontWeight: 700, color: "#111827" }}>{item.symbol}</div>
            <div style={{ fontSize: "11px", color: "#9CA3AF" }}>{item.name}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <span style={{
            fontSize: "12px", fontWeight: 600, padding: "2px 8px", borderRadius: "99px",
            color: isUp ? "#16A34A" : "#DC2626",
            background: isUp ? "#F0FDF4" : "#FEF2F2",
            border: `1px solid ${isUp ? "#BBF7D0" : "#FECACA"}`,
          }}>{isUp ? "▲" : "▼"} {Math.abs(item.changePct || 0).toFixed(2)}%</span>
          <span style={{
            fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "99px",
            color: impact.color, background: impact.bg, border: `1px solid ${impact.border}`,
          }}>{impact.label}</span>
        </div>
      </div>

      {(item.ret30d != null || item.volume) && (
        <div style={{ display: "flex", gap: "8px" }}>
          {item.ret30d != null && (
            <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "6px 10px", flex: 1 }}>
              <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "2px" }}>30일 수익</div>
              <div style={{ fontSize: "13px", fontWeight: 700, color: (item.ret30d||0) >= 0 ? "#16A34A" : "#DC2626" }}>
                {(item.ret30d||0) >= 0 ? "+" : ""}{(item.ret30d||0).toFixed(2)}%
              </div>
            </div>
          )}
          {item.volume && (
            <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "6px 10px", flex: 1 }}>
              <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "2px" }}>거래량</div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{(item.volume||0).toLocaleString()}</div>
            </div>
          )}
        </div>
      )}

      {item.reason && (
        <div style={{ fontSize: "12px", color: "#4B5563", lineHeight: 1.6, padding: "8px 10px", borderRadius: "8px", background: cat.bg, border: `1px solid ${cat.border}` }}>
          {item.reason}
        </div>
      )}

      {item.why_important && (
        <div style={{ fontSize: "12px", color: "#1E40AF", lineHeight: 1.6, padding: "8px 10px", borderRadius: "8px", background: BLUE_LIGHT, border: `1px solid ${BLUE_BORDER}` }}>
          <b style={{ fontSize: "10px", color: BLUE, display: "block", marginBottom: "3px" }}>왜 중요한가</b>
          {item.why_important}
        </div>
      )}
    </div>
  );
}

export default function AIRecommend({ etfData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeCat, setActiveCat] = useState("trending_up");
  const ai = etfData?.ai;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* 상단 배너 */}
      {ai?.market_summary ? (
        <div style={{
          background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)",
          borderRadius: "14px", padding: "24px 28px",
          display: "flex", flexDirection: "column", gap: "12px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px", background: "rgba(255,255,255,0.2)", color: "#fff" }}>AI 시장 분석</span>
            {etfData?.updatedAt && (
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                {new Date(etfData.updatedAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })} 기준
              </span>
            )}
            {ai?.top_keywords?.length > 0 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {ai.top_keywords.map(k => (
                  <span key={k} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.15)", color: "#fff" }}>#{k}</span>
                ))}
              </div>
            )}
          </div>
          <div style={{ fontSize: "15px", color: "#fff", lineHeight: 1.7 }}>{ai.market_summary}</div>
        </div>
      ) : (
        <div style={{ background: BLUE_LIGHT, border: `1.5px solid ${BLUE_BORDER}`, borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "32px" }}>🤖</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: BLUE, marginBottom: "4px" }}>AI 분석 준비 중</div>
            <div style={{ fontSize: "13px", color: "#1E40AF", lineHeight: 1.6 }}>
              매일 미국 장 마감 후 AI가 전체 ETF를 분석해요. GitHub Actions에서 Run workflow를 실행하면 업데이트됩니다.
            </div>
          </div>
        </div>
      )}

      {/* 통계 카드 */}
      {etfData?.prices && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "12px" }}>
          {[
            { label: "분석 종목", value: etfData.prices.length, color: BLUE, bg: BLUE_LIGHT, border: BLUE_BORDER },
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

      {/* 메인 탭 */}
      <div style={{ background: "#fff", border: `1.5px solid ${GRAY_BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: `2px solid ${GRAY_BORDER}`, background: "#F9FAFB", padding: "0 16px", gap: "4px", overflowX: "auto" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: "14px 18px", border: "none",
              borderBottom: activeTab === t.id ? `3px solid ${BLUE}` : "3px solid transparent",
              background: activeTab === t.id ? BLUE_LIGHT : "transparent",
              color: activeTab === t.id ? BLUE : "#6B7280",
              cursor: "pointer", fontSize: "13px", fontWeight: activeTab === t.id ? 700 : 400,
              transition: "all 0.15s", whiteSpace: "nowrap",
              borderRadius: activeTab === t.id ? "6px 6px 0 0" : "0",
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ padding: "20px" }}>
          {/* 시장 개요 탭 */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {!ai ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🤖</div>
                  AI 분석 데이터가 없어요. GitHub Actions에서 Run workflow를 실행해주세요.
                </div>
              ) : (
                <>
                  {/* 오늘의 키워드 */}
                  {ai.top_keywords?.length > 0 && (
                    <div>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>오늘의 시장 키워드</div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {ai.top_keywords.map((k, i) => (
                          <span key={k} style={{
                            padding: "6px 14px", borderRadius: "99px", fontSize: "13px", fontWeight: 600,
                            background: i === 0 ? BLUE : i === 1 ? "#F0FDF4" : "#F9FAFB",
                            color: i === 0 ? "#fff" : i === 1 ? "#16A34A" : "#374151",
                            border: `1.5px solid ${i === 0 ? BLUE : i === 1 ? "#BBF7D0" : GRAY_BORDER}`,
                          }}>#{k}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 빠른 ETF 요약 - 각 카테고리 1위만 */}
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>카테고리별 주목 ETF</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                      {CATEGORIES.map(cat => {
                        const top = ai[cat.id]?.[0];
                        if (!top) return null;
                        const isUp = (top.changePct||0) >= 0;
                        return (
                          <div key={cat.id} style={{ padding: "14px", borderRadius: "10px", background: cat.bg, border: `1.5px solid ${cat.border}` }}>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: cat.color, marginBottom: "6px" }}>{cat.icon} {cat.label}</div>
                            <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>{top.symbol}</div>
                            <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "6px" }}>{top.name}</div>
                            <span style={{
                              fontSize: "12px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px",
                              color: isUp ? "#16A34A" : "#DC2626",
                              background: isUp ? "#F0FDF4" : "#FEF2F2",
                            }}>{isUp ? "▲" : "▼"} {Math.abs(top.changePct||0).toFixed(2)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ETF 분석 탭 */}
          {activeTab === "etf" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* 카테고리 서브탭 */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {CATEGORIES.map(c => (
                  <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
                    padding: "6px 14px", borderRadius: "99px", fontSize: "12px", fontWeight: 600,
                    border: `1.5px solid ${activeCat === c.id ? c.color : GRAY_BORDER}`,
                    background: activeCat === c.id ? c.bg : "#fff",
                    color: activeCat === c.id ? c.color : "#6B7280", cursor: "pointer",
                  }}>{c.icon} {c.label}</button>
                ))}
              </div>

              {!ai ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>AI 분석 데이터가 없어요.</div>
              ) : (ai[activeCat] || []).length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>데이터가 없어요.</div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "14px" }}>
                  {(ai[activeCat] || []).map((item, i) => (
                    <ETFCard key={item.symbol} item={item} rank={i} category={activeCat} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 섹터 트렌드 탭 */}
          {activeTab === "sector" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {!ai?.sector_trends?.length ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>섹터 트렌드 데이터가 없어요.</div>
              ) : ai.sector_trends.map((s, i) => {
                const isUp = (s.avg_change||0) >= 0;
                return (
                  <div key={s.sector} style={{
                    padding: "16px 20px", borderRadius: "10px", background: "#fff",
                    border: `1.5px solid ${GRAY_BORDER}`,
                    borderLeft: `4px solid ${isUp ? "#16A34A" : "#DC2626"}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{s.sector}</span>
                        <span style={{
                          fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "99px",
                          color: isUp ? "#16A34A" : "#DC2626",
                          background: isUp ? "#F0FDF4" : "#FEF2F2",
                        }}>{s.trend}</span>
                      </div>
                      <span style={{ fontSize: "14px", fontWeight: 700, color: isUp ? "#16A34A" : "#DC2626" }}>
                        {isUp ? "+" : ""}{(s.avg_change||0).toFixed(2)}%
                      </span>
                    </div>
                    {s.summary && <div style={{ fontSize: "13px", color: "#4B5563", marginBottom: "8px", lineHeight: 1.5 }}>{s.summary}</div>}
                    {s.keywords?.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        {s.keywords.map(k => (
                          <span key={k} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "#F3F4F6", color: "#374151", border: `1px solid ${GRAY_BORDER}` }}>#{k}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 오늘의 이슈 탭 */}
          {activeTab === "issues" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {!ai?.etf_issues?.length ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>이슈 데이터가 없어요.</div>
              ) : ai.etf_issues.map((issue, i) => {
                const typeInfo = ISSUE_TYPE_LABEL[issue.issue_type] || ISSUE_TYPE_LABEL.sentiment;
                const impactInfo = IMPACT_LABEL[issue.impact] || IMPACT_LABEL.medium;
                return (
                  <div key={i} style={{
                    padding: "16px 20px", borderRadius: "10px", background: "#fff",
                    border: `1.5px solid ${GRAY_BORDER}`,
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{issue.symbol}</span>
                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "99px", color: typeInfo.color, background: typeInfo.bg, border: `1px solid ${typeInfo.border}` }}>
                          {typeInfo.label}
                        </span>
                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "99px", color: impactInfo.color, background: impactInfo.bg, border: `1px solid ${impactInfo.border}` }}>
                          {impactInfo.label}
                        </span>
                        {issue.is_noise && (
                          <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "#F3F4F6", color: "#6B7280", border: `1px solid ${GRAY_BORDER}` }}>
                            단기 소음 가능
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ fontSize: "14px", color: "#111827", fontWeight: 500, marginBottom: "8px", lineHeight: 1.5 }}>
                      {issue.issue}
                    </div>
                    {issue.impact_etfs?.length > 0 && (
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                        <span style={{ fontSize: "11px", color: "#9CA3AF" }}>관련 ETF:</span>
                        {issue.impact_etfs.map(e => (
                          <span key={e} style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px", background: BLUE_LIGHT, color: BLUE, border: `1px solid ${BLUE_BORDER}` }}>{e}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 안내 */}
      <div style={{ padding: "12px 16px", borderRadius: "10px", background: "#F9FAFB", border: `1px solid ${GRAY_BORDER}`, fontSize: "12px", color: "#6B7280", lineHeight: 1.7 }}>
        <b style={{ color: "#374151" }}>AI 분석 기준:</b> 매일 미국 장 마감 후 Groq AI(Llama 3.3 70B)가 전체 ETF 분석 · 급상승/급하락/꾸준한성장/섹터트렌드/오늘의이슈 분류 · 투자 참고용이며 실제 투자 결정은 본인 판단으로 해주세요.
      </div>
    </div>
  );
}
