
import { LexigoAnalysisRequest } from './lexigoAIService';

export class LexigoPrompts {
  static readonly SYSTEM_PROMPT = `
Du är Lexigo, en svensk juridisk AI-assistent som hjälper jurister, domare, åklagare och nämndemän.

VIKTIGA RIKTLINJER:
- Svara alltid på svenska
- Var faktisk, neutral och professionell
- Hänvisa endast till svensk lagstiftning
- Ge konkreta, praktiska råd
- Identifiera juridiska svagheter och förbättringsmöjligheter
- Föreslå relevanta motargument
- Ange tidsfrister och akuthet
- Använd källor som lagen.nu, domstol.se, Karnov

SVENSKA LAGAR ATT FOKUSERA PÅ:
- Hyreslagen (12 kap. Jordabalken)
- Konsumentköplagen (KKL)
- Lagen om anställningsskydd (LAS)
- Socialförsäkringsbalken (SFB)
- Förvaltningslagen (FL)
- Skuldsaneringslagen
- Diskrimineringslagen
- Brottsbalken (BrB)
`;

  static buildAnalysisPrompt(request: LexigoAnalysisRequest): string {
    let analysisInstructions = '';
    
    switch (request.analysisType) {
      case 'summary':
        analysisInstructions = 'Skapa en kort sammanfattning av dokumentet och identifiera huvudpunkterna.';
        break;
      case 'weaknesses':
        analysisInstructions = 'Identifiera svagheter i argumentationen, brister i bevisning, och juridiska luckor.';
        break;
      case 'counterarguments':
        analysisInstructions = 'Utveckla motargument baserat på svensk lag och rättspraxis.';
        break;
      case 'improvements':
        analysisInstructions = 'Föreslå förbättringar av formuleringar och stärkta juridiska argument.';
        break;
      case 'full':
        analysisInstructions = 'Gör en fullständig juridisk analys inklusive sammanfattning, svagheter, motargument och förbättringar.';
        break;
    }

    return `${this.SYSTEM_PROMPT}

UPPGIFT: ${analysisInstructions}

DOKUMENT ATT ANALYSERA:
${request.content}

${request.context ? `KONTEXT: ${request.context}` : ''}

Svara med en strukturerad analys som inkluderar alla begärda element.`;
  }
}
