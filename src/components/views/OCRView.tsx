
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Camera, Download } from 'lucide-react';
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
    <div className="min-h-screen bg-background">
      <div className="professional-container section-spacing">
        <div className="text-center mb-16 animate-professional-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary rounded-xl mb-6 shadow-professional-md">
            <Camera className="h-8 w-8 text-secondary-foreground" />
          </div>
          <h1 className="text-hero font-heading mb-4 legal-gradient">
            Bild till Text
          </h1>
          <p className="text-subtitle max-w-2xl mx-auto">
            Extrahera text från bilder och dokument med avancerad OCR-teknik
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8 animate-professional-slide-in">
            <SmartUploadArea 
              onFilesChange={setFiles}
              maxFiles={1}
              acceptedTypes={['image/*']}
              title="Ladda upp en bild"
            />

            <Card className="premium-card p-8">
              <h3 className="text-title font-heading mb-6">
                Bildbehandling
              </h3>
              <Button 
                onClick={handleExtractText}
                disabled={isProcessing || files.length === 0}
                className="professional-button-primary w-full mb-6"
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
                  className="professional-button-outline w-full"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Spara som textfil
                </Button>
              )}
            </Card>

            {files.length > 0 && files[0].preview && (
              <Card className="premium-card p-6 animate-professional-scale-in">
                <h4 className="text-xl font-heading mb-4">
                  Förhandsvisning
                </h4>
                <img 
                  src={files[0].preview} 
                  alt="Uploaded image" 
                  className="w-full h-auto rounded-lg border border-border shadow-professional"
                />
              </Card>
            )}
          </div>

          <div className="animate-professional-slide-in" style={{ animationDelay: '0.1s' }}>
            <Card className="premium-card p-8 h-full">
              <h3 className="text-title font-heading mb-6">
                Extraherad text
              </h3>
              {extractedText ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-caption mb-4">
                      Redigera text (valfritt)
                    </label>
                    <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={20}
                      className="premium-textarea w-full"
                      placeholder="Extraherad text kommer att visas här..."
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-20">
                  <Camera className="mx-auto h-16 w-16 text-muted-foreground/30 mb-6" />
                  <p className="text-body">
                    Extraherad text kommer att visas här efter bearbetning
                  </p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OCRView;
