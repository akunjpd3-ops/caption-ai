"use client";

import { useState } from "react";

const PASSWORD = "captionpro123";

const PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
];

const TONES = [
  { value: "casual", label: "Santai" },
  { value: "profesional", label: "Profesional" },
  { value: "lucu", label: "Lucu" },
  { value: "inspiratif", label: "Inspiratif" },
];

export default function Home() {
  const [unlocked, setUnlocked] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [passError, setPassError] = useState(false);
  const [topik, setTopik] = useState("");
  const [detail, setDetail] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [tone, setTone] = useState("casual");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  function checkPassword() {
    if (passInput === PASSWORD) {
      setUnlocked(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  }

  async function generate() {
    if (!topik.trim()) return;
    setLoading(true);
    setOutput("");
    setCopied(false);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topik, platform, tone, detail }),
      });
      if (!res.ok) throw new Error("Gagal generate");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        setOutput((prev) => prev + decoder.decode(value));
      }
    } catch {
      setOutput("Terjadi kesalahan. Coba lagi ya!");
    } finally {
      setLoading(false);
    }
  }

  function copyOutput() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!unlocked) {
    return (
      <main style={styles.main}>
        <div style={styles.lockContainer}>
          <div style={styles.lockCard}>
            <div style={styles.lockIcon}>🔒</div>
            <h2 style={styles.lockTitle}>Caption Generator AI</h2>
            <p style={styles.lockSubtitle}>Masukkan password untuk akses</p>
            <input
              style={passError ? styles.inputError : styles.inputFull}
              type="password"
              placeholder="Password..."
              value={passInput}
              onChange={(e) => { setPassInput(e.target.value); setPassError(false); }}
              onKeyDown={(e) => e.key === "Enter" && checkPassword()}
            />
            {passError && <p style={styles.errorText}>Password salah. Coba lagi!</p>}
            <button style={styles.btn} onClick={checkPassword}>Masuk</button>
            <p style={styles.buyText}>
              Belum punya akses?{" "}
              <a href="https://lynk.id/username" style={styles.buyLink}>Beli di sini</a>
            </p>
          </div>
        </div>
        <style>{`* { box-sizing: border-box; } body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }`}</style>
      </main>
    );
  }

  return (
    <main style={styles.main}>
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.badge}>AI Writing Tool</div>
          <h1 style={styles.title}>Caption Generator</h1>
          <p style={styles.subtitle}>Buat caption media sosial yang engaging dalam hitungan detik</p>
        </div>
        <div style={styles.card}>
          <div style={styles.field}>
            <label style={styles.label}>Topik / Produk *</label>
            <input style={styles.inputFull} placeholder="contoh: Jual sepatu sneakers limited edition" value={topik} onChange={(e) => setTopik(e.target.value)} onKeyDown={(e) => e.key === "Enter" && generate()} />
          </div>
          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Platform</label>
              <div style={styles.chipGroup}>
                {PLATFORMS.map((p) => (
                  <button key={p.value} style={platform === p.value ? styles.chipActive : styles.chip} onClick={() => setPlatform(p.value)}>{p.label}</button>
                ))}
              </div>
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Tone</label>
              <div style={styles.chipGroup}>
                {TONES.map((t) => (
                  <button key={t.value} style={tone === t.value ? styles.chipActive : styles.chip} onClick={() => setTone(t.value)}>{t.label}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Detail tambahan <span style={{ fontWeight: 400, color: "#888" }}>(opsional)</span></label>
            <textarea style={styles.textarea} placeholder="contoh: warna ada pink, mint, cream — bahan adem, harga 85rb" value={detail} onChange={(e) => setDetail(e.target.value)} rows={3} />
          </div>
          <button style={loading || !topik.trim() ? styles.btnDisabled : styles.btn} onClick={generate} disabled={loading || !topik.trim()}>
            {loading ? "Generating..." : "Generate Caption"}
          </button>
        </div>
        {(output || loading) && (
          <div style={styles.outputCard}>
            <div style={styles.outputHeader}>
              <span style={styles.outputTitle}>Hasil Caption</span>
              {output && !loading && <button style={styles.copyBtn} onClick={copyOutput}>{copied ? "Tersalin!" : "Salin semua"}</button>}
            </div>
            <div style={styles.outputBody}>
              {output ? <pre style={styles.outputText}>{output}</pre> : (
                <div style={styles.loadingDots}>
                  <span style={styles.dot} />
                  <span style={{ ...styles.dot, animationDelay: "0.2s" }} />
                  <span style={{ ...styles.dot, animationDelay: "0.4s" }} />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.3} 50%{opacity:1} } * { box-sizing: border-box; } body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; } input:focus, textarea:focus { outline: none; border-color: #6c63ff !important; }`}</style>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: { minHeight: "100vh", background: "#f8f7ff", padding: "40px 16px" },
  lockContainer: { minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8f7ff" },
  lockCard: { background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "32px 28px", width: "100%", maxWidth: 380, display: "flex", flexDirection: "column", gap: 12, alignItems: "center", textAlign: "center" },
  lockIcon: { fontSize: 32, marginBottom: 4 },
  lockTitle: { margin: 0, fontSize: 22, fontWeight: 700, color: "#1a1a2e" },
  lockSubtitle: { margin: 0, fontSize: 14, color: "#6b7280" },
  errorText: { margin: 0, fontSize: 13, color: "#dc2626" },
  buyText: { margin: 0, fontSize: 13, color: "#6b7280" },
  buyLink: { color: "#6c63ff", fontWeight: 600, textDecoration: "none" },
  inputFull: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, color: "#1a1a2e", background: "#fff" },
  inputError: { width: "100%", padding: "10px 14px", borderRadius: 10, border: "1.5px solid #dc2626", fontSize: 14, color: "#1a1a2e", background: "#fff" },
  container: { maxWidth: 680, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 },
  header: { textAlign: "center", paddingBottom: 8 },
  badge: { display: "inline-block", background: "#ede9fe", color: "#5b21b6", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, marginBottom: 12, letterSpacing: "0.04em", textTransform: "uppercase" },
  title: { margin: "0 0 8px", fontSize: 32, fontWeight: 700, color: "#1a1a2e", letterSpacing: "-0.5px" },
  subtitle: { margin: 0, fontSize: 15, color: "#6b7280" },
  card: { background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 24, display: "flex", flexDirection: "column", gap: 20 },
  field: { display: "flex", flexDirection: "column", gap: 8 },
  row: { display: "flex", gap: 20, flexWrap: "wrap" },
  label: { fontSize: 13, fontWeight: 600, color: "#374151" },
  textarea: { padding: "10px 14px", borderRadius: 10, border: "1.5px solid #e5e7eb", fontSize: 14, color: "#1a1a2e", background: "#fff", resize: "vertical", fontFamily: "inherit", lineHeight: 1.5 },
  chipGroup: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "6px 14px", borderRadius: 20, border: "1.5px solid #e5e7eb", background: "#fff", fontSize: 13, color: "#6b7280", cursor: "pointer", fontWeight: 500 },
  chipActive: { padding: "6px 14px", borderRadius: 20, border: "1.5px solid #6c63ff", background: "#ede9fe", fontSize: 13, color: "#5b21b6", cursor: "pointer", fontWeight: 600 },
  btn: { width: "100%", padding: "12px 20px", borderRadius: 10, border: "none", background: "#6c63ff", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" },
  btnDisabled: { width: "100%", padding: "12px 20px", borderRadius: 10, border: "none", background: "#c4b5fd", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "not-allowed" },
  outputCard: { background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden" },
  outputHeader: { padding: "14px 20px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" },
  outputTitle: { fontSize: 13, fontWeight: 600, color: "#374151" },
  copyBtn: { fontSize: 12, padding: "5px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#f9fafb", color: "#374151", cursor: "pointer", fontWeight: 500 },
  outputBody: { padding: 20, minHeight: 80 },
  outputText: { margin: 0, fontSize: 14, lineHeight: 1.75, color: "#374151", whiteSpace: "pre-wrap", fontFamily: "inherit" },
  loadingDots: { display: "flex", gap: 6, alignItems: "center", padding: "16px 0" },
  dot: { width: 8, height: 8, borderRadius: "50%", background: "#6c63ff", animation: "pulse 1s ease-in-out infinite", opacity: 0.3 },
};
