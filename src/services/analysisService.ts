
import { supabase } from '@/integrations/supabase/client';
import { DocumentAnalysis } from '../types/legal';

export class AnalysisService {
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
}
