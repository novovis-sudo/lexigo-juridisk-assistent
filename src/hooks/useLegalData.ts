
import { useState, useEffect } from 'react';
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

export const useLegalData = () => {
  const [legalConcepts, setLegalConcepts] = useState<LegalConcept[]>([]);
  const [legalPrecedents, setLegalPrecedents] = useState<LegalPrecedent[]>([]);
  const [categories, setCategories] = useState<DocumentClassification[]>([]);

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

  useEffect(() => {
    fetchLegalConcepts();
    fetchLegalPrecedents();
    fetchCategories();
  }, []);

  return {
    legalConcepts,
    legalPrecedents,
    categories
  };
};
