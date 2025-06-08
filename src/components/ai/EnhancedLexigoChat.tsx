
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Send, FileText, AlertTriangle, Scale, Lightbulb, Bot, User, Clock, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { LexigoAIService, LexigoAnalysisRequest, LexigoAnalysisResponse } from '@/services/lexigoAIService';

interface Message {
  id: string;
  type: 'user' | 'lexigo' | 'analysis';
  content: string;
  timestamp: Date;
  analysis?: LexigoAnalysisResponse;
  suggestions?: string[];
}

interface EnhancedLexigoChatProps {
  onNavigate?: (view: string) => void;
}

const EnhancedLexigoChat: React.FC<EnhancedLexigoChatProps> = ({ onNavigate }) => {
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
        content: this.getAnalysisTypeDescription(analysisType),
        timestamp: new Date(),
        analysis,
        suggestions: analysis.followUpQuestions
      };

      setMessages(prev => [...prev, analysisMessage]);

      toast({
        title: "Analys klar",
        description: `Lexigo har slutfört ${this.getAnalysisTypeDescription(analysisType).toLowerCase()}.`
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

  const getAnalysisTypeDescription = (type: string): string => {
    const descriptions = {
      summary: 'Sammanfattning av dokument',
      weaknesses: 'Analys av svagheter',
      counterarguments: 'Motargument',
      improvements: 'Förbättringsförslag',
      full: 'Fullständig juridisk analys'
    };
    return descriptions[type as keyof typeof descriptions] || 'Analys';
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
        suggestions: this.generateContextualSuggestions(currentInput)
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

  const generateContextualSuggestions = (input: string): string[] => {
    if (input.includes('brev')) {
      return ['Formell invändning', 'Förhandlingsförslag', 'Begäran om förtydligande'];
    }
    if (input.includes('rättsfall')) {
      return ['Hyresrättsliga prejudikat', 'Konsumenträttspraxis', 'Förvaltningsrättsliga avgöranden'];
    }
    return ['Nästa steg', 'Juridisk rådgivning', 'Tidsfrist att kontrollera'];
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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[800px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-full">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Lexigo - Juridisk AI-assistent</h3>
            <p className="text-sm text-gray-600">Specialiserad på svensk lagstiftning</p>
          </div>
        </div>
      </div>

      {/* Document Input Section */}
      {showDocumentInput && (
        <div className="p-4 border-b bg-gray-50">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-sm">Lägg till juridiskt dokument</span>
            </div>
            <Textarea
              value={documentText}
              onChange={(e) => setDocumentText(e.target.value)}
              placeholder="Klistra in eller skriv ditt juridiska dokument här..."
              className="min-h-[100px] resize-none"
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={() => handleAnalysisRequest('full')}
                disabled={!documentText.trim() || isAnalyzing}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Fullständig analys
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => setShowDocumentInput(false)}
              >
                Stäng
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-3">
              {/* Message Header */}
              <div className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                {(message.type === 'lexigo' || message.type === 'analysis') && (
                  <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-blue-600" />
                  </div>
                )}
                
                <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : ''}`}>
                  <div className={`p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : message.type === 'analysis'
                      ? 'bg-purple-50 text-gray-900 border border-purple-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {/* Analysis Results */}
                  {message.analysis && (
                    <div className="mt-3 space-y-3">
                      {/* Urgency Badge */}
                      <div className="flex items-center gap-2">
                        <Badge className={`${this.getUrgencyColor(message.analysis.urgency)} flex items-center gap-1`}>
                          <Clock className="h-3 w-3" />
                          {message.analysis.urgency === 'critical' ? 'Kritisk' :
                           message.analysis.urgency === 'high' ? 'Hög' :
                           message.analysis.urgency === 'medium' ? 'Medel' : 'Låg'} prioritet
                        </Badge>
                      </div>

                      {/* Summary Card */}
                      <Card className="bg-white border-blue-200">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Sammanfattning
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className="text-sm text-gray-700">{message.analysis.summary}</p>
                        </CardContent>
                      </Card>

                      {/* Key Points */}
                      {message.analysis.keyPoints.length > 0 && (
                        <Card className="bg-white border-green-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Lightbulb className="h-4 w-4" />
                              Viktiga punkter
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <ul className="list-disc list-inside space-y-1">
                              {message.analysis.keyPoints.map((point, idx) => (
                                <li key={idx} className="text-sm text-gray-700">{point}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {/* Weaknesses */}
                      {message.analysis.weaknesses.length > 0 && (
                        <Card className="bg-white border-red-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <AlertTriangle className="h-4 w-4" />
                              Identifierade svagheter
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <ul className="list-disc list-inside space-y-1">
                              {message.analysis.weaknesses.map((weakness, idx) => (
                                <li key={idx} className="text-sm text-gray-700">{weakness}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}

                      {/* Legal References */}
                      {message.analysis.legalReferences.length > 0 && (
                        <Card className="bg-white border-purple-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Scale className="h-4 w-4" />
                              Juridiska referenser
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="space-y-2">
                              {message.analysis.legalReferences.map((ref, idx) => (
                                <div key={idx} className="text-sm border-l-2 border-purple-300 pl-2">
                                  <div className="font-medium">{ref.law} {ref.section}</div>
                                  <div className="text-gray-600">{ref.description}</div>
                                  {ref.url && (
                                    <a href={ref.url} target="_blank" rel="noopener noreferrer" 
                                       className="text-blue-600 hover:underline flex items-center gap-1">
                                      <ExternalLink className="h-3 w-3" />
                                      {ref.source}
                                    </a>
                                  )}
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Deadlines */}
                      {message.analysis.deadlines.length > 0 && (
                        <Card className="bg-white border-orange-200">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Viktiga tidsfrister
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <ul className="list-disc list-inside space-y-1">
                              {message.analysis.deadlines.map((deadline, idx) => (
                                <li key={idx} className="text-sm text-orange-700 font-medium">{deadline}</li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  )}

                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="text-xs h-7 px-2 bg-white hover:bg-blue-50 border-blue-200"
                          disabled={isAnalyzing}
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>

                {message.type === 'user' && (
                  <div className="bg-blue-600 p-2 rounded-full flex-shrink-0 mt-1 order-1">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAnalyzing && (
            <div className="flex gap-3 justify-start">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-blue-600 animate-pulse" />
              </div>
              <div className="bg-gray-100 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-gray-600">Lexigo analyserar ditt dokument...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Ställ en uppföljningsfråga till Lexigo..."
            disabled={isAnalyzing}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedLexigoChat;
