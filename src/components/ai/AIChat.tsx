
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatProps {
  onSuggestionClick?: (suggestion: string) => void;
  initialPrompt?: string;
  context?: string;
}

const AIChat: React.FC<AIChatProps> = ({ 
  onSuggestionClick, 
  initialPrompt = "Hej! Jag är din juridiska AI-assistent. Hur kan jag hjälpa dig idag?",
  context 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: initialPrompt,
      timestamp: new Date(),
      suggestions: [
        "Analysera mitt dokument",
        "Förklara mina rättigheter",
        "Hjälp mig skriva ett svar",
        "Sök liknande fall"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Simulate AI response for now - in production this would call your AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(inputValue, context),
        timestamp: new Date(),
        suggestions: generateSuggestions(inputValue)
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Fel vid AI-svar",
        description: "Kunde inte få svar från AI-assistenten. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = (userInput: string, context?: string): string => {
    // This would be replaced with actual AI integration
    if (userInput.toLowerCase().includes('dokument')) {
      return "Jag kan hjälpa dig analysera ditt dokument. Ladda upp filen så analyserar jag den juridiska innebörden, identifierar viktiga punkter och föreslår nästa steg.";
    }
    if (userInput.toLowerCase().includes('rättigheter')) {
      return "Jag kan förklara dina rättigheter baserat på svensk lag. Berätta mer om din situation så ger jag dig specifik information om vilka rättigheter du har.";
    }
    return "Jag förstår din fråga. Kan du ge mig mer detaljer så kan jag ge dig mer specifik juridisk vägledning?";
  };

  const generateSuggestions = (userInput: string): string[] => {
    const baseSuggestions = [
      "Vilka är mina alternativ?",
      "Vad är nästa steg?",
      "Finns det liknande fall?",
      "Hur stark är min position?"
    ];
    return baseSuggestions;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="flex flex-col h-full max-h-[600px]">
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-full">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Lexigo AI</h3>
            <p className="text-sm text-gray-600">Din personliga juridiska assistent</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mt-1">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
              )}
              
              <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : ''}`}>
                <div
                  className={`p-3 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white ml-auto'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                </div>
                
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs h-7 px-2 bg-white hover:bg-blue-50 border-blue-200"
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
          ))}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="bg-blue-100 p-2 rounded-full flex-shrink-0 mt-1">
                <Bot className="h-4 w-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 p-3 rounded-2xl">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm text-gray-600">AI tänker...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-gray-50">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Skriv din fråga här..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIChat;
