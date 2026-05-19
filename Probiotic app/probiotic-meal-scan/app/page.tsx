"use client";

import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
type Page = "home" | "learn" | "chat" | "profile";
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
  // ── HIGH PROBIOTIC (8–10) ──
  idli: { name: "Idli", emoji: "🍚", score: 8, desc: "Fermented rice & urad dal. Rich in Lactobacillus. Excellent for gut flora, easy on digestion, light and cooling.", tags: ["Fermented", "Lactobacillus", "Low-cal", "Vata-Pitta friendly"] },
  dahi: { name: "Dahi", emoji: "🥛", score: 9, desc: "Traditional curd is one of India's most potent probiotics. Contains Lactobacillus bulgaricus & Streptococcus thermophilus.", tags: ["Probiotic", "Calcium-rich", "Cooling", "All doshas"] },
  curd: { name: "Dahi", emoji: "🥛", score: 9, desc: "Traditional curd is one of India's most potent probiotics. Contains Lactobacillus bulgaricus & Streptococcus thermophilus.", tags: ["Probiotic", "Calcium-rich", "Cooling", "All doshas"] },
  lassi: { name: "Lassi", emoji: "🥤", score: 8, desc: "Churned dahi with water. The churning process activates probiotic cultures. Better than plain dahi for IBD.", tags: ["Probiotic", "Hydrating", "Pitta-balancing"] },
  kanji: { name: "Kanji", emoji: "🫙", score: 9, desc: "Fermented black carrot water. Rich in antioxidants, vinegar-like acids, and wild lactobacilli. Deeply probiotic.", tags: ["Wild ferment", "Antioxidant", "Gut healer", "Kapha-reducing"] },
  buttermilk: { name: "Chaas (Buttermilk)", emoji: "🧋", score: 9, desc: "Thin diluted curd, spiced with cumin and ginger. One of Ayurveda's top digestive tonics. Reduces bloating instantly.", tags: ["Digestive tonic", "Probiotic", "Pitta-cooling", "Anti-bloating"] },
  chaas: { name: "Chaas (Buttermilk)", emoji: "🧋", score: 9, desc: "Thin diluted curd, spiced with cumin and ginger. One of Ayurveda's top digestive tonics.", tags: ["Digestive tonic", "Probiotic", "Pitta-cooling", "Anti-bloating"] },
  kvass: { name: "Ambali", emoji: "🍶", score: 8, desc: "Fermented ragi porridge from South India. Rich in calcium, iron, and lactic acid bacteria. A gut superfood.", tags: ["Ragi", "Lactobacillus", "South Indian", "Iron-rich"] },
  ambali: { name: "Ambali", emoji: "🍶", score: 8, desc: "Fermented ragi porridge from South India. Rich in calcium, iron, and lactic acid bacteria.", tags: ["Ragi", "Lactobacillus", "South Indian", "Iron-rich"] },
  kefir: { name: "Kefir", emoji: "🍶", score: 10, desc: "The richest probiotic drink on earth — 30+ strains of bacteria and yeast. Goat milk kefir is gentler for sensitive guts.", tags: ["30+ strains", "Yeast + Bacteria", "Gut healer", "Immunity"] },
  kimchi: { name: "Kimchi", emoji: "🥬", score: 9, desc: "Fermented Korean cabbage now widely available in India. Rich in Lactiplantibacillus plantarum, powerfully anti-inflammatory.", tags: ["Anti-inflammatory", "Fermented", "Lactiplantibacillus", "IBS-C"] },
  idlisambar: { name: "Idli with Sambar", emoji: "🍚", score: 9, desc: "The gold standard probiotic Indian breakfast. Fermented idli + tamarind-based sambar prebiotics = a complete gut meal.", tags: ["Fermented", "Prebiotic combo", "South Indian", "Gut superfood"] },
  "idli-sambar": { name: "Idli with Sambar", emoji: "🍚", score: 9, desc: "The gold standard probiotic Indian breakfast. Fermented idli + tamarind-based sambar prebiotics = a complete gut meal.", tags: ["Fermented", "Prebiotic combo", "South Indian", "Gut superfood"] },
  curdrice: { name: "Curd Rice", emoji: "🍚", score: 9, desc: "South India's ultimate gut comfort food. Warm rice mixed with dahi is easier to digest and deeply probiotic. Perfect for any gut complaint.", tags: ["Probiotic", "Cooling", "Soothing", "South Indian"] },
  "curd rice": { name: "Curd Rice", emoji: "🍚", score: 9, desc: "South India's ultimate gut comfort food. Warm rice mixed with dahi is easier to digest and deeply probiotic.", tags: ["Probiotic", "Cooling", "Soothing", "South Indian"] },

  // ── MODERATE PROBIOTIC (6–7) ──
  dosa: { name: "Dosa", emoji: "🫔", score: 7, desc: "Fermented rice-lentil crepe. Overnight fermentation produces B-vitamins and lactic acid bacteria beneficial for the gut.", tags: ["Fermented", "B-vitamins", "South Indian", "Gut-friendly"] },
  uttapam: { name: "Uttapam", emoji: "🫓", score: 7, desc: "Thick fermented rice pancake. Same probiotic base as dosa with extra fibre from vegetable toppings.", tags: ["Fermented", "Fibre-rich", "Filling"] },
  dhokla: { name: "Dhokla", emoji: "🟡", score: 7, desc: "Fermented besan batter steamed. Contains lactic acid bacteria, aids protein digestion, gut-friendly and light.", tags: ["Fermented", "High protein", "Light", "Vata-balancing"] },
  shrikhand: { name: "Shrikhand", emoji: "🍮", score: 7, desc: "Hung curd sweetened with sugar and saffron. High in probiotics but also high in sugar — enjoy in moderation.", tags: ["Probiotic", "Calcium", "Moderate sugar"] },
  raita: { name: "Raita", emoji: "🥣", score: 7, desc: "Dahi blended with cucumber, mint or boondi. Cooling, probiotic, and excellent as a side dish for heavy meals.", tags: ["Probiotic", "Cooling", "Digestive", "Side dish"] },
  paneerraita: { name: "Paneer Raita", emoji: "🥣", score: 6, desc: "Curd-based raita with paneer. Good probiotic value from the curd base. Protein-rich and easy on digestion.", tags: ["Probiotic", "High protein", "Calcium"] },
  masala: { name: "Masala Dosa", emoji: "🫔", score: 7, desc: "Fermented dosa with spiced potato filling. The fermented crepe base carries probiotic value even with rich filling.", tags: ["Fermented", "South Indian", "Filling"] },
  upma: { name: "Upma", emoji: "🍳", score: 5, desc: "Semolina porridge with vegetables. No fermentation but prebiotic fibre from vegetables helps feed gut bacteria.", tags: ["Prebiotic fibre", "Light breakfast", "Vata-friendly"] },
  khichdi: { name: "Khichdi", emoji: "🍲", score: 6, desc: "Ayurveda's greatest gut-healing meal. Tridoshic (balances all three doshas), easy to digest, and perfect after illness.", tags: ["Tridoshic", "Gut-healing", "Easy digestion", "All doshas"] },
  poha: { name: "Poha", emoji: "🍽️", score: 5, desc: "Flattened rice cooked with mustard seeds and curry leaves. Light on the gut. Low probiotic value but easy to digest.", tags: ["Light", "Easy digestion", "Iron-rich", "Breakfast"] },

  // ── LOW / NON-PROBIOTIC (1–5) ──
  biryani: { name: "Biryani", emoji: "🍛", score: 2, desc: "Fragrant rice dish — delicious but hard on the gut. Spices and oil can stress the gut lining if eaten frequently. Add dahi as a side to boost probiotic value.", tags: ["Low probiotic", "Heavy", "Add dahi for gut boost"] },
  cholebhature: { name: "Chole Bhature", emoji: "🫓", score: 1, desc: "Deep fried bread with spiced chickpeas. Maida in bhature disrupts gut flora. Hard to digest. Best as an occasional treat with chaas on the side.", tags: ["Maida", "Deep fried", "Occasional treat", "Add chaas"] },
  "chole bhature": { name: "Chole Bhature", emoji: "🫓", score: 1, desc: "Deep fried bread with spiced chickpeas. Maida disrupts gut flora. Add chaas to minimise the gut impact.", tags: ["Maida", "Deep fried", "Add chaas"] },
  dalrice: { name: "Dal Rice", emoji: "🍛", score: 4, desc: "Dal (lentils) are an excellent prebiotic — they feed good bacteria in the colon. Add a small bowl of dahi to make this a complete gut meal.", tags: ["Prebiotic", "Balanced", "Add dahi for probiotic boost"] },
  "dal rice": { name: "Dal Rice", emoji: "🍛", score: 4, desc: "Dal (lentils) are an excellent prebiotic. Add a small bowl of dahi to make this a complete gut meal.", tags: ["Prebiotic", "Balanced", "Add dahi"] },
  rajmachawal: { name: "Rajma Chawal", emoji: "🍛", score: 3, desc: "Kidney beans and rice. High in prebiotic fibre but heavy on digestion. Add a cup of chaas or dahi to significantly improve gut impact.", tags: ["Prebiotic fibre", "Heavy", "Add chaas"] },
  "rajma chawal": { name: "Rajma Chawal", emoji: "🍛", score: 3, desc: "Kidney beans and rice. High in prebiotic fibre but heavy on digestion. Add chaas to improve gut impact.", tags: ["Prebiotic fibre", "Heavy", "Add chaas"] },
  paneertikka: { name: "Paneer Tikka", emoji: "🧀", score: 3, desc: "Grilled cottage cheese. No probiotic value but paneer itself is a dairy product with some gut-supporting properties.", tags: ["Low probiotic", "High protein", "Grilled"] },
  "paneer tikka": { name: "Paneer Tikka", emoji: "🧀", score: 3, desc: "Grilled cottage cheese. No probiotic value but protein-rich. Pair with dahi-based dip to add probiotic value.", tags: ["Low probiotic", "High protein", "Grilled"] },
  butter: { name: "Butter Chicken", emoji: "🍗", score: 2, desc: "Rich tomato-cream chicken curry. Heavy on the gut due to cream and butter. Eat with dahi raita and limit the naan.", tags: ["Low probiotic", "Heavy", "Pair with raita"] },
  "butter chicken": { name: "Butter Chicken", emoji: "🍗", score: 2, desc: "Rich tomato-cream chicken curry. Pair with dahi raita to add probiotic benefit.", tags: ["Low probiotic", "Heavy", "Pair with raita"] },
  pav: { name: "Pav Bhaji", emoji: "🍞", score: 2, desc: "Vegetable mash with maida pav. Maida disrupts gut bacteria balance. Opt for whole wheat pav when possible.", tags: ["Maida pav", "Low probiotic", "Occasional treat"] },
  "pav bhaji": { name: "Pav Bhaji", emoji: "🍞", score: 2, desc: "Vegetable mash with maida pav. Maida disrupts gut bacteria balance. Opt for whole wheat pav when possible.", tags: ["Maida", "Low probiotic"] },
  samosa: { name: "Samosa", emoji: "🥟", score: 1, desc: "Deep fried maida pastry. One of the hardest foods on the gut — maida disrupts microbiome and the frying inflames gut lining.", tags: ["Maida", "Deep fried", "Occasional treat only"] },
  roti: { name: "Roti / Chapati", emoji: "🫓", score: 4, desc: "Whole wheat flatbread. No probiotic value but the high fibre feeds gut bacteria. Far better than maida bread for your microbiome.", tags: ["Prebiotic fibre", "Whole wheat", "Daily staple"] },
  sabzi: { name: "Sabzi (Vegetable Curry)", emoji: "🥦", score: 4, desc: "Cooked vegetables with Indian spices. The spices (turmeric, cumin, coriander) all have prebiotic and anti-inflammatory properties.", tags: ["Prebiotic spices", "Anti-inflammatory", "Turmeric"] },
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
  const [learnTab, setLearnTab] = useState<"science" | "dosha" | "microbes">("science");

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
  const [scanTab, setScanTab] = useState<"type" | "pick" | "photo">("type");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoAnalysing, setPhotoAnalysing] = useState(false);
  const [photoResult, setPhotoResult] = useState<string | null>(null);
  const [openProbiotic, setOpenProbiotic] = useState<string | null>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

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

  function handlePhoto(file: File | undefined) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target!.result as string);
      setPhotoResult(null);
      setPhotoAnalysing(true);
      // Simulated analysis — replace with real API call if Gemini key is set
      setTimeout(() => {
        setPhotoAnalysing(false);
        setPhotoResult(`🍽️ WHAT I SEE\nLooks like a homemade Indian meal with visible fermented elements!\n\n⭐ GUT HEALTH SCORE: 7/10\nGood choice — fermented components detected.\n\n🦠 PROBIOTIC POTENTIAL\nIf your meal includes dahi, idli or chaas, your gut bacteria are thriving!\n\n💡 ONE UPGRADE\nAdd a small cup of chaas or dahi on the side to push this to an 8–9/10 score.\n\n✅ VERDICT\nA solid Indian meal — your gut approves! 🌿`);
      }, 2000);
    };
    reader.readAsDataURL(file);
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
  const dosha = profile?.dosha || "";

  const doshaKey =
    dosha.startsWith("Vata")
      ? "Vata"
      : dosha.startsWith("Pitta")
        ? "Pitta"
        : dosha.startsWith("Kapha")
          ? "Kapha"
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

        /* LEARN HUB STYLES */
        .learn-wrap { max-width: 960px; margin: 0 auto; padding: 36px 28px 80px; }
        .learn-header { text-align: center; margin-bottom: 36px; }
        .learn-header h2 { font-family: 'Eczar', serif; font-size: 2rem; font-weight: 800; color: var(--ink); }
        .learn-header p { font-size: 14.5px; color: var(--ink-light); margin-top: 6px; }
        
        .learn-tabs { display: flex; justify-content: center; gap: 8px; margin-bottom: 32px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
        .learn-tab-btn {
          font-family: 'Hind', sans-serif; font-size: 14px; font-weight: 600;
          padding: 8px 20px; border-radius: 50px; border: 1.5px solid var(--border-strong);
          background: transparent; color: var(--ink-mid); cursor: pointer; transition: all 0.2s;
        }
        .learn-tab-btn:hover { background: var(--terracotta-pale); border-color: var(--terracotta); color: var(--terracotta); }
        .learn-tab-btn.active { background: var(--terracotta); border-color: var(--terracotta); color: #fff; box-shadow: 0 4px 12px rgba(181,69,27,0.15); }

        /* Timeline styles for fermentation science */
        .ferment-timeline { display: flex; flex-direction: column; gap: 24px; position: relative; padding-left: 20px; margin: 24px 0; }
        .ferment-timeline::before {
          content: ''; position: absolute; left: 6px; top: 10px; bottom: 10px; width: 2px;
          background: linear-gradient(180deg, var(--terracotta), var(--saffron), var(--green));
        }
        .timeline-step { position: relative; padding-left: 20px; }
        .timeline-bullet {
          position: absolute; left: -19px; top: 4px; width: 12px; height: 12px;
          border-radius: 50%; background: #fff; border: 3.5px solid var(--terracotta);
          z-index: 2; transition: all 0.2s;
        }
        .timeline-step:nth-child(2) .timeline-bullet { border-color: var(--saffron); }
        .timeline-step:nth-child(3) .timeline-bullet { border-color: var(--green); }
        .timeline-step:nth-child(4) .timeline-bullet { border-color: var(--ink); }
        .timeline-content {
          background: #fff; border: 1px solid var(--border); border-radius: var(--radius-sm);
          padding: 16px 20px; box-shadow: var(--shadow);
        }
        .timeline-time { font-size: 11px; font-weight: 700; color: var(--terracotta); letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 2px; }
        .timeline-title { font-family: 'Eczar', serif; font-size: 16px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
        .timeline-desc { font-size: 13px; color: var(--ink-light); line-height: 1.55; }

        /* Science card */
        .info-card { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 26px 24px; box-shadow: var(--shadow); margin-bottom: 20px; }
        .info-card-title { font-family: 'Eczar', serif; font-size: 1.15rem; font-weight: 700; color: var(--ink); margin-bottom: 6px; }
        .info-card-sub { font-size: 13.5px; color: var(--ink-light); line-height: 1.6; margin-bottom: 16px; }

        /* Dosha explorer */
        .dosha-table-container { overflow-x: auto; border: 1px solid var(--border); border-radius: var(--radius-sm); margin-top: 18px; box-shadow: var(--shadow); background: #fff; }
        .dosha-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 13.5px; }
        .dosha-table th { background: var(--cream-dark); color: var(--ink); font-weight: 700; font-family: 'Eczar', serif; padding: 12px 16px; border-bottom: 1.5px solid var(--border-strong); }
        .dosha-table td { padding: 14px 16px; border-bottom: 1px solid var(--border); color: var(--ink-mid); vertical-align: top; }
        .dosha-table tr:last-child td { border-bottom: none; }
        .dosha-table-badge { display: inline-block; padding: 3px 10px; border-radius: 50px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em; }

        /* Microbe cards */
        .microbe-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-top: 18px; }
        .microbe-card {
          background: #fff; border: 1px solid var(--border); border-radius: var(--radius-sm);
          padding: 20px; box-shadow: var(--shadow); transition: all 0.2s; position: relative; overflow: hidden;
        }
        .microbe-card:hover { transform: translateY(-2px); border-color: var(--sand); box-shadow: var(--shadow-md); }
        .microbe-card::after { content: '🦠'; position: absolute; right: 12px; bottom: 8px; font-size: 40px; opacity: 0.05; }
        .microbe-name { font-family: 'Eczar', serif; font-size: 16px; font-weight: 700; color: var(--terracotta); margin-bottom: 4px; font-style: italic; }
        .microbe-source { font-size: 11.5px; color: var(--ink-light); font-weight: 600; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 10px; }
        .microbe-benefit { font-size: 13px; color: var(--ink-mid); line-height: 1.55; }

        @media (max-width: 680px) {
          .learn-tabs { flex-wrap: wrap; }
          .ferment-timeline { padding-left: 10px; }
        }
      `}</style>

      {/* TOP NAV */}
      <nav className="topnav">
        <div className="nav-logo" onClick={() => showPage("home")}>
          <span>🌿</span>Gut<span className="ink">Veda</span>
        </div>
        <div className="nav-links">
          {(["home", "learn", "chat", "profile"] as Page[]).map((p) => (
            <button key={p} className={`nav-link${page === p ? " active" : ""}`} onClick={() => showPage(p)}>
              {p === "home" ? "Home" : p === "learn" ? "Learn Hub" : p === "chat" ? "AI Guide" : "My Profile"}
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
              <div className="scanner-hint">Type it, pick it, or snap it — get its full gut health profile</div>

              {/* ── Scan Tabs ── */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, borderBottom: "1.5px solid var(--border)", paddingBottom: 14 }}>
                {([["type", "✍️ Type"], ["pick", "🍱 Pick a Meal"], ["photo", "📸 Photo Scan"]] as const).map(([id, label]) => (
                  <button key={id}
                    onClick={() => { setScanTab(id); setScanResult(null); setPhotoResult(null); setPhotoPreview(null); }}
                    style={{
                      padding: "7px 16px", borderRadius: 50, border: "1.5px solid",
                      borderColor: scanTab === id ? "var(--terracotta)" : "var(--border-strong)",
                      background: scanTab === id ? "var(--terracotta)" : "transparent",
                      color: scanTab === id ? "#fff" : "var(--ink-mid)",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      fontFamily: "'Hind', sans-serif", transition: "all 0.2s"
                    }}>{label}</button>
                ))}
              </div>

              {/* ── TYPE TAB ── */}
              {scanTab === "type" && (
                <>
                  <div className="meal-input-row">
                    <input
                      className="meal-input"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && scanMeal()}
                      placeholder="e.g. Idli, Curd Rice, Biryani, Rajma Chawal…"
                    />
                    <button className="btn-primary" style={{ padding: "11px 22px", fontSize: 14 }} onClick={() => scanMeal()}>Analyse</button>
                  </div>
                  <div className="quick-chips">
                    {[["🍚 Idli", "Idli"], ["🥛 Dahi", "Dahi"], ["🥤 Lassi", "Lassi"], ["🫙 Kanji", "Kanji"], ["🟡 Dhokla", "Dhokla"], ["🧋 Chaas", "Chaas"]].map(([label, val]) => (
                      <span key={val} className="chip" onClick={() => quickScan(val)}>{label}</span>
                    ))}
                  </div>
                </>
              )}

              {/* ── PICK A MEAL TAB ── */}
              {scanTab === "pick" && (
                <div>
                  <p style={{ fontSize: 13, color: "var(--ink-light)", marginBottom: 14 }}>
                    Tap a meal to instantly see its probiotic rating and gut profile.
                    <span style={{ display: "inline-block", marginLeft: 8, padding: "2px 10px", borderRadius: 50, background: "var(--green-light)", color: "var(--green)", fontSize: 12, fontWeight: 600 }}>🟢 = Probiotic</span>
                  </p>

                  {/* High probiotic */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--green)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>🟢 High Probiotic (8–10)</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[["🍚 Idli Sambar", "idli-sambar"], ["🥛 Dahi", "Dahi"], ["🍚 Curd Rice", "Curd Rice"], ["🧋 Chaas", "Chaas"], ["🥤 Lassi", "Lassi"], ["🫙 Kanji", "Kanji"], ["🍶 Kefir", "Kefir"], ["🥬 Kimchi", "Kimchi"]].map(([label, val]) => (
                        <span key={val} className="chip"
                          style={{ borderColor: "var(--green)", color: "var(--green)", background: "var(--green-light)" }}
                          onClick={() => { setScanTab("type"); quickScan(val); }}>{label}</span>
                      ))}
                    </div>
                  </div>

                  {/* Moderate probiotic */}
                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--saffron)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>🟡 Moderate Probiotic (6–7)</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[["🫔 Dosa", "Dosa"], ["🫓 Uttapam", "Uttapam"], ["🟡 Dhokla", "Dhokla"], ["🍮 Shrikhand", "Shrikhand"], ["🥣 Raita", "Raita"], ["🫔 Masala Dosa", "Masala"], ["🍲 Khichdi", "Khichdi"]].map(([label, val]) => (
                        <span key={val} className="chip"
                          style={{ borderColor: "var(--saffron)", color: "#8B6000", background: "var(--saffron-light)" }}
                          onClick={() => { setScanTab("type"); quickScan(val); }}>{label}</span>
                      ))}
                    </div>
                  </div>

                  {/* Low probiotic */}
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--terracotta)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>🔴 Low Probiotic (1–5)</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[["🍛 Biryani", "Biryani"], ["🫓 Chole Bhature", "Chole Bhature"], ["🍛 Rajma Chawal", "Rajma Chawal"], ["🍛 Dal Rice", "Dal Rice"], ["🍞 Pav Bhaji", "Pav Bhaji"], ["🍽️ Poha", "Poha"], ["🍳 Upma", "Upma"], ["🍗 Butter Chicken", "Butter Chicken"], ["🥟 Samosa", "Samosa"], ["🫓 Roti", "Roti"]].map(([label, val]) => (
                        <span key={val} className="chip"
                          style={{ borderColor: "rgba(181,69,27,0.4)", color: "var(--terracotta)", background: "var(--terracotta-pale)" }}
                          onClick={() => { setScanTab("type"); quickScan(val); }}>{label}</span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PHOTO SCAN TAB ── */}
              {scanTab === "photo" && (
                <div>
                  <p style={{ fontSize: 13, color: "var(--ink-light)", marginBottom: 18 }}>
                    Take a photo of your thali or upload from gallery. Our scanner will analyse its probiotic value and gut health score.
                  </p>

                  {/* Camera / Gallery buttons */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>
                    <button
                      onClick={() => cameraRef.current?.click()}
                      style={{ padding: "20px 16px", borderRadius: 14, border: "2px dashed var(--border-strong)", background: "var(--cream)", cursor: "pointer", fontFamily: "'Hind', sans-serif", textAlign: "center", transition: "all 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--terracotta)"; (e.currentTarget as HTMLElement).style.background = "var(--terracotta-pale)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; (e.currentTarget as HTMLElement).style.background = "var(--cream)"; }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>📷</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", marginBottom: 3 }}>Camera</div>
                      <div style={{ fontSize: 12, color: "var(--ink-light)" }}>Take a live photo now</div>
                    </button>

                    <button
                      onClick={() => galleryRef.current?.click()}
                      style={{ padding: "20px 16px", borderRadius: 14, border: "2px dashed var(--border-strong)", background: "var(--cream)", cursor: "pointer", fontFamily: "'Hind', sans-serif", textAlign: "center", transition: "all 0.2s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--saffron)"; (e.currentTarget as HTMLElement).style.background = "var(--saffron-light)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-strong)"; (e.currentTarget as HTMLElement).style.background = "var(--cream)"; }}>
                      <div style={{ fontSize: 28, marginBottom: 6 }}>🖼️</div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--ink)", marginBottom: 3 }}>Gallery</div>
                      <div style={{ fontSize: 12, color: "var(--ink-light)" }}>Upload from your photos</div>
                    </button>
                  </div>

                  {/* Hidden file inputs */}
                  <input ref={cameraRef} type="file" accept="image/*" capture="environment" style={{ display: "none" }}
                    onChange={e => handlePhoto(e.target.files?.[0])} key={`cam-${photoResult}`} />
                  <input ref={galleryRef} type="file" accept="image/*" style={{ display: "none" }}
                    onChange={e => handlePhoto(e.target.files?.[0])} key={`gal-${photoResult}`} />

                  {/* Preview */}
                  {photoPreview && (
                    <div style={{ marginBottom: 16, borderRadius: 12, overflow: "hidden", border: "1.5px solid var(--border-strong)" }}>
                      <img src={photoPreview} alt="Your meal" style={{ width: "100%", maxHeight: 220, objectFit: "cover", display: "block" }} />
                    </div>
                  )}

                  {/* Analysing state */}
                  {photoAnalysing && (
                    <div style={{ textAlign: "center", padding: "24px 0" }}>
                      <div style={{ fontSize: 28, marginBottom: 10 }}>🔬</div>
                      <div style={{ fontFamily: "'Eczar', serif", fontSize: "1rem", fontWeight: 600, color: "var(--ink)", marginBottom: 6 }}>Analysing your meal…</div>
                      <div style={{ fontSize: 13, color: "var(--ink-light)", marginBottom: 14 }}>Checking probiotic content, bacteria strains & gut score</div>
                      <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
                        {[0, 200, 400].map(d => (
                          <div key={d} style={{ width: 8, height: 8, background: "var(--terracotta)", borderRadius: "50%", animation: `bounce 1.2s infinite ${d}ms` }} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Photo result */}
                  {photoResult && !photoAnalysing && (
                    <div className="result-card" style={{ whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.7, color: "var(--ink)" }}>
                      {photoResult}
                    </div>
                  )}

                  {/* API note */}
                  {!photoPreview && (
                    <div style={{ background: "var(--saffron-light)", border: "1px solid rgba(232,150,12,0.25)", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "var(--ink-mid)", lineHeight: 1.55, marginTop: 8 }}>
                      <strong>💡 How it works:</strong> Upload a photo of your meal. Currently shows a smart demo analysis. Connect a Gemini API key in <code>.env.local</code> for real AI-powered food recognition.
                    </div>
                  )}
                </div>
              )}

              {/* Result (for type tab) */}
              {scanTab === "type" && scanResult && (
                <div className="result-card">
                  {scanResult.meal ? (
                    <>
                      <div className="result-meal-name">{scanResult.meal.emoji} {scanResult.meal.name}</div>
                      <div className="result-score-row">
                        <div className="score-circle" style={{ borderColor: scanResult.meal.score >= 8 ? "var(--green)" : scanResult.meal.score >= 6 ? "var(--saffron)" : "var(--terracotta)" }}>
                          <div className="score-num" style={{ color: scanResult.meal.score >= 8 ? "var(--green)" : scanResult.meal.score >= 6 ? "var(--saffron)" : "var(--terracotta)" }}>{scanResult.meal.score}</div>
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
                      <div className="result-meal-name">🤔 {scanResult.query || "Unknown meal"}</div>
                      <div className="score-desc" style={{ marginBottom: 12 }}>We don't have this meal in our database yet. Try one of these:</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {["Idli", "Dahi", "Lassi", "Kanji", "Dhokla", "Chaas", "Curd Rice", "Biryani", "Khichdi"].map(s => (
                          <span key={s} className="chip" onClick={() => quickScan(s)}>{s}</span>
                        ))}
                      </div>
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
                { icon: "📚", bg: "#F0EAF8", name: "Learn Hub", desc: "Explore fermentation science, the three doshas, and gut bacteria in Indian cuisine.", page: "learn" as Page },
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
            <h3 style={{ fontFamily: "'Eczar', serif", fontSize: "1.3rem", fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Know Your Probiotics 🦠</h3>
            <p style={{ color: "var(--ink-mid)", fontSize: 14, marginBottom: 20 }}>Tap any food to learn its bacteria, benefits, and how to include it in your meals</p>
            <div className="probiotic-pills">
              {([
                { label: "🥛 Dahi", name: "Dahi", microbe: "Lactobacillus bulgaricus + Streptococcus thermophilus", helps: "Bloating, IBS, Low Immunity, Skin", howto: "1 cup at lunch, room temperature. Never cold from fridge.", score: 9 },
                { label: "🍚 Idli", name: "Idli", microbe: "Lactobacillus mesenteroides + Leuconostoc sp.", helps: "Constipation, Bloating, Low energy", howto: "Eat freshly made. The sour smell means fermentation worked!", score: 8 },
                { label: "🫙 Kanji", name: "Kanji", microbe: "Wild Lactobacillus + Lactic acid bacteria", helps: "Immunity, Detox, Kapha imbalance", howto: "Drink 1 glass before meals. Ferment black carrots + mustard seeds for 2-3 days.", score: 9 },
                { label: "🥤 Lassi", name: "Lassi", microbe: "Lactobacillus bulgaricus + Lactobacillus acidophilus", helps: "Acidity, Bloating, IBD, Pitta", howto: "Plain salted lassi is best. Avoid sweet versions for gut benefits.", score: 8 },
                { label: "🟡 Dhokla", name: "Dhokla", microbe: "Pediococcus acidilactici + Lactic acid bacteria", helps: "Bloating, Protein absorption, Energy", howto: "Homemade overnight fermented batter is far superior to instant mix.", score: 7 },
                { label: "🧋 Chaas", name: "Chaas", microbe: "Lactobacillus acidophilus + Lactic acid bacteria", helps: "Acidity, Bloating, IBS, Pitta", howto: "Add jeera, ginger, curry leaves. Drink after lunch — Ayurveda's digestive tonic.", score: 9 },
                { label: "🫓 Uttapam", name: "Uttapam", microbe: "Leuconostoc mesenteroides + Lactobacillus sp.", helps: "Digestion, Energy, Gut flora", howto: "Same fermented batter as dosa. Add vegetable toppings for prebiotic fibre.", score: 7 },
                { label: "🍶 Ambali", name: "Ambali", microbe: "Lactobacillus fermentum + Lactobacillus plantarum", helps: "Iron absorption, Calcium, Gut health", howto: "Fermented overnight ragi porridge. Eat with onion and green chilli.", score: 8 },
                { label: "🫔 Dosa", name: "Dosa", microbe: "Leuconostoc mesenteroides + Lactobacillus delbrueckii", helps: "Bloating, Constipation, B-vitamin absorption", howto: "Eat fresh off the griddle. Stored dosa loses probiotic value.", score: 7 },
                { label: "🍮 Shrikhand", name: "Shrikhand", microbe: "Lactobacillus bulgaricus + Streptococcus thermophilus", helps: "Calcium, Immunity, Digestion", howto: "Made from hung curd — rich in probiotics. Enjoy in moderation due to sugar content.", score: 7 },
              ] as const).map((p) => {
                const isOpen = openProbiotic === p.name;
                return (
                  <div key={p.name} style={{ display: "inline-block" }}>
                    <span className="pro-pill"
                      onClick={() => setOpenProbiotic(isOpen ? null : p.name)}
                      style={{ background: isOpen ? "var(--terracotta)" : "#fff", color: isOpen ? "#fff" : "var(--ink-mid)", borderColor: isOpen ? "var(--terracotta)" : "rgba(232,150,12,0.3)" }}>
                      {p.label} {isOpen ? "▲" : "▼"}
                    </span>
                    {isOpen && (
                      <div style={{ background: "#fff", border: "1px solid var(--border-strong)", borderRadius: 14, padding: "18px 20px", marginTop: 8, marginBottom: 6, maxWidth: 340, textAlign: "left", boxShadow: "0 4px 20px rgba(90,40,10,0.12)", animation: "fadeUp 0.25s ease" }}>
                        <div style={{ fontFamily: "'Eczar', serif", fontSize: "1.05rem", fontWeight: 700, color: "var(--terracotta)", marginBottom: 8 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "var(--ink-light)", marginBottom: 10, fontStyle: "italic" }}>🦠 {p.microbe}</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: "50%", border: `3px solid ${p.score >= 8 ? "var(--green)" : "var(--saffron)"}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                            <span style={{ fontFamily: "'Eczar', serif", fontSize: 16, fontWeight: 800, color: p.score >= 8 ? "var(--green)" : "var(--saffron)", lineHeight: 1 }}>{p.score}</span>
                            <span style={{ fontSize: 9, color: "var(--ink-light)" }}>/10</span>
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--ink)", marginBottom: 2 }}>Helps with:</div>
                            <div style={{ fontSize: 12, color: "var(--ink-mid)" }}>{p.helps}</div>
                          </div>
                        </div>
                        <div style={{ background: "var(--cream-dark)", borderRadius: 8, padding: "10px 12px", fontSize: 12.5, color: "var(--ink-mid)", lineHeight: 1.6 }}>
                          <strong>How to eat:</strong> {p.howto}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════ LEARN HUB ═══════════════════ */}
      {page === "learn" && (
        <div className="learn-wrap fade-up">
          <div className="learn-header">
            <div className="badge">📚 GutVeda Knowledge Base</div>
            <h2>Gut & Fermentation Science</h2>
            <p>Bridging thousands of years of Ayurvedic insight with modern microbiome science</p>
            <div style={{ marginTop: 14 }}>
              <DividerMotif />
            </div>
          </div>

          {/* Tab Selection */}
          <div className="learn-tabs">
            <button className={`learn-tab-btn${learnTab === "science" ? " active" : ""}`} onClick={() => setLearnTab("science")}>
              🔬 Fermentation Science
            </button>
            <button className={`learn-tab-btn${learnTab === "dosha" ? " active" : ""}`} onClick={() => setLearnTab("dosha")}>
              🌿 Dosha & Digestion
            </button>
            <button className={`learn-tab-btn${learnTab === "microbes" ? " active" : ""}`} onClick={() => setLearnTab("microbes")}>
              🦠 Gut Microbiome Strains
            </button>
          </div>

          {/* TAB 1: FERMENTATION SCIENCE */}
          {learnTab === "science" && (
            <div className="fade-up">
              <div className="info-card">
                <div className="info-card-title">Native Wild Fermentation vs. Industrial Processing</div>
                <div className="info-card-sub">
                  Why traditional Indian probiotic foods are far superior to store-bought pills and pasteurized yogurts.
                </div>
                <p style={{ fontSize: 13.5, color: "var(--ink-mid)", lineHeight: 1.65, marginBottom: 12 }}>
                  Unlike modern industrial fermentation which relies on single-strain laboratory cultures and artificial starters, Indian cooking utilizes <strong>spontaneous wild fermentation</strong>. When preparing idli batter or setting dahi at home, the fermentation is driven by the microbial flora naturally present on the grains, leaves, and in your local air.
                </p>
                <p style={{ fontSize: 13.5, color: "var(--ink-mid)", lineHeight: 1.65 }}>
                  This creates a highly resilient, multi-species consortium of beneficial bacteria and wild yeasts that work in symbiosis. Furthermore, traditional foods are never pasteurized after fermentation, ensuring billions of live, active microbes reach your gut, complete with their digestive enzymes and protective postbiotics.
                </p>
              </div>

              <h3 style={{ fontFamily: "'Eczar', serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginTop: 24, marginBottom: 4 }}>
                The 4 Stages of Wild Batter Fermentation 🧬
              </h3>
              <p style={{ fontSize: 13, color: "var(--ink-light)" }}>The microscopic timeline inside a simple bowl of fermenting Idli/Dosa batter</p>

              <div className="ferment-timeline">
                <div className="timeline-step">
                  <div className="timeline-bullet" />
                  <div className="timeline-content">
                    <div className="timeline-time">Hour 0 – 2: Incubation & Microbial Awakening</div>
                    <div className="timeline-title">Awakening the Native Flora</div>
                    <div className="timeline-desc">
                      Grains (rice & urad dal) are soaked and ground. Water activates enzymes and wild microorganisms residing on the grain husks. The mixture enters a warm, dark space to trigger metabolic pathways.
                    </div>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-bullet" />
                  <div className="timeline-content">
                    <div className="timeline-time">Hour 2 – 8: Acidification Phase</div>
                    <div className="timeline-title">Leuconostoc Mesenteroides Takes Lead</div>
                    <div className="timeline-desc">
                      The lactic acid bacteria <em>Leuconostoc mesenteroides</em> multiplies rapidly. It consumes complex carbohydrates and produces lactic acid, dropping the pH to around 4.5. This natural acidity keeps the batter safe, suppressing any unwanted or harmful pathogens.
                    </div>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-bullet" />
                  <div className="timeline-content">
                    <div className="timeline-time">Hour 8 – 14: Aeration & Rising Phase</div>
                    <div className="timeline-title">Yeast Co-activation & Sponginess</div>
                    <div className="timeline-desc">
                      As the acidity builds, native wild yeasts (like <em>Saccharomyces</em>) thrive and produce carbon dioxide gas. This gas gets trapped in the batter's protein network, causing it to double in size. This natural aeration is what makes idlis incredibly soft, airy, and light.
                    </div>
                  </div>
                </div>

                <div className="timeline-step">
                  <div className="timeline-bullet" />
                  <div className="timeline-content">
                    <div className="timeline-time">Hour 14+: Nutrient Synthesis</div>
                    <div className="timeline-title">Mineral Release & Vitamin B12 Synthesis</div>
                    <div className="timeline-desc">
                      Microbial enzymes break down phytic acid (which normally locks up iron, zinc, and calcium in grains), unlocking these essential minerals for easy absorption. At the same time, the bacteria synthesize rich B-complex vitamins, turning a simple batter into a bio-available prebiotic-probiotic powerhouse.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOSHA & DIGESTION */}
          {learnTab === "dosha" && (
            <div className="fade-up">
              <div className="info-card">
                <div className="info-card-title">Agni: The Ayurvedic Foundation of Gut Health</div>
                <div className="info-card-sub">
                  How your unique mind-body constitution shapes your digestive fire and determines your ideal probiotics.
                </div>
                <p style={{ fontSize: 13.5, color: "var(--ink-mid)", lineHeight: 1.65, marginBottom: 12 }}>
                  In Ayurveda, digestion is governed by <strong>Agni</strong> (the sacred internal fire). Probiotics are not a one-size-fits-all cure. A probiotic food that heals one person might cause acidity, heavy mucus, or gas in another, depending entirely on which dosha is dominant in their digestive system.
                </p>
                <p style={{ fontSize: 13.5, color: "var(--ink-mid)", lineHeight: 1.65 }}>
                  By understanding your Agni type, you can choose foods that actively stoke your digestive fire rather than smothering it. Read through the alignment matrix below to discover which traditional probiotics will harmonize perfectly with your type.
                </p>
              </div>

              <h3 style={{ fontFamily: "'Eczar', serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginTop: 24, marginBottom: 8 }}>
                Ayurvedic Digestive Alignment Matrix 🌿
              </h3>

              <div className="dosha-table-container">
                <table className="dosha-table">
                  <thead>
                    <tr>
                      <th style={{ width: "20%" }}>Dosha & Gut Type</th>
                      <th style={{ width: "25%" }}>Agni (Digestive Fire)</th>
                      <th style={{ width: "30%" }}>Gut Characteristics</th>
                      <th style={{ width: "25%" }}>Best Probiotics</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <span className="dosha-table-badge dosha-vata">🌬️ Vata</span>
                      </td>
                      <td>
                        <strong>Vishamagni</strong>
                        <div style={{ fontSize: 11, color: "var(--ink-light)" }}>Erratic & Unstable</div>
                      </td>
                      <td>Prone to bloating, gas, dryness, erratic appetite, and chronic constipation. Cold foods aggravate this.</td>
                      <td>
                        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                          • Room-temp spiced buttermilk (Chaas)<br />
                          • Curd rice with warm ghee<br />
                          • Overnight fermented ragi Ambali
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="dosha-table-badge dosha-pitta">🔥 Pitta</span>
                      </td>
                      <td>
                        <strong>Tikshnagni</strong>
                        <div style={{ fontSize: 11, color: "var(--ink-light)" }}>Sharp & Intense</div>
                      </td>
                      <td>Hyperactive digestion, high heat, prone to acid reflux, heartburn, inflammatory bowel, and loose stools.</td>
                      <td>
                        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                          • Cooling salted/sweet Lassi<br />
                          • Fresh, non-sour Dahi with mint<br />
                          • Sweet Shrikhand in moderation<br />
                          • Cooling cucumber Raita
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <span className="dosha-table-badge dosha-kapha">🌊 Kapha</span>
                      </td>
                      <td>
                        <strong>Mandagni</strong>
                        <div style={{ fontSize: 11, color: "var(--ink-light)" }}>Slow & Sluggish</div>
                      </td>
                      <td>Slow, heavy digestion, sluggish metabolism, feelings of lethargy after eating, and excess mucus.</td>
                      <td>
                        <div style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                          • Spicy North Indian Kanji<br />
                          • Diluted Chaas with black pepper, ginger, and cumin<br />
                          <span style={{ color: "var(--terracotta)", fontWeight: 500 }}>* Avoid heavy, sweet curds</span>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: GUT MICROBIOME */}
          {learnTab === "microbes" && (
            <div className="fade-up">
              <div className="info-card">
                <div className="info-card-title">Traditional Strains and the Indian Gut</div>
                <div className="info-card-sub">
                  Exploring the specific beneficial bacterial strains that make traditional Indian cooking a modern probiotic powerhouse.
                </div>
                <p style={{ fontSize: 13.5, color: "var(--ink-mid)", lineHeight: 1.65 }}>
                  The human gut microbiome thrives on variety. Traditional Indian fermented foods are exceptionally rich in lactic acid bacteria (LAB) and native wild yeasts. These strains work in harmony to colonize your digestive tract, synthesize essential vitamins, regulate bowel habits, and support the gut-brain axis.
                </p>
              </div>

              <h3 style={{ fontFamily: "'Eczar', serif", fontSize: "1.25rem", fontWeight: 700, color: "var(--ink)", marginTop: 24, marginBottom: 4 }}>
                Beneficial Strains in Indian Cuisine 🦠
              </h3>
              <p style={{ fontSize: 13, color: "var(--ink-light)", marginBottom: 12 }}>Detailed biological view of the microscopic helpers inside your meals</p>

              <div className="microbe-grid">
                <div className="microbe-card">
                  <div className="microbe-name">Leuconostoc mesenteroides</div>
                  <div className="microbe-source">🥣 Idli & Dosa Batter</div>
                  <div className="microbe-benefit">
                    The crucial initiator strain of wild batter fermentation. It consumes simple sugars and generates key carbon dioxide bubbles and organic acids. It synthesizes dextran and B-complex vitamins, helping to outcompete and suppress pathogenic bacteria.
                  </div>
                </div>

                <div className="microbe-card">
                  <div className="microbe-name">Lactiplantibacillus plantarum</div>
                  <div className="microbe-source">🫙 Kanji & Wild Pickles</div>
                  <div className="microbe-benefit">
                    An exceptionally robust, highly acid-tolerant strain that successfully survives the harsh stomach acid to colonize the large intestine. Powerfully anti-inflammatory, it helps repair the gut lining and significantly reduces chronic bloating and gas.
                  </div>
                </div>

                <div className="microbe-card">
                  <div className="microbe-name">Lactobacillus acidophilus</div>
                  <div className="microbe-source">🥛 Homemade Dahi & Chaas</div>
                  <div className="microbe-benefit">
                    One of the most researched and potent gut colonizers. It breaks down lactose into digestible lactic acid, supports general immunity by reinforcing mucosal layers, and produces natural antimicrobial factors that keep digestive infections at bay.
                  </div>
                </div>

                <div className="microbe-card">
                  <div className="microbe-name">Lactobacillus fermentum</div>
                  <div className="microbe-source">🍶 Fermented Ragi Ambali</div>
                  <div className="microbe-benefit">
                    A strain that excels at degrading phytic acid (which locks up iron, calcium, and zinc in grains), enabling your body to absorb these vital minerals easily. It also stimulates protective immune response pathways in the gut lining.
                  </div>
                </div>

                <div className="microbe-card">
                  <div className="microbe-name">Streptococcus thermophilus</div>
                  <div className="microbe-source">🍮 Fresh Curd & Shrikhand</div>
                  <div className="microbe-benefit">
                    Works in close, highly cooperative symbiosis with L. bulgaricus to set curd. It excels at breaking down milk sugars, providing quick digestive relief for those with minor lactose intolerances, and helping soothe acute intestinal irritation.
                  </div>
                </div>
              </div>
            </div>
          )}
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