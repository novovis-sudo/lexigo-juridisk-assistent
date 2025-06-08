
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LexigoAIService, LexigoAnalysisRequest } from '@/services/lexigoAIService';
import { Message } from '../types/chatTypes';
import { getAnalysisTypeDescription, generateContextualSuggestions } from '../utils/chatUtils';

export const useLexigoChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'lexigo',
      content: 'Hej! Jag är Lexigo, din juridiska AI-assistent. Ladda upp eller klistra in ditt juridiska dokument så hjälper jag dig att analysera det enligt svensk lag.',
      timestamp: new Date(),
      suggestions: [
        'Analysera mitt dokument',
        'Hitta svagheter i argumentationen',
        'Skapa motargument',
        'Förbättra formuleringarna'
      ]
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showDocumentInput, setShowDocumentInput] = useState(false);
  const { toast } = useToast();

  const handleAnalysisRequest = async (analysisType: 'summary' | 'weaknesses' | 'counterarguments' | 'improvements' | 'full') => {
    if (!documentText.trim()) {
      toast({
        title: "Inget dokument",
        description: "Du måste först ladda upp eller klistra in ett dokument att analysera.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    const request: LexigoAnalysisRequest = {
      content: documentText,
      analysisType,
      context: inputValue
    };

    try {
      const analysis = await LexigoAIService.analyzeDocument(request);
      
      const analysisMessage: Message = {
        id: Date.now().toString(),
        type: 'analysis',
        content: getAnalysisTypeDescription(analysisType),
        timestamp: new Date(),
        analysis,
        suggestions: analysis.followUpQuestions
      };

      setMessages(prev => [...prev, analysisMessage]);

      toast({
        title: "Analys klar",
        description: `Lexigo har slutfört ${getAnalysisTypeDescription(analysisType).toLowerCase()}.`
      });

    } catch (error) {
      console.error('Analysfel:', error);
      toast({
        title: "Analysfel",
        description: "Kunde inte slutföra analysen. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isAnalyzing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    try {
      const response = await LexigoAIService.generateFollowUpResponse(currentInput, documentText);
      
      const lexigoResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'lexigo',
        content: response,
        timestamp: new Date(),
        suggestions: generateContextualSuggestions(currentInput)
      };

      setMessages(prev => [...prev, lexigoResponse]);
    } catch (error) {
      console.error('Fel vid svar:', error);
      toast({
        title: "Kommunikationsfel",
        description: "Kunde inte få svar från Lexigo. Försök igen.",
        variant: "destructive"
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.includes('Analysera') || suggestion.includes('dokument')) {
      setShowDocumentInput(true);
    } else if (suggestion.includes('svagheter')) {
      handleAnalysisRequest('weaknesses');
    } else if (suggestion.includes('motargument')) {
      handleAnalysisRequest('counterarguments');
    } else if (suggestion.includes('förbättra') || suggestion.includes('Förbättra')) {
      handleAnalysisRequest('improvements');
    } else {
      setInputValue(suggestion);
    }
  };

  return {
    messages,
    inputValue,
    setInputValue,
    documentText,
    setDocumentText,
    isAnalyzing,
    showDocumentInput,
    setShowDocumentInput,
    handleAnalysisRequest,
    handleSendMessage,
    handleSuggestionClick
  };
};
