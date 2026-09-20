export type CaseStatus = "recibido" | "en_revision" | "listo";

export type Recommendation = {
  id?: number;
  caseId?: string;
  area: string;
  title: string;
  detail: string;
  priority: "alta" | "media" | "baja";
};

export type ShopPhoto = {
  id: string;
  fileName: string;
  contentType?: string;
  sizeBytes?: number;
};

export type ShopCase = {
  id: string;
  accessToken?: string;
  shopName: string;
  ownerName: string;
  email: string;
  phone: string;
  location: string;
  shopType: string;
  sizeRange: string;
  categories: string[];
  challenges: string[];
  objective: string;
  extraNotes: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt?: string;
  photos?: ShopPhoto[];
  recommendations?: Recommendation[];
};

export const STATUS_LABELS: Record<CaseStatus, string> = {
  recibido: "Recibido",
  en_revision: "En revisión",
  listo: "Informe listo",
};

export const DEMO_CASES: ShopCase[] = [
  {
    id: "demo-001",
    accessToken: "demo",
    shopName: "Mini Market La Esquina",
    ownerName: "María Fernanda",
    email: "maria@ejemplo.ec",
    phone: "+593 99 456 2810",
    location: "Quito · La Carolina",
    shopType: "Minimarket",
    sizeRange: "40–80 m²",
    categories: ["Bebidas", "Snacks", "Lácteos", "Aseo"],
    challenges: ["Productos con poca rotación", "Tienda se ve saturada"],
    objective: "Mejorar la visibilidad de bebidas frías y productos de compra rápida.",
    extraNotes: "La mayor afluencia es de 17:00 a 20:00.",
    status: "listo",
    createdAt: "2026-08-29 10:30:00",
    photos: [],
    recommendations: [
      {
        id: 1,
        area: "Entrada",
        title: "Libera el primer metro de acceso",
        detail: "Retira las cajas apiladas junto a la puerta y deja una vista directa hacia bebidas y productos de alta rotación. La entrada debe sentirse amplia y fácil de recorrer.",
        priority: "alta",
      },
      {
        id: 2,
        area: "Góndola central",
        title: "Agrupa snacks por ocasión de consumo",
        detail: "Coloca chips, galletas y bebidas individuales juntos. Mantén las marcas líderes a la altura de los ojos y las presentaciones familiares en niveles bajos.",
        priority: "media",
      },
      {
        id: 3,
        area: "Caja",
        title: "Activa compras de último minuto",
        detail: "Usa una bandeja pequeña para chicles, caramelos y chocolates unitarios. Evita mezclar documentos, recargas y productos en el mismo espacio visual.",
        priority: "media",
      },
    ],
  },
  {
    id: "demo-002",
    shopName: "Bodega San José",
    ownerName: "Carlos Mena",
    email: "carlos@ejemplo.ec",
    phone: "+593 98 220 4481",
    location: "Quito · Calderón",
    shopType: "Bodega",
    sizeRange: "Menos de 40 m²",
    categories: ["Abarrotes", "Bebidas", "Limpieza"],
    challenges: ["Flujo de clientes débil"],
    objective: "Ordenar los pasillos y facilitar que el cliente encuentre productos básicos.",
    extraNotes: "",
    status: "en_revision",
    createdAt: "2026-08-30 14:15:00",
    photos: [],
    recommendations: [],
  },
  {
    id: "demo-003",
    shopName: "Despensa Mi Barrio",
    ownerName: "Andrea Ponce",
    email: "andrea@ejemplo.ec",
    phone: "+593 96 370 1142",
    location: "Quito · Chillogallo",
    shopType: "Tienda de alimentos",
    sizeRange: "40–80 m²",
    categories: ["Panadería", "Lácteos", "Congelados"],
    challenges: ["Productos con poca rotación"],
    objective: "Dar más salida a productos lácteos antes de su fecha de vencimiento.",
    extraNotes: "",
    status: "recibido",
    createdAt: "2026-08-31 08:45:00",
    photos: [],
    recommendations: [],
  },
];

export function parseJsonList(value: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(value || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getDemoCase(id: string) {
  return DEMO_CASES.find((item) => item.id === id);
}
