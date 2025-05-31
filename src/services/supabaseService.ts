
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { LegalDocument, DocumentAnalysis } from '../types/legal';

export class SupabaseService {
  static async storeDocument(document: Omit<LegalDocument, 'id' | 'created_at' | 'updated_at'>): Promise<LegalDocument> {
    const { data, error } = await supabase
      .from('documents')
      .insert({
        detected_type: document.type,
        content_text: document.content,
        metadata: document.metadata,
        language_code: document.metadata?.language || 'sv',
        urgency: document.metadata?.urgency_level,
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
      type: data.detected_type,
      content: data.content_text,
      metadata: data.metadata,
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
        legal_issues: analysis.legal_issues,
        recommendations: analysis.recommendations,
        next_steps: analysis.next_steps,
        legal_references: analysis.references,
        urgency_assessment: analysis.urgency_assessment,
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
      type: docData.detected_type,
      content: docData.content_text,
      metadata: docData.metadata,
      created_at: docData.created_at,
      updated_at: docData.updated_at
    };

    // Add analysis if available
    if (analysisData) {
      document.analysis = {
        summary: analysisData.summary,
        key_points: analysisData.key_points || [],
        legal_issues: analysisData.legal_issues || [],
        recommendations: analysisData.recommendations || [],
        next_steps: analysisData.next_steps || [],
        references: analysisData.legal_references || [],
        urgency_assessment: analysisData.urgency_assessment || {}
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
      type: item.detected_type,
      content: item.content_text,
      metadata: item.metadata,
      created_at: item.created_at,
      updated_at: item.updated_at
    }));
  }

  static async getDocumentsByType(type: string, limit: number = 10): Promise<LegalDocument[]> {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .eq('detected_type', type)
      .limit(limit)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching documents by type:', error);
      throw new Error('Failed to fetch documents by type');
    }

    return (data || []).map(item => ({
      id: item.id,
      type: item.detected_type,
      content: item.content_text,
      metadata: item.metadata,
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
  }): Promise<any> {
    const { data, error } = await supabase
      .from('letters')
      .insert({
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
