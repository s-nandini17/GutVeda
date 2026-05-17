import sys
import re

file_path = r'd:\BIOINFO - PROJECTS\REACT\Probiotic app\probiotic-meal-scan\app\page.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update mealLogs type in GutVeda and ProfilePage
content = content.replace(
    '{ name: string; score: number; emoji: string; time: string }', 
    '{ name: string; score: number; emoji: string; date: string; time: string }'
)

# 2. Extract everything from 'function HomePage(' to 'function ChatPage('
match = re.search(r'function HomePage\(.*?\nfunction ChatPage\(', content, flags=re.DOTALL)
if not match:
    print('Could not find components!')
    sys.exit(1)

old_components = match.group(0)[:-19] # exclude 'function ChatPage('

new_home_page = '''function HomePage({ mealLogs, setMealLogs, userName }: { mealLogs: { name: string; score: number; emoji: string; date: string; time: string }[]; setMealLogs: (l: { name: string; score: number; emoji: string; date: string; time: string }[]) => void; userName: string }) {
  const [tab, setTab] = useState<"type" | "pick" | "photo">("type");
  const [typed, setTyped] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<{ meal: string; score: number; fermented: string[]; bad: string[]; suggestions: typeof PROBIOTIC_CARDS } | null>(null);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoResult, setPhotoResult] = useState<string | null>(null);

  const recentMeals = mealLogs.slice(0, 5);

  function doAnalyze(meal: string) {
    if (!meal.trim()) return;
    setScanning(true);
    setTimeout(() => {
      const a = analyzeMeal(meal);
      setResult({ meal, ...a });
      const now = new Date();
      setMealLogs([{ name: meal, score: a.score, emoji: "🍽️", date: now.toLocaleDateString("en-IN", { month: "short", day: "numeric" }), time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) }, ...mealLogs]);
      setScanning(false);
    }, 900);
  }

  function handlePickAnalyze() {
    if (!selected.length) return;
    const meal = selected.map(id => FOOD_CATALOG.find(f => f.id === id)?.name).filter(Boolean).join(", ");
    doAnalyze(meal!);
  }

  async function handlePhoto(file: File) {
    setScanning(true);
    setPhotoResult(null);

    try {
      const base64data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: file.type, data: base64data } },
              { type: "text", text: "Analyze this Indian meal for gut health and probiotic content. Give a Gut Health Score out of 10. Mention if there are fermented elements. Suggest what Indian fermented food to add (like dahi or chaas). Reply like a knowledgeable Ayurvedic doctor providing analysis." }
            ]
          }],
          max_tokens: 1000
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch");

      setPhotoResult(data.content?.[0]?.text || "Couldn't analyze");
    } catch (e: any) {
      setPhotoResult("Error: " + e.message);
    } finally {
      setScanning(false);
    }
  }

  const scoreColor = result ? getScoreColor(result.score) : "#000";

  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: 720, paddingTop: 48, paddingBottom: 64 }}>
        
        {/* Intro Quote */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2.2rem, 5vw, 3rem)", color: "var(--sage)", fontStyle: "italic", marginBottom: 16, lineHeight: 1.2 }}>
            "Good health begins in the gut."
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "1.05rem", color: "var(--ink-light)" }}>
            Scan your meals and track your wellness journey.
          </p>
        </div>

        {/* Scan Section */}
        <div className="scan-tabs" style={{ justifyContent: "center" }}>
          {(["type", "pick", "photo"] as const).map(t => (
            <button key={t} className={`scan-tab ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setResult(null); }}>
              {t === "type" ? "✍️ Type Meal" : t === "pick" ? "🍱 Pick from List" : "📸 Photo Scan"}
            </button>
          ))}
        </div>

        {tab === "type" && (
          <div className="card fade-in">
            {recentMeals.length > 0 && (
              <div style={{ marginBottom: 14 }}>
                <div className="lbl">Recent meals</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {recentMeals.map((m, i) => (
                    <button key={i} className="suggest-pill" style={{ cursor: "pointer", border: "none" }} onClick={() => setTyped(m.name)}>{m.emoji} {m.name}</button>
                  ))}
                </div>
              </div>
            )}
            <label className="lbl">What did you eat? 🍛</label>
            <textarea className="inp" rows={3} placeholder="e.g. Idli with sambar and curd..." value={typed} onChange={e => setTyped(e.target.value)} style={{ resize: "vertical", borderRadius: 12, marginBottom: 12 }} />
            <button className="btn-primary" onClick={() => doAnalyze(typed)} disabled={!typed.trim() || scanning} style={{ opacity: (!typed.trim() || scanning) ? 0.5 : 1 }}>
              {scanning ? "Analyzing… 🔬" : "Get My Gut Score →"}
            </button>
          </div>
        )}

        {tab === "pick" && (
          <div className="card fade-in">
            <label className="lbl">Pick what you ate 🍽️ <span style={{ color: "var(--success)", fontWeight: 700 }}>🌿 = probiotic</span></label>
            <div className="food-grid" style={{ marginBottom: 16 }}>
              {FOOD_CATALOG.map(f => (
                <button key={f.id} className={`food-chip ${selected.includes(f.id) ? "selected" : ""}`} onClick={() => setSelected(s => s.includes(f.id) ? s.filter(x => x !== f.id) : [...s, f.id])}>
                  {f.probiotic && <span className="probiotic-dot" />}
                  {f.emoji} {f.name}
                </button>
              ))}
            </div>
            <button className="btn-primary" onClick={handlePickAnalyze} disabled={!selected.length || scanning} style={{ opacity: (!selected.length || scanning) ? 0.5 : 1 }}>
              {scanning ? "Analyzing… 🔬" : `Analyze ${selected.length} item${selected.length !== 1 ? "s" : ""} →`}
            </button>
          </div>
        )}

        {tab === "photo" && (
          <div className="card fade-in" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: 12 }}>📸</div>
            <p style={{ fontFamily: "'Inter', sans-serif", color: "var(--pink)", marginBottom: 20, fontSize: "0.95rem" }}>
              Upload a picture of your meal for a detailed analysis ✨
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 16 }}>
              <button className="btn-primary" onClick={() => fileRef.current?.click()}>📷 Take Photo</button>
              <button className="btn-secondary" onClick={() => fileRef.current?.click()}>🖼️ Upload Image</button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
            {scanning && (
              <div style={{ padding: "24px 0" }}>
                <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 10 }}>
                  <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                </div>
                <p style={{ fontFamily: "'Inter', sans-serif", color: "var(--pink)", fontSize: "0.9rem" }}>Analyzing your meal right now 🔬✨</p>
              </div>
            )}
            {photoResult && (
              <div className="bounce-in" style={{ background: "var(--sand-light)", border: "2px solid var(--sand)", borderRadius: 16, padding: 18, textAlign: "left", fontSize: "0.9rem", lineHeight: 1.7, whiteSpace: "pre-wrap", color: "var(--ink)" }}>
                {photoResult}
              </div>
            )}
            <div className="warn" style={{ marginTop: 16, textAlign: "left" }}>
              🔌 Photo analysis requires a Gemini API key in <code>.env.local</code>. Currently showing demo output!
            </div>
          </div>
        )}

        {/* RESULT CARD */}
        {result && !scanning && (
          <div className="result-card bounce-in" style={{ marginTop: 24 }}>
            <div className="result-header">
              <div className="result-greeting">{userName ? `Welcome ${userName}! 🌟` : "Welcome! 🌟"}</div>
              <div className="result-meal">🍽️ {result.meal}</div>
              <div style={{ fontSize: "0.85rem", opacity: 0.8, marginTop: 4 }}>Here is your probiotic analysis 🧬</div>
            </div>
            <div className="result-body">
              <div className="score-wrap">
                <ScoreRing score={result.score} size={100} />
                <div>
                  <div className="score-label" style={{ color: scoreColor }}>
                    {getScoreEmoji(result.score)} Score: {result.score}/10
                  </div>
                  <div className="score-msg">{getScoreMsg(result.score, result.meal)}</div>
                </div>
              </div>

              {result.fermented.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div className="suggest-title">✅ Probiotic ingredients detected</div>
                  <div className="suggest-pills">
                    {result.fermented.map(f => <span key={f} className="suggest-pill">{f}</span>)}
                  </div>
                </div>
              )}
              {result.prebiotic.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div className="suggest-title">🌿 Prebiotic ingredients detected</div>
                  <div className="suggest-pills">
                    {result.prebiotic.map(f => <span key={f} className="suggest-pill" style={{ color: "var(--success)" }}>{f}</span>)}
                  </div>
                </div>
              )}
              {result.bad.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div className="suggest-title">⚠️ Gut disruptors detected</div>
                  <div className="suggest-pills">
                    {result.bad.map(f => <span key={f} className="suggest-pill" style={{ background: "var(--sand-dark)", color: "#fff" }}>{f}</span>)}
                  </div>
                </div>
              )}

              {result.suggestions.length > 0 && (
                <div className="suggest-wrap">
                  <div className="suggest-title">💡 Consider adding:</div>
                  <div className="suggest-pills">
                    {result.suggestions.map(s => <span key={s.id} className="suggest-pill" style={{ borderColor: "var(--pink)" }}>{s.emoji} {s.name}</span>)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'''

content = content.replace(old_components, new_home_page + '\n')

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated component structure')
