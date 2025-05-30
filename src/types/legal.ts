
export interface LegalDocument {
  id: string;
  type: DocumentType;
  content: string;
  metadata: DocumentMetadata;
  analysis?: DocumentAnalysis;
  created_at: string;
  updated_at: string;
}

export enum DocumentType {
  EVICTION_NOTICE = 'eviction_notice',
  RENTAL_CONTRACT = 'rental_contract',
  COURT_DECISION = 'court_decision',
  BENEFIT_DECISION = 'benefit_decision',
  EMPLOYMENT_CONTRACT = 'employment_contract',
  CONSUMER_CONTRACT = 'consumer_contract',
  INSURANCE_DOCUMENT = 'insurance_document',
  DEBT_NOTICE = 'debt_notice',
  OTHER = 'other'
}

export interface DocumentMetadata {
  language: 'sv' | 'en';
  confidence: number;
  parties: string[];
  dates: string[];
  amounts: number[];
  keywords: string[];
  urgency_level: UrgencyLevel;
}

export enum UrgencyLevel {
  CRITICAL = 'critical',     // Immediate action required (eviction, debt enforcement)
  HIGH = 'high',            // Action needed within days
  MEDIUM = 'medium',        // Action needed within weeks
  LOW = 'low'               // Informational or long-term planning
}

export interface DocumentAnalysis {
  summary: string;
  key_points: string[];
  legal_issues: LegalIssue[];
  recommendations: Recommendation[];
  next_steps: NextStep[];
  references: LegalReference[];
  urgency_assessment: UrgencyAssessment;
}

export interface LegalIssue {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  legal_basis: string[];
  potential_outcomes: string[];
}

export interface Recommendation {
  action: string;
  rationale: string;
  timeline: string;
  resources_needed: string[];
  success_probability: number;
}

export interface NextStep {
  step: string;
  description: string;
  deadline?: string;
  priority: number;
  contacts: Contact[];
}

export interface Contact {
  name: string;
  type: 'authority' | 'legal_aid' | 'ombudsman' | 'court';
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
}

export interface LegalReference {
  law_name: string;
  section: string;
  description: string;
  url?: string;
  relevance_score: number;
}

export interface UrgencyAssessment {
  level: UrgencyLevel;
  reasoning: string;
  time_sensitive_actions: string[];
  consequences_of_delay: string[];
}

export interface LegalQuery {
  question: string;
  context?: string;
  document_id?: string;
  category: LegalCategory;
}

export enum LegalCategory {
  RENTAL_LAW = 'rental_law',
  SOCIAL_BENEFITS = 'social_benefits',
  EMPLOYMENT_LAW = 'employment_law',
  CONSUMER_RIGHTS = 'consumer_rights',
  FAMILY_LAW = 'family_law',
  DEBT_COLLECTION = 'debt_collection',
  INSURANCE = 'insurance',
  CRIMINAL_LAW = 'criminal_law',
  ADMINISTRATIVE_LAW = 'administrative_law'
}

export interface LegalAdvice {
  answer: string;
  confidence: number;
  legal_basis: LegalReference[];
  practical_steps: string[];
  warnings: string[];
  follow_up_questions: string[];
}
