// scripts/collect-etf-data.js
const fs = require("fs");
const path = require("path");

const ETF_LIST = [
  // ── 미국 전체시장 ──────────────────────────────
  { symbol: "SPY",  name: "S&P 500 SPDR",          market: "us", sector: "전체시장" },
  { symbol: "VOO",  name: "S&P 500 Vanguard",       market: "us", sector: "전체시장" },
  { symbol: "IVV",  name: "S&P 500 iShares",        market: "us", sector: "전체시장" },
  { symbol: "VTI",  name: "미국 전체 주식",           market: "us", sector: "전체시장" },
  { symbol: "ITOT", name: "미국 전체 iShares",       market: "us", sector: "전체시장" },
  { symbol: "DIA",  name: "다우존스 30",              market: "us", sector: "전체시장" },
  // ── 미국 기술/성장 ─────────────────────────────
  { symbol: "QQQ",  name: "나스닥 100",              market: "us", sector: "기술" },
  { symbol: "QQQM", name: "나스닥 100 소액",          market: "us", sector: "기술" },
  { symbol: "VGT",  name: "IT 섹터 Vanguard",        market: "us", sector: "기술" },
  { symbol: "XLK",  name: "기술 섹터 SPDR",           market: "us", sector: "기술" },
  { symbol: "SOXX", name: "반도체 iShares",           market: "us", sector: "반도체" },
  { symbol: "SMH",  name: "반도체 VanEck",            market: "us", sector: "반도체" },
  { symbol: "IGV",  name: "소프트웨어 iShares",        market: "us", sector: "소프트웨어" },
  { symbol: "CIBR", name: "사이버보안 First Trust",    market: "us", sector: "사이버보안" },
  { symbol: "CLOU", name: "클라우드 컴퓨팅",           market: "us", sector: "클라우드" },
  { symbol: "ROBO", name: "로보틱스 & AI",             market: "us", sector: "로보틱스" },
  { symbol: "BOTZ", name: "로보틱스 Global X",         market: "us", sector: "로보틱스" },
  // ── 미국 AI/혁신 ───────────────────────────────
  { symbol: "ARKK", name: "ARK 혁신 ETF",             market: "us", sector: "혁신" },
  { symbol: "ARKW", name: "ARK 차세대인터넷",           market: "us", sector: "혁신" },
  { symbol: "ARKQ", name: "ARK 자율기술&로봇",          market: "us", sector: "혁신" },
  { symbol: "ARKF", name: "ARK 핀테크",               market: "us", sector: "혁신" },
  { symbol: "ARKG", name: "ARK 유전체혁명",             market: "us", sector: "혁신" },
  { symbol: "AIQ",  name: "AI & 빅데이터",              market: "us", sector: "AI" },
  // ── 미국 소형/중형 ─────────────────────────────
  { symbol: "IWM",  name: "Russell 2000",             market: "us", sector: "소형주" },
  { symbol: "IJR",  name: "S&P 600 소형주",            market: "us", sector: "소형주" },
  { symbol: "MDY",  name: "S&P 400 중형주",            market: "us", sector: "중형주" },
  { symbol: "IJH",  name: "S&P 400 iShares",          market: "us", sector: "중형주" },
  // ── 미국 가치/배당 ─────────────────────────────
  { symbol: "VTV",  name: "대형 가치주",               market: "us", sector: "가치주" },
  { symbol: "IWD",  name: "Russell 1000 가치",         market: "us", sector: "가치주" },
  { symbol: "DVY",  name: "고배당 iShares",            market: "us", sector: "배당" },
  { symbol: "VYM",  name: "고배당 Vanguard",           market: "us", sector: "배당" },
  { symbol: "SCHD", name: "배당 성장 Schwab",           market: "us", sector: "배당" },
  { symbol: "HDV",  name: "핵심 배당 iShares",          market: "us", sector: "배당" },
  { symbol: "DGRO", name: "배당 성장 iShares",          market: "us", sector: "배당" },
  // ── 미국 섹터 ──────────────────────────────────
  { symbol: "XLF",  name: "금융 섹터",                 market: "us", sector: "금융" },
  { symbol: "XLV",  name: "헬스케어 섹터",              market: "us", sector: "헬스케어" },
  { symbol: "XLE",  name: "에너지 섹터",                market: "us", sector: "에너지" },
  { symbol: "XLI",  name: "산업 섹터",                  market: "us", sector: "산업" },
  { symbol: "XLY",  name: "임의소비재 섹터",             market: "us", sector: "소비재" },
  { symbol: "XLP",  name: "필수소비재 섹터",             market: "us", sector: "필수소비재" },
  { symbol: "XLU",  name: "유틸리티 섹터",              market: "us", sector: "유틸리티" },
  { symbol: "XLRE", name: "부동산 섹터",                market: "us", sector: "부동산" },
  { symbol: "XLB",  name: "소재 섹터",                  market: "us", sector: "소재" },
  { symbol: "XLC",  name: "통신 섹터",                  market: "us", sector: "통신" },
  { symbol: "IBB",  name: "바이오텍 iShares",           market: "us", sector: "바이오" },
  { symbol: "XBI",  name: "바이오텍 SPDR",              market: "us", sector: "바이오" },
  { symbol: "IYR",  name: "부동산 iShares",             market: "us", sector: "부동산" },
  { symbol: "VNQ",  name: "리츠 Vanguard",              market: "us", sector: "부동산" },
  // ── 미국 채권/원자재 ───────────────────────────
  { symbol: "TLT",  name: "20년+ 미국채",               market: "us", sector: "채권" },
  { symbol: "IEF",  name: "7-10년 미국채",              market: "us", sector: "채권" },
  { symbol: "SHY",  name: "1-3년 미국채",               market: "us", sector: "채권" },
  { symbol: "AGG",  name: "미국 종합채권",               market: "us", sector: "채권" },
  { symbol: "BND",  name: "미국 채권 Vanguard",          market: "us", sector: "채권" },
  { symbol: "HYG",  name: "하이일드 채권",               market: "us", sector: "채권" },
  { symbol: "LQD",  name: "투자등급 회사채",              market: "us", sector: "채권" },
  { symbol: "GLD",  name: "금 SPDR",                    market: "us", sector: "원자재" },
  { symbol: "IAU",  name: "금 iShares",                 market: "us", sector: "원자재" },
  { symbol: "SLV",  name: "은 iShares",                 market: "us", sector: "원자재" },
  { symbol: "USO",  name: "원유 US Oil Fund",            market: "us", sector: "원자재" },
  // ── 미국 레버리지/인버스 ───────────────────────
  { symbol: "TQQQ", name: "나스닥 3배 레버리지",          market: "us", sector: "레버리지" },
  { symbol: "SQQQ", name: "나스닥 3배 인버스",            market: "us", sector: "인버스" },
  { symbol: "UPRO", name: "S&P500 3배 레버리지",          market: "us", sector: "레버리지" },
  { symbol: "SPXU", name: "S&P500 3배 인버스",            market: "us", sector: "인버스" },
  // ── 글로벌 ────────────────────────────────────
  { symbol: "VEA",  name: "선진국 Vanguard",             market: "global", sector: "선진국" },
  { symbol: "EFA",  name: "선진국 iShares",              market: "global", sector: "선진국" },
  { symbol: "IEFA", name: "핵심 선진국 iShares",          market: "global", sector: "선진국" },
  { symbol: "VWO",  name: "신흥국 Vanguard",             market: "global", sector: "신흥국" },
  { symbol: "EEM",  name: "신흥국 iShares",              market: "global", sector: "신흥국" },
  { symbol: "IEMG", name: "핵심 신흥국 iShares",          market: "global", sector: "신흥국" },
  { symbol: "ACWI", name: "전 세계 주식",                 market: "global", sector: "전세계" },
  { symbol: "VT",   name: "전 세계 Vanguard",            market: "global", sector: "전세계" },
  { symbol: "EWJ",  name: "일본 iShares",                market: "global", sector: "일본" },
  { symbol: "EWG",  name: "독일 iShares",                market: "global", sector: "독일" },
  { symbol: "EWY",  name: "한국 iShares",                market: "global", sector: "한국" },
  { symbol: "EWZ",  name: "브라질 iShares",              market: "global", sector: "브라질" },
  { symbol: "FXI",  name: "중국 대형주 iShares",          market: "global", sector: "중국" },
  { symbol: "MCHI", name: "중국 MSCI iShares",           market: "global", sector: "중국" },
  { symbol: "KWEB", name: "중국 인터넷 KraneShares",      market: "global", sector: "중국" },
  { symbol: "EWC",  name: "캐나다 iShares",              market: "global", sector: "캐나다" },
  { symbol: "EWA",  name: "호주 iShares",                market: "global", sector: "호주" },
  { symbol: "EWU",  name: "영국 iShares",                market: "global", sector: "영국" },
  // ── 한국 ──────────────────────────────────────
  { symbol: "069500.KS", name: "KODEX 200",              market: "korea", sector: "전체시장" },
  { symbol: "102110.KS", name: "TIGER 200",              market: "korea", sector: "전체시장" },
  { symbol: "229200.KS", name: "KODEX 코스닥150",         market: "korea", sector: "전체시장" },
  { symbol: "133690.KS", name: "TIGER 코스피100",         market: "korea", sector: "전체시장" },
  { symbol: "091160.KS", name: "KODEX 반도체",            market: "korea", sector: "반도체" },
  { symbol: "157490.KS", name: "TIGER 반도체",            market: "korea", sector: "반도체" },
  { symbol: "305720.KS", name: "KODEX 2차전지산업",       market: "korea", sector: "2차전지" },
  { symbol: "305540.KS", name: "TIGER 2차전지테마",       market: "korea", sector: "2차전지" },
  { symbol: "148020.KS", name: "KODEX 바이오",            market: "korea", sector: "헬스케어" },
  { symbol: "139220.KS", name: "TIGER IT",               market: "korea", sector: "IT" },
  { symbol: "266390.KS", name: "KODEX 게임산업",          market: "korea", sector: "IT" },
  { symbol: "364980.KS", name: "TIGER AI코리아그로스",     market: "korea", sector: "AI" },
  { symbol: "385720.KS", name: "KODEX AI반도체핵심장비",   market: "korea", sector: "AI" },
  { symbol: "195930.KS", name: "TIGER 선진국MSCI",        market: "korea", sector: "선진국" },
  { symbol: "192090.KS", name: "TIGER 신흥국MSCI",        market: "korea", sector: "신흥국" },
  { symbol: "122630.KS", name: "KODEX 레버리지",          market: "korea", sector: "레버리지" },
  { symbol: "114800.KS", name: "KODEX 인버스",            market: "korea", sector: "인버스" },
  { symbol: "252670.KS", name: "KODEX 200선물인버스2X",   market: "korea", sector: "인버스" },
  { symbol: "233740.KS", name: "KODEX 코스닥150레버리지",  market: "korea", sector: "레버리지" },
];

async function fetchPrice(symbol) {
  try {
    const res = await fetch(
      `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=30d`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          "Accept": "application/json",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const closes = result.indicators?.quote?.[0]?.close || [];
    const validCloses = closes.filter(c => c !== null && c !== undefined);

    const price = meta.regularMarketPrice;
    const prevClose = meta.previousClose || meta.chartPreviousClose || price;
    const changePct = prevClose ? ((price - prevClose) / prevClose) * 100 : 0;
    const oldest = validCloses[0];
    const ret30d = oldest ? ((price - oldest) / oldest) * 100 : 0;
    const fiveDayAgo = validCloses[Math.max(0, validCloses.length - 6)];
    const ret5d = fiveDayAgo ? ((price - fiveDayAgo) / fiveDayAgo) * 100 : 0;

    return {
      symbol: symbol.replace(".KS", ""),
      price,
      changePct,
      volume: meta.regularMarketVolume || 0,
      currency: meta.currency || "USD",
      name: meta.shortName || meta.longName || symbol.replace(".KS", ""),
      ret5d,
      ret30d,
      high52: meta.fiftyTwoWeekHigh,
      low52: meta.fiftyTwoWeekLow,
      fromHigh: meta.fiftyTwoWeekHigh ? ((price - meta.fiftyTwoWeekHigh) / meta.fiftyTwoWeekHigh) * 100 : 0,
      fromLow: meta.fiftyTwoWeekLow ? ((price - meta.fiftyTwoWeekLow) / meta.fiftyTwoWeekLow) * 100 : 0,
    };
  } catch (e) {
    console.error(`Failed: ${symbol}`, e.message);
    return null;
  }
}

async function getAIRecommendations(etfData) {
  const GROK_API_KEY = process.env.GROK_API_KEY;
  if (!GROK_API_KEY) {
    console.log("GROK_API_KEY 없음 — AI 추천 건너뜀");
    return null;
  }

  const summary = etfData
    .filter(e => e.price > 0)
    .map(e => `${e.symbol}(${e.name}): 당일=${e.changePct.toFixed(2)}%, 5일=${e.ret5d.toFixed(2)}%, 30일=${e.ret30d.toFixed(2)}%`)
    .join("\n");

  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GROK_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [
        {
          role: "system",
          content: `ETF 투자 전문가로서 아래 데이터를 분석해 JSON으로만 응답하세요:
{
  "trending_up": [{"symbol":"","name":"","reason":"","ret30d":0,"changePct":0}],
  "trending_down": [{"symbol":"","name":"","reason":"","ret30d":0,"changePct":0}],
  "steady_growth": [{"symbol":"","name":"","reason":"","ret30d":0,"changePct":0}],
  "high_volume": [{"symbol":"","name":"","reason":"","volume":0}],
  "near_52w_high": [{"symbol":"","name":"","reason":"","fromHigh":0}],
  "summary": "시장 요약 2-3문장"
}`
        },
        {
          role: "user",
          content: `오늘 ETF 데이터:\n${summary}\n\n각 카테고리 상위 5개씩 추천해주세요.`
        }
      ],
      temperature: 0.2,
      max_tokens: 3000,
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content || "{}";
  try {
    return JSON.parse(content.replace(/```json\n?|\n?```/g, "").trim());
  } catch {
    return null;
  }
}

async function main() {
  console.log(`ETF 데이터 수집 시작... 총 ${ETF_LIST.length}개 종목`);

  const results = [];
  for (let i = 0; i < ETF_LIST.length; i += 5) {
    const chunk = ETF_LIST.slice(i, i + 5);
    const prices = await Promise.all(chunk.map(e => fetchPrice(e.symbol)));
    prices.forEach((price, idx) => {
      if (price) {
        results.push({ ...chunk[idx], ...price, symbol: price.symbol });
      }
    });
    console.log(`${Math.min(i + 5, ETF_LIST.length)}/${ETF_LIST.length} 완료`);
    if (i + 5 < ETF_LIST.length) await new Promise(r => setTimeout(r, 300));
  }

  console.log(`${results.length}개 종목 수집 완료`);

  console.log("AI 분석 중...");
  const aiData = await getAIRecommendations(results);

  const output = {
    prices: results,
    ai: aiData,
    updatedAt: new Date().toISOString(),
  };

  const outputDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "data.json"), JSON.stringify(output, null, 2));
  console.log(`data.json 저장 완료! (${results.length}개 종목)`);
}

main().catch(console.error);
