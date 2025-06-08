
import React, { useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot } from 'lucide-react';
import { EnhancedLexigoChatProps } from './types/chatTypes';
import { useLexigoChat } from './hooks/useLexigoChat';
import ChatHeader from './components/ChatHeader';
import DocumentInput from './components/DocumentInput';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';

const EnhancedLexigoChat: React.FC<EnhancedLexigoChatProps> = ({ onNavigate }) => {
  const {
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
  } = useLexigoChat();

  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full max-h-[800px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <ChatHeader />

      {/* Document Input Section */}
      {showDocumentInput && (
        <DocumentInput
          documentText={documentText}
          setDocumentText={setDocumentText}
          onAnalyze={() => handleAnalysisRequest('full')}
          onClose={() => setShowDocumentInput(false)}
          isAnalyzing={isAnalyzing}
        />
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              onSuggestionClick={handleSuggestionClick}
              isAnalyzing={isAnalyzing}
            />
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
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={handleSendMessage}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

export default EnhancedLexigoChat;
