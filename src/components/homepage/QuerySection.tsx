
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DocumentClassification {
  id: string;
  label: string;
}

interface QuerySectionProps {
  categories: DocumentClassification[];
}

const QuerySection: React.FC<QuerySectionProps> = ({ categories }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      // Fetch relevant legal prompt based on category
      let promptData = null;
      if (selectedCategory) {
        const { data } = await supabase
          .from('legal_prompts')
          .select('prompt, category')
          .eq('document_classification_id', selectedCategory)
          .maybeSingle();
        promptData = data;
      }

      // Simulate AI response (in a real app, this would call an AI service)
      const response = promptData 
        ? `Baserat på ${promptData.category}: ${promptData.prompt}\n\nDin fråga: "${query}"\n\nDetta är en simulerad AI-respons som skulle ge rättslig vägledning baserat på svensk lag.`
        : `Din fråga: "${query}"\n\nDetta är en simulerad AI-respons som skulle ge allmän rättslig vägledning baserat på svensk lag.`;
      
      setAiResponse(response);
    } catch (error) {
      console.error('Error generating AI response:', error);
      setAiResponse('Ett fel uppstod när AI-svaret skulle genereras. Försök igen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="luxury-card mb-12 p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="luxury-select">
                <SelectValue placeholder="Välj kategori..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-2 border-gray-200 rounded-xl shadow-lg">
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id} className="hover:bg-gray-50 rounded-lg">
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="md:col-span-2">
            <div className="flex gap-3">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Skriv din juridiska fråga här..."
                className="luxury-input flex-1"
              />
              <Button type="submit" disabled={isLoading} className="luxury-button-primary">
                <MessageSquare className="h-5 w-5 mr-2" />
                {isLoading ? 'Genererar...' : 'Fråga AI'}
              </Button>
            </div>
          </div>
        </div>
      </form>

      {aiResponse && (
        <div className="mt-8 p-6 bg-[#a1eacf]/10 rounded-2xl border-2 border-[#a1eacf]/20">
          <h3 className="font-semibold text-black mb-4 text-xl">AI-svar:</h3>
          <p className="text-black/80 whitespace-pre-line leading-relaxed">{aiResponse}</p>
        </div>
      )}
    </div>
  );
};

export default QuerySection;
