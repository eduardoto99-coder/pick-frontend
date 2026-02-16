import type { ProfileDraft } from "@/types/profile";

export type InterestOption = {
  id: string;
  label: string;
  description: string;
  pillar: "career" | "impact" | "wellness" | "creative" | "community";
};

export type CityOption = {
  id: string;
  label: string;
  region: string;
  priority: "launch" | "beta";
};

export const INTEREST_LIMIT = {
  min: 1,
  max: 3,
};

export const DISPLAY_NAME_LIMIT = {
  min: 3,
  max: 80,
};

export const BIO_CHARACTER_LIMIT = {
  min: 60,
  max: 320,
};

export const CITY_SELECTION_LIMIT = {
  min: 1,
  max: 3,
};

export const SOCIAL_LINK_LIMIT = {
  max: 160,
};

export const INTEREST_OPTIONS: InterestOption[] = [
  {
    id: "climate_action",
    label: "Acción climática",
    description: "Impulsar proyectos verdes, impacto ambiental y carreras regenerativas.",
    pillar: "impact",
  },
  {
    id: "product_management",
    label: "Product builders",
    description: "Diseñar y lanzar productos digitales, desde research hasta growth.",
    pillar: "career",
  },
  {
    id: "coffee_culture",
    label: "Club de café y tertulias",
    description: "Rutas de café especial, tertulias creativas y recorridos de barrio.",
    pillar: "community",
  },
  {
    id: "accountability_pods",
    label: "Accountability pods",
    description: "Sesiones quincenales para avanzar proyectos, hábitos y side hustles.",
    pillar: "career",
  },
  {
    id: "wellness_rituals",
    label: "Rituales de bienestar",
    description: "Yoga urbano, breathwork, running crews y hábitos de energía.",
    pillar: "wellness",
  },
  {
    id: "creator_collabs",
    label: "Creadoras y makers",
    description: "Photo walks, collabs audiovisuales y lanzamientos culturales.",
    pillar: "creative",
  },
  {
    id: "women_in_tech",
    label: "Mujeres en tech",
    description: "Mentorías peer-to-peer, liderazgo y preparación de ascensos.",
    pillar: "career",
  },
  {
    id: "social_impact_ops",
    label: "Impacto social",
    description: "ONGs, política local, labs ciudadanos y financiamiento colectivo.",
    pillar: "impact",
  },
  {
    id: "culinary_experiments",
    label: "Laboratorio gastronómico",
    description: "Supper clubs íntimos, rutas de mercados y catas regionales.",
    pillar: "community",
  },
  {
    id: "micro_travel_crews",
    label: "Escapadas express",
    description: "Coordinación de roadtrips, hikes y retiros creativos.",
    pillar: "community",
  },
  {
    id: "language_swaps",
    label: "Intercambios de idiomas",
    description: "1:1 para mejorar inglés, francés o portugués con contexto cultural.",
    pillar: "creative",
  },
  {
    id: "mentorship_loops",
    label: "Loops de mentoría",
    description: "Mentor/mentee inter-ciudad para transiciones de carrera.",
    pillar: "career",
  },
  {
    id: "software",
    label: "Software builders",
    description: "Equipos de producto, dev shops y espacios para shippear ideas.",
    pillar: "career",
  },
  {
    id: "guitar",
    label: "Sesiones de guitarra",
    description: "Jams acústicos, talleres y duos para cantar en vivo.",
    pillar: "creative",
  },
  {
    id: "legos",
    label: "Labs de Lego",
    description: "Construcciones colaborativas y retos de diseño físico/digital.",
    pillar: "community",
  },
  {
    id: "furniture",
    label: "Makers de mobiliario",
    description: "Diseño de piezas funcionales, carpintería y restauraciones.",
    pillar: "creative",
  },
  {
    id: "yoga",
    label: "Yoga urbano",
    description: "Mini retiros, breathwork y práctica consciente en la ciudad.",
    pillar: "wellness",
  },
];

export const CITY_OPTIONS: CityOption[] = [
  { id: "bogota", label: "Bogotá", region: "Cundinamarca", priority: "launch" },
  { id: "medellin", label: "Medellín", region: "Antioquia", priority: "launch" },
  { id: "cali", label: "Cali", region: "Valle del Cauca", priority: "launch" },
  { id: "barranquilla", label: "Barranquilla", region: "Atlántico", priority: "launch" },
  { id: "cartagena", label: "Cartagena", region: "Bolívar", priority: "beta" },
  { id: "bucaramanga", label: "Bucaramanga", region: "Santander", priority: "beta" },
  { id: "pereira", label: "Pereira", region: "Risaralda", priority: "beta" },
  { id: "manizales", label: "Manizales", region: "Caldas", priority: "beta" },
  { id: "santa_marta", label: "Santa Marta", region: "Magdalena", priority: "beta" },
  { id: "villavicencio", label: "Villavicencio", region: "Meta", priority: "beta" },
];

export const DEFAULT_PROFILE_DRAFT: ProfileDraft = {
  displayName: "",
  bio: "",
  linkedinUrl: "",
  instagramUrl: "",
  cities: [],
  interests: [],
  photo: undefined,
  updatedAt: undefined,
};
