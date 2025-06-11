
import React, { useState } from 'react';
import LibraryHeader from '../library/LibraryHeader';
import AddResourceForm from '../library/AddResourceForm';
import ResourceGrid from '../library/ResourceGrid';
import ContactsSection from '../library/ContactsSection';

interface LegalResource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  type: 'official' | 'user-added';
}

const officialResources: LegalResource[] = [
  {
    id: '1',
    title: 'Domstolsverket',
    description: 'Sveriges officiella domstolswebbplats med information om rättegångar, domar och juridiska processer.',
    url: 'https://www.domstol.se',
    category: 'Domstolar',
    type: 'official'
  },
  {
    id: '2',
    title: 'Hyresgästföreningen',
    description: 'Hjälp och rådgivning för hyresgäster, information om hyresrätt och hyrestvister.',
    url: 'https://www.hyresgastforeningen.se',
    category: 'Hyresrätt',
    type: 'official'
  },
  {
    id: '3',
    title: 'Konsumentverket',
    description: 'Myndighet för konsumentfrågor, reklamationer och konsumenträttigheter.',
    url: 'https://www.konsumentverket.se',
    category: 'Konsumenträtt',
    type: 'official'
  },
  {
    id: '4',
    title: 'Försäkringskassan',
    description: 'Information om socialförsäkringar, sjukpenning, föräldrapenning och andra bidrag.',
    url: 'https://www.forsakringskassan.se',
    category: 'Socialförsäkring',
    type: 'official'
  },
  {
    id: '5',
    title: 'Kronofogdemyndigheten',
    description: 'Myndighet för indrivning av skulder och verkställighet av domar.',
    url: 'https://www.kronofogden.se',
    category: 'Skuld & Indrivning',
    type: 'official'
  }
];

const LibraryView = () => {
  const [userResources, setUserResources] = useState<LegalResource[]>([]);

  const handleAddResource = (newResourceData: Omit<LegalResource, 'id' | 'type'>) => {
    const resource: LegalResource = {
      id: Date.now().toString(),
      ...newResourceData,
      type: 'user-added'
    };

    setUserResources([...userResources, resource]);
  };

  const allResources = [...officialResources, ...userResources];

  return (
    <div className="min-h-screen bg-background">
      <div className="professional-container section-spacing content-spacing">
        <LibraryHeader />
        
        <div className="animate-professional-slide-in">
          <AddResourceForm onAddResource={handleAddResource} />
        </div>

        <div className="animate-professional-fade-in" style={{ animationDelay: '0.1s' }}>
          <ResourceGrid resources={allResources} />
        </div>

        <div className="animate-professional-fade-in" style={{ animationDelay: '0.2s' }}>
          <ContactsSection />
        </div>
      </div>
    </div>
  );
};

export default LibraryView;
