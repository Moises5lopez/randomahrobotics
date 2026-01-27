
export enum ActivityType {
  INFORMATIVE = 'Informative',
  ARCHAEOLOGICAL = 'Archaeological',
  RECREATIONAL = 'Recreational',
  ENTERTAINMENT = 'Entertainment',
  FOOD_DRINK = 'Food & Drinks',
  CUSTOM = 'Custom / Town Specific'
}

export interface Material {
  id: string;
  name: string;
  description: string;
  isReusable: boolean;
  type: 'Purchase' | 'Rent';
  estimatedCost: number;
  notes: string;
}

export interface Activity {
  id: string;
  name: string;
  category: ActivityType;
  description: string;
  requiredMaterialsIds: string[];
  notes: string;
  // Specific to Food & Drink
  vendorName?: string;
  foodType?: string;
  vendorContact?: string;
}

export interface MarketStudyCompany {
  id: string;
  name: string;
  specialty: string;
  services: string;
  costRange: string;
  contact: string;
}

export interface MarketingCompany extends MarketStudyCompany {}

export interface EntertainmentProvider {
  id: string;
  name: string;
  serviceType: string;
  cost: number;
  duration: string;
  contact: string;
  notes: string;
}

export interface BudgetEntry {
  id: string;
  category: 'Activities' | 'Marketing' | 'Materials' | 'Vendors' | 'Services';
  description: string;
  estimatedCost: number;
  actualCost: number;
  status: 'Pending' | 'Paid';
  notes: string;
}

export interface MarketingMaterial {
  id: string;
  name: string;
  type: 'Poster' | 'Flyer' | 'Social Media' | 'Other';
  url: string;
}

export interface MarketingStrategyExecution {
  id: string;
  strategy: string; // e.g., "Social Media", "Radio"
  implemented: boolean;
  evidenceLink: string;
}

export interface MarketStudyReport {
  attendancePotential: string;
  localCulture: string;
  infrastructure: string;
  economicContext: string;
  heritageAccess: string;
  seasonality: string;
  promotionalEnv: string;
  risks: string;
  impactIndicators: string;
  feasibility: string;
}

export interface FeasibilityStep {
  id: string;
  description: string;
  completed: boolean;
}

export interface Fair {
  id: string;
  title: string;
  town: string;
  date: string;
  feasibilitySteps: FeasibilityStep[];
  selectedMarketStudyCompanyId?: string;
  marketStudyReport: MarketStudyReport;
  linkedActivityIds: string[];
  customActivities: Activity[];
  linkedEntertainmentIds: string[];
  selectedMarketingCompanyId?: string;
  marketingExecution: MarketingStrategyExecution[];
  marketingMaterials: MarketingMaterial[];
  budget: BudgetEntry[];
}
