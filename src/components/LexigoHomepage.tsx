
import React from 'react';
import { useLegalData } from '@/hooks/useLegalData';
import QuerySection from './homepage/QuerySection';
import LegalConceptsGrid from './homepage/LegalConceptsGrid';
import LegalPrecedentsGrid from './homepage/LegalPrecedentsGrid';

const LexigoHomepage = () => {
  const { legalConcepts, legalPrecedents, categories } = useLegalData();

  return (
    <div className="min-h-screen bg-[#fdfcf9]">
      <div className="luxury-container">
        {/* Main Query Section */}
        <QuerySection categories={categories} />

        {/* Legal Concepts Grid */}
        <LegalConceptsGrid concepts={legalConcepts} />

        {/* Legal Precedents */}
        <LegalPrecedentsGrid precedents={legalPrecedents} />
      </div>
    </div>
  );
};

export default LexigoHomepage;
