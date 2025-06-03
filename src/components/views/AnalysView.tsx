
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Send } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dokumentanalys</h2>
        <p className="text-gray-600">
          Ladda upp dokument och beskriv vad du vill att AI:n ska göra
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <SmartUploadArea 
            onFilesChange={setFiles}
            maxFiles={3}
            title="Ladda upp dokument för analys"
          />

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Instruktioner till AI</h3>
            <Textarea
              placeholder="Beskriv vad du vill att AI:n ska göra, t.ex:
• Analysera dokumentet och ge motargument
• Hitta juridiska brister i texten
• Sammanfatta de viktigaste punkterna
• Föreslå nästa steg i processen"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={6}
              className="mb-4"
            />
            <Button 
              onClick={handleAnalyze}
              disabled={isProcessing || files.length === 0 || !instruction.trim()}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyserar...
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

        <div>
          <Card className="p-6 h-full">
            <h3 className="font-semibold mb-4">Analysresultat</h3>
            {result ? (
              <div className="bg-gray-50 p-4 rounded-lg">
                <pre className="whitespace-pre-wrap text-sm text-gray-800">
                  {result}
                </pre>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <p>Analysresultat kommer att visas här efter bearbetning</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysView;
