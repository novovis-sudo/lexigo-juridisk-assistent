
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
  reference_link: string;
}

interface DocumentClassification {
  id: string;
  category: string;
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
        .select('id, title, case_date, summary, reference_link')
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
        .select('id, category')
        .order('category');
      
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
          .select('prompt, title')
          .eq('classification_id', selectedCategory)
          .single();
        promptData = data;
      }

      // Simulate AI response (in a real app, this would call an AI service)
      const response = promptData 
        ? `Baserat på ${promptData.title}: ${promptData.prompt}\n\nDin fråga: "${query}"\n\nDetta är en simulerad AI-respons som skulle ge rättslig vägledning baserat på svensk lag.`
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Main Query Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Välj kategori..." />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <div className="flex gap-2">
                    <Input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Skriv din juridiska fråga här..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading}>
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {isLoading ? 'Genererar...' : 'Fråga AI'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {aiResponse && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">AI-svar:</h3>
                <p className="text-blue-800 whitespace-pre-line">{aiResponse}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Legal Concepts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Juridiska begrepp</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {legalConcepts.map((concept) => (
              <Card key={concept.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{concept.term}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">
                    {concept.short_definition}
                  </CardDescription>
                  {concept.related_tags && concept.related_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {concept.related_tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rättsfall och prejudikat</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {legalPrecedents.map((precedent) => (
              <Card key={precedent.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg pr-4">{precedent.title}</CardTitle>
                    {precedent.reference_link && (
                      <Button variant="ghost" size="sm" asChild>
                        <a href={precedent.reference_link} target="_blank" rel="noopener noreferrer">
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
                  <CardDescription>{precedent.summary}</CardDescription>
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
