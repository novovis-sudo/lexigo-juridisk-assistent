
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LegalConcept {
  id: string;
  term: string;
  short_definition: string;
  related_tags: string[];
}

interface LegalConceptsGridProps {
  concepts: LegalConcept[];
}

const LegalConceptsGrid: React.FC<LegalConceptsGridProps> = ({ concepts }) => {
  return (
    <div className="section-divider">
      <h2 className="text-4xl font-bold text-black mb-8 text-center">Juridiska begrepp</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {concepts.map((concept) => (
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
  );
};

export default LegalConceptsGrid;
