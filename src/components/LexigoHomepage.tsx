
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Calendar, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LegalConcept {
  id: string;
  term: string;
  short_definition: string;
  related_tags: string[];
}

interface LegalPrecedent {
  id: string;
  title: string;
  case_date: string;
  summary: string;
  link: string;
}

interface DocumentClassification {
  id: string;
  label: string;
}

const LexigoHomepage = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [legalConcepts, setLegalConcepts] = useState<LegalConcept[]>([]);
  const [legalPrecedents, setLegalPrecedents] = useState<LegalPrecedent[]>([]);
  const [categories, setCategories] = useState<DocumentClassification[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLegalConcepts();
    fetchLegalPrecedents();
    fetchCategories();
  }, []);

  const fetchLegalConcepts = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_concepts')
        .select('id, term, short_definition, related_tags')
        .limit(6);
      
      if (error) throw error;
      setLegalConcepts(data || []);
    } catch (error) {
      console.error('Error fetching legal concepts:', error);
    }
  };

  const fetchLegalPrecedents = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_precedents')
        .select('id, title, case_date, summary, link')
        .limit(4);
      
      if (error) throw error;
      setLegalPrecedents(data || []);
    } catch (error) {
      console.error('Error fetching legal precedents:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('document_classifications')
        .select('id, label')
        .order('label');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

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
    <div className="min-h-screen bg-[#fdfcf9]">
      <div className="luxury-container">
        {/* Main Query Section */}
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

        {/* Legal Concepts Grid */}
        <div className="section-divider">
          <h2 className="text-4xl font-bold text-black mb-8 text-center">Juridiska begrepp</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {legalConcepts.map((concept) => (
              <Card key={concept.id} className="luxury-card hover:scale-105 transition-transform duration-300 p-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-black">{concept.term}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-gray-700 leading-relaxed">
                    {concept.short_definition}
                  </CardDescription>
                  {concept.related_tags && concept.related_tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {concept.related_tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} className="bg-[#ffe663] text-black text-xs px-3 py-1 rounded-full">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legal Precedents */}
        <div>
          <h2 className="text-4xl font-bold text-black mb-8 text-center">Rättsfall och prejudikat</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {legalPrecedents.map((precedent) => (
              <Card key={precedent.id} className="luxury-card hover:scale-105 transition-transform duration-300 p-6">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl pr-4 text-black">{precedent.title}</CardTitle>
                    {precedent.link && (
                      <Button variant="ghost" size="sm" asChild className="hover:bg-gray-100 rounded-xl">
                        <a href={precedent.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                  {precedent.case_date && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      {new Date(precedent.case_date).toLocaleDateString('sv-SE')}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-700 leading-relaxed">{precedent.summary}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LexigoHomepage;
