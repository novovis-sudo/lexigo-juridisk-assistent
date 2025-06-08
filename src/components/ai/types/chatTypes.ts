
import { LexigoAnalysisResponse } from '@/services/lexigoAIService';

export interface Message {
  id: string;
  type: 'user' | 'lexigo' | 'analysis';
  content: string;
  timestamp: Date;
  analysis?: LexigoAnalysisResponse;
  suggestions?: string[];
}

export interface EnhancedLexigoChatProps {
  onNavigate?: (view: string) => void;
}
