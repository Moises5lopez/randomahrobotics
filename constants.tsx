
import { Activity, ActivityType, Material, MarketStudyCompany, MarketingCompany, EntertainmentProvider } from './types';

export const MATERIAL_LIBRARY: Material[] = [
  { id: 'mat1', name: 'Sand Boxes', description: 'Large wooden boxes for simulation', isReusable: true, type: 'Purchase', estimatedCost: 150, notes: 'Need local carpentry' },
  { id: 'mat2', name: 'Replica Pottery', description: 'Museum quality replicas', isReusable: true, type: 'Purchase', estimatedCost: 300, notes: 'Handle with care' },
  { id: 'mat3', name: 'Tents / Carpas', description: '3x3 standard event tents', isReusable: false, type: 'Rent', estimatedCost: 50, notes: 'Price per unit' },
  { id: 'mat4', name: 'Sound System', description: 'Speakers and Mixer', isReusable: false, type: 'Rent', estimatedCost: 200, notes: 'Daily rate' }
];

export const ACTIVITY_LIBRARY: Activity[] = [
  { id: 'act1', name: 'Virtual Maya Reality', category: ActivityType.ARCHAEOLOGICAL, description: 'Oculus tour of Copan ruins', requiredMaterialsIds: ['mat4'], notes: 'Requires high speed internet' },
  { id: 'act2', name: 'Clay Modeling', category: ActivityType.INFORMATIVE, description: 'Learn to make Lenca pottery', requiredMaterialsIds: ['mat2'], notes: 'Messy activity' },
  { id: 'act3', name: 'Baleada Masterclass', category: ActivityType.FOOD_DRINK, description: 'Live cooking demonstration', requiredMaterialsIds: [], notes: 'Needs stove setup', vendorName: 'Local Chef', foodType: 'Baleadas' }
];

export const MARKET_STUDY_COMPANIES: MarketStudyCompany[] = [
  { id: 'msc1', name: 'Mercaplan Honduras', specialty: 'Cultural Heritage', services: 'Ethnography, Quantitative', costRange: 'L12,000 - L15,000', contact: '+504 2236-7890' },
  { id: 'msc2', name: '1+1 Research', specialty: 'Mixed Methods', services: 'Panel, F2F', costRange: 'L10,000 - L12,000', contact: '+504 2289-3456' }
];

export const MARKETING_COMPANIES: MarketingCompany[] = [
  { id: 'mkc1', name: 'Creative Honduras', specialty: 'Viral Campaigns', services: 'Ads, Influencers', costRange: 'L8,000 - L20,000', contact: 'social@creative.hn' },
  { id: 'mkc2', name: 'Regional Radio Ads', specialty: 'Rural Outreach', services: 'Radio Spots', costRange: 'L5,000 - L10,000', contact: '+504 9999-0000' }
];

export const ENTERTAINMENT_LIBRARY: EntertainmentProvider[] = [
  { id: 'ent1', name: 'Lenca Dancers', serviceType: 'Folkloric Dance', cost: 150, duration: '45 mins', contact: '+504 8888-1111', notes: 'Cultural focus' },
  { id: 'ent2', name: 'Marimba Orchestra', serviceType: 'Live Music', cost: 300, duration: '2 hours', contact: '+504 7777-2222', notes: 'Great for evening' }
];

export const INITIAL_FEASIBILITY_STEPS = [
  "Identify Towns Near Archaeological Sites",
  "Assess Community Awareness Levels",
  "Evaluate Community Engagement Potential",
  "Check Basic Infrastructure (Power, Water, Space)",
  "Confirm Willingness of Local Municipality"
];

export const TRANSLATIONS = {
  en: {
    dashboard: "Fair Dashboard",
    createFair: "Create New Fair",
    town: "Town / Location",
    date: "Date",
    title: "Title",
    feasibility: "Feasibility & Study",
    activities: "Activities Catalog",
    materials: "Materials DB",
    marketing: "Marketing & Strategy",
    budget: "Budget & Expenses",
    entertainment: "Entertainment",
    save: "Save",
    back: "Back to Dashboard",
    companies: "Specialized Companies",
    strategy: "Strategy",
    evidence: "Evidence / Link",
    implemented: "Implemented",
    report: "Market Study Report",
    viewFair: "Manage Fair",
    newActivity: "Add Custom Activity",
    newProvider: "Add Provider",
    estimated: "Estimated",
    actual: "Actual",
    status: "Status"
  },
  es: {
    dashboard: "Panel de Ferias",
    createFair: "Crear Nueva Feria",
    town: "Pueblo / Ubicación",
    date: "Fecha",
    title: "Título",
    feasibility: "Factibilidad y Estudio",
    activities: "Catálogo de Actividades",
    materials: "BD de Materiales",
    marketing: "Marketing y Estrategia",
    budget: "Presupuesto y Gastos",
    entertainment: "Entretenimiento",
    save: "Guardar",
    back: "Volver al Panel",
    companies: "Empresas Especializadas",
    strategy: "Estrategia",
    evidence: "Evidencia / Link",
    implemented: "Implementado",
    report: "Reporte de Estudio de Mercado",
    viewFair: "Administrar Feria",
    newActivity: "Agregar Actividad Personalizada",
    newProvider: "Agregar Proveedor",
    estimated: "Estimado",
    actual: "Real",
    status: "Estado"
  }
};
