import { LegalDocument, DocumentAnalysis, LegalIssue, Recommendation, NextStep, LegalReference, UrgencyLevel, DocumentType } from '../types/legal';
import { SwedishLegalDatabase } from './swedishLegalDatabase';
import { ProContraAnalyzer } from './proContraAnalyzer';

export class LegalAnalysisService {
  static async performAdvancedAnalysis(document: LegalDocument): Promise<DocumentAnalysis> {
    console.log('Performing advanced legal analysis for document:', document.id);
    
    // Extract legal concepts and legal points
    const legalConcepts = this.extractLegalConcepts(document.content);
    const legalPoints = this.extractLegalArguments(document.content);
    
    // Generate pro/contra analysis
    const proContraAnalysis = await ProContraAnalyzer.analyze(document.content, document.type);
    
    // Find similar cases and legal precedents
    const similarCases = await SwedishLegalDatabase.findSimilarCases(document.content, document.type);
    const legalReferences = this.generateLegalReferences(document.type, legalConcepts);
    
    // Create comprehensive analysis
    const analysis: DocumentAnalysis = {
      summary: this.generateSummary(document),
      key_points: this.extractKeyPoints(document.content),
      legal_issues: this.identifyLegalIssues(document, legalPoints),
      recommendations: this.generateRecommendations(document, proContraAnalysis),
      next_steps: this.generateNextSteps(document),
      references: legalReferences,
      urgency_assessment: this.assessUrgency(document)
    };
    
    // Store legal concepts in database
    await this.storeLegalConcepts(legalConcepts);
    
    return analysis;
  }

  private static extractLegalConcepts(content: string): string[] {
    const swedishLegalTerms = [
      'jordabalken', 'hyreslagen', 'uppsägning', 'avhysning', 'störning',
      'konsumentköplagen', 'reklamation', 'garanti', 'ångerrätt',
      'anställningsskydd', 'las', 'kollektivavtal', 'uppsägningstid',
      'diskrimineringslag', 'arbetsmiljölag', 'föräldraledighet',
      'socialförsäkringsbalken', 'försäkringskassan', 'sjukpenning',
      'barnbidrag', 'bostadsbidrag', 'aktivitetsersättning',
      'skuldsaneringslagen', 'kronofogden', 'betalningsföreläggande',
      'inkasso', 'betalningsanmärkning', 'utmätning',
      'förvaltningslagen', 'överklagande', 'förvaltningsrätt',
      'hyresnämnden', 'tingsrätt', 'hovrätt'
    ];
    
    const foundConcepts: string[] = [];
    const lowerContent = content.toLowerCase();
    
    for (const term of swedishLegalTerms) {
      if (lowerContent.includes(term)) {
        foundConcepts.push(term);
      }
    }
    
    return [...new Set(foundConcepts)];
  }

  private static extractLegalArguments(content: string): string[] {
    // Extract potential legal arguments based on content patterns
    const legalPoints: string[] = [];
    
    if (content.toLowerCase().includes('störning')) {
      legalPoints.push('Påstådd störning som grund för uppsägning');
    }
    if (content.toLowerCase().includes('hyresskuld')) {
      legalPoints.push('Uteblivna hyresbetalningar');
    }
    if (content.toLowerCase().includes('fel') && content.toLowerCase().includes('vara')) {
      legalPoints.push('Reklamation av defekt vara');
    }
    if (content.toLowerCase().includes('diskriminering')) {
      legalPoints.push('Misstänkt diskriminering');
    }
    
    return legalPoints;
  }

  private static generateSummary(document: LegalDocument): string {
    const summaries = {
      [DocumentType.EVICTION_NOTICE]: `Detta är en uppsägning av hyreskontrakt som kräver omedelbar uppmärksamhet. Hyresgästen har begränsad tid för att bestrida uppsägningen.`,
      [DocumentType.DEBT_NOTICE]: `Detta är en inkassovarning eller skuldsituation som kan leda till betalningsanmärkning. Snabb handling krävs för att undvika negativa konsekvenser.`,
      [DocumentType.BENEFIT_DECISION]: `Detta är ett beslut från svensk myndighet gällande social förmån eller ersättning. Beslutet kan överklagas inom fastställd tid.`,
      [DocumentType.EMPLOYMENT_CONTRACT]: `Detta är ett anställningsavtal eller arbetsjuridiskt dokument som reglerar anställningsförhållandet enligt svensk arbetsrätt.`,
      [DocumentType.CONSUMER_CONTRACT]: `Detta är ett konsumentavtal eller reklamation som faller under svensk konsumentskyddslagstiftning.`,
      [DocumentType.COURT_DECISION]: `Detta är ett domstolsbeslut som kan ha rättsliga konsekvenser och möjligen överklagas till högre instans.`
    };
    
    return summaries[document.type] || `Detta dokument kräver juridisk bedömning enligt svensk lagstiftning.`;
  }

  private static extractKeyPoints(content: string): string[] {
    const points: string[] = [];
    
    // Extract dates
    const dateMatches = content.match(/\d{4}-\d{2}-\d{2}|\d{1,2}\/\d{1,2}\/\d{4}|\d{1,2}\s+\w+\s+\d{4}/g);
    if (dateMatches) {
      points.push(`Viktiga datum: ${dateMatches.slice(0, 3).join(', ')}`);
    }
    
    // Extract amounts
    const amountMatches = content.match(/\d+[\s,]*\d*\s*kr|\d+[\s,]*\d*\s*kronor/gi);
    if (amountMatches) {
      points.push(`Ekonomiska belopp: ${amountMatches.slice(0, 3).join(', ')}`);
    }
    
    // Extract specific legal terms
    if (content.toLowerCase().includes('uppsägningstid')) {
      points.push('Uppsägningstid specificerad i dokumentet');
    }
    if (content.toLowerCase().includes('överklagande')) {
      points.push('Möjlighet till överklagande nämns');
    }
    
    return points.length > 0 ? points : ['Grundläggande juridisk dokumentation'];
  }

  private static identifyLegalIssues(document: LegalDocument, legalPoints: string[]): LegalIssue[] {
    const issues: LegalIssue[] = [];
    
    for (const legalPoint of legalPoints) {
      issues.push({
        title: legalPoint,
        description: `Juridisk fråga identifierad: ${legalPoint}`,
        severity: this.assessIssueSeverity(legalPoint, document.type),
        legal_basis: this.getLegalBasisForIssue(legalPoint),
        potential_outcomes: this.getPotentialOutcomes(legalPoint)
      });
    }
    
    if (issues.length === 0) {
      issues.push({
        title: 'Allmän juridisk bedömning',
        description: 'Dokumentet kräver juridisk analys och eventuell professionell rådgivning',
        severity: 'medium',
        legal_basis: ['Svensk lagstiftning'],
        potential_outcomes: ['Behov av juridisk rådgivning', 'Möjliga rättsliga åtgärder']
      });
    }
    
    return issues;
  }

  private static assessIssueSeverity(legalPoint: string, docType: DocumentType): 'low' | 'medium' | 'high' | 'critical' {
    if (legalPoint.includes('uppsägning') || legalPoint.includes('avhysning')) return 'critical';
    if (legalPoint.includes('inkasso') || legalPoint.includes('betalningsanmärkning')) return 'high';
    if (legalPoint.includes('reklamation') || legalPoint.includes('diskriminering')) return 'medium';
    return 'low';
  }

  private static getLegalBasisForIssue(legalPoint: string): string[] {
    const basis: string[] = [];
    
    if (legalPoint.includes('störning') || legalPoint.includes('uppsägning')) {
      basis.push('12 kap 46§ Jordabalken', 'Hyreslagstiftning');
    }
    if (legalPoint.includes('reklamation')) {
      basis.push('Konsumentköplagen (KKL)', 'Köplagen');
    }
    if (legalPoint.includes('diskriminering')) {
      basis.push('Diskrimineringslagen (DiskL)');
    }
    if (legalPoint.includes('anställning')) {
      basis.push('Lagen om anställningsskydd (LAS)');
    }
    
    return basis.length > 0 ? basis : ['Svensk civilrätt'];
  }

  private static getPotentialOutcomes(legalPoint: string): string[] {
    if (legalPoint.includes('uppsägning')) {
      return ['Avhysning', 'Framgångsrikt bestridande', 'Förlikning med hyresvärd'];
    }
    if (legalPoint.includes('inkasso')) {
      return ['Betalningsanmärkning', 'Avbetalningsplan', 'Skuldsanering'];
    }
    if (legalPoint.includes('reklamation')) {
      return ['Ersättning', 'Reparation', 'Byte av vara', 'Prisavdrag'];
    }
    
    return ['Fortsatt juridisk process', 'Förlikning', 'Domstolsprövning'];
  }

  private static generateRecommendations(document: LegalDocument, proContraAnalysis: any): Recommendation[] {
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

  private static generateNextSteps(document: LegalDocument): NextStep[] {
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

  private static generateLegalReferences(docType: DocumentType, concepts: string[]): LegalReference[] {
    const references: LegalReference[] = [];
    
    // Add specific legal references based on document type
    if (docType === DocumentType.EVICTION_NOTICE) {
      references.push({
        law_name: 'Jordabalken',
        section: '12 kap 46§',
        description: 'Hyresvärdens rätt att säga upp hyresavtal vid störning',
        url: 'https://lagen.nu/1970:994#K12P46S1',
        relevance_score: 0.95
      });
    }
    
    if (concepts.includes('konsumentköplagen')) {
      references.push({
        law_name: 'Konsumentköplagen',
        section: '16§',
        description: 'Konsumentens rätt att reklamera fel i vara',
        url: 'https://lagen.nu/1990:932#P16S1',
        relevance_score: 0.9
      });
    }
    
    return references;
  }

  private static assessUrgency(document: LegalDocument) {
    const urgencyKeywords = {
      critical: ['omedelbart', 'inom 3 dagar', 'avhysning', 'verkställighet'],
      high: ['inom en vecka', 'uppsägning', 'betalningsanmärkning'],
      medium: ['inom en månad', 'överklagande']
    };
    
    const content = document.content.toLowerCase();
    let level = UrgencyLevel.LOW;
    let reasoning = 'Ingen omedelbar tidsgräns identifierad';
    
    for (const [urgencyLevel, keywords] of Object.entries(urgencyKeywords)) {
      if (keywords.some(keyword => content.includes(keyword))) {
        level = urgencyLevel as UrgencyLevel;
        reasoning = `Tidskänsligt ärende - ${keywords.find(k => content.includes(k))} upptäckt`;
        break;
      }
    }
    
    return {
      level,
      reasoning,
      time_sensitive_actions: level === UrgencyLevel.CRITICAL ? 
        ['Kontakta jurist omedelbart', 'Samla dokumentation', 'Förbered svar'] : 
        ['Planera juridisk rådgivning', 'Organisera dokumentation'],
      consequences_of_delay: level === UrgencyLevel.CRITICAL ?
        ['Förlorad rätt att bestrida', 'Tvångsverkställighet', 'Ekonomiska konsekvenser'] :
        ['Minskade möjligheter', 'Komplicerad process']
    };
  }

  private static async storeLegalConcepts(concepts: string[]): Promise<void> {
    // This would store new legal concepts in the database
    console.log('Storing legal concepts:', concepts);
    // Implementation would use SupabaseService to store in legal_concepts table
  }
}
