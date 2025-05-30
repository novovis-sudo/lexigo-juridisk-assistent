
import { DocumentType, DocumentMetadata, UrgencyLevel } from '../types/legal';

export class DocumentClassifier {
  private static readonly CLASSIFICATION_PATTERNS = {
    [DocumentType.EVICTION_NOTICE]: [
      'uppsägning', 'avhysning', 'hyreskontrakt', 'andrahandsuthyrning',
      'störning', 'hyresskuld', 'avflyttning', 'kronofogden'
    ],
    [DocumentType.RENTAL_CONTRACT]: [
      'hyresavtal', 'hyreskontrakt', 'uthyrning', 'hyresgäst',
      'hyresvärd', 'depositum', 'månadshyra'
    ],
    [DocumentType.COURT_DECISION]: [
      'dom', 'beslut', 'tingsrätt', 'hovrätt', 'högsta domstolen',
      'förvaltningsrätt', 'kammarrätt', 'mål nr', 'diarienummer'
    ],
    [DocumentType.BENEFIT_DECISION]: [
      'försäkringskassan', 'arbetsförmedlingen', 'socialtjänst',
      'bostadsbidrag', 'barnbidrag', 'sjukpenning', 'arbetslöshetsersättning',
      'försörjningsstöd', 'aktivitetsersättning'
    ],
    [DocumentType.EMPLOYMENT_CONTRACT]: [
      'anställningsavtal', 'arbetsavtal', 'kollektivavtal',
      'arbetsgivare', 'arbetstagare', 'uppsägningstid', 'lön'
    ],
    [DocumentType.CONSUMER_CONTRACT]: [
      'köpeavtal', 'tjänsteavtal', 'garanti', 'reklamation',
      'ångerrätt', 'konsumentköplag', 'distansavtal'
    ],
    [DocumentType.DEBT_NOTICE]: [
      'inkasso', 'betalningsanmärkning', 'skuldsanering',
      'ansökan om betalningsföreläggande', 'kronofogden'
    ]
  };

  static classifyDocument(content: string): DocumentType {
    const normalizedContent = content.toLowerCase();
    let maxScore = 0;
    let bestMatch = DocumentType.OTHER;

    for (const [docType, patterns] of Object.entries(this.CLASSIFICATION_PATTERNS)) {
      const score = patterns.reduce((acc, pattern) => {
        const matches = (normalizedContent.match(new RegExp(pattern, 'g')) || []).length;
        return acc + matches;
      }, 0);

      if (score > maxScore) {
        maxScore = score;
        bestMatch = docType as DocumentType;
      }
    }

    return maxScore > 0 ? bestMatch : DocumentType.OTHER;
  }

  static extractMetadata(content: string, docType: DocumentType): DocumentMetadata {
    const dateRegex = /\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4}|\d{1,2}\s+\w+\s+\d{4}/g;
    const amountRegex = /\d+[\s,]*\d*\s*kr|\d+[\s,]*\d*\s*kronor/gi;
    const personRegex = /[A-ZÅÄÖ][a-zåäö]+\s+[A-ZÅÄÖ][a-zåäö]+/g;

    const dates = content.match(dateRegex) || [];
    const amounts = this.extractAmounts(content);
    const parties = content.match(personRegex) || [];
    const keywords = this.extractKeywords(content, docType);
    
    return {
      language: this.detectLanguage(content),
      confidence: this.calculateConfidence(content, docType),
      parties: [...new Set(parties)].slice(0, 10),
      dates: [...new Set(dates)].slice(0, 5),
      amounts,
      keywords,
      urgency_level: this.assessUrgency(content, docType)
    };
  }

  private static extractAmounts(content: string): number[] {
    const amountMatches = content.match(/\d+[\s,]*\d*\s*kr|\d+[\s,]*\d*\s*kronor/gi) || [];
    return amountMatches
      .map(match => {
        const numbers = match.replace(/[^\d,]/g, '').replace(',', '.');
        return parseFloat(numbers);
      })
      .filter(amount => !isNaN(amount) && amount > 0)
      .slice(0, 10);
  }

  private static extractKeywords(content: string, docType: DocumentType): string[] {
    const patterns = this.CLASSIFICATION_PATTERNS[docType] || [];
    const found = patterns.filter(pattern => 
      content.toLowerCase().includes(pattern)
    );
    return [...new Set(found)];
  }

  private static detectLanguage(content: string): 'sv' | 'en' {
    const swedishWords = ['och', 'att', 'det', 'av', 'är', 'för', 'till', 'med', 'på', 'som'];
    const swedishCount = swedishWords.reduce((count, word) => 
      count + (content.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0
    );
    return swedishCount > 5 ? 'sv' : 'en';
  }

  private static calculateConfidence(content: string, docType: DocumentType): number {
    const patterns = this.CLASSIFICATION_PATTERNS[docType] || [];
    const matches = patterns.reduce((acc, pattern) => 
      acc + (content.toLowerCase().includes(pattern) ? 1 : 0), 0
    );
    return Math.min(matches / Math.max(patterns.length * 0.3, 1), 1);
  }

  private static assessUrgency(content: string, docType: DocumentType): UrgencyLevel {
    const criticalTerms = ['omedelbart', 'snarast', 'inom 3 dagar', 'avhysning', 'kronofogden', 'verkställighet'];
    const highTerms = ['inom en vecka', 'inom 7 dagar', 'uppsägning', 'varning'];
    const mediumTerms = ['inom en månad', 'inom 30 dagar', 'överklagan'];

    const normalizedContent = content.toLowerCase();

    if (criticalTerms.some(term => normalizedContent.includes(term))) {
      return UrgencyLevel.CRITICAL;
    }
    if (highTerms.some(term => normalizedContent.includes(term))) {
      return UrgencyLevel.HIGH;
    }
    if (mediumTerms.some(term => normalizedContent.includes(term))) {
      return UrgencyLevel.MEDIUM;
    }

    // Document type based urgency
    if ([DocumentType.EVICTION_NOTICE, DocumentType.DEBT_NOTICE].includes(docType)) {
      return UrgencyLevel.HIGH;
    }

    return UrgencyLevel.LOW;
  }
}
