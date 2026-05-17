"use client";
import { useState, useEffect, useRef, useCallback } from "react";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const PROBIOTIC_CARDS = [
  { id: 1, emoji: "🥛", name: "Curd / Dahi", hindi: "दही", microbe: "Lactobacillus acidophilus", type: "bacteria", color: "#F5EFE6", border: "#D4C4AE", helps: ["Bloating", "IBS", "Immunity"], score: 9, tip: "Home-set curd has 10× more live cultures than packaged!" },
  { id: 2, emoji: "🥤", name: "Buttermilk / Chaas", hindi: "छाछ", microbe: "Lactobacillus bulgaricus", type: "bacteria", color: "#FADDE0", border: "#E56B7A", helps: ["Acidity", "Bloating", "Digestion"], score: 8, tip: "Spiced chaas with jeera is nature's digestive!" },
  { id: 3, emoji: "🫓", name: "Idli / Dosa", hindi: "इडली-डोसा", microbe: "Leuconostoc mesenteroides", type: "bacteria", color: "#DCE1DF", border: "#5B7065", helps: ["Constipation", "Bloating", "Energy"], score: 8, tip: "8-12 hr fermentation = maximum probiotic magic!" },
  { id: 4, emoji: "🍶", name: "Kefir", hindi: "केफ़िर", microbe: "Lactobacillus kefiri", type: "yeast+bacteria", color: "#F5EFE6", border: "#D4C4AE", helps: ["IBS", "Immunity", "Diabetes"], score: 10, tip: "30+ strains! The richest probiotic drink on earth." },
  { id: 5, emoji: "🥬", name: "Kimchi", hindi: "किमची", microbe: "Lactiplantibacillus plantarum", type: "bacteria", color: "#FADDE0", border: "#E56B7A", helps: ["Inflammation", "Diabetes", "IBS-C"], score: 9, tip: "Anti-inflammatory powerhouse — try making it at home!" },
  { id: 6, emoji: "🟡", name: "Dhokla", hindi: "ढोकला", microbe: "Pediococcus acidilactici", type: "bacteria", color: "#DCE1DF", border: "#5B7065", helps: ["Bloating", "Protein", "Energy"], score: 7, tip: "Overnight fermented batter = best dhokla + best gut!" },
  { id: 7, emoji: "🫙", name: "Kanji", hindi: "कांजी", microbe: "Lactobacillus fermentum", type: "bacteria", color: "#F5EFE6", border: "#D4C4AE", helps: ["Immunity", "Detox", "Digestion"], score: 9, tip: "Black carrot kanji in winter = gut's best friend!" },
  { id: 8, emoji: "🫙", name: "Pickle / Achaar", hindi: "अचार", microbe: "Lactobacillus plantarum", type: "bacteria", color: "#DCE1DF", border: "#5B7065", helps: ["Constipation", "Appetite", "Immunity"], score: 7, tip: "Homemade oil-free achaar = real probiotics, no preservatives!" },
  { id: 9, emoji: "🌱", name: "Sabja Seeds", hindi: "सब्जा", microbe: "Prebiotic fiber", type: "prebiotic", color: "#F5EFE6", border: "#D4C4AE", helps: ["Constipation", "Acidity", "Cooling"], score: 6, tip: "Soak in water 15 mins — your gut's favourite drink topping!" },
  { id: 10, emoji: "🫐", name: "Amla / Gooseberry", hindi: "आंवला", microbe: "Prebiotic + Vit C", type: "prebiotic", color: "#FADDE0", border: "#E56B7A", helps: ["Immunity", "Acidity", "Skin"], score: 7, tip: "Highest natural Vitamin C in India — eat fresh every morning!" },
  { id: 11, emoji: "🍵", name: "Kombucha", hindi: "कोम्बुचा", microbe: "Saccharomyces cerevisiae", type: "yeast", color: "#DCE1DF", border: "#5B7065", helps: ["Diabetes", "Energy", "Liver"], score: 8, tip: "Brew at home for ₹50/litre — your gut's sparkling !" },
  { id: 12, emoji: "🍲", name: "Bone Broth / Yakhni", hindi: "यखनी", microbe: "Collagen + Gut peptides", type: "peptides", color: "#F5EFE6", border: "#D4C4AE", helps: ["IBS", "Gut lining", "Joints"], score: 7, tip: "Slow-cook 8+ hrs for maximum gut-healing collagen!" },
];

const FOOD_CATALOG = [
  { id: "idli-sambar", name: "Idli Sambar", emoji: "🫓", probiotic: true, score: 9 },
  { id: "dhokla", name: "Dhokla", emoji: "🟡", probiotic: true, score: 8.5 },
  { id: "handvo", name: "Handvo", emoji: "🫓", probiotic: true, score: 8 },

  { id: "khichdi", name: "Khichdi", emoji: "🍲", probiotic: false, score: 9 },
  { id: "dal-rice", name: "Dal Rice", emoji: "🍛", probiotic: false, score: 8.5 },
  { id: "sambar-rice", name: "Sambar Rice", emoji: "🍚", probiotic: false, score: 8.5 },

  { id: "roti-sabji", name: "Roti Sabji", emoji: "🍽️", probiotic: false, score: 7.5 },
  { id: "poha", name: "Poha", emoji: "🍽️", probiotic: false, score: 7 },
  { id: "upma", name: "Upma", emoji: "🍽️", probiotic: false, score: 6.5 },

  { id: "rajma", name: "Rajma Chawal", emoji: "🍛", probiotic: false, score: 7 },
  { id: "fish-curry", name: "Fish Curry", emoji: "🐟", probiotic: false, score: 7 },

  { id: "masala-dosa", name: "Masala Dosa", emoji: "🥞", probiotic: true, score: 6.5 },
  { id: "paneer", name: "Paneer Masala", emoji: "🧀", probiotic: false, score: 6 },
  { id: "butter-chicken", name: "Butter Chicken", emoji: "🍗", probiotic: false, score: 5.5 },

  { id: "biryani", name: "Biryani", emoji: "🍛", probiotic: false, score: 5 },
  { id: "pav-bhaji", name: "Pav Bhaji", emoji: "🍽️", probiotic: false, score: 4.5 },
  { id: "chole-bhature", name: "Chole Bhature", emoji: "🍽️", probiotic: false, score: 3.5 }
];

const CONDITIONS = ["Bloating", "IBS", "Acidity", "Constipation", "Diabetes", "Low Immunity", "Inflammation", "Stress"];

const GREETINGS = ["Welcome", "Hello", "Greetings", "Good to see you"];

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
  --sand: #E8DCCB;
  --sand-light: #F5EFE6;
  --sand-dark: #D4C4AE;
  --pink: #E56B7A;
  --pink-light: #F09CA7;
  --pink-dark: #C94C5C;
  --sage: #5B7065;
  --sage-light: #7A9084;
  --sage-mid: #495E54;
  --sand-light: #F5EFE6;
  --sand: #E8DCCB;
  --ink: #000000;
  --ink-mid: #000000ff;
  --ink-light: #120802ff;
  --white: #FFFFFF;
  --success: #2E7D32;
  --r: 16px;
  --rsm: 8px;
  --shadow: 0 4px 24px rgba(91, 112, 101, 0.12);
  --shadow-lg: 0 8px 40px rgba(91, 112, 101, 0.18);
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Montserrat', sans-serif;
  background: var(--sand);
  color: var(--ink);
  overflow-x: hidden;
}

/* ── Geometric block-print background pattern ── */
.block-bg {
  position: relative;
  background-color: var(--sand);
}
.block-bg::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(232, 220, 203, 0.08) 39px, rgba(232, 220, 203, 0.08) 40px),
    repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(91, 112, 101, 0.06) 39px, rgba(91, 112, 101, 0.06) 40px);
  pointer-events: none;
  z-index: 0;
}
.block-bg::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image:
    radial-gradient(circle at 10% 20%, rgba(232, 220, 203, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(91, 112, 101, 0.10) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(232, 220, 203, 0.05) 0%, transparent 60%);
  pointer-events: none;
  z-index: 0;
}

/* ── Top Nav ── */
.topnav {
  position: sticky; top: 0; z-index: 200;
  background: var(--sage);
  padding: 0 24px;
  display: flex; align-items: center; justify-content: space-between;
  height: 64px;
  box-shadow: 0 2px 20px rgba(63, 82, 73, 0.4);
  border-bottom: 3px solid var(--sand);
}
.nav-logo {
  font-family: 'Rozha One', serif;
  font-size: 1.6rem; font-weight: 800;
  color: var(--sand);
  letter-spacing: -0.5px;
  cursor: pointer;
}
.nav-logo span { color: #fff; }
.nav-links { display: flex; gap: 4px; }
.nav-link {
  padding: 8px 16px; border-radius: 50px;
  font-size: 0.85rem; font-weight: 600;
  cursor: pointer; border: none;
  font-family: 'Montserrat', sans-serif;
  color: rgba(255,255,255,0.7);
  background: transparent;
  transition: all 0.2s;
  white-space: nowrap;
}
.nav-link:hover { color: var(--sand); background: rgba(232, 220, 203, 0.1); }
.nav-link.active { background: var(--sand); color: var(--pink); }

/* ── Page wrapper ── */
.page { position: relative; z-index: 1; min-height: calc(100vh - 64px); }
.container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }

/* ── Animations ── */
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-20px); } }
@keyframes bounceIn { 0% { opacity: 0; transform: scale(0.3) translateY(40px); } 60% { transform: scale(1.05); } 80% { transform: scale(0.97); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
@keyframes float { 0%,100% { transform: translateY(0px) rotate(0deg); } 33% { transform: translateY(-8px) rotate(1deg); } 66% { transform: translateY(-4px) rotate(-1deg); } }
@keyframes wave { 0%,100% { transform: rotate(0deg); } 20% { transform: rotate(-20deg); } 40% { transform: rotate(20deg); } 60% { transform: rotate(-15deg); } 80% { transform: rotate(10deg); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideInLeft { from { opacity: 0; transform: translateX(-30px); } to { opacity: 1; transform: translateX(0); } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
@keyframes dropBounce { 0% { opacity: 0; transform: translateY(-60px) scale(0.8); } 60% { transform: translateY(8px) scale(1.02); } 80% { transform: translateY(-4px) scale(0.99); } 100% { opacity: 1; transform: translateY(0) scale(1); } }

.fade-in { animation: fadeIn 0.5s ease forwards; }
.bounce-in { animation: bounceIn 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards; }
.drop-bounce { animation: dropBounce 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards; }
.float-card { animation: float 4s ease-in-out infinite; }
.wave-hand { display: inline-block; animation: wave 1.5s ease-in-out 1; }

/* ── Buttons ── */
.btn-primary {
  background: var(--sage-mid);
  color: #fff;
  border: none; border-radius: 50px;
  padding: 14px 32px; font-size: 1rem; font-weight: 700;
  cursor: pointer; font-family: 'Montserrat', sans-serif;
  box-shadow: 0 4px 20px rgba(91, 112, 101, 0.35);
  transition: all 0.2s;
}
.btn-primary:hover { background: var(--sage); transform: translateY(-2px); box-shadow: 0 6px 28px rgba(91, 112, 101, 0.45); }

.btn-secondary {
  background: #fff;
  color: var(--ink-light);
  border: none; border-radius: 50px;
  padding: 14px 32px; font-size: 1rem; font-weight: 700;
  cursor: pointer; font-family: 'Montserrat', sans-serif;
  box-shadow: 0 4px 20px rgba(232, 220, 203, 0.4);
  transition: all 0.2s;
}
.btn-secondary:hover { background: #fcfcfc; transform: translateY(-2px); }

.btn-ghost {
  background: #fff;
  color: var(--ink-light);
  border: 2px solid var(--sage-mid);
  border-radius: 50px;
  padding: 10px 24px; font-size: 0.9rem; font-weight: 600;
  cursor: pointer; font-family: 'Montserrat', sans-serif;
  transition: all 0.2s;
}
.btn-ghost:hover { background: var(--sage-mid); color: #fff; }

/* ── Cards ── */
.card {
  background: #fff;
  border-radius: var(--r);
  border: 1.5px solid rgba(232, 220, 203, 0.3);
  padding: 20px;
  box-shadow: var(--shadow);
}
.card-sage {
  background: var(--sage);
  border-radius: var(--r);
  padding: 20px;
  color: #fff;
}
.card-sand {
  background: var(--sand-light);
  border: 2px solid var(--sand);
  border-radius: var(--r);
  padding: 20px;
}

/* ── Hero section ── */
.hero {
  padding: 60px 0 40px;
  text-align: center;
}
.hero-greeting {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  color: var(--sage-light);
  margin-bottom: 12px;
}
.hero-title {
  font-family: 'Rozha One', serif;
  font-size: clamp(2.4rem, 5vw, 4rem);
  font-weight: 800;
  color: var(--ink);
  line-height: 1.1;
  margin-bottom: 16px;
}
.hero-title .highlight {
  color: var(--sage);
  position: relative;
}
.hero-title .highlight::after {
  content: '';
  position: absolute;
  bottom: 2px; left: 0; right: 0;
  height: 4px;
  background: var(--sand);
  border-radius: 2px;
}
.hero-sub {
  font-size: 1.05rem;
  color: var(--ink-mid);
  max-width: 520px;
  margin: 0 auto 32px;
  line-height: 1.7;
}
.hero-ctas { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; margin-bottom: 32px; }

/* ── Search bar ── */
.search-wrap {
  max-width: 480px; margin: 0 auto 28px;
  position: relative;
}
.search-bar {
  width: 100%;
  padding: 14px 52px 14px 20px;
  border-radius: 50px;
  border: 2px solid var(--sand);
  font-size: 0.95rem;
  font-family: 'Montserrat', sans-serif;
  background: #fff;
  color: var(--ink);
  outline: none;
  box-shadow: 0 2px 16px rgba(232, 220, 203, 0.2);
  transition: border-color 0.2s, box-shadow 0.2s;
}
.search-bar:focus { border-color: var(--sage); box-shadow: 0 2px 24px rgba(91, 112, 101, 0.2); }
.search-icon {
  position: absolute; right: 16px; top: 50%; transform: translateY(-50%);
  font-size: 1.2rem; cursor: pointer;
  background: var(--sage); color: #fff;
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  border: none;
}

/* ── Pro tip ── */
.pro-tip {
  max-width: 560px; margin: 0 auto;
  background: linear-gradient(135deg, var(--pink) 0%, var(--pink-dark) 100%);
  border-radius: var(--r);
  padding: 16px 22px;
  display: flex; align-items: flex-start; gap: 12px;
  box-shadow: var(--shadow-lg);
}
.tip-label {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.75rem;
  color: var(--sand);
  white-space: nowrap;
  padding-top: 2px;
}
.tip-text {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.88rem;
  color: #fff;
  line-height: 1.5;
}

/* ── Section ── */
.section { padding: 40px 0; }
.section-title {
  font-family: 'Rozha One', serif;
  font-size: 1.8rem; font-weight: 800;
  color: var(--ink);
  margin-bottom: 8px;
}
.section-sub { font-size: 0.9rem; color: var(--ink-light); margin-bottom: 24px; }

/* ── Decorative border ── */
.deco-border {
  height: 4px;
  background: repeating-linear-gradient(90deg, var(--sage) 0px, var(--sage) 20px, var(--sand) 20px, var(--sand) 40px);
  margin: 8px 0 24px;
  border-radius: 2px;
}

/* ── Feature cards grid ── */
.features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; }
.feature-card {
  background: #fff;
  border-radius: var(--r);
  padding: 28px 24px;
  border: 2px solid transparent;
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: all 0.25s;
  position: relative;
  overflow: hidden;
}
.feature-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 4px;
  background: var(--sage);
  transition: height 0.2s;
}
.feature-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); border-color: var(--sand); }
.feature-card:hover::before { height: 6px; background: var(--sand); }
.feature-emoji { font-size: 2.5rem; margin-bottom: 12px; display: block; }
.feature-title { font-weight: 700; font-size: 1.05rem; color: var(--ink); margin-bottom: 6px; }
.feature-desc { font-size: 0.85rem; color: var(--ink-light); line-height: 1.5; }

/* ── Scan page ── */
.scan-tabs { display: flex; gap: 8px; margin-bottom: 24px; flex-wrap: wrap; }
.scan-tab {
  padding: 10px 20px; border-radius: 50px;
  font-size: 0.85rem; font-weight: 600;
  border: 2px solid var(--sand);
  background: #fff; color: var(--ink-light);
  cursor: pointer; font-family: 'Montserrat', sans-serif;
  transition: all 0.2s;
}
.scan-tab.active { background: var(--sage-mid); border-color: var(--sage-mid); color: #fff; }

.food-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
.food-chip {
  padding: 10px 12px; border-radius: var(--rsm);
  border: 2px solid rgba(232, 220, 203, 0.3);
  background: #fff; cursor: pointer;
  font-family: 'Montserrat', sans-serif;
  font-size: 0.82rem; font-weight: 600;
  color: var(--ink-light);    
  display: flex; align-items: center; gap: 6px;
  transition: all 0.15s;
}
.food-chip:hover { border-color: var(--sand); background: var(--sand-light); }
.food-chip.selected { background: var(--sage-mid); border-color: var(--sage-mid); color: #fff; }
.probiotic-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--success); flex-shrink: 0; }

/* ── Result card ── */
.result-card {
  background: #fff;
  border-radius: 24px;
  border: 3px solid var(--sand);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}
.result-header {
  background: linear-gradient(135deg, var(--sage) 0%, var(--sage-mid) 100%);
  padding: 28px 28px 20px;
  color: #fff;
  position: relative;
  overflow: hidden;
}
.result-header::after {
  content: '';
  position: absolute; top: -30px; right: -30px;
  width: 120px; height: 120px;
  border-radius: 50%;
  background: rgba(232, 220, 203, 0.15);
}
.result-greeting {
  font-family: 'Montserrat', sans-serif;
  font-size: 1.1rem;
  color: var(--sand);
  margin-bottom: 6px;
}
.result-meal { font-size: 1.5rem; font-weight: 700; margin-bottom: 4px; }
.result-body { padding: 24px 28px; }

/* ── Score ring ── */
.score-wrap { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
.score-ring { position: relative; width: 100px; height: 100px; flex-shrink: 0; }
.score-ring svg { transform: rotate(-90deg); }
.score-center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.score-num { font-family: 'Rozha One', serif; font-size: 2rem; font-weight: 800; line-height: 1; }
.score-denom { font-size: 0.7rem; color: var(--ink-light); font-weight: 600; }
.score-label { font-size: 1rem; font-weight: 700; margin-bottom: 4px; }
.score-msg { font-family: 'Montserrat', sans-serif; font-size: 0.85rem; color: var(--sage); line-height: 1.5; }

/* ── Probiotic suggestion pills ── */
.suggest-wrap { margin-top: 16px; }
.suggest-title { font-size: 0.8rem; font-weight: 700; color: var(--ink-light); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
.suggest-pills { display: flex; flex-wrap: wrap; gap: 8px; }
.suggest-pill {
  padding: 6px 14px; border-radius: 50px;
  background: var(--sand-light);
  border: 1.5px solid var(--sand);
  font-size: 0.82rem; font-weight: 600;
  color: var(--pink);
}

/* ── Appreciation banner ── */
.appreciation {
  margin-top: 20px;
  background: linear-gradient(135deg, var(--sand-light), var(--white));
  border: 2px solid var(--sand);
  border-radius: var(--r);
  padding: 16px 20px;
  text-align: center;
}
.appreciation-text { font-family: 'Montserrat', sans-serif; font-size: 1rem; color: var(--sage); line-height: 1.5; }

/* ── Probiotic cards (Know All Probiotics) ── */
.probiotic-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
.probiotic-card {
  border-radius: 20px;
  padding: 22px 18px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}
.probiotic-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: var(--shadow-lg); }
.probiotic-emoji { font-size: 3rem; margin-bottom: 10px; display: block; }
.probiotic-name { font-family: 'Rozha One', serif; font-size: 1.05rem; font-weight: 700; color: var(--ink); margin-bottom: 2px; }
.probiotic-hindi { font-size: 0.82rem; color: var(--ink-light); margin-bottom: 8px; }
.probiotic-microbe { font-size: 0.75rem; font-weight: 600; margin-bottom: 8px; padding: 3px 8px; background: rgba(91, 112, 101, 0.08); border-radius: 50px; display: inline-block; }
.probiotic-type { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
.probiotic-helps { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.help-tag { font-size: 0.7rem; padding: 2px 8px; border-radius: 50px; background: rgba(91, 112, 101, 0.1); color: var(--pink); font-weight: 600; }
.score-bar { height: 4px; background: rgba(0,0,0,0.1); border-radius: 2px; margin-top: 10px; overflow: hidden; }
.score-bar-fill { height: 100%; border-radius: 2px; background: var(--pink); }

/* ── Chat ── */
.chat-container { max-width: 680px; margin: 0 auto; }
.chat-messages { min-height: 320px; max-height: 420px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; padding: 16px; background: var(--sand); border-radius: var(--r); border: 2px solid rgba(232, 220, 203, 0.3); margin-bottom: 16px; }
.chat-bubble { display: flex; flex-direction: column; max-width: 78%; }
.chat-bubble.user { align-self: flex-end; align-items: flex-end; }
.chat-bubble.ai { align-self: flex-start; align-items: flex-start; }
.bubble-body { padding: 10px 16px; font-size: 0.9rem; line-height: 1.6; white-space: pre-wrap; }
.chat-bubble.user .bubble-body { background: var(--sage); color: #fff; border-radius: 18px 18px 4px 18px; }
.chat-bubble.ai .bubble-body { background: #fff; color: var(--ink); border-radius: 18px 18px 18px 4px; border: 1.5px solid rgba(232, 220, 203, 0.3); }
.bubble-ts { font-size: 0.7rem; color: var(--ink-light); margin-top: 3px; }
.chat-chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
.chat-chip { padding: 7px 14px; border-radius: 50px; background: #fff; border: 1.5px solid var(--sand); font-size: 0.8rem; font-weight: 600; color: var(--ink-light); cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.15s; }
.chat-chip:hover { background: var(--sand); color: var(--sage-mid); }
.chat-input-row { display: flex; gap: 8px; }
.chat-input { flex: 1; padding: 12px 18px; border-radius: 50px; border: 2px solid var(--sand); font-size: 0.9rem; font-family: 'Montserrat', sans-serif; background: #fff; color: var(--ink); outline: none; }
.chat-input:focus { border-color: var(--pink); }
.voice-btn { width: 44px; height: 44px; border-radius: 50%; background: var(--sand); border: none; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.voice-btn:hover { background: var(--sand-dark); transform: scale(1.05); }
.voice-btn.listening { background: rgba(229, 107, 122, 0.4); animation: pulse 0.8s infinite; }
.typing-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--pink); display: inline-block; animation: pulse 1s infinite; }
.typing-dot:nth-child(2) { animation-delay: 0.2s; }
.typing-dot:nth-child(3) { animation-delay: 0.4s; }

/* ── Profile page ── */
.profile-hero {
  background: linear-gradient(135deg, var(--sage-light) 0%, var(--sage) 100%);
  border-radius: 24px;
  padding: 32px 28px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  color: #fff;
}
.profile-hero::before {
  content: '🔶🔷🔶🔷🔶🔷🔶🔷🔶🔷';
  position: absolute; top: -10px; right: -10px;
  font-size: 1rem; opacity: 0.15;
  letter-spacing: -2px; line-height: 1.2;
  pointer-events: none;
}
.avatar-ring {
  width: 80px; height: 80px; border-radius: 50%;
  background: var(--sand);
  display: flex; align-items: center; justify-content: center;
  font-size: 2.5rem;
  border: 3px solid rgba(255,255,255,0.3);
  margin-bottom: 14px;
}
.profile-name { font-family: 'Rozha One', serif; font-size: 1.8rem; font-weight: 800; margin-bottom: 4px; }
.profile-compliment { font-family: 'Montserrat', sans-serif; font-size: 0.9rem; color: var(--sand); margin-bottom: 16px; }
.profile-nav-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; margin-bottom: 24px; }
.profile-nav-btn {
  background: #fff; border: 2px solid rgba(232, 220, 203, 0.4);
  border-radius: var(--r); padding: 16px 14px;
  cursor: pointer; text-align: center;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.2s;
}
.profile-nav-btn:hover { border-color: var(--sand); transform: translateY(-2px); box-shadow: var(--shadow); }
.profile-nav-btn.active { background: var(--sage); border-color: var(--sage); color: #fff; }
.profile-nav-icon { font-size: 1.6rem; margin-bottom: 6px; display: block; }
.profile-nav-label { font-size: 0.8rem; font-weight: 700; color: inherit; }

/* ── Know All Probiotics CTA card ── */
.know-card {
  background: linear-gradient(135deg, var(--sand) 0%, var(--sand-dark) 100%);
  border-radius: 20px;
  padding: 28px 24px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  border: none;
  width: 100%;
  margin-bottom: 24px;
  box-shadow: 0 6px 32px rgba(232, 220, 203, 0.4);
  position: relative;
  overflow: hidden;
}
.know-card::before {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(91, 112, 101, 0.08) 8px, rgba(91, 112, 101, 0.08) 9px);
}
.know-card:hover { transform: translateY(-4px) scale(1.01); box-shadow: 0 10px 40px rgba(232, 220, 203, 0.5); }
.know-title { font-family: 'Rozha One', serif; font-size: 1.4rem; font-weight: 800; color: var(--pink); margin-bottom: 6px; position: relative; }
.know-sub { font-family: 'Montserrat', sans-serif; font-size: 0.85rem; color: var(--pink); opacity: 0.8; position: relative; }

/* ── Gut score display ── */
.gut-score-card {
  background: #fff;
  border-radius: var(--r);
  border: 2px solid var(--sand);
  padding: 20px;
  text-align: center;
}
.gut-score-num { font-family: 'Rozha One', serif; font-size: 3rem; font-weight: 800; color: var(--pink); line-height: 1; }
.gut-score-label { font-family: 'Montserrat', sans-serif; font-size: 0.85rem; color: var(--ink-light); margin-top: 4px; }

/* ── Meal history ── */
.meal-log-item { display: flex; gap: 12px; padding: 14px 16px; background: #fff; border-radius: var(--rsm); border: 1.5px solid rgba(232, 220, 203, 0.3); margin-bottom: 8px; align-items: center; }
.meal-log-emoji { font-size: 1.8rem; }
.meal-log-name { font-weight: 700; font-size: 0.95rem; color: var(--ink); }
.meal-log-meta { font-size: 0.78rem; color: var(--ink-light); margin-top: 2px; }
.meal-log-score { font-family: 'Rozha One', serif; font-size: 1.3rem; font-weight: 800; margin-left: auto; }

/* ── Overlays ── */
.overlay { position: fixed; inset: 0; background: rgba(44,24,16,0.7); z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; backdrop-filter: blur(4px); }
.overlay-card { background: #fff; border-radius: 24px; padding: 28px; max-width: 440px; width: 100%; max-height: 80vh; overflow-y: auto; position: relative; border: 3px solid var(--sand); box-shadow: var(--shadow-lg); }
.overlay-close { position: absolute; top: 16px; right: 16px; background: var(--pink); color: #fff; border: none; border-radius: 50%; width: 32px; height: 32px; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }

/* ── Input ── */
.inp { width: 100%; padding: 12px 16px; border-radius: var(--rsm); border: 2px solid rgba(232, 220, 203, 0.4); font-size: 0.9rem; font-family: 'Montserrat', sans-serif; background: #fff; color: var(--ink); outline: none; transition: border-color 0.2s; }
.inp:focus { border-color: var(--sage); }
.lbl { font-size: 0.82rem; font-weight: 700; color: var(--ink); display: block; margin-bottom: 4px; }
.form-row { margin-bottom: 14px; }

/* ── Condition chips ── */
.condition-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.cond-chip { padding: 6px 14px; border-radius: 50px; border: 2px solid var(--sand); background: #fff; font-size: 0.8rem; font-weight: 600; color: var(--pink); cursor: pointer; font-family: 'Montserrat', sans-serif; transition: all 0.15s; }
.cond-chip:hover { background: var(--sand-light); }
.cond-chip.on { background: var(--sage); border-color: var(--sage); color: #fff; }

/* ── Decorative diamond row ── */
.diamond-row { display: flex; align-items: center; gap: 8px; margin: 20px 0; }
.diamond { width: 10px; height: 10px; background: var(--sand); transform: rotate(45deg); flex-shrink: 0; }
.diamond.small { width: 6px; height: 6px; background: var(--sage); }
.diamond-line { flex: 1; height: 1.5px; background: linear-gradient(90deg, transparent, var(--sand), transparent); }

/* ── Warning ── */
.warn { background: var(--sand-light); border: 1.5px solid var(--sand-dark); border-radius: var(--rsm); padding: 12px 16px; font-size: 0.82rem; color: var(--sage); line-height: 1.5; margin-top: 12px; }

/* ── Scrollbar ── */
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--sand); }
::-webkit-scrollbar-thumb { background: var(--sand); border-radius: 3px; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .topnav { padding: 0 14px; height: 56px; }
  .nav-logo { font-size: 1.3rem; }
  .nav-link { padding: 6px 10px; font-size: 0.78rem; }
  .hero { padding: 36px 0 28px; }
  .hero-ctas { flex-direction: column; align-items: center; }
  .btn-primary, .btn-secondary { width: 100%; max-width: 280px; text-align: center; }
  .container { padding: 0 14px; }
}
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

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function WaveHand() {
  return <span className="wave-hand">👋</span>;
}

function ScoreRing({ score, size = 100 }: { score: number; size?: number }) {
  const r = 40, C = 2 * Math.PI * r;
  const dash = C * (score / 10);
  const color = getScoreColor(score);
  return (
    <div className="score-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#EDE8DF" strokeWidth="10" />
        <circle cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${C - dash}`} strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }} />
      </svg>
      <div className="score-center">
        <span className="score-num" style={{ color, fontSize: size * 0.34 }}>{score}</span>
        <span className="score-denom">/10</span>
      </div>
    </div>
  );
}

function ProbioticCard({ p, idx }: { p: typeof PROBIOTIC_CARDS[0]; idx: number }) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div className={`probiotic-card drop-bounce float-card`}
      style={{ background: p.color, borderColor: p.border, borderWidth: 2, borderStyle: "solid", animationDelay: `${idx * 0.08}s`, animationFillMode: "both" }}
      onClick={() => setFlipped(f => !f)}>
      <span className="probiotic-emoji">{p.emoji}</span>
      {!flipped ? (
        <>
          <div className="probiotic-name">{p.name}</div>
          <div className="probiotic-hindi">{p.hindi}</div>
          <div className="probiotic-microbe">{p.microbe}</div>
          <div className="probiotic-type" style={{ color: p.border }}>
            {p.type === "yeast" ? "🍄 Yeast" : p.type === "prebiotic" ? "🌿 Prebiotic" : p.type === "yeast+bacteria" ? "🦠🍄 Yeast + Bacteria" : "🦠 Bacteria"}
          </div>
          <div className="probiotic-helps">
            {p.helps.map(h => <span key={h} className="help-tag">{h}</span>)}
          </div>
          <div className="score-bar" style={{ marginTop: 12 }}>
            <div className="score-bar-fill" style={{ width: `${p.score * 10}%`, background: p.border }} />
          </div>
          <div style={{ fontSize: "0.7rem", color: "#666", marginTop: 4 }}>Tap for tip 👆</div>
        </>
      ) : (
        <div style={{ padding: "8px 0" }}>
          <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.9rem", color: p.border, lineHeight: 1.6 }}>
            💡 {p.tip}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#888", marginTop: 8 }}>Tap to flip back 🔄</div>
        </div>
      )}
    </div>
  );
}

// ─── PAGES ────────────────────────────────────────────────────────────────────

function HomePage({ mealLogs, setMealLogs, userName }: { mealLogs: { name: string; score: number; emoji: string; date: string; time: string }[]; setMealLogs: (l: { name: string; score: number; emoji: string; date: string; time: string }[]) => void; userName: string }) {
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
          <h1 style={{ fontFamily: "'Rozha One', serif", fontSize: "clamp(2.2rem, 5vw, 3rem)", color: "var(--sage)", fontStyle: "italic", marginBottom: 16, lineHeight: 1.2 }}>
            "Good health begins in the gut."
          </h1>
          <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "1.05rem", color: "var(--ink-light)" }}>
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
            <p style={{ fontFamily: "'Montserrat', sans-serif", color: "var(--pink)", marginBottom: 20, fontSize: "0.95rem" }}>
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
                <p style={{ fontFamily: "'Montserrat', sans-serif", color: "var(--pink)", fontSize: "0.9rem" }}>Analyzing your meal right now 🔬✨</p>
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


function ChatPage({ profile }: { profile: { name: string; conditions: string[] } }) {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string; ts: number }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);


  async function send(text: string) {
    if (!text.trim() || loading) return;
    const userMsg = { role: "user" as const, text, ts: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput(""); setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text
      }));

      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          system: `You are GutVeda AI, a Gen-Z Indian gut health coach. You speak in a mix of Hindi and English (Hinglish) using words like '', 'enhance', 'truly'. You know a lot about Ayurveda, probiotics, Indian food like dahi, idli, chaas, etc. Keep responses short, informative, and engaging. Use emojis. User profile: ${JSON.stringify(profile)}`,
          max_tokens: 1000
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to fetch");

      const reply = data.content?.[0]?.text || "No reply 😭";
      setMessages(m => [...m, { role: "ai", text: reply, ts: Date.now() }]);
    } catch (e: any) {
      setMessages(m => [...m, { role: "ai", text: "Oops, error: " + e.message, ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }

  function startVoice() {
    const SR = (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition
      || (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;
    if (!SR) { alert("Voice not supported. Try Chrome!"); return; }
    const r = new SR();
    r.lang = "en-IN"; r.continuous = false; r.interimResults = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = () => setListening(false);
    r.onresult = (e: SpeechRecognitionEvent) => { const t = e.results[0][0].transcript; setInput(t); send(t); };
    r.start();
  }

  return (
    <div className="page fade-in">
      <div className="container chat-container" style={{ paddingTop: 32 }}>
        <h2 className="section-title">AI Gut Coach 🧠</h2>
        <div className="deco-border" style={{ width: 60 }} />
        <p className="section-sub">Ask anything about gut health — in English, Hindi or Hinglish! 🎤</p>

        {messages.length === 0 && (
          <div className="card-sand bounce-in" style={{ marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontSize: "2rem", marginBottom: 8 }}>🧬</div>
            <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.95rem", color: "var(--pink)", lineHeight: 1.6 }}>
              {profile.name ? `heyy ${profile.name}! 🌟 ` : "heyy ! 🌟 "}
              ur personal gut  is online and ready to spill all the probiotic tea ☕
            </div>
          </div>
        )}

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-bubble ${m.role} fade-in`} style={{ animationDelay: "0s" }}>
              <div className="bubble-body">{m.text}</div>
              <div className="bubble-ts">{m.role === "user" ? "You" : "GutVeda AI 🌿"} · {new Date(m.ts).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-bubble ai">
              <div className="bubble-body" style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                <span style={{ fontSize: "0.8rem", color: "var(--ink-light)", marginLeft: 4 }}>thinking… 🧠</span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 0 && (
          <div className="chat-chips">
            {CHAT_SUGGESTIONS.map(s => (
              <button key={s} className="chat-chip" onClick={() => send(s)}>{s}</button>
            ))}
          </div>
        )}

        <div className="chat-input-row">
          <input className="chat-input" placeholder={`Ask${profile.name ? ` ${profile.name}` : " "}… 💬`} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && !e.shiftKey && send(input)} />
          <button className={`voice-btn ${listening ? "listening" : ""}`} onClick={startVoice} title="Voice input 🎤">🎤</button>
          <button className="btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem" }} onClick={() => send(input)} disabled={!input.trim() || loading}>Send</button>
        </div>
        {listening && <p style={{ fontFamily: "'Montserrat', sans-serif", color: "var(--pink)", fontSize: "0.85rem", marginTop: 6 }}>🎙 listening… speak up !</p>}
        {messages.length > 0 && (
          <button className="btn-ghost" style={{ marginTop: 12, fontSize: "0.8rem" }} onClick={() => setMessages([])}>Clear chat 🧹</button>
        )}
      </div>
    </div>
  );
}

function ProfilePage({ profile, setProfile, mealLogs, showProbiotics, setShowProbiotics }: {
  profile: { name: string; age: string; sex: string; conditions: string[]; goals: string[] };
  setProfile: (p: typeof profile) => void;
  mealLogs: { name: string; score: number; emoji: string; date: string; time: string }[];
  showProbiotics: boolean;
  setShowProbiotics: (v: boolean) => void;
}) {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [overlay, setOverlay] = useState<string | null>(null);
  const avgScore = mealLogs.length > 0 ? Math.round(mealLogs.reduce((s, l) => s + l.score, 0) / mealLogs.length) : 7;

  const COMPLIMENTS = [
    "Your commitment to gut health is truly inspiring 🌟",
    "You are making excellent progress on your wellness journey 🌿",
    "Your microbiome is thriving beautifully 🦠✨",
    "Exceptional! Your dedication to health is immaculate 👑",
  ];
  const compliment = COMPLIMENTS[Math.floor(Math.random() * COMPLIMENTS.length)];

  function up(k: string, v: unknown) { setProfile({ ...profile, [k]: v }); }
  function toggleCond(c: string) { up("conditions", profile.conditions.includes(c) ? profile.conditions.filter(x => x !== c) : [...profile.conditions, c]); }

  return (
    <div className="page fade-in">
      <div className="container" style={{ paddingTop: 32, maxWidth: 820 }}>

        {/* Profile hero */}
        <div className="profile-hero bounce-in">
          <div className="avatar-ring">
            {profile.name ? profile.name[0].toUpperCase() : "🌿"}
          </div>
          <div className="profile-name">{profile.name || "Hey there!"} <WaveHand /></div>
          <div className="profile-compliment">{compliment}</div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Rozha One', serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--sand)" }}>{avgScore}/10</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", opacity: 0.8 }}>avg gut score</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Rozha One', serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--sand)" }}>{mealLogs.length}</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", opacity: 0.8 }}>meals logged</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Rozha One', serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--sand)" }}>{profile.conditions.length}</div>
              <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.75rem", opacity: 0.8 }}>conditions tracked</div>
            </div>
          </div>
        </div>

        {/* Nav buttons */}
        <div className="profile-nav-grid">
          {[
            { id: "info", icon: "👤", label: "Personal Info" },
            { id: "conditions", icon: "🩺", label: "Conditions" },
            { id: "history", icon: "📋", label: "Meal History" },
            { id: "score", icon: "📊", label: "Gut Score" },
          ].map(n => (
            <button key={n.id} className={`profile-nav-btn ${activeSection === n.id ? "active" : ""}`} onClick={() => setActiveSection(activeSection === n.id ? null : n.id)}>
              <span className="profile-nav-icon">{n.icon}</span>
              <span className="profile-nav-label">{n.label}</span>
            </button>
          ))}
        </div>

        {/* Sections */}
        {activeSection === "info" && (
          <div className="card bounce-in" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Rozha One', serif", fontWeight: 700, marginBottom: 16, color: "var(--pink)" }}>Personal Info 👤</h3>
            <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div><label className="lbl">Your Name</label><input className="inp" value={profile.name} onChange={e => up("name", e.target.value)} placeholder="What should we call u?" /></div>
              <div><label className="lbl">Age</label><input className="inp" type="number" value={profile.age} onChange={e => up("age", e.target.value)} placeholder="Age" /></div>
            </div>
            <div><label className="lbl">Sex</label>
              <select className="inp" value={profile.sex} onChange={e => up("sex", e.target.value)} style={{ cursor: "pointer" }}>
                <option value="">Select 👇</option>
                <option value="female">Female 👩</option>
                <option value="male">Male 👨</option>
                <option value="other">Other / Prefer not to say</option>
              </select>
            </div>
          </div>
        )}

        {activeSection === "conditions" && (
          <div className="card bounce-in" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Rozha One', serif", fontWeight: 700, marginBottom: 8, color: "var(--pink)" }}>Your Gut Conditions 🩺</h3>
            <p style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.8rem", color: "var(--ink-light)", marginBottom: 16 }}>Select all that apply — this powers your personalized recommendations!</p>
            <div className="condition-chips">
              {CONDITIONS.map(c => (
                <button key={c} className={`cond-chip ${profile.conditions.includes(c) ? "on" : ""}`} onClick={() => toggleCond(c)}>{c}</button>
              ))}
            </div>
          </div>
        )}

        {activeSection === "history" && (
          <div className="card bounce-in" style={{ marginBottom: 20 }}>
            <h3 style={{ fontFamily: "'Rozha One', serif", fontWeight: 700, marginBottom: 16, color: "var(--pink)" }}>Meal History 📋</h3>
            {mealLogs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "24px 0", color: "var(--ink-light)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🥗</div>
                <p style={{ fontFamily: "'Montserrat', sans-serif" }}>No meals logged yet! Start by scanning a meal. 🍛</p>
              </div>
            ) : (
              mealLogs.map((m, i) => (
                <div key={i} className="meal-log-item">
                  <span className="meal-log-emoji">{m.emoji}</span>
                  <div>
                    <div className="meal-log-name">{m.name}</div>
                    <div className="meal-log-meta">{m.date ? `${m.date} at ` : ''}{m.time}</div>
                  </div>
                  <div className="meal-log-score" style={{ color: getScoreColor(m.score) }}>{m.score}/10 {getScoreEmoji(m.score)}</div>
                </div>
              ))
            )}
          </div>
        )}

        {activeSection === "score" && (
          <div className="card bounce-in" style={{ marginBottom: 20, textAlign: "center" }}>
            <h3 style={{ fontFamily: "'Rozha One', serif", fontWeight: 700, marginBottom: 16, color: "var(--pink)" }}>Your Gut Score 📊</h3>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <ScoreRing score={avgScore} size={140} />
            </div>
            <div style={{ fontFamily: "'Montserrat', sans-serif", color: "var(--pink)", fontSize: "1rem", marginBottom: 8 }}>
              {avgScore >= 8 ? "Your gut is in its Optimal Health Zone 👑" : avgScore >= 6 ? "solid gut health ! keep going 💪" : "Your gut needs some attention — let's fix it! 🫶"}
            </div>
            <div className="warn">Score improves as you log more meals and eat more fermented foods! 🦠</div>
          </div>
        )}

        {/* KNOW ALL PROBIOTICS card */}
        <button className="know-card" onClick={() => setShowProbiotics(true)}>
          <div className="know-title">🦠 KNOW ALL PROBIOTICS</div>
          <div className="know-sub">Tap to discover every probiotic food, their bacteria, yeast, and benefits ✨</div>
          <div style={{ fontSize: "2rem", marginTop: 8, position: "relative" }}>🥛 🫓 🥬 🍶 🫙 🍵</div>
        </button>

      </div>

      {/* Probiotics overlay */}
      {showProbiotics && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowProbiotics(false)}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "28px 20px", maxWidth: 960, width: "100%", maxHeight: "90vh", overflowY: "auto", position: "relative", border: "3px solid var(--sand)", boxShadow: "var(--shadow-lg)" }}>
            <button className="overlay-close" onClick={() => setShowProbiotics(false)}>✕</button>
            <h2 style={{ fontFamily: "'Rozha One', serif", fontSize: "1.8rem", fontWeight: 800, color: "var(--pink)", marginBottom: 4 }}>
              🦠 All Indian Probiotics
            </h2>
            <p style={{ fontFamily: "'Montserrat', sans-serif", color: "var(--ink-light)", fontSize: "0.85rem", marginBottom: 8 }}>Tap any card to flip and discover a helpful tip! ✨</p>
            <div className="deco-border" />
            <div className="probiotic-grid">
              {PROBIOTIC_CARDS.map((p, i) => <ProbioticCard key={p.id} p={p} idx={i} />)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function GutVeda() {
  const [page, setPage] = useState("home");
  const [profile, setProfile] = useState({ name: "", age: "", sex: "", conditions: [] as string[], goals: [] as string[] });
  const [mealLogs, setMealLogs] = useState<{ name: string; score: number; emoji: string; date: string; time: string }[]>([]);
  const [showProbiotics, setShowProbiotics] = useState(false);
  const [mounted, setMounted] = useState(false);

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
        <div style={{ fontSize: "3rem", marginBottom: 12, animation: "float 2s infinite" }}>🌿</div>
        <div style={{ fontFamily: "'Rozha One', serif", fontSize: "1.6rem", fontWeight: 800, color: "#8B0000" }}>GutVeda</div>
        <div style={{ fontFamily: "'Montserrat', sans-serif", fontSize: "0.85rem", color: "#9C7B6B", marginTop: 6 }}>Loading your profile... 🦠✨</div>
      </div>
    </div>
  );

  const NAV_ITEMS = [
    { id: "home", label: "Home 🏠" },
    { id: "chat", label: "AI Chat 🧠" },
    { id: "profile", label: "My Profile 👤" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="block-bg">
        {/* Top Nav */}
        <nav className="topnav">
          <div className="nav-logo" onClick={() => setPage("home")}>Gut<span>Veda</span> 🌿</div>
          <div className="nav-links">
            {NAV_ITEMS.map(n => (
              <button key={n.id} className={`nav-link ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>{n.label}</button>
            ))}
          </div>
        </nav>

        {/* Pages */}
        {page === "home" && <HomePage mealLogs={mealLogs} setMealLogs={setMealLogs} userName={profile.name} />}
        {page === "chat" && <ChatPage profile={profile} />}
        {page === "profile" && <ProfilePage profile={profile} setProfile={setProfile} mealLogs={mealLogs} showProbiotics={showProbiotics} setShowProbiotics={setShowProbiotics} />}
      </div>
    </>
  );
}
