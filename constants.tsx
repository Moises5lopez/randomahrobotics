
import { ActivityType, Activity, Material } from './types';

export const INITIAL_FEASIBILITY_STEPS = [
  "Identificar Pueblos cercanos a Sitios Arqueológicos",
  "Evaluar Niveles de Conciencia Comunitaria",
  "Verificar Infraestructura Básica",
  "Confirmar Voluntad de la Municipalidad",
  "Mapeo de Líderes Locales"
];

export const ACTIVITY_LIBRARY: Partial<Activity>[] = [
  { name: 'Simulación de Excavación', category: ActivityType.ARCHAEOLOGICAL, description: 'Cajón de arena con réplicas para que niños aprendan técnicas de excavación.', cost: 1500, staffRequired: 3 },
  { name: 'Taller de Cerámica Ancestral', category: ActivityType.RECREATIONAL, description: 'Modelado de arcilla siguiendo patrones prehispánicos.', cost: 800, staffRequired: 2 },
  { name: 'Mapping de Glifos Mayas', category: ActivityType.ENTERTAINMENT, description: 'Proyección nocturna de glifos en fachadas principales.', cost: 2500, staffRequired: 4 }
];

export const MATERIAL_LIBRARY: Partial<Material>[] = [
  { name: 'Carpas de Lona 3x3', type: 'Rent', isReusable: true, estimatedCost: 450, staffRequired: 2 },
  { name: 'Kit de Pinceles y Espátulas', type: 'Purchase', isReusable: true, estimatedCost: 200, staffRequired: 0 }
];

export const TRANSLATIONS = {
  en: {
    dashboard: "Fair Dashboard",
    createFair: "Create New Fair",
    town: "Town / Location",
    country: "Country",
    date: "Date",
    title: "Title",
    feasibility: "Feasibility & AI Analysis",
    marketStudy: "Market Study",
    finance: "Financials & Projections",
    activities: "Activities",
    materials: "Materials",
    contacts: "Contact Directory",
    government: "Gov & Legal",
    socialMedia: "Social Media",
    searchPopulation: "AI Search Population",
    staff: "Staff Allocation",
    workers: "Workers",
    actual: "Actual",
    estimated: "Estimated",
    projection: "Attendance Projection",
    viewFair: "View Fair",
    addActivity: "Add Activity",
    addMaterial: "Add Material",
    addContact: "Add Contact",
    save: "Save",
    back: "Back",
    library: "Library",
    getRequirements: "Get Gov Requirements (IA)",
    generateSocial: "Generate AI Posts",
    analyzing: "Analyzing context...",
    whatsAppGroup: "WhatsApp Group",
    createGroup: "Manage Group",
    copyNumbers: "Copy all contacts"
  },
  es: {
    dashboard: "Panel de Ferias",
    createFair: "Crear Nueva Feria",
    town: "Pueblo / Ubicación",
    country: "País",
    date: "Fecha",
    title: "Título",
    feasibility: "Factibilidad e IA",
    marketStudy: "Estudio de Mercado",
    finance: "Finanzas y Proyecciones",
    activities: "Actividades",
    materials: "Materiales",
    contacts: "Contactos",
    government: "Gobierno y Legal",
    socialMedia: "Redes Sociales",
    searchPopulation: "Buscar Población (IA)",
    staff: "Asignación de Staff",
    workers: "Trabajadores",
    actual: "Real",
    estimated: "Estimado",
    projection: "Proyección de Asistencia",
    viewFair: "Ver Feria",
    addActivity: "Agregar Actividad",
    addMaterial: "Agregar Material",
    addContact: "Agregar Contacto",
    save: "Guardar",
    back: "Volver",
    library: "Biblioteca",
    getRequirements: "Obtener Requisitos Legales (IA)",
    generateSocial: "Generar Publicaciones (IA)",
    analyzing: "Analizando contexto...",
    whatsAppGroup: "Grupo de WhatsApp",
    createGroup: "Gestionar Grupo",
    copyNumbers: "Copiar todos los contactos"
  }
};
