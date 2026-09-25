# CONTRIBUTING GUIDELINES
### SRI LANKA — THE JOURNEY OF A NATION

We welcome contributions from historians, economists, GIS specialists, data visualization engineers, and educators who share our commitment to rigorous, non-partisan, and fact-verified historical archives.

---

## 1. Code of Conduct & Neutrality Requirement

All contributors must adhere to the core principles defined in [`DATA_POLICY.md`](./DATA_POLICY.md):
- **Zero Partisan Bias**: Contributions containing political commentary, subjective praise, pejorative language, or political scorecards will be rejected immediately.
- **Strict Empirical Verification**: No historical fact or economic data point will be merged without an official primary citation.

---

## 2. Types of Contributions We Welcome

1. **Macroeconomic Data Updates**: Adding newly published official annual or census indicators from CBSL or DCS.
2. **Historical Timeline Enrichment**: Adding missing documented historical milestones with primary academic or parliamentary citations.
3. **Cartographic Precision**: Improving SVG coordinates, GIS boundary datasets, or historical kingdom reconstructions.
4. **UI & Accessibility Enhancements**: Improving keyboard navigation, WCAG AA contrast compliance, and performance on mobile devices.
5. **Localization**: Reviewing and refining translations in Sinhala (සිංහල) and Tamil (தமிழ்).

---

## 3. Data Contribution Verification Protocol

When proposing a new data point or historical event, you must include a structured source record adhering to this schema:

```json
{
  "title": "Exact Title of Official Report / Publication",
  "organization": "Authoring Body (e.g., Central Bank of Sri Lanka, DCS)",
  "publicationDate": "YYYY-MM-DD",
  "datasetDate": "Year or series span",
  "url": "Direct permanent URL or DOI",
  "indicator": "Indicator name and units (e.g., Million USD, % of GDP)",
  "methodology": "Brief description of calculation or base year rebasing",
  "status": "official"
}
```

---

## 4. Development Workflow

### 4.1 Local Setup
```bash
git clone https://github.com/RuTwoK/SriLanka-EYE.git
cd SriLanka-EYE
npm install --legacy-peer-deps
npm run dev
```

### 4.2 Branching Convention
- `feat/feature-name` for new interactive capabilities or modules
- `data/indicator-update` for verified dataset additions
- `fix/bug-fix` for layout, TypeScript, or logic corrections

### 4.3 Validation & Testing
Before submitting a pull request, ensure all verification checks pass:
```bash
# Typecheck TypeScript codebase
npm run typecheck

# Run unit and data integrity tests
npm run test

# Verify production build compilation
npm run build
```

---

## 5. Pull Request Checklist

Before opening a PR, ensure:
- [ ] Code strictly follows TypeScript standards with zero `any` types where possible.
- [ ] No political bias, editorial scorecards, or subjective adjectives added.
- [ ] Sourced citations are included in `src/data/sources/sources.ts`.
- [ ] Unit tests are added or updated in `src/tests/`.
- [ ] `npm run build` generates a pristine bundle without errors.
