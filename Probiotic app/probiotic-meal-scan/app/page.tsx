"use client";

import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type Page = "home" | "chat" | "profile";
type ProfileSection = "basics" | "conditions" | "score" | "history" | "tips";
type DoshaType = "" | "Vata" | "Pitta" | "Kapha" | "Vata-Pitta" | "Pitta-Kapha" | "Tridoshic";

interface MealLog {
  name: string;
  score: number;
  emoji: string;
  date: string;
  time: string;
}

interface MealInfo {
  name: string;
  emoji: string;
  score: number;
  desc: string;
  tags: string[];
}

interface ChatMessage {
  type: "bot" | "user";
  text: string;
}

interface Profile {
  name: string;
  age: string;
  sex: string;
  city: string;
  dosha: DoshaType;
  diet: string;
  spice: string;
  region: string;
}

// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────
const MEAL_DB: Record<string, MealInfo> = {
  idli: { name: "Idli", emoji: "🍚", score: 8, desc: "Fermented rice & urad dal. Rich in Lactobacillus. Excellent for gut flora, easy on digestion, light and cooling.", tags: ["Fermented", "Lactobacillus", "Low-cal", "Vata-Pitta friendly"] },
  dahi: { name: "Dahi", emoji: "🥛", score: 9, desc: "Traditional curd is one of India's most potent probiotics. Contains Lactobacillus bulgaricus & Streptococcus thermophilus.", tags: ["Probiotic", "Calcium-rich", "Cooling", "All doshas"] },
  lassi: { name: "Lassi", emoji: "🥤", score: 8, desc: "Churned dahi with water. The churning process activates probiotic cultures. Better than plain dahi for IBD.", tags: ["Probiotic", "Hydrating", "Pitta-balancing"] },
  kanji: { name: "Kanji", emoji: "🫙", score: 9, desc: "Fermented black carrot water. Rich in antioxidants, vinegar-like acids, and wild lactobacilli. Deeply probiotic.", tags: ["Wild ferment", "Antioxidant", "Gut healer", "Kapha-reducing"] },
  dhokla: { name: "Dhokla", emoji: "🟡", score: 7, desc: "Fermented besan batter steamed. Contains lactic acid bacteria, aids protein digestion, gut-friendly and light.", tags: ["Fermented", "High protein", "Light", "Vata-balancing"] },
  buttermilk: { name: "Chaas (Buttermilk)", emoji: "🧋", score: 9, desc: "Thin diluted curd, spiced with cumin and ginger. One of Ayurveda's top digestive tonics. Reduces bloating instantly.", tags: ["Digestive tonic", "Probiotic", "Pitta-cooling", "Anti-bloating"] },
  chaas: { name: "Chaas (Buttermilk)", emoji: "🧋", score: 9, desc: "Thin diluted curd, spiced with cumin and ginger. One of Ayurveda's top digestive tonics.", tags: ["Digestive tonic", "Probiotic", "Pitta-cooling", "Anti-bloating"] },
  dosa: { name: "Dosa", emoji: "🫔", score: 7, desc: "Fermented rice-lentil crepe. Overnight fermentation produces B-vitamins and lactic acid bacteria beneficial for the gut.", tags: ["Fermented", "B-vitamins", "South Indian", "Gut-friendly"] },
  uttapam: { name: "Uttapam", emoji: "🫓", score: 7, desc: "Thick fermented rice pancake. Same probiotic base as dosa with extra fibre from vegetable toppings.", tags: ["Fermented", "Fibre-rich", "Filling"] },
  shrikhand: { name: "Shrikhand", emoji: "🍮", score: 7, desc: "Hung curd sweetened with sugar and saffron. High in probiotics but also high in sugar — enjoy in moderation.", tags: ["Probiotic", "Calcium", "Moderate sugar"] },
  kvass: { name: "Ambali", emoji: "🍶", score: 8, desc: "Fermented ragi porridge from South India. Rich in calcium, iron, and lactic acid bacteria. A gut superfood.", tags: ["Ragi", "Lactobacillus", "South Indian", "Iron-rich"] },
  ambali: { name: "Ambali", emoji: "🍶", score: 8, desc: "Fermented ragi porridge from South India. Rich in calcium, iron, and lactic acid bacteria.", tags: ["Ragi", "Lactobacillus", "South Indian", "Iron-rich"] },
};

const CONDITIONS = [
  "IBS", "Bloating", "Constipation", "Acid Reflux / GERD", "Leaky Gut",
  "Food Intolerances", "Low Immunity", "Skin Issues (gut-linked)",
  "Anxiety (gut-brain axis)", "Weight Issues", "Diabetes", "Thyroid issues"
];

const GOALS = [
  "Improve digestion", "Reduce bloating", "Boost immunity", "Lose weight",
  "Better skin", "More energy", "Sleep better", "Manage stress",
  "Balance doshas", "Detox"
];

const WELLNESS_TIPS: Record<string, { icon: string; title: string; desc: string }[]> = {
  Vata: [
    { icon: "🥛", title: "Warm dahi, not cold", desc: "Vata is aggravated by cold. Always have dahi at room temperature, ideally with warm rice or khichdi." },
    { icon: "🫙", title: "Favour Kanji and Ambali", desc: "Warm, sour fermented foods ground Vata energy and improve erratic digestion." },
    { icon: "🌿", title: "Ghee is your best friend", desc: "A teaspoon of ghee in warm water before meals lubricates the gut and calms Vata-type constipation." },
  ],
  Pitta: [
    { icon: "🥤", title: "Cooling Lassi after meals", desc: "Sweet lassi made with dahi and rose water cools Pitta's fire and prevents acid reflux." },
    { icon: "🥥", title: "Coconut in all forms", desc: "Coconut water, coconut chutney, and coconut milk are deeply cooling for an overheated Pitta gut." },
    { icon: "🌸", title: "Avoid fermented at night", desc: "For Pitta types, eating fermented foods late evening can increase internal heat. Stick to daytime." },
  ],
  Kapha: [
    { icon: "🫙", title: "Kanji is perfect for you", desc: "The sharp, sour, light quality of Kanji directly counters Kapha's heavy, slow nature." },
    { icon: "🌶️", title: "Spiced buttermilk daily", desc: "Chaas with black pepper, ginger, and curry leaves is Ayurveda's top gut remedy for Kapha types." },
    { icon: "🚫", title: "Limit heavy dahi", desc: "Plain dahi increases Kapha. Prefer thin chaas or kanji for your probiotic intake." },
  ],
  default: [
    { icon: "🌅", title: "One fermented food daily", desc: "The single most impactful habit: include any one fermented Indian food each day — dahi, idli, chaas, or kanji." },
    { icon: "🥛", title: "Dahi at lunch, not dinner", desc: "Ayurveda advises eating curd at noon when digestive fire is strongest, never at night." },
    { icon: "🌿", title: "Triphala before bed", desc: "Half a teaspoon with warm water at night is a gentle, time-tested gut cleanser." },
  ],
};

const BOT_RESPONSES: Record<string, string> = {
  bloating: "For bloating, Ayurveda recommends Chaas (buttermilk) spiced with cumin and ginger after meals — it's one of the fastest natural remedies. Kanji (fermented black carrot drink) also works beautifully. Avoid raw salads and cold drinks with meals, as they douse the Agni (digestive fire). 🌿",
  pitta: "Pitta is the fire dosha — when it's out of balance, you get acid reflux, inflammation, and intense hunger. For gut health, cooling probiotics like Dahi, Shrikhand, and Lassi are ideal. Avoid very spicy or oily foods. Coconut-based dishes are wonderful for cooling Pitta's fire. 🔥",
  dahi: "Dahi is one of India's oldest and most potent probiotic foods. Unlike commercial yogurt, traditionally set dahi contains wild lactobacilli and streptococcus cultures that are far more diverse. Always eat it at room temperature (not cold from the fridge), and ideally at lunchtime for best absorption. 🥛",
  fermentation: "Fermentation in Indian cooking is ancient wisdom and modern science meeting beautifully. The dosa and idli batter ferments overnight using wild yeast and Leuconostoc bacteria from the lentils themselves — no starter needed! This process pre-digests starches, creates B12, and populates the batter with billions of gut-friendly organisms. 🫙",
  kanji: "Kanji is a traditional North Indian probiotic drink made from black carrots, water, and mustard seeds. It's left to ferment for 2-3 days, developing wild lactic acid bacteria. It's particularly wonderful for Kapha types — sharp, sour, and deeply cleansing for the gut. 🫙",
  ibs: "For IBS, Ayurveda recommends a warm, lightly spiced diet with plenty of fermented foods introduced gradually. Start with small amounts of dahi or chaas, as rushing into high-fibre fermented foods can aggravate symptoms. Jeera (cumin) water is excellent for regulating motility. 🌿",
  default: "That's a great question about gut health! The core Ayurvedic principle is that all disease begins in the gut (Purvaroopa), and that your digestive fire — Agni — is the foundation of health. Indian fermented foods like dahi, kanji, and idli are powerhouses of natural probiotics. Want me to dive deeper into any specific food or condition? 🌱",
};

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function lookupMeal(q: string): MealInfo | null {
  const key = q.toLowerCase().replace(/\s+/g, "");
  if (MEAL_DB[key]) return MEAL_DB[key];
  const found = Object.keys(MEAL_DB).find((k) => key.includes(k) || k.includes(key));
  return found ? MEAL_DB[found] : null;
}

function getGreeting(name: string): string | null {
  if (!name.trim()) return null;
  const hour = new Date().getHours();
  const time = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  return `${time}, ${name.trim()} 🙏`;
}

function getBotResponse(msg: string): string {
  const q = msg.toLowerCase();
  if (q.includes("bloat") || q.includes("gas") || q.includes("stomach")) return BOT_RESPONSES.bloating;
  if (q.includes("pitta") || q.includes("acid") || q.includes("reflux")) return BOT_RESPONSES.pitta;
  if (q.includes("dahi") || q.includes("curd") || q.includes("yogurt")) return BOT_RESPONSES.dahi;
  if (q.includes("ferment")) return BOT_RESPONSES.fermentation;
  if (q.includes("kanji")) return BOT_RESPONSES.kanji;
  if (q.includes("ibs") || q.includes("irritable")) return BOT_RESPONSES.ibs;
  return BOT_RESPONSES.default;
}

function getDoshaClass(dosha: DoshaType): string {
  if (!dosha) return "dosha-unknown";
  if (dosha.startsWith("Vata")) return "dosha-vata";
  if (dosha.startsWith("Pitta")) return "dosha-pitta";
  if (dosha.startsWith("Kapha")) return "dosha-kapha";
  return "dosha-vata";
}

function getDoshaEmoji(dosha: DoshaType): string {
  if (!dosha) return "";
  if (dosha.startsWith("Vata")) return "🌬️ ";
  if (dosha.startsWith("Pitta")) return "🔥 ";
  if (dosha.startsWith("Kapha")) return "🌊 ";
  return "✨ ";
}

function getInitials(name: string): string {
  return name.trim()
    ? name.trim().split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
    : "?";
}

// ─────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────
function DividerMotif() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center", padding: "8px 0", color: "var(--sand)", fontSize: 18, letterSpacing: 8 }}>
      <div style={{ flex: 1, maxWidth: 120, height: 1, background: "linear-gradient(90deg, transparent, var(--sand), transparent)" }} />
      ❁ ✦ ❁
      <div style={{ flex: 1, maxWidth: 120, height: 1, background: "linear-gradient(90deg, transparent, var(--sand), transparent)" }} />
    </div>
  );
}

function TypingIndicator({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 17px", background: "#fff", border: "1px solid var(--border)", borderRadius: 18, borderBottomLeftRadius: 4, alignSelf: "flex-start", width: "fit-content" }}>
      {[0, 200, 400].map((delay) => (
        <div key={delay} style={{ width: 6, height: 6, background: "var(--sand)", borderRadius: "50%", animation: `bounce 1.2s infinite ${delay}ms` }} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// SCORE ARC SVG
// ─────────────────────────────────────────────
function ScoreArc({ avg }: { avg: number | null }) {
  const circumference = 339.3;
  const offset = avg !== null ? circumference - (avg / 10) * circumference : circumference;
  return (
    <svg width="130" height="130" viewBox="0 0 130 130">
      <circle cx="65" cy="65" r="54" fill="none" stroke="var(--cream-dark)" strokeWidth="10" />
      <circle cx="65" cy="65" r="54" fill="none" stroke="var(--terracotta)" strokeWidth="10"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform="rotate(-90 65 65)"
        style={{ transition: "stroke-dashoffset 0.9s ease" }}
      />
      <text x="65" y="60" textAnchor="middle" fontFamily="Eczar, serif" fontSize="28" fontWeight="800" fill="var(--terracotta)">
        {avg !== null ? Math.round(avg * 10) / 10 : "—"}
      </text>
      <text x="65" y="78" textAnchor="middle" fontFamily="Hind, sans-serif" fontSize="12" fill="var(--ink-light)">/10</text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function GutVeda() {
  const [page, setPage] = useState<Page>("home");
  const [profileSection, setProfileSection] = useState<ProfileSection>("basics");

  // Profile state
  const [profile, setProfile] = useState<Profile>({
    name: "", age: "", sex: "", city: "", dosha: "", diet: "", spice: "", region: ""
  });
  const [basicsSaved, setBasicsSaved] = useState(false);

  // Conditions & Goals
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [condSaved, setCondSaved] = useState(false);

  // Meal logs
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);

  // Meal scanner
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState<{ meal: MealInfo | null; query: string } | null>(null);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { type: "bot", text: "Namaste! 🙏 I'm your personal Ayurvedic gut wellness guide. I can help you understand probiotic foods in Indian cuisine, suggest meals for your dosha, explain fermentation science, or help you decode gut symptoms. What's on your mind today?" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scannerRef = useRef<HTMLDivElement>(null);

  // ── Persist to localStorage ──
  useEffect(() => {
    try {
      const logs = localStorage.getItem("gv_logs");
      const cond = localStorage.getItem("gv_conditions");
      const goals = localStorage.getItem("gv_goals");
      const prof = localStorage.getItem("gv_profile");
      if (logs) setMealLogs(JSON.parse(logs));
      if (cond) setSelectedConditions(JSON.parse(cond));
      if (goals) setSelectedGoals(JSON.parse(goals));
      if (prof) setProfile(JSON.parse(prof));
    } catch { }
  }, []);

  useEffect(() => {
    try { localStorage.setItem("gv_logs", JSON.stringify(mealLogs)); } catch { }
  }, [mealLogs]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isTyping]);

  // ── Greeting ──
  const greeting = getGreeting(profile.name);

  // ── Navigation ──
  function showPage(p: Page) {
    setPage(p);
    window.scrollTo(0, 0);
  }

  // ── Meal Scanner ──
  function scanMeal(query?: string) {
    const q = query ?? scanInput;
    if (!q.trim()) return;
    const meal = lookupMeal(q);
    setScanResult({ meal, query: q });
    if (!query) setScanInput(q);

    if (meal) {
      const now = new Date();
      const log: MealLog = {
        name: meal.name, score: meal.score, emoji: meal.emoji,
        date: now.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        time: now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      setMealLogs((prev) => {
        const updated = [log, ...prev].slice(0, 30);
        try { localStorage.setItem("gv_logs", JSON.stringify(updated)); } catch { }
        return updated;
      });
    }
  }

  function quickScan(name: string) {
    setScanInput(name);
    scanMeal(name);
    scannerRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  // ── Chat ──
  function sendChat(text?: string) {
    const msg = text ?? chatInput;
    if (!msg.trim()) return;
    setChatMessages((prev) => [...prev, { type: "user", text: msg }]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const resp = getBotResponse(msg);
      setChatMessages((prev) => [...prev, { type: "bot", text: resp }]);
    }, 1200 + Math.random() * 800);
  }

  // ── Profile ──
  function saveBasics() {
    try { localStorage.setItem("gv_profile", JSON.stringify(profile)); } catch { }
    setBasicsSaved(true);
    setTimeout(() => setBasicsSaved(false), 2000);
  }

  function saveConditions() {
    try {
      localStorage.setItem("gv_conditions", JSON.stringify(selectedConditions));
      localStorage.setItem("gv_goals", JSON.stringify(selectedGoals));
    } catch { }
    setCondSaved(true);
    setTimeout(() => setCondSaved(false), 2000);
  }

  function toggleCondition(item: string) {
    setSelectedConditions((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  function toggleGoal(item: string) {
    setSelectedGoals((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  }

  // ── Score computations ──
  const avgScore = mealLogs.length ? mealLogs.reduce((s, m) => s + m.score, 0) / mealLogs.length : null;
  const scoreLabel = avgScore === null ? "Log meals to see your score"
    : avgScore >= 8 ? "🌟 Optimal gut health!"
      : avgScore >= 6 ? "💛 Good, keep going!"
        : "🌱 Needs some attention";
  const scoreAdvice = avgScore === null
    ? "Start by scanning meals on the Home page. Your gut score improves as you eat more fermented and probiotic-rich Indian foods."
    : avgScore >= 8 ? "Your probiotic intake is excellent. Keep including fermented foods daily and your gut microbiome will continue to thrive."
      : avgScore >= 6 ? "You're on the right track. Try adding Kanji or Chaas to one more meal a day to push your score higher."
        : "Your gut could use more probiotic support. Start with one fermented food daily — even a small cup of dahi or a glass of chaas makes a big difference.";

  const highMeals = mealLogs.filter((m) => m.score >= 8).length;
  const midMeals = mealLogs.filter((m) => m.score >= 6 && m.score < 8).length;
  const lowMeals = mealLogs.filter((m) => m.score < 6).length;

  // ── Tips ──
  const dosha = profile.dosha || "";
  const doshaKey = dosha.startsWith("Vata") ? "Vata"
    : dosha.startsWith("Pitta") ? "Pitta"
      : dosha.startsWith("Kapha") ? "Kapha"
        : "default";
  const tips = WELLNESS_TIPS[doshaKey] || WELLNESS_TIPS.default;

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Eczar:wght@400;500;600;700;800&family=Hind:wght@300;400;500;600&display=swap');

        :root {
          --terracotta: #B5451B;
          --terracotta-light: #D4673A;
          --terracotta-pale: #FAEAE2;
          --saffron: #E8960C;
          --saffron-light: #FDF3DC;
          --cream: #FBF6EE;
          --cream-dark: #F2EAD8;
          --ink: #2C1A0E;
          --ink-mid: #5C3D2A;
          --ink-light: #9C7355;
          --sand: #D4B896;
          --sand-light: #EDE0CF;
          --green: #3A6B45;
          --green-light: #E8F2EA;
          --border: rgba(180,120,70,0.18);
          --border-strong: rgba(180,120,70,0.35);
          --radius: 16px;
          --radius-sm: 10px;
          --shadow: 0 2px 16px rgba(90,40,10,0.08);
          --shadow-md: 0 4px 28px rgba(90,40,10,0.12);
        }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Hind', sans-serif;
          background: var(--cream);
          color: var(--ink);
          min-height: 100vh;
          font-size: 16px;
          line-height: 1.6;
        }

        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 0;
          opacity: 0.5;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }

        .fade-up { animation: fadeUp 0.4s ease; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 10px; }

        /* NAV */
        .topnav {
          position: sticky; top: 0; z-index: 100;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 28px; height: 62px;
          background: rgba(251,246,238,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-strong);
        }
        .nav-logo {
          font-family: 'Eczar', serif; font-size: 22px; font-weight: 700;
          color: var(--terracotta); cursor: pointer; letter-spacing: -0.3px;
          display: flex; align-items: center; gap: 8px;
        }
        .nav-logo .ink { color: var(--ink); }
        .nav-links { display: flex; gap: 4px; }
        .nav-link {
          font-family: 'Hind', sans-serif; font-size: 14px; font-weight: 500;
          padding: 7px 16px; border-radius: 50px; border: none;
          background: transparent; color: var(--ink-mid); cursor: pointer;
          transition: all 0.2s; letter-spacing: 0.01em;
        }
        .nav-link:hover { background: var(--sand-light); color: var(--terracotta); }
        .nav-link.active { background: var(--terracotta); color: #fff; }

        /* BUTTONS */
        .btn-primary {
          padding: 13px 30px; background: var(--terracotta); color: #fff;
          border-radius: 50px; border: none; font-family: 'Hind', sans-serif;
          font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.2s;
          box-shadow: 0 4px 18px rgba(181,69,27,0.28); letter-spacing: 0.01em;
        }
        .btn-primary:hover { background: var(--terracotta-light); transform: translateY(-1px); box-shadow: 0 6px 22px rgba(181,69,27,0.35); }
        .btn-ghost {
          padding: 13px 30px; background: transparent; color: var(--ink);
          border-radius: 50px; border: 1.5px solid var(--border-strong);
          font-family: 'Hind', sans-serif; font-size: 15px; font-weight: 600;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-ghost:hover { background: var(--sand-light); border-color: var(--sand); }

        .save-btn {
          padding: 11px 28px; background: var(--terracotta); color: #fff;
          border: none; border-radius: 50px; font-family: 'Hind', sans-serif;
          font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 8px;
        }
        .save-btn:hover { background: var(--terracotta-light); transform: translateY(-1px); }

        /* BADGE */
        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--saffron-light); color: var(--terracotta);
          border: 1px solid rgba(232,150,12,0.25); padding: 6px 16px;
          border-radius: 50px; font-size: 12.5px; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 28px;
        }

        /* HERO */
        .home-hero { max-width: 740px; margin: 0 auto; padding: 60px 28px 40px; text-align: center; }
        .hero-greeting {
          font-family: 'Eczar', serif; font-size: 1rem; color: var(--ink-light);
          font-weight: 500; letter-spacing: 0.02em; margin-bottom: 12px;
        }
        .hero-title {
          font-family: 'Eczar', serif;
          font-size: clamp(2.4rem, 5.5vw, 3.6rem);
          font-weight: 800; line-height: 1.12; color: var(--ink);
          margin-bottom: 20px; letter-spacing: -0.5px;
        }
        .hero-title .accent { color: var(--terracotta); }
        .hero-sub {
          font-size: 17px; color: var(--ink-mid); line-height: 1.75;
          max-width: 480px; margin: 0 auto 38px; font-weight: 400;
        }
        .hero-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }

        /* STATS */
        .stats-strip {
          background: var(--cream-dark); border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border); padding: 28px 40px;
          display: flex; justify-content: center; gap: 60px; flex-wrap: wrap;
        }
        .stat-item { text-align: center; }
        .stat-num { font-family: 'Eczar', serif; font-size: 30px; font-weight: 700; color: var(--terracotta); line-height: 1; }
        .stat-label { font-size: 12.5px; color: var(--ink-light); margin-top: 5px; letter-spacing: 0.03em; font-weight: 500; }

        /* SCANNER */
        .scanner-section { max-width: 660px; margin: 0 auto 60px; padding: 0 28px; }
        .scanner-card {
          background: #fff; border: 1px solid var(--border);
          border-radius: var(--radius); padding: 32px 28px; box-shadow: var(--shadow);
        }
        .scanner-title { font-family: 'Eczar', serif; font-size: 1.3rem; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
        .scanner-hint { font-size: 13px; color: var(--ink-light); margin-bottom: 20px; }
        .meal-input-row { display: flex; gap: 10px; margin-bottom: 14px; }
        .meal-input {
          flex: 1; padding: 11px 16px; border: 1.5px solid var(--border-strong);
          border-radius: 50px; font-family: 'Hind', sans-serif; font-size: 15px;
          color: var(--ink); background: var(--cream); outline: none; transition: border 0.2s;
        }
        .meal-input:focus { border-color: var(--terracotta); background: #fff; }
        .quick-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
        .chip {
          padding: 6px 14px; background: var(--cream-dark); border: 1px solid var(--border);
          border-radius: 50px; font-size: 13px; color: var(--ink-mid); cursor: pointer;
          transition: all 0.15s; font-weight: 500; font-family: 'Hind', sans-serif;
        }
        .chip:hover { background: var(--terracotta-pale); border-color: var(--terracotta); color: var(--terracotta); }

        /* RESULT */
        .result-card {
          background: var(--terracotta-pale); border: 1px solid rgba(181,69,27,0.15);
          border-radius: var(--radius-sm); padding: 20px; margin-top: 16px;
          animation: fadeUp 0.3s ease;
        }
        .result-meal-name { font-family: 'Eczar', serif; font-size: 20px; font-weight: 700; color: var(--terracotta); margin-bottom: 12px; }
        .result-score-row { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .score-circle {
          width: 58px; height: 58px; border-radius: 50%; border: 3px solid var(--terracotta);
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          background: #fff; flex-shrink: 0;
        }
        .score-num { font-family: 'Eczar', serif; font-size: 20px; font-weight: 800; color: var(--terracotta); line-height: 1; }
        .score-denom { font-size: 10px; color: var(--ink-light); }
        .score-desc { font-size: 13.5px; color: var(--ink-mid); line-height: 1.55; }
        .result-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .result-tag {
          padding: 4px 12px; background: #fff; border: 1px solid var(--border-strong);
          border-radius: 50px; font-size: 12px; color: var(--ink-mid); font-weight: 500;
        }

        /* FEATURES */
        .features-section { max-width: 1060px; margin: 56px auto; padding: 0 28px; }
        .section-title { font-family: 'Eczar', serif; font-size: 1.75rem; font-weight: 700; color: var(--ink); text-align: center; margin-bottom: 8px; }
        .section-sub { text-align: center; color: var(--ink-light); font-size: 14.5px; margin-bottom: 36px; }
        .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; }
        .feature-card {
          background: #fff; border: 1px solid var(--border); border-radius: var(--radius);
          padding: 26px 24px; cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden;
        }
        .feature-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--terracotta); opacity: 0; transition: opacity 0.2s;
        }
        .feature-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-md); border-color: var(--sand); }
        .feature-card:hover::before { opacity: 1; }
        .feature-icon-wrap { width: 50px; height: 50px; border-radius: 13px; display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 16px; }
        .feature-name { font-family: 'Eczar', serif; font-size: 17px; font-weight: 600; color: var(--ink); margin-bottom: 8px; }
        .feature-desc { font-size: 13.5px; color: var(--ink-light); line-height: 1.6; }

        /* PROBIOTICS STRIP */
        .probiotics-strip {
          background: var(--saffron-light); border-top: 1px solid rgba(232,150,12,0.2);
          border-bottom: 1px solid rgba(232,150,12,0.2); padding: 40px 28px; text-align: center;
        }
        .probiotic-pills { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .pro-pill {
          padding: 8px 18px; background: #fff; border: 1px solid rgba(232,150,12,0.3);
          border-radius: 50px; font-size: 13.5px; color: var(--ink-mid); font-weight: 500;
          cursor: pointer; transition: all 0.15s; font-family: 'Hind', sans-serif;
        }
        .pro-pill:hover { background: var(--terracotta); color: #fff; border-color: var(--terracotta); transform: translateY(-1px); }

        /* CHAT */
        .chat-wrap { max-width: 720px; margin: 0 auto; padding: 32px 28px 120px; }
        .chat-header { margin-bottom: 28px; }
        .chat-header h2 { font-family: 'Eczar', serif; font-size: 1.6rem; font-weight: 700; color: var(--ink); }
        .chat-header p { font-size: 14px; color: var(--ink-light); margin-top: 4px; }
        .chat-messages { display: flex; flex-direction: column; gap: 16px; margin-bottom: 20px; min-height: 180px; }
        .msg { max-width: 82%; padding: 12px 17px; border-radius: 18px; font-size: 14.5px; line-height: 1.65; animation: fadeUp 0.25s ease; }
        .msg.bot { background: #fff; border: 1px solid var(--border); border-bottom-left-radius: 4px; align-self: flex-start; color: var(--ink); box-shadow: var(--shadow); }
        .msg.user { background: var(--terracotta); color: #fff; border-bottom-right-radius: 4px; align-self: flex-end; }
        .msg-meta { font-size: 11px; margin-bottom: 5px; font-weight: 500; }
        .msg.bot .msg-meta { color: var(--ink-light); }
        .msg.user .msg-meta { color: rgba(255,255,255,0.65); text-align: right; }
        .chat-suggestions { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 18px; }
        .sugg-chip {
          padding: 7px 14px; background: var(--cream-dark); border: 1px solid var(--border-strong);
          border-radius: 50px; font-size: 13px; color: var(--ink-mid); cursor: pointer; font-weight: 500;
          transition: all 0.15s; font-family: 'Hind', sans-serif;
        }
        .sugg-chip:hover { background: var(--terracotta-pale); border-color: var(--terracotta); color: var(--terracotta); }
        .chat-input-row {
          display: flex; gap: 10px; position: fixed; bottom: 0; left: 0; right: 0;
          padding: 14px 28px 20px;
          background: rgba(251,246,238,0.95); backdrop-filter: blur(10px);
          border-top: 1px solid var(--border); z-index: 50;
        }
        .chat-input {
          flex: 1; padding: 11px 18px; border: 1.5px solid var(--border-strong);
          border-radius: 50px; font-family: 'Hind', sans-serif; font-size: 14.5px;
          color: var(--ink); background: #fff; outline: none; transition: border 0.2s;
        }
        .chat-input:focus { border-color: var(--terracotta); }

        /* PROFILE */
        .profile-wrap {
          max-width: 860px; margin: 0 auto; padding: 36px 28px 80px;
          display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: start;
        }
        .profile-avatar-card {
          background: #fff; border: 1px solid var(--border); border-radius: var(--radius);
          padding: 28px 24px; text-align: center; margin-bottom: 16px; box-shadow: var(--shadow);
        }
        .avatar-ring {
          width: 80px; height: 80px; border-radius: 50%; background: var(--terracotta-pale);
          border: 3px solid var(--terracotta); display: flex; align-items: center; justify-content: center;
          font-family: 'Eczar', serif; font-size: 30px; font-weight: 700; color: var(--terracotta);
          margin: 0 auto 14px;
        }
        .profile-name-display { font-family: 'Eczar', serif; font-size: 1.2rem; font-weight: 700; color: var(--ink); }
        .profile-dosha-badge { display: inline-block; padding: 4px 14px; border-radius: 50px; font-size: 12px; font-weight: 600; margin-top: 8px; letter-spacing: 0.04em; text-transform: uppercase; }
        .dosha-vata { background: #EEF0FA; color: #3B4FA0; }
        .dosha-pitta { background: var(--terracotta-pale); color: var(--terracotta); }
        .dosha-kapha { background: var(--green-light); color: var(--green); }
        .dosha-unknown { background: var(--sand-light); color: var(--ink-mid); }
        .mini-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 18px; }
        .mini-stat { background: var(--cream); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 10px; text-align: center; }
        .mini-stat-val { font-family: 'Eczar', serif; font-size: 20px; font-weight: 700; color: var(--terracotta); }
        .mini-stat-lbl { font-size: 11px; color: var(--ink-light); margin-top: 2px; font-weight: 500; }
        .sidebar-nav { display: flex; flex-direction: column; gap: 6px; }
        .sidebar-nav-btn {
          width: 100%; padding: 11px 18px; background: transparent; border: 1px solid transparent;
          border-radius: var(--radius-sm); font-family: 'Hind', sans-serif; font-size: 14px;
          font-weight: 500; color: var(--ink-mid); cursor: pointer; text-align: left;
          transition: all 0.15s; display: flex; align-items: center; gap: 10px;
        }
        .sidebar-nav-btn:hover { background: var(--cream-dark); color: var(--ink); }
        .sidebar-nav-btn.active { background: var(--terracotta-pale); color: var(--terracotta); border-color: rgba(181,69,27,0.15); font-weight: 600; }

        /* PCARD */
        .pcard { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 26px 24px; margin-bottom: 18px; box-shadow: var(--shadow); }
        .pcard-title { font-family: 'Eczar', serif; font-size: 1.1rem; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
        .pcard-sub { font-size: 13px; color: var(--ink-light); margin-bottom: 18px; }

        /* FORM */
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px; }
        .form-group { display: flex; flex-direction: column; gap: 5px; }
        .form-label { font-size: 12.5px; font-weight: 600; color: var(--ink-light); letter-spacing: 0.04em; text-transform: uppercase; }
        .form-input {
          padding: 10px 14px; border: 1.5px solid var(--border-strong); border-radius: var(--radius-sm);
          font-family: 'Hind', sans-serif; font-size: 14.5px; color: var(--ink);
          background: var(--cream); outline: none; transition: border 0.2s;
        }
        .form-input:focus { border-color: var(--terracotta); background: #fff; }

        /* CONDITIONS */
        .cond-grid { display: flex; flex-wrap: wrap; gap: 9px; }
        .cond-chip {
          padding: 7px 16px; background: var(--cream-dark); border: 1.5px solid var(--border-strong);
          border-radius: 50px; font-size: 13px; font-weight: 500; color: var(--ink-mid); cursor: pointer;
          transition: all 0.15s; font-family: 'Hind', sans-serif;
        }
        .cond-chip.on { background: var(--terracotta); border-color: var(--terracotta); color: #fff; }
        .cond-chip:hover:not(.on) { border-color: var(--terracotta); color: var(--terracotta); }

        /* MEAL HISTORY */
        .meal-history-list { display: flex; flex-direction: column; gap: 12px; }
        .meal-log-row {
          display: flex; align-items: center; gap: 14px; padding: 14px 16px;
          background: var(--cream); border: 1px solid var(--border); border-radius: var(--radius-sm);
        }
        .meal-log-emoji { font-size: 26px; flex-shrink: 0; }
        .meal-log-info { flex: 1; }
        .meal-log-name { font-weight: 600; color: var(--ink); font-size: 15px; }
        .meal-log-meta { font-size: 12px; color: var(--ink-light); margin-top: 2px; }
        .meal-log-score { font-family: 'Eczar', serif; font-size: 17px; font-weight: 700; flex-shrink: 0; }

        /* SCORE RING */
        .score-ring-wrap { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }

        /* TIPS */
        .tips-grid { display: flex; flex-direction: column; gap: 12px; }
        .tip-item { display: flex; gap: 14px; padding: 14px 16px; background: var(--cream); border: 1px solid var(--border); border-radius: var(--radius-sm); }
        .tip-icon { font-size: 24px; flex-shrink: 0; margin-top: 2px; }
        .tip-title { font-weight: 600; color: var(--ink); font-size: 14.5px; margin-bottom: 3px; }
        .tip-desc { font-size: 13px; color: var(--ink-light); line-height: 1.55; }

        /* EMPTY */
        .empty-state { text-align: center; padding: 36px 0; color: var(--ink-light); }
        .empty-icon { font-size: 42px; margin-bottom: 10px; }

        /* TOAST */
        .saved-toast { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; color: var(--green); font-weight: 600; margin-left: 12px; }

        /* RESPONSIVE */
        @media (max-width: 680px) {
          .profile-wrap { grid-template-columns: 1fr; }
          .chat-input-row { left: 0; transform: none; }
          .form-row { grid-template-columns: 1fr; }
        }
        @media (max-width: 560px) {
          .topnav { padding: 0 16px; }
          .nav-link { padding: 7px 12px; font-size: 13px; }
          .home-hero { padding: 40px 20px 28px; }
          .stats-strip { gap: 32px; padding: 24px 20px; }
          .features-section { padding: 0 20px; }
        }
      `}</style>

      {/* TOP NAV */}
      <nav className="topnav">
        <div className="nav-logo" onClick={() => showPage("home")}>
          <span>🌿</span>Gut<span className="ink">Veda</span>
        </div>
        <div className="nav-links">
          {(["home", "chat", "profile"] as Page[]).map((p) => (
            <button key={p} className={`nav-link${page === p ? " active" : ""}`} onClick={() => showPage(p)}>
              {p === "home" ? "Home" : p === "chat" ? "AI Guide" : "My Profile"}
            </button>
          ))}
        </div>
      </nav>

      {/* ═══════════════════ HOME ═══════════════════ */}
      {page === "home" && (
        <div className="fade-up">
          {/* Hero */}
          <section className="home-hero">
            {greeting && <div className="hero-greeting">{greeting}</div>}
            <div className="badge">🌱 Rooted in Ayurveda · Backed by Science</div>
            <h1 className="hero-title">
              Know what your gut<br />
              <span className="accent">truly needs</span>
            </h1>
            <p className="hero-sub">
              GutVeda maps Indian meals to probiotic benefits — helping you eat smarter, feel lighter, and restore gut balance the traditional way.
            </p>
            <div className="hero-btns">
              <button className="btn-primary" onClick={() => scannerRef.current?.scrollIntoView({ behavior: "smooth" })}>
                🥘 Scan a Meal
              </button>
              <button className="btn-ghost" onClick={() => showPage("profile")}>Get My Plan →</button>
            </div>
          </section>

          <DividerMotif />

          {/* Stats */}
          <div className="stats-strip">
            {[["60+", "Indian probiotic foods"], ["8", "Gut health categories"], ["3", "Dosha types mapped"], ["100%", "Rule-based, no tracking"]].map(([num, label]) => (
              <div key={label} className="stat-item">
                <div className="stat-num">{num}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* Meal Scanner */}
          <div className="scanner-section" style={{ marginTop: 52 }} ref={scannerRef}>
            <div className="scanner-card">
              <div className="scanner-title">🥘 Scan Your Meal</div>
              <div className="scanner-hint">Type any Indian meal to see its gut health profile</div>
              <div className="meal-input-row">
                <input
                  className="meal-input"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && scanMeal()}
                  placeholder="e.g. Idli, Lassi, Kimchi…"
                />
                <button className="btn-primary" style={{ padding: "11px 22px", fontSize: 14 }} onClick={() => scanMeal()}>Analyse</button>
              </div>
              <div className="quick-chips">
                {[["🍚 Idli", "Idli"], ["🥛 Dahi", "Dahi"], ["🥤 Lassi", "Lassi"], ["🫙 Kanji", "Kanji"], ["🟡 Dhokla", "Dhokla"], ["🧋 Chaas", "Chaas"]].map(([label, val]) => (
                  <span key={val} className="chip" onClick={() => quickScan(val)}>{label}</span>
                ))}
              </div>
              {scanResult && (
                <div className="result-card">
                  {scanResult.meal ? (
                    <>
                      <div className="result-meal-name">{scanResult.meal.emoji} {scanResult.meal.name}</div>
                      <div className="result-score-row">
                        <div className="score-circle">
                          <div className="score-num">{scanResult.meal.score}</div>
                          <div className="score-denom">/10</div>
                        </div>
                        <div className="score-desc">{scanResult.meal.desc}</div>
                      </div>
                      <div className="result-tags">
                        {scanResult.meal.tags.map((t) => <span key={t} className="result-tag">{t}</span>)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="result-meal-name">{scanResult.query || "Unknown meal"}</div>
                      <div className="score-desc">We don't have this meal in our database yet. Try: Idli, Dahi, Lassi, Kanji, Dhokla, or Chaas.</div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <section className="features-section">
            <h2 className="section-title">Everything your gut needs</h2>
            <p className="section-sub">From ancient wisdom to modern analysis — one home for your gut health</p>
            <div className="feature-grid">
              {[
                { icon: "🧠", bg: "#FDF3DC", name: "AI Gut Guide", desc: "Ask your personal Ayurvedic wellness guide anything about gut health, foods, and your dosha.", page: "chat" as Page },
                { icon: "🧬", bg: "var(--terracotta-pale)", name: "My Gut Plan", desc: "Set your dosha, conditions, and goals. Get a personalised probiotic meal roadmap.", page: "profile" as Page },
                { icon: "📋", bg: "var(--green-light)", name: "Meal History", desc: "Every meal you scan is logged. Watch your gut score improve over time.", page: "profile" as Page },
                { icon: "📚", bg: "#F0EAF8", name: "Learn Hub", desc: "Explore fermentation science, the three doshas, and gut bacteria in Indian cuisine.", page: null },
              ].map((f) => (
                <div key={f.name} className="feature-card" onClick={() => f.page && showPage(f.page)}>
                  <div className="feature-icon-wrap" style={{ background: f.bg }}>{f.icon}</div>
                  <div className="feature-name">{f.name}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Probiotics Strip */}
          <div className="probiotics-strip">
            <h3 style={{ fontFamily: "'Eczar', serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>60+ Indian Probiotic Foods</h3>
            <p style={{ color: "var(--ink-mid)", fontSize: 14, marginBottom: 20 }}>Click any food to learn its bacteria, benefits, and how to include it in your meals</p>
            <div className="probiotic-pills">
              {[["🥛 Dahi", "Dahi"], ["🍚 Idli", "Idli"], ["🫙 Kanji", "Kanji"], ["🥤 Lassi", "Lassi"], ["🟡 Dhokla", "Dhokla"], ["🧋 Chaas", "Chaas"], ["🫓 Uttapam", "Uttapam"], ["🍶 Ambali", "Ambali"], ["🫔 Dosa", "Dosa"], ["🍮 Shrikhand", "Shrikhand"]].map(([label, val]) => (
                <span key={val} className="pro-pill" onClick={() => quickScan(val)}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ CHAT ═══════════════════ */}
      {page === "chat" && (
        <div className="chat-wrap fade-up">
          <div className="chat-header">
            <h2>🧠 Your AI Gut Guide</h2>
            <p>Rooted in Ayurveda, powered by science — ask me anything</p>
          </div>

          <div className="chat-messages">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`msg ${msg.type}`}>
                <div className="msg-meta">{msg.type === "bot" ? "GutVeda Guide" : "You"}</div>
                {msg.text}
              </div>
            ))}
            <TypingIndicator show={isTyping} />
            <div ref={chatEndRef} />
          </div>

          <div className="chat-suggestions">
            {[
              ["🍛 Best foods for bloating", "What Indian foods are best for bloating?"],
              ["🔥 Pitta & gut health", "Explain my Pitta dosha and gut health"],
              ["🥛 Dahi vs curd", "What is the difference between Dahi and curd?"],
              ["🫙 Fermentation science", "How does fermentation work in Indian cooking?"],
            ].map(([label, text]) => (
              <span key={label} className="sugg-chip" onClick={() => sendChat(text)}>{label}</span>
            ))}
          </div>

          <div className="chat-input-row">
            <input
              className="chat-input"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendChat()}
              placeholder="Ask about gut health, doshas, foods…"
            />
            <button className="btn-primary" style={{ padding: "11px 22px", fontSize: 14, flexShrink: 0 }} onClick={() => sendChat()}>Send</button>
          </div>
        </div>
      )}

      {/* ═══════════════════ PROFILE ═══════════════════ */}
      {page === "profile" && (
        <div className="profile-wrap fade-up">
          {/* Sidebar */}
          <div>
            <div className="profile-avatar-card">
              <div className="avatar-ring">{getInitials(profile.name)}</div>
              <div className="profile-name-display">{profile.name || "Your Profile"}</div>
              <div className={`profile-dosha-badge ${getDoshaClass(profile.dosha)}`}>
                {profile.dosha ? `${getDoshaEmoji(profile.dosha)}${profile.dosha}` : "Dosha: Unknown"}
              </div>
              <div className="mini-stats">
                <div className="mini-stat">
                  <div className="mini-stat-val">{mealLogs.length}</div>
                  <div className="mini-stat-lbl">Meals logged</div>
                </div>
                <div className="mini-stat">
                  <div className="mini-stat-val">{avgScore !== null ? `${Math.round(avgScore * 10) / 10}/10` : "—"}</div>
                  <div className="mini-stat-lbl">Avg gut score</div>
                </div>
              </div>
            </div>

            <div className="sidebar-nav">
              {([
                ["basics", "👤 Basic Info"],
                ["conditions", "🩺 Conditions & Goals"],
                ["score", "📊 Gut Score"],
                ["history", "📋 Meal History"],
                ["tips", "✨ Wellness Tips"],
              ] as [ProfileSection, string][]).map(([id, label]) => (
                <button key={id} className={`sidebar-nav-btn${profileSection === id ? " active" : ""}`} onClick={() => setProfileSection(id)}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Main */}
          <div>
            {/* BASICS */}
            {profileSection === "basics" && (
              <div className="fade-up">
                <div className="pcard">
                  <div className="pcard-title">👤 Basic Information</div>
                  <div className="pcard-sub">Tell us about yourself so we can personalise your gut journey</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input className="form-input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Age</label>
                      <input className="form-input" type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} placeholder="Age" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Sex</label>
                      <select className="form-input" value={profile.sex} onChange={(e) => setProfile({ ...profile, sex: e.target.value })}>
                        <option value="">Select</option>
                        <option>Female</option>
                        <option>Male</option>
                        <option>Other / Prefer not to say</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">City / Region</label>
                      <input className="form-input" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} placeholder="e.g. Mumbai, Chennai…" />
                    </div>
                  </div>
                </div>

                <div className="pcard">
                  <div className="pcard-title">🌿 Ayurvedic Profile</div>
                  <div className="pcard-sub">Your dosha shapes your diet and digestion</div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Your Dosha</label>
                      <select className="form-input" value={profile.dosha} onChange={(e) => setProfile({ ...profile, dosha: e.target.value as DoshaType })}>
                        <option value="">I don't know yet</option>
                        <option value="Vata">Vata — Air & Space</option>
                        <option value="Pitta">Pitta — Fire & Water</option>
                        <option value="Kapha">Kapha — Earth & Water</option>
                        <option value="Vata-Pitta">Vata-Pitta</option>
                        <option value="Pitta-Kapha">Pitta-Kapha</option>
                        <option value="Tridoshic">Tridoshic (balanced)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Diet Preference</label>
                      <select className="form-input" value={profile.diet} onChange={(e) => setProfile({ ...profile, diet: e.target.value })}>
                        <option value="">Select</option>
                        <option>Vegetarian</option>
                        <option>Vegan</option>
                        <option>Eggetarian</option>
                        <option>Non-vegetarian</option>
                        <option>Jain</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Spice Tolerance</label>
                      <select className="form-input" value={profile.spice} onChange={(e) => setProfile({ ...profile, spice: e.target.value })}>
                        <option value="">Select</option>
                        <option>Mild</option>
                        <option>Medium</option>
                        <option>Spicy</option>
                        <option>Very Spicy</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Regional Cuisine</label>
                      <select className="form-input" value={profile.region} onChange={(e) => setProfile({ ...profile, region: e.target.value })}>
                        <option value="">Select</option>
                        <option>North Indian</option>
                        <option>South Indian</option>
                        <option>West Indian (Gujarati/Maharashtrian)</option>
                        <option>East Indian (Bengali/Odia)</option>
                        <option>Pan-Indian</option>
                      </select>
                    </div>
                  </div>
                  <button className="save-btn" onClick={saveBasics}>Save Profile</button>
                  {basicsSaved && <span className="saved-toast">✓ Saved!</span>}
                </div>
              </div>
            )}

            {/* CONDITIONS */}
            {profileSection === "conditions" && (
              <div className="fade-up">
                <div className="pcard">
                  <div className="pcard-title">🩺 Gut Conditions</div>
                  <div className="pcard-sub">Select everything that applies — we use this to personalise your food recommendations</div>
                  <div className="cond-grid">
                    {CONDITIONS.map((c) => (
                      <button key={c} className={`cond-chip${selectedConditions.includes(c) ? " on" : ""}`} onClick={() => toggleCondition(c)}>{c}</button>
                    ))}
                  </div>
                </div>
                <div className="pcard">
                  <div className="pcard-title">🎯 Your Health Goals</div>
                  <div className="pcard-sub">What are you working towards?</div>
                  <div className="cond-grid">
                    {GOALS.map((g) => (
                      <button key={g} className={`cond-chip${selectedGoals.includes(g) ? " on" : ""}`} onClick={() => toggleGoal(g)}>{g}</button>
                    ))}
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <button className="save-btn" onClick={saveConditions}>Save</button>
                    {condSaved && <span className="saved-toast">✓ Saved!</span>}
                  </div>
                </div>
              </div>
            )}

            {/* SCORE */}
            {profileSection === "score" && (
              <div className="fade-up">
                <div className="pcard">
                  <div className="pcard-title">📊 Your Gut Score</div>
                  <div className="pcard-sub">Based on your meal log history</div>
                  <div className="score-ring-wrap">
                    <ScoreArc avg={avgScore} />
                    <div>
                      <div style={{ fontFamily: "'Eczar', serif", fontSize: "1.1rem", fontWeight: 700, color: "var(--ink)", marginBottom: 8 }}>{scoreLabel}</div>
                      <div style={{ fontSize: "13.5px", color: "var(--ink-light)", lineHeight: 1.65 }}>{scoreAdvice}</div>
                    </div>
                  </div>
                </div>
                <div className="pcard">
                  <div className="pcard-title">📈 Score Breakdown</div>
                  <div className="pcard-sub">What's affecting your score</div>
                  {mealLogs.length === 0 ? (
                    <div className="empty-state"><div className="empty-icon">🥗</div><p>No meals logged yet. Scan your first meal on the Home page!</p></div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {[
                        ["🟢 High probiotic meals (8–10)", highMeals, "#3A6B45"],
                        ["🟡 Moderate probiotic meals (6–7)", midMeals, "#B5451B"],
                        ["🔴 Low probiotic meals (1–5)", lowMeals, "#A03020"],
                      ].map(([label, count, color]) => (
                        <div key={label as string}>
                          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                            <div style={{ fontSize: "13.5px", color: "var(--ink-mid)", flex: 1 }}>{label as string}</div>
                            <div style={{ fontFamily: "'Eczar', serif", fontSize: 16, fontWeight: 700, color: color as string }}>{count as number}</div>
                          </div>
                          <div style={{ background: "var(--cream-dark)", borderRadius: 50, height: 6, overflow: "hidden" }}>
                            <div style={{ background: color as string, height: "100%", width: `${mealLogs.length ? ((count as number) / mealLogs.length * 100).toFixed(0) : 0}%`, borderRadius: 50, transition: "width 0.8s ease" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* HISTORY */}
            {profileSection === "history" && (
              <div className="fade-up">
                <div className="pcard">
                  <div className="pcard-title">📋 Meal History</div>
                  <div className="pcard-sub">Every meal you've scanned, with its gut impact</div>
                  <div className="meal-history-list">
                    {mealLogs.length === 0 ? (
                      <div className="empty-state"><div className="empty-icon">🍛</div><p>No meals logged yet. Scan your first meal!</p></div>
                    ) : mealLogs.map((m, i) => {
                      const color = m.score >= 8 ? "#3A6B45" : m.score >= 6 ? "#B5451B" : "#A03020";
                      return (
                        <div key={i} className="meal-log-row">
                          <span className="meal-log-emoji">{m.emoji}</span>
                          <div className="meal-log-info">
                            <div className="meal-log-name">{m.name}</div>
                            <div className="meal-log-meta">{m.date} at {m.time}</div>
                          </div>
                          <div className="meal-log-score" style={{ color }}>{m.score}/10</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TIPS */}
            {profileSection === "tips" && (
              <div className="fade-up">
                <div className="pcard">
                  <div className="pcard-title">✨ Personalised Wellness Tips</div>
                  <div className="pcard-sub">Based on Ayurvedic wisdom for your gut type</div>
                  <div className="tips-grid">
                    {tips.map((t) => (
                      <div key={t.title} className="tip-item">
                        <div className="tip-icon">{t.icon}</div>
                        <div>
                          <div className="tip-title">{t.title}</div>
                          <div className="tip-desc">{t.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pcard">
                  <div className="pcard-title">🌅 Daily Gut Ritual</div>
                  <div className="pcard-sub">A simple morning routine for gut health</div>
                  <div className="tips-grid">
                    {[
                      { icon: "🌤️", title: "Wake up with warm water", desc: "Drink a glass of warm water with a pinch of jeera first thing. It kickstarts Agni (digestive fire) and flushes overnight toxins." },
                      { icon: "🥛", title: "Dahi at lunch, not dinner", desc: "According to Ayurveda, yogurt should be eaten at midday when digestion is strongest. Avoid it at night — it increases Kapha and can cause mucus formation." },
                      { icon: "🌿", title: "Triphala before bed", desc: "A traditional Ayurvedic gut tonic. Half a teaspoon with warm water before sleep helps cleanse the colon gently and nourish gut flora." },
                      { icon: "🫙", title: "Include one fermented food daily", desc: "Idli, dosa, kanji, lassi, or chaas — just one fermented food a day significantly boosts your microbiome diversity over weeks." },
                    ].map((t) => (
                      <div key={t.title} className="tip-item">
                        <div className="tip-icon">{t.icon}</div>
                        <div>
                          <div className="tip-title">{t.title}</div>
                          <div className="tip-desc">{t.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}