// Cloudflare Worker — ETF Dashboard API Proxy
// 환경변수 설정 필요: GROK_API_KEY, ETF_KV (KV Namespace binding)

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

const CACHE_TTL = 300; // 5분 캐시

const ETF_LIST = {
  us: ["SPY","VOO","IVV","VTI","ITOT","DIA","QQQ","QQQM","VGT","XLK","SOXX","SMH","IGV","CIBR","HACK","CLOU","WCLD","ROBO","BOTZ","ARKK","ARKW","ARKQ","ARKF","ARKG","AIQ","IRBO","IWM","IJR","MDY","IJH","VTV","IWD","DVY","VYM","SCHD","HDV","DGRO","XLF","XLV","XLE","XLI","XLY","XLP","XLU","XLRE","XLB","XLC","IBB","XBI","IYR","VNQ","TLT","IEF","SHY","AGG","BND","HYG","LQD","GLD","IAU","SLV","USO","TQQQ","SQQQ","UPRO","SPXU"],
  korea: ["069500","133690","229200","102110","148020","091160","157490","305720","305540","139220","266390","364980","385720","195930","192090","114800","122630","252670","233740"],
  global: ["VEA","EFA","IEFA","VWO","EEM","IEMG","ACWI","VT","URTH","EWJ","EWG","EWY","EWZ","FXI","MCHI","KWEB","EWC","EWA","EWU"],
};

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      if (path === "/api/etf/prices")       return handleETFPrices(request, env);
      if (path === "/api/ai/recommend")     return handleAIRecommend(request, env);
      if (path === "/api/etf/list")         return handleETFList();
      return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers: CORS_HEADERS });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS_HEADERS });
    }
  },
};

// ── ETF 가격 조회 ──────────────────────────────────────────────
async function handleETFPrices(request, env) {
  const url = new URL(request.url);
  const symbols = url.searchParams.get("symbols") || "SPY,QQQ,IWM";
  const cacheKey = `prices:${symbols}`;

  const cached = await env.ETF_KV.get(cacheKey);
  if (cached) {
    return new Response(cached, { headers: { ...CORS_HEADERS, "X-Cache": "HIT" } });
  }

  const symbolList = symbols.split(",").map((s) => s.trim());
  const results = {};

  await Promise.all(
    symbolList.map(async (symbol) => {
      try {
        const res = await fetch(
          `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
          { headers: { "User-Agent": "Mozilla/5.0" } }
        );
        const data = await res.json();
        const meta = data?.chart?.result?.[0]?.meta;
        if (meta) {
          results[symbol] = {
            symbol,
            price: meta.regularMarketPrice,
            previousClose: meta.previousClose,
            change: meta.regularMarketPrice - meta.previousClose,
            changePct: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
            volume: meta.regularMarketVolume,
            currency: meta.currency,
            name: meta.shortName || symbol,
          };
        }
      } catch {
        results[symbol] = { symbol, error: "fetch failed" };
      }
    })
  );

  const body = JSON.stringify({ data: results, updatedAt: new Date().toISOString() });
  await env.ETF_KV.put(cacheKey, body, { expirationTtl: CACHE_TTL });
  return new Response(body, { headers: { ...CORS_HEADERS, "X-Cache": "MISS" } });
}

// ── Grok AI 종목 추천 ──────────────────────────────────────────
async function handleAIRecommend(request, env) {
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST only" }), { status: 405, headers: CORS_HEADERS });
  }

  const body = await request.json();
  const { profile, market = "all", riskLevel = "medium" } = body;

  const cacheKey = `recommend:${market}:${riskLevel}:${JSON.stringify(profile).slice(0, 50)}`;
  const cached = await env.ETF_KV.get(cacheKey);
  if (cached) {
    return new Response(cached, { headers: { ...CORS_HEADERS, "X-Cache": "HIT" } });
  }

  const systemPrompt = `당신은 ETF 투자 전문가입니다. 사용자 프로필을 분석하여 맞춤형 ETF를 추천하세요.
반드시 JSON 형식으로만 응답하세요. 형식:
{
  "recommendations": [
    {
      "symbol": "티커심볼",
      "name": "ETF명",
      "market": "us|korea|global",
      "sector": "섹터",
      "reason": "추천이유 (2-3문장)",
      "riskLevel": "low|medium|high",
      "expectedReturn": "연 예상수익률 범위",
      "allocation": 비중(숫자)
    }
  ],
  "summary": "전체 포트폴리오 전략 요약",
  "warnings": ["주의사항"]
}`;

  const userPrompt = `투자자 프로필:
- 투자 성향: ${riskLevel === "low" ? "안정형" : riskLevel === "high" ? "공격형" : "균형형"}
- 관심 시장: ${market === "all" ? "미국/한국/글로벌" : market}
- 추가 정보: ${profile || "없음"}

위 프로필에 맞는 ETF 5개를 추천해주세요.`;

  const grokRes = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.GROK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!grokRes.ok) {
    const err = await grokRes.text();
    return new Response(JSON.stringify({ error: "Grok API error", detail: err }), {
      status: 502, headers: CORS_HEADERS,
    });
  }

  const grokData = await grokRes.json();
  const content = grokData.choices?.[0]?.message?.content || "{}";
  const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();

  let parsed;
  try { parsed = JSON.parse(cleaned); }
  catch { parsed = { error: "parsing failed", raw: content }; }

  const responseBody = JSON.stringify({ ...parsed, generatedAt: new Date().toISOString() });
  await env.ETF_KV.put(cacheKey, responseBody, { expirationTtl: 600 });
  return new Response(responseBody, { headers: { ...CORS_HEADERS, "X-Cache": "MISS" } });
}

function handleETFList() {
  return new Response(JSON.stringify(ETF_LIST), { headers: CORS_HEADERS });
}
