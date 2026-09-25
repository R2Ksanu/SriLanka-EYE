import * as THREE from 'three';

// 68 High-resolution geographic points defining the authentic coastal perimeter of Sri Lanka
export const SRI_LANKA_COASTLINE_GEO: [number, number][] = [
  // [latitude, longitude] clockwise from northernmost Point Pedro
  [9.835, 80.246], // Point Pedro (Northernmost tip)
  [9.814, 80.035], // Kankesanthurai (Jaffna North)
  [9.750, 79.880], // Keerimalai / Karaitivu
  [9.680, 79.860], // Kayts / Jaffna Islands
  [9.660, 80.015], // Jaffna Town & Lagoon
  [9.650, 80.160], // Chavakachcheri
  [9.525, 80.410], // Elephant Pass (Isthmus)
  [9.500, 80.200], // Pooneryn
  [9.250, 80.140], // Nachchikuda
  [9.020, 80.030], // Vidattaltivu
  [8.980, 79.910], // Mannar Causeway
  [9.105, 79.715], // Talaimannar (Adam's Bridge projection)
  [9.080, 79.820], // Pesalai
  [8.910, 79.920], // Vankalai
  [8.780, 79.910], // Arippu
  [8.680, 79.920], // Silavaturai
  [8.530, 79.870], // Wilpattu / Kudiramalai Point
  [8.230, 79.760], // Kalpitiya Peninsula Tip
  [8.160, 79.710], // Kandakuliya
  [8.000, 79.730], // Dutch Bay / Puttalam Lagoon
  [7.575, 79.795], // Chilaw
  [7.420, 79.815], // Marawila
  [7.210, 79.840], // Negombo Lagoon
  [6.985, 79.865], // Kelani River Mouth
  [6.940, 79.845], // Colombo Port & Fort
  [6.835, 79.863], // Mount Lavinia
  [6.713, 79.907], // Panadura
  [6.585, 79.960], // Kalutara (Kalu Ganga)
  [6.475, 79.980], // Beruwala
  [6.425, 80.000], // Bentota
  [6.235, 80.052], // Ambalangoda
  [6.140, 80.100], // Hikkaduwa
  [6.025, 80.215], // Galle Dutch Fort Promontory
  [5.970, 80.430], // Weligama Bay
  [5.945, 80.455], // Mirissa
  [5.948, 80.540], // Matara
  [5.923, 80.588], // Dondra Head (Southernmost Tip)
  [5.965, 80.690], // Dickwella
  [6.024, 80.795], // Tangalle
  [6.085, 80.930], // Ranna / Kalametiya
  [6.115, 81.020], // Ambalantota
  [6.124, 81.121], // Hambantota Bay & Port
  [6.170, 81.240], // Bundala
  [6.210, 81.335], // Kirinda
  [6.270, 81.420], // Palatupana (Yala)
  [6.375, 81.525], // Patanangala Coast
  [6.620, 81.710], // Kumana
  [6.755, 81.805], // Panama
  [6.845, 81.835], // Arugam Bay Point
  [7.000, 81.865], // Komari
  [7.120, 81.850], // Thirukkovil
  [7.220, 81.850], // Akkaraipattu
  [7.415, 81.830], // Kalmunai
  [7.710, 81.705], // Batticaloa Lagoon
  [7.775, 81.600], // Eravur
  [7.920, 81.560], // Pasikudah Bay
  [8.140, 81.430], // Vakarai
  [8.260, 81.365], // Verugal (Mahaweli Delta)
  [8.520, 81.315], // Foul Point
  [8.450, 81.265], // Mutur / Koddiyar Bay
  [8.575, 81.233], // Trincomalee Natural Harbor
  [8.685, 81.200], // Uppuveli / Nilaveli
  [8.820, 81.095], // Kuchchaveli
  [8.990, 80.950], // Kokkilai Lagoon
  [9.120, 80.875], // Nayaru Lagoon
  [9.265, 80.814], // Mullaitivu
  [9.500, 80.590], // Chundikkulam
  [9.670, 80.400], // Vadamarachchi East
];

const CENTER_LAT = 7.85;
const CENTER_LNG = 80.78;
const SCALE_LAT = 2.05;
const SCALE_LNG = 2.15;

/**
 * Projects real geographic (lat, lng) to 2D Shape coordinate space (X, Y)
 */
export function projectGeoToShape(lat: number, lng: number): [number, number] {
  const x = (lng - CENTER_LNG) * SCALE_LNG;
  const y = (lat - CENTER_LAT) * SCALE_LAT;
  return [x, y];
}

/**
 * Builds the authentic THREE.Shape for the Sri Lanka Island
 */
export function createSriLankaIslandShape(): THREE.Shape {
  const shape = new THREE.Shape();
  const [firstX, firstY] = projectGeoToShape(
    SRI_LANKA_COASTLINE_GEO[0][0],
    SRI_LANKA_COASTLINE_GEO[0][1]
  );
  shape.moveTo(firstX, firstY);

  for (let i = 1; i < SRI_LANKA_COASTLINE_GEO.length; i++) {
    const [x, y] = projectGeoToShape(
      SRI_LANKA_COASTLINE_GEO[i][0],
      SRI_LANKA_COASTLINE_GEO[i][1]
    );
    shape.lineTo(x, y);
  }

  shape.closePath();
  return shape;
}

/**
 * Calculates geographic mountain elevation for Central Highlands
 * Center of Pidurutalagala / Nuwara Eliya massif: Lat 7.00°N, Lng 80.77°E
 */
export function calculateHighlandElevation(lat: number, lng: number): number {
  const dist = Math.sqrt(
    Math.pow((lat - 7.05) * 1.1, 2) + Math.pow(lng - 80.75, 2)
  );
  // Knuckles range secondary peak: Lat 7.45°N, Lng 80.80°E
  const distKnuckles = Math.sqrt(
    Math.pow((lat - 7.42) * 1.1, 2) + Math.pow(lng - 80.78, 2)
  );

  let elevation = 0;
  if (dist < 0.85) {
    elevation += Math.pow((0.85 - dist) / 0.85, 1.8) * 1.6;
  }
  if (distKnuckles < 0.45) {
    elevation += Math.pow((0.45 - distKnuckles) / 0.45, 1.5) * 0.7;
  }
  return elevation;
}
