import { DocumentType, UrgencyLevel } from '../types/legal';
import { OCRService } from '../services/ocrService';

export class DocumentProcessor {
  static async extractTextFromFile(file: File): Promise<string> {
    console.log('Extracting text from file using enhanced OCR service:', file.name);
    
    try {
      // Use the new OCR service for better text extraction
      return await OCRService.processDocument(file);
    } catch (error) {
      console.error('OCR extraction failed:', error);
      // Fallback to basic extraction
      return `Kunde inte extrahera text från ${file.name} (${file.type}). Filstorlek: ${file.size} bytes`;
    }
  }

  static detectDocumentType(filename: string, content: string): DocumentType {
    const lowerFilename = filename.toLowerCase();
    const lowerContent = content.toLowerCase();

    // Simple keyword-based detection
    if (lowerFilename.includes('uppsägning') || lowerContent.includes('uppsägning')) {
      return DocumentType.EVICTION_NOTICE;
    }
    if (lowerFilename.includes('hyreskontrakt') || lowerContent.includes('hyreskontrakt')) {
      return DocumentType.RENTAL_CONTRACT;
    }
    if (lowerFilename.includes('dom') || lowerContent.includes('domstol')) {
      return DocumentType.COURT_DECISION;
    }
    if (lowerFilename.includes('bidrag') || lowerContent.includes('försäkringskassan')) {
      return DocumentType.BENEFIT_DECISION;
    }
    if (lowerFilename.includes('anställning') || lowerContent.includes('anställningsavtal')) {
      return DocumentType.EMPLOYMENT_CONTRACT;
    }
    if (lowerFilename.includes('skuld') || lowerContent.includes('inkasso')) {
      return DocumentType.DEBT_NOTICE;
    }

    return DocumentType.OTHER;
  }

  static assessUrgency(content: string, documentType: DocumentType): UrgencyLevel {
    const lowerContent = content.toLowerCase();
    
    // Check for urgent keywords
    if (lowerContent.includes('omedelbar') || lowerContent.includes('brådskande')) {
      return UrgencyLevel.CRITICAL;
    }
    
    if (documentType === DocumentType.EVICTION_NOTICE || documentType === DocumentType.DEBT_NOTICE) {
      return UrgencyLevel.HIGH;
    }
    
    if (documentType === DocumentType.COURT_DECISION) {
      return UrgencyLevel.MEDIUM;
    }
    
    return UrgencyLevel.LOW;
  }
}
