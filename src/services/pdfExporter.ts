
import { PDFExportService } from './pdfExportService';
import { SupabaseService } from './supabaseService';

export class PDFExporter {
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
}
