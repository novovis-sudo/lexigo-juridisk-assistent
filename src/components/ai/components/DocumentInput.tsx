
import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

interface DocumentInputProps {
  documentText: string;
  setDocumentText: (text: string) => void;
  onAnalyze: () => void;
  onClose: () => void;
  isAnalyzing: boolean;
}

const DocumentInput: React.FC<DocumentInputProps> = ({
  documentText,
  setDocumentText,
  onAnalyze,
  onClose,
  isAnalyzing
}) => {
  return (
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
            onClick={onAnalyze}
            disabled={!documentText.trim() || isAnalyzing}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Fullständig analys
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={onClose}
          >
            Stäng
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentInput;
