
import { DocumentClassifier } from './documentClassifier';
import { AIAnalysisEngine } from './aiAnalysisEngine';
import { SupabaseService } from './supabaseService';
import { 
  LegalDocument, 
  LegalQuery, 
  LegalAdvice, 
  DocumentAnalysis,
  DocumentType,
  LegalCategory 
} from '../types/legal';

export class LexigoEngine {
  /**
   * Main entry point for document processing
   */
  static async processDocument(content: string, fileName?: string): Promise<LegalDocument> {
    console.log('Processing document:', fileName || 'Unnamed document');
    
    // Step 1: Classify document type
    const docType = DocumentClassifier.classifyDocument(content);
    console.log('Classified as:', docType);
    
    // Step 2: Extract metadata
    const metadata = DocumentClassifier.extractMetadata(content, docType);
    console.log('Extracted metadata:', metadata);
    
    // Step 3: Store document in Supabase
    const document = await SupabaseService.storeDocument({
      type: docType,
      content,
      metadata
    });
    
    // Step 4: Perform AI analysis
    try {
      const analysis = await AIAnalysisEngine.analyzeDocument(document);
      
      // Step 5: Update document with analysis
      await SupabaseService.updateDocumentAnalysis(document.id, analysis);
      
      return {
        ...document,
        analysis
      };
    } catch (error) {
      console.error('AI analysis failed:', error);
      // Return document without analysis if AI fails
      return document;
    }
  }

  /**
   * Answer legal questions with context
   */
  static async answerLegalQuestion(
    question: string, 
    category: LegalCategory,
    context?: string,
    documentId?: string
  ): Promise<LegalAdvice> {
    console.log('Processing legal question:', question);
    
    const query: LegalQuery = {
      question,
      category,
      context,
      document_id: documentId
    };
    
    // Get AI-powered legal advice
    const advice = await AIAnalysisEngine.answerLegalQuery(query);
    
    // Log the query and response for analytics
    await SupabaseService.logLegalQuery(
      question,
      category,
      JSON.stringify(advice)
    );
    
    return advice;
  }

  /**
   * Get document analysis if not already performed
   */
  static async getDocumentAnalysis(documentId: string): Promise<DocumentAnalysis | null> {
    const document = await SupabaseService.getDocument(documentId);
    
    if (!document) {
      throw new Error('Document not found');
    }
    
    if (document.analysis) {
      return document.analysis;
    }
    
    // Perform analysis if not already done
    try {
      const analysis = await AIAnalysisEngine.analyzeDocument(document);
      await SupabaseService.updateDocumentAnalysis(documentId, analysis);
      return analysis;
    } catch (error) {
      console.error('Failed to analyze document:', error);
      return null;
    }
  }

  /**
   * Generate contextual follow-up questions
   */
  static async generateFollowUpQuestions(context: string): Promise<string[]> {
    return AIAnalysisEngine.generateFollowUpQuestions(context);
  }

  /**
   * Search for similar cases or documents
   */
  static async findSimilarCases(query: string, documentType?: DocumentType): Promise<LegalDocument[]> {
    if (documentType) {
      return SupabaseService.getDocumentsByType(documentType);
    }
    return SupabaseService.searchDocuments(query);
  }

  /**
   * Bulk process multiple documents
   */
  static async processMultipleDocuments(files: Array<{content: string, fileName: string}>): Promise<LegalDocument[]> {
    const results = await Promise.allSettled(
      files.map(file => this.processDocument(file.content, file.fileName))
    );
    
    return results
      .filter((result): result is PromiseFulfilledResult<LegalDocument> => result.status === 'fulfilled')
      .map(result => result.value);
  }

  /**
   * Get comprehensive case summary combining document analysis and legal advice
   */
  static async getCaseSummary(documentId: string, additionalQuestions?: string[]): Promise<{
    document: LegalDocument;
    analysis: DocumentAnalysis;
    advice: LegalAdvice[];
    followUpQuestions: string[];
  }> {
    const document = await SupabaseService.getDocument(documentId);
    if (!document) {
      throw new Error('Document not found');
    }
    
    const analysis = await this.getDocumentAnalysis(documentId);
    if (!analysis) {
      throw new Error('Could not analyze document');
    }
    
    // Generate advice for key legal issues identified
    const advice: LegalAdvice[] = [];
    for (const issue of analysis.legal_issues.slice(0, 3)) { // Limit to top 3 issues
      try {
        const issueAdvice = await this.answerLegalQuestion(
          issue.description,
          this.mapDocumentTypeToCategory(document.type),
          `Dokumenttyp: ${document.type}\nÄrende: ${issue.title}`,
          documentId
        );
        advice.push(issueAdvice);
      } catch (error) {
        console.error('Failed to get advice for issue:', issue.title, error);
      }
    }
    
    // Generate follow-up questions
    let followUpQuestions: string[] = [];
    try {
      const context = `${analysis.summary}\n\nViktiga punkter: ${analysis.key_points.join(', ')}`;
      followUpQuestions = await this.generateFollowUpQuestions(context);
      
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
      followUpQuestions
    };
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
