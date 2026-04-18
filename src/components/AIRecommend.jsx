import { useState } from "react";

const BLUE = "#2563EB";
const BLUE_LIGHT = "#EFF6FF";
const BLUE_BORDER = "#BFDBFE";
const GRAY_BORDER = "#D1D5DB";

const RATING_INFO = {
  buy:     { label: "매수", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  neutral: { label: "중립", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  sell:    { label: "매도", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
};

const RISK_INFO = {
  high:   { label: "고위험", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  medium: { label: "중위험", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  low:    { label: "저위험", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
};

const IMPACT_INFO = {
  high:   { label: "영향 높음", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  medium: { label: "영향 중간", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  low:    { label: "영향 낮음", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
};

const ISSUE_TYPE_LABEL = {
  macro:     { label: "매크로",  color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
  earnings:  { label: "실적",    color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  policy:    { label: "정책",    color: "#0891B2", bg: "#ECFEFF", border: "#A5F3FC" },
  sentiment: { label: "심리",    color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB" },
  technical: { label: "기술적",  color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
};

const CATEGORIES = [
  { id: "trending_up",   label: "급상승",     icon: "▲", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  { id: "trending_down", label: "급하락",      icon: "▼", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
  { id: "steady_growth", label: "꾸준한 성장", icon: "→", color: BLUE,      bg: BLUE_LIGHT, border: BLUE_BORDER },
  { id: "near_52w_high", label: "52주 신고가", icon: "★", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  { id: "high_volume",   label: "거래량 상위", icon: "◎", color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE" },
];

const TABS = [
  { id: "overview",   label: "시장 개요" },
  { id: "etf",        label: "ETF 분석" },
  { id: "sector",     label: "섹터 트렌드" },
  { id: "issues",     label: "오늘의 이슈" },
  { id: "risk",       label: "리스크 분석" },
  { id: "portfolio",  label: "포트폴리오 추천" },
];

function Badge({ label, color, bg, border }) {
  return (
    <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "99px", color, background: bg, border: `1px solid ${border}`, whiteSpace: "nowrap" }}>
      {label}
    </span>
  );
}

function ETFCard({ item, rank, category }) {
  const [expanded, setExpanded] = useState(false);
  const isUp = (item.changePct || 0) >= 0;
  const cat = CATEGORIES.find(c => c.id === category) || CATEGORIES[0];
  const rating = RATING_INFO[item.rating] || RATING_INFO.neutral;
  const risk = RISK_INFO[item.risk_level] || RISK_INFO.medium;
  const impact = IMPACT_INFO[item.impact] || IMPACT_INFO.medium;

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
      {/* 헤더 */}
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
            fontSize: "13px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px",
            color: isUp ? "#16A34A" : "#DC2626",
            background: isUp ? "#F0FDF4" : "#FEF2F2",
            border: `1.5px solid ${isUp ? "#BBF7D0" : "#FECACA"}`,
          }}>{isUp ? "▲" : "▼"} {Math.abs(item.changePct || 0).toFixed(2)}%</span>
        </div>
      </div>

      {/* 배지 */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        <Badge {...rating} label={`${rating.label} 의견`} />
        <Badge {...risk} />
        <Badge {...impact} />
      </div>

      {/* 수익률 */}
      {item.ret30d != null && (
        <div style={{ display: "flex", gap: "8px" }}>
          <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "6px 10px", flex: 1 }}>
            <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "2px" }}>30일 수익</div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: (item.ret30d||0) >= 0 ? "#16A34A" : "#DC2626" }}>
              {(item.ret30d||0) >= 0 ? "+" : ""}{(item.ret30d||0).toFixed(2)}%
            </div>
          </div>
          {item.volume && (
            <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "6px 10px", flex: 1 }}>
              <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "2px" }}>거래량</div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#374151" }}>{(item.volume||0).toLocaleString()}</div>
            </div>
          )}
        </div>
      )}

      {/* 이유 */}
      {item.reason && (
        <div style={{ fontSize: "12px", color: "#4B5563", lineHeight: 1.6, padding: "8px 10px", borderRadius: "8px", background: cat.bg, border: `1px solid ${cat.border}` }}>
          {item.reason}
        </div>
      )}

      {/* 왜 중요한가 */}
      {item.why_important && (
        <div style={{ fontSize: "12px", color: "#1E40AF", lineHeight: 1.6, padding: "8px 10px", borderRadius: "8px", background: BLUE_LIGHT, border: `1px solid ${BLUE_BORDER}` }}>
          <b style={{ fontSize: "10px", color: BLUE, display: "block", marginBottom: "3px" }}>왜 중요한가</b>
          {item.why_important}
        </div>
      )}

      {/* 투자의견 근거 */}
      {item.rating_reason && (
        <div style={{ fontSize: "12px", color: rating.color, lineHeight: 1.6, padding: "8px 10px", borderRadius: "8px", background: rating.bg, border: `1px solid ${rating.border}` }}>
          <b style={{ fontSize: "10px", display: "block", marginBottom: "3px" }}>{rating.label} 의견 근거</b>
          {item.rating_reason}
        </div>
      )}

      {/* 더보기 버튼 */}
      {(item.short_term || item.competitors?.length > 0) && (
        <button onClick={() => setExpanded(!expanded)} style={{
          padding: "6px", borderRadius: "8px", border: `1px solid ${GRAY_BORDER}`,
          background: "#F9FAFB", color: "#6B7280", cursor: "pointer", fontSize: "12px", fontWeight: 600,
        }}>
          {expanded ? "접기 ▲" : "전망 + 경쟁 ETF 보기 ▼"}
        </button>
      )}

      {/* 확장 정보 */}
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* 단기/중기/장기 전망 */}
          {(item.short_term || item.mid_term || item.long_term) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
              {[
                { label: "단기 (1주)", value: item.short_term },
                { label: "중기 (1달)", value: item.mid_term },
                { label: "장기 (3달)", value: item.long_term },
              ].map(({ label, value }) => value && (
                <div key={label} style={{ background: "#F9FAFB", borderRadius: "8px", padding: "8px 10px" }}>
                  <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "4px", fontWeight: 600 }}>{label}</div>
                  <div style={{ fontSize: "11px", color: "#374151", lineHeight: 1.5 }}>{value}</div>
                </div>
              ))}
            </div>
          )}

          {/* 경쟁 ETF */}
          {item.competitors?.length > 0 && (
            <div>
              <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "6px", fontWeight: 600 }}>경쟁 ETF</div>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {item.competitors.map(c => (
                  <span key={c} style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "6px", background: "#F3F4F6", color: "#374151", border: `1px solid ${GRAY_BORDER}` }}>{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function AIRecommend({ etfData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeCat, setActiveCat] = useState("trending_up");
  const ai = etfData?.ai;

  const sentimentInfo = {
    bullish: { label: "강세장", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
    bearish: { label: "약세장", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
    neutral: { label: "중립",   color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" },
  }[ai?.market_sentiment || "neutral"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* 상단 배너 */}
      {ai?.market_summary ? (
        <div style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2563EB 100%)", borderRadius: "14px", padding: "24px 28px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "99px", background: "rgba(255,255,255,0.2)", color: "#fff" }}>AI 시장 분석</span>
            {ai.market_sentiment && (
              <span style={{ fontSize: "12px", fontWeight: 700, padding: "3px 12px", borderRadius: "99px", color: sentimentInfo.color, background: sentimentInfo.bg }}>{sentimentInfo.label}</span>
            )}
            {etfData?.updatedAt && (
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)" }}>
                {new Date(etfData.updatedAt).toLocaleDateString("ko-KR", { month: "long", day: "numeric" })} 기준
              </span>
            )}
          </div>
          <div style={{ fontSize: "15px", color: "#fff", lineHeight: 1.7 }}>{ai.market_summary}</div>
          {ai.market_sentiment_reason && (
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, padding: "10px 14px", borderRadius: "8px", background: "rgba(255,255,255,0.1)" }}>
              {ai.market_sentiment_reason}
            </div>
          )}
          {ai?.top_keywords?.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {ai.top_keywords.map(k => (
                <span key={k} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "rgba(255,255,255,0.15)", color: "#fff" }}>#{k}</span>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div style={{ background: BLUE_LIGHT, border: `1.5px solid ${BLUE_BORDER}`, borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "32px" }}>🤖</div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: BLUE, marginBottom: "4px" }}>AI 분석 준비 중</div>
            <div style={{ fontSize: "13px", color: "#1E40AF", lineHeight: 1.6 }}>매일 미국 장 마감 후 AI가 전체 ETF를 분석해요. GitHub Actions에서 Run workflow를 실행하면 업데이트됩니다.</div>
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
              padding: "14px 16px", border: "none",
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

          {/* 시장 개요 */}
          {activeTab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {!ai ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🤖</div>
                  AI 분석 데이터가 없어요. GitHub Actions에서 Run workflow를 실행해주세요.
                </div>
              ) : (
                <>
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
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: "#374151", marginBottom: "10px" }}>카테고리별 주목 ETF</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                      {CATEGORIES.map(cat => {
                        const top = ai[cat.id]?.[0];
                        if (!top) return null;
                        const isUp = (top.changePct||0) >= 0;
                        const rating = RATING_INFO[top.rating] || RATING_INFO.neutral;
                        return (
                          <div key={cat.id} style={{ padding: "14px", borderRadius: "10px", background: cat.bg, border: `1.5px solid ${cat.border}` }}>
                            <div style={{ fontSize: "11px", fontWeight: 700, color: cat.color, marginBottom: "6px" }}>{cat.icon} {cat.label}</div>
                            <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>{top.symbol}</div>
                            <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "8px" }}>{top.name}</div>
                            <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                              <span style={{ fontSize: "12px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px", color: isUp ? "#16A34A" : "#DC2626", background: isUp ? "#F0FDF4" : "#FEF2F2" }}>
                                {isUp ? "▲" : "▼"} {Math.abs(top.changePct||0).toFixed(2)}%
                              </span>
                              {top.rating && <Badge {...rating} label={rating.label} />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ETF 분석 */}
          {activeTab === "etf" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
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
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "14px" }}>
                  {(ai[activeCat] || []).map((item, i) => (
                    <ETFCard key={item.symbol} item={item} rank={i} category={activeCat} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 섹터 트렌드 */}
          {activeTab === "sector" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {!ai?.sector_trends?.length ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>섹터 트렌드 데이터가 없어요.</div>
              ) : ai.sector_trends.map((s) => {
                const isUp = (s.avg_change||0) >= 0;
                return (
                  <div key={s.sector} style={{ padding: "16px 20px", borderRadius: "10px", background: "#fff", border: `1.5px solid ${GRAY_BORDER}`, borderLeft: `4px solid ${isUp ? "#16A34A" : "#DC2626"}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{s.sector}</span>
                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "99px", color: isUp ? "#16A34A" : "#DC2626", background: isUp ? "#F0FDF4" : "#FEF2F2" }}>{s.trend}</span>
                      </div>
                      <span style={{ fontSize: "15px", fontWeight: 700, color: isUp ? "#16A34A" : "#DC2626" }}>
                        {isUp ? "+" : ""}{(s.avg_change||0).toFixed(2)}%
                      </span>
                    </div>
                    {s.summary && <div style={{ fontSize: "13px", color: "#4B5563", marginBottom: "10px", lineHeight: 1.5 }}>{s.summary}</div>}
                    {(s.short_term || s.mid_term) && (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
                        {s.short_term && (
                          <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "8px 10px" }}>
                            <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "3px", fontWeight: 600 }}>단기 전망 (1주)</div>
                            <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.5 }}>{s.short_term}</div>
                          </div>
                        )}
                        {s.mid_term && (
                          <div style={{ background: "#F9FAFB", borderRadius: "8px", padding: "8px 10px" }}>
                            <div style={{ fontSize: "10px", color: "#9CA3AF", marginBottom: "3px", fontWeight: 600 }}>중기 전망 (1달)</div>
                            <div style={{ fontSize: "12px", color: "#374151", lineHeight: 1.5 }}>{s.mid_term}</div>
                          </div>
                        )}
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                      {s.keywords?.length > 0 && s.keywords.map(k => (
                        <span key={k} style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "99px", background: "#F3F4F6", color: "#374151", border: `1px solid ${GRAY_BORDER}` }}>#{k}</span>
                      ))}
                      {s.top_etfs?.length > 0 && (
                        <>
                          <span style={{ fontSize: "11px", color: "#9CA3AF", marginLeft: "4px" }}>대표 ETF:</span>
                          {s.top_etfs.map(e => (
                            <span key={e} style={{ fontSize: "11px", fontWeight: 600, padding: "2px 8px", borderRadius: "6px", background: BLUE_LIGHT, color: BLUE, border: `1px solid ${BLUE_BORDER}` }}>{e}</span>
                          ))}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 오늘의 이슈 */}
          {activeTab === "issues" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {!ai?.etf_issues?.length ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>이슈 데이터가 없어요.</div>
              ) : ai.etf_issues.map((issue, i) => {
                const typeInfo = ISSUE_TYPE_LABEL[issue.issue_type] || ISSUE_TYPE_LABEL.sentiment;
                const impactInfo = IMPACT_INFO[issue.impact] || IMPACT_INFO.medium;
                return (
                  <div key={i} style={{ padding: "16px 20px", borderRadius: "10px", background: "#fff", border: `1.5px solid ${GRAY_BORDER}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>{issue.symbol}</span>
                        <Badge {...typeInfo} />
                        <Badge {...impactInfo} />
                        {issue.is_noise && <Badge label="단기 소음 가능" color="#6B7280" bg="#F3F4F6" border={GRAY_BORDER} />}
                      </div>
                    </div>
                    <div style={{ fontSize: "14px", color: "#111827", fontWeight: 500, marginBottom: "10px", lineHeight: 1.5 }}>{issue.issue}</div>
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

          {/* 리스크 분석 */}
          {activeTab === "risk" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {!ai?.risk_analysis?.length ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>리스크 분석 데이터가 없어요.</div>
              ) : ai.risk_analysis.map((item, i) => {
                const risk = RISK_INFO[item.risk_level] || RISK_INFO.medium;
                return (
                  <div key={i} style={{ padding: "16px 20px", borderRadius: "10px", background: "#fff", border: `1.5px solid ${GRAY_BORDER}`, borderLeft: `4px solid ${risk.color}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>{item.symbol}</div>
                        <div style={{ fontSize: "12px", color: "#6B7280" }}>{item.name}</div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                        <Badge {...risk} />
                        {item.volatility && <Badge label={item.volatility} color="#7C3AED" bg="#F5F3FF" border="#DDD6FE" />}
                      </div>
                    </div>
                    {item.max_drawdown_risk && (
                      <div style={{ fontSize: "13px", color: "#DC2626", lineHeight: 1.5, padding: "8px 10px", borderRadius: "8px", background: "#FEF2F2", border: "1px solid #FECACA", marginBottom: "8px" }}>
                        <b style={{ fontSize: "11px", display: "block", marginBottom: "3px" }}>최대낙폭 리스크</b>
                        {item.max_drawdown_risk}
                      </div>
                    )}
                    {item.hedge_suggestion && (
                      <div style={{ fontSize: "13px", color: "#1E40AF", lineHeight: 1.5, padding: "8px 10px", borderRadius: "8px", background: BLUE_LIGHT, border: `1px solid ${BLUE_BORDER}`, marginBottom: "8px" }}>
                        <b style={{ fontSize: "11px", display: "block", marginBottom: "3px" }}>헤지 방법</b>
                        {item.hedge_suggestion}
                      </div>
                    )}
                    {item.suitable_for && (
                      <div style={{ fontSize: "12px", color: "#6B7280" }}>
                        <b style={{ color: "#374151" }}>적합한 투자자:</b> {item.suitable_for}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 포트폴리오 추천 */}
          {activeTab === "portfolio" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {!ai?.portfolio_suggestion ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#9CA3AF" }}>포트폴리오 추천 데이터가 없어요.</div>
              ) : (
                <>
                  {ai.portfolio_suggestion.suggestion && (
                    <div style={{ padding: "16px", borderRadius: "10px", background: BLUE_LIGHT, border: `1.5px solid ${BLUE_BORDER}` }}>
                      <div style={{ fontSize: "13px", fontWeight: 700, color: BLUE, marginBottom: "8px" }}>AI 포트폴리오 조언</div>
                      <div style={{ fontSize: "13px", color: "#1E40AF", lineHeight: 1.6 }}>{ai.portfolio_suggestion.suggestion}</div>
                    </div>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "14px" }}>
                    {[
                      { key: "aggressive", label: "공격형", desc: "높은 수익 추구", color: "#DC2626", bg: "#FEF2F2", border: "#FECACA" },
                      { key: "balanced",   label: "균형형", desc: "수익과 안정성 균형", color: BLUE, bg: BLUE_LIGHT, border: BLUE_BORDER },
                      { key: "conservative", label: "안정형", desc: "원금 보존 우선", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
                    ].map(({ key, label, desc, color, bg, border }) => {
                      const etfs = ai.portfolio_suggestion[key] || [];
                      return (
                        <div key={key} style={{ padding: "18px", borderRadius: "12px", background: bg, border: `1.5px solid ${border}` }}>
                          <div style={{ fontSize: "15px", fontWeight: 700, color, marginBottom: "4px" }}>{label} 포트폴리오</div>
                          <div style={{ fontSize: "12px", color, marginBottom: "14px", opacity: 0.8 }}>{desc}</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            {etfs.map((e, i) => (
                              <div key={e} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 12px", borderRadius: "8px", background: "#fff", border: `1px solid ${border}` }}>
                                <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: color, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                                <span style={{ fontSize: "14px", fontWeight: 700, color: "#111827" }}>{e}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}

        </div>
      </div>

      {/* 안내 */}
      <div style={{ padding: "12px 16px", borderRadius: "10px", background: "#F9FAFB", border: `1px solid ${GRAY_BORDER}`, fontSize: "12px", color: "#6B7280", lineHeight: 1.7 }}>
        <b style={{ color: "#374151" }}>AI 분석 기준:</b> 매일 미국 장 마감 후 Groq AI(Llama 3.3 70B)가 거래량 상위 100개 ETF 분석 · 투자의견/리스크/경쟁ETF/단기중기장기 전망 포함 · 투자 참고용이며 실제 투자 결정은 본인 판단으로 해주세요.
      </div>
    </div>
  );
}
