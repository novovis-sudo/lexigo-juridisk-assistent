
import { supabase } from '@/integrations/supabase/client';
import { LexigoAnalysisResponse } from './lexigoAIService';

export class LexigoDatabase {
  static async saveAnalysisToDatabase(content: string, analysis: LexigoAnalysisResponse): Promise<void> {
    try {
      // Generate a temporary document ID since we don't have a real document ID
      const tempDocumentId = crypto.randomUUID();
      
      // Spara i analysis_results tabellen
      const { error } = await supabase
        .from('analysis_results')
        .insert({
          document_id: tempDocumentId,
          summary: analysis.summary,
          key_points: analysis.keyPoints,
          legal_issues: analysis.weaknesses.map(w => ({
            title: 'Identifierad svaghet',
            description: w,
            severity: 'medium'
          })),
          recommendations: analysis.improvements.map(i => ({
            action: i,
            rationale: 'Förbättring av juridisk argumentation',
            timeline: 'Vid nästa tillfälle'
          })),
          next_steps: analysis.nextActions.map((action, index) => ({
            step: action,
            priority: index + 1,
            description: action
          })),
          legal_references: analysis.legalReferences,
          urgency_assessment: {
            level: analysis.urgency,
            deadlines: analysis.deadlines,
            reasoning: `Bedömning baserad på dokumenttyp och innehåll`
          },
          confidence_score: 0.85,
          ai_model_used: 'lexigo-sv-legal',
          processing_time_ms: 1500
        });

      if (error) {
        console.error('Fel vid sparande av analys:', error);
      }
    } catch (error) {
      console.error('Databasfel:', error);
    }
  }
}
