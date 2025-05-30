
import { createClient } from '@supabase/supabase-js';
import { LegalDocument, DocumentAnalysis } from '../types/legal';

const supabaseUrl = 'https://vmtrzwjjbecxnhvjajmp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZtdHJ6d2pqYmVjeG5odmpham1wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NjQyNTcsImV4cCI6MjA2MzU0MDI1N30.WDnyrLDitvx12thYxFDx3VrEcLARGsPdbauit26E5Qk';

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseService {
  static async storeDocument(document: Omit<LegalDocument, 'id' | 'created_at' | 'updated_at'>): Promise<LegalDocument> {
    const { data, error } = await supabase
      .from('legal_documents')
      .insert({
        type: document.type,
        content: document.content,
        metadata: document.metadata,
        analysis: document.analysis
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing document:', error);
      throw new Error('Failed to store document');
    }

    return data;
  }

  static async updateDocumentAnalysis(documentId: string, analysis: DocumentAnalysis): Promise<void> {
    const { error } = await supabase
      .from('legal_documents')
      .update({ 
        analysis,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId);

    if (error) {
      console.error('Error updating document analysis:', error);
      throw new Error('Failed to update document analysis');
    }
  }

  static async getDocument(documentId: string): Promise<LegalDocument | null> {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Document not found
      }
      console.error('Error fetching document:', error);
      throw new Error('Failed to fetch document');
    }

    return data;
  }

  static async searchDocuments(query: string, limit: number = 10): Promise<LegalDocument[]> {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .textSearch('content', query)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents');
    }

    return data || [];
  }

  static async getDocumentsByType(type: string, limit: number = 10): Promise<LegalDocument[]> {
    const { data, error } = await supabase
      .from('legal_documents')
      .select('*')
      .eq('type', type)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents by type:', error);
      throw new Error('Failed to fetch documents by type');
    }

    return data || [];
  }

  static async logLegalQuery(query: string, category: string, response: string): Promise<void> {
    const { error } = await supabase
      .from('legal_queries')
      .insert({
        query,
        category,
        response,
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error logging legal query:', error);
      // Don't throw error for logging failures
    }
  }

  static async getQueryHistory(limit: number = 20): Promise<any[]> {
    const { data, error } = await supabase
      .from('legal_queries')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching query history:', error);
      return [];
    }

    return data || [];
  }

  // File upload for documents (PDFs, images, etc.)
  static async uploadFile(file: File, bucket: string = 'legal-documents'): Promise<string> {
    const fileName = `${Date.now()}-${file.name}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading file:', error);
      throw new Error('Failed to upload file');
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  static async deleteFile(fileName: string, bucket: string = 'legal-documents'): Promise<void> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([fileName]);

    if (error) {
      console.error('Error deleting file:', error);
      throw new Error('Failed to delete file');
    }
  }
}
