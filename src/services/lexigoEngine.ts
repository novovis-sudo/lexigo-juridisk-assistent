
import { DocumentProcessor } from './documentProcessor';
import { LegalQueryProcessor } from './legalQueryProcessor';
import { CaseAnalyzer } from './caseAnalyzer';
import { ConceptSearcher } from './conceptSearcher';
import { PDFExporter } from './pdfExporter';
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
    return DocumentProcessor.processDocumentWithOCR(file, userId);
  }

  /**
   * Enhanced document processing with advanced legal analysis
   */
  static async processDocument(content: string, fileName?: string, userId: string = 'anonymous'): Promise<LegalDocument> {
    return DocumentProcessor.processDocument(content, fileName, userId);
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
    return LegalQueryProcessor.answerLegalQuestionWithAnalysis(question, category, context, documentId);
  }

  /**
   * Export legal analysis to PDF
   */
  static async exportAnalysisToPDF(documentId: string, title?: string): Promise<Blob> {
    return PDFExporter.exportAnalysisToPDF(documentId, title);
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
    return CaseAnalyzer.getEnhancedCaseSummary(documentId, additionalQuestions);
  }

  /**
   * Search and link legal concepts
   */
  static async searchAndLinkConcepts(text: string): Promise<string[]> {
    return ConceptSearcher.searchAndLinkConcepts(text);
  }

  /**
   * Get legal updates from Swedish sources
   */
  static async getLegalUpdates(): Promise<any[]> {
    return ConceptSearcher.getLegalUpdates();
  }

  static async getDocumentAnalysis(documentId: string): Promise<DocumentAnalysis | null> {
    return DocumentProcessor.getDocumentAnalysis(documentId);
  }

  static async generateFollowUpQuestions(context: string): Promise<string[]> {
    return LegalQueryProcessor.generateFollowUpQuestions(context);
  }

  static async findSimilarCases(query: string, documentType?: DocumentType): Promise<LegalDocument[]> {
    return CaseAnalyzer.findSimilarCases(query, documentType);
  }

  static async processMultipleDocuments(files: Array<{content: string, fileName: string}>): Promise<LegalDocument[]> {
    return DocumentProcessor.processMultipleDocuments(files);
  }
}
