
import React from 'react';
import ResourceCard from './ResourceCard';

interface LegalResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  type: 'official' | 'user-added';
}

interface ResourceGridProps {
  resources: LegalResource[];
}

const ResourceGrid = ({ resources }: ResourceGridProps) => {
  const categories = [...new Set(resources.map(r => r.category))];

  return (
    <div className="space-y-16">
      {categories.map(category => (
        <div key={category}>
          <h4 className="text-2xl font-serif font-medium text-white border-b border-[#232329] pb-4 mb-8">
            {category}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources
              .filter(resource => resource.category === category)
              .map(resource => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResourceGrid;
