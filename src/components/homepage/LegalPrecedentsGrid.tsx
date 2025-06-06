
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ExternalLink } from 'lucide-react';

interface LegalPrecedent {
  id: string;
  title: string;
  case_date: string;
  summary: string;
  link: string;
}

interface LegalPrecedentsGridProps {
  precedents: LegalPrecedent[];
}

const LegalPrecedentsGrid: React.FC<LegalPrecedentsGridProps> = ({ precedents }) => {
  return (
    <div>
      <h2 className="text-4xl font-bold text-black mb-8 text-center">Rättsfall och prejudikat</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {precedents.map((precedent) => (
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
  );
};

export default LegalPrecedentsGrid;
