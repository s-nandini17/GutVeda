# 🦠 Probiotic Recommendation App

A React-based web application that helps users discover **probiotic strains** and **fermented food sources** tailored to specific health conditions. Search by disease or symptom and instantly get evidence-informed probiotic recommendations.

---

## ✨ Features

- **Disease-Based Search** — Type a condition (e.g. *Bloating*, *Type 2 Diabetes*) and get matching probiotic recommendations in real time.
- **Probiotic Strain Details** — View the specific bacterial strains recommended for each condition.
- **Food Source Mapping** — See natural and fermented food sources (yogurt, kimchi, kefir, tempeh, etc.) for each probiotic.
- **Curated Database** — Built-in JSON database covering 25+ probiotic-disease associations across multiple health domains.

---

## 🧬 Health Conditions Covered

| Category | Conditions |
|---|---|
| **Gastrointestinal** | Bloating, IBS (IBS-M, IBS-D, IBS-C), E. coli resistance |
| **Metabolic** | Type 2 Diabetes |
| **Respiratory** | Respiratory Infections |
| **Oncology** | Colorectal Cancer (supportive) |
| **Mental Health** | Stress-Related Disorders |
| **Gut Biochemistry** | SCFA Production, Anti-Inflammatory Effects |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or later)
- npm (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd probiotic-ui

# Install dependencies
npm install

# Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

---

## 📦 Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Create React App** | Build tooling & dev server |
| **JavaScript (ES6+)** | Application logic |
| **JSON** | Local probiotic database |

---

## 📁 Project Structure

```
probiotic-ui/
├── public/
│   ├── index.html          # HTML entry point
│   ├── manifest.json       # PWA manifest
│   └── ...
├── src/
│   ├── App.js              # Main application component (search + results)
│   ├── App.css             # Application styles
│   ├── index.js            # React entry point
│   ├── index.css           # Global styles
│   └── data/
│       └── probiotic_db.json   # Curated probiotic-disease database
├── package.json
└── README.md
```

---

## 🗂️ Database Schema

Each entry in `probiotic_db.json` follows this structure:

```json
{
  "disease": "Bloating",
  "probiotic": "Lactobacillus acidophilus",
  "food_sources": ["Curd", "buttermilk"],
  "evidence": ""
}
```

| Field | Type | Description |
|---|---|---|
| `disease` | `string` | Health condition or symptom |
| `probiotic` | `string` | Recommended probiotic strain(s) |
| `food_sources` | `string[]` | Natural food sources containing the probiotic |
| `evidence` | `string` | Clinical evidence reference (placeholder for future use) |

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm start` | Run the app in development mode on `localhost:3000` |
| `npm test` | Launch the test runner in interactive watch mode |
| `npm run build` | Create an optimised production build in `build/` |

---

## 🛣️ Roadmap

- [ ] Add clinical evidence references and links to studies
- [ ] Expand the probiotic database with more conditions
- [ ] Add detailed strain information cards (dosage, mechanism of action)
- [ ] Implement filtering by food source or probiotic strain
- [ ] Dark mode and responsive mobile layout
- [ ] Integration with external APIs for real-time research updates

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

---

## 📄 License

This project is for educational and research purposes.
