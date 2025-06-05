
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
    <Card className="premium-card hover:premium-shadow-lg transition-all duration-300 p-8 group">
      <div className="flex items-start justify-between mb-4">
        <h5 className="font-serif font-medium text-xl text-white group-hover:text-accent-400 transition-colors">
          {resource.title}
        </h5>
        {resource.type === 'official' && (
          <span className="bg-accent-600/20 text-accent-300 text-xs px-3 py-1 rounded-full border border-accent-500/30">
            Officiell
          </span>
        )}
      </div>
      <p className="text-dark-300 mb-6 font-sans leading-relaxed">
        {resource.description}
      </p>
      <Button
        variant="outline"
        onClick={() => window.open(resource.url, '_blank')}
        className="w-full border-accent-500/30 text-accent-300 hover:bg-accent-600/10 hover:border-accent-400 transition-all duration-200"
      >
        <ExternalLink className="mr-2 h-4 w-4" />
        Besök webbplats
      </Button>
    </Card>
  );
};

export default ResourceCard;
