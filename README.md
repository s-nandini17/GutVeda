<p align="center">
  <img src="https://img.shields.io/badge/GutVeda-🌿-B5451B?style=for-the-badge&labelColor=FBF6EE" alt="GutVeda" />
</p>

<h1 align="center">GutVeda 🌿</h1>
<h3 align="center">Your Gut's New Bestie — Rooted in Ayurveda, Backed by Science</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Gemini_AI-2.5_Flash-4285F4?logo=google&logoColor=white" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/License-Educational-green" alt="License" />
</p>

---

**GutVeda** is an Ayurvedic gut wellness platform that maps Indian meals to probiotic benefits — helping you eat smarter, feel lighter, and restore gut balance the traditional way. It combines a curated database of Indian probiotic foods with AI-powered meal analysis and personalised dosha-based recommendations.

---

## ✨ Features

### 🥘 Meal Scanner
- **Instant gut-health scoring** — Type any Indian meal (Idli, Dahi, Lassi, Kanji, Dhokla, Chaas…) and get a probiotic gut-health score out of 10
- **Detailed strain info** — See which bacterial strains (Lactobacillus, Bifidobacterium, etc.) each food contains
- **Quick-scan chips** — One-tap analysis for popular probiotic foods
- **Meal logging** — Automatically logs scanned meals with date/time stamps and persists to localStorage

### 🤖 AI Gut Coach
- **Gemini 2.5 Flash-powered** chat for personalised gut health guidance
- Ask about bloating, IBS, fermentation science, dosha-specific diets, and more
- Contextual conversation with suggested prompts
- Falls back to a curated rule-based response engine when AI is unavailable

### 👤 Personalised Profiles
- **Dosha mapping** — Vata, Pitta, Kapha, and combination types with emoji indicators
- **Health conditions tracking** — IBS, Bloating, Constipation, GERD, Diabetes, Thyroid, and more
- **Wellness goals** — Improve digestion, boost immunity, manage stress, detox, etc.
- **Dosha-specific Ayurvedic tips** — Curated wellness guidance based on your constitution

### 📊 Gut Health Dashboard
- **Circular score arc** — Visual gut-health score averaged across logged meals
- **Meal history** — Full log with scores, timestamps, and emoji indicators
- **Score breakdown** — High / mid / low meal distribution

### 🍽️ Indian Food Intelligence
- **60+ Indian probiotic foods** catalogued with bacteria strains, conditions, and food sources
- **Food-source mapping** — Curd, Buttermilk, Kefir, Idli/Dosa batter, Kimchi, Kombucha, and Supplements
- **Condition-to-food matching** — Recommendations filtered by health conditions
- **Personalised day plans** — Meal-by-meal Ayurvedic eating schedules (Early Morning → Dinner)

---

## 🧬 Health Conditions Covered

| Category | Conditions |
|---|---|
| **Gastrointestinal** | Bloating, IBS (IBS-M, IBS-D, IBS-C), Constipation, Acid Reflux / GERD, Leaky Gut |
| **Metabolic** | Type 2 Diabetes, Weight Issues, Thyroid Issues |
| **Respiratory** | Respiratory Infections |
| **Oncology** | Colorectal Cancer (supportive) |
| **Mental Health** | Stress-Related Disorders, Anxiety (gut-brain axis) |
| **Gut Biochemistry** | SCFA Production, Anti-Inflammatory Effects |
| **Immunity** | Low Immunity, E. coli Resistance |
| **Dermatological** | Skin Issues (gut-linked) |

---

## 🏗️ Project Structure

```
GutVeda/
├── Probiotic app/
│   └── probiotic-meal-scan/          # Main application (Next.js 16 + TypeScript)
│       ├── app/
│       │   ├── page.tsx              # Full single-page app (Home, Chat, Profile)
│       │   ├── layout.tsx            # Root layout with metadata & Google Fonts
│       │   ├── globals.css           # Global styles
│       │   ├── lib/
│       │   │   └── data.ts           # Probiotic database, food catalog, scoring engine
│       │   └── api/
│       │       └── gemini/
│       │           └── route.ts      # Gemini AI proxy API route
│       ├── public/                   # Static assets
│       ├── package.json
│       └── tsconfig.json
│
├── probiotic-ui/                     # Companion app (React 19, disease-based search)
│   ├── src/
│   │   ├── App.js                    # Search + results component
│   │   └── data/
│   │       └── probiotic_db.json     # 25+ probiotic-disease associations
│   ├── public/
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📦 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | App framework with App Router |
| **React 19** | UI rendering |
| **TypeScript 5** | Type-safe application logic |
| **Tailwind CSS 4** | Utility-first styling |
| **Gemini 2.5 Flash API** | AI-powered meal analysis & gut coaching |
| **Google Fonts** | Eczar (serif headings) + Hind (sans-serif body) |
| **localStorage** | Client-side persistence for profiles, logs, and preferences |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js)
- A [Google AI Studio](https://aistudio.google.com/) API key (for Gemini features)

### Installation

```bash
# Clone the repository
git clone https://github.com/s-nandini17/GutVeda.git
cd GutVeda

# Navigate to the main app
cd "Probiotic app/probiotic-meal-scan"

# Install dependencies
npm install

# Set up your Gemini API key
echo "GEMINI_API_KEY=your_api_key_here" > .env.local

# Start the development server
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000).

### Running the Companion App (probiotic-ui)

```bash
cd probiotic-ui
npm install
npm start
```

Opens at [http://localhost:3000](http://localhost:3000) — a standalone disease-based probiotic search tool.

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes (for AI features) | Your Google Gemini API key from [AI Studio](https://aistudio.google.com/) |

Create a `.env.local` file in the `probiotic-meal-scan` directory:

```env
GEMINI_API_KEY=your_api_key_here
```

> **Note:** The app works without the API key — the AI Coach falls back to a curated rule-based response engine.

---

## 📜 Available Scripts

### probiotic-meal-scan (Main App)

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js dev server on `localhost:3000` |
| `npm run build` | Create an optimised production build |
| `npm run start` | Run the production build |
| `npm run lint` | Run ESLint checks |

### probiotic-ui (Companion App)

| Command | Description |
|---|---|
| `npm start` | Run in development mode on `localhost:3000` |
| `npm test` | Launch the test runner |
| `npm run build` | Create an optimised production build |

---

## 🗂️ Database Schema

### Probiotic Strain Database (`data.ts`)

```typescript
{
  probiotic: "Lactobacillus acidophilus",
  type: "bacteria",
  conditions: ["Bloating", "IBS", "Respiratory Infections"],
  foodSources: ["Curd", "Buttermilk", "Yogurt", "Kefir"]
}
```

### Food Source Map

```typescript
{
  id: "curd",
  name: "Curd / Dahi",
  localName: "दही",
  icon: "🥛",
  bacteria: ["Lactobacillus acidophilus", "Streptococcus thermophilus"],
  conditions: ["Bloating", "IBS", "Respiratory Infections"],
  tip: "Home-set curd fermented for 6-8 hours has 10x more live cultures...",
  lactoseSafe: false
}
```

### Indian Food Catalog

```typescript
{
  id: "idli-sambar",
  name: "Idli Sambar",
  tags: ["fermented", "light", "south-indian"],
  probiotic: true
}
```

---

## 🎨 Design System

GutVeda uses a warm, Ayurveda-inspired design language:

| Token | Value | Usage |
|---|---|---|
| `--terracotta` | `#B5451B` | Primary accent, CTAs, active states |
| `--saffron` | `#E8960C` | Secondary accent, highlights |
| `--cream` | `#FBF6EE` | Background |
| `--ink` | `#2C1A0E` | Primary text |
| `--sand` | `#D4B896` | Borders, subtle elements |
| `--green` | `#3A6B45` | Success states |

**Typography:** Eczar (serif, headings) + Hind (sans-serif, body text)

---

## 🛣️ Roadmap

- [ ] Add clinical evidence references and links to published studies
- [ ] Image-based meal scanning using Gemini Vision
- [ ] Expand the probiotic database beyond Indian cuisine
- [ ] Add detailed strain information cards (dosage, mechanism of action)
- [ ] Progressive Web App (PWA) support for offline use
- [ ] Multi-language support (Hindi, Tamil, Telugu, Kannada)
- [ ] Integration with wearable health data
- [ ] Community features — share recipes and gut health journeys

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is for **educational and research purposes**.

---

<p align="center">
  <i>Made with 🌿 for better gut health</i><br/>
  <sub>Rooted in Ayurveda · Powered by Science · Built with ❤️</sub>
</p>
