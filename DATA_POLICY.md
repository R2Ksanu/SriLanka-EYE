# DATA POLICY & RESEARCH STANDARDS
### SRI LANKA — THE JOURNEY OF A NATION

This policy outlines the non-negotiable data curation, verification, and editorial principles governing all quantitative datasets, historical chronologies, and multimedia archives published on **Sri Lanka — The Journey of a Nation**.

---

## 1. Core Operating Principles

### 1.1 Non-Partisanship & Absolute Political Neutrality
- **No Political Propaganda**: The platform does not endorse, praise, or attack political parties, administrations, heads of state, ethnic communities, religious institutions, or socioeconomic ideologies.
- **Prohibition of Political Scoring**: Under no circumstances shall the platform generate "best/worst president", "performance index", "scorecards", "rankings", or subjective political assessments.
- **Documented Facts Only**: Leadership biographies are strictly restricted to verifiable dates, constitutional offices, gazetted legislation, and official macroeconomic metrics compiled during their respective tenures.

### 1.2 Non-Causal Temporal Presentation
- Macroeconomic indicators recorded during a leadership period are presented as temporal context, **never as single-source causal proof**.
- A prominent disclaimer accompanies all economic and presidential comparative dashboards:
  > *"Indicators shown during an administration's period should not be interpreted as proving that the administration alone caused those changes. Macroeconomic and social outcomes are shaped by a complex interplay of international commodity cycles, climatic events, long-term multi-decade structural shifts, and domestic policies."*

### 1.3 Absolute Prohibition of Fabricated or Placeholder Data
- No synthetic arrays, randomized placeholder numbers, or "Lorem ipsum" text are permitted.
- If data for a specific year, indicator, or district is unrecorded or unavailable in official records, it must be explicitly labeled:
  ```json
  { "status": "unavailable", "note": "Data unavailable for this period." }
  ```

---

## 2. Primary Source Hierarchy & Priority

All numerical records and constitutional dates must strictly trace back to primary official archives in order of precedence:

1. **Central Bank of Sri Lanka (CBSL)**:
   - Annual Economic Reviews (1950–Present).
   - Long-Term Time Series of Economic and Social Statistics.
   - Monthly Economic Indicators and External Sector Releases.
2. **Department of Census and Statistics (DCS)**:
   - National Censuses of Population and Housing (1871–2024).
   - Household Income and Expenditure Surveys (HIES).
   - National Accounts Estimates (Rebased Series).
3. **Parliament of Sri Lanka**:
   - Hansard Parliamentary Debates.
   - Constitutional Acts, Enactments, and Gazette Extraordinary notifications.
4. **Presidential Secretariat of Sri Lanka**:
   - Official Gazettes of Presidential Proclamations, inaugurations, and term durations.
5. **Ministry of Finance, Economic Stabilization and National Policies**:
   - Annual Budget Estimates, Fiscal Management Reports, and Public Debt Bulletins.
6. **International Institutional Multilaterals**:
   - The World Bank Group (World Development Indicators - WDI).
   - International Monetary Fund (World Economic Outlook - WEO & EFF Staff Reports).
   - United Nations Department of Economic and Social Affairs (UN DESA Population Division).
   - UNESCO World Heritage Centre.

---

## 3. Macroeconomic Data Conventions

### 3.1 Currency & Methodology Distinctions
To prevent misleading statistical comparisons, all monetary metrics must explicitly indicate:
- **Nominal vs. Real**: Nominal indicators reflect current prices; Real indicators reflect constant prices adjusted for inflation.
- **Currency of Record**: Indicators in Sri Lankan Rupees (LKR) and United States Dollars (USD) must not be interchanged without noting the contemporaneous exchange rate.
- **Base Year Rebasing**: Historical GDP data in Sri Lanka has undergone multiple official base year rebasings by the DCS (e.g., base years 1982, 1996, 2002, 2010, and 2015). Any chart spanning multiple rebased periods must display a methodology notice:
  > *"Series revised by source according to periodic national accounts rebasing."*

### 3.2 Handling Data Revisions & Discrepancies
When two reputable official sources publish differing estimates for the same indicator (e.g., provisional vs. final CBSL numbers or differences between DCS national accounts and World Bank Atlas conversions):
1. The platform shall document both series.
2. A methodology tooltip must explain: *"Different statistical methodologies or revision vintages."*

---

## 4. Historical Cartography & Geographic Reconstructions

1. **Approximate Reconstructions**: Maps depicting pre-modern kingdom boundaries (e.g., Kotte, Kandy, Jaffna, Sitawaka) must be explicitly captioned:
   > *"Approximate historical reconstruction based on contemporary chronicles and academic research. Pre-modern territorial spheres were fluid and do not represent surveyed borderlines."*
2. **Cartographic Precision**: Modern provincial and district polygons are strictly aligned with the official boundary datasets of the Survey Department of Sri Lanka and Department of Census and Statistics.

---

## 5. Projections and Future Scenarios

1. **Strict Non-Forecast Labeling**: Projections beyond the current year must **never** be presented as guaranteed predictions or government promises.
2. **Category Segmentation**: Future data points must be categorized as either:
   - *Official Baseline Forecast* (e.g., IMF EFF or CBSL Medium-Term Framework).
   - *Institutional Projection* (e.g., UN DESA demographic median variant).
   - *Illustrative Scenario* (e.g., user-adjusted educational simulations).
3. All educational simulations must feature the disclaimer:
   > *"Illustrative scenario for educational modeling — not an official forecast."*

---

## 6. Multimedia & Image Licensing Standards

1. No copyrighted photographs, artworks, or maps may be hosted without verified licensing authorization.
2. Permitted asset categories:
   - Public Domain archives (e.g., pre-1950 colonial photography).
   - Creative Commons licenses (CC0, CC BY, CC BY-SA) with full attribution to original authors and institutions.
   - Official Sri Lanka Government open-access publications.
3. Every image asset in the repository must maintain an active entry in the asset manifest including:
   `title`, `date`, `credit`, `license`, and `sourceUrl`.
