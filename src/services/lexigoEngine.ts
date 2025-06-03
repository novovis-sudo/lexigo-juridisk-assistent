import { DocumentClassifier } from './documentClassifier';
import { AIAnalysisEngine } from './aiAnalysisEngine';
import { SupabaseService } from './supabaseService';
import { LegalAnalysisService } from './legalAnalysisService';
import { ProContraAnalyzer } from './proContraAnalyzer';
import { SwedishLegalDatabase } from './swedishLegalDatabase';
import { OCRService } from './ocrService';
import { PDFExportService } from './pdfExportService';
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
   * Enhanced main entry point for document processing with OCR and advanced analysis
   */
  static async processDocumentWithOCR(file: File, userId: string = 'anonymous'): Promise<LegalDocument> {
    console.log('Processing document with OCR:', file.name);
    
    try {
      // Step 1: Extract text using OCR service
      const extractedText = await OCRService.processDocument(file);
      console.log('Text extracted successfully, length:', extractedText.length);
      
      // Step 2: Process the extracted text
      return this.processDocument(extractedText, file.name, userId);
    } catch (error) {
      console.error('OCR processing failed:', error);
      throw new Error('Kunde inte extrahera text från dokumentet');
    }
  }

  /**
   * Enhanced document processing with advanced legal analysis
   */
  static async processDocument(content: string, fileName?: string, userId: string = 'anonymous'): Promise<LegalDocument> {
    console.log('Processing document with enhanced analysis:', fileName || 'Unnamed document');
    
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
    }, userId);
    
    // Step 4: Perform advanced AI analysis
    try {
      const analysis = await LegalAnalysisService.performAdvancedAnalysis(document);
      console.log('Advanced analysis completed');
      
      // Step 5: Generate pro/contra analysis
      const proContraAnalysis = await ProContraAnalyzer.analyze(content, docType);
      console.log('Pro/contra analysis completed');
      
      // Step 6: Search for similar cases
      const similarCases = await SwedishLegalDatabase.findSimilarCases(content, docType);
      console.log('Found similar cases:', similarCases.length);
      
      // Step 7: Update document with comprehensive analysis
      const enhancedAnalysis = {
        ...analysis,
        pro_contra: proContraAnalysis,
        similar_cases: similarCases,
        legal_resources: await SwedishLegalDatabase.searchLegalResources(content.substring(0, 200))
      };
      
      await SupabaseService.updateDocumentAnalysis(document.id, enhancedAnalysis);
      
      return {
        ...document,
        analysis: enhancedAnalysis
      };
    } catch (error) {
      console.error('Advanced analysis failed:', error);
      // Return document without advanced analysis if it fails
      return document;
    }
  }

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

  /**
   * Export legal analysis to PDF
   */
  static async exportAnalysisToPDF(documentId: string, title?: string): Promise<Blob> {
    console.log('Exporting analysis to PDF for document:', documentId);
    
    const document = await SupabaseService.getDocument(documentId);
    if (!document || !document.analysis) {
      throw new Error('Dokument eller analys hittades inte');
    }
    
    const pdfTitle = title || `Juridisk Analys - ${document.metadata?.filename || 'Dokument'}`;
    return PDFExportService.exportLegalAnalysis(document.analysis, pdfTitle);
  }

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
    
    const analysis = await this.getDocumentAnalysis(documentId);
    if (!analysis) {
      throw new Error('Kunde inte analysera dokumentet');
    }
    
    // Generate advice for key legal issues
    const advice: LegalAdvice[] = [];
    for (const issue of analysis.legal_issues.slice(0, 3)) {
      try {
        const result = await this.answerLegalQuestionWithAnalysis(
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
      proContra,
      similarCases,
      legalResources,
      followUpQuestions
    };
  }

  /**
   * Search and link legal concepts
   */
  static async searchAndLinkConcepts(text: string): Promise<string[]> {
    console.log('Searching and linking legal concepts in text');
    
    const concepts = LegalAnalysisService['extractLegalConcepts'](text);
    
    // Store new concepts in database
    try {
      await this.storeLegalConcepts(concepts);
    } catch (error) {
      console.error('Failed to store legal concepts:', error);
    }
    
    return concepts;
  }

  /**
   * Get legal updates from Swedish sources
   */
  static async getLegalUpdates(): Promise<any[]> {
    return SwedishLegalDatabase.getLegalUpdates();
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

  private static async storeLegalConcepts(concepts: string[]): Promise<void> {
    console.log('Storing legal concepts:', concepts);
    // Implementation would store concepts in the legal_concepts table
    // This is a placeholder for the actual database operation
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
      const analysis = await LegalAnalysisService.performAdvancedAnalysis(document);
      await SupabaseService.updateDocumentAnalysis(documentId, analysis);
      return analysis;
    } catch (error) {
      console.error('Failed to analyze document:', error);
      return null;
    }
  }

  static async generateFollowUpQuestions(context: string): Promise<string[]> {
    return AIAnalysisEngine.generateFollowUpQuestions(context);
  }

  static async findSimilarCases(query: string, documentType?: DocumentType): Promise<LegalDocument[]> {
    if (documentType) {
      return SupabaseService.getDocumentsByType(documentType);
    }
    return SupabaseService.searchDocuments(query);
  }

  static async processMultipleDocuments(files: Array<{content: string, fileName: string}>): Promise<LegalDocument[]> {
    const results = await Promise.allSettled(
      files.map(file => this.processDocument(file.content, file.fileName))
    );
    
    return results
      .filter((result): result is PromiseFulfilledResult<LegalDocument> => result.status === 'fulfilled')
      .map(result => result.value);
  }
}
