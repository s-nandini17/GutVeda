// ── Probiotic bacteria strain database ───────────────────────────────────────
export const PROBIOTIC_DB = [
  { probiotic: "Lactobacillus acidophilus", type: "bacteria", conditions: ["Bloating", "Irritable Bowel Syndrome", "Improved resistance to E. coli", "Respiratory Infections"], foodSources: ["Curd", "Buttermilk", "Yogurt", "Fermented milk", "Kefir"] },
  { probiotic: "Bifidobacterium longum", type: "bacteria", conditions: ["Bloating", "SCFA production", "Colorectal cancer patients", "Stress-related disorders"], foodSources: ["Probiotic curd", "Fermented dairy", "Probiotic supplements"] },
  { probiotic: "Streptococcus thermophilus", type: "bacteria", conditions: ["Bloating", "Respiratory Infections"], foodSources: ["Yogurt", "Curd"] },
  { probiotic: "Saccharomyces boulardii", type: "yeast", conditions: ["Bloating", "IBS - D"], foodSources: ["Probiotic supplements", "Lychee peel", "Mangosteen peel"] },
  { probiotic: "Bacillus coagulans", type: "bacteria", conditions: ["Bloating"], foodSources: ["Fermented foods", "Supplements"] },
  { probiotic: "Bifidobacterium lactis", type: "bacteria", conditions: ["IBS - M", "Respiratory Infections"], foodSources: ["Fermented milk"] },
  { probiotic: "Lactiplantibacillus plantarum", type: "bacteria", conditions: ["IBS - C", "Anti-inflammatory effects", "Type 2 Diabetes", "Respiratory Infections"], foodSources: ["Kimchi", "Pickled cucumbers", "Fermented vegetables", "Sauerkraut"] },
  { probiotic: "Lactobacillus kefiri", type: "yeast+bacteria", conditions: ["Type 2 Diabetes"], foodSources: ["Kefir"] },
  { probiotic: "Lactic acid & Acetic acid bacteria", type: "bacteria", conditions: ["Type 2 Diabetes"], foodSources: ["Buttermilk", "Kombucha"] },
  { probiotic: "Lactobacillus rhamnosus GG", type: "bacteria", conditions: ["Respiratory Infections"], foodSources: ["Yogurt", "Kefir"] },
];

export const FOOD_SOURCE_MAP = [
  { id: "curd", name: "Curd / Dahi", localName: "दही", icon: "🥛", availability: "Daily staple", bestTime: "Lunch or after meals", bacteria: ["Lactobacillus acidophilus", "Streptococcus thermophilus", "Bifidobacterium longum"], bacteriaTypes: ["bacteria", "bacteria", "bacteria"], conditions: ["Bloating", "Irritable Bowel Syndrome", "Respiratory Infections", "Stress-related disorders"], tip: "Home-set curd fermented for 6-8 hours has 10x more live cultures than packaged yogurt.", lactoseSafe: false, color: "#EBF5EC" },
  { id: "buttermilk", name: "Buttermilk / Chaas", localName: "छाछ", icon: "🥤", availability: "Daily staple", bestTime: "Post-lunch", bacteria: ["Lactobacillus acidophilus", "Lactic acid bacteria"], bacteriaTypes: ["bacteria", "bacteria"], conditions: ["Bloating", "Type 2 Diabetes", "IBS - D"], tip: "Add roasted jeera + rock salt. Spiced chaas dramatically improves its digestive effect.", lactoseSafe: true, color: "#EAF4FB" },
  { id: "kefir", name: "Kefir", localName: "केफ़िर", icon: "🍶", availability: "Specialty stores", bestTime: "Morning, empty stomach", bacteria: ["Lactobacillus kefiri", "Lactobacillus acidophilus", "Lactobacillus rhamnosus GG"], bacteriaTypes: ["yeast+bacteria", "bacteria", "bacteria"], conditions: ["Type 2 Diabetes", "Respiratory Infections", "Bloating"], tip: "30+ strains - the richest probiotic drink. Goat milk kefir is gentler for sensitive guts.", lactoseSafe: false, color: "#FFF4EA" },
  { id: "idlidosa", name: "Idli / Dosa Batter", localName: "इडली / डोसा", icon: "🫓", availability: "Home-fermented", bestTime: "Breakfast", bacteria: ["Lactiplantibacillus plantarum", "Leuconostoc mesenteroides"], bacteriaTypes: ["bacteria", "bacteria"], conditions: ["IBS - C", "Anti-inflammatory effects", "Bloating"], tip: "8-12 hour fermentation at room temp activates the most culture activity.", lactoseSafe: true, color: "#F4EDF9" },
  { id: "kimchi", name: "Kimchi", localName: "किमची", icon: "🥬", availability: "Specialty stores / homemade", bestTime: "Side dish any meal", bacteria: ["Lactiplantibacillus plantarum"], bacteriaTypes: ["bacteria"], conditions: ["IBS - C", "Anti-inflammatory effects", "Type 2 Diabetes"], tip: "Anti-inflammatory powerhouse. Available on Amazon India or easily homemade.", lactoseSafe: true, color: "#FDEEF3" },
  { id: "kombucha", name: "Kombucha", localName: "कोम्बुचा", icon: "🍵", availability: "Health stores", bestTime: "Afternoon, between meals", bacteria: ["Lactic acid bacteria", "Acetic acid bacteria", "Saccharomyces"], bacteriaTypes: ["bacteria", "bacteria", "yeast"], conditions: ["Type 2 Diabetes", "Bloating"], tip: "Fermented tea - start with 100ml/day. Avoid if yeast-sensitive.", lactoseSafe: true, color: "#EAFAF1" },
  { id: "supplements", name: "Probiotic Supplements", localName: "प्रोबायोटिक सप्लीमेंट", icon: "💊", availability: "Pharmacy / Clinician", bestTime: "As prescribed", bacteria: ["Saccharomyces boulardii", "Bifidobacterium lactis", "Lactobacillus rhamnosus GG"], bacteriaTypes: ["yeast", "bacteria", "bacteria"], conditions: ["IBS - D", "IBS - M", "Respiratory Infections", "Colorectal cancer patients"], tip: "Use under clinical guidance. Multi-strain, high-CFU formulations offer broader benefits.", lactoseSafe: true, color: "#E6F6FB" },
];

export const INDIAN_FOOD_CATALOG = [
  { id: "poha", name: "Poha", tags: ["light", "breakfast", "carb"], probiotic: false },
  { id: "idli-sambar", name: "Idli Sambar", tags: ["fermented", "light", "south-indian"], probiotic: true },
  { id: "dosa", name: "Dosa", tags: ["fermented", "south-indian", "carb"], probiotic: true },
  { id: "curd-rice", name: "Curd Rice", tags: ["cooling", "probiotic", "rice"], probiotic: true },
  { id: "rajma-chawal", name: "Rajma Chawal", tags: ["heavy", "fiber", "legumes"], probiotic: false },
  { id: "chole-bhature", name: "Chole Bhature", tags: ["heavy", "fried", "spicy"], probiotic: false },
  { id: "dal-rice", name: "Dal Rice", tags: ["balanced", "comfort", "protein"], probiotic: false },
  { id: "paneer-masala", name: "Paneer Masala", tags: ["rich", "dairy", "north-indian"], probiotic: false },
  { id: "aloo-paratha", name: "Aloo Paratha", tags: ["heavy", "breakfast", "carb"], probiotic: false },
  { id: "khichdi", name: "Khichdi", tags: ["light", "gentle", "comfort"], probiotic: false },
  { id: "upma", name: "Upma", tags: ["light", "breakfast"], probiotic: false },
  { id: "biryani", name: "Biryani", tags: ["heavy", "spicy", "rice"], probiotic: false },
  { id: "sambar-rice", name: "Sambar Rice", tags: ["balanced", "lentils"], probiotic: false },
  { id: "roti-sabzi", name: "Roti Sabzi", tags: ["balanced", "daily-meal"], probiotic: false },
  { id: "dahi", name: "Curd / Dahi", tags: ["fermented", "probiotic"], probiotic: true },
  { id: "chaas", name: "Buttermilk / Chaas", tags: ["fermented", "cooling"], probiotic: true },
  { id: "kefir", name: "Kefir", tags: ["fermented", "probiotic"], probiotic: true },
  { id: "idli", name: "Idli", tags: ["fermented", "light"], probiotic: true },
];

export const CONDITIONS = [
  "Bloating", "Irritable Bowel Syndrome", "IBS - M", "IBS - D", "IBS - C",
  "Type 2 Diabetes", "Respiratory Infections", "Stress-related disorders",
  "Anti-inflammatory effects", "SCFA production",
  "Improved resistance to E. coli", "Colorectal cancer patients",
];

export const GOALS = [
  "Reduce bloating", "Improve digestion", "Support blood sugar",
  "Reduce gut discomfort", "Add probiotic foods", "Build a lighter dinner plan",
];

export const MOODS = ["😊 Great", "😐 Okay", "😟 Bloated", "😴 Tired", "🤢 Nauseous", "🔥 Acidity"];

export const DEFAULT_PROFILE = {
  name: "", age: "", sex: "", spice: "medium",
  vegetarian: true, lactose: false,
  conditions: [] as string[],
  goals: [] as string[],
  medications: "", notes: "",
};

export const DEMO_LOGS = [
  { id: "d1", date: new Date(Date.now() - 86400000).toISOString().slice(0, 10), time: "12:30 PM", foods: ["dal-rice", "dahi"], custom: [], notes: "Felt good after lunch", mood: "😊 Great" },
  { id: "d2", date: new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10), time: "1:00 PM", foods: ["chole-bhature"], custom: [], notes: "Too heavy, slight bloating", mood: "😟 Bloated" },
  { id: "d3", date: new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10), time: "8:30 AM", foods: ["idli-sambar", "chaas"], custom: [], notes: "Perfect fermented breakfast", mood: "😊 Great" },
];

export const todayStr = () => new Date().toISOString().slice(0, 10);

export function getFoodRecs(conditions: string[]) {
  return FOOD_SOURCE_MAP
    .map(f => ({ ...f, matched: f.conditions.filter(c => conditions.includes(c)) }))
    .filter(f => f.matched.length > 0)
    .sort((a, b) => b.matched.length - a.matched.length);
}

export function computeScore(
  profile: typeof DEFAULT_PROFILE,
  logs: { id: string; date: string; foods: string[]; custom: string[]; notes: string; mood: string; time: string }[]
) {
  const last7 = logs.filter(l => (Date.now() - new Date(l.date).getTime()) <= 7 * 86400000);
  let gut = 3;
  ["Colorectal cancer patients", "IBS - D", "IBS - C", "IBS - M", "Irritable Bowel Syndrome"]
    .forEach(s => { if (profile.conditions.includes(s)) gut -= 0.4; });
  gut = Math.max(0.5, Math.min(3, gut));
  const probFoods = last7.flatMap(l => l.foods).filter(f => INDIAN_FOOD_CATALOG.find(fc => fc.id === f)?.probiotic).length;
  const probiotic = Math.min(3, probFoods * 0.5);
  const all = last7.flatMap(l => l.foods);
  const light = all.filter(f => { const fc = INDIAN_FOOD_CATALOG.find(c => c.id === f); return fc?.tags.includes("light") || fc?.tags.includes("gentle") || fc?.tags.includes("balanced"); }).length;
  const heavy = all.filter(f => { const fc = INDIAN_FOOD_CATALOG.find(c => c.id === f); return fc?.tags.includes("heavy") || fc?.tags.includes("fried"); }).length;
  const balance = all.length === 0 ? 1 : Math.min(2, 2 * (light / Math.max(1, light + heavy)));
  const consistency = Math.min(2, new Set(last7.map(l => l.date)).size * (2 / 7) * 2);
  return {
    total: Math.min(10, parseFloat((gut + probiotic + balance + consistency).toFixed(1))),
    gut: parseFloat(gut.toFixed(1)),
    probiotic: parseFloat(probiotic.toFixed(1)),
    balance: parseFloat(balance.toFixed(1)),
    consistency: parseFloat(consistency.toFixed(1)),
  };
}

export function buildDayPlan(profile: typeof DEFAULT_PROFILE) {
  const c = profile.conditions, n = profile.name || "you";
  const hasIBS = c.some(x => ["IBS - C", "IBS - D", "IBS - M", "Irritable Bowel Syndrome"].includes(x));
  const hasDiabetes = c.includes("Type 2 Diabetes");
  const hasResp = c.includes("Respiratory Infections");
  const hasStress = c.includes("Stress-related disorders");
  const hasInflam = c.includes("Anti-inflammatory effects");
  return [
    { meal: "🌅 Early Morning (7–8 AM)", items: [hasResp ? "Warm water with ginger + turmeric" : "Warm water with lemon + honey", hasDiabetes ? "1 tsp fenugreek seeds soaked overnight" : "Seasonal fruit or dry fruits (5 almonds + 2 walnuts)"], note: hasStress ? `Calm start regulates ${n}'s gut-brain axis all day.` : `Warm water reactivates ${n}'s digestive enzymes.` },
    { meal: "🍳 Breakfast (8–9 AM)", items: hasIBS ? ["Idli (2-3) with light sambar", "Plain unsweetened curd", "Fennel or ginger herbal tea"] : hasDiabetes ? ["Upma or vegetable dosa (controlled portion)", "Sprouts chaat", "Unsweetened buttermilk"] : ["Poha or idli-sambar", "Curd on side", "1 glass chaas or lassi"], note: `Fermented breakfast = probiotic breakfast. ${n}'s best gut window of the day.` },
    { meal: "☀️ Lunch (12:30–1:30 PM)", items: hasDiabetes ? ["2 rotis + dal + sabzi", "Small curd bowl (no sugar)", "Salad with cucumber + raw onion"] : hasIBS ? ["Khichdi or dal rice (moderate)", "Curd or raita", "Lightly cooked sabzi (no raw veg)"] : ["Dal rice or roti sabzi", "Curd or buttermilk", "Seasonal sabzi"], note: `Largest meal at lunch — ${n}'s digestive fire (agni) is strongest midday.` },
    { meal: "🍵 Evening Snack (4–5 PM)", items: hasResp ? ["Green tea with tulsi", "Handful of almonds + walnuts", "Amla or orange (Vitamin C)"] : hasDiabetes ? ["Plain yogurt or kefir", "Handful of seeds (flax, chia)", "No refined sugar"] : hasStress ? ["Ashwagandha milk or chamomile tea", "Banana or 2 dates", "Unsweetened probiotic curd"] : ["Buttermilk with jeera", "Roasted chana or makhana", "Seasonal fruit"], note: hasInflam ? "Anti-inflammatory peak window — turmeric + black pepper absorption highest here." : "Light snacking prevents overeating at dinner." },
    { meal: "🌙 Dinner (7–8 PM)", items: hasIBS ? ["Khichdi or soft dal rice", "Steamed vegetables", "Small curd if tolerated"] : hasDiabetes ? ["2 rotis + dal + non-starchy sabzi", "No rice after 7 PM", "Warm turmeric milk at bedtime"] : ["Roti sabzi or sambar rice", "Curd rice (soothing for gut)", "Moderate portion"], note: `Light dinner = quality sleep = gut repair. ${n}'s gut heals most during deep sleep.` },
  ];
}

export async function loadSaved<T>(key: string, fallback: T): Promise<T> {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) as T : fallback; }
  catch { return fallback; }
}

export async function saveTo(key: string, value: unknown): Promise<void> {
  try { localStorage.setItem(key, JSON.stringify(value)); }
  catch (e) { console.error(e); }
}
