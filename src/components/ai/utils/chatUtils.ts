
export const getAnalysisTypeDescription = (type: string): string => {
  const descriptions = {
    summary: 'Sammanfattning av dokument',
    weaknesses: 'Analys av svagheter',
    counterarguments: 'Motargument',
    improvements: 'Förbättringsförslag',
    full: 'Fullständig juridisk analys'
  };
  return descriptions[type as keyof typeof descriptions] || 'Analys';
};

export const generateContextualSuggestions = (input: string): string[] => {
  if (input.includes('brev')) {
    return ['Formell invändning', 'Förhandlingsförslag', 'Begäran om förtydligande'];
  }
  if (input.includes('rättsfall')) {
    return ['Hyresrättsliga prejudikat', 'Konsumenträttspraxis', 'Förvaltningsrättsliga avgöranden'];
  }
  return ['Nästa steg', 'Juridisk rådgivning', 'Tidsfrist att kontrollera'];
};

export const getUrgencyColor = (urgency: string) => {
  switch (urgency) {
    case 'critical': return 'bg-red-100 text-red-800 border-red-200';
    case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default: return 'bg-green-100 text-green-800 border-green-200';
  }
};
