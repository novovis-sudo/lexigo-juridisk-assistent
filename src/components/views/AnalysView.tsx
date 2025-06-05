
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
            <FileText className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-5xl font-serif font-semibold text-white mb-6 tracking-tight text-gradient">
            Dokumentanalys
          </h2>
          <p className="text-xl text-dark-300 font-sans max-w-3xl mx-auto leading-relaxed">
            Ladda upp dokument och beskriv vad du vill att AI:n ska göra
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <SmartUploadArea 
              onFilesChange={setFiles}
              maxFiles={3}
              title="Ladda upp dokument för analys"
            />

            <Card className="premium-card p-10">
              <h3 className="text-2xl font-serif font-semibold text-white mb-8">
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
                className="premium-input mb-8 font-sans text-base"
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
            <Card className="premium-card p-10 h-full min-h-[700px]">
              <h3 className="text-2xl font-serif font-semibold text-white mb-8">
                Analysresultat
              </h3>
              {result ? (
                <div className="bg-[#1a1a1d] border border-[#232329] p-8 rounded-xl">
                  <pre className="whitespace-pre-wrap text-sm text-dark-200 font-sans leading-relaxed">
                    {result}
                  </pre>
                </div>
              ) : (
                <div className="text-center text-dark-400 py-24">
                  <FileText className="mx-auto h-20 w-20 text-dark-500 mb-8" />
                  <p className="text-lg font-sans">
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
