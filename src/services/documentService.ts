
import { supabase } from '@/integrations/supabase/client';
import { LegalDocument, DocumentAnalysis, DocumentType } from '../types/legal';

export class DocumentService {
  // Simple document storage that works with the current database schema
  static async storeDocument(document: Omit<LegalDocument, 'id' | 'created_at' | 'updated_at'>, userId: string = 'test-user'): Promise<LegalDocument> {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: userId,
        title: `${document.type} Document`,
        content: document.content,
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing document:', error);
      throw new Error('Failed to store document');
    }

    // Transform database row to LegalDocument format
    return {
      id: data.id.toString(),
      type: document.type,
      content: data.content,
      metadata: document.metadata,
      analysis: undefined,
      created_at: data.created_at || new Date().toISOString(),
      updated_at: data.created_at || new Date().toISOString()
    };
  }

  static async getDocument(documentId: string): Promise<LegalDocument | null> {
    // Get document
    const { data: docData, error: docError } = await supabase
      .from('documents')
      .select('*')
      .eq('id', parseInt(documentId))
      .single();

    if (docError) {
      if (docError.code === 'PGRST116') {
        return null; // Document not found
      }
      console.error('Error fetching document:', docError);
      throw new Error('Failed to fetch document');
    }

    // Get analysis results if available
    const { data: analysisData } = await supabase
      .from('analysis_results')
      .select('*')
      .eq('document_id', documentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // Transform to LegalDocument format
    const document: LegalDocument = {
      id: docData.id.toString(),
      type: DocumentType.OTHER, // Default type since it's not stored in the simple schema
      content: docData.content,
      metadata: {
        language: 'sv' as const,
        confidence: 0.8,
        parties: [],
        dates: [],
        amounts: [],
        keywords: [],
        urgency_level: 'medium' as any,
        filename: docData.title
      },
      created_at: docData.created_at || new Date().toISOString(),
      updated_at: docData.created_at || new Date().toISOString()
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
      .ilike('content', `%${query}%`)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error searching documents:', error);
      throw new Error('Failed to search documents');
    }

    return (data || []).map(item => ({
      id: item.id.toString(),
      type: DocumentType.OTHER,
      content: item.content,
      metadata: {
        language: 'sv' as const,
        confidence: 0.8,
        parties: [],
        dates: [],
        amounts: [],
        keywords: [],
        urgency_level: 'medium' as any,
        filename: item.title
      },
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.created_at || new Date().toISOString()
    }));
  }

  static async getDocumentsByType(type: DocumentType, limit: number = 10): Promise<LegalDocument[]> {
    // Since the current schema doesn't store document types, return all documents
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents by type:', error);
      throw new Error('Failed to fetch documents by type');
    }

    return (data || []).map(item => ({
      id: item.id.toString(),
      type: type, // Use the requested type
      content: item.content,
      metadata: {
        language: 'sv' as const,
        confidence: 0.8,
        parties: [],
        dates: [],
        amounts: [],
        keywords: [],
        urgency_level: 'medium' as any,
        filename: item.title
      },
      created_at: item.created_at || new Date().toISOString(),
      updated_at: item.created_at || new Date().toISOString()
    }));
  }
}
