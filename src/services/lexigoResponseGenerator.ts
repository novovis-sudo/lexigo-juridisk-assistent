
export class LexigoResponseGenerator {
  static async generateFollowUpResponse(question: string, context: string): Promise<string> {
    console.log('Genererar uppföljningssvar för:', question);
    
    if (question.includes('svarsbrev') || question.includes('formulera')) {
      return 'Jag kan hjälpa dig att formulera ett professionellt svarsbrev. Vilken typ av svar behöver du - formell invändning, begäran om förtydligande, eller förhandlingsförslag?';
    }
    
    if (question.includes('rättsfall') || question.includes('prejudikat')) {
      return 'Jag söker relevanta svenska rättsfall i domstolsdatabasen. Vilken specifik juridisk fråga vill du att jag fokuserar på?';
    }
    
    if (question.includes('dokument')) {
      return 'Baserat på analysen behöver du troligen samla: vittnesuppgifter, korrespondens med motparten, och eventuella avtal eller beslut. Vill du att jag specificerar mer?';
    }

    return 'Jag kan hjälpa dig vidare med denna fråga. Kan du specificera exakt vad du behöver hjälp med?';
  }
}
