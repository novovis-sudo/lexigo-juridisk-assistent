
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, X, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploaderProps {
  onDocumentProcessed: (text: string, filename: string) => void;
  onDocumentCleared?: () => void;
  className?: string;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ 
  onDocumentProcessed, 
  onDocumentCleared,
  className = '' 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDocument, setProcessedDocument] = useState<string | null>(null);
  const [documentName, setDocumentName] = useState<string>('');
  const { toast } = useToast();

  const processFile = async (file: File): Promise<string> => {
    // Simulera dokumentbearbetning
    setIsProcessing(true);
    
    try {
      if (file.type === 'text/plain') {
        const text = await file.text();
        return text;
      } else if (file.type === 'application/pdf') {
        // I produktion skulle detta använda PDF.js eller liknande
        return `[PDF-dokument: ${file.name}]\n\nDokumentinnehåll extraherat från PDF-fil. I en produktionsmiljö skulle detta innehålla den faktiska texten från PDF:en.`;
      } else if (file.type.startsWith('image/')) {
        // I produktion skulle detta använda OCR
        return `[Bild: ${file.name}]\n\nText extraherad från bild med OCR. I en produktionsmiljö skulle detta innehålla den faktiska texten från bilden.`;
      } else {
        throw new Error('Filformat stöds inte');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const extractedText = await processFile(file);
      setProcessedDocument(extractedText);
      setDocumentName(file.name);
      onDocumentProcessed(extractedText, file.name);
      
      toast({
        title: "Dokument laddat",
        description: `${file.name} har bearbetats framgångsrikt.`
      });
    } catch (error) {
      console.error('Fel vid dokumentbearbetning:', error);
      toast({
        title: "Bearbetningsfel",
        description: "Kunde inte bearbeta dokumentet. Försök med ett annat format.",
        variant: "destructive"
      });
    }
  }, [onDocumentProcessed, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const clearDocument = () => {
    setProcessedDocument(null);
    setDocumentName('');
    if (onDocumentCleared) {
      onDocumentCleared();
    }
  };

  if (processedDocument) {
    return (
      <Card className={`${className} border-green-200 bg-green-50`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Dokument laddat</p>
                <p className="text-sm text-green-600">{documentName}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={clearDocument}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-200'} transition-colors`}>
      <CardContent className="p-6">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-blue-300 hover:bg-blue-50'
          }`}
        >
          <input {...getInputProps()} />
          
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-sm text-gray-600">Bearbetar dokument...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-full">
                {isDragActive ? (
                  <Upload className="h-6 w-6 text-blue-600" />
                ) : (
                  <FileText className="h-6 w-6 text-blue-600" />
                )}
              </div>
              
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isDragActive ? 'Släpp dokumentet här' : 'Ladda upp juridiskt dokument'}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Dra och släpp eller klicka för att välja
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Stöder PDF, TXT och bildformat (PNG, JPG)
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUploader;
