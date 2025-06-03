
import { LegalDocument, Recommendation, NextStep, DocumentType } from '../types/legal';

export class RecommendationGenerator {
  static generateRecommendations(document: LegalDocument, proContraAnalysis: any): Recommendation[] {
    const recommendations: Recommendation[] = [];
    
    // Add general recommendation
    recommendations.push({
      action: 'Kontakta juridisk rådgivning omedelbart',
      rationale: 'Professionell juridisk bedömning behövs för att säkerställa dina rättigheter',
      timeline: 'Inom 24-48 timmar',
      resources_needed: ['Kontakt med jurist', 'Dokumentation', 'Ekonomiska resurser'],
      success_probability: 0.8
    });
    
    // Add specific recommendations based on document type
    if (document.type === DocumentType.EVICTION_NOTICE) {
      recommendations.push({
        action: 'Kontakta Hyresgästföreningen',
        rationale: 'Specialiserad hjälp för hyresrättsliga frågor och representation',
        timeline: 'Omedelbart',
        resources_needed: ['Medlemskap', 'Hyreskontrakt', 'Kommunikation med hyresvärd'],
        success_probability: 0.75
      });
    }
    
    if (document.type === DocumentType.DEBT_NOTICE) {
      recommendations.push({
        action: 'Granska skuldens legitimitet',
        rationale: 'Kontrollera att skulden är korrekt och inte preskriberad',
        timeline: 'Inom 3-5 dagar',
        resources_needed: ['Dokumentation', 'Ekonomisk översikt'],
        success_probability: 0.6
      });
    }
    
    return recommendations;
  }

  static generateNextSteps(document: LegalDocument): NextStep[] {
    const steps: NextStep[] = [];
    
    steps.push({
      step: 'Samla all relevant dokumentation',
      description: 'Sammanställ alla dokument relaterade till ärendet',
      priority: 1,
      contacts: []
    });
    
    steps.push({
      step: 'Kontakta lämplig rådgivningsorganisation',
      description: 'Få professionell juridisk rådgivning för din specifika situation',
      priority: 2,
      contacts: this.getRelevantContacts(document.type)
    });
    
    return steps;
  }

  private static getRelevantContacts(docType: DocumentType) {
    const baseContacts = [
      {
        name: 'Juristjouren',
        type: 'legal_aid' as const,
        phone: '08-700 15 15',
        website: 'https://juristjouren.se'
      }
    ];
    
    if (docType === DocumentType.EVICTION_NOTICE) {
      baseContacts.push({
        name: 'Hyresgästföreningen',
        type: 'legal_aid' as const,
        phone: '08-796 02 00',
        website: 'https://hyresgastforeningen.se'
      });
    }
    
    return baseContacts;
  }
}
