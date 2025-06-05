
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
    <div className="min-h-screen bg-gradient-to-br from-parchment-50 via-parchment-100 to-parchment-200 relative">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-30 wood-texture pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12 space-y-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl mb-6 shadow-gold-glow">
            <Camera className="h-8 w-8 text-ebony-950" />
          </div>
          <h2 className="text-4xl font-serif font-semibold text-ebony-950 mb-4 tracking-tight">
            Bild till Text
          </h2>
          <p className="text-lg text-charcoal-600 font-legal max-w-2xl mx-auto">
            Ladda upp en bild och extrahera text med OCR-teknik
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <SmartUploadArea 
              onFilesChange={setFiles}
              maxFiles={1}
              acceptedTypes={['image/*']}
              title="Ladda upp en bild"
            />

            <Card className="premium-card p-8">
              <h3 className="text-xl font-serif font-semibold text-ebony-950 mb-6">
                Bildbehandling
              </h3>
              <Button 
                onClick={handleExtractText}
                disabled={isProcessing || files.length === 0}
                className="premium-button w-full text-lg py-4 mb-6"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Extraherar text...
                  </>
                ) : (
                  <>
                    <Camera className="mr-3 h-5 w-5" />
                    Extrahera text från bild
                  </>
                )}
              </Button>

              {extractedText && (
                <Button 
                  onClick={handleSaveAsPDF}
                  variant="outline"
                  className="w-full border-gold-600 text-gold-700 hover:bg-gold-50 py-3"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Spara som textfil
                </Button>
              )}
            </Card>

            {files.length > 0 && files[0].preview && (
              <Card className="premium-card p-6">
                <h4 className="text-lg font-serif font-medium text-ebony-950 mb-4">
                  Förhandsvisning
                </h4>
                <img 
                  src={files[0].preview} 
                  alt="Uploaded image" 
                  className="w-full h-auto rounded-lg border border-parchment-300 shadow-soft"
                />
              </Card>
            )}
          </div>

          <div>
            <Card className="premium-card p-8 h-full">
              <h3 className="text-xl font-serif font-semibold text-ebony-950 mb-6">
                Extraherad text
              </h3>
              {extractedText ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal-700 mb-3">
                      Redigera text (valfritt)
                    </label>
                    <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={18}
                      className="premium-input w-full font-legal text-base"
                      placeholder="Extraherad text kommer att visas här..."
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center text-charcoal-500 py-20">
                  <Camera className="mx-auto h-16 w-16 text-charcoal-300 mb-6" />
                  <p className="text-lg font-legal">
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
