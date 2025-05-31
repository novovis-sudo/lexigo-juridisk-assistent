
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { LegalDocument, DocumentAnalysis, DocumentType } from '../types/legal';

export class SupabaseService {
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

  static async updateDocumentAnalysis(documentId: string, analysis: DocumentAnalysis): Promise<void> {
    const { error } = await supabase
      .from('analysis_results')
      .insert({
        document_id: documentId,
        summary: analysis.summary,
        key_points: analysis.key_points,
        legal_issues: analysis.legal_issues as any,
        recommendations: analysis.recommendations as any,
        next_steps: analysis.next_steps as any,
        legal_references: analysis.references as any,
        urgency_assessment: analysis.urgency_assessment as any,
        entities: {}, // Extract from metadata if needed
        confidence_score: 0.8, // Default confidence
        ai_model_used: 'mock-model',
        processing_time_ms: 1000
      });

    if (error) {
      console.error('Error storing document analysis:', error);
      throw new Error('Failed to store document analysis');
    }
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

  static async logLegalQuery(query: string, category: string, response: string): Promise<void> {
    // For now, we'll store this in the requests table until we create a specific legal_queries table
    const { error } = await supabase
      .from('requests')
      .insert({
        user_input: `${category}: ${query}`,
        result: response
      });

    if (error) {
      console.error('Error logging legal query:', error);
      // Don't throw error for logging failures
    }
  }

  static async getQueryHistory(limit: number = 20): Promise<any[]> {
    const { data, error } = await supabase
      .from('requests')
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

  // Letter generation and storage
  static async storeLetter(letter: {
    document_id?: string;
    letter_type: string;
    recipient_name?: string;
    recipient_address?: string;
    subject: string;
    content: string;
    template_used?: string;
    metadata?: any;
  }, userId: string): Promise<any> {
    const { data, error } = await supabase
      .from('letters')
      .insert({
        user_id: userId,
        document_id: letter.document_id,
        letter_type: letter.letter_type,
        recipient_name: letter.recipient_name,
        recipient_address: letter.recipient_address,
        subject: letter.subject,
        content: letter.content,
        template_used: letter.template_used,
        metadata: letter.metadata || {},
        status: 'generated'
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing letter:', error);
      throw new Error('Failed to store letter');
    }

    return data;
  }

  static async getUserLetters(limit: number = 20): Promise<any[]> {
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user letters:', error);
      return [];
    }

    return data || [];
  }
}
