
import { LegalDocument, DocumentType, LegalReference } from '../types/legal';

export class DocumentSummaryGenerator {
  static generateSummary(document: LegalDocument): string {
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

  static generateLegalReferences(docType: DocumentType, concepts: string[]): LegalReference[] {
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
}
