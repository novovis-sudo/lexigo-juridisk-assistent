
import { LexigoAnalysisRequest, LexigoAnalysisResponse } from './lexigoAIService';

export class LexigoAnalyzer {
  static async simulateAIAnalysis(request: LexigoAnalysisRequest): Promise<LexigoAnalysisResponse> {
    // Simulerad AI-analys baserat på innehållet
    const content = request.content.toLowerCase();
    
    let urgency: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let deadlines: string[] = [];
    
    // Bedöm akuthet baserat på innehåll
    if (content.includes('uppsägning') || content.includes('avhysning')) {
      urgency = 'critical';
      deadlines.push('Bestrida inom 6 veckor från uppsägningen');
    } else if (content.includes('inkasso') || content.includes('betalningsanmärkning')) {
      urgency = 'high';
      deadlines.push('Kontakta borgenär inom 10 dagar');
    } else if (content.includes('överklagande')) {
      urgency = 'medium';
      deadlines.push('Överklaga inom 3 veckor från beslutsdatum');
    }

    const response: LexigoAnalysisResponse = {
      summary: this.generateSummary(content, request.analysisType),
      keyPoints: this.extractKeyPoints(content),
      weaknesses: this.identifyWeaknesses(content),
      counterarguments: this.generateCounterarguments(content),
      improvements: this.suggestImprovements(content),
      legalReferences: this.findLegalReferences(content),
      nextActions: this.suggestNextActions(content, urgency),
      urgency,
      deadlines,
      followUpQuestions: this.generateFollowUpQuestions(content, request.analysisType)
    };

    return response;
  }

  private static generateSummary(content: string, analysisType: string): string {
    if (content.includes('uppsägning')) {
      return 'Dokumentet är en uppsägning av hyreskontrakt. Hyresgästen har rätt att bestrida uppsägningen inom fastställd tid.';
    } else if (content.includes('skuld')) {
      return 'Dokumentet gäller en skuldsituation som kräver omedelbar uppmärksamhet för att undvika negativa konsekvenser.';
    } else if (content.includes('anställning')) {
      return 'Dokumentet berör anställningsrättsliga frågor som regleras av LAS och kollektivavtal.';
    }
    return 'Dokumentet kräver juridisk bedömning enligt svensk lagstiftning.';
  }

  private static extractKeyPoints(content: string): string[] {
    const points: string[] = [];
    
    if (content.includes('uppsägning')) {
      points.push('Uppsägningsgrund måste vara saklig och väl dokumenterad');
      points.push('Hyresgästen har rätt till motbevisning');
      points.push('Uppsägningstid måste följas enligt lag');
    }
    
    if (content.includes('störning')) {
      points.push('Störningen måste vara väsentlig och dokumenterad');
      points.push('Varningar ska ha getts innan uppsägning');
      points.push('Proportionalitetsprincipen ska tillämpas');
    }

    if (points.length === 0) {
      points.push('Dokumentet kräver noggrann juridisk granskning');
      points.push('Relevanta tidsfrister bör kontrolleras');
    }

    return points;
  }

  private static identifyWeaknesses(content: string): string[] {
    const weaknesses: string[] = [];

    if (content.includes('uppsägning') && !content.includes('dokumentation')) {
      weaknesses.push('Bristande dokumentation av påstådda störningar');
    }
    
    if (content.includes('utan förvarning')) {
      weaknesses.push('Ingen graderad påföljd eller varning före uppsägning');
    }

    if (!content.includes('datum') && !content.includes('20')) {
      weaknesses.push('Oklara eller saknade datum för händelser');
    }

    if (weaknesses.length === 0) {
      weaknesses.push('Kontrollera att alla formkrav är uppfyllda');
    }

    return weaknesses;
  }

  private static generateCounterarguments(content: string): string[] {
    const counterArgs: string[] = [];

    if (content.includes('störning')) {
      counterArgs.push('Störningen är inte väsentlig enligt 12 kap 46§ JB');
      counterArgs.push('Hyresvärden har inte följt proportionalitetsprincipen');
      counterArgs.push('Otillräcklig dokumentation av påstådda störningar');
    }

    if (content.includes('skuld')) {
      counterArgs.push('Skulden kan vara preskriberad enligt preskriptionslagen');
      counterArgs.push('Bristande dokumentation av skuldens legitimitet');
    }

    if (counterArgs.length === 0) {
      counterArgs.push('Formella brister i ärendets handläggning');
      counterArgs.push('Bristande rättslig grund för beslutet');
    }

    return counterArgs;
  }

  private static suggestImprovements(content: string): string[] {
    return [
      'Förtydliga juridiska argument med hänvisning till specifika lagrum',
      'Stärk bevisningen med ytterligare dokumentation',
      'Använd mer precis juridisk terminologi',
      'Strukturera argumentationen kronologiskt',
      'Lägg till relevanta prejudikat som stöd'
    ];
  }

  private static findLegalReferences(content: string): Array<{
    source: string;
    law: string;
    section: string;
    description: string;
    url?: string;
  }> {
    const references = [];

    if (content.includes('hyresrätt') || content.includes('uppsägning')) {
      references.push({
        source: 'lagen.nu',
        law: 'Jordabalken',
        section: '12 kap 46§',
        description: 'Hyresvärdens uppsägningsrätt vid störningar',
        url: 'https://lagen.nu/1970:994#K12P46S1'
      });
    }

    if (content.includes('konsument')) {
      references.push({
        source: 'lagen.nu',
        law: 'Konsumentköplagen',
        section: '16§',
        description: 'Konsumentens reklamationsrätt',
        url: 'https://lagen.nu/1990:932#P16S1'
      });
    }

    if (references.length === 0) {
      references.push({
        source: 'domstol.se',
        law: 'Allmän information',
        section: 'Rättegång',
        description: 'Information om rättsprocessen'
      });
    }

    return references;
  }

  private static suggestNextActions(content: string, urgency: string): string[] {
    const actions: string[] = [];

    if (urgency === 'critical') {
      actions.push('Kontakta jurist omedelbart');
      actions.push('Samla all relevant dokumentation');
      actions.push('Förbered bestridande inom lagstadgad tid');
    } else if (urgency === 'high') {
      actions.push('Sök juridisk rådgivning inom kort');
      actions.push('Dokumentera alla kommunikationer');
    } else {
      actions.push('Överväg juridisk konsultation');
      actions.push('Organisera dokumentation');
    }

    if (content.includes('hyresrätt')) {
      actions.push('Kontakta Hyresgästföreningen');
    }

    return actions;
  }

  private static generateFollowUpQuestions(content: string, analysisType: string): string[] {
    const questions: string[] = [
      'Vill du att jag formulerar ett svarsbrev baserat på denna analys?',
      'Ska jag söka liknande rättsfall som kan stärka din position?',
      'Behöver du hjälp med att identifiera vilka dokument som saknas?'
    ];

    if (content.includes('uppsägning')) {
      questions.push('Vill du att jag hjälper dig att formulera en invändning mot uppsägningen?');
    }

    if (analysisType === 'weaknesses') {
      questions.push('Ska jag föreslå hur dessa svagheter kan åtgärdas?');
    }

    return questions;
  }
}
