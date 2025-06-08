
import { DocumentType, LegalCategory } from '../types/legal';
import { LexigoPrompts } from './lexigoPrompts';
import { LexigoAnalyzer } from './lexigoAnalyzer';
import { LexigoResponseGenerator } from './lexigoResponseGenerator';
import { LexigoDatabase } from './lexigoDatabase';

export interface LexigoAnalysisRequest {
  content: string;
  analysisType: 'summary' | 'weaknesses' | 'counterarguments' | 'improvements' | 'full';
  documentType?: DocumentType;
  context?: string;
}

export interface LexigoAnalysisResponse {
  summary: string;
  keyPoints: string[];
  weaknesses: string[];
  counterarguments: string[];
  improvements: string[];
  legalReferences: Array<{
    source: string;
    law: string;
    section: string;
    description: string;
    url?: string;
  }>;
  nextActions: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  deadlines: string[];
  followUpQuestions: string[];
}

export class LexigoAIService {
  static async analyzeDocument(request: LexigoAnalysisRequest): Promise<LexigoAnalysisResponse> {
    console.log('Lexigo analyzing document with type:', request.analysisType);
    
    const prompt = LexigoPrompts.buildAnalysisPrompt(request);
    
    // Simulera AI-analys (i produktion skulle detta använda OpenAI eller liknande)
    const response = await LexigoAnalyzer.simulateAIAnalysis(request);
    
    // Spara analysen i databasen
    await LexigoDatabase.saveAnalysisToDatabase(request.content, response);
    
    return response;
  }

  static async generateFollowUpResponse(question: string, context: string): Promise<string> {
    return LexigoResponseGenerator.generateFollowUpResponse(question, context);
  }
}
