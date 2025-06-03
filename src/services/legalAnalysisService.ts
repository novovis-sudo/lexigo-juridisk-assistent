
import { LegalDocument, DocumentAnalysis } from '../types/legal';
import { SwedishLegalDatabase } from './swedishLegalDatabase';
import { ProContraAnalyzer } from './proContraAnalyzer';
import { LegalConceptExtractor } from './legalConceptExtractor';
import { LegalIssueAnalyzer } from './legalIssueAnalyzer';
import { RecommendationGenerator } from './recommendationGenerator';
import { UrgencyAssessor } from './urgencyAssessor';
import { DocumentSummaryGenerator } from './documentSummaryGenerator';

export class LegalAnalysisService {
  static async performAdvancedAnalysis(document: LegalDocument): Promise<DocumentAnalysis> {
    console.log('Performing advanced legal analysis for document:', document.id);
    
    // Extract legal concepts and legal points
    const legalConcepts = LegalConceptExtractor.extractLegalConcepts(document.content);
    const legalPoints = LegalConceptExtractor.extractLegalPoints(document.content);
    
    // Generate pro/contra analysis
    const proContraAnalysis = await ProContraAnalyzer.analyze(document.content, document.type);
    
    // Find similar cases and legal precedents
    const similarCases = await SwedishLegalDatabase.findSimilarCases(document.content, document.type);
    const legalReferences = DocumentSummaryGenerator.generateLegalReferences(document.type, legalConcepts);
    
    // Create comprehensive analysis
    const analysis: DocumentAnalysis = {
      summary: DocumentSummaryGenerator.generateSummary(document),
      key_points: LegalConceptExtractor.extractKeyPoints(document.content),
      legal_issues: LegalIssueAnalyzer.identifyLegalIssues(document, legalPoints),
      recommendations: RecommendationGenerator.generateRecommendations(document, proContraAnalysis),
      next_steps: RecommendationGenerator.generateNextSteps(document),
      references: legalReferences,
      urgency_assessment: UrgencyAssessor.assessUrgency(document)
    };
    
    // Store legal concepts in database
    await this.storeLegalConcepts(legalConcepts);
    
    return analysis;
  }

  private static async storeLegalConcepts(concepts: string[]): Promise<void> {
    // This would store new legal concepts in the database
    console.log('Storing legal concepts:', concepts);
    // Implementation would use SupabaseService to store in legal_concepts table
  }
}
