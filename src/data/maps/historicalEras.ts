import { HistoricalMapEra } from '@/types';

export const HISTORICAL_MAP_ERAS: HistoricalMapEra[] = [
  {
    id: 'era-1505',
    year: 1505,
    label: '1505 CE',
    periodName: 'Arrival of the Portuguese & Three Dominant Kingdoms',
    description: 'Island politically divided among three major indigenous realms: the Kingdom of Kotte (southwestern maritime plain), the Kingdom of Kandy (central mountainous highlands), and the Kingdom of Jaffna (northern peninsula and islands), alongside semi-independent Vanni chieftaincies.',
    disclaimer: 'Approximate historical reconstruction based on contemporary Portuguese cartography, Rajavaliya, and University of Ceylon History of Ceylon.',
    territorialDivisions: [
      {
        name: 'Kingdom of Kotte',
        entityType: 'Kingdom',
        rulerOrPower: 'King Dharma Parakramabahu IX',
        capital: 'Sri Jayawardenepura Kotte',
        color: '#d97706',
        description: 'Primary sovereign power controlling southwestern wet zone, maritime trade ports, and cinnamon cultivation.',
        keyCenters: [
          { name: 'Kotte (Royal Capital)', lat: 6.8906, lng: 79.9075 },
          { name: 'Kolomtota (Colombo Port)', lat: 6.9401, lng: 79.8438 },
          { name: 'Galle Harbour', lat: 6.0329, lng: 80.2168 }
        ]
      },
      {
        name: 'Kingdom of Kandy (Senkadagala)',
        entityType: 'Kingdom',
        rulerOrPower: 'King Senasammata Vikramabahu',
        capital: 'Senkadagalapura (Kandy)',
        color: '#dc2626',
        description: 'Highland mountain kingdom protected by natural topography, controlling the central massif and eastern passes.',
        keyCenters: [
          { name: 'Senkadagala (Kandy)', lat: 7.2906, lng: 80.6337 },
          { name: 'Gampola', lat: 7.1643, lng: 80.5764 }
        ]
      },
      {
        name: 'Kingdom of Jaffna (Aryacakravarti)',
        entityType: 'Kingdom',
        rulerOrPower: 'King Pararajasekaram',
        capital: 'Nallur',
        color: '#2563eb',
        description: 'Northern kingdom controlling the Jaffna peninsula, Mannar pearl fisheries, and northern waterways.',
        keyCenters: [
          { name: 'Nallur (Capital)', lat: 9.6744, lng: 80.0298 },
          { name: 'Mantai (Ancient Port)', lat: 8.9567, lng: 79.9400 }
        ]
      },
      {
        name: 'Vanni Chieftaincies',
        entityType: 'Vanniar Chieftaincy',
        rulerOrPower: 'Vanniar Lords',
        capital: 'Regional Strongholds',
        color: '#059669',
        description: 'Buffer autonomous principalities across the dry zone forests maintaining tributary ties to both Kandy and Jaffna.',
        keyCenters: [
          { name: 'Mullaitivu Coast', lat: 9.2671, lng: 80.8142 },
          { name: 'Trincomalee Environs', lat: 8.5874, lng: 81.2152 }
        ]
      }
    ],
    strategicPorts: [
      { name: 'Colombo (Kolomtota)', lat: 6.9401, lng: 79.8438, role: 'Primary cinnamon export harbour', controlledBy: 'Kingdom of Kotte' },
      { name: 'Galle', lat: 6.0329, lng: 80.2168, role: 'Southern port of call for Asian and Arab merchants', controlledBy: 'Kingdom of Kotte' },
      { name: 'Trincomalee (Gokanna)', lat: 8.5874, lng: 81.2152, role: 'Deep natural harbour servicing Bay of Bengal trade', controlledBy: 'Kingdom of Kotte / Local chiefs' }
    ]
  },
  {
    id: 'era-1658',
    year: 1658,
    label: '1658 CE',
    periodName: 'Dutch Maritime Hegemony & Sovereign Kingdom of Kandy',
    description: 'The Dutch East India Company (VOC) successfully wrested all maritime coastal forts from the Portuguese (Colombo captured in 1656, Jaffna in 1658). The independent Kingdom of Kandy under King Rajasinha II maintained sovereignty over the entire central highlands and eastern seaboard.',
    disclaimer: 'Approximate historical reconstruction based on VOC archival treaties and Kandyan administrative boundaries.',
    territorialDivisions: [
      {
        name: 'Dutch East India Company (VOC) Maritime Ceylon',
        entityType: 'Colonial Territory',
        rulerOrPower: 'Governor Rijckloff van Goens / VOC',
        capital: 'Colombo (Kasteel van Colombo)',
        color: '#f59e0b',
        description: 'Coastal maritime strip extending from Kalpitiya through Colombo, Galle, Matara, Batticaloa, and Jaffna. Monopolized cinnamon, areca nut, and elephant trade.',
        keyCenters: [
          { name: 'Castle of Colombo', lat: 6.9367, lng: 79.8441 },
          { name: 'Galle Fort', lat: 6.0329, lng: 80.2168 },
          { name: 'Jaffna Fort', lat: 9.6615, lng: 80.0155 }
        ]
      },
      {
        name: 'Kingdom of Kandy',
        entityType: 'Kingdom',
        rulerOrPower: 'King Rajasinha II',
        capital: 'Kandy (Mahanuwara)',
        color: '#dc2626',
        description: 'Sovereign mountain kingdom holding the mountain interior and periodically contesting coastal control via eastern ports (Kottiyar / Trincomalee).',
        keyCenters: [
          { name: 'Kandy (Palace & Dalada Maligawa)', lat: 7.2936, lng: 80.6413 },
          { name: 'Hanguranketha (Secondary Royal Seat)', lat: 7.1856, lng: 80.7812 },
          { name: 'Badulla (Uva Dissawani)', lat: 6.9895, lng: 81.0557 }
        ]
      }
    ],
    strategicPorts: [
      { name: 'Colombo Fortress', lat: 6.9367, lng: 79.8441, role: 'Chief VOC administrative and trade headquarters', controlledBy: 'Dutch VOC' },
      { name: 'Galle Bay', lat: 6.0329, lng: 80.2168, role: 'Primary VOC naval fleet repair and export depot', controlledBy: 'Dutch VOC' },
      { name: 'Kottiyar Bay (Trincomalee)', lat: 8.5200, lng: 81.2500, role: 'Strategic natural harbour used by Kandyan diplomatic missions', controlledBy: 'Contested (Kandy / VOC)' }
    ]
  },
  {
    id: 'era-1815',
    year: 1815,
    label: '1815 CE',
    periodName: 'British Crown Colony & Annexation of Kandy',
    description: 'Following the 1796 British capture of VOC territories and the 1815 Kandyan Convention, the British Crown unified the entire island under a single colonial administrative apparatus for the first time.',
    disclaimer: 'Accurate cartographic representation based on British Surveyor General records and 1833 Colebrooke-Cameron unified administrative divisions.',
    territorialDivisions: [
      {
        name: 'British Colony of Ceylon',
        entityType: 'Colonial Territory',
        rulerOrPower: 'Governor Sir Robert Brownrigg / British Crown',
        capital: 'Colombo',
        color: '#be123c',
        description: 'Direct colonial rule across the island. The 1818 Uva-Wellassa Great Rebellion and 1848 Matale Rebellion challenged British authority before full pacification.',
        keyCenters: [
          { name: 'Queen’s House, Colombo', lat: 6.9367, lng: 79.8441 },
          { name: 'Kandy Garrison & Residency', lat: 7.2936, lng: 80.6413 },
          { name: 'Fort Frederick, Trincomalee (Royal Navy Base)', lat: 8.5772, lng: 81.2394 }
        ]
      }
    ],
    strategicPorts: [
      { name: 'Colombo Port', lat: 6.9401, lng: 79.8438, role: 'South Asian transshipment hub after construction of the Southwest Breakwater (1875–1885)', controlledBy: 'British Crown Colony' },
      { name: 'Trincomalee Naval Base', lat: 8.5874, lng: 81.2152, role: 'Strategic Royal Navy Eastern Fleet anchorage', controlledBy: 'British Royal Navy' }
    ]
  },
  {
    id: 'era-1948',
    year: 1948,
    label: '1948 CE',
    periodName: 'Independent Dominion of Ceylon',
    description: 'Restoration of sovereign constitutional self-governance as a Dominion within the Commonwealth. Administered under nine historical provinces (Western, Central, Southern, Northern, Eastern, North Western, North Central, Uva, Sabaragamuwa).',
    disclaimer: 'Official survey boundaries established by the Department of the Surveyor General of Ceylon.',
    territorialDivisions: [
      {
        name: 'Dominion of Ceylon',
        entityType: 'Sovereign Republic',
        rulerOrPower: 'Prime Minister D.S. Senanayake & Cabinet',
        capital: 'Colombo',
        color: '#0d9488',
        description: 'Sovereign parliamentary democracy comprising 9 provinces, developing major multi-purpose colonization schemes (Gal Oya).',
        keyCenters: [
          { name: 'Colombo (Capital & Parliament)', lat: 6.9319, lng: 79.8478 },
          { name: 'Ampara / Gal Oya Basin', lat: 7.2912, lng: 81.6724 },
          { name: 'Kandy (Cultural Capital)', lat: 7.2906, lng: 80.6337 },
          { name: 'Jaffna', lat: 9.6615, lng: 80.0255 }
        ]
      }
    ],
    strategicPorts: [
      { name: 'Port of Colombo', lat: 6.9401, lng: 79.8438, role: 'Chief commercial container and passenger gateway', controlledBy: 'Ceylon Port Commission' },
      { name: 'Trincomalee Harbour', lat: 8.5874, lng: 81.2152, role: 'Naval base transferred to Royal Ceylon Navy in 1957', controlledBy: 'Ceylon Defense' }
    ]
  },
  {
    id: 'era-modern',
    year: 2024,
    label: 'Present (2024+)',
    periodName: 'Democratic Socialist Republic of Sri Lanka',
    description: 'Unitary sovereign republic comprising 9 Provinces and 25 Administrative Districts, integrated via modern expressways, deep-water ports (Colombo, Hambantota), and fiber/4G/5G telecommunications infrastructure.',
    disclaimer: 'Official administrative boundary dataset from the Survey Department and Department of Census and Statistics.',
    territorialDivisions: [
      {
        name: 'Republic of Sri Lanka',
        entityType: 'Sovereign Republic',
        rulerOrPower: 'President Anura Kumara Dissanayake & Parliament',
        capital: 'Sri Jayawardenepura Kotte (Administrative) / Colombo (Commercial)',
        color: '#cfa935',
        description: 'Constitutional democracy organized into 9 Provincial Councils and 25 District Secretariats.',
        keyCenters: [
          { name: 'Colombo & Colombo Port City', lat: 6.9367, lng: 79.8441 },
          { name: 'Sri Jayawardenepura Kotte (Parliament)', lat: 6.8887, lng: 79.9197 },
          { name: 'Hambantota Maritime Hub', lat: 6.1429, lng: 81.1212 },
          { name: 'Kandy', lat: 7.2906, lng: 80.6337 },
          { name: 'Jaffna', lat: 9.6615, lng: 80.0255 },
          { name: 'Trincomalee', lat: 8.5874, lng: 81.2152 }
        ]
      }
    ],
    strategicPorts: [
      { name: 'Port of Colombo (JCT, SAGT, CICT, CWIT)', lat: 6.9450, lng: 79.8450, role: 'Top 25 global transshipment container hub handling >7.5M TEUs annually', controlledBy: 'Sri Lanka Ports Authority (SLPA) & Terminal Consortia' },
      { name: 'Hambantota International Port (HIP)', lat: 6.1200, lng: 81.1150, role: 'Deep-water multipurpose and RO-RO automobile transshipment hub on the East-West maritime silk route', controlledBy: 'Hambantota International Port Group (HIPG)' },
      { name: 'Trincomalee Port', lat: 8.5700, lng: 81.2200, role: 'Industrial green hydrogen, petroleum hub, and commercial bulk terminal development', controlledBy: 'SLPA' }
    ]
  }
];
