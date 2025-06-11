
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
    <div className="min-h-screen bg-background">
      <div className="professional-container section-spacing">
        <div className="text-center mb-16 animate-professional-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-xl mb-6 shadow-professional-md">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-hero font-heading mb-4 legal-gradient">
            Dokumentanalys
          </h1>
          <p className="text-subtitle max-w-2xl mx-auto">
            Ladda upp juridiska dokument och få professionell AI-analys baserad på svensk lagstiftning
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 content-spacing">
          <div className="space-y-8 animate-professional-slide-in">
            <SmartUploadArea 
              onFilesChange={setFiles}
              maxFiles={3}
              title="Ladda upp dokument för analys"
            />

            <Card className="premium-card p-8">
              <h3 className="text-title font-heading mb-6">
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
                className="premium-textarea mb-6"
              />
              <Button 
                onClick={handleAnalyze}
                disabled={isProcessing || files.length === 0 || !instruction.trim()}
                className="professional-button-primary w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyserar dokument...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Starta analys
                  </>
                )}
              </Button>
            </Card>
          </div>

          <div className="animate-professional-slide-in" style={{ animationDelay: '0.1s' }}>
            <Card className="premium-card p-8 h-full min-h-[600px]">
              <h3 className="text-title font-heading mb-6">
                Analysresultat
              </h3>
              {result ? (
                <div className="bg-muted border border-border p-6 rounded-lg">
                  <pre className="whitespace-pre-wrap text-body text-foreground leading-relaxed">
                    {result}
                  </pre>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-20">
                  <FileText className="mx-auto h-16 w-16 text-muted-foreground/30 mb-6" />
                  <p className="text-body">
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
