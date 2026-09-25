import { SRI_LANKA_COASTLINE_GEO } from '@/lib/sriLankaCoastline';

export const MAP_PROJECTION_BOUNDS = {
  minLat: 5.75,
  maxLat: 9.95,
  minLng: 79.45,
  maxLng: 82.05,
};

export const SVG_CANVAS = {
  width: 500,
  height: 700,
  padding: 24,
};

/**
 * Projects latitude and longitude coordinates into the 500x700 SVG canvas.
 */
export function projectGeoToSvg(lat: number, lng: number): { x: number; y: number } {
  const { minLat, maxLat, minLng, maxLng } = MAP_PROJECTION_BOUNDS;
  const { width, height, padding } = SVG_CANVAS;
  const x = padding + ((lng - minLng) / (maxLng - minLng)) * (width - 2 * padding);
  const y = padding + ((maxLat - lat) / (maxLat - minLat)) * (height - 2 * padding);
  return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)) };
}

/**
 * Builds the authentic SVG path for the entire coastline of Sri Lanka
 * from the 68 high-precision GPS boundary coordinates.
 */
export function buildCoastlineSvgPath(): string {
  return (
    SRI_LANKA_COASTLINE_GEO.map(([lat, lng], idx) => {
      const { x, y } = projectGeoToSvg(lat, lng);
      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ') + ' Z'
  );
}

// Major Satellite Islands
export const SATELLITE_ISLANDS: { name: string; path: [number, number][] }[] = [
  // Delft Island (Neduntivu)
  {
    name: 'Delft Island (Neduntivu)',
    path: [
      [9.54, 79.64],
      [9.55, 79.72],
      [9.51, 79.74],
      [9.49, 79.67],
    ],
  },
  // Karaitivu
  {
    name: 'Karaitivu',
    path: [
      [9.73, 79.85],
      [9.75, 79.89],
      [9.70, 79.88],
    ],
  },
  // Kayts / Velanai
  {
    name: 'Velanai / Kayts',
    path: [
      [9.68, 79.89],
      [9.69, 79.94],
      [9.64, 79.93],
      [9.63, 79.88],
    ],
  },
  // Mannar Island
  {
    name: 'Mannar Island',
    path: [
      [9.105, 79.715],
      [9.080, 79.820],
      [8.980, 79.910],
      [8.950, 79.860],
      [9.050, 79.720],
    ],
  },
];

// Major Rivers of Sri Lanka
export interface RiverData {
  name: string;
  nameSi: string;
  lengthKm: number;
  coordinates: [number, number][];
}

export const MAJOR_RIVERS: RiverData[] = [
  {
    name: 'Mahaweli Ganga',
    nameSi: 'මහවැලි ගඟ',
    lengthKm: 335,
    coordinates: [
      [6.88, 80.60], // Hatton Plateau
      [7.12, 80.58], // Nawalapitiya
      [7.29, 80.64], // Kandy
      [7.35, 80.82], // Victoria Reservoir
      [7.32, 80.99], // Mahiyanganaya
      [7.85, 81.08], // Wasgamuwa / Dimbulagala
      [8.18, 81.22], // Somawathiya
      [8.45, 81.28], // Koddiyar Bay / Trincomalee
    ],
  },
  {
    name: 'Kelani Ganga',
    nameSi: 'කැලණි ගඟ',
    lengthKm: 145,
    coordinates: [
      [6.81, 80.50], // Sri Pada (Adam's Peak)
      [6.99, 80.41], // Kitulgala
      [6.93, 80.18], // Avissawella
      [6.91, 80.05], // Hanwella
      [6.96, 79.92], // Kelaniya
      [6.98, 79.86], // Modara (Colombo)
    ],
  },
  {
    name: 'Kalu Ganga',
    nameSi: 'කළු ගඟ',
    lengthKm: 129,
    coordinates: [
      [6.81, 80.50], // Sri Pada
      [6.68, 80.40], // Ratnapura
      [6.64, 80.22], // Ayagama
      [6.59, 80.08], // Tebuwana
      [6.58, 79.96], // Kalutara Bodhiya
    ],
  },
  {
    name: 'Walawe Ganga',
    nameSi: 'වලවේ ගඟ',
    lengthKm: 138,
    coordinates: [
      [6.80, 80.80], // Horton Plains
      [6.65, 80.75], // Balangoda
      [6.45, 80.85], // Udawalawe
      [6.25, 80.95], // Embilipitiya
      [6.11, 81.02], // Ambalantota
    ],
  },
  {
    name: 'Deduru Oya',
    nameSi: 'දැදුරු ඔය',
    lengthKm: 142,
    coordinates: [
      [7.48, 80.55], // Matale hills
      [7.52, 80.36], // Kurunegala
      [7.60, 80.05], // Wariyapola
      [7.58, 79.80], // Chilaw
    ],
  },
];

// Central Mountain Massif Elevation Contours
export interface ElevationContour {
  level: string;
  altitudeMeters: number;
  label: string;
  coordinates: [number, number][];
}

export const HIGHLANDS_ELEVATION: ElevationContour[] = [
  // High Mountain Peak Zone (>1,800m)
  {
    level: 'high-peaks',
    altitudeMeters: 2524,
    label: 'Central High Massif (Pidurutalagala & Horton Plains)',
    coordinates: [
      [7.05, 80.72],
      [7.02, 80.85],
      [6.88, 80.88],
      [6.78, 80.80],
      [6.80, 80.55],
      [6.95, 80.62],
      [7.05, 80.72],
    ],
  },
  // Knuckles Mountain Range (>1,500m)
  {
    level: 'knuckles',
    altitudeMeters: 1863,
    label: 'Knuckles Mountain Massif (Dumbara)',
    coordinates: [
      [7.48, 80.75],
      [7.45, 80.86],
      [7.32, 80.82],
      [7.35, 80.70],
      [7.48, 80.75],
    ],
  },
  // Adam's Peak Ridge (>2,000m)
  {
    level: 'sripada',
    altitudeMeters: 2243,
    label: "Sri Pada (Adam's Peak) Sacred Sanctuary",
    coordinates: [
      [6.84, 80.45],
      [6.83, 80.55],
      [6.78, 80.52],
      [6.79, 80.42],
      [6.84, 80.45],
    ],
  },
  // Plateau Zone (>700m Kandy / Uva basin)
  {
    level: 'plateau',
    altitudeMeters: 1000,
    label: 'Central Highland Plateau',
    coordinates: [
      [7.35, 80.58],
      [7.40, 80.75],
      [7.15, 81.05],
      [6.85, 81.12],
      [6.72, 80.95],
      [6.68, 80.55],
      [6.85, 80.35],
      [7.15, 80.45],
      [7.35, 80.58],
    ],
  },
];

// Major Strategic Infrastructure (Ports, Airports, Rail)
export interface InfrastructureNode {
  id: string;
  name: string;
  type: 'seaport' | 'airport' | 'rail-hub';
  lat: number;
  lng: number;
  significance: string;
}

export const STRATEGIC_INFRASTRUCTURE: InfrastructureNode[] = [
  {
    id: 'port-colombo',
    name: 'Port of Colombo',
    type: 'seaport',
    lat: 6.942,
    lng: 79.845,
    significance: 'Top 25 Global Transshipment Hub; handling 7.2M+ TEUs',
  },
  {
    id: 'port-hambantota',
    name: 'Hambantota International Port',
    type: 'seaport',
    lat: 6.118,
    lng: 81.115,
    significance: 'Deepwater bunkering & vehicle transshipment hub on East-West shipping line',
  },
  {
    id: 'port-trincomalee',
    name: 'Port of Trincomalee',
    type: 'seaport',
    lat: 8.572,
    lng: 81.235,
    significance: '5th largest natural harbor in the world; strategic naval & bulk terminal',
  },
  {
    id: 'port-galle',
    name: 'Galle Harbour',
    type: 'seaport',
    lat: 6.032,
    lng: 80.218,
    significance: 'Historic tourist & yacht marina port dating to Arab/Dutch maritime trade',
  },
  {
    id: 'port-kks',
    name: 'Kankesanthurai (KKS) Port',
    type: 'seaport',
    lat: 9.814,
    lng: 80.038,
    significance: 'Northern sea gateway connecting with Southern Indian ports (Nagapattinam)',
  },
  {
    id: 'airport-bia',
    name: 'Bandaranaike Int. Airport (BIA / CMB)',
    type: 'airport',
    lat: 7.180,
    lng: 79.884,
    significance: 'Primary international aviation hub serving 10M+ annual passengers',
  },
  {
    id: 'airport-mria',
    name: 'Mattala Rajapaksa Int. Airport (HRI)',
    type: 'airport',
    lat: 6.295,
    lng: 81.122,
    significance: 'Southern international gateway and air cargo diversion airfield',
  },
  {
    id: 'airport-jaf',
    name: 'Jaffna Int. Airport (Palaly / JAF)',
    type: 'airport',
    lat: 9.790,
    lng: 80.070,
    significance: 'Regional connection to Chennai and Southern India',
  },
];

// Railway Arteries
export interface RailCorridor {
  name: string;
  path: [number, number][];
}

export const RAILWAY_CORRIDORS: RailCorridor[] = [
  // Coastal Line
  {
    name: 'Coastal Line (Colombo - Galle - Matara - Beliatta)',
    path: [
      [6.935, 79.850],
      [6.835, 79.865],
      [6.585, 79.960],
      [6.425, 80.000],
      [6.025, 80.215],
      [5.948, 80.540],
      [6.040, 80.680],
    ],
  },
  // Main Line (Highland Scenic)
  {
    name: 'Main Highland Line (Colombo - Kandy - Nuwara Eliya - Badulla)',
    path: [
      [6.935, 79.850],
      [7.085, 79.995],
      [7.250, 80.340],
      [7.290, 80.635],
      [7.050, 80.680],
      [6.970, 80.780],
      [6.880, 80.920],
      [6.990, 81.055],
    ],
  },
  // Northern Line
  {
    name: 'Northern Line (Colombo - Anuradhapura - Jaffna - KKS)',
    path: [
      [6.935, 79.850],
      [7.250, 80.340],
      [7.485, 80.365],
      [8.310, 80.405],
      [8.750, 80.500],
      [9.150, 80.410],
      [9.525, 80.410],
      [9.660, 80.015],
      [9.814, 80.035],
    ],
  },
];

// 9 Historic Administrative Provinces and their approximate boundary centroids
export interface ProvinceBoundary {
  id: string;
  name: string;
  nameSi: string;
  nameTa: string;
  capital: string;
  color: string;
  center: [number, number];
  polygon: [number, number][];
}

export const PROVINCES_DATA: ProvinceBoundary[] = [
  {
    id: 'western',
    name: 'Western Province',
    nameSi: 'බස්නාහිර පළාත',
    nameTa: 'மேல் மாகாணம்',
    capital: 'Colombo',
    color: '#3b82f6',
    center: [6.85, 80.02],
    polygon: [
      [7.23, 79.84],
      [7.22, 80.20],
      [6.85, 80.25],
      [6.45, 80.12],
      [6.45, 79.98],
      [6.95, 79.85],
      [7.23, 79.84],
    ],
  },
  {
    id: 'central',
    name: 'Central Province',
    nameSi: 'මධ්‍යම පළාත',
    nameTa: 'மத்திய மாகாணம்',
    capital: 'Kandy',
    color: '#f59e0b',
    center: [7.28, 80.68],
    polygon: [
      [7.65, 80.60],
      [7.65, 80.85],
      [7.35, 81.00],
      [6.80, 80.85],
      [6.75, 80.55],
      [7.15, 80.45],
      [7.65, 80.60],
    ],
  },
  {
    id: 'southern',
    name: 'Southern Province',
    nameSi: 'දකුණු පළාත',
    nameTa: 'தென் மாகாணம்',
    capital: 'Galle',
    color: '#10b981',
    center: [6.15, 80.55],
    polygon: [
      [6.45, 80.12],
      [6.42, 80.58],
      [6.35, 81.35],
      [6.15, 81.25],
      [5.92, 80.58],
      [6.02, 80.21],
      [6.45, 80.12],
    ],
  },
  {
    id: 'northern',
    name: 'Northern Province',
    nameSi: 'උතුරු පළාත',
    nameTa: 'வட மாகாணம்',
    capital: 'Jaffna',
    color: '#8b5cf6',
    center: [9.25, 80.25],
    polygon: [
      [9.83, 80.25],
      [9.75, 79.88],
      [9.02, 79.91],
      [8.78, 80.15],
      [8.85, 80.85],
      [9.26, 80.81],
      [9.67, 80.40],
      [9.83, 80.25],
    ],
  },
  {
    id: 'eastern',
    name: 'Eastern Province',
    nameSi: 'නැගෙනහිර පළාත',
    nameTa: 'கிழக்கு மாகாணம்',
    capital: 'Trincomalee',
    color: '#06b6d4',
    center: [7.75, 81.45],
    polygon: [
      [8.99, 80.95],
      [8.57, 81.23],
      [7.71, 81.70],
      [6.84, 81.83],
      [6.62, 81.71],
      [6.80, 81.45],
      [7.65, 81.20],
      [8.50, 81.05],
      [8.99, 80.95],
    ],
  },
  {
    id: 'north-western',
    name: 'North Western Province (Wayamba)',
    nameSi: 'වයඹ පළාත',
    nameTa: 'வடமேல் மாகாணம்',
    capital: 'Kurunegala',
    color: '#ec4899',
    center: [7.75, 80.05],
    polygon: [
      [8.53, 79.87],
      [8.23, 79.76],
      [7.23, 79.84],
      [7.22, 80.20],
      [7.65, 80.55],
      [8.20, 80.35],
      [8.53, 79.87],
    ],
  },
  {
    id: 'north-central',
    name: 'North Central Province',
    nameSi: 'උතුරු මැද පළාත',
    nameTa: 'வட மத்திய மாகாணம்',
    capital: 'Anuradhapura',
    color: '#f97316',
    center: [8.35, 80.70],
    polygon: [
      [8.85, 80.35],
      [8.85, 80.85],
      [8.50, 81.05],
      [7.85, 81.08],
      [7.65, 80.60],
      [8.20, 80.35],
      [8.85, 80.35],
    ],
  },
  {
    id: 'uva',
    name: 'Uva Province',
    nameSi: 'ඌව පළාත',
    nameTa: 'ஊவா மாகாணம்',
    capital: 'Badulla',
    color: '#84cc16',
    center: [6.95, 81.25],
    polygon: [
      [7.35, 81.00],
      [7.30, 81.35],
      [6.65, 81.45],
      [6.40, 81.15],
      [6.65, 80.90],
      [7.05, 80.95],
      [7.35, 81.00],
    ],
  },
  {
    id: 'sabaragamuwa',
    name: 'Sabaragamuwa Province',
    nameSi: 'සබරගමුව පළාත',
    nameTa: 'சப்ரகமுவ மாகாணம்',
    capital: 'Ratnapura',
    color: '#a855f7',
    center: [6.80, 80.40],
    polygon: [
      [7.22, 80.20],
      [7.15, 80.45],
      [6.75, 80.55],
      [6.42, 80.58],
      [6.45, 80.12],
      [6.85, 80.25],
      [7.22, 80.20],
    ],
  },
];
