
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bot, User } from 'lucide-react';
import { Message } from '../types/chatTypes';
import AnalysisResults from './AnalysisResults';

interface ChatMessageProps {
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
  isAnalyzing: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onSuggestionClick, isAnalyzing }) => {
  return (
    <div className="space-y-3">
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
            <AnalysisResults analysis={message.analysis} />
          )}

          {/* Suggestions */}
          {message.suggestions && message.suggestions.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {message.suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => onSuggestionClick(suggestion)}
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
  );
};

export default ChatMessage;
