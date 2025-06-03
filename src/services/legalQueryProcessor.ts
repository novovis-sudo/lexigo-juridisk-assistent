
import { AIAnalysisEngine } from './aiAnalysisEngine';
import { ProContraAnalyzer } from './proContraAnalyzer';
import { SwedishLegalDatabase } from './swedishLegalDatabase';
import { SupabaseService } from './supabaseService';
import { 
  LegalQuery, 
  LegalAdvice, 
  LegalCategory,
  DocumentType 
} from '../types/legal';

export class LegalQueryProcessor {
  /**
   * Enhanced legal question answering with pro/contra analysis
   */
  static async answerLegalQuestionWithAnalysis(
    question: string, 
    category: LegalCategory,
    context?: string,
    documentId?: string
  ): Promise<{
    advice: LegalAdvice;
    proContra?: any;
    resources?: any[];
    similarCases?: any[];
  }> {
    console.log('Processing enhanced legal question:', question);
    
    const query: LegalQuery = {
      question,
      category,
      context,
      document_id: documentId
    };
    
    // Get basic AI-powered legal advice
    const advice = await AIAnalysisEngine.answerLegalQuery(query);
    
    // Generate pro/contra analysis if we have enough context
    let proContra;
    if (context && context.length > 100) {
      try {
        const docType = this.inferDocumentTypeFromContext(context, category);
        proContra = await ProContraAnalyzer.analyze(context, docType);
      } catch (error) {
        console.error('Pro/contra analysis failed:', error);
      }
    }
    
    // Search for relevant legal resources and cases
    const resources = await SwedishLegalDatabase.searchLegalResources(question);
    const similarCases = await SwedishLegalDatabase.searchCourtDecisions([question.split(' ')[0]]);
    
    // Log the query and response for analytics
    await SupabaseService.logLegalQuery(
      question,
      category,
      JSON.stringify({ advice, proContra, resources_count: resources.length })
    );
    
    return {
      advice,
      proContra,
      resources,
      similarCases
    };
  }

  static async generateFollowUpQuestions(context: string): Promise<string[]> {
    return AIAnalysisEngine.generateFollowUpQuestions(context);
  }

  private static inferDocumentTypeFromContext(context: string, category: LegalCategory): DocumentType {
    const contextLower = context.toLowerCase();
    
    if (contextLower.includes('uppsägning') || contextLower.includes('avhysning')) {
      return DocumentType.EVICTION_NOTICE;
    }
    if (contextLower.includes('skuld') || contextLower.includes('inkasso')) {
      return DocumentType.DEBT_NOTICE;
    }
    if (contextLower.includes('försäkringskassan') || contextLower.includes('bidrag')) {
      return DocumentType.BENEFIT_DECISION;
    }
    if (contextLower.includes('anställning') || contextLower.includes('arbete')) {
      return DocumentType.EMPLOYMENT_CONTRACT;
    }
    if (contextLower.includes('konsument') || contextLower.includes('köp')) {
      return DocumentType.CONSUMER_CONTRACT;
    }
    
    return DocumentType.OTHER;
  }

  private static mapDocumentTypeToCategory(docType: DocumentType): LegalCategory {
    const mapping: Record<DocumentType, LegalCategory> = {
      [DocumentType.EVICTION_NOTICE]: LegalCategory.RENTAL_LAW,
      [DocumentType.RENTAL_CONTRACT]: LegalCategory.RENTAL_LAW,
      [DocumentType.BENEFIT_DECISION]: LegalCategory.SOCIAL_BENEFITS,
      [DocumentType.EMPLOYMENT_CONTRACT]: LegalCategory.EMPLOYMENT_LAW,
      [DocumentType.CONSUMER_CONTRACT]: LegalCategory.CONSUMER_RIGHTS,
      [DocumentType.DEBT_NOTICE]: LegalCategory.DEBT_COLLECTION,
      [DocumentType.INSURANCE_DOCUMENT]: LegalCategory.INSURANCE,
      [DocumentType.COURT_DECISION]: LegalCategory.ADMINISTRATIVE_LAW,
      [DocumentType.OTHER]: LegalCategory.ADMINISTRATIVE_LAW
    };
    
    return mapping[docType] || LegalCategory.ADMINISTRATIVE_LAW;
  }
}
