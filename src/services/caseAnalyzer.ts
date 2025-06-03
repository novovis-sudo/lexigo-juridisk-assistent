
import { DocumentProcessor } from './documentProcessor';
import { LegalQueryProcessor } from './legalQueryProcessor';
import { ProContraAnalyzer } from './proContraAnalyzer';
import { SwedishLegalDatabase } from './swedishLegalDatabase';
import { SupabaseService } from './supabaseService';
import { 
  LegalDocument, 
  DocumentAnalysis,
  LegalAdvice,
  DocumentType,
  LegalCategory 
} from '../types/legal';

export class CaseAnalyzer {
  /**
   * Generate comprehensive case summary with all enhancements
   */
  static async getEnhancedCaseSummary(documentId: string, additionalQuestions?: string[]): Promise<{
    document: LegalDocument;
    analysis: DocumentAnalysis;
    advice: LegalAdvice[];
    proContra?: any;
    similarCases?: any[];
    legalResources?: any[];
    followUpQuestions: string[];
    exportablePDF?: Blob;
  }> {
    const document = await SupabaseService.getDocument(documentId);
    if (!document) {
      throw new Error('Dokument hittades inte');
    }
    
    const analysis = await DocumentProcessor.getDocumentAnalysis(documentId);
    if (!analysis) {
      throw new Error('Kunde inte analysera dokumentet');
    }
    
    // Generate advice for key legal issues
    const advice: LegalAdvice[] = [];
    for (const issue of analysis.legal_issues.slice(0, 3)) {
      try {
        const result = await LegalQueryProcessor.answerLegalQuestionWithAnalysis(
          issue.description,
          this.mapDocumentTypeToCategory(document.type),
          `Dokumenttyp: ${document.type}\nÄrende: ${issue.title}`,
          documentId
        );
        advice.push(result.advice);
      } catch (error) {
        console.error('Failed to get advice for issue:', issue.title, error);
      }
    }
    
    // Get pro/contra analysis
    let proContra;
    try {
      proContra = await ProContraAnalyzer.analyze(document.content, document.type);
    } catch (error) {
      console.error('Pro/contra analysis failed:', error);
    }
    
    // Find similar cases and resources
    const similarCases = await SwedishLegalDatabase.findSimilarCases(document.content, document.type);
    const legalResources = await SwedishLegalDatabase.searchLegalResources(document.content.substring(0, 300));
    
    // Generate follow-up questions
    let followUpQuestions: string[] = [];
    try {
      const context = `${analysis.summary}\n\nViktiga punkter: ${analysis.key_points.join(', ')}`;
      followUpQuestions = await LegalQueryProcessor.generateFollowUpQuestions(context);
      
      if (additionalQuestions) {
        followUpQuestions.push(...additionalQuestions);
      }
    } catch (error) {
      console.error('Failed to generate follow-up questions:', error);
    }
    
    return {
      document,
      analysis,
      advice,
      proContra,
      similarCases,
      legalResources,
      followUpQuestions
    };
  }

  static async findSimilarCases(query: string, documentType?: DocumentType): Promise<LegalDocument[]> {
    if (documentType) {
      return SupabaseService.getDocumentsByType(documentType);
    }
    return SupabaseService.searchDocuments(query);
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
