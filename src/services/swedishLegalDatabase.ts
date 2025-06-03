
import { DocumentType } from '../types/legal';

export interface SwedishLegalCase {
  id: string;
  title: string;
  court: string;
  date: string;
  case_number: string;
  summary: string;
  legal_area: string;
  relevance_score: number;
  url: string;
}

export interface SwedishLegalResource {
  source: 'domstol.se' | 'lagen.nu' | 'skatteverket.se' | 'ratsit.se';
  title: string;
  content: string;
  url: string;
  relevance: number;
}

export class SwedishLegalDatabase {
  // Simulated legal cases database
  private static readonly MOCK_CASES: SwedishLegalCase[] = [
    {
      id: 'T-1234-20',
      title: 'Uppsägning p.g.a. störning - Stockholms Tingsrätt',
      court: 'Stockholms Tingsrätt',
      date: '2023-03-15',
      case_number: 'T 1234-20',
      summary: 'Hyresgäst vann målet då hyresvärd inte kunde bevisa väsentlig störning',
      legal_area: 'Hyresrätt',
      relevance_score: 0.92,
      url: 'https://domstol.se/stockholms-tingsratt/avgoranden/t-1234-20'
    },
    {
      id: 'H-5678-21',
      title: 'Konsumenttvist - Hovrätten över Skåne och Blekinge',
      court: 'Hovrätten över Skåne och Blekinge',
      date: '2023-09-22',
      case_number: 'H 5678-21',
      summary: 'Konsument fick rätt till prisavdrag för defekt elektronik',
      legal_area: 'Konsumentskydd',
      relevance_score: 0.88,
      url: 'https://domstol.se/hovratt-skane-blekinge/avgoranden/h-5678-21'
    },
    {
      id: 'FÖ-9012-22',
      title: 'Överklagande av förmånsbeslut - Förvaltningsrätten Stockholm',
      court: 'Förvaltningsrätten Stockholm',
      date: '2023-11-10',
      case_number: 'FÖ 9012-22',
      summary: 'Försäkringskassans beslut upphävdes - felaktig bedömning av arbetsförmåga',
      legal_area: 'Socialförsäkring',
      relevance_score: 0.85,
      url: 'https://domstol.se/forvaltningsratt-stockholm/avgoranden/fo-9012-22'
    }
  ];

  static async findSimilarCases(content: string, docType: DocumentType): Promise<SwedishLegalCase[]> {
    console.log('Searching for similar cases in Swedish legal database...');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Filter cases based on document type and content
    const relevantCases = this.MOCK_CASES.filter(case_ => {
      switch (docType) {
        case DocumentType.EVICTION_NOTICE:
          return case_.legal_area === 'Hyresrätt';
        case DocumentType.CONSUMER_CONTRACT:
          return case_.legal_area === 'Konsumentskydd';
        case DocumentType.BENEFIT_DECISION:
          return case_.legal_area === 'Socialförsäkring';
        default:
          return true;
      }
    });
    
    // Sort by relevance score
    return relevantCases.sort((a, b) => b.relevance_score - a.relevance_score);
  }

  static async searchLegalResources(query: string): Promise<SwedishLegalResource[]> {
    console.log('Searching Swedish legal resources for:', query);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const resources: SwedishLegalResource[] = [];
    
    // Simulated lagen.nu results
    if (query.includes('hyresrätt') || query.includes('uppsägning')) {
      resources.push({
        source: 'lagen.nu',
        title: '12 kap. Jordabalken - Hyresavtal',
        content: 'Bestämmelser om hyresavtal för bostäder, uppsägning och störning...',
        url: 'https://lagen.nu/1970:994#K12',
        relevance: 0.95
      });
    }
    
    if (query.includes('konsument') || query.includes('reklamation')) {
      resources.push({
        source: 'lagen.nu',
        title: 'Konsumentköplagen (1990:932)',
        content: 'Lag om konsumentskydd vid köp av varor och tjänster...',
        url: 'https://lagen.nu/1990:932',
        relevance: 0.9
      });
    }
    
    // Simulated domstol.se results
    resources.push({
      source: 'domstol.se',
      title: 'Vägledning för hyresrättsliga tvister',
      content: 'Information om hur hyresnämnden hanterar tvister mellan hyresvärd och hyresgäst...',
      url: 'https://domstol.se/amnen/bostadsratt-och-hyresratt/',
      relevance: 0.8
    });
    
    // Simulated skatteverket.se results if tax-related
    if (query.includes('skatt') || query.includes('deklaration')) {
      resources.push({
        source: 'skatteverket.se',
        title: 'Skattefrågor vid uthyrning',
        content: 'Information om beskattning av hyresintäkter och avdrag...',
        url: 'https://skatteverket.se/privat/skatter/arbeteochinkomst/inkomster/uthyrningprivat.4.html',
        relevance: 0.85
      });
    }
    
    return resources.sort((a, b) => b.relevance - a.relevance);
  }

  static async getPersonalInformation(query: string): Promise<any> {
    console.log('Simulating ratsit.se / upplysning.se search for:', query);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return simulated public information (GDPR compliant)
    return {
      source: 'ratsit.se',
      disclaimer: 'Simulerad offentlig information - endast för demonstrationsändamål',
      data: {
        public_records: 'Begränsad offentlig information tillgänglig',
        note: 'Fullständig sökning kräver legitim anledning och GDPR-compliance'
      }
    };
  }

  static async searchCourtDecisions(keywords: string[]): Promise<SwedishLegalCase[]> {
    console.log('Searching court decisions for keywords:', keywords);
    
    // Filter existing cases by keywords
    const matchingCases = this.MOCK_CASES.filter(case_ => 
      keywords.some(keyword => 
        case_.title.toLowerCase().includes(keyword.toLowerCase()) ||
        case_.summary.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    return matchingCases;
  }

  static async getLegalUpdates(): Promise<any[]> {
    console.log('Fetching latest Swedish legal updates...');
    
    // Simulate recent legal updates
    return [
      {
        date: '2024-01-15',
        title: 'Nya regler för hyresrättsliga tvister',
        summary: 'Förändringar i processen för hyresnämnden träder i kraft',
        source: 'domstol.se',
        url: 'https://domstol.se/nyheter/2024/nya-regler-hyresratt'
      },
      {
        date: '2024-01-10',
        title: 'Uppdaterad konsumentlagstiftning',
        summary: 'Stärkt konsumentskydd för digitala tjänster',
        source: 'konsumentverket.se',
        url: 'https://konsumentverket.se/nyheter/2024/digital-konsumentskydd'
      }
    ];
  }
}
