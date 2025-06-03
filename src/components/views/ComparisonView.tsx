
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Scale } from 'lucide-react';
import SmartUploadArea from '../SmartUploadArea';
import { useToast } from '@/hooks/use-toast';
import { LexigoEngine } from '../../services/lexigoEngine';

interface UploadedFile {
  file: File;
  id: string;
  preview?: string;
}

const ComparisonView = () => {
  const [filesA, setFilesA] = useState<UploadedFile[]>([]);
  const [filesB, setFilesB] = useState<UploadedFile[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<string>('');
  const { toast } = useToast();

  const handleCompare = async () => {
    if (filesA.length === 0 || filesB.length === 0) {
      toast({
        title: "Ofullständig uppladdning",
        description: "Vänligen ladda upp ett dokument i varje område för jämförelse.",
        variant: "destructive"
      });
      return;
    }

    setIsComparing(true);
    try {
      // Process both documents
      const docA = await LexigoEngine.processDocumentWithOCR(filesA[0].file);
      const docB = await LexigoEngine.processDocumentWithOCR(filesB[0].file);

      // Create comparison instruction
      const comparisonInstruction = `Jämför dessa två dokument och identifiera:
1. Viktiga skillnader mellan dokumenten
2. Juridiska styrkor och svagheter i varje dokument
3. Potentiella konflikter eller motsägelser
4. Rekommendationer baserat på svensk lag

DOKUMENT A: ${docA.content.substring(0, 1000)}...
DOKUMENT B: ${docB.content.substring(0, 1000)}...`;

      const analysis = await LexigoEngine.answerLegalQuestionWithAnalysis(
        comparisonInstruction,
        'administrative_law' as any,
        `${docA.content}\n\n--- JÄMFÖRELSE ---\n\n${docB.content}`
      );

      setComparisonResult(`
JÄMFÖRELSERESULTAT

${analysis.advice.answer}

REKOMMENDERADE ÅTGÄRDER:
${analysis.advice.practical_steps?.map(step => `• ${step}`).join('\n') || 'Inga specifika åtgärder rekommenderade.'}

VIKTIGA OBSERVATIONER:
${analysis.advice.warnings?.map(warning => `⚠️ ${warning}`).join('\n') || 'Inga kritiska observationer.'}

UPPFÖLJNING:
${analysis.advice.follow_up_questions?.map(q => `? ${q}`).join('\n') || 'Inga uppföljningsfrågor.'}
      `);

      toast({
        title: "Jämförelse slutförd",
        description: "Dokumenten har jämförts framgångsrikt."
      });
    } catch (error) {
      console.error('Comparison error:', error);
      toast({
        title: "Jämförelse misslyckades",
        description: "Ett fel uppstod vid jämförelsen. Försök igen.",
        variant: "destructive"
      });
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dokumentjämförelse</h2>
        <p className="text-gray-600">
          Jämför två dokument och hitta skillnader, svagheter och juridiska konflikter
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-4 text-blue-600">Dokument A</h3>
          <SmartUploadArea 
            onFilesChange={setFilesA}
            maxFiles={1}
            title="Ladda upp första dokumentet"
          />
        </div>

        <div>
          <h3 className="font-semibold mb-4 text-green-600">Dokument B</h3>
          <SmartUploadArea 
            onFilesChange={setFilesB}
            maxFiles={1}
            title="Ladda upp andra dokumentet"
          />
        </div>
      </div>

      <div className="text-center mb-6">
        <Button 
          onClick={handleCompare}
          disabled={isComparing || filesA.length === 0 || filesB.length === 0}
          size="lg"
          className="bg-purple-600 hover:bg-purple-700"
        >
          {isComparing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Jämför dokument...
            </>
          ) : (
            <>
              <Scale className="mr-2 h-5 w-5" />
              Jämför dokument
            </>
          )}
        </Button>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Jämförelseresultat</h3>
        {comparisonResult ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-800">
              {comparisonResult}
            </pre>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <Scale className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>Jämförelseresultat kommer att visas här efter bearbetning</p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ComparisonView;
