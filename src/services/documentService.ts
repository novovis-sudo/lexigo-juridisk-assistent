
import { supabase } from '@/integrations/supabase/client';
import { LegalDocument, DocumentAnalysis, DocumentType } from '../types/legal';

export class DocumentService {
  static async storeDocument(document: Omit<LegalDocument, 'id' | 'created_at' | 'updated_at'>, userId: string): Promise<LegalDocument> {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        detected_type: document.type as any, // Cast to database enum
        content_text: document.content,
        metadata: document.metadata as any, // Cast to Json type
        language_code: document.metadata?.language || 'sv',
        urgency: document.metadata?.urgency_level as any,
        confidence_score: document.metadata?.confidence || 0,
        original_filename: document.metadata?.filename || null
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing document:', error);
      throw new Error('Failed to store document');
    }

    // Transform database row to LegalDocument format
    return {
      id: data.id,
      type: data.detected_type as DocumentType,
      content: data.content_text,
      metadata: data.metadata as any,
      analysis: undefined, // Will be populated separately
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }

  static async getDocument(documentId: string): Promise<LegalDocument | null> {
    // Get document with analysis
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .single();

    if (docError) {
      if (docError.code === 'PGRST116') {
        return null; // Document not found
      }
      console.error('Error fetching document:', docError);
      throw new Error('Failed to fetch document');
    }

    // Get analysis results
    const { data: analysisData } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Transform to LegalDocument format
    const document: LegalDocument = {
      id: docData.id,
      type: docData.detected_type as DocumentType,
      content: docData.content_text,
      metadata: docData.metadata as any,
      created_at: docData.created_at,
      updated_at: docData.updated_at
    };

    // Add analysis if available
    if (analysisData) {
      document.analysis = {
        summary: analysisData.summary,
        key_points: (analysisData.key_points || []) as string[],
        legal_issues: (analysisData.legal_issues || []) as any[],
        recommendations: (analysisData.recommendations || []) as any[],
        next_steps: (analysisData.next_steps || []) as any[],
        references: (analysisData.legal_references || []) as any[],
        urgency_assessment: (analysisData.urgency_assessment || {}) as any
      };
    }

    return document;
  }

  static async searchDocuments(query: string, limit: number = 10): Promise<LegalDocument[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .textSearch('content_text', query)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents');
    }

    return (data || []).map(item => ({
      id: item.id,
      type: item.detected_type as DocumentType,
      content: item.content_text,
      metadata: item.metadata as any,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  }

  static async getDocumentsByType(type: DocumentType, limit: number = 10): Promise<LegalDocument[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('detected_type', type as any)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents by type:', error);
      throw new Error('Failed to fetch documents by type');
    }

    return (data || []).map(item => ({
      id: item.id,
      type: item.detected_type as DocumentType,
      content: item.content_text,
      metadata: item.metadata as any,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  }
}
