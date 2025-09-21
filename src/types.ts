export interface DocumentComparison {
  oldDocument: {
    name: string;
    text: string;
  };
  newDocument: {
    name: string;
    text: string;
  };
  oldDocumentSummary: ComprehensiveDocumentAnalysis;
  newDocumentSummary: ComprehensiveDocumentAnalysis;
  differences?: DiffSegment[];
  changes: EnhancedChange[];
  summary: ChangeSummary;
  executiveSummary: string;
  riskAssessment: RiskAssessment;
}

export interface ComprehensiveDocumentAnalysis {
  title: string;
  executiveSummary: string;
  documentType: string;
  keyFindings: string[];
  mainClauses: MainClause[];
  obligations: string[];
  rights: string[];
  financialTerms: string[];
  timeframes: string[];
  terminationClauses: string[];
  riskFactors: string[];
  complianceRequirements: string[];
}

export interface MainClause {
  text: string;
  significance: 'High' | 'Medium' | 'Standard';
}

export interface DiffSegment {
  type: 'addition' | 'deletion' | 'unchanged';
  text: string;
}

export interface EnhancedChange {
  type: 'addition' | 'deletion' | 'modification';
  category: string;
  impact: 'low' | 'medium' | 'high';
  businessImpact: string;
  plainLanguage: string;
  technicalDetail: string;
  recommendedAction: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  explanation: AIExplanation;
}

export interface Change {
  type: 'addition' | 'deletion' | 'modification';
  category: string;
  summary: string;
  detail: string;
  impact: 'low' | 'medium' | 'high';
  explanation: AIExplanation;
}

export interface AIExplanation {
  summary: string;
  detail: string;
  category: 'financial' | 'termination' | 'liability' | 'rights' | 'date' | 'general' | 'clause' | 'obligation' | 'duration' | 'risk' | 'compliance';
}

export interface ChangeSummary {
  totalChanges: number;
  additions: number;
  deletions: number;
  modifications: number;
}

export interface RiskAssessment {
  overall: 'Low' | 'Medium' | 'High';
  breakdown: {
    high: number;
    medium: number;
    low: number;
  };
  recommendation: string;
}

export interface UploadedFile {
  file: File;
  name: string;
  type: string;
}