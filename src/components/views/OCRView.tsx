
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Camera, Download, Save } from 'lucide-react';
import SmartUploadArea from '../SmartUploadArea';
import { useToast } from '@/hooks/use-toast';
import { OCRService } from '../../services/ocrService';

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

const OCRView = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [editedText, setEditedText] = useState('');
  const { toast } = useToast();

  const handleExtractText = async () => {
    if (files.length === 0) {
      toast({
        title: "Ingen bild uppladdad",
        description: "Vänligen ladda upp en bild för textextraktion.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const text = await OCRService.processDocument(files[0].file);
      setExtractedText(text);
      setEditedText(text);
      
      toast({
        title: "Text extraherad",
        description: "Texten har extraherats från bilden framgångsrikt."
      });
    } catch (error) {
      console.error('OCR error:', error);
      toast({
        title: "Extraktion misslyckades",
        description: "Ett fel uppstod vid textextraktionen. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAsPDF = () => {
    if (!editedText.trim()) {
      toast({
        title: "Ingen text att spara",
        description: "Vänligen extrahera text först.",
        variant: "destructive"
      });
      return;
    }

    // Create a simple PDF download (in a real implementation, you'd use a PDF library)
    const element = document.createElement('a');
    const file = new Blob([editedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `extraherad-text-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    toast({
      title: "Fil sparad",
      description: "Texten har sparats som en textfil."
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Bild till Text</h2>
        <p className="text-gray-600">
          Ladda upp en bild och extrahera text med OCR-teknik
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SmartUploadArea 
            onFilesChange={setFiles}
            maxFiles={1}
            acceptedTypes={['image/*']}
            title="Ladda upp en bild"
          />

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Bildbehandling</h3>
            <Button 
              onClick={handleExtractText}
              disabled={isProcessing || files.length === 0}
              className="w-full mb-4"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extraherar text...
                </>
              ) : (
                <>
                  <Camera className="mr-2 h-4 w-4" />
                  Extrahera text från bild
                </>
              )}
            </Button>

            {extractedText && (
              <Button 
                onClick={handleSaveAsPDF}
                variant="outline"
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Spara som textfil
              </Button>
            )}
          </Card>

          {files.length > 0 && files[0].preview && (
            <Card className="p-4">
              <h4 className="font-medium mb-2">Förhandsvisning</h4>
              <img 
                src={files[0].preview} 
                alt="Uploaded image" 
                className="w-full h-auto rounded-lg border"
              />
            </Card>
          )}
        </div>

        <div>
          <Card className="p-6 h-full">
            <h3 className="font-semibold mb-4">Extraherad text</h3>
            {extractedText ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Redigera text (valfritt)
                  </label>
                  <Textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={15}
                    className="w-full"
                    placeholder="Extraherad text kommer att visas här..."
                  />
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <Camera className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>Extraherad text kommer att visas här efter bearbetning</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OCRView;
