
import { LegalDocument, LegalIssue, DocumentType } from '../types/legal';

export class LegalIssueAnalyzer {
  static identifyLegalIssues(document: LegalDocument, legalPoints: string[]): LegalIssue[] {
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
}
