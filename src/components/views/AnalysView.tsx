
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Send, FileText } from 'lucide-react';
import SmartUploadArea from '../SmartUploadArea';
import { useToast } from '@/hooks/use-toast';
import { LexigoEngine } from '../../services/lexigoEngine';

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

const AnalysView = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string>('');
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast({
        title: "Ingen fil uppladdad",
        description: "Vänligen ladda upp minst en fil för analys.",
        variant: "destructive"
      });
      return;
    }

    if (!instruction.trim()) {
      toast({
        title: "Ingen instruktion",
        description: "Vänligen beskriv vad du vill att AI:n ska göra.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Process the first file for now
      const document = await LexigoEngine.processDocumentWithOCR(files[0].file);
      
      const analysis = await LexigoEngine.answerLegalQuestionWithAnalysis(
        instruction,
        'administrative_law' as any,
        document.content,
        document.id
      );

      setResult(`
ANALYS RESULTAT:

${analysis.advice.answer}

VIKTIGA PUNKTER:
${analysis.advice.practical_steps?.map(step => `• ${step}`).join('\n') || 'Inga specifika steg identifierade.'}

VARNINGAR:
${analysis.advice.warnings?.map(warning => `⚠️ ${warning}`).join('\n') || 'Inga varningar.'}

UPPFÖLJNINGSFRÅGOR:
${analysis.advice.follow_up_questions?.map(q => `? ${q}`).join('\n') || 'Inga uppföljningsfrågor.'}
      `);

      toast({
        title: "Analys slutförd",
        description: "Dokumentet har analyserats framgångsrikt."
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analys misslyckades",
        description: "Ett fel uppstod vid analysen. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-parchment-50 via-parchment-100 to-parchment-200 relative">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-30 wood-texture pointer-events-none"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-12 space-y-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-xl mb-6 shadow-gold-glow">
            <FileText className="h-8 w-8 text-ebony-950" />
          </div>
          <h2 className="text-4xl font-serif font-semibold text-ebony-950 mb-4 tracking-tight">
            Dokumentanalys
          </h2>
          <p className="text-lg text-charcoal-600 font-legal max-w-2xl mx-auto">
            Ladda upp dokument och beskriv vad du vill att AI:n ska göra
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <SmartUploadArea 
              onFilesChange={setFiles}
              maxFiles={3}
              title="Ladda upp dokument för analys"
            />

            <Card className="premium-card p-8">
              <h3 className="text-xl font-serif font-semibold text-ebony-950 mb-6">
                Instruktioner till AI
              </h3>
              <Textarea
                placeholder="Beskriv vad du vill att AI:n ska göra, t.ex:
• Analysera dokumentet och ge motargument
• Hitta juridiska brister i texten
• Sammanfatta de viktigaste punkterna
• Föreslå nästa steg i processen"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
                rows={8}
                className="premium-input mb-6 font-legal text-base"
              />
              <Button 
                onClick={handleAnalyze}
                disabled={isProcessing || files.length === 0 || !instruction.trim()}
                className="premium-button w-full text-lg py-4"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Analyserar dokument...
                  </>
                ) : (
                  <>
                    <Send className="mr-3 h-5 w-5" />
                    Starta analys
                  </>
                )}
              </Button>
            </Card>
          </div>

          <div>
            <Card className="premium-card p-8 h-full min-h-[600px]">
              <h3 className="text-xl font-serif font-semibold text-ebony-950 mb-6">
                Analysresultat
              </h3>
              {result ? (
                <div className="bg-parchment-100 border border-parchment-300 p-6 rounded-xl">
                  <pre className="whitespace-pre-wrap text-sm text-ebony-950 font-legal leading-relaxed">
                    {result}
                  </pre>
                </div>
              ) : (
                <div className="text-center text-charcoal-500 py-20">
                  <FileText className="mx-auto h-16 w-16 text-charcoal-300 mb-6" />
                  <p className="text-lg font-legal">
                    Analysresultat kommer att visas här efter bearbetning
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

export default AnalysView;
