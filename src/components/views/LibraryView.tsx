
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f11] via-[#151517] to-[#1a1a1d] relative">
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 space-y-12">
        <LibraryHeader />
        
        <AddResourceForm onAddResource={handleAddResource} />

        <ResourceGrid resources={allResources} />

        <ContactsSection />
      </div>
    </div>
  );
};

export default LibraryView;
