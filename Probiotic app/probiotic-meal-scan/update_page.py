import sys

new_content = '''"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// ─── DATA & CONSTANTS ─────────────────────────────────────────────────────────

const CONDITIONS = ["Bloating", "IBS", "Acidity", "Constipation", "Diabetes", "Low Immunity", "Inflammation", "Stress"];

const PROBIOTIC_CARDS = [
  { id: 1, emoji: "🥛", name: "Curd / Dahi", hindi: "दही", microbe: "Lactobacillus acidophilus", type: "bacteria", color: "#F5EFE6", border: "#D4C4AE", helps: ["Bloating", "IBS", "Immunity"], score: 9, tip: "Home-set curd has 10× more live cultures than packaged!", combos: ["Rice", "Paratha", "Fruit"] },
  { id: 2, emoji: "🥤", name: "Buttermilk / Chaas", hindi: "छाछ", microbe: "Lactobacillus bulgaricus", type: "bacteria", color: "#FADDE0", border: "#E56B7A", helps: ["Acidity", "Bloating", "Digestion"], score: 8, tip: "Spiced chaas with jeera is nature's digestive!", combos: ["Lunch", "Jeera", "Mint"] },
  { id: 3, emoji: "🫓", name: "Idli / Dosa", hindi: "इडली-डोसा", microbe: "Leuconostoc mesenteroides", type: "bacteria", color: "#DCE1DF", border: "#5B7065", helps: ["Constipation", "Bloating", "Energy"], score: 8, tip: "8-12 hr fermentation = maximum probiotic magic!", combos: ["Sambar", "Coconut Chutney", "Podi"] },
  { id: 4, emoji: "🍶", name: "Kefir", hindi: "केफ़िर", microbe: "Lactobacillus kefiri", type: "yeast+bacteria", color: "#F5EFE6", border: "#D4C4AE", helps: ["IBS", "Immunity", "Diabetes"], score: 10, tip: "30+ strains! The richest probiotic drink on earth.", combos: ["Berries", "Honey", "Nuts"] },
  { id: 5, emoji: "🥬", name: "Kimchi", hindi: "किमची", microbe: "Lactiplantibacillus plantarum", type: "bacteria", color: "#FADDE0", border: "#E56B7A", helps: ["Inflammation", "Diabetes", "IBS-C"], score: 9, tip: "Anti-inflammatory powerhouse — try making it at home!", combos: ["Rice", "Eggs", "Stir-fry"] },
  { id: 6, emoji: "🟡", name: "Dhokla", hindi: "ढोकला", microbe: "Pediococcus acidilactici", type: "bacteria", color: "#DCE1DF", border: "#5B7065", helps: ["Bloating", "Protein", "Energy"], score: 7, tip: "Overnight fermented batter = best dhokla + best gut!", combos: ["Green Chutney", "Sev", "Tea"] },
  { id: 7, emoji: "🫙", name: "Kanji", hindi: "कांजी", microbe: "Lactobacillus fermentum", type: "bacteria", color: "#F5EFE6", border: "#D4C4AE", helps: ["Immunity", "Detox", "Digestion"], score: 9, tip: "Black carrot kanji in winter = gut's best friend!", combos: ["Lunch", "Carrots", "Beetroot"] },
  { id: 8, emoji: "🫙", name: "Pickle / Achaar", hindi: "अचार", microbe: "Lactobacillus plantarum", type: "bacteria", color: "#DCE1DF", border: "#5B7065", helps: ["Constipation", "Appetite", "Immunity"], score: 7, tip: "Homemade oil-free achaar = real probiotics, no preservatives!", combos: ["Dal", "Paratha", "Khichdi"] },
  { id: 9, emoji: "🌱", name: "Sabja Seeds", hindi: "सब्जा", microbe: "Prebiotic fiber", type: "prebiotic", color: "#F5EFE6", border: "#D4C4AE", helps: ["Constipation", "Acidity", "Cooling"], score: 6, tip: "Soak in water 15 mins — your gut's favourite drink topping!", combos: ["Lemonade", "Falooda", "Smoothie"] },
  { id: 10, emoji: "🫐", name: "Amla / Gooseberry", hindi: "आंवला", microbe: "Prebiotic + Vit C", type: "prebiotic", color: "#FADDE0", border: "#E56B7A", helps: ["Immunity", "Acidity", "Skin"], score: 7, tip: "Highest natural Vitamin C in India — eat fresh every morning!", combos: ["Honey", "Ginger", "Juice"] },
  { id: 11, emoji: "🍵", name: "Kombucha", hindi: "कोम्बुचा", microbe: "Saccharomyces cerevisiae", type: "yeast", color: "#DCE1DF", border: "#5B7065", helps: ["Diabetes", "Energy", "Liver"], score: 8, tip: "Brew at home for ₹50/litre — your gut's sparkling !", combos: ["Lemon", "Ginger", "Ice"] },
  { id: 12, emoji: "🍲", name: "Bone Broth / Yakhni", hindi: "यखनी", microbe: "Collagen + Gut peptides", type: "peptides", color: "#F5EFE6", border: "#D4C4AE", helps: ["IBS", "Gut lining", "Joints"], score: 7, tip: "Slow-cook 8+ hrs for maximum gut-healing collagen!", combos: ["Rice", "Spices", "Lemon"] },
];

const FOOD_CATALOG = [
  { id: "idli-sambar", name: "Idli Sambar", emoji: "🫓", probiotic: true, score: 9 },
  { id: "dhokla", name: "Dhokla", emoji: "🟡", probiotic: true, score: 8.5 },
  { id: "handvo", name: "Handvo", emoji: "🫓", probiotic: true, score: 8 },
  { id: "dosa", name: "Dosa", emoji: "🫓", probiotic: true, score: 8 },
  { id: "appam", name: "Appam", emoji: "🥥", probiotic: true, score: 8.5 },
  { id: "curd-rice", name: "Curd Rice", emoji: "🍚", probiotic: true, score: 9 },
  { id: "buttermilk", name: "Chaas / Buttermilk", emoji: "🥤", probiotic: true, score: 9 },
  { id: "kanji", name: "Kanji", emoji: "🫙", probiotic: true, score: 9.5 },
  { id: "achaar", name: "Homemade Achaar", emoji: "🫙", probiotic: true, score: 7.5 },
  { id: "kefir", name: "Kefir", emoji: "🍶", probiotic: true, score: 10 },
  { id: "kombucha", name: "Kombucha", emoji: "🍵", probiotic: true, score: 8 },
  { id: "kimchi", name: "Kimchi", emoji: "🥬", probiotic: true, score: 9 },
  { id: "dal-chawal", name: "Dal Chawal", emoji: "🍛", probiotic: false, score: 6 },
  { id: "roti-sabzi", name: "Roti Sabzi", emoji: "🫓", probiotic: false, score: 6 },
  { id: "biryani", name: "Biryani", emoji: "🥘", probiotic: false, score: 5 },
  { id: "paneer-tikka", name: "Paneer Tikka", emoji: "🧀", probiotic: false, score: 5 },
  { id: "pizza", name: "Pizza", emoji: "🍕", probiotic: false, score: 2 },
  { id: "burger", name: "Burger", emoji: "🍔", probiotic: false, score: 2 },
  { id: "maggi", name: "Instant Noodles", emoji: "🍜", probiotic: false, score: 1 },
];

const CHAT_SUGGESTIONS = [
  "What should I eat for bloating? 🫠",
  "Best probiotic for IBS? 👀",
  "Is curd good daily? 🥛",
  "Explain gut health to me 🧬",
  "My gut score explained 📊",
  "What's kefir? 🍶",
];

const PRO_TIPS = [
  "💛 Home-set dahi for 6–8 hrs has 10× more live cultures than store-bought.",
  "🌟 Eating idli-dosa for breakfast? You are providing excellent nourishment for your gut microbiome.",
  "🔥 Add a pinch of hing to your dal — a time-tested Ayurvedic remedy for bloating.",
  "🫙 1 tsp homemade achaar with lunch provides a natural probiotic boost. No supplement needed!",
  "💜 Chaas after lunch is superior to probiotic pills. Add jeera and rock salt to enhance digestion.",
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Rozha+One&family=Montserrat:wght@400;500;600;700&display=swap');

:root {
  --bg: #E8DCCB;
  --bg-card: #FFFFFF;
  --border: rgba(91, 112, 101, 0.2);
  --accent: #5B7065;
  --accent-light: rgba(91, 112, 101, 0.1);
  --surface: #F5EFE6;
  --text-primary: #120802;
  --text-secondary: #495E54;
  --text-muted: rgba(0,0,0,0.5);
  --sand: #E8DCCB;
  --pink: #E56B7A;
  --sage: #5B7065;
  --radius: 16px;
  --shadow: 0 4px 24px rgba(91, 112, 101, 0.12);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Montserrat', sans-serif; background: var(--bg); color: var(--text-primary); overflow-x: hidden; }
h1, h2, h3 { font-family: 'Rozha One', serif; }
button, input, textarea, select { font-family: inherit; }

.btn-primary {
  background: var(--accent); color: #fff; border: none; border-radius: 50px;
  padding: 12px 28px; font-size: 1rem; font-weight: 600; cursor: pointer;
  transition: all 0.2s; box-shadow: 0 4px 12px rgba(91,112,101,0.2);
}
.btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(91,112,101,0.3); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-secondary {
  background: transparent; color: var(--accent); border: 2px solid var(--accent);
  border-radius: 50px; padding: 10px 26px; font-size: 1rem; font-weight: 600;
  cursor: pointer; transition: all 0.2s;
}
.btn-secondary:hover:not(:disabled) { background: var(--accent-light); }

.card {
  background: var(--bg-card); border-radius: var(--radius); padding: 24px;
  border: 1px solid var(--border); box-shadow: var(--shadow);
}

.inp { width: 100%; padding: 12px 16px; border-radius: 8px; border: 1.5px solid var(--border); font-size: 0.95rem; outline: none; transition: border-color 0.2s; background: var(--bg-card); color: var(--text-primary); }
.inp:focus { border-color: var(--accent); }
.lbl { font-size: 0.85rem; font-weight: 600; color: var(--text-primary); display: block; margin-bottom: 6px; }

/* Tabs */
.scan-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
.scan-tab { padding: 10px 16px; border-radius: 50px; border: 1px solid var(--border); background: var(--bg-card); cursor: pointer; font-size: 0.9rem; font-weight: 500; color: var(--text-secondary); transition: all 0.2s; }
.scan-tab.active { background: var(--accent); color: #fff; border-color: var(--accent); }

/* Chips */
.food-grid { display: flex; flex-wrap: wrap; gap: 8px; }
.food-chip { padding: 8px 14px; border-radius: 50px; border: 1px solid var(--border); background: var(--bg-card); cursor: pointer; font-size: 0.85rem; transition: all 0.2s; color: var(--text-primary); }
.food-chip.selected { background: var(--accent-light); border-color: var(--accent); color: var(--accent); font-weight: 600; }
.probiotic-dot { display: inline-block; width: 8px; height: 8px; background: #2E7D32; border-radius: 50%; margin-right: 6px; }
.suggest-pill { padding: 6px 12px; border-radius: 50px; border: 1px solid var(--border); background: var(--surface); font-size: 0.85rem; display: inline-flex; align-items: center; }

/* Chat */
.chat-window { display: flex; flex-direction: column; height: 500px; }
.chat-messages { flex: 1; overflow-y: auto; padding: 12px 0; display: flex; flex-direction: column; gap: 12px; }
.chat-bubble { max-width: 85%; display: flex; flex-direction: column; }
.chat-bubble.user { align-self: flex-end; align-items: flex-end; }
.chat-bubble.ai { align-self: flex-start; align-items: flex-start; }
.bubble-body { padding: 12px 16px; font-size: 0.95rem; line-height: 1.5; white-space: pre-wrap; }
.chat-bubble.user .bubble-body { background: var(--accent); color: #fff; border-radius: 18px 18px 4px 18px; }
.chat-bubble.ai .bubble-body { background: var(--bg-card); color: var(--text-primary); border-radius: 18px 18px 18px 4px; border: 1px solid var(--border); }
.bubble-ts { font-size: 0.7rem; color: var(--text-muted); margin-top: 4px; }
.chat-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.chat-chip { padding: 8px 14px; border-radius: 50px; background: var(--surface); border: 1px solid var(--border); font-size: 0.85rem; cursor: pointer; color: var(--text-secondary); }
.chat-chip:hover { background: var(--accent-light); color: var(--accent); }

/* Animations */
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.fade-in { animation: fadeIn 0.4s ease forwards; }
@keyframes typing { 0%, 100% { transform: translateY(0); opacity: 0.5; } 50% { transform: translateY(-4px); opacity: 1; } }
.typing-dot { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; display: inline-block; animation: typing 1.4s infinite; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

/* Probiotic Grid & Cards */
.probiotic-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px; }
.probiotic-card { background: var(--bg-card); border-radius: var(--radius); padding: 24px; border: 1.5px solid var(--border); cursor: pointer; perspective: 1000px; transition: transform 0.2s, box-shadow 0.2s; }
.probiotic-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
.help-tag { padding: 4px 10px; background: rgba(255,255,255,0.4); border-radius: 50px; font-size: 0.75rem; font-weight: 600; }
`;

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function getScoreColor(score: number) {
  if (score >= 8) return "#5B7065";
  if (score >= 6) return "#E56B7A";
  if (score >= 4) return "#D4C4AE";
  return "#C94C5C";
}

function getScoreEmoji(score: number) {
  if (score >= 8) return "🔥";
  if (score >= 6) return "✨";
  if (score >= 4) return "👀";
  return "😬";
}

function getScoreMsg(score: number, meal: string) {
  if (score >= 8) return `Excellent choice! ${meal} provides exceptional support for your gut health.`;
  if (score >= 6) return `A solid selection. This meal contributes positively to your microbiome.`;
  if (score >= 4) return `Acceptable, though incorporating more probiotics would be beneficial.`;
  return `This meal may disrupt your gut balance. Consider adding fermented elements.`;
}

function analyzeMeal(meal: string) {
  const lower = meal.toLowerCase();
  const fermented = ["curd", "dahi", "yogurt", "lassi", "chaas", "buttermilk", "idli", "dosa", "dhokla", "pickle", "achaar", "kanji", "kefir"].filter(k => lower.includes(k));
  const prebiotic = ["onion", "garlic", "banana", "oats", "dal", "lentil", "sprout", "sabja"].filter(k => lower.includes(k));
  const antiInfl = ["turmeric", "haldi", "ginger", "adrak", "amla", "jeera", "cumin"].filter(k => lower.includes(k));
  const bad = ["maida", "fried", "deep fry", "soda", "biscuit", "chips", "cake", "burger"].filter(k => lower.includes(k));
  const good = fermented.length * 3 + prebiotic.length * 2 + antiInfl.length * 1.5;
  const bad_pts = bad.length * 2.5;
  const score = Math.max(1, Math.min(10, Math.round(5 + good - bad_pts)));
  const suggestions = PROBIOTIC_CARDS.filter(p => score < 7 && p.score >= 7).slice(0, 3);
  return { score, fermented, prebiotic, bad, suggestions };
}

// ─── SUBCOMPONENTS ────────────────────────────────────────────────────────────

function ScoreRing({ score, size = 100 }: { score: number; size?: number }) {
  const r = 40, C = 2 * Math.PI * r;
  const dash = C * (score / 10);
  const color = getScoreColor(score);
  return (
    <div style={{ position: "relative", width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: "absolute", top: 0, left: 0 }}>
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--surface)" strokeWidth="10" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${C - dash}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div style={{ textAlign: "center", zIndex: 1 }}>
        <span style={{ fontFamily: "'Rozha One', serif", fontSize: size * 0.35, fontWeight: 800, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.15, color: "var(--text-muted)", fontWeight: 600 }}>/10</span>
      </div>
    </div>
  );
}

function ProbioticCard({ p }: { p: typeof PROBIOTIC_CARDS[0] }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className="probiotic-card fade-in" style={{ background: p.color, borderColor: p.border }} onClick={() => setFlipped(!flipped)}>
      {!flipped ? (
        <>
          <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>{p.emoji}</div>
          <div style={{ fontFamily: "'Rozha One', serif", fontSize: "1.2rem", fontWeight: 700, color: "var(--text-primary)" }}>{p.name}</div>
          <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 12 }}>{p.hindi}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {p.helps.map(h => <span key={h} className="help-tag" style={{ color: p.border }}>{h}</span>)}
          </div>
          <div style={{ marginTop: 16, fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "right" }}>Click to flip 🔄</div>
        </>
      ) : (
        <div style={{ padding: "8px 0" }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>Microbe/Yeast:</div>
          <div style={{ fontSize: "0.9rem", color: p.border, marginBottom: 12 }}>🦠 {p.microbe}</div>
          
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>Helps combat:</div>
          <div style={{ fontSize: "0.9rem", color: p.border, marginBottom: 12 }}>🩺 {p.helps.join(", ")}</div>

          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>Ideal food combos:</div>
          <div style={{ fontSize: "0.9rem", color: p.border, marginBottom: 12 }}>🍽️ {p.combos.join(" + ")}</div>
          
          <div style={{ marginTop: 16, fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "right" }}>Click to flip back 🔄</div>
        </div>
      )}
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function HomePage({ mealLogs, setMealLogs, userName }: any) {
  const [tab, setTab] = useState<"type" | "pick" | "photo">("type");
  const [typed, setTyped] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [result, setResult] = useState<{ meal: string; score: number; fermented: string[]; bad: string[]; suggestions: typeof PROBIOTIC_CARDS } | null>(null);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [photoResult, setPhotoResult] = useState<string | null>(null);

  const [tip] = useState(() => PRO_TIPS[Math.floor(Math.random() * PRO_TIPS.length)]);

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
    setScanning(true); setPhotoResult(null);
    try {
      const base64data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const response = await fetch("/api/gemini", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: [
              { type: "image", source: { type: "base64", media_type: file.type, data: base64data } },
              { type: "text", text: "Analyze this Indian meal for gut health and probiotic content. Give a Gut Health Score out of 10. Mention if there are fermented elements. Suggest what Indian fermented food to add (like dahi or chaas). Reply like a knowledgeable Ayurvedic doctor providing analysis." }
            ]
          }], max_tokens: 1000
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch");
      setPhotoResult(data.content?.[0]?.text || "Couldn't analyze");
    } catch (e: any) { setPhotoResult("Error: " + e.message); } finally { setScanning(false); }
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }} className="fade-in">
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "var(--accent)", marginBottom: 16 }}>
          Welcome back, {userName || "friend"} ✨
        </h1>
        <div style={{ display: "inline-block", background: "var(--accent-light)", color: "var(--accent)", padding: "10px 20px", borderRadius: 50, fontSize: "0.95rem", fontWeight: 500 }}>
          💡 {tip}
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: "1.5rem", marginBottom: 20, textAlign: "center" }}>Scan a Meal 🔍</h2>
        <div className="scan-tabs" style={{ justifyContent: "center" }}>
          {(["type", "pick", "photo"] as const).map(t => (
            <button key={t} className={`scan-tab ${tab === t ? "active" : ""}`} onClick={() => { setTab(t); setResult(null); }}>
              {t === "type" ? "✍️ Type" : t === "pick" ? "🍱 Pick" : "📸 Photo"}
            </button>
          ))}
        </div>

        {tab === "type" && (
          <div className="fade-in">
            <textarea className="inp" rows={3} placeholder="e.g. Idli with sambar and curd..." value={typed} onChange={e => setTyped(e.target.value)} style={{ marginBottom: 12 }} />
            <button className="btn-primary" style={{ width: "100%" }} onClick={() => doAnalyze(typed)} disabled={!typed.trim() || scanning}>
              {scanning ? "Analyzing… 🔬" : "Get My Gut Score →"}
            </button>
          </div>
        )}

        {tab === "pick" && (
          <div className="fade-in">
            <div className="food-grid" style={{ marginBottom: 16 }}>
              {FOOD_CATALOG.map(f => (
                <button key={f.id} className={`food-chip ${selected.includes(f.id) ? "selected" : ""}`} onClick={() => setSelected(s => s.includes(f.id) ? s.filter(x => x !== f.id) : [...s, f.id])}>
                  {f.probiotic && <span className="probiotic-dot" />}
                  {f.emoji} {f.name}
                </button>
              ))}
            </div>
            <button className="btn-primary" style={{ width: "100%" }} onClick={handlePickAnalyze} disabled={!selected.length || scanning}>
              {scanning ? "Analyzing… 🔬" : `Analyze ${selected.length} items →`}
            </button>
          </div>
        )}

        {tab === "photo" && (
          <div className="fade-in" style={{ textAlign: "center" }}>
            <p style={{ color: "var(--text-secondary)", marginBottom: 20 }}>Upload a picture of your meal for a detailed analysis ✨</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 16 }}>
              <button className="btn-primary" onClick={() => fileRef.current?.click()}>📷 Take Photo</button>
              <button className="btn-secondary" onClick={() => fileRef.current?.click()}>🖼️ Upload</button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => e.target.files?.[0] && handlePhoto(e.target.files[0])} />
            {scanning && <div style={{ padding: "20px" }}>Analyzing your meal right now 🔬✨</div>}
            {photoResult && (
              <div style={{ background: "var(--surface)", padding: 20, borderRadius: 12, textAlign: "left", fontSize: "0.95rem", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                {photoResult}
              </div>
            )}
          </div>
        )}

        {result && !scanning && (
          <div className="card fade-in" style={{ marginTop: 24, background: "var(--surface)", border: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: 4 }}>🍽️ {result.meal}</h3>
                <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)" }}>{getScoreMsg(result.score, result.meal)}</div>
              </div>
              <ScoreRing score={result.score} size={80} />
            </div>
            {result.suggestions.length > 0 && (
              <div>
                <div className="lbl">💡 Consider adding:</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {result.suggestions.map(s => <span key={s.id} className="suggest-pill">{s.emoji} {s.name}</span>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TrackerPage({ mealLogs, profile, setProfile }: any) {
  const [filterCond, setFilterCond] = useState<string | null>(null);
  
  // Dynamic probiotics based on selected condition
  const filteredProbiotics = filterCond ? PROBIOTIC_CARDS.filter(p => p.helps.includes(filterCond)) : PROBIOTIC_CARDS;

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }} className="fade-in">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 32 }}>
        
        {/* Left Column: Meal History */}
        <div>
          <h2 style={{ fontSize: "1.8rem", color: "var(--accent)", marginBottom: 24 }}>Meal History 📋</h2>
          {mealLogs.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>🥗</div>
              <p style={{ color: "var(--text-secondary)" }}>No meals logged yet! Head to Home to scan a meal.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {mealLogs.map((m: any, i: number) => (
                <div key={i} className="card fade-in" style={{ padding: "16px", display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ fontSize: "2rem" }}>{m.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: "1.05rem" }}>{m.name}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>
                      {m.date ? `${m.date} at ` : ""}{m.time}
                    </div>
                  </div>
                  <ScoreRing score={m.score} size={50} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Discover & Overcome */}
        <div>
          <h2 style={{ fontSize: "1.8rem", color: "var(--accent)", marginBottom: 24 }}>Discover Healing 🌿</h2>
          <div className="card" style={{ marginBottom: 24 }}>
            <label className="lbl" style={{ fontSize: "1rem" }}>What do you want to overcome?</label>
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 16 }}>Select a condition to see targeted probiotics.</p>
            <div className="food-grid">
              {CONDITIONS.map(c => (
                <button key={c} 
                  className={`food-chip ${filterCond === c ? "selected" : ""}`} 
                  onClick={() => setFilterCond(filterCond === c ? null : c)}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <h3 style={{ fontSize: "1.2rem", marginBottom: 16 }}>
            {filterCond ? `Probiotics for ${filterCond}` : "All Probiotics"}
          </h3>
          <div className="probiotic-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
            {filteredProbiotics.map(p => <ProbioticCard key={p.id} p={p} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPage({ profile }: any) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string; ts: number }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send(text: string) {
    if (!text.trim()) return;
    const newMsg = { role: "user" as const, text, ts: Date.now() };
    setMessages(s => [...s, newMsg]);
    setInput(""); setLoading(true);
    
    try {
      const payload = {
        messages: [{ role: "user", content: text }],
        system: `You are GutVeda AI, a highly knowledgeable Ayurvedic doctor and gut-health expert. The user's name is ${profile.name || "friend"}. Be concise, supportive, and use elegant language.`,
        max_tokens: 300
      };
      const response = await fetch("/api/gemini", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed");
      setMessages(s => [...s, { role: "ai", text: data.content?.[0]?.text || "No response", ts: Date.now() }]);
    } catch (e: any) {
      setMessages(s => [...s, { role: "ai", text: "Error: " + e.message, ts: Date.now() }]);
    } finally { setLoading(false); }
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }} className="fade-in">
      <h1 style={{ textAlign: "center", fontSize: "2.4rem", color: "var(--accent)", marginBottom: 24 }}>AI Coach 🧠</h1>
      <div className="card chat-window">
        <div className="chat-messages">
          {messages.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-secondary)" }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🌿</div>
              <p>Welcome! Ask me anything about gut health, probiotics, or Ayurveda.</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role} fade-in`}>
                <div className="bubble-body">{m.text}</div>
                <div className="bubble-ts">{m.role === "user" ? "You" : "GutVeda AI"} · {new Date(m.ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
              </div>
            ))
          )}
          {loading && (
            <div className="chat-bubble ai">
              <div className="bubble-body" style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginLeft: 4 }}>thinking…</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        
        {messages.length === 0 && (
          <div className="chat-chips">
            {CHAT_SUGGESTIONS.map(s => <button key={s} className="chat-chip" onClick={() => send(s)}>{s}</button>)}
          </div>
        )}
        
        <div style={{ display: "flex", gap: 8 }}>
          <input className="inp" placeholder="Ask a question..." value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send(input)} />
          <button className="btn-primary" onClick={() => send(input)} disabled={!input.trim() || loading}>Send</button>
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ profile, setProfile, mealLogs }: any) {
  const avgScore = mealLogs.length > 0 ? Math.round(mealLogs.reduce((s: number, l: any) => s + l.score, 0) / mealLogs.length) : 7;

  function update(k: string, v: any) { setProfile({ ...profile, [k]: v }); }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }} className="fade-in">
      
      {/* Top Section: Score & Name */}
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 40, marginBottom: 40, padding: 40, background: "var(--surface)", border: "none" }}>
        <ScoreRing score={avgScore} size={140} />
        <div>
          <h1 style={{ fontSize: "2.8rem", color: "var(--accent)", marginBottom: 8 }}>{profile.name || "Your Profile"}</h1>
          <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", marginBottom: 16 }}>
            {avgScore >= 8 ? "Your gut is in its Optimal Health Zone 👑" : avgScore >= 6 ? "Solid gut health! Keep going 💪" : "Your gut needs some attention — let's fix it! 🫶"}
          </p>
          <div style={{ display: "flex", gap: 24 }}>
            <div>
              <div style={{ fontFamily: "'Rozha One', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--accent)" }}>{mealLogs.length}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Meals Logged</div>
            </div>
            <div>
              <div style={{ fontFamily: "'Rozha One', serif", fontSize: "1.8rem", fontWeight: 700, color: "var(--accent)" }}>{profile.conditions.length}</div>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Conditions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Middle: Form */}
      <div className="card" style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: "1.5rem", marginBottom: 20 }}>Personal Details 👤</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
          <div><label className="lbl">Name</label><input className="inp" value={profile.name} onChange={e => update("name", e.target.value)} placeholder="Your name" /></div>
          <div><label className="lbl">Age</label><input className="inp" type="number" value={profile.age} onChange={e => update("age", e.target.value)} placeholder="Age" /></div>
          <div>
            <label className="lbl">Gender</label>
            <select className="inp" value={profile.sex} onChange={e => update("sex", e.target.value)}>
              <option value="">Select</option><option value="female">Female</option><option value="male">Male</option><option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bottom: Probiotics Encyclopedia */}
      <h2 style={{ fontSize: "2rem", color: "var(--accent)", marginBottom: 24, textAlign: "center" }}>Probiotics Encyclopedia 🦠</h2>
      <div className="probiotic-grid">
        {PROBIOTIC_CARDS.map(p => <ProbioticCard key={p.id} p={p} />)}
      </div>

    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function GutVeda() {
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState("home");
  const [profile, setProfile] = useState({ name: "", age: "", sex: "", conditions: [] as string[], goals: [] as string[] });
  const [mealLogs, setMealLogs] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const p = localStorage.getItem("gv2_profile");
      const l = localStorage.getItem("gv2_logs");
      if (p) setProfile(JSON.parse(p));
      if (l) setMealLogs(JSON.parse(l));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("gv2_profile", JSON.stringify(profile));
      localStorage.setItem("gv2_logs", JSON.stringify(mealLogs));
    } catch { /* ignore */ }
  }, [profile, mealLogs, mounted]);

  if (!mounted) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FDF6EC", fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>🌿</div>
        <div style={{ fontFamily: "'Rozha One', serif", fontSize: "1.6rem", fontWeight: 800, color: "#5B7065" }}>GutVeda</div>
      </div>
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div style={{ minHeight: "100vh" }}>
        {/* Header from Snippet */}
        <header style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "20px 40px", borderBottom: "1px solid var(--border)",
          background: "var(--bg-card)", position: "sticky", top: 0, zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("home")}>
            <span style={{ fontSize: 28 }}>🌿</span>
            <span style={{ fontFamily: "'Rozha One', serif", fontSize: 24, fontWeight: 700, color: "var(--accent)" }}>
              GutVeda
            </span>
          </div>
          <nav style={{ display: "flex", gap: 8 }}>
            {[
              { label: "Home", id: "home" },
              { label: "Meal Tracker", id: "tracker" },
              { label: "AI Coach", id: "chat" },
              { label: "My Profile", id: "profile" },
            ].map(({ label, id }) => (
              <button key={id} onClick={() => setPage(id)} style={{
                padding: "8px 18px", borderRadius: 50, fontSize: 14, fontWeight: 600,
                background: page === id ? "var(--accent)" : "transparent", 
                color: page === id ? "#fff" : "var(--text-secondary)",
                border: "none", cursor: "pointer", transition: "all 0.2s",
                fontFamily: "'Montserrat', sans-serif"
              }}
                onMouseEnter={e => {
                  if (page !== id) {
                    (e.target as HTMLElement).style.background = "var(--accent-light)";
                    (e.target as HTMLElement).style.color = "var(--accent)";
                  }
                }}
                onMouseLeave={e => {
                  if (page !== id) {
                    (e.target as HTMLElement).style.background = "transparent";
                    (e.target as HTMLElement).style.color = "var(--text-secondary)";
                  }
                }}
              >{label}</button>
            ))}
          </nav>
        </header>

        {/* Pages */}
        {page === "home" && <HomePage mealLogs={mealLogs} setMealLogs={setMealLogs} userName={profile.name} />}
        {page === "tracker" && <TrackerPage mealLogs={mealLogs} profile={profile} setProfile={setProfile} />}
        {page === "chat" && <ChatPage profile={profile} />}
        {page === "profile" && <ProfilePage profile={profile} setProfile={setProfile} mealLogs={mealLogs} />}
      </div>
    </>
  );
}
'''

file_path = r'd:\BIOINFO - PROJECTS\REACT\Probiotic app\probiotic-meal-scan\app\page.tsx'
with open(file_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Updated page.tsx with 4-tab minimalist layout')
