
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
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f11] via-[#151517] to-[#1a1a1d] relative">
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
           }}>
      </div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-16 space-y-12">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl mb-8 accent-glow">
            <Camera className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-5xl font-serif font-semibold text-white mb-6 tracking-tight text-gradient">
            Bild till Text
          </h2>
          <p className="text-xl text-dark-300 font-sans max-w-3xl mx-auto leading-relaxed">
            Ladda upp en bild och extrahera text med OCR-teknik
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <SmartUploadArea 
              onFilesChange={setFiles}
              maxFiles={1}
              acceptedTypes={['image/*']}
              title="Ladda upp en bild"
            />

            <Card className="premium-card p-10">
              <h3 className="text-2xl font-serif font-semibold text-white mb-8">
                Bildbehandling
              </h3>
              <Button 
                onClick={handleExtractText}
                disabled={isProcessing || files.length === 0}
                className="premium-button w-full text-lg py-4 mb-8"
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
                  className="w-full border-accent-500/30 text-accent-300 hover:bg-accent-600/10 hover:border-accent-400 py-3 transition-all duration-200"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Spara som textfil
                </Button>
              )}
            </Card>

            {files.length > 0 && files[0].preview && (
              <Card className="premium-card p-8">
                <h4 className="text-xl font-serif font-medium text-white mb-6">
                  Förhandsvisning
                </h4>
                <img 
                  src={files[0].preview} 
                  alt="Uploaded image" 
                  className="w-full h-auto rounded-xl border border-[#232329] premium-shadow"
                />
              </Card>
            )}
          </div>

          <div>
            <Card className="premium-card p-10 h-full">
              <h3 className="text-2xl font-serif font-semibold text-white mb-8">
                Extraherad text
              </h3>
              {extractedText ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-dark-300 mb-4 font-sans">
                      Redigera text (valfritt)
                    </label>
                    <Textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      rows={18}
                      className="premium-input w-full font-sans text-base"
                      placeholder="Extraherad text kommer att visas här..."
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center text-dark-400 py-24">
                  <Camera className="mx-auto h-20 w-20 text-dark-500 mb-8" />
                  <p className="text-lg font-sans">
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
