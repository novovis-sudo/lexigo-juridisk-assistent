
import { DocumentType } from '../types/legal';

export class LegalConceptExtractor {
  private static readonly SWEDISH_LEGAL_TERMS = [
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

  static extractLegalConcepts(content: string): string[] {
    const foundConcepts: string[] = [];
    const lowerContent = content.toLowerCase();
    
    for (const term of this.SWEDISH_LEGAL_TERMS) {
      if (lowerContent.includes(term)) {
        foundConcepts.push(term);
      }
    }
    
    return [...new Set(foundConcepts)];
  }

  static extractLegalPoints(content: string): string[] {
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

  static extractKeyPoints(content: string): string[] {
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
}
