// scripts/collect-etf-data.js
// 미국 ETF 상위 500개 + 한국 ETF 전체 자동 수집

const fs = require("fs");
const path = require("path");

// ── 한국 ETF 전체 목록 (KRX 상장 주요 ETF) ────────────────────
const KOREA_ETF_LIST = [
  { symbol: "069500.KS", name: "KODEX 200",              sector: "전체시장" },
  { symbol: "102110.KS", name: "TIGER 200",              sector: "전체시장" },
  { symbol: "229200.KS", name: "KODEX 코스닥150",         sector: "전체시장" },
  { symbol: "133690.KS", name: "TIGER 코스피100",         sector: "전체시장" },
  { symbol: "278540.KS", name: "KODEX MSCI Korea",       sector: "전체시장" },
  { symbol: "395160.KS", name: "TIGER 코스피",            sector: "전체시장" },
  { symbol: "251340.KS", name: "KODEX 코스피",            sector: "전체시장" },
  { symbol: "091160.KS", name: "KODEX 반도체",            sector: "반도체" },
  { symbol: "157490.KS", name: "TIGER 반도체",            sector: "반도체" },
  { symbol: "381170.KS", name: "HANARO 반도체",           sector: "반도체" },
  { symbol: "305720.KS", name: "KODEX 2차전지산업",       sector: "2차전지" },
  { symbol: "305540.KS", name: "TIGER 2차전지테마",       sector: "2차전지" },
  { symbol: "371460.KS", name: "TIGER 2차전지TOP10",      sector: "2차전지" },
  { symbol: "364980.KS", name: "TIGER AI코리아그로스",     sector: "AI" },
  { symbol: "385720.KS", name: "KODEX AI반도체핵심장비",   sector: "AI" },
  { symbol: "409820.KS", name: "TIGER AI반도체핵심공정",   sector: "AI" },
  { symbol: "139220.KS", name: "TIGER IT",               sector: "IT" },
  { symbol: "266390.KS", name: "KODEX 게임산업",          sector: "IT" },
  { symbol: "148020.KS", name: "KODEX 바이오",            sector: "헬스케어" },
  { symbol: "143860.KS", name: "TIGER 헬스케어",          sector: "헬스케어" },
  { symbol: "227550.KS", name: "KODEX 헬스케어",          sector: "헬스케어" },
  { symbol: "195930.KS", name: "TIGER 선진국MSCI",        sector: "선진국" },
  { symbol: "192090.KS", name: "TIGER 신흥국MSCI",        sector: "신흥국" },
  { symbol: "122630.KS", name: "KODEX 레버리지",          sector: "레버리지" },
  { symbol: "233740.KS", name: "KODEX 코스닥150레버리지",  sector: "레버리지" },
  { symbol: "114800.KS", name: "KODEX 인버스",            sector: "인버스" },
  { symbol: "252670.KS", name: "KODEX 200선물인버스2X",   sector: "인버스" },
  { symbol: "278530.KS", name: "KODEX 코스닥150인버스",   sector: "인버스" },
  { symbol: "kodex-200futures.KS", name: "KODEX 200선물",  sector: "선물" },
  { symbol: "182490.KS", name: "TIGER 단기채권액티브",     sector: "채권" },
  { symbol: "130730.KS", name: "KOSEF 국고채10년",        sector: "채권" },
  { symbol: "148070.KS", name: "KOSEF 통안채1년",         sector: "채권" },
  { symbol: "273130.KS", name: "KODEX 종합채권(AA-이상)", sector: "채권" },
  { symbol: "136340.KS", name: "KINDEX 국채3년",          sector: "채권" },
  { symbol: "476550.KS", name: "TIGER 국채10년",          sector: "채권" },
  { symbol: "411060.KS", name: "ACE 국채10년레버리지",     sector: "채권" },
  { symbol: "287310.KS", name: "KODEX 미국채울트라30년선물(H)", sector: "채권" },
  { symbol: "332620.KS", name: "KODEX 국채선물10년",      sector: "채권" },
  { symbol: "272580.KS", name: "TIGER 미국달러단기채권",   sector: "채권" },
  { symbol: "453010.KS", name: "KODEX 미국30년국채액티브", sector: "채권" },
  { symbol: "261220.KS", name: "KODEX 골드선물(H)",       sector: "원자재" },
  { symbol: "284430.KS", name: "KODEX 은선물(H)",         sector: "원자재" },
  { symbol: "217770.KS", name: "TIGER 원유선물Enhanced",  sector: "원자재" },
  { symbol: "351590.KS", name: "TIGER 200에너지화학",     sector: "에너지" },
  { symbol: "140710.KS", name: "KODEX 운송",              sector: "산업" },
  { symbol: "276990.KS", name: "KODEX 200철강소재",       sector: "소재" },
  { symbol: "244620.KS", name: "KODEX 코스피고배당",       sector: "배당" },
  { symbol: "280930.KS", name: "TIGER 코스피고배당",       sector: "배당" },
  { symbol: "211560.KS", name: "TIGER 배당성장",          sector: "배당" },
  { symbol: "270800.KS", name: "KODEX 배당성장채권혼합",   sector: "배당" },
  { symbol: "400970.KS", name: "HANARO 고배당",           sector: "배당" },
  { symbol: "381180.KS", name: "TIGER 부동산인프라고배당", sector: "부동산" },
  { symbol: "334700.KS", name: "KODEX 리츠부동산인프라",   sector: "부동산" },
  { symbol: "441640.KS", name: "TIGER 미국나스닥100",      sector: "기술" },
  { symbol: "360750.KS", name: "TIGER 미국S&P500",        sector: "전체시장" },
  { symbol: "379800.KS", name: "KODEX 미국S&P500TR",      sector: "전체시장" },
  { symbol: "433500.KS", name: "KODEX 미국나스닥100TR",    sector: "기술" },
  { symbol: "487190.KS", name: "ACE 미국빅테크TOP7Plus",   sector: "기술" },
  { symbol: "453870.KS", name: "TIGER 미국테크TOP10INDXX", sector: "기술" },
  { symbol: "458730.KS", name: "KODEX 미국반도체MV",       sector: "반도체" },
  { symbol: "426410.KS", name: "ACE 미국반도체",           sector: "반도체" },
  { symbol: "396500.KS", name: "ACE 미국S&P500",          sector: "전체시장" },
  { symbol: "251350.KS", name: "KODEX 선진국MSCI World",   sector: "선진국" },
  { symbol: "195980.KS", name: "TIGER 선진국MSCI(합성)",   sector: "선진국" },
  { symbol: "236350.KS", name: "TIGER 중국CSI300",        sector: "중국" },
  { symbol: "168580.KS", name: "TIGER 차이나A레버리지(합성)", sector: "중국" },
  { symbol: "244580.KS", name: "TIGER 일본니케이225",      sector: "일본" },
  { symbol: "371160.KS", name: "TIGER 베트남VN30",        sector: "신흥국" },
  { symbol: "143850.KS", name: "TIGER 인도니프티50",       sector: "신흥국" },
  { symbol: "200250.KS", name: "KODEX 은행",              sector: "금융" },
  { symbol: "091230.KS", name: "TIGER 은행",              sector: "금융" },
  { symbol: "102780.KS", name: "KODEX 삼성그룹",          sector: "전체시장" },



  { symbol: "416800.KS", name: "ARIRANG 코스피50", market: "korea", sector: "전체시장" },
  { symbol: "152100.KS", name: "ARIRANG 200", market: "korea", sector: "전체시장" },
  { symbol: "294400.KS", name: "ARIRANG 코스닥150", market: "korea", sector: "전체시장" },
  { symbol: "438330.KS", name: "KODEX 코스피대형주", market: "korea", sector: "전체시장" },
  { symbol: "292150.KS", name: "TIGER KOSPI", market: "korea", sector: "전체시장" },
  { symbol: "334820.KS", name: "KODEX K-바이오+", market: "korea", sector: "헬스케어" },
  { symbol: "227570.KS", name: "TIGER 200헬스케어", market: "korea", sector: "헬스케어" },
  { symbol: "276420.KS", name: "ARIRANG K바이오", market: "korea", sector: "헬스케어" },
  { symbol: "448290.KS", name: "TIGER 배당프리미엄액티브", market: "korea", sector: "배당" },
  { symbol: "466920.KS", name: "KODEX 배당가치", market: "korea", sector: "배당" },
  { symbol: "350480.KS", name: "TIGER 미국MSCI리츠", market: "korea", sector: "부동산" },
  { symbol: "352560.KS", name: "KODEX 미국부동산리츠(H)", market: "korea", sector: "부동산" },
  { symbol: "385560.KS", name: "TIGER 미국투자등급회사채", market: "korea", sector: "채권" },
  { symbol: "448860.KS", name: "KODEX iShares미국하이일드", market: "korea", sector: "채권" },
  { symbol: "450540.KS", name: "ACE 미국30년국채액티브(H)", market: "korea", sector: "채권" },
  { symbol: "463050.KS", name: "TIGER 미국채10년선물", market: "korea", sector: "채권" },
  { symbol: "426050.KS", name: "ACE 미국달러SOFR금리", market: "korea", sector: "채권" },
  { symbol: "411570.KS", name: "ACE KRX금현물", market: "korea", sector: "원자재" },
  { symbol: "451840.KS", name: "TIGER 골드선물(H)", market: "korea", sector: "원자재" },
  { symbol: "139270.KS", name: "TIGER 200금융", market: "korea", sector: "금융" },
  { symbol: "465580.KS", name: "KODEX 은행채권혼합", market: "korea", sector: "금융" },
  { symbol: "139260.KS", name: "TIGER 200중공업", market: "korea", sector: "산업" },
  { symbol: "465530.KS", name: "TIGER 차이나전기차", market: "korea", sector: "중국" },
  { symbol: "381630.KS", name: "ACE 베트남VN30(합성)", market: "korea", sector: "신흥국" },
  { symbol: "448530.KS", name: "TIGER 인도빌리언컨슈머", market: "korea", sector: "신흥국" },
  { symbol: "465060.KS", name: "KODEX 인도Nifty50", market: "korea", sector: "신흥국" },
  { symbol: "475060.KS", name: "TIGER 인도니프티50레버리지", market: "korea", sector: "레버리지" },
  { symbol: "310970.KS", name: "TIGER 200선물레버리지", market: "korea", sector: "레버리지" },
  { symbol: "302430.KS", name: "KODEX 코스닥150선물인버스", market: "korea", sector: "인버스" },
  { symbol: "429480.KS", name: "ACE 코스닥150레버리지", market: "korea", sector: "레버리지" },
  { symbol: "391170.KS", name: "TIGER 글로벌멀티에셋TIF", market: "korea", sector: "혼합" },
  { symbol: "448170.KS", name: "KODEX TDF2030액티브", market: "korea", sector: "혼합" },
  { symbol: "448180.KS", name: "KODEX TDF2040액티브", market: "korea", sector: "혼합" },
  { symbol: "448190.KS", name: "KODEX TDF2050액티브", market: "korea", sector: "혼합" },
  { symbol: "424810.KS", name: "TIGER TDF2030액티브", market: "korea", sector: "혼합" },
  { symbol: "424820.KS", name: "TIGER TDF2040액티브", market: "korea", sector: "혼합" },
  { symbol: "140570.KS", name: "KODEX 현대차그룹HMG", market: "korea", sector: "전체시장" },
  { symbol: "104520.KS", name: "KODEX 인터넷", market: "korea", sector: "IT" },
  { symbol: "228790.KS", name: "TIGER 화학", market: "korea", sector: "소재" },
  { symbol: "364970.KS", name: "TIGER K-게임", market: "korea", sector: "IT" },
  { symbol: "426610.KS", name: "TIGER Fn메타버스", market: "korea", sector: "테마" },
  { symbol: "464500.KS", name: "KODEX K-신재생에너지", market: "korea", sector: "테마" },
  { symbol: "466380.KS", name: "TIGER K-친환경차", market: "korea", sector: "2차전지" },
  { symbol: "434580.KS", name: "KODEX 우주항공&UAM", market: "korea", sector: "테마" },
  { symbol: "462060.KS", name: "TIGER 우주항공&드론액티브", market: "korea", sector: "테마" },
  { symbol: "472470.KS", name: "KODEX AI전력핵심인프라", market: "korea", sector: "AI" },
  { symbol: "494670.KS", name: "TIGER AI데이터센터", market: "korea", sector: "AI" },
  { symbol: "483940.KS", name: "ACE AI반도체포커스", market: "korea", sector: "AI" },
  { symbol: "476040.KS", name: "KODEX AI로봇액티브", market: "korea", sector: "AI" },
  { symbol: "483700.KS", name: "KODEX 2차전지핵심소재10", market: "korea", sector: "2차전지" },
  { symbol: "462050.KS", name: "ACE 2차전지&친환경차", market: "korea", sector: "2차전지" },
  { symbol: "500030.KS", name: "ACE K컬처&미디어액티브", market: "korea", sector: "테마" },
  { symbol: "475010.KS", name: "TIGER 글로벌클린에너지", market: "korea", sector: "테마" },
  { symbol: "483770.KS", name: "ACE 탄소효율그린뉴딜", market: "korea", sector: "테마" },

  { symbol: "453450.KS", name: "KODEX CD금리액티브(합성)", market: "korea", sector: "채권" },
  { symbol: "357870.KS", name: "TIGER CD금리투자KIS(합성)", market: "korea", sector: "채권" },
  { symbol: "458760.KS", name: "KODEX KOFR금리액티브(합성)", market: "korea", sector: "채권" },
  { symbol: "472160.KS", name: "ACE CD금리&초단기채권액티브", market: "korea", sector: "채권" },
  { symbol: "346000.KS", name: "KODEX 단기채권PLUS", market: "korea", sector: "채권" },
  { symbol: "305080.KS", name: "TIGER 단기통안채", market: "korea", sector: "채권" },
  { symbol: "304660.KS", name: "KODEX 1년은행채권혼합", market: "korea", sector: "채권" },
  { symbol: "441800.KS", name: "ACE 단기채권혼합액티브", market: "korea", sector: "채권" },
  { symbol: "483160.KS", name: "TIGER 조선TOP10", market: "korea", sector: "산업" },
  { symbol: "468380.KS", name: "ACE 조선해양", market: "korea", sector: "산업" },
  { symbol: "494600.KS", name: "KODEX 방산항공우주", market: "korea", sector: "테마" },
  { symbol: "469070.KS", name: "TIGER 방산&우주", market: "korea", sector: "테마" },
  { symbol: "494580.KS", name: "ACE 방산우주항공", market: "korea", sector: "테마" },
  { symbol: "494610.KS", name: "TIGER 글로벌방산&우주", market: "korea", sector: "테마" },
  { symbol: "395290.KS", name: "TIGER 글로벌리튬&2차전지SOLACTIVE", market: "korea", sector: "2차전지" },
  { symbol: "463250.KS", name: "KODEX 글로벌배터리소재", market: "korea", sector: "2차전지" },
  { symbol: "463240.KS", name: "TIGER 글로벌배터리소재", market: "korea", sector: "2차전지" },
  { symbol: "488290.KS", name: "TIGER 미국AI반도체핵심기업", market: "korea", sector: "반도체" },
  { symbol: "494650.KS", name: "KODEX 미국AI반도체", market: "korea", sector: "반도체" },

  { symbol: "488260.KS", name: "KODEX 미국S&P500(H)", market: "korea", sector: "전체시장" },
  { symbol: "490090.KS", name: "TIGER 미국S&P500(H)", market: "korea", sector: "전체시장" },
  { symbol: "487240.KS", name: "ACE 미국S&P500(H)", market: "korea", sector: "전체시장" },
  { symbol: "494660.KS", name: "KODEX 미국나스닥100(H)", market: "korea", sector: "기술" },
  { symbol: "488270.KS", name: "TIGER 미국나스닥100(H)", market: "korea", sector: "기술" },
  { symbol: "494640.KS", name: "ACE 미국나스닥100(H)", market: "korea", sector: "기술" },
  { symbol: "395300.KS", name: "KODEX 코스피소형주", market: "korea", sector: "소형주" },
  { symbol: "228800.KS", name: "TIGER 200IT", market: "korea", sector: "IT" },
  { symbol: "266410.KS", name: "KODEX 200IT", market: "korea", sector: "IT" },
  { symbol: "483730.KS", name: "ACE 글로벌반도체TOP4Plus", market: "korea", sector: "반도체" },
  { symbol: "494690.KS", name: "TIGER 글로벌반도체TOP4Plus", market: "korea", sector: "반도체" },
  { symbol: "466960.KS", name: "KODEX 미국배당다우존스", market: "korea", sector: "배당" },
  { symbol: "466970.KS", name: "TIGER 미국배당다우존스", market: "korea", sector: "배당" },

  { symbol: "091170.KS", name: "TIGER 코스닥150", market: "korea", sector: "전체시장" },
  { symbol: "292560.KS", name: "TIGER 코스닥150선물레버리지", market: "korea", sector: "레버리지" },
  { symbol: "219480.KS", name: "KODEX 미국나스닥100선물(H)", market: "korea", sector: "기술" },
  { symbol: "269530.KS", name: "KODEX 미국S&P500선물(H)", market: "korea", sector: "전체시장" },
  { symbol: "279530.KS", name: "KODEX 미국채울트라30년선물", market: "korea", sector: "채권" },

].map(e => ({ ...e, market: "korea" }));

// ── 미국 ETF 상위 500개 ────────────────────────────────────────
const US_ETF_LIST = [
  // 전체시장
  "SPY","VOO","IVV","VTI","ITOT","DIA","SCHB","IWB",
  // 기술
  "QQQ","QQQM","VGT","XLK","IYW","FTEC","IGM",  // 반도체
  "SOXX","SMH","XSD","PSI",  // AI/로보틱스
  "AIQ","BOTZ","ROBO","IRBO","ARKQ",  // 혁신
  "ARKK","ARKW","ARKF","ARKG","ARKX","PRNT","IZRL",
  // 소프트웨어/클라우드
  "IGV","CLOU","WCLD","BUG","SKYY","HACK","CIBR","IHAK",
  // 소형주
  "IWM","IJR","SCHA","VB", // 중형주
  "MDY","IJH","VO","SCHM","IVOO","DON",
  // 가치주
  "VTV","IWD","SCHV","IVE", // 성장주
  "VUG","IWF","SCHG","IVW","MTUM",  // 배당
  "VYM","SCHD","HDV","DVY","DGRO","SDY","NOBL","SPHD","FVD","DHS",
  "JEPI","JEPQ","DIVO","XYLD","QYLD","RYLD","SPYI","QQQI",
  // 금융
  "XLF","VFH","KBE","KRE","IAI","KBWB","KBWR","IAK",
  // 헬스케어
  "XLV","VHT","IYH","FHLC","IBB","XBI","ARKG","BBH","PJP","IHI",
  // 에너지
  "XLE","VDE","IYE","FENY","OIH","XOP","AMLP","MLPA",
  // 산업
  "XLI","VIS","IYJ","FIDU","ITA","PPA","XAR","JETS",
  // 소비재
  "XLY","VCR","IYC","FDIS","XRT","PEJ",
  // 필수소비재
  "XLP","VDC","IYK","FSTA","PBJ",
  // 유틸리티
  "XLU","VPU","IDU","FUTY","PUI",
  // 부동산
  "VNQ","IYR","XLRE","SCHH","REM","MORT","SRVR","INDS",  // 소재
  "XLB","VAW","IYM","FMAT","MXI","GDX","GDXJ","SIL",
  // 통신
  "XLC","VOX","IYZ","FCOM",
  // 바이오
  "IBB","XBI","BBH","PJP","IHI","IDNA","GNOM","IEHS",
  // 글로벌 선진국
  "VEA","EFA","IEFA","SPDW","SCHF","VGK","FEZ","EZU","EWG","EWU",
  "EWJ","EWC","EWA","EWQ","EWI","EWP","EWD","EWN","EWO","EWS",
  // 글로벌 신흥국
  "VWO","EEM","IEMG","SPEM","SCHE","GEM","EWZ","EWY","MCHI","FXI",
  "KWEB","EWT","EWH","INDA","PIN","EWM","EWW","GXG","ECH","TUR",
  // 글로벌 전체
  "ACWI","VT","URTH","MXI","IOO","ACWX",
  // 채권
  "TLT","IEF","SHY","AGG","BND","BNDX","LQD","HYG","JNK","MUB",
  "VCIT","VCLT","VGIT","VGLT","VMBS","MBB","TIP","SCHP","VTIP",
  "BSV","BIV","BLV","GOVT","SHV","SGOV","USFR","JPST","NEAR","FLOT",
  // 원자재
  "GLD","IAU","SLV","PPLT","PALL","GDX","GDXJ","RING","USO","BNO",
  "DBO","UNG","PDBC","DJP","DBC","COMT","COMB","FTGC",
  // 레버리지
  "TQQQ","UPRO","SPXL","TECL","SOXL","LABU","FAS","TNA", // 인버스
  "SQQQ","SPXU","SPXS","TECS","SOXS","LABD","FAZ","TZA","SDOW","SRTY",
  "SDS","QID","DXD","MZZ","SKK","TWM","DUG",
  // 배당 고수익
  "PFFD","PGX","PFF","PGIM","SPFF",
  // 멀티팩터
  "QUAL","SIZE","USMV","VLUE","MTUM","SPHQ","VFMF",
  // 테마
  "DRIV","KARS","IDRV","MSOS","MJ","POTX","YOLO","BETZ","ESPO","HERO",
  "NERD","GAMR","METV","SOCL","EBIZ","GFIN","KOIN","BLOK","BKCH",
  "ARKB","FBTC","IBIT","BITB","HODL","BTCO","GBTC",
,
  "SPYD","DIV","DGRW","PEY","DTD","EMLC","PDP","FALN","REZ","KBWY","USHY","WEAT","ERY","SCO","SH","BITO","MOO","WOOD","GRID","HYDR","ACES","ICLN","TAN","QCLN","CNRG","SMOG","SNSR"
,
  "CDC","REGL","MDIV","VOOG","IWO","IJT","VBK","SLYG","SPLV","EFAV","EEMV","ACWV","HOMZ","HYLS","HYLB","SHYG","STPZ","LTPZ","BOND","CORN","SOYB","UGA","EURL","HEWG","HEDJ","DXJ","DBJP","HEWJ","HEFA","GCOW","FYLD","IDLV","FNDB","FNDX","FNDE","FNDF","CURE","DIG","ERX","MIDU","NAIL","NUGT","RETL","UDOW","URTY","SSO","QLD","DDM","MYY","REK","RWM","SMN","SRS","ETHA","FETH","KRBN","VEGN","NXTG","PAVE","SCHI","SCHX","SCHZ","SCHR","SCHQ"
,
  "MSFT","AAPL","NVDA","AMZN","META","GOOGL","GOOG","TSLA","AVGO","COST","NFLX","ASML","AMD","CSCO","TMUS","ADBE","PEP","AZN","INTU","INTC","BKNG","QCOM","TXN","AMGN","HON","SBUX","GILD","VRTX","LRCX","REGN","PANW","MU","ADI","SNPS","KLAC","MRVL","CDNS","MELI","CRWD","CTAS","CSX","ORLY","MNST","MDLZ","NXPI","WDAY","PAYX","FTNT","CHTR","DXCM","KDP","CEG","ROST","FAST","ODFL","GEHC","IDXX","TEAM","VRSK","CPRT","ABNB","LULU","BIIB","ON","DLTR","FANG","GFS","ZS","TTD","PCAR","DDOG","ILMN","WBD","ALGN","SIRI","ENPH","RIVN","OKTA","PYPL","ISRG","ADSK","EA","EBAY","MRNA","WBA","BMRN","ZM","XEL","AEP","EXC","PCG","NEE","TSCO","CSGP","ANSS","SWKS","CTSH","MTCH","PARA","NXST"
].map(s => ({ symbol: s, name: s, market: "us", sector: "나스닥100" }));

// 글로벌 ETF
const GLOBAL_ETF_LIST = [
  { symbol: "VEA",  name: "선진국 Vanguard",    market: "global", sector: "선진국" },
  { symbol: "EFA",  name: "선진국 iShares",     market: "global", sector: "선진국" },
  { symbol: "VWO",  name: "신흥국 Vanguard",    market: "global", sector: "신흥국" },
  { symbol: "EEM",  name: "신흥국 iShares",     market: "global", sector: "신흥국" },
  { symbol: "ACWI", name: "전 세계 주식",        market: "global", sector: "전세계" },
  { symbol: "VT",   name: "전 세계 Vanguard",   market: "global", sector: "전세계" },
  { symbol: "EWJ",  name: "일본 iShares",       market: "global", sector: "일본" },
  { symbol: "EWY",  name: "한국 iShares",       market: "global", sector: "한국" },
  { symbol: "FXI",  name: "중국 대형주",         market: "global", sector: "중국" },
  { symbol: "KWEB", name: "중국 인터넷",         market: "global", sector: "중국" },
  { symbol: "EWZ",  name: "브라질 iShares",     market: "global", sector: "브라질" },
  { symbol: "MCHI", name: "중국 MSCI",          market: "global", sector: "중국" },
  { symbol: "EWG",  name: "독일 iShares",       market: "global", sector: "독일" },
  { symbol: "EWC",  name: "캐나다 iShares",     market: "global", sector: "캐나다" },
  { symbol: "EWA",  name: "호주 iShares",       market: "global", sector: "호주" },
  { symbol: "EWU",  name: "영국 iShares",       market: "global", sector: "영국" },
  { symbol: "INDA", name: "인도 iShares",       market: "global", sector: "인도" },
  { symbol: "EWT",  name: "대만 iShares",       market: "global", sector: "대만" },
];

// 섹터 정보 매핑
const SECTOR_MAP = {
  SPY:"전체시장",VOO:"전체시장",IVV:"전체시장",VTI:"전체시장",ITOT:"전체시장",DIA:"전체시장",SCHB:"전체시장",
  QQQ:"기술",QQQM:"기술",VGT:"기술",XLK:"기술",IYW:"기술",FTEC:"기술",
  SOXX:"반도체",SMH:"반도체",SOXQ:"반도체",
  ARKK:"혁신",ARKW:"혁신",ARKQ:"혁신",ARKF:"혁신",ARKG:"혁신",
  AIQ:"AI",BOTZ:"로보틱스",ROBO:"로보틱스",IRBO:"AI",
  IGV:"소프트웨어",CLOU:"클라우드",WCLD:"클라우드",HACK:"사이버보안",CIBR:"사이버보안",
  IWM:"소형주",IJR:"소형주",SCHA:"소형주",VB:"소형주",
  MDY:"중형주",IJH:"중형주",VO:"중형주",
  VTV:"가치주",IWD:"가치주",SCHV:"가치주",
  VUG:"성장주",IWF:"성장주",SCHG:"성장주",MTUM:"성장주",
  VYM:"배당",SCHD:"배당",HDV:"배당",DVY:"배당",DGRO:"배당",NOBL:"배당",JEPI:"배당",JEPQ:"배당",
  XLF:"금융",VFH:"금융",KBE:"금융",KRE:"금융",
  XLV:"헬스케어",VHT:"헬스케어",IBB:"바이오",XBI:"바이오",
  XLE:"에너지",VDE:"에너지",OIH:"에너지",
  XLI:"산업",VIS:"산업",ITA:"방산",JETS:"항공",
  XLY:"소비재",VCR:"소비재",XRT:"소비재",
  XLP:"필수소비재",VDC:"필수소비재",
  XLU:"유틸리티",VPU:"유틸리티",
  VNQ:"부동산",IYR:"부동산",XLRE:"부동산",
  XLB:"소재",VAW:"소재",GDX:"금광",GDXJ:"금광",
  XLC:"통신",VOX:"통신",
  TLT:"채권",IEF:"채권",SHY:"채권",AGG:"채권",BND:"채권",LQD:"채권",HYG:"채권",JNK:"채권",
  GLD:"원자재",IAU:"원자재",SLV:"원자재",GDX:"원자재",USO:"원자재",
  TQQQ:"레버리지",UPRO:"레버리지",SPXL:"레버리지",TECL:"레버리지",SOXL:"레버리지",
  SQQQ:"인버스",SPXU:"인버스",SPXS:"인버스",TECS:"인버스",SOXS:"인버스",
  IBIT:"암호화폐",FBTC:"암호화폐",GBTC:"암호화폐",ARKB:"암호화폐",
};

const FULL_LIST = [
  ...US_ETF_LIST.map(e => ({ ...e, sector: SECTOR_MAP[e.symbol] || e.sector })),
  ...GLOBAL_ETF_LIST,
  ...KOREA_ETF_LIST,
].filter(e => e && e.symbol);

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
    if (!price) return null;
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
    return null;
  }
}

async function getAIRecommendations(etfData) {
  const API_KEY = process.env.GROK_API_KEY;
  if (!API_KEY) {
    console.log("GROK_API_KEY 없음 — AI 추천 건너뜀");
    return null;
  }

  // 거래량 상위 60개 분석
  const top60 = etfData
    .filter(e => e.price > 0)
    .sort((a, b) => (b.volume||0) - (a.volume||0))
    .slice(0, 100);

  const dataStr = top60
    .map(e => `${e.symbol}(${e.name},${e.sector||"기타"},${e.market}): 당일=${e.changePct.toFixed(2)}%, 5일=${e.ret5d.toFixed(2)}%, 30일=${e.ret30d.toFixed(2)}%, 거래량=${(e.volume||0).toLocaleString()}, 52주고가대비=${(e.fromHigh||0).toFixed(2)}%`)
    .join("\n");

  // 섹터별 평균 등락률
  const sectorMap = {};
  etfData.filter(e => e.price > 0 && e.sector).forEach(e => {
    if (!sectorMap[e.sector]) sectorMap[e.sector] = [];
    sectorMap[e.sector].push(e.changePct || 0);
  });
  const sectorSummary = Object.entries(sectorMap)
    .map(([sec, vals]) => `${sec}: 평균${(vals.reduce((a,b)=>a+b,0)/vals.length).toFixed(2)}%`)
    .sort((a,b) => {
      const av = parseFloat(a.split("평균")[1]);
      const bv = parseFloat(b.split("평균")[1]);
      return bv - av;
    })
    .slice(0, 15)
    .join(", ");

  const systemPrompt = `당신은 ETF 시장 분석 전문가입니다. 아래 ETF 데이터를 분석해 반드시 순수 JSON만 출력하세요. 마크다운 코드블록 없이 순수 JSON:
{
  "trending_up": [{"symbol":"","name":"","reason":"급등 이유와 ETF 관점 영향 설명","why_important":"왜 중요한지","impact":"high|medium|low","ret30d":0,"changePct":0,"rating":"buy|neutral|sell","rating_reason":"투자의견 근거","risk_level":"high|medium|low","competitors":["경쟁ETF1","경쟁ETF2"],"short_term":"단기1주전망","mid_term":"중기1달전망","long_term":"장기3달전망"}],
  "trending_down": [{"symbol":"","name":"","reason":"급락 이유","why_important":"왜 중요한지","impact":"high|medium|low","ret30d":0,"changePct":0,"rating":"buy|neutral|sell","rating_reason":"투자의견 근거","risk_level":"high|medium|low","competitors":["경쟁ETF1","경쟁ETF2"],"short_term":"단기전망","mid_term":"중기전망","long_term":"장기전망"}],
  "steady_growth": [{"symbol":"","name":"","reason":"꾸준한 성장 이유","why_important":"왜 중요한지","impact":"high|medium|low","ret30d":0,"changePct":0,"rating":"buy|neutral|sell","rating_reason":"투자의견 근거","risk_level":"high|medium|low","competitors":["경쟁ETF1","경쟁ETF2"],"short_term":"단기전망","mid_term":"중기전망","long_term":"장기전망"}],
  "high_volume": [{"symbol":"","name":"","reason":"거래량 급증 이유","why_important":"왜 중요한지","impact":"high|medium|low","volume":0,"rating":"buy|neutral|sell","rating_reason":"투자의견 근거","risk_level":"high|medium|low","competitors":["경쟁ETF1","경쟁ETF2"]}],
  "near_52w_high": [{"symbol":"","name":"","reason":"신고가 근접 이유","why_important":"왜 중요한지","impact":"high|medium|low","fromHigh":0,"rating":"buy|neutral|sell","rating_reason":"투자의견 근거","risk_level":"high|medium|low","competitors":["경쟁ETF1","경쟁ETF2"]}],
  "sector_trends": [{"sector":"섹터명","trend":"상승|하락|보합","avg_change":0,"keywords":["키워드1","키워드2"],"summary":"섹터 동향 한줄요약","short_term":"단기1주전망","mid_term":"중기1달전망","top_etfs":["섹터대표ETF1","ETF2"]}],
  "etf_issues": [{"symbol":"","issue":"오늘 핵심 이슈 한줄","issue_type":"macro|earnings|policy|sentiment|technical","impact_etfs":["관련ETF1","관련ETF2"],"is_noise":false,"impact":"high|medium|low"}],
  "risk_analysis": [{"symbol":"","name":"","risk_level":"high|medium|low","volatility":"고변동성|중변동성|저변동성","max_drawdown_risk":"최대낙폭 리스크 설명","hedge_suggestion":"헤지 방법 제안","suitable_for":"적합한 투자자 유형"}],
  "portfolio_suggestion": {"aggressive":["공격형포트폴리오ETF1","ETF2","ETF3"],"balanced":["균형형ETF1","ETF2","ETF3"],"conservative":["안정형ETF1","ETF2","ETF3"],"suggestion":"포트폴리오 구성 조언"},
  "market_summary": "전체 시장 요약 3문장. 주요 트렌드와 주의사항 포함",
  "top_keywords": ["오늘시장키워드1","키워드2","키워드3","키워드4","키워드5"],
  "market_sentiment": "bullish|bearish|neutral",
  "market_sentiment_reason": "시장 심리 판단 근거"
}`;

  const userPrompt = `오늘 ETF 데이터 (거래량 상위 100개):\n${dataStr}\n\n섹터별 평균 등락률: ${sectorSummary}\n\n분석 요청:\n1. 각 카테고리 상위 5개씩 (trending_up/down/steady_growth/high_volume/near_52w_high)\n2. 각 ETF마다 투자의견(매수/중립/매도), 리스크레벨, 경쟁ETF, 단기/중기/장기 전망 포함\n3. sector_trends 상위 8개 (섹터별 단기/중기 전망 포함)\n4. etf_issues 5개\n5. risk_analysis 상위 5개 (리스크 높은 ETF 위주)\n6. portfolio_suggestion (투자성향별 추천)\n7. 시장 심리 판단`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.2,
      max_tokens: 4000,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("AI API 오류:", res.status, errText.slice(0, 200));
    return null;
  }
  const data = await res.json();
  const aiContent = data.choices?.[0]?.message?.content || "{}";
  console.log("AI 응답 일부:", aiContent.slice(0, 150));
  try {
    const cleaned = aiContent.replace(/```json\n?|\n?```/g, "").trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("JSON 파싱 오류:", e.message);
    // 부분 파싱 시도
    try {
      const match = aiContent.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    } catch {}
    return null;
  }
}

async function main() {
  console.log(`ETF 데이터 수집 시작... 총 ${FULL_LIST.length}개 종목`);

  const results = [];
  const CHUNK_SIZE = 5;

  for (let i = 0; i < FULL_LIST.length; i += CHUNK_SIZE) {
    const chunk = FULL_LIST.slice(i, i + CHUNK_SIZE).filter(e => e && e.symbol);
    const prices = await Promise.all(chunk.map(e => fetchPrice(e.symbol)));
    prices.forEach((price, idx) => {
      if (price && chunk[idx]) {
        const displaySymbol = price.symbol || (chunk[idx].symbol || "").replace(".KS", "");
        results.push({
          ...chunk[idx],
          ...price,
          symbol: displaySymbol,
          name: (price.name && price.name !== (chunk[idx].symbol || "").replace(".KS","")) ? price.name : (chunk[idx].name || displaySymbol),
        });
      }
    });

    if ((i + CHUNK_SIZE) % 50 === 0) {
      console.log(`${Math.min(i + CHUNK_SIZE, FULL_LIST.length)}/${FULL_LIST.length} 완료 (성공: ${results.length}개)`);
    }
    if (i + CHUNK_SIZE < FULL_LIST.length) {
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`수집 완료: ${results.length}/${FULL_LIST.length}개`);

  console.log("AI 분석 중...");
  const aiData = await getAIRecommendations(results);

  const output = {
    prices: results,
    ai: aiData,
    updatedAt: new Date().toISOString(),
    stats: {
      total: results.length,
      us: results.filter(r => r.market === "us").length,
      korea: results.filter(r => r.market === "korea").length,
      global: results.filter(r => r.market === "global").length,
    }
  };

  const outputDir = path.join(process.cwd(), "public");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, "data.json"), JSON.stringify(output, null, 2));
  console.log(`data.json 저장 완료! 미국:${output.stats.us} 한국:${output.stats.korea} 글로벌:${output.stats.global}`);
}

main().catch(console.error);
