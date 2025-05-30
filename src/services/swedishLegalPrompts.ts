
import { DocumentType, LegalCategory } from '../types/legal';

export class SwedishLegalPrompts {
  private static readonly SYSTEM_PROMPT = `
Du är Lexigo, en svensk juridisk AI-assistent som hjälper människor att förstå och hantera juridiska frågor.

VIKTIGA RIKTLINJER:
- Svara alltid på svenska
- Ge konkreta, genomförbara råd
- Hänvisa till specifika svenska lagar och förordningar
- Strukturera svar tydligt med punktlistor
- Bedöm akuthet och ge tidsramar för handlingar
- Föreslå konkreta nästa steg
- Inkludera relevanta kontaktuppgifter (myndigheter, rådgivning)
- Varna för juridiska risker
- Rekommendera professionell juridisk hjälp när det behövs

SVENSKA LAGAR ATT REFERERA:
- Hyreslagen (12 kap. Jordabalken)
- Konsumentköplagen (KKL)
- Lagen om anställningsskydd (LAS)
- Socialförsäkringsbalken (SFB)
- Förvaltningslagen (FL)
- Skuldsaneringslagen
- Diskrimineringslagen
- Brottsbalken (BrB)
`;

  private static readonly DOCUMENT_ANALYSIS_PROMPTS = {
    [DocumentType.EVICTION_NOTICE]: `
Analysera denna uppsägning/avhysning enligt svensk hyresrätt:

1. DOKUMENT TYP: Identifiera om det är uppsägning eller avhysning
2. LEGAL GRUND: Vilken grund används enligt 12 kap. Jordabalken?
3. TIDSFRISTER: Kontrollera uppsägningstider och handläggningstider
4. FORMKRAV: Är uppsägningen korrekt formulerad och signerad?
5. MÖJLIGA INVÄNDNINGAR: Vilka argument kan hyresgästen använda?
6. AKUTA ÅTGÄRDER: Vad måste göras omedelbart?
7. KONTAKTER: Hyresgästföreningen, Kronofogden, tingsrätt

Bedöm sannolikhet för framgång vid överklagande och ge konkreta handlingsalternativ.
`;

    [DocumentType.BENEFIT_DECISION]: `
Analysera detta beslut från svensk myndighet (Försäkringskassan/AF/Socialtjänst):

1. BESLUT TYP: Vilket stöd/ersättning gäller beslutet?
2. MOTIVERING: Är beslutsmotiveringen tillräcklig enligt förvaltningslagen?
3. RÄTTSLIG GRUND: Vilka paragrafer hänvisas till?
4. ÖVERKLAGANDEMÖJLIGHETER: Tidsfrister och instanser
5. BEVISNING: Vilka dokument behövs för överklagande?
6. TILLFÄLLIGT STÖD: Finns möjlighet till interimistiska beslut?
7. KONTAKTER: Förvaltningsrätt, Juristjouren, Stadsmissionen

Föreslå strategi för överklagande och bedöm framgångschanser.
`;

    [DocumentType.DEBT_NOTICE]: `
Analysera denna inkasso/skuldsanering enligt svensk skuldrättslagstiftning:

1. SKULD LEGITIMITET: Är skulden giltig och korrekt beräknad?
2. INKASSOPROCESSEN: Följer den gällande regler?
3. PRESKRIPTION: Kan skulden vara preskriberad?
4. BETALNINGSFÖRMÅGA: Ekonomisk situation och betalningsplan
5. SKULDSANERING: Är personen berättigad enligt skuldsaneringslagen?
6. KRONOFOGDEN: Vad händer vid verkställighet?
7. KONTAKTER: Kronofogden, Konsumentvägledning, Skuldsaneringsrättshjälp

Ge konkret handlingsplan för att lösa skuldsituationen.
`
  };

  private static readonly LEGAL_CATEGORY_PROMPTS = {
    [LegalCategory.RENTAL_LAW]: `
Svara på denna hyresrättsliga fråga enligt svensk lag:

ANALYSERA:
- Vilka bestämmelser i 12 kap. Jordabalken som är relevanta
- Hyresgästens och hyresvärdens rättigheter och skyldigheter
- Möjliga åtgärder och rättsmedel
- Tidsfrister och processer
- Kostnader och risker

GE KONKRETA RÅD OM:
- Vad personen kan göra omedelbart
- Vilka dokument som behövs
- Hur man kontaktar Hyresgästföreningen
- När professionell juridisk hjälp behövs

VARNA FÖR:
- Juridiska risker
- Ekonomiska konsekvenser
- Tidsfrister som inte får missas
`;

    [LegalCategory.SOCIAL_BENEFITS]: `
Besvara denna fråga om svenska välfärdssystem och socialförsäkringar:

ANALYSERA ENLIGT:
- Socialförsäkringsbalken (SFB)
- Socialtjänstlagen (SOL)
- Förvaltningslagen (FL)
- Diskrimineringslagen

FÖRKLARA:
- Vilka rättigheter personen har
- Ansökningsprocesser och krav
- Möjligheter till överklagande
- Tillfälliga lösningar under handläggning

KONTAKTINFORMATION:
- Relevanta myndigheter
- Rådgivningsorganisationer
- Jurist- och medborgarjourer
`;

    [LegalCategory.CONSUMER_RIGHTS]: `
Analysera denna konsumenträttsliga fråga enligt svensk lag:

TILLÄMPLIGA LAGAR:
- Konsumentköplagen (KKL)
- Konsumenttjänstlagen (KTjL)
- Distans- och hemförsäljningslagen
- Marknadsföringslagen

KONSUMENTENS RÄTTIGHETER:
- Reklamationsrätt och garantier
- Ångerrätt vid distansköp
- Prisavdrag och hävning
- Skadestånd

PRAKTISKA STEG:
- Hur man reklamerar korrekt
- Dokumentation som behövs
- Kontakt med Konsumentverket
- Alternativ tvistlösning (ARN)
`
  };

  static getSystemPrompt(): string {
    return this.SYSTEM_PROMPT;
  }

  static getDocumentAnalysisPrompt(docType: DocumentType): string {
    return this.DOCUMENT_ANALYSIS_PROMPTS[docType] || `
Analysera detta dokument enligt svensk lag:

1. Identifiera dokumenttyp och relevanta lagar
2. Analysera viktiga klausuler och bestämmelser
3. Bedöm rättsliga risker och möjligheter
4. Föreslå konkreta handlingar
5. Ange relevanta kontakter och resurser
`;
  }

  static getLegalCategoryPrompt(category: LegalCategory): string {
    return this.LEGAL_CATEGORY_PROMPTS[category] || `
Besvara denna juridiska fråga enligt svensk lag:

- Analysera relevant lagstiftning
- Förklara rättigheter och skyldigheter
- Ge praktiska råd och handlingsalternativ
- Ange kontaktinformation för vidare hjälp
`;
  }

  static getFollowUpPrompt(): string {
    return `
Baserat på den information som givits, ställ 2-3 uppföljningsfrågor som kan hjälpa till att:
- Förtydliga den juridiska situationen
- Identifiera viktiga detaljer som saknas
- Förstå personens mål och prioriteringar
- Bedöma tidskänslighet och resurser

Formulera frågorna på svenska och gör dem specifika och handlingsorienterade.
`;
  }
}
