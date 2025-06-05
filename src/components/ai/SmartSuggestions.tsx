
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, FileText, Scale, Camera, BookOpen } from 'lucide-react';

interface Suggestion {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  action: string;
  category: 'analysis' | 'comparison' | 'ocr' | 'library';
}

interface SmartSuggestionsProps {
  onSuggestionClick: (action: string, category: string) => void;
  context?: string;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ onSuggestionClick, context }) => {
  const suggestions: Suggestion[] = [
    {
      id: '1',
      title: 'Analysera juridiskt dokument',
      description: 'Ladda upp ett dokument för djupgående AI-analys',
      icon: <FileText className="h-5 w-5" />,
      action: 'analyze-document',
      category: 'analysis'
    },
    {
      id: '2',
      title: 'Jämför dokument',
      description: 'Identifiera skillnader och konflikter mellan dokument',
      icon: <Scale className="h-5 w-5" />,
      action: 'compare-documents',
      category: 'comparison'
    },
    {
      id: '3',
      title: 'Extrahera text från bild',
      description: 'Konvertera juridiska dokument från bilder till text',
      icon: <Camera className="h-5 w-5" />,
      action: 'extract-text',
      category: 'ocr'
    },
    {
      id: '4',
      title: 'Utforska juridisk bibliotek',
      description: 'Sök i databas med prejudikat och juridiska resurser',
      icon: <BookOpen className="h-5 w-5" />,
      action: 'browse-library',
      category: 'library'
    }
  ];

  const getContextualSuggestions = (): Suggestion[] => {
    if (!context) return suggestions;
    
    // Return suggestions based on context
    if (context.includes('uppsägning')) {
      return suggestions.filter(s => s.category === 'analysis' || s.category === 'library');
    }
    
    return suggestions;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <Lightbulb className="h-6 w-6 text-accent-400" />
        <h3 className="text-2xl font-serif font-semibold text-white">Smarta förslag</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getContextualSuggestions().map((suggestion) => (
          <Card 
            key={suggestion.id}
            className="premium-card p-8 hover:premium-shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-accent-500/30 group"
            onClick={() => onSuggestionClick(suggestion.action, suggestion.category)}
          >
            <div className="flex items-start gap-4">
              <div className="bg-accent-600/20 p-4 rounded-xl flex-shrink-0 group-hover:bg-accent-600/30 transition-colors">
                <div className="text-accent-400">
                  {suggestion.icon}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-serif font-medium text-white mb-2 text-lg group-hover:text-accent-400 transition-colors">
                  {suggestion.title}
                </h4>
                <p className="text-sm text-dark-300 mb-6 font-sans leading-relaxed">
                  {suggestion.description}
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-accent-500/30 text-accent-300 hover:bg-accent-600/10 hover:border-accent-400 transition-all duration-200"
                >
                  Kom igång
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestions;
