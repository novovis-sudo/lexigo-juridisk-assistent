
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface LegalResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  type: 'official' | 'user-added';
}

interface ResourceCardProps {
  resource: LegalResource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  return (
    <Card className="premium-card hover:shadow-premium-lg transition-shadow duration-300 p-6">
      <div className="flex items-start justify-between mb-3">
        <h5 className="font-serif font-medium text-lg text-ebony-950">
          {resource.title}
        </h5>
        {resource.type === 'official' && (
          <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-200">
            Officiell
          </span>
        )}
      </div>
      <p className="text-sm text-charcoal-600 mb-4 font-legal line-clamp-3">
        {resource.description}
      </p>
      <Button
        variant="outline"
        onClick={() => window.open(resource.url, '_blank')}
        className="w-full border-gold-200 text-gold-800 hover:bg-gold-50"
      >
        <ExternalLink className="mr-2 h-3 w-3" />
        Besök webbplats
      </Button>
    </Card>
  );
};

export default ResourceCard;
