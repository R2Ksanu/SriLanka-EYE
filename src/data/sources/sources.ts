import { DataSource } from '@/types';

export const DATA_SOURCES: DataSource[] = [
  {
    id: 'cbsl-annual-economic-review',
    title: 'Central Bank of Sri Lanka — Annual Economic Review & Long-Term Series',
    organization: 'Central Bank of Sri Lanka (CBSL)',
    publicationDate: '2024-04-30',
    datasetDate: '1950–2024',
    url: 'https://www.cbsl.gov.lk',
    indicator: 'GDP, Per Capita GDP, Inflation, Exchange Rate, Trade, Public Debt, Reserves',
    methodology: 'Compilation from national accounts (base years 1982, 1996, 2002, 2010, 2015), external sector statistics, and fiscal operations reports.',
    license: 'Official Sri Lanka Government Open Publication',
    notes: 'Primary benchmark for official macroeconomic statistics. Methodology revisions occur periodically with base year rebasing.'
  },
  {
    id: 'dcs-census-2024',
    title: 'Census of Population and Housing Sri Lanka — 2024 Final & Historical Series',
    organization: 'Department of Census and Statistics (DCS)',
    publicationDate: '2024-11-15',
    datasetDate: '1871–2024',
    url: 'http://www.statistics.gov.lk',
    indicator: 'Population Count, Density, Age Cohorts, District & Provincial Breakdown, Urbanization',
    methodology: 'Full national enumerations conducted decennially since 1871 (except war-affected partial counts in 1981 and 2001). Digital tablet enumeration in 2024.',
    license: 'Official Sri Lanka Government Open Data',
    notes: 'The 2024 census was the first fully digital national census conducted in Sri Lanka.'
  },
  {
    id: 'world-bank-wdi',
    title: 'World Development Indicators: Sri Lanka Development Profile',
    organization: 'The World Bank Group',
    publicationDate: '2024-07-01',
    datasetDate: '1960–2024',
    url: 'https://databank.worldbank.org/source/world-development-indicators',
    indicator: 'GDP (Current USD, Constant 2015 USD, PPP), Life Expectancy, Labour Force, Poverty Headcount',
    methodology: 'Internationally standardized definitions aligned with SNA 2008 and World Bank Atlas methodology.',
    license: 'Creative Commons Attribution 4.0 International (CC BY 4.0)',
    notes: 'Cross-checked against CBSL national accounts for currency conversion parity.'
  },
  {
    id: 'parliament-sl-history',
    title: 'Parliament of Sri Lanka — Constitutional History & Leadership Archive',
    organization: 'Parliament of Sri Lanka',
    publicationDate: '2024-09-25',
    datasetDate: '1947–Present',
    url: 'https://www.parliament.lk',
    indicator: 'Heads of State, Prime Ministers, Constitutional Enactments, Hansard Records',
    methodology: 'Official parliamentary registers and gazetted constitutional records.',
    license: 'Parliament of Sri Lanka Official Record',
    notes: 'Authoritative record of dates of office, constitutional amendments, and terms.'
  },
  {
    id: 'presidential-secretariat',
    title: 'Presidential Secretariat Official Directory & Chronology',
    organization: 'Presidential Secretariat of Sri Lanka',
    publicationDate: '2024-09-23',
    datasetDate: '1972–Present',
    url: 'https://www.presidentsoffice.gov.lk',
    indicator: 'Presidential Terms, Official Gazettes, Proclamations',
    methodology: 'Official gazetted dates of inauguration, election results, and gazetted notifications.',
    license: 'Official State Record',
    notes: 'Verified source for dates of assumption of office and constitutional roles.'
  },
  {
    id: 'imf-weo-sri-lanka',
    title: 'International Monetary Fund — World Economic Outlook Database',
    organization: 'International Monetary Fund (IMF)',
    publicationDate: '2024-10-15',
    datasetDate: '1980–2029 (Projections)',
    url: 'https://www.imf.org/en/Publications/WEO',
    indicator: 'Inflation, General Government Gross Debt, Current Account, External Financing',
    methodology: 'IMF Article IV Consultation staff reports and Extended Fund Facility (EFF) review data.',
    license: 'IMF Copyright / Free Open Access',
    notes: 'Used for medium-term baseline projections under the 2023–2027 Extended Fund Facility program.'
  },
  {
    id: 'unesco-world-heritage',
    title: 'UNESCO World Heritage Centre — Cultural & Natural Heritage of Sri Lanka',
    organization: 'UNESCO',
    publicationDate: '2023-01-01',
    datasetDate: 'Ancient–Present',
    url: 'https://whc.unesco.org/en/statesparties/lk',
    indicator: 'Archaeological Chronicles, Ancient Hydraulic Civilizations, Cultural Sites',
    methodology: 'Peer-reviewed archaeological excavation and conservation documentation.',
    license: 'Public Educational Information',
    notes: 'Authoritative data on Anuradhapura, Polonnaruwa, Sigiriya, Kandy, Galle Fort, and Sinharaja.'
  },
  {
    id: 'un-population-projections',
    title: 'United Nations Department of Economic and Social Affairs — World Population Prospects',
    organization: 'United Nations DESA / Population Division',
    publicationDate: '2024-07-11',
    datasetDate: '1950–2100',
    url: 'https://population.un.org/wpp/',
    indicator: 'Demographic Projections (Median, High, Low variants), Dependency Ratios, Aging Index',
    methodology: 'Cohort-component projection model based on verified empirical fertility, mortality, and migration rates.',
    license: 'Creative Commons Attribution 3.0 IGO',
    notes: 'Benchmark for future demographic scenarios up to 2050.'
  }
];
