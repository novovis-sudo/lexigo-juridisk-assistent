
import { DocumentType } from '../types/legal';

export interface ProContraAnalysis {
  pro_arguments: Array<{
    argument: string;
    strength: number;
    legal_basis: string[];
    explanation: string;
  }>;
  contra_arguments: Array<{
    argument: string;
    strength: number;
    legal_basis: string[];
    explanation: string;
  }>;
  overall_assessment: {
    favor_rating: number; // -1 to 1 scale
    recommendation: string;
    confidence: number;
  };
  potential_strategies: string[];
}

export class ProContraAnalyzer {
  static async analyze(content: string, docType: DocumentType): Promise<ProContraAnalysis> {
    console.log('Analyzing pro/contra arguments for document type:', docType);
    
    const lowerContent = content.toLowerCase();
    
    switch (docType) {
      case DocumentType.EVICTION_NOTICE:
        return this.analyzeEvictionCase(lowerContent);
      case DocumentType.DEBT_NOTICE:
        return this.analyzeDebtCase(lowerContent);
      case DocumentType.BENEFIT_DECISION:
        return this.analyzeBenefitCase(lowerContent);
      case DocumentType.EMPLOYMENT_CONTRACT:
        return this.analyzeEmploymentCase(lowerContent);
      case DocumentType.CONSUMER_CONTRACT:
        return this.analyzeConsumerCase(lowerContent);
      default:
        return this.analyzeGeneralCase(lowerContent);
    }
  }

  private static analyzeEvictionCase(content: string): ProContraAnalysis {
    const proArguments = [];
    const contraArguments = [];
    
    // Arguments in favor of tenant (contra eviction)
    if (!content.includes('störning dokumenterad')) {
      contraArguments.push({
        argument: 'Brist på dokumentation av störning',
        strength: 0.8,
        legal_basis: ['12 kap 46§ JB', 'Bevisbörda'],
        explanation: 'Hyresvärden måste kunna bevisa att störningen faktiskt ägt rum och varit väsentlig'
      });
    }

    if (content.includes('första varning') || !content.includes('tidigare varning')) {
      contraArguments.push({
        argument: 'Otillräcklig varning eller graderad påföljd',
        strength: 0.7,
        legal_basis: ['12 kap 46§ JB', 'Proportionalitetsprincipen'],
        explanation: 'Uppsägning ska vara sista utväg efter varningar och andra åtgärder'
      });
    }

    // Arguments in favor of landlord (pro eviction)
    if (content.includes('upprepade') || content.includes('fortsatt störning')) {
      proArguments.push({
        argument: 'Upprepade störningar dokumenterade',
        strength: 0.9,
        legal_basis: ['12 kap 46§ JB'],
        explanation: 'Kontinuerliga störningar kan motivera uppsägning om de är väsentliga'
      });
    }

    if (content.includes('polisanmälan') || content.includes('vittnen')) {
      proArguments.push({
        argument: 'Extern dokumentation av störning',
        strength: 0.85,
        legal_basis: ['12 kap 46§ JB', 'Bevisning'],
        explanation: 'Polisanmälningar och vittnesmål stärker hyresvärdens position'
      });
    }

    const favor_rating = this.calculateFavorRating(proArguments, contraArguments);
    
    return {
      pro_arguments: proArguments,
      contra_arguments: contraArguments,
      overall_assessment: {
        favor_rating,
        recommendation: favor_rating > 0 ? 
          'Bra chanser att bestrida uppsägningen framgångsrikt' : 
          'Uppsägningen kan vara befogad, fokusera på förlikning',
        confidence: 0.75
      },
      potential_strategies: [
        'Samla motbevis och vittnesuppgifter',
        'Dokumentera egen version av händelser',
        'Kontakta Hyresgästföreningen för representation',
        'Överväg förlikningssamtal med hyresvärd',
        'Ansök om rättshjälp för domstolsprocess'
      ]
    };
  }

  private static analyzeDebtCase(content: string): ProContraAnalysis {
    const proArguments = [];
    const contraArguments = [];
    
    // Arguments against the debt
    if (content.includes('preskription') || this.checkPrescriptionPossible(content)) {
      contraArguments.push({
        argument: 'Möjlig preskription av skulden',
        strength: 0.9,
        legal_basis: ['Preskriptionslagen'],
        explanation: 'Skulder preskriberas normalt efter 3 år från förfallodatum'
      });
    }

    if (content.includes('bestridd') || content.includes('aldrig mottagit')) {
      contraArguments.push({
        argument: 'Skulden har bestretts eller är okänd',
        strength: 0.8,
        legal_basis: ['Skuldebrevslagen', 'Bevisbörda'],
        explanation: 'Borgenären måste kunna bevisa att skulden är befogad'
      });
    }

    // Arguments for the debt
    if (content.includes('kvitto') || content.includes('avtal') || content.includes('faktura')) {
      proArguments.push({
        argument: 'Dokumenterad skuld med underlag',
        strength: 0.85,
        legal_basis: ['Skuldebrevslagen', 'Avtalsrätt'],
        explanation: 'Skriftlig dokumentation stärker fordringsägarens position'
      });
    }

    const favor_rating = this.calculateFavorRating(proArguments, contraArguments);
    
    return {
      pro_arguments: proArguments,
      contra_arguments: contraArguments,
      overall_assessment: {
        favor_rating,
        recommendation: favor_rating > 0.3 ? 
          'Skulden kan bestridas med framgång' : 
          'Fokusera på avbetalningsplan eller skuldsanering',
        confidence: 0.7
      },
      potential_strategies: [
        'Kontrollera preskription och skuldens giltighet',
        'Begär fullständig utredning av fordringsägarens rätt',
        'Förhandla om avbetalningsplan',
        'Överväg skuldsanering om ekonomin är ohållbar',
        'Kontakta konsumentvägledning för rådgivning'
      ]
    };
  }

  private static analyzeBenefitCase(content: string): ProContraAnalysis {
    return {
      pro_arguments: [
        {
          argument: 'Rätt till ekonomiskt stöd enligt lag',
          strength: 0.8,
          legal_basis: ['Socialförsäkringsbalken', 'Socialtjänstlagen'],
          explanation: 'Alla som uppfyller kriterierna har rätt till ekonomiskt stöd'
        }
      ],
      contra_arguments: [
        {
          argument: 'Myndighetens bedömning av ekonomiskt behov',
          strength: 0.6,
          legal_basis: ['Förvaltningslagen', 'Prövning enligt lag'],
          explanation: 'Myndigheten har tolkningsutrymme inom lagens ramar'
        }
      ],
      overall_assessment: {
        favor_rating: 0.4,
        recommendation: 'Överklaga om du anser att beslutet är felaktigt',
        confidence: 0.65
      },
      potential_strategies: [
        'Överklaga till förvaltningsrätt',
        'Begär omprövning hos myndigheten',
        'Samla ytterligare dokumentation',
        'Kontakta jurist specialiserad på förvaltningsrätt'
      ]
    };
  }

  private static analyzeEmploymentCase(content: string): ProContraAnalysis {
    return {
      pro_arguments: [
        {
          argument: 'Anställningsskydd enligt LAS',
          strength: 0.9,
          legal_basis: ['Lagen om anställningsskydd (LAS)'],
          explanation: 'Stark legal protection against wrongful termination'
        }
      ],
      contra_arguments: [
        {
          argument: 'Saklig grund för uppsägning',
          strength: 0.7,
          legal_basis: ['LAS 7§', 'Personliga skäl'],
          explanation: 'Arbetsgivaren kan ha sakliga skäl för uppsägning'
        }
      ],
      overall_assessment: {
        favor_rating: 0.3,
        recommendation: 'Granska om uppsägningen följer LAS krav',
        confidence: 0.7
      },
      potential_strategies: [
        'Kontakta fackförbund för stöd',
        'Granska om korrekta processer följts',
        'Begär specificering av uppsägningsgrund',
        'Överväg förhandling om avgångsvederlag'
      ]
    };
  }

  private static analyzeConsumerCase(content: string): ProContraAnalysis {
    return {
      pro_arguments: [
        {
          argument: 'Konsumentskydd enligt KKL',
          strength: 0.85,
          legal_basis: ['Konsumentköplagen', 'EU-direktiv'],
          explanation: 'Stark konsumentskyddslagstiftning i Sverige'
        }
      ],
      contra_arguments: [
        {
          argument: 'Normalslitage eller felaktig användning',
          strength: 0.6,
          legal_basis: ['KKL begränsningar', 'Bevisbörda'],
          explanation: 'Säljaren kan hävda att felet inte omfattas av garanti'
        }
      ],
      overall_assessment: {
        favor_rating: 0.5,
        recommendation: 'Genomför reklamation enligt KKL',
        confidence: 0.75
      },
      potential_strategies: [
        'Reklamera skriftligt inom skälig tid',
        'Dokumentera felet med bilder',
        'Begär reparation, byte eller prisavdrag',
        'Kontakta Allmänna reklamationsnämnden (ARN)'
      ]
    };
  }

  private static analyzeGeneralCase(content: string): ProContraAnalysis {
    return {
      pro_arguments: [
        {
          argument: 'Allmän rättssäkerhet',
          strength: 0.7,
          legal_basis: ['Grundlag', 'Rättssäkerhet'],
          explanation: 'Alla har rätt till rättssäker behandling'
        }
      ],
      contra_arguments: [
        {
          argument: 'Motpartens rättsliga ställning',
          strength: 0.6,
          legal_basis: ['Civilrätt', 'Processrätt'],
          explanation: 'Även motparten har rättsliga intressen att bevaka'
        }
      ],
      overall_assessment: {
        favor_rating: 0.1,
        recommendation: 'Sök juridisk rådgivning för specifik bedömning',
        confidence: 0.5
      },
      potential_strategies: [
        'Kontakta jurist för rättslig bedömning',
        'Samla relevant dokumentation',
        'Överväg medling eller förlikning'
      ]
    };
  }

  private static calculateFavorRating(proArgs: any[], contraArgs: any[]): number {
    const proScore = proArgs.reduce((sum, arg) => sum + arg.strength, 0) / Math.max(proArgs.length, 1);
    const contraScore = contraArgs.reduce((sum, arg) => sum + arg.strength, 0) / Math.max(contraArgs.length, 1);
    
    return contraScore - proScore; // Positive means favor defendant/consumer
  }

  private static checkPrescriptionPossible(content: string): boolean {
    // Simple heuristic to check if prescription might apply
    const currentYear = new Date().getFullYear();
    const oldDatePattern = new RegExp(`(${currentYear - 3}|${currentYear - 4}|${currentYear - 5})`);
    return oldDatePattern.test(content);
  }
}
