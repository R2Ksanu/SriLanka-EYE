# SRI LANKA — THE JOURNEY OF A NATION
### *History • People • Economy • Leadership • Geography • Future*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Deploy to GitHub Pages](https://github.com/RuTwoK/SriLanka-EYE/actions/workflows/deploy.yml/badge.svg)](https://github.com/RuTwoK/SriLanka-EYE/actions/workflows/deploy.yml)
[![Node Version](https://img.shields.io/badge/node-v22%2B-blue)](https://nodejs.org)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18%2F19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-r171-black?logo=three.js)](https://threejs.org/)

An interactive digital museum, verified macroeconomic intelligence archive, historical atlas, and 3D GIS visualization platform chronicling Sri Lanka's journey from ancient hydraulic civilizations to the economy of tomorrow.

---

## 🏛️ Core Vision & Standards

1. **Strict Political Neutrality & Factual Integrity**:
   - Educational, non-partisan, and fact-driven.
   - Zero "performance rankings", "best/worst" judgments, or political scorecards.
   - Documented milestones, constitutional transitions, and empirical macroeconomic metrics presented without partisan editorializing.
   - Explicit disclaimers guarding against false causal attribution between macroeconomic swings and single administrative tenures.

2. **Verified Empirical Sourcing**:
   - Central Bank of Sri Lanka (CBSL) Annual Economic Reviews & Long-Term Series.
   - Department of Census and Statistics (DCS) National Population & Housing Censuses (1871–2024).
   - Parliament of Sri Lanka and Presidential Secretariat official constitutional gazettes.
   - World Bank World Development Indicators (WDI) and IMF World Economic Outlook (WEO).
   - UNESCO World Heritage Centre archaeological records.

3. **Digital Museum & Data-Visualization Aesthetic**:
   - Editorial dark titanium interface (`#07090e`, `#0b0f17`, `#141c2c`) with subtle gold (`#cfa935`) and sapphire accents.
   - Precision typography with Cinzel, Inter, and JetBrains Mono.
   - Responsive layouts optimized from mobile screens (360px) to ultra-wide 4K workstations (1920px+).

---

## 🚀 Key Modules & Capabilities

- **Interactive 3D Sri Lanka Island Hero**:
  - WebGL/Three.js terrain elevation model depicting the Central Highlands, Pidurutalagala, Adam’s Peak, and Sigiriya.
  - Smooth camera orbit, rotational inertia, atmospheric dust shaders, and interactive regional nodes.
- **National Timeline (c. 250 BCE to Present)**:
  - Horizontally scrollable and zoomable chronology across Ancient, Medieval, Colonial, Independence, Republic, Executive Presidency, Modern, and Current eras.
  - Multi-category filtering: Politics, Economy, War/Conflict, Technology, Infrastructure, Population, Education, Healthcare, Environment, Culture, International Relations.
  - Rich slide-over inspector detailing historical context, significance, archive imagery, and synchronised macroeconomic metrics.
- **Macroeconomic Evolution Dashboard**:
  - 20+ responsive interactive charts powered by Recharts (Nominal vs Real GDP, USD vs LKR, GDP per capita, Inflation, Exchange Rate, Trade Deficits, Debt-to-GDP, Gross Reserves, Tourism, Remittances, and Sector Shifts).
  - Built-in CSV and JSON dataset download engines for researchers.
  - Transparent methodology notes documenting national account base year rebasing (1982, 1996, 2002, 2010, 2015).
- **People of Sri Lanka & Demographic Counter**:
  - Live animated national population counter tied directly to the data layer.
  - Census milestone registry spanning all 15 national decennial enumerations (1871–2024).
  - Dynamic 2024 DCS population age-sex pyramid and life expectancy trajectory (1871: 34.0 yrs → 2024: 77.2 yrs).
- **Leadership Explorer & Comparative Era Engine**:
  - Chronological explorer of all heads of government and state across three constitutional eras (1947–Present).
  - Side-by-side **Era Comparison Tool** allowing empirical comparison of economic indicators during any two administrations.
- **2D & 3D Geographic Information Systems (GIS)**:
  - Interactive district explorer covering all 25 districts across 9 provinces with 2024 census densities, industries, and landmarks.
  - **Historical Time Map Mode** (1500 to Present) rendering kingdom boundaries (Kotte, Kandy, Jaffna, Vanni), colonial fortifications, and strategic maritime ports with explicit historical reconstruction disclosures.
- **Time Machine (Year Explorer)**:
  - Direct temporal jump to any year (e.g., 1948, 1977, 1983, 2004, 2009, 2019, 2022, 2024).
  - Synchronizes leader in office, population count, GDP, inflation, exchange rate, and major events in real time.
- **Future Scenario Modeling (2026–2050)**:
  - Verified UN DESA, IMF, and World Bank institutional projections.
  - Interactive educational scenario simulator allowing parameter tuning for GDP growth, population change, and renewable energy adoption.
- **Multilingual Architecture**:
  - Seamless localization support for **English**, **සිංහල (Sinhala)**, and **தமிழ் (Tamil)**.
- **Developer Data Audit Suite**:
  - Real-time client-side verification engine auditing dataset continuity, missing years, duplicate timestamps, and boundary conditions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [React 18](https://react.dev/) + [TypeScript 5](https://www.typescriptlang.org/) |
| **Build & Bundler** | [Vite 6](https://vitejs.dev/) with relative asset paths for GitHub Pages |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) + PostCSS + Custom Museum Theme |
| **3D Graphics** | [Three.js r171](https://threejs.org/) (WebGL Canvas, shaders, orbital controls) |
| **Visualizations** | [Recharts](https://recharts.org/) + SVG Vector GIS Cartography |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Testing** | [Vitest](https://vitest.dev/) for mathematical and dataset integrity validation |
| **CI/CD** | GitHub Actions (`.github/workflows/deploy.yml`) for automated GitHub Pages hosting |

---


## 📜 Documentation & Governance

- [`DATA_POLICY.md`](./DATA_POLICY.md) — Comprehensive rules on statistical sourcing, revision vintage, political neutrality, and image licensing.
- [`SERVICE_POLICY.md`](./SERVICE_POLICY.md) — Terms of service, educational usage guidelines, and data disclaimers.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — Contribution guidelines, data proposal verification workflows, and coding standards.

---

## ⚖️ License & Attribution

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for more details.

Designed and developed by **RuTwoK Labs** as an open educational resource celebrating Sri Lanka’s history, heritage, and future.
