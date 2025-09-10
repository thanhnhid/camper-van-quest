export interface Camper {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number; // Per day
  images: string[];
  description: string;
  features: string[];
  specifications: {
    length: number; // in meters
    width: number;
    height: number;
    sleeps: number;
    fuel: string;
    transmission: string;
  };
  location: string;
  available: boolean;
  rating: number;
  reviewCount: number;
}

export const mockCampers: Camper[] = [
  {
    id: "1",
    name: "Familien-Wohnmobil Deluxe",
    brand: "Knaus",
    model: "Sky TI 700MEG",
    year: 2023,
    price: 89,
    images: [
      "https://images.unsplash.com/photo-1543083477-4f785aeafaa9?q=80&w=1000",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1000"
    ],
    description: "Perfekt für Familienausflüge mit modernen Annehmlichkeiten und viel Platz für bis zu 6 Personen.",
    features: [
      "Vollausgestattete Küche",
      "Separates Schlafzimmer",
      "Große Sitzgruppe",
      "Klimaanlage",
      "Rückfahrkamera",
      "Fahrradträger"
    ],
    specifications: {
      length: 7.0,
      width: 2.3,
      height: 2.9,
      sleeps: 6,
      fuel: "Diesel",
      transmission: "Automatik"
    },
    location: "München, Bayern",
    available: true,
    rating: 4.8,
    reviewCount: 23
  },
  {
    id: "2",
    name: "Kompakter Stadtflitzer",
    brand: "Pössl",
    model: "Roadcruiser B",
    year: 2022,
    price: 65,
    images: [
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1000",
      "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?q=80&w=1000"
    ],
    description: "Wendiger Van für Paare, ideal für Städtetrips und enge Straßen.",
    features: [
      "Kompakte Küche",
      "Aufstelldach",
      "Effiziente Raumnutzung",
      "Standheizung",
      "Solarpanel"
    ],
    specifications: {
      length: 5.4,
      width: 2.0,
      height: 2.5,
      sleeps: 2,
      fuel: "Diesel",
      transmission: "Manuell"
    },
    location: "Berlin, Berlin",
    available: true,
    rating: 4.6,
    reviewCount: 18
  },
  {
    id: "3",
    name: "Luxus-Liner Premium",
    brand: "Concorde",
    model: "Charisma 900 LS",
    year: 2024,
    price: 135,
    images: [
      "https://images.unsplash.com/photo-1527786356703-4b100091cd2c?q=80&w=1000",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1000"
    ],
    description: "Premium-Wohnmobil mit allen Luxus-Features für anspruchsvolle Reisende.",
    features: [
      "Premium-Ausstattung",
      "Großes Bad mit Dusche",
      "Entertainment-System",
      "Elektrische Hubstützen",
      "Markise",
      "Heckgarage"
    ],
    specifications: {
      length: 8.9,
      width: 2.3,
      height: 3.0,
      sleeps: 4,
      fuel: "Diesel",
      transmission: "Automatik"
    },
    location: "Hamburg, Hamburg",
    available: false,
    rating: 4.9,
    reviewCount: 31
  }
];

export interface Insurance {
  id: string;
  name: string;
  price: number; // Per day
  description: string;
  coverage: string[];
}

export const insuranceOptions: Insurance[] = [
  {
    id: "basic",
    name: "Basis-Schutz",
    price: 15,
    description: "Grundlegende Absicherung für Ihre Reise",
    coverage: [
      "Haftpflichtversicherung",
      "Teilkasko (Selbstbeteiligung 1000€)"
    ]
  },
  {
    id: "premium",
    name: "Premium-Schutz",
    price: 25,
    description: "Erweiterte Absicherung mit reduzierter Selbstbeteiligung",
    coverage: [
      "Haftpflichtversicherung",
      "Vollkasko (Selbstbeteiligung 500€)",
      "Auslandsschadenschutz"
    ]
  },
  {
    id: "complete",
    name: "Vollkasko-Schutz",
    price: 35,
    description: "Rundum-Sorglos-Paket ohne Selbstbeteiligung",
    coverage: [
      "Haftpflichtversicherung",
      "Vollkasko ohne Selbstbeteiligung",
      "Auslandsschadenschutz",
      "Pannenhilfe Europa",
      "Glasbruchversicherung"
    ]
  }
];