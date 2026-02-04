
export enum ActivityType {
  INFORMATIVE = 'Informative',
  ARCHAEOLOGICAL = 'Archaeological',
  RECREATIONAL = 'Recreational',
  ENTERTAINMENT = 'Entertainment',
  FOOD_DRINK = 'Food & Drinks',
  CUSTOM = 'Custom / Town Specific'
}

export type ContactCategory = 'Vendor' | 'Staff' | 'Authority' | 'Logistics' | 'Sponsor';

export interface Contact {
  id: string;
  name: string;
  role: string;
  category: ContactCategory;
  phone: string;
  email: string;
  notes?: string;
  whatsappLink?: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  isReusable: boolean;
  type: 'Purchase' | 'Rent';
  estimatedCost: number;
  actualCost: number;
  notes: string;
  contactId?: string;
  staffRequired: number;
}

export interface Activity {
  id: string;
  name: string;
  category: ActivityType;
  description: string;
  materialIds: string[];
  notes: string;
  cost: number;
  contactId?: string;
  staffRequired: number;
}

export interface GovernmentRequirement {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  sourceUrl?: string;
}

export interface SocialPost {
  id: string;
  platform: 'Instagram' | 'Facebook' | 'Twitter/X' | 'TikTok';
  content: string;
  suggestedHashtags: string[];
  status: 'Draft' | 'Published';
}

export interface Fair {
  id: string;
  title: string;
  town: string;
  country: string;
  population?: string; 
  populationSourceUrl?: string; 
  date: string;
  whatsappGroupLink?: string;
  feasibilitySteps: { id: string; description: string; completed: boolean }[];
  marketStudyStats?: {
    potentialVisitors: number;
    economicImpact: number;
    communityInterest: number; 
    infrastructureScore: number;
  };
  marketAnalysisSummary?: string;
  marketRisks?: string;
  activities: Activity[];
  materials: Material[];
  contacts: Contact[];
  govRequirements: GovernmentRequirement[];
  socialPosts: SocialPost[];
  budget: {
    totalEstimated: number;
    totalActual: number;
  };
}
