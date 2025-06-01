
// Import services for internal use
import { DocumentService } from './documentService';
import { AnalysisService } from './analysisService';
import { QueryService } from './queryService';
import { FileService } from './fileService';
import { LetterService } from './letterService';

// Re-export all services for backward compatibility
export { DocumentService } from './documentService';
export { AnalysisService } from './analysisService';
export { QueryService } from './queryService';
export { FileService } from './fileService';
export { LetterService } from './letterService';

// Legacy SupabaseService class that delegates to the new services
export class SupabaseService {
  // Document methods
  static async storeDocument(...args: Parameters<typeof DocumentService.storeDocument>) {
    return DocumentService.storeDocument(...args);
  }

  static async getDocument(...args: Parameters<typeof DocumentService.getDocument>) {
    return DocumentService.getDocument(...args);
  }

  static async searchDocuments(...args: Parameters<typeof DocumentService.searchDocuments>) {
    return DocumentService.searchDocuments(...args);
  }

  static async getDocumentsByType(...args: Parameters<typeof DocumentService.getDocumentsByType>) {
    return DocumentService.getDocumentsByType(...args);
  }

  // Analysis methods
  static async updateDocumentAnalysis(...args: Parameters<typeof AnalysisService.updateDocumentAnalysis>) {
    return AnalysisService.updateDocumentAnalysis(...args);
  }

  // Query methods
  static async logLegalQuery(...args: Parameters<typeof QueryService.logLegalQuery>) {
    return QueryService.logLegalQuery(...args);
  }

  static async getQueryHistory(...args: Parameters<typeof QueryService.getQueryHistory>) {
    return QueryService.getQueryHistory(...args);
  }

  // File methods
  static async uploadFile(...args: Parameters<typeof FileService.uploadFile>) {
    return FileService.uploadFile(...args);
  }

  static async deleteFile(...args: Parameters<typeof FileService.deleteFile>) {
    return FileService.deleteFile(...args);
  }

  // Letter methods
  static async storeLetter(...args: Parameters<typeof LetterService.storeLetter>) {
    return LetterService.storeLetter(...args);
  }

  static async getUserLetters(...args: Parameters<typeof LetterService.getUserLetters>) {
    return LetterService.getUserLetters(...args);
  }
}
