// src/components/AIRecommend.jsx
import { useState } from "react";
import { fetchAIRecommend } from "../api/client";

const RISK_OPTIONS = [
  { value: "low",    label: "안정형",  desc: "원금 보존 우선" },
  { value: "medium", label: "균형형",  desc: "수익과 안정성 균형" },
  { value: "high",   label: "공격형",  desc: "높은 수익 추구" },
];

const MARKET_OPTIONS = [
  { value: "all",    label: "전체" },
  { value: "us",     label: "미국" },
  { value: "korea",  label: "한국" },
  { value: "global", label: "글로벌" },
];

const RISK_COLOR = {
  low:    { bg: "var(--color-background-success)", text: "var(--color-text-success)" },
  medium: { bg: "var(--color-background-warning)", text: "var(--color-text-warning)" },
  high:   { bg: "var(--color-background-danger)",  text: "var(--color-text-danger)" },
};

export default function AIRecommend() {
  const [riskLevel, setRiskLevel] = useState("medium");
  const [market, setMarket] = useState("all");
  const [profile, setProfile] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleRecommend() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAIRecommend({ profile, market, riskLevel });
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: "24px", alignItems: "start" }}>
      {/* Form */}
      <div style={{
        background: "var(--color-background-primary)",
        border: "1px solid var(--color-border-tertiary)",
        borderRadius: "12px", padding: "24px",
        display: "flex", flexDirection: "column", gap: "20px",
      }}>
        <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--color-text-primary)" }}>
          투자 프로필 설정
        </div>

        {/* Risk Level */}
        <div>
          <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "8px" }}>투자 성향</div>
          <div style={{ display: "flex", gap: "8px" }}>
            {RISK_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setRiskLevel(opt.value)}
                style={{
                  flex: 1, padding: "10px 8px", borderRadius: "8px",
                  border: `1px solid ${riskLevel === opt.value ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`,
                  background: riskLevel === opt.value ? "var(--color-background-secondary)" : "transparent",
                  color: "var(--color-text-primary)", cursor: "pointer", fontSize: "13px",
                  fontWeight: riskLevel === opt.value ? 500 : 400,
                }}
              >
                <div>{opt.label}</div>
                <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginTop: "2px" }}>{opt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Market */}
        <div>
          <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "8px" }}>관심 시장</div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {MARKET_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMarket(opt.value)}
                style={{
                  padding: "6px 14px", borderRadius: "99px",
                  border: `1px solid ${market === opt.value ? "var(--color-border-primary)" : "var(--color-border-tertiary)"}`,
                  background: market === opt.value ? "var(--color-background-secondary)" : "transparent",
                  color: market === opt.value ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                  cursor: "pointer", fontSize: "13px",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Profile text */}
        <div>
          <div style={{ fontSize: "13px", color: "var(--color-text-secondary)", marginBottom: "8px" }}>
            추가 정보 (선택)
          </div>
          <textarea
            value={profile}
            onChange={(e) => setProfile(e.target.value)}
            placeholder="예: 반도체 섹터 관심, 배당주 선호, 5년 이상 장기투자 등"
            rows={3}
            style={{
              width: "100%", padding: "10px 12px", borderRadius: "8px",
              border: "1px solid var(--color-border-secondary)",
              background: "var(--color-background-secondary)",
              color: "var(--color-text-primary)", fontSize: "13px",
              resize: "vertical", fontFamily: "inherit", boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={handleRecommend}
          disabled={loading}
          style={{
            padding: "12px", borderRadius: "8px", border: "none",
            background: "var(--color-text-primary)", color: "var(--color-background-primary)",
            cursor: loading ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: 500,
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "AI 분석 중..." : "AI 추천 받기"}
        </button>

        {error && (
          <div style={{ fontSize: "13px", color: "var(--color-text-danger)", padding: "10px", borderRadius: "8px", background: "var(--color-background-danger)" }}>
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      <div>
        {!result && !loading && (
          <div style={{
            background: "var(--color-background-primary)",
            border: "1px solid var(--color-border-tertiary)",
            borderRadius: "12px", padding: "48px", textAlign: "center",
            color: "var(--color-text-tertiary)", fontSize: "14px",
          }}>
            투자 프로필을 설정하고 AI 추천을 받아보세요
          </div>
        )}

        {result && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Summary */}
            {result.summary && (
              <div style={{
                background: "var(--color-background-primary)",
                border: "1px solid var(--color-border-tertiary)",
                borderRadius: "12px", padding: "20px",
              }}>
                <div style={{ fontSize: "13px", color: "var(--color-text-tertiary)", marginBottom: "6px" }}>AI 분석 요약</div>
                <div style={{ fontSize: "14px", color: "var(--color-text-primary)", lineHeight: 1.6 }}>{result.summary}</div>
                {result.generatedAt && (
                  <div style={{ fontSize: "11px", color: "var(--color-text-tertiary)", marginTop: "8px" }}>
                    생성: {new Date(result.generatedAt).toLocaleString("ko-KR")}
                  </div>
                )}
              </div>
            )}

            {/* Recommendations */}
            {(result.recommendations || []).map((rec, i) => (
              <div key={i} style={{
                background: "var(--color-background-primary)",
                border: "1px solid var(--color-border-tertiary)",
                borderRadius: "12px", padding: "20px",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "8px",
                      background: "var(--color-background-secondary)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", fontWeight: 500, color: "var(--color-text-primary)",
                    }}>
                      {i + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: "16px", fontWeight: 500, color: "var(--color-text-primary)" }}>
                        {rec.symbol}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--color-text-secondary)" }}>{rec.name}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", justifyContent: "flex-end" }}>
                    {rec.riskLevel && (
                      <span style={{
                        fontSize: "11px", padding: "3px 8px", borderRadius: "99px",
                        ...RISK_COLOR[rec.riskLevel],
                      }}>
                        {rec.riskLevel === "low" ? "저위험" : rec.riskLevel === "high" ? "고위험" : "중위험"}
                      </span>
                    )}
                    {rec.allocation && (
                      <span style={{
                        fontSize: "11px", padding: "3px 8px", borderRadius: "99px",
                        background: "var(--color-background-secondary)", color: "var(--color-text-secondary)",
                      }}>
                        비중 {rec.allocation}%
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                  {[
                    { label: "시장", value: rec.market === "us" ? "미국" : rec.market === "korea" ? "한국" : "글로벌" },
                    { label: "섹터", value: rec.sector },
                    { label: "예상수익", value: rec.expectedReturn },
                  ].filter(item => item.value).map(({ label, value }) => (
                    <div key={label} style={{ fontSize: "12px" }}>
                      <span style={{ color: "var(--color-text-tertiary)" }}>{label}: </span>
                      <span style={{ color: "var(--color-text-secondary)" }}>{value}</span>
                    </div>
                  ))}
                </div>

                <div style={{
                  fontSize: "13px", color: "var(--color-text-secondary)",
                  lineHeight: 1.6, padding: "12px",
                  background: "var(--color-background-secondary)", borderRadius: "8px",
                }}>
                  {rec.reason}
                </div>
              </div>
            ))}

            {/* Warnings */}
            {(result.warnings || []).length > 0 && (
              <div style={{
                background: "var(--color-background-warning)",
                border: "1px solid var(--color-border-warning)",
                borderRadius: "12px", padding: "16px",
              }}>
                <div style={{ fontSize: "13px", fontWeight: 500, color: "var(--color-text-warning)", marginBottom: "8px" }}>
                  주의사항
                </div>
                {result.warnings.map((w, i) => (
                  <div key={i} style={{ fontSize: "13px", color: "var(--color-text-warning)", lineHeight: 1.6 }}>
                    • {w}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
