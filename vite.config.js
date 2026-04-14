export default defineConfig({
  plugins: [react()],
  root: "src",
  base: "/etf-radar/",   // ← 이 줄 추가
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
});
