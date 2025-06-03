
import { DocumentClassifier } from './documentClassifier';
import { LegalAnalysisService } from './legalAnalysisService';
import { ProContraAnalyzer } from './proContraAnalyzer';
import { SwedishLegalDatabase } from './swedishLegalDatabase';
import { SupabaseService } from './supabaseService';
import { OCRService } from './ocrService';
import { LegalDocument, DocumentAnalysis } from '../types/legal';

export class DocumentProcessor {
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

  static async processMultipleDocuments(files: Array<{content: string, fileName: string}>): Promise<LegalDocument[]> {
    const results = await Promise.allSettled(
      files.map(file => this.processDocument(file.content, file.fileName))
    );
    
    return results
      .filter((result): result is PromiseFulfilledResult<LegalDocument> => result.status === 'fulfilled')
      .map(result => result.value);
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
}
