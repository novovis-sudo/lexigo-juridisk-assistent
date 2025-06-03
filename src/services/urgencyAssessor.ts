
import { LegalDocument, UrgencyLevel } from '../types/legal';

export class UrgencyAssessor {
  private static readonly URGENCY_KEYWORDS = {
    critical: ['omedelbart', 'inom 3 dagar', 'avhysning', 'verkställighet'],
    high: ['inom en vecka', 'uppsägning', 'betalningsanmärkning'],
    medium: ['inom en månad', 'överklagande']
  };

  static assessUrgency(document: LegalDocument) {
    const content = document.content.toLowerCase();
    let level = UrgencyLevel.LOW;
    let reasoning = 'Ingen omedelbar tidsgräns identifierad';
    
    for (const [urgencyLevel, keywords] of Object.entries(this.URGENCY_KEYWORDS)) {
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
}
